local skynet = require "skynet"

skynet.start(function()
  skynet.error("湘桌棋牌服务启动中…")
  skynet.uniqueservice("room_mgr")
  skynet.newservice("ws_gate")
  skynet.error("湘桌棋牌服务就绪 (ChangshaMJ / ShaoyangPHZ)")
end)
