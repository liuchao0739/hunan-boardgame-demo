-- T020: can_hu / can_jiang_jiang_hu 正反例 ≥20
local T = require "game.changsha_mj.tiles"

local M = {}

local function run(assert_true)
  local cases_yes = {
    { name = "ping hu wan tiao tong", hand = {0,0, 1,2,3, 4,5,6, 9,10,11, 18,19,20} },
    { name = "dui + four shun", hand = {0,0, 1,2,3, 4,5,6, 9,10,11, 18,19,20} },
    { name = "all kezi", hand = {0,0,0, 1,1,1, 2,2,2, 3,3,3, 4,4} },
    { name = "hun he", hand = {0,1,2, 3,4,5, 9,10,11, 18,19,20, 6,6} },
    { name = "tong only", hand = {18,18,18, 19,20,21, 22,23,24, 25,25,25, 26,26} },
    { name = "tiao only", hand = {9,9,9, 10,11,12, 13,14,15, 16,16,16, 17,17} },
    { name = "wan 258 eye", hand = {1,1, 2,3,4, 5,6,7, 9,10,11, 18,19,20} },
    { name = "four kezi", hand = {0,0,0, 1,1,1, 2,2,2, 3,3,3, 4,4} },
    { name = "edge shun 789", hand = {6,7,8, 9,9, 10,11,12, 18,19,20, 21,22,23} },
    { name = "jiang jiang hu ke", hand = {1,1,1, 4,4,4, 7,7,7, 10,10,10, 19,19} },
    { name = "jiang triple ke", hand = {1,1,1, 4,4,4, 7,7,7, 13,13,13, 19,19} },
    { name = "single suit wan", hand = {0,0, 1,2,3, 3,4,5, 6,7,8, 2,2,2} },
    { name = "14 wan hu", hand = {0,0, 1,2,3, 3,4,5, 6,7,8, 2,2,2} },
    { name = "tong tiao mix", hand = {9,10,11, 12,13,14, 15,16,17, 18,19,20, 21,21} },
    { name = "eye at 8", hand = {7,7, 0,1,2, 3,4,5, 9,10,11, 18,19,20} },
    { name = "eye at 5 wan", hand = {4,4, 0,1,2, 3,3,3, 9,10,11, 18,19,20} },
    { name = "long shun wan", hand = {0,1,2,3,4,5,6,7,8, 9,9, 18,19,20} },
    { name = "peng eye wan", hand = {0,0,0, 1,2,3, 4,5,6, 7,8,9, 9,9} },
    { name = "three suit", hand = {0,1,2, 9,10,11, 18,19,20, 3,3,3, 6,6} },
    { name = "minimal hu", hand = {0,0, 1,2,3, 4,5,6, 9,10,11, 18,19,20} },
  }
  for _, c in ipairs(cases_yes) do
    assert_true(T.can_hu(c.hand), "hu yes: " .. c.name)
  end

  local jiang_yes = {
    { name = "jiang ke tong", hand = {1,1,1, 4,4,4, 7,7,7, 10,10,10, 19,19} },
    { name = "jiang ke tiao", hand = {1,1,1, 4,4,4, 7,7,7, 13,13,13, 19,19} },
  }
  for _, c in ipairs(jiang_yes) do
    assert_true(T.can_jiang_jiang_hu(c.hand), "jiang yes: " .. c.name)
  end

  local cases_no = {
    { name = "too short", hand = {0,1,2}, fn = T.can_hu },
    { name = "13 tiles", hand = {0,0, 1,2,3, 4,5,6, 9,10,11, 18,19}, fn = T.can_hu },
    { name = "random 14", hand = {0,1,2,3,4,5,6,7,8,9,10,11,12,13}, fn = T.can_hu },
    { name = "one away", hand = {0,0, 1,2,3, 4,5,6, 9,10,11, 18,19,21}, fn = T.can_hu },
    { name = "jiang but not hu", hand = {1,1, 4,4, 7,7, 10,10, 13,13, 16,16, 19,22}, fn = T.can_jiang_jiang_hu },
    { name = "hu but not jiang", hand = {0,0, 1,2,3, 4,5,6, 9,10,11, 18,19,20}, fn = T.can_jiang_jiang_hu },
    -- 听六筒时打来六万不得胡（与用户反馈同型）
    { name = "wait 6tong reject 6wan", hand = {10,10,10, 3,3,3, 6,7,8, 26,26,26, 23, 5}, fn = T.can_hu },
  }
  for _, c in ipairs(cases_no) do
    assert_true(not c.fn(c.hand), "hu no: " .. c.name)
  end
  -- 正例：同上听口摸/胡六筒可胡
  assert_true(T.can_hu({10,10,10, 3,3,3, 6,7,8, 26,26,26, 23, 23}), "hu yes: wait 6tong get 6tong")
end

M.run = run
return M
