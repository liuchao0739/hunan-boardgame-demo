import type { MeldPublic, OpOption, SettleInfo } from "../../shared/protocol.js";
import {
  buildDeck,
  isHu,
  shuffle,
  sortTiles,
  tileName,
} from "./tiles.js";

export type MjPhase =
  | "waiting"
  | "playing"
  | "wait_discard"
  | "wait_claim"
  | "settle"
  | "finished";

export interface MjMeld {
  kind: "peng" | "chi" | "ming_gang" | "an_gang" | "bu_gang";
  tiles: number[];
  fromSeat?: number;
}

export interface MjPlayer {
  hand: number[];
  melds: MjMeld[];
  discards: number[];
  score: number;
}

export interface MjConfig {
  birdCount: number; // 抓鸟数
  baseScore: number;
}

const DEFAULT_CFG: MjConfig = { birdCount: 2, baseScore: 2 };

export class ChangshaMahjong {
  readonly playerCount = 4;
  phase: MjPhase = "waiting";
  players: MjPlayer[] = [];
  wall: number[] = [];
  currentSeat = 0;
  dealer = 0;
  round = 0;
  lastDiscard: { seat: number; tile: number } | null = null;
  /** 当前可响应的座位及操作 */
  claimSeat: number | null = null;
  pendingClaims: Map<number, string> = new Map();
  claimDeadlineSeats: number[] = [];
  settle: SettleInfo | null = null;
  message = "等待开始";
  cfg: MjConfig;
  drawnThisTurn: number | null = null;

  constructor(cfg: Partial<MjConfig> = {}) {
    this.cfg = { ...DEFAULT_CFG, ...cfg };
    this.resetPlayers();
  }

  private resetPlayers() {
    this.players = Array.from({ length: 4 }, () => ({
      hand: [],
      melds: [],
      discards: [],
      score: 0,
    }));
  }

  start() {
    this.round++;
    this.settle = null;
    this.wall = shuffle(buildDeck());
    this.resetHandsKeepScore();
    // 庄家 14 张，其余 13
    for (let s = 0; s < 4; s++) {
      const n = s === this.dealer ? 14 : 13;
      this.players[s].hand = sortTiles(this.wall.splice(0, n));
    }
    this.currentSeat = this.dealer;
    this.phase = "wait_discard";
    this.lastDiscard = null;
    this.drawnThisTurn = null;
    this.message = `第 ${this.round} 局开始，庄家座位 ${this.dealer}，请出牌`;
  }

  private resetHandsKeepScore() {
    for (const p of this.players) {
      p.hand = [];
      p.melds = [];
      p.discards = [];
    }
  }

  /** 当前座位可执行的操作（出牌阶段） */
  getOpsFor(seat: number): OpOption[] {
    if (this.phase === "wait_discard" && seat === this.currentSeat) {
      const ops: OpOption[] = [{ action: "discard", label: "出牌" }];
      // 暗杠 / 补杠
      const gangs = this.findAnGang(seat);
      for (const t of gangs) {
        ops.push({ action: "an_gang", label: `暗杠 ${tileName(t)}`, tile: t });
      }
      const bu = this.findBuGang(seat);
      for (const t of bu) {
        ops.push({ action: "bu_gang", label: `补杠 ${tileName(t)}`, tile: t });
      }
      // 自摸
      if (isHu(this.players[seat].hand)) {
        ops.push({ action: "zimo", label: "自摸" });
      }
      return ops;
    }
    if (this.phase === "wait_claim" && this.claimDeadlineSeats.includes(seat)) {
      const ops: OpOption[] = [{ action: "pass", label: "过" }];
      const tile = this.lastDiscard!.tile;
      const hand = this.players[seat].hand;
      if (hand.filter((x) => x === tile).length >= 2) {
        ops.push({ action: "peng", label: `碰 ${tileName(tile)}`, tile });
      }
      if (hand.filter((x) => x === tile).length >= 3) {
        ops.push({ action: "ming_gang", label: `杠 ${tileName(tile)}`, tile });
      }
      if (isHu([...hand, tile])) {
        ops.push({ action: "hu", label: `胡 ${tileName(tile)}`, tile });
      }
      // 长沙可吃：仅下家
      if (seat === (this.lastDiscard!.seat + 1) % 4) {
        for (const chi of this.findChi(hand, tile)) {
          ops.push({
            action: "chi",
            label: `吃 ${chi.map(tileName).join("")}`,
            tiles: chi,
          });
        }
      }
      return ops;
    }
    return [];
  }

  private findAnGang(seat: number): number[] {
    const c = new Array(27).fill(0);
    for (const t of this.players[seat].hand) c[t]++;
    const r: number[] = [];
    for (let t = 0; t < 27; t++) if (c[t] === 4) r.push(t);
    return r;
  }

  private findBuGang(seat: number): number[] {
    const hand = this.players[seat].hand;
    const r: number[] = [];
    for (const m of this.players[seat].melds) {
      if (m.kind === "peng" && hand.includes(m.tiles[0])) {
        r.push(m.tiles[0]);
      }
    }
    return r;
  }

  private findChi(hand: number[], tile: number): number[][] {
    const suit = Math.floor(tile / 9);
    const rank = tile % 9;
    const has = (t: number) => hand.includes(t);
    const inSuit = (t: number) => Math.floor(t / 9) === suit;
    const combos: number[][] = [];
    // tile 作中间 / 左边 / 右边
    const candidates: number[][] = [];
    if (rank >= 1 && rank <= 7) {
      candidates.push([tile - 1, tile, tile + 1]);
    }
    if (rank >= 2) candidates.push([tile - 2, tile - 1, tile]);
    if (rank <= 6) candidates.push([tile, tile + 1, tile + 2]);
    for (const combo of candidates) {
      if (!combo.every(inSuit)) continue;
      const need = combo.filter((x) => x !== tile);
      if (need.every(has)) combos.push(sortTiles(combo));
    }
    // 去重
    const key = new Set<string>();
    return combos.filter((c) => {
      const k = c.join(",");
      if (key.has(k)) return false;
      key.add(k);
      return true;
    });
  }

  apply(seat: number, action: string, payload: { tile?: number; tiles?: number[] } = {}): string | null {
    if (this.phase === "wait_discard" && seat === this.currentSeat) {
      if (action === "discard") {
        const tile = payload.tile;
        if (tile === undefined || !this.players[seat].hand.includes(tile)) {
          return "无效出牌";
        }
        this.removeOne(seat, tile);
        this.players[seat].discards.push(tile);
        this.lastDiscard = { seat, tile };
        this.drawnThisTurn = null;
        this.players[seat].hand = sortTiles(this.players[seat].hand);
        // 检查其他人是否可碰杠胡吃
        const responders = this.collectClaimers(seat, tile);
        if (responders.length > 0) {
          this.phase = "wait_claim";
          this.claimDeadlineSeats = responders;
          this.pendingClaims.clear();
          this.message = `座位 ${seat} 打出 ${tileName(tile)}，等待响应`;
          return null;
        }
        this.advanceDraw((seat + 1) % 4);
        return null;
      }
      if (action === "zimo") {
        if (!isHu(this.players[seat].hand)) return "未胡牌";
        this.doWin(seat, "自摸", true);
        return null;
      }
      if (action === "an_gang" && payload.tile !== undefined) {
        return this.doAnGang(seat, payload.tile);
      }
      if (action === "bu_gang" && payload.tile !== undefined) {
        return this.doBuGang(seat, payload.tile);
      }
    }

    if (this.phase === "wait_claim" && this.claimDeadlineSeats.includes(seat)) {
      this.pendingClaims.set(seat, action === "chi" ? `chi:${(payload.tiles || []).join(",")}` : action);
      // 若还有人未表态，等（简化：有人胡/碰/杠立即按优先级结算；全过才继续）
      return this.resolveClaims(payload);
    }
    return "当前不能操作";
  }

  private collectClaimers(fromSeat: number, tile: number): number[] {
    const list: number[] = [];
    for (let s = 0; s < 4; s++) {
      if (s === fromSeat) continue;
      const hand = this.players[s].hand;
      const canPeng = hand.filter((x) => x === tile).length >= 2;
      const canGang = hand.filter((x) => x === tile).length >= 3;
      const canHu = isHu([...hand, tile]);
      const canChi =
        s === (fromSeat + 1) % 4 && this.findChi(hand, tile).length > 0;
      if (canPeng || canGang || canHu || canChi) list.push(s);
    }
    return list;
  }

  private resolveClaims(payload: { tile?: number; tiles?: number[] }): string | null {
    // 等齐或已有胡
    const allIn =
      this.claimDeadlineSeats.every((s) => this.pendingClaims.has(s));
    const claims = [...this.pendingClaims.entries()];

    const huSeat = claims.find(([, a]) => a === "hu")?.[0];
    if (huSeat !== undefined) {
      const tile = this.lastDiscard!.tile;
      this.players[huSeat].hand.push(tile);
      this.players[huSeat].hand = sortTiles(this.players[huSeat].hand);
      // 从打牌者牌河移除最后一张（展示上仍保留，结算即可）
      this.doWin(huSeat, `接炮胡 ${tileName(tile)}`, false);
      return null;
    }

    if (!allIn) {
      this.message = "等待其他玩家响应…";
      return null;
    }

    // 杠 > 碰 > 吃
    const gang = claims.find(([, a]) => a === "ming_gang");
    if (gang) {
      this.takeDiscardToMeld(gang[0], "ming_gang", 3);
      this.drawOne(gang[0]);
      this.currentSeat = gang[0];
      this.phase = "wait_discard";
      this.claimDeadlineSeats = [];
      this.message = `座位 ${gang[0]} 明杠，补牌后出牌`;
      return null;
    }
    const peng = claims.find(([, a]) => a === "peng");
    if (peng) {
      this.takeDiscardToMeld(peng[0], "peng", 2);
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

    // 全过
    this.claimDeadlineSeats = [];
    this.advanceDraw((this.lastDiscard!.seat + 1) % 4);
    return null;
  }

  private takeDiscardToMeld(seat: number, kind: "peng" | "ming_gang", fromHand: number) {
    const tile = this.lastDiscard!.tile;
    for (let i = 0; i < fromHand; i++) this.removeOne(seat, tile);
    const tiles = kind === "peng" ? [tile, tile, tile] : [tile, tile, tile, tile];
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
      tiles: sortTiles(tiles),
      fromSeat: this.lastDiscard!.seat,
    });
    this.lastDiscard = null;
  }

  private doAnGang(seat: number, tile: number): string | null {
    if (this.players[seat].hand.filter((x) => x === tile).length < 4) {
      return "不能暗杠";
    }
    for (let i = 0; i < 4; i++) this.removeOne(seat, tile);
    this.players[seat].melds.push({ kind: "an_gang", tiles: [tile, tile, tile, tile] });
    this.drawOne(seat);
    this.message = `座位 ${seat} 暗杠并补牌`;
    this.phase = "wait_discard";
    return null;
  }

  private doBuGang(seat: number, tile: number): string | null {
    const meld = this.players[seat].melds.find(
      (m) => m.kind === "peng" && m.tiles[0] === tile,
    );
    if (!meld || !this.players[seat].hand.includes(tile)) return "不能补杠";
    this.removeOne(seat, tile);
    meld.kind = "bu_gang";
    meld.tiles = [tile, tile, tile, tile];
    this.drawOne(seat);
    this.message = `座位 ${seat} 补杠并补牌`;
    this.phase = "wait_discard";
    return null;
  }

  private advanceDraw(seat: number) {
    if (this.wall.length === 0) {
      this.doDraw();
      return;
    }
    this.drawOne(seat);
    this.currentSeat = seat;
    this.phase = "wait_discard";
    this.message = `座位 ${seat} 摸牌，请出牌（剩 ${this.wall.length} 张）`;
  }

  private drawOne(seat: number) {
    if (this.wall.length === 0) return;
    const t = this.wall.shift()!;
    this.players[seat].hand.push(t);
    this.players[seat].hand = sortTiles(this.players[seat].hand);
    this.drawnThisTurn = t;
  }

  private doDraw() {
    this.phase = "settle";
    this.settle = {
      winnerSeat: null,
      reason: "流局",
      scores: [0, 0, 0, 0],
      detail: "牌墙摸完，本局流局",
    };
    this.message = "流局";
    this.phase = "finished";
  }

  private doWin(seat: number, reason: string, zimo: boolean) {
    const birds = this.drawBirds();
    // 长沙简化房规：鸟牌点数为 1/5/9 算中鸟，每中一鸟翻倍基数
    const birdHit = birds.filter((b) => isBirdTile(b)).length;
    const base = this.cfg.baseScore;
    const winScore = base * (1 + birdHit) * (zimo ? 2 : 1);
    const scores = [0, 0, 0, 0];
    if (zimo) {
      for (let s = 0; s < 4; s++) {
        if (s === seat) continue;
        scores[s] -= winScore;
        scores[seat] += winScore;
      }
    } else {
      const loser = this.lastDiscard!.seat;
      scores[loser] -= winScore * 2;
      scores[seat] += winScore * 2;
    }
    for (let s = 0; s < 4; s++) this.players[s].score += scores[s];
    this.settle = {
      winnerSeat: seat,
      reason,
      scores,
      detail: `${reason}；鸟牌 ${birds.map(tileName).join("、") || "无"}；中鸟 ${birdHit}；本局分变 ${scores.map((x, i) => `S${i}:${x > 0 ? "+" : ""}${x}`).join(" ")}`,
    };
    this.dealer = seat;
    this.phase = "finished";
    this.message = this.settle.detail;
  }

  /** 长沙抓鸟：从牌墙取 N 张 */
  private drawBirds(): number[] {
    const n = Math.min(this.cfg.birdCount, this.wall.length);
    return this.wall.splice(0, n);
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

/** 中鸟：1/5/9 算中（长沙常见简化） */
export function isBirdTile(tile: number): boolean {
  const rank = (tile % 9) + 1;
  return rank === 1 || rank === 5 || rank === 9;
}
