-- 长沙起手胡检测（发完牌、庄家出牌前）
local T = require "game.changsha_mj.tiles"

local M = {}

local function counts(hand)
  return T.counts(hand)
end

local function has_kezi(c, t)
  return (c[t] or 0) >= 3
end

--- 板板胡：没有 2/5/8 将牌
function M.banban(hand)
  for _, t in ipairs(hand) do
    if T.is_jiang_tile(t) then return false end
  end
  return #hand >= 13
end

--- 缺一色：只有两种花色（或缺更多也算缺）
function M.queyise(hand)
  local suits = {}
  for _, t in ipairs(hand) do
    suits[math.floor(t / 9)] = true
  end
  local n = 0
  for _ in pairs(suits) do n = n + 1 end
  return n <= 2
end

--- 六六顺：有两副以上刻子（三张相同）
function M.liuliu(hand)
  local c = counts(hand)
  local n = 0
  for t = 0, 26 do
    if (c[t] or 0) >= 3 then n = n + 1 end
  end
  return n >= 2
end

--- 步步高：同花色有三个连续的对子，如 223344
function M.bubugao(hand)
  local c = counts(hand)
  for suit = 0, 2 do
    local base = suit * 9
    for r = 0, 6 do
      local a, b, d = base + r, base + r + 1, base + r + 2
      if (c[a] or 0) >= 2 and (c[b] or 0) >= 2 and (c[d] or 0) >= 2 then
        return true
      end
    end
  end
  return false
end

--- 金童玉女：有一对二筒 + 一对二条
function M.jintong(hand)
  local c = counts(hand)
  -- 2筒 = 18+1=19, 2条=9+1=10
  return (c[19] or 0) >= 2 and (c[10] or 0) >= 2
end

--- 三同：万条筒各有一对相同点数，如 2万2条2筒
function M.santong(hand)
  local c = counts(hand)
  for r = 0, 8 do
    if (c[r] or 0) >= 2 and (c[9 + r] or 0) >= 2 and (c[18 + r] or 0) >= 2 then
      return true
    end
  end
  return false
end

--- 一枝花：有一枝花（通常：五筒或五万一张且为将？地方差异大）
--- 采用常见：手牌含「一枝花」标记牌——五筒恰好 1 张且全手无其他五筒相关简化：
--- 简化规则：有且仅有一张 5 筒（tile 22），或有且仅有一张 5 万（tile 4）作为「花」
function M.yizhihua(hand)
  local c = counts(hand)
  local five_wan, five_tong = c[4] or 0, c[22] or 0
  return (five_wan == 1 and five_tong == 0) or (five_tong == 1 and five_wan == 0)
end

--- 将将胡：全是 2/5/8 且能组成胡牌型（14 张起手时按 13+摸？起手 13/14）
--- 起手庄家 14 张可直接判；闲家 13 张：全是将牌也算起手将将胡（常见地方玩法）
function M.jiangjiang(hand)
  for _, t in ipairs(hand) do
    if not T.is_jiang_tile(t) then return false end
  end
  if #hand % 3 == 2 then
    return T.can_hu(hand)
  end
  return #hand >= 13
end

--- 四喜：有四张相同（起手）
function M.sixi(hand)
  local c = counts(hand)
  for t = 0, 26 do
    if (c[t] or 0) >= 4 then return true, t end
  end
  return false
end

local CHECKS = {
  { id = "banban", name = "板板胡", fn = M.banban, fan = 2 },
  { id = "queyise", name = "缺一色", fn = M.queyise, fan = 2 },
  { id = "liuliu", name = "六六顺", fn = M.liuliu, fan = 2 },
  { id = "bubugao", name = "步步高", fn = M.bubugao, fan = 2 },
  { id = "jintong", name = "金童玉女", fn = M.jintong, fan = 2 },
  { id = "santong", name = "三同", fn = M.santong, fan = 2 },
  { id = "yizhihua", name = "一枝花", fn = M.yizhihua, fan = 2 },
  { id = "jiangjiang", name = "将将胡", fn = M.jiangjiang, fan = 2 },
  { id = "sixi", name = "大四喜", fn = function(h)
      local ok = M.sixi(h)
      return ok
    end, fan = 2 },
}

function M.detect(hand)
  local hits = {}
  for _, ch in ipairs(CHECKS) do
    if ch.fn(hand) then
      hits[#hits + 1] = { id = ch.id, name = ch.name, fan = ch.fan }
    end
  end
  return hits
end

--- 中途四喜：摸牌后手牌+副露中某牌达 4 张（未杠）
function M.zhongtu_sixi(hand)
  local c = counts(hand)
  for t = 0, 26 do
    if (c[t] or 0) >= 4 then return true, t end
  end
  return false
end

--- 中途六六顺：摸后出现两副刻
function M.zhongtu_liuliu(hand)
  return M.liuliu(hand)
end

return M
