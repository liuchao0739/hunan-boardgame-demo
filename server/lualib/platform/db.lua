-- MySQL 封装：不可用时降级为内存（开发机无 Docker 也能跑）
local skynet = require "skynet"
local Config = require "platform.config"

local M = {
  _ok = false,
  _db = nil,
}

local function try_connect()
  if not Config.feature.use_mysql then
    return false, "mysql disabled"
  end
  local ok, mysql = pcall(require, "skynet.db.mysql")
  if not ok or not mysql then
    return false, "skynet.db.mysql missing"
  end
  local conf = Config.mysql
  -- skynet mysql.connect 失败会抛错，必须 pcall，否则拖垮 passport 启动
  local ok, db = pcall(mysql.connect, {
    host = conf.host,
    port = conf.port,
    database = conf.database,
    user = conf.user,
    password = conf.password,
    max_packet_size = conf.max_packet_size,
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
    skynet.error("[db] mysql connected", Config.mysql.host, Config.mysql.database)
  else
    skynet.error("[db] mysql unavailable, memory fallback:", err)
  end
  return M._ok
end

function M.available()
  return M._ok and M._db ~= nil
end

function M.query(sql, ...)
  if not M.available() then return nil, "db unavailable" end
  local ok, res = pcall(M._db.query, M._db, string.format(sql, ...))
  if not ok then return nil, tostring(res) end
  if type(res) == "table" and res.badresult then
    return nil, res.err or "query badresult"
  end
  return res
end

function M.execute(sql, ...)
  return M.query(sql, ...)
end

--- 防 SQL 注入的简易转义
function M.escape(s)
  if s == nil then return "" end
  s = tostring(s)
  s = s:gsub("\\", "\\\\"):gsub("'", "\\'"):gsub("%z", "")
  return s
end

return M
