# 演示站部署

## Web Mobile

```bash
# Cocos 构建后：
./deploy/optimize-web-mobile.sh
rsync -avz --delete client/build/web-mobile/ seafile:/opt/xiangzhuo-site/web/
```

## Nginx（gzip + 缓存）

配置：`deploy/nginx/default.conf` → 服务器 `/opt/xiangzhuo-site/nginx/default.conf`

```bash
rsync -avz deploy/nginx/default.conf seafile:/opt/xiangzhuo-site/nginx/default.conf
ssh seafile 'docker exec xiangzhuo-web nginx -t && docker exec xiangzhuo-web nginx -s reload'
```

手机端慢的主因曾是未开 gzip：引擎 JS ~3MB 原样下发，压缩后约 0.7MB。
