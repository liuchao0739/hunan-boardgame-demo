#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if [[ ! -x ./skynet/skynet ]]; then
  echo "正在编译 Skynet…"
  case "$(uname -s)" in
    Darwin) make -C skynet macosx ;;
    Linux)  make -C skynet linux ;;
    *)      echo "不支持的系统: $(uname -s)"; exit 1 ;;
  esac
fi
echo "启动威海麻将 Skynet → ws://0.0.0.0:20480"
exec ./skynet/skynet config
