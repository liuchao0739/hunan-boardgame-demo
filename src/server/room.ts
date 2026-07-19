import { ChangshaMahjong } from "../engine/mahjong/game.js";
import { tileName } from "../engine/mahjong/tiles.js";
import { ShaoyangPaohuzi } from "../engine/paohuzi/game.js";
import { phzName } from "../engine/paohuzi/tiles.js";
import type {
  GameType,
  OpOption,
  PublicRoomState,
  SeatPublic,
} from "../shared/protocol.js";

export interface SeatConn {
  seat: number;
  nick: string;
  ready: boolean;
  isBot: boolean;
  send: (data: unknown) => void;
}

function randomRoomId(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export class Room {
  id: string;
  gameType: GameType;
  seats: (SeatConn | null)[];
  game: ChangshaMahjong | ShaoyangPaohuzi;
  started = false;

  constructor(gameType: GameType, id = randomRoomId()) {
    this.id = id;
    this.gameType = gameType;
    const n = gameType === "changsha_mj" ? 4 : 3;
    this.seats = Array.from({ length: n }, () => null);
    this.game =
      gameType === "changsha_mj" ? new ChangshaMahjong() : new ShaoyangPaohuzi();
  }

  get playerCount() {
    return this.seats.length;
  }

  addPlayer(nick: string, send: (data: unknown) => void, isBot = false): number {
    const seat = this.seats.findIndex((s) => s === null);
    if (seat < 0) throw new Error("房间已满");
    this.seats[seat] = {
      seat,
      nick: nick || (isBot ? `机器人${seat}` : `玩家${seat}`),
      ready: isBot,
      isBot,
      send,
    };
    return seat;
  }

  fillBots() {
    while (this.seats.some((s) => s === null)) {
      this.addPlayer("", () => {}, true);
    }
  }

  setReady(seat: number) {
    const s = this.seats[seat];
    if (s) s.ready = true;
  }

  tryStart() {
    if (this.started) return;
    if (this.seats.some((s) => !s || !s.ready)) return;
    this.started = true;
    this.game.start();
    this.broadcastState();
    this.kickBots();
  }

  /** 若轮到机器人，自动行动 */
  kickBots() {
    const maxSteps = 24;
    for (let i = 0; i < maxSteps; i++) {
      if (this.game.phase === "finished") return;
      let acted = false;
      for (const s of this.seats) {
        if (!s?.isBot) continue;
        const ops = this.game.getOpsFor(s.seat);
        if (!ops.length) continue;
        this.botAct(s.seat, ops);
        acted = true;
        break;
      }
      if (!acted) break;
    }
  }

  botAct(seat: number, ops: OpOption[]) {
    // 优先级：胡 > 杠/提/跑 > 碰 > 吃 > 出牌/过（响应阶段必须立刻表态，避免卡桌）
    const prefer = (names: string[]) => ops.find((o) => names.includes(o.action));
    const win = prefer(["zimo", "hu"]);
    if (win) {
      this.applyAction(seat, win.action, { tile: win.tile, tiles: win.tiles });
      return;
    }
    const gang = prefer(["ming_gang", "an_gang", "bu_gang", "ti", "pao"]);
    if (gang) {
      this.applyAction(seat, gang.action, { tile: gang.tile, tiles: gang.tiles });
      return;
    }
    const peng = prefer(["peng"]);
    if (peng && Math.random() > 0.45) {
      this.applyAction(seat, peng.action, { tile: peng.tile });
      return;
    }
    const chi = prefer(["chi"]);
    if (chi && Math.random() > 0.55) {
      this.applyAction(seat, chi.action, { tiles: chi.tiles });
      return;
    }
    if (ops.some((o) => o.action === "pass")) {
      this.applyAction(seat, "pass", {});
      return;
    }
    if (ops.some((o) => o.action === "discard")) {
      const hand =
        this.gameType === "changsha_mj"
          ? (this.game as ChangshaMahjong).players[seat].hand
          : (this.game as ShaoyangPaohuzi).players[seat].hand;
      const tile = hand[Math.floor(Math.random() * hand.length)];
      this.applyAction(seat, "discard", { tile });
    }
  }

  applyAction(
    seat: number,
    action: string,
    payload: { tile?: number; tiles?: number[] },
  ): string | null {
    const err = this.game.apply(seat, action, payload);
    if (err) return err;
    this.broadcastState();
    // 下一局：finished 后若全员准备可再开 —— Demo 自动准备 bots，人类点准备
    if (this.game.phase === "finished") {
      for (const s of this.seats) {
        if (s?.isBot) s.ready = true;
        else if (s) s.ready = false;
      }
      this.started = false;
    } else {
      queueMicrotask(() => this.kickBots());
    }
    return null;
  }

  nextRound() {
    if (this.game.phase !== "finished") return;
    if (this.seats.some((s) => !s?.ready)) return;
    this.started = true;
    this.game.start();
    this.broadcastState();
    this.kickBots();
  }

  broadcastState() {
    for (const s of this.seats) {
      if (!s || s.isBot) continue;
      s.send({ type: "state", state: this.buildPublic(s.seat) });
    }
  }

  buildPublic(viewerSeat: number): PublicRoomState {
    const g = this.game;
    const seats: SeatPublic[] = this.seats.map((s, i) => {
      const p =
        this.gameType === "changsha_mj"
          ? (g as ChangshaMahjong).players[i]
          : (g as ShaoyangPaohuzi).players[i];
      return {
        seat: i,
        nick: s?.nick ?? `空位${i}`,
        ready: s?.ready ?? false,
        isBot: s?.isBot ?? false,
        handCount: p.hand.length,
        melds: g.toPublicMelds(i),
        discards: p.discards,
        score: p.score,
        hand: i === viewerSeat ? [...p.hand] : undefined,
      };
    });

    const nameFn = this.gameType === "changsha_mj" ? tileName : phzName;
    void nameFn;

    return {
      roomId: this.id,
      gameType: this.gameType,
      phase: g.phase,
      seats,
      wallCount:
        this.gameType === "changsha_mj"
          ? (g as ChangshaMahjong).wall.length
          : (g as ShaoyangPaohuzi).wall.length,
      currentSeat: g.currentSeat,
      lastDiscard: g.lastDiscard ?? undefined,
      availableOps: g.getOpsFor(viewerSeat),
      message: g.message,
      round: g.round,
      settle: g.settle,
    };
  }
}

export class RoomManager {
  rooms = new Map<string, Room>();

  create(gameType: GameType, nick: string, send: (d: unknown) => void) {
    const room = new Room(gameType);
    this.rooms.set(room.id, room);
    const seat = room.addPlayer(nick, send, false);
    return { room, seat };
  }

  join(roomId: string, nick: string, send: (d: unknown) => void) {
    const room = this.rooms.get(roomId.toUpperCase());
    if (!room) throw new Error("房间不存在");
    if (room.started) throw new Error("对局已开始");
    const seat = room.addPlayer(nick, send, false);
    return { room, seat };
  }
}
