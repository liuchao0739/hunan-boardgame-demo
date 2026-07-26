#!/usr/bin/env python3
"""WebSocket 压测基线：guestLogin + createRoom（T082）"""
from __future__ import annotations

import argparse
import asyncio
import json
import time
import uuid

try:
    import websockets
except ImportError:
    raise SystemExit("pip install websockets")


def env_msg(ns: str, cmd: str, body: dict | None = None, req_id: int = 1) -> str:
    return json.dumps({
        "v": 1,
        "ns": ns,
        "cmd": cmd,
        "reqId": req_id,
        "body": body or {},
    })


async def one_client(uri: str, game_id: str, idx: int) -> tuple[bool, float]:
    t0 = time.perf_counter()
    try:
        async with websockets.connect(uri, open_timeout=5) as ws:
            device = f"bench-{uuid.uuid4().hex[:12]}-{idx}"
            await ws.send(env_msg("platform", "guestLogin", {"deviceId": device}, 1))
            raw = await asyncio.wait_for(ws.recv(), timeout=5)
            msg = json.loads(raw)
            if msg.get("cmd") == "error":
                return False, time.perf_counter() - t0

            await ws.send(env_msg("platform", "createRoom", {"gameId": game_id}, 2))
            raw = await asyncio.wait_for(ws.recv(), timeout=5)
            msg = json.loads(raw)
            ok = msg.get("cmd") != "error" and msg.get("body", {}).get("roomId")
            return bool(ok), time.perf_counter() - t0
    except Exception:
        return False, time.perf_counter() - t0


async def main() -> None:
    p = argparse.ArgumentParser(description="WS login+create bench")
    p.add_argument("--uri", default="ws://127.0.0.1:20480/websocket")
    p.add_argument("--game", default="changsha_mj")
    p.add_argument("-n", "--count", type=int, default=10)
    p.add_argument("-c", "--concurrency", type=int, default=5)
    args = p.parse_args()

    sem = asyncio.Semaphore(args.concurrency)
    results: list[tuple[bool, float]] = []

    async def run(i: int) -> None:
        async with sem:
            results.append(await one_client(args.uri, args.game, i))

    await asyncio.gather(*(run(i) for i in range(args.count)))

    ok = sum(1 for s, _ in results if s)
    lat = [ms for s, ms in results if s]
    avg = (sum(lat) / len(lat)) if lat else 0.0
    print(f"total={args.count} ok={ok} fail={args.count - ok} avg_ok_ms={avg * 1000:.1f}")


if __name__ == "__main__":
    asyncio.run(main())
