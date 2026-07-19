--[[ 邵阳跑胡子牌工具：0-9 小写，10-19 大写，各4张=80 ]]
local M = {}
local CN = { "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖", "拾" }

function M.tile_name(t)
  local big = t >= 10
  local rank = (t % 10) + 1
  return (big and "大" or "小") .. CN[rank]
end

function M.build_deck()
  local deck = {}
  for t = 0, 19 do
    for _ = 1, 4 do deck[#deck + 1] = t end
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

function M.index_of(arr, v)
  for i, x in ipairs(arr) do if x == v then return i end end
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

function M.meld_huxi(kind, tile)
  local big = tile >= 10
  if kind == "peng" then return big and 3 or 1 end
  if kind == "wei" then return big and 6 or 3 end
  if kind == "ti" then return big and 12 or 9 end
  if kind == "pao" then return big and 9 or 6 end
  return 0
end

local function counts_of(tiles)
  local c = {}
  for i = 0, 19 do c[i] = 0 end
  for _, t in ipairs(tiles) do c[t] = c[t] + 1 end
  return c
end

local melt_rest

local function try_2710(c, zone)
  local a, b, d = zone * 10 + 1, zone * 10 + 6, zone * 10 + 9
  if c[a] > 0 and c[b] > 0 and c[d] > 0 then
    c[a] = c[a] - 1; c[b] = c[b] - 1; c[d] = c[d] - 1
    if melt_rest(c) then c[a] = c[a] + 1; c[b] = c[b] + 1; c[d] = c[d] + 1; return true end
    c[a] = c[a] + 1; c[b] = c[b] + 1; c[d] = c[d] + 1
  end
  return false
end

melt_rest = function(c)
  local i = 0
  while i <= 19 and c[i] == 0 do i = i + 1 end
  if i > 19 then return true end
  if c[i] >= 3 then
    c[i] = c[i] - 3
    if melt_rest(c) then c[i] = c[i] + 3; return true end
    c[i] = c[i] + 3
  end
  local zone = math.floor(i / 10)
  local rank = i % 10
  if rank <= 7 and c[i] > 0 and c[i + 1] > 0 and c[i + 2] > 0 and math.floor((i + 2) / 10) == zone then
    c[i] = c[i] - 1; c[i + 1] = c[i + 1] - 1; c[i + 2] = c[i + 2] - 1
    if melt_rest(c) then
      c[i] = c[i] + 1; c[i + 1] = c[i + 1] + 1; c[i + 2] = c[i + 2] + 1
      return true
    end
    c[i] = c[i] + 1; c[i + 1] = c[i + 1] + 1; c[i + 2] = c[i + 2] + 1
  end
  if try_2710(c, zone) then return true end
  return false
end

function M.can_hu(hand, meld_hx, min_hx)
  min_hx = min_hx or 15
  if #hand % 3 ~= 2 then return false end
  local c0 = counts_of(hand)
  local hx = meld_hx or 0
  for t = 0, 19 do
    if c0[t] == 3 then hx = hx + M.meld_huxi("wei", t) end
    if c0[t] == 4 then hx = hx + M.meld_huxi("ti", t) end
  end
  if hx < min_hx then return false end
  local c = counts_of(hand)
  for i = 0, 19 do
    if c[i] >= 2 then
      c[i] = c[i] - 2
      if melt_rest(c) then return true end
      c[i] = c[i] + 2
    end
  end
  return false
end

function M.find_chi(hand, tile)
  local zone = math.floor(tile / 10)
  local rank = tile % 10
  local function has(t) return M.index_of(hand, t) ~= nil end
  local cand = {}
  if rank >= 1 and rank <= 7 then cand[#cand + 1] = { tile - 1, tile, tile + 1 } end
  if rank >= 2 then cand[#cand + 1] = { tile - 2, tile - 1, tile } end
  if rank <= 6 then cand[#cand + 1] = { tile, tile + 1, tile + 2 } end
  local set2710 = { zone * 10 + 1, zone * 10 + 6, zone * 10 + 9 }
  for _, x in ipairs(set2710) do
    if x == tile then cand[#cand + 1] = { set2710[1], set2710[2], set2710[3] } end
  end
  local out, seen = {}, {}
  for _, combo in ipairs(cand) do
    local ok = true
    for _, x in ipairs(combo) do
      if x ~= tile and not has(x) then ok = false end
      if math.floor(x / 10) ~= zone then ok = false end
    end
    if ok then
      local sorted = { combo[1], combo[2], combo[3] }
      table.sort(sorted)
      local key = table.concat(sorted, ",")
      if not seen[key] then
        seen[key] = true
        out[#out + 1] = sorted
      end
    end
  end
  return out
end

return M
