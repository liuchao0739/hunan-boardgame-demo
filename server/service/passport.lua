local skynet = require "skynet"

local users = {}
local tickets = {}
local next_uid = 10001

local CMD = {}

function CMD.login(name)
  local id = next_uid
  next_uid = next_uid + 1
  local u = {
    userId = id,
    userName = name or ("玩家" .. id),
    headImg = "",
    sex = 1,
    roomCard = 9999,
    lastLoginIp = "127.0.0.1",
  }
  users[id] = u
  local ticket = string.format("tk-%d-%d", id, os.time())
  tickets[ticket] = id
  return {
    userId = u.userId,
    userName = u.userName,
    ticket = ticket,
    ukeyStr = string.format("ukey-%d", id),
    ukeyExpireAt = os.time() + 86400 * 30,
    roomCard = u.roomCard,
    headImg = u.headImg,
    sex = u.sex,
    lastLoginIp = u.lastLoginIp,
  }
end

function CMD.get(userId)
  return users[userId]
end

function CMD.by_ticket(ticket)
  local id = tickets[ticket]
  if not id then return nil end
  return users[id]
end

skynet.start(function()
  skynet.dispatch("lua", function(_, _, cmd, ...)
    local f = CMD[cmd]
    if f then
      skynet.ret(skynet.pack(f(...)))
    else
      skynet.ret(skynet.pack(nil, "unknown"))
    end
  end)
  skynet.error("passport service ready")
end)
