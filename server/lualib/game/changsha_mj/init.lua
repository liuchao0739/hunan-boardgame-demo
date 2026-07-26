-- 长沙麻将引擎
local T = require "game.changsha_mj.tiles"
local Q = require "game.changsha_mj.qishou"
local Niao = require "game.changsha_mj.niao"
local Fan = require "game.changsha_mj.fan"
local JsonUtil = require "platform.jsonutil"

local function copy_arr(a)
  local r = {}
  for i, v in ipairs(a) do r[i] = v end
  return r
end

local Engine = {}
Engine.__index = Engine

local DEFAULT = {
  birdCount = 2,
  baseScore = 1,
  playerCount = 4,
  multiHu = "first", -- "all" | "first"
  actionTimeoutSec = 15,
}

function Engine.new(opts)
  opts = opts or {}
  local self = setmetatable({}, Engine)
  self.gameId = "changsha_mj"
  self.cfg = {
    birdCount = opts.birdCount or DEFAULT.birdCount,
    baseScore = opts.baseScore or DEFAULT.baseScore,
    playerCount = opts.playerCount or DEFAULT.playerCount,
    multiHu = opts.multiHu or opts.rules and opts.rules.multiHu or DEFAULT.multiHu,
    actionTimeoutSec = opts.actionTimeoutSec or DEFAULT.actionTimeoutSec,
  }
  self.phase = "waiting"
  self.deadlineAt = nil
  self.round = 0
  self.dealer = 0
  self.currentSeat = 0
  self.wall = {}
  self.players = {}
  self.lastDiscard = nil
  self.message = "等待开始"
  self.settle = nil
  self.qishou = nil
  self.zhongtu = nil
  self.claimSeats = {}
  self.huClaims = {}
  self.pendingBuGang = nil
  self.drawn = nil
  self.scoreLedger = { qishou = {}, zhongtu = {}, gang = {} }
  self:_reset_players()
  return self
end

function Engine:_reset_players()
  self.players = {}
  for s = 0, self.cfg.playerCount - 1 do
    self.players[s] = {
      hand = {},
      melds = {},
      discards = {},
      score = 0,
      userId = 0,
      userName = "",
      isBot = false,
      autoPlay = false,
      disconnected = false,
    }
  end
end

function Engine:_set_deadline()
  local sec = self.cfg.actionTimeoutSec or 15
  self.deadlineAt = os.time() + sec
end

function Engine:_clear_deadline()
  self.deadlineAt = nil
end

function Engine:set_seat_meta(seat, meta)
  local p = self.players[seat]
  if not p or type(meta) ~= "table" then return end
  if meta.isBot ~= nil then p.isBot = meta.isBot and true or false end
  if meta.autoPlay ~= nil then p.autoPlay = meta.autoPlay and true or false end
  if meta.disconnected ~= nil then p.disconnected = meta.disconnected and true or false end
end

function Engine:set_auto_play(seat, yes)
  local p = self.players[seat]
  if not p then return end
  p.autoPlay = yes and true or false
end

function Engine:_seat_needs_auto(seat, mode)
  local p = self.players[seat]
  if not p then return false end
  -- mode: nil/"all" = bot+托管; "bot" = 仅机器人; "autoplay" = 仅真人托管
  if mode == "bot" then return p.isBot and true or false end
  if mode == "autoplay" then return (p.autoPlay and not p.isBot) and true or false end
  return p.isBot or p.autoPlay
end

function Engine:_reset_round_ledger()
  self.scoreLedger = { qishou = {}, zhongtu = {}, gang = {} }
  self.huClaims = {}
  self.pendingBuGang = nil
end

function Engine:_ledger_push(kind, entry)
  local bucket = self.scoreLedger[kind]
  if bucket then bucket[#bucket + 1] = entry end
end

function Engine:_apply_deltas(deltas, base, meta)
  base = base or self.cfg.baseScore
  local applied = {}
  local appliedArr = {}
  for s, raw in pairs(deltas) do
    local amt = raw * base
    self.players[s].score = self.players[s].score + amt
    applied[s] = amt
    appliedArr[s + 1] = amt
  end
  if meta then
    meta.scores = appliedArr
    self:_ledger_push(meta.kind or "gang", meta)
  end
  return applied
end

function Engine:_apply_gang_score(gang_seat, kind, from_seat)
  local deltas = Fan.gang_deltas(kind, gang_seat, from_seat, self.cfg.playerCount)
  return self:_apply_deltas(deltas, self.cfg.baseScore, {
    kind = "gang",
    gangKind = kind,
    seat = gang_seat,
    fromSeat = from_seat,
    tile = nil,
  })
end

function Engine:on_start(seats)
  self.round = self.round + 1
  self.settle = nil
  self.qishou = nil
  self.zhongtu = nil
  self.lastDiscard = nil
  self.drawn = nil
  self.claimSeats = {}
  self:_reset_round_ledger()
  self.wall = T.shuffle(T.build_deck())
  for s = 0, self.cfg.playerCount - 1 do
    local info = seats[s + 1] or seats[s] or {}
    local p = self.players[s]
    p.hand = {}
    p.melds = {}
    p.discards = {}
    p.userId = info.userId or 0
    p.userName = info.userName or ("座位" .. s)
    p.isBot = info.isBot and true or false
  end
  for s = 0, self.cfg.playerCount - 1 do
    local n = (s == self.dealer) and 14 or 13
    for _ = 1, n do
      if #self.wall > 0 then
        self.players[s].hand[#self.players[s].hand + 1] = table.remove(self.wall, 1)
      end
    end
    self.players[s].hand = T.sort_tiles(self.players[s].hand)
  end
  self.currentSeat = self.dealer
  local qs = {}
  local any = false
  for s = 0, self.cfg.playerCount - 1 do
    local hits = Q.detect(self.players[s].hand)
    if #hits > 0 then
      qs[tostring(s)] = hits
      any = true
    end
  end
  if any then
    self.qishou = { hits = qs, resolved = false }
    self.phase = "qishou"
    self.message = "起手胡！可结算或继续"
    self:_apply_qishou_scores()
  else
    self.phase = "wait_discard"
    self.message = string.format("第%d局 庄家座位%d 请出牌", self.round, self.dealer)
    self:_set_deadline()
  end
end

function Engine:_apply_qishou_scores()
  if not self.qishou or self.qishou.resolved then return end
  local base = self.cfg.baseScore
  for s = 0, self.cfg.playerCount - 1 do
    local hits = self.qishou.hits[tostring(s)]
    if hits then
      for _, h in ipairs(hits) do
        local gain = (h.fan or Fan.FAN.qishou.fan) * base
        local deltas = {}
        for o = 0, self.cfg.playerCount - 1 do
          if o ~= s then
            deltas[o] = -gain
            deltas[s] = (deltas[s] or 0) + gain
          end
        end
        self:_apply_deltas(deltas, 1, {
          kind = "qishou",
          seat = s,
          pattern = h.id,
          name = h.name,
          fan = h.fan or Fan.FAN.qishou.fan,
        })
      end
    end
  end
  self.qishou.resolved = true
end

function Engine:_draw(seat)
  if #self.wall == 0 then return nil end
  local t = table.remove(self.wall, 1)
  local p = self.players[seat]
  p.hand[#p.hand + 1] = t
  p.hand = T.sort_tiles(p.hand)
  self.drawn = t
  local zhong = {}
  if Q.zhongtu_sixi(p.hand) then
    zhong[#zhong + 1] = { id = "zhongtu_sixi", name = "中途四喜", fan = Fan.FAN.zhongtu.fan }
  end
  if Q.zhongtu_liuliu(p.hand) then
    zhong[#zhong + 1] = { id = "zhongtu_liuliu", name = "中途六六顺", fan = Fan.FAN.zhongtu.fan }
  end
  if #zhong > 0 then
    self.zhongtu = { seat = seat, hits = zhong }
    local base = self.cfg.baseScore
    for _, h in ipairs(zhong) do
      local gain = (h.fan or 2) * base
      local deltas = {}
      for o = 0, self.cfg.playerCount - 1 do
        if o ~= seat then
          deltas[o] = -gain
          deltas[seat] = (deltas[seat] or 0) + gain
        end
      end
      self:_apply_deltas(deltas, 1, {
        kind = "zhongtu",
        seat = seat,
        pattern = h.id,
        name = h.name,
        fan = h.fan or 2,
      })
    end
    self.message = string.format("座位%d %s", seat, zhong[1].name)
  end
  return t
end

function Engine:_gang_ops_for_hand(seat, ops)
  local hand = self.players[seat].hand
  local c = T.counts(hand)
  for t = 0, 26 do
    if (c[t] or 0) >= 4 then
      ops[#ops + 1] = { action = "an_gang", label = "暗杠 " .. T.tile_name(t), tile = t }
    end
  end
  for _, m in ipairs(self.players[seat].melds) do
    if m.kind == "peng" and (c[m.tiles[1]] or 0) >= 1 then
      ops[#ops + 1] = { action = "bu_gang", label = "补杠 " .. T.tile_name(m.tiles[1]), tile = m.tiles[1] }
    end
  end
  return ops
end

function Engine:_ops_discard(seat)
  local ops = { { action = "discard", label = "出牌" } }
  self:_gang_ops_for_hand(seat, ops)
  local hand = self.players[seat].hand
  if T.can_hu(hand) or T.can_jiang_jiang_hu(hand) then
    ops[#ops + 1] = { action = "zimo", label = "自摸" }
  end
  return ops
end

function Engine:_can_hu_with_tile(hand, tile)
  local try_hand = copy_arr(hand)
  try_hand[#try_hand + 1] = tile
  return T.can_hu(try_hand) or T.can_jiang_jiang_hu(try_hand)
end

function Engine:_ops_claim(seat)
  local ops = { { action = "guo", label = "过" } }
  local tile = self.lastDiscard.tile
  local from = self.lastDiscard.seat
  local qiang = self.lastDiscard.qiangGang
  local hand = self.players[seat].hand
  if not qiang then
    local c = T.counts(hand)
    if (c[tile] or 0) >= 2 then
      ops[#ops + 1] = { action = "peng", label = "碰 " .. T.tile_name(tile), tile = tile }
    end
    if (c[tile] or 0) >= 3 then
      ops[#ops + 1] = { action = "ming_gang", label = "杠 " .. T.tile_name(tile), tile = tile }
    end
    local upper = (from + 1) % self.cfg.playerCount
    if seat == upper then
      local chis = T.chi_options(hand, tile)
      for _, ch in ipairs(chis) do
        ops[#ops + 1] = {
          action = "chi",
          label = string.format("吃 %s%s%s", T.tile_name(ch[1]), T.tile_name(ch[2]), T.tile_name(ch[3])),
          tiles = { ch[1], ch[2], ch[3] },
        }
      end
    end
  end
  if self:_can_hu_with_tile(hand, tile) then
    ops[#ops + 1] = { action = "hu", label = qiang and "抢杠胡" or "胡", tile = tile }
  end
  return ops
end

function Engine:_available_ops(for_seat)
  if self.phase == "qishou" then
    return { { action = "continue", label = "继续打牌" } }
  end
  if self.phase == "wait_discard" and for_seat == self.currentSeat then
    return self:_ops_discard(for_seat)
  end
  if self.phase == "wait_claim" then
    for _, s in ipairs(self.claimSeats) do
      if s == for_seat then return self:_ops_claim(for_seat) end
    end
  end
  if self.phase == "settle" or self.phase == "finished" then
    return { { action = "leave", label = "回大厅" } }
  end
  return {}
end

function Engine:_open_claims(from_seat, tile, opts)
  opts = opts or {}
  self.huClaims = {}
  self.claimSeats = {}
  for s = 0, self.cfg.playerCount - 1 do
    if s ~= from_seat then
      self.lastDiscard = { seat = from_seat, tile = tile, qiangGang = opts.qiangGang }
      local ops = self:_ops_claim(s)
      if #ops > 1 then
        self.claimSeats[#self.claimSeats + 1] = s
      end
    end
  end
  if #self.claimSeats == 0 then
    if opts.on_empty then
      opts.on_empty()
    else
      self:_next_turn((from_seat + 1) % self.cfg.playerCount)
    end
    return
  end
  self.phase = "wait_claim"
  self.message = opts.qiangGang and "等待抢杠胡" or "等待吃碰杠胡"
  self:_set_deadline()
end

function Engine:_next_turn(seat)
  self.currentSeat = seat
  self.lastDiscard = nil
  self.claimSeats = {}
  self.huClaims = {}
  self.pendingBuGang = nil
  self.drawn = nil
  if #self.wall == 0 then
    self:_huangzhuang()
    return
  end
  self:_draw(seat)
  self.phase = "wait_discard"
  self.message = string.format("座位%d 摸牌，请出牌", seat)
  self:_set_deadline()
end

function Engine:_huangzhuang()
  self.phase = "settle"
  self.settle = {
    winnerSeat = nil,
    reason = "huangzhuang",
    detail = "荒庄（牌墙摸完）",
    detailItems = self:_build_detail_items(nil),
    scores = self:_score_list(),
    birds = {},
    birdHits = {},
  }
  self.message = "荒庄"
  self:_clear_deadline()
end

function Engine:_score_list()
  local s = {}
  for i = 0, self.cfg.playerCount - 1 do
    s[i + 1] = self.players[i].score
  end
  return s
end

function Engine:_build_detail_items(hu_meta)
  local items = {}
  for _, e in ipairs(self.scoreLedger.qishou) do
    items[#items + 1] = {
      type = "qishou",
      seat = e.seat,
      pattern = e.pattern,
      name = e.name,
      fan = e.fan,
      scores = e.scores,
    }
  end
  for _, e in ipairs(self.scoreLedger.zhongtu) do
    items[#items + 1] = {
      type = "zhongtu",
      seat = e.seat,
      pattern = e.pattern,
      name = e.name,
      fan = e.fan,
      scores = e.scores,
    }
  end
  for _, e in ipairs(self.scoreLedger.gang) do
    items[#items + 1] = {
      type = "gang",
      seat = e.seat,
      gangKind = e.gangKind,
      fromSeat = e.fromSeat,
      scores = e.scores,
    }
  end
  if hu_meta then
    items[#items + 1] = hu_meta
  end
  return items
end

function Engine:_do_hu(winner, is_zimo, pao_seat, opts)
  opts = opts or {}
  local base = self.cfg.baseScore
  local is_jiang = T.can_jiang_jiang_hu(self.players[winner].hand)
  local fan, fan_items = Fan.hu_fan({
    is_zimo = is_zimo,
    is_jiang = is_jiang,
    is_qiang_gang = opts.is_qiang_gang,
    is_gang_shang_hua = opts.is_gang_shang_hua,
  })
  local gain = fan * base
  if is_zimo then
    for o = 0, self.cfg.playerCount - 1 do
      if o ~= winner then
        self.players[o].score = self.players[o].score - gain
        self.players[winner].score = self.players[winner].score + gain
      end
    end
  else
    self.players[pao_seat].score = self.players[pao_seat].score - gain * 2
    self.players[winner].score = self.players[winner].score + gain * 2
  end
  local birds = Niao.draw_birds(self.wall, self.cfg.birdCount)
  local hits = Niao.count_hits(birds, winner, self.cfg.playerCount)
  local birdHitsArr = JsonUtil.array0(hits, self.cfg.playerCount)
  for s = 0, self.cfg.playerCount - 1 do
    local h = hits[s] or 0
    if h > 0 and s ~= winner then
      local add = h * base
      self.players[s].score = self.players[s].score - add
      self.players[winner].score = self.players[winner].score + add
    elseif h > 0 and s == winner then
      for o = 0, self.cfg.playerCount - 1 do
        if o ~= winner then
          self.players[o].score = self.players[o].score - h * base
          self.players[winner].score = self.players[winner].score + h * base
        end
      end
    end
  end
  local hu_detail = {
    type = "hu",
    seat = winner,
    reason = is_zimo and "zimo" or (opts.is_qiang_gang and "qiang_gang" or "dianpao"),
    fan = fan,
    fanItems = fan_items,
    jiangJiangHu = is_jiang,
    paoSeat = pao_seat,
  }
  local detail_str = string.format(
    "%s 座位%d fan=%d%s；鸟：%s",
    is_zimo and "自摸" or (opts.is_qiang_gang and "抢杠胡" or "点炮"),
    winner,
    fan,
    is_jiang and "（将将胡叠加）" or "",
    Niao.describe(birds)
  )
  self.phase = "settle"
  self.settle = {
    winnerSeat = winner,
    reason = hu_detail.reason,
    detail = detail_str,
    detailItems = self:_build_detail_items(hu_detail),
    scores = self:_score_list(),
    birds = birds,
    birdHits = birdHitsArr,
    fan = fan,
    fanItems = fan_items,
    jiangJiangHu = is_jiang,
  }
  self.message = self.settle.detail
  self.dealer = winner
  self.pendingBuGang = nil
  self:_clear_deadline()
end

function Engine:_settle_multi_hu()
  local winners = self.huClaims
  if #winners == 0 then return end
  local pao = self.lastDiscard and self.lastDiscard.seat
  if not pao then return end
  if #winners == 1 then
    self:_do_hu(winners[1], false, pao, { is_qiang_gang = self.lastDiscard.qiangGang })
    return
  end
  local base = self.cfg.baseScore
  local birds = Niao.draw_birds(self.wall, self.cfg.birdCount)
  local all_fan_items = {}
  local total_fan = 0
  for _, w in ipairs(winners) do
    local is_jiang = T.can_jiang_jiang_hu(self.players[w].hand)
    local fan, items = Fan.hu_fan({ is_jiang = is_jiang })
    total_fan = total_fan + fan
    all_fan_items[#all_fan_items + 1] = { seat = w, fan = fan, fanItems = items, jiangJiangHu = is_jiang }
    local gain = fan * base
    self.players[pao].score = self.players[pao].score - gain * 2
    self.players[w].score = self.players[w].score + gain * 2
  end
  local primary = winners[1]
  local hits = Niao.count_hits(birds, primary, self.cfg.playerCount)
  local birdHitsArr = JsonUtil.array0(hits, self.cfg.playerCount)
  for s = 0, self.cfg.playerCount - 1 do
    local h = hits[s] or 0
    if h > 0 then
      for o = 0, self.cfg.playerCount - 1 do
        if o ~= primary then
          self.players[o].score = self.players[o].score - h * base
          self.players[primary].score = self.players[primary].score + h * base
        end
      end
    end
  end
  self.phase = "settle"
  self.settle = {
    winnerSeat = primary,
    winners = winners,
    reason = "duo_xiang",
    detail = string.format("一炮%d响 座位%s fan合计=%d；鸟：%s",
      #winners, table.concat(winners, ","), total_fan, Niao.describe(birds)),
    detailItems = self:_build_detail_items({
      type = "hu",
      seats = winners,
      reason = "duo_xiang",
      fan = total_fan,
      fanItems = all_fan_items,
      paoSeat = pao,
    }),
    scores = self:_score_list(),
    birds = birds,
    birdHits = birdHitsArr,
    fan = total_fan,
  }
  self.message = self.settle.detail
  self.dealer = primary
  self.huClaims = {}
  self.pendingBuGang = nil
  self:_clear_deadline()
end

function Engine:_register_hu_claim(seat)
  for _, s in ipairs(self.huClaims) do
    if s == seat then return true end
  end
  self.huClaims[#self.huClaims + 1] = seat
  local left = {}
  for _, s in ipairs(self.claimSeats) do
    if s ~= seat then left[#left + 1] = s end
  end
  self.claimSeats = left
  if self.cfg.multiHu == "first" then
    self:_settle_multi_hu()
    return true
  end
  if #self.claimSeats == 0 then
    self:_settle_multi_hu()
  end
  return true
end

function Engine:_finish_bu_gang(seat, tile)
  if not T.remove_one(self.players[seat].hand, tile) then
    return false, "无牌"
  end
  local found = false
  for _, m in ipairs(self.players[seat].melds) do
    if m.kind == "peng" and m.tiles[1] == tile then
      m.kind = "bu_gang"
      m.tiles = { tile, tile, tile, tile }
      found = true
      break
    end
  end
  if not found then
    self.players[seat].hand[#self.players[seat].hand + 1] = tile
    return false, "无碰可补"
  end
  self:_apply_gang_score(seat, "bu_gang", nil)
  self.pendingBuGang = nil
  self.lastDiscard = nil
  self.claimSeats = {}
  if #self.wall == 0 then
    self:_huangzhuang()
    return true
  end
  self:_draw(seat)
  self.currentSeat = seat
  self.phase = "wait_discard"
  self.message = string.format("座位%d 补杠", seat)
  self:_set_deadline()
  return true
end

function Engine:_start_bu_gang(seat, tile)
  local found = false
  for _, m in ipairs(self.players[seat].melds) do
    if m.kind == "peng" and m.tiles[1] == tile then
      found = true
      break
    end
  end
  if not found then return false, "无碰可补" end
  local c = T.counts(self.players[seat].hand)
  if (c[tile] or 0) < 1 then return false, "无牌" end
  self.pendingBuGang = { seat = seat, tile = tile }
  self.currentSeat = seat
  self:_open_claims(seat, tile, {
    qiangGang = true,
    on_empty = function()
      self:_finish_bu_gang(seat, tile)
    end,
  })
  return true
end

function Engine:_after_gang_draw(seat)
  if #self.wall == 0 then
    self:_huangzhuang()
    return false
  end
  self:_draw(seat)
  return true
end

function Engine:on_action(seat, cmd, body)
  body = body or {}
  if self.phase == "qishou" and cmd == "continue" then
    self.phase = "wait_discard"
    self.message = string.format("继续：庄家座位%d 出牌", self.dealer)
    self:_set_deadline()
    return true
  end
  if self.phase == "settle" then
    return true
  end
  if cmd == "discard" then
    if self.phase ~= "wait_discard" or seat ~= self.currentSeat then
      return false, "未轮到出牌"
    end
    local tile = tonumber(body.tile)
    if tile == nil then return false, "缺 tile" end
    if tile < 0 or tile > 26 then return false, "非法牌" end
    if not T.remove_one(self.players[seat].hand, tile) then
      return false, "手牌无此牌"
    end
    self.players[seat].discards[#self.players[seat].discards + 1] = tile
    self.players[seat].hand = T.sort_tiles(self.players[seat].hand)
    self.lastDiscard = { seat = seat, tile = tile }
    self.drawn = nil
    self:_open_claims(seat, tile)
    self:_clear_deadline()
    return true
  end
  if cmd == "guo" then
    if self.phase ~= "wait_claim" then return false, "非抢牌阶段" end
    local left = {}
    for _, s in ipairs(self.claimSeats) do
      if s ~= seat then left[#left + 1] = s end
    end
    self.claimSeats = left
    if #self.claimSeats == 0 then
      if #self.huClaims > 0 then
        self:_settle_multi_hu()
      elseif self.pendingBuGang then
        local pg = self.pendingBuGang
        self:_finish_bu_gang(pg.seat, pg.tile)
      else
        local from = self.lastDiscard.seat
        self:_next_turn((from + 1) % self.cfg.playerCount)
      end
    else
      self:_set_deadline()
    end
    return true
  end
  if cmd == "peng" then
    if self.phase ~= "wait_claim" or self.lastDiscard.qiangGang then
      return false, "非抢牌"
    end
    local tile = self.lastDiscard.tile
    local from = self.lastDiscard.seat
    if not T.remove_n(self.players[seat].hand, tile, 2) then return false, "不能碰" end
    local d = self.players[from].discards
    if d[#d] == tile then table.remove(d) end
    self.players[seat].melds[#self.players[seat].melds + 1] = {
      kind = "peng", tiles = { tile, tile, tile }, fromSeat = from,
    }
    self.players[seat].hand = T.sort_tiles(self.players[seat].hand)
    self.currentSeat = seat
    self.phase = "wait_discard"
    self.claimSeats = {}
    self.message = string.format("座位%d 碰", seat)
    self:_set_deadline()
    return true
  end
  if cmd == "chi" then
    if self.phase ~= "wait_claim" or self.lastDiscard.qiangGang then
      return false, "非抢牌"
    end
    local tiles = body.tiles
    if type(tiles) ~= "table" or #tiles < 2 then return false, "缺吃牌" end
    local discard = self.lastDiscard.tile
    local from = self.lastDiscard.seat
    local upper = (from + 1) % self.cfg.playerCount
    if seat ~= upper then return false, "只能上家吃" end
    local legal = T.chi_options(self.players[seat].hand, discard)
    local ok_combo = false
    local t1, t2 = tonumber(tiles[1]), tonumber(tiles[2])
    for _, opt in ipairs(legal) do
      if (opt[1] == t1 and opt[2] == t2) or (opt[1] == t2 and opt[2] == t1) then
        ok_combo = true
        t1, t2 = opt[1], opt[2]
        break
      end
    end
    if not ok_combo then return false, "非法吃牌组合" end
    if not T.remove_one(self.players[seat].hand, t1) then return false, "手牌不足" end
    if not T.remove_one(self.players[seat].hand, t2) then
      self.players[seat].hand[#self.players[seat].hand + 1] = t1
      return false, "手牌不足"
    end
    local d = self.players[from].discards
    if d[#d] == discard then table.remove(d) end
    self.players[seat].melds[#self.players[seat].melds + 1] = {
      kind = "chi", tiles = { t1, t2, discard }, fromSeat = from,
    }
    self.players[seat].hand = T.sort_tiles(self.players[seat].hand)
    self.currentSeat = seat
    self.phase = "wait_discard"
    self.claimSeats = {}
    self.message = string.format("座位%d 吃", seat)
    self:_set_deadline()
    return true
  end
  if cmd == "ming_gang" then
    if self.phase ~= "wait_claim" or self.lastDiscard.qiangGang then
      return false, "非抢牌"
    end
    local tile = self.lastDiscard.tile
    local from = self.lastDiscard.seat
    if not T.remove_n(self.players[seat].hand, tile, 3) then return false, "不能杠" end
    local d = self.players[from].discards
    if d[#d] == tile then table.remove(d) end
    self.players[seat].melds[#self.players[seat].melds + 1] = {
      kind = "ming_gang", tiles = { tile, tile, tile, tile }, fromSeat = from,
    }
    self:_apply_gang_score(seat, "ming_gang", from)
    self.currentSeat = seat
    self.claimSeats = {}
    if not self:_after_gang_draw(seat) then return true end
    self.phase = "wait_discard"
    self.message = string.format("座位%d 明杠", seat)
    self:_set_deadline()
    return true
  end
  if cmd == "an_gang" then
    if self.phase ~= "wait_discard" or seat ~= self.currentSeat then return false, "不能暗杠" end
    local tile = tonumber(body.tile)
    if tile == nil then return false, "缺 tile" end
    if not T.remove_n(self.players[seat].hand, tile, 4) then return false, "不能暗杠" end
    self.players[seat].melds[#self.players[seat].melds + 1] = {
      kind = "an_gang", tiles = { tile, tile, tile, tile },
    }
    self:_apply_gang_score(seat, "an_gang", nil)
    if not self:_after_gang_draw(seat) then return true end
    self.message = string.format("座位%d 暗杠", seat)
    self:_set_deadline()
    return true
  end
  if cmd == "bu_gang" then
    if self.phase ~= "wait_discard" or seat ~= self.currentSeat then return false, "不能补杠" end
    local tile = tonumber(body.tile)
    if tile == nil then return false, "缺 tile" end
    return self:_start_bu_gang(seat, tile)
  end
  if cmd == "hu" then
    if self.phase ~= "wait_claim" then return false, "非抢牌" end
    if not self.lastDiscard then return false, "无牌可胡" end
    local tile = self.lastDiscard.tile
    local from = self.lastDiscard.seat
    if not self:_can_hu_with_tile(self.players[seat].hand, tile) then
      return false, "未胡牌"
    end
    self.players[seat].hand[#self.players[seat].hand + 1] = tile
    self.players[seat].hand = T.sort_tiles(self.players[seat].hand)
    if self.lastDiscard.qiangGang then
      if not T.remove_one(self.players[from].hand, tile) then
        return false, "抢杠失败"
      end
      self.pendingBuGang = nil
      self:_do_hu(seat, false, from, { is_qiang_gang = true })
      return true
    end
    local d = self.players[from].discards
    if d[#d] == tile then table.remove(d) end
    if self.cfg.multiHu == "all" then
      return self:_register_hu_claim(seat)
    end
    self:_do_hu(seat, false, from, {})
    return true
  end
  if cmd == "zimo" then
    if self.phase ~= "wait_discard" or seat ~= self.currentSeat then return false, "不能自摸" end
    if not (T.can_hu(self.players[seat].hand) or T.can_jiang_jiang_hu(self.players[seat].hand)) then
      return false, "未胡牌"
    end
    self:_do_hu(seat, true, nil, { is_gang_shang_hua = self.drawn ~= nil })
    return true
  end
  return false, "未知操作 " .. tostring(cmd)
end

--- T027：超时自动出牌/过
function Engine:check_timeout()
  if not self.deadlineAt or os.time() < self.deadlineAt then
    return false
  end
  if self.phase == "wait_discard" then
    local seat = self.currentSeat
    local hand = self.players[seat].hand
    if #hand == 0 then
      self:_clear_deadline()
      return false
    end
    local tile = hand[#hand]
    self:on_action(seat, "discard", { tile = tile })
    return true
  end
  if self.phase == "wait_claim" and #self.claimSeats > 0 then
    local seat = self.claimSeats[1]
    self:on_action(seat, "guo", {})
    return true
  end
  self:_clear_deadline()
  return false
end

function Engine:snapshot(for_seat)
  local seats = {}
  for s = 0, self.cfg.playerCount - 1 do
    local p = self.players[s]
    local sp = {
      seat = s,
      userId = p.userId,
      userName = p.userName,
      isBot = p.isBot,
      handCount = #p.hand,
      melds = p.melds,
      discards = p.discards,
      score = p.score,
      autoPlay = p.autoPlay and true or false,
      disconnected = p.disconnected and true or false,
    }
    if for_seat == s then
      sp.hand = copy_arr(p.hand)
    end
    seats[#seats + 1] = sp
  end
  local qishouOut = nil
  if self.qishou then
    qishouOut = self.qishou.hits
  end
  local now = os.time()
  local deadlineMs = nil
  if self.deadlineAt then
    deadlineMs = math.max(0, (self.deadlineAt - now) * 1000)
  end
  return {
    gameId = self.gameId,
    phase = self.phase,
    round = self.round,
    dealer = self.dealer,
    currentSeat = self.currentSeat,
    wallCount = #self.wall,
    lastDiscard = self.lastDiscard,
    message = self.message,
    seats = seats,
    availableOps = self:_available_ops(for_seat),
    settle = self.settle,
    qishou = qishouOut,
    zhongtu = self.zhongtu,
    drawn = (for_seat == self.currentSeat) and self.drawn or nil,
    scoreLedger = self.scoreLedger,
    rules = { multiHu = self.cfg.multiHu },
    deadlineAt = self.deadlineAt,
    deadlineMs = deadlineMs,
  }
end

function Engine:needs_bot_tick(mode)
  if self.phase == "settle" or self.phase == "finished" or self.phase == "waiting" then
    return false
  end
  if self.phase == "qishou" then
    -- 起手阶段：机器人可自动 continue；托管真人由慢速 tick 处理
    if mode == "autoplay" then
      for s = 0, self.cfg.playerCount - 1 do
        if self:_seat_needs_auto(s, "autoplay") then return true end
      end
      return false
    end
    return true
  end
  if self.phase == "wait_discard" then
    return self:_seat_needs_auto(self.currentSeat, mode)
  end
  if self.phase == "wait_claim" then
    for _, s in ipairs(self.claimSeats) do
      if self:_seat_needs_auto(s, mode) then return true end
    end
  end
  return false
end

function Engine:bot_tick(seat, mode)
  if not self:_seat_needs_auto(seat, mode) then return false end
  if self.phase == "qishou" then
    self:on_action(seat, "continue", {})
    return true
  end
  if self.phase == "wait_discard" and seat == self.currentSeat then
    local ops = self:_ops_discard(seat)
    for _, op in ipairs(ops) do
      if op.action == "zimo" then
        self:on_action(seat, "zimo", {})
        return true
      end
    end
    for _, op in ipairs(ops) do
      if op.action == "bu_gang" then
        self:on_action(seat, "bu_gang", { tile = op.tile })
        return true
      end
    end
    for _, op in ipairs(ops) do
      if op.action == "an_gang" then
        self:on_action(seat, "an_gang", { tile = op.tile })
        return true
      end
    end
    local hand = self.players[seat].hand
    local tile = hand[#hand]
    self:on_action(seat, "discard", { tile = tile })
    return true
  end
  if self.phase == "wait_claim" then
    local in_claim = false
    for _, s in ipairs(self.claimSeats) do
      if s == seat then in_claim = true break end
    end
    if not in_claim then return false end
    local ops = self:_ops_claim(seat)
    for _, op in ipairs(ops) do
      if op.action == "hu" then
        self:on_action(seat, "hu", {})
        return true
      end
    end
    for _, op in ipairs(ops) do
      if op.action == "peng" then
        self:on_action(seat, "peng", {})
        return true
      end
    end
    self:on_action(seat, "guo", {})
    return true
  end
  return false
end

local M = {}

function M.new(opts)
  return Engine.new(opts)
end

function M.register(reg)
  reg.register("changsha_mj", function(opts)
    return Engine.new(opts)
  end)
end

return M
