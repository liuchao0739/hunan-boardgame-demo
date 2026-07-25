# 湘桌平台协议（JSON Envelope）

WebSocket：文本帧，路径 `/websocket`，端口 **20480**。

## 版本策略

| 字段 | 说明 |
|------|------|
| `v` | 协议主版本，当前 **1**。服务端忽略未知扩展字段；不认识的 `cmd` 回 `error`。 |
| 向前兼容 | 新增可选 body 字段不升主版本；破坏性变更升 `v` 并双轨过渡。 |

## 信封

```json
{
  "v": 1,
  "ns": "platform",
  "cmd": "login",
  "reqId": 1,
  "body": {}
}
```

| ns | 说明 |
|----|------|
| `platform` | 登录 / 建房 / 加入 / 准备 / 同步 / 离开 / ping |
| `changsha_mj` | 长沙麻将操作 |
| `shaoyang_phz` | 预留 |

## platform 命令

| cmd | body | 回包 |
|-----|------|------|
| login | `{ name }` | loginResult（含 ticket） |
| ping | `{}` | pong（可未登录） |
| listGames | `{}` | listGamesResult |
| createRoom | `{ gameId, rules? }` | createRoomResult + state |
| joinRoom | `{ roomId }` | joinRoomResult + state |
| prepare | `{ yes? }` | prepareResult + state |
| sync | `{}` | syncResult + state |
| leave | `{}` | leaveResult |

权威快照推送：`cmd=state`，`body` 含 `roomId/gameId/state/seats/game`。

## changsha_mj 命令

`discard` / `chi` / `peng` / `ming_gang` / `an_gang` / `bu_gang` / `hu` / `zimo` / `guo` / `continue`

## 客户端

[`NetBus.ts`](../client/assets/scripts/comm/NetBus.ts)：`NetBus.ins.request(ns, cmd, body)`。

升级任务循环见 [`upgrade/LOOP.md`](../upgrade/LOOP.md)。
