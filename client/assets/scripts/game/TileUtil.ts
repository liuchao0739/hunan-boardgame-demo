const CN = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
const PHZ = ['壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖', '拾'];

export type Suit = 'wan' | 'tiao' | 'tong' | 'big' | 'small';

export function tileFace(gameType: string, t: number): { rank: string; suit: string; color: Suit } {
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

export const SUIT_COLOR: Record<Suit, string> = {
  wan: '#C41E3A',
  tiao: '#1A7A3C',
  tong: '#1E4D9C',
  big: '#C41E3A',
  small: '#1E4D9C',
};

export const OP_SHORT: Record<string, string> = {
  pass: '过',
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
};
