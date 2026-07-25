-- JSON 安全辅助：0-based / 稀疏表 → 1-based 数组
local M = {}

function M.array0(tbl, n)
  local out = {}
  n = n or 0
  if n <= 0 and type(tbl) == "table" then
    local max = -1
    for k, _ in pairs(tbl) do
      if type(k) == "number" and k > max then max = k end
    end
    n = max + 1
  end
  for i = 0, n - 1 do
    out[i + 1] = tbl[i]
  end
  return out
end

return M
