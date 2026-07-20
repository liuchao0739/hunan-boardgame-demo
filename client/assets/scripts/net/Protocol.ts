/**
 * 与 Skynet 服约定的 JSON 协议
 */
export type GameType =
  | 'changsha_mj'
  | 'xueliu_mj'
  | 'xuezhan_mj'
  | 'hongzhong_mj'
  | 'shaoyang_phz'
  | 'doudizhu'
  | 'paodekuai';

export type ClientMessage =
  | { type: 'create_room'; gameType: GameType; nick?: string }
  | { type: 'join_room'; roomId: string; nick?: string }
  | { type: 'ready' }
  | { type: 'action'; action: string; tiles?: number[]; tile?: number }
  | { type: 'fill_bots' }
  | { type: 'chat'; text: string }
  | { type: 'history_list' }
  | { type: 'history_get'; id: string }
  | { type: 'club_create'; nick?: string; name?: string }
  | { type: 'club_list' }
  | { type: 'club_join'; id: string; nick?: string }
  | { type: 'room_cards'; nick?: string }
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
  out?: boolean;
  huTimes?: number;
}

export interface RecorderSnap {
  mode: string;
  ranks: { rank: number; label: string; left: number; total: number }[];
}

export interface GameCatalogItem {
  id: GameType;
  name: string;
  seats: number;
}

export interface HistoryItem {
  id: string;
  roomId: string;
  gameType: string;
  time: number;
  summary: string;
  scores: number[];
}

export interface PublicRoomState {
  roomId: string;
  gameType: GameType;
  phase: string;
  seats: SeatPublic[];
  wallCount: number;
  currentSeat: number;
  lastDiscard?: { seat: number; tile: number };
  lastPlayCards?: number[];
  availableOps: OpOption[];
  message: string;
  round: number;
  landlord?: number | null;
  recorder?: RecorderSnap | null;
  logLen?: number;
  settle?: {
    winnerSeat: number | null;
    reason: string;
    scores: number[];
    detail: string;
  } | null;
}

export type ServerMessage =
  | {
      type: 'hello';
      message: string;
      stack?: string;
      games?: GameCatalogItem[];
      features?: string[];
    }
  | { type: 'error'; message: string }
  | {
      type: 'room_created';
      roomId: string;
      seat: number;
      gameType: GameType;
      roomCards?: number;
    }
  | { type: 'joined'; roomId: string; seat: number; gameType: GameType; roomCards?: number }
  | { type: 'chat'; seat: number; nick: string; text: string }
  | { type: 'history'; list: HistoryItem[] }
  | { type: 'replay'; entry: any }
  | { type: 'club'; club: any }
  | { type: 'club_list'; list: any[] }
  | { type: 'room_cards'; count: number }
  | { type: 'pong' }
  | { type: 'state'; state: PublicRoomState };
