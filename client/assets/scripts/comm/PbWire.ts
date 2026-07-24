/**
 * Minimal protobuf3 wire helpers (sint32 / string / bool) for Weihai MsgBus.
 */
export class PbWire {
  static zigzagEncode(n: number): number {
    return n >= 0 ? n * 2 : -n * 2 - 1;
  }
  static zigzagDecode(n: number): number {
    return (n & 1) ? -(n >> 1) - 1 : (n >> 1);
  }
  static encodeVarint(n: number): number[] {
    const out: number[] = [];
    n = n >>> 0;
    while (n >= 0x80) {
      out.push((n & 0x7f) | 0x80);
      n >>>= 7;
    }
    out.push(n);
    return out;
  }
  static decodeVarint(buf: Uint8Array, i: { v: number }): number {
    let result = 0, shift = 0;
    while (true) {
      const b = buf[i.v++];
      result |= (b & 0x7f) << shift;
      if ((b & 0x80) === 0) return result >>> 0;
      shift += 7;
    }
  }
  static key(field: number, wt: number): number[] {
    return this.encodeVarint((field << 3) | wt);
  }
  static encodeSint32(field: number, v: number): Uint8Array {
    return Uint8Array.from([...this.key(field, 0), ...this.encodeVarint(this.zigzagEncode(v))]);
  }
  static encodeString(field: number, s: string): Uint8Array {
    const enc = new TextEncoder().encode(s || '');
    return Uint8Array.from([...this.key(field, 2), ...this.encodeVarint(enc.length), ...enc]);
  }
  static concat(...parts: Uint8Array[]): Uint8Array {
    const len = parts.reduce((a, p) => a + p.length, 0);
    const out = new Uint8Array(len);
    let o = 0;
    for (const p of parts) { out.set(p, o); o += p.length; }
    return out;
  }
  static decode(buf: Uint8Array): Map<number, Array<{ kind: string; raw: number | Uint8Array }>> {
    const fields = new Map<number, Array<{ kind: string; raw: number | Uint8Array }>>();
    const i = { v: 0 };
    while (i.v < buf.length) {
      const tag = this.decodeVarint(buf, i);
      const field = tag >>> 3;
      const wt = tag & 7;
      const arr = fields.get(field) || [];
      if (wt === 0) {
        arr.push({ kind: 'varint', raw: this.decodeVarint(buf, i) });
      } else if (wt === 2) {
        const len = this.decodeVarint(buf, i);
        arr.push({ kind: 'bytes', raw: buf.subarray(i.v, i.v + len) });
        i.v += len;
      } else {
        throw new Error('unsupported wt ' + wt);
      }
      fields.set(field, arr);
    }
    return fields;
  }
  static getSint32(f: Map<number, any[]>, field: number, d = 0): number {
    const a = f.get(field)?.[0];
    return a ? this.zigzagDecode(a.raw as number) : d;
  }
  static getString(f: Map<number, any[]>, field: number, d = ''): string {
    const a = f.get(field)?.[0];
    if (!a) return d;
    return new TextDecoder().decode(a.raw as Uint8Array);
  }
}

export const MsgCode = {
  UserLoginCmd: 101,
  UserLoginResult: 102,
  GetMyDetailzCmd: 201,
  GetMyDetailzResult: 202,
  GetJoinedRoomIdCmd: 203,
  GetJoinedRoomIdResult: 204,
  CreateRoomCmd: 205,
  CreateRoomResult: 206,
  JoinRoomCmd: 207,
  JoinRoomResult: 208,
  GetJoinedClubListCmd: 301,
  GetJoinedClubListResult: 302,
  CreateClubCmd: 303,
  CreateClubResult: 304,
  JoinClubCmd: 305,
  JoinClubResult: 306,
  GetClubDetailzCmd: 307,
  GetClubDetailzResult: 308,
  GetTableListCmd: 311,
  GetTableListResult: 312,
  GetRecordListCmd: 501,
  GetRecordListResult: 502,
  GetRecordDetailzCmd: 503,
  GetRecordDetailzResult: 504,
  SyncRoomDataCmd: 1015,
  PrepareCmd: 1021,
  PrepareResult: 1022,
  PrepareBroadcast: 1023,
  OfficialStartBroadcast: 1026,
  RoundStartedBroadcast: 1031,
  MahjongInHandChangedResult: 1032,
  MahjongMoPaiResult: 1034,
  RedirectActUserIdBroadcast: 1036,
  MahjongChuPaiCmd: 1038,
  MahjongChuPaiResult: 1039,
  MahjongChuPaiBroadcast: 1040,
  MahjongPengCmd: 1045,
  MahjongPengResult: 1046,
  MahjongPengBroadcast: 1047,
  MahjongHuCmd: 1058,
  MahjongHuOrZiMoResult: 1059,
  MahjongHuOrZiMoBroadcast: 1060,
  MahjongGuoCmd: 1061,
  RoundSettlementBroadcast: 1064,
  RoomSettlementBroadcast: 1065,
  MahjongLiangFengCmd: 1066,
  MahjongLiangFengResult: 1067,
  MahjongLiangFengBroadcast: 1068,
  MahjongBuFengCmd: 1069,
  MahjongBuFengResult: 1070,
  MahjongBuFengBroadcast: 1071,
} as const;
