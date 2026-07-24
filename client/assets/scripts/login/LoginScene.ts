import { _decorator, Component, Label, Node, EditBox, Button, UITransform, director } from 'cc';
import { MsgBus, MsgCode } from '../comm/MsgBus';
import { PbWire } from '../comm/PbWire';
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

  onLoad() {
    this.layoutUi();
    attachBg(this.node.parent ?? this.node, 'weihai/bg/hall');
    // EditBox 默认 maxLength=8，会把 127.0.0.1:20480 截成 127.0.0. —— 必须先放开再赋值
    if (this.nameEdit) this.nameEdit.maxLength = 32;
    if (this.serverEdit) this.serverEdit.maxLength = 64;

    const addr = MsgBus.readServerAddrFromUrl('127.0.0.1:20480');
    if (this.serverEdit) this.serverEdit.string = addr;
    if (this.nameEdit) this.nameEdit.string = this.nameEdit.string || '测试用户';
    MsgBus.ins.putServerAddr(addr);
    this.setStatus('就绪：点登录连接 ' + addr);
  }

  /** 把叠在中心的控件拉开排成一列 */
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
    // 强制清掉默认 Label（场景里可能残留「准备」等字）
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
    if (!s || !s.includes(':') || s.endsWith('.')) return '127.0.0.1:20480';
    return s;
  }

  async onClickLogin() {
    const name = this.nameEdit?.string || '测试用户';
    const addr = this.normalizeAddr(this.serverEdit?.string || '');
    if (this.serverEdit) this.serverEdit.string = addr;
    MsgBus.ins.putServerAddr(addr);
    this.setStatus('连接中… ' + addr);
    try {
      await MsgBus.ins.connect();
    } catch (e) {
      console.warn('[Login] connect fail', e);
      this.setStatus('连接失败：检查地址与 server/run.sh（' + addr + '）');
      return;
    }
    MsgBus.ins.on(MsgCode.UserLoginResult, (body) => {
      const f = PbWire.decode(body);
      const userId = PbWire.getSint32(f, 1, -1);
      const userName = PbWire.getString(f, 2, '');
      const ticket = PbWire.getString(f, 3, '');
      if (userId < 0) {
        this.setStatus('登录失败');
        return;
      }
      (globalThis as any).__WHMJ__ = { userId, userName, ticket, serverAddr: addr };
      this.setStatus(`登录成功 ${userId} ${userName}`);
      director.loadScene('Hall', (err) => {
        if (err) {
          this.setStatus('登录成功，但还没有 Hall 场景（请按 SCENE_SETUP 再建）');
          console.warn('Hall scene missing', err);
        }
      });
    });
    MsgBus.ins.sendUserLogin(0, { testerName: name });
  }
}
