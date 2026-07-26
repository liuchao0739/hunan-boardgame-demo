-- 口令哈希（SHA1 hex，Skynet crypt 内置）
local crypt = require "skynet.crypt"

local M = {}

function M.hash_password(password)
  password = tostring(password or "")
  return crypt.hexencode(crypt.sha1(password))
end

function M.verify_password(password, stored)
  if not stored or stored == "" then return false end
  return M.hash_password(password) == stored
end

return M
