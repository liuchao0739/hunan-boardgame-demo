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
| `platform` | 登录 / 注册 / 游客 / 资料 / 战绩 / 建房 / 加入 / 准备 / 同步 / 离开 / ping / 重连 / 托管 / 解散 / 匹配 / 俱乐部 / 经济 / 互动 |
| `changsha_mj` | 长沙麻将操作 |
| `shaoyang_phz` | 预留 |

## platform 命令

| cmd | body | 回包 |
|-----|------|------|
| register | `{ name, password }` | loginResult（注册并登录） |
| login | `{ name?, password?, mode?, deviceId? }` | loginResult（含 ticket、headImg、roomCard、diamond、ukeyExpireAt、dailyGift?） |
| guestLogin | `{ deviceId }` | loginResult（设备游客，无密码） |
| reconnect / loginTicket | `{ ticket }` | reconnectResult + state（若在房）；过期回 `error` 提示重登 |
| refreshTicket | `{ ticket? }` | refreshTicketResult `{ ticket, ukeyExpireAt }`；过期回 `error` |
| ping | `{}` | pong（可未登录） |
| getRecords / listRecords | `{ page?, pageSize? }` | getRecordsResult `{ list[], page, pageSize, total }` |
| updateProfile | `{ userName?, headImg? }` | updateProfileResult |
| listGames | `{}` | listGamesResult |
| createRoom | `{ gameId, rules? }` | createRoomResult + state；`rules.fillBots=false` 不补机器人；`rules.password` 可选私密房密码；`rules.cost` 局结策略 `consume`/`refund`/`none` |
| joinRoom | `{ roomId, password? }` | joinRoomResult + state；有密码房需传 `password` |
| prepare | `{ yes? }` | prepareResult + state；`between_round` 时全员准备开下一局 |
| autoPlay | `{ yes? }` | autoPlayResult + state |
| dissolveVote | `{ agree?, cancel? }` | dissolveResult + state；全员同意则 `dissolved` |
| sync | `{ roomId? }` | syncResult + state；**仅房间成员**可同步，非成员不可旁观他人房 |
| leave | `{}` | leaveResult |
| quickMatch / enqueueMatch | `{ gameId? }` | matchQueueResult `{ ok, queued, gameId, position, need }`；满 4 人推送 `matchResult` |
| cancelMatch | `{}` | cancelMatchResult `{ ok, cancelled? }` |
| createClub | `{ name?, clubName? }` | createClubResult `{ ok, clubId, clubName }` |
| joinClub | `{ clubId }` | joinClubResult |
| listClubs | `{}` | listClubsResult `{ clubs[] }` |
| sendEmoji | `{ emojiId, targetSeat? }` | sendEmojiResult；房间广播 push `emojiEvent` |
| sendPhrase | `{ phraseId, text? }` | sendPhraseResult；房间广播 push `phraseEvent` |
| kickPlayer | `{ userId \| targetUserId }` | kickPlayerResult；被踢者 push `kicked` |
| getBalance | `{}` | getBalanceResult `{ roomCard, diamond }` |
| getLedger | `{ page?, pageSize? }` | getLedgerResult `{ list[], page, pageSize, total }` |
| shopList | `{}` | shopListResult `{ items[] }` |
| exchangeDiamond | `{ amount }` | exchangeDiamondResult `{ roomCard, diamond, gained, spentDiamond }` |
| claimDailyGift | `{}` | claimDailyGiftResult `{ ok, gift?, roomCard }` |

### 推送事件（无 reqId）

| cmd | 说明 |
|-----|------|
| state | 房间权威快照 |
| emojiEvent | `{ roomId, fromUserId, emojiId, targetSeat?, at }` |
| phraseEvent | `{ roomId, fromUserId, phraseId, text, at }` |
| matchResult | `{ ok, roomId, state? }` 匹配成桌 |
| kicked | `{ reason, message }` 单点登录或房主踢人 |

### 账号与 ticket

- 注册/账号登录：`password` 经 SHA1 hex 哈希写入 `users.password_hash`。
- 游客：`deviceId` 绑定 `users.device_id`，首次自动创建游客账号。
- ticket TTL：默认 7 天（`XIANGZHUO_TICKET_TTL` / `config.ticket_ttl`），Redis 不可用时内存表同样过期。
- `refreshTicket`：校验旧 ticket 后签发新 ticket 并删除旧值；`reconnect` / `by_ticket` 在过期时返回「请重新登录」。
- 每日登录赠房卡：登录时自动尝试（`config.economy.daily_login_gift`，默认 2），`loginResult.dailyGift` 返回本次赠送数；也可 `claimDailyGift` 手动领取 stub。

### 房卡经济

| 配置 / 环境变量 | 默认 | 说明 |
|----------------|------|------|
| `create_room_cost` / `XIANGZHUO_CREATE_ROOM_COST` | 1 | 创房扣房卡；余额不足拒绝 |
| `daily_login_gift` / `XIANGZHUO_DAILY_GIFT` | 2 | 每日首次登录赠送 |
| `diamond_to_room_card` / `XIANGZHUO_DIA_RATE` | 10 | 兑换 stub：每 1 钻石换 N 房卡 |
| `rules.cost` | `consume` | 局结策略：`consume` 记消耗、`refund` 返还创房费、`none` 不变 |

- 账本表 `room_card_ledger`；`ref_id` 唯一保证同 `roomId` 创房扣费幂等（`create_room:{roomId}`）。
- 匹配成桌（`matchMade`）不扣房卡。

### 管理员 HTTP（T090 stub）

只读运维接口，默认端口 **20481**（`XIANGZHUO_ADMIN_PORT`），密钥 `XIANGZHUO_ADMIN_KEY`（默认 `xiangzhuo-admin`）。

| 路径 | 说明 |
|------|------|
| `GET /admin/listOnline?key=...` | 在线用户 `{ ok, count, online[] }` |

也可通过请求头 `X-Admin-Key` 传密钥。

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
- `quickMatch(gameId)` / `cancelMatch()` — 匹配队列
- `getBalance()` / `getLedger()` / `shopList()` / `exchangeDiamond(amount)`
- `sendEmoji(emojiId)` / `sendPhrase(phraseId)` / `kickPlayer(userId)`
- `NetBus.copyToClipboard(text)` — 分享房间号
- `onConnState(fn)` — `connected` / `reconnecting` / `network_poor` / `disconnected`
- `startKeepalive()` — 每 15s ping，连续丢包提示网络差

升级任务循环见 [`upgrade/LOOP.md`](../upgrade/LOOP.md).
