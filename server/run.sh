#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if [[ ! -x ./skynet/skynet ]]; then
  echo "正在编译 Skynet…"
  make -C skynet macosx
fi
echo "启动威海麻将 Skynet → ws://0.0.0.0:20480"
exec ./skynet/skynet config
