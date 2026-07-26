import {
  _decorator, Component, Label, EditBox, Button, Node, UITransform, director, Sprite, Layers, Color,
} from 'cc';
import { NetBus } from '../comm/NetBus';
import { attachBg, skinButton, styleLabel, loadSpriteFrame } from '../comm/ArtBg';
import { attachHallMeiNv } from './HallMeiNv';
import { gameDisplayName, loadTableScene } from '../game/TableRouter';

const { ccclass, property } = _decorator;

type RecordItem = {
  id?: number;
  roomId?: number;
  gameId?: string;
  roundNo?: number;
  reason?: string;
  detail?: string;
  seat?: number;
  scoreDelta?: number;
  createdAt?: number;
};

@ccclass('HallScene')
export class HallScene extends Component {
  @property(Label)
  infoLabel: Label | null = null;

  @property(Label)
  roomLabel: Label | null = null;

  @property(EditBox)
  joinEdit: EditBox | null = null;

  @property(Button)
  createBtn: Button | null = null;

  @property(Button)
  joinBtn: Button | null = null;

  @property(Button)
  prepareBtn: Button | null = null;

  @property(Button)
  recordsBtn: Button | null = null;

  @property(Button)
  profileBtn: Button | null = null;

  private roomId = -1;
  private gameId = 'changsha_mj';
  private unsubs: Array<() => void> = [];
  private enteringTable = false;
  private creating = false;
  private recordsPanel: Node | null = null;
  private recordsLabel: Label | null = null;
  private profilePanel: Node | null = null;
  private profileNameEdit: EditBox | null = null;
  private profileAvatarEdit: EditBox | null = null;
  private passwordEdit: EditBox | null = null;
  private balanceLabel: Label | null = null;
  private gamePickRoot: Node | null = null;
  private matching = false;

  onDestroy() {
    this.clearSubs();
  }

  private clearSubs() {
    for (const u of this.unsubs) u();
    this.unsubs = [];
  }

  async onLoad() {
    this.layoutUi();
    this.wireButtons();
    attachBg(this.node.parent ?? this.node, 'weihai/bg/hall');

    if (this.joinEdit) {
      this.joinEdit.maxLength = 16;
      this.joinEdit.placeholder = '输入房间号';
    }

    const u = (globalThis as any).__HNQP__ || (globalThis as any).__WHMJ__ || {};
    this.setInfo(`玩家 ${u.userName || '?'} (${u.userId || '?'})`);
    this.refreshBalanceLabel(u.roomCard, u.diamond);
    this.setRoom('湘桌 · 选择玩法后创建或匹配房间');

    this.unsubs.push(NetBus.ins.on('platform', 'state', (body) => this.onState(body)));
    this.unsubs.push(NetBus.ins.on('platform', 'matchResult', (body) => this.onMatchResult(body)));
    this.unsubs.push(NetBus.ins.on('platform', 'matchQueueResult', (body) => {
      if (body?.queued) {
        this.matching = true;
        this.setRoom(`匹配中… ${body.gameId} (${body.position}/${body.need})`);
      }
    }));
    this.unsubs.push(NetBus.ins.on('platform', 'cancelMatchResult', (body) => {
      this.matching = false;
      if (body?.cancelled) this.setRoom('已取消匹配');
    }));
    this.unsubs.push(NetBus.ins.on('platform', 'error', (body) => {
      this.setRoom(body?.message || '错误');
    }));
    this.unsubs.push(NetBus.ins.onConnState((state, detail) => {
      if (state === 'connected') return;
      if (state === 'reconnecting') this.setRoom(detail || '重连中…');
      else if (state === 'network_poor') this.setRoom(detail || '网络不稳定…');
      else if (state === 'disconnected') this.setRoom(detail || '已断开');
    }));

    const ok = await this.ensureConnected();
    if (!ok) return;
    void this.refreshBalance();
  }

  private refreshBalanceLabel(roomCard?: number, diamond?: number) {
    if (!this.balanceLabel?.isValid) return;
    const rc = roomCard ?? (globalThis as any).__HNQP__?.roomCard ?? '?';
    const dia = diamond ?? (globalThis as any).__HNQP__?.diamond ?? 0;
    this.balanceLabel.string = `房卡 ${rc}  ·  钻石 ${dia}`;
  }

  private async refreshBalance() {
    try {
      const msg = await NetBus.ins.getBalance();
      if (msg.cmd === 'error') return;
      const b = msg.body || {};
      const u = (globalThis as any).__HNQP__ || {};
      u.roomCard = b.roomCard ?? u.roomCard;
      u.diamond = b.diamond ?? u.diamond;
      (globalThis as any).__HNQP__ = u;
      this.refreshBalanceLabel(u.roomCard, u.diamond);
      if (u.dailyGift > 0) {
        this.setRoom(`每日登录赠送 ${u.dailyGift} 房卡`);
        u.dailyGift = 0;
      }
    } catch { /* ignore */ }
  }

  private onMatchResult(body: any) {
    if (!body?.ok) return;
    this.matching = false;
    if (body.roomId) this.roomId = body.roomId;
    if (this.joinEdit) this.joinEdit.string = String(body.roomId || '');
    if (body.state) this.onState(body.state);
    else this.setRoom(`匹配成功，房间 ${body.roomId}`);
  }

  private onState(body: any) {
    if (!body) return;
    if (body.roomId) this.roomId = body.roomId;
    if (body.state === 'playing' && !this.enteringTable) {
      this.enteringTable = true;
      this.setRoom(`房间 ${this.roomId} 开局！`);
      (globalThis as any).__HNQP_ROOM__ = body;
      if (body.gameId) this.gameId = body.gameId;
      this.clearSubs();
      void loadTableScene(body.gameId).catch((err) => console.warn('[Hall] load table', err));
    } else if (body.state === 'waiting') {
      if (body.gameId) this.gameId = body.gameId;
      this.setRoom(`房间 ${body.roomId} · ${gameDisplayName(body.gameId)} · 点确定开局`);
    }
  }

  private findNode(name: string): Node | null {
    return this.node.getChildByName(name)
      ?? this.node.parent?.getChildByName(name)
      ?? null;
  }

  private layoutUi() {
    const canvas = this.node.parent ?? this.node;
    this.decorateHall(canvas);

    const createN = this.createBtn?.node ?? this.findNode('CreateBtn');
    const joinN = this.joinBtn?.node ?? this.findNode('JoinBtn');
    const prepN = this.prepareBtn?.node ?? this.findNode('PrepareBtn');
    const clubN = this.findNode('ClubBtn') ?? canvas.getChildByName('ClubBtn');
    const recordsN = this.recordsBtn?.node ?? this.findNode('RecordsBtn') ?? canvas.getChildByName('RecordsBtn');
    const profileN = this.profileBtn?.node ?? this.findNode('ProfileBtn') ?? canvas.getChildByName('ProfileBtn');
    const rows: Array<{ node: Node | null; x: number; y: number; w: number; h: number }> = [
      { node: this.infoLabel?.node ?? null, x: -320, y: 300, w: 480, h: 40 },
      { node: this.roomLabel?.node ?? null, x: 40, y: 240, w: 760, h: 40 },
      { node: this.joinEdit?.node ?? null, x: 340, y: 120, w: 260, h: 48 },
      { node: createN, x: 340, y: 0, w: 320, h: 120 },
      { node: joinN, x: 340, y: -140, w: 320, h: 120 },
      { node: prepN, x: 340, y: -270, w: 200, h: 80 },
      { node: clubN, x: -420, y: -310, w: 220, h: 72 },
      { node: recordsN ?? null, x: -420, y: -220, w: 220, h: 72 },
      { node: profileN ?? null, x: -420, y: -130, w: 220, h: 72 },
    ];
    for (const r of rows) {
      if (!r.node) continue;
      r.node.setPosition(r.x, r.y, 0);
      const ui = r.node.getComponent(UITransform);
      if (ui) ui.setContentSize(r.w, r.h);
    }
    styleLabel(this.infoLabel, 26);
    styleLabel(this.roomLabel, 26);
    const create = this.createBtn ?? createN?.getComponent(Button);
    const join = this.joinBtn ?? joinN?.getComponent(Button);
    const prep = this.prepareBtn ?? prepN?.getComponent(Button);
    skinButton(create, 'weihai/ui/btn_create', true, 320);
    skinButton(join, 'weihai/ui/btn_join', true, 320);
    skinButton(prep, 'weihai/ui/btn_ok', true, 200);
    if (clubN) skinButton(clubN.getComponent(Button), 'weihai/ui/btn_club', true, 220);
    if (recordsN) skinButton(recordsN.getComponent(Button), 'weihai/ui/btn_ok', true, 220);
    if (profileN) skinButton(profileN.getComponent(Button), 'weihai/ui/btn_club', true, 220);
    this.hideBtnLabels(createN);
    this.hideBtnLabels(joinN);
    this.hideBtnLabels(prepN);
    this.hideBtnLabels(clubN);
    this.hideBtnLabels(recordsN);
    this.hideBtnLabels(profileN);
    if (recordsN) {
      for (const lab of recordsN.getComponentsInChildren(Label)) {
        if (lab.node.name === '__Skin') continue;
        lab.string = '战绩';
        lab.node.active = true;
        styleLabel(lab, 22);
      }
    }
    if (profileN) {
      for (const lab of profileN.getComponentsInChildren(Label)) {
        if (lab.node.name === '__Skin') continue;
        lab.string = '资料';
        lab.node.active = true;
        styleLabel(lab, 22);
      }
    }
  }

  private decorateHall(canvas: Node) {
    const old = canvas.getChildByName('__HallHero');
    if (old) old.destroy();
    void attachHallMeiNv(canvas, -300, -60);
    if (!canvas.getChildByName('__HallBottom')) {
      const bar = new Node('__HallBottom');
      canvas.addChild(bar);
      bar.layer = canvas.layer || Layers.Enum.UI_2D;
      bar.addComponent(UITransform).setContentSize(1280, 100);
      bar.setPosition(0, -320, 0);
      const sp = bar.addComponent(Sprite);
      sp.sizeMode = Sprite.SizeMode.CUSTOM;
      void loadSpriteFrame('weihai/hall/bottom_bar').then((sf) => {
        if (sf && bar.isValid) {
          sp.spriteFrame = sf;
          bar.getComponent(UITransform)!.setContentSize(1280, 90);
        }
      });
    }
    // 玩法卡片（T058）
    const oldPick = canvas.getChildByName('__GamePick');
    if (oldPick) oldPick.destroy();
    if (!canvas.getChildByName('__GamePick')) {
      const root = new Node('__GamePick');
      canvas.addChild(root);
      root.layer = canvas.layer || Layers.Enum.UI_2D;
      root.setPosition(-280, 140, 0);
      root.addComponent(UITransform).setContentSize(420, 160);
      this.gamePickRoot = root;
      const cs = this.makeGameCard(root, 'changsha_mj', '长沙麻将', '可玩', true, -100, 0);
      const phz = this.makeGameCard(root, 'shaoyang_phz', '邵阳跑胡子', '即将开放', false, 100, 0);
      cs.on(Button.EventType.CLICK, () => this.selectGame('changsha_mj'), this);
      phz.on(Button.EventType.CLICK, () => this.setRoom('邵阳跑胡子即将开放，敬请期待'), this);
    }
    if (!canvas.getChildByName('__BalanceLabel')) {
      const n = new Node('__BalanceLabel');
      canvas.addChild(n);
      n.layer = canvas.layer || Layers.Enum.UI_2D;
      n.setPosition(-280, 300, 0);
      n.addComponent(UITransform).setContentSize(420, 36);
      const lab = n.addComponent(Label);
      lab.fontSize = 22;
      lab.color = new Color(255, 220, 120, 255);
      this.balanceLabel = lab;
      this.refreshBalanceLabel();
    }
    if (!canvas.getChildByName('__PasswordEdit')) {
      const n = new Node('__PasswordEdit');
      canvas.addChild(n);
      n.layer = canvas.layer || Layers.Enum.UI_2D;
      n.setPosition(340, 60, 0);
      n.addComponent(UITransform).setContentSize(260, 44);
      const eb = n.addComponent(EditBox);
      eb.placeholder = '房间密码（可选）';
      eb.maxLength = 16;
      eb.inputFlag = EditBox.InputFlag.PASSWORD;
      this.passwordEdit = eb;
    }
    if (!canvas.getChildByName('MatchBtn')) {
      const n = new Node('MatchBtn');
      canvas.addChild(n);
      n.layer = canvas.layer || Layers.Enum.UI_2D;
      n.setPosition(340, -380, 0);
      n.addComponent(UITransform).setContentSize(150, 64);
      n.addComponent(Sprite);
      const btn = n.addComponent(Button);
      btn.transition = Button.Transition.SCALE;
      skinButton(btn, 'weihai/ui/btn_ok', true, 150);
      const lab = new Node('t');
      n.addChild(lab);
      lab.addComponent(Label).string = '快速匹配';
      styleLabel(lab.getComponent(Label), 20);
      n.on(Button.EventType.CLICK, () => void this.onClickQuickMatch(), this);
    }
    if (!canvas.getChildByName('CancelMatchBtn')) {
      const n = new Node('CancelMatchBtn');
      canvas.addChild(n);
      n.layer = canvas.layer || Layers.Enum.UI_2D;
      n.setPosition(510, -380, 0);
      n.addComponent(UITransform).setContentSize(150, 64);
      n.addComponent(Sprite);
      const btn = n.addComponent(Button);
      btn.transition = Button.Transition.SCALE;
      skinButton(btn, 'weihai/ui/btn_join', true, 150);
      const lab = new Node('t');
      n.addChild(lab);
      lab.addComponent(Label).string = '取消匹配';
      styleLabel(lab.getComponent(Label), 20);
      n.on(Button.EventType.CLICK, () => void this.onClickCancelMatch(), this);
    }
    if (!canvas.getChildByName('ShareRoomBtn')) {
      const n = new Node('ShareRoomBtn');
      canvas.addChild(n);
      n.layer = canvas.layer || Layers.Enum.UI_2D;
      n.setPosition(560, 120, 0);
      n.addComponent(UITransform).setContentSize(120, 48);
      n.addComponent(Sprite);
      const btn = n.addComponent(Button);
      btn.transition = Button.Transition.SCALE;
      skinButton(btn, 'weihai/ui/btn_ok', true, 120);
      const lab = new Node('t');
      n.addChild(lab);
      lab.addComponent(Label).string = '复制房号';
      styleLabel(lab.getComponent(Label), 18);
      n.on(Button.EventType.CLICK, () => this.onClickShareRoom(), this);
    }
    if (!this.findNode('ClubBtn') && !canvas.getChildByName('ClubBtn')) {
      const n = new Node('ClubBtn');
      canvas.addChild(n);
      n.layer = canvas.layer || Layers.Enum.UI_2D;
      n.addComponent(UITransform).setContentSize(220, 72);
      n.setPosition(-420, -310, 0);
      n.addComponent(Sprite);
      const btn = n.addComponent(Button);
      btn.transition = Button.Transition.SCALE;
      n.on(Button.EventType.CLICK, () => void this.onClickClub(), this);
    }
    if (!this.findNode('RecordsBtn') && !canvas.getChildByName('RecordsBtn')) {
      const n = new Node('RecordsBtn');
      canvas.addChild(n);
      n.layer = canvas.layer || Layers.Enum.UI_2D;
      n.addComponent(UITransform).setContentSize(220, 72);
      n.setPosition(-420, -220, 0);
      n.addComponent(Sprite);
      const btn = n.addComponent(Button);
      btn.transition = Button.Transition.SCALE;
      this.recordsBtn = btn;
      n.on(Button.EventType.CLICK, () => void this.onClickRecords(), this);
    }
    if (!this.findNode('ProfileBtn') && !canvas.getChildByName('ProfileBtn')) {
      const n = new Node('ProfileBtn');
      canvas.addChild(n);
      n.layer = canvas.layer || Layers.Enum.UI_2D;
      n.addComponent(UITransform).setContentSize(220, 72);
      n.setPosition(-420, -130, 0);
      n.addComponent(Sprite);
      const btn = n.addComponent(Button);
      btn.transition = Button.Transition.SCALE;
      this.profileBtn = btn;
      n.on(Button.EventType.CLICK, () => void this.onClickProfile(), this);
    }
    this.ensureRecordsPanel(canvas);
    this.ensureProfilePanel(canvas);
  }

  private hideBtnLabels(node: Node | null) {
    if (!node) return;
    for (const lab of node.getComponentsInChildren(Label)) {
      if (lab.node.name === '__Skin') continue;
      lab.string = '';
      lab.node.active = false;
    }
  }

  private ensureProfilePanel(canvas: Node) {
    if (this.profilePanel?.isValid) return;
    const u = (globalThis as any).__HNQP__ || {};
    const panel = new Node('__ProfilePanel');
    canvas.addChild(panel);
    panel.layer = canvas.layer || Layers.Enum.UI_2D;
    panel.active = false;
    panel.addComponent(UITransform).setContentSize(560, 320);
    const sp = panel.addComponent(Sprite);
    sp.sizeMode = Sprite.SizeMode.CUSTOM;
    sp.color = new Color(20, 20, 30, 220);

    const nameN = new Node('NameEdit');
    panel.addChild(nameN);
    nameN.setPosition(0, 60, 0);
    nameN.addComponent(UITransform).setContentSize(420, 56);
    const nameEb = nameN.addComponent(EditBox);
    nameEb.placeholder = '昵称';
    nameEb.maxLength = 32;
    nameEb.string = u.userName || '';
    this.profileNameEdit = nameEb;

    const avatarN = new Node('AvatarEdit');
    panel.addChild(avatarN);
    avatarN.setPosition(0, -10, 0);
    avatarN.addComponent(UITransform).setContentSize(420, 56);
    const avatarEb = avatarN.addComponent(EditBox);
    avatarEb.placeholder = '头像 URL（可选）';
    avatarEb.maxLength = 256;
    avatarEb.string = u.headImg || '';
    this.profileAvatarEdit = avatarEb;

    const saveN = new Node('SaveBtn');
    panel.addChild(saveN);
    saveN.setPosition(-80, -100, 0);
    saveN.addComponent(UITransform).setContentSize(140, 56);
    const saveLab = saveN.addComponent(Label);
    saveLab.string = '保存';
    styleLabel(saveLab, 24);
    saveN.addComponent(Button).node.on(Button.EventType.CLICK, () => void this.onSaveProfile(), this);

    const closeN = new Node('CloseBtn');
    panel.addChild(closeN);
    closeN.setPosition(80, -100, 0);
    closeN.addComponent(UITransform).setContentSize(140, 56);
    const closeLab = closeN.addComponent(Label);
    closeLab.string = '关闭';
    styleLabel(closeLab, 24);
    closeN.addComponent(Button).node.on(Button.EventType.CLICK, () => { panel.active = false; }, this);

    this.profilePanel = panel;
  }

  private ensureRecordsPanel(canvas: Node) {
    if (this.recordsPanel?.isValid) return;
    const panel = new Node('__RecordsPanel');
    canvas.addChild(panel);
    panel.layer = canvas.layer || Layers.Enum.UI_2D;
    panel.setPosition(0, 0, 0);
    panel.active = false;
    const bg = panel.addComponent(UITransform);
    bg.setContentSize(760, 420);
    const sp = panel.addComponent(Sprite);
    sp.sizeMode = Sprite.SizeMode.CUSTOM;
    sp.color = new Color(20, 20, 30, 220);

    const title = new Node('Title');
    panel.addChild(title);
    title.setPosition(0, 180, 0);
    title.addComponent(UITransform).setContentSize(700, 40);
    const titleLab = title.addComponent(Label);
    titleLab.string = '最近对局';
    styleLabel(titleLab, 28);

    const body = new Node('Body');
    panel.addChild(body);
    body.setPosition(0, -10, 0);
    body.addComponent(UITransform).setContentSize(700, 300);
    const bodyLab = body.addComponent(Label);
    bodyLab.overflow = Label.Overflow.RESIZE_HEIGHT;
    bodyLab.horizontalAlign = Label.HorizontalAlign.LEFT;
    styleLabel(bodyLab, 22);
    this.recordsLabel = bodyLab;

    const closeN = new Node('CloseBtn');
    panel.addChild(closeN);
    closeN.setPosition(320, 180, 0);
    closeN.addComponent(UITransform).setContentSize(120, 48);
    const closeLab = closeN.addComponent(Label);
    closeLab.string = '关闭';
    styleLabel(closeLab, 24);
    const closeBtn = closeN.addComponent(Button);
    closeBtn.node.on(Button.EventType.CLICK, () => { panel.active = false; }, this);

    this.recordsPanel = panel;
  }

  private makeGameCard(parent: Node, id: string, title: string, sub: string, enabled: boolean, x: number, y: number): Node {
    const n = new Node(`GameCard_${id}`);
    parent.addChild(n);
    n.setPosition(x, y, 0);
    n.addComponent(UITransform).setContentSize(180, 120);
    const sp = n.addComponent(Sprite);
    sp.sizeMode = Sprite.SizeMode.CUSTOM;
    sp.color = enabled ? new Color(40, 80, 60, 230) : new Color(60, 60, 60, 180);
    const btn = n.addComponent(Button);
    btn.transition = Button.Transition.SCALE;
    btn.interactable = enabled;

    const titleN = new Node('Title');
    n.addChild(titleN);
    titleN.setPosition(0, 20, 0);
    const titleLab = titleN.addComponent(Label);
    titleLab.string = title;
    titleLab.fontSize = 22;
    titleLab.color = enabled ? new Color(255, 240, 200, 255) : new Color(160, 160, 160, 255);

    const subN = new Node('Sub');
    n.addChild(subN);
    subN.setPosition(0, -20, 0);
    const subLab = subN.addComponent(Label);
    subLab.string = sub;
    subLab.fontSize = 16;
    subLab.color = enabled ? new Color(180, 255, 180, 255) : new Color(140, 140, 140, 255);
    if (this.gameId === id && enabled) {
      sp.color = new Color(60, 120, 80, 255);
    }
    return n;
  }

  private selectGame(gameId: string) {
    if (gameId === 'shaoyang_phz') {
      this.setRoom('邵阳跑胡子即将开放');
      return;
    }
    this.gameId = gameId;
    this.setRoom('已选：长沙麻将');
    const root = this.gamePickRoot ?? this.node.parent?.getChildByName('__GamePick');
    if (root) {
      for (const ch of root.children) {
        const sp = ch.getComponent(Sprite);
        if (!sp) continue;
        const on = ch.name === `GameCard_${gameId}`;
        sp.color = on ? new Color(60, 120, 80, 255) : new Color(40, 80, 60, 230);
      }
    }
  }

  async onClickClub() {
    if (!(await this.ensureConnected())) return;
    const name = `亲友圈${Date.now() % 10000}`;
    const msg = await NetBus.ins.createClub(name);
    if (msg.cmd === 'error') {
      this.setRoom(msg.body?.message || '创建俱乐部失败');
      return;
    }
    const b = msg.body || {};
    this.setRoom(`俱乐部已创建：${b.clubName} (#${b.clubId})`);
  }

  async onClickQuickMatch() {
    if (this.matching) return;
    if (this.roomId > 0) {
      this.setRoom(`已在房间 ${this.roomId}`);
      return;
    }
    if (!(await this.ensureConnected())) return;
    if (this.gameId === 'shaoyang_phz') {
      this.setRoom('跑胡子尚未开放匹配');
      return;
    }
    this.setRoom('加入匹配队列…');
    const msg = await NetBus.ins.quickMatch(this.gameId);
    if (msg.cmd === 'error') this.setRoom(msg.body?.message || '匹配失败');
    else if (msg.body?.queued) {
      this.matching = true;
      this.setRoom(`匹配中 ${msg.body.position}/${msg.body.need}`);
    }
  }

  async onClickCancelMatch() {
    if (!(await this.ensureConnected())) return;
    const msg = await NetBus.ins.cancelMatch();
    this.matching = false;
    if (msg.body?.cancelled) this.setRoom('已取消匹配');
    else this.setRoom(msg.body?.message || '未在匹配中');
  }

  onClickShareRoom() {
    const id = this.roomId > 0 ? this.roomId : parseInt(this.joinEdit?.string || '0', 10);
    if (!id) {
      this.setRoom('暂无房间号可复制');
      return;
    }
    const text = String(id);
    if (NetBus.copyToClipboard(text)) {
      this.setRoom(`房间号 ${text} 已复制到剪贴板`);
    } else {
      this.setRoom(`房间号：${text}（请手动复制）`);
    }
  }

  private wireButtons() {
    const create = this.createBtn ?? this.findNode('CreateBtn')?.getComponent(Button);
    const join = this.joinBtn ?? this.findNode('JoinBtn')?.getComponent(Button);
    const prep = this.prepareBtn ?? this.findNode('PrepareBtn')?.getComponent(Button);
    const records = this.recordsBtn ?? this.findNode('RecordsBtn')?.getComponent(Button);
    const profile = this.profileBtn ?? this.findNode('ProfileBtn')?.getComponent(Button);
    for (const b of [create, join, prep, records, profile]) {
      if (!b) continue;
      b.clickEvents.length = 0;
      b.node.off(Button.EventType.CLICK);
    }
    create?.node.on(Button.EventType.CLICK, this.onClickCreate, this);
    join?.node.on(Button.EventType.CLICK, this.onClickJoin, this);
    prep?.node.on(Button.EventType.CLICK, this.onClickPrepare, this);
    records?.node.on(Button.EventType.CLICK, () => void this.onClickRecords(), this);
    profile?.node.on(Button.EventType.CLICK, () => void this.onClickProfile(), this);
  }

  private async ensureConnected(): Promise<boolean> {
    if (NetBus.ins.isConnected()) return true;
    const u = (globalThis as any).__HNQP__ || {};
    const addr = u.serverAddr || NetBus.ins.serverAddr || '127.0.0.1:20480';
    NetBus.ins.putServerAddr(addr);
    try {
      await NetBus.ins.connect();
      if (u.ticket) {
        const ok = await NetBus.ins.reconnectWithTicket(u.ticket);
        if (ok) {
          this.setRoom('已重连 ' + addr);
          return true;
        }
      }
      if (u.userName && u.deviceId) await NetBus.ins.guestLogin(u.deviceId);
      else if (u.userName) await NetBus.ins.login(u.userName);
      this.setRoom('已重连 ' + addr);
      return true;
    } catch (e) {
      this.setRoom('未连接：请先从 Login 登录，或启动 server/run.sh');
      return false;
    }
  }

  setInfo(s: string) { if (this.infoLabel) this.infoLabel.string = s; }
  setRoom(s: string) { if (this.roomLabel) this.roomLabel.string = s; console.log('[Hall]', s); }

  async onClickCreate() {
    if (this.creating) return;
    if (this.roomId > 0) {
      this.setRoom(`已在房间 ${this.roomId}`);
      return;
    }
    if (!(await this.ensureConnected())) return;
    this.creating = true;
    const pwd = (this.passwordEdit?.string || '').trim();
    this.setRoom(`正在创建${gameDisplayName(this.gameId)}房间…`);
    try {
      const rules: Record<string, unknown> = {};
      if (pwd) rules.password = pwd;
      const msg = await NetBus.ins.createRoom(this.gameId, rules);
      if (msg.cmd === 'error') {
        this.setRoom(msg.body?.message || '创建失败');
      } else {
        const st = msg.body;
        this.roomId = st.roomId;
        if (this.joinEdit) this.joinEdit.string = String(st.roomId);
        this.setRoom(`房间 ${st.roomId} 已创建${pwd ? '（已设密码）' : ''}，点「确定」开局`);
        void this.refreshBalance();
      }
    } finally {
      setTimeout(() => { this.creating = false; }, 500);
    }
  }

  async onClickJoin() {
    const id = parseInt(this.joinEdit?.string || '0', 10);
    if (!(await this.ensureConnected())) return;
    if (!id) {
      this.setRoom('请先输入房间号');
      return;
    }
    const pwd = (this.passwordEdit?.string || '').trim();
    const msg = await NetBus.ins.joinRoom(id, pwd || undefined);
    if (msg.cmd === 'error') this.setRoom(msg.body?.message || '加入失败');
    else {
      this.roomId = msg.body.roomId;
      this.setRoom(`已加入 ${this.roomId}`);
    }
  }

  async onClickPrepare() {
    if (!(await this.ensureConnected())) return;
    this.setRoom('开局中…');
    const msg = await NetBus.ins.prepare(true);
    if (msg.cmd === 'error') this.setRoom(msg.body?.message || '准备失败');
    else if (msg.body) this.onState(msg.body);
  }

  private formatRecordLine(r: RecordItem): string {
    const t = r.createdAt ? new Date(r.createdAt * 1000).toLocaleString() : '';
    const delta = r.scoreDelta != null ? (r.scoreDelta >= 0 ? `+${r.scoreDelta}` : `${r.scoreDelta}`) : '0';
    const reason = r.reason || '';
    const detail = (r.detail || '').slice(0, 36);
    return `#${r.id ?? '?'} 房${r.roomId} 第${r.roundNo}局 ${reason} ${delta}分\n  ${detail}${detail.length >= 36 ? '…' : ''}  ${t}`;
  }

  async onClickRecords() {
    if (!(await this.ensureConnected())) return;
    this.ensureRecordsPanel(this.node.parent ?? this.node);
    if (this.recordsPanel) this.recordsPanel.active = true;
    if (this.recordsLabel) this.recordsLabel.string = '加载中…';
    try {
      const msg = await NetBus.ins.getRecords(1, 15);
      if (msg.cmd === 'error') {
        if (this.recordsLabel) this.recordsLabel.string = msg.body?.message || '加载失败';
        return;
      }
      const b = msg.body || {};
      const list: RecordItem[] = b.list || [];
      if (list.length === 0) {
        if (this.recordsLabel) this.recordsLabel.string = '暂无对局记录\n完成一局后会出现在这里';
        return;
      }
      const lines = list.map((r) => this.formatRecordLine(r));
      const header = `共 ${b.total ?? list.length} 局 · 显示 ${list.length} 条\n\n`;
      if (this.recordsLabel) this.recordsLabel.string = header + lines.join('\n\n');
    } catch (e) {
      if (this.recordsLabel) this.recordsLabel.string = '查询超时';
      console.warn('[Hall] getRecords', e);
    }
  }

  onClickProfile() {
    this.ensureProfilePanel(this.node.parent ?? this.node);
    const u = (globalThis as any).__HNQP__ || {};
    if (this.profileNameEdit) this.profileNameEdit.string = u.userName || '';
    if (this.profileAvatarEdit) this.profileAvatarEdit.string = u.headImg || '';
    if (this.profilePanel) this.profilePanel.active = true;
  }

  async onSaveProfile() {
    if (!(await this.ensureConnected())) return;
    const userName = (this.profileNameEdit?.string || '').trim();
    const headImg = (this.profileAvatarEdit?.string || '').trim();
    if (!userName) {
      this.setRoom('昵称不能为空');
      return;
    }
    const msg = await NetBus.ins.updateProfile({ userName, headImg });
    if (msg.cmd === 'error') {
      this.setRoom(msg.body?.message || '资料更新失败');
      return;
    }
    const b = msg.body || {};
    const u = (globalThis as any).__HNQP__ || {};
    u.userName = b.userName ?? userName;
    u.headImg = b.headImg ?? headImg;
    (globalThis as any).__HNQP__ = u;
    this.setInfo(`玩家 ${u.userName} (${u.userId})`);
    if (this.profilePanel) this.profilePanel.active = false;
    this.setRoom('资料已更新');
  }
}
