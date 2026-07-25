-- T021: 吃碰杠合法性
local T = require "game.changsha_mj.tiles"
local Game = require "game.changsha_mj"

local M = {}

local function run(assert_true)
  -- chi_options
  do
    local opts = T.chi_options({0, 2}, 1) -- 1万2万吃2万(1)
    assert_true(#opts >= 1, "chi middle")
    local ok = false
    for _, o in ipairs(opts) do
      if o[1] == 0 and o[2] == 2 and o[3] == 1 then ok = true end
    end
    assert_true(ok, "chi middle combo")
  end
  do
    local opts = T.chi_options({0, 1}, 2)
    assert_true(#opts >= 1, "chi left")
  end
  do
    local opts = T.chi_options({6, 7}, 8)
    assert_true(#opts >= 1, "chi right")
  end
  do
    local opts = T.chi_options({0, 8}, 4) -- 不能跨花色
    assert_true(#opts == 0, "chi cross suit blocked")
  end

  -- remove_one / remove_n (peng/gang 前置)
  do
    local hand = {0, 0, 1, 2}
    assert_true(T.remove_n(hand, 0, 2), "remove_n peng")
    assert_true(#hand == 2, "hand after peng remove")
    assert_true(not T.remove_one(hand, 9), "remove missing tile")
  end

  -- 引擎：非法出牌拒绝 (T086)
  do
    local e = Game.new({ playerCount = 4 })
    e:on_start({ { userId = 1 }, { userId = 2 }, { userId = 3 }, { userId = 4 } })
    local seat = e.currentSeat
    e.phase = "wait_discard"
    local hand = e.players[seat].hand
    local missing = 26
    for t = 0, 26 do
      local found = false
      for _, h in ipairs(hand) do if h == t then found = true break end end
      if not found then missing = t break end
    end
    local ok, err = e:on_action(seat, "discard", { tile = missing })
    assert_true(not ok and err == "手牌无此牌", "reject discard not in hand")
  end

  -- 引擎：吃牌校验 (T013)
  do
    local e = Game.new({ playerCount = 4 })
    e:on_start({ { userId = 1 }, { userId = 2 }, { userId = 3 }, { userId = 4 } })
    e.phase = "wait_claim"
    e.lastDiscard = { seat = 0, tile = 1 }
    e.claimSeats = { 1 }
    e.players[1].hand = {0, 2, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19}
    local ok = e:on_action(1, "chi", { tiles = {9, 10} })
    assert_true(not ok, "reject illegal chi combo")
    ok = e:on_action(1, "chi", { tiles = {0, 2} })
    assert_true(ok, "accept legal chi")
  end

  -- 引擎：杠分写入 snapshot (T010)
  do
    local e = Game.new({ playerCount = 4, baseScore = 1 })
    e:on_start({ { userId = 1 }, { userId = 2 }, { userId = 3 }, { userId = 4 } })
    local seat = e.currentSeat
    e.phase = "wait_discard"
    e.players[seat].hand = {0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
    e.players[seat].hand = T.sort_tiles(e.players[seat].hand)
    e.wall = { 10, 11, 12, 13 }
    local before = e.players[seat].score
    e:on_action(seat, "an_gang", { tile = 0 })
    assert_true(#e.scoreLedger.gang == 1, "gang ledger entry")
    assert_true(e.players[seat].score > before, "an_gang score applied")
    local snap = e:snapshot(seat)
    assert_true(snap.scoreLedger.gang[1].gangKind == "an_gang", "gang in snapshot")
  end

  -- T087: 碰后 ops 含 bu_gang
  do
    local e = Game.new({ playerCount = 4 })
    e:on_start({ { userId = 1 }, { userId = 2 }, { userId = 3 }, { userId = 4 } })
    local seat = 1
    e.currentSeat = seat
    e.phase = "wait_discard"
    e.players[seat].melds = {
      { kind = "peng", tiles = { 1, 1, 1 }, fromSeat = 0 },
    }
    e.players[seat].hand = { 1, 2,2,2,2, 3, 4, 5, 6, 7, 8, 9, 10, 11 }
    local ops = e:snapshot(seat).availableOps
    local has_bu, has_an = false, false
    for _, op in ipairs(ops) do
      if op.action == "bu_gang" then has_bu = true end
      if op.action == "an_gang" then has_an = true end
    end
    assert_true(has_bu, "bu_gang after peng")
    assert_true(has_an, "an_gang available with 4-of-kind")
  end
end

M.run = run
return M
