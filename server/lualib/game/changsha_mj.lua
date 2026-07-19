--[[ 长沙麻将完整状态机（服务端权威）]]
local T = require "game.mj_tiles"

local M = {}
M.__index = M

function M.new(cfg)
  local self = setmetatable({}, M)
  self.player_count = 4
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
  self.cfg = cfg or { bird_count = 2, base_score = 2 }
  for i = 0, 3 do
    self.players[i] = { hand = {}, melds = {}, discards = {}, score = 0 }
  end
  return self
end

local function sort_hand(p)
  T.sort_tiles(p.hand)
end

function M:start()
  self.round = self.round + 1
  self.settle = nil
  self.wall = T.shuffle(T.build_deck())
  for i = 0, 3 do
    self.players[i].hand = {}
    self.players[i].melds = {}
    self.players[i].discards = {}
  end
  for s = 0, 3 do
    local n = (s == self.dealer) and 14 or 13
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
  self.message = string.format("第 %d 局开始，庄家座位 %d", self.round, self.dealer)
end

function M:find_chi(hand, tile)
  local suit = math.floor(tile / 9)
  local rank = tile % 9
  local function has(t)
    return T.index_of(hand, t) ~= nil
  end
  local cand = {}
  if rank >= 1 and rank <= 7 then cand[#cand + 1] = { tile - 1, tile, tile + 1 } end
  if rank >= 2 then cand[#cand + 1] = { tile - 2, tile - 1, tile } end
  if rank <= 6 then cand[#cand + 1] = { tile, tile + 1, tile + 2 } end
  local out, seen = {}, {}
  for _, combo in ipairs(cand) do
    local ok = true
    for _, x in ipairs(combo) do
      if math.floor(x / 9) ~= suit then ok = false end
    end
    if ok then
      local need_ok = true
      for _, x in ipairs(combo) do
        if x ~= tile and not has(x) then need_ok = false end
      end
      if need_ok then
        local sorted = { combo[1], combo[2], combo[3] }
        table.sort(sorted)
        local key = table.concat(sorted, ",")
        if not seen[key] then
          seen[key] = true
          out[#out + 1] = sorted
        end
      end
    end
  end
  return out
end

function M:get_ops(seat)
  local ops = {}
  if self.phase == "wait_discard" and seat == self.current_seat then
    ops[#ops + 1] = { action = "discard", label = "出牌" }
    local c = T.counts_of(self.players[seat].hand)
    for t = 0, 26 do
      if c[t] == 4 then
        ops[#ops + 1] = { action = "an_gang", label = "暗杠 " .. T.tile_name(t), tile = t }
      end
    end
    for _, m in ipairs(self.players[seat].melds) do
      if m.kind == "peng" and T.index_of(self.players[seat].hand, m.tiles[1]) then
        local t = m.tiles[1]
        ops[#ops + 1] = { action = "bu_gang", label = "补杠 " .. T.tile_name(t), tile = t }
      end
    end
    if T.is_hu(self.players[seat].hand) then
      ops[#ops + 1] = { action = "zimo", label = "自摸" }
    end
    return ops
  end
  if self.phase == "wait_claim" then
    local in_claim = false
    for _, s in ipairs(self.claim_seats) do if s == seat then in_claim = true end end
    if not in_claim then return ops end
    local tile = self.last_discard.tile
    local hand = self.players[seat].hand
    ops[#ops + 1] = { action = "pass", label = "过" }
    if T.count_val(hand, tile) >= 2 then
      ops[#ops + 1] = { action = "peng", label = "碰 " .. T.tile_name(tile), tile = tile }
    end
    if T.count_val(hand, tile) >= 3 then
      ops[#ops + 1] = { action = "ming_gang", label = "杠 " .. T.tile_name(tile), tile = tile }
    end
    local tmp = {}
    for _, x in ipairs(hand) do tmp[#tmp + 1] = x end
    tmp[#tmp + 1] = tile
    if T.is_hu(tmp) then
      ops[#ops + 1] = { action = "hu", label = "胡 " .. T.tile_name(tile), tile = tile }
    end
    if seat == (self.last_discard.seat + 1) % 4 then
      for _, chi in ipairs(self:find_chi(hand, tile)) do
        ops[#ops + 1] = {
          action = "chi",
          label = "吃",
          tiles = chi,
        }
      end
    end
  end
  return ops
end

function M:collect_claimers(from, tile)
  local list = {}
  for s = 0, 3 do
    if s ~= from then
      local hand = self.players[s].hand
      local can_peng = T.count_val(hand, tile) >= 2
      local can_gang = T.count_val(hand, tile) >= 3
      local tmp = {}
      for _, x in ipairs(hand) do tmp[#tmp + 1] = x end
      tmp[#tmp + 1] = tile
      local can_hu = T.is_hu(tmp)
      local can_chi = (s == (from + 1) % 4) and (#self:find_chi(hand, tile) > 0)
      if can_peng or can_gang or can_hu or can_chi then
        list[#list + 1] = s
      end
    end
  end
  return list
end

function M:draw_one(seat)
  if #self.wall == 0 then return end
  local t = table.remove(self.wall, 1)
  self.players[seat].hand[#self.players[seat].hand + 1] = t
  sort_hand(self.players[seat])
end

function M:advance_draw(seat)
  if #self.wall == 0 then
    self.settle = {
      winnerSeat = nil,
      reason = "流局",
      scores = { 0, 0, 0, 0 },
      detail = "牌墙摸完，流局",
    }
    self.phase = "finished"
    self.message = "流局"
    return
  end
  self:draw_one(seat)
  self.current_seat = seat
  self.phase = "wait_discard"
  self.message = string.format("座位 %d 摸牌，请出牌（剩 %d）", seat, #self.wall)
end

function M:do_win(seat, reason, zimo)
  local birds = {}
  local n = math.min(self.cfg.bird_count or 2, #self.wall)
  for _ = 1, n do birds[#birds + 1] = table.remove(self.wall, 1) end
  local bird_hit = 0
  for _, b in ipairs(birds) do if T.is_bird(b) then bird_hit = bird_hit + 1 end end
  local base = self.cfg.base_score or 2
  local win_score = base * (1 + bird_hit) * (zimo and 2 or 1)
  local scores = { 0, 0, 0, 0 }
  if zimo then
    for s = 0, 3 do
      if s ~= seat then
        scores[s + 1] = scores[s + 1] - win_score
        scores[seat + 1] = scores[seat + 1] + win_score
      end
    end
  else
    local loser = self.last_discard.seat
    scores[loser + 1] = scores[loser + 1] - win_score * 2
    scores[seat + 1] = scores[seat + 1] + win_score * 2
  end
  for s = 0, 3 do self.players[s].score = self.players[s].score + scores[s + 1] end
  local bird_names = {}
  for _, b in ipairs(birds) do bird_names[#bird_names + 1] = T.tile_name(b) end
  self.settle = {
    winnerSeat = seat,
    reason = reason,
    scores = scores,
    detail = string.format("%s；鸟牌 %s；中鸟 %d", reason, table.concat(bird_names, "、"), bird_hit),
  }
  self.dealer = seat
  self.phase = "finished"
  self.message = self.settle.detail
end

function M:take_meld(seat, kind, from_hand)
  local tile = self.last_discard.tile
  for _ = 1, from_hand do T.remove_one(self.players[seat].hand, tile) end
  local tiles
  if kind == "peng" then tiles = { tile, tile, tile }
  else tiles = { tile, tile, tile, tile } end
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
  -- 胡优先
  for _, s in ipairs(self.claim_seats) do
    if self.pending[s] == "hu" then
      local tile = self.last_discard.tile
      self.players[s].hand[#self.players[s].hand + 1] = tile
      sort_hand(self.players[s])
      self:do_win(s, "接炮胡 " .. T.tile_name(tile), false)
      return
    end
  end
  if not all_in then
    self.message = "等待其他玩家响应…"
    return
  end
  for _, s in ipairs(self.claim_seats) do
    if self.pending[s] == "ming_gang" then
      self:take_meld(s, "ming_gang", 3)
      self:draw_one(s)
      self.current_seat = s
      self.phase = "wait_discard"
      self.claim_seats = {}
      self.pending = {}
      self.message = string.format("座位 %d 明杠", s)
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
      self.message = string.format("座位 %d 碰牌", s)
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
      self.message = string.format("座位 %d 吃牌", s)
      return
    end
  end
  self.claim_seats = {}
  self.pending = {}
  self:advance_draw((self.last_discard.seat + 1) % 4)
end

function M:apply(seat, action, payload)
  payload = payload or {}
  if self.phase == "wait_discard" and seat == self.current_seat then
    if action == "discard" then
      local tile = payload.tile
      if tile == nil or not T.remove_one(self.players[seat].hand, tile) then
        return "无效出牌"
      end
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
      self:advance_draw((seat + 1) % 4)
      return nil
    end
    if action == "zimo" then
      if not T.is_hu(self.players[seat].hand) then return "未胡牌" end
      self:do_win(seat, "自摸", true)
      return nil
    end
    if action == "an_gang" and payload.tile then
      local tile = payload.tile
      if T.count_val(self.players[seat].hand, tile) < 4 then return "不能暗杠" end
      for _ = 1, 4 do T.remove_one(self.players[seat].hand, tile) end
      self.players[seat].melds[#self.players[seat].melds + 1] = {
        kind = "an_gang", tiles = { tile, tile, tile, tile },
      }
      self:draw_one(seat)
      self.message = string.format("座位 %d 暗杠", seat)
      return nil
    end
    if action == "bu_gang" and payload.tile then
      local tile = payload.tile
      local found
      for _, m in ipairs(self.players[seat].melds) do
        if m.kind == "peng" and m.tiles[1] == tile then found = m break end
      end
      if not found or not T.remove_one(self.players[seat].hand, tile) then return "不能补杠" end
      found.kind = "bu_gang"
      found.tiles = { tile, tile, tile, tile }
      self:draw_one(seat)
      self.message = string.format("座位 %d 补杠", seat)
      return nil
    end
  end
  if self.phase == "wait_claim" then
    local in_claim = false
    for _, s in ipairs(self.claim_seats) do if s == seat then in_claim = true end end
    if in_claim then
      if action == "chi" then
        local tiles = payload.tiles or {}
        self.pending[seat] = "chi:" .. table.concat(tiles, ",")
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
