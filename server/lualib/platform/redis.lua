-- Redis 封装：不可用时内存 ticket 表
local skynet = require "skynet"
local Config = require "platform.config"

local M = {
  _ok = false,
  _db = nil,
  _mem = {}, -- ticket -> { userId, expireAt }
}

local function try_connect()
  if not Config.feature.use_redis then
    return false, "redis disabled"
  end
  local ok, redis = pcall(require, "skynet.db.redis")
  if not ok or not redis then
    return false, "skynet.db.redis missing"
  end
  local conf = Config.redis
  local ok, db = pcall(redis.connect, {
    host = conf.host,
    port = conf.port,
    db = conf.db,
  })
  if not ok or not db then
    return false, tostring(db)
  end
  M._db = db
  M._ok = true
  return true
end

function M.init()
  local ok, err = try_connect()
  if ok then
    skynet.error("[redis] connected", Config.redis.host)
  else
    skynet.error("[redis] unavailable, memory tickets:", err)
  end
  return M._ok
end

function M.available()
  return M._ok and M._db ~= nil
end

function M.set_ticket(ticket, userId, ttl)
  ttl = ttl or Config.ticket_ttl
  if M.available() then
    local key = "xz:ticket:" .. ticket
    M._db:setex(key, ttl, tostring(userId))
    return true
  end
  M._mem[ticket] = { userId = userId, expireAt = os.time() + ttl }
  return true
end

function M.get_ticket(ticket)
  if M.available() then
    local v = M._db:get("xz:ticket:" .. ticket)
    if not v then return nil end
    return tonumber(v)
  end
  local e = M._mem[ticket]
  if not e then return nil end
  if e.expireAt < os.time() then
    M._mem[ticket] = nil
    return nil
  end
  return e.userId
end

function M.del_ticket(ticket)
  if M.available() then
    M._db:del("xz:ticket:" .. ticket)
  end
  M._mem[ticket] = nil
end

return M
