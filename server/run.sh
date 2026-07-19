#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if [[ ! -x ./skynet/skynet ]]; then
  echo "正在编译 Skynet…"
  make -C skynet macosx
fi
echo "启动 Skynet 棋牌服 → ws://0.0.0.0:9948"
exec ./skynet/skynet config
