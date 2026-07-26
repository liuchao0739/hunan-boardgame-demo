import { director } from 'cc';

/** 按 gameId 路由牌桌场景（T075） */
const TABLE_SCENE = 'Table';
const PLACEHOLDER_SCENE = 'TablePlaceholder';

const PLACEHOLDER_GAMES = new Set(['chess', 'go']);

export function tableSceneFor(gameId?: string): string {
  const id = gameId || 'changsha_mj';
  if (PLACEHOLDER_GAMES.has(id)) return PLACEHOLDER_SCENE;
  return TABLE_SCENE;
}

export function gameDisplayName(gameId?: string): string {
  switch (gameId) {
    case 'changsha_mj': return '长沙麻将';
    case 'shaoyang_phz': return '邵阳跑胡子';
    case 'chess': return '象棋';
    case 'go': return '围棋';
    default: return gameId || '未知玩法';
  }
}

export function loadTableScene(gameId?: string): Promise<void> {
  const scene = tableSceneFor(gameId);
  return new Promise((resolve, reject) => {
    director.loadScene(scene, (err) => {
      if (err && scene !== TABLE_SCENE) {
        console.warn('[TableRouter] fallback to Table', err);
        director.loadScene(TABLE_SCENE, (err2) => (err2 ? reject(err2) : resolve()));
        return;
      }
      if (err) reject(err);
      else resolve();
    });
  });
}
