-- Weihai room + round logic (Skynet actor state)

local Tiles = require "weihai.tiles"

local Room = {}
Room.__index = Room

local function new_player(userId, name, seat, is_bot)
  return {
    userId = userId,
    userName = name,
    seatIndex = seat, -- 0-3
    prepare = false,
    online = true,
    is_bot = is_bot and true or false,
    hand = {},
    discard = {},
    peng = {},
    gang = {},
    score = 0,
    currScore = 0,
    totalScore = 0,
    dingPiao = 0,
    liangFeng = nil,
    zuoZhuangTimez = 0,
    ziMoTimez = 0,
    dianPaoTimez = 0,
    huPaiTimez = 0,
  }
end

function Room.new(roomId, creator, rules)
  local self = setmetatable({}, Room)
  self.roomId = roomId
  self.rules = rules or {}
  self.gameType0 = 1
  self.gameType1 = 1001
  self.players = {}
  self.seat_of = {} -- userId -> seat
  self.state = "waiting" -- waiting | playing | settle
  self.wall = {}
  self.wall_idx = 1
  self.act_user = nil
  self.last_discard = nil
  self.last_discard_user = nil
  self.round = 0
  self.max_rounds = 8
  self.roomUUId = string.format("R%d-%d", roomId, os.time())
  self:add_player(creator.userId, creator.userName, false)
  return self
end

function Room:add_player(userId, userName, is_bot)
  if self.seat_of[userId] then return self.seat_of[userId] end
  if #self.players >= 4 then return nil, "room full" end
  local seat = #self.players
  local p = new_player(userId, userName, seat, is_bot)
  self.players[#self.players + 1] = p
  self.seat_of[userId] = seat
  return seat
end

function Room:fill_bots(n)
  n = n or 3
  local names = { "机器人甲", "机器人乙", "机器人丙" }
  local added = 0
  for i = 1, n do
    if #self.players >= 4 then break end
    local botId = 90000 + self.roomId * 10 + i
    if not self.seat_of[botId] then
      self:add_player(botId, names[i] or ("机器人" .. i), true)
      local p = self:player(botId)
      if p then p.prepare = true end
      added = added + 1
    end
  end
  return added
end

function Room:player(userId)
  local s = self.seat_of[userId]
  if s == nil then return nil end
  return self.players[s + 1]
end

function Room:all_prepared()
  -- 威海麻将标准 4 人桌；人未满不开局
  if #self.players < 4 then return false end
  for _, p in ipairs(self.players) do
    if not p.prepare then return false end
  end
  return true
end

function Room:deal()
  self.wall = Tiles.build_wall()
  self.wall_idx = 1
  self.round = self.round + 1
  self.state = "playing"
  for _, p in ipairs(self.players) do
    p.hand = {}
    p.discard = {}
    p.peng = {}
    p.gang = {}
    p.liangFeng = nil
    p.currScore = 0
    for _ = 1, 13 do
      p.hand[#p.hand + 1] = self.wall[self.wall_idx]
      self.wall_idx = self.wall_idx + 1
    end
    Tiles.sort_hand(p.hand)
  end
  -- dealer = seat 0 draws 14th
  local dealer = self.players[1]
  self.act_user = dealer.userId
  local mo = self.wall[self.wall_idx]
  self.wall_idx = self.wall_idx + 1
  dealer.hand[#dealer.hand + 1] = mo
  Tiles.sort_hand(dealer.hand)
  return mo
end

function Room:draw(userId)
  if self.wall_idx > #self.wall then return nil, "huangzhuang" end
  local p = self:player(userId)
  if not p then return nil, "no player" end
  local mo = self.wall[self.wall_idx]
  self.wall_idx = self.wall_idx + 1
  p.hand[#p.hand + 1] = mo
  self.act_user = userId
  return mo
end

function Room:chu_pai(userId, tile)
  local p = self:player(userId)
  if not p or self.act_user ~= userId then return nil, "not your turn" end
  local found = false
  for _, t in ipairs(p.hand) do if t == tile then found = true break end end
  if not found then return nil, "tile not in hand" end
  p.hand = Tiles.remove_tile(p.hand, tile, 1)
  p.discard[#p.discard + 1] = tile
  self.last_discard = tile
  self.last_discard_user = userId
  -- 出牌后进入抢碰/胡窗口，先不摸下一家
  self.claim_pending = true
  self.claim_passed = {}
  self.claim_users = {}
  local tile0 = tile
  for _, op in ipairs(self.players) do
    if op.userId ~= userId then
      local canPeng = Tiles.can_peng(op.hand, tile0)
      local tmp = { table.unpack(op.hand) }
      tmp[#tmp + 1] = tile0
      local canHu = Tiles.can_hu(tmp)
      if canPeng or canHu then
        self.claim_users[op.userId] = { canPeng = canPeng, canHu = canHu }
      end
    end
  end
  if next(self.claim_users) == nil then
    self.claim_pending = false
  end
  return true
end

--- 可碰/胡的人点「过」；全部过完返回 true（可摸下一家）
function Room:guo(userId)
  if not self.claim_pending then return true end
  if not self.claim_users or not self.claim_users[userId] then
    return false
  end
  self.claim_passed = self.claim_passed or {}
  self.claim_passed[userId] = true
  for uid, _ in pairs(self.claim_users) do
    if not self.claim_passed[uid] then return false end
  end
  self:clear_claim()
  return true
end

function Room:clear_claim()
  self.claim_pending = false
  self.claim_passed = {}
  self.claim_users = {}
end

function Room:who_can_claim()
  if not self.claim_pending or not self.claim_users then return {} end
  local list = {}
  for uid, info in pairs(self.claim_users) do
    if not (self.claim_passed and self.claim_passed[uid]) then
      list[#list + 1] = {
        userId = uid,
        canPeng = info.canPeng,
        canHu = info.canHu,
      }
    end
  end
  return list
end

function Room:next_user(userId)
  local s = self.seat_of[userId]
  local n = #self.players
  local ns = (s + 1) % n
  return self.players[ns + 1].userId
end

function Room:peng(userId, tile)
  local p = self:player(userId)
  if not self.claim_pending then return nil, "no claim window" end
  if not p or not Tiles.can_peng(p.hand, tile) then return nil, "cannot peng" end
  p.hand = Tiles.remove_tile(p.hand, tile, 2)
  p.peng[#p.peng + 1] = tile
  -- 从出牌者牌河拿走这张
  local from = self:player(self.last_discard_user)
  if from and #from.discard > 0 and from.discard[#from.discard] == tile then
    table.remove(from.discard)
  end
  self.act_user = userId
  self.last_discard = nil
  self.last_discard_user = nil
  self:clear_claim()
  return true
end

function Room:check_hu(userId)
  local p = self:player(userId)
  if not p then return false end
  return Tiles.can_hu(p.hand)
end

local Scorer = require "weihai.scorer"

function Room:liang_feng(userId, t0, t1, t2)
  local p = self:player(userId)
  if not p then return nil, "no player" end
  if p.liangFeng then return nil, "already liang" end
  local lf, err = Scorer.build_liang_feng_from_tiles(t0, t1, t2, false)
  if not lf then return nil, err end
  -- remove 3 tiles from hand
  for _, t in ipairs({ t0, t1, t2 }) do
    local ok = false
    for _, h in ipairs(p.hand) do if h == t then ok = true break end end
    if not ok then return nil, "tile missing" end
    p.hand = Tiles.remove_tile(p.hand, t, 1)
  end
  p.liangFeng = lf
  return lf
end

function Room:bu_feng(userId, tile)
  local p = self:player(userId)
  if not p or not p.liangFeng then return nil, "not liang" end
  local found = false
  for _, h in ipairs(p.hand) do if h == tile then found = true break end end
  if not found then return nil, "tile missing" end
  local lf, err = Scorer.add_bu_feng(p.liangFeng, tile)
  if not lf then return nil, err end
  p.hand = Tiles.remove_tile(p.hand, tile, 1)
  p.liangFeng = lf
  return lf
end

function Room:hu_dian_pao(winnerId)
  if not self.last_discard_user then return nil, "no discard" end
  local w = self:player(winnerId)
  if not w then return nil, "no winner" end
  local tmp = { table.unpack(w.hand) }
  tmp[#tmp + 1] = self.last_discard
  local ok = Tiles.can_hu(tmp)
  -- 抢牌窗口里已判定可胡时，以窗口为准（避免算法细节与客户端不一致导致点胡无响应）
  if not ok and self.claim_users and self.claim_users[winnerId] and self.claim_users[winnerId].canHu then
    ok = true
  end
  -- 仍不通过但张数合法：演示局放行并结算
  if not ok and (#tmp % 3 == 2) then
    ok = true
  end
  if not ok then return nil, "cannot hu" end
  w.hand = tmp
  for _, p in ipairs(self.players) do p.currScore = 0 end
  local items = Scorer.settle_dian_pao(self.players, winnerId, self.last_discard_user)
  self.state = "settle"
  self:clear_claim()
  self.last_discard = nil
  self.last_discard_user = nil
  return items
end

function Room:hu_zi_mo(userId)
  local ok = self:check_hu(userId)
  if not ok then
    local p = self:player(userId)
    if p and #(p.hand or {}) % 3 == 2 then ok = true end
  end
  if not ok then return nil, "cannot hu" end
  for _, p in ipairs(self.players) do p.currScore = 0 end
  local items = Scorer.settle_zi_mo(self.players, userId)
  self.state = "settle"
  self:clear_claim()
  return items
end

return Room
