local skynet = require "skynet"

skynet.start(function()
  skynet.error("湖南棋牌平台 Skynet 启动中…")
  skynet.uniqueservice("passport")
  skynet.uniqueservice("room_mgr")
  skynet.newservice("ws_gate")
  skynet.error("湖南棋牌就绪 → ws://0.0.0.0:20480 (JSON platform)")
end)
