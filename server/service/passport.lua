local skynet = require "skynet"
local Config = require "platform.config"
local DB = require "platform.db"
local Redis = require "platform.redis"

local users = {} -- memory fallback / cache
local next_uid = 10001

local CMD = {}

local function cache_user(u)
  users[u.userId] = u
  return u
end

local function load_or_create_mysql(name)
  name = name or ("玩家" .. os.time())
  local esc = DB.escape(name)
  local rows = DB.query("SELECT user_id,user_name,head_img,sex,room_card FROM users WHERE user_name='%s' LIMIT 1", esc)
  if rows and rows[1] then
    local r = rows[1]
    return cache_user({
      userId = tonumber(r.user_id),
      userName = r.user_name,
      headImg = r.head_img or "",
      sex = tonumber(r.sex) or 1,
      roomCard = tonumber(r.room_card) or 9999,
      lastLoginIp = "127.0.0.1",
    })
  end
  local ok = DB.execute(
    "INSERT INTO users(user_name,room_card) VALUES('%s',9999)",
    esc
  )
  if not ok then return nil, "insert user failed" end
  rows = DB.query("SELECT user_id,user_name,head_img,sex,room_card FROM users WHERE user_name='%s' LIMIT 1", esc)
  if not rows or not rows[1] then return nil, "load user failed" end
  local r = rows[1]
  return cache_user({
    userId = tonumber(r.user_id),
    userName = r.user_name,
    headImg = r.head_img or "",
    sex = tonumber(r.sex) or 1,
    roomCard = tonumber(r.room_card) or 9999,
    lastLoginIp = "127.0.0.1",
  })
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
    lastLoginIp = "127.0.0.1",
  })
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
  local ticket = string.format("tk-%d-%d-%d", u.userId, os.time(), math.random(1000, 9999))
  Redis.set_ticket(ticket, u.userId, Config.ticket_ttl)
  return {
    userId = u.userId,
    userName = u.userName,
    ticket = ticket,
    ukeyStr = string.format("ukey-%d", u.userId),
    ukeyExpireAt = os.time() + Config.ticket_ttl,
    roomCard = u.roomCard,
    headImg = u.headImg,
    sex = u.sex,
    lastLoginIp = u.lastLoginIp,
    ok = true,
  }
end

function CMD.get(userId)
  userId = tonumber(userId)
  if users[userId] then return users[userId] end
  if DB.available() then
    local rows = DB.query("SELECT user_id,user_name,head_img,sex,room_card FROM users WHERE user_id=%d LIMIT 1", userId)
    if rows and rows[1] then
      local r = rows[1]
      return cache_user({
        userId = tonumber(r.user_id),
        userName = r.user_name,
        headImg = r.head_img or "",
        sex = tonumber(r.sex) or 1,
        roomCard = tonumber(r.room_card) or 9999,
        lastLoginIp = "127.0.0.1",
      })
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
