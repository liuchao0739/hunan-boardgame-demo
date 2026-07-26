-- 战绩读写：MySQL + 内存降级（含完整结算快照，供详情回放）
local skynet = require "skynet"
local json = require "json"
local DB = require "platform.db"

local M = {
  _mem = {}, -- newest first
  _next_id = 1,
  _settle_col_ready = false,
}

local function encode_json(val)
  if val == nil then return "NULL" end
  local ok, s = pcall(json.encode, val)
  if not ok or not s then return "NULL" end
  return "'" .. DB.escape(s) .. "'"
end

local function decode_json(s)
  if not s or s == "" or s == "null" then return nil end
  if type(s) == "table" then return s end
  local ok, t = pcall(json.decode, s)
  if ok then return t end
  return nil
end

local function ensure_settle_column()
  if M._settle_col_ready or not DB.available() then return end
  M._settle_col_ready = true
  pcall(function()
    DB.execute("ALTER TABLE game_records ADD COLUMN settle_json JSON NULL")
  end)
end

local function build_seat_rows(room, settle, players)
  local rows = {}
  for i, pl in ipairs(players or {}) do
    local seat = i - 1
    local delta = 0
    if settle.scores then
      delta = tonumber(settle.scores[i]) or 0
      if room.prevScores then
        delta = delta - (tonumber(room.prevScores[i]) or 0)
      end
    end
    rows[#rows + 1] = {
      seat = seat,
      userId = pl.userId,
      userName = pl.userName or ("座位" .. seat),
      isBot = pl.isBot and true or false,
      scoreDelta = delta,
    }
  end
  return rows
end

local function build_settle_snap(room, settle, seat_rows)
  local fan_items = settle.fanItems
  if type(fan_items) == "table" and fan_items[1] and fan_items[1].fanItems then
    local flat = {}
    for _, block in ipairs(fan_items) do
      for _, it in ipairs(block.fanItems or {}) do
        flat[#flat + 1] = it
      end
    end
    fan_items = flat
  end
  return {
    reason = settle.reason,
    detail = settle.detail,
    fan = settle.fan,
    fanItems = fan_items,
    birds = settle.birds,
    scores = settle.scores,
    winnerSeat = settle.winnerSeat,
    winnerName = settle.winnerName,
    paoSeat = settle.paoSeat,
    paoName = settle.paoName,
    winHand = settle.winHand,
    winMelds = settle.winMelds,
    huTile = settle.huTile,
    jiangJiangHu = settle.jiangJiangHu,
    seats = seat_rows,
    roomId = room.roomId,
    gameId = room.gameId,
  }
end

function M.save_settle(room, settle, players, roundNo)
  if not settle then return nil end
  roundNo = roundNo or 1
  ensure_settle_column()

  local seat_rows = build_seat_rows(room, settle, players)
  local rec_players = {}
  for _, row in ipairs(seat_rows) do
    if not row.isBot and row.userId and row.userId > 0 then
      rec_players[#rec_players + 1] = {
        userId = row.userId,
        seat = row.seat,
        scoreDelta = row.scoreDelta,
        userName = row.userName,
      }
    end
  end

  if room.prevScores and settle.scores then
    room.prevScores = { settle.scores[1], settle.scores[2], settle.scores[3], settle.scores[4] }
  elseif settle.scores then
    room.prevScores = { settle.scores[1], settle.scores[2], settle.scores[3], settle.scores[4] }
  end

  local snap = build_settle_snap(room, settle, seat_rows)
  local payload = {
    roomId = room.roomId,
    gameId = room.gameId,
    roundNo = roundNo,
    winnerSeat = settle.winnerSeat,
    reason = settle.reason,
    detail = settle.detail,
    scores = settle.scores,
    birds = settle.birds,
    settle = snap,
    players = rec_players,
    createdAt = os.time(),
  }

  if DB.available() then
    skynet.fork(function()
      ensure_settle_column()
      local scores_json = encode_json(settle.scores)
      local birds_json = encode_json(settle.birds)
      local settle_json = encode_json(snap)
      local detail_esc = DB.escape(settle.detail or "")
      local reason_esc = DB.escape(settle.reason or "")
      local ok = DB.execute(
        "INSERT INTO game_records(room_id,game_id,round_no,winner_seat,reason,detail,scores_json,birds_json,settle_json) "
          .. "VALUES(%d,'%s',%d,%s,'%s','%s',%s,%s,%s)",
        room.roomId,
        DB.escape(room.gameId),
        roundNo,
        settle.winnerSeat ~= nil and tostring(settle.winnerSeat) or "NULL",
        reason_esc,
        detail_esc,
        scores_json,
        birds_json,
        settle_json
      )
      if not ok then
        -- 兼容尚未加列的库
        ok = DB.execute(
          "INSERT INTO game_records(room_id,game_id,round_no,winner_seat,reason,detail,scores_json,birds_json) "
            .. "VALUES(%d,'%s',%d,%s,'%s','%s',%s,%s)",
          room.roomId,
          DB.escape(room.gameId),
          roundNo,
          settle.winnerSeat ~= nil and tostring(settle.winnerSeat) or "NULL",
          reason_esc,
          detail_esc,
          scores_json,
          birds_json
        )
      end
      if not ok then
        skynet.error("[records] insert game_records failed")
        M._push_mem(payload)
        return
      end
      local rows = DB.query("SELECT LAST_INSERT_ID() AS id")
      local rid = rows and rows[1] and tonumber(rows[1].id)
      if not rid then
        M._push_mem(payload)
        return
      end
      payload.id = rid
      for _, rp in ipairs(rec_players) do
        DB.execute(
          "INSERT INTO game_record_players(record_id,user_id,seat,score_delta) VALUES(%d,%d,%d,%d)",
          rid, rp.userId, rp.seat, rp.scoreDelta
        )
      end
    end)
    return payload
  end

  M._push_mem(payload)
  return payload
end

function M._push_mem(payload)
  payload.id = M._next_id
  M._next_id = M._next_id + 1
  table.insert(M._mem, 1, payload)
  if #M._mem > 500 then
    M._mem[#M._mem] = nil
  end
end

local function summarize(rec, mySeat, myDelta)
  local snap = rec.settle or {}
  return {
    id = rec.id,
    roomId = rec.roomId,
    gameId = rec.gameId,
    roundNo = rec.roundNo,
    winnerSeat = rec.winnerSeat,
    winnerName = snap.winnerName,
    reason = rec.reason,
    detail = rec.detail,
    seat = mySeat,
    scoreDelta = myDelta or 0,
    fan = snap.fan,
    birds = snap.birds or rec.birds,
    createdAt = rec.createdAt,
    hasDetail = snap.winHand ~= nil or snap.seats ~= nil,
  }
end

function M.list_for_user(userId, page, pageSize)
  userId = tonumber(userId)
  page = math.max(1, tonumber(page) or 1)
  pageSize = math.min(50, math.max(1, tonumber(pageSize) or 20))
  local offset = (page - 1) * pageSize
  ensure_settle_column()

  if DB.available() then
    local count_rows = DB.query(
      "SELECT COUNT(DISTINCT gr.id) AS cnt FROM game_records gr "
        .. "JOIN game_record_players grp ON grp.record_id=gr.id WHERE grp.user_id=%d",
      userId
    )
    local total = count_rows and count_rows[1] and tonumber(count_rows[1].cnt) or 0
    local rows = DB.query(
      "SELECT gr.id,gr.room_id,gr.game_id,gr.round_no,gr.winner_seat,gr.reason,gr.detail,"
        .. "gr.scores_json,gr.birds_json,gr.settle_json,UNIX_TIMESTAMP(gr.created_at) AS created_at,"
        .. "grp.seat,grp.score_delta "
        .. "FROM game_records gr JOIN game_record_players grp ON grp.record_id=gr.id "
        .. "WHERE grp.user_id=%d ORDER BY gr.created_at DESC LIMIT %d OFFSET %d",
      userId, pageSize, offset
    )
    local list = {}
    if rows then
      for _, r in ipairs(rows) do
        local snap = decode_json(r.settle_json) or {}
        if not snap.birds then snap.birds = decode_json(r.birds_json) end
        list[#list + 1] = summarize({
          id = tonumber(r.id),
          roomId = tonumber(r.room_id),
          gameId = r.game_id,
          roundNo = tonumber(r.round_no),
          winnerSeat = r.winner_seat ~= nil and tonumber(r.winner_seat) or nil,
          reason = r.reason,
          detail = r.detail,
          birds = decode_json(r.birds_json),
          settle = snap,
          createdAt = tonumber(r.created_at),
        }, tonumber(r.seat), tonumber(r.score_delta) or 0)
      end
    end
    return { list = list, page = page, pageSize = pageSize, total = total }
  end

  local matched = {}
  for _, rec in ipairs(M._mem) do
    for _, rp in ipairs(rec.players or {}) do
      if rp.userId == userId then
        matched[#matched + 1] = summarize(rec, rp.seat, rp.scoreDelta)
        break
      end
    end
  end
  local total = #matched
  local list = {}
  local from = offset + 1
  local to = math.min(offset + pageSize, total)
  for i = from, to do
    list[#list + 1] = matched[i]
  end
  return { list = list, page = page, pageSize = pageSize, total = total }
end

--- 详情：校验归属后返回可喂给 SettleWnd 的完整快照
function M.get_for_user(userId, recordId)
  userId = tonumber(userId)
  recordId = tonumber(recordId)
  if not userId or not recordId then return nil, "参数错误" end
  ensure_settle_column()

  if DB.available() then
    local own = DB.query(
      "SELECT seat, score_delta FROM game_record_players WHERE record_id=%d AND user_id=%d LIMIT 1",
      recordId, userId
    )
    if not own or not own[1] then return nil, "无权查看" end
    local rows = DB.query(
      "SELECT id,room_id,game_id,round_no,winner_seat,reason,detail,scores_json,birds_json,settle_json,"
        .. "UNIX_TIMESTAMP(created_at) AS created_at FROM game_records WHERE id=%d LIMIT 1",
      recordId
    )
    if not rows or not rows[1] then return nil, "记录不存在" end
    local r = rows[1]
    local snap = decode_json(r.settle_json)
    local scores = decode_json(r.scores_json)
    local birds = decode_json(r.birds_json)
    if not snap then
      snap = {
        reason = r.reason,
        detail = r.detail,
        birds = birds,
        scores = scores,
        winnerSeat = r.winner_seat ~= nil and tonumber(r.winner_seat) or nil,
        roomId = tonumber(r.room_id),
        gameId = r.game_id,
        seats = {},
      }
      -- 退化：仅有分数时拼座位行
      if type(scores) == "table" then
        for i = 1, 4 do
          local v = scores[i] or scores[tostring(i - 1)] or scores[i - 1]
          snap.seats[#snap.seats + 1] = {
            seat = i - 1,
            userName = (tonumber(r.winner_seat) == (i - 1)) and "赢家" or ("座位" .. (i - 1)),
            scoreDelta = tonumber(v) or 0,
            isBot = true,
          }
        end
      end
    end
    snap.mySeat = tonumber(own[1].seat)
    snap.myScoreDelta = tonumber(own[1].score_delta) or 0
    snap.id = tonumber(r.id)
    snap.roomId = snap.roomId or tonumber(r.room_id)
    snap.createdAt = tonumber(r.created_at)
    snap.birds = snap.birds or birds
    snap.scores = snap.scores or scores
    return snap
  end

  for _, rec in ipairs(M._mem) do
    if rec.id == recordId then
      for _, rp in ipairs(rec.players or {}) do
        if rp.userId == userId then
          local snap = rec.settle or {}
          snap.mySeat = rp.seat
          snap.myScoreDelta = rp.scoreDelta
          snap.id = rec.id
          snap.roomId = rec.roomId
          snap.createdAt = rec.createdAt
          return snap
        end
      end
      return nil, "无权查看"
    end
  end
  return nil, "记录不存在"
end

return M
