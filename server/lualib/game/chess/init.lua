-- 象棋占位
local M = {}

local function factory(_opts)
  return {
    gameId = "chess",
    on_start = function() end,
    on_action = function()
      return false, "象棋尚未开放"
    end,
    snapshot = function()
      return {
        phase = "unavailable",
        message = "象棋即将上线",
        availableOps = {},
      }
    end,
    bot_tick = function() return false end,
    needs_bot_tick = function() return false end,
  }
end

function M.register(reg)
  reg.register("chess", factory)
end

return M
