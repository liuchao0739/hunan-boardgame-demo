-- 房卡/钻石经济：账本、扣费、幂等、每日赠送
local skynet = require "skynet"
local DB = require "platform.db"
local Config = require "platform.config"

local M = {}

local mem_balance = {}   -- userId -> { roomCard, diamond }
local mem_ledger = {}    -- userId -> list
local mem_ref_done = {}  -- ref_id -> true (幂等，无 DB 时)
local mem_daily = {}     -- userId -> date string

local function economy_cfg()
  return Config.economy or {}
end

local function today_key()
  return os.date("%Y-%m-%d")
end

function M.ensure_user(userId, fallback)
  userId = tonumber(userId)
  fallback = fallback or {}
  if DB.available() then
    local rows = DB.query(
      "SELECT room_card, diamond FROM users WHERE user_id=%d LIMIT 1",
      userId
    )
    if rows and rows[1] then
      return {
        roomCard = tonumber(rows[1].room_card) or 0,
        diamond = tonumber(rows[1].diamond) or 0,
      }
    end
  end
  if not mem_balance[userId] then
    mem_balance[userId] = {
      roomCard = fallback.roomCard or 9999,
      diamond = fallback.diamond or 0,
    }
  end
  return mem_balance[userId]
end

function M.get_balance(userId, fallback)
  local b = M.ensure_user(userId, fallback)
  return { roomCard = b.roomCard, diamond = b.diamond }
end

local function ref_exists(ref_id)
  if not ref_id or ref_id == "" then return false end
  if mem_ref_done[ref_id] then return true end
  if DB.available() then
    local esc = DB.escape(ref_id)
    local rows = DB.query(
      "SELECT id FROM room_card_ledger WHERE ref_id='%s' LIMIT 1",
      esc
    )
    return rows and rows[1] ~= nil
  end
  return false
end

--- 变动房卡；ref_id 非空时幂等
function M.apply_room_card(userId, delta, reason, ref_id, fallback)
  userId = tonumber(userId)
  delta = tonumber(delta) or 0
  reason = reason or "adjust"
  if ref_id and ref_id ~= "" and ref_exists(ref_id) then
    local b = M.get_balance(userId, fallback)
    return true, b.roomCard, "already_applied"
  end

  if DB.available() then
    local rows = DB.query(
      "SELECT room_card, diamond FROM users WHERE user_id=%d LIMIT 1",
      userId
    )
    if not rows or not rows[1] then return false, nil, "用户不存在" end
    local bal = tonumber(rows[1].room_card) or 0
    local newBal = bal + delta
    if newBal < 0 then return false, bal, "房卡不足" end
    local ok = DB.execute(
      "UPDATE users SET room_card=%d WHERE user_id=%d AND room_card=%d",
      newBal, userId, bal
    )
    if not ok then return false, bal, "扣费失败" end
    local ref_sql = (ref_id and ref_id ~= "") and ("'" .. DB.escape(ref_id) .. "'") or "NULL"
    DB.execute(
      "INSERT INTO room_card_ledger(user_id,delta,balance,reason,ref_id) "
        .. "VALUES(%d,%d,%d,'%s',%s)",
      userId, delta, newBal, DB.escape(reason), ref_sql
    )
    mem_balance[userId] = { roomCard = newBal, diamond = tonumber(rows[1].diamond) or 0 }
    if ref_id and ref_id ~= "" then mem_ref_done[ref_id] = true end
    return true, newBal
  end

  local b = M.ensure_user(userId, fallback)
  local newBal = b.roomCard + delta
  if newBal < 0 then return false, b.roomCard, "房卡不足" end
  b.roomCard = newBal
  mem_ledger[userId] = mem_ledger[userId] or {}
  mem_ledger[userId][#mem_ledger[userId] + 1] = {
    delta = delta,
    balance = newBal,
    reason = reason,
    refId = ref_id,
    createdAt = os.time(),
  }
  if ref_id and ref_id ~= "" then mem_ref_done[ref_id] = true end
  return true, newBal
end

function M.deduct_create_room(userId, roomId, fallback)
  local cost = tonumber(economy_cfg().create_room_cost) or 1
  if cost <= 0 then
    local b = M.get_balance(userId, fallback)
    return true, b.roomCard, 0
  end
  local ref = string.format("create_room:%d", roomId)
  return M.apply_room_card(userId, -cost, "create_room", ref, fallback)
end

function M.on_round_settle(room, rules)
  rules = rules or room.rules or {}
  local cost = rules.cost or economy_cfg().settle_cost
  if cost == nil then cost = economy_cfg().default_settle_cost or "consume" end
  if cost == "none" or cost == false then return end

  local ownerId = room.ownerId
  if not ownerId or ownerId <= 0 then return end

  local createCost = tonumber(economy_cfg().create_room_cost) or 1
  if cost == "refund" then
    local ref = string.format("refund_room:%d:r%d", room.roomId, room.roundNo or 0)
    M.apply_room_card(ownerId, createCost, "round_refund", ref)
  elseif cost == "consume" then
    local ref = string.format("consume_room:%d:r%d", room.roomId, room.roundNo or 0)
    if not ref_exists(ref) then
      mem_ref_done[ref] = true
      if DB.available() then
        DB.execute(
          "INSERT INTO room_card_ledger(user_id,delta,balance,reason,ref_id) "
            .. "SELECT %d,0,room_card,'round_consume','%s' FROM users WHERE user_id=%d",
          ownerId, DB.escape(ref), ownerId
        )
      end
    end
  end
end

function M.get_ledger(userId, page, pageSize)
  userId = tonumber(userId)
  page = math.max(1, tonumber(page) or 1)
  pageSize = math.min(50, math.max(1, tonumber(pageSize) or 20))
  local offset = (page - 1) * pageSize

  if DB.available() then
    local totalRows = DB.query(
      "SELECT COUNT(*) AS c FROM room_card_ledger WHERE user_id=%d",
      userId
    )
    local total = totalRows and totalRows[1] and tonumber(totalRows[1].c) or 0
    local rows = DB.query(
      "SELECT id,delta,balance,reason,ref_id,UNIX_TIMESTAMP(created_at) AS created_at "
        .. "FROM room_card_ledger WHERE user_id=%d ORDER BY id DESC LIMIT %d OFFSET %d",
      userId, pageSize, offset
    )
    local list = {}
    if rows then
      for _, r in ipairs(rows) do
        list[#list + 1] = {
          id = tonumber(r.id),
          delta = tonumber(r.delta),
          balance = tonumber(r.balance),
          reason = r.reason,
          refId = r.ref_id,
          createdAt = tonumber(r.created_at),
        }
      end
    end
    return { list = list, page = page, pageSize = pageSize, total = total }
  end

  local all = mem_ledger[userId] or {}
  local total = #all
  local list = {}
  for i = total, math.max(1, total - offset - pageSize + 1), -1 do
    if #list >= pageSize then break end
    local idx = i - offset
    if idx >= 1 and idx <= total then
      local e = all[idx]
      list[#list + 1] = {
        id = idx,
        delta = e.delta,
        balance = e.balance,
        reason = e.reason,
        refId = e.refId,
        createdAt = e.createdAt,
      }
    end
  end
  return { list = list, page = page, pageSize = pageSize, total = total }
end

function M.exchange_diamond(userId, amount)
  userId = tonumber(userId)
  amount = tonumber(amount) or 0
  if amount <= 0 then return nil, "数量无效" end
  local rate = tonumber(economy_cfg().diamond_to_room_card) or 10
  local need = math.ceil(amount / rate)
  if need <= 0 then return nil, "兑换量过小" end

  if DB.available() then
    local rows = DB.query(
      "SELECT room_card, diamond FROM users WHERE user_id=%d LIMIT 1",
      userId
    )
    if not rows or not rows[1] then return nil, "用户不存在" end
    local dia = tonumber(rows[1].diamond) or 0
    if dia < need then return nil, "钻石不足" end
    local rc = tonumber(rows[1].room_card) or 0
    local newDia = dia - need
    local newRc = rc + amount
    DB.execute(
      "UPDATE users SET diamond=%d, room_card=%d WHERE user_id=%d",
      newDia, newRc, userId
    )
    DB.execute(
      "INSERT INTO room_card_ledger(user_id,delta,balance,reason,ref_id) VALUES(%d,%d,%d,'exchange','ex:%d:%d')",
      userId, amount, newRc, userId, os.time()
    )
    mem_balance[userId] = { roomCard = newRc, diamond = newDia }
    return { roomCard = newRc, diamond = newDia, gained = amount, spentDiamond = need }
  end

  local b = M.ensure_user(userId)
  if b.diamond < need then return nil, "钻石不足" end
  b.diamond = b.diamond - need
  b.roomCard = b.roomCard + amount
  return { roomCard = b.roomCard, diamond = b.diamond, gained = amount, spentDiamond = need }
end

function M.shop_list()
  local cfg = economy_cfg()
  return {
    items = cfg.shop_items or {
      { id = "rc_10", name = "10 房卡", price = 1, currency = "diamond", amount = 10 },
      { id = "rc_50", name = "50 房卡", price = 5, currency = "diamond", amount = 50 },
      { id = "dia_100", name = "100 钻石", price = 6, currency = "cny", amount = 100, stub = true },
    },
  }
end

function M.try_daily_gift(userId)
  userId = tonumber(userId)
  local cfg = economy_cfg()
  local gift = tonumber(cfg.daily_login_gift) or 2
  if gift <= 0 then return false, 0 end

  local day = today_key()
  local key = string.format("daily_gift:%d:%s", userId, day)
  if mem_daily[userId] == day then return false, 0 end

  if DB.available() then
    local esc = DB.escape(key)
    local rows = DB.query(
      "SELECT id FROM room_card_ledger WHERE ref_id='%s' LIMIT 1",
      esc
    )
    if rows and rows[1] then
      mem_daily[userId] = day
      return false, 0
    end
  end

  local ok, bal = M.apply_room_card(userId, gift, "daily_login", key)
  if ok then
    mem_daily[userId] = day
    return true, gift, bal
  end
  return false, 0
end

return M
