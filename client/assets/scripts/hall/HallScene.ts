import {
  _decorator, Component, Label, EditBox, Button, Node, UITransform, Sprite, Layers, Color,
} from 'cc';
import { NetBus } from '../comm/NetBus';
import { attachBg, skinButton, styleLabel, loadSpriteFrame } from '../comm/ArtBg';
import { attachHallMeiNv } from './HallMeiNv';
import { gameDisplayName, loadTableScene } from '../game/TableRouter';
import { JoinRoomDialog } from './JoinRoomDialog';
import { AudioBus } from '../comm/AudioBus';

const { ccclass, property } = _decorator;

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

  private roomId = -1;
  private gameId = 'changsha_mj';
  private unsubs: Array<() => void> = [];
  private enteringTable = false;
  private creating = false;
  private matching = false;
  private recordsPanel: Node | null = null;
  private recordsLabel: Label | null = null;

  onDestroy() {
    this.clearSubs();
  }

  private clearSubs() {
    for (const u of this.unsubs) u();
    this.unsubs = [];
  }

  async onLoad() {
    this.scrubUpgradeJunk();
    this.layoutUi();
    this.wireButtons();
    attachBg(this.canvas(), 'weihai/bg/hall');

    if (this.joinEdit) {
      this.joinEdit.maxLength = 16;
      this.joinEdit.placeholder = '输入房间号';
    }

    const u = (globalThis as any).__HNQP__ || (globalThis as any).__WHMJ__ || {};
    this.refreshInfo(u);
    this.setRoom('湘桌 · 长沙麻将 · 点「创建房间」配机器人，再点「确定」开局');

    this.unsubs.push(NetBus.ins.on('platform', 'state', (body) => this.onState(body)));
    this.unsubs.push(NetBus.ins.on('platform', 'matchResult', (body) => this.onMatchResult(body)));
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
    void this.pullBalance();
  }

  private canvas(): Node {
    return this.node.parent ?? this.node;
  }

  /** 清掉升级时乱塞的控件（多个「确定」/密码框/玩法卡片等） */
  private scrubUpgradeJunk() {
    const canvas = this.canvas();
    const junk = [
      'MatchBtn', 'CancelMatchBtn', 'ShareRoomBtn',
      'RecordsBtn', 'ProfileBtn',
      '__PasswordEdit', '__PasswordEditLabel',
      '__GamePick', '__BalanceLabel', '__ProfilePanel', '__RecordsPanel',
      'GuestTextBtn', 'RegisterTextBtn', 'PasswordEdit',
    ];
    for (const name of junk) {
      const n = canvas.getChildByName(name) ?? this.findNode(name);
      if (n?.isValid) n.destroy();
    }
  }

  private refreshInfo(u: any = (globalThis as any).__HNQP__ || {}) {
    const rc = u.roomCard != null ? ` · 房卡 ${u.roomCard}` : '';
    this.setInfo(`玩家 ${u.userName || '?'} (${u.userId || '?'})${rc}`);
    const nameLab = (this as any)._hallNameLab as Label | undefined;
    const cardLab = (this as any)._hallCardLab as Label | undefined;
    if (nameLab?.isValid) nameLab.string = String(u.userName || '玩家');
    if (cardLab?.isValid) cardLab.string = String(u.roomCard ?? '--');
  }

  private async pullBalance() {
    try {
      const msg = await NetBus.ins.getBalance();
      if (msg.cmd === 'error') return;
      const b = msg.body || {};
      const u = (globalThis as any).__HNQP__ || {};
      u.roomCard = b.roomCard ?? u.roomCard;
      u.diamond = b.diamond ?? u.diamond;
      (globalThis as any).__HNQP__ = u;
      this.refreshInfo(u);
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
    const canvas = this.canvas();
    this.decorateHall(canvas);

    const createN = this.createBtn?.node ?? this.findNode('CreateBtn');
    const joinN = this.joinBtn?.node ?? this.findNode('JoinBtn');
    const prepN = this.prepareBtn?.node ?? this.findNode('PrepareBtn');
    const clubN = this.findNode('ClubBtn') ?? canvas.getChildByName('ClubBtn');

    // 右侧主操作：创房 / 加入 / 确定开局
    const rows: Array<{ node: Node | null; x: number; y: number; w: number; h: number }> = [
      { node: this.roomLabel?.node ?? null, x: 0, y: 250, w: 900, h: 36 },
      { node: this.joinEdit?.node ?? null, x: 2000, y: 0, w: 1, h: 1 }, // 隐藏，改用弹窗
      { node: createN, x: 380, y: 40, w: 300, h: 130 },
      { node: joinN, x: 380, y: -120, w: 300, h: 130 },
      { node: prepN, x: 380, y: -260, w: 220, h: 80 },
      { node: clubN, x: -480, y: -300, w: 200, h: 70 },
    ];
    for (const r of rows) {
      if (!r.node?.isValid) continue;
      r.node.setPosition(r.x, r.y, 0);
      const ui = r.node.getComponent(UITransform);
      if (ui) ui.setContentSize(r.w, r.h);
    }
    if (this.joinEdit) this.joinEdit.node.active = false;
    if (this.infoLabel) this.infoLabel.node.active = false; // 改用顶栏
    styleLabel(this.roomLabel, 24);

    const create = this.createBtn ?? createN?.getComponent(Button);
    const join = this.joinBtn ?? joinN?.getComponent(Button);
    const prep = this.prepareBtn ?? prepN?.getComponent(Button);
    skinButton(create, 'weihai/ui/hall/btn_create_room', true, 300);
    skinButton(join, 'weihai/ui/hall/btn_join_room', true, 300);
    skinButton(prep, 'weihai/ui/btn_ok', true, 200);
    if (clubN) skinButton(clubN.getComponent(Button), 'weihai/ui/hall/btn_club', true, 200);
    this.hideBtnLabels(createN);
    this.hideBtnLabels(joinN);
    this.hideBtnLabels(prepN);
    this.hideBtnLabels(clubN);
  }

  private decorateHall(canvas: Node) {
    const oldHero = canvas.getChildByName('__HallHero');
    if (oldHero) oldHero.destroy();
    void attachHallMeiNv(canvas, -280, -40);

    // 顶栏：昵称 + 房卡
    let top = canvas.getChildByName('__HallTop');
    if (top) top.destroy();
    top = new Node('__HallTop');
    canvas.addChild(top);
    top.layer = canvas.layer || Layers.Enum.UI_2D;
    top.addComponent(UITransform).setContentSize(1280, 80);
    top.setPosition(0, 320, 0);

    const nameBg = new Node('nameBg');
    top.addChild(nameBg);
    nameBg.layer = top.layer;
    nameBg.setPosition(-420, 0, 0);
    nameBg.addComponent(UITransform).setContentSize(280, 44);
    const nsp = nameBg.addComponent(Sprite);
    nsp.sizeMode = Sprite.SizeMode.CUSTOM;
    void loadSpriteFrame('weihai/ui/hall/user_name_bg').then((sf) => {
      if (sf && nameBg.isValid) nsp.spriteFrame = sf;
    });
    const nameLab = new Node('name');
    nameBg.addChild(nameLab);
    nameLab.layer = top.layer;
    nameLab.addComponent(UITransform).setContentSize(260, 36);
    const nl = nameLab.addComponent(Label);
    styleLabel(nl, 20);
    const u = (globalThis as any).__HNQP__ || {};
    nl.string = u.userName || '玩家';
    nl.color = new Color(255, 245, 220, 255);
    (this as any)._hallNameLab = nl;

    const cardBg = new Node('cardBg');
    top.addChild(cardBg);
    cardBg.layer = top.layer;
    cardBg.setPosition(-140, 0, 0);
    cardBg.addComponent(UITransform).setContentSize(180, 44);
    const csp = cardBg.addComponent(Sprite);
    csp.sizeMode = Sprite.SizeMode.CUSTOM;
    void loadSpriteFrame('weihai/ui/hall/room_card_bg').then((sf) => {
      if (sf && cardBg.isValid) csp.spriteFrame = sf;
    });
    const icon = new Node('icon');
    cardBg.addChild(icon);
    icon.layer = top.layer;
    icon.setPosition(-60, 0, 0);
    icon.addComponent(UITransform).setContentSize(36, 36);
    const isp = icon.addComponent(Sprite);
    isp.sizeMode = Sprite.SizeMode.CUSTOM;
    void loadSpriteFrame('weihai/ui/hall/room_card_icon').then((sf) => {
      if (sf && icon.isValid) isp.spriteFrame = sf;
    });
    const cardLab = new Node('card');
    cardBg.addChild(cardLab);
    cardLab.layer = top.layer;
    cardLab.setPosition(20, 0, 0);
    cardLab.addComponent(UITransform).setContentSize(100, 32);
    const cl = cardLab.addComponent(Label);
    styleLabel(cl, 20);
    cl.string = String(u.roomCard ?? '--');
    cl.color = new Color(255, 230, 140, 255);
    (this as any)._hallCardLab = cl;

    const brand = new Node('brand');
    top.addChild(brand);
    brand.layer = top.layer;
    brand.setPosition(420, 0, 0);
    brand.addComponent(UITransform).setContentSize(280, 40);
    const bl = brand.addComponent(Label);
    styleLabel(bl, 26);
    bl.string = '湘桌';
    bl.color = new Color(255, 220, 120, 255);

    // 底栏
    let bar = canvas.getChildByName('__HallBottom');
    if (bar) bar.destroy();
    bar = new Node('__HallBottom');
    canvas.addChild(bar);
    bar.layer = canvas.layer || Layers.Enum.UI_2D;
    bar.addComponent(UITransform).setContentSize(1280, 100);
    bar.setPosition(0, -320, 0);
    const sp = bar.addComponent(Sprite);
    sp.sizeMode = Sprite.SizeMode.CUSTOM;
    void loadSpriteFrame('weihai/ui/hall/bottom_panel').then((sf) => {
      if (sf && bar.isValid) {
        sp.spriteFrame = sf;
        bar!.getComponent(UITransform)!.setContentSize(1280, 96);
      } else {
        void loadSpriteFrame('weihai/hall/bottom_bar').then((sf2) => {
          if (sf2 && bar?.isValid) sp.spriteFrame = sf2;
        });
      }
    });

    let pick = canvas.getChildByName('__GamePick');
    if (pick) pick.destroy();
    pick = new Node('__GamePick');
    canvas.addChild(pick);
    pick.layer = canvas.layer || Layers.Enum.UI_2D;
    pick.setPosition(-280, 200, 0);
    pick.addComponent(UITransform).setContentSize(420, 36);
    const lab = pick.addComponent(Label);
    lab.string = '玩法：长沙麻将 · 可开桌';
    lab.fontSize = 20;
    lab.color = new Color(240, 230, 200, 255);

    this.ensureTextLink(canvas, 'LinkRecords', '战绩', -480, -250, () => void this.onClickRecords());
    this.ensureTextLink(canvas, 'LinkMatch', '快速匹配', -300, -250, () => void this.onClickQuickMatch());
    this.ensureTextLink(canvas, 'LinkShare', '复制房号', -120, -250, () => this.onClickShareRoom());

    if (!this.findNode('ClubBtn') && !canvas.getChildByName('ClubBtn')) {
      const n = new Node('ClubBtn');
      canvas.addChild(n);
      n.layer = canvas.layer || Layers.Enum.UI_2D;
      n.addComponent(UITransform).setContentSize(200, 70);
      n.setPosition(-480, -300, 0);
      n.addComponent(Sprite);
      const btn = n.addComponent(Button);
      btn.transition = Button.Transition.SCALE;
      n.on(Button.EventType.CLICK, () => {
        this.setRoom('亲友圈：后续开放');
      }, this);
    }
  }

  private ensureTextLink(
    parent: Node,
    name: string,
    caption: string,
    x: number,
    y: number,
    onClick: () => void,
  ) {
    let n = parent.getChildByName(name);
    if (!n) {
      n = new Node(name);
      parent.addChild(n);
      n.layer = parent.layer || Layers.Enum.UI_2D;
      n.addComponent(UITransform).setContentSize(200, 32);
      const lab = n.addComponent(Label);
      lab.string = caption;
      lab.fontSize = 22;
      lab.horizontalAlign = Label.HorizontalAlign.LEFT;
      styleLabel(lab, 22);
      lab.color = new Color(255, 230, 160, 255);
      n.addComponent(Button);
    } else {
      const lab = n.getComponent(Label);
      if (lab) lab.string = caption;
    }
    n.setPosition(x, y, 0);
    const btn = n.getComponent(Button)!;
    btn.node.off(Button.EventType.CLICK);
    btn.node.on(Button.EventType.CLICK, onClick, this);
  }

  private hideBtnLabels(node: Node | null) {
    if (!node) return;
    for (const lab of node.getComponentsInChildren(Label)) {
      if (lab.node.name === '__Skin') continue;
      lab.string = '';
      lab.node.active = false;
    }
  }

  private wireButtons() {
    const create = this.createBtn ?? this.findNode('CreateBtn')?.getComponent(Button);
    const join = this.joinBtn ?? this.findNode('JoinBtn')?.getComponent(Button);
    const prep = this.prepareBtn ?? this.findNode('PrepareBtn')?.getComponent(Button);
    for (const b of [create, join, prep]) {
      if (!b) continue;
      b.clickEvents.length = 0;
      b.node.off(Button.EventType.CLICK);
    }
    create?.node.on(Button.EventType.CLICK, this.onClickCreate, this);
    join?.node.on(Button.EventType.CLICK, this.onClickJoin, this);
    prep?.node.on(Button.EventType.CLICK, this.onClickPrepare, this);
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
    } catch {
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
    this.setRoom('正在创建长沙麻将房间…');
    try {
      const msg = await NetBus.ins.createRoom(this.gameId);
      if (msg.cmd === 'error') {
        this.setRoom(msg.body?.message || '创建失败');
      } else {
        const st = msg.body;
        this.roomId = st.roomId;
        if (this.joinEdit) this.joinEdit.string = String(st.roomId);
        this.setRoom(`房间 ${st.roomId} 已配机器人，点「确定」开局`);
        void this.pullBalance();
      }
    } finally {
      setTimeout(() => { this.creating = false; }, 500);
    }
  }

  async onClickJoin() {
    if (!(await this.ensureConnected())) return;
    JoinRoomDialog.show(this.canvas(), async (roomStr) => {
      const id = parseInt(roomStr || '0', 10);
      if (!id) {
        this.setRoom('请输入有效房间号');
        return;
      }
      JoinRoomDialog.syncEdit(this.joinEdit, String(id));
      const msg = await NetBus.ins.joinRoom(id);
      if (msg.cmd === 'error') this.setRoom(msg.body?.message || '加入失败');
      else {
        this.roomId = msg.body.roomId;
        this.setRoom(`已加入 ${this.roomId}`);
      }
    });
  }

  async onClickPrepare() {
    if (!(await this.ensureConnected())) return;
    this.setRoom('开局中…');
    const msg = await NetBus.ins.prepare(true);
    if (msg.cmd === 'error') this.setRoom(msg.body?.message || '准备失败');
    else if (msg.body) this.onState(msg.body);
  }

  async onClickQuickMatch() {
    if (this.matching) {
      const msg = await NetBus.ins.cancelMatch();
      this.matching = false;
      this.setRoom(msg.body?.cancelled ? '已取消匹配' : '未在匹配中');
      return;
    }
    if (this.roomId > 0) {
      this.setRoom(`已在房间 ${this.roomId}`);
      return;
    }
    if (!(await this.ensureConnected())) return;
    this.setRoom('加入匹配队列…');
    const msg = await NetBus.ins.quickMatch(this.gameId);
    if (msg.cmd === 'error') this.setRoom(msg.body?.message || '匹配失败');
    else if (msg.body?.queued) {
      this.matching = true;
      this.setRoom(`匹配中 ${msg.body.position}/${msg.body.need}（再点「快速匹配」可取消）`);
    }
  }

  onClickShareRoom() {
    const id = this.roomId > 0 ? this.roomId : parseInt(this.joinEdit?.string || '0', 10);
    if (!id) {
      this.setRoom('暂无房间号可复制');
      return;
    }
    const text = String(id);
    if (NetBus.copyToClipboard(text)) this.setRoom(`房间号 ${text} 已复制`);
    else this.setRoom(`房间号：${text}`);
  }

  private ensureRecordsPanel(canvas: Node) {
    if (this.recordsPanel?.isValid) return;
    const panel = new Node('__RecordsPanel');
    canvas.addChild(panel);
    panel.layer = canvas.layer || Layers.Enum.UI_2D;
    panel.setPosition(0, 0, 0);
    panel.active = false;
    panel.addComponent(UITransform).setContentSize(760, 420);
    const sp = panel.addComponent(Sprite);
    sp.sizeMode = Sprite.SizeMode.CUSTOM;
    sp.color = new Color(20, 20, 30, 230);

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
    closeN.addComponent(Button).node.on(Button.EventType.CLICK, () => {
      panel.active = false;
    }, this);

    this.recordsPanel = panel;
  }

  async onClickRecords() {
    if (!(await this.ensureConnected())) return;
    this.ensureRecordsPanel(this.canvas());
    if (this.recordsPanel) this.recordsPanel.active = true;
    if (this.recordsLabel) this.recordsLabel.string = '加载中…';
    try {
      const msg = await NetBus.ins.getRecords(1, 15);
      if (msg.cmd === 'error') {
        if (this.recordsLabel) this.recordsLabel.string = msg.body?.message || '加载失败';
        return;
      }
      const list = (msg.body?.list || []) as any[];
      if (list.length === 0) {
        if (this.recordsLabel) this.recordsLabel.string = '暂无对局记录';
        return;
      }
      const lines = list.map((r) => {
        const delta = r.scoreDelta != null ? (r.scoreDelta >= 0 ? `+${r.scoreDelta}` : `${r.scoreDelta}`) : '0';
        return `#${r.id} 房${r.roomId} ${r.reason || ''} ${delta}分`;
      });
      if (this.recordsLabel) this.recordsLabel.string = lines.join('\n');
    } catch {
      if (this.recordsLabel) this.recordsLabel.string = '查询超时';
    }
  }
}
