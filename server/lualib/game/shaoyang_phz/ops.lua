-- 跑胡子吃碰提跑占位：返回 availableOps stub，不做完整规则判定
local T = require "game.shaoyang_phz.tiles"

local M = {}

function M.discard_ops()
  return { { action = "discard", label = "出牌" } }
end

function M.claim_ops(hand, discard_tile)
  local ops = { { action = "guo", label = "过" } }
  if discard_tile == nil then return ops end
  local c = T.counts(hand)
  if (c[discard_tile] or 0) >= 2 then
    ops[#ops + 1] = {
      action = "peng",
      label = "碰 " .. T.tile_name(discard_tile),
      tile = discard_tile,
    }
  end
  if (c[discard_tile] or 0) >= 3 then
    ops[#ops + 1] = {
      action = "ti",
      label = "提 " .. T.tile_name(discard_tile),
      tile = discard_tile,
    }
  end
  ops[#ops + 1] = {
    action = "chi",
    label = "吃（占位）",
    tile = discard_tile,
  }
  ops[#ops + 1] = {
    action = "pao",
    label = "跑（占位）",
    tile = discard_tile,
  }
  return ops
end

return M
