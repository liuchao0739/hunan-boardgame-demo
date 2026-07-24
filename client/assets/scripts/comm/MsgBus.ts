import { PbWire, MsgCode } from './PbWire';

type Handler = (body: Uint8Array) => void;

/**
 * Weihai MsgBus — wire-compatible with Java proxyserver (:20480).
 * Frame: uint16be(2+bodyLen) + uint16be(msgCode) + protobuf body
 */
export class MsgBus {
  private static _ins: MsgBus;
  static get ins(): MsgBus {
    if (!this._ins) this._ins = new MsgBus();
    return this._ins;
  }

  private ws: WebSocket | null = null;
  private handlers = new Map<number, Handler[]>();
  serverAddr = '127.0.0.1:20480';

  putServerAddr(addr: string): this {
    this.serverAddr = addr;
    return this;
  }

  /** Parse ?serverAddr= from URL (browser preview / build). */
  static readServerAddrFromUrl(fallback = '127.0.0.1:20480'): string {
    try {
      if (typeof window !== 'undefined' && window.location) {
        const u = new URL(window.location.href);
        return u.searchParams.get('serverAddr') || fallback;
      }
    } catch { /* ignore */ }
    return fallback;
  }

  on(code: number, fn: Handler): void {
    const arr = this.handlers.get(code) || [];
    arr.push(fn);
    this.handlers.set(code, arr);
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = `ws://${this.serverAddr}/websocket`;
      console.log('[MsgBus] connect', url);
      this.ws = new WebSocket(url);
      this.ws.binaryType = 'arraybuffer';
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onmessage = (ev) => this.onMessage(ev.data);
    });
  }

  private onMessage(data: ArrayBuffer) {
    const buf = new Uint8Array(data);
    if (buf.length < 4) return;
    const code = (buf[2] << 8) | buf[3];
    const body = buf.subarray(4);
    const list = this.handlers.get(code) || [];
    for (const h of list) h(body);
  }

  send(code: number, body: Uint8Array): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('[MsgBus] not connected');
      return;
    }
    const len = 2 + body.length;
    const out = new Uint8Array(4 + body.length);
    out[0] = (len >> 8) & 0xff;
    out[1] = len & 0xff;
    out[2] = (code >> 8) & 0xff;
    out[3] = code & 0xff;
    out.set(body, 4);
    this.ws.send(out);
  }

  sendUserLogin(loginMethod: number, property: Record<string, unknown>): void {
    const propertyStr = JSON.stringify(property);
    const body = PbWire.concat(
      PbWire.encodeSint32(1, loginMethod),
      PbWire.encodeString(2, propertyStr),
    );
    this.send(MsgCode.UserLoginCmd, body);
  }

  sendEmpty(code: number): void {
    this.send(code, new Uint8Array(0));
  }

  sendCreateRoom(gameType0 = 1, gameType1 = 1001): void {
    const body = PbWire.concat(
      PbWire.encodeSint32(1, gameType0),
      PbWire.encodeSint32(2, gameType1),
    );
    this.send(MsgCode.CreateRoomCmd, body);
  }

  sendJoinRoom(roomId: number): void {
    this.send(MsgCode.JoinRoomCmd, PbWire.encodeSint32(1, roomId));
  }

  sendPrepare(): void {
    this.sendEmpty(MsgCode.PrepareCmd);
  }

  sendChuPai(tile: number): void {
    this.send(MsgCode.MahjongChuPaiCmd, PbWire.encodeSint32(1, tile));
  }

  sendPeng(): void {
    this.sendEmpty(MsgCode.MahjongPengCmd);
  }

  sendLiangFeng(t0: number, t1: number, t2: number): void {
    this.send(MsgCode.MahjongLiangFengCmd, PbWire.concat(
      PbWire.encodeSint32(1, t0),
      PbWire.encodeSint32(2, t1),
      PbWire.encodeSint32(3, t2),
    ));
  }

  sendBuFeng(): void {
    this.sendEmpty(MsgCode.MahjongBuFengCmd);
  }

  sendHu(): void {
    this.sendEmpty(MsgCode.MahjongHuCmd);
  }

  sendCreateClub(clubName: string): void {
    this.send(MsgCode.CreateClubCmd, PbWire.encodeString(1, clubName));
  }

  sendJoinClub(clubId: number): void {
    this.send(MsgCode.JoinClubCmd, PbWire.encodeSint32(1, clubId));
  }

  sendGetJoinedClubList(): void {
    this.sendEmpty(MsgCode.GetJoinedClubListCmd);
  }

  sendGetRecordList(userId: number, clubId = 0, pageIndex = 0): void {
    this.send(MsgCode.GetRecordListCmd, PbWire.concat(
      PbWire.encodeSint32(1, userId),
      PbWire.encodeSint32(2, clubId),
      PbWire.encodeSint32(3, 1),
      PbWire.encodeSint32(4, 1001),
      PbWire.encodeSint32(5, pageIndex),
      PbWire.encodeSint32(6, 10),
    ));
  }

  sendGetRecordDetail(roomUUId: string): void {
    this.send(MsgCode.GetRecordDetailzCmd, PbWire.encodeString(1, roomUUId));
  }
}

export { MsgCode };
