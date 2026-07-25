import { _decorator, Component, Label, Node, EditBox, Button, UITransform, director } from 'cc';
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
  serverEdit: EditBox | null = null;

  @property(Button)
  loginBtn: Button | null = null;

  private loggingIn = false;

  onLoad() {
    this.layoutUi();
    attachBg(this.node.parent ?? this.node, 'weihai/bg/hall');
    if (this.nameEdit) this.nameEdit.maxLength = 32;
    if (this.serverEdit) this.serverEdit.maxLength = 128;

    const addr = NetBus.readServerAddrFromUrl('127.0.0.1:20480');
    if (this.serverEdit) this.serverEdit.string = addr;
    if (this.nameEdit) this.nameEdit.string = this.nameEdit.string || '测试用户';
    NetBus.ins.putServerAddr(addr);
    this.setStatus('湘桌 · 点登录连接 ' + addr);

    const btnNode =
      this.loginBtn?.node
      ?? this.node.getChildByName('LoginBtn')
      ?? this.node.parent?.getChildByName('LoginBtn')
      ?? null;
    const btn = this.loginBtn ?? btnNode?.getComponent(Button);
    if (btn) {
      btn.clickEvents.length = 0;
      btn.node.off(Button.EventType.CLICK);
      btn.node.on(Button.EventType.CLICK, this.onClickLogin, this);
    }
  }

  private layoutUi() {
    const btnNode =
      this.loginBtn?.node
      ?? this.node.getChildByName('LoginBtn')
      ?? this.node.parent?.getChildByName('LoginBtn')
      ?? null;
    const rows: Array<{ node: Node | null | undefined; y: number; w: number; h: number }> = [
      { node: this.statusLabel?.node, y: 120, w: 720, h: 48 },
      { node: this.nameEdit?.node, y: 40, w: 420, h: 56 },
      { node: this.serverEdit?.node, y: -40, w: 420, h: 56 },
      { node: btnNode, y: -150, w: 280, h: 90 },
    ];
    for (const r of rows) {
      if (!r.node) continue;
      r.node.setPosition(0, r.y, 0);
      const ui = r.node.getComponent(UITransform);
      if (ui) ui.setContentSize(r.w, r.h);
    }
    styleLabel(this.statusLabel, 28);
    if (this.statusLabel) this.statusLabel.overflow = Label.Overflow.RESIZE_HEIGHT;
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

  async onClickLogin() {
    if (this.loggingIn) return;
    this.loggingIn = true;
    const name = this.nameEdit?.string || '测试用户';
    let addr = this.normalizeAddr(this.serverEdit?.string || '');
    try {
      if (typeof location !== 'undefined' && location.protocol === 'https:' && location.hostname) {
        addr = `wss://${location.host}/websocket`;
        if (this.serverEdit) this.serverEdit.string = addr;
      }
    } catch { /* */ }
    if (this.serverEdit) this.serverEdit.string = addr;
    NetBus.ins.putServerAddr(addr);

    // 倒计时，避免一直停在「连接中」看不出有没有超时
    let left = 12;
    this.setStatus(`连接中(${left}s)… ${addr}`);
    const tick = setInterval(() => {
      left -= 1;
      if (left >= 0) this.setStatus(`连接中(${left}s)… ${addr}`);
    }, 1000);

    try {
      await NetBus.ins.connect();
      clearInterval(tick);
      this.setStatus('已连接，登录中…');
    } catch (e) {
      clearInterval(tick);
      console.warn('[Login] connect fail', e);
      this.setStatus('连接失败：请关 Clash/代理 后强制刷新(Cmd+Shift+R)，或打开 /ws-test.html 自检');
      this.loggingIn = false;
      return;
    }
    try {
      const msg = await NetBus.ins.login(name);
      if (msg.cmd === 'error') {
        this.setStatus(msg.body?.message || '登录失败');
        this.loggingIn = false;
        return;
      }
      const b = msg.body || {};
      (globalThis as any).__HNQP__ = {
        userId: b.userId,
        userName: b.userName,
        ticket: b.ticket,
        serverAddr: addr,
      };
      this.setStatus(`登录成功 ${b.userId} ${b.userName}`);
      NetBus.ins.offAll();
      director.loadScene('Hall', (err) => {
        this.loggingIn = false;
        if (err) this.setStatus('缺少 Hall 场景');
      });
    } catch (e) {
      console.warn('[Login] login fail', e);
      this.setStatus('登录超时：WebSocket 已连上但服务器无响应');
      this.loggingIn = false;
    }
  }
}