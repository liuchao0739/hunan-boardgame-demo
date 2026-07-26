-- 结构化日志（T077）：roomId / userId 等字段
local skynet = require "skynet"
local Features = require "platform.features"

local M = {}

local function kv(fields)
  local parts = {}
  for k, v in pairs(fields or {}) do
    if v ~= nil then
      parts[#parts + 1] = tostring(k) .. "=" .. tostring(v)
    end
  end
  table.sort(parts)
  return table.concat(parts, " ")
end

function M.info(event, fields)
  if not Features.enabled("structured_log") then
    skynet.error("[xiangzhuo]", event)
    return
  end
  skynet.error(string.format("[xiangzhuo] event=%s %s", tostring(event), kv(fields)))
end

function M.warn(event, fields)
  M.info("warn:" .. tostring(event), fields)
end

function M.error(event, fields)
  M.info("error:" .. tostring(event), fields)
end

return M
