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

1. 服务器开放 TCP **20480**（或 Nginx 反代 `wss://domain/websocket` → `127.0.0.1:20480`）
2. 客户端 `serverAddr=<公网IP或域名>:20480`（WSS 时需改 MsgBus 为 `wss://`）
3. `docker/docker-compose.yml` 可同机部署 MySQL/Redis；当前登录/房间默认内存实现，Compose 供后续持久化

## 与旧湘桌差异

旧 Demo JSON `:9948` 已废弃。现协议为威海 **MsgBus Protobuf `:20480`**。
