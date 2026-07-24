# 远程部署（Seafile 同机 VPS）

目标机：与 [chaoren.xiandan.me](https://chaoren.xiandan.me) / Seafile 同机香港轻量（`47.242.242.119`）。

## 能放吗？

| 组件 | 结论 |
|------|------|
| Skynet 服务端 `:20480` | **可以**，内存占用很小，与现有 Docker/Caddy 并存 |
| Cocos Web 静态页 | **可以**（需本机 Creator **构建发布 → Web Mobile** 后 rsync） |
| 域名 HTTPS + WSS | **可以**，复用 `seafile-caddy`（需 DNS：`whmj.xiandan.me` → 该 IP） |

注意：2核2G 已跑 Seafile，勿再堆重服务；麻将服足够轻。

## 一键部署服务端

在服务器上：

```bash
mkdir -p /opt/whmj && cd /opt/whmj
git clone --recursive https://github.com/liuchao0739/hunan-boardgame-demo.git .
# 若已有仓库：git pull && git submodule update --init --recursive

cd server
# 首次需编译 skynet（需 build-essential）
# apt-get install -y build-essential git
# cd skynet && make linux && cd ..

./run.sh
# 监听 0.0.0.0:20480
```

放行端口（若用 ufw）：

```bash
ufw allow 20480/tcp
```

## 客户端连远程

本地 Creator 预览地址栏：

```
?serverAddr=47.242.242.119:20480
```

或登录页服务器地址填：`47.242.242.119:20480`。

HTTPS 站点下会自动改用 `wss://`（见 `MsgBus.ts`）。

## 域名演示（推荐）

1. DNS 添加：`whmj.xiandan.me` A → `47.242.242.119`
2. Caddy（docker-proxy）为静态站 + 反代 WebSocket（示例，按你现有 compose 网络调整）：

```yaml
# /opt/whmj/docker-compose.web.yml 示意
services:
  whmj-web:
    image: nginx:1.27-alpine
    volumes:
      - ./web:/usr/share/nginx/html:ro
    networks: [seafile-net]
    labels:
      caddy: whmj.xiandan.me
      caddy.reverse_proxy: "{{upstreams 80}}"
    mem_limit: 32m
```

WebSocket 直连公网端口时，登录填：

```
whmj.xiandan.me:20480
```

若只开 443、不开 20480，需 Caddy 把 `/websocket` 反代到 `127.0.0.1:20480`（并保证 MsgBus 使用 `wss://whmj.xiandan.me/websocket`）。

## 演示地址（已上线）

| 用途 | 地址 |
|------|------|
| **浏览器游玩** | https://whmj.xiandan.me/ |
| 游戏服 WSS | `wss://whmj.xiandan.me/websocket` |
| Creator 联机 | `?serverAddr=wss://whmj.xiandan.me/websocket` |
| 直连备选 | `ws://47.242.242.119:20480/websocket`（需防火墙 20480） |
| 源码 | https://github.com/liuchao0739/hunan-boardgame-demo |

### 更新 Web 静态资源

本机构建后上传：

```bash
# Creator CLI
/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator \
  --project /path/to/client \
  --build "platform=web-mobile;debug=false;md5Cache=true;configPath=./build-config-web-mobile.json"

rsync -avz --delete client/build/web-mobile/ seafile:/opt/whmj-site/web/
```


## 构建 Web 客户端

在装有 **Cocos Creator 3.8.8** 的机器上：

1. 打开 `client/` → 构建发布 → **Web Mobile**
2. 输出目录 rsync 到服务器 `/opt/whmj/web/`
3. 构建参数或入口带默认 `serverAddr=47.242.242.119:20480`（或域名）

无 Web 构建时，仍可用 Creator 预览 + 远程 `serverAddr` 联机演示。
