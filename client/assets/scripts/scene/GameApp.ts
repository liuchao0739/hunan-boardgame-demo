import {
  _decorator,
  Component,
  Node,
  Label,
  Color,
  UITransform,
  Graphics,
  Vec3,
  Button,
  EventTouch,
  view,
  Widget,
  HorizontalTextAlignment,
  Overflow,
} from 'cc';
import { NetClient } from '../net/NetClient';
import { GameType, PublicRoomState, ServerMessage } from '../net/Protocol';
import { OP_SHORT, SUIT_COLOR, tileFace } from '../game/TileUtil';

const { ccclass, property } = _decorator;

/**
 * 主入口：挂到场景 Canvas 上即可运行（运行时搭建大厅+牌桌 UI）
 * 对接 Skynet ws://127.0.0.1:9948
 */
@ccclass('GameApp')
export class GameApp extends Component {
  @property
  wsUrl = 'ws://127.0.0.1:9948';

  private net!: NetClient;
  private root!: Node;
  private lobby!: Node;
  private table!: Node;
  private statusLabel!: Label;
  private bannerLabel!: Label;
  private handNode!: Node;
  private opsNode!: Node;
  private feltNode!: Node;

  private gameType: GameType = 'changsha_mj';
  private seat: number | null = null;
  private room: PublicRoomState | null = null;
  private selectedIndex = -1;
  private nick = '玩家';

  onLoad() {
    this.root = this.node;
    this.buildUI();
    this.net = new NetClient(this.wsUrl);
    this.net.onMessage((m) => this.onServer(m));
    this.net.connect();
    this.setStatus('连接 Skynet 中…');
  }

  onDestroy() {
    this.net?.dispose();
  }

  private onServer(msg: ServerMessage) {
    if (msg.type === 'hello') {
      this.setStatus(`已连接 · ${msg.stack || 'skynet'}`);
      return;
    }
    if (msg.type === 'error') {
      this.setBanner(msg.message);
      return;
    }
    if (msg.type === 'room_created' || msg.type === 'joined') {
      this.seat = msg.seat;
      this.gameType = msg.gameType;
      this.showTable();
      return;
    }
    if (msg.type === 'state') {
      this.room = msg.state;
      this.gameType = msg.state.gameType;
      this.renderTable();
    }
  }

  private setStatus(t: string) {
    if (this.statusLabel) this.statusLabel.string = t;
  }
  private setBanner(t: string) {
    if (this.bannerLabel) this.bannerLabel.string = t;
  }

  private buildUI() {
    const size = view.getVisibleSize();
    const ui = this.root.getComponent(UITransform) || this.root.addComponent(UITransform);
    ui.setContentSize(size.width, size.height);

    // 背景
    const bg = new Node('BG');
    this.root.addChild(bg);
    const bgUi = bg.addComponent(UITransform);
    bgUi.setContentSize(size.width, size.height);
    const g = bg.addComponent(Graphics);
    g.fillColor = new Color(26, 16, 8, 255);
    g.rect(-size.width / 2, -size.height / 2, size.width, size.height);
    g.fill();

    this.lobby = this.makeLobby(size.width, size.height);
    this.root.addChild(this.lobby);

    this.table = this.makeTable(size.width, size.height);
    this.table.active = false;
    this.root.addChild(this.table);

    const status = this.makeLabel('Status', 18, new Color(180, 220, 180));
    status.setPosition(0, size.height / 2 - 28, 0);
    this.root.addChild(status);
    this.statusLabel = status.getComponent(Label)!;
  }

  private makeLobby(w: number, h: number) {
    const lobby = new Node('Lobby');
    const title = this.makeLabel('Title', 48, new Color(240, 193, 75));
    title.getComponent(Label)!.string = '湘桌棋牌';
    title.setPosition(0, 180, 0);
    lobby.addChild(title);

    const sub = this.makeLabel('Sub', 20, new Color(196, 168, 130));
    sub.getComponent(Label)!.string = 'Cocos Creator 3.8.8  ×  Skynet Lua';
    sub.setPosition(0, 130, 0);
    lobby.addChild(sub);

    lobby.addChild(this.makeBtn('长沙麻将', -120, 40, () => {
      this.gameType = 'changsha_mj';
      this.setBanner('已选：长沙麻将');
    }));
    lobby.addChild(this.makeBtn('邵阳跑胡子', 120, 40, () => {
      this.gameType = 'shaoyang_phz';
      this.setBanner('已选：邵阳跑胡子');
    }));
    lobby.addChild(this.makeBtn('创建房间', 0, -40, () => {
      this.net.send({ type: 'create_room', gameType: this.gameType, nick: this.nick });
    }, true));
    lobby.addChild(this.makeBtn('补机器人并准备', 0, -110, () => {
      this.net.send({ type: 'fill_bots' });
      setTimeout(() => this.net.send({ type: 'ready' }), 200);
    }, true));

    const tip = this.makeLabel('Tip', 16, new Color(140, 120, 90));
    tip.getComponent(Label)!.string = '流程：选玩法 → 创建房间 → 补机器人并准备';
    tip.setPosition(0, -180, 0);
    lobby.addChild(tip);

    const banner = this.makeLabel('Banner', 18, new Color(255, 230, 160));
    banner.setPosition(0, -220, 0);
    lobby.addChild(banner);
    this.bannerLabel = banner.getComponent(Label)!;
    this.bannerLabel.string = '等待操作';
    return lobby;
  }

  private makeTable(w: number, h: number) {
    const table = new Node('Table');

    // 绿毡
    const felt = new Node('Felt');
    table.addChild(felt);
    const fui = felt.addComponent(UITransform);
    fui.setContentSize(Math.min(w - 40, 1100), Math.min(h - 160, 520));
    const fg = felt.addComponent(Graphics);
    fg.fillColor = new Color(13, 107, 69, 255);
    fg.roundRect(-fui.width / 2, -fui.height / 2, fui.width, fui.height, 40);
    fg.fill();
    this.feltNode = felt;

    const banner = this.makeLabel('TableBanner', 20, new Color(255, 233, 160));
    banner.setPosition(0, 80, 0);
    table.addChild(banner);
    // reuse banner label when table shown
    const bl = banner.getComponent(Label)!;

    const hand = new Node('Hand');
    hand.setPosition(0, -h / 2 + 70, 0);
    table.addChild(hand);
    this.handNode = hand;

    const ops = new Node('Ops');
    ops.setPosition(0, -h / 2 + 150, 0);
    table.addChild(ops);
    this.opsNode = ops;

    table.addChild(this.makeBtn('准备/下一局', -140, -h / 2 + 28, () => this.net.send({ type: 'ready' }), true));
    table.addChild(this.makeBtn('补机器人', 0, -h / 2 + 28, () => this.net.send({ type: 'fill_bots' })));
    table.addChild(this.makeBtn('返回', 140, -h / 2 + 28, () => {
      this.table.active = false;
      this.lobby.active = true;
      this.bannerLabel = this.lobby.getChildByName('Banner')!.getComponent(Label)!;
    }));

    // store table banner
    (table as any)._banner = bl;
    return table;
  }

  private showTable() {
    this.lobby.active = false;
    this.table.active = true;
    this.bannerLabel = (this.table as any)._banner;
  }

  private renderTable() {
    const r = this.room;
    if (!r || this.seat == null) return;
    this.bannerLabel.string = `${r.roomId} · ${r.message} · 剩${r.wallCount}`;

    // 手牌
    this.handNode.removeAllChildren();
    const me = r.seats.find((s) => s.seat === this.seat);
    const hand = me?.hand || [];
    const canDiscard = r.availableOps.some((o) => o.action === 'discard');
    const startX = -((hand.length - 1) * 38) / 2;
    hand.forEach((t, idx) => {
      const tile = this.makeTileNode(t, idx === this.selectedIndex);
      tile.setPosition(startX + idx * 38, this.selectedIndex === idx ? 18 : 0, 0);
      if (canDiscard) {
        tile.on(Node.EventType.TOUCH_END, () => {
          if (this.selectedIndex === idx) {
            this.net.send({ type: 'action', action: 'discard', tile: t });
            this.selectedIndex = -1;
          } else {
            this.selectedIndex = idx;
            this.renderTable();
          }
        });
      }
      this.handNode.addChild(tile);
    });

    // 操作
    this.opsNode.removeAllChildren();
    r.availableOps.forEach((op, i) => {
      const short = OP_SHORT[op.action] || op.label;
      const btn = this.makeBtn(short, (i - (r.availableOps.length - 1) / 2) * 90, 0, () => {
        if (op.action === 'discard') {
          if (this.selectedIndex < 0) {
            this.setBanner('请先点选手牌');
            return;
          }
          const tile = hand[this.selectedIndex];
          this.net.send({ type: 'action', action: 'discard', tile });
          this.selectedIndex = -1;
          return;
        }
        this.net.send({ type: 'action', action: op.action, tile: op.tile, tiles: op.tiles });
      }, op.action === 'hu' || op.action === 'zimo');
      this.opsNode.addChild(btn);
    });

    // 中央出牌
    const old = this.feltNode.getChildByName('Last');
    if (old) old.destroy();
    if (r.lastDiscard) {
      const last = this.makeTileNode(r.lastDiscard.tile, false, 1.2);
      last.name = 'Last';
      last.setPosition(0, 0, 0);
      this.feltNode.addChild(last);
    }
  }

  private makeTileNode(t: number, selected: boolean, scale = 1) {
    const n = new Node('Tile');
    const ui = n.addComponent(UITransform);
    ui.setContentSize(34 * scale, 48 * scale);
    const g = n.addComponent(Graphics);
    g.fillColor = new Color(255, 248, 230);
    g.roundRect(-17 * scale, -24 * scale, 34 * scale, 48 * scale, 4);
    g.fill();
    const face = tileFace(this.gameType, t);
    const lab = this.makeLabel('F', 14 * scale, this.hexColor(SUIT_COLOR[face.color]));
    lab.getComponent(Label)!.string = face.rank + '\n' + face.suit;
    lab.getComponent(Label)!.fontSize = 12 * scale;
    lab.getComponent(Label)!.lineHeight = 14 * scale;
    n.addChild(lab);
    if (selected) {
      g.strokeColor = new Color(240, 193, 75);
      g.lineWidth = 3;
      g.roundRect(-17 * scale, -24 * scale, 34 * scale, 48 * scale, 4);
      g.stroke();
    }
    return n;
  }

  private hexColor(hex: string) {
    const h = hex.replace('#', '');
    return new Color(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16));
  }

  private makeLabel(name: string, size: number, color: Color) {
    const n = new Node(name);
    const ui = n.addComponent(UITransform);
    ui.setContentSize(600, size + 10);
    const lab = n.addComponent(Label);
    lab.string = '';
    lab.fontSize = size;
    lab.lineHeight = size + 4;
    lab.color = color;
    lab.horizontalAlign = HorizontalTextAlignment.CENTER;
    lab.overflow = Overflow.NONE;
    return n;
  }

  private makeBtn(text: string, x: number, y: number, cb: () => void, gold = false) {
    const n = new Node('Btn_' + text);
    n.setPosition(x, y, 0);
    const ui = n.addComponent(UITransform);
    ui.setContentSize(160, 48);
    const g = n.addComponent(Graphics);
    g.fillColor = gold ? new Color(240, 193, 75) : new Color(60, 40, 25, 220);
    g.roundRect(-80, -24, 160, 48, 12);
    g.fill();
    const lab = this.makeLabel('L', 18, gold ? new Color(40, 25, 8) : new Color(255, 240, 210));
    lab.getComponent(Label)!.string = text;
    n.addChild(lab);
    n.on(Node.EventType.TOUCH_END, (_e: EventTouch) => cb());
    return n;
  }
}
