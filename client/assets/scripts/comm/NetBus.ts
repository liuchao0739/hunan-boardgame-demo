type Handler = (body: any, raw: PlatformMsg) => void;

export type PlatformMsg = {
  v: number;
  ns: string;
  cmd: string;
  reqId?: number;
  body?: any;
};

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

  putServerAddr(addr: string): this {
    this.serverAddr = addr;
    return this;
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
      // 上次卡在 CONNECTING：先关掉再连
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
      let url: string;
      if (addr.startsWith('ws://') || addr.startsWith('wss://')) {
        url = addr.includes('/websocket') ? addr : `${addr.replace(/\/$/, '')}/websocket`;
      } else if (addr.includes('/websocket')) {
        const useWss = typeof location !== 'undefined' && location.protocol === 'https:';
        url = `${useWss ? 'wss' : 'ws'}://${addr}`;
      } else {
        const useWss = typeof location !== 'undefined' && location.protocol === 'https:';
        url = `${useWss ? 'wss' : 'ws'}://${addr}/websocket`;
      }
      // HTTPS 同域优先走当前 host，避免 Clash fake-ip 把域名指歪
      try {
        if (typeof location !== 'undefined' && location.protocol === 'https:' && location.hostname) {
          const host = location.hostname.toLowerCase();
          if (host.endsWith('xiandan.me')) {
            url = `wss://${location.host}/websocket`;
          }
        }
      } catch { /* */ }
      console.log('[NetBus] connect', url);
      let settled = false;
      const finish = (ok: boolean, err?: unknown) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (ok) resolve();
        else reject(err ?? new Error('ws connect failed'));
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
        if (!settled) finish(false, new Error('ws closed'));
      };
      this.ws.onmessage = (ev) => this.onMessage(ev.data);
    });
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

  createRoom(gameId = 'changsha_mj', rules?: any) {
    return this.request('platform', 'createRoom', { gameId, rules });
  }

  joinRoom(roomId: number) {
    return this.request('platform', 'joinRoom', { roomId });
  }

  prepare(yes = true) {
    return this.request('platform', 'prepare', { yes });
  }

  sync() {
    return this.request('platform', 'sync', {});
  }

  leave() {
    return this.request('platform', 'leave', {});
  }

  gameAction(cmd: string, body: any = {}) {
    return this.request('changsha_mj', cmd, body);
  }
}
