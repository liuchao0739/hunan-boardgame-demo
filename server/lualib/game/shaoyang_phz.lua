--[[ 邵阳跑胡子三人场状态机 ]]
local T = require "game.phz_tiles"

local M = {}
M.__index = M

function M.new()
  local self = setmetatable({}, M)
  self.player_count = 3
  self.phase = "waiting"
  self.players = {}
  self.wall = {}
  self.current_seat = 0
  self.dealer = 0
  self.round = 0
  self.last_discard = nil
  self.claim_seats = {}
  self.pending = {}
  self.settle = nil
  self.message = "等待开始"
  self.min_huxi = 15
  for i = 0, 2 do
    self.players[i] = { hand = {}, melds = {}, discards = {}, score = 0 }
  end
  return self
end

local function sort_hand(p) T.sort_tiles(p.hand) end

function M:meld_hx(seat)
  local s = 0
  for _, m in ipairs(self.players[seat].melds) do
    s = s + T.meld_huxi(m.kind, m.tiles[1])
  end
  return s
end

function M:start()
  self.round = self.round + 1
  self.settle = nil
  self.wall = T.shuffle(T.build_deck())
  for i = 0, 2 do
    self.players[i].hand = {}
    self.players[i].melds = {}
    self.players[i].discards = {}
  end
  for s = 0, 2 do
    local n = (s == self.dealer) and 21 or 20
    for _ = 1, n do
      self.players[s].hand[#self.players[s].hand + 1] = table.remove(self.wall, 1)
    end
    sort_hand(self.players[s])
  end
  self.current_seat = self.dealer
  self.phase = "wait_discard"
  self.last_discard = nil
  self.claim_seats = {}
  self.pending = {}
  self.message = string.format("第 %d 局邵阳跑胡子，庄 %d", self.round, self.dealer)
end

function M:get_ops(seat)
  local ops = {}
  if self.phase == "wait_discard" and seat == self.current_seat then
    ops[#ops + 1] = { action = "discard", label = "出牌" }
    if T.can_hu(self.players[seat].hand, self:meld_hx(seat), self.min_huxi) then
      ops[#ops + 1] = { action = "zimo", label = "胡牌" }
    end
    local c = {}
    for i = 0, 19 do c[i] = 0 end
    for _, t in ipairs(self.players[seat].hand) do c[t] = c[t] + 1 end
    for t = 0, 19 do
      if c[t] == 4 then
        ops[#ops + 1] = { action = "ti", label = "提 " .. T.tile_name(t), tile = t }
      end
    end
    return ops
  end
  if self.phase == "wait_claim" then
    local ok = false
    for _, s in ipairs(self.claim_seats) do if s == seat then ok = true end end
    if not ok then return ops end
    local tile = self.last_discard.tile
    local hand = self.players[seat].hand
    ops[#ops + 1] = { action = "pass", label = "过" }
    local n = T.count_val(hand, tile)
    if n >= 2 then ops[#ops + 1] = { action = "peng", label = "碰", tile = tile } end
    if n >= 3 then ops[#ops + 1] = { action = "pao", label = "跑", tile = tile } end
    local tmp = {}
    for _, x in ipairs(hand) do tmp[#tmp + 1] = x end
    tmp[#tmp + 1] = tile
    if T.can_hu(tmp, self:meld_hx(seat), self.min_huxi) then
      ops[#ops + 1] = { action = "hu", label = "胡", tile = tile }
    end
    if seat == (self.last_discard.seat + 1) % 3 then
      for _, chi in ipairs(T.find_chi(hand, tile)) do
        ops[#ops + 1] = { action = "chi", label = "吃", tiles = chi }
      end
    end
  end
  return ops
end

function M:draw_one(seat)
  if #self.wall == 0 then return end
  self.players[seat].hand[#self.players[seat].hand + 1] = table.remove(self.wall, 1)
  sort_hand(self.players[seat])
end

function M:advance_draw(seat)
  if #self.wall == 0 then
    self.settle = { winnerSeat = nil, reason = "流局", scores = { 0, 0, 0 }, detail = "流局" }
    self.phase = "finished"
    self.message = "流局"
    return
  end
  self:draw_one(seat)
  self.current_seat = seat
  self.phase = "wait_discard"
  self.message = string.format("座位 %d 摸牌（剩 %d）", seat, #self.wall)
end

function M:do_win(seat, reason)
  local hx = self:meld_hx(seat)
  local win = math.max(1, math.floor(hx / 3)) + 2
  local scores = { 0, 0, 0 }
  for s = 0, 2 do
    if s ~= seat then
      scores[s + 1] = scores[s + 1] - win
      scores[seat + 1] = scores[seat + 1] + win
    end
  end
  for s = 0, 2 do self.players[s].score = self.players[s].score + scores[s + 1] end
  self.settle = {
    winnerSeat = seat, reason = reason, scores = scores,
    detail = string.format("%s；胡息约 %d", reason, hx),
  }
  self.dealer = seat
  self.phase = "finished"
  self.message = self.settle.detail
end

function M:collect_claimers(from, tile)
  local list = {}
  for s = 0, 2 do
    if s ~= from then
      local hand = self.players[s].hand
      local n = T.count_val(hand, tile)
      local tmp = {}
      for _, x in ipairs(hand) do tmp[#tmp + 1] = x end
      tmp[#tmp + 1] = tile
      local can_chi = (s == (from + 1) % 3) and (#T.find_chi(hand, tile) > 0)
      if n >= 2 or n >= 3 or T.can_hu(tmp, self:meld_hx(s), self.min_huxi) or can_chi then
        list[#list + 1] = s
      end
    end
  end
  return list
end

function M:take_meld(seat, kind, from_hand)
  local tile = self.last_discard.tile
  for _ = 1, from_hand do T.remove_one(self.players[seat].hand, tile) end
  local tiles = (kind == "peng") and { tile, tile, tile } or { tile, tile, tile, tile }
  self.players[seat].melds[#self.players[seat].melds + 1] = {
    kind = kind, tiles = tiles, fromSeat = self.last_discard.seat,
  }
  self.last_discard = nil
end

function M:take_chi(seat, tiles)
  local discard = self.last_discard.tile
  for _, t in ipairs(tiles) do
    if t ~= discard then T.remove_one(self.players[seat].hand, t) end
  end
  local sorted = { tiles[1], tiles[2], tiles[3] }
  table.sort(sorted)
  self.players[seat].melds[#self.players[seat].melds + 1] = {
    kind = "chi", tiles = sorted, fromSeat = self.last_discard.seat,
  }
  self.last_discard = nil
end

function M:resolve_claims()
  local all_in = true
  for _, s in ipairs(self.claim_seats) do
    if not self.pending[s] then all_in = false end
  end
  for _, s in ipairs(self.claim_seats) do
    if self.pending[s] == "hu" then
      local tile = self.last_discard.tile
      self.players[s].hand[#self.players[s].hand + 1] = tile
      sort_hand(self.players[s])
      self:do_win(s, "接炮胡 " .. T.tile_name(tile))
      return
    end
  end
  if not all_in then
    self.message = "等待其他玩家响应…"
    return
  end
  for _, s in ipairs(self.claim_seats) do
    if self.pending[s] == "pao" then
      self:take_meld(s, "pao", 3)
      self:draw_one(s)
      self.current_seat = s
      self.phase = "wait_discard"
      self.claim_seats = {}
      self.pending = {}
      return
    end
  end
  for _, s in ipairs(self.claim_seats) do
    if self.pending[s] == "peng" then
      self:take_meld(s, "peng", 2)
      self.current_seat = s
      self.phase = "wait_discard"
      self.claim_seats = {}
      self.pending = {}
      return
    end
  end
  for _, s in ipairs(self.claim_seats) do
    local a = self.pending[s]
    if type(a) == "string" and a:sub(1, 4) == "chi:" then
      local tiles = {}
      for num in a:sub(5):gmatch("%d+") do tiles[#tiles + 1] = tonumber(num) end
      self:take_chi(s, tiles)
      self.current_seat = s
      self.phase = "wait_discard"
      self.claim_seats = {}
      self.pending = {}
      return
    end
  end
  self.claim_seats = {}
  self.pending = {}
  self:advance_draw((self.last_discard.seat + 1) % 3)
end

function M:apply(seat, action, payload)
  payload = payload or {}
  if self.phase == "wait_discard" and seat == self.current_seat then
    if action == "discard" then
      local tile = payload.tile
      if tile == nil or not T.remove_one(self.players[seat].hand, tile) then return "无效出牌" end
      self.players[seat].discards[#self.players[seat].discards + 1] = tile
      self.last_discard = { seat = seat, tile = tile }
      local responders = self:collect_claimers(seat, tile)
      if #responders > 0 then
        self.phase = "wait_claim"
        self.claim_seats = responders
        self.pending = {}
        self.message = string.format("座位 %d 打出 %s", seat, T.tile_name(tile))
        return nil
      end
      self:advance_draw((seat + 1) % 3)
      return nil
    end
    if action == "zimo" then
      if not T.can_hu(self.players[seat].hand, self:meld_hx(seat), self.min_huxi) then
        return "不能胡"
      end
      self:do_win(seat, "自摸胡")
      return nil
    end
    if action == "ti" and payload.tile then
      local tile = payload.tile
      if T.count_val(self.players[seat].hand, tile) < 4 then return "不能提" end
      for _ = 1, 4 do T.remove_one(self.players[seat].hand, tile) end
      self.players[seat].melds[#self.players[seat].melds + 1] = {
        kind = "ti", tiles = { tile, tile, tile, tile },
      }
      self:draw_one(seat)
      return nil
    end
  end
  if self.phase == "wait_claim" then
    local ok = false
    for _, s in ipairs(self.claim_seats) do if s == seat then ok = true end end
    if ok then
      if action == "chi" then
        self.pending[seat] = "chi:" .. table.concat(payload.tiles or {}, ",")
      else
        self.pending[seat] = action
      end
      self:resolve_claims()
      return nil
    end
  end
  return "当前不能操作"
end

function M:public_melds(seat)
  local out = {}
  for _, m in ipairs(self.players[seat].melds) do
    out[#out + 1] = { kind = m.kind, tiles = m.tiles, fromSeat = m.fromSeat }
  end
  return out
end

return M
