local pb = require "pb.wire"
local Code = require "weihai.msg_code"

local M = {}

function M.decode_user_login_cmd(body)
  local f = pb.decode(body)
  return {
    loginMethod = pb.get_sint32(f, 1, 0),
    propertyStr = pb.get_string(f, 2, ""),
  }
end

function M.encode_user_login_result(r)
  return table.concat({
    pb.encode_sint32(1, r.userId or -1),
    pb.encode_string(2, r.userName or ""),
    pb.encode_string(3, r.ticket or ""),
    pb.encode_string(4, r.ukeyStr or ""),
    pb.encode_int64(5, r.ukeyExpireAt or 0),
  })
end

function M.decode_create_room_cmd(body)
  local f = pb.decode(body)
  local rules = {}
  for _, raw in ipairs(pb.get_repeated_bytes(f, 3)) do
    local rf = pb.decode(raw)
    rules[#rules + 1] = {
      key = pb.get_sint32(rf, 1, 0),
      val = pb.get_sint32(rf, 2, 0),
    }
  end
  return {
    gameType0 = pb.get_sint32(f, 1, 1),
    gameType1 = pb.get_sint32(f, 2, 1001),
    ruleItem = rules,
  }
end

function M.encode_create_room_result(roomId)
  return pb.encode_sint32(1, roomId)
end

function M.decode_join_room_cmd(body)
  local f = pb.decode(body)
  return { roomId = pb.get_sint32(f, 1, 0) }
end

function M.encode_join_room_result(r)
  local parts = {
    pb.encode_sint32(1, r.roomId),
    pb.encode_sint32(2, r.gameType0 or 1),
    pb.encode_sint32(3, r.gameType1 or 1001),
  }
  if r.ruleItem then
    for _, it in ipairs(r.ruleItem) do
      local kv = pb.encode_sint32(1, it.key) .. pb.encode_sint32(2, it.val)
      parts[#parts + 1] = pb.encode_message(4, kv)
    end
  end
  return table.concat(parts)
end

function M.encode_get_my_detailz_result(u)
  return table.concat({
    pb.encode_sint32(1, u.userId),
    pb.encode_string(2, u.userName or ""),
    pb.encode_string(3, u.headImg or ""),
    pb.encode_sint32(4, u.sex or 1),
    pb.encode_sint32(5, u.roomCard or 9999),
    pb.encode_string(6, u.lastLoginIp or "127.0.0.1"),
  })
end

function M.encode_get_joined_room_id_result(roomId)
  return pb.encode_sint32(1, roomId or -1)
end

function M.encode_prepare_result(ok)
  return pb.encode_bool(1, ok ~= false)
end

function M.encode_prepare_broadcast(userId, prepare)
  return pb.encode_sint32(1, userId) .. pb.encode_bool(2, prepare and true or false)
end

-- Hand tile as sint32 value (client convention: 1-9 wan, 11-19 tiao, 21-29 tong, 31-37 zi)
function M.encode_mahjong_in_hand_changed_result(userId, tiles, moPai)
  local parts = { pb.encode_sint32(1, userId) }
  for _, t in ipairs(tiles or {}) do
    parts[#parts + 1] = pb.encode_sint32(2, t) -- repeated field 2
  end
  if moPai then
    parts[#parts + 1] = pb.encode_sint32(3, moPai)
  end
  return table.concat(parts)
end

function M.encode_redirect_act(userId)
  return pb.encode_sint32(1, userId)
end

function M.encode_chu_pai_broadcast(userId, tile)
  return pb.encode_sint32(1, userId) .. pb.encode_sint32(2, tile)
end

function M.decode_chu_pai_cmd(body)
  local f = pb.decode(body)
  return { t = pb.get_sint32(f, 1, 0) }
end

function M.pack(code, body)
  return pb.pack_frame(code, body or "")
end

function M.unpack(data)
  return pb.unpack_frame(data)
end

function M.encode_mahjong_liang_feng(lf)
  lf = lf or {}
  return table.concat({
    pb.encode_sint32(1, lf.kind or 0),
    pb.encode_sint32(2, lf.numOfDongFeng or 0),
    pb.encode_sint32(3, lf.numOfNanFeng or 0),
    pb.encode_sint32(4, lf.numOfXiFeng or 0),
    pb.encode_sint32(5, lf.numOfBeiFeng or 0),
    pb.encode_sint32(6, lf.numOfHongZhong or 0),
    pb.encode_sint32(7, lf.numOfFaCai or 0),
    pb.encode_sint32(8, lf.numOfBaiBan or 0),
  })
end

function M.decode_liang_feng_cmd(body)
  local f = pb.decode(body or "")
  return {
    t0 = pb.get_sint32(f, 1, 0),
    t1 = pb.get_sint32(f, 2, 0),
    t2 = pb.get_sint32(f, 3, 0),
  }
end

function M.encode_liang_feng_result(lf)
  return pb.encode_message(1, M.encode_mahjong_liang_feng(lf))
end

function M.encode_liang_feng_broadcast(userId, lf)
  return pb.encode_sint32(1, userId) .. pb.encode_message(2, M.encode_mahjong_liang_feng(lf))
end

function M.encode_round_settlement(items)
  local parts = {}
  for _, it in ipairs(items or {}) do
    local b = {
      pb.encode_sint32(1, it.userId),
      pb.encode_sint32(2, it.currScore or 0),
      pb.encode_sint32(3, it.totalScore or 0),
      pb.encode_sint32(4, it.seatIndex or 0),
      pb.encode_sint32(5, it.piaoX or 0),
      pb.encode_bool(6, it.roomOwnerFlag),
      pb.encode_bool(7, it.zhuangJiaFlag),
      pb.encode_bool(8, it.hu),
      pb.encode_bool(9, it.dianPao),
      pb.encode_bool(10, it.ziMo),
    }
    for _, hv in ipairs(it.huPattern or {}) do
      b[#b + 1] = pb.encode_message(11, pb.encode_sint32(1, hv.key) .. pb.encode_sint32(2, hv.val))
    end
    for _, gv in ipairs(it.gangPattern or {}) do
      b[#b + 1] = pb.encode_message(12, pb.encode_sint32(1, gv.key) .. pb.encode_sint32(2, gv.val))
    end
    for _, t in ipairs(it.mahjongInHand or {}) do
      b[#b + 1] = pb.encode_sint32(13, t)
    end
    if it.mahjongHuOrZiMo then
      b[#b + 1] = pb.encode_sint32(14, it.mahjongHuOrZiMo)
    end
    for _, cpg in ipairs(it.mahjongChiPengGang or {}) do
      b[#b + 1] = pb.encode_message(15, M.encode_chi_peng_gang(cpg))
    end
    if it.mahjongLiangFeng then
      b[#b + 1] = pb.encode_message(16, M.encode_mahjong_liang_feng(it.mahjongLiangFeng))
    end
    parts[#parts + 1] = pb.encode_message(1, table.concat(b))
  end
  return table.concat(parts)
end

function M.encode_room_settlement(items)
  local parts = {}
  for _, it in ipairs(items or {}) do
    parts[#parts + 1] = pb.encode_message(1, table.concat({
      pb.encode_sint32(1, it.userId),
      pb.encode_sint32(2, it.seatIndex or 0),
      pb.encode_bool(3, it.roomOwnerFlag),
      pb.encode_sint32(4, it.zuoZhuangTimez or 0),
      pb.encode_sint32(5, it.ziMoTimez or 0),
      pb.encode_sint32(6, it.dianPaoTimez or 0),
      pb.encode_sint32(7, it.huPaiTimez or 0),
      pb.encode_sint32(8, it.totalScore or 0),
      pb.encode_bool(9, it.bigWinner),
    }))
  end
  return table.concat(parts)
end

function M.decode_create_club_cmd(body)
  local f = pb.decode(body or "")
  return { clubName = pb.get_string(f, 1, "") }
end

function M.encode_create_club_result(clubId, clubName)
  return pb.encode_sint32(1, clubId) .. pb.encode_string(2, clubName or "")
end

function M.decode_join_club_cmd(body)
  local f = pb.decode(body or "")
  return { clubId = pb.get_sint32(f, 1, 0) }
end

function M.encode_join_club_result(clubId, ok)
  return pb.encode_sint32(1, clubId) .. pb.encode_bool(2, ok and true or false)
end

function M.encode_get_joined_club_list_result(list)
  local parts = {}
  for _, c in ipairs(list or {}) do
    parts[#parts + 1] = pb.encode_message(1, pb.encode_sint32(1, c.clubId) .. pb.encode_string(2, c.clubName or ""))
  end
  return table.concat(parts)
end

function M.encode_get_club_detailz_result(c)
  return table.concat({
    pb.encode_sint32(1, c.clubId),
    pb.encode_string(2, c.clubName or ""),
    pb.encode_sint32(3, c.ownerId or 0),
    pb.encode_sint32(4, c.roomCard or 0),
  })
end

function M.decode_get_table_list_cmd(body)
  local f = pb.decode(body or "")
  return { clubId = pb.get_sint32(f, 1, 0), pageIndex = pb.get_sint32(f, 2, 0) }
end

function M.encode_get_table_list_result(r)
  local parts = {
    pb.encode_sint32(1, r.clubId),
    pb.encode_sint32(2, r.pageIndex or 0),
    pb.encode_sint32(3, r.maxNumOfTablez or 10),
  }
  for _, t in ipairs(r.table or {}) do
    local tb = {
      pb.encode_sint32(1, t.seqNum or 0),
      pb.encode_sint32(2, t.roomId or 0),
      pb.encode_sint32(3, t.gameType0 or 1),
      pb.encode_sint32(4, t.gameType1 or 1001),
      pb.encode_sint32(6, t.maxRound or 8),
      pb.encode_sint32(7, t.currRound or 0),
      pb.encode_sint32(8, t.maxPlayer or 4),
    }
    for _, p in ipairs(t.player or {}) do
      tb[#tb + 1] = pb.encode_message(9, table.concat({
        pb.encode_sint32(1, p.userId),
        pb.encode_sint32(2, p.atSeatIndex or 0),
        pb.encode_string(3, p.userName or ""),
        pb.encode_string(4, p.headImg or ""),
        pb.encode_sint32(5, p.sex or 1),
      }))
    end
    parts[#parts + 1] = pb.encode_message(4, table.concat(tb))
  end
  return table.concat(parts)
end

function M.decode_get_record_list_cmd(body)
  local f = pb.decode(body or "")
  return {
    userId = pb.get_sint32(f, 1, 0),
    clubId = pb.get_sint32(f, 2, 0),
    gameType0 = pb.get_sint32(f, 3, 1),
    gameType1 = pb.get_sint32(f, 4, 1001),
    pageIndex = pb.get_sint32(f, 5, 0),
    pageSize = pb.get_sint32(f, 6, 10),
  }
end

function M.encode_get_record_list_result(r)
  local parts = {
    pb.encode_sint32(1, r.userId or 0),
    pb.encode_sint32(2, r.clubId or 0),
    pb.encode_sint32(3, r.gameType0 or 1),
    pb.encode_sint32(4, r.gameType1 or 1001),
    pb.encode_sint32(5, r.pageIndex or 0),
    pb.encode_sint32(6, r.totalCount or 0),
  }
  for _, rec in ipairs(r.recordz or {}) do
    local rb = {
      pb.encode_sint32(1, rec.gameType1 or 1001),
      pb.encode_sint32(2, rec.roomId or 0),
      pb.encode_string(3, rec.roomUUId or ""),
      pb.encode_sint32(4, rec.costRoomCard or 0),
      pb.encode_sint32(5, rec.actualRoundCount or 0),
      pb.encode_int64(6, rec.createTime or 0),
      pb.encode_int64(7, rec.overTime or 0),
    }
    for _, p in ipairs(rec.player or {}) do
      rb[#rb + 1] = pb.encode_message(8, table.concat({
        pb.encode_sint32(1, p.userId),
        pb.encode_string(2, p.userName or ""),
        pb.encode_string(3, p.headImg or ""),
        pb.encode_sint32(4, p.sex or 1),
        pb.encode_sint32(5, p.currScore or 0),
        pb.encode_sint32(6, p.totalScore or 0),
        pb.encode_sint32(7, p.seatIndex or 0),
        pb.encode_bool(8, p.zhuangFlag),
        pb.encode_bool(9, p.ziMo),
        pb.encode_bool(10, p.hu),
        pb.encode_bool(11, p.dianPao),
      }))
    end
    parts[#parts + 1] = pb.encode_message(7, table.concat(rb))
  end
  return table.concat(parts)
end

function M.encode_get_record_detailz_result(r)
  local parts = {
    pb.encode_sint32(1, r.gameType0 or 1),
    pb.encode_sint32(2, r.gameType1 or 1001),
    pb.encode_sint32(3, r.roomId or 0),
    pb.encode_string(4, r.roomUUId or ""),
    pb.encode_sint32(5, r.costRoomCard or 0),
    pb.encode_sint32(6, r.actualRoundCount or 0),
    pb.encode_int64(7, r.createTime or 0),
  }
  for _, round in ipairs(r.roundz or r.round or {}) do
    local rb = {
      pb.encode_sint32(1, round.roundIndex or 0),
      pb.encode_int64(2, round.createTime or 0),
      pb.encode_string(4, round.playbackStub or ""),
    }
    for _, p in ipairs(round.player or {}) do
      rb[#rb + 1] = pb.encode_message(3, table.concat({
        pb.encode_sint32(1, p.userId),
        pb.encode_string(2, p.userName or ""),
        pb.encode_string(3, p.headImg or ""),
        pb.encode_sint32(4, p.sex or 1),
        pb.encode_sint32(5, p.currScore or 0),
        pb.encode_sint32(6, p.totalScore or 0),
        pb.encode_sint32(7, p.seatIndex or 0),
        pb.encode_bool(8, p.zhuangFlag),
        pb.encode_bool(9, p.ziMo),
        pb.encode_bool(10, p.hu),
        pb.encode_bool(11, p.dianPao),
      }))
    end
    parts[#parts + 1] = pb.encode_message(8, table.concat(rb))
  end
  return table.concat(parts)
end

function M.decode_get_record_detailz_cmd(body)
  local f = pb.decode(body or "")
  return { roomUUId = pb.get_string(f, 1, "") }
end

function M.encode_chi_peng_gang(cpg)
  cpg = cpg or {}
  local parts = {
    pb.encode_sint32(1, cpg.kind or 0),
    pb.encode_sint32(2, cpg.t0 or cpg.tile or 0),
  }
  if cpg.t1 then parts[#parts + 1] = pb.encode_sint32(3, cpg.t1) end
  if cpg.t2 then parts[#parts + 1] = pb.encode_sint32(4, cpg.t2) end
  return table.concat(parts)
end

M.Code = Code
return M
