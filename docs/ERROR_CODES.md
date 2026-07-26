# 湘桌错误码与消息表

平台协议以 JSON `error` 回包为主，`body.message` 为人类可读说明。以下为常见错误归类。

## 登录 / 会话

| message 关键词 | 场景 | 客户端建议 |
|----------------|------|------------|
| 请先登录 | 未 login 调平台命令 | 跳转 Login |
| ticket 无效或已过期 | reconnect 失败 | 重新 guestLogin/login |
| 账号在其他设备登录 | kicked duplicate_login | 提示被顶号 |

## 房间

| message | 场景 |
|---------|------|
| 未知 gameId: * | createRoom 或 game ns 未注册 |
| 玩法未开放: * | feature flag 关闭 |
| 已在房间中 | 重复 create |
| 房间不存在 | join 无效 roomId |
| 房间密码错误 | 密码房 join |
| 房卡不足，需要 * | 经济系统扣卡失败 |
| 不在房间 | sync/action 时无映射 |
| 未开局 | action 在 waiting |
| game 命名空间不匹配: 期望 *，收到 * | ws ns 与房间 gameId 不一致 |

## 对局操作

| message | 场景 |
|---------|------|
| 未轮到出牌 | discard 时机错误 |
| 缺 tile / 非法牌 / 手牌无此牌 | 出牌参数 |
| 非抢牌阶段 | guo/chi/peng 等 |
| * 规则尚未实现（占位） | 跑胡子 chi/peng/ti/pao MVP |
| 象棋尚未开放 / 围棋尚未开放 | 占位引擎 |

## 协议

| message | 场景 |
|---------|------|
| 协议错误: * | JSON 解析失败 |
| 未知平台命令 * | platform cmd 未实现 |
| 服务器错误 | 内部异常 |

## HTTP Admin（20481）

| 响应 | 说明 |
|------|------|
| `{ ok: false, error: "unauthorized" }` | admin key 错误 |
| `{ ok: false, error: "not_found" }` | 路径不存在 |

## 扩展约定

- 新增错误优先复用 `message` 字符串，保持中文一致
- 需要机器可读码时可在 body 增加 `code` 字段（预留，当前 MVP 未强制）
