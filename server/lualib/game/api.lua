--[[
游戏插件约定：
  factory(opts) -> engine
  engine.gameId
  engine:on_join(seat, player)   -- optional
  engine:on_start(seats)         -- seats: { {userId,userName,isBot}, ... } indexed 0..n-1 or 1..n
  engine:on_action(seat, cmd, body) -> ok, err
  engine:snapshot(for_seat) -> table  -- includes availableOps, phase, ...
  engine:bot_tick(seat) -> acted(bool)
  engine:needs_bot_tick() -> bool
]]
return {}
