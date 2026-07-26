/**
 * 房间邀请链接：?room=房号&pwd=密码
 * 好友打开 → 登录 → 自动加入并进牌桌等待。
 */
export type RoomInvite = {
  roomId: number;
  password: string;
};

export function readInviteFromUrl(): RoomInvite | null {
  try {
    if (typeof window === 'undefined' || !window.location) return null;
    const u = new URL(window.location.href);
    const room = parseInt(u.searchParams.get('room') || u.searchParams.get('roomId') || '0', 10);
    const password = String(u.searchParams.get('pwd') || u.searchParams.get('password') || '').trim();
    if (room > 0 && password.length >= 4) return { roomId: room, password };
  } catch { /* ignore */ }
  return null;
}

export function buildInviteUrl(roomId: number, password: string): string {
  try {
    if (typeof location !== 'undefined' && location.origin) {
      const u = new URL(location.pathname || '/', location.origin);
      u.searchParams.set('room', String(roomId));
      u.searchParams.set('pwd', password);
      return u.toString();
    }
  } catch { /* ignore */ }
  return `https://xiangzhuo.xiandan.me/?room=${roomId}&pwd=${encodeURIComponent(password)}`;
}

/** 读完邀请后从地址栏去掉密码，避免截图泄露 */
export function clearInviteFromUrl() {
  try {
    if (typeof history === 'undefined' || typeof location === 'undefined') return;
    const u = new URL(location.href);
    let dirty = false;
    for (const k of ['room', 'roomId', 'pwd', 'password']) {
      if (u.searchParams.has(k)) {
        u.searchParams.delete(k);
        dirty = true;
      }
    }
    if (dirty) history.replaceState(null, '', u.pathname + (u.search || '') + (u.hash || ''));
  } catch { /* ignore */ }
}

export function stashRoomPassword(password: string) {
  (globalThis as any).__HNQP_ROOM_PWD__ = password;
}

export function peekRoomPassword(): string {
  return String((globalThis as any).__HNQP_ROOM_PWD__ || '');
}

export function clearRoomPassword() {
  try { delete (globalThis as any).__HNQP_ROOM_PWD__; } catch { /* */ }
}
