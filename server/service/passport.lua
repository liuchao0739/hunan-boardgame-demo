local skynet = require "skynet"
local Config = require "platform.config"
local DB = require "platform.db"
local Redis = require "platform.redis"
local Crypto = require "platform.crypto"
local Records = require "platform.records"
local Economy = require "platform.economy"

local users = {} -- memory fallback / cache: userId -> user
local device_users = {} -- deviceId -> userId (mem)
local next_uid = 10001

local CMD = {}

local function row_to_user(r)
  return {
    userId = tonumber(r.user_id),
    userName = r.user_name,
    headImg = r.head_img or "",
    sex = tonumber(r.sex) or 1,
    roomCard = tonumber(r.room_card) or 9999,
    diamond = tonumber(r.diamond) or 0,
    passwordHash = r.password_hash,
    deviceId = r.device_id,
    lastLoginIp = "127.0.0.1",
  }
end

local function cache_user(u)
  users[u.userId] = u
  if u.deviceId and u.deviceId ~= "" then
    device_users[u.deviceId] = u.userId
  end
  return u
end

local function issue_ticket(u, opts)
  opts = opts or {}
  local ticket = string.format("tk-%d-%d-%d", u.userId, os.time(), math.random(1000, 9999))
  Redis.set_ticket(ticket, u.userId, Config.ticket_ttl)
  local dailyGift = 0
  if opts.tryDailyGift ~= false then
    local granted, amount = Economy.try_daily_gift(u.userId)
    if granted then
      dailyGift = amount
      local bal = Economy.get_balance(u.userId, u)
      u.roomCard = bal.roomCard
      u.diamond = bal.diamond
    end
  end
  return {
    userId = u.userId,
    userName = u.userName,
    ticket = ticket,
    ukeyStr = string.format("ukey-%d", u.userId),
    ukeyExpireAt = os.time() + Config.ticket_ttl,
    roomCard = u.roomCard,
    diamond = u.diamond or 0,
    headImg = u.headImg,
    sex = u.sex,
    lastLoginIp = u.lastLoginIp,
    dailyGift = dailyGift,
    ok = true,
  }
end

local function load_or_create_mysql(name)
  name = name or ("玩家" .. os.time())
  local esc = DB.escape(name)
  local rows = DB.query(
    "SELECT user_id,user_name,head_img,sex,room_card,diamond,password_hash,device_id "
      .. "FROM users WHERE user_name='%s' LIMIT 1",
    esc
  )
  if rows and rows[1] then
    return cache_user(row_to_user(rows[1]))
  end
  local ok = DB.execute("INSERT INTO users(user_name,room_card) VALUES('%s',9999)", esc)
  if not ok then return nil, "insert user failed" end
  rows = DB.query(
    "SELECT user_id,user_name,head_img,sex,room_card,diamond,password_hash,device_id "
      .. "FROM users WHERE user_name='%s' LIMIT 1",
    esc
  )
  if not rows or not rows[1] then return nil, "load user failed" end
  return cache_user(row_to_user(rows[1]))
end

local function load_or_create_mem(name)
  for _, u in pairs(users) do
    if u.userName == name then return u end
  end
  local id = next_uid
  next_uid = next_uid + 1
  return cache_user({
    userId = id,
    userName = name or ("玩家" .. id),
    headImg = "",
    sex = 1,
    roomCard = 9999,
    diamond = 0,
    passwordHash = nil,
    deviceId = nil,
    lastLoginIp = "127.0.0.1",
  })
end

local function find_by_name_mysql(name)
  local esc = DB.escape(name)
  local rows = DB.query(
    "SELECT user_id,user_name,head_img,sex,room_card,diamond,password_hash,device_id "
      .. "FROM users WHERE user_name='%s' LIMIT 1",
    esc
  )
  if rows and rows[1] then return cache_user(row_to_user(rows[1])) end
  return nil
end

local function find_by_device_mysql(deviceId)
  local esc = DB.escape(deviceId)
  local rows = DB.query(
    "SELECT user_id,user_name,head_img,sex,room_card,diamond,password_hash,device_id "
      .. "FROM users WHERE device_id='%s' LIMIT 1",
    esc
  )
  if rows and rows[1] then return cache_user(row_to_user(rows[1])) end
  return nil
end

function CMD.register(name, password)
  name = (name or ""):gsub("^%s+", ""):gsub("%s+$", "")
  password = password or ""
  if name == "" then return nil, "用户名不能为空" end
  if #password < 4 then return nil, "密码至少 4 位" end
  local hash = Crypto.hash_password(password)

  if DB.available() then
    if find_by_name_mysql(name) then return nil, "用户名已存在" end
    local esc = DB.escape(name)
    local ok = DB.execute(
      "INSERT INTO users(user_name,password_hash,room_card) VALUES('%s','%s',9999)",
      esc, DB.escape(hash)
    )
    if not ok then return nil, "注册失败" end
    local u = find_by_name_mysql(name)
    if not u then return nil, "注册后加载失败" end
    return issue_ticket(u)
  end

  for _, u in pairs(users) do
    if u.userName == name then return nil, "用户名已存在" end
  end
  local id = next_uid
  next_uid = next_uid + 1
  local u = cache_user({
    userId = id,
    userName = name,
    headImg = "",
    sex = 1,
    roomCard = 9999,
    diamond = 0,
    passwordHash = hash,
    deviceId = nil,
    lastLoginIp = "127.0.0.1",
  })
  return issue_ticket(u)
end

function CMD.login_account(name, password)
  name = (name or ""):gsub("^%s+", ""):gsub("%s+$", "")
  password = password or ""
  if name == "" then return nil, "用户名不能为空" end

  local u
  if DB.available() then
    u = find_by_name_mysql(name)
    if not u then return nil, "用户不存在" end
  else
    for _, x in pairs(users) do
      if x.userName == name then u = x break end
    end
    if not u then return nil, "用户不存在" end
  end

  if u.passwordHash and u.passwordHash ~= "" then
    if not Crypto.verify_password(password, u.passwordHash) then
      return nil, "密码错误"
    end
  elseif password ~= "" then
    local hash = Crypto.hash_password(password)
    u.passwordHash = hash
    if DB.available() then
      DB.execute(
        "UPDATE users SET password_hash='%s' WHERE user_id=%d",
        DB.escape(hash), u.userId
      )
    end
  end
  return issue_ticket(u)
end

function CMD.guest_login(deviceId)
  deviceId = (deviceId or ""):gsub("^%s+", ""):gsub("%s+$", "")
  if deviceId == "" then return nil, "deviceId 不能为空" end

  local u
  if DB.available() then
    u = find_by_device_mysql(deviceId)
    if not u then
      local suffix = deviceId:sub(-6)
      local name = "游客" .. suffix
      local esc_dev = DB.escape(deviceId)
      local esc_name = DB.escape(name)
      local n = 0
      while find_by_name_mysql(name) do
        n = n + 1
        name = "游客" .. suffix .. n
        esc_name = DB.escape(name)
      end
      local ok = DB.execute(
        "INSERT INTO users(user_name,device_id,room_card) VALUES('%s','%s',9999)",
        esc_name, esc_dev
      )
      if not ok then return nil, "创建游客失败" end
      u = find_by_device_mysql(deviceId)
      if not u then return nil, "游客加载失败" end
    end
  else
    local uid = device_users[deviceId]
    if uid then u = users[uid] end
    if not u then
      local id = next_uid
      next_uid = next_uid + 1
      local suffix = deviceId:sub(-6)
      u = cache_user({
        userId = id,
        userName = "游客" .. suffix,
        headImg = "",
        sex = 1,
        roomCard = 9999,
        diamond = 0,
        passwordHash = nil,
        deviceId = deviceId,
        lastLoginIp = "127.0.0.1",
      })
    end
  end
  return issue_ticket(u)
end

function CMD.login(name)
  local u, err
  if DB.available() then
    u, err = load_or_create_mysql(name)
    if not u then
      skynet.error("[passport] mysql login fail", err, "fallback mem")
      u = load_or_create_mem(name)
    end
  else
    u = load_or_create_mem(name)
  end
  return issue_ticket(u)
end

function CMD.refresh_ticket(ticket)
  if not ticket or ticket == "" then return nil, "ticket 无效" end
  local userId = Redis.get_ticket(ticket)
  if not userId then return nil, "ticket 已过期，请重新登录" end
  local u = CMD.get(userId)
  if not u then return nil, "用户不存在" end
  Redis.del_ticket(ticket)
  return issue_ticket(u)
end

function CMD.update_profile(userId, fields)
  userId = tonumber(userId)
  fields = fields or {}
  local u = CMD.get(userId)
  if not u then return nil, "用户不存在" end

  local newName = fields.userName or fields.name
  local newHead = fields.headImg or fields.avatar
  if newName and newName ~= "" then
    newName = tostring(newName):gsub("^%s+", ""):gsub("%s+$", "")
    if newName == "" then return nil, "昵称无效" end
    if #newName > 32 then return nil, "昵称过长" end
    u.userName = newName
  end
  if newHead ~= nil then
    u.headImg = tostring(newHead):sub(1, 256)
  end

  if DB.available() then
    DB.execute(
      "UPDATE users SET user_name='%s', head_img='%s' WHERE user_id=%d",
      DB.escape(u.userName), DB.escape(u.headImg or ""), userId
    )
  end
  cache_user(u)
  return {
    ok = true,
    userId = u.userId,
    userName = u.userName,
    headImg = u.headImg,
    sex = u.sex,
    roomCard = u.roomCard,
    diamond = u.diamond or 0,
  }
end

function CMD.get_balance(userId)
  userId = tonumber(userId)
  local u = CMD.get(userId)
  return Economy.get_balance(userId, u)
end

function CMD.get_ledger(userId, page, pageSize)
  return Economy.get_ledger(userId, page, pageSize)
end

function CMD.exchange_diamond(userId, amount)
  return Economy.exchange_diamond(userId, amount)
end

function CMD.shop_list()
  return Economy.shop_list()
end

function CMD.claim_daily_gift(userId)
  userId = tonumber(userId)
  local granted, amount, bal = Economy.try_daily_gift(userId)
  if not granted then
    return { ok = false, message = "今日已领取", roomCard = Economy.get_balance(userId).roomCard }
  end
  return { ok = true, gift = amount, roomCard = bal }
end

function CMD.get_records(userId, page, pageSize)
  return Records.list_for_user(userId, page, pageSize)
end

function CMD.get(userId)
  userId = tonumber(userId)
  if users[userId] then return users[userId] end
  if DB.available() then
    local rows = DB.query(
      "SELECT user_id,user_name,head_img,sex,room_card,diamond,password_hash,device_id "
        .. "FROM users WHERE user_id=%d LIMIT 1",
      userId
    )
    if rows and rows[1] then
      return cache_user(row_to_user(rows[1]))
    end
  end
  return nil
end

function CMD.by_ticket(ticket)
  local id = Redis.get_ticket(ticket)
  if not id then return nil end
  return CMD.get(id)
end

skynet.start(function()
  DB.init()
  Redis.init()
  skynet.dispatch("lua", function(_, _, cmd, ...)
    local f = CMD[cmd]
    if f then
      skynet.ret(skynet.pack(f(...)))
    else
      skynet.ret(skynet.pack(nil, "unknown"))
    end
  end)
  skynet.error("passport service ready (mysql=", DB.available(), "redis=", Redis.available(), ")")
end)
