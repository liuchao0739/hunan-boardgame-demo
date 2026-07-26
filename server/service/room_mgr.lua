-- 平台房间管理：座位壳 + 游戏插件
local skynet = require "skynet"
local Registry = require "game.registry"
local Config = require "platform.config"
local Features = require "platform.features"
local Log = require "platform.log"
local Metrics = require "platform.metrics"
local Economy = require "platform.economy"

local rooms = {}
local user_room = {}
local next_room_id = 100000
local ws_gate

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

local function human_ids(room)
  local ids = {}
  for _, p in ipairs(room.players) do
    if not p.isBot and p.userId > 0 then ids[#ids + 1] = p.userId end
  end
  return ids
end

local function notify_room(roomId)
  if ws_gate then
    pcall(skynet.send, ws_gate, "lua", "broadcast_room", roomId)
  end
end

local function sync_engine_seat(room, seatIdx, pl)
  if not room.engine or not room.engine.set_seat_meta then return end
  room.engine:set_seat_meta(seatIdx, {
    isBot = pl.isBot,
    autoPlay = pl.autoPlay and true or false,
    disconnected = pl.disconnected and true or false,
  })
end

local function build_seats_for_engine(room)
  local seats = {}
  for i, pl in ipairs(room.players) do
    seats[i] = { userId = pl.userId, userName = pl.userName, isBot = pl.isBot }
    sync_engine_seat(room, i - 1, pl)
  end
  return seats
end

local function all_humans_ready(room)
  for _, pl in ipairs(room.players) do
    if not pl.isBot and not pl.ready then return false end
  end
  return true
end

local passport

local function on_game_settled(room)
  if room.state ~= "playing" then return end
  room.state = "between_round"
  room.dissolve = nil
  for _, pl in ipairs(room.players) do
    if not pl.isBot then pl.ready = false end
  end
  if room.engine and room.engine.settle then
    room.roundNo = (room.roundNo or 0) + 1
    -- Skynet 各服务 Lua VM 隔离：必须经 passport 落库，否则大厅 getRecords 永远空
    if not passport then
      passport = skynet.uniqueservice("passport")
    end
    local stub = {
      roomId = room.roomId,
      gameId = room.gameId,
      prevScores = room.prevScores,
    }
    local ok, payload, prev = pcall(skynet.call, passport, "lua", "save_settle", stub, room.engine.settle, room.players, room.roundNo)
    if ok and prev then
      room.prevScores = prev
    elseif ok and stub.prevScores then
      room.prevScores = stub.prevScores
    elseif not ok then
      skynet.error("[room_mgr] save_settle failed:", payload)
    end
    Economy.on_round_settle(room, room.rules)
    Metrics.inc_round()
  end
end

local function member_of(room, userId)
  for _, p in ipairs(room.players) do
    if p.userId == userId and not p.isBot then return true end
  end
  return false
end

local function check_password(room, password)
  if not room.password or room.password == "" then return true end
  return tostring(password or "") == room.password
end

local function build_platform_state(room, for_userId)
  local seat = select(1, seat_of(room, for_userId))
  local gameSnap = nil
  if room.engine and (room.state == "playing" or room.state == "between_round") then
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
      disconnected = p.disconnected and true or false,
      autoPlay = p.autoPlay and true or false,
    }
  end
  local out = {
    roomId = room.roomId,
    gameId = room.gameId,
    state = room.state,
    seats = seats,
    ownerId = room.ownerId,
    game = gameSnap,
  }
  if room.dissolve then
    out.dissolve = {
      votes = room.dissolve.votes,
      required = room.dissolve.required,
    }
  end
  return out
end

local function should_fill_bots(rules)
  if rules and rules.fillBots == false then return false end
  if Config.feature and Config.feature.fill_bots == false then return false end
  return true
end

local function max_players_for(gameId)
  if gameId == "shaoyang_phz" then return 3 end
  return 4
end

function CMD.create(userId, userName, gameId, rules)
  gameId = gameId or "changsha_mj"
  rules = rules or {}
  if not Registry.known(gameId) then
    return nil, "未知 gameId: " .. tostring(gameId)
  end
  if not Features.game_enabled(gameId) then
    return nil, "玩法未开放: " .. tostring(gameId)
  end
  if user_room[userId] then
    return nil, "已在房间中"
  end
  local engine, err = Registry.create(gameId, rules)
  if not engine then return nil, err end

  local roomId = alloc_room_id()
  if not rules.matchMade then
    local ok, bal, err2 = Economy.deduct_create_room(userId, roomId, { roomCard = 9999 })
    if not ok then return nil, err2 or ("房卡不足，需要 " .. (Config.economy.create_room_cost or 1)) end
  end

  local pwd = rules.password
  if pwd ~= nil then pwd = tostring(pwd):sub(1, 16) end

  local room = {
    roomId = roomId,
    gameId = gameId,
    state = "waiting",
    ownerId = userId,
    roundNo = 0,
    prevScores = nil,
    password = pwd,
    allowSpectate = rules.allowSpectate == true,
    players = {
      { userId = userId, userName = userName or ("玩家" .. userId), isBot = false, ready = false },
    },
    engine = engine,
    rules = rules,
  }
  if should_fill_bots(rules) then
    local cap = max_players_for(gameId)
    while #room.players < cap do
      local bi = #room.players
      room.players[#room.players + 1] = {
        userId = -1000 - bi,
        userName = "机器人" .. bi,
        isBot = true,
        ready = true,
      }
    end
  end
  rooms[roomId] = room
  user_room[userId] = roomId
  Metrics.inc_room()
  Log.info("room.create", { roomId = roomId, userId = userId, gameId = gameId })
  return build_platform_state(room, userId)
end

function CMD.join(userId, userName, roomId, password)
  local room = rooms[roomId]
  if not room then return nil, "房间不存在" end
  if room.state ~= "waiting" then return nil, "已开局" end
  if user_room[userId] then return nil, "已在房间" end
  if not check_password(room, password) then return nil, "房间密码错误" end
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
    local cap = max_players_for(room.gameId)
    if #room.players >= cap then return nil, "房间已满" end
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

  if room.state == "between_round" then
    if all_humans_ready(room) and #room.players >= 4 then
      room.state = "playing"
      room.dissolve = nil
      room.engine:on_start(build_seats_for_engine(room))
      CMD.tick_bots(room.roomId)
      notify_room(room.roomId)
    end
    return build_platform_state(room, userId)
  end

  if all_humans_ready(room) and #room.players >= 4 and room.state == "waiting" then
    room.state = "playing"
    room.engine:on_start(build_seats_for_engine(room))
    CMD.tick_bots(room.roomId)
  end
  return build_platform_state(room, userId)
end

function CMD.set_auto_play(userId, yes)
  local roomId = user_room[userId]
  local room = roomId and rooms[roomId]
  if not room then return nil, "不在房间" end
  local seat, p = seat_of(room, userId)
  if not p then return nil, "无座位" end
  p.autoPlay = yes ~= false
  sync_engine_seat(room, seat, p)
  -- 不立刻狂跑 _run_bots：托管由 room_tick 每秒一步，避免一点托管整局秒结
  if room.state == "playing" then
    notify_room(room.roomId)
  end
  return build_platform_state(room, userId)
end

function CMD.dissolve_vote(userId, body)
  body = body or {}
  local roomId = user_room[userId]
  local room = roomId and rooms[roomId]
  if not room then return nil, "不在房间" end
  if room.state ~= "playing" and room.state ~= "between_round" then
    return nil, "当前不可解散"
  end
  local humans = human_ids(room)
  if #humans == 0 then return nil, "无玩家" end

  if body.cancel then
    room.dissolve = nil
    notify_room(room.roomId)
    return build_platform_state(room, userId)
  end

  if not room.dissolve then
    room.dissolve = { votes = {}, required = humans }
    room.dissolve.votes[tostring(userId)] = true
  else
    if body.agree == false then
      room.dissolve = nil
      notify_room(room.roomId)
      return build_platform_state(room, userId)
    end
    room.dissolve.votes[tostring(userId)] = true
  end

  local agreeAll = true
  for _, uid in ipairs(room.dissolve.required) do
    if room.dissolve.votes[tostring(uid)] ~= true then
      agreeAll = false
      break
    end
  end
  if agreeAll then
    local members = human_ids(room)
    for _, uid in ipairs(members) do
      user_room[uid] = nil
    end
    rooms[roomId] = nil
    notify_room(roomId)
    return { dissolved = true, roomId = roomId, members = members }
  end
  notify_room(room.roomId)
  return build_platform_state(room, userId)
end

function CMD.tick_bots(roomId)
  local room = rooms[roomId]
  if not room or not room.engine then return end
  CMD._run_bots(room)
end

function CMD.sync(userId, roomId)
  local myRoomId = user_room[userId]
  if not myRoomId then return nil, "不在房间" end
  if roomId and tonumber(roomId) ~= myRoomId then
    return nil, "无权同步他人房间"
  end
  local room = rooms[myRoomId]
  if not room then return nil, "房间不存在" end
  if not member_of(room, userId) then return nil, "非房间成员" end
  return build_platform_state(room, userId)
end

function CMD.kick(ownerId, targetUserId)
  ownerId = tonumber(ownerId)
  targetUserId = tonumber(targetUserId)
  if not targetUserId or targetUserId <= 0 then return nil, "目标无效" end
  if ownerId == targetUserId then return nil, "不能踢自己" end
  local roomId = user_room[ownerId]
  local room = roomId and rooms[roomId]
  if not room then return nil, "不在房间" end
  if room.ownerId ~= ownerId then return nil, "仅房主可踢人" end
  if room.state ~= "waiting" then return nil, "对局进行中不可踢人" end
  if user_room[targetUserId] ~= roomId then return nil, "目标不在本房" end

  user_room[targetUserId] = nil
  for i, p in ipairs(room.players) do
    if p.userId == targetUserId then
      room.players[i] = {
        userId = -2000 - i,
        userName = "空位" .. i,
        isBot = true,
        ready = true,
      }
      break
    end
  end
  notify_room(roomId)
  return { ok = true, roomId = roomId, kickedUserId = targetUserId }
end

function CMD.send_emoji(userId, body)
  body = body or {}
  local roomId = user_room[userId]
  local room = roomId and rooms[roomId]
  if not room then return nil, "不在房间" end
  if not member_of(room, userId) then return nil, "非房间成员" end
  local payload = {
    roomId = roomId,
    fromUserId = userId,
    emojiId = tonumber(body.emojiId) or body.emojiId or "smile",
    targetSeat = body.targetSeat,
    at = os.time(),
  }
  notify_room(roomId)
  return payload
end

function CMD.send_phrase(userId, body)
  body = body or {}
  local roomId = user_room[userId]
  local room = roomId and rooms[roomId]
  if not room then return nil, "不在房间" end
  if not member_of(room, userId) then return nil, "非房间成员" end
  local phrases = {
    [1] = "快点啊，等到花都谢了",
    [2] = "你的牌打得太好了",
    [3] = "大家好，很高兴见到各位",
    [4] = "今天运气不错",
    [5] = "不要走，决战到天亮",
  }
  local pid = tonumber(body.phraseId) or 1
  local payload = {
    roomId = roomId,
    fromUserId = userId,
    phraseId = pid,
    text = body.text or phrases[pid] or phrases[1],
    at = os.time(),
  }
  notify_room(roomId)
  return payload
end

function CMD.action(userId, ns, cmd, body)
  local roomId = user_room[userId]
  local room = roomId and rooms[roomId]
  if not room then return nil, "不在房间" end
  if room.state ~= "playing" then return nil, "未开局" end
  if not ns or ns ~= room.gameId then
    return nil, string.format("game 命名空间不匹配: 期望 %s，收到 %s", tostring(room.gameId), tostring(ns))
  end
  if not Registry.known(ns) then
    return nil, "未知 gameId: " .. tostring(ns)
  end
  local seat = select(1, seat_of(room, userId))
  if seat == nil then return nil, "无座位" end
  Log.info("room.action", { roomId = roomId, userId = userId, gameId = room.gameId, cmd = cmd })
  local ok, err = room.engine:on_action(seat, cmd, body or {})
  if not ok then return nil, err end
  if room.engine.phase == "settle" then
    on_game_settled(room)
  end
  CMD._run_bots(room)
  return build_platform_state(room, userId)
end

function CMD._run_bots(room, max_steps, mode)
  if not room.engine then return end
  -- 默认只推进机器人，避免把真人托管一口气打完
  mode = mode or "bot"
  max_steps = max_steps or 16
  for _ = 1, max_steps do
    if not room.engine:needs_bot_tick(mode) then break end
    local acted = false
    for s = 0, 3 do
      if room.engine:bot_tick(s, mode) then
        acted = true
        break
      end
    end
    if not acted then break end
  end
  if room.engine.phase == "settle" and room.state == "playing" then
    on_game_settled(room)
  end
end

--- 托管慢速：每秒最多一步（含机器人补位时也可 1 步）
function CMD._tick_autoplay(room)
  if not room.engine then return false end
  if not room.engine:needs_bot_tick("autoplay") and not room.engine:needs_bot_tick("bot") then
    return false
  end
  -- 优先一步机器人响应；若无需机器人则推一步托管
  if room.engine:needs_bot_tick("bot") then
    CMD._run_bots(room, 1, "bot")
  elseif room.engine:needs_bot_tick("autoplay") then
    CMD._run_bots(room, 1, "autoplay")
  end
  return true
end

function CMD.leave(userId)
  local roomId = user_room[userId]
  local room = roomId and rooms[roomId]
  if not room then
    user_room[userId] = nil
    return true
  end
  -- 对局中断线：标记 disconnected，保留座位（T023）
  if room.state == "playing" then
    for i, p in ipairs(room.players) do
      if p.userId == userId then
        p.disconnected = true
        p.disconnectAt = os.time()
        sync_engine_seat(room, i - 1, p)
        notify_room(roomId)
        return true, "soft"
      end
    end
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
  local human = false
  for _, p in ipairs(room.players) do
    if not p.isBot and p.userId > 0 then human = true break end
  end
  if not human then
    rooms[roomId] = nil
  end
  return true
end

--- 重连：用已有 userId 回到房间（T024）
function CMD.reconnect(userId, userName)
  for rid, room in pairs(rooms) do
    for i, p in ipairs(room.players) do
      if p.userId == userId then
        user_room[userId] = rid
        p.disconnected = false
        p.disconnectAt = nil
        p.userName = userName or p.userName
        sync_engine_seat(room, i - 1, p)
        notify_room(rid)
        return build_platform_state(room, userId)
      end
    end
  end
  local roomId = user_room[userId]
  local room = roomId and rooms[roomId]
  if not room then return nil, "不在房间" end
  for i, p in ipairs(room.players) do
    if p.userId == userId then
      p.disconnected = false
      p.disconnectAt = nil
      p.userName = userName or p.userName
      sync_engine_seat(room, i - 1, p)
      return build_platform_state(room, userId)
    end
  end
  return nil, "座位丢失"
end

function CMD.force_leave(userId)
  user_room[userId] = nil
  return CMD.leave(userId)
end

function CMD.get_room_id(userId)
  return user_room[userId]
end

function CMD.list_games()
  return {
    { gameId = "changsha_mj", name = "长沙麻将", enabled = Features.game_enabled("changsha_mj") },
    { gameId = "shaoyang_phz", name = "邵阳跑胡子", enabled = Features.game_enabled("shaoyang_phz") },
    { gameId = "chess", name = "象棋", enabled = Features.game_enabled("chess") },
    { gameId = "go", name = "围棋", enabled = Features.game_enabled("go") },
  }
end

--- T025/T026/T027：断线宽限 + 操作超时
local function kick_disconnected(room)
  local now = os.time()
  local grace = Config.reconnect_grace_sec or 60
  local changed = false
  for i, p in ipairs(room.players) do
    if p.disconnected and p.disconnectAt and (now - p.disconnectAt) >= grace then
      local uid = p.userId
      user_room[uid] = nil
      room.players[i] = {
        userId = -2000 - i,
        userName = "空位" .. i,
        isBot = true,
        ready = true,
      }
      if room.engine and room.engine.set_seat_meta then
        room.engine:set_seat_meta(i - 1, { isBot = true, autoPlay = false, disconnected = false })
      end
      changed = true
    end
  end
  return changed
end

local function room_tick(roomId, room)
  if room.state ~= "playing" or not room.engine then return false end
  local changed = kick_disconnected(room)
  if room.engine.check_timeout and room.engine:check_timeout() then
    changed = true
  end
  -- 每秒推进托管/机器人一步，禁止一口气打到结算
  if CMD._tick_autoplay(room) then
    changed = true
  end
  return changed
end

local function grace_loop()
  for roomId, room in pairs(rooms) do
    if room_tick(roomId, room) then
      notify_room(roomId)
    end
  end
  skynet.timeout(100, grace_loop)
end

skynet.start(function()
  Registry.bootstrap()
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
  skynet.timeout(100, grace_loop)
  skynet.error("platform room_mgr ready, games=", table.concat(Registry.list(), ","))
end)
