--[[
  跑得快（湖南常见三人十六张 · 可玩简化版）
  牌：去掉大小王与三张 2（只留 ♠2=id12），共 48 张，每人 16 张。
  首出：持 ♥3（id=13）者先出，且第一手必须带 ♥3。
  牌型：单/对/三张/三带一/三带二/顺子(≥5)/连对(≥3对)/炸弹。
  编码与斗地主相同：0-51（本玩法不含 52/53）。
]]

local M = {}
M.__index = M

local RANK_NAME = { "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", "2" }

function M.card_rank(id)
  return id % 13
end

function M.shuffle(arr)
  for i = #arr, 2, -1 do
    local j = math.random(i)
    arr[i], arr[j] = arr[j], arr[i]
  end
  return arr
end

function M.sort_cards(cards)
  table.sort(cards, function(a, b)
    local ra, rb = M.card_rank(a), M.card_rank(b)
    if ra == rb then return a < b end
    return ra < rb
  end)
  return cards
end

function M.build_deck()
  local d = {}
  for i = 0, 51 do
    -- 去掉 ♥2=25、♣2=38、♦2=51，保留 ♠2=12
    if i ~= 25 and i ~= 38 and i ~= 51 then
      d[#d + 1] = i
    end
  end
  return d
end

local function counts_by_rank(cards)
  local c = {}
  for i = 0, 12 do c[i] = 0 end
  for _, id in ipairs(cards) do
    local r = M.card_rank(id)
    c[r] = c[r] + 1
  end
  return c
end

local function has_card(cards, id)
  for _, x in ipairs(cards) do
    if x == id then return true end
  end
  return false
end

-- kind: single/pair/triple/triple1/triple2/straight/pair_seq/bomb
function M.parse_pattern(cards)
  local n = #cards
  if n == 0 then return nil end
  local sorted = {}
  for _, x in ipairs(cards) do sorted[#sorted + 1] = x end
  M.sort_cards(sorted)
  local c = counts_by_rank(sorted)

  for r = 0, 12 do
    if c[r] == 4 and n == 4 then
      return { kind = "bomb", rank = r, len = 4, power = 100 + r }
    end
  end

  if n == 1 then
    local r = M.card_rank(sorted[1])
    return { kind = "single", rank = r, len = 1, power = r }
  end
  if n == 2 then
    local r1, r2 = M.card_rank(sorted[1]), M.card_rank(sorted[2])
    if r1 == r2 then return { kind = "pair", rank = r1, len = 2, power = r1 } end
  end
  if n == 3 then
    for r = 0, 12 do
      if c[r] == 3 then return { kind = "triple", rank = r, len = 3, power = r } end
    end
  end
  if n == 4 then
    for r = 0, 12 do
      if c[r] == 3 then return { kind = "triple1", rank = r, len = 4, power = r } end
    end
  end
  if n == 5 then
    for r = 0, 12 do
      if c[r] == 3 then return { kind = "triple2", rank = r, len = 5, power = r } end
    end
  end

  -- 顺子 ≥5，不含 2
  if n >= 5 then
    local ranks = {}
    local ok = true
    for _, id in ipairs(sorted) do
      local r = M.card_rank(id)
      if r >= 12 then ok = false; break end
      ranks[#ranks + 1] = r
    end
    if ok then
      table.sort(ranks)
      local straight = true
      for i = 2, #ranks do
        if ranks[i] ~= ranks[i - 1] + 1 or ranks[i] == ranks[i - 1] then
          straight = false
          break
        end
      end
      if straight and #ranks == n then
        return { kind = "straight", rank = ranks[1], len = n, power = ranks[1] + n * 0.01 }
      end
    end
  end

  -- 连对 ≥3 对，不含 2
  if n >= 6 and n % 2 == 0 then
    local pairs = {}
    local ok = true
    for r = 0, 11 do
      if c[r] == 2 then pairs[#pairs + 1] = r
      elseif c[r] ~= 0 then ok = false end
    end
    if c[12] ~= 0 then ok = false end
    if ok and #pairs == n / 2 and #pairs >= 3 then
      table.sort(pairs)
      for i = 2, #pairs do
        if pairs[i] ~= pairs[i - 1] + 1 then ok = false; break end
      end
      if ok then
        return { kind = "pair_seq", rank = pairs[1], len = n, power = pairs[1] + #pairs * 0.01 }
      end
    end
  end

  return nil
end

function M.beats(next_pat, prev_pat)
  if not next_pat then return false end
  if not prev_pat then return true end
  if next_pat.kind == "bomb" and prev_pat.kind ~= "bomb" then return true end
  if next_pat.kind == "bomb" and prev_pat.kind == "bomb" then
    return next_pat.rank > prev_pat.rank
  end
  if next_pat.kind ~= prev_pat.kind then return false end
  if next_pat.len ~= prev_pat.len then return false end
  return next_pat.power > prev_pat.power
end

function M.new()
  local self = setmetatable({}, M)
  self.player_count = 3
  self.phase = "waiting"
  self.players = {}
  self.current_seat = 0
  self.round = 0
  self.message = "等待开始"
  self.settle = nil
  self.last_play = nil
  self.pass_count = 0
  self.first_play = true
  self.heart3 = 13 -- ♥3
  for i = 0, 2 do
    self.players[i] = { hand = {}, melds = {}, discards = {}, score = 0 }
  end
  return self
end

function M:start()
  self.round = self.round + 1
  self.settle = nil
  self.last_play = nil
  self.pass_count = 0
  self.first_play = true
  local deck = M.shuffle(M.build_deck())
  for i = 0, 2 do
    self.players[i].hand = {}
    self.players[i].melds = {}
    self.players[i].discards = {}
  end
  for s = 0, 2 do
    for _ = 1, 16 do
      self.players[s].hand[#self.players[s].hand + 1] = table.remove(deck, 1)
    end
    M.sort_cards(self.players[s].hand)
  end
  local starter = 0
  for s = 0, 2 do
    if has_card(self.players[s].hand, self.heart3) then
      starter = s
      break
    end
  end
  self.current_seat = starter
  self.phase = "playing"
  self.message = string.format("第 %d 局 · 座位 %d 持红桃3先出", self.round, starter)
end

function M:get_ops(seat)
  local ops = {}
  if self.phase == "playing" and seat == self.current_seat then
    ops[#ops + 1] = { action = "play", label = "出牌" }
    if self.last_play and self.last_play.seat ~= seat then
      ops[#ops + 1] = { action = "pass", label = "不要" }
    end
  end
  return ops
end

local function remove_cards(hand, cards)
  for _, c in ipairs(cards) do
    local found = false
    for i, h in ipairs(hand) do
      if h == c then
        table.remove(hand, i)
        found = true
        break
      end
    end
    if not found then return false end
  end
  return true
end

function M:do_win(winner)
  local scores = { 0, 0, 0 }
  local remain = 0
  for s = 0, 2 do
    if s ~= winner then
      local n = #self.players[s].hand
      remain = remain + n
      scores[s + 1] = -n
      scores[winner + 1] = scores[winner + 1] + n
    end
  end
  for s = 0, 2 do self.players[s].score = self.players[s].score + scores[s + 1] end
  self.settle = {
    winnerSeat = winner,
    reason = "跑得快",
    scores = scores,
    detail = string.format("座位 %d 先出完（计剩牌 %d）", winner, remain),
  }
  self.phase = "finished"
  self.message = self.settle.detail
end

function M:apply(seat, action, payload)
  payload = payload or {}
  if self.phase ~= "playing" or seat ~= self.current_seat then
    return "当前不能操作"
  end

  if action == "pass" then
    if not self.last_play or self.last_play.seat == seat then
      return "必须出牌"
    end
    self.pass_count = self.pass_count + 1
    if self.pass_count >= 2 then
      self.current_seat = self.last_play.seat
      self.last_play = nil
      self.pass_count = 0
      self.message = string.format("座位 %d 继续出牌", self.current_seat)
    else
      self.current_seat = (seat + 1) % 3
      self.message = string.format("座位 %d 不要", seat)
    end
    return nil
  end

  if action == "play" or action == "discard" then
    local cards = payload.tiles or {}
    if #cards == 0 and payload.tile ~= nil then cards = { payload.tile } end
    if #cards == 0 then return "请选择要出的牌" end
    if self.first_play and not has_card(cards, self.heart3) then
      return "首出必须带红桃3"
    end
    local pat = M.parse_pattern(cards)
    if not pat then return "不支持的牌型" end
    if self.last_play and not M.beats(pat, self.last_play.pattern) then
      return "压不住上家"
    end
    if not remove_cards(self.players[seat].hand, cards) then
      return "手牌不足"
    end
    for _, c in ipairs(cards) do
      self.players[seat].discards[#self.players[seat].discards + 1] = c
    end
    self.last_play = { seat = seat, cards = cards, pattern = pat }
    self.pass_count = 0
    self.first_play = false
    if #self.players[seat].hand == 0 then
      self:do_win(seat)
      return nil
    end
    self.current_seat = (seat + 1) % 3
    self.message = string.format("座位 %d 出了 %d 张（%s）", seat, #cards, pat.kind)
    return nil
  end

  return "当前不能操作"
end

function M:public_melds(_seat)
  return {}
end

return M
