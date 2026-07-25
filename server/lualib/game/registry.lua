-- 游戏插件注册表
local M = {
  _factories = {},
}

function M.register(gameId, factory)
  assert(type(gameId) == "string" and gameId ~= "")
  assert(type(factory) == "function")
  M._factories[gameId] = factory
end

function M.create(gameId, opts)
  local f = M._factories[gameId]
  if not f then
    return nil, "unknown gameId: " .. tostring(gameId)
  end
  return f(opts or {})
end

function M.list()
  local ids = {}
  for id in pairs(M._factories) do
    ids[#ids + 1] = id
  end
  table.sort(ids)
  return ids
end

-- 启动时注册玩法
function M.bootstrap()
  require("game.changsha_mj").register(M)
  require("game.shaoyang_phz").register(M)
end

return M
