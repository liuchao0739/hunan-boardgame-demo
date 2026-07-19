/**
 * 与 Skynet 服约定的 JSON 协议（与 server 一致）
 */
export type GameType = 'changsha_mj' | 'shaoyang_phz';

export type ClientMessage =
  | { type: 'create_room'; gameType: GameType; nick?: string }
  | { type: 'join_room'; roomId: string; nick?: string }
  | { type: 'ready' }
  | { type: 'action'; action: string; tiles?: number[]; tile?: number }
  | { type: 'fill_bots' }
  | { type: 'ping' };

export interface OpOption {
  action: string;
  label: string;
  tile?: number;
  tiles?: number[];
}

export interface SeatPublic {
  seat: number;
  nick: string;
  ready: boolean;
  isBot: boolean;
  handCount: number;
  melds: { kind: string; tiles: number[]; fromSeat?: number }[];
  discards: number[];
  score: number;
  hand?: number[];
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
  settle?: {
    winnerSeat: number | null;
    reason: string;
    scores: number[];
    detail: string;
  } | null;
}

export type ServerMessage =
  | { type: 'hello'; message: string; stack?: string }
  | { type: 'error'; message: string }
  | { type: 'room_created'; roomId: string; seat: number; gameType: GameType }
  | { type: 'joined'; roomId: string; seat: number; gameType: GameType }
  | { type: 'pong' }
  | { type: 'state'; state: PublicRoomState };
