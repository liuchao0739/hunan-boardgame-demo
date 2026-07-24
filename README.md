# 威海麻将（Skynet + Cocos Creator 3.8.8）

完整复刻 [hjj2017/whmj](https://github.com/hjj2017/whmj.cocos2d_client) 玩法与 **MsgBus/Protobuf** 协议，后端用 **Skynet/Lua**，前端 **Cocos Creator 3.8.8**。

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
2. Dashboard 打开本仓库 `client/`（项目名可能仍显示旧备注，不影响）
3. **按 [client/SCENE_SETUP.md](client/SCENE_SETUP.md) 逐步建 Login / Hall / Table 并绑按钮**（必读）
4. 预览；地址可加 `?serverAddr=127.0.0.1:20480`

登录方式：DEV（`loginMethod=0`），名称来自输入框 / `testerName`。

### 3. 远程

见 [docs/NETWORK.md](docs/NETWORK.md)。客户端将 `serverAddr` 改为公网地址即可。

## 目录

| 路径 | 说明 |
|------|------|
| `server/` | Skynet 网关 + 房间 + 威海牌局 |
| `server/protocol/` | 原版 `.proto` |
| `client/assets/scripts/` | MsgBus / 登录 / 大厅 / 牌桌 |
| `docs/PROTOCOL_WEIHAI.md` | 协议说明 |
| `_refs/` | 官方前后端蓝本（不提交） |

## 许可

服务端/客户端自研代码 MIT；蓝本威海工程遵循其 Apache-2.0，仅作对照。
