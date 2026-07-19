/**
 * 邵阳跑胡子（字牌）简化实现
 * 编码：0-9 小写壹–拾，10-19 大写壹–拾；各 4 张 = 80 张
 * 三人场；胡息满 15 可胡（Demo 房规）
 */

export function phzName(t: number): string {
  const big = t >= 10;
  const rank = (t % 10) + 1;
  const cn = ["壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖", "拾"];
  return `${big ? "大" : "小"}${cn[rank - 1]}`;
}

export function buildPhzDeck(): number[] {
  const deck: number[] = [];
  for (let t = 0; t < 20; t++) {
    for (let i = 0; i < 4; i++) deck.push(t);
  }
  return deck;
}

export function shuffle<T>(arr: T[], rng = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sortPhz(tiles: number[]): number[] {
  return [...tiles].sort((a, b) => a - b);
}

/** 单列胡息估算：碰/偎/提/跑 */
export function meldHuxi(kind: string, tile: number): number {
  const big = tile >= 10;
  switch (kind) {
    case "peng":
      return big ? 3 : 1;
    case "wei": // 偎（暗碰）
      return big ? 6 : 3;
    case "ti": // 提（四张暗）
      return big ? 12 : 9;
    case "pao": // 跑（四张明）
      return big ? 9 : 6;
    case "chi":
      return 0;
    default:
      return 0;
  }
}

/**
 * 简化胡牌：手牌能拆成「将/坎」结构且总息+门子息 >= minHuxi
 * Demo 策略：手牌张数合法 + 存在至少一对 + 剩余可按 3 张一组粗判
 */
export function canPhzHu(hand: number[], meldHuxiSum: number, minHuxi = 15): boolean {
  if (hand.length % 3 !== 2) return false;
  const huxiHand = estimateHandHuxi(hand);
  return huxiHand + meldHuxiSum >= minHuxi && canSplit(hand);
}

function estimateHandHuxi(hand: number[]): number {
  const c = new Array(20).fill(0);
  for (const t of hand) c[t]++;
  let hx = 0;
  for (let t = 0; t < 20; t++) {
    if (c[t] === 3) hx += meldHuxi("wei", t);
    if (c[t] === 4) hx += meldHuxi("ti", t);
  }
  return hx;
}

function canSplit(tiles: number[]): boolean {
  const c = new Array(20).fill(0);
  for (const t of tiles) c[t]++;
  // 选将
  for (let i = 0; i < 20; i++) {
    if (c[i] < 2) continue;
    c[i] -= 2;
    if (meltRest(c)) {
      c[i] += 2;
      return true;
    }
    c[i] += 2;
  }
  return false;
}

function meltRest(c: number[]): boolean {
  let i = 0;
  while (i < 20 && c[i] === 0) i++;
  if (i === 20) return true;
  // 坎
  if (c[i] >= 3) {
    c[i] -= 3;
    if (meltRest(c)) {
      c[i] += 3;
      return true;
    }
    c[i] += 3;
  }
  // 吃：同大小字顺子 或 二七十 等常见吃法（简化：同区顺子）
  const zone = Math.floor(i / 10);
  const rank = i % 10;
  if (rank <= 7 && c[i] && c[i + 1] && c[i + 2]) {
    if (Math.floor((i + 2) / 10) === zone) {
      c[i]--;
      c[i + 1]--;
      c[i + 2]--;
      if (meltRest(c)) {
        c[i]++;
        c[i + 1]++;
        c[i + 2]++;
        return true;
      }
      c[i]++;
      c[i + 1]++;
      c[i + 2]++;
    }
  }
  // 二七十
  if (try2710(c, zone)) return true;
  return false;
}

function try2710(c: number[], zone: number): boolean {
  const a = zone * 10 + 1; // 贰
  const b = zone * 10 + 6; // 柒
  const d = zone * 10 + 9; // 拾
  if (c[a] && c[b] && c[d]) {
    c[a]--;
    c[b]--;
    c[d]--;
    if (meltRest(c)) {
      c[a]++;
      c[b]++;
      c[d]++;
      return true;
    }
    c[a]++;
    c[b]++;
    c[d]++;
  }
  return false;
}

export function findPhzChi(hand: number[], tile: number): number[][] {
  const has = (t: number) => hand.includes(t);
  const zone = Math.floor(tile / 10);
  const rank = tile % 10;
  const combos: number[][] = [];
  const push = (arr: number[]) => {
    if (arr.every((x) => Math.floor(x / 10) === zone || x === tile)) {
      const need = arr.filter((x) => x !== tile);
      if (need.every(has)) combos.push(sortPhz(arr));
    }
  };
  if (rank >= 1 && rank <= 7) push([tile - 1, tile, tile + 1]);
  if (rank >= 2) push([tile - 2, tile - 1, tile]);
  if (rank <= 6) push([tile, tile + 1, tile + 2]);
  // 二七十
  const set2710 = [zone * 10 + 1, zone * 10 + 6, zone * 10 + 9];
  if (set2710.includes(tile)) push(set2710);

  const seen = new Set<string>();
  return combos.filter((c) => {
    const k = c.join(",");
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
