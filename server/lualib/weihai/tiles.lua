-- Weihai mahjong tiles — values aligned with Java/Cocos MahjongTileDef
-- 万 21-29, 条 41-49, 饼 81-89, 风 101/103/105/107, 箭 126/188/255

local M = {}

local WAN = { 21,22,23,24,25,26,27,28,29 }
local TIAO = { 41,42,43,44,45,46,47,48,49 }
local BING = { 81,82,83,84,85,86,87,88,89 }
local FENG = { 101,103,105,107 }
local JIAN = { 126,188,255 }

function M.build_wall()
  local tiles = {}
  local function add(v, n)
    for _ = 1, n do tiles[#tiles + 1] = v end
  end
  for _, v in ipairs(WAN) do add(v, 4) end
  for _, v in ipairs(TIAO) do add(v, 4) end
  for _, v in ipairs(BING) do add(v, 4) end
  for _, v in ipairs(FENG) do add(v, 4) end
  for _, v in ipairs(JIAN) do add(v, 4) end
  for i = #tiles, 2, -1 do
    local j = math.random(i)
    tiles[i], tiles[j] = tiles[j], tiles[i]
  end
  return tiles
end

local function counts(hand)
  local c = {}
  for _, t in ipairs(hand) do
    c[t] = (c[t] or 0) + 1
  end
  return c
end

local function is_suit_tile(t)
  return (t >= 21 and t <= 29) or (t >= 41 and t <= 49) or (t >= 81 and t <= 89)
end

local function can_chow_at(t)
  -- t is first of sequence t,t+1,t+2 within same suit
  if t >= 21 and t <= 27 then return true end
  if t >= 41 and t <= 47 then return true end
  if t >= 81 and t <= 87 then return true end
  return false
end

local function can_meld(c)
  local keys = {}
  for k, v in pairs(c) do
    if v > 0 then keys[#keys + 1] = k end
  end
  table.sort(keys)
  if #keys == 0 then return true end
  local t = keys[1]
  local n = c[t]
  if n >= 3 then
    c[t] = n - 3
    if can_meld(c) then return true end
    c[t] = n
  end
  if is_suit_tile(t) and can_chow_at(t) then
    local a, b = t + 1, t + 2
    if (c[a] or 0) > 0 and (c[b] or 0) > 0 then
      c[t] = n - 1
      c[a] = c[a] - 1
      c[b] = c[b] - 1
      if can_meld(c) then return true end
      c[t] = n
      c[a] = c[a] + 1
      c[b] = c[b] + 1
    end
  end
  return false
end

function M.can_hu(hand)
  local c = counts(hand)
  local keys = {}
  for k, _ in pairs(c) do keys[#keys + 1] = k end
  for _, t in ipairs(keys) do
    if c[t] >= 2 then
      c[t] = c[t] - 2
      if can_meld(c) then return true end
      c[t] = c[t] + 2
    end
  end
  return false
end

function M.can_peng(hand, tile)
  local n = 0
  for _, t in ipairs(hand) do if t == tile then n = n + 1 end end
  return n >= 2
end

function M.can_ming_gang(hand, tile)
  local n = 0
  for _, t in ipairs(hand) do if t == tile then n = n + 1 end end
  return n >= 3
end

function M.remove_tile(hand, tile, n)
  n = n or 1
  local out = {}
  for _, t in ipairs(hand) do
    if t == tile and n > 0 then
      n = n - 1
    else
      out[#out + 1] = t
    end
  end
  return out
end

function M.sort_hand(hand)
  table.sort(hand)
  return hand
end

function M.is_feng_jian(t)
  return (t == 101 or t == 103 or t == 105 or t == 107
    or t == 126 or t == 188 or t == 255)
end

return M
