import express from "express";
import { createServer } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ClientMessage, GameType } from "../shared/protocol.js";
import { RoomManager } from "./room.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const PORT = Number(process.env.PORT) || 3789;

const app = express();
app.use(express.static(path.join(root, "public")));

const server = createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });
const manager = new RoomManager();

interface SockState {
  roomId?: string;
  seat?: number;
}

wss.on("connection", (ws) => {
  const state: SockState = {};
  const send = (data: unknown) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  };

  send({
    type: "state",
    state: null,
    hello: "welcome",
    message: "请创建或加入房间",
  });

  ws.on("message", (raw) => {
    let msg: ClientMessage;
    try {
      msg = JSON.parse(String(raw)) as ClientMessage;
    } catch {
      send({ type: "error", message: "消息格式错误" });
      return;
    }

    try {
      if (msg.type === "ping") {
        send({ type: "pong" });
        return;
      }

      if (msg.type === "create_room") {
        const gameType = (msg.gameType || "changsha_mj") as GameType;
        const { room, seat } = manager.create(gameType, msg.nick || "玩家", send);
        state.roomId = room.id;
        state.seat = seat;
        // 覆盖 send 绑定到当前连接
        room.seats[seat]!.send = send;
        send({
          type: "room_created",
          roomId: room.id,
          seat,
          gameType: room.gameType,
        });
        room.broadcastState();
        return;
      }

      if (msg.type === "join_room") {
        const { room, seat } = manager.join(msg.roomId, msg.nick || "玩家", send);
        state.roomId = room.id;
        state.seat = seat;
        room.seats[seat]!.send = send;
        send({
          type: "joined",
          roomId: room.id,
          seat,
          gameType: room.gameType,
        });
        room.broadcastState();
        return;
      }

      const room = state.roomId ? manager.rooms.get(state.roomId) : undefined;
      if (!room || state.seat === undefined) {
        send({ type: "error", message: "请先加入房间" });
        return;
      }

      if (msg.type === "fill_bots") {
        room.fillBots();
        room.broadcastState();
        return;
      }

      if (msg.type === "ready") {
        room.setReady(state.seat);
        if (room.game.phase === "finished" || room.game.phase === "waiting") {
          room.nextRound();
        }
        room.tryStart();
        room.broadcastState();
        return;
      }

      if (msg.type === "action") {
        const err = room.applyAction(state.seat, msg.action, {
          tile: msg.tile,
          tiles: msg.tiles,
        });
        if (err) send({ type: "error", message: err });
        return;
      }
    } catch (e) {
      send({ type: "error", message: e instanceof Error ? e.message : String(e) });
    }
  });

  ws.on("close", () => {
    // Demo：断线不拆房，便于刷新重连说明写在 README
  });
});

server.listen(PORT, () => {
  console.log(`湖南棋牌 Demo 已启动 → http://localhost:${PORT}`);
  console.log(`WebSocket → ws://localhost:${PORT}/ws`);
});
