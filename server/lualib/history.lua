--[[ 战绩与回放存储（进程内，最多保留 50 局）]]
local M = {}

local history = {} -- list newest first
local MAX = 50

function M.push(entry)
  table.insert(history, 1, entry)
  while #history > MAX do table.remove(history) end
end

function M.list(limit)
  limit = limit or 20
  local out = {}
  for i = 1, math.min(limit, #history) do
    local e = history[i]
    out[#out + 1] = {
      id = e.id,
      roomId = e.roomId,
      gameType = e.gameType,
      time = e.time,
      summary = e.summary,
      scores = e.scores,
    }
  end
  return out
end

function M.get(id)
  for _, e in ipairs(history) do
    if e.id == id then return e end
  end
  return nil
end

return M
