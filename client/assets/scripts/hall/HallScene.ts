import {
  _decorator, Component, Label, EditBox, Button, Node, UITransform, director, Sprite, Layers, Color,
} from 'cc';
import { NetBus } from '../comm/NetBus';
import { attachBg, skinButton, styleLabel, loadSpriteFrame } from '../comm/ArtBg';
import { attachHallMeiNv } from './HallMeiNv';

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
    this.setRoom('湘桌 · 长沙麻将 · 点「创建房间」配 3 机器人，再点「确定」开局（跑胡子即将开放）');

    this.unsubs.push(NetBus.ins.on('platform', 'state', (body) => this.onState(body)));
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
  }

  private onState(body: any) {
    if (!body) return;
    if (body.roomId) this.roomId = body.roomId;
    if (body.state === 'playing' && !this.enteringTable) {
      this.enteringTable = true;
      this.setRoom(`房间 ${this.roomId} 开局！`);
      (globalThis as any).__HNQP_ROOM__ = body;
      this.clearSubs();
      director.loadScene('Table', (err) => {
        if (err) console.warn('[Hall] load Table', err);
      });
    } else if (body.state === 'waiting') {
      this.setRoom(`房间 ${body.roomId} · ${body.gameId === 'changsha_mj' ? '长沙麻将' : body.gameId} · 点确定开局`);
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
    const rows: Array<{ node: Node | null; x: number; y: number; w: number; h: number }> = [
      { node: this.infoLabel?.node ?? null, x: -320, y: 300, w: 480, h: 40 },
      { node: this.roomLabel?.node ?? null, x: 40, y: 240, w: 760, h: 40 },
      { node: this.joinEdit?.node ?? null, x: 340, y: 120, w: 260, h: 48 },
      { node: createN, x: 340, y: 0, w: 320, h: 120 },
      { node: joinN, x: 340, y: -140, w: 320, h: 120 },
      { node: prepN, x: 340, y: -270, w: 200, h: 80 },
      { node: clubN, x: -420, y: -310, w: 220, h: 72 },
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
    this.hideBtnLabels(createN);
    this.hideBtnLabels(joinN);
    this.hideBtnLabels(prepN);
    this.hideBtnLabels(clubN);
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
    // 玩法标签
    if (!canvas.getChildByName('__GamePick')) {
      const n = new Node('__GamePick');
      canvas.addChild(n);
      n.layer = canvas.layer || Layers.Enum.UI_2D;
      n.setPosition(-280, 180, 0);
      n.addComponent(UITransform).setContentSize(400, 36);
      const lab = n.addComponent(Label);
      lab.string = '玩法：长沙麻将（可玩） / 邵阳跑胡子（即将开放）';
      lab.fontSize = 20;
      lab.color = new Color(240, 230, 200, 255);
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
      n.on(Button.EventType.CLICK, () => {
        this.setRoom('亲友圈：后续开放');
      }, this);
    }
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
      if (u.userName) await NetBus.ins.login(u.userName);
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
    const msg = await NetBus.ins.joinRoom(id);
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
}
