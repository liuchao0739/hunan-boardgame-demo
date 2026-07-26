# 远程部署（湘桌 / Seafile 同机）

## 演示

| 用途 | 地址 |
|------|------|
| 浏览器 | https://xiangzhuo.xiandan.me/ |
| WSS | `wss://xiangzhuo.xiandan.me/websocket` |
| Creator | `?serverAddr=wss://xiangzhuo.xiandan.me/websocket` |

## systemd 服务

生产机使用 unit 名 **`xiangzhuo`**（非旧项目名）：

```ini
# /etc/systemd/system/xiangzhuo.service（示例）
[Unit]
Description=XiangZhuo Skynet game server
After=network.target mysql.service redis.service

[Service]
Type=simple
WorkingDirectory=/opt/xiangzhuo/server
ExecStart=/opt/xiangzhuo/server/run.sh
Restart=on-failure
Environment=XIANGZHUO_WS_PORT=20480

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable xiangzhuo
sudo systemctl restart xiangzhuo
systemctl status xiangzhuo
journalctl -u xiangzhuo -f
```

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

## MySQL 备份

```bash
./scripts/backup_mysql.sh
# 环境变量：XIANGZHUO_MYSQL_* / XIANGZHUO_BACKUP_DIR
```

## 演示站升级检查清单（T085）

部署或版本升级后逐项确认：

- [ ] `git pull` + `submodule update` 无冲突
- [ ] `./scripts/verify_upgrade.sh` 通过（含 Lua 单测）
- [ ] `systemctl restart xiangzhuo` 后 `active (running)`
- [ ] `curl -I https://xiangzhuo.xiandan.me/` 200
- [ ] 浏览器 Login → 长沙麻将 createRoom → 确定开局
- [ ] 大厅切换邵阳跑胡子 → createRoom 成功
- [ ] `./scripts/bench_ws.py -n 20` 成功率 > 95%（可选基线）
- [ ] `./scripts/backup_mysql.sh` 产出 gzip（若启用 MySQL）
- [ ] 静态站 rsync 后强制刷新缓存验证

## 升级循环

对标任务见仓库 [upgrade/LOOP.md](../upgrade/LOOP.md)；验收脚本 `./scripts/verify_upgrade.sh`。

详见 Seafile：[湘桌-xiangzhuo-部署实战记录.md](/Users/liuchao/Seafile/私人资料库/04-服务部署/湘桌-xiangzhuo-部署实战记录.md)。
