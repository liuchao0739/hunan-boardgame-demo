-- T022: 起手胡各图案至少 1 例
local Q = require "game.changsha_mj.qishou"

local M = {}

local function run(assert_true)
  local cases = {
    { id = "banban", hand = {0,0,0, 2,2,2, 3,3,3, 6,6,6, 9} },
    { id = "queyise", hand = {0,0,0, 1,1,1, 2,2,2, 3,3,3, 4} },
    { id = "liuliu", hand = {0,0,0, 1,1,1, 2,2,2, 3,4,5, 6} },
    { id = "bubugao", hand = {0,0, 1,1, 2,2, 9,10,11, 12,13,14, 15} },
    { id = "jintong", hand = {10,10, 19,19, 0,2,3, 5,6,7, 8,9,11} },
    { id = "santong", hand = {1,1, 10,10, 19,19, 0,3,4, 5,6,7, 8} },
    { id = "yizhihua", hand = {4, 0,1,2, 3,3,3, 6,6,6, 9,10,11} },
    { id = "jiangjiang", hand = {1,1, 4,4, 7,7, 10,10, 13,13, 16,16, 19} },
    { id = "sixi", hand = {0,0,0,0, 1,2,3, 4,5,6, 7,8,9} },
  }
  for _, c in ipairs(cases) do
    local hits = Q.detect(c.hand)
    local found = false
    for _, h in ipairs(hits) do
      if h.id == c.id then found = true break end
    end
    assert_true(found, "qishou detect " .. c.id)
  end

  assert_true(Q.zhongtu_sixi({0,0,0,0, 1,2,3, 4,5,6, 7,8,9}), "zhongtu sixi")
  assert_true(Q.zhongtu_liuliu({0,0,0, 1,1,1, 2,2,2, 3,4,5, 6}), "zhongtu liuliu")
end

M.run = run
return M
