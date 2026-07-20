--[[ 记牌器：按点数统计已出/剩余 ]]
local M = {}
M.__index = M

local RANK_LABEL = {
  [0] = "3", [1] = "4", [2] = "5", [3] = "6", [4] = "7", [5] = "8",
  [6] = "9", [7] = "10", [8] = "J", [9] = "Q", [10] = "K", [11] = "A",
  [12] = "2", [13] = "小王", [14] = "大王",
}

local function card_rank(id)
  if id == 52 then return 13 end
  if id == 53 then return 14 end
  return id % 13
end

--- mode: "doudizhu" (54) | "paodekuai" (48, 无三张2与王)
function M.new(mode)
  local self = setmetatable({}, M)
  self.mode = mode or "doudizhu"
  self:reset()
  return self
end

function M:reset()
  self.total = {}
  self.seen = {}
  for r = 0, 14 do
    self.total[r] = 0
    self.seen[r] = 0
  end
  if self.mode == "paodekuai" then
    -- 48 张：每点 4 张，但 2 只有 ♠2 一张；无王
    for r = 0, 11 do self.total[r] = 4 end
    self.total[12] = 1
    self.total[13] = 0
    self.total[14] = 0
  else
    for r = 0, 12 do self.total[r] = 4 end
    self.total[13] = 1
    self.total[14] = 1
  end
end

function M:note_cards(cards)
  for _, id in ipairs(cards or {}) do
    local r = card_rank(id)
    self.seen[r] = (self.seen[r] or 0) + 1
  end
end

function M:public_snapshot()
  local ranks = {}
  for r = 0, 14 do
    local left = (self.total[r] or 0) - (self.seen[r] or 0)
    if left < 0 then left = 0 end
    if (self.total[r] or 0) > 0 then
      ranks[#ranks + 1] = { rank = r, label = RANK_LABEL[r], left = left, total = self.total[r] }
    end
  end
  return { mode = self.mode, ranks = ranks }
end

return M
