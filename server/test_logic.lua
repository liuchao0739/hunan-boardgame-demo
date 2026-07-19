#!/usr/bin/env lua
-- 纯 Lua 玩法冒烟（不依赖 Skynet）：lua test_logic.lua
package.path = "./lualib/?.lua;./lualib/?/init.lua;" .. package.path

local MJ = require "game.changsha_mj"
local T = require "game.mj_tiles"
local PHZ = require "game.shaoyang_phz"

local hand = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 22 }
assert(T.is_hu(hand), "mj hu failed")

local g = MJ.new()
g:start()
assert(g.phase == "wait_discard")
assert(#g.players[0].hand == 14)

local p = PHZ.new()
p:start()
assert(#p.players[0].hand == 21)
assert(#p.wall == 80 - 21 - 20 - 20)

print("OK lua game logic")
