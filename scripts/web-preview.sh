#!/usr/bin/env bash
# 仅提供牌桌静态页预览（逻辑在 Skynet :9948）
set -euo pipefail
cd "$(dirname "$0")/.."
PORT="${PORT:-3789}"
echo "Web 预览 http://127.0.0.1:${PORT}  (WS → ws://127.0.0.1:9948)"
npx --yes serve public -l "$PORT"
