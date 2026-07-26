#!/usr/bin/env bash
# MySQL 备份脚本（T080）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="${XIANGZHUO_BACKUP_DIR:-$ROOT/backups/mysql}"
STAMP="$(date +%Y%m%d_%H%M%S)"

HOST="${XIANGZHUO_MYSQL_HOST:-127.0.0.1}"
PORT="${XIANGZHUO_MYSQL_PORT:-3306}"
DB="${XIANGZHUO_MYSQL_DB:-mj_game}"
USER="${XIANGZHUO_MYSQL_USER:-root}"
PASS="${XIANGZHUO_MYSQL_PASSWORD:-weihai}"

mkdir -p "$BACKUP_DIR"
OUT="$BACKUP_DIR/${DB}_${STAMP}.sql.gz"

echo "[backup_mysql] dumping $DB @ $HOST:$PORT -> $OUT"
mysqldump -h "$HOST" -P "$PORT" -u "$USER" -p"$PASS" \
  --single-transaction --routines --triggers "$DB" | gzip -9 > "$OUT"

echo "[backup_mysql] done $(du -h "$OUT" | awk '{print $1}')"
