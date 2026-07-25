#!/usr/bin/env python3
"""Mark upgrade tasks done/failed and refresh stats."""
from __future__ import annotations
import json, sys
from datetime import datetime, timezone
from pathlib import Path

PROG = Path(__file__).resolve().parent / "progress.json"

def main() -> None:
    if len(sys.argv) < 3:
        print("usage: mark_done.py done|failed T002 [T003 ...]")
        sys.exit(1)
    status = sys.argv[1]
    ids = set(sys.argv[2:])
    data = json.loads(PROG.read_text(encoding="utf-8"))
    now = datetime.now(timezone.utc).isoformat()
    for t in data["tasks"]:
        if t["id"] in ids:
            t["status"] = status
            if status == "done":
                t["completed_at"] = now
            elif status == "failed":
                t["failed_at"] = now
    data["stats"]["done"] = sum(1 for t in data["tasks"] if t["status"] == "done")
    data["stats"]["pending"] = sum(1 for t in data["tasks"] if t["status"] == "pending")
    data["stats"]["failed"] = sum(1 for t in data["tasks"] if t["status"] == "failed")
    data["current_task"] = next((t["id"] for t in data["tasks"] if t["status"] == "pending"), None)
    # phase of current
    for t in data["tasks"]:
        if t["id"] == data["current_task"]:
            data["current_phase"] = t["phase"]
            break
    PROG.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(data["stats"], "next=", data["current_task"])

if __name__ == "__main__":
    main()
