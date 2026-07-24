# 威海麻将（Skynet + Cocos Creator 3.8.8）

完整复刻 [hjj2017/whmj](https://github.com/hjj2017/whmj.cocos2d_client) 玩法与 **MsgBus/Protobuf** 协议，后端 **Skynet/Lua**，前端 **Cocos Creator 3.8.8**。

对照仓（本地 gitignore）：`_refs/whmj.cocos2d_client`、`_refs/whmj.java_server`。

## 快速开始

### 1. 服务端

```bash
cd server
./run.sh
# 监听 ws://0.0.0.0:20480
```

可选：

```bash
cd docker && docker compose up -d   # MySQL + Redis
```

### 2. 客户端

1. 安装 **Cocos Creator 3.8.8**
2. Dashboard 打开本仓库 `client/`
3. 按 [client/SCENE_SETUP.md](client/SCENE_SETUP.md) 确认 Login / Hall / Table
4. 预览；本地：`?serverAddr=127.0.0.1:20480`

登录：DEV（`loginMethod=0`）。单机可「创建房间」自动配 3 机器人。

### 3. 远程演示

见 [docs/NETWORK.md](docs/NETWORK.md)、[docs/DEPLOY_SEAFILE.md](docs/DEPLOY_SEAFILE.md)。

- **浏览器游玩**：https://whmj.xiandan.me/
- 游戏服：`wss://whmj.xiandan.me/websocket`
- Creator 预览：`?serverAddr=wss://whmj.xiandan.me/websocket`

## 当前进度（摘要）

- 登录 / 大厅 / 四家牌桌、机器人、碰胡过、荒庄结算、回大厅
- 手牌：再点同一张出牌；剩余张数随摸牌更新
- 美术：桌布、牌面、操作钮、Spine 立绘资源（需引擎勾选 Spine）

## 目录

| 路径 | 说明 |
|------|------|
| `server/` | Skynet 网关 + 房间 + 威海牌局 |
| `server/protocol/` | 原版 `.proto` |
| `client/assets/scripts/` | MsgBus / 登录 / 大厅 / 牌桌 |
| `docs/PROTOCOL_WEIHAI.md` | 协议说明 |
| `docs/DEPLOY_SEAFILE.md` | 与 Seafile VPS 同机部署 |

## 许可

服务端/客户端自研代码 MIT；蓝本威海工程遵循其 Apache-2.0，仅作对照。
