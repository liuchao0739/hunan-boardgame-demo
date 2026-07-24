-- Minimal protobuf3 wire codec (sint32 / int32 / int64 / string / bool / repeated)
-- Enough for Weihai MsgBus wire-compat without external deps.

local M = {}

local function zigzag_encode(n)
  n = math.floor(n)
  if n >= 0 then
    return n * 2
  else
    return -n * 2 - 1
  end
end

local function zigzag_decode(n)
  local sign = n % 2
  n = math.floor(n / 2)
  if sign == 1 then
    return -n - 1
  end
  return n
end

local function encode_varint(n)
  n = math.floor(n)
  if n < 0 then
    -- treat as uint64 low bits for negative (not used for our sint path)
    n = n + 2 ^ 64
  end
  local bytes = {}
  while n >= 0x80 do
    bytes[#bytes + 1] = string.char((n % 256) | 0x80)
    n = math.floor(n / 128)
  end
  bytes[#bytes + 1] = string.char(n % 256)
  return table.concat(bytes)
end

local function decode_varint(buf, i)
  local result, shift = 0, 0
  while true do
    local b = string.byte(buf, i)
    if not b then error("varint truncated") end
    i = i + 1
    result = result + (b % 128) * (2 ^ shift)
    if b < 0x80 then
      return math.floor(result), i
    end
    shift = shift + 7
  end
end

local function key(field, wt)
  return encode_varint(field * 8 + wt)
end

function M.encode_sint32(field, v)
  if v == nil then return "" end
  return key(field, 0) .. encode_varint(zigzag_encode(v))
end

function M.encode_int32(field, v)
  if v == nil then return "" end
  if v < 0 then
    -- encode as 10-byte two's complement varint is complex; use zigzag-free unsigned wrap
    -- for our protocols positive ints dominate
    v = v + 2 ^ 32
  end
  return key(field, 0) .. encode_varint(v)
end

function M.encode_int64(field, v)
  return M.encode_int32(field, v)
end

function M.encode_bool(field, v)
  if v == nil then return "" end
  return key(field, 0) .. encode_varint(v and 1 or 0)
end

function M.encode_string(field, s)
  if s == nil or s == "" then return "" end
  local raw = s
  return key(field, 2) .. encode_varint(#raw) .. raw
end

function M.encode_bytes(field, s)
  return M.encode_string(field, s)
end

function M.encode_message(field, body)
  if not body or #body == 0 then return "" end
  return key(field, 2) .. encode_varint(#body) .. body
end

function M.decode(buf)
  local i = 1
  local fields = {}
  while i <= #buf do
    local tag
    tag, i = decode_varint(buf, i)
    local field = math.floor(tag / 8)
    local wt = tag % 8
    if wt == 0 then
      local v
      v, i = decode_varint(buf, i)
      fields[field] = fields[field] or {}
      table.insert(fields[field], { kind = "varint", raw = v })
    elseif wt == 2 then
      local len
      len, i = decode_varint(buf, i)
      local s = string.sub(buf, i, i + len - 1)
      i = i + len
      fields[field] = fields[field] or {}
      table.insert(fields[field], { kind = "bytes", raw = s })
    else
      error("unsupported wire type " .. wt)
    end
  end
  return fields
end

function M.get_sint32(fields, field, default)
  local arr = fields[field]
  if not arr or not arr[1] then return default end
  return zigzag_decode(arr[1].raw)
end

function M.get_int32(fields, field, default)
  local arr = fields[field]
  if not arr or not arr[1] then return default end
  return arr[1].raw
end

function M.get_string(fields, field, default)
  local arr = fields[field]
  if not arr or not arr[1] then return default or "" end
  return arr[1].raw
end

function M.get_bool(fields, field, default)
  local arr = fields[field]
  if not arr or not arr[1] then return default end
  return arr[1].raw ~= 0
end

function M.get_repeated_bytes(fields, field)
  local arr = fields[field]
  if not arr then return {} end
  local out = {}
  for _, e in ipairs(arr) do
    out[#out + 1] = e.raw
  end
  return out
end

--- Frame: uint16be(2+bodyLen) + uint16be(msgCode) + body
function M.pack_frame(msg_code, body)
  body = body or ""
  local len = 2 + #body
  return string.char(
    math.floor(len / 256) % 256, len % 256,
    math.floor(msg_code / 256) % 256, msg_code % 256
  ) .. body
end

function M.unpack_frame(data)
  if type(data) ~= "string" or #data < 4 then
    return nil, "short frame"
  end
  local b1, b2, b3, b4 = string.byte(data, 1, 4)
  local len = b1 * 256 + b2
  local code = b3 * 256 + b4
  local body = string.sub(data, 5)
  -- len is sizeof(msgCode)+body = 2+#body; tolerate mismatches
  return code, body, len
end

return M
