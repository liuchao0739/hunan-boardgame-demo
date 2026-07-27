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
| `server/lualib/game/shaoyang_phz/` | 跑胡子 MVP 引擎 |
| `server/lualib/game/chess/`、`go/` | 象棋/围棋占位 |
| `client/assets/scripts/comm/NetBus.ts` | 客户端总线 |
| `docs/PROTOCOL_PLATFORM.md` | 协议 |
| `docs/RULES_CHANGSHA.md` | 规则 |
| `docs/REFERENCES.md` | 上游参考（威海 / 口袋麻将）与目录映射 |
| `upgrade/` | 对标欢乐麻将任务循环（见 [upgrade/LOOP.md](upgrade/LOOP.md)） |

## 上游参考

客户端与观感主要参考 [威海麻将](https://github.com/hjj2017/whmj.cocos2d_client) + [口袋麻将](https://github.com/winktzhong/PocketMahjongClient)；协议与房间模型自 [威海 Java 服](https://github.com/hjj2017/whmj.java_server) 演进为 Skynet JSON。本地对照：`./scripts/update_refs.sh` → `_refs/`。详见 [docs/REFERENCES.md](docs/REFERENCES.md)。

## 升级循环

仓库 `upgrade/` 维护 **100 项对标任务**（`specs/` + `progress.json`）。循环指令见 [upgrade/LOOP.md](upgrade/LOOP.md)：

1. 从 `progress.json` 取下一个 `pending` task  
2. 按 `upgrade/specs/Txxx.md` 实现并自测  
3. 更新 progress、commit，直至全部 `done`

本地总验收：`./scripts/verify_upgrade.sh`

## 许可

MIT。
