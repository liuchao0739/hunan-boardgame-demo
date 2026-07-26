import {
  _decorator, Component, Label, Node, EditBox, Button, UITransform, director, Color, Sprite,
  instantiate,
} from 'cc';
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
    try {
      this.purgeBrokenPassword();
      this.ensurePasswordFromNameEdit();
      this.ensureLinkButtons();
      this.layoutUi();
      attachBg(this.canvas(), 'weihai/bg/hall');

      if (this.nameEdit) {
        this.nameEdit.maxLength = 32;
        this.nameEdit.placeholder = '昵称 / 用户名';
      }
      if (this.passwordEdit) {
        this.passwordEdit.maxLength = 64;
        this.passwordEdit.inputFlag = EditBox.InputFlag.PASSWORD;
        this.passwordEdit.placeholder = '密码（可空）';
        this.passwordEdit.string = '';
      }
      if (this.serverEdit) this.serverEdit.maxLength = 128;

      const addr = NetBus.readServerAddrFromUrl('127.0.0.1:20480');
      if (this.serverEdit) this.serverEdit.string = addr;
      if (this.nameEdit && !this.nameEdit.string) this.nameEdit.string = '测试用户';
      NetBus.ins.putServerAddr(addr);
      this.setStatus('湘桌 · 点登录进入（密码可空）');
      this.wireButtons();
    } catch (e) {
      console.error('[Login] onLoad fail', e);
      this.setStatus('登录页初始化失败，请刷新');
    }
  }

  private canvas(): Node {
    return this.node.parent ?? this.node;
  }

  /** 清掉之前无 TEXT_LABEL 的坏 PasswordEdit（会画出巨大「密码」字） */
  private purgeBrokenPassword() {
    const parent = this.canvas();
    for (const name of ['PasswordEdit', '__PasswordEdit']) {
      const n = parent.getChildByName(name);
      if (!n) continue;
      const eb = n.getComponent(EditBox);
      const hasText = !!n.getChildByName('TEXT_LABEL');
      const hasPh = !!n.getChildByName('PLACEHOLDER_LABEL');
      if (!hasText || !hasPh) {
        n.destroy();
        if (this.passwordEdit?.node === n) this.passwordEdit = null;
      } else if (eb) {
        this.passwordEdit = eb;
      }
    }
  }

  /** 克隆 NameEdit 得到正常密码框 */
  private ensurePasswordFromNameEdit() {
    if (this.passwordEdit?.isValid) return;
    const parent = this.canvas();
    const existing = parent.getChildByName('PasswordEdit');
    if (existing?.getComponent(EditBox) && existing.getChildByName('TEXT_LABEL')) {
      this.passwordEdit = existing.getComponent(EditBox);
      return;
    }
    const src = this.nameEdit?.node;
    if (!src?.isValid) return;
    const n = instantiate(src);
    n.name = 'PasswordEdit';
    parent.addChild(n);
    n.layer = parent.layer;
    const eb = n.getComponent(EditBox);
    if (!eb) {
      n.destroy();
      return;
    }
    eb.string = '';
    eb.placeholder = '密码（可空）';
    eb.inputFlag = EditBox.InputFlag.PASSWORD;
    eb.maxLength = 64;
    // 克隆后背景图跟着 NameEdit，外观一致
    this.passwordEdit = eb;
  }

  private ensureLinkButtons() {
    const parent = this.canvas();
    this.guestBtn = this.ensureTextButton(parent, 'GuestTextBtn', '游客一键登录');
    this.registerBtn = this.ensureTextButton(parent, 'RegisterTextBtn', '注册账号');
  }

  private ensureTextButton(parent: Node, name: string, caption: string): Button {
    let n = parent.getChildByName(name);
    if (!n) {
      n = new Node(name);
      parent.addChild(n);
      n.layer = parent.layer;
      n.addComponent(UITransform).setContentSize(240, 36);
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
      if (lab) {
        lab.string = caption;
        styleLabel(lab, 22);
        lab.color = new Color(255, 230, 160, 255);
      }
    }
    return n.getComponent(Button)!;
  }

  private loginBtnNode(): Node | null {
    return this.loginBtn?.node
      ?? this.node.getChildByName('LoginBtn')
      ?? this.canvas().getChildByName('LoginBtn')
      ?? null;
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

  private layoutUi() {
    const canvas = this.canvas();
    const btnNode = this.loginBtnNode();

    // 品牌标题（登录页第一视觉）
    let brand = canvas.getChildByName('__LoginBrand');
    if (!brand) {
      brand = new Node('__LoginBrand');
      canvas.addChild(brand);
      brand.layer = canvas.layer;
      brand.addComponent(UITransform).setContentSize(600, 80);
      const lab = brand.addComponent(Label);
      styleLabel(lab, 56);
      lab.string = '湘桌';
      lab.color = new Color(255, 220, 120, 255);
    }
    brand.setPosition(0, 260, 0);

    let sub = canvas.getChildByName('__LoginSub');
    if (!sub) {
      sub = new Node('__LoginSub');
      canvas.addChild(sub);
      sub.layer = canvas.layer;
      sub.addComponent(UITransform).setContentSize(600, 36);
      const lab = sub.addComponent(Label);
      styleLabel(lab, 22);
      lab.string = '湖南棋牌 · 长沙麻将';
      lab.color = new Color(240, 230, 200, 255);
    }
    sub.setPosition(0, 200, 0);

    const rows: Array<{ node: Node | null | undefined; y: number; w?: number; h?: number }> = [
      { node: this.statusLabel?.node, y: 140, w: 760, h: 40 },
      { node: this.nameEdit?.node, y: 50, w: 420, h: 56 },
      { node: this.passwordEdit?.node, y: -20, w: 420, h: 56 },
      { node: this.serverEdit?.node, y: -90, w: 420, h: 56 },
      { node: btnNode, y: -200 },
      { node: this.guestBtn?.node, y: -290, w: 280, h: 36 },
      { node: this.registerBtn?.node, y: -330, w: 200, h: 36 },
    ];
    for (const r of rows) {
      if (!r.node?.isValid) continue;
      r.node.setPosition(0, r.y, 0);
      if (r.w && r.h) {
        const ui = r.node.getComponent(UITransform);
        if (ui) ui.setContentSize(r.w, r.h);
      }
    }
    styleLabel(this.statusLabel, 22);
    if (this.statusLabel) {
      this.statusLabel.overflow = Label.Overflow.RESIZE_HEIGHT;
      this.statusLabel.color = new Color(255, 255, 255, 255);
    }

    const btn = this.loginBtn ?? btnNode?.getComponent(Button);
    skinButton(btn, 'weihai/ui/btn_login', true, 320);
    if (btnNode) {
      for (const lab of btnNode.getComponentsInChildren(Label)) {
        lab.string = '';
        lab.node.active = false;
      }
      const hostSp = btnNode.getComponent(Sprite);
      if (hostSp) hostSp.enabled = false;
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
      this.setStatus(
        `连接失败：本机需先启动服务端\ncd server && XIANGZHUO_USE_MYSQL=0 XIANGZHUO_USE_REDIS=0 ./run.sh`,
      );
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
      this.setStatus('登录超时：服务器无响应');
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
