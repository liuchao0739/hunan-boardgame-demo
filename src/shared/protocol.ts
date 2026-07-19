/** 客户端 ↔ 服务端协议与公共类型 */

export type GameType = "changsha_mj" | "shaoyang_phz";

export type ClientMessage =
  | { type: "create_room"; gameType: GameType; nick?: string }
  | { type: "join_room"; roomId: string; nick?: string }
  | { type: "ready" }
  | { type: "action"; action: string; tiles?: number[]; tile?: number }
  | { type: "fill_bots" }
  | { type: "ping" };

export type ServerMessage =
  | { type: "error"; message: string }
  | { type: "room_created"; roomId: string; seat: number; gameType: GameType }
  | { type: "joined"; roomId: string; seat: number; gameType: GameType }
  | { type: "pong" }
  | { type: "state"; state: PublicRoomState };

export interface SeatPublic {
  seat: number;
  nick: string;
  ready: boolean;
  isBot: boolean;
  handCount: number;
  melds: MeldPublic[];
  discards: number[];
  score: number;
  /** 仅自己可见：自己的手牌 */
  hand?: number[];
}

export interface MeldPublic {
  kind: string;
  tiles: number[];
  fromSeat?: number;
}

export interface PublicRoomState {
  roomId: string;
  gameType: GameType;
  phase: string;
  seats: SeatPublic[];
  wallCount: number;
  currentSeat: number;
  lastDiscard?: { seat: number; tile: number };
  availableOps: OpOption[];
  message: string;
  round: number;
  settle?: SettleInfo | null;
  /** 跑胡子：当前可吃组合 */
  chiChoices?: number[][];
}

export interface OpOption {
  action: string;
  label: string;
  tile?: number;
  tiles?: number[];
}

export interface SettleInfo {
  winnerSeat: number | null;
  reason: string;
  scores: number[];
  detail: string;
}
