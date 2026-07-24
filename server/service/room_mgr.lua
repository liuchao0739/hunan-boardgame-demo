local skynet = require "skynet"
local Room = require "weihai.room"

local rooms = {}
local user_room = {}
local next_room_id = 100000

local function alloc_room_id()
  next_room_id = next_room_id + 1
  if next_room_id > 999999 then next_room_id = 100000 end
  return next_room_id
end

local function plain_player(p)
  return {
    userId = p.userId,
    userName = p.userName,
    seatIndex = p.seatIndex,
    prepare = p.prepare,
    is_bot = p.is_bot and true or false,
    hand = p.hand,
    discard = p.discard,
    peng = p.peng,
    gang = p.gang,
    score = p.score,
    currScore = p.currScore,
    totalScore = p.totalScore or 0,
    dingPiao = p.dingPiao,
    liangFeng = p.liangFeng,
    zuoZhuangTimez = p.zuoZhuangTimez or 0,
    ziMoTimez = p.ziMoTimez or 0,
    dianPaoTimez = p.dianPaoTimez or 0,
    huPaiTimez = p.huPaiTimez or 0,
  }
end

local function plain_room(room)
  if not room then return nil end
  local players = {}
  for _, p in ipairs(room.players) do
    players[#players + 1] = plain_player(p)
  end
  return {
    roomId = room.roomId,
    state = room.state,
    actUser = room.act_user,
    lastDiscard = room.last_discard,
    lastDiscardUser = room.last_discard_user,
    round = room.round,
    max_rounds = room.max_rounds,
    wallLeft = math.max(0, #room.wall - room.wall_idx + 1),
    gameType0 = room.gameType0,
    gameType1 = room.gameType1,
    rules = room.rules,
    roomUUId = room.roomUUId,
    claim_pending = room.claim_pending and true or false,
    ownerId = room.players[1] and room.players[1].userId or 0,
    players = players,
  }
end

local CMD = {}

function CMD.create(userId, userName, rules)
  -- 已在房间：直接返回现有房间（避免连点创建显示失败）
  local exist = user_room[userId]
  if exist and rooms[exist] then
    return plain_room(rooms[exist])
  end
  local rid = alloc_room_id()
  local room = Room.new(rid, { userId = userId, userName = userName }, rules)
  -- 单人调试：自动坐满 3 个机器人（已准备）
  room:fill_bots(3)
  rooms[rid] = room
  user_room[userId] = rid
  for _, p in ipairs(room.players) do
    if p.is_bot then user_room[p.userId] = rid end
  end
  return plain_room(room)
end

function CMD.join(userId, userName, roomId)
  local room = rooms[roomId]
  if not room then return nil, "room not found" end
  if room.state ~= "waiting" then return nil, "already started" end
  local seat, err = room:add_player(userId, userName, false)
  if err then return nil, err end
  user_room[userId] = roomId
  return plain_room(room)
end

function CMD.is_bot(userId)
  local rid = user_room[userId]
  local room = rooms[rid]
  if not room then return false end
  local p = room:player(userId)
  return p and p.is_bot and true or false
end

function CMD.bot_pick_discard(userId)
  local rid = user_room[userId]
  local room = rooms[rid]
  if not room then return nil end
  local p = room:player(userId)
  if not p or not p.hand or #p.hand == 0 then return nil end
  -- 简单策略：优先打孤张字牌，否则打最后一张
  local Tiles = require "weihai.tiles"
  for _, t in ipairs(p.hand) do
    if Tiles.is_feng_jian(t) then
      local n = 0
      for _, x in ipairs(p.hand) do if x == t then n = n + 1 end end
      if n == 1 then return t end
    end
  end
  return p.hand[#p.hand]
end

function CMD.room_of_user(userId)
  local rid = user_room[userId]
  if not rid then return nil end
  return plain_room(rooms[rid])
end

function CMD.get_room(roomId)
  return plain_room(rooms[roomId])
end

function CMD.prepare(userId, yes)
  local rid = user_room[userId]
  local room = rooms[rid]
  if not room then return nil, "not in room" end
  local p = room:player(userId)
  if not p then return nil, "no player" end
  p.prepare = yes ~= false
  local started = false
  local mo = nil
  if room:all_prepared() then
    mo = room:deal()
    started = true
  end
  return plain_room(room), started, mo
end

function CMD.chu_pai(userId, tile)
  local rid = user_room[userId]
  local room = rooms[rid]
  if not room then return nil, "not in room" end
  local ok, err = room:chu_pai(userId, tile)
  if not ok then return nil, err end
  return plain_room(room)
end

function CMD.draw_next(afterUserId)
  local rid = user_room[afterUserId]
  local room = rooms[rid]
  if not room then return nil, "not in room" end
  local next_uid = room:next_user(afterUserId)
  local mo, err = room:draw(next_uid)
  if not mo then
    return nil, "huangzhuang", plain_room(room), next_uid
  end
  return plain_room(room), next_uid, mo
end

function CMD.peng(userId)
  local rid = user_room[userId]
  local room = rooms[rid]
  if not room or not room.last_discard then return nil, "no discard" end
  local tile = room.last_discard
  local ok, err = room:peng(userId, tile)
  if not ok then return nil, err end
  return plain_room(room), tile
end

function CMD.guo(userId)
  local rid = user_room[userId]
  local room = rooms[rid]
  if not room then return nil, "not in room" end
  local done = room:guo(userId)
  return plain_room(room), done, room.last_discard_user
end

function CMD.who_can_claim(discarderId)
  local rid = user_room[discarderId]
  local room = rooms[rid]
  if not room then return {} end
  return room:who_can_claim()
end

function CMD.finish_claim_draw(discarderId)
  local rid = user_room[discarderId]
  local room = rooms[rid]
  if not room then return nil, "not in room" end
  -- 已被碰/胡走：不要再摸牌
  if not room.last_discard or room.last_discard_user ~= discarderId then
    return nil, "claimed"
  end
  room:clear_claim()
  return CMD.draw_next(discarderId)
end

function CMD.liang_feng(userId, t0, t1, t2)
  local rid = user_room[userId]
  local room = rooms[rid]
  if not room then return nil, "not in room" end
  local lf, err = room:liang_feng(userId, t0, t1, t2)
  if not lf then return nil, err end
  return plain_room(room), lf
end

function CMD.bu_feng(userId, tile)
  local rid = user_room[userId]
  local room = rooms[rid]
  if not room then return nil, "not in room" end
  if not tile then
    local p = room:player(userId)
    if not p then return nil, "no player" end
    for _, t in ipairs(p.hand) do
      if t == 101 or t == 103 or t == 105 or t == 107
        or t == 126 or t == 188 or t == 255 then
        tile = t break
      end
    end
  end
  if not tile then return nil, "no feng tile" end
  local lf, err = room:bu_feng(userId, tile)
  if not lf then return nil, err end
  return plain_room(room), lf
end

function CMD.hu(userId)
  local rid = user_room[userId]
  local room = rooms[rid]
  if not room then return nil, "not in room" end
  local items, err
  if room.act_user == userId then
    items, err = room:hu_zi_mo(userId)
  else
    items, err = room:hu_dian_pao(userId)
  end
  if not items then return nil, err end
  return plain_room(room), items
end

function CMD.hand_of(userId)
  local rid = user_room[userId]
  local room = rooms[rid]
  if not room then return nil end
  local p = room:player(userId)
  return p and p.hand or nil, room.act_user, room.roomId
end

function CMD.leave(userId)
  user_room[userId] = nil
end

skynet.start(function()
  skynet.dispatch("lua", function(_, _, cmd, ...)
    local f = CMD[cmd]
    if f then
      skynet.ret(skynet.pack(f(...)))
    else
      skynet.error("room_mgr unknown", cmd)
      skynet.ret(skynet.pack(nil, "unknown"))
    end
  end)
  skynet.error("weihai room_mgr ready")
end)
