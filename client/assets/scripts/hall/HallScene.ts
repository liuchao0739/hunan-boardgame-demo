import {
  _decorator, Component, Label, EditBox, Button, Node, UITransform, director, Sprite, Layers,
} from 'cc';
import { MsgBus, MsgCode } from '../comm/MsgBus';
import { PbWire } from '../comm/PbWire';
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
  private unsubs: Array<() => void> = [];
  private enteringTable = false;

  onDestroy() {
    this.clearSubs();
  }

  private clearSubs() {
    for (const u of this.unsubs) u();
    this.unsubs = [];
  }

  private listen(code: number, fn: (body: Uint8Array) => void) {
    this.unsubs.push(MsgBus.ins.on(code, fn));
  }

  async onLoad() {
    this.layoutUi();
    this.wireButtons();
    attachBg(this.node.parent ?? this.node, 'weihai/bg/hall');

    if (this.joinEdit) {
      this.joinEdit.maxLength = 16;
      this.joinEdit.placeholder = '输入房间号';
    }

    const u = (globalThis as any).__WHMJ__ || {};
    this.setInfo(`玩家 ${u.userName || '?'} (${u.userId || '?'})`);
    this.setRoom('点「创建房间」自动配 3 机器人，再点「确定」开局');

    this.listen(MsgCode.GetMyDetailzResult, (body) => {
      if (!this.isValid) return;
      const f = PbWire.decode(body);
      const cards = PbWire.getSint32(f, 5, 0);
      this.setInfo(`${PbWire.getString(f, 2)} 房卡:${cards}`);
    });
    this.listen(MsgCode.CreateRoomResult, (body) => {
      if (!this.isValid) return;
      const f = PbWire.decode(body);
      const id = PbWire.getSint32(f, 1, -1);
      if (id > 0) {
        this.roomId = id;
        if (this.joinEdit) this.joinEdit.string = String(id);
        this.setRoom(`房间 ${id} 已配 3 机器人，点「确定」开局`);
      } else if (this.roomId > 0) {
        this.setRoom(`已在房间 ${this.roomId}（需 4 人准备）`);
      } else {
        this.setRoom('创建房间失败');
      }
    });
    this.listen(MsgCode.JoinRoomResult, (body) => {
      if (!this.isValid) return;
      const f = PbWire.decode(body);
      this.roomId = PbWire.getSint32(f, 1, -1);
      this.setRoom(this.roomId > 0 ? `已加入 ${this.roomId}` : '加入失败');
    });
    this.listen(MsgCode.PrepareBroadcast, () => {
      if (!this.isValid) return;
      this.setRoom(`房间 ${this.roomId} 有人准备`);
    });
    this.listen(MsgCode.OfficialStartBroadcast, () => {
      if (!this.isValid || this.enteringTable) return;
      this.enteringTable = true;
      this.setRoom(`房间 ${this.roomId} 开局！`);
      // 立刻卸掉大厅监听，避免开局包打到已销毁/切换中的 Hall
      this.clearSubs();
      director.loadScene('Table', (err) => {
        if (err) console.warn('[Hall] load Table failed', err);
      });
    });
    this.listen(MsgCode.MahjongInHandChangedResult, (body) => {
      // 只缓存，不刷 UI（开局瞬间手牌包常在切场景前到达）
      const f = PbWire.decode(body);
      const tiles: number[] = [];
      for (const e of (f.get(2) || [])) tiles.push(PbWire.zigzagDecode(e.raw as number));
      const mo = PbWire.getSint32(f, 3, 0);
      const g = (globalThis as any).__WHMJ__ || ((globalThis as any).__WHMJ__ = {});
      g.hand = tiles;
      g.moPai = mo;
    });

    const ok = await this.ensureConnected();
    if (ok && this.isValid) MsgBus.ins.sendEmpty(MsgCode.GetMyDetailzCmd);
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
    // 右列：创建 / 加入 / 确定；老友圈放到底栏左侧，避免盖住确定
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

  /** 底栏 + 亲友圈 + Spine 立绘 */
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
        this.setRoom('亲友圈十桌：下轮接列表');
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

  /** 代码绑点击；清空编辑器 Click Events，避免点一次触发两次 */
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
    if (MsgBus.ins.isConnected()) return true;
    const u = (globalThis as any).__WHMJ__ || {};
    const addr = u.serverAddr || MsgBus.ins.serverAddr || '127.0.0.1:20480';
    MsgBus.ins.putServerAddr(addr);
    try {
      await MsgBus.ins.connect();
      if (u.userId) {
        // 直进 Hall 时补一次登录，保证后续协议可用
        MsgBus.ins.sendUserLogin(0, { testerName: u.userName || '测试用户' });
      }
      this.setRoom('已重连 ' + addr);
      return true;
    } catch (e) {
      console.warn('[Hall] reconnect fail', e);
      this.setRoom('未连接服务器：请先从 Login 登录，或启动 server/run.sh');
      return false;
    }
  }

  setInfo(s: string) { if (this.infoLabel) this.infoLabel.string = s; }
  setRoom(s: string) { if (this.roomLabel) this.roomLabel.string = s; console.log('[Hall]', s); }

  private creating = false;

  async onClickCreate() {
    console.log('[Hall] click create');
    if (this.creating) return;
    if (this.roomId > 0) {
      this.setRoom(`已在房间 ${this.roomId}（需 4 人准备）`);
      return;
    }
    if (!(await this.ensureConnected())) return;
    this.creating = true;
    this.setRoom('正在创建房间…');
    MsgBus.ins.sendCreateRoom(1, 1001);
    setTimeout(() => { this.creating = false; }, 800);
  }

  async onClickJoin() {
    const id = parseInt(this.joinEdit?.string || '0', 10);
    console.log('[Hall] click join', id);
    if (!(await this.ensureConnected())) return;
    if (!id) {
      this.setRoom('请先输入房间号');
      return;
    }
    MsgBus.ins.sendJoinRoom(id);
    this.setRoom('正在加入 ' + id);
  }

  async onClickPrepare() {
    console.log('[Hall] click prepare');
    if (!(await this.ensureConnected())) return;
    MsgBus.ins.sendPrepare();
    this.setRoom('已点确定（机器人已就绪，开局中）…');
  }
}
