/**
 * 长沙麻将牌编码
 * 0-8 万, 9-17 条, 18-26 筒；每种 4 张 = 108 张（经典长沙不带字牌）
 */

export const SUIT_NAMES = ["万", "条", "筒"] as const;

export function tileName(t: number): string {
  if (t < 0 || t > 26) return `?${t}`;
  const suit = Math.floor(t / 9);
  const rank = (t % 9) + 1;
  return `${rank}${SUIT_NAMES[suit]}`;
}

export function buildDeck(): number[] {
  const deck: number[] = [];
  for (let t = 0; t < 27; t++) {
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

export function sortTiles(tiles: number[]): number[] {
  return [...tiles].sort((a, b) => a - b);
}

export function countsOf(tiles: number[]): number[] {
  const c = new Array(27).fill(0);
  for (const t of tiles) c[t]++;
  return c;
}

/** 标准 3N+2 胡牌（无癞子） */
export function canHu(tiles: number[]): boolean {
  if (tiles.length % 3 !== 2) return false;
  const c = countsOf(tiles);
  return canHuCounts(c);
}

function canHuCounts(c: number[]): boolean {
  for (let i = 0; i < 27; i++) {
    if (c[i] < 2) continue;
    c[i] -= 2;
    if (canMeldAll(c)) {
      c[i] += 2;
      return true;
    }
    c[i] += 2;
  }
  return false;
}

function canMeldAll(c: number[]): boolean {
  let i = 0;
  while (i < 27 && c[i] === 0) i++;
  if (i === 27) return true;
  // 刻子
  if (c[i] >= 3) {
    c[i] -= 3;
    if (canMeldAll(c)) {
      c[i] += 3;
      return true;
    }
    c[i] += 3;
  }
  // 顺子（同花色）
  const suit = Math.floor(i / 9);
  const rank = i % 9;
  if (rank <= 6 && c[i] > 0 && c[i + 1] > 0 && c[i + 2] > 0) {
    const base = suit * 9;
    if (i >= base && i + 2 < base + 9) {
      c[i]--;
      c[i + 1]--;
      c[i + 2]--;
      if (canMeldAll(c)) {
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
  return false;
}

/** 七对（长沙常见可选，本 Demo 开启） */
export function canQiDui(tiles: number[]): boolean {
  if (tiles.length !== 14) return false;
  const c = countsOf(tiles);
  let pairs = 0;
  for (let i = 0; i < 27; i++) {
    if (c[i] === 2) pairs++;
    else if (c[i] !== 0) return false;
  }
  return pairs === 7;
}

export function isHu(tiles: number[]): boolean {
  return canHu(tiles) || canQiDui(tiles);
}

/** 听牌提示：打哪张后仍可能听（简化：是否可胡某张） */
export function waitingTiles(hand: number[]): number[] {
  const waits: number[] = [];
  for (let t = 0; t < 27; t++) {
    if (isHu([...hand, t])) waits.push(t);
  }
  return waits;
}
