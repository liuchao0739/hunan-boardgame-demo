/** @typedef {import('../../src/shared/protocol.ts').PublicRoomState} PublicRoomState */

const MJ_NAMES = (() => {
  const suits = ["万", "条", "筒"];
  const map = {};
  for (let t = 0; t < 27; t++) {
    map[t] = `${(t % 9) + 1}${suits[Math.floor(t / 9)]}`;
  }
  return map;
})();

const PHZ_CN = ["壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖", "拾"];
function phzName(t) {
  return `${t >= 10 ? "大" : "小"}${PHZ_CN[t % 10]}`;
}

function tileLabel(gameType, t) {
  return gameType === "changsha_mj" ? MJ_NAMES[t] : phzName(t);
}

function tileClass(gameType, t) {
  if (gameType === "changsha_mj") {
    return ["wan", "tiao", "tong"][Math.floor(t / 9)];
  }
  return t >= 10 ? "big" : "small";
}

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

const state = {
  ws: null,
  gameType: "changsha_mj",
  roomId: null,
  seat: null,
  selectedTile: null,
  /** @type {PublicRoomState | null} */
  room: null,
};

const $ = (id) => document.getElementById(id);

function connect() {
  const proto = location.protocol === "https:" ? "wss" : "ws";
  const ws = new WebSocket(`${proto}://${location.host}/ws`);
  state.ws = ws;
  const status = $("connStatus");
  status.textContent = "连接中…";
  status.className = "conn";

  ws.onopen = () => {
    status.textContent = "已连接";
    status.className = "conn ok";
  };
  ws.onclose = () => {
    status.textContent = "已断开，3s 重连…";
    status.className = "conn bad";
    setTimeout(connect, 3000);
  };
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.type === "error") {
      alert(msg.message);
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
  if (state.ws?.readyState === WebSocket.OPEN) {
    state.ws.send(JSON.stringify(obj));
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

  $("metaRoom").textContent = `房间 ${r.roomId}`;
  $("metaGame").textContent =
    r.gameType === "changsha_mj" ? "长沙麻将" : "邵阳跑胡子";
  $("metaWall").textContent = `牌墙 ${r.wallCount}`;
  $("metaPhase").textContent = `阶段 ${r.phase} · 第 ${r.round} 局`;
  $("banner").textContent = r.message || "—";
  $("mySeat").textContent = `（座位 ${state.seat}）`;

  renderArena(r);
  renderHand(r);
  renderOps(r);

  const settle = $("settle");
  if (r.settle) {
    settle.classList.remove("hidden");
    settle.textContent = r.settle.detail;
  } else {
    settle.classList.add("hidden");
  }
}

function renderArena(r) {
  const arena = $("arena");
  arena.innerHTML = "";
  const n = r.seats.length;
  // 布局：上对家，左右邻家，中间出牌
  const order =
    n === 4
      ? [
          { seat: (state.seat + 2) % 4, pos: "top", style: "grid-column:2;grid-row:1" },
          { seat: (state.seat + 3) % 4, pos: "left", style: "grid-column:1;grid-row:2" },
          { seat: (state.seat + 1) % 4, pos: "right", style: "grid-column:3;grid-row:2" },
          { seat: state.seat, pos: "bottom", style: "grid-column:2;grid-row:3" },
        ]
      : [
          { seat: (state.seat + 1) % 3, pos: "left", style: "grid-column:1;grid-row:1" },
          { seat: (state.seat + 2) % 3, pos: "right", style: "grid-column:3;grid-row:1" },
          { seat: state.seat, pos: "bottom", style: "grid-column:2;grid-row:3" },
        ];

  for (const o of order) {
    const s = r.seats[o.seat];
    const card = el("div", `seat-card${r.currentSeat === o.seat ? " active" : ""}`);
    card.style.cssText = o.style;
    card.appendChild(el("div", "name", `${s.nick}${s.isBot ? " · bot" : ""}`));
    card.appendChild(
      el("div", "sub", `座${o.seat} · 手牌${s.handCount} · 分${s.score}${s.ready ? " · 已准备" : ""}`),
    );
    const melds = el("div", "melds");
    for (const m of s.melds) {
      for (const t of m.tiles) melds.appendChild(makeTile(r.gameType, t, true));
      melds.appendChild(document.createTextNode(" "));
    }
    card.appendChild(melds);
    const disc = el("div", "discards");
    for (const t of s.discards.slice(-12)) {
      disc.appendChild(makeTile(r.gameType, t, true));
    }
    card.appendChild(disc);
    arena.appendChild(card);
  }

  const center = el("div", "center-pile");
  center.style.cssText = "grid-column:2;grid-row:2";
  if (r.lastDiscard) {
    center.appendChild(el("div", "sub", `最新出牌 · 座位 ${r.lastDiscard.seat}`));
    const t = makeTile(r.gameType, r.lastDiscard.tile, false);
    t.classList.add("last-tile");
    center.appendChild(t);
  } else {
    center.appendChild(el("div", "sub", "牌桌中央"));
  }
  arena.appendChild(center);
}

function makeTile(gameType, t, mini) {
  const node = el("div", `tile ${tileClass(gameType, t)}${mini ? " mini" : ""}`, tileLabel(gameType, t));
  return node;
}

function renderHand(r) {
  const hand = $("hand");
  hand.innerHTML = "";
  const me = r.seats[state.seat];
  if (!me?.hand) return;
  const canDiscard = r.availableOps.some((o) => o.action === "discard");
  for (const t of me.hand) {
    const tile = makeTile(r.gameType, t, false);
    if (canDiscard) {
      tile.classList.add("selectable");
      if (state.selectedTile === t) tile.classList.add("selected");
      tile.onclick = () => {
        state.selectedTile = t;
        renderHand(r);
      };
      tile.ondblclick = () => {
        send({ type: "action", action: "discard", tile: t });
        state.selectedTile = null;
      };
    }
    hand.appendChild(tile);
  }
}

function renderOps(r) {
  const ops = $("ops");
  ops.innerHTML = "";
  for (const op of r.availableOps) {
    const btn = el("button", "", op.label);
    if (op.action === "hu" || op.action === "zimo") btn.classList.add("op-win");
    btn.onclick = () => {
      if (op.action === "discard") {
        if (state.selectedTile == null) {
          alert("请先点选手牌，再点出牌（或双击手牌）");
          return;
        }
        send({ type: "action", action: "discard", tile: state.selectedTile });
        state.selectedTile = null;
        return;
      }
      send({
        type: "action",
        action: op.action,
        tile: op.tile,
        tiles: op.tiles,
      });
    };
    ops.appendChild(btn);
  }
}

// lobby bindings
let picked = "changsha_mj";
document.querySelectorAll(".pick").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".pick").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    picked = btn.getAttribute("data-game");
  });
});

$("btnCreate").onclick = () => {
  send({
    type: "create_room",
    gameType: picked,
    nick: $("nick").value.trim() || "玩家",
  });
};
$("btnJoin").onclick = () => {
  const roomId = $("roomInput").value.trim();
  if (!roomId) return alert("请输入房间号");
  send({ type: "join_room", roomId, nick: $("nick").value.trim() || "玩家" });
};
$("btnBots").onclick = () => send({ type: "fill_bots" });
$("btnReady").onclick = () => send({ type: "ready" });
$("btnLeave").onclick = () => showLobby();

connect();
