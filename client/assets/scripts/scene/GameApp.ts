import {
  _decorator,
  Component,
  Node,
  Label,
  Color,
  UITransform,
  Graphics,
  EventTouch,
  view,
  HorizontalTextAlignment,
  Overflow,
  Layers,
  director,
  tween,
  Vec3,
  UIOpacity,
  Sprite,
  SpriteFrame,
  resources,
} from 'cc';
import { NetClient } from '../net/NetClient';
import { GameType, PublicRoomState, SeatPublic, ServerMessage } from '../net/Protocol';
import { OP_SHORT, SUIT_COLOR, mjSpriteKey, tileFace } from '../game/TileUtil';

const { ccclass, property } = _decorator;

/**
 * 湘桌 · Cocos 牌桌入口（观感 + 流程优化版）
 * Skynet: ws://127.0.0.1:9948
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
  private toastLabel!: Label;
  private handNode!: Node;
  private opsNode!: Node;
  private feltNode!: Node;
  private seatNodes: Record<string, Node> = {};
  private centerInfo!: Label;

  private gameType: GameType = 'changsha_mj';
  private seat: number | null = null;
  private room: PublicRoomState | null = null;
  private selectedIndex = -1;
  private nick = '玩家';
  private starting = false;
  private pickMj!: Node;
  private pickPhz!: Node;
  private pickDdz!: Node;
  /** 斗地主多选下标 */
  private selectedSet = new Set<number>();

  onLoad() {
    this.root = this.node;
    this.root.layer = Layers.Enum.UI_2D;
    this.disable3DCamera();
    try {
      this.buildUI();
      this.net = new NetClient(this.wsUrl || 'ws://127.0.0.1:9948');
      this.net.onMessage((m) => this.onServer(m));
      this.net.connect();
      this.setStatus('正在连接服务器…');
    } catch (e) {
      console.error('[GameApp] init failed', e);
    }
  }

  private disable3DCamera() {
    const scene = director.getScene();
    if (!scene) return;
    const walk = (n: Node) => {
      if (n.name === 'Main Camera' || n.name === 'Main Light') n.active = false;
      for (const c of n.children) walk(c);
    };
    walk(scene);
  }

  onDestroy() {
    this.net?.dispose();
  }

  private markUI(n: Node) {
    n.layer = Layers.Enum.UI_2D;
    for (const c of n.children) this.markUI(c);
  }

  private onServer(msg: ServerMessage) {
    if (msg.type === 'hello') {
      this.setStatus('● 已连接');
      this.toast('服务器就绪，可以开局');
      return;
    }
    if (msg.type === 'error') {
      this.toast(msg.message);
      this.starting = false;
      return;
    }
    if (msg.type === 'room_created' || msg.type === 'joined') {
      this.seat = msg.seat;
      this.gameType = msg.gameType;
      this.showTable();
      // 一键开局：进房后自动补机器人并准备
      if (this.starting) {
        this.net.send({ type: 'fill_bots' });
        setTimeout(() => {
          this.net.send({ type: 'ready' });
          this.starting = false;
        }, 180);
      }
      return;
    }
    if (msg.type === 'state') {
      this.room = msg.state;
      this.gameType = msg.state.gameType;
      this.renderAll();
    }
  }

  private setStatus(t: string) {
    if (this.statusLabel) this.statusLabel.string = t;
  }

  private toast(t: string) {
    if (!this.toastLabel) return;
    this.toastLabel.string = t;
    const n = this.toastLabel.node;
    let op = n.getComponent(UIOpacity);
    if (!op) op = n.addComponent(UIOpacity);
    op.opacity = 255;
    tween(op).delay(2.2).to(0.35, { opacity: 0 }).start();
  }

  // ——— UI 搭建 ———

  private buildUI() {
    const size = view.getVisibleSize();
    const ui = this.root.getComponent(UITransform) || this.root.addComponent(UITransform);
    ui.setContentSize(size.width, size.height);

    const bg = this.rectNode('BG', size.width, size.height, new Color(18, 12, 8));
    this.root.addChild(bg);

    this.lobby = this.makeLobby(size.width, size.height);
    this.root.addChild(this.lobby);

    this.table = this.makeTable(size.width, size.height);
    this.table.active = false;
    this.root.addChild(this.table);

    const status = this.makeLabel('Status', 16, new Color(120, 220, 160));
    status.setPosition(0, size.height / 2 - 22, 0);
    this.root.addChild(status);
    this.statusLabel = status.getComponent(Label)!;

    const toast = this.makeLabel('Toast', 18, new Color(255, 236, 170));
    toast.setPosition(0, size.height / 2 - 56, 0);
    this.root.addChild(toast);
    this.toastLabel = toast.getComponent(Label)!;
    this.toastLabel.string = '';

    this.markUI(this.root);
  }

  private makeLobby(_w: number, _h: number) {
    const lobby = new Node('Lobby');

    const seal = this.rectNode('Seal', 72, 72, new Color(180, 40, 40), 14);
    seal.setPosition(0, 210, 0);
    lobby.addChild(seal);
    const sealLab = this.makeLabel('SealT', 36, new Color(255, 220, 120));
    sealLab.getComponent(Label)!.string = '湘';
    seal.addChild(sealLab);

    const title = this.makeLabel('Title', 52, new Color(255, 210, 90));
    title.getComponent(Label)!.string = '湘桌棋牌';
    title.setPosition(0, 140, 0);
    lobby.addChild(title);

    const sub = this.makeLabel('Sub', 18, new Color(180, 150, 110));
    sub.getComponent(Label)!.string = '长沙麻将 · 邵阳跑胡子';
    sub.setPosition(0, 90, 0);
    lobby.addChild(sub);

    // 玩法选择
    this.pickMj = this.makePickCard('长沙麻将', -200, 20, 180, () => {
      this.gameType = 'changsha_mj';
      this.refreshPickStyle();
      this.toast('已选长沙麻将');
    });
    this.pickPhz = this.makePickCard('邵阳跑胡子', 0, 20, 180, () => {
      this.gameType = 'shaoyang_phz';
      this.refreshPickStyle();
      this.toast('已选邵阳跑胡子');
    });
    this.pickDdz = this.makePickCard('斗地主', 200, 20, 180, () => {
      this.gameType = 'doudizhu';
      this.refreshPickStyle();
      this.toast('已选斗地主');
    });
    lobby.addChild(this.pickMj);
    lobby.addChild(this.pickPhz);
    lobby.addChild(this.pickDdz);
    this.refreshPickStyle();

    // 一键开局
    const start = this.makeBtn('一键开局', 0, -100, () => this.oneClickStart(), true, 220, 56, 22);
    start.name = 'StartBtn';
    lobby.addChild(start);

    const tip = this.makeLabel('Tip', 15, new Color(130, 110, 85));
    tip.name = 'StartTip';
    tip.getComponent(Label)!.string = '当前：长沙麻将 ｜ 出牌：点手牌选中，再点一次打出';
    tip.setPosition(0, -170, 0);
    lobby.addChild(tip);

    return lobby;
  }

  private oneClickStart() {
    if (this.starting) return;
    this.starting = true;
    this.toast('正在开局…');
    this.net.send({ type: 'create_room', gameType: this.gameType, nick: this.nick });
  }

  private makePickCard(text: string, x: number, y: number, w: number, cb: () => void) {
    const h = 64;
    const n = this.rectNode('Pick', w, h, new Color(40, 32, 24), 12);
    n.setPosition(x, y, 0);
    (n as any)._pickW = w;
    (n as any)._pickH = h;
    const lab = this.makeLabel('T', 18, new Color(220, 200, 170));
    lab.name = 'PickLabel';
    lab.getComponent(Label)!.string = text;
    n.addChild(lab);
    n.on(Node.EventType.TOUCH_END, () => cb());
    return n;
  }

  /** 高亮当前选中的玩法卡片 */
  private refreshPickStyle() {
    const apply = (node: Node, on: boolean) => {
      if (!node) return;
      const w = (node as any)._pickW || 260;
      const h = (node as any)._pickH || 70;
      const g = node.getComponent(Graphics);
      if (!g) return;
      g.clear();
      g.fillColor = on ? new Color(70, 50, 20) : new Color(40, 32, 24);
      g.roundRect(-w / 2, -h / 2, w, h, 12);
      g.fill();
      g.strokeColor = on ? new Color(240, 193, 75) : new Color(100, 80, 50);
      g.lineWidth = on ? 3 : 2;
      g.roundRect(-w / 2, -h / 2, w, h, 12);
      g.stroke();
      const lab = node.getChildByName('PickLabel')?.getComponent(Label);
      if (lab) lab.color = on ? new Color(255, 220, 120) : new Color(220, 200, 170);
    };
    apply(this.pickMj, this.gameType === 'changsha_mj');
    apply(this.pickPhz, this.gameType === 'shaoyang_phz');
    apply(this.pickDdz, this.gameType === 'doudizhu');
    const tip = this.lobby?.getChildByName('StartTip')?.getComponent(Label);
    if (tip) {
      const names: Record<string, string> = {
        changsha_mj: '长沙麻将（4人）',
        shaoyang_phz: '邵阳跑胡子（3人·叠列）',
        doudizhu: '斗地主（3人·叫分）',
      };
      tip.string = `当前：${names[this.gameType] || this.gameType}`;
    }
  }

  private makeTable(w: number, h: number) {
    const table = new Node('Table');

    // 木框感外圈
    const wood = this.rectNode('Wood', Math.min(w - 20, 1180), Math.min(h - 100, 560), new Color(70, 42, 20), 28);
    wood.setPosition(0, 20, 0);
    table.addChild(wood);

    // 绿毡
    const felt = this.rectNode('Felt', Math.min(w - 60, 1100), Math.min(h - 140, 500), new Color(16, 110, 70), 40);
    felt.setPosition(0, 20, 0);
    table.addChild(felt);
    this.feltNode = felt;

    // 四边座位容器
    const top = new Node('SeatTop');
    top.setPosition(0, 200, 0);
    felt.addChild(top);
    this.seatNodes.top = top;

    const left = new Node('SeatLeft');
    left.setPosition(-420, 20, 0);
    felt.addChild(left);
    this.seatNodes.left = left;

    const right = new Node('SeatRight');
    right.setPosition(420, 20, 0);
    felt.addChild(right);
    this.seatNodes.right = right;

    const center = this.makeLabel('Center', 18, new Color(255, 235, 170));
    center.setPosition(0, 40, 0);
    felt.addChild(center);
    this.centerInfo = center.getComponent(Label)!;
    this.centerInfo.string = '等待开局';

    // 手牌区（自己）
    const handDock = this.rectNode('HandDock', Math.min(w, 1200), 120, new Color(35, 22, 12), 0);
    handDock.setPosition(0, -h / 2 + 70, 0);
    table.addChild(handDock);

    const hand = new Node('Hand');
    hand.setPosition(0, 10, 0);
    handDock.addChild(hand);
    this.handNode = hand;

    const ops = new Node('Ops');
    ops.setPosition(0, 70, 0);
    handDock.addChild(ops);
    this.opsNode = ops;

    // 底部小工具
    table.addChild(this.makeBtn('再来一局', -100, -h / 2 + 18, () => this.net.send({ type: 'ready' }), true, 130, 36, 16));
    table.addChild(this.makeBtn('回大厅', 100, -h / 2 + 18, () => {
      this.table.active = false;
      this.lobby.active = true;
      this.seat = null;
      this.room = null;
      this.selectedIndex = -1;
    }, false, 110, 36, 16));

    return table;
  }

  private showTable() {
    this.lobby.active = false;
    this.table.active = true;
    this.toast('已入座，自动匹配机器人…');
  }

  // ——— 渲染 ———

  private renderAll() {
    const r = this.room;
    if (!r || this.seat == null) return;

    this.renderSeats(r);
    this.renderCenter(r);
    this.renderHand(r);
    this.renderOps(r);
  }

  private seatLayout(n: number) {
    if (n === 4) {
      return {
        top: (this.seat! + 2) % 4,
        left: (this.seat! + 3) % 4,
        right: (this.seat! + 1) % 4,
      };
    }
    return {
      top: -1,
      left: (this.seat! + 1) % 3,
      right: (this.seat! + 2) % 3,
    };
  }

  private renderSeats(r: PublicRoomState) {
    const L = this.seatLayout(r.seats.length);
    const map: [string, number][] = [
      ['top', L.top],
      ['left', L.left],
      ['right', L.right],
    ];
    for (const [key, seat] of map) {
      const box = this.seatNodes[key];
      box.removeAllChildren();
      if (seat < 0) continue;
      const s = r.seats[seat];
      box.addChild(this.makeSeatChip(s, r.currentSeat === seat));
    }
  }

  private makeSeatChip(s: SeatPublic, turn: boolean) {
    const wrap = new Node('Chip');
    wrap.layer = Layers.Enum.UI_2D;
    const bg = this.rectNode('cbg', 200, 56, turn ? new Color(80, 55, 15) : new Color(0, 0, 0, 140), 28);
    if (turn) {
      const g = bg.getComponent(Graphics)!;
      g.strokeColor = new Color(255, 200, 60);
      g.lineWidth = 2;
      g.roundRect(-100, -28, 200, 56, 28);
      g.stroke();
    }
    wrap.addChild(bg);

    const name = this.makeLabel('nm', 16, new Color(255, 245, 220));
    name.getComponent(Label)!.string = `${s.nick}${s.isBot ? '' : ''}  ${s.score}分`;
    name.setPosition(0, 8, 0);
    wrap.addChild(name);

    const sub = this.makeLabel('sub', 13, new Color(160, 200, 170));
    sub.getComponent(Label)!.string = `手牌 ${s.handCount} · 出${s.discards.length}`;
    sub.setPosition(0, -12, 0);
    wrap.addChild(sub);

    // 最近几张弃牌
    const disc = new Node('disc');
    disc.setPosition(0, -48, 0);
    wrap.addChild(disc);
    const show = s.discards.slice(-8);
    const start = -((show.length - 1) * 18) / 2;
    show.forEach((t, i) => {
      const tile = this.makeTileNode(t, false, 0.55);
      tile.setPosition(start + i * 18, 0, 0);
      disc.addChild(tile);
    });
    this.markUI(wrap);
    return wrap;
  }

  private renderCenter(r: PublicRoomState) {
    const myTurn =
      r.currentSeat === this.seat &&
      (r.phase === 'wait_discard' || r.phase === 'playing' || r.phase === 'bidding');
    const canClaim = r.phase === 'wait_claim' && r.availableOps.some((o) => o.action !== 'pass');
    let tip = r.message || '';
    if (myTurn) {
      tip =
        r.gameType === 'doudizhu'
          ? r.phase === 'bidding'
            ? '叫分阶段 · 点下方按钮'
            : '点选手牌抬起（可多选）→ 出牌'
          : r.gameType === 'shaoyang_phz'
            ? '同牌叠列 · 点列顶牌选中，再点打出'
            : '点手牌选中，再点一次打出';
    } else if (canClaim) tip = '可以吃 / 碰 / 跑 / 胡';
    else if (r.phase === 'bidding') tip = `座位 ${r.currentSeat} 叫分中`;
    else if (r.phase === 'wait_discard' || r.phase === 'playing') tip = `等待座位 ${r.currentSeat}`;
    this.centerInfo.string = `${r.roomId}  ·  剩牌 ${r.wallCount}\n${tip}`;

    // 最新出牌
    const old = this.feltNode.getChildByName('LastTile');
    if (old) old.destroy();
    if (r.lastDiscard) {
      const last = this.makeTileNode(r.lastDiscard.tile, false, 1.35);
      last.name = 'LastTile';
      last.setPosition(0, -30, 0);
      this.feltNode.addChild(last);
      this.markUI(last);
      // 轻微弹出
      last.setScale(0.6, 0.6, 1);
      tween(last).to(0.2, { scale: new Vec3(1.35, 1.35, 1) }, { easing: 'backOut' }).start();
    }
  }

  private renderHand(r: PublicRoomState) {
    this.handNode.removeAllChildren();
    const me = r.seats.find((s) => s.seat === this.seat);
    const hand = me?.hand || [];
    const canDiscard =
      (r.phase === 'wait_discard' || r.phase === 'playing') && r.currentSeat === this.seat;

    if (r.gameType === 'doudizhu') {
      this.renderDdzHand(hand, canDiscard && r.phase === 'playing', r);
    } else if (r.gameType === 'shaoyang_phz') {
      this.renderPhzHand(hand, canDiscard, r);
    } else {
      this.renderMjHand(hand, canDiscard, r);
    }
  }

  /**
   * 斗地主手牌：横向重叠（对齐商业斗地主截图）
   * 点选抬起，可多选，再点「出牌」
   */
  private renderDdzHand(hand: number[], canPlay: boolean, r: PublicRoomState) {
    const overlap = 28; // 重叠间距，越小叠得越紧
    const startX = -((hand.length - 1) * overlap) / 2;
    hand.forEach((t, idx) => {
      const selected = this.selectedSet.has(idx);
      const tile = this.makePokerCard(t, selected);
      tile.setPosition(startX + idx * overlap, selected ? 28 : 0, 0);
      if (canPlay) {
        tile.on(Node.EventType.TOUCH_END, () => {
          if (this.selectedSet.has(idx)) this.selectedSet.delete(idx);
          else this.selectedSet.add(idx);
          this.renderHand(r);
          this.renderOps(r);
        });
      }
      this.handNode.addChild(tile);
      this.markUI(tile);
    });
  }

  private makePokerCard(t: number, selected: boolean) {
    const tw = 52;
    const th = 72;
    const n = new Node('Poker');
    n.layer = Layers.Enum.UI_2D;
    const ui = n.addComponent(UITransform);
    ui.setContentSize(tw, th);
    const g = n.addComponent(Graphics);
    g.fillColor = new Color(255, 252, 245);
    g.roundRect(-tw / 2, -th / 2, tw, th, 6);
    g.fill();
    g.strokeColor = selected ? new Color(40, 160, 80) : new Color(180, 160, 130);
    g.lineWidth = selected ? 3 : 1;
    g.roundRect(-tw / 2, -th / 2, tw, th, 6);
    g.stroke();
    const face = tileFace('doudizhu', t);
    const col = this.hexColor(SUIT_COLOR[face.color]);
    const rank = this.makeLabel('R', 20, col);
    rank.getComponent(Label)!.string = face.rank;
    rank.setPosition(-10, 18, 0);
    n.addChild(rank);
    const suit = this.makeLabel('S', 18, col);
    suit.getComponent(Label)!.string = face.suit;
    suit.setPosition(-10, -2, 0);
    n.addChild(suit);
    return n;
  }

  /** 长沙麻将：横排（口袋麻将 Card2d 牌面） */
  private renderMjHand(hand: number[], canDiscard: boolean, r: PublicRoomState) {
    const gap = 48;
    const startX = -((hand.length - 1) * gap) / 2;
    hand.forEach((t, idx) => {
      const selected = this.selectedIndex === idx;
      const tile = this.makeTileNode(t, selected, 1.0);
      tile.setPosition(startX + idx * gap, selected ? 22 : 0, 0);
      if (canDiscard) {
        tile.on(Node.EventType.TOUCH_END, () => this.onHandTap(idx, t, r));
      }
      this.handNode.addChild(tile);
      this.markUI(tile);
    });
  }

  /**
   * 邵阳跑胡子：按牌值分列，同牌竖向叠放（字牌桌标准手感）
   * 小写在左、大写在右；同列自下而上叠
   */
  private renderPhzHand(hand: number[], canDiscard: boolean, r: PublicRoomState) {
    // tile -> 手牌里所有下标
    const groups = new Map<number, number[]>();
    hand.forEach((t, idx) => {
      const list = groups.get(t) || [];
      list.push(idx);
      groups.set(t, list);
    });
    const keys = [...groups.keys()].sort((a, b) => a - b);
    const colGap = 46;
    const stackGap = 14; // 竖向叠距
    const startX = -((keys.length - 1) * colGap) / 2;

    keys.forEach((tileVal, col) => {
      const indices = groups.get(tileVal)!;
      const colNode = new Node(`Col_${tileVal}`);
      colNode.layer = Layers.Enum.UI_2D;
      colNode.setPosition(startX + col * colGap, 0, 0);
      this.handNode.addChild(colNode);

      // 自下而上画，最上面那张可点（叠在最前）
      indices.forEach((handIdx, stack) => {
        const selected = this.selectedIndex === handIdx;
        const tile = this.makeTileNode(tileVal, selected, 1.05);
        // 底部为第 0 张，往上叠
        tile.setPosition(selected ? 0 : 0, stack * stackGap + (selected ? 10 : 0), 0);
        // 后画的在上层，保证最上面一张优先点到
        colNode.addChild(tile);
        if (canDiscard) {
          tile.on(Node.EventType.TOUCH_END, () => this.onHandTap(handIdx, tileVal, r));
        }
        this.markUI(tile);
      });

      // 列下方显示张数（≥2 时）
      if (indices.length >= 2) {
        const cnt = this.makeLabel('cnt', 12, new Color(255, 220, 120));
        cnt.getComponent(Label)!.string = `×${indices.length}`;
        cnt.setPosition(0, -36, 0);
        colNode.addChild(cnt);
        this.markUI(cnt);
      }
      this.markUI(colNode);
    });
  }

  private onHandTap(idx: number, t: number, r: PublicRoomState) {
    if (this.selectedIndex === idx) {
      this.net.send({ type: 'action', action: 'discard', tile: t });
      this.selectedIndex = -1;
      const f = tileFace(this.gameType, t);
      this.toast(`打出 ${f.suit}${f.rank}`);
    } else {
      this.selectedIndex = idx;
      this.renderHand(r);
      this.toast('再点一次打出这张');
    }
  }

  private renderOps(r: PublicRoomState) {
    this.opsNode.removeAllChildren();
    const ops = r.availableOps.filter((o) => o.action !== 'discard');
    // 斗地主：自己组牌出牌
    if (r.gameType === 'doudizhu' && r.phase === 'playing' && r.currentSeat === this.seat) {
      const me = r.seats.find((s) => s.seat === this.seat);
      const hand = me?.hand || [];
      const tiles = [...this.selectedSet].map((i) => hand[i]).filter((x) => x !== undefined);
      const playBtn = this.makeBtn('出牌', -70, 0, () => {
        if (!tiles.length) {
          this.toast('先点选手牌（可多选）');
          return;
        }
        this.net.send({ type: 'action', action: 'play', tiles });
        this.selectedSet.clear();
      }, true, 120, 44, 18);
      this.opsNode.addChild(playBtn);
      if (ops.some((o) => o.action === 'pass')) {
        this.opsNode.addChild(
          this.makeBtn('不出', 70, 0, () => {
            this.net.send({ type: 'action', action: 'pass' });
            this.selectedSet.clear();
          }, false, 100, 44, 18),
        );
      }
      this.markUI(this.opsNode);
      return;
    }

    if (!ops.length) return;

    const gap = 88;
    const startX = -((ops.length - 1) * gap) / 2;
    ops.forEach((op, i) => {
      const short = OP_SHORT[op.action] || op.label;
      const win = op.action === 'hu' || op.action === 'zimo';
      const pass = op.action === 'pass' || op.action === 'bid_0';
      const bid = op.action.startsWith('bid_');
      const color = win
        ? new Color(200, 50, 40)
        : pass
          ? new Color(50, 110, 180)
          : bid
            ? new Color(40, 150, 80)
            : op.action === 'peng'
              ? new Color(40, 110, 180)
              : op.action.includes('gang') || op.action === 'ti' || op.action === 'pao'
                ? new Color(120, 60, 160)
                : new Color(30, 140, 80);
      const btn = this.makeRoundBtn(short, startX + i * gap, 0, color, bid || win ? 68 : 62, () => {
        this.net.send({ type: 'action', action: op.action, tile: op.tile, tiles: op.tiles });
        this.selectedIndex = -1;
        this.selectedSet.clear();
      });
      this.opsNode.addChild(btn);
      this.markUI(btn);
      btn.setScale(0.5, 0.5, 1);
      tween(btn).to(0.25, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' }).start();
    });
  }

  // ——— 零件 ———

  private rectNode(name: string, w: number, h: number, color: Color, radius = 0) {
    const n = new Node(name);
    n.layer = Layers.Enum.UI_2D;
    const ui = n.addComponent(UITransform);
    ui.setContentSize(w, h);
    const g = n.addComponent(Graphics);
    g.fillColor = color;
    if (radius > 0) g.roundRect(-w / 2, -h / 2, w, h, radius);
    else g.rect(-w / 2, -h / 2, w, h);
    g.fill();
    return n;
  }

  private makeTileNode(t: number, selected: boolean, scale = 1) {
    // 长沙麻将优先用口袋麻将 2D 牌面
    if (this.gameType === 'changsha_mj') {
      const key = mjSpriteKey(t);
      if (key) return this.makeMjSpriteTile(key, selected, scale);
    }

    const tw = 36 * scale;
    const th = 50 * scale;
    const n = new Node('Tile');
    n.layer = Layers.Enum.UI_2D;
    const ui = n.addComponent(UITransform);
    ui.setContentSize(tw, th);
    const g = n.addComponent(Graphics);
    g.fillColor = new Color(255, 250, 235);
    g.roundRect(-tw / 2, -th / 2, tw, th, 5 * scale);
    g.fill();
    g.strokeColor = selected ? new Color(255, 190, 40) : new Color(180, 150, 100);
    g.lineWidth = selected ? 3 : 1;
    g.roundRect(-tw / 2, -th / 2, tw, th, 5 * scale);
    g.stroke();

    const face = tileFace(this.gameType, t);
    const col = this.hexColor(SUIT_COLOR[face.color]);
    const rank = this.makeLabel('R', 18 * scale, col);
    rank.getComponent(Label)!.string = face.rank;
    rank.setPosition(0, 6 * scale, 0);
    n.addChild(rank);
    const suit = this.makeLabel('S', 12 * scale, col);
    suit.getComponent(Label)!.string = face.suit;
    suit.setPosition(0, -12 * scale, 0);
    n.addChild(suit);
    return n;
  }

  /** 口袋麻将 Card2d：resources/ui/Card2d/{wan1|tiao3|tong9}/spriteFrame */
  private makeMjSpriteTile(key: string, selected: boolean, scale = 1) {
    const tw = 44 * scale;
    const th = 70 * scale;
    const n = new Node('Tile');
    n.layer = Layers.Enum.UI_2D;
    const ui = n.addComponent(UITransform);
    ui.setContentSize(tw, th);

    const spNode = new Node('Face');
    spNode.layer = Layers.Enum.UI_2D;
    spNode.addComponent(UITransform).setContentSize(tw, th);
    const sp = spNode.addComponent(Sprite);
    sp.sizeMode = Sprite.SizeMode.CUSTOM;
    n.addChild(spNode);

    resources.load(`ui/Card2d/${key}/spriteFrame`, SpriteFrame, (err, frame) => {
      if (err || !n.isValid) return;
      sp.spriteFrame = frame;
    });

    if (selected) {
      const ring = new Node('Sel');
      ring.layer = Layers.Enum.UI_2D;
      ring.addComponent(UITransform).setContentSize(tw + 6, th + 6);
      const g = ring.addComponent(Graphics);
      g.strokeColor = new Color(255, 200, 40);
      g.lineWidth = 3;
      g.roundRect(-(tw + 6) / 2, -(th + 6) / 2, tw + 6, th + 6, 6);
      g.stroke();
      n.addChild(ring);
    }
    return n;
  }

  private makeRoundBtn(text: string, x: number, y: number, color: Color, size: number, cb: () => void) {
    const n = new Node('Op');
    n.layer = Layers.Enum.UI_2D;
    n.setPosition(x, y, 0);
    const ui = n.addComponent(UITransform);
    ui.setContentSize(size, size);
    const g = n.addComponent(Graphics);
    g.fillColor = color;
    g.circle(0, 0, size / 2);
    g.fill();
    g.strokeColor = new Color(255, 255, 255, 180);
    g.lineWidth = 2;
    g.circle(0, 0, size / 2 - 1);
    g.stroke();
    const lab = this.makeLabel('L', size > 65 ? 26 : 22, Color.WHITE);
    lab.getComponent(Label)!.string = text;
    n.addChild(lab);
    n.on(Node.EventType.TOUCH_END, () => cb());
    return n;
  }

  private makeBtn(
    text: string,
    x: number,
    y: number,
    cb: () => void,
    gold = false,
    w = 160,
    h = 48,
    fontSize = 18,
  ) {
    const n = this.rectNode('Btn', w, h, gold ? new Color(230, 175, 40) : new Color(55, 40, 28), 12);
    n.setPosition(x, y, 0);
    const lab = this.makeLabel('L', fontSize, gold ? new Color(40, 25, 8) : new Color(255, 240, 210));
    lab.getComponent(Label)!.string = text;
    n.addChild(lab);
    n.on(Node.EventType.TOUCH_END, (_e: EventTouch) => cb());
    return n;
  }

  private makeLabel(name: string, size: number, color: Color) {
    const n = new Node(name);
    n.layer = Layers.Enum.UI_2D;
    const ui = n.addComponent(UITransform);
    ui.setContentSize(900, size + 12);
    const lab = n.addComponent(Label);
    lab.string = '';
    lab.fontSize = size;
    lab.lineHeight = size + 6;
    lab.color = color;
    lab.horizontalAlign = HorizontalTextAlignment.CENTER;
    lab.overflow = Overflow.NONE;
    lab.enableWrapText = true;
    return n;
  }

  private hexColor(hex: string) {
    const h = hex.replace('#', '');
    return new Color(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16));
  }
}
