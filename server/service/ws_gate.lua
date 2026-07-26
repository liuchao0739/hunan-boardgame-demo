-- 平台 WebSocket 网关：JSON 信封
local skynet = require "skynet"
local socket = require "skynet.socket"
local websocket = require "http.websocket"
local Protocol = require "platform.protocol"
local Log = require "platform.log"
local Metrics = require "platform.metrics"
local Registry = require "game.registry"

local passport
local room_mgr
local matchmaking
local club_record

local clients = {} -- fd -> { userId, userName, ticket }
local user_fd = {} -- userId -> fd（T089 单点登录）

local GATE_CMD = {}

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

local function bind_user(fd, userId, userName, ticket)
  clients[fd] = { userId = userId, userName = userName, ticket = ticket }
  user_fd[userId] = fd
  local n = 0
  for _, c in pairs(clients) do
    if c.userId then n = n + 1 end
  end
  Metrics.set_online(n)
end

--- T089：同账号新连接顶掉旧 fd
local function kick_old_fd(userId, newFd)
  local oldFd = user_fd[userId]
  if not oldFd or oldFd == newFd then return end
  push(oldFd, "platform", "kicked", { reason = "duplicate_login", message = "账号在其他设备登录" })
  pcall(websocket.close, oldFd)
  clients[oldFd] = nil
end

local function broadcast_room(roomId, exceptFd)
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

function GATE_CMD.push_user(userId, ns, cmd, body)
  local fd = user_fd[userId]
  if fd then push(fd, ns, cmd, body) end
end

function GATE_CMD.broadcast_social(roomId, cmd, body, exceptFd)
  for fd, c in pairs(clients) do
    if c.userId and fd ~= exceptFd then
      local rid = skynet.call(room_mgr, "lua", "get_room_id", c.userId)
      if rid == roomId then
        push(fd, "platform", cmd, body)
      end
    end
  end
end

function GATE_CMD.broadcast_room(roomId, exceptFd)
  broadcast_room(roomId, exceptFd)
end

function GATE_CMD.list_online()
  local list = {}
  for _, c in pairs(clients) do
    if c.userId then
      list[#list + 1] = {
        userId = c.userId,
        userName = c.userName,
        ticket = c.ticket,
      }
    end
  end
  return list
end

local function login_result(fd, req, u, err)
  if not u then
    reply(fd, req, "error", { message = err or "登录失败" })
    return
  end
  kick_old_fd(u.userId, fd)
  bind_user(fd, u.userId, u.userName, u.ticket)
  reply(fd, req, "loginResult", {
    ok = true,
    userId = u.userId,
    userName = u.userName,
    ticket = u.ticket,
    roomCard = u.roomCard,
    diamond = u.diamond or 0,
    dailyGift = u.dailyGift or 0,
    headImg = u.headImg,
    ukeyExpireAt = u.ukeyExpireAt,
  })
end

local function handle_platform(fd, req)
  local cmd = req.cmd
  local body = req.body or {}
  local c = clients[fd] or {}

  if cmd == "register" then
    local u, err = skynet.call(passport, "lua", "register", body.name, body.password)
    login_result(fd, req, u, err)
    return
  end

  if cmd == "login" or cmd == "guestLogin" then
    local mode = body.mode
    local u, err
    if cmd == "guestLogin" or mode == "guest" or (body.deviceId and not body.password and not body.name) then
      u, err = skynet.call(passport, "lua", "guest_login", body.deviceId)
    elseif body.password and body.password ~= "" then
      u, err = skynet.call(passport, "lua", "login_account", body.name, body.password)
    else
      u, err = skynet.call(passport, "lua", "login", body.name or body.testerName or "测试用户")
    end
    login_result(fd, req, u, err)
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

  -- ticket 恢复登录（T024）
  if cmd == "reconnect" or cmd == "loginTicket" then
    local ticket = body.ticket
    local u = skynet.call(passport, "lua", "by_ticket", ticket)
    if not u then
      reply(fd, req, "error", { message = "ticket 无效或已过期，请重新登录" })
      return
    end
    kick_old_fd(u.userId, fd)
    bind_user(fd, u.userId, u.userName, ticket)
    local st = skynet.call(room_mgr, "lua", "reconnect", u.userId, u.userName)
    reply(fd, req, "reconnectResult", {
      ok = true,
      userId = u.userId,
      userName = u.userName,
      ticket = ticket,
      roomCard = u.roomCard,
      diamond = u.diamond or 0,
      inRoom = st ~= nil,
    })
    if st then push_state(fd, st) end
    return
  end

  if cmd == "refreshTicket" then
    local ticket = body.ticket or c.ticket
    local u, err = skynet.call(passport, "lua", "refresh_ticket", ticket)
    if not u then
      reply(fd, req, "error", { message = err or "ticket 刷新失败" })
      return
    end
    if c.userId and c.userId == u.userId then
      c.ticket = u.ticket
    end
    reply(fd, req, "refreshTicketResult", {
      ok = true,
      ticket = u.ticket,
      ukeyExpireAt = u.ukeyExpireAt,
    })
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

  if cmd == "quickMatch" or cmd == "enqueueMatch" then
    local res, err = skynet.call(matchmaking, "lua", "enqueue", c.userId, c.userName, body.gameId)
    if not res then
      reply(fd, req, "error", { message = err or "匹配失败" })
      return
    end
    reply(fd, req, "matchQueueResult", res)
    return
  end

  if cmd == "cancelMatch" then
    local res = skynet.call(matchmaking, "lua", "cancel", c.userId)
    reply(fd, req, "cancelMatchResult", res)
    return
  end

  if cmd == "createClub" then
    local club, err = skynet.call(club_record, "lua", "create_club", c.userId, body.name or body.clubName)
    if not club then
      reply(fd, req, "error", { message = err or "创建失败" })
      return
    end
    reply(fd, req, "createClubResult", { ok = true, clubId = club.clubId, clubName = club.clubName })
    return
  end

  if cmd == "joinClub" then
    local club, ok = skynet.call(club_record, "lua", "join_club", c.userId, tonumber(body.clubId))
    if not club or not ok then
      reply(fd, req, "error", { message = "俱乐部不存在或加入失败" })
      return
    end
    reply(fd, req, "joinClubResult", { ok = true, clubId = club.clubId, clubName = club.clubName })
    return
  end

  if cmd == "listClubs" then
    local list = skynet.call(club_record, "lua", "joined_list", c.userId)
    reply(fd, req, "listClubsResult", { clubs = list or {} })
    return
  end

  if cmd == "getBalance" then
    local bal = skynet.call(passport, "lua", "get_balance", c.userId)
    reply(fd, req, "getBalanceResult", bal)
    return
  end

  if cmd == "getLedger" then
    local data = skynet.call(passport, "lua", "get_ledger", c.userId, body.page, body.pageSize)
    reply(fd, req, "getLedgerResult", data)
    return
  end

  if cmd == "shopList" then
    local data = skynet.call(passport, "lua", "shop_list")
    reply(fd, req, "shopListResult", data)
    return
  end

  if cmd == "exchangeDiamond" then
    local res, err = skynet.call(passport, "lua", "exchange_diamond", c.userId, body.amount)
    if not res then
      reply(fd, req, "error", { message = err or "兑换失败" })
      return
    end
    reply(fd, req, "exchangeDiamondResult", res)
    return
  end

  if cmd == "claimDailyGift" then
    local res = skynet.call(passport, "lua", "claim_daily_gift", c.userId)
    reply(fd, req, "claimDailyGiftResult", res)
    return
  end

  if cmd == "sendEmoji" then
    local payload, err = skynet.call(room_mgr, "lua", "send_emoji", c.userId, body)
    if not payload then
      reply(fd, req, "error", { message = err or "发送失败" })
      return
    end
    reply(fd, req, "sendEmojiResult", { ok = true })
    push(fd, "platform", "emojiEvent", payload)
    GATE_CMD.broadcast_social(payload.roomId, "emojiEvent", payload, fd)
    return
  end

  if cmd == "sendPhrase" then
    local payload, err = skynet.call(room_mgr, "lua", "send_phrase", c.userId, body)
    if not payload then
      reply(fd, req, "error", { message = err or "发送失败" })
      return
    end
    reply(fd, req, "sendPhraseResult", { ok = true })
    push(fd, "platform", "phraseEvent", payload)
    GATE_CMD.broadcast_social(payload.roomId, "phraseEvent", payload, fd)
    return
  end

  if cmd == "kickPlayer" then
    local res, err = skynet.call(room_mgr, "lua", "kick", c.userId, tonumber(body.userId or body.targetUserId))
    if not res then
      reply(fd, req, "error", { message = err or "踢人失败" })
      return
    end
    reply(fd, req, "kickPlayerResult", res)
    local kickedFd = user_fd[res.kickedUserId]
    if kickedFd then
      push(kickedFd, "platform", "kicked", { reason = "host_kick", message = "已被房主请出房间" })
      skynet.call(room_mgr, "lua", "force_leave", res.kickedUserId)
    end
    broadcast_room(res.roomId, fd)
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
    local st, err = skynet.call(room_mgr, "lua", "join", c.userId, c.userName, tonumber(body.roomId), body.password)
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

  if cmd == "autoPlay" then
    local st, err = skynet.call(room_mgr, "lua", "set_auto_play", c.userId, body.yes ~= false)
    if not st then
      reply(fd, req, "error", { message = err or "托管失败" })
      return
    end
    reply(fd, req, "autoPlayResult", { ok = true })
    push_state(fd, st)
    broadcast_room(st.roomId, fd)
    return
  end

  if cmd == "dissolveVote" then
    local st, err = skynet.call(room_mgr, "lua", "dissolve_vote", c.userId, body)
    if not st and err then
      reply(fd, req, "error", { message = err })
      return
    end
    if st and st.dissolved then
      reply(fd, req, "dissolveResult", { ok = true, dissolved = true, roomId = st.roomId })
      for _, uid in ipairs(st.members or {}) do
        local mfd = user_fd[uid]
        if mfd and mfd ~= fd then
          push(mfd, "platform", "dissolveResult", { ok = true, dissolved = true, roomId = st.roomId })
        end
      end
      return
    end
    reply(fd, req, "dissolveResult", { ok = true })
    if st then
      push_state(fd, st)
      broadcast_room(st.roomId, fd)
    end
    return
  end

  if cmd == "sync" then
    local st, err = skynet.call(room_mgr, "lua", "sync", c.userId, body.roomId)
    if not st then
      reply(fd, req, "error", { message = err or "同步失败" })
      return
    end
    reply(fd, req, "syncResult", st)
    push_state(fd, st)
    return
  end

  if cmd == "getRecords" or cmd == "listRecords" then
    local page = tonumber(body.page) or 1
    local pageSize = tonumber(body.pageSize) or 20
    local data = skynet.call(passport, "lua", "get_records", c.userId, page, pageSize)
    reply(fd, req, "getRecordsResult", data)
    return
  end

  if cmd == "updateProfile" then
    local u, err = skynet.call(passport, "lua", "update_profile", c.userId, body)
    if not u then
      reply(fd, req, "error", { message = err or "更新失败" })
      return
    end
    c.userName = u.userName
    reply(fd, req, "updateProfileResult", u)
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
  if not Registry.known(req.ns) then
    reply(fd, req, "error", { message = "未知 gameId: " .. tostring(req.ns) })
    return
  end
  Log.info("ws.game", { userId = c.userId, gameId = req.ns, cmd = req.cmd })
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
    if user_fd[c.userId] == fd then
      user_fd[c.userId] = nil
    end
    skynet.call(room_mgr, "lua", "leave", c.userId)
  end
  clients[fd] = nil
  local n = 0
  for _, cc in pairs(clients) do
    if cc.userId then n = n + 1 end
  end
  Metrics.set_online(n)
end

function handle.error(fd)
  handle.close(fd)
end

skynet.start(function()
  -- 各服务 Lua VM 独立，网关也必须注册玩法，否则 gameAction 全被「未知 gameId」拒掉
  Registry.bootstrap()

  passport = skynet.uniqueservice("passport")
  room_mgr = skynet.uniqueservice("room_mgr")
  matchmaking = skynet.uniqueservice("matchmaking")
  club_record = skynet.uniqueservice("club_record")

  skynet.dispatch("lua", function(_, _, cmd, ...)
    local f = GATE_CMD[cmd]
    if f then
      skynet.ret(skynet.pack(f(...)))
    else
      skynet.ret(skynet.pack(nil, "unknown " .. tostring(cmd)))
    end
  end)

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
