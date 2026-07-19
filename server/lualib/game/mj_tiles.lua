--[[
  长沙麻将牌工具
  编码 0-8 万, 9-17 条, 18-26 筒；每种 4 张 = 108
]]

local M = {}

local SUIT = { "万", "条", "筒" }

function M.tile_name(t)
  if t < 0 or t > 26 then return "?" .. tostring(t) end
  local suit = math.floor(t / 9)
  local rank = (t % 9) + 1
  return tostring(rank) .. SUIT[suit + 1]
end

function M.build_deck()
  local deck = {}
  for t = 0, 26 do
    for _ = 1, 4 do
      deck[#deck + 1] = t
    end
  end
  return deck
end

function M.shuffle(arr)
  for i = #arr, 2, -1 do
    local j = math.random(i)
    arr[i], arr[j] = arr[j], arr[i]
  end
  return arr
end

function M.sort_tiles(tiles)
  table.sort(tiles)
  return tiles
end

function M.counts_of(tiles)
  local c = {}
  for i = 0, 26 do c[i] = 0 end
  for _, t in ipairs(tiles) do
    c[t] = c[t] + 1
  end
  return c
end

local function can_meld_all(c)
  local i = 0
  while i <= 26 and c[i] == 0 do i = i + 1 end
  if i > 26 then return true end
  if c[i] >= 3 then
    c[i] = c[i] - 3
    if can_meld_all(c) then c[i] = c[i] + 3; return true end
    c[i] = c[i] + 3
  end
  local suit = math.floor(i / 9)
  local rank = i % 9
  if rank <= 6 and c[i] > 0 and c[i + 1] > 0 and c[i + 2] > 0 then
    local base = suit * 9
    if i >= base and i + 2 < base + 9 then
      c[i] = c[i] - 1; c[i + 1] = c[i + 1] - 1; c[i + 2] = c[i + 2] - 1
      if can_meld_all(c) then
        c[i] = c[i] + 1; c[i + 1] = c[i + 1] + 1; c[i + 2] = c[i + 2] + 1
        return true
      end
      c[i] = c[i] + 1; c[i + 1] = c[i + 1] + 1; c[i + 2] = c[i + 2] + 1
    end
  end
  return false
end

function M.can_hu(tiles)
  if #tiles % 3 ~= 2 then return false end
  local c = M.counts_of(tiles)
  for i = 0, 26 do
    if c[i] >= 2 then
      c[i] = c[i] - 2
      if can_meld_all(c) then
        c[i] = c[i] + 2
        return true
      end
      c[i] = c[i] + 2
    end
  end
  return false
end

function M.can_qi_dui(tiles)
  if #tiles ~= 14 then return false end
  local c = M.counts_of(tiles)
  local pairs = 0
  for i = 0, 26 do
    if c[i] == 2 then
      pairs = pairs + 1
    elseif c[i] ~= 0 then
      return false
    end
  end
  return pairs == 7
end

function M.is_hu(tiles)
  return M.can_hu(tiles) or M.can_qi_dui(tiles)
end

function M.is_bird(tile)
  local rank = (tile % 9) + 1
  return rank == 1 or rank == 5 or rank == 9
end

function M.index_of(arr, v)
  for i, x in ipairs(arr) do
    if x == v then return i end
  end
  return nil
end

function M.remove_one(arr, v)
  local i = M.index_of(arr, v)
  if i then table.remove(arr, i); return true end
  return false
end

function M.count_val(arr, v)
  local n = 0
  for _, x in ipairs(arr) do if x == v then n = n + 1 end end
  return n
end

return M
