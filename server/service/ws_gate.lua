-- 平台 WebSocket 网关：JSON 信封
local skynet = require "skynet"
local socket = require "skynet.socket"
local websocket = require "http.websocket"
local Protocol = require "platform.protocol"

local passport
local room_mgr

local clients = {} -- fd -> { userId, userName }

local function send_text(fd, text)
  local ok, err = pcall(websocket.write, fd, text, "text")
  if not ok then
    skynet.error("ws write fail", fd, err)
  end
end

local function push(fd, ns, cmd, body)
  send_text(fd, Protocol.push(ns, cmd, body))
end

local function reply(fd, req, cmd, body)
  send_text(fd, Protocol.reply(req, cmd, body))
end

local function push_state(fd, state)
  push(fd, "platform", "state", state)
end

local function broadcast_room(roomId, exceptFd)
  -- 简化：向所有同房用户推 sync 结果
  for fd, c in pairs(clients) do
    if c.userId and fd ~= exceptFd then
      local rid = skynet.call(room_mgr, "lua", "get_room_id", c.userId)
      if rid == roomId then
        local st = skynet.call(room_mgr, "lua", "sync", c.userId)
        if st then push_state(fd, st) end
      end
    end
  end
end

local function handle_platform(fd, req)
  local cmd = req.cmd
  local body = req.body or {}
  local c = clients[fd] or {}

  if cmd == "login" then
    local name = body.name or body.testerName or "测试用户"
    local u = skynet.call(passport, "lua", "login", name)
    clients[fd] = { userId = u.userId, userName = u.userName, ticket = u.ticket }
    reply(fd, req, "loginResult", {
      ok = true,
      userId = u.userId,
      userName = u.userName,
      ticket = u.ticket,
      roomCard = u.roomCard,
    })
    return
  end

  if cmd == "ping" then
    reply(fd, req, "pong", {
      ok = true,
      ts = os.time(),
      uptime = skynet.now() / 100,
      userId = c.userId,
    })
    return
  end

  -- ticket 恢复登录（重连）
  if cmd == "reconnect" or cmd == "loginTicket" then
    local ticket = body.ticket
    local u = skynet.call(passport, "lua", "by_ticket", ticket)
    if not u then
      reply(fd, req, "error", { message = "ticket 无效或过期" })
      return
    end
    clients[fd] = { userId = u.userId, userName = u.userName, ticket = ticket }
    local st = skynet.call(room_mgr, "lua", "reconnect", u.userId, u.userName)
    reply(fd, req, "reconnectResult", {
      ok = true,
      userId = u.userId,
      userName = u.userName,
      roomCard = u.roomCard,
      inRoom = st ~= nil,
    })
    if st then push_state(fd, st) end
    return
  end

  if not c.userId then
    reply(fd, req, "error", { message = "请先登录" })
    return
  end

  if cmd == "listGames" then
    reply(fd, req, "listGamesResult", {
      games = skynet.call(room_mgr, "lua", "list_games"),
    })
    return
  end

  if cmd == "createRoom" then
    local st, err = skynet.call(room_mgr, "lua", "create", c.userId, c.userName, body.gameId or "changsha_mj", body.rules)
    if not st then
      reply(fd, req, "error", { message = err or "创建失败" })
      return
    end
    reply(fd, req, "createRoomResult", st)
    push_state(fd, st)
    return
  end

  if cmd == "joinRoom" then
    local st, err = skynet.call(room_mgr, "lua", "join", c.userId, c.userName, tonumber(body.roomId))
    if not st then
      reply(fd, req, "error", { message = err or "加入失败" })
      return
    end
    reply(fd, req, "joinRoomResult", st)
    push_state(fd, st)
    broadcast_room(st.roomId, fd)
    return
  end

  if cmd == "prepare" then
    local st, err = skynet.call(room_mgr, "lua", "prepare", c.userId, body.yes ~= false)
    if not st then
      reply(fd, req, "error", { message = err or "准备失败" })
      return
    end
    reply(fd, req, "prepareResult", st)
    push_state(fd, st)
    broadcast_room(st.roomId, fd)
    return
  end

  if cmd == "sync" then
    local st, err = skynet.call(room_mgr, "lua", "sync", c.userId)
    if not st then
      reply(fd, req, "error", { message = err or "同步失败" })
      return
    end
    reply(fd, req, "syncResult", st)
    push_state(fd, st)
    return
  end

  if cmd == "leave" then
    local rid = skynet.call(room_mgr, "lua", "get_room_id", c.userId)
    skynet.call(room_mgr, "lua", "leave", c.userId)
    reply(fd, req, "leaveResult", { ok = true })
    if rid then broadcast_room(rid, fd) end
    return
  end

  reply(fd, req, "error", { message = "未知平台命令 " .. tostring(cmd) })
end

local function handle_game(fd, req)
  local c = clients[fd]
  if not c or not c.userId then
    reply(fd, req, "error", { message = "请先登录" })
    return
  end
  local st, err = skynet.call(room_mgr, "lua", "action", c.userId, req.ns, req.cmd, req.body)
  if not st then
    reply(fd, req, "error", { message = err or "操作失败" })
    return
  end
  reply(fd, req, "actionResult", { ok = true })
  push_state(fd, st)
  broadcast_room(st.roomId, fd)
end

local function on_message(fd, msg, msg_type)
  if msg_type ~= "text" and msg_type ~= "binary" then return end
  local text = msg
  if type(msg) ~= "string" then
    -- binary as string
    text = tostring(msg)
  end
  local req, err = Protocol.decode(text)
  if not req then
    push(fd, "platform", "error", { message = "协议错误: " .. tostring(err) })
    return
  end
  if req.ns == "platform" then
    local ok, e = pcall(handle_platform, fd, req)
    if not ok then
      skynet.error("handle_platform", e)
      reply(fd, req, "error", { message = "服务器错误" })
    end
  else
    local ok, e = pcall(handle_game, fd, req)
    if not ok then
      skynet.error("handle_game", e)
      reply(fd, req, "error", { message = "服务器错误: " .. tostring(e) })
    end
  end
end

local handle = {}

function handle.connect(fd)
  clients[fd] = {}
end

function handle.handshake(fd, header, url)
  skynet.error("ws handshake", fd, url)
end

function handle.message(fd, msg, msg_type)
  on_message(fd, msg, msg_type)
end

function handle.close(fd)
  local c = clients[fd]
  if c and c.userId then
    skynet.call(room_mgr, "lua", "leave", c.userId)
  end
  clients[fd] = nil
end

function handle.error(fd)
  handle.close(fd)
end

-- 给 room_mgr 一个显式 bot tick 入口
-- 在 prepare 后调用

skynet.start(function()
  passport = skynet.uniqueservice("passport")
  room_mgr = skynet.uniqueservice("room_mgr")

  -- monkey: add tickBots CMD usage via action "tickBots" on platform? add to room_mgr
  local port = tonumber(skynet.getenv("ws_port")) or 20480
  local listen_id = socket.listen("0.0.0.0", port)
  skynet.error(string.format("========== 湘桌 WS :%d (JSON) ==========", port))
  socket.start(listen_id, function(id, addr)
    skynet.error("accept", id, addr)
    skynet.fork(function()
      local ok, err = websocket.accept(id, handle, "ws", addr)
      if not ok then skynet.error("ws accept", err) end
    end)
  end)
end)
