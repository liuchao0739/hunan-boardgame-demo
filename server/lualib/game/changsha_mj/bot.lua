-- 长沙麻将机器人决策：weak / medium / strong
local T = require "game.changsha_mj.tiles"

local M = {}

local LEVEL = {
  weak = 1, medium = 2, strong = 3,
  ["弱"] = 1, ["中"] = 2, ["强"] = 3,
}

function M.normalize_level(v)
  if type(v) == "number" then
    if v <= 1 then return "weak" end
    if v >= 3 then return "strong" end
    return "medium"
  end
  if type(v) == "string" then
    local key = v:lower()
    local n = LEVEL[key] or LEVEL[v]
    if n == 1 then return "weak" end
    if n == 3 then return "strong" end
    if n == 2 then return "medium" end
  end
  return "medium"
end

function M.level_rank(level)
  return LEVEL[M.normalize_level(level)] or 2
end

local function copy_counts(c)
  local n = {}
  for i = 0, 26 do n[i] = c[i] or 0 end
  return n
end

--- 13 张标准形向听（0=听牌）。带简单剪枝，够机器人用。
local function shanten13_counts(c0)
  local best = 8

  local function rec(c, i, melds, taatsu, pair)
    if melds > 4 then return end
    if 7 - melds * 2 - math.min(taatsu, 4 - melds) - (pair and 1 or 0) >= best then
      return
    end
    while i <= 26 and (c[i] or 0) == 0 do i = i + 1 end
    if i > 26 then
      local s = 8 - melds * 2 - math.min(taatsu, 4 - melds)
      if pair then s = s - 1 end
      if s < 0 then s = 0 end
      if s < best then best = s end
      return
    end
    local n = c[i]

    -- 刻
    if n >= 3 then
      c[i] = n - 3
      rec(c, i, melds + 1, taatsu, pair)
      c[i] = n
    end
    -- 顺
    local rank = i % 9
    if rank <= 6 and n > 0 and (c[i + 1] or 0) > 0 and (c[i + 2] or 0) > 0 then
      c[i] = n - 1
      c[i + 1] = c[i + 1] - 1
      c[i + 2] = c[i + 2] - 1
      rec(c, i, melds + 1, taatsu, pair)
      c[i] = n
      c[i + 1] = c[i + 1] + 1
      c[i + 2] = c[i + 2] + 1
    end
    -- 将
    if not pair and n >= 2 then
      c[i] = n - 2
      rec(c, i + 1, melds, taatsu, true)
      c[i] = n
    end
    -- 对子搭子
    if n >= 2 then
      c[i] = n - 2
      rec(c, i + 1, melds, taatsu + 1, pair)
      c[i] = n
    end
    -- 两面/嵌张搭子
    if rank <= 7 and n > 0 and (c[i + 1] or 0) > 0 then
      c[i] = n - 1
      c[i + 1] = c[i + 1] - 1
      rec(c, i + 1, melds, taatsu + 1, pair)
      c[i] = n
      c[i + 1] = c[i + 1] + 1
    end
    if rank <= 6 and n > 0 and (c[i + 2] or 0) > 0 then
      c[i] = n - 1
      c[i + 2] = c[i + 2] - 1
      rec(c, i + 1, melds, taatsu + 1, pair)
      c[i] = n
      c[i + 2] = c[i + 2] + 1
    end
    -- 浮牌：整组跳过本索引剩余
    c[i] = 0
    rec(c, i + 1, melds, taatsu, pair)
    c[i] = n
  end

  rec(copy_counts(c0), 0, 0, 0, false)
  return best
end

function M.shanten(hand)
  if #hand == 14 then
    local best = 8
    local seen = {}
    for _, t in ipairs(hand) do
      if not seen[t] then
        seen[t] = true
        local h = {}
        local removed = false
        for _, x in ipairs(hand) do
          if not removed and x == t then
            removed = true
          else
            h[#h + 1] = x
          end
        end
        local s = shanten13_counts(T.counts(h))
        if s < best then best = s end
      end
    end
    return best
  end
  return shanten13_counts(T.counts(hand))
end

local function isolation(tile, c)
  local n = c[tile] or 0
  local rank = tile % 9
  local left = (rank > 0) and (c[tile - 1] or 0) or 0
  local right = (rank < 8) and (c[tile + 1] or 0) or 0
  local score = 0
  if n <= 1 then score = score + 40 else score = score - n * 25 end
  if left == 0 and right == 0 then score = score + 30 end
  if left + right == 1 then score = score + 8 end
  if left > 0 and right > 0 then score = score - 20 end
  if rank == 0 or rank == 8 then score = score + 6 end
  return score
end

local function danger(tile, ctx)
  local visible = 0
  for _, p in pairs(ctx.players or {}) do
    for _, d in ipairs(p.discards or {}) do
      if d == tile then visible = visible + 1 end
    end
    for _, m in ipairs(p.melds or {}) do
      for _, mt in ipairs(m.tiles or {}) do
        if mt == tile then visible = visible + 1 end
      end
    end
  end
  for _, t in ipairs(ctx.hand or {}) do
    if t == tile then visible = visible + 1 end
  end
  local remain = 4 - visible
  if remain <= 0 then return -20 end
  local rank = tile % 9
  local d = 0
  if rank >= 2 and rank <= 6 then d = d + 18
  elseif rank == 1 or rank == 7 then d = d + 10
  else d = d + 4 end
  d = d - visible * 8 + remain * 5
  return d
end

function M.choose_discard(hand, level, ctx)
  level = M.normalize_level(level)
  ctx = ctx or {}
  if #hand == 0 then return nil end
  if level == "weak" then
    return hand[#hand]
  end

  local use_defense = M.level_rank(level) >= 3
  local best_tile = hand[#hand]
  local best_score = 1e9
  local seen = {}

  for _, tile in ipairs(hand) do
    if not seen[tile] then
      seen[tile] = true
      local h = {}
      local removed = false
      for _, x in ipairs(hand) do
        if not removed and x == tile then
          removed = true
        else
          h[#h + 1] = x
        end
      end
      local s = shanten13_counts(T.counts(h))
      local iso = isolation(tile, T.counts(hand))
      local score = s * 1000 - iso * 10
      if use_defense then
        score = score + danger(tile, { players = ctx.players, hand = hand }) * 12
      end
      if score < best_score then
        best_score = score
        best_tile = tile
      end
    end
  end
  return best_tile
end

local function chi_after_shanten(hand, t1, t2)
  local h = {}
  local r1, r2 = false, false
  for _, x in ipairs(hand) do
    if not r1 and x == t1 then
      r1 = true
    elseif not r2 and x == t2 then
      r2 = true
    else
      h[#h + 1] = x
    end
  end
  return shanten13_counts(T.counts(h))
end

function M.choose_claim(ops, hand, level)
  level = M.normalize_level(level)
  local rank = M.level_rank(level)

  local function find(action)
    for _, op in ipairs(ops) do
      if op.action == action then return op end
    end
  end

  if find("hu") then return "hu", {} end
  if find("ming_gang") and rank >= 2 then
    return "ming_gang", {}
  end
  if find("peng") then
    return "peng", {}
  end

  if rank >= 2 then
    local before = M.shanten(hand)
    local best_chi, best_after = nil, 99
    for _, op in ipairs(ops) do
      if op.action == "chi" and op.tiles and #op.tiles >= 2 then
        local after = chi_after_shanten(hand, op.tiles[1], op.tiles[2])
        -- 吃后少 2 张但多 1 面子，向听通常下降；允许持平也吃
        if after <= before and after < best_after then
          best_after = after
          best_chi = op
        end
      end
    end
    if best_chi then
      return "chi", { tiles = { best_chi.tiles[1], best_chi.tiles[2] } }
    end
  end

  return "guo", {}
end

return M
