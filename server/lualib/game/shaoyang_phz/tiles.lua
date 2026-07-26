-- 邵阳跑胡子牌张：小写 0-9、大写 10-19，各 4 张 = 80
local M = {}

local SMALL = { "一", "二", "三", "四", "五", "六", "七", "八", "九", "十" }
local BIG = { "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖", "拾" }

function M.is_small(t)
  return type(t) == "number" and t >= 0 and t <= 9
end

function M.is_big(t)
  return type(t) == "number" and t >= 10 and t <= 19
end

function M.rank(t)
  if M.is_small(t) then return t end
  if M.is_big(t) then return t - 10 end
  return nil
end

function M.tile_name(t)
  if M.is_small(t) then
    return SMALL[t + 1] or ("?" .. tostring(t))
  end
  if M.is_big(t) then
    return BIG[t - 9] or ("?" .. tostring(t))
  end
  return "?" .. tostring(t)
end

function M.build_deck()
  local d = {}
  for t = 0, 19 do
    for _ = 1, 4 do
      d[#d + 1] = t
    end
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
  for i = 0, 19 do c[i] = 0 end
  for _, t in ipairs(tiles) do
    if type(t) == "number" and t >= 0 and t <= 19 then
      c[t] = (c[t] or 0) + 1
    end
  end
  return c
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
