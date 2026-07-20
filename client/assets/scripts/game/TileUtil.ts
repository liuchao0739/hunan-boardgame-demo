const CN = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
const PHZ = ['壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾'];
const POKER_RANK = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];
const POKER_SUIT = ['♠', '♥', '♣', '♦'];

export type Suit = 'wan' | 'tiao' | 'tong' | 'big' | 'small' | 'poker_red' | 'poker_black' | 'joker';

export function tileFace(gameType: string, t: number): { rank: string; suit: string; color: Suit } {
  if (gameType === 'doudizhu' || gameType === 'paodekuai') {
    if (t === 52) return { rank: '小', suit: '王', color: 'joker' };
    if (t === 53) return { rank: '大', suit: '王', color: 'joker' };
    const suit = Math.floor(t / 13);
    const rank = t % 13;
    const red = suit === 1 || suit === 3;
    return {
      rank: POKER_RANK[rank],
      suit: POKER_SUIT[suit],
      color: red ? 'poker_red' : 'poker_black',
    };
  }
  if (gameType === 'changsha_mj') {
    const s = Math.floor(t / 9);
    const r = t % 9;
    return {
      rank: CN[r],
      suit: ['万', '条', '筒'][s],
      color: (['wan', 'tiao', 'tong'] as Suit[])[s],
    };
  }
  return {
    rank: PHZ[t % 10],
    suit: t >= 10 ? '大' : '小',
    color: t >= 10 ? 'big' : 'small',
  };
}

/**
 * 扑克牌 sprite 路径（自生成 · 与服务端 0-53 编码一致）
 * resources/ui/Poker/{id}/spriteFrame
 */
export function pokerSpriteKey(t: number): string | null {
  if (t < 0 || t > 53) return null;
  return String(t);
}

/**
 * 口袋麻将 Card2d 资源名（MIT · PocketMahjongClient）
 * 路径：resources/ui/Card2d/{key}/spriteFrame
 * 长沙麻将 tile：0-8 万、9-17 条、18-26 筒
 */
export function mjSpriteKey(t: number): string | null {
  if (t < 0 || t > 26) return null;
  const suits = ['wan', 'tiao', 'tong'] as const;
  return `${suits[Math.floor(t / 9)]}${(t % 9) + 1}`;
}

export const SUIT_COLOR: Record<Suit, string> = {
  wan: '#C41E3A',
  tiao: '#1A7A3C',
  tong: '#1E4D9C',
  big: '#C41E3A',
  small: '#1E4D9C',
  poker_red: '#C41E3A',
  poker_black: '#1A1A1A',
  joker: '#C41E3A',
};

export const OP_SHORT: Record<string, string> = {
  pass: '不出',
  chi: '吃',
  peng: '碰',
  ming_gang: '杠',
  an_gang: '杠',
  bu_gang: '杠',
  ti: '提',
  pao: '跑',
  hu: '胡',
  zimo: '胡',
  discard: '出牌',
  play: '出牌',
  bid_0: '不叫',
  bid_1: '1分',
  bid_2: '2分',
  bid_3: '3分',
};
