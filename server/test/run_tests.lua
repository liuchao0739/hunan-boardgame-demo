#!/usr/bin/env lua
-- 无 Skynet 可跑：cd server && ./skynet/3rd/lua/lua test/run_tests.lua
package.path = "./test/?.lua;./lualib/?.lua;./lualib/?/init.lua;" .. package.path

local failed = 0
local passed = 0

local function assert_true(cond, msg)
  if cond then
    passed = passed + 1
  else
    failed = failed + 1
    io.stderr:write("FAIL: " .. tostring(msg) .. "\n")
  end
end

local T = require "game.changsha_mj.tiles"
local Q = require "game.changsha_mj.qishou"
local Niao = require "game.changsha_mj.niao"
local Fan = require "game.changsha_mj.fan"
local Game = require "game.changsha_mj"
local JsonUtil = require "platform.jsonutil"

require("test.test_hu").run(assert_true)
require("test.test_meld").run(assert_true)
require("test.test_qishou").run(assert_true)

-- fan table queryable (T009)
do
  assert_true(Fan.get("ping_hu").fan == 1, "fan.get ping_hu")
  assert_true(#Fan.list() >= 5, "fan.list length")
  local fan, items = Fan.hu_fan({ is_zimo = true, is_jiang = true })
  assert_true(fan >= 4, "fan.hu_fan zimo+jiang")
  assert_true(#items >= 3, "fan.hu_fan items")
end

-- jiang vs ping (T014)
do
  local ping_fan = Fan.hu_fan({ is_zimo = false, is_jiang = false })
  local jiang_fan = Fan.hu_fan({ is_zimo = false, is_jiang = true })
  assert_true(jiang_fan > ping_fan, "jiang adds on ping")
end

-- gang deltas (T010)
do
  local d = Fan.gang_deltas("an_gang", 0, nil, 4)
  assert_true(d[0] == 6 and d[1] == -2, "an_gang deltas")
  d = Fan.gang_deltas("ming_gang", 1, 0, 4)
  assert_true(d[0] == -2 and d[1] == 4, "ming_gang deltas")
end

-- niao seat mapping (T017)
do
  assert_true(Niao.bird_hit_offset(0) == 0, "bird 1 wan -> offset 0")
  assert_true(Niao.bird_hit_offset(1) == 1, "bird 2 wan -> offset 1")
  assert_true(Niao.bird_hit_offset(2) == 2, "bird 3 wan -> offset 2")
  assert_true(Niao.bird_hit_offset(3) == 3, "bird 4 wan -> offset 3")
  assert_true(Niao.bird_hit_offset(4) == 0, "bird 5 wan -> offset 0")
  local hits = Niao.count_hits({1, 2}, 0, 4) -- 2万,3万
  assert_true(hits[1] == 1 and hits[2] == 1, "niao count_hits seats 1,2")
  local arr = JsonUtil.array0(hits, 4)
  assert_true(#arr == 4, "jsonutil array0 len")
end

-- huangzhuang wall=0 (T018)
do
  local e = Game.new({ playerCount = 4 })
  e:on_start({ { userId = 1 }, { userId = 2 }, { userId = 3 }, { userId = 4 } })
  e.wall = {}
  e:_next_turn((e.currentSeat + 1) % 4)
  assert_true(e.phase == "settle", "huangzhuang phase")
  assert_true(e.settle.reason == "huangzhuang", "huangzhuang reason")
end

-- multiHu all (T012)
do
  local e = Game.new({ playerCount = 4, multiHu = "all" })
  e:on_start({ { userId = 1 }, { userId = 2 }, { userId = 3 }, { userId = 4 } })
  e.phase = "wait_claim"
  e.lastDiscard = { seat = 0, tile = 0 }
  e.claimSeats = { 1, 2 }
  e.players[1].hand = {1,2,3, 4,5,6, 10,11,12, 19,20,21, 0}
  e.players[2].hand = {1,2,3, 4,5,6, 10,11,12, 19,20,21, 0}
  e.wall = { 10, 11 }
  e:on_action(1, "hu", {})
  assert_true(e.phase == "wait_claim", "multiHu all waits second")
  e:on_action(2, "hu", {})
  assert_true(e.phase == "settle", "multiHu all settled")
  assert_true(e.settle and e.settle.reason == "duo_xiang", "duo_xiang reason")
end

-- qiang gang hu (T011)
do
  local e = Game.new({ playerCount = 4 })
  e:on_start({ { userId = 1 }, { userId = 2 }, { userId = 3 }, { userId = 4 } })
  local seat = 0
  e.currentSeat = seat
  e.phase = "wait_discard"
  e.players[seat].melds = { { kind = "peng", tiles = { 1,1,1 }, fromSeat = 2 } }
  e.players[seat].hand = { 1, 2,2,2, 3,3,3, 4,4,4, 5,5,5 }
  e.players[1].hand = {0,0,2,3,4,5,6,9,10,11,18,19,20}
  e.wall = { 10, 11, 12 }
  e:on_action(seat, "bu_gang", { tile = 1 })
  assert_true(e.phase == "wait_claim", "bu_gang opens qiang gang")
  e:on_action(1, "hu", {})
  assert_true(e.phase == "settle", "qiang gang settled")
  assert_true(e.settle.reason == "qiang_gang", "qiang_gang reason")
end

-- qishou in settle detail (T015) + zhongtu ledger (T016)
do
  local e = Game.new({ playerCount = 4 })
  e.players[0].hand = {0,0,0,0, 1,2,3, 4,5,6, 7,8,9}
  e.players[1].hand = {0,0,0, 1,1,1, 2,2,2, 3,4,5, 6}
  e.players[2].hand = {9,10,11, 12,13,14, 15,16,17, 18,19,20, 21}
  e.players[3].hand = {0,1,2, 3,4,5, 6,7,8, 9,10,11, 12}
  e:on_start({
    { userId = 1 }, { userId = 2 }, { userId = 3 }, { userId = 4 },
  })
  if e.qishou then
    assert_true(#e.scoreLedger.qishou > 0, "qishou ledger entries")
  end
  e.phase = "wait_discard"
  e.currentSeat = 0
  e.players[0].hand = {0,0,0,0, 1,2,3, 4,5,6, 7,8,9, 10}
  e.wall = { 11, 12, 13, 14 }
  e:_draw(0)
  if e.zhongtu then
    assert_true(#e.scoreLedger.zhongtu > 0, "zhongtu ledger entries")
  end
end

-- T098: room snapshot JSON 回归 — settle/birdHits 永可 encode
do
  local json = require "json"
  local e = Game.new({ playerCount = 4, birdCount = 2 })
  e:on_start({ { userId = 1 }, { userId = 2 }, { userId = 3 }, { userId = 4 } })
  e.phase = "settle"
  e.settle = {
    winnerSeat = 0,
    reason = "zimo",
    detail = "test settle",
    scores = JsonUtil.array0({ [0] = 10, [1] = -3, [2] = -3, [3] = -4 }, 4),
    birds = { 0, 1 },
    birdHits = JsonUtil.array0({ [0] = 1, [1] = 0, [2] = 2, [3] = 0 }, 4),
    fan = 2,
  }
  local snap = e:snapshot(0)
  local ok, encoded = pcall(json.encode, snap)
  assert_true(ok, "snapshot json.encode: " .. tostring(encoded))
  assert_true(type(encoded) == "string" and #encoded > 20, "snapshot json len")
  assert_true(type(encoded) == "string" and encoded:find("birdHits"), "snapshot contains birdHits")
end

print(string.format("tests passed=%d failed=%d", passed, failed))
os.exit(failed == 0 and 0 or 1)
