-- Weihai mahjong tile helpers. Values: 1-9 wan, 11-19 tiao, 21-29 tong, 31-37 feng/jian

local M = {}

function M.build_wall()
  local tiles = {}
  local function add(v, n)
    for _ = 1, n do tiles[#tiles + 1] = v end
  end
  for i = 1, 9 do add(i, 4) end
  for i = 11, 19 do add(i, 4) end
  for i = 21, 29 do add(i, 4) end
  for i = 31, 37 do add(i, 4) end
  -- shuffle
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

local function can_meld(c)
  -- recursive check for sets/sequences after removing one pair
  local keys = {}
  for k, v in pairs(c) do
    if v > 0 then keys[#keys + 1] = k end
  end
  table.sort(keys)
  if #keys == 0 then return true end
  local t = keys[1]
  local n = c[t]
  -- pung
  if n >= 3 then
    c[t] = n - 3
    if can_meld(c) then return true end
    c[t] = n
  end
  -- chow (only suits)
  if t < 30 then
    local a, b = t + 1, t + 2
    -- block across 9/10/20
    if (t % 10) <= 7 and (c[a] or 0) > 0 and (c[b] or 0) > 0 then
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

return M
