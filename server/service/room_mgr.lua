local skynet = require "skynet"
local Room = require "room"
local Club = require "club"
local History = require "history"

local rooms = {}

local function get(id)
  return rooms[id]
end

local CMD = {}

function CMD.create(game_type, nick, agent)
  local ok, left = Club.cost_card(nick, 1)
  if not ok then return nil, left end
  local room = Room.new(game_type)
  rooms[room.id] = room
  local seat, err = room:add_player(nick, agent, false)
  if not seat then
    Club.add_cards(nick, 1)
    return nil, err
  end
  return {
    roomId = room.id,
    seat = seat,
    gameType = room.game_type,
    roomCards = left,
  }
end

function CMD.join(room_id, nick, agent)
  room_id = string.upper(room_id or "")
  local room = rooms[room_id]
  if not room then return nil, "房间不存在" end
  if room.started then return nil, "对局已开始" end
  local seat, err = room:add_player(nick, agent, false)
  if not seat then return nil, err end
  return {
    roomId = room.id,
    seat = seat,
    gameType = room.game_type,
    roomCards = Club.get_cards(nick),
  }
end

function CMD.fill_bots(room_id)
  local room = get(room_id)
  if not room then return "房间不存在" end
  room:fill_bots()
  return nil
end

function CMD.ready(room_id, seat)
  local room = get(room_id)
  if not room then return "房间不存在" end
  room:on_ready(seat)
  return nil
end

function CMD.action(room_id, seat, action, payload)
  local room = get(room_id)
  if not room then return "房间不存在" end
  return room:on_action(seat, action, payload)
end

function CMD.snapshot(room_id, seat)
  local room = get(room_id)
  if not room then return nil end
  return room:build_public(seat)
end

function CMD.broadcast(room_id)
  local room = get(room_id)
  if not room then return end
  for i = 0, room.n - 1 do
    local s = room.seats[i]
    if s and s.agent and not s.is_bot then
      skynet.send(s.agent, "lua", "push_state", room_id, i)
    end
  end
end

function CMD.chat(room_id, seat, nick, text)
  local room = get(room_id)
  if not room then return end
  for i = 0, room.n - 1 do
    local s = room.seats[i]
    if s and s.agent and not s.is_bot then
      skynet.send(s.agent, "lua", "push_chat", room_id, seat, nick, text)
    end
  end
end

function CMD.history_list()
  return History.list(20)
end

function CMD.history_get(id)
  return History.get(id)
end

function CMD.club_create(nick, name)
  return Club.create_club(nick, name)
end

function CMD.club_list()
  return Club.list_clubs()
end

function CMD.club_join(id, nick)
  return Club.join_club(id, nick)
end

function CMD.room_cards(nick)
  return Club.get_cards(nick)
end

function CMD.unbind(room_id, seat)
  local room = get(room_id)
  if not room or not room.seats[seat] then return end
  room.seats[seat].agent = nil
end

function CMD.bind(room_id, seat, agent)
  local room = get(room_id)
  if not room or not room.seats[seat] then return end
  room.seats[seat].agent = agent
end

skynet.start(function()
  math.randomseed(math.floor(skynet.time() * 1000))
  skynet.dispatch("lua", function(_, _, cmd, ...)
    local f = CMD[cmd]
    if f then
      skynet.ret(skynet.pack(f(...)))
    else
      skynet.error("room_mgr unknown cmd", cmd)
      skynet.ret(skynet.pack(nil, "unknown"))
    end
  end)
end)
