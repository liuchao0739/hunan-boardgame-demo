--[[ 简易俱乐部 / 房卡（内存）]]
local M = {}

local clubs = {} -- id -> { id, name, owner, cards, members }
local player_cards = {} -- nick -> cards

local function rand_id()
  local chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  local t = {}
  for _ = 1, 5 do
    t[#t + 1] = chars:sub(math.random(#chars), math.random(#chars))
  end
  -- fix: use proper random
  t = {}
  for _ = 1, 5 do
    local j = math.random(#chars)
    t[#t + 1] = chars:sub(j, j)
  end
  return table.concat(t)
end

function M.ensure_player(nick)
  nick = nick or "玩家"
  if not player_cards[nick] then player_cards[nick] = 20 end -- 新号送 20 房卡
  return player_cards[nick]
end

function M.get_cards(nick)
  return M.ensure_player(nick)
end

function M.cost_card(nick, n)
  n = n or 1
  M.ensure_player(nick)
  if player_cards[nick] < n then return false, "房卡不足"
  end
  player_cards[nick] = player_cards[nick] - n
  return true, player_cards[nick]
end

function M.add_cards(nick, n)
  M.ensure_player(nick)
  player_cards[nick] = player_cards[nick] + (n or 0)
  return player_cards[nick]
end

function M.create_club(nick, name)
  local id = rand_id()
  clubs[id] = {
    id = id,
    name = name or (nick .. "的俱乐部"),
    owner = nick,
    cards = 100,
    members = { nick },
  }
  return clubs[id]
end

function M.get_club(id)
  return clubs[id]
end

function M.list_clubs()
  local out = {}
  for _, c in pairs(clubs) do
    out[#out + 1] = { id = c.id, name = c.name, owner = c.owner, cards = c.cards, members = #c.members }
  end
  return out
end

function M.join_club(id, nick)
  local c = clubs[id]
  if not c then return nil, "俱乐部不存在" end
  for _, m in ipairs(c.members) do
    if m == nick then return c end
  end
  c.members[#c.members + 1] = nick
  return c
end

return M
