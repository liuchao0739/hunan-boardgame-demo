# 网络说明（威海麻将）

## 本地

```bash
cd server && ./run.sh          # ws://0.0.0.0:20480
# 可选存储
cd docker && docker compose up -d
```

客户端（Cocos 3.8.8 预览或构建页）：

```
?serverAddr=127.0.0.1:20480
```

## 远程

1. 服务器开放 TCP **20480**（或 Nginx/Caddy 反代 `wss://domain/websocket` → `127.0.0.1:20480`）
2. 客户端 `serverAddr=<公网IP或域名>:20480`（HTTPS 页面自动用 `wss://`）
3. Seafile 同机部署步骤见 [DEPLOY_SEAFILE.md](./DEPLOY_SEAFILE.md)

### 当前公网游戏服（演示）

```
wss://chaoren.xiandan.me/websocket
```

落地页：https://chaoren.xiandan.me/whmj/

Creator 预览（须写完整 `wss://`，预览页是 http 不会自动升级）：

```
?serverAddr=wss://chaoren.xiandan.me/websocket
```

## 与旧湘桌差异

旧 Demo JSON `:9948` 已废弃。现协议为威海 **MsgBus Protobuf `:20480`**。
