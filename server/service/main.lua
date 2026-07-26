local skynet = require "skynet"

skynet.start(function()
  skynet.error("湘桌 Skynet 启动中…")
  skynet.uniqueservice("passport")
  skynet.uniqueservice("room_mgr")
  skynet.uniqueservice("matchmaking")
  skynet.uniqueservice("club_record")
  skynet.uniqueservice("ws_gate")
  skynet.uniqueservice("admin_api")
  skynet.error("湘桌就绪 → ws://0.0.0.0:20480 (JSON platform)")
end)
