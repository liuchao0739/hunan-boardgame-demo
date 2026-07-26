-- 围棋占位
local M = {}

local function factory(_opts)
  return {
    gameId = "go",
    on_start = function() end,
    on_action = function()
      return false, "围棋尚未开放"
    end,
    snapshot = function()
      return {
        phase = "unavailable",
        message = "围棋即将上线",
        availableOps = {},
      }
    end,
    bot_tick = function() return false end,
    needs_bot_tick = function() return false end,
  }
end

function M.register(reg)
  reg.register("go", factory)
end

return M
