import { ClientMessage, ServerMessage } from './Protocol';

type Handler = (msg: ServerMessage) => void;

/**
 * WebSocket 网关客户端 —— 对接 Skynet ws_gate
 * 浏览器 / 微信小游戏 / App 均走 Creator 提供的 WebSocket 封装
 */
export class NetClient {
  private ws: WebSocket | null = null;
  private url: string;
  private handler: Handler | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  connected = false;

  constructor(url = 'ws://127.0.0.1:9948') {
    this.url = url;
  }

  /** 真机/小游戏请改为 wss://你的域名:端口 ，并在微信后台配 socket 合法域名 */
  setUrl(url: string) {
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
      this.reconnectTimer = setTimeout(() => this.connect(), 2500);
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
