/** 长沙麻将 0–26 牌逻辑（与 server tiles.lua 对齐，供听牌/高亮） */
export function tileName(t: number): string {
  if (t < 0 || t > 26) return '?';
  const suit = ['万', '条', '筒'][Math.floor(t / 9)];
  return `${(t % 9) + 1}${suit}`;
}

export function countsOf(tiles: number[]): number[] {
  const c = new Array(27).fill(0);
  for (const t of tiles) {
    if (t >= 0 && t <= 26) c[t] += 1;
  }
  return c;
}

function canMeldAll(c: number[]): boolean {
  let i = 0;
  while (i <= 26 && (c[i] || 0) === 0) i += 1;
  if (i > 26) return true;
  const n = c[i];
  if (n >= 3) {
    c[i] = n - 3;
    if (canMeldAll(c)) {
      c[i] = n;
      return true;
    }
    c[i] = n;
  }
  const rank = i % 9;
  if (rank <= 6 && n > 0 && (c[i + 1] || 0) > 0 && (c[i + 2] || 0) > 0) {
    c[i] = n - 1;
    c[i + 1] -= 1;
    c[i + 2] -= 1;
    if (canMeldAll(c)) {
      c[i] = n;
      c[i + 1] += 1;
      c[i + 2] += 1;
      return true;
    }
    c[i] = n;
    c[i + 1] += 1;
    c[i + 2] += 1;
  }
  return false;
}

export function canHu(tiles: number[]): boolean {
  if (tiles.length % 3 !== 2) return false;
  const c = countsOf(tiles);
  for (let eye = 0; eye <= 26; eye++) {
    if ((c[eye] || 0) < 2) continue;
    c[eye] -= 2;
    if (canMeldAll(c)) {
      c[eye] += 2;
      return true;
    }
    c[eye] += 2;
  }
  return false;
}

export function isJiangTile(t: number): boolean {
  const r = (t % 9) + 1;
  return r === 2 || r === 5 || r === 8;
}

export function canJiangJiangHu(tiles: number[]): boolean {
  if (tiles.length % 3 !== 2) return false;
  for (const t of tiles) {
    if (!isJiangTile(t)) return false;
  }
  return canHu(tiles);
}

export function canHuAny(tiles: number[]): boolean {
  return canHu(tiles) || canJiangJiangHu(tiles);
}

/** 13 张听牌：返回可胡的牌 id 列表 */
export function tingTiles(hand13: number[]): number[] {
  if (hand13.length % 3 !== 1) return [];
  const tips: number[] = [];
  for (let t = 0; t <= 26; t++) {
    if (canHuAny([...hand13, t])) tips.push(t);
  }
  return tips;
}

export function chiHandTiles(ops: Array<{ action: string; tiles?: number[] }>): number[] {
  const out: number[] = [];
  for (const op of ops) {
    if (op.action !== 'chi' || !op.tiles || op.tiles.length < 2) continue;
    out.push(op.tiles[0], op.tiles[1]);
  }
  return out;
}
