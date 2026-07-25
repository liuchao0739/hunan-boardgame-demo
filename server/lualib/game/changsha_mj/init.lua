-- 长沙麻将引擎
local T = require "game.changsha_mj.tiles"
local Q = require "game.changsha_mj.qishou"
local Niao = require "game.changsha_mj.niao"

local function copy_arr(a)
  local r = {}
  for i, v in ipairs(a) do r[i] = v end
  return r
end

local Engine = {}
Engine.__index = Engine

local DEFAULT = {
  birdCount = 2,
  baseScore = 1,
  playerCount = 4,
}

function Engine.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Engine)
  self.gameId = "changsha_mj"
  self.cfg = {
    birdCount = opts.birdCount or DEFAULT.birdCount,
    baseScore = opts.baseScore or DEFAULT.baseScore,
    playerCount = opts.playerCount or DEFAULT.playerCount,
  }
  self.phase = "waiting"
  self.round = 0
  self.dealer = 0
  self.currentSeat = 0
  self.wall = {}
  self.players = {}
  self.lastDiscard = nil
  self.message = "等待开始"
  self.settle = nil
  self.qishou = nil -- { seats = { [seat]=hits }, pending = bool }
  self.zhongtu = nil
  self.claimSeats = {}
  self.drawn = nil
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
    }
  end
end

function Engine:on_start(seats)
  -- seats: array 1..4 of {userId,userName,isBot}
  self.round = self.round + 1
  self.settle = nil
  self.qishou = nil
  self.zhongtu = nil
  self.lastDiscard = nil
  self.drawn = nil
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
    local n = (s == self.dealer) and 14 or 13
    for _ = 1, n do
      pcall(function()
        self.players[s].hand[#self.players[s].hand + 1] = table.remove(self.wall, 1)
      end)
    end
    self.players[s].hand = T.sort_tiles(self.players[s].hand)
  end
  self.currentSeat = self.dealer
  -- 起手胡检测
  local qs = {}
  local any = false
  for s = 0, self.cfg.playerCount - 1 do
    local hits = Q.detect(self.players[s].hand)
    if #hits > 0 then
      qs[tostring(s)] = hits
      any = true
    end
  end
  if any then
    self.qishou = { hits = qs, resolved = false }
    self.phase = "qishou"
    self.message = "起手胡！可结算或继续"
    self:_apply_qishou_scores()
  else
    self.phase = "wait_discard"
    self.message = string.format("第%d局 庄家座位%d 请出牌", self.round, self.dealer)
  end
end

function Engine:_apply_qishou_scores()
  if not self.qishou or self.qishou.resolved then return end
  local base = self.cfg.baseScore
  for s = 0, self.cfg.playerCount - 1 do
    local hits = self.qishou.hits[tostring(s)]
    if hits then
      local fan = 0
      for _, h in ipairs(hits) do fan = fan + (h.fan or 2) end
      local gain = fan * base
      for o = 0, self.cfg.playerCount - 1 do
        if o ~= s then
          self.players[o].score = self.players[o].score - gain
          self.players[s].score = self.players[s].score + gain
        end
      end
    end
  end
  self.qishou.resolved = true
end

function Engine:_draw(seat)
  if #self.wall == 0 then return nil end
  local t = table.remove(self.wall, 1)
  local p = self.players[seat]
  p.hand[#p.hand + 1] = t
  p.hand = T.sort_tiles(p.hand)
  self.drawn = t
  -- 中途四喜 / 六六顺
  local zhong = {}
  if Q.zhongtu_sixi(p.hand) then
    zhong[#zhong + 1] = { id = "zhongtu_sixi", name = "中途四喜", fan = 2 }
  end
  if Q.zhongtu_liuliu(p.hand) then
    zhong[#zhong + 1] = { id = "zhongtu_liuliu", name = "中途六六顺", fan = 2 }
  end
  if #zhong > 0 then
    self.zhongtu = { seat = seat, hits = zhong }
    local base = self.cfg.baseScore
    for _, h in ipairs(zhong) do
      local gain = (h.fan or 2) * base
      for o = 0, self.cfg.playerCount - 1 do
        if o ~= seat then
          self.players[o].score = self.players[o].score - gain
          self.players[seat].score = self.players[seat].score + gain
        end
      end
    end
    self.message = string.format("座位%d %s", seat, zhong[1].name)
  end
  return t
end

function Engine:_ops_discard(seat)
  local ops = { { action = "discard", label = "出牌" } }
  local hand = self.players[seat].hand
  local c = T.counts(hand)
  for t = 0, 26 do
    if (c[t] or 0) >= 4 then
      ops[#ops + 1] = { action = "an_gang", label = "暗杠 " .. T.tile_name(t), tile = t }
    end
  end
  for _, m in ipairs(self.players[seat].melds) do
    if m.kind == "peng" and (c[m.tiles[1]] or 0) >= 1 then
      ops[#ops + 1] = { action = "bu_gang", label = "补杠 " .. T.tile_name(m.tiles[1]), tile = m.tiles[1] }
    end
  end
  if T.can_hu(hand) or T.can_jiang_jiang_hu(hand) then
    ops[#ops + 1] = { action = "zimo", label = "自摸" }
  end
  return ops
end

function Engine:_ops_claim(seat)
  local ops = { { action = "guo", label = "过" } }
  local tile = self.lastDiscard.tile
  local from = self.lastDiscard.seat
  local hand = self.players[seat].hand
  local c = T.counts(hand)
  if (c[tile] or 0) >= 2 then
    ops[#ops + 1] = { action = "peng", label = "碰 " .. T.tile_name(tile), tile = tile }
  end
  if (c[tile] or 0) >= 3 then
    ops[#ops + 1] = { action = "ming_gang", label = "杠 " .. T.tile_name(tile), tile = tile }
  end
  -- 吃：仅上家
  local upper = (from + 1) % self.cfg.playerCount
  if seat == upper then
    local chis = T.chi_options(hand, tile)
    for _, ch in ipairs(chis) do
      ops[#ops + 1] = {
        action = "chi",
        label = string.format("吃 %s%s%s", T.tile_name(ch[1]), T.tile_name(ch[2]), T.tile_name(ch[3])),
        tiles = { ch[1], ch[2], ch[3] },
      }
    end
  end
  local try_hand = copy_arr(hand)
  try_hand[#try_hand + 1] = tile
  if T.can_hu(try_hand) or T.can_jiang_jiang_hu(try_hand) then
    ops[#ops + 1] = { action = "hu", label = "胡", tile = tile }
  end
  return ops
end

function Engine:_available_ops(for_seat)
  if self.phase == "qishou" then
    return { { action = "continue", label = "继续打牌" } }
  end
  if self.phase == "wait_discard" and for_seat == self.currentSeat then
    return self:_ops_discard(for_seat)
  end
  if self.phase == "wait_claim" then
    for _, s in ipairs(self.claimSeats) do
      if s == for_seat then return self:_ops_claim(for_seat) end
    end
  end
  if self.phase == "settle" or self.phase == "finished" then
    return { { action = "leave", label = "回大厅" } }
  end
  return {}
end

function Engine:_open_claims(from_seat, tile)
  self.claimSeats = {}
  for s = 0, self.cfg.playerCount - 1 do
    if s ~= from_seat then
      local ops = self:_ops_claim_preview(s, from_seat, tile)
      if #ops > 1 then -- more than just guo
        self.claimSeats[#self.claimSeats + 1] = s
      end
    end
  end
  if #self.claimSeats == 0 then
    self:_next_turn((from_seat + 1) % self.cfg.playerCount)
    return
  end
  self.phase = "wait_claim"
  self.message = "等待吃碰杠胡"
end

function Engine:_ops_claim_preview(seat, from, tile)
  self.lastDiscard = { seat = from, tile = tile }
  return self:_ops_claim(seat)
end

function Engine:_next_turn(seat)
  self.currentSeat = seat
  self.lastDiscard = nil
  self.claimSeats = {}
  self.drawn = nil
  if #self.wall == 0 then
    self:_huangzhuang()
    return
  end
  self:_draw(seat)
  self.phase = "wait_discard"
  self.message = string.format("座位%d 摸牌，请出牌", seat)
end

function Engine:_huangzhuang()
  self.phase = "settle"
  self.settle = {
    winnerSeat = nil,
    reason = "huangzhuang",
    detail = "荒庄（牌墙摸完）",
    scores = self:_score_list(),
    birds = {},
    birdHits = {},
  }
  self.message = "荒庄"
end

function Engine:_score_list()
  local s = {}
  for i = 0, self.cfg.playerCount - 1 do
    s[i + 1] = self.players[i].score
  end
  return s
end

function Engine:_do_hu(winner, is_zimo, pao_seat)
  local base = self.cfg.baseScore
  local fan = is_zimo and 2 or 1
  if T.can_jiang_jiang_hu(self.players[winner].hand) then
    fan = fan + 2
  end
  local gain = fan * base
  if is_zimo then
    for o = 0, self.cfg.playerCount - 1 do
      if o ~= winner then
        self.players[o].score = self.players[o].score - gain
        self.players[winner].score = self.players[winner].score + gain
      end
    end
  else
    self.players[pao_seat].score = self.players[pao_seat].score - gain * 2
    self.players[winner].score = self.players[winner].score + gain * 2
  end
  -- 抓鸟（birdHits 必须是 1-based 数组，否则 json 编码 sparse array 崩溃）
  local birds = Niao.draw_birds(self.wall, self.cfg.birdCount)
  local hits = Niao.count_hits(birds, winner, self.cfg.playerCount)
  local birdHitsArr = {}
  for s = 0, self.cfg.playerCount - 1 do
    local h = hits[s] or 0
    birdHitsArr[s + 1] = h
    if h > 0 and s ~= winner then
      local add = h * base
      self.players[s].score = self.players[s].score - add
      self.players[winner].score = self.players[winner].score + add
    elseif h > 0 and s == winner then
      -- 赢家中鸟：其余每人再出
      for o = 0, self.cfg.playerCount - 1 do
        if o ~= winner then
          self.players[o].score = self.players[o].score - h * base
          self.players[winner].score = self.players[winner].score + h * base
        end
      end
    end
  end
  self.phase = "settle"
  self.settle = {
    winnerSeat = winner,
    reason = is_zimo and "zimo" or "dianpao",
    detail = string.format("%s 座位%d；鸟：%s", is_zimo and "自摸" or "点炮", winner, Niao.describe(birds)),
    scores = self:_score_list(),
    birds = birds,
    birdHits = birdHitsArr,
  }
  self.message = self.settle.detail
  self.dealer = winner -- 赢家坐庄
end

function Engine:on_action(seat, cmd, body)
  body = body or {}
  if self.phase == "qishou" and cmd == "continue" then
    self.phase = "wait_discard"
    self.message = string.format("继续：庄家座位%d 出牌", self.dealer)
    return true
  end
  if self.phase == "settle" then
    return true
  end
  if cmd == "discard" then
    if self.phase ~= "wait_discard" or seat ~= self.currentSeat then
      return false, "未轮到出牌"
    end
    local tile = body.tile
    if tile == nil then return false, "缺 tile" end
    if not T.remove_one(self.players[seat].hand, tile) then
      return false, "手牌无此牌"
    end
    self.players[seat].discards[#self.players[seat].discards + 1] = tile
    self.players[seat].hand = T.sort_tiles(self.players[seat].hand)
    self.lastDiscard = { seat = seat, tile = tile }
    self.drawn = nil
    self:_open_claims(seat, tile)
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
    end
    return true
  end
  if cmd == "peng" then
    if self.phase ~= "wait_claim" then return false, "非抢牌" end
    local tile = self.lastDiscard.tile
    local from = self.lastDiscard.seat
    if not T.remove_n(self.players[seat].hand, tile, 2) then return false, "不能碰" end
    -- 从出牌者牌河移除
    local d = self.players[from].discards
    if d[#d] == tile then table.remove(d) end
    self.players[seat].melds[#self.players[seat].melds + 1] = {
      kind = "peng", tiles = { tile, tile, tile }, fromSeat = from,
    }
    self.players[seat].hand = T.sort_tiles(self.players[seat].hand)
    self.currentSeat = seat
    self.phase = "wait_discard"
    self.claimSeats = {}
    self.message = string.format("座位%d 碰", seat)
    return true
  end
  if cmd == "chi" then
    if self.phase ~= "wait_claim" then return false, "非抢牌" end
    local tiles = body.tiles
    if type(tiles) ~= "table" or #tiles < 3 then return false, "缺吃牌" end
    local discard = self.lastDiscard.tile
    local from = self.lastDiscard.seat
    local upper = (from + 1) % self.cfg.playerCount
    if seat ~= upper then return false, "只能上家吃" end
    T.remove_one(self.players[seat].hand, tiles[1])
    T.remove_one(self.players[seat].hand, tiles[2])
    local d = self.players[from].discards
    if d[#d] == discard then table.remove(d) end
    self.players[seat].melds[#self.players[seat].melds + 1] = {
      kind = "chi", tiles = { tiles[1], tiles[2], discard }, fromSeat = from,
    }
    self.players[seat].hand = T.sort_tiles(self.players[seat].hand)
    self.currentSeat = seat
    self.phase = "wait_discard"
    self.claimSeats = {}
    self.message = string.format("座位%d 吃", seat)
    return true
  end
  if cmd == "ming_gang" then
    if self.phase ~= "wait_claim" then return false, "非抢牌" end
    local tile = self.lastDiscard.tile
    local from = self.lastDiscard.seat
    if not T.remove_n(self.players[seat].hand, tile, 3) then return false, "不能杠" end
    local d = self.players[from].discards
    if d[#d] == tile then table.remove(d) end
    self.players[seat].melds[#self.players[seat].melds + 1] = {
      kind = "ming_gang", tiles = { tile, tile, tile, tile }, fromSeat = from,
    }
    self:_draw(seat)
    self.currentSeat = seat
    self.phase = "wait_discard"
    self.claimSeats = {}
    self.message = string.format("座位%d 明杠", seat)
    return true
  end
  if cmd == "an_gang" then
    if self.phase ~= "wait_discard" or seat ~= self.currentSeat then return false, "不能暗杠" end
    local tile = body.tile
    if not T.remove_n(self.players[seat].hand, tile, 4) then return false, "不能暗杠" end
    self.players[seat].melds[#self.players[seat].melds + 1] = {
      kind = "an_gang", tiles = { tile, tile, tile, tile },
    }
    self:_draw(seat)
    self.message = string.format("座位%d 暗杠", seat)
    return true
  end
  if cmd == "bu_gang" then
    if self.phase ~= "wait_discard" or seat ~= self.currentSeat then return false, "不能补杠" end
    local tile = body.tile
    if not T.remove_one(self.players[seat].hand, tile) then return false, "无牌" end
    local found = false
    for _, m in ipairs(self.players[seat].melds) do
      if m.kind == "peng" and m.tiles[1] == tile then
        m.kind = "bu_gang"
        m.tiles = { tile, tile, tile, tile }
        found = true
        break
      end
    end
    if not found then
      self.players[seat].hand[#self.players[seat].hand + 1] = tile
      return false, "无碰可补"
    end
    self:_draw(seat)
    self.message = string.format("座位%d 补杠", seat)
    return true
  end
  if cmd == "hu" then
    if self.phase ~= "wait_claim" then return false, "非抢牌" end
    if not self.lastDiscard then return false, "无牌可胡" end
    local tile = self.lastDiscard.tile
    local from = self.lastDiscard.seat
    local try = {}
    for _, t in ipairs(self.players[seat].hand) do try[#try + 1] = t end
    try[#try + 1] = tile
    if not (T.can_hu(try) or T.can_jiang_jiang_hu(try)) then
      return false, "未胡牌"
    end
    self.players[seat].hand[#self.players[seat].hand + 1] = tile
    local d = self.players[from].discards
    if d[#d] == tile then table.remove(d) end
    self:_do_hu(seat, false, from)
    return true
  end
  if cmd == "zimo" then
    if self.phase ~= "wait_discard" or seat ~= self.currentSeat then return false, "不能自摸" end
    if not (T.can_hu(self.players[seat].hand) or T.can_jiang_jiang_hu(self.players[seat].hand)) then
      return false, "未胡牌"
    end
    self:_do_hu(seat, true, nil)
    return true
  end
  return false, "未知操作 " .. tostring(cmd)
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
    }
    if for_seat == s then
      sp.hand = copy_arr(p.hand)
    end
    seats[#seats + 1] = sp
  end
  local qishouOut = nil
  if self.qishou then
    qishouOut = self.qishou.hits
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
    settle = self.settle,
    qishou = qishouOut,
    zhongtu = self.zhongtu,
    drawn = (for_seat == self.currentSeat) and self.drawn or nil,
  }
end

function Engine:needs_bot_tick()
  if self.phase == "settle" or self.phase == "finished" or self.phase == "waiting" then
    return false
  end
  if self.phase == "qishou" then
    -- 若庄是机器人，自动 continue；否则也自动 continue 加快演示
    return true
  end
  if self.phase == "wait_discard" then
    return self.players[self.currentSeat].isBot
  end
  if self.phase == "wait_claim" then
    for _, s in ipairs(self.claimSeats) do
      if self.players[s].isBot then return true end
    end
  end
  return false
end

function Engine:bot_tick(seat)
  if not self.players[seat] or not self.players[seat].isBot then return false end
  if self.phase == "qishou" then
    self:on_action(seat, "continue", {})
    return true
  end
  if self.phase == "wait_discard" and seat == self.currentSeat then
    local ops = self:_ops_discard(seat)
    for _, op in ipairs(ops) do
      if op.action == "zimo" then
        self:on_action(seat, "zimo", {})
        return true
      end
    end
    for _, op in ipairs(ops) do
      if op.action == "an_gang" then
        self:on_action(seat, "an_gang", { tile = op.tile })
        return true
      end
    end
    local hand = self.players[seat].hand
    local tile = hand[#hand]
    self:on_action(seat, "discard", { tile = tile })
    return true
  end
  if self.phase == "wait_claim" then
    local in_claim = false
    for _, s in ipairs(self.claimSeats) do
      if s == seat then in_claim = true break end
    end
    if not in_claim then return false end
    local ops = self:_ops_claim(seat)
    for _, op in ipairs(ops) do
      if op.action == "hu" then
        self:on_action(seat, "hu", {})
        return true
      end
    end
    for _, op in ipairs(ops) do
      if op.action == "peng" then
        self:on_action(seat, "peng", {})
        return true
      end
    end
    self:on_action(seat, "guo", {})
    return true
  end
  return false
end

local M = {}

function M.register(reg)
  reg.register("changsha_mj", function(opts)
    return Engine.new(opts)
  end)
end

return M
