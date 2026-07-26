-- 邵阳跑胡子引擎 MVP：发牌、出牌骨架 + 吃碰提跑占位 ops
local T = require "game.shaoyang_phz.tiles"
local Ops = require "game.shaoyang_phz.ops"

local function copy_arr(a)
  local r = {}
  for i, v in ipairs(a) do r[i] = v end
  return r
end

local Engine = {}
Engine.__index = Engine

local DEFAULT = {
  playerCount = 3,
  handSize = 20,
  actionTimeoutSec = 15,
}

function Engine.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Engine)
  self.gameId = "shaoyang_phz"
  self.cfg = {
    playerCount = opts.playerCount or DEFAULT.playerCount,
    handSize = opts.handSize or DEFAULT.handSize,
    actionTimeoutSec = opts.actionTimeoutSec or DEFAULT.actionTimeoutSec,
  }
  self.phase = "waiting"
  self.deadlineAt = nil
  self.round = 0
  self.dealer = 0
  self.currentSeat = 0
  self.wall = {}
  self.players = {}
  self.lastDiscard = nil
  self.message = "等待开始"
  self.claimSeats = {}
  self:_reset_players()
  return self
end

function Engine:_reset_players()
  self.players = {}
  for s = 0, self.cfg.playerCount - 1 do
    self.players[s] = {
      hand = {},
      melds = {},
      discards = {},
      score = 0,
      userId = 0,
      userName = "",
      isBot = false,
      autoPlay = false,
      disconnected = false,
    }
  end
end

function Engine:_set_deadline()
  self.deadlineAt = os.time() + (self.cfg.actionTimeoutSec or 15)
end

function Engine:_clear_deadline()
  self.deadlineAt = nil
end

function Engine:set_seat_meta(seat, meta)
  local p = self.players[seat]
  if not p or type(meta) ~= "table" then return end
  if meta.isBot ~= nil then p.isBot = meta.isBot and true or false end
  if meta.autoPlay ~= nil then p.autoPlay = meta.autoPlay and true or false end
  if meta.disconnected ~= nil then p.disconnected = meta.disconnected and true or false end
end

function Engine:on_start(seats)
  self.round = self.round + 1
  self.lastDiscard = nil
  self.claimSeats = {}
  self.wall = T.shuffle(T.build_deck())
  for s = 0, self.cfg.playerCount - 1 do
    local info = seats[s + 1] or seats[s] or {}
    local p = self.players[s]
    p.hand = {}
    p.melds = {}
    p.discards = {}
    p.userId = info.userId or 0
    p.userName = info.userName or ("座位" .. s)
    p.isBot = info.isBot and true or false
  end
  for s = 0, self.cfg.playerCount - 1 do
    for _ = 1, self.cfg.handSize do
      if #self.wall > 0 then
        self.players[s].hand[#self.players[s].hand + 1] = table.remove(self.wall, 1)
      end
    end
    self.players[s].hand = T.sort_tiles(self.players[s].hand)
  end
  self.currentSeat = self.dealer
  self.phase = "wait_discard"
  self.message = string.format("第%d局 庄家座位%d 请出牌", self.round, self.dealer)
  self:_set_deadline()
end

function Engine:_available_ops(for_seat)
  if self.phase == "wait_discard" and for_seat == self.currentSeat then
    return Ops.discard_ops()
  end
  if self.phase == "wait_claim" then
    for _, s in ipairs(self.claimSeats) do
      if s == for_seat then
        return Ops.claim_ops(self.players[for_seat].hand, self.lastDiscard and self.lastDiscard.tile)
      end
    end
  end
  return {}
end

function Engine:_open_claims(from_seat, tile)
  self.claimSeats = {}
  for s = 0, self.cfg.playerCount - 1 do
    if s ~= from_seat then
      local ops = Ops.claim_ops(self.players[s].hand, tile)
      if #ops > 1 then
        self.claimSeats[#self.claimSeats + 1] = s
      end
    end
  end
  if #self.claimSeats == 0 then
    self:_next_turn((from_seat + 1) % self.cfg.playerCount)
    return
  end
  self.phase = "wait_claim"
  self.message = "等待吃碰提跑（占位）"
  self:_set_deadline()
end

function Engine:_next_turn(seat)
  self.currentSeat = seat
  self.lastDiscard = nil
  self.claimSeats = {}
  if #self.wall == 0 then
    self.phase = "settle"
    self.message = "牌墙摸完（MVP 占位）"
    self:_clear_deadline()
    return
  end
  local t = table.remove(self.wall, 1)
  local p = self.players[seat]
  p.hand[#p.hand + 1] = t
  p.hand = T.sort_tiles(p.hand)
  self.phase = "wait_discard"
  self.message = string.format("座位%d 摸牌，请出牌", seat)
  self:_set_deadline()
end

function Engine:on_action(seat, cmd, body)
  body = body or {}
  if cmd == "discard" then
    if self.phase ~= "wait_discard" or seat ~= self.currentSeat then
      return false, "未轮到出牌"
    end
    local tile = tonumber(body.tile)
    if tile == nil then return false, "缺 tile" end
    if tile < 0 or tile > 19 then return false, "非法牌" end
    if not T.remove_one(self.players[seat].hand, tile) then
      return false, "手牌无此牌"
    end
    self.players[seat].discards[#self.players[seat].discards + 1] = tile
    self.players[seat].hand = T.sort_tiles(self.players[seat].hand)
    self.lastDiscard = { seat = seat, tile = tile }
    self:_open_claims(seat, tile)
    self:_clear_deadline()
    return true
  end
  if cmd == "guo" then
    if self.phase ~= "wait_claim" then return false, "非抢牌阶段" end
    local left = {}
    for _, s in ipairs(self.claimSeats) do
      if s ~= seat then left[#left + 1] = s end
    end
    self.claimSeats = left
    if #self.claimSeats == 0 then
      local from = self.lastDiscard.seat
      self:_next_turn((from + 1) % self.cfg.playerCount)
    else
      self:_set_deadline()
    end
    return true
  end
  if cmd == "chi" or cmd == "peng" or cmd == "ti" or cmd == "pao" then
    return false, cmd .. " 规则尚未实现（占位）"
  end
  return false, "未知操作 " .. tostring(cmd)
end

function Engine:check_timeout()
  if not self.deadlineAt or os.time() < self.deadlineAt then
    return false
  end
  if self.phase == "wait_discard" then
    local seat = self.currentSeat
    local hand = self.players[seat].hand
    if #hand == 0 then
      self:_clear_deadline()
      return false
    end
    self:on_action(seat, "discard", { tile = hand[#hand] })
    return true
  end
  if self.phase == "wait_claim" and #self.claimSeats > 0 then
    self:on_action(self.claimSeats[1], "guo", {})
    return true
  end
  self:_clear_deadline()
  return false
end

function Engine:snapshot(for_seat)
  local seats = {}
  for s = 0, self.cfg.playerCount - 1 do
    local p = self.players[s]
    local sp = {
      seat = s,
      userId = p.userId,
      userName = p.userName,
      isBot = p.isBot,
      handCount = #p.hand,
      melds = p.melds,
      discards = p.discards,
      score = p.score,
      autoPlay = p.autoPlay and true or false,
      disconnected = p.disconnected and true or false,
    }
    if for_seat == s then
      sp.hand = copy_arr(p.hand)
    end
    seats[#seats + 1] = sp
  end
  local now = os.time()
  local deadlineMs = nil
  if self.deadlineAt then
    deadlineMs = math.max(0, (self.deadlineAt - now) * 1000)
  end
  return {
    gameId = self.gameId,
    phase = self.phase,
    round = self.round,
    dealer = self.dealer,
    currentSeat = self.currentSeat,
    wallCount = #self.wall,
    lastDiscard = self.lastDiscard,
    message = self.message,
    seats = seats,
    availableOps = self:_available_ops(for_seat),
    deadlineAt = self.deadlineAt,
    deadlineMs = deadlineMs,
  }
end

function Engine:needs_bot_tick()
  if self.phase == "settle" or self.phase == "waiting" then return false end
  if self.phase == "wait_discard" then
    local p = self.players[self.currentSeat]
    return p and (p.isBot or p.autoPlay)
  end
  if self.phase == "wait_claim" then
    for _, s in ipairs(self.claimSeats) do
      local p = self.players[s]
      if p and (p.isBot or p.autoPlay) then return true end
    end
  end
  return false
end

function Engine:bot_tick(seat)
  local p = self.players[seat]
  if not p or not (p.isBot or p.autoPlay) then return false end
  if self.phase == "wait_discard" and seat == self.currentSeat then
    local hand = p.hand
    if #hand == 0 then return false end
    self:on_action(seat, "discard", { tile = hand[#hand] })
    return true
  end
  if self.phase == "wait_claim" then
    for _, s in ipairs(self.claimSeats) do
      if s == seat then
        self:on_action(seat, "guo", {})
        return true
      end
    end
  end
  return false
end

local M = {}

function M.new(opts)
  return Engine.new(opts)
end

function M.register(reg)
  reg.register("shaoyang_phz", function(opts)
    return Engine.new(opts)
  end)
end

return M
