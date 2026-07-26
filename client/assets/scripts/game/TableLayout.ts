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
  handRoot: Node;
  discardRoots: Node[] = [];
  seats: SeatSlot[] = [];
  compassNode: Node | null = null;
  lightNode: Node | null = null;
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

    this.buildCompass(ui);
    this.buildSeats(ui);
    this.buildDiscardAreas(ui);
    this.buildHud(ui);
    this.buildActionBtns(ui);
    this.buildFxLayer(ui);
    this.buildCountdownRing(ui);

    this.handRoot = new Node('__HandRoot');
    ui.addChild(this.handRoot);
    this.handRoot.layer = ui.layer;
    this.handRoot.addComponent(UITransform);
    this.handRoot.setPosition(0, -292, 0);
  }

  private buildHud(parent: Node) {
    this.tipLabel = this.mkLabel(parent, 'tip', 0, 200, 880, 34, 24);
    this.tingLabel = this.mkLabel(parent, 'ting', 0, 168, 980, 32, 22);
    if (this.tingLabel) {
      this.tingLabel.color = new Color(255, 230, 120, 255);
      this.tingLabel.string = '';
      this.tingLabel.node.active = false;
    }
    this.netBanner = this.mkLabel(parent, 'netBanner', 0, 260, 880, 30, 22);
    if (this.netBanner) {
      this.netBanner.color = new Color(255, 200, 80, 255);
      this.netBanner.node.active = false;
    }
    this.roomLabel = this.mkLabel(parent, 'room', 460, 320, 280, 28, 20);
    this.roundLabel = this.mkLabel(parent, 'round', -160, 50, 120, 28, 20);
    this.remainLabel = this.mkLabel(parent, 'remain', 160, 50, 140, 28, 20);
    if (this.roundLabel) this.roundLabel.string = '第 1 局';
    if (this.remainLabel) this.remainLabel.string = '剩 --';

    // 随时可回大厅
    this.exitBtn = this.mkTextBtn(parent, 'btnExit', -520, 320, '回大厅');
    const exitUi = this.exitBtn.node.getComponent(UITransform);
    if (exitUi) exitUi.setContentSize(120, 48);
    this.exitBtn.node.setPosition(-520, 320, 0);
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

  private buildCompass(parent: Node) {
    const box = new Node('compass');
    parent.addChild(box);
    box.layer = parent.layer;
    box.addComponent(UITransform).setContentSize(180, 180);
    box.setPosition(0, 28, 0);
    this.compassNode = box;

    void loadSpriteFrame('weihai/ui/pointer_base').then((sf) => {
      if (!sf || !box.isValid) return;
      const spn = new Node('base');
      box.addChild(spn);
      spn.layer = box.layer;
      spn.addComponent(UITransform).setContentSize(160, 160);
      const sp = spn.addComponent(Sprite);
      sp.sizeMode = Sprite.SizeMode.CUSTOM;
      sp.spriteFrame = sf;
    });
    void loadSpriteFrame('weihai/ui/pointer_dir').then((sf) => {
      if (!sf || !box.isValid) return;
      const spn = new Node('dir');
      box.addChild(spn);
      spn.layer = box.layer;
      spn.addComponent(UITransform).setContentSize(150, 150);
      const sp = spn.addComponent(Sprite);
      sp.sizeMode = Sprite.SizeMode.CUSTOM;
      sp.spriteFrame = sf;
    });
    void loadSpriteFrame('weihai/ui/pointer_light').then((sf) => {
      if (!sf || !box.isValid) return;
      const spn = new Node('light');
      box.addChild(spn);
      spn.layer = box.layer;
      spn.addComponent(UITransform).setContentSize(150, 150);
      const sp = spn.addComponent(Sprite);
      sp.sizeMode = Sprite.SizeMode.CUSTOM;
      sp.spriteFrame = sf;
      this.lightNode = spn;
      spn.angle = 0;
    });
  }

  /** 相对座位：0 自己底、1 右、2 对家、3 左 */
  private buildSeats(parent: Node) {
    const layouts = [
      { x: -480, y: -230, hx: 0, hy: 70, handRot: 0 },
      { x: 520, y: 40, hx: -90, hy: 0, handRot: 90 },
      { x: 0, y: 300, hx: 0, hy: -55, handRot: 180 },
      { x: -540, y: 40, hx: 90, hy: 0, handRot: -90 },
    ];
    this.seats = [];
    for (let i = 0; i < 4; i++) {
      const L = layouts[i];
      const root = new Node(`seat${i}`);
      parent.addChild(root);
      root.layer = parent.layer;
      root.addComponent(UITransform).setContentSize(160, 120);
      root.setPosition(L.x, L.y, 0);

      // 头像底 + 默认头像图
      const av = new Node('avatar');
      root.addChild(av);
      av.layer = parent.layer;
      av.addComponent(UITransform).setContentSize(72, 72);
      av.setPosition(0, 28, 0);
      const ag = av.addComponent(Graphics);
      ag.fillColor = new Color(30, 30, 30, 220);
      ag.circle(0, 0, 34);
      ag.fill();
      ag.strokeColor = new Color(220, 180, 80, 255);
      ag.lineWidth = 3;
      ag.circle(0, 0, 34);
      ag.stroke();
      const avImg = new Node('img');
      av.addChild(avImg);
      avImg.layer = parent.layer;
      avImg.addComponent(UITransform).setContentSize(64, 64);
      const avSp = avImg.addComponent(Sprite);
      avSp.sizeMode = Sprite.SizeMode.CUSTOM;
      void loadSpriteFrame('weihai/ui/avatar_default').then((sf) => {
        if (sf && avImg.isValid) avSp.spriteFrame = sf;
      });

      // 名字底条
      const nameBg = new Node('nameBg');
      root.addChild(nameBg);
      nameBg.layer = parent.layer;
      nameBg.addComponent(UITransform).setContentSize(140, 28);
      nameBg.setPosition(0, -28, 0);
      const nsp = nameBg.addComponent(Sprite);
      nsp.sizeMode = Sprite.SizeMode.CUSTOM;
      void loadSpriteFrame('weihai/ui/name_bg').then((sf) => {
        if (sf && nameBg.isValid) nsp.spriteFrame = sf;
      });

      const nameLab = this.mkLabel(root, 'name', 0, -28, 130, 26, 16);
      nameLab.string = '空位';
      const scoreLab = this.mkLabel(root, 'score', 0, -52, 100, 22, 16);
      scoreLab.string = '0';
      scoreLab.color = new Color(255, 220, 120, 255);

      const flagHost = new Node('flags');
      root.addChild(flagHost);
      flagHost.layer = parent.layer;
      flagHost.addComponent(UITransform);
      flagHost.setPosition(48, 48, 0);

      const handRoot = new Node('oppHand');
      parent.addChild(handRoot);
      handRoot.layer = parent.layer;
      handRoot.addComponent(UITransform);
      handRoot.setPosition(L.x + L.hx, L.y + L.hy, 0);
      handRoot.angle = L.handRot;

      const meldRoot = new Node('meld');
      parent.addChild(meldRoot);
      meldRoot.layer = parent.layer;
      meldRoot.addComponent(UITransform);
      // 碰杠区：自己手牌左侧，对家下方等
      const meldPos = [
        { x: -420, y: -292 },
        { x: 380, y: -40 },
        { x: -200, y: 250 },
        { x: -380, y: -40 },
      ];
      meldRoot.setPosition(meldPos[i].x, meldPos[i].y, 0);

      this.seats.push({ root, nameLab, scoreLab, avatarG: ag, avatarSp: avSp, flagHost, handRoot, meldRoot });
    }
  }

  private buildDiscardAreas(parent: Node) {
    // 左右家河略靠桌心，给竖排留宽
    const pos = [
      { x: 0, y: -95 },
      { x: 175, y: 25 },
      { x: 0, y: 145 },
      { x: -175, y: 25 },
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
    this.fxLayer.setSiblingIndex(parent.children.length - 2);
  }

  private buildCountdownRing(parent: Node) {
    const box = new Node('countdown');
    parent.addChild(box);
    box.layer = parent.layer;
    box.addComponent(UITransform).setContentSize(72, 72);
    box.setPosition(260, 50, 0);
    box.active = false;
    this.countdownNode = box;

    const ring = new Node('ring');
    box.addChild(ring);
    ring.layer = parent.layer;
    ring.addComponent(UITransform).setContentSize(72, 72);
    this.countdownGfx = ring.addComponent(Graphics);

    const sec = new Node('sec');
    box.addChild(sec);
    sec.layer = parent.layer;
    sec.addComponent(UITransform).setContentSize(48, 32);
    this.countdownSecLabel = sec.addComponent(Label);
    styleLabel(this.countdownSecLabel, 22);
    this.countdownSecLabel.string = '';
  }

  private buildActionBtns(parent: Node) {
    this.btnGuo = this.mkActionBtn(parent, 'btnGuo', 480, -40, 'weihai/ui/btn_guo');
    this.btnChi = this.mkActionBtn(parent, 'btnChi', 360, -40, 'weihai/ui/btn_chi');
    this.btnPeng = this.mkActionBtn(parent, 'btnPeng', 480, -150, 'weihai/ui/btn_peng');
    this.btnHu = this.mkActionBtn(parent, 'btnHu', 480, -260, 'weihai/ui/btn_hu');
    this.btnContinue = this.mkTextBtn(parent, 'btnCont', 0, -80, '继续打牌');
    this.btnAutoPlay = this.mkTextBtn(parent, 'btnAuto', -520, 250, '托管');
    this.btnDissolve = this.mkTextBtn(parent, 'btnDiss', -520, 180, '解散');
    this.btnChu = null;
    this.setActionButtons(false, false, false, false);
    if (this.btnContinue) this.btnContinue.node.active = false;
    if (this.btnAutoPlay) this.btnAutoPlay.node.active = true;
    if (this.btnDissolve) this.btnDissolve.node.active = true;
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
    if (this.countdownRemainMs <= 0) this.countdownNode.active = false;
  }

  updateCountdown(deadlineMs: number | null) {
    if (!this.countdownNode || !this.countdownGfx) return;
    if (deadlineMs == null || deadlineMs <= 0) {
      this.countdownActive = false;
      this.countdownNode.active = false;
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
    this.countdownSecLabel.string = sec > 0 ? String(sec) : '0';
    const g = this.countdownGfx;
    g.clear();
    g.lineWidth = 5;
    g.strokeColor = new Color(60, 60, 60, 180);
    g.circle(0, 0, 28);
    g.stroke();
    const ratio = Math.max(0, Math.min(1, this.countdownRemainMs / 15000));
    const warn = sec <= 5;
    g.strokeColor = warn ? new Color(255, 70, 50, 255) : new Color(120, 220, 100, 255);
    g.lineWidth = 5;
    if (ratio > 0.001) {
      const start = Math.PI / 2;
      const sweep = -Math.PI * 2 * ratio;
      g.arc(0, 0, 28, start, start + sweep, true);
      g.stroke();
    }
  }

  updateRemainCount(count: number | null | undefined) {
    if (!this.remainLabel) return;
    const next = count ?? -1;
    if (next < 0) {
      this.remainLabel.string = '剩 --';
      this.displayedRemain = -1;
      return;
    }
    if (this.displayedRemain < 0) {
      this.displayedRemain = next;
      this.remainLabel.string = `剩 ${next}`;
      return;
    }
    if (next === this.displayedRemain) return;
    rollNumber(this.remainLabel, this.displayedRemain, next, '剩 ', 0.35);
    this.displayedRemain = next;
  }

  animateCompassToRelSeat(rel: number) {
    if (!this.lightNode) return;
    const target = -rel * 90;
    if (this.compassAngle === target && Math.abs(this.lightNode.angle - target) < 0.5) {
      this.lightNode.angle = target;
      return;
    }
    this.compassAngle = target;
    stopNodeTweens(this.lightNode);
    this.lightNode.active = true;
    tween(this.lightNode)
      .to(0.35, { angle: target }, { easing: 'quadInOut' })
      .start();
  }

  showHuEffect(kind: 'hu' | 'zimo' | 'dianpao') {
    const parent = this.root.getChildByName('__TableUI') || this.root;
    buildHuEffectLayer(parent, kind);
    AudioBus.playHu();
  }

  /** 出牌河坐标：上下家横铺，左右家竖铺（避免侧家挤成一坨） */
  private discardCellPos(rel: number, index: number, tw: number, th: number): { x: number; y: number } {
    const gapX = 6;
    const gapY = 6;
    if (rel === 1 || rel === 3) {
      const perCol = 5;
      const row = index % perCol;
      const col = Math.floor(index / perCol);
      const y = Math.round(((perCol - 1) / 2 - row) * (th + gapY));
      // 左家列向右（桌心），右家列向左（桌心）
      const x = rel === 3
        ? Math.round(col * (tw + gapX))
        : Math.round(-col * (tw + gapX));
      return { x, y };
    }
    const cols = 6;
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = Math.round((col - (cols - 1) / 2) * (tw + gapX));
    const y = Math.round(-row * (th + gapY));
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
    const tw = 28;
    const th = 40;
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

  /** 仅显示你真正能用的操作（避免反复 popIn 造成残影感） */
  setActionButtons(show: boolean, canPeng: boolean, canHu: boolean, canChi = false) {
    const sig = `${show}|${canPeng}|${canHu}|${canChi}`;
    const changed = sig !== this.lastActionSig;
    this.lastActionSig = sig;

    const items: { btn: Button | null; on: boolean }[] = [
      { btn: this.btnGuo, on: show },
      { btn: this.btnPeng, on: show && canPeng },
      { btn: this.btnHu, on: show && canHu },
      { btn: this.btnChi, on: show && canChi },
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
    n.addComponent(UITransform).setContentSize(100, 100);
    n.setPosition(x, y, 0);
    const sp = n.addComponent(Sprite);
    sp.sizeMode = Sprite.SizeMode.CUSTOM;
    sp.type = Sprite.Type.SIMPLE;
    // 避免 Button 默认再叠一层 target 贴图造成「重影」
    const btn = n.addComponent(Button);
    btn.transition = Button.Transition.SCALE;
    btn.zoomScale = 0.94;
    btn.target = n;
    void loadSpriteFrame(path).then((sf) => {
      if (sf && n.isValid) {
        sp.spriteFrame = sf;
        const ui = n.getComponent(UITransform)!;
        const tw = sf.originalSize?.width || 100;
        const th = sf.originalSize?.height || 100;
        const s = Math.min(100 / tw, 100 / th);
        ui.setContentSize(tw * s, th * s);
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
    n.addComponent(UITransform).setContentSize(36, 36);
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
      slot.avatarG.fillColor = new Color(30, 30, 30, 220);
      slot.avatarG.circle(0, 0, 34);
      slot.avatarG.fill();
      slot.avatarG.strokeColor = active
        ? new Color(255, 80, 60, 255)
        : new Color(220, 180, 80, 255);
      slot.avatarG.lineWidth = active ? 4 : 3;
      slot.avatarG.circle(0, 0, 34);
      slot.avatarG.stroke();

      let fx = 0;
      if (p.zhuang) { void this.putFlag(slot.flagHost, 'weihai/ui/flag_zhuang', fx, 0); fx += 28; }
      if (p.owner) { void this.putFlag(slot.flagHost, 'weihai/ui/flag_owner', fx, 0); fx += 28; }
      void this.putFlag(slot.flagHost, 'weihai/ui/flag_bupiao', fx, 0);
    }
    this.updateCompassLight(players, myId, actUser);
    void this.updateOppHands(byRel);
  }

  private updateCompassLight(players: SeatPlayer[], myId: number, actUser: number) {
    if (!this.lightNode) return;
    const me = players.find((p) => p.userId === myId);
    const act = players.find((p) => p.userId === actUser);
    if (!me || !act) {
      this.lightNode.active = false;
      return;
    }
    const rel = (act.seatIndex - me.seatIndex + 4) % 4;
    this.animateCompassToRelSeat(rel);
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
      let x = -((n - 1) * (tw + 1)) / 2;
      for (let k = 0; k < n; k++) {
        const tile = await createTileNode(-1, slot.handRoot, tw, 32);
        // createTileNode with -1 may fail face — use back only
        tile.setPosition(x, 0, 0);
        x += tw + 1;
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
    const tw = 28;
    const th = 40;
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
    const tw = 26;
    const th = 36;
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
        continue;
      }
      let x = 0;
      let gi = 0;
      for (const m of meldList) {
        const tiles = m.tiles?.length ? m.tiles : [0, 0, 0];
        const cnt = m.kind === 'gang' || m.kind === 'an_gang' || m.kind === 'ming_gang' || m.kind === 'bu_gang' ? 4 : 3;
        for (let k = 0; k < cnt; k++) {
          const tile = tiles[Math.min(k, tiles.length - 1)];
          const n = await createTileNode(tile, root, tw, th);
          n.setPosition(x, 0, 0);
          if (animateNew && gi >= prevGroups) {
            n.setScale(0.3, 0.3, 1);
            popIn(n, gi * 0.04);
          }
          x += tw + 1;
        }
        x += 10;
        gi++;
      }
      this.meldCounts[rel] = groups;
    }
  }
}
