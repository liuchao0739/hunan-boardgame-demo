/** @typedef {import('../../src/shared/protocol.ts').PublicRoomState} PublicRoomState */

const CN = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
const PHZ = ["壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖", "拾"];
const OP_SHORT = {
  pass: "过",
  chi: "吃",
  peng: "碰",
  ming_gang: "杠",
  an_gang: "杠",
  bu_gang: "杠",
  ti: "提",
  pao: "跑",
  hu: "胡",
  zimo: "胡",
  discard: "出牌",
};

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function makeTile(gameType, t, size = "") {
  const node = el("div", `tile ${size}`.trim());
  const rank = el("div", "rank");
  const suit = el("div", "suit");

  if (gameType === "changsha_mj") {
    const s = Math.floor(t / 9);
    const r = t % 9;
    node.classList.add(["wan", "tiao", "tong"][s]);
    rank.textContent = CN[r];
    suit.textContent = ["万", "条", "筒"][s];
  } else {
    node.classList.add(t >= 10 ? "big" : "small");
    rank.textContent = PHZ[t % 10];
    suit.textContent = t >= 10 ? "大" : "小";
  }
  node.appendChild(rank);
  node.appendChild(suit);
  return node;
}

function makeBack(size = "mini") {
  return el("div", `tile back ${size}`);
}

const state = {
  ws: null,
  gameType: "changsha_mj",
  roomId: null,
  seat: null,
  selectedTile: null,
  selectedIndex: -1,
  /** @type {PublicRoomState | null} */
  room: null,
};

const $ = (id) => document.getElementById(id);

function setConn(text, ok) {
  const a = $("connStatus");
  const b = $("connStatus2");
  if (a) {
    a.textContent = text;
    a.className = `conn lob-conn ${ok === true ? "ok" : ok === false ? "bad" : ""}`;
  }
  if (b) {
    b.textContent = ok ? "●" : "○";
    b.className = `conn mini ${ok === true ? "ok" : ok === false ? "bad" : ""}`;
  }
}

function connect() {
  // 对接 Skynet 服（默认 9948），与 Cocos 客户端同一协议
  const ws = new WebSocket("ws://127.0.0.1:9948");
  state.ws = ws;
  setConn("连接 Skynet…", null);

  ws.onopen = () => setConn("已连接 · Skynet", true);
  ws.onclose = () => {
    setConn("重连中…", false);
    setTimeout(connect, 2500);
  };
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.type === "error") {
      toast(msg.message);
      return;
    }
    if (msg.type === "hello") {
      setConn("已连接 · Skynet", true);
      return;
    }
    if (msg.type === "room_created" || msg.type === "joined") {
      state.roomId = msg.roomId;
      state.seat = msg.seat;
      state.gameType = msg.gameType;
      showTable();
      return;
    }
    if (msg.type === "state" && msg.state) {
      state.room = msg.state;
      state.gameType = msg.state.gameType;
      render();
    }
  };
}

function send(obj) {
  if (state.ws?.readyState === WebSocket.OPEN) state.ws.send(JSON.stringify(obj));
}

function toast(msg) {
  const b = $("banner");
  if (b) {
    b.textContent = msg;
    b.style.display = "";
  } else {
    alert(msg);
  }
}

function showTable() {
  $("lobby").classList.add("hidden");
  $("table").classList.remove("hidden");
}
function showLobby() {
  $("lobby").classList.remove("hidden");
  $("table").classList.add("hidden");
  state.roomId = null;
  state.seat = null;
  state.room = null;
}

function render() {
  const r = state.room;
  if (!r) return;

  $("metaRoom").textContent = r.roomId;
  $("metaGame").textContent = r.gameType === "changsha_mj" ? "长沙麻将" : "邵阳跑胡子";
  $("metaWall").textContent = `剩 ${r.wallCount}`;
  $("metaRound").textContent = `第 ${r.round} 局`;
  $("banner").textContent = humanPhase(r);
  $("wallChip").textContent = `牌墙 ${r.wallCount}`;

  renderSeats(r);
  renderCenter(r);
  renderHand(r);
  renderOps(r);
  renderSettle(r);
}

function humanPhase(r) {
  const map = {
    waiting: "等待准备开局",
    wait_discard: "请出牌",
    wait_claim: "有人可吃碰杠胡…",
    playing: "对局中",
    finished: "本局结束",
    settle: "结算中",
  };
  if (r.phase === "wait_discard" && r.currentSeat === state.seat) return "轮到你出牌 · 点选后点出牌，或双击";
  if (r.phase === "wait_discard") return `等待座位 ${r.currentSeat} 出牌`;
  if (r.phase === "wait_claim" && r.availableOps.length) return "你可以吃 / 碰 / 杠 / 胡";
  return r.message || map[r.phase] || r.phase;
}

function seatLayout(n) {
  if (n === 4) {
    return {
      top: (state.seat + 2) % 4,
      left: (state.seat + 3) % 4,
      right: (state.seat + 1) % 4,
      bottom: state.seat,
    };
  }
  return {
    top: null,
    left: (state.seat + 1) % 3,
    right: (state.seat + 2) % 3,
    bottom: state.seat,
  };
}

function renderPlayerChip(s, isTurn) {
  const wrap = el("div", "");
  const chip = el("div", `player-chip${isTurn ? " turn" : ""}`);
  const av = el("div", `avatar${s.isBot ? " bot" : ""}`, (s.nick || "?").slice(0, 1));
  const info = el("div", "pinfo");
  info.appendChild(el("div", "nm", `${s.nick}${s.isBot ? "" : ""}`));
  info.appendChild(el("div", "sc", `${s.score}分 · ${s.handCount}张`));
  chip.appendChild(av);
  chip.appendChild(info);
  wrap.appendChild(chip);

  if (s.melds?.length) {
    const melds = el("div", "melds-row");
    for (const m of s.melds) {
      const g = el("div", "meld-group");
      for (const t of m.tiles) g.appendChild(makeTile(state.gameType, t, "mini"));
      melds.appendChild(g);
    }
    wrap.appendChild(melds);
  }

  const disc = el("div", "discards");
  const shown = s.discards.slice(-16);
  for (const t of shown) disc.appendChild(makeTile(state.gameType, t, "mini"));
  wrap.appendChild(disc);
  return wrap;
}

function renderSeats(r) {
  const L = seatLayout(r.seats.length);
  const map = [
    ["seatTop", L.top],
    ["seatLeft", L.left],
    ["seatRight", L.right],
  ];
  for (const [id, seat] of map) {
    const box = $(id);
    box.innerHTML = "";
    if (seat == null) {
      box.style.display = "none";
      continue;
    }
    box.style.display = "";
    box.appendChild(renderPlayerChip(r.seats[seat], r.currentSeat === seat));
  }

  // 自己的副露
  const melds = $("myMelds");
  melds.innerHTML = "";
  const me = r.seats[state.seat];
  for (const m of me.melds || []) {
    const g = el("div", "meld-group");
    for (const t of m.tiles) g.appendChild(makeTile(r.gameType, t, "mini"));
    melds.appendChild(g);
  }
}

function renderCenter(r) {
  const stage = $("centerStage");
  // keep wall chip, replace last discard
  [...stage.querySelectorAll(".last-discard")].forEach((n) => n.remove());
  if (r.lastDiscard) {
    const t = makeTile(r.gameType, r.lastDiscard.tile, "lg");
    t.classList.add("last-discard");
    stage.appendChild(t);
  }
}

function renderHand(r) {
  const hand = $("hand");
  hand.innerHTML = "";
  const me = r.seats[state.seat];
  if (!me?.hand) return;
  const canDiscard = r.availableOps.some((o) => o.action === "discard");

  me.hand.forEach((t, idx) => {
    const tile = makeTile(r.gameType, t, "lg");
    if (canDiscard) {
      tile.classList.add("selectable");
      if (state.selectedIndex === idx) tile.classList.add("selected");
      tile.onclick = () => {
        if (state.selectedIndex === idx) {
          // 再点一次出牌
          send({ type: "action", action: "discard", tile: t });
          state.selectedIndex = -1;
          state.selectedTile = null;
          return;
        }
        state.selectedIndex = idx;
        state.selectedTile = t;
        renderHand(r);
        renderOps(r);
      };
      tile.ondblclick = () => {
        send({ type: "action", action: "discard", tile: t });
        state.selectedIndex = -1;
        state.selectedTile = null;
      };
    }
    hand.appendChild(tile);
  });
}

function renderOps(r) {
  const ops = $("ops");
  ops.innerHTML = "";
  for (const op of r.availableOps) {
    const short = OP_SHORT[op.action] || op.label;
    const btn = el("button", `op-btn ${op.action}`, short);
    btn.title = op.label;
    btn.onclick = () => {
      if (op.action === "discard") {
        if (state.selectedTile == null) {
          toast("先点选一张手牌");
          return;
        }
        send({ type: "action", action: "discard", tile: state.selectedTile });
        state.selectedTile = null;
        state.selectedIndex = -1;
        return;
      }
      send({ type: "action", action: op.action, tile: op.tile, tiles: op.tiles });
    };
    ops.appendChild(btn);
  }
}

function renderSettle(r) {
  const mask = $("settleMask");
  const card = $("settle");
  if (r.settle) {
    mask.classList.remove("hidden");
    card.textContent = r.settle.detail;
  } else {
    mask.classList.add("hidden");
  }
}

// lobby
let picked = "changsha_mj";
document.querySelectorAll(".pick").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".pick").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    picked = btn.getAttribute("data-game");
  });
});

$("btnCreate").onclick = () =>
  send({ type: "create_room", gameType: picked, nick: $("nick").value.trim() || "玩家" });
$("btnJoin").onclick = () => {
  const roomId = $("roomInput").value.trim();
  if (!roomId) return toast("请输入房间号");
  send({ type: "join_room", roomId, nick: $("nick").value.trim() || "玩家" });
};
$("btnBots").onclick = () => send({ type: "fill_bots" });
$("btnReady").onclick = () => send({ type: "ready" });
$("btnLeave").onclick = () => showLobby();
$("settleMask").onclick = (e) => {
  if (e.target === $("settleMask")) $("settleMask").classList.add("hidden");
};

connect();
