#!/usr/bin/env bash
# 升级完成验收脚本（T100）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FAIL=0

check() {
  if eval "$2"; then
    echo "  OK  $1"
  else
    echo "  FAIL $1"
    FAIL=$((FAIL + 1))
  fi
}

echo "== xiangzhuo verify_upgrade =="

check "registry.lua" "test -f '$ROOT/server/lualib/game/registry.lua'"
check "shaoyang_phz tiles" "test -f '$ROOT/server/lualib/game/shaoyang_phz/tiles.lua'"
check "chess stub" "test -f '$ROOT/server/lualib/game/chess/init.lua'"
check "go stub" "test -f '$ROOT/server/lualib/game/go/init.lua'"
check "features.lua" "test -f '$ROOT/server/lualib/platform/features.lua'"
check "log.lua" "test -f '$ROOT/server/lualib/platform/log.lua'"
check "metrics.lua" "test -f '$ROOT/server/lualib/platform/metrics.lua'"
check "TableRouter.ts" "test -f '$ROOT/client/assets/scripts/game/TableRouter.ts'"
check "RULES_SHAOYANG.md" "test -f '$ROOT/docs/RULES_SHAOYANG.md'"
check "ERROR_CODES.md" "test -f '$ROOT/docs/ERROR_CODES.md'"
check "backup_mysql.sh" "test -x '$ROOT/scripts/backup_mysql.sh' || test -f '$ROOT/scripts/backup_mysql.sh'"
check "bench_ws.py" "test -f '$ROOT/scripts/bench_ws.py'"
check "CI workflow" "test -f '$ROOT/.github/workflows/lua-tests.yml'"
check "upgrade LOOP.md" "test -f '$ROOT/upgrade/LOOP.md'"
check "REFERENCES.md" "test -f '$ROOT/docs/REFERENCES.md'"
check "update_refs.sh" "test -x '$ROOT/scripts/update_refs.sh' || test -f '$ROOT/scripts/update_refs.sh'"

echo "-- registry bootstrap games --"
LUA="$ROOT/server/skynet/3rd/lua/lua"
if [[ -x "$LUA" ]]; then
  "$LUA" -e "
package.path='$ROOT/server/lualib/?.lua;$ROOT/server/lualib/?/init.lua;'..package.path
local R=require('game.registry')
R.bootstrap()
for _, id in ipairs({'changsha_mj','shaoyang_phz','chess','go'}) do
  assert(R.known(id), 'missing '..id)
end
print('registry ok')
"
else
  echo "  SKIP lua registry (no bundled lua)"
fi

echo "-- lua unit tests --"
if [[ -x "$LUA" ]]; then
  (cd "$ROOT/server" && "$LUA" test/run_tests.lua) || FAIL=$((FAIL + 1))
else
  echo "  SKIP run_tests.lua"
fi

if [[ $FAIL -eq 0 ]]; then
  echo "VERIFY_UPGRADE_PASS"
  exit 0
fi
echo "VERIFY_UPGRADE_FAIL ($FAIL checks)"
exit 1
