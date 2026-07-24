-- Scorer — ported from Java Scorer (fan + liangFeng + gang + piao)

local M = {}

-- tile counts for liang feng: 东101 南103 西105 北107 中126 发188 白255
local FENG = { [101] = "dong", [103] = "nan", [105] = "xi", [107] = "bei" }
local JIAN = { [126] = "zhong", [188] = "fa", [255] = "bai" }

function M.empty_liang_feng()
  return {
    kind = 0,
    numOfDongFeng = 0, numOfNanFeng = 0, numOfXiFeng = 0, numOfBeiFeng = 0,
    numOfHongZhong = 0, numOfFaCai = 0, numOfBaiBan = 0,
  }
end

function M.liang_feng_total(lf)
  if not lf then return 0 end
  return (lf.numOfDongFeng or 0) + (lf.numOfNanFeng or 0) + (lf.numOfXiFeng or 0)
    + (lf.numOfBeiFeng or 0) + (lf.numOfHongZhong or 0) + (lf.numOfFaCai or 0)
    + (lf.numOfBaiBan or 0)
end

function M.liang_feng_fan(lf)
  local n = M.liang_feng_total(lf)
  return math.max(0, n - 3)
end

function M.gang_fan(gang_list)
  -- gang_list: { {kind=3|4|5, tile=...}, ... } 3明 4暗 5补
  local fan = 0
  for _, g in ipairs(gang_list or {}) do
    if g.kind == 4 then fan = fan + 2
    else fan = fan + 1 end
  end
  return fan
end

-- Minimal hu pattern detection
function M.detect_hu_patterns(hand, opts)
  opts = opts or {}
  local pats = { { key = 1, val = 1 } } -- 平胡
  if opts.zhuang then pats[#pats + 1] = { key = 1001, val = 2 } end
  if opts.ziMo then pats[#pats + 1] = { key = 1002, val = 1 } end
  -- 碰碰胡：all sets are pung (simplified: no chow in peng list and hand forms)
  if opts.pengPeng then pats[#pats + 1] = { key = 2222, val = 2 } end
  if opts.qingYiSe then pats[#pats + 1] = { key = 1111, val = 4 } end
  if opts.hunYiSe then pats[#pats + 1] = { key = 1112, val = 2 } end
  if opts.qiDui then pats[#pats + 1] = { key = 1007, val = 4 } end
  return pats
end

function M.hu_pattern_fan(pats)
  local s = 0
  for _, p in ipairs(pats or {}) do s = s + (p.val or 0) end
  return s
end

local CAP = 64

function M.settle_zi_mo(players, winnerId)
  -- returns settlement items with currScore updates applied
  local win = nil
  for _, p in ipairs(players) do
    if p.userId == winnerId then win = p break end
  end
  if not win then return {} end

  local winLf = M.liang_feng_fan(win.liangFeng)
  local winGang = M.gang_fan(win.gang)
  local pats = M.detect_hu_patterns(win.hand, {
    zhuang = (win.seatIndex == 0),
    ziMo = true,
  })
  local winHu = M.hu_pattern_fan(pats)
  local base = winLf + winGang + winHu

  local items = {}
  for _, p in ipairs(players) do
    local curr = 0
    if p.userId == winnerId then
      -- accumulate from losers below
    else
      local loseExtra = M.liang_feng_fan(p.liangFeng) + M.gang_fan(p.gang)
      local fan = base + loseExtra
      if fan > CAP then fan = CAP end
      local score = fan + (win.dingPiao or 0) + (p.dingPiao or 0)
      curr = -score
      p.totalScore = (p.totalScore or 0) + curr
      p.currScore = curr
      win.currScore = (win.currScore or 0) + score
    end
  end
  win.totalScore = (win.totalScore or 0) + (win.currScore or 0)
  win.ziMoTimez = (win.ziMoTimez or 0) + 1
  win.huPaiTimez = (win.huPaiTimez or 0) + 1

  for _, p in ipairs(players) do
    local cpg = {}
    for _, t in ipairs(p.peng or {}) do
      cpg[#cpg + 1] = { kind = 2, tile = t, t0 = t } -- 碰
    end
    for _, g in ipairs(p.gang or {}) do
      if type(g) == "table" then
        cpg[#cpg + 1] = { kind = g.kind or 3, tile = g.tile, t0 = g.tile }
      else
        cpg[#cpg + 1] = { kind = 3, tile = g, t0 = g }
      end
    end
    local gpat = {}
    for _, g in ipairs(p.gang or {}) do
      local k = type(g) == "table" and (g.kind or 3) or 3
      local fan = (k == 4) and 2 or 1
      gpat[#gpat + 1] = { key = k, val = fan }
    end
    items[#items + 1] = {
      userId = p.userId,
      currScore = p.currScore or 0,
      totalScore = p.totalScore or 0,
      seatIndex = p.seatIndex,
      piaoX = p.dingPiao or 0,
      roomOwnerFlag = (p.seatIndex == 0),
      zhuangJiaFlag = (p.seatIndex == 0),
      hu = (p.userId == winnerId),
      dianPao = false,
      ziMo = (p.userId == winnerId),
      huPattern = (p.userId == winnerId) and pats or {},
      gangPattern = gpat,
      mahjongInHand = p.hand,
      mahjongChiPengGang = cpg,
      mahjongLiangFeng = p.liangFeng,
      zuoZhuangTimez = p.zuoZhuangTimez or 0,
      ziMoTimez = p.ziMoTimez or 0,
      dianPaoTimez = p.dianPaoTimez or 0,
      huPaiTimez = p.huPaiTimez or 0,
    }
  end
  -- big winner
  local best, bestScore = nil, -1e9
  for _, it in ipairs(items) do
    if it.totalScore > bestScore then bestScore = it.totalScore; best = it end
  end
  for _, it in ipairs(items) do
    it.bigWinner = (best and it.userId == best.userId and bestScore > 0) or false
  end
  return items
end

function M.settle_dian_pao(players, winnerId, dianPaoId)
  local win, dp = nil, nil
  for _, p in ipairs(players) do
    if p.userId == winnerId then win = p end
    if p.userId == dianPaoId then dp = p end
  end
  if not win or not dp then return {} end
  local pats = M.detect_hu_patterns(win.hand, { zhuang = (win.seatIndex == 0), ziMo = false })
  local base = M.liang_feng_fan(dp.liangFeng) + M.gang_fan(dp.gang)
  local winFan = base + M.liang_feng_fan(win.liangFeng) + M.gang_fan(win.gang) + M.hu_pattern_fan(pats)
  if winFan > CAP then winFan = CAP end
  local score = winFan + (win.dingPiao or 0) + (dp.dingPiao or 0)
  for _, p in ipairs(players) do p.currScore = 0 end
  win.currScore = score
  dp.currScore = -score
  win.totalScore = (win.totalScore or 0) + score
  dp.totalScore = (dp.totalScore or 0) - score
  win.huPaiTimez = (win.huPaiTimez or 0) + 1
  dp.dianPaoTimez = (dp.dianPaoTimez or 0) + 1

  local items = {}
  for _, p in ipairs(players) do
    local cpg = {}
    for _, t in ipairs(p.peng or {}) do
      cpg[#cpg + 1] = { kind = 2, tile = t, t0 = t }
    end
    for _, g in ipairs(p.gang or {}) do
      if type(g) == "table" then
        cpg[#cpg + 1] = { kind = g.kind or 3, tile = g.tile, t0 = g.tile }
      else
        cpg[#cpg + 1] = { kind = 3, tile = g, t0 = g }
      end
    end
    local gpat = {}
    for _, g in ipairs(p.gang or {}) do
      local k = type(g) == "table" and (g.kind or 3) or 3
      gpat[#gpat + 1] = { key = k, val = (k == 4) and 2 or 1 }
    end
    items[#items + 1] = {
      userId = p.userId,
      currScore = p.currScore or 0,
      totalScore = p.totalScore or 0,
      seatIndex = p.seatIndex,
      piaoX = p.dingPiao or 0,
      roomOwnerFlag = (p.seatIndex == 0),
      zhuangJiaFlag = (p.seatIndex == 0),
      hu = (p.userId == winnerId),
      dianPao = (p.userId == dianPaoId),
      ziMo = false,
      huPattern = (p.userId == winnerId) and pats or {},
      gangPattern = gpat,
      mahjongInHand = p.hand,
      mahjongChiPengGang = cpg,
      mahjongLiangFeng = p.liangFeng,
      zuoZhuangTimez = p.zuoZhuangTimez or 0,
      ziMoTimez = p.ziMoTimez or 0,
      dianPaoTimez = p.dianPaoTimez or 0,
      huPaiTimez = p.huPaiTimez or 0,
    }
  end
  local best, bestScore = nil, -1e9
  for _, it in ipairs(items) do
    if it.totalScore > bestScore then bestScore = it.totalScore; best = it end
  end
  for _, it in ipairs(items) do
    it.bigWinner = (best and it.userId == best.userId and bestScore > 0) or false
  end
  return items
end

function M.build_liang_feng_from_tiles(t0, t1, t2, luan_mao)
  local lf = M.empty_liang_feng()
  local tiles = { t0, t1, t2 }
  local all_feng, all_jian = true, true
  for _, t in ipairs(tiles) do
    if FENG[t] then
      all_jian = false
      if t == 101 then lf.numOfDongFeng = lf.numOfDongFeng + 1
      elseif t == 103 then lf.numOfNanFeng = lf.numOfNanFeng + 1
      elseif t == 105 then lf.numOfXiFeng = lf.numOfXiFeng + 1
      elseif t == 107 then lf.numOfBeiFeng = lf.numOfBeiFeng + 1 end
    elseif JIAN[t] then
      all_feng = false
      if t == 126 then lf.numOfHongZhong = lf.numOfHongZhong + 1
      elseif t == 188 then lf.numOfFaCai = lf.numOfFaCai + 1
      elseif t == 255 then lf.numOfBaiBan = lf.numOfBaiBan + 1 end
    else
      return nil, "not feng/jian"
    end
  end
  if luan_mao or (not all_feng and not all_jian) then
    lf.kind = 3
  elseif all_feng then
    lf.kind = 1
  else
    lf.kind = 2
  end
  return lf
end

function M.add_bu_feng(lf, tile)
  if not lf or lf.kind == 0 then return nil, "not liang yet" end
  if lf.kind == 1 or lf.kind == 3 then
    if tile == 101 then lf.numOfDongFeng = lf.numOfDongFeng + 1
    elseif tile == 103 then lf.numOfNanFeng = lf.numOfNanFeng + 1
    elseif tile == 105 then lf.numOfXiFeng = lf.numOfXiFeng + 1
    elseif tile == 107 then lf.numOfBeiFeng = lf.numOfBeiFeng + 1
    elseif lf.kind == 3 and tile == 126 then lf.numOfHongZhong = lf.numOfHongZhong + 1
    elseif lf.kind == 3 and tile == 188 then lf.numOfFaCai = lf.numOfFaCai + 1
    elseif lf.kind == 3 and tile == 255 then lf.numOfBaiBan = lf.numOfBaiBan + 1
    else return nil, "tile mismatch" end
  elseif lf.kind == 2 then
    if tile == 126 then lf.numOfHongZhong = lf.numOfHongZhong + 1
    elseif tile == 188 then lf.numOfFaCai = lf.numOfFaCai + 1
    elseif tile == 255 then lf.numOfBaiBan = lf.numOfBaiBan + 1
    else return nil, "tile mismatch" end
  end
  return lf
end

return M
