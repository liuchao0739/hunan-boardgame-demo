# 远程部署

## 服务器

1. 安装依赖：编译 Skynet（`cd server && make -C skynet linux` 或 macosx）
2. （可选）`cd docker && docker compose up -d`
3. `cd server && ./run.sh`，确认日志出现 `WS :20480`
4. 防火墙放行 **TCP 20480**（或仅本机 + Nginx）

### Nginx WSS 示例

```nginx
location /websocket {
  proxy_pass http://127.0.0.1:20480;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_set_header Host $host;
}
```

客户端 MsgBus 改为 `wss://your.domain`（改 `MsgBus.connect` 里协议与路径）。

## 客户端

构建 Web / 原生后，启动参数或页面 URL：

```
?serverAddr=<公网IP>:20480
```

或在登录页 Server 输入框填写。

## 安全

当前为教学/联调环境：DEV 登录无鉴权、房卡内存计数。上线前务必加鉴权、限流与 HTTPS/WSS。
