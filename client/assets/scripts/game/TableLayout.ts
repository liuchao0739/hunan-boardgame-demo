import {
  Node, Label, UITransform, Color, Graphics, Sprite, Button, Layers, Vec3, tween, Tween, UIOpacity,
} from 'cc';
import { loadSpriteFrame, createTileNode, styleLabel, attachBg } from '../comm/ArtBg';
import { AudioBus } from '../comm/AudioBus';
import { buildHuEffectLayer, flyTile, popIn, rollNumber, stopNodeTweens } from './TableFx';
import { tileName } from './ChangshaTiles';
import { SettleWnd } from './SettleWnd';

export type SeatPlayer = {
  userId: number;
  userName: string;
  seatIndex: number;
  totalScore: number;
  handCount?: number;
  piaoX?: number;
  zhuang?: boolean;
  owner?: boolean;
  discard?: number[];
  peng?: number[];
  melds?: { kind: string; tiles: number[] }[];
};

export type ResultSettleInfo = {
  reason: string;
  detail?: string;
  fan?: number;
  fanItems?: Array<{ name: string; fan: number }>;
  birds?: number[];
  winnerName?: string;
  paoName?: string;
  winHand?: number[];
  winMelds?: Array<{ kind: string; tiles: number[] }>;
  huTile?: number | null;
  roomId?: string | number;
  rows?: Array<{
    seat: number;
    name: string;
    score: number;
    isMe?: boolean;
    isWinner?: boolean;
  }>;
};

type SeatSlot = {
  root: Node;
  nameLab: Label;
  scoreLab: Label;
  avatarG: Graphics;
  avatarSp: Sprite | null;
  flagHost: Node;
  handRoot: Node;
  meldRoot: Node;
};

/** 贴近原版截图的牌桌骨架：桌布、四家、罗盘、牌河、操作钮 */
export class TableLayout {
  root: Node;
  tipLabel: Label | null = null;
  /** 等待好友加入时的中心提示 */
  waitingTip: Label | null = null;
  shareBtn: Button | null = null;
  handRoot: Node;
  discardRoots: Node[] = [];
  seats: SeatSlot[] = [];
  compassNode: Node | null = null;
  lightNode: Node | null = null;
  private turnEdgeGfx: Graphics[] = [];
  private turnRel = -1;
  /** 中控台局数（外部可写） */
  consoleRoundLab: Label | null = null;
  private consoleRemainLab: Label | null = null;
  btnChu: Button | null = null;
  btnPeng: Button | null = null;
  btnHu: Button | null = null;
  btnGuo: Button | null = null;
  btnChi: Button | null = null;
  btnContinue: Button | null = null;
  btnAutoPlay: Button | null = null;
  btnDissolve: Button | null = null;
  netBanner: Label | null = null;
  roomLabel: Label | null = null;
  remainLabel: Label | null = null;
  roundLabel: Label | null = null;
  tingLabel: Label | null = null;
  exitBtn: Button | null = null;
  fxLayer: Node | null = null;
  countdownNode: Node | null = null;
  countdownGfx: Graphics | null = null;
  countdownSecLabel: Label | null = null;
  private countdownRemainMs = 0;
  private countdownActive = false;
  private compassAngle = 0;
  private displayedRemain = -1;
  private lastActionSig = '';
  private meldCounts: number[] = [0, 0, 0, 0];
  /** 多吃法选择面板（外部可读，用于 state 刷新时避免误关） */
  chiPicker: Node | null = null;
  private wallRoot: Node | null = null;
  private lastWallCount = -1;
  private actionTimeoutMs = 15000;

  constructor(canvas: Node) {
    this.root = canvas;
    for (const name of ['__AutoBg', '__Felt', '__HandRoot', '__TableUI']) {
      const n = canvas.getChildByName(name);
      if (n) n.destroy();
    }
    attachBg(canvas, 'weihai/bg/table');

    const ui = new Node('__TableUI');
    canvas.addChild(ui);
    ui.layer = canvas.layer || Layers.Enum.UI_2D;
    ui.addComponent(UITransform).setContentSize(1280, 720);

    // 独立毡面：与大厅风景背景区分开
    this.buildFelt(ui);

    // 层级：毡面 → 牌山 → 牌河 → 中控台 → 座位/手牌 → HUD → 特效
    this.buildWall(ui);
    this.buildDiscardAreas(ui);
    this.buildCenterConsole(ui);
    this.buildSeats(ui);
    this.buildHud(ui);
    this.buildActionBtns(ui);
    this.buildFxLayer(ui);

    this.handRoot = new Node('__HandRoot');
    ui.addChild(this.handRoot);
    this.handRoot.layer = ui.layer;
    this.handRoot.addComponent(UITransform);
    // 手牌居中；副露在左侧，不挤手牌
    this.handRoot.setPosition(0, -308, 0);
  }

  private buildHud(parent: Node) {
    // 顶栏不再用「座位X摸牌」文案；仅保留错误等短提示（默认隐藏）
    this.tipLabel = this.mkHudChip(parent, 'tip', 0, 278, 420, 30, '');
    this.tipLabel.fontSize = 18;
    if (this.tipLabel.node.parent) this.tipLabel.node.parent.active = false;
    this.tingLabel = this.mkLabel(parent, 'ting', 0, 248, 720, 24, 17);
    if (this.tingLabel) {
      this.tingLabel.color = new Color(255, 230, 120, 255);
      this.tingLabel.string = '';
      this.tingLabel.node.active = false;
    }
    this.netBanner = this.mkLabel(parent, 'netBanner', 0, 308, 640, 26, 18);
    if (this.netBanner) {
      this.netBanner.color = new Color(255, 200, 80, 255);
      this.netBanner.node.active = false;
    }
    this.roomLabel = this.mkLabel(parent, 'room', 480, 318, 240, 24, 17);

    // 局数/剩余：顶栏弱化；主显示在中控台
    this.roundLabel = this.mkHudChip(parent, 'round', -400, 248, 112, 28, '第 1 局');
    this.remainLabel = this.mkHudChip(parent, 'remain', 340, 248, 112, 28, '剩 --');
    if (this.roundLabel.node.parent) this.roundLabel.node.parent.active = false;
    if (this.remainLabel.node.parent) this.remainLabel.node.parent.active = false;

    this.buildTopToolbar(parent);
  }

  /** 信息芯片（局数/剩余/提示） */
  private mkHudChip(parent: Node, name: string, x: number, y: number, w: number, h: number, text: string): Label {
    const wrap = new Node(`${name}Chip`);
    parent.addChild(wrap);
    wrap.layer = parent.layer;
    wrap.setPosition(x, y, 0);
    wrap.addComponent(UITransform).setContentSize(w, h);
    const g = wrap.addComponent(Graphics);
    g.fillColor = new Color(8, 14, 22, 170);
    g.roundRect(-w / 2, -h / 2, w, h, 10);
    g.fill();
    g.strokeColor = new Color(210, 170, 80, 120);
    g.lineWidth = 1.2;
    g.roundRect(-w / 2, -h / 2, w, h, 10);
    g.stroke();
    const labN = new Node('t');
    wrap.addChild(labN);
    labN.layer = parent.layer;
    labN.addComponent(UITransform).setContentSize(w - 10, h - 4);
    const lab = labN.addComponent(Label);
    styleLabel(lab, 17);
    lab.string = text;
    lab.color = new Color(255, 236, 190, 255);
    lab.overflow = Label.Overflow.SHRINK;
    return lab;
  }

  private buildTopToolbar(parent: Node) {
    const bar = new Node('__TopToolbar');
    parent.addChild(bar);
    bar.layer = parent.layer;
    bar.addComponent(UITransform).setContentSize(340, 38);
    bar.setPosition(-450, 318, 0);

    const bg = bar.addComponent(Graphics);
    bg.fillColor = new Color(0, 0, 0, 80);
    bg.roundRect(-170, -19, 340, 38, 11);
    bg.fill();

    this.exitBtn = this.mkToolBtn(bar, 'btnExit', -112, 96, '回大厅');
    this.btnAutoPlay = this.mkToolBtn(bar, 'btnAuto', 0, 104, '托管');
    this.btnDissolve = this.mkToolBtn(bar, 'btnDiss', 112, 96, '解散');
    if (this.btnAutoPlay) this.btnAutoPlay.node.active = true;
    if (this.btnDissolve) this.btnDissolve.node.active = true;

    // 等待房中心：人数提示 + 分享链接
    const waitHost = new Node('__WaitingHost');
    parent.addChild(waitHost);
    waitHost.layer = parent.layer;
    waitHost.addComponent(UITransform).setContentSize(520, 120);
    waitHost.setPosition(0, 36, 0);
    waitHost.active = false;
    this.waitingTip = this.mkLabel(waitHost, 'waitTip', 0, 28, 500, 56, 18);
    this.waitingTip.string = '';
    this.waitingTip.color = new Color(255, 236, 180, 255);
    this.waitingTip.overflow = Label.Overflow.RESIZE_HEIGHT;
    this.waitingTip.enableWrapText = true;
    this.shareBtn = this.mkToolBtn(waitHost, 'btnShare', 0, 200, '复制分享链接');
    this.shareBtn.node.setPosition(0, -28, 0);
    (this as any)._waitingHost = waitHost;
  }

  /** 真人等待房：显示座位空位 + 分享；开局后隐藏 */
  setWaitingMode(on: boolean, tip = '') {
    const host = (this as any)._waitingHost as Node | undefined;
    if (host?.isValid) host.active = on;
    if (this.waitingTip) this.waitingTip.string = tip;
    if (this.shareBtn?.node) this.shareBtn.node.active = on;
    if (this.btnAutoPlay?.node) this.btnAutoPlay.node.active = !on;
    if (this.handRoot?.isValid) this.handRoot.active = !on;
    if (this.wallRoot?.isValid) this.wallRoot.active = !on;
  }

  /** 用平台 seats（无 game）刷新四座等待态 */
  applyWaitingSeats(seats: any[], myId: number, ownerId: number) {
    const players: SeatPlayer[] = (seats || []).map((s: any) => ({
      userId: s.userId,
      userName: s.userName || (s.isBot ? '机器人' : `玩家${s.userId}`),
      seatIndex: Number(s.seat) || 0,
      totalScore: 0,
      handCount: 0,
      zhuang: false,
      owner: Number(s.userId) === Number(ownerId),
      discard: [],
      peng: [],
      melds: [],
    }));
    this.updateSeats(players, myId, 0);
    this.handRoot?.removeAllChildren();
    this.updateWall(0);
    for (const d of this.discardRoots || []) {
      if (d?.isValid) d.removeAllChildren();
    }
    for (const slot of this.seats) {
      slot.handRoot?.removeAllChildren();
      slot.meldRoot?.removeAllChildren();
    }
  }

  private mkToolBtn(parent: Node, name: string, x: number, w: number, text: string): Button {
    const n = new Node(name);
    parent.addChild(n);
    n.layer = parent.layer;
    n.addComponent(UITransform).setContentSize(w, 30);
    n.setPosition(x, 0, 0);
    const g = n.addComponent(Graphics);
    g.fillColor = new Color(168, 52, 38, 235);
    g.roundRect(-w / 2, -15, w, 30, 8);
    g.fill();
    g.strokeColor = new Color(255, 200, 140, 90);
    g.lineWidth = 1;
    g.roundRect(-w / 2, -15, w, 30, 8);
    g.stroke();
    const lab = this.mkLabel(n, 't', 0, 0, w - 6, 24, 16);
    lab.string = text;
    lab.color = new Color(255, 248, 230, 255);
    const btn = n.addComponent(Button);
    btn.transition = Button.Transition.SCALE;
    btn.zoomScale = 0.94;
    return btn;
  }

  /** 听牌提示：可胡哪些牌 */
  setTingTips(tiles: number[]) {
    if (!this.tingLabel) return;
    if (!tiles.length) {
      this.tingLabel.string = '';
      this.tingLabel.node.active = false;
      return;
    }
    const names = tiles.map((t) => tileName(t)).join('　');
    this.tingLabel.string = `听：${names}`;
    this.tingLabel.node.active = true;
  }

  /** 手牌高亮：黄框 = 吃碰相关；红框 = 可胡相关 */
  static markTileHighlight(node: Node, kind: 'none' | 'claim' | 'hu') {
    let mark = node.getChildByName('__HL');
    if (kind === 'none') {
      if (mark?.isValid) mark.destroy();
      return;
    }
    if (!mark) {
      mark = new Node('__HL');
      node.addChild(mark);
      mark.layer = node.layer;
      const ui = node.getComponent(UITransform);
      const w = ui?.width || 52;
      const h = ui?.height || 74;
      mark.addComponent(UITransform).setContentSize(w + 6, h + 6);
      mark.setPosition(0, 0, 0);
      mark.addComponent(Graphics);
    }
    const g = mark.getComponent(Graphics)!;
    g.clear();
    const ui = node.getComponent(UITransform);
    const w = (ui?.width || 52) + 4;
    const h = (ui?.height || 74) + 4;
    g.lineWidth = 4;
    g.strokeColor = kind === 'hu'
      ? new Color(255, 70, 60, 255)
      : new Color(255, 210, 40, 255);
    g.roundRect(-w / 2, -h / 2, w, h, 6);
    g.stroke();
  }

  private buildFelt(parent: Node) {
    const felt = new Node('__Felt');
    parent.addChild(felt);
    felt.layer = parent.layer;
    felt.addComponent(UITransform).setContentSize(980, 520);
    felt.setPosition(0, 10, 0);
    const g = felt.addComponent(Graphics);
    // 外沿木色框
    g.fillColor = new Color(92, 58, 32, 230);
    g.roundRect(-500, -270, 1000, 540, 28);
    g.fill();
    // 内毡
    g.fillColor = new Color(18, 92, 58, 235);
    g.roundRect(-470, -245, 940, 490, 22);
    g.fill();
    // 内高光边
    g.strokeColor = new Color(40, 140, 90, 180);
    g.lineWidth = 3;
    g.roundRect(-470, -245, 940, 490, 22);
    g.stroke();
    g.strokeColor = new Color(212, 168, 72, 100);
    g.lineWidth = 2;
    g.roundRect(-500, -270, 1000, 540, 28);
    g.stroke();
  }

  /**
   * 口袋麻将式中控台：深色台面 + 四边出牌指示条 + 中央倒计时。
   * 不再用 pointer_base 青绿大方块（盖住倒计时、观感差）。
   */
  private buildCenterConsole(parent: Node) {
    const box = new Node('console');
    parent.addChild(box);
    box.layer = parent.layer;
    const size = 132;
    box.addComponent(UITransform).setContentSize(size, size);
    box.setPosition(0, 18, 0);
    this.compassNode = box;

    const bg = box.addComponent(Graphics);
    bg.fillColor = new Color(16, 22, 32, 245);
    bg.roundRect(-size / 2, -size / 2, size, size, 14);
    bg.fill();
    bg.strokeColor = new Color(70, 90, 110, 220);
    bg.lineWidth = 2;
    bg.roundRect(-size / 2, -size / 2, size, size, 14);
    bg.stroke();

    // 四边指示灯：0下 1右 2上 3左
    this.turnEdgeGfx = [];
    const edgeW = size - 20;
    const edgeH = 10;
    const edgeSpecs = [
      { x: 0, y: -size / 2 + 8, w: edgeW, h: edgeH },
      { x: size / 2 - 8, y: 0, w: edgeH, h: edgeW },
      { x: 0, y: size / 2 - 8, w: edgeW, h: edgeH },
      { x: -size / 2 + 8, y: 0, w: edgeH, h: edgeW },
    ];
    for (let i = 0; i < 4; i++) {
      const e = edgeSpecs[i];
      const n = new Node(`edge${i}`);
      box.addChild(n);
      n.layer = box.layer;
      n.addComponent(UITransform).setContentSize(e.w, e.h);
      n.setPosition(e.x, e.y, 0);
      const g = n.addComponent(Graphics);
      this.turnEdgeGfx.push(g);
      this.paintTurnEdge(g, e.w, e.h, false);
    }

    // 兼容旧 lightNode 引用：挂一个空节点
    this.lightNode = new Node('lightProxy');
    box.addChild(this.lightNode);
    this.lightNode.layer = box.layer;
    this.lightNode.addComponent(UITransform);
    this.lightNode.active = false;

    this.consoleRoundLab = this.mkLabel(box, 'cRound', 0, 42, 100, 20, 14);
    this.consoleRoundLab.string = '第1局';
    this.consoleRoundLab.color = new Color(180, 200, 220, 255);

    // 倒计时嵌在中控正中
    const cd = new Node('countdown');
    box.addChild(cd);
    cd.layer = box.layer;
    cd.addComponent(UITransform).setContentSize(88, 88);
    cd.setPosition(0, 0, 0);
    this.countdownNode = cd;
    this.countdownGfx = cd.addComponent(Graphics);
    const sec = new Node('sec');
    cd.addChild(sec);
    sec.layer = box.layer;
    sec.addComponent(UITransform).setContentSize(72, 48);
    this.countdownSecLabel = sec.addComponent(Label);
    styleLabel(this.countdownSecLabel, 36);
    this.countdownSecLabel.color = new Color(255, 248, 220, 255);
    this.countdownSecLabel.string = '--';
    cd.active = true;

    this.consoleRemainLab = this.mkLabel(box, 'cRemain', 0, -44, 100, 20, 14);
    this.consoleRemainLab.string = '剩 --';
    this.consoleRemainLab.color = new Color(160, 190, 170, 255);

    this.setTurnRel(-1);
  }

  private paintTurnEdge(g: Graphics, w: number, h: number, on: boolean) {
    g.clear();
    if (on) {
      g.fillColor = new Color(60, 190, 255, 255);
      g.roundRect(-w / 2, -h / 2, w, h, 3);
      g.fill();
      g.strokeColor = new Color(180, 240, 255, 255);
      g.lineWidth = 1.5;
      g.roundRect(-w / 2, -h / 2, w, h, 3);
      g.stroke();
    } else {
      g.fillColor = new Color(40, 52, 68, 200);
      g.roundRect(-w / 2, -h / 2, w, h, 3);
      g.fill();
    }
  }

  /** 高亮相对座位的出牌边（0自己下 / 1右 / 2对 / 3左） */
  setTurnRel(rel: number) {
    this.turnRel = rel;
    const specs = [
      { w: 112, h: 10 },
      { w: 10, h: 112 },
      { w: 112, h: 10 },
      { w: 10, h: 112 },
    ];
    for (let i = 0; i < 4; i++) {
      const g = this.turnEdgeGfx[i];
      if (!g) continue;
      this.paintTurnEdge(g, specs[i].w, specs[i].h, i === rel);
    }
  }

  /** 四边牌山（米黄牌背，绿毡上才看得见），围合中控台 */
  private buildWall(parent: Node) {
    const root = new Node('__Wall');
    parent.addChild(root);
    root.layer = parent.layer;
    root.addComponent(UITransform).setContentSize(1280, 720);
    root.setSiblingIndex(1);
    this.wallRoot = root;
  }

  /** 四边牌山已关闭（米黄牌背干扰桌面），剩余张数只看中控「剩 xx」 */
  updateWall(_wallCount: number | null | undefined) {
    const root = this.wallRoot;
    if (!root?.isValid) return;
    root.removeAllChildren();
    this.lastWallCount = -1;
  }

  /**
   * 四边严格分区（互不侵入）：
   * 自己：头像左上｜底边 手牌居中 + 左侧副露
   * 左/右：头像外侧｜竖手｜副露靠桌心
   * 对家：顶上头像｜手牌｜下方副露
   */
  private buildSeats(parent: Node) {
    const layouts = [
      { x: -590, y: -220, hx: 0, hy: 0, handRot: 0, flagX: 48, flagY: 12 },
      { x: 575, y: 70, hx: -78, hy: 0, handRot: 90, flagX: -48, flagY: 12 },
      { x: 0, y: 312, hx: 0, hy: -52, handRot: 180, flagX: 48, flagY: 12 },
      { x: -575, y: 70, hx: 78, hy: 0, handRot: -90, flagX: 48, flagY: 12 },
    ];
    const meldPos = [
      { x: -420, y: -305, angle: 0 }, // 自家副露：手牌左侧
      { x: 405, y: 70, angle: 90 },
      { x: 0, y: 198, angle: 0 },
      { x: -405, y: 70, angle: -90 },
    ];
    this.seats = [];
    for (let i = 0; i < 4; i++) {
      const L = layouts[i];
      const root = new Node(`seat${i}`);
      parent.addChild(root);
      root.layer = parent.layer;
      root.addComponent(UITransform).setContentSize(140, 120);
      root.setPosition(L.x, L.y, 0);

      const av = new Node('avatar');
      root.addChild(av);
      av.layer = parent.layer;
      av.addComponent(UITransform).setContentSize(52, 52);
      av.setPosition(0, 16, 0);
      const ag = av.addComponent(Graphics);
      ag.fillColor = new Color(28, 28, 28, 230);
      ag.circle(0, 0, 24);
      ag.fill();
      ag.strokeColor = new Color(220, 180, 80, 255);
      ag.lineWidth = 2.5;
      ag.circle(0, 0, 24);
      ag.stroke();
      const avImg = new Node('img');
      av.addChild(avImg);
      avImg.layer = parent.layer;
      avImg.addComponent(UITransform).setContentSize(44, 44);
      const avSp = avImg.addComponent(Sprite);
      avSp.sizeMode = Sprite.SizeMode.CUSTOM;
      void loadSpriteFrame('weihai/ui/avatar_default').then((sf) => {
        if (sf && avImg.isValid) avSp.spriteFrame = sf;
      });

      const nameBg = new Node('nameBg');
      root.addChild(nameBg);
      nameBg.layer = parent.layer;
      nameBg.addComponent(UITransform).setContentSize(100, 22);
      nameBg.setPosition(0, -26, 0);
      const nsp = nameBg.addComponent(Sprite);
      nsp.sizeMode = Sprite.SizeMode.CUSTOM;
      void loadSpriteFrame('weihai/ui/name_bg').then((sf) => {
        if (sf && nameBg.isValid) nsp.spriteFrame = sf;
      });

      const nameLab = this.mkLabel(root, 'name', 0, -26, 94, 20, 13);
      nameLab.string = '空位';
      const scoreLab = this.mkLabel(root, 'score', 0, -46, 72, 18, 14);
      scoreLab.string = '0';
      scoreLab.color = new Color(255, 220, 120, 255);

      const flagHost = new Node('flags');
      root.addChild(flagHost);
      flagHost.layer = parent.layer;
      flagHost.addComponent(UITransform);
      flagHost.setPosition(L.flagX, L.flagY, 0);

      const handRoot = new Node('oppHand');
      parent.addChild(handRoot);
      handRoot.layer = parent.layer;
      handRoot.addComponent(UITransform);
      if (i === 0) {
        handRoot.active = false;
      } else {
        handRoot.setPosition(L.x + L.hx, L.y + L.hy, 0);
        handRoot.angle = L.handRot;
      }

      const meldRoot = new Node('meld');
      parent.addChild(meldRoot);
      meldRoot.layer = parent.layer;
      meldRoot.addComponent(UITransform);
      meldRoot.setPosition(meldPos[i].x, meldPos[i].y, 0);
      meldRoot.angle = meldPos[i].angle;

      this.seats.push({ root, nameLab, scoreLab, avatarG: ag, avatarSp: avSp, flagHost, handRoot, meldRoot });
    }
  }

  private buildDiscardAreas(parent: Node) {
    // 牌河贴中控外侧一圈，向外铺开（对标商业：每行/列 6 张网格）
    // 中控约 132×132 @ y=18 → 牌河锚点需离开台面边缘，避免第二行钻进中控
    const pos = [
      { x: 0, y: -108 },
      { x: 118, y: 18 },
      { x: 0, y: 128 },
      { x: -118, y: 18 },
    ];
    this.discardRoots = [];
    for (let i = 0; i < 4; i++) {
      const n = new Node(`discard${i}`);
      parent.addChild(n);
      n.layer = parent.layer;
      n.addComponent(UITransform);
      n.setPosition(pos[i].x, pos[i].y, 0);
      this.discardRoots.push(n);
    }
  }

  private buildFxLayer(parent: Node) {
    this.fxLayer = new Node('__FxLayer');
    parent.addChild(this.fxLayer);
    this.fxLayer.layer = parent.layer;
    this.fxLayer.addComponent(UITransform).setContentSize(1280, 720);
    this.fxLayer.setSiblingIndex(parent.children.length - 1);
  }

  private buildActionBtns(parent: Node) {
    // 初始坐标占位；真正排布在 layoutActionBar（手牌上方横排，对齐商业客户端）
    this.btnGuo = this.mkActionBtn(parent, 'btnGuo', 0, -210, 'weihai/ui/btn_guo');
    this.btnChi = this.mkActionBtn(parent, 'btnChi', 0, -210, 'weihai/ui/btn_chi');
    this.btnPeng = this.mkActionBtn(parent, 'btnPeng', 0, -210, 'weihai/ui/btn_peng');
    this.btnHu = this.mkActionBtn(parent, 'btnHu', 0, -210, 'weihai/ui/btn_hu');
    this.btnContinue = this.mkTextBtn(parent, 'btnCont', 0, -80, '继续打牌');
    this.btnChu = null;
    this.setActionButtons(false, false, false, false);
    if (this.btnContinue) this.btnContinue.node.active = false;
  }

  setNetBanner(text: string | null) {
    if (!this.netBanner) return;
    if (!text) {
      this.netBanner.node.active = false;
      this.netBanner.string = '';
      return;
    }
    this.netBanner.node.active = true;
    this.netBanner.string = text;
  }

  tickCountdown(dtSec: number) {
    if (!this.countdownActive || !this.countdownNode) return;
    this.countdownRemainMs = Math.max(0, this.countdownRemainMs - dtSec * 1000);
    this.redrawCountdownRing();
  }

  updateCountdown(deadlineMs: number | null, timeoutSec = 15) {
    if (!this.countdownNode || !this.countdownGfx) return;
    this.actionTimeoutMs = Math.max(1000, (timeoutSec || 15) * 1000);
    if (deadlineMs == null || deadlineMs <= 0) {
      this.countdownActive = false;
      this.countdownRemainMs = 0;
      this.redrawCountdownRing();
      return;
    }
    this.countdownRemainMs = deadlineMs;
    this.countdownActive = true;
    this.countdownNode.active = true;
    this.redrawCountdownRing();
  }

  private redrawCountdownRing() {
    if (!this.countdownGfx || !this.countdownSecLabel) return;
    const sec = Math.ceil(this.countdownRemainMs / 1000);
    this.countdownSecLabel.string = this.countdownActive && sec > 0 ? String(sec) : (this.countdownActive ? '0' : '--');
    const g = this.countdownGfx;
    g.clear();
    g.lineWidth = 5;
    g.strokeColor = new Color(50, 60, 75, 200);
    g.circle(0, 0, 34);
    g.stroke();
    if (!this.countdownActive) return;
    const ratio = Math.max(0, Math.min(1, this.countdownRemainMs / this.actionTimeoutMs));
    const warn = sec <= 5;
    g.strokeColor = warn ? new Color(255, 80, 60, 255) : new Color(70, 210, 255, 255);
    g.lineWidth = 5;
    if (ratio > 0.001) {
      const start = Math.PI / 2;
      const sweep = -Math.PI * 2 * ratio;
      g.arc(0, 0, 34, start, start + sweep, true);
      g.stroke();
    }
  }

  updateRemainCount(count: number | null | undefined) {
    if (!this.remainLabel) return;
    const next = count ?? -1;
    if (next < 0) {
      this.remainLabel.string = '剩 --';
      if (this.consoleRemainLab) this.consoleRemainLab.string = '剩 --';
      this.displayedRemain = -1;
      return;
    }
    if (this.displayedRemain < 0) {
      this.displayedRemain = next;
      this.remainLabel.string = `剩 ${next}`;
      if (this.consoleRemainLab) this.consoleRemainLab.string = `剩 ${next}`;
      return;
    }
    if (next === this.displayedRemain) return;
    rollNumber(this.remainLabel, this.displayedRemain, next, '剩 ', 0.35);
    if (this.consoleRemainLab) this.consoleRemainLab.string = `剩 ${next}`;
    this.displayedRemain = next;
  }

  animateCompassToRelSeat(rel: number) {
    this.setTurnRel(rel);
  }

  showHuEffect(kind: 'hu' | 'zimo' | 'dianpao') {
    const parent = this.root.getChildByName('__TableUI') || this.root;
    buildHuEffectLayer(parent, kind);
    AudioBus.playHu();
  }

  /** 牌河单张尺寸（略小于手牌，整齐网格不重叠） */
  private discardTileSize(): { tw: number; th: number } {
    return { tw: 22, th: 32 };
  }

  /**
   * 出牌河网格（对标截图二/三）：
   * - 每行/列 6 张
   * - 步进 = 牌宽高 + 缝，绝不压缩
   * - 第二行/列向外离开中控，避免叠进中心
   * rel: 0下 1右 2上 3左
   */
  private discardCellPos(rel: number, index: number, tw: number, th: number): { x: number; y: number } {
    const gap = 3;
    const perLine = 6;
    const stepX = tw + gap;
    const stepY = th + gap;
    const line = Math.floor(index / perLine);
    const slot = index % perLine;

    if (rel === 1 || rel === 3) {
      // 左右：竖列，第 0 列贴中控，之后向外
      const y = Math.round(((perLine - 1) / 2 - slot) * stepY);
      const x = rel === 1
        ? Math.round(line * stepX)
        : Math.round(-line * stepX);
      return { x, y };
    }
    // 上下：横行，第 0 行贴中控；自家向下铺，对家向上铺
    const x = Math.round((slot - (perLine - 1) / 2) * stepX);
    const y = rel === 0
      ? Math.round(-line * stepY)
      : Math.round(line * stepY);
    return { x, y };
  }

  async flyDiscardToRiver(
    relSeat: number,
    tile: number,
    fromWorld?: Vec3,
  ) {
    const fx = this.fxLayer;
    const root = this.discardRoots[relSeat];
    if (!fx?.isValid || !root?.isValid) return;
    const { tw, th } = this.discardTileSize();
    const idx = root.children.length;
    const cell = this.discardCellPos(relSeat, idx, tw, th);
    const toLocal = new Vec3(cell.x, cell.y, 0);
    const toWorld = root.getComponent(UITransform)!.convertToWorldSpaceAR(toLocal);
    const from = fromWorld ?? this.seatDiscardOrigin(relSeat);
    const fromLocal = fx.getComponent(UITransform)!.convertToNodeSpaceAR(from);
    const to = fx.getComponent(UITransform)!.convertToNodeSpaceAR(toWorld);
    await flyTile(fx, tile, fromLocal, to, tw, th, 0.3);
  }

  private seatDiscardOrigin(rel: number): Vec3 {
    const slot = this.seats[rel];
    if (!slot) return new Vec3(0, 0, 0);
    const ui = slot.root.getComponent(UITransform)!;
    return ui.convertToWorldSpaceAR(new Vec3(0, 0, 0));
  }

  async playDealSequence(myHandCount: number) {
    const fx = this.fxLayer;
    if (!fx?.isValid) return;
    const center = new Vec3(0, 40, 0);
    const targets: Vec3[] = [];
    for (let i = 0; i < 4; i++) {
      const slot = this.seats[i];
      if (!slot) continue;
      const ui = slot.handRoot.getComponent(UITransform)!;
      targets[i] = ui.convertToWorldSpaceAR(new Vec3(0, 0, 0));
    }
    const selfTarget = this.handRoot.getComponent(UITransform)!.convertToWorldSpaceAR(new Vec3(0, 0, 0));
    targets[0] = selfTarget;
    const counts = [myHandCount, 13, 13, 13];
    for (let round = 0; round < 3; round++) {
      for (let s = 0; s < 4; s++) {
        const to = fx.getComponent(UITransform)!.convertToNodeSpaceAR(targets[s]);
        await flyTile(fx, -1, center, to, 22, 32, 0.08);
      }
    }
    for (let s = 0; s < 4; s++) {
      const n = Math.min(counts[s] - 9, 4);
      for (let k = 0; k < n; k++) {
        const to = fx.getComponent(UITransform)!.convertToNodeSpaceAR(targets[s]);
        await flyTile(fx, -1, center, to, 22, 32, 0.06);
      }
    }
  }

  animateHandReflow(handRoot: Node, positions: number[], origin: number, drawIdx = -1) {
    const nodes = handRoot.children.slice();
    if (!nodes.length) return;
    const targetXs = positions.map((p) => Math.round(origin + p));
    if (drawIdx >= 0 && drawIdx < nodes.length) {
      const n = nodes[drawIdx];
      if (n?.isValid) {
        const tx = targetXs[drawIdx];
        n.setPosition(tx + 80, 40, 0);
        stopNodeTweens(n);
        tween(n).to(0.22, { position: new Vec3(tx, 0, 0) }, { easing: 'backOut' }).start();
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      if (i === drawIdx) continue;
      const n = nodes[i];
      if (!n?.isValid) continue;
      const tx = targetXs[i];
      stopNodeTweens(n);
      tween(n).to(0.18, { position: new Vec3(tx, n.position.y, 0) }, { easing: 'quadOut' }).start();
    }
  }

  /** 结算：商业美术窗（RoundSettlementWnd / settle 美术壳） */
  showResultOverlay(
    title: string,
    sub: string,
    primaryLabel: string,
    onPrimary?: () => void,
    secondaryLabel?: string,
    onSecondary?: () => void,
    settle?: ResultSettleInfo | null,
  ) {
    const parent = this.root.getChildByName('__TableUI') || this.root;
    void SettleWnd.show(parent, {
      title,
      sub,
      roomId: settle?.roomId,
      primaryLabel,
      onPrimary,
      secondaryLabel,
      onSecondary,
      settle,
    });
  }

  hideResultOverlay() {
    const parent = this.root?.getChildByName('__TableUI') || this.root;
    SettleWnd.hide(parent);
  }

  /** 仅显示你真正能用的操作；横排在手牌上方偏右（参考威海/口袋麻将） */
  setActionButtons(show: boolean, canPeng: boolean, canHu: boolean, canChi = false) {
    const sig = `${show}|${canPeng}|${canHu}|${canChi}`;
    const changed = sig !== this.lastActionSig;
    this.lastActionSig = sig;

    const items: { btn: Button | null; on: boolean }[] = [
      { btn: this.btnGuo, on: show },
      { btn: this.btnChi, on: show && canChi },
      { btn: this.btnPeng, on: show && canPeng },
      { btn: this.btnHu, on: show && canHu },
    ];
    for (const { btn, on } of items) {
      if (!btn) continue;
      const was = btn.node.active;
      btn.node.active = on;
      if (on && changed && !was) {
        stopNodeTweens(btn.node);
        btn.node.setScale(1, 1, 1);
        let op = btn.node.getComponent(UIOpacity);
        if (!op) op = btn.node.addComponent(UIOpacity);
        op.opacity = 255;
      }
    }
    this.layoutActionBar();
  }

  /** 可见操作钮：从右往左 胡→碰→吃→过，手牌上方一排 */
  private layoutActionBar() {
    const order = [this.btnHu, this.btnPeng, this.btnChi, this.btnGuo];
    const visible = order.filter((b) => b?.node?.active);
    const size = 70;
    const gap = 12;
    const y = -218;
    const rightX = 490;
    visible.forEach((btn, i) => {
      if (!btn) return;
      btn.node.setPosition(rightX - i * (size + gap), y, 0);
    });
  }

  hideChiPicker() {
    if (this.chiPicker?.isValid) this.chiPicker.destroy();
    this.chiPicker = null;
  }

  /**
   * 多吃法选择：每组三张牌（手牌两张 + 上家打出），点选后回调。
   * options: [[t1,t2,discard], ...]
   */
  showChiPicker(
    options: number[][],
    onPick: (tiles: number[]) => void,
    onCancel?: () => void,
  ) {
    this.hideChiPicker();
    const parent = this.root.getChildByName('__TableUI') || this.root;
    const host = new Node('__ChiPicker');
    parent.addChild(host);
    host.layer = parent.layer;
    host.setSiblingIndex(parent.children.length - 1);
    this.chiPicker = host;

    const n = Math.max(1, options.length);
    const cardW = 130;
    const gap = 16;
    const panelW = Math.min(620, n * cardW + (n - 1) * gap + 48);
    const panelH = 160;
    host.addComponent(UITransform).setContentSize(panelW, panelH);
    host.setPosition(0, -155, 0);

    const bg = host.addComponent(Graphics);
    bg.fillColor = new Color(12, 18, 28, 235);
    bg.roundRect(-panelW / 2, -panelH / 2, panelW, panelH, 14);
    bg.fill();
    bg.strokeColor = new Color(212, 168, 72, 200);
    bg.lineWidth = 2;
    bg.roundRect(-panelW / 2, -panelH / 2, panelW, panelH, 14);
    bg.stroke();

    const title = this.mkLabel(host, 'chiTitle', 0, 58, 280, 28, 20);
    title.string = '选择吃法';
    title.color = new Color(255, 230, 160, 255);

    const startX = -((n - 1) * (cardW + gap)) / 2;
    options.forEach((tiles, i) => {
      const card = new Node(`chi${i}`);
      host.addChild(card);
      card.layer = host.layer;
      card.setPosition(startX + i * (cardW + gap), 0, 0);
      card.addComponent(UITransform).setContentSize(cardW, 92);
      const cg = card.addComponent(Graphics);
      cg.fillColor = new Color(40, 52, 68, 245);
      cg.roundRect(-cardW / 2, -46, cardW, 92, 10);
      cg.fill();
      cg.strokeColor = new Color(220, 180, 90, 180);
      cg.lineWidth = 1.5;
      cg.roundRect(-cardW / 2, -46, cardW, 92, 10);
      cg.stroke();

      const tw = 32;
      const th = 46;
      const trio = tiles.slice(0, 3);
      const total = trio.length * (tw + 4) - 4;
      void (async () => {
        let x = -total / 2 + tw / 2;
        for (let k = 0; k < trio.length; k++) {
          const tn = await createTileNode(trio[k], card, tw, th);
          if (!tn?.isValid) continue;
          tn.setPosition(x, 6, 0);
          if (k === 2) {
            const mark = new Node('from');
            tn.addChild(mark);
            mark.layer = tn.layer;
            mark.addComponent(UITransform).setContentSize(tw + 4, th + 4);
            const mg = mark.addComponent(Graphics);
            mg.lineWidth = 2.5;
            mg.strokeColor = new Color(80, 200, 120, 255);
            mg.roundRect(-(tw + 2) / 2, -(th + 2) / 2, tw + 2, th + 2, 3);
            mg.stroke();
          }
          x += tw + 4;
        }
      })();

      card.addComponent(Button).node.on(Button.EventType.CLICK, () => {
        AudioBus.playButton();
        this.hideChiPicker();
        onPick(tiles.slice(0, 2));
      });
    });

    const cancel = this.mkTextBtn(host, 'chiCancel', panelW / 2 - 56, panelH / 2 - 20, '取消');
    cancel.node.getComponent(UITransform)!.setContentSize(96, 30);
    const cgBtn = cancel.node.getComponent(Graphics);
    if (cgBtn) {
      cgBtn.clear();
      cgBtn.fillColor = new Color(190, 55, 40, 255);
      cgBtn.roundRect(-48, -15, 96, 30, 8);
      cgBtn.fill();
    }
    cancel.node.on(Button.EventType.CLICK, () => {
      AudioBus.playButton();
      this.hideChiPicker();
      onCancel?.();
    });
  }

  setActionVisible(showOps: boolean) {
    this.setActionButtons(showOps, showOps, showOps, showOps);
  }

  setChuVisible(v: boolean) {
    if (this.btnChu) this.btnChu.node.active = v;
  }

  private mkLabel(parent: Node, name: string, x: number, y: number, w: number, h: number, size: number): Label {
    const n = new Node(name);
    parent.addChild(n);
    n.layer = parent.layer;
    n.addComponent(UITransform).setContentSize(w, h);
    n.setPosition(x, y, 0);
    const lab = n.addComponent(Label);
    styleLabel(lab, size);
    lab.overflow = Label.Overflow.SHRINK;
    return lab;
  }

  private mkActionBtn(parent: Node, name: string, x: number, y: number, path: string): Button {
    const n = new Node(name);
    parent.addChild(n);
    n.layer = parent.layer;
    const maxPx = 72;
    n.addComponent(UITransform).setContentSize(maxPx, maxPx);
    n.setPosition(x, y, 0);
    const sp = n.addComponent(Sprite);
    sp.sizeMode = Sprite.SizeMode.CUSTOM;
    sp.type = Sprite.Type.SIMPLE;
    const btn = n.addComponent(Button);
    btn.transition = Button.Transition.SCALE;
    btn.zoomScale = 0.92;
    btn.target = n;
    void loadSpriteFrame(path).then((sf) => {
      if (sf && n.isValid) {
        sp.spriteFrame = sf;
        const ui = n.getComponent(UITransform)!;
        const tw = sf.originalSize?.width || maxPx;
        const th = sf.originalSize?.height || maxPx;
        const s = Math.min(maxPx / tw, maxPx / th);
        ui.setContentSize(Math.round(tw * s), Math.round(th * s));
      }
    });
    return btn;
  }

  private mkTextBtn(parent: Node, name: string, x: number, y: number, text: string): Button {
    const n = new Node(name);
    parent.addChild(n);
    n.layer = parent.layer;
    n.addComponent(UITransform).setContentSize(130, 52);
    n.setPosition(x, y, 0);
    const g = n.addComponent(Graphics);
    g.fillColor = new Color(190, 55, 40, 255);
    g.roundRect(-65, -26, 130, 52, 10);
    g.fill();
    const lab = this.mkLabel(n, 't', 0, 0, 110, 36, 26);
    lab.string = text;
    const btn = n.addComponent(Button);
    btn.transition = Button.Transition.SCALE;
    return btn;
  }

  private async putFlag(host: Node, path: string, x: number, y: number) {
    const n = new Node(path);
    host.addChild(n);
    n.layer = host.layer;
    n.addComponent(UITransform).setContentSize(24, 24);
    n.setPosition(x, y, 0);
    const sp = n.addComponent(Sprite);
    sp.sizeMode = Sprite.SizeMode.CUSTOM;
    const sf = await loadSpriteFrame(path);
    if (sf && n.isValid) sp.spriteFrame = sf;
  }

  updateSeats(players: SeatPlayer[], myId: number, actUser: number) {
    const me = players.find((p) => p.userId === myId);
    const mySeat = me?.seatIndex ?? 0;
    const byRel: (SeatPlayer | undefined)[] = [undefined, undefined, undefined, undefined];
    for (const p of players) {
      byRel[(p.seatIndex - mySeat + 4) % 4] = p;
    }
    for (let i = 0; i < 4; i++) {
      const p = byRel[i];
      const slot = this.seats[i];
      if (!slot) continue;
      slot.flagHost.removeAllChildren();
      if (!p) {
        slot.nameLab.string = '空位';
        slot.scoreLab.string = '';
        continue;
      }
      slot.nameLab.string = p.userName || String(p.userId);
      slot.scoreLab.string = String(p.totalScore ?? 0);
      // 行动中高亮描边
      slot.avatarG.clear();
      const active = p.userId === actUser;
      slot.avatarG.fillColor = new Color(28, 28, 28, 230);
      slot.avatarG.circle(0, 0, 24);
      slot.avatarG.fill();
      slot.avatarG.strokeColor = active
        ? new Color(255, 80, 60, 255)
        : new Color(220, 180, 80, 255);
      slot.avatarG.lineWidth = active ? 3.5 : 2.5;
      slot.avatarG.circle(0, 0, 24);
      slot.avatarG.stroke();

      // 竖排标：庄 / 房 / 不飘
      let fy = 12;
      if (p.zhuang) { void this.putFlag(slot.flagHost, 'weihai/ui/flag_zhuang', 0, fy); fy -= 26; }
      if (p.owner) { void this.putFlag(slot.flagHost, 'weihai/ui/flag_owner', 0, fy); fy -= 26; }
      void this.putFlag(slot.flagHost, 'weihai/ui/flag_bupiao', 0, fy);
    }
    this.updateCompassLight(players, myId, actUser);
    void this.updateOppHands(byRel);
  }

  private updateCompassLight(players: SeatPlayer[], myId: number, actUser: number) {
    const me = players.find((p) => p.userId === myId);
    const act = players.find((p) => p.userId === actUser);
    if (!me || !act) {
      this.setTurnRel(-1);
      return;
    }
    const rel = (act.seatIndex - me.seatIndex + 4) % 4;
    this.setTurnRel(rel);
  }

  private async updateOppHands(byRel: (SeatPlayer | undefined)[]) {
    for (let i = 0; i < 4; i++) {
      const slot = this.seats[i];
      if (!slot) continue;
      slot.handRoot.removeAllChildren();
      if (i === 0) continue; // 自己用手牌区
      const p = byRel[i];
      const n = Math.min(p?.handCount || 13, 14);
      const tw = 22;
      const justDrew = n % 3 === 2;
      const gap = 1;
      const drawGap = 8;
      const total = n * tw + Math.max(0, n - 1) * gap + (justDrew ? drawGap : 0);
      let x = -total / 2 + tw / 2;
      for (let k = 0; k < n; k++) {
        const tile = await createTileNode(-1, slot.handRoot, tw, 32);
        tile.setPosition(x, 0, 0);
        if (k < n - 1) {
          x += tw + gap;
          if (justDrew && k === n - 2) x += drawGap;
        }
      }
    }
  }

  async updateDiscards(
    players: SeatPlayer[],
    myId: number,
    highlightTile: number | null = null,
    highlightKind: 'claim' | 'hu' | null = null,
  ) {
    const me = players.find((p) => p.userId === myId);
    const mySeat = me?.seatIndex ?? 0;
    for (let i = 0; i < 4; i++) this.discardRoots[i]?.removeAllChildren();
    const { tw, th } = this.discardTileSize();
    for (const p of players) {
      const rel = (p.seatIndex - mySeat + 4) % 4;
      const root = this.discardRoots[rel];
      if (!root || !p.discard?.length) continue;
      for (let i = 0; i < p.discard.length; i++) {
        const tile = p.discard[i];
        const n = await createTileNode(tile, root, tw, th);
        const cell = this.discardCellPos(rel, i, tw, th);
        n.setPosition(cell.x, cell.y, 0);
        // 刚打出的那张：吃碰黄框 / 可胡红框
        if (highlightKind && highlightTile != null && i === p.discard.length - 1 && tile === highlightTile) {
          TableLayout.markTileHighlight(n, highlightKind);
        }
      }
    }
  }

  async updateMelds(players: SeatPlayer[], myId: number, animateNew = false) {
    const me = players.find((p) => p.userId === myId);
    const mySeat = me?.seatIndex ?? 0;
    const tw = 24;
    const th = 34;
    for (const p of players) {
      const rel = (p.seatIndex - mySeat + 4) % 4;
      const root = this.seats[rel]?.meldRoot;
      if (!root) continue;
      const prevGroups = this.meldCounts[rel] || 0;
      const meldList = p.melds?.length ? p.melds : (p.peng || []).map((t) => ({ kind: 'peng', tiles: [t, t, t] }));
      const groups = meldList.length;
      root.removeAllChildren();
      if (!groups) {
        this.meldCounts[rel] = 0;
        if (rel === 0) this.handRoot.setPosition(0, -308, 0);
        continue;
      }
      // 自己副露从左往右铺在手牌左侧；其余座位组居中
      let totalW = 0;
      for (const m of meldList) {
        const cnt = m.kind === 'gang' || m.kind === 'an_gang' || m.kind === 'ming_gang' || m.kind === 'bu_gang' ? 4 : 3;
        totalW += cnt * (tw + 1) + 12;
      }
      totalW = Math.max(0, totalW - 12);
      let x = -totalW / 2;
      let gi = 0;
      for (const m of meldList) {
        const tiles = m.tiles?.length ? m.tiles : [0, 0, 0];
        const cnt = m.kind === 'gang' || m.kind === 'an_gang' || m.kind === 'ming_gang' || m.kind === 'bu_gang' ? 4 : 3;
        for (let k = 0; k < cnt; k++) {
          const tile = tiles[Math.min(k, tiles.length - 1)];
          const n = await createTileNode(tile, root, tw, th);
          n.setPosition(x + tw / 2, 0, 0);
          if (animateNew && gi >= prevGroups) {
            n.setScale(0.3, 0.3, 1);
            popIn(n, gi * 0.04);
          }
          x += tw + 1;
        }
        x += 12;
        gi++;
      }
      this.meldCounts[rel] = groups;
      // 手牌始终居中；副露在左侧独立区域
      if (rel === 0) {
        this.handRoot.setPosition(0, -308, 0);
        const handHalf = Math.min(360, 40 + (this.handRoot.children.length || 13) * 28);
        root.setPosition(-(handHalf + totalW / 2 + 20), -308, 0);
      }
    }
  }
}
