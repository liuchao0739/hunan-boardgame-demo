-- 快速匹配队列：同玩法凑满 4 人成桌
local skynet = require "skynet"

local queue = {}       -- array of { userId, userName, gameId, at }
local queued = {}      -- userId -> true
local room_mgr
local ws_gate

local CMD = {}

local function remove_user(userId)
  if not queued[userId] then return false end
  queued[userId] = nil
  for i = #queue, 1, -1 do
    if queue[i].userId == userId then
      table.remove(queue, i)
      return true
    end
  end
  return false
end

local function notify_user(userId, cmd, body)
  if ws_gate then
    pcall(skynet.send, ws_gate, "lua", "push_user", userId, "platform", cmd, body)
  end
end

local function try_match_game(gameId)
  local waiting = {}
  for _, e in ipairs(queue) do
    if e.gameId == gameId then waiting[#waiting + 1] = e end
  end
  while #waiting >= 4 do
    local batch = {}
    for i = 1, 4 do
      batch[i] = waiting[i]
      remove_user(waiting[i].userId)
    end
    for i = 5, #waiting do waiting[i - 4] = waiting[i] end
    for _ = 1, 4 do table.remove(waiting) end

    local leader = batch[1]
    local st, err = skynet.call(room_mgr, "lua", "create", leader.userId, leader.userName, gameId, {
      fillBots = false,
      matchMade = true,
    })
    if not st then
      for _, p in ipairs(batch) do
        notify_user(p.userId, "matchError", { message = err or "成桌失败" })
      end
    else
      local roomId = st.roomId
      for i = 2, 4 do
        local p = batch[i]
        local jst, jerr = skynet.call(room_mgr, "lua", "join", p.userId, p.userName, roomId)
        if not jst then
          notify_user(p.userId, "matchError", { message = jerr or "加入失败" })
        else
          notify_user(p.userId, "matchResult", { ok = true, roomId = roomId, state = jst })
        end
      end
      notify_user(leader.userId, "matchResult", { ok = true, roomId = roomId, state = st })
      pcall(skynet.send, ws_gate, "lua", "broadcast_room", roomId)
    end
  end
end

function CMD.enqueue(userId, userName, gameId)
  userId = tonumber(userId)
  gameId = gameId or "changsha_mj"
  if gameId == "shaoyang_phz" then
    return nil, "邵阳跑胡子尚未开放"
  end
  if queued[userId] then
    return { ok = true, queued = true, position = 1, gameId = gameId }
  end
  local rid = skynet.call(room_mgr, "lua", "get_room_id", userId)
  if rid then return nil, "已在房间中" end

  queue[#queue + 1] = {
    userId = userId,
    userName = userName or ("玩家" .. userId),
    gameId = gameId,
    at = os.time(),
  }
  queued[userId] = true

  local same = 0
  for _, e in ipairs(queue) do
    if e.gameId == gameId then same = same + 1 end
  end

  try_match_game(gameId)

  return {
    ok = true,
    queued = true,
    gameId = gameId,
    position = same,
    need = 4,
  }
end

function CMD.cancel(userId)
  userId = tonumber(userId)
  if remove_user(userId) then
    return { ok = true, cancelled = true }
  end
  return { ok = true, cancelled = false, message = "不在队列中" }
end

function CMD.is_queued(userId)
  return queued[tonumber(userId)] == true
end

function CMD.queue_size(gameId)
  local n = 0
  for _, e in ipairs(queue) do
    if not gameId or e.gameId == gameId then n = n + 1 end
  end
  return n
end

skynet.start(function()
  room_mgr = skynet.uniqueservice("room_mgr")
  skynet.fork(function()
    ws_gate = skynet.uniqueservice("ws_gate")
  end)
  skynet.dispatch("lua", function(_, _, cmd, ...)
    local f = CMD[cmd]
    if f then
      skynet.ret(skynet.pack(f(...)))
    else
      skynet.ret(skynet.pack(nil, "unknown " .. tostring(cmd)))
    end
  end)
  skynet.error("matchmaking service ready")
end)
