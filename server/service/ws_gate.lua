local skynet = require "skynet"
local websocket = require "http.websocket"
local cjson = require "json"
local Codec = require "weihai.codec"
local Code = require "weihai.msg_code"
local pb = require "pb.wire"

local room_mgr
local passport
local club
local MODE = ...

local handle = {}
local clients = {}

local function send_bin(id, code, body)
  local frame = Codec.pack(code, body)
  local ok, err = pcall(websocket.write, id, frame, "binary")
  if not ok then
    skynet.error("ws binary write fail", id, err)
  end
end

local function encode_tile(t)
  return pb.encode_sint32(1, t or 0)
end

local function users_in_room(room)
  local set = {}
  if not room or not room.players then return set end
  for _, p in ipairs(room.players) do
    set[p.userId] = true
  end
  return set
end

local function broadcast_room(room, fn)
  local set = users_in_room(room)
  for id, c in pairs(clients) do
    if c.userId and set[c.userId] then
      fn(id, c)
    end
  end
end

local function push_hands(room)
  broadcast_room(room, function(id, c)
    for _, p in ipairs(room.players) do
      if p.userId == c.userId then
        send_bin(id, Code.MahjongInHandChangedResult, Codec.encode_mahjong_in_hand_changed_result(
          p.userId, p.hand, nil
        ))
      end
    end
  end)
end

local function save_settlement_record(room, items)
  if not room or not items then return end
  local players = {}
  for _, it in ipairs(items) do
    players[#players + 1] = {
      userId = it.userId,
      userName = "",
      headImg = "",
      sex = 1,
      currScore = it.currScore or 0,
      totalScore = it.totalScore or 0,
      seatIndex = it.seatIndex or 0,
      zhuangFlag = it.zhuangJiaFlag,
      ziMo = it.ziMo,
      hu = it.hu,
      dianPao = it.dianPao,
    }
    for _, rp in ipairs(room.players or {}) do
      if rp.userId == it.userId then
        players[#players].userName = rp.userName or ""
        break
      end
    end
  end
  local now = os.time() * 1000
  local rec = {
    gameType1 = room.gameType1 or 1001,
    gameType0 = room.gameType0 or 1,
    roomId = room.roomId,
    roomUUId = room.roomUUId,
    costRoomCard = 1,
    actualRoundCount = room.round or 1,
    createTime = now,
    overTime = now,
    player = players,
  }
  skynet.call(club, "lua", "add_record", rec)
  local stub = skynet.call(club, "lua", "write_playback", room.roomId, room.round or 1,
    cjson.encode({ roomId = room.roomId, round = room.round, items = items }))
  skynet.call(club, "lua", "add_round", room.roomUUId, {
    roundIndex = (room.round or 1) - 1,
    createTime = now,
    player = players,
    playbackStub = stub or "",
  })
end

local function maybe_room_settlement(room, items)
  if not room or (room.round or 0) < (room.max_rounds or 8) then
    return false
  end
  broadcast_room(room, function(wid, _)
    send_bin(wid, Code.RoomSettlementBroadcast, Codec.encode_room_settlement(items))
  end)
  return true
end

local function handle_login(id, body)
  local cmd = Codec.decode_user_login_cmd(body)
  local name = "测试用户"
  local okj, prop = pcall(cjson.decode, cmd.propertyStr or "{}")
  if okj and type(prop) == "table" then
    name = prop.testerName or prop.userName or prop.nick or name
  end
  local u = skynet.call(passport, "lua", "login", name)
  clients[id].userId = u.userId
  send_bin(id, Code.UserLoginResult, Codec.encode_user_login_result(u))
  skynet.error("login ok", u.userId, u.userName)
end

local function handle_detail(id)
  local u = skynet.call(passport, "lua", "get", clients[id].userId)
  if not u then return end
  send_bin(id, Code.GetMyDetailzResult, Codec.encode_get_my_detailz_result(u))
end

local function handle_joined(id)
  local room = skynet.call(room_mgr, "lua", "room_of_user", clients[id].userId)
  send_bin(id, Code.GetJoinedRoomIdResult, Codec.encode_get_joined_room_id_result(room and room.roomId or -1))
end

local function handle_create(id, body)
  local uid = clients[id].userId
  local u = skynet.call(passport, "lua", "get", uid)
  local cmd = Codec.decode_create_room_cmd(body)
  local room, err = skynet.call(room_mgr, "lua", "create", uid, u.userName, cmd.ruleItem)
  if not room then
    skynet.error("create fail", err)
    send_bin(id, Code.CreateRoomResult, Codec.encode_create_room_result(-1))
    return
  end
  send_bin(id, Code.CreateRoomResult, Codec.encode_create_room_result(room.roomId))
end

local function handle_join(id, body)
  local uid = clients[id].userId
  local u = skynet.call(passport, "lua", "get", uid)
  local cmd = Codec.decode_join_room_cmd(body)
  local room, err = skynet.call(room_mgr, "lua", "join", uid, u.userName, cmd.roomId)
  if not room then
    skynet.error("join fail", err)
    send_bin(id, Code.JoinRoomResult, Codec.encode_join_room_result({ roomId = -1 }))
    return
  end
  send_bin(id, Code.JoinRoomResult, Codec.encode_join_room_result(room))
end

local function handle_prepare(id)
  local uid = clients[id].userId
  local room, started, mo = skynet.call(room_mgr, "lua", "prepare", uid, true)
  if not room then return end
  send_bin(id, Code.PrepareResult, Codec.encode_prepare_result(true))
  broadcast_room(room, function(wid, _)
    send_bin(wid, Code.PrepareBroadcast, Codec.encode_prepare_broadcast(uid, true))
  end)
  if started then
    broadcast_room(room, function(wid, _)
      send_bin(wid, Code.OfficialStartBroadcast, "")
      send_bin(wid, Code.RoundStartedBroadcast, "")
      send_bin(wid, Code.RedirectActUserIdBroadcast, Codec.encode_redirect_act(room.actUser))
    end)
    push_hands(room)
    for wid, c in pairs(clients) do
      if c.userId == room.actUser then
        send_bin(wid, Code.MahjongMoPaiResult, encode_tile(mo))
      end
    end
  end
end

local function handle_chu(id, body)
  local uid = clients[id].userId
  local cmd = Codec.decode_chu_pai_cmd(body)
  local room, err = skynet.call(room_mgr, "lua", "chu_pai", uid, cmd.t)
  if not room then
    skynet.error("chu fail", err)
    return
  end
  send_bin(id, Code.MahjongChuPaiResult, "")
  broadcast_room(room, function(wid, _)
    send_bin(wid, Code.MahjongChuPaiBroadcast, Codec.encode_chu_pai_broadcast(uid, cmd.t))
  end)

  local r2, next_uid, mo = skynet.call(room_mgr, "lua", "draw_next", uid)
  if not r2 then
    broadcast_room(room, function(wid, _)
      send_bin(wid, Code.MahjongHuangZhuangBroadcast, "")
    end)
    return
  end
  broadcast_room(r2, function(wid, _)
    send_bin(wid, Code.RedirectActUserIdBroadcast, Codec.encode_redirect_act(next_uid))
    send_bin(wid, Code.MahjongMoPaiBroadcast, "")
  end)
  for wid, c in pairs(clients) do
    if c.userId == next_uid then
      local hand = nil
      for _, p in ipairs(r2.players) do
        if p.userId == next_uid then hand = p.hand break end
      end
      send_bin(wid, Code.MahjongMoPaiResult, encode_tile(mo))
      send_bin(wid, Code.MahjongInHandChangedResult, Codec.encode_mahjong_in_hand_changed_result(next_uid, hand, mo))
    end
  end
end

local function handle_peng(id)
  local uid = clients[id].userId
  local room, tile = skynet.call(room_mgr, "lua", "peng", uid)
  if not room then return end
  send_bin(id, Code.MahjongPengResult, "")
  broadcast_room(room, function(wid, _)
    send_bin(wid, Code.MahjongPengBroadcast, Codec.encode_chu_pai_broadcast(uid, tile or 0))
    send_bin(wid, Code.RedirectActUserIdBroadcast, Codec.encode_redirect_act(uid))
  end)
  push_hands(room)
end

local function handle_liang_feng(id, body)
  local uid = clients[id].userId
  local cmd = Codec.decode_liang_feng_cmd(body)
  local room, lf = skynet.call(room_mgr, "lua", "liang_feng", uid, cmd.t0, cmd.t1, cmd.t2)
  if not room then
    skynet.error("liang_feng fail", lf)
    return
  end
  send_bin(id, Code.MahjongLiangFengResult, Codec.encode_liang_feng_result(lf))
  broadcast_room(room, function(wid, _)
    send_bin(wid, Code.MahjongLiangFengBroadcast, Codec.encode_liang_feng_broadcast(uid, lf))
  end)
  push_hands(room)
end

local function handle_bu_feng(id)
  local uid = clients[id].userId
  local room, lf = skynet.call(room_mgr, "lua", "bu_feng", uid)
  if not room then
    skynet.error("bu_feng fail", lf)
    return
  end
  send_bin(id, Code.MahjongBuFengResult, Codec.encode_liang_feng_result(lf))
  broadcast_room(room, function(wid, _)
    send_bin(wid, Code.MahjongBuFengBroadcast, Codec.encode_liang_feng_broadcast(uid, lf))
  end)
  push_hands(room)
end

local function handle_hu(id)
  local uid = clients[id].userId
  local room, items = skynet.call(room_mgr, "lua", "hu", uid)
  if not room then
    skynet.error("hu fail", items)
    return
  end
  send_bin(id, Code.MahjongHuOrZiMoResult, "")
  broadcast_room(room, function(wid, _)
    send_bin(wid, Code.MahjongHuOrZiMoBroadcast, pb.encode_sint32(1, uid))
    send_bin(wid, Code.RoundSettlementBroadcast, Codec.encode_round_settlement(items))
  end)
  save_settlement_record(room, items)
  maybe_room_settlement(room, items)
end

local function handle_create_club(id, body)
  local uid = clients[id].userId
  local cmd = Codec.decode_create_club_cmd(body)
  local c = skynet.call(club, "lua", "create_club", uid, cmd.clubName)
  send_bin(id, Code.CreateClubResult, Codec.encode_create_club_result(c.clubId, c.clubName))
end

local function handle_join_club(id, body)
  local uid = clients[id].userId
  local cmd = Codec.decode_join_club_cmd(body)
  local c, ok = skynet.call(club, "lua", "join_club", uid, cmd.clubId)
  send_bin(id, Code.JoinClubResult, Codec.encode_join_club_result(cmd.clubId, ok and c ~= nil))
end

local function handle_joined_clubs(id)
  local uid = clients[id].userId
  local list = skynet.call(club, "lua", "joined_list", uid)
  send_bin(id, Code.GetJoinedClubListResult, Codec.encode_get_joined_club_list_result(list))
end

local function handle_club_detail(id, body)
  local f = pb.decode(body or "")
  local clubId = pb.get_sint32(f, 1, 0)
  local c = skynet.call(club, "lua", "detail", clubId)
  if not c then
    send_bin(id, Code.GetClubDetailzResult, "")
    return
  end
  send_bin(id, Code.GetClubDetailzResult, Codec.encode_get_club_detailz_result(c))
end

local function handle_table_list(id, body)
  local cmd = Codec.decode_get_table_list_cmd(body)
  local r = skynet.call(club, "lua", "table_list", cmd.clubId, cmd.pageIndex)
  send_bin(id, Code.GetTableListResult, Codec.encode_get_table_list_result(r))
end

local function handle_record_list(id, body)
  local uid = clients[id].userId
  local cmd = Codec.decode_get_record_list_cmd(body)
  local r = skynet.call(club, "lua", "list_records", uid, cmd.clubId, cmd.pageIndex)
  send_bin(id, Code.GetRecordListResult, Codec.encode_get_record_list_result(r))
end

local function handle_record_detail(id, body)
  local cmd = Codec.decode_get_record_detailz_cmd(body)
  local r = skynet.call(club, "lua", "record_detail", cmd.roomUUId)
  send_bin(id, Code.GetRecordDetailzResult, Codec.encode_get_record_detailz_result(r))
end

local function dispatch(id, code, body)
  if code == Code.UserLoginCmd then
    handle_login(id, body)
  elseif code == Code.GetMyDetailzCmd then
    handle_detail(id)
  elseif code == Code.GetJoinedRoomIdCmd then
    handle_joined(id)
  elseif code == Code.CreateRoomCmd then
    handle_create(id, body)
  elseif code == Code.JoinRoomCmd then
    handle_join(id, body)
  elseif code == Code.PrepareCmd then
    handle_prepare(id)
  elseif code == Code.MahjongChuPaiCmd then
    handle_chu(id, body)
  elseif code == Code.MahjongPengCmd then
    handle_peng(id)
  elseif code == Code.MahjongGuoCmd then
    send_bin(id, Code.MahjongGuoResult, "")
  elseif code == Code.MahjongHuCmd then
    handle_hu(id)
  elseif code == Code.MahjongLiangFengCmd then
    handle_liang_feng(id, body)
  elseif code == Code.MahjongBuFengCmd then
    handle_bu_feng(id)
  elseif code == Code.SyncRoomDataCmd then
    local room = skynet.call(room_mgr, "lua", "room_of_user", clients[id].userId)
    if room then push_hands(room) end
  elseif code == Code.GetJoinedClubListCmd then
    handle_joined_clubs(id)
  elseif code == Code.CreateClubCmd then
    handle_create_club(id, body)
  elseif code == Code.JoinClubCmd then
    handle_join_club(id, body)
  elseif code == Code.GetClubDetailzCmd then
    handle_club_detail(id, body)
  elseif code == Code.GetTableListCmd then
    handle_table_list(id, body)
  elseif code == Code.SendChatMsgCmd then
    send_bin(id, Code.SendChatMsgResult, "")
    local room = skynet.call(room_mgr, "lua", "room_of_user", clients[id].userId)
    broadcast_room(room, function(wid, _)
      send_bin(wid, Code.ChatMsgBroadcast, body or "")
    end)
  elseif code == Code.GetRecordListCmd then
    handle_record_list(id, body)
  elseif code == Code.GetRecordDetailzCmd then
    handle_record_detail(id, body)
  else
    skynet.error("unhandled msgCode", code)
  end
end

if MODE == "agent" then
  function handle.connect(id)
    clients[id] = {}
  end
  function handle.handshake(id, header, url)
    skynet.error("ws handshake", id, url)
  end
  function handle.message(id, msg, msg_type)
    local code, body = Codec.unpack(msg)
    if not code then skynet.error("bad frame") return end
    local ok, err = pcall(dispatch, id, code, body or "")
    if not ok then skynet.error("dispatch err", err) end
  end
  function handle.close(id)
    local c = clients[id]
    if c and c.userId then skynet.call(room_mgr, "lua", "leave", c.userId) end
    clients[id] = nil
  end
  function handle.error(id) handle.close(id) end
  skynet.start(function()
    passport = skynet.uniqueservice("passport")
    room_mgr = skynet.uniqueservice("room_mgr")
    club = skynet.uniqueservice("club_record")
    skynet.dispatch("lua", function(_, _, cmd, ...)
      if cmd == "accept" then
        local sid, protocol, addr = ...
        skynet.fork(function()
          local ok, err = websocket.accept(sid, handle, protocol, addr)
          if not ok then skynet.error("ws accept", err) end
        end)
      end
    end)
  end)
else
  skynet.start(function()
    skynet.uniqueservice("passport")
    skynet.uniqueservice("room_mgr")
    skynet.uniqueservice("club_record")
    local agents = {}
    for i = 1, 8 do agents[i] = skynet.newservice(SERVICE_NAME, "agent") end
    local balance = 1
    local port = tonumber(skynet.getenv("ws_port")) or 20480
    local socket = require "skynet.socket"
    local listen_id = socket.listen("0.0.0.0", port)
    skynet.error(string.format("========== 威海麻将 Skynet WS :%d (MsgBus/Protobuf) ==========", port))
    socket.start(listen_id, function(id, addr)
      skynet.error("accept", id, addr)
      skynet.send(agents[balance], "lua", "accept", id, "ws", addr)
      balance = balance + 1
      if balance > #agents then balance = 1 end
    end)
  end)
end
