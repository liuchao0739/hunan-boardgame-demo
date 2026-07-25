-- 长沙麻将番型表（基础分倍率）
local M = {}

-- 基础：平胡 1，自摸 +1，将将胡 +2（与平胡叠加，非互斥）
M.FAN = {
  ping_hu = { name = "平胡", fan = 1 },
  zimo = { name = "自摸", fan = 1 },
  jiang_jiang_hu = { name = "将将胡", fan = 2 },
  gang_shang_hua = { name = "杠上花", fan = 1 },
  qiang_gang = { name = "抢杠胡", fan = 1 },
  qishou = { name = "起手胡", fan = 2 },
  zhongtu = { name = "中途胡", fan = 2 },
}

-- 杠分即时结算（相对 baseScore 的倍数）
M.GANG_PAY = {
  ming_gang = { from_discarder = 2, from_other = 1 },
  an_gang = { from_each = 2 },
  bu_gang = { from_each = 1 },
}

function M.get(id)
  return M.FAN[id]
end

function M.list()
  local out = {}
  for id, row in pairs(M.FAN) do
    out[#out + 1] = { id = id, name = row.name, fan = row.fan }
  end
  table.sort(out, function(a, b) return a.id < b.id end)
  return out
end

--- 将将胡与平胡：全 2/5/8 且 3N+2 成立时叠加 jiang_jiang_hu，否则仅 ping_hu
function M.hu_fan(opts)
  opts = opts or {}
  local items = {}
  local fan = 0
  local function add(id)
    local row = M.FAN[id]
    if not row then return end
    fan = fan + row.fan
    items[#items + 1] = { id = id, name = row.name, fan = row.fan }
  end
  add("ping_hu")
  if opts.is_zimo then add("zimo") end
  if opts.is_jiang then add("jiang_jiang_hu") end
  if opts.is_qiang_gang then add("qiang_gang") end
  if opts.is_gang_shang_hua then add("gang_shang_hua") end
  return fan, items
end

function M.base_fan(is_zimo, is_jiang)
  return M.hu_fan({ is_zimo = is_zimo, is_jiang = is_jiang })
end

--- 返回杠家从各座位收取的分（未乘 baseScore）
function M.gang_deltas(kind, gang_seat, from_seat, player_count)
  local pay = M.GANG_PAY[kind]
  if not pay then return {} end
  player_count = player_count or 4
  local deltas = {}
  for s = 0, player_count - 1 do deltas[s] = 0 end
  if kind == "ming_gang" then
    for o = 0, player_count - 1 do
      if o ~= gang_seat then
        local amt = (o == from_seat) and pay.from_discarder or pay.from_other
        deltas[o] = -amt
        deltas[gang_seat] = deltas[gang_seat] + amt
      end
    end
  else
    for o = 0, player_count - 1 do
      if o ~= gang_seat then
        local amt = pay.from_each
        deltas[o] = -amt
        deltas[gang_seat] = deltas[gang_seat] + amt
      end
    end
  end
  return deltas
end

return M
