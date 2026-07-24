-- In-memory club + record store (MySQL later)

local M = {
  _clubs = {},
  _next_club = 10001,
  _user_clubs = {}, -- userId -> {clubId,...}
  _records = {},   -- list of ARecord
  _details = {},   -- roomUUId -> rounds
}

function M.create_club(ownerId, clubName)
  local id = M._next_club
  M._next_club = M._next_club + 1
  local c = {
    clubId = id,
    clubName = clubName ~= "" and clubName or ("亲友圈" .. id),
    ownerId = ownerId,
    roomCard = 9999,
    members = { ownerId },
    tables = {},
  }
  M._clubs[id] = c
  M._user_clubs[ownerId] = M._user_clubs[ownerId] or {}
  table.insert(M._user_clubs[ownerId], id)
  return c
end

function M.join_club(userId, clubId)
  local c = M._clubs[clubId]
  if not c then return nil, false end
  for _, m in ipairs(c.members) do
    if m == userId then return c, true end
  end
  c.members[#c.members + 1] = userId
  M._user_clubs[userId] = M._user_clubs[userId] or {}
  table.insert(M._user_clubs[userId], clubId)
  return c, true
end

function M.joined_list(userId)
  local ids = M._user_clubs[userId] or {}
  local out = {}
  for _, id in ipairs(ids) do
    local c = M._clubs[id]
    if c then out[#out + 1] = { clubId = c.clubId, clubName = c.clubName } end
  end
  return out
end

function M.detail(clubId)
  return M._clubs[clubId]
end

function M.bind_table(clubId, roomPlain)
  local c = M._clubs[clubId]
  if not c then return end
  local players = {}
  for _, p in ipairs(roomPlain.players or {}) do
    players[#players + 1] = {
      userId = p.userId,
      atSeatIndex = p.seatIndex,
      userName = p.userName,
      headImg = "",
      sex = 1,
    }
  end
  c.tables[#c.tables + 1] = {
    seqNum = #c.tables + 1,
    roomId = roomPlain.roomId,
    gameType0 = 1,
    gameType1 = 1001,
    maxRound = 8,
    currRound = roomPlain.round or 0,
    maxPlayer = 4,
    player = players,
  }
end

function M.table_list(clubId, pageIndex)
  local c = M._clubs[clubId]
  if not c then
    return { clubId = clubId, pageIndex = pageIndex or 0, maxNumOfTablez = 10, table = {} }
  end
  return {
    clubId = clubId,
    pageIndex = pageIndex or 0,
    maxNumOfTablez = 10,
    table = c.tables,
  }
end

function M.add_record(rec)
  M._records[#M._records + 1] = rec
  local uuid = rec.roomUUId
  M._details[uuid] = M._details[uuid] or {
    roomId = rec.roomId,
    roomUUId = uuid,
    gameType0 = rec.gameType0 or 1,
    gameType1 = rec.gameType1 or 1001,
    costRoomCard = rec.costRoomCard or 0,
    createTime = rec.createTime or os.time() * 1000,
    roundz = {},
  }
end

function M.add_round_detail(roomUUId, round)
  local d = M._details[roomUUId]
  if not d then return end
  d.roundz[#d.roundz + 1] = round
end

function M.list_records(userId, clubId, pageIndex)
  local list = {}
  for _, r in ipairs(M._records) do
    local hit = false
    for _, p in ipairs(r.player or {}) do
      if p.userId == userId then hit = true break end
    end
    if hit then list[#list + 1] = r end
  end
  return {
    userId = userId,
    clubId = clubId or 0,
    gameType0 = 1,
    gameType1 = 1001,
    pageIndex = pageIndex or 0,
    totalCount = #list,
    recordz = list,
  }
end

function M.record_detail(roomUUId)
  local d = M._details[roomUUId]
  if not d then
    return {
      gameType0 = 1, gameType1 = 1001, roomId = 0, roomUUId = roomUUId or "",
      costRoomCard = 0, actualRoundCount = 0, createTime = 0, roundz = {},
    }
  end
  return {
    gameType0 = d.gameType0 or 1,
    gameType1 = d.gameType1 or 1001,
    roomId = d.roomId or 0,
    roomUUId = d.roomUUId or roomUUId,
    costRoomCard = d.costRoomCard or 0,
    actualRoundCount = #(d.roundz or {}),
    createTime = d.createTime or 0,
    roundz = d.roundz or {},
  }
end

--- Write playback JSON stub (local file under server/playback/)
function M.write_playback(roomId, roundIndex, payload)
  local dir = "playback"
  os.execute("mkdir -p " .. dir)
  local stub = string.format("%s/%d_%d.json", dir, roomId, roundIndex)
  local f = io.open(stub, "w")
  if f then
    f:write(payload or "{}")
    f:close()
  end
  return stub
end

return M
