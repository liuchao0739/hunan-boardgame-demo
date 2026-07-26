-- 指标计数 stub（T078）：局数 / 在线人数
local M = {
  rounds_finished = 0,
  rooms_created = 0,
  online_users = 0,
}

function M.inc_round()
  M.rounds_finished = M.rounds_finished + 1
end

function M.inc_room()
  M.rooms_created = M.rooms_created + 1
end

function M.set_online(n)
  M.online_users = tonumber(n) or 0
end

function M.snapshot()
  return {
    rounds_finished = M.rounds_finished,
    rooms_created = M.rooms_created,
    online_users = M.online_users,
  }
end

return M
