import { _decorator, Component, Label, Node, EditBox, director } from 'cc';
import { MsgBus, MsgCode } from '../comm/MsgBus';
import { PbWire } from '../comm/PbWire';

const { ccclass, property } = _decorator;

@ccclass('LoginScene')
export class LoginScene extends Component {
  @property(Label)
  statusLabel: Label | null = null;

  @property(EditBox)
  nameEdit: EditBox | null = null;

  @property(EditBox)
  serverEdit: EditBox | null = null;

  onLoad() {
    const addr = MsgBus.readServerAddrFromUrl('127.0.0.1:20480');
    if (this.serverEdit) this.serverEdit.string = addr;
    MsgBus.ins.putServerAddr(addr);
    this.setStatus('就绪：点登录连接 ' + addr);
  }

  setStatus(s: string) {
    if (this.statusLabel) this.statusLabel.string = s;
    console.log('[Login]', s);
  }

  async onClickLogin() {
    const name = this.nameEdit?.string || '测试用户';
    const addr = this.serverEdit?.string || '127.0.0.1:20480';
    MsgBus.ins.putServerAddr(addr);
    this.setStatus('连接中…');
    try {
      await MsgBus.ins.connect();
    } catch (e) {
      this.setStatus('连接失败：请先启动 server/run.sh');
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
      this.setStatus(`登录成功 ${userName} ${userName}`);
      director.loadScene('Hall', (err) => {
        if (err) console.warn('Hall scene missing, stay on Login', err);
      });
    });
    MsgBus.ins.sendUserLogin(0, { testerName: name });
  }
}
