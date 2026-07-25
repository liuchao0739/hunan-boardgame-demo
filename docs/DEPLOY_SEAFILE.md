# 远程部署（湖南棋牌 / Seafile 同机）

## 演示

| 用途 | 地址 |
|------|------|
| 浏览器 | https://whmj.xiandan.me/ |
| WSS | `wss://whmj.xiandan.me/websocket` |
| Creator | `?serverAddr=wss://whmj.xiandan.me/websocket` |

## 服务端更新

```bash
ssh seafile
cd /opt/whmj && git pull && git submodule update --init --recursive
systemctl restart whmj
systemctl status whmj
```

## 前端更新

本机构建 Web Mobile 后：

```bash
rsync -avz --delete client/build/web-mobile/ seafile:/opt/whmj-site/web/
```

详见 [威海麻将-whmj-部署实战记录.md](/Users/liuchao/Seafile/私人资料库/04-服务部署/威海麻将-whmj-部署实战记录.md)（域名暂沿用 whmj）。
