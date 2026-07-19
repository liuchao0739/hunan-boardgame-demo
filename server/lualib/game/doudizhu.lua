--[[
  斗地主（简化可玩版）
  牌编码：0-51 普通牌（rank=id%13 → 3..2，suit=id//13），52 小王，53 大王
  流程：发牌 → 叫分 → 地主拿底牌 → 出牌（单/对/三带/顺子/炸弹/王炸）
]]

local M = {}
M.__index = M

local RANK_NAME = { "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", "2" }
local SUIT_NAME = { "♠", "♥", "♣", "♦" }

function M.card_rank(id)
  if id == 52 then return 13 end -- 小王
  if id == 53 then return 14 end -- 大王
  return id % 13 -- 0=3 … 12=2
end

function M.card_name(id)
  if id == 52 then return "小王" end
  if id == 53 then return "大王" end
  local suit = math.floor(id / 13) + 1
  local rank = (id % 13) + 1
  return SUIT_NAME[suit] .. RANK_NAME[rank]
end

function M.build_deck()
  local d = {}
  for i = 0, 53 do d[#d + 1] = i end
  return d
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

local function counts_by_rank(cards)
  local c = {}
  for i = 0, 14 do c[i] = 0 end
  for _, id in ipairs(cards) do
    local r = M.card_rank(id)
    c[r] = c[r] + 1
  end
  return c
end

-- 解析牌型：返回 { kind, rank, len, power } 或 nil
-- kind: single/pair/triple/triple1/triple2/straight/bomb/rocket
function M.parse_pattern(cards)
  local n = #cards
  if n == 0 then return nil end
  local sorted = {}
  for _, x in ipairs(cards) do sorted[#sorted + 1] = x end
  M.sort_cards(sorted)
  local c = counts_by_rank(sorted)

  if n == 2 and c[13] == 1 and c[14] == 1 then
    return { kind = "rocket", rank = 14, len = 2, power = 1000 }
  end

  -- 炸弹
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

  -- 顺子：至少 5 张，不能含 2/王
  if n >= 5 then
    local ranks = {}
    for _, id in ipairs(sorted) do
      local r = M.card_rank(id)
      if r >= 12 then return nil end -- 2 或王
      ranks[#ranks + 1] = r
    end
    table.sort(ranks)
    for i = 2, #ranks do
      if ranks[i] ~= ranks[i - 1] + 1 then return nil end
      if ranks[i] == ranks[i - 1] then return nil end
    end
    return { kind = "straight", rank = ranks[1], len = n, power = ranks[1] + n * 0.01 }
  end

  return nil
end

function M.beats(next_pat, prev_pat)
  if not next_pat then return false end
  if not prev_pat then return true end
  if next_pat.kind == "rocket" then return true end
  if prev_pat.kind == "rocket" then return false end
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
  self.bottom = {}
  self.current_seat = 0
  self.dealer = 0 -- 叫分起始
  self.landlord = nil
  self.round = 0
  self.message = "等待开始"
  self.settle = nil
  self.bid_scores = { [0] = -1, [1] = -1, [2] = -1 } -- -1 未叫
  self.bid_turn = 0
  self.max_bid = 0
  self.max_bid_seat = nil
  self.last_play = nil -- { seat, cards, pattern }
  self.pass_count = 0
  self.claim_seats = {}
  self.pending = {}
  for i = 0, 2 do
    self.players[i] = { hand = {}, melds = {}, discards = {}, score = 0 }
  end
  return self
end

function M:start()
  self.round = self.round + 1
  self.settle = nil
  self.landlord = nil
  self.last_play = nil
  self.pass_count = 0
  self.max_bid = 0
  self.max_bid_seat = nil
  self.bid_scores = { [0] = -1, [1] = -1, [2] = -1 }
  local deck = M.shuffle(M.build_deck())
  for i = 0, 2 do
    self.players[i].hand = {}
    self.players[i].melds = {}
    self.players[i].discards = {}
  end
  for s = 0, 2 do
    for _ = 1, 17 do
      self.players[s].hand[#self.players[s].hand + 1] = table.remove(deck, 1)
    end
    M.sort_cards(self.players[s].hand)
  end
  self.bottom = { table.remove(deck, 1), table.remove(deck, 1), table.remove(deck, 1) }
  self.bid_turn = self.dealer
  self.current_seat = self.bid_turn
  self.phase = "bidding"
  self.message = string.format("第 %d 局叫分，座位 %d 先叫", self.round, self.bid_turn)
end

function M:get_ops(seat)
  local ops = {}
  if self.phase == "bidding" and seat == self.bid_turn then
    ops[#ops + 1] = { action = "bid_0", label = "不叫" }
    for s = 1, 3 do
      if s > self.max_bid then
        ops[#ops + 1] = { action = "bid_" .. s, label = s .. "分", tile = s }
      end
    end
    return ops
  end
  if self.phase == "playing" and seat == self.current_seat then
    ops[#ops + 1] = { action = "play", label = "出牌" }
    if self.last_play and self.last_play.seat ~= seat then
      ops[#ops + 1] = { action = "pass", label = "不出" }
    end
    return ops
  end
  return ops
end

function M:finish_bid()
  if not self.max_bid_seat or self.max_bid == 0 then
    -- 流局重开简：座位 0 当地主 1 分
    self.max_bid_seat = 0
    self.max_bid = 1
  end
  self.landlord = self.max_bid_seat
  for _, c in ipairs(self.bottom) do
    self.players[self.landlord].hand[#self.players[self.landlord].hand + 1] = c
  end
  M.sort_cards(self.players[self.landlord].hand)
  self.current_seat = self.landlord
  self.phase = "playing"
  self.last_play = nil
  self.pass_count = 0
  self.message = string.format("座位 %d 是地主（%d分），先出牌", self.landlord, self.max_bid)
end

function M:apply_bid(seat, score)
  self.bid_scores[seat] = score
  if score > self.max_bid then
    self.max_bid = score
    self.max_bid_seat = seat
  end
  if score == 3 then
    self:finish_bid()
    return
  end
  -- 下一位
  local nexts = (seat + 1) % 3
  local all_done = true
  for i = 0, 2 do
    if self.bid_scores[i] < 0 then all_done = false end
  end
  if all_done or (self.max_bid > 0 and nexts == self.dealer) then
    -- 一圈结束
    self:finish_bid()
    return
  end
  self.bid_turn = nexts
  self.current_seat = nexts
  self.message = string.format("座位 %d 叫分中（当前最高 %d）", nexts, self.max_bid)
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
  local base = 2 * (self.max_bid > 0 and self.max_bid or 1)
  if winner == self.landlord then
    for s = 0, 2 do
      if s ~= winner then
        scores[s + 1] = scores[s + 1] - base
        scores[winner + 1] = scores[winner + 1] + base
      end
    end
  else
    -- 农民赢：地主输双份
    scores[self.landlord + 1] = -base * 2
    for s = 0, 2 do
      if s ~= self.landlord then scores[s + 1] = scores[s + 1] + base end
    end
  end
  for s = 0, 2 do self.players[s].score = self.players[s].score + scores[s + 1] end
  self.settle = {
    winnerSeat = winner,
    reason = winner == self.landlord and "地主胜" or "农民胜",
    scores = scores,
    detail = string.format("%s；倍数叫分 %d", winner == self.landlord and "地主胜" or "农民胜", self.max_bid),
  }
  self.dealer = (self.landlord + 1) % 3
  self.phase = "finished"
  self.message = self.settle.detail
end

function M:apply(seat, action, payload)
  payload = payload or {}
  if self.phase == "bidding" and seat == self.bid_turn then
    local score = 0
    if action == "bid_0" or action == "pass" then score = 0
    elseif action == "bid_1" then score = 1
    elseif action == "bid_2" then score = 2
    elseif action == "bid_3" then score = 3
    elseif action == "bid" and payload.tile then score = payload.tile
    else return "无效叫分" end
    if score > 0 and score <= self.max_bid then return "分数须更高" end
    self:apply_bid(seat, score)
    return nil
  end

  if self.phase == "playing" and seat == self.current_seat then
    if action == "pass" then
      if not self.last_play or self.last_play.seat == seat then
        return "必须出牌"
      end
      self.pass_count = self.pass_count + 1
      if self.pass_count >= 2 then
        -- 新一轮，上家最大继续出
        self.current_seat = self.last_play.seat
        self.last_play = nil
        self.pass_count = 0
        self.message = string.format("座位 %d 继续出牌", self.current_seat)
      else
        self.current_seat = (seat + 1) % 3
        self.message = string.format("座位 %d 不出", seat)
      end
      return nil
    end
    if action == "play" or action == "discard" then
      local cards = payload.tiles or {}
      if #cards == 0 and payload.tile ~= nil then cards = { payload.tile } end
      if #cards == 0 then return "请选择要出的牌" end
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
      if #self.players[seat].hand == 0 then
        self:do_win(seat)
        return nil
      end
      self.current_seat = (seat + 1) % 3
      self.message = string.format("座位 %d 出了 %d 张", seat, #cards)
      return nil
    end
  end
  return "当前不能操作"
end

function M:public_melds(seat)
  -- 地主身份用 melds 标记
  if self.landlord == seat then
    return { { kind = "landlord", tiles = self.bottom or {} } }
  end
  return {}
end

-- 兼容房间广播字段
function M:get_ops_alias(seat)
  return self:get_ops(seat)
end

return M
