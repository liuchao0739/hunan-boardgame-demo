--[[
  扑克牌型解析（斗地主 / 跑得快共用）
  rank: 0=3 … 12=2, 13=小王, 14=大王
]]
local M = {}

function M.card_rank(id)
  if id == 52 then return 13 end
  if id == 53 then return 14 end
  return id % 13
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

local function ranks_with_count(c, n, max_r)
  max_r = max_r or 12
  local list = {}
  for r = 0, max_r do
    if c[r] == n then list[#list + 1] = r end
  end
  return list
end

local function is_consec(list)
  if #list == 0 then return false end
  table.sort(list)
  for i = 2, #list do
    if list[i] ~= list[i - 1] + 1 then return false end
  end
  return true
end

--- 解析牌型；allow_joker=false 时拒绝王（跑得快）
function M.parse_pattern(cards, opts)
  opts = opts or {}
  local allow_joker = opts.allow_joker ~= false
  local n = #cards
  if n == 0 then return nil end
  local sorted = {}
  for _, x in ipairs(cards) do sorted[#sorted + 1] = x end
  M.sort_cards(sorted)
  local c = counts_by_rank(sorted)

  if not allow_joker and (c[13] > 0 or c[14] > 0) then return nil end

  -- 王炸
  if allow_joker and n == 2 and c[13] == 1 and c[14] == 1 then
    return { kind = "rocket", rank = 14, len = 2, power = 2000 }
  end

  -- 炸弹
  for r = 0, 12 do
    if c[r] == 4 and n == 4 then
      return { kind = "bomb", rank = r, len = 4, power = 1000 + r }
    end
  end

  -- 四带二单 / 四带二对
  for r = 0, 12 do
    if c[r] == 4 then
      if n == 6 then
        local singles = 0
        for i = 0, 14 do if i ~= r then singles = singles + c[i] end end
        if singles == 2 then
          return { kind = "four2", rank = r, len = 6, power = r }
        end
      end
      if n == 8 then
        local pairs = ranks_with_count(c, 2, 14)
        -- 去掉四张本身
        local ok_pairs = 0
        for _, pr in ipairs(pairs) do if pr ~= r then ok_pairs = ok_pairs + 1 end end
        if ok_pairs == 2 then
          return { kind = "four22", rank = r, len = 8, power = r }
        end
      end
    end
  end

  if n == 1 then
    return { kind = "single", rank = M.card_rank(sorted[1]), len = 1, power = M.card_rank(sorted[1]) }
  end
  if n == 2 then
    local r1, r2 = M.card_rank(sorted[1]), M.card_rank(sorted[2])
    if r1 == r2 and r1 <= 12 then return { kind = "pair", rank = r1, len = 2, power = r1 } end
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

  -- 顺子 ≥5 不含 2/王
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
        if ranks[i] ~= ranks[i - 1] + 1 then straight = false; break end
      end
      if straight then
        return { kind = "straight", rank = ranks[1], len = n, power = ranks[1] + n * 0.01 }
      end
    end
  end

  -- 连对 ≥3 对，不含 2/王
  if n >= 6 and n % 2 == 0 then
    local pairs = ranks_with_count(c, 2, 11)
    local leftover = false
    for r = 0, 14 do
      if c[r] ~= 0 and c[r] ~= 2 then leftover = true end
      if r >= 12 and c[r] > 0 then leftover = true end
    end
    if not leftover and #pairs == n / 2 and #pairs >= 3 and is_consec(pairs) then
      return { kind = "pair_seq", rank = pairs[1], len = n, power = pairs[1] + #pairs * 0.01 }
    end
  end

  -- 飞机：连续三张 ≥2，可带同数量单或对
  do
    local triples = ranks_with_count(c, 3, 11) -- 不含 2
    if #triples >= 2 and is_consec(triples) then
      local k = #triples
      local body = k * 3
      if n == body then
        return { kind = "plane", rank = triples[1], len = n, power = triples[1] + k * 0.01 }
      end
      if n == body + k then
        return { kind = "plane1", rank = triples[1], len = n, power = triples[1] + k * 0.01 }
      end
      if n == body + k * 2 then
        local pair_cnt = 0
        for r = 0, 14 do
          if c[r] == 2 then pair_cnt = pair_cnt + 1
          elseif c[r] == 4 then pair_cnt = pair_cnt + 2
          elseif c[r] == 1 or c[r] == 3 then
            -- 允许拆？严格：翅膀必须是对
          end
        end
        -- 简化：总张数对即可
        return { kind = "plane2", rank = triples[1], len = n, power = triples[1] + k * 0.01 }
      end
    end
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

return M
