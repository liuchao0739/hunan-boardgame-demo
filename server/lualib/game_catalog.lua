--[[ 玩法注册表：座位人数 / 模块 / 展示名 ]]
local ChangshaMJ = require "game.changsha_mj"
local ShaoyangPHZ = require "game.shaoyang_phz"
local DouDiZhu = require "game.doudizhu"
local PaoDeKuai = require "game.paodekuai"

local Catalog = {
  changsha_mj = {
    id = "changsha_mj",
    name = "长沙麻将",
    seats = 4,
    factory = function() return ChangshaMJ.new({ mode = "changsha" }) end,
    module = ChangshaMJ,
  },
  xueliu_mj = {
    id = "xueliu_mj",
    name = "血流成河",
    seats = 4,
    factory = function() return ChangshaMJ.new({ mode = "xueliu", bird_count = 2 }) end,
    module = ChangshaMJ,
  },
  xuezhan_mj = {
    id = "xuezhan_mj",
    name = "血战到底",
    seats = 4,
    factory = function() return ChangshaMJ.new({ mode = "xuezhan", bird_count = 2 }) end,
    module = ChangshaMJ,
  },
  hongzhong_mj = {
    id = "hongzhong_mj",
    name = "红中麻将",
    seats = 4,
    factory = function() return ChangshaMJ.new({ mode = "hongzhong", bird_count = 2 }) end,
    module = ChangshaMJ,
  },
  shaoyang_phz = {
    id = "shaoyang_phz",
    name = "邵阳跑胡子",
    seats = 3,
    factory = function() return ShaoyangPHZ.new() end,
    module = ShaoyangPHZ,
  },
  doudizhu = {
    id = "doudizhu",
    name = "斗地主",
    seats = 3,
    factory = function() return DouDiZhu.new() end,
    module = DouDiZhu,
  },
  paodekuai = {
    id = "paodekuai",
    name = "跑得快",
    seats = 3,
    factory = function() return PaoDeKuai.new() end,
    module = PaoDeKuai,
  },
}

local ORDER = {
  "changsha_mj", "xueliu_mj", "xuezhan_mj", "hongzhong_mj",
  "shaoyang_phz", "doudizhu", "paodekuai",
}

local M = {}

function M.get(game_type)
  return Catalog[game_type] or Catalog.changsha_mj
end

function M.list()
  local out = {}
  for _, id in ipairs(ORDER) do
    local g = Catalog[id]
    out[#out + 1] = { id = g.id, name = g.name, seats = g.seats }
  end
  return out
end

function M.is_mj(game_type)
  return game_type == "changsha_mj" or game_type == "xueliu_mj"
    or game_type == "xuezhan_mj" or game_type == "hongzhong_mj"
end

return M
