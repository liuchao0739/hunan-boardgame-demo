local skynet = require "skynet"
local Store = require "weihai.club_record"

-- Re-bind Store into this unique service process only
local S = Store

local CMD = {}

function CMD.create_club(ownerId, name)
  return S.create_club(ownerId, name)
end

function CMD.join_club(userId, clubId)
  return S.join_club(userId, clubId)
end

function CMD.joined_list(userId)
  return S.joined_list(userId)
end

function CMD.detail(clubId)
  return S.detail(clubId)
end

function CMD.table_list(clubId, page)
  return S.table_list(clubId, page)
end

function CMD.bind_table(clubId, room)
  return S.bind_table(clubId, room)
end

function CMD.add_record(rec)
  return S.add_record(rec)
end

function CMD.add_round(roomUUId, round)
  return S.add_round_detail(roomUUId, round)
end

function CMD.list_records(userId, clubId, page)
  return S.list_records(userId, clubId, page)
end

function CMD.record_detail(uuid)
  return S.record_detail(uuid)
end

function CMD.write_playback(roomId, roundIndex, json)
  return S.write_playback(roomId, roundIndex, json)
end

skynet.start(function()
  skynet.dispatch("lua", function(_, _, cmd, ...)
    local f = CMD[cmd]
    if f then skynet.ret(skynet.pack(f(...)))
    else skynet.ret(skynet.pack(nil, "unknown")) end
  end)
  skynet.error("club_record service ready")
end)
