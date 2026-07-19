#!/usr/bin/env bash
# 打开 Cocos 工程（需已通过 Dashboard 安装 Creator 3.8.8）
set -euo pipefail
PROJECT="/Users/liuchao/hunan-boardgame-demo/client"

CANDIDATES=(
  "/Applications/Cocos/Creator/3.8.8/CocosCreator.app"
  "/Applications/CocosCreator/Creator/3.8.8/CocosCreator.app"
  "$HOME/Library/Application Support/CocosCreator/3.8.8/CocosCreator.app"
)

APP=""
for p in "${CANDIDATES[@]}"; do
  if [[ -d "$p" ]]; then APP="$p"; break; fi
done

if [[ -z "$APP" ]]; then
  found=$(find /Applications/Cocos "$HOME/Library/Application Support" -name 'CocosCreator.app' 2>/dev/null | head -1 || true)
  if [[ -n "${found:-}" ]]; then APP="$found"; fi
fi

if [[ -z "$APP" ]]; then
  echo "尚未安装 Creator 3.8.8。"
  echo "请在 Cocos Dashboard 中："
  echo "  1) 登录账号"
  echo "  2) 左侧「编辑器」→ 找到 3.8.8 → 安装"
  echo "  3) 装完后再执行: ./open-creator.sh"
  open /Applications/CocosDashboard.app || true
  exit 1
fi

echo "打开工程: $PROJECT"
echo "使用: $APP"
open -a "$APP" "$PROJECT"
