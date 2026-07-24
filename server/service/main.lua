local skynet = require "skynet"

skynet.start(function()
  skynet.error("威海麻将 Skynet 服务启动中…")
  skynet.uniqueservice("passport")
  skynet.uniqueservice("room_mgr")
  skynet.uniqueservice("club_record")
  skynet.newservice("ws_gate")
  skynet.error("威海麻将就绪 → ws://0.0.0.0:20480 (MsgBus Protobuf)")
end)
