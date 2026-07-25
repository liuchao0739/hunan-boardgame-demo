-- 邵阳跑胡子：占位
local M = {}

local function factory(_opts)
  return {
    gameId = "shaoyang_phz",
    on_start = function() end,
    on_action = function()
      return false, "邵阳跑胡子尚未开放"
    end,
    snapshot = function()
      return {
        phase = "unavailable",
        message = "邵阳跑胡子即将上线",
        availableOps = {},
      }
    end,
    bot_tick = function() return false end,
    needs_bot_tick = function() return false end,
  }
end

function M.register(reg)
  reg.register("shaoyang_phz", factory)
end

return M
