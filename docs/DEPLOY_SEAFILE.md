# 远程部署（湘桌 / Seafile 同机）

## 演示

| 用途 | 地址 |
|------|------|
| 浏览器 | https://xiangzhuo.xiandan.me/ |
| WSS | `wss://xiangzhuo.xiandan.me/websocket` |
| Creator | `?serverAddr=wss://xiangzhuo.xiandan.me/websocket` |
| 过渡旧域名 | https://whmj.xiandan.me/（同站） |

## 服务端更新

```bash
ssh seafile
cd /opt/xiangzhuo && git pull && git submodule update --init --recursive
systemctl restart xiangzhuo
systemctl status xiangzhuo
```

## 前端更新

本机构建 Web Mobile 后：

```bash
rsync -avz --delete client/build/web-mobile/ seafile:/opt/xiangzhuo-site/web/
```

详见 [湘桌-xiangzhuo-部署实战记录.md](/Users/liuchao/Seafile/私人资料库/04-服务部署/湘桌-xiangzhuo-部署实战记录.md)。
