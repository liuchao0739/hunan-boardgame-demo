#!/usr/bin/env bash
# 拉取/更新上游参考仓库到 _refs/（本地对照用，不提交 git）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REFS="$ROOT/_refs"

mkdir -p "$REFS"

clone_or_pull() {
  local name="$1"
  local url="$2"
  local dir="$REFS/$name"

  if [[ -d "$dir/.git" ]]; then
    echo ">> pull $name"
    git -C "$dir" fetch origin
    git -C "$dir" pull --ff-only origin "$(git -C "$dir" rev-parse --abbrev-ref HEAD)"
  else
    echo ">> clone $name"
    git clone --depth 1 "$url" "$dir"
  fi
  git -C "$dir" log -1 --oneline
  echo
}

echo "== xiangzhuo update_refs =="
echo "target: $REFS"
echo

clone_or_pull PocketMahjongClient https://github.com/winktzhong/PocketMahjongClient.git
clone_or_pull whmj.cocos2d_client https://github.com/hjj2017/whmj.cocos2d_client.git
clone_or_pull whmj.java_server https://github.com/hjj2017/whmj.java_server.git

echo "done. See docs/REFERENCES.md for mapping."
