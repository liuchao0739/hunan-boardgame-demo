-- 长沙麻将牌：0-8万 9-17条 18-26筒，各4张 = 108
local M = {}

function M.tile_name(t)
  if type(t) ~= "number" or t < 0 or t > 26 then return "?" .. tostring(t) end
  local suit = ({ "万", "条", "筒" })[math.floor(t / 9) + 1]
  return string.format("%d%s", (t % 9) + 1, suit)
end

function M.build_deck()
  local d = {}
  for t = 0, 26 do
    for _ = 1, 4 do d[#d + 1] = t end
  end
  return d
end

function M.shuffle(arr)
  local a = {}
  for i, v in ipairs(arr) do a[i] = v end
  for i = #a, 2, -1 do
    local j = math.random(i)
    a[i], a[j] = a[j], a[i]
  end
  return a
end

function M.sort_tiles(tiles)
  local a = {}
  for i, v in ipairs(tiles) do a[i] = v end
  table.sort(a)
  return a
end

function M.counts(tiles)
  local c = {}
  for i = 0, 26 do c[i] = 0 end
  for _, t in ipairs(tiles) do
    c[t] = (c[t] or 0) + 1
  end
  return c
end

local function can_meld_all(c)
  local i = 0
  while i <= 26 and (c[i] or 0) == 0 do i = i + 1 end
  if i > 26 then return true end
  local n = c[i]
  if n >= 3 then
    c[i] = n - 3
    if can_meld_all(c) then c[i] = n; return true end
    c[i] = n
  end
  local rank = i % 9
  if rank <= 6 and n > 0 and (c[i + 1] or 0) > 0 and (c[i + 2] or 0) > 0 then
    c[i] = n - 1
    c[i + 1] = c[i + 1] - 1
    c[i + 2] = c[i + 2] - 1
    if can_meld_all(c) then
      c[i] = n
      c[i + 1] = c[i + 1] + 1
      c[i + 2] = c[i + 2] + 1
      return true
    end
    c[i] = n
    c[i + 1] = c[i + 1] + 1
    c[i + 2] = c[i + 2] + 1
  end
  return false
end

--- 标准 3N+2 胡（无癞子）
function M.can_hu(tiles)
  if #tiles % 3 ~= 2 then return false end
  local c = M.counts(tiles)
  for eye = 0, 26 do
    if (c[eye] or 0) >= 2 then
      c[eye] = c[eye] - 2
      if can_meld_all(c) then
        c[eye] = c[eye] + 2
        return true
      end
      c[eye] = c[eye] + 2
    end
  end
  return false
end

--- 将将胡：全是 2/5/8
function M.is_jiang_tile(t)
  local r = (t % 9) + 1
  return r == 2 or r == 5 or r == 8
end

function M.can_jiang_jiang_hu(tiles)
  if #tiles % 3 ~= 2 then return false end
  for _, t in ipairs(tiles) do
    if not M.is_jiang_tile(t) then return false end
  end
  return M.can_hu(tiles)
end

--- 吃：仅上家；返回可选组合 {{t1,t2,discard}, ...} 手牌里要拿的两张
function M.chi_options(hand, discard)
  local opts = {}
  local c = M.counts(hand)
  local suit = math.floor(discard / 9)
  local rank = discard % 9 -- 0-8
  local base = suit * 9
  local patterns = {
    { rank - 2, rank - 1 },
    { rank - 1, rank + 1 },
    { rank + 1, rank + 2 },
  }
  for _, p in ipairs(patterns) do
    local a, b = p[1], p[2]
    if a >= 0 and b <= 8 then
      local t1, t2 = base + a, base + b
      if (c[t1] or 0) > 0 and (c[t2] or 0) > 0 then
        opts[#opts + 1] = { t1, t2, discard }
      end
    end
  end
  return opts
end

function M.remove_one(hand, tile)
  for i, t in ipairs(hand) do
    if t == tile then
      table.remove(hand, i)
      return true
    end
  end
  return false
end

function M.remove_n(hand, tile, n)
  for _ = 1, n do
    if not M.remove_one(hand, tile) then return false end
  end
  return true
end

return M
