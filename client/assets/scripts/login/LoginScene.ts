import { _decorator, Component, Label, Node, EditBox, Button, UITransform, director, Toggle } from 'cc';
import { NetBus } from '../comm/NetBus';
import { attachBg, skinButton, styleLabel } from '../comm/ArtBg';

const { ccclass, property } = _decorator;

type LoginMode = 'account' | 'guest';

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

  @property(Button)
  registerBtn: Button | null = null;

  @property(Button)
  guestBtn: Button | null = null;

  @property(Toggle)
  accountToggle: Toggle | null = null;

  private loggingIn = false;
  private mode: LoginMode = 'account';
  private passwordNode: Node | null = null;
  private registerNode: Node | null = null;

  onLoad() {
    this.ensureUiNodes();
    this.layoutUi();
    attachBg(this.node.parent ?? this.node, 'weihai/bg/hall');
    if (this.nameEdit) this.nameEdit.maxLength = 32;
    if (this.passwordEdit) this.passwordEdit.maxLength = 64;
    if (this.serverEdit) this.serverEdit.maxLength = 128;

    const addr = NetBus.readServerAddrFromUrl('127.0.0.1:20480');
    if (this.serverEdit) this.serverEdit.string = addr;
    if (this.nameEdit) this.nameEdit.string = this.nameEdit.string || '';
    if (this.passwordEdit) this.passwordEdit.inputFlag = EditBox.InputFlag.PASSWORD;
    NetBus.ins.putServerAddr(addr);
    this.setStatus('湘桌 · 账号登录或游客一键进入');

    this.wireButtons();
    this.setMode('account');
  }

  private ensureUiNodes() {
    const parent = this.node.parent ?? this.node;
    if (!this.passwordEdit) {
      const n = parent.getChildByName('PasswordEdit') ?? new Node('PasswordEdit');
      if (!n.parent) parent.addChild(n);
      n.layer = parent.layer;
      n.addComponent(UITransform).setContentSize(420, 56);
      const eb = n.getComponent(EditBox) ?? n.addComponent(EditBox);
      eb.placeholder = '密码（账号模式）';
      eb.maxLength = 64;
      this.passwordEdit = eb;
      this.passwordNode = n;
    } else {
      this.passwordNode = this.passwordEdit.node;
    }

    if (!this.registerBtn) {
      const n = parent.getChildByName('RegisterBtn') ?? new Node('RegisterBtn');
      if (!n.parent) parent.addChild(n);
      n.layer = parent.layer;
      n.addComponent(UITransform).setContentSize(200, 72);
      n.addComponent(Button);
      this.registerBtn = n.getComponent(Button)!;
      this.registerNode = n;
    } else {
      this.registerNode = this.registerBtn.node;
    }

    if (!this.guestBtn) {
      const n = parent.getChildByName('GuestBtn') ?? new Node('GuestBtn');
      if (!n.parent) parent.addChild(n);
      n.layer = parent.layer;
      n.addComponent(UITransform).setContentSize(200, 72);
      n.addComponent(Button);
      this.guestBtn = n.getComponent(Button)!;
    }
  }

  private wireButtons() {
    const loginNode =
      this.loginBtn?.node
      ?? this.node.getChildByName('LoginBtn')
      ?? this.node.parent?.getChildByName('LoginBtn')
      ?? null;
    const login = this.loginBtn ?? loginNode?.getComponent(Button);
    for (const b of [login, this.registerBtn, this.guestBtn]) {
      if (!b) continue;
      b.clickEvents.length = 0;
      b.node.off(Button.EventType.CLICK);
    }
    login?.node.on(Button.EventType.CLICK, () => void this.onClickLogin(false), this);
    this.registerBtn?.node.on(Button.EventType.CLICK, () => void this.onClickLogin(true), this);
    this.guestBtn?.node.on(Button.EventType.CLICK, () => void this.onClickGuest(), this);
  }

  private setMode(mode: LoginMode) {
    this.mode = mode;
    const isAccount = mode === 'account';
    if (this.passwordNode) this.passwordNode.active = isAccount;
    if (this.registerNode) this.registerNode.active = isAccount;
    if (this.nameEdit) {
      this.nameEdit.placeholder = isAccount ? '用户名' : '昵称（可选，游客忽略）';
    }
    if (this.accountToggle) this.accountToggle.isChecked = isAccount;
  }

  private layoutUi() {
    const btnNode =
      this.loginBtn?.node
      ?? this.node.getChildByName('LoginBtn')
      ?? this.node.parent?.getChildByName('LoginBtn')
      ?? null;
    const rows: Array<{ node: Node | null | undefined; y: number; w: number; h: number }> = [
      { node: this.statusLabel?.node, y: 160, w: 720, h: 48 },
      { node: this.nameEdit?.node, y: 80, w: 420, h: 56 },
      { node: this.passwordNode, y: 10, w: 420, h: 56 },
      { node: this.serverEdit?.node, y: -70, w: 420, h: 56 },
      { node: btnNode, y: -170, w: 200, h: 80 },
      { node: this.registerNode, y: -170, w: 200, h: 80 },
      { node: this.guestBtn?.node, y: -280, w: 320, h: 80 },
    ];
    if (btnNode) btnNode.setPosition(-110, -170, 0);
    if (this.registerNode) this.registerNode.setPosition(110, -170, 0);
    for (const r of rows) {
      if (!r.node) continue;
      const x = (r as any).x ?? 0;
      r.node.setPosition(x, r.y, 0);
      const ui = r.node.getComponent(UITransform);
      if (ui) ui.setContentSize(r.w, r.h);
    }
    styleLabel(this.statusLabel, 28);
    if (this.statusLabel) this.statusLabel.overflow = Label.Overflow.RESIZE_HEIGHT;
    const btn = this.loginBtn ?? btnNode?.getComponent(Button);
    skinButton(btn, 'weihai/ui/btn_login', true, 200);
    skinButton(this.registerBtn, 'weihai/ui/btn_ok', true, 200);
    skinButton(this.guestBtn, 'weihai/ui/btn_join', true, 320);
    if (btnNode) {
      for (const lab of btnNode.getComponentsInChildren(Label)) {
        if (lab.node.name === '__Skin') continue;
        lab.string = '登录';
        lab.node.active = true;
        styleLabel(lab, 24);
      }
    }
    if (this.registerNode) {
      for (const lab of this.registerNode.getComponentsInChildren(Label)) {
        lab.string = '注册';
        lab.node.active = true;
        styleLabel(lab, 24);
      }
    }
    if (this.guestBtn?.node) {
      for (const lab of this.guestBtn.node.getComponentsInChildren(Label)) {
        lab.string = '游客一键登录';
        lab.node.active = true;
        styleLabel(lab, 24);
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

  private finishLogin(msg: any, addr: string) {
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

  async onClickLogin(isRegister: boolean) {
    if (this.loggingIn) return;
    this.loggingIn = true;
    this.setMode('account');
    const name = (this.nameEdit?.string || '').trim();
    const password = this.passwordEdit?.string || '';
    if (!name) {
      this.setStatus('请输入用户名');
      this.loggingIn = false;
      return;
    }
    if (password.length < 4) {
      this.setStatus('密码至少 4 位');
      this.loggingIn = false;
      return;
    }
    const addr = await this.connectServer();
    if (!addr) {
      this.loggingIn = false;
      return;
    }
    try {
      this.setStatus(isRegister ? '注册中…' : '登录中…');
      const msg = isRegister
        ? await NetBus.ins.register(name, password)
        : await NetBus.ins.loginAccount(name, password);
      if (!this.finishLogin(msg, addr)) this.loggingIn = false;
    } catch (e) {
      console.warn('[Login] auth fail', e);
      this.setStatus('登录超时：WebSocket 已连上但服务器无响应');
      this.loggingIn = false;
    }
  }

  async onClickGuest() {
    if (this.loggingIn) return;
    this.loggingIn = true;
    this.setMode('guest');
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
