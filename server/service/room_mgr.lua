-- 平台房间管理：座位壳 + 游戏插件
local skynet = require "skynet"
local Registry = require "game.registry"

local rooms = {}
local user_room = {}
local next_room_id = 100000

local CMD = {}

local function alloc_room_id()
  next_room_id = next_room_id + 1
  if next_room_id > 999999 then next_room_id = 100000 end
  return next_room_id
end

local function seat_of(room, userId)
  for i, p in ipairs(room.players) do
    if p.userId == userId then return i - 1, p end
  end
  return nil
end

local function broadcast_fn(room)
  return function(payload)
    -- payload already encoded string; gate will send to fds
    room._pending_broadcast = room._pending_broadcast or {}
    room._pending_broadcast[#room._pending_broadcast + 1] = payload
  end
end

local function take_broadcasts(room)
  local list = room._pending_broadcast or {}
  room._pending_broadcast = {}
  return list
end

local function build_platform_state(room, for_userId)
  local seat = select(1, seat_of(room, for_userId))
  local gameSnap = nil
  if room.engine and room.state == "playing" then
    gameSnap = room.engine:snapshot(seat or 0)
  end
  local seats = {}
  for i, p in ipairs(room.players) do
    seats[#seats + 1] = {
      seat = i - 1,
      userId = p.userId,
      userName = p.userName,
      isBot = p.isBot and true or false,
      ready = p.ready and true or false,
    }
  end
  return {
    roomId = room.roomId,
    gameId = room.gameId,
    state = room.state,
    seats = seats,
    ownerId = room.ownerId,
    game = gameSnap,
  }
end

function CMD.create(userId, userName, gameId, rules)
  gameId = gameId or "changsha_mj"
  if gameId == "shaoyang_phz" then
    return nil, "邵阳跑胡子尚未开放"
  end
  if user_room[userId] then
    return nil, "已在房间中"
  end
  local engine, err = Registry.create(gameId, rules or {})
  if not engine then return nil, err end

  local roomId = alloc_room_id()
  local room = {
    roomId = roomId,
    gameId = gameId,
    state = "waiting",
    ownerId = userId,
    players = {
      { userId = userId, userName = userName or ("玩家" .. userId), isBot = false, ready = false },
    },
    engine = engine,
    rules = rules or {},
  }
  -- 自动补机器人到 4 人
  while #room.players < 4 do
    local bi = #room.players
    room.players[#room.players + 1] = {
      userId = -1000 - bi,
      userName = "机器人" .. bi,
      isBot = true,
      ready = true,
    }
  end
  rooms[roomId] = room
  user_room[userId] = roomId
  return build_platform_state(room, userId)
end

function CMD.join(userId, userName, roomId)
  local room = rooms[roomId]
  if not room then return nil, "房间不存在" end
  if room.state ~= "waiting" then return nil, "已开局" end
  if user_room[userId] then return nil, "已在房间" end
  -- 替换一个机器人
  local replaced = false
  for i, p in ipairs(room.players) do
    if p.isBot then
      room.players[i] = {
        userId = userId,
        userName = userName or ("玩家" .. userId),
        isBot = false,
        ready = false,
      }
      replaced = true
      break
    end
  end
  if not replaced then
    if #room.players >= 4 then return nil, "房间已满" end
    room.players[#room.players + 1] = {
      userId = userId,
      userName = userName or ("玩家" .. userId),
      isBot = false,
      ready = false,
    }
  end
  user_room[userId] = roomId
  return build_platform_state(room, userId)
end

function CMD.prepare(userId, yes)
  local roomId = user_room[userId]
  local room = roomId and rooms[roomId]
  if not room then return nil, "不在房间" end
  local _, p = seat_of(room, userId)
  if not p then return nil, "无座位" end
  p.ready = yes ~= false
  local all = true
  for _, pl in ipairs(room.players) do
    if not pl.isBot and not pl.ready then all = false break end
  end
  if all and #room.players >= 4 and room.state == "waiting" then
    room.state = "playing"
    local seats = {}
    for i, pl in ipairs(room.players) do
      seats[i] = { userId = pl.userId, userName = pl.userName, isBot = pl.isBot }
    end
    room.engine:on_start(seats)
    CMD.tick_bots(room.roomId)
  end
  return build_platform_state(room, userId)
end

function CMD.tick_bots(roomId)
  local room = rooms[roomId]
  if not room or not room.engine then return end
  CMD._run_bots(room)
end

function CMD.sync(userId)
  local roomId = user_room[userId]
  local room = roomId and rooms[roomId]
  if not room then return nil, "不在房间" end
  return build_platform_state(room, userId)
end

function CMD.action(userId, ns, cmd, body)
  local roomId = user_room[userId]
  local room = roomId and rooms[roomId]
  if not room then return nil, "不在房间" end
  if room.state ~= "playing" then return nil, "未开局" end
  local seat = select(1, seat_of(room, userId))
  if seat == nil then return nil, "无座位" end
  -- 平台 continue / 玩法命令
  local ok, err = room.engine:on_action(seat, cmd, body or {})
  if not ok then return nil, err end
  -- 机器人回合
  CMD._run_bots(room)
  return build_platform_state(room, userId)
end

function CMD._run_bots(room)
  if not room.engine then return end
  for _ = 1, 32 do
    if not room.engine:needs_bot_tick() then break end
    local acted = false
    for s = 0, 3 do
      if room.engine:bot_tick(s) then
        acted = true
        break
      end
    end
    if not acted then break end
  end
end

function CMD.leave(userId)
  local roomId = user_room[userId]
  local room = roomId and rooms[roomId]
  if not room then
    user_room[userId] = nil
    return true
  end
  user_room[userId] = nil
  for i, p in ipairs(room.players) do
    if p.userId == userId then
      room.players[i] = {
        userId = -2000 - i,
        userName = "空位" .. i,
        isBot = true,
        ready = true,
      }
      break
    end
  end
  -- 若无人则删房
  local human = false
  for _, p in ipairs(room.players) do
    if not p.isBot and p.userId > 0 then human = true break end
  end
  if not human then
    rooms[roomId] = nil
  end
  return true
end

function CMD.get_room_id(userId)
  return user_room[userId]
end

function CMD.list_games()
  return {
    { gameId = "changsha_mj", name = "长沙麻将", enabled = true },
    { gameId = "shaoyang_phz", name = "邵阳跑胡子", enabled = false },
  }
end

skynet.start(function()
  Registry.bootstrap()
  skynet.dispatch("lua", function(_, _, cmd, ...)
    local f = CMD[cmd]
    if f then
      skynet.ret(skynet.pack(f(...)))
    else
      skynet.ret(skynet.pack(nil, "unknown " .. tostring(cmd)))
    end
  end)
  skynet.error("platform room_mgr ready, games=", table.concat(Registry.list(), ","))
end)
