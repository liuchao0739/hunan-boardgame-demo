import { ClientMessage, ServerMessage } from './Protocol';

type Handler = (msg: ServerMessage) => void;

/**
 * WebSocket 网关客户端 —— 对接 Skynet ws_gate
 * 浏览器预览 / 原生 App / 微信小游戏均可用同一套协议
 */
export class NetClient {
  private ws: WebSocket | null = null;
  private url: string;
  private handler: Handler | null = null;
  private reconnectTimer: number | null = null;
  connected = false;

  constructor(url = 'ws://127.0.0.1:9948') {
    this.url = url;
  }

  onMessage(h: Handler) {
    this.handler = h;
  }

  connect() {
    if (this.ws) {
      try { this.ws.close(); } catch { /* */ }
    }
    const ws = new WebSocket(this.url);
    this.ws = ws;
    ws.onopen = () => {
      this.connected = true;
    };
    ws.onclose = () => {
      this.connected = false;
      this.reconnectTimer = setTimeout(() => this.connect(), 2500) as unknown as number;
    };
    ws.onerror = () => {
      /* onclose will fire */
    };
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(String(ev.data)) as ServerMessage;
        this.handler?.(msg);
      } catch (e) {
        console.error('bad message', e);
      }
    };
  }

  send(msg: ClientMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  dispose() {
    if (this.reconnectTimer != null) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }
}
