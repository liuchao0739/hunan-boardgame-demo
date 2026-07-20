/**
 * 客户端玩法目录（与 server/lualib/game_catalog.lua 对齐）
 */
import type { GameType } from '../net/Protocol';

export interface GameMeta {
  id: GameType;
  name: string;
  seats: number;
  blurb: string;
  tip: string;
}

export const GAME_CATALOG: GameMeta[] = [
  {
    id: 'changsha_mj',
    name: '长沙麻将',
    seats: 4,
    blurb: '吃碰杠胡 · 七对抓鸟',
    tip: '点手牌选中，再点一次打出',
  },
  {
    id: 'shaoyang_phz',
    name: '邵阳跑胡子',
    seats: 3,
    blurb: '字牌 · 同牌叠列',
    tip: '同牌叠列，点列顶牌选中再打出',
  },
  {
    id: 'doudizhu',
    name: '斗地主',
    seats: 3,
    blurb: '叫分 · 经典出牌',
    tip: '点选手牌可多选，再点出牌',
  },
  {
    id: 'paodekuai',
    name: '跑得快',
    seats: 3,
    blurb: '十六张 · 红桃3先出',
    tip: '首出须带红桃3；多选后出牌',
  },
];

export function gameMeta(id: GameType): GameMeta {
  return GAME_CATALOG.find((g) => g.id === id) || GAME_CATALOG[0];
}
