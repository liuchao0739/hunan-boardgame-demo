-- Simple in-memory session store (Redis-compatible API later)

local M = {
  _users = {},
  _tickets = {},
  _next_uid = 10001,
}

function M.alloc_user(name)
  local id = M._next_uid
  M._next_uid = M._next_uid + 1
  local u = {
    userId = id,
    userName = name or ("玩家" .. id),
    headImg = "",
    sex = 1,
    roomCard = 9999,
    lastLoginIp = "127.0.0.1",
  }
  M._users[id] = u
  return u
end

function M.get_user(id)
  return M._users[id]
end

function M.issue_ticket(userId)
  local t = string.format("tk-%d-%d", userId, os.time())
  M._tickets[t] = userId
  return t
end

function M.user_by_ticket(ticket)
  local uid = M._tickets[ticket]
  if not uid then return nil end
  return M._users[uid]
end

return M
