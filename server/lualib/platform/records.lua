-- 战绩读写：MySQL + 内存降级
local skynet = require "skynet"
local json = require "json"
local DB = require "platform.db"

local M = {
  _mem = {}, -- newest first: { id, roomId, gameId, roundNo, ... players[] }
  _next_id = 1,
}

local function encode_json(val)
  if val == nil then return "NULL" end
  local ok, s = pcall(json.encode, val)
  if not ok or not s then return "NULL" end
  return "'" .. DB.escape(s) .. "'"
end

function M.save_settle(room, settle, players, roundNo)
  if not settle then return nil end
  roundNo = roundNo or 1
  local rec_players = {}
  for i, pl in ipairs(players or {}) do
    local seat = i - 1
    local delta = 0
    if settle.scores then
      delta = tonumber(settle.scores[i]) or 0
      if room.prevScores then
        delta = delta - (tonumber(room.prevScores[i]) or 0)
      end
    end
    if not pl.isBot and pl.userId and pl.userId > 0 then
      rec_players[#rec_players + 1] = {
        userId = pl.userId,
        seat = seat,
        scoreDelta = delta,
        userName = pl.userName,
      }
    end
  end
  if room.prevScores and settle.scores then
    room.prevScores = { settle.scores[1], settle.scores[2], settle.scores[3], settle.scores[4] }
  elseif settle.scores then
    room.prevScores = { settle.scores[1], settle.scores[2], settle.scores[3], settle.scores[4] }
  end

  local payload = {
    roomId = room.roomId,
    gameId = room.gameId,
    roundNo = roundNo,
    winnerSeat = settle.winnerSeat,
    reason = settle.reason,
    detail = settle.detail,
    scores = settle.scores,
    birds = settle.birds,
    players = rec_players,
    createdAt = os.time(),
  }

  if DB.available() then
    skynet.fork(function()
      local scores_json = encode_json(settle.scores)
      local birds_json = encode_json(settle.birds)
      local detail_esc = DB.escape(settle.detail or "")
      local reason_esc = DB.escape(settle.reason or "")
      local ok = DB.execute(
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

function M.list_for_user(userId, page, pageSize)
  userId = tonumber(userId)
  page = math.max(1, tonumber(page) or 1)
  pageSize = math.min(50, math.max(1, tonumber(pageSize) or 20))
  local offset = (page - 1) * pageSize

  if DB.available() then
    local count_rows = DB.query(
      "SELECT COUNT(DISTINCT gr.id) AS cnt FROM game_records gr "
        .. "JOIN game_record_players grp ON grp.record_id=gr.id WHERE grp.user_id=%d",
      userId
    )
    local total = count_rows and count_rows[1] and tonumber(count_rows[1].cnt) or 0
    local rows = DB.query(
      "SELECT gr.id,gr.room_id,gr.game_id,gr.round_no,gr.winner_seat,gr.reason,gr.detail,"
        .. "gr.scores_json,gr.birds_json,UNIX_TIMESTAMP(gr.created_at) AS created_at,"
        .. "grp.seat,grp.score_delta "
        .. "FROM game_records gr JOIN game_record_players grp ON grp.record_id=gr.id "
        .. "WHERE grp.user_id=%d ORDER BY gr.created_at DESC LIMIT %d OFFSET %d",
      userId, pageSize, offset
    )
    local list = {}
    if rows then
      for _, r in ipairs(rows) do
        list[#list + 1] = {
          id = tonumber(r.id),
          roomId = tonumber(r.room_id),
          gameId = r.game_id,
          roundNo = tonumber(r.round_no),
          winnerSeat = r.winner_seat ~= nil and tonumber(r.winner_seat) or nil,
          reason = r.reason,
          detail = r.detail,
          seat = tonumber(r.seat),
          scoreDelta = tonumber(r.score_delta) or 0,
          createdAt = tonumber(r.created_at),
        }
      end
    end
    return { list = list, page = page, pageSize = pageSize, total = total }
  end

  local matched = {}
  for _, rec in ipairs(M._mem) do
    for _, rp in ipairs(rec.players or {}) do
      if rp.userId == userId then
        matched[#matched + 1] = {
          id = rec.id,
          roomId = rec.roomId,
          gameId = rec.gameId,
          roundNo = rec.roundNo,
          winnerSeat = rec.winnerSeat,
          reason = rec.reason,
          detail = rec.detail,
          seat = rp.seat,
          scoreDelta = rp.scoreDelta,
          createdAt = rec.createdAt,
        }
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

return M
