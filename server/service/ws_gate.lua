local skynet = require "skynet"
local websocket = require "http.websocket"
local json = require "json"
local Catalog = require "game_catalog"

local room_mgr
local MODE = ...

local handle = {}
local clients = {} -- ws_id -> { roomId, seat }

local function send_json(id, obj)
  local ok, err = pcall(websocket.write, id, json.encode(obj), "text")
  if not ok then
    skynet.error("ws write fail", id, err)
  end
end

local function broadcast_room(room_id)
  skynet.call(room_mgr, "lua", "broadcast", room_id)
end

if MODE == "agent" then
  function handle.connect(id)
    clients[id] = {}
  end

  function handle.handshake(id, header, url)
    send_json(id, {
      type = "hello",
      message = "湘桌 Skynet 服务已连接",
      stack = "skynet-lua / websocket",
      games = Catalog.list(),
      features = { "replay", "club", "room_cards", "recorder", "hot_update" },
    })
  end

  function handle.message(id, msg, msg_type)
    local ok, data = pcall(json.decode, msg)
    if not ok or type(data) ~= "table" then
      send_json(id, { type = "error", message = "JSON 错误" })
      return
    end
    local c = clients[id]
    if not c then return end

    if data.type == "ping" then
      send_json(id, { type = "pong" })
      return
    end

    if data.type == "create_room" then
      local info, err = skynet.call(
        room_mgr, "lua", "create",
        data.gameType or "changsha_mj",
        data.nick or "玩家",
        skynet.self()
      )
      if not info then
        send_json(id, { type = "error", message = err or "创建失败" })
        return
      end
      c.roomId = info.roomId
      c.seat = info.seat
      skynet.call(room_mgr, "lua", "bind", c.roomId, c.seat, skynet.self())
      send_json(id, {
        type = "room_created",
        roomId = info.roomId,
        seat = info.seat,
        gameType = info.gameType,
        roomCards = info.roomCards,
      })
      local state = skynet.call(room_mgr, "lua", "snapshot", c.roomId, c.seat)
      send_json(id, { type = "state", state = state })
      return
    end

    if data.type == "join_room" then
      local info, err = skynet.call(
        room_mgr, "lua", "join",
        data.roomId, data.nick or "玩家", skynet.self()
      )
      if not info then
        send_json(id, { type = "error", message = err or "加入失败" })
        return
      end
      c.roomId = info.roomId
      c.seat = info.seat
      skynet.call(room_mgr, "lua", "bind", c.roomId, c.seat, skynet.self())
      send_json(id, {
        type = "joined",
        roomId = info.roomId,
        seat = info.seat,
        gameType = info.gameType,
      })
      broadcast_room(c.roomId)
      return
    end

    if data.type == "history_list" then
      local list = skynet.call(room_mgr, "lua", "history_list")
      send_json(id, { type = "history", list = list })
      return
    end
    if data.type == "history_get" then
      local entry = skynet.call(room_mgr, "lua", "history_get", data.id)
      if not entry then send_json(id, { type = "error", message = "战绩不存在" }); return end
      send_json(id, { type = "replay", entry = entry })
      return
    end
    if data.type == "club_create" then
      send_json(id, { type = "club", club = skynet.call(room_mgr, "lua", "club_create", data.nick or "玩家", data.name) })
      return
    end
    if data.type == "club_list" then
      send_json(id, { type = "club_list", list = skynet.call(room_mgr, "lua", "club_list") })
      return
    end
    if data.type == "club_join" then
      local club, err = skynet.call(room_mgr, "lua", "club_join", data.id, data.nick or "玩家")
      if not club then send_json(id, { type = "error", message = err or "加入失败" }); return end
      send_json(id, { type = "club", club = club })
      return
    end
    if data.type == "room_cards" then
      send_json(id, { type = "room_cards", count = skynet.call(room_mgr, "lua", "room_cards", data.nick or "玩家") })
      return
    end

    if not c.roomId then
      send_json(id, { type = "error", message = "请先创建或加入房间" })
      return
    end

    if data.type == "fill_bots" then
      local err = skynet.call(room_mgr, "lua", "fill_bots", c.roomId)
      if err then send_json(id, { type = "error", message = err }) end
      broadcast_room(c.roomId)
      return
    end

    if data.type == "ready" then
      skynet.call(room_mgr, "lua", "ready", c.roomId, c.seat)
      broadcast_room(c.roomId)
      return
    end

    if data.type == "chat" then
      local text = tostring(data.text or ""):sub(1, 40)
      if text == "" then return end
      local nick = "座位" .. tostring(c.seat)
      if c.roomId and c.seat ~= nil then
        local room = skynet.call(room_mgr, "lua", "snapshot", c.roomId, c.seat)
        if room and room.seats then
          for _, s in ipairs(room.seats) do
            if s.seat == c.seat then nick = s.nick or nick end
          end
        end
      end
      skynet.call(room_mgr, "lua", "chat", c.roomId, c.seat, nick, text)
      return
    end

    if data.type == "action" then
      local err = skynet.call(room_mgr, "lua", "action", c.roomId, c.seat, data.action, {
        tile = data.tile,
        tiles = data.tiles,
      })
      if err then send_json(id, { type = "error", message = err }) end
      broadcast_room(c.roomId)
      return
    end
  end

  function handle.close(id)
    local c = clients[id]
    if c and c.roomId and c.seat then
      pcall(skynet.call, room_mgr, "lua", "unbind", c.roomId, c.seat)
    end
    clients[id] = nil
  end

  function handle.error(id)
    handle.close(id)
  end

  local CMD = {}
  function CMD.push_state(room_id, seat)
    for id, c in pairs(clients) do
      if c.roomId == room_id and c.seat == seat then
        local snap = skynet.call(room_mgr, "lua", "snapshot", room_id, seat)
        send_json(id, { type = "state", state = snap })
      end
    end
  end

  function CMD.push_chat(room_id, seat, nick, text)
    for id, c in pairs(clients) do
      if c.roomId == room_id then
        send_json(id, { type = "chat", seat = seat, nick = nick, text = text })
      end
    end
  end

  skynet.start(function()
    room_mgr = skynet.uniqueservice("room_mgr")
    skynet.dispatch("lua", function(_, _, cmd, ...)
      if cmd == "accept" then
        local id, protocol, addr = ...
        skynet.fork(function()
          local ok, err = websocket.accept(id, handle, protocol, addr)
          if not ok then skynet.error("ws accept", err) end
        end)
      elseif CMD[cmd] then
        CMD[cmd](...)
      end
    end)
  end)

else
  skynet.start(function()
    skynet.uniqueservice("room_mgr")
    local agents = {}
    for i = 1, 8 do
      agents[i] = skynet.newservice(SERVICE_NAME, "agent")
    end
    local balance = 1
    local port = tonumber(skynet.getenv("ws_port")) or 9948
    local socket = require "skynet.socket"
    local listen_id = socket.listen("0.0.0.0", port)
    skynet.error(string.format("========== 湘桌 Skynet WS :%d ==========", port))
    socket.start(listen_id, function(id, addr)
      skynet.error("accept", id, addr)
      skynet.send(agents[balance], "lua", "accept", id, "ws", addr)
      balance = balance + 1
      if balance > #agents then balance = 1 end
    end)
  end)
end
