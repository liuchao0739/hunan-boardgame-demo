#!/usr/bin/env bash
# 打开 Cocos 工程（需已安装 Creator 3.8.8）
set -euo pipefail
PROJECT="/Users/liuchao/hunan-boardgame-demo/client"

CANDIDATES=(
  "/Applications/Cocos/Creator/3.8.8/CocosCreator.app"
  "/Applications/CocosCreator/Creator/3.8.8/CocosCreator.app"
  "/Applications/CocosCreator.app"
)

APP=""
for p in "${CANDIDATES[@]}"; do
  if [[ -d "$p" ]]; then APP="$p"; break; fi
done

# 也搜 Applications/Cocos
if [[ -z "$APP" ]]; then
  found=$(find /Applications/Cocos -name 'CocosCreator.app' 2>/dev/null | head -1 || true)
  if [[ -n "$found" ]]; then APP="$found"; fi
fi

if [[ -z "$APP" ]]; then
  echo "未找到 Cocos Creator 3.8.8。"
  echo "请安装：https://download.cocos.org/CocosCreator/v3.8.8/CocosCreator-v3.8.8-mac-010512.zip"
  echo "或打开下载页…"
  open "https://www.cocos.com/creator-download"
  open "/Users/liuchao/Downloads/cocos-install" 2>/dev/null || true
  exit 1
fi

echo "打开工程: $PROJECT"
echo "使用: $APP"
open -a "$APP" "$PROJECT"
