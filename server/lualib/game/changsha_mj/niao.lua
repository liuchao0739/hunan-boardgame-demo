-- 抓鸟
local T = require "game.changsha_mj.tiles"

local M = {}

--- 从牌墙抓 n 张鸟；中鸟：鸟牌点数对应座位（1/5/9→庄家位偏移常见算法）
--- 简化：鸟牌 rank 1/5/9 中庄家，2/6 中下家，3/7 中对家，4/8 中上家（相对赢家）
function M.draw_birds(wall, n)
  local birds = {}
  for _ = 1, n do
    if #wall == 0 then break end
    birds[#birds + 1] = table.remove(wall, 1)
  end
  return birds
end

function M.bird_hit_offset(tile)
  local rank = (tile % 9) + 1
  if rank == 1 or rank == 5 or rank == 9 then return 0 end
  if rank == 2 or rank == 6 then return 1 end
  if rank == 3 or rank == 7 then return 2 end
  return 3 -- 4/8
end

--- winner_seat 0-based；返回每个座位中鸟数
function M.count_hits(birds, winner_seat, player_count)
  player_count = player_count or 4
  local hits = {}
  for s = 0, player_count - 1 do hits[s] = 0 end
  for _, t in ipairs(birds) do
    local off = M.bird_hit_offset(t)
    local seat = (winner_seat + off) % player_count
    hits[seat] = hits[seat] + 1
  end
  return hits
end

function M.describe(birds)
  local names = {}
  for _, t in ipairs(birds) do
    names[#names + 1] = T.tile_name(t)
  end
  return table.concat(names, " ")
end

return M
