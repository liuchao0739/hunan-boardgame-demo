-- 湘桌平台运行时配置（可被环境变量覆盖）
local M = {
  ws_port = tonumber(os.getenv("XIANGZHUO_WS_PORT") or "") or 20480,
  mysql = {
    host = os.getenv("XIANGZHUO_MYSQL_HOST") or "127.0.0.1",
    port = tonumber(os.getenv("XIANGZHUO_MYSQL_PORT") or "") or 3306,
    database = os.getenv("XIANGZHUO_MYSQL_DB") or "mj_game",
    user = os.getenv("XIANGZHUO_MYSQL_USER") or "root",
    password = os.getenv("XIANGZHUO_MYSQL_PASSWORD") or "weihai",
    max_packet_size = 1024 * 1024,
  },
  redis = {
    host = os.getenv("XIANGZHUO_REDIS_HOST") or "127.0.0.1",
    port = tonumber(os.getenv("XIANGZHUO_REDIS_PORT") or "") or 6379,
    db = 0,
  },
  ticket_ttl = tonumber(os.getenv("XIANGZHUO_TICKET_TTL") or "") or (86400 * 7),
  admin_port = tonumber(os.getenv("XIANGZHUO_ADMIN_PORT") or "") or 20481,
  admin_key = os.getenv("XIANGZHUO_ADMIN_KEY") or "xiangzhuo-admin",
  reconnect_grace_sec = 60,
  feature = {
    use_mysql = (os.getenv("XIANGZHUO_USE_MYSQL") or "1") ~= "0",
    use_redis = (os.getenv("XIANGZHUO_USE_REDIS") or "1") ~= "0",
    fill_bots = true,
  },
  economy = {
    create_room_cost = tonumber(os.getenv("XIANGZHUO_CREATE_ROOM_COST") or "") or 1,
    daily_login_gift = tonumber(os.getenv("XIANGZHUO_DAILY_GIFT") or "") or 2,
    diamond_to_room_card = tonumber(os.getenv("XIANGZHUO_DIA_RATE") or "") or 10,
    default_settle_cost = os.getenv("XIANGZHUO_SETTLE_COST") or "consume",
    shop_items = nil,
  },
}

return M
