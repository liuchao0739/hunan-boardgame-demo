type Handler = (body: any, raw: PlatformMsg) => void;

export type PlatformMsg = {
  v: number;
  ns: string;
  cmd: string;
  reqId?: number;
  body?: any;
};

export type ConnState = 'connected' | 'disconnected' | 'reconnecting' | 'network_poor';

type ConnListener = (state: ConnState, detail?: string) => void;

/**
 * 湘桌平台 NetBus — JSON 信封 WebSocket
 */
export class NetBus {
  private static _ins: NetBus;
  static get ins(): NetBus {
    if (!this._ins) this._ins = new NetBus();
    return this._ins;
  }

  private ws: WebSocket | null = null;
  private handlers = new Map<string, Handler[]>();
  private reqId = 1;
  private pending = new Map<number, { resolve: (m: PlatformMsg) => void; reject: (e: Error) => void }>();
  serverAddr = '127.0.0.1:20480';

  private connState: ConnState = 'disconnected';
  private connListeners = new Set<ConnListener>();
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private pongTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private intentionalClose = false;
  private missedPongs = 0;

  /** T032 心跳间隔（毫秒） */
  pingIntervalMs = 15000;
  pongTimeoutMs = 5000;

  putServerAddr(addr: string): this {
    this.serverAddr = addr;
    return this;
  }

  getConnState(): ConnState {
    return this.connState;
  }

  onConnState(fn: ConnListener): () => void {
    this.connListeners.add(fn);
    fn(this.connState);
    return () => this.connListeners.delete(fn);
  }

  private setConnState(state: ConnState, detail?: string) {
    if (this.connState === state && !detail) return;
    this.connState = state;
    for (const fn of this.connListeners) fn(state, detail);
  }

  static readServerAddrFromUrl(fallback = '127.0.0.1:20480'): string {
    try {
      if (typeof window !== 'undefined' && window.location) {
        const u = new URL(window.location.href);
        const q = u.searchParams.get('serverAddr');
        if (q) return q;
        const host = (u.hostname || '').toLowerCase();
        if (
          host === 'xiangzhuo.xiandan.me'
          || host === 'whmj.xiandan.me'
          || host === 'chaoren.xiandan.me'
        ) {
          return `wss://${host}/websocket`;
        }
        if (u.protocol === 'https:' && host && host !== 'localhost' && host !== '127.0.0.1') {
          return `wss://${host}/websocket`;
        }
      }
    } catch { /* ignore */ }
    return fallback;
  }

  private key(ns: string, cmd: string) {
    return `${ns}:${cmd}`;
  }

  on(ns: string, cmd: string, fn: Handler): () => void {
    const k = this.key(ns, cmd);
    const arr = this.handlers.get(k) || [];
    arr.push(fn);
    this.handlers.set(k, arr);
    return () => this.off(ns, cmd, fn);
  }

  off(ns: string, cmd: string, fn: Handler): void {
    const k = this.key(ns, cmd);
    const arr = this.handlers.get(k);
    if (!arr) return;
    const next = arr.filter((h) => h !== fn);
    if (next.length) this.handlers.set(k, next);
    else this.handlers.delete(k);
  }

  offAll(): void {
    this.handlers.clear();
    this.pending.clear();
  }

  isConnected(): boolean {
    return !!this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  private buildUrl(): string {
    const addr = (this.serverAddr || '').trim();
    if (addr.startsWith('ws://') || addr.startsWith('wss://')) {
      return addr.includes('/websocket') ? addr : `${addr.replace(/\/$/, '')}/websocket`;
    }
    if (addr.includes('/websocket')) {
      const useWss = typeof location !== 'undefined' && location.protocol === 'https:';
      return `${useWss ? 'wss' : 'ws'}://${addr}`;
    }
    const useWss = typeof location !== 'undefined' && location.protocol === 'https:';
    let url = `${useWss ? 'wss' : 'ws'}://${addr}/websocket`;
    try {
      if (typeof location !== 'undefined' && location.protocol === 'https:' && location.hostname) {
        const host = location.hostname.toLowerCase();
        if (host.endsWith('xiandan.me')) {
          url = `wss://${location.host}/websocket`;
        }
      }
    } catch { /* */ }
    return url;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const addr = (this.serverAddr || '').trim();
      if (!addr) {
        reject(new Error('invalid serverAddr'));
        return;
      }
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }
      if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.CLOSING)) {
        try {
          this.ws.onopen = null;
          this.ws.onerror = null;
          this.ws.onclose = null;
          this.ws.onmessage = null;
          this.ws.close();
        } catch { /* */ }
        this.ws = null;
      }
      const url = this.buildUrl();
      console.log('[NetBus] connect', url);
      let settled = false;
      const finish = (ok: boolean, err?: unknown) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (ok) {
          this.setConnState('connected');
          this.startKeepalive();
          resolve();
        } else {
          reject(err ?? new Error('ws connect failed'));
        }
      };
      const timer = setTimeout(() => {
        try { this.ws?.close(); } catch { /* */ }
        finish(false, new Error('connect timeout'));
      }, 12000);
      try {
        this.ws = new WebSocket(url);
      } catch (e) {
        finish(false, e);
        return;
      }
      this.ws.binaryType = 'arraybuffer';
      this.ws.onopen = () => finish(true);
      this.ws.onerror = () => finish(false, new Error('ws error'));
      this.ws.onclose = () => {
        this.stopKeepalive();
        if (!settled) finish(false, new Error('ws closed'));
        else this.handleDisconnect();
      };
      this.ws.onmessage = (ev) => this.onMessage(ev.data);
    });
  }

  /** T024：ticket 重连并恢复房间 snapshot */
  async reconnectWithTicket(ticket?: string): Promise<boolean> {
    const u = (globalThis as any).__HNQP__ || {};
    const t = ticket || u.ticket;
    if (!t) return false;
    this.intentionalClose = false;
    this.setConnState('reconnecting', '正在重连…');
    try {
      if (!this.isConnected()) {
        await this.connect();
      }
      const msg = await this.request('platform', 'reconnect', { ticket: t });
      if (msg.cmd === 'error') {
        this.setConnState('disconnected', msg.body?.message);
        return false;
      }
      const b = msg.body || {};
      u.userId = b.userId ?? u.userId;
      u.userName = b.userName ?? u.userName;
      u.ticket = t;
      (globalThis as any).__HNQP__ = u;
      this.missedPongs = 0;
      this.setConnState('connected');
      return true;
    } catch (e) {
      console.warn('[NetBus] reconnect fail', e);
      this.setConnState('disconnected', '重连失败');
      return false;
    }
  }

  private handleDisconnect() {
    if (this.intentionalClose) {
      this.setConnState('disconnected');
      return;
    }
    this.setConnState('reconnecting', '连接已断开');
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      void this.reconnectWithTicket().then((ok) => {
        if (!ok) {
          this.setConnState('network_poor', '网络不稳定，稍后重试…');
          this.reconnectTimer = setTimeout(() => void this.reconnectWithTicket(), 5000);
        }
      });
    }, 1500);
  }

  private stopKeepalive() {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
    if (this.pongTimer) {
      clearTimeout(this.pongTimer);
      this.pongTimer = null;
    }
  }

  /** T032 客户端定时 ping，超时判网络差 */
  startKeepalive() {
    this.stopKeepalive();
    this.missedPongs = 0;
    this.pingTimer = setInterval(() => void this.sendPing(), this.pingIntervalMs);
  }

  private async sendPing() {
    if (!this.isConnected()) return;
    try {
      if (this.pongTimer) clearTimeout(this.pongTimer);
      this.pongTimer = setTimeout(() => {
        this.missedPongs += 1;
        if (this.missedPongs >= 2) {
          this.setConnState('network_poor', '网络延迟较高');
        }
      }, this.pongTimeoutMs);
      const msg = await this.request('platform', 'ping', {});
      if (msg.cmd === 'pong' || msg.body?.ok) {
        this.missedPongs = 0;
        if (this.connState === 'network_poor') this.setConnState('connected');
        if (this.pongTimer) {
          clearTimeout(this.pongTimer);
          this.pongTimer = null;
        }
      }
    } catch {
      this.missedPongs += 1;
    }
  }

  disconnect() {
    this.intentionalClose = true;
    this.stopKeepalive();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    try { this.ws?.close(); } catch { /* */ }
    this.ws = null;
    this.setConnState('disconnected');
  }

  private onMessage(data: any) {
    let text: string;
    if (typeof data === 'string') text = data;
    else if (data instanceof ArrayBuffer) text = new TextDecoder().decode(data);
    else if (typeof Blob !== 'undefined' && data instanceof Blob) {
      void data.text().then((t) => this.onMessage(t));
      return;
    } else return;
    let msg: PlatformMsg;
    try {
      msg = JSON.parse(text);
    } catch {
      console.warn('[NetBus] bad json', text.slice(0, 80));
      return;
    }
    if (msg.ns === 'platform' && msg.cmd === 'kicked') {
      this.intentionalClose = true;
      this.setConnState('disconnected', msg.body?.message || '已在其他设备登录');
      try { this.ws?.close(); } catch { /* */ }
    }
    const rid = msg.reqId != null ? Number(msg.reqId) : null;
    if (rid != null && !Number.isNaN(rid) && this.pending.has(rid)) {
      const p = this.pending.get(rid)!;
      this.pending.delete(rid);
      p.resolve(msg);
    }
    const list = this.handlers.get(this.key(msg.ns, msg.cmd)) || [];
    for (const h of list) h(msg.body, msg);
    if (msg.cmd === 'state') {
      const any = this.handlers.get(this.key(msg.ns, '*')) || [];
      for (const h of any) h(msg.body, msg);
    }
  }

  send(ns: string, cmd: string, body: any = {}, wait = false): Promise<PlatformMsg> | void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('[NetBus] not connected');
      if (wait) return Promise.reject(new Error('not connected'));
      return;
    }
    const reqId = this.reqId++;
    const msg: PlatformMsg = { v: 1, ns, cmd, reqId, body };
    this.ws.send(JSON.stringify(msg));
    if (!wait) return;
    return new Promise((resolve, reject) => {
      this.pending.set(reqId, { resolve, reject });
      setTimeout(() => {
        if (this.pending.has(reqId)) {
          this.pending.delete(reqId);
          reject(new Error('request timeout'));
        }
      }, 8000);
    });
  }

  request(ns: string, cmd: string, body: any = {}): Promise<PlatformMsg> {
    return this.send(ns, cmd, body, true) as Promise<PlatformMsg>;
  }

  login(name: string) {
    return this.request('platform', 'login', { name });
  }

  register(name: string, password: string) {
    return this.request('platform', 'register', { name, password });
  }

  loginAccount(name: string, password: string) {
    return this.request('platform', 'login', { name, password, mode: 'account' });
  }

  guestLogin(deviceId?: string) {
    return this.request('platform', 'guestLogin', { deviceId: deviceId || NetBus.deviceId() });
  }

  static deviceId(): string {
    const key = 'xz_device_id';
    try {
      if (typeof localStorage !== 'undefined') {
        let id = localStorage.getItem(key);
        if (!id) {
          id = `dev-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
          localStorage.setItem(key, id);
        }
        return id;
      }
    } catch { /* ignore */ }
    return `dev-${Date.now()}`;
  }

  refreshTicket(ticket?: string) {
    const u = (globalThis as any).__HNQP__ || {};
    return this.request('platform', 'refreshTicket', { ticket: ticket || u.ticket });
  }

  getRecords(page = 1, pageSize = 20) {
    return this.request('platform', 'getRecords', { page, pageSize });
  }

  updateProfile(fields: { userName?: string; headImg?: string }) {
    return this.request('platform', 'updateProfile', fields);
  }

  createRoom(gameId = 'changsha_mj', rules?: any) {
    return this.request('platform', 'createRoom', { gameId, rules });
  }

  joinRoom(roomId: number, password?: string) {
    return this.request('platform', 'joinRoom', { roomId, password });
  }

  quickMatch(gameId = 'changsha_mj') {
    return this.request('platform', 'quickMatch', { gameId });
  }

  cancelMatch() {
    return this.request('platform', 'cancelMatch', {});
  }

  sendEmoji(emojiId: string | number, targetSeat?: number) {
    return this.request('platform', 'sendEmoji', { emojiId, targetSeat });
  }

  sendPhrase(phraseId: number) {
    return this.request('platform', 'sendPhrase', { phraseId });
  }

  kickPlayer(userId: number) {
    return this.request('platform', 'kickPlayer', { userId });
  }

  createClub(name: string) {
    return this.request('platform', 'createClub', { name });
  }

  joinClub(clubId: number) {
    return this.request('platform', 'joinClub', { clubId });
  }

  listClubs() {
    return this.request('platform', 'listClubs', {});
  }

  getBalance() {
    return this.request('platform', 'getBalance', {});
  }

  getLedger(page = 1, pageSize = 20) {
    return this.request('platform', 'getLedger', { page, pageSize });
  }

  shopList() {
    return this.request('platform', 'shopList', {});
  }

  exchangeDiamond(amount: number) {
    return this.request('platform', 'exchangeDiamond', { amount });
  }

  claimDailyGift() {
    return this.request('platform', 'claimDailyGift', {});
  }

  static copyToClipboard(text: string): boolean {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        void navigator.clipboard.writeText(text);
        return true;
      }
    } catch { /* ignore */ }
    try {
      if (typeof document !== 'undefined') {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok;
      }
    } catch { /* ignore */ }
    return false;
  }

  prepare(yes = true) {
    return this.request('platform', 'prepare', { yes });
  }

  setAutoPlay(yes: boolean) {
    return this.request('platform', 'autoPlay', { yes });
  }

  dissolveVote(agree: boolean, cancel = false) {
    return this.request('platform', 'dissolveVote', { agree, cancel });
  }

  sync() {
    return this.request('platform', 'sync', {});
  }

  leave() {
    return this.request('platform', 'leave', {});
  }

  gameAction(cmd: string, body: any = {}, gameId = 'changsha_mj') {
    return this.request(gameId, cmd, body);
  }
}
