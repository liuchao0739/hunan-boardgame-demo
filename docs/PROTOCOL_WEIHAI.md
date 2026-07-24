# 威海麻将协议对照（MsgBus / Protobuf）

蓝本：[_refs/whmj.java_server/etc/protocol](../server/protocol) · 客户端帧编解码见原版 `MsgBus.ts`。

## 帧格式

```
uint16_be length = 2 + bodyLen   // 含 msgCode 的 2 字节
uint16_be msgCode
bytes     protobuf_body
```

WebSocket：**binary** 帧，路径习惯 `/websocket`（本服接受任意 path）。

网关端口：**20480**（对齐原 proxyserver）。

## 消息号（节选）

| Code | 名称 | 模块 |
|------|------|------|
| 101/102 | UserLoginCmd/Result | passport |
| 201/202 | GetMyDetailzCmd/Result | hall |
| 203/204 | GetJoinedRoomIdCmd/Result | hall |
| 205/206 | CreateRoomCmd/Result | hall |
| 207/208 | JoinRoomCmd/Result | hall |
| 1021–1023 | Prepare* | MJ_weihai_ |
| 1031+ | Round / 摸打吃碰杠胡 / 亮风补风 | MJ_weihai_ |

完整枚举见 `server/protocol/*.proto` 与 `server/lualib/weihai/msg_code.lua`。

## 登录

`UserLoginCmd.loginMethod = 0` 为 DEV 测试登录；`propertyStr` JSON 可含 `testerName`。

URL：`?serverAddr=127.0.0.1:20480&DEV=1&testerName=张三`
