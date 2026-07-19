import type { MeldPublic, OpOption, SettleInfo } from "../../shared/protocol.js";
import {
  buildPhzDeck,
  canPhzHu,
  findPhzChi,
  meldHuxi,
  phzName,
  shuffle,
  sortPhz,
} from "./tiles.js";

export type PhzPhase =
  | "waiting"
  | "wait_discard"
  | "wait_claim"
  | "finished";

export interface PhzMeld {
  kind: "peng" | "chi" | "wei" | "pao" | "ti";
  tiles: number[];
  fromSeat?: number;
}

export interface PhzPlayer {
  hand: number[];
  melds: PhzMeld[];
  discards: number[];
  score: number;
}

/** 邵阳跑胡子：三人场 Demo */
export class ShaoyangPaohuzi {
  readonly playerCount = 3;
  phase: PhzPhase = "waiting";
  players: PhzPlayer[] = [];
  wall: number[] = [];
  currentSeat = 0;
  dealer = 0;
  round = 0;
  lastDiscard: { seat: number; tile: number } | null = null;
  claimDeadlineSeats: number[] = [];
  pendingClaims: Map<number, string> = new Map();
  settle: SettleInfo | null = null;
  message = "等待开始";
  minHuxi = 15;

  constructor() {
    this.resetPlayers();
  }

  private resetPlayers() {
    this.players = Array.from({ length: 3 }, () => ({
      hand: [],
      melds: [],
      discards: [],
      score: 0,
    }));
  }

  start() {
    this.round++;
    this.settle = null;
    this.wall = shuffle(buildPhzDeck());
    for (const p of this.players) {
      p.hand = [];
      p.melds = [];
      p.discards = [];
    }
    // 庄 21，其余 20（三人字牌常见起手）
    for (let s = 0; s < 3; s++) {
      const n = s === this.dealer ? 21 : 20;
      this.players[s].hand = sortPhz(this.wall.splice(0, n));
    }
    this.currentSeat = this.dealer;
    this.phase = "wait_discard";
    this.lastDiscard = null;
    this.message = `第 ${this.round} 局邵阳跑胡子开始，庄家座位 ${this.dealer}`;
  }

  private meldHuxiSum(seat: number): number {
    return this.players[seat].melds.reduce(
      (s, m) => s + meldHuxi(m.kind, m.tiles[0]),
      0,
    );
  }

  getOpsFor(seat: number): OpOption[] {
    if (this.phase === "wait_discard" && seat === this.currentSeat) {
      const ops: OpOption[] = [{ action: "discard", label: "出牌" }];
      if (canPhzHu(this.players[seat].hand, this.meldHuxiSum(seat), this.minHuxi)) {
        ops.push({ action: "zimo", label: "胡牌" });
      }
      // 提：手牌四张
      const c = new Array(20).fill(0);
      for (const t of this.players[seat].hand) c[t]++;
      for (let t = 0; t < 20; t++) {
        if (c[t] === 4) {
          ops.push({ action: "ti", label: `提 ${phzName(t)}`, tile: t });
        }
      }
      return ops;
    }
    if (this.phase === "wait_claim" && this.claimDeadlineSeats.includes(seat)) {
      const ops: OpOption[] = [{ action: "pass", label: "过" }];
      const tile = this.lastDiscard!.tile;
      const hand = this.players[seat].hand;
      const n = hand.filter((x) => x === tile).length;
      if (n >= 2) ops.push({ action: "peng", label: `碰 ${phzName(tile)}`, tile });
      if (n >= 3) ops.push({ action: "pao", label: `跑 ${phzName(tile)}`, tile });
      if (canPhzHu([...hand, tile], this.meldHuxiSum(seat), this.minHuxi)) {
        ops.push({ action: "hu", label: `胡 ${phzName(tile)}`, tile });
      }
      if (seat === (this.lastDiscard!.seat + 1) % 3) {
        for (const chi of findPhzChi(hand, tile)) {
          ops.push({
            action: "chi",
            label: `吃 ${chi.map(phzName).join("")}`,
            tiles: chi,
          });
        }
      }
      return ops;
    }
    return [];
  }

  apply(
    seat: number,
    action: string,
    payload: { tile?: number; tiles?: number[] } = {},
  ): string | null {
    if (this.phase === "wait_discard" && seat === this.currentSeat) {
      if (action === "discard") {
        const tile = payload.tile;
        if (tile === undefined || !this.players[seat].hand.includes(tile)) {
          return "无效出牌";
        }
        this.removeOne(seat, tile);
        this.players[seat].discards.push(tile);
        this.players[seat].hand = sortPhz(this.players[seat].hand);
        this.lastDiscard = { seat, tile };
        const responders = this.collectClaimers(seat, tile);
        if (responders.length) {
          this.phase = "wait_claim";
          this.claimDeadlineSeats = responders;
          this.pendingClaims.clear();
          this.message = `座位 ${seat} 打出 ${phzName(tile)}，等待响应`;
          return null;
        }
        this.advanceDraw((seat + 1) % 3);
        return null;
      }
      if (action === "zimo") {
        if (!canPhzHu(this.players[seat].hand, this.meldHuxiSum(seat), this.minHuxi)) {
          return "息数不足或牌型不成";
        }
        this.doWin(seat, "自摸胡");
        return null;
      }
      if (action === "ti" && payload.tile !== undefined) {
        return this.doTi(seat, payload.tile);
      }
    }

    if (this.phase === "wait_claim" && this.claimDeadlineSeats.includes(seat)) {
      const key =
        action === "chi" ? `chi:${(payload.tiles || []).join(",")}` : action;
      this.pendingClaims.set(seat, key);
      return this.resolveClaims();
    }
    return "当前不能操作";
  }

  private doTi(seat: number, tile: number): string | null {
    if (this.players[seat].hand.filter((x) => x === tile).length < 4) {
      return "不能提";
    }
    for (let i = 0; i < 4; i++) this.removeOne(seat, tile);
    this.players[seat].melds.push({ kind: "ti", tiles: [tile, tile, tile, tile] });
    this.drawOne(seat);
    this.message = `座位 ${seat} 提牌`;
    return null;
  }

  private collectClaimers(from: number, tile: number): number[] {
    const list: number[] = [];
    for (let s = 0; s < 3; s++) {
      if (s === from) continue;
      const hand = this.players[s].hand;
      const n = hand.filter((x) => x === tile).length;
      const canChi =
        s === (from + 1) % 3 && findPhzChi(hand, tile).length > 0;
      if (
        n >= 2 ||
        n >= 3 ||
        canPhzHu([...hand, tile], this.meldHuxiSum(s), this.minHuxi) ||
        canChi
      ) {
        list.push(s);
      }
    }
    return list;
  }

  private resolveClaims(): string | null {
    const allIn = this.claimDeadlineSeats.every((s) => this.pendingClaims.has(s));
    const claims = [...this.pendingClaims.entries()];
    const hu = claims.find(([, a]) => a === "hu");
    if (hu) {
      const tile = this.lastDiscard!.tile;
      this.players[hu[0]].hand.push(tile);
      this.players[hu[0]].hand = sortPhz(this.players[hu[0]].hand);
      this.doWin(hu[0], `接炮胡 ${phzName(tile)}`);
      return null;
    }
    if (!allIn) {
      this.message = "等待其他玩家响应…";
      return null;
    }
    const pao = claims.find(([, a]) => a === "pao");
    if (pao) {
      this.takeMeld(pao[0], "pao", 3);
      this.drawOne(pao[0]);
      this.currentSeat = pao[0];
      this.phase = "wait_discard";
      this.claimDeadlineSeats = [];
      this.message = `座位 ${pao[0]} 跑牌`;
      return null;
    }
    const peng = claims.find(([, a]) => a === "peng");
    if (peng) {
      this.takeMeld(peng[0], "peng", 2);
      this.currentSeat = peng[0];
      this.phase = "wait_discard";
      this.claimDeadlineSeats = [];
      this.message = `座位 ${peng[0]} 碰牌，请出牌`;
      return null;
    }
    const chi = claims.find(([, a]) => a.startsWith("chi:"));
    if (chi) {
      const tiles = chi[1].slice(4).split(",").map(Number);
      this.takeChi(chi[0], tiles);
      this.currentSeat = chi[0];
      this.phase = "wait_discard";
      this.claimDeadlineSeats = [];
      this.message = `座位 ${chi[0]} 吃牌，请出牌`;
      return null;
    }
    this.claimDeadlineSeats = [];
    this.advanceDraw((this.lastDiscard!.seat + 1) % 3);
    return null;
  }

  private takeMeld(seat: number, kind: "peng" | "pao", fromHand: number) {
    const tile = this.lastDiscard!.tile;
    for (let i = 0; i < fromHand; i++) this.removeOne(seat, tile);
    const tiles =
      kind === "peng" ? [tile, tile, tile] : [tile, tile, tile, tile];
    this.players[seat].melds.push({
      kind,
      tiles,
      fromSeat: this.lastDiscard!.seat,
    });
    this.lastDiscard = null;
  }

  private takeChi(seat: number, tiles: number[]) {
    const discard = this.lastDiscard!.tile;
    for (const t of tiles) {
      if (t === discard) continue;
      this.removeOne(seat, t);
    }
    this.players[seat].melds.push({
      kind: "chi",
      tiles: sortPhz(tiles),
      fromSeat: this.lastDiscard!.seat,
    });
    this.lastDiscard = null;
  }

  private advanceDraw(seat: number) {
    if (this.wall.length === 0) {
      this.settle = {
        winnerSeat: null,
        reason: "流局",
        scores: [0, 0, 0],
        detail: "牌墩摸完，流局",
      };
      this.phase = "finished";
      this.message = "流局";
      return;
    }
    this.drawOne(seat);
    this.currentSeat = seat;
    this.phase = "wait_discard";
    this.message = `座位 ${seat} 摸牌（剩 ${this.wall.length}）`;
  }

  private drawOne(seat: number) {
    if (!this.wall.length) return;
    const t = this.wall.shift()!;
    this.players[seat].hand.push(t);
    this.players[seat].hand = sortPhz(this.players[seat].hand);
  }

  private doWin(seat: number, reason: string) {
    const hx = this.meldHuxiSum(seat);
    const scores = [0, 0, 0];
    const win = Math.max(1, Math.floor(hx / 3)) + 2;
    for (let s = 0; s < 3; s++) {
      if (s === seat) continue;
      scores[s] -= win;
      scores[seat] += win;
    }
    for (let s = 0; s < 3; s++) this.players[s].score += scores[s];
    this.settle = {
      winnerSeat: seat,
      reason,
      scores,
      detail: `${reason}；门子胡息约 ${hx}；分变 ${scores.map((x, i) => `S${i}:${x > 0 ? "+" : ""}${x}`).join(" ")}`,
    };
    this.dealer = seat;
    this.phase = "finished";
    this.message = this.settle.detail;
  }

  private removeOne(seat: number, tile: number) {
    const i = this.players[seat].hand.indexOf(tile);
    if (i >= 0) this.players[seat].hand.splice(i, 1);
  }

  toPublicMelds(seat: number): MeldPublic[] {
    return this.players[seat].melds.map((m) => ({
      kind: m.kind,
      tiles: m.tiles,
      fromSeat: m.fromSeat,
    }));
  }
}
