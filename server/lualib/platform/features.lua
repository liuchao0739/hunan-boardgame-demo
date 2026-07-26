-- 灰度 / 功能开关（T084）
local Config = require "platform.config"

local M = {
  games = {
    changsha_mj = true,
    shaoyang_phz = true,
    chess = false,
    go = false,
  },
  ops = {
    structured_log = true,
    metrics = true,
    fill_bots = Config.feature and Config.feature.fill_bots ~= false,
  },
}

local function env_flag(name, default)
  local v = os.getenv(name)
  if v == nil or v == "" then return default end
  return v == "1" or v == "true" or v == "yes"
end

function M.reload_from_env()
  if os.getenv("XIANGZHUO_ENABLE_SHAOYANG_PHZ") ~= nil then
    M.games.shaoyang_phz = env_flag("XIANGZHUO_ENABLE_SHAOYANG_PHZ", true)
  end
  if os.getenv("XIANGZHUO_ENABLE_CHESS") ~= nil then
    M.games.chess = env_flag("XIANGZHUO_ENABLE_CHESS", false)
  end
  if os.getenv("XIANGZHUO_ENABLE_GO") ~= nil then
    M.games.go = env_flag("XIANGZHUO_ENABLE_GO", false)
  end
end

M.reload_from_env()

function M.game_enabled(gameId)
  if M.games[gameId] == nil then return false end
  return M.games[gameId] and true or false
end

function M.enabled(flag)
  return M.ops[flag] ~= false
end

return M
