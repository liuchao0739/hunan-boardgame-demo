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
| `platform` | 登录 / 建房 / 加入 / 准备 / 同步 / 离开 / ping / 重连 / 托管 / 解散 |
| `changsha_mj` | 长沙麻将操作 |
| `shaoyang_phz` | 预留 |

## platform 命令

| cmd | body | 回包 |
|-----|------|------|
| login | `{ name }` | loginResult（含 ticket） |
| reconnect / loginTicket | `{ ticket }` | reconnectResult + state（若在房） |
| ping | `{}` | pong（可未登录） |
| listGames | `{}` | listGamesResult |
| createRoom | `{ gameId, rules? }` | createRoomResult + state；`rules.fillBots=false` 不补机器人 |
| joinRoom | `{ roomId }` | joinRoomResult + state |
| prepare | `{ yes? }` | prepareResult + state；`between_round` 时全员准备开下一局 |
| autoPlay | `{ yes? }` | autoPlayResult + state |
| dissolveVote | `{ agree?, cancel? }` | dissolveResult + state；全员同意则 `dissolved` |
| sync | `{}` | syncResult + state |
| leave | `{}` | leaveResult |

### 断线与会话

- WebSocket `close`：对局进行中仅标记座位 `disconnected=true`，保留 `user_room` 映射（宽限 **60s**，见 `config.reconnect_grace_sec`）。
- 宽限超时：座位替换为空位机器人，清除 `user_room`。
- 同账号新 `login` / `reconnect`：推送 `kicked` 并关闭旧连接（单点登录）。

权威快照推送：`cmd=state`，`body` 含 `roomId/gameId/state/seats/game`。

`seats[]` 字段：`seat/userId/userName/isBot/ready/disconnected/autoPlay`。

`game` 快照（长沙麻将）额外含：`deadlineAt`（unix 秒）、`deadlineMs`（剩余毫秒，客户端倒计时）。

## changsha_mj 命令

`discard` / `chi` / `peng` / `ming_gang` / `an_gang` / `bu_gang` / `hu` / `zimo` / `guo` / `continue`

操作超时（默认 15s）：服务端自动 `discard` 或 `guo`。

## 客户端

[`NetBus.ts`](../client/assets/scripts/comm/NetBus.ts)：

- `NetBus.ins.request(ns, cmd, body)`
- `reconnectWithTicket(ticket?)` — ticket 重连并拉 snapshot
- `onConnState(fn)` — `connected` / `reconnecting` / `network_poor` / `disconnected`
- `startKeepalive()` — 每 15s ping，连续丢包提示网络差

升级任务循环见 [`upgrade/LOOP.md`](../upgrade/LOOP.md)。
