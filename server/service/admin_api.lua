-- T090 管理员只读 HTTP stub：listOnline
local skynet = require "skynet"
local socket = require "skynet.socket"
local httpd = require "http.httpd"
local sockethelper = require "http.sockethelper"
local Config = require "platform.config"
local json = require "json"

local ws_gate

local function write_response(fd, code, body, header)
  header = header or {}
  header["Content-Type"] = "application/json; charset=utf-8"
  local ok, err = httpd.write_response(sockethelper.writefunc(fd), code, body, header)
  if not ok then
    skynet.error("[admin_api] write_response", err)
  end
end

local function handle_request(url, method, header)
  if method ~= "GET" then
    return 405, json.encode({ ok = false, message = "method not allowed" })
  end
  local path = url:match("^[^?]*") or url
  local q = url:match("%?(.*)$") or ""
  local params = {}
  for k, v in q:gmatch("([^&=]+)=([^&=]*)") do
    params[k] = v
  end
  local key = params.key or header["x-admin-key"] or header["X-Admin-Key"]
  if key ~= Config.admin_key then
    return 401, json.encode({ ok = false, message = "unauthorized" })
  end

  if path == "/admin/listOnline" or path == "/listOnline" then
    local list = skynet.call(ws_gate, "lua", "list_online")
    return 200, json.encode({ ok = true, count = #list, online = list })
  end

  return 404, json.encode({ ok = false, message = "not found" })
end

skynet.start(function()
  ws_gate = skynet.uniqueservice("ws_gate")
  local port = Config.admin_port
  local listen_id = socket.listen("0.0.0.0", port)
  skynet.error(string.format("========== 湘桌 Admin HTTP :%d ==========", port))
  socket.start(listen_id, function(fd, addr)
    skynet.fork(function()
      socket.start(fd)
      local code, url, method, header, body = httpd.read_request(sockethelper.readfunc(fd), 8192)
      if not code then
        socket.close(fd)
        return
      end
      if code ~= 200 then
        write_response(fd, code, body or "")
        socket.close(fd)
        return
      end
      local ok, resp_code, resp_body = pcall(handle_request, url, method, header)
      if not ok then
        write_response(fd, 500, json.encode({ ok = false, message = tostring(resp_code) }))
      else
        write_response(fd, resp_code, resp_body)
      end
      socket.close(fd)
    end)
  end)
end)
