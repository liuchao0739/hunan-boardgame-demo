-- JSON 信封编解码（平台协议）
local json = require "json"

local M = {}

function M.encode(ns, cmd, body, reqId)
  local msg = {
    v = 1,
    ns = ns or "platform",
    cmd = cmd,
    body = body or {},
  }
  if reqId ~= nil then msg.reqId = reqId end
  return json.encode(msg)
end

function M.decode(text)
  if type(text) ~= "string" or text == "" then return nil, "empty" end
  local ok, msg = pcall(json.decode, text)
  if not ok or type(msg) ~= "table" then return nil, "bad json" end
  if not msg.ns or not msg.cmd then return nil, "missing ns/cmd" end
  return msg
end

function M.reply(req, cmd, body)
  return M.encode(req.ns or "platform", cmd, body, req.reqId)
end

function M.push(ns, cmd, body)
  return M.encode(ns, cmd, body)
end

return M
