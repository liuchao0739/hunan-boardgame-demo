--[[ 房间逻辑：座位 / 机器人 / 广播快照 ]]
local Catalog = require "game_catalog"

local Room = {}
Room.__index = Room

local function rand_id()
  local chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  local t = {}
  for _ = 1, 6 do
    local j = math.random(#chars)
    t[#t + 1] = chars:sub(j, j)
  end
  return table.concat(t)
end

function Room.new(game_type, id)
  local self = setmetatable({}, Room)
  self.id = id or rand_id()
  local meta = Catalog.get(game_type)
  self.game_type = meta.id
  self.started = false
  self.game = meta.factory()
  self.n = meta.seats
  self.seats = {}
  for i = 0, self.n - 1 do self.seats[i] = nil end
  return self
end

function Room:add_player(nick, agent, is_bot)
  local seat
  for i = 0, self.n - 1 do
    if self.seats[i] == nil then seat = i; break end
  end
  if seat == nil then return nil, "房间已满" end
  self.seats[seat] = {
    seat = seat,
    nick = nick or (is_bot and ("机器人" .. seat) or ("玩家" .. seat)),
    ready = is_bot and true or false,
    is_bot = is_bot and true or false,
    agent = agent,
  }
  return seat
end

function Room:fill_bots()
  for i = 0, self.n - 1 do
    if self.seats[i] == nil then
      self:add_player(nil, nil, true)
    end
  end
end

function Room:set_ready(seat)
  if self.seats[seat] then self.seats[seat].ready = true end
end

function Room:all_ready()
  for i = 0, self.n - 1 do
    local s = self.seats[i]
    if not s or not s.ready then return false end
  end
  return true
end

function Room:build_public(viewer)
  local g = self.game
  local seats = {}
  for i = 0, self.n - 1 do
    local s = self.seats[i]
    local p = g.players[i]
    local hand
    if i == viewer then
      hand = {}
      for _, t in ipairs(p.hand) do hand[#hand + 1] = t end
    end
    seats[#seats + 1] = {
      seat = i,
      nick = s and s.nick or ("空位" .. i),
      ready = s and s.ready or false,
      isBot = s and s.is_bot or false,
      handCount = #p.hand,
      melds = g:public_melds(i),
      discards = p.discards,
      score = p.score,
      hand = hand,
    }
  end
  local lastDiscard = g.last_discard
  if not lastDiscard and g.last_play and g.last_play.cards and #g.last_play.cards > 0 then
    lastDiscard = { seat = g.last_play.seat, tile = g.last_play.cards[#g.last_play.cards] }
  end
  return {
    roomId = self.id,
    gameType = self.game_type,
    phase = g.phase,
    seats = seats,
    wallCount = g.wall and #g.wall or (g.bottom and #g.bottom or 0),
    currentSeat = g.current_seat,
    lastDiscard = lastDiscard,
    lastPlayCards = g.last_play and g.last_play.cards or nil,
    availableOps = g:get_ops(viewer),
    message = g.message,
    round = g.round,
    settle = g.settle,
    landlord = g.landlord,
  }
end

function Room:broadcast(send_fn)
  for i = 0, self.n - 1 do
    local s = self.seats[i]
    if s and s.agent and not s.is_bot then
      send_fn(s.agent, { type = "state", state = self:build_public(i) })
    end
  end
end

function Room:bot_act(seat, ops)
  local function prefer(names)
    for _, op in ipairs(ops) do
      for _, n in ipairs(names) do
        if op.action == n then return op end
      end
    end
  end

  -- 斗地主叫分
  if self.game_type == "doudizhu" and self.game.phase == "bidding" then
    local bids = {}
    for _, op in ipairs(ops) do
      if op.action:sub(1, 4) == "bid_" then bids[#bids + 1] = op end
    end
    if #bids > 0 then
      if math.random() < 0.35 then
        return "bid_0", {}
      end
      local best = bids[#bids]
      return best.action, { tile = best.tile }
    end
  end

  -- 斗地主 / 跑得快出牌
  if (self.game_type == "doudizhu" or self.game_type == "paodekuai") and self.game.phase == "playing" then
    local Engine = Catalog.get(self.game_type).module
    local hand = self.game.players[seat].hand
    if prefer({ "pass" }) and self.game.last_play and self.game.last_play.seat ~= seat then
      local prev = self.game.last_play.pattern
      if prev and prev.kind == "single" then
        for _, c in ipairs(hand) do
          local pat = Engine.parse_pattern({ c })
          if Engine.beats(pat, prev) then
            return "play", { tiles = { c } }
          end
        end
      end
      return "pass", {}
    end
    if prefer({ "play" }) or prefer({ "discard" }) then
      -- 跑得快首出必须带红桃3
      if self.game_type == "paodekuai" and self.game.first_play then
        local h3 = 13
        for _, c in ipairs(hand) do
          if c == h3 then return "play", { tiles = { c } } end
        end
      end
      local c = hand[1]
      return "play", { tiles = { c } }
    end
  end

  local win = prefer({ "zimo", "hu" })
  if win then return win.action, { tile = win.tile, tiles = win.tiles } end
  local gang = prefer({ "ming_gang", "an_gang", "bu_gang", "ti", "pao" })
  if gang then return gang.action, { tile = gang.tile, tiles = gang.tiles } end
  local peng = prefer({ "peng" })
  if peng and math.random() > 0.45 then return "peng", { tile = peng.tile } end
  local chi = prefer({ "chi" })
  if chi and math.random() > 0.55 then return "chi", { tiles = chi.tiles } end
  for _, op in ipairs(ops) do
    if op.action == "pass" then return "pass", {} end
  end
  for _, op in ipairs(ops) do
    if op.action == "discard" then
      local hand = self.game.players[seat].hand
      local tile = hand[math.random(#hand)]
      return "discard", { tile = tile }
    end
  end
  return nil
end

function Room:kick_bots()
  for _ = 1, 24 do
    if self.game.phase == "finished" then return end
    local acted = false
    for i = 0, self.n - 1 do
      local s = self.seats[i]
      if s and s.is_bot then
        local ops = self.game:get_ops(i)
        if #ops > 0 then
          local action, payload = self:bot_act(i, ops)
          if action then
            self.game:apply(i, action, payload)
            acted = true
            break
          end
        end
      end
    end
    if not acted then break end
  end
end

function Room:try_start()
  if self.started then return end
  if not self:all_ready() then return end
  self.started = true
  self.game:start()
  self:kick_bots()
end

function Room:next_round()
  if self.game.phase ~= "finished" then return end
  if not self:all_ready() then return end
  self.started = true
  self.game:start()
  self:kick_bots()
end

function Room:on_ready(seat)
  self:set_ready(seat)
  if self.game.phase == "finished" then
    for i = 0, self.n - 1 do
      if self.seats[i] and self.seats[i].is_bot then
        self.seats[i].ready = true
      end
    end
    self:next_round()
  else
    self:try_start()
  end
end

function Room:on_action(seat, action, payload)
  local err = self.game:apply(seat, action, payload)
  if err then return err end
  if self.game.phase == "finished" then
    for i = 0, self.n - 1 do
      if self.seats[i] then
        if self.seats[i].is_bot then
          self.seats[i].ready = true
        else
          self.seats[i].ready = false
        end
      end
    end
    self.started = false
  else
    self:kick_bots()
  end
  return nil
end

return Room
