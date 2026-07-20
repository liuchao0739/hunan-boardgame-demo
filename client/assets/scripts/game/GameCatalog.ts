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
  kind: 'mj' | 'phz' | 'poker';
}

export const GAME_CATALOG: GameMeta[] = [
  {
    id: 'changsha_mj',
    name: '长沙麻将',
    seats: 4,
    blurb: '经典 · 吃碰杠胡',
    tip: '点手牌选中，再点一次打出',
    kind: 'mj',
  },
  {
    id: 'xueliu_mj',
    name: '血流成河',
    seats: 4,
    blurb: '胡了继续打',
    tip: '胡牌后继续，牌墙空结束',
    kind: 'mj',
  },
  {
    id: 'xuezhan_mj',
    name: '血战到底',
    seats: 4,
    blurb: '胡了出局',
    tip: '胡牌出局，剩一人结束',
    kind: 'mj',
  },
  {
    id: 'hongzhong_mj',
    name: '红中麻将',
    seats: 4,
    blurb: '红中癞子 · 无吃',
    tip: '红中万能牌，无吃牌',
    kind: 'mj',
  },
  {
    id: 'shaoyang_phz',
    name: '邵阳跑胡子',
    seats: 3,
    blurb: '字牌 · 同牌叠列',
    tip: '同牌叠列，点列顶牌选中再打出',
    kind: 'phz',
  },
  {
    id: 'doudizhu',
    name: '斗地主',
    seats: 3,
    blurb: '叫分 · 飞机连对',
    tip: '多选手牌后出牌；可看记牌器',
    kind: 'poker',
  },
  {
    id: 'paodekuai',
    name: '跑得快',
    seats: 3,
    blurb: '十六张 · 红桃3',
    tip: '首出须带红桃3；多选后出牌',
    kind: 'poker',
  },
];

export function gameMeta(id: GameType): GameMeta {
  return GAME_CATALOG.find((g) => g.id === id) || GAME_CATALOG[0];
}

export function isMj(id: GameType) {
  return gameMeta(id).kind === 'mj';
}

export function isPoker(id: GameType) {
  return gameMeta(id).kind === 'poker';
}
