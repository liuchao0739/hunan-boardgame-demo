import { _decorator, Component, Label, Node, EditBox, Button, UITransform, director, Color } from 'cc';
import { NetBus } from '../comm/NetBus';
import { attachBg, skinButton, styleLabel } from '../comm/ArtBg';

const { ccclass, property } = _decorator;

@ccclass('LoginScene')
export class LoginScene extends Component {
  @property(Label)
  statusLabel: Label | null = null;

  @property(EditBox)
  nameEdit: EditBox | null = null;

  @property(EditBox)
  passwordEdit: EditBox | null = null;

  @property(EditBox)
  serverEdit: EditBox | null = null;

  @property(Button)
  loginBtn: Button | null = null;

  private loggingIn = false;
  private guestBtn: Button | null = null;
  private registerBtn: Button | null = null;

  onLoad() {
    this.ensureExtraUi();
    this.layoutUi();
    attachBg(this.node.parent ?? this.node, 'weihai/bg/hall');
    if (this.nameEdit) this.nameEdit.maxLength = 32;
    if (this.passwordEdit) {
      this.passwordEdit.maxLength = 64;
      this.passwordEdit.inputFlag = EditBox.InputFlag.PASSWORD;
      this.passwordEdit.placeholder = '密码（可空=游客）';
    }
    if (this.serverEdit) this.serverEdit.maxLength = 128;

    const addr = NetBus.readServerAddrFromUrl('127.0.0.1:20480');
    if (this.serverEdit) this.serverEdit.string = addr;
    if (this.nameEdit && !this.nameEdit.string) this.nameEdit.string = '测试用户';
    NetBus.ins.putServerAddr(addr);
    this.setStatus('湘桌 · 输入昵称点登录，或游客一键进入');

    this.wireButtons();
  }

  private canvas(): Node {
    return this.node.parent ?? this.node;
  }

  /** 密码框 + 注册/游客文字按钮（不用大厅 btn_join / btn_ok 图） */
  private ensureExtraUi() {
    const parent = this.canvas();

    if (!this.passwordEdit) {
      let n = parent.getChildByName('PasswordEdit');
      if (!n) {
        n = new Node('PasswordEdit');
        parent.addChild(n);
        n.layer = parent.layer;
        n.addComponent(UITransform).setContentSize(420, 56);
        const eb = n.addComponent(EditBox);
        eb.maxLength = 64;
        eb.placeholder = '密码（可空=游客）';
        this.passwordEdit = eb;
      } else {
        this.passwordEdit = n.getComponent(EditBox);
      }
    }

    this.registerBtn = this.ensureTextButton(parent, 'RegisterTextBtn', '注册账号');
    this.guestBtn = this.ensureTextButton(parent, 'GuestTextBtn', '游客一键登录');
  }

  private ensureTextButton(parent: Node, name: string, caption: string): Button {
    let n = parent.getChildByName(name);
    if (!n) {
      n = new Node(name);
      parent.addChild(n);
      n.layer = parent.layer;
      n.addComponent(UITransform).setContentSize(200, 40);
      const lab = n.addComponent(Label);
      lab.string = caption;
      lab.fontSize = 22;
      lab.horizontalAlign = Label.HorizontalAlign.CENTER;
      lab.verticalAlign = Label.VerticalAlign.CENTER;
      styleLabel(lab, 22);
      lab.color = new Color(255, 230, 160, 255);
      n.addComponent(Button);
    } else {
      const lab = n.getComponent(Label);
      if (lab) lab.string = caption;
    }
    return n.getComponent(Button)!;
  }

  private wireButtons() {
    const btnNode = this.loginBtnNode();
    const btn = this.loginBtn ?? btnNode?.getComponent(Button);
    for (const b of [btn, this.registerBtn, this.guestBtn]) {
      if (!b) continue;
      b.clickEvents.length = 0;
      b.node.off(Button.EventType.CLICK);
    }
    btn?.node.on(Button.EventType.CLICK, () => void this.onClickEnter(), this);
    this.registerBtn?.node.on(Button.EventType.CLICK, () => void this.onClickRegister(), this);
    this.guestBtn?.node.on(Button.EventType.CLICK, () => void this.onClickGuest(), this);
  }

  private loginBtnNode(): Node | null {
    return this.loginBtn?.node
      ?? this.node.getChildByName('LoginBtn')
      ?? this.canvas().getChildByName('LoginBtn')
      ?? null;
  }

  private layoutUi() {
    const btnNode = this.loginBtnNode();
    const rows: Array<{ node: Node | null | undefined; y: number; w: number; h: number }> = [
      { node: this.statusLabel?.node, y: 160, w: 720, h: 48 },
      { node: this.nameEdit?.node, y: 70, w: 420, h: 56 },
      { node: this.passwordEdit?.node, y: 0, w: 420, h: 56 },
      { node: this.serverEdit?.node, y: -70, w: 420, h: 56 },
      { node: btnNode, y: -180, w: 280, h: 90 },
      { node: this.guestBtn?.node, y: -280, w: 280, h: 40 },
      { node: this.registerBtn?.node, y: -320, w: 200, h: 36 },
    ];
    for (const r of rows) {
      if (!r.node) continue;
      r.node.setPosition(0, r.y, 0);
      const ui = r.node.getComponent(UITransform);
      if (ui) ui.setContentSize(r.w, r.h);
    }
    styleLabel(this.statusLabel, 28);
    if (this.statusLabel) this.statusLabel.overflow = Label.Overflow.RESIZE_HEIGHT;

    // 主按钮只用登录图，隐藏场景自带 Label（避免叠字）
    const btn = this.loginBtn ?? btnNode?.getComponent(Button);
    skinButton(btn, 'weihai/ui/btn_login', true, 320);
    if (btnNode) {
      for (const lab of btnNode.getComponentsInChildren(Label)) {
        lab.string = '';
        lab.node.active = false;
      }
    }
  }

  setStatus(s: string) {
    if (this.statusLabel) this.statusLabel.string = s;
    console.log('[Login]', s);
  }

  private normalizeAddr(raw: string): string {
    const s = (raw || '').trim();
    if (!s) return '127.0.0.1:20480';
    if (s.startsWith('ws://') || s.startsWith('wss://')) return s;
    if (!s.includes(':') || s.endsWith('.')) return '127.0.0.1:20480';
    return s;
  }

  private async connectServer(): Promise<string | null> {
    let addr = this.normalizeAddr(this.serverEdit?.string || '');
    try {
      if (typeof location !== 'undefined' && location.protocol === 'https:' && location.hostname) {
        addr = `wss://${location.host}/websocket`;
        if (this.serverEdit) this.serverEdit.string = addr;
      }
    } catch { /* */ }
    if (this.serverEdit) this.serverEdit.string = addr;
    NetBus.ins.putServerAddr(addr);

    let left = 12;
    this.setStatus(`连接中(${left}s)… ${addr}`);
    const tick = setInterval(() => {
      left -= 1;
      if (left >= 0) this.setStatus(`连接中(${left}s)… ${addr}`);
    }, 1000);
    try {
      await NetBus.ins.connect();
      clearInterval(tick);
      return addr;
    } catch (e) {
      clearInterval(tick);
      console.warn('[Login] connect fail', e);
      this.setStatus('连接失败：请关 Clash/代理 后强制刷新(Cmd+Shift+R)，或打开 /ws-test.html 自检');
      return null;
    }
  }

  private finishLogin(msg: any, addr: string): boolean {
    if (msg.cmd === 'error') {
      this.setStatus(msg.body?.message || '登录失败');
      return false;
    }
    const b = msg.body || {};
    (globalThis as any).__HNQP__ = {
      userId: b.userId,
      userName: b.userName,
      ticket: b.ticket,
      headImg: b.headImg,
      roomCard: b.roomCard,
      diamond: b.diamond ?? 0,
      dailyGift: b.dailyGift ?? 0,
      ukeyExpireAt: b.ukeyExpireAt,
      serverAddr: addr,
      deviceId: NetBus.deviceId(),
    };
    this.setStatus(`登录成功 ${b.userId} ${b.userName}`);
    NetBus.ins.offAll();
    NetBus.ins.startKeepalive();
    director.loadScene('Hall', (err) => {
      this.loggingIn = false;
      if (err) this.setStatus('缺少 Hall 场景');
    });
    return true;
  }

  /** 主按钮：有密码走账号登录，否则走兼容昵称登录 */
  async onClickEnter() {
    if (this.loggingIn) return;
    this.loggingIn = true;
    const name = (this.nameEdit?.string || '测试用户').trim();
    const password = (this.passwordEdit?.string || '').trim();
    const addr = await this.connectServer();
    if (!addr) {
      this.loggingIn = false;
      return;
    }
    try {
      this.setStatus(password ? '登录中…' : '进入中…');
      const msg = password
        ? await NetBus.ins.loginAccount(name, password)
        : await NetBus.ins.login(name);
      if (!this.finishLogin(msg, addr)) this.loggingIn = false;
    } catch (e) {
      console.warn('[Login] enter fail', e);
      this.setStatus('登录超时：WebSocket 已连上但服务器无响应');
      this.loggingIn = false;
    }
  }

  async onClickRegister() {
    if (this.loggingIn) return;
    this.loggingIn = true;
    const name = (this.nameEdit?.string || '').trim();
    const password = (this.passwordEdit?.string || '').trim();
    if (!name) {
      this.setStatus('注册请填写用户名');
      this.loggingIn = false;
      return;
    }
    if (password.length < 4) {
      this.setStatus('注册密码至少 4 位');
      this.loggingIn = false;
      return;
    }
    const addr = await this.connectServer();
    if (!addr) {
      this.loggingIn = false;
      return;
    }
    try {
      this.setStatus('注册中…');
      const msg = await NetBus.ins.register(name, password);
      if (!this.finishLogin(msg, addr)) this.loggingIn = false;
    } catch (e) {
      console.warn('[Login] register fail', e);
      this.setStatus('注册超时');
      this.loggingIn = false;
    }
  }

  async onClickGuest() {
    if (this.loggingIn) return;
    this.loggingIn = true;
    const addr = await this.connectServer();
    if (!addr) {
      this.loggingIn = false;
      return;
    }
    try {
      this.setStatus('游客登录中…');
      const msg = await NetBus.ins.guestLogin();
      if (!this.finishLogin(msg, addr)) this.loggingIn = false;
    } catch (e) {
      console.warn('[Login] guest fail', e);
      this.setStatus('游客登录超时');
      this.loggingIn = false;
    }
  }
}
