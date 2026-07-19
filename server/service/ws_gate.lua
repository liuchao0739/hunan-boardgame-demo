local skynet = require "skynet"
local websocket = require "http.websocket"
local json = require "json"

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
