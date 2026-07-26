#!/usr/bin/env bash
# 构建后轻量优化：缩短开屏、提高首包友好度
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB="$ROOT/client/build/web-mobile"
SETTINGS=$(ls "$WEB"/src/settings.*.json 2>/dev/null | head -1 || true)
if [[ -z "${SETTINGS:-}" ]]; then
  echo "no settings.json under $WEB" >&2
  exit 1
fi
python3 - "$SETTINGS" <<'PY'
import json, sys
from pathlib import Path
p = Path(sys.argv[1])
s = json.loads(p.read_text())
splash = s.setdefault('splashScreen', {})
# 默认 2000ms 开屏在手机上像“卡住”
old = splash.get('totalTime', 2000)
splash['totalTime'] = 600
assets = s.setdefault('assets', {})
# 首包并发略降，弱网更稳
assets['downloadMaxConcurrency'] = 8
p.write_text(json.dumps(s, ensure_ascii=False, separators=(',', ':')))
print(f'patched {p.name}: splash {old} -> 600, concurrency=8')
PY
