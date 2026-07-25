# 湘桌 · XiangZhuo（Skynet + Cocos Creator 3.8.8）

湖南多玩法棋牌平台：**长沙麻将**已上线，邵阳跑胡子预留；后续可接象棋/围棋等。

技术栈：后端 **Skynet/Lua**，前端 **Cocos Creator 3.8.8**，WebSocket JSON 协议 `:20480`。

## 快速开始

### 1. 服务端

```bash
cd server
./run.sh
# ws://0.0.0.0:20480  JSON platform
```

### 2. 客户端

1. Cocos Creator 3.8.8 打开 `client/`
2. 预览 Login；本地 `?serverAddr=127.0.0.1:20480`
3. DEV 登录 → 创建房间（长沙）→ 确定开局（自动 3 机器人）

### 3. 远程演示

- 浏览器：https://xiangzhuo.xiandan.me/
- WSS：`wss://xiangzhuo.xiandan.me/websocket`
- 旧域名 `whmj.xiandan.me` 仍可访问（过渡期）
- 文档：[docs/NETWORK.md](docs/NETWORK.md)、[docs/DEPLOY_SEAFILE.md](docs/DEPLOY_SEAFILE.md)

## 目录

| 路径 | 说明 |
|------|------|
| `server/lualib/platform/` | JSON 协议 |
| `server/lualib/game/changsha_mj/` | 长沙麻将引擎 |
| `server/lualib/game/shaoyang_phz/` | 跑胡子占位 |
| `client/assets/scripts/comm/NetBus.ts` | 客户端总线 |
| `docs/PROTOCOL_PLATFORM.md` | 协议 |
| `docs/RULES_CHANGSHA.md` | 规则 |
| `upgrade/` | 对标欢乐麻将任务循环（见 [LOOP.md](upgrade/LOOP.md)） |

## 许可

MIT。
