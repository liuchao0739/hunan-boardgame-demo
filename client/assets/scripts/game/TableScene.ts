import { _decorator, Component, Label, Node } from 'cc';
import { MsgBus, MsgCode } from '../comm/MsgBus';
import { PbWire } from '../comm/PbWire';

const { ccclass, property } = _decorator;

/**
 * 威海牌桌控制（展示 + 出牌）。场景里挂此组件即可。
 */
@ccclass('TableScene')
export class TableScene extends Component {
  @property(Label)
  handLabel: Label | null = null;

  @property(Label)
  tipLabel: Label | null = null;

  private hand: number[] = [];
  private actUser = 0;
  private myId = 0;

  onLoad() {
    const u = (globalThis as any).__WHMJ__ || {};
    this.myId = u.userId || 0;
    MsgBus.ins.on(MsgCode.MahjongInHandChangedResult, (body) => {
      const f = PbWire.decode(body);
      const uid = PbWire.getSint32(f, 1, 0);
      if (uid !== this.myId) return;
      this.hand = [];
      for (const e of (f.get(2) || [])) this.hand.push(PbWire.zigzagDecode(e.raw as number));
      this.refresh();
    });
    MsgBus.ins.on(MsgCode.RedirectActUserIdBroadcast, (body) => {
      const f = PbWire.decode(body);
      this.actUser = PbWire.getSint32(f, 1, 0);
      this.tip(`行动玩家 ${this.actUser}`);
    });
    MsgBus.ins.on(MsgCode.MahjongChuPaiBroadcast, (body) => {
      const f = PbWire.decode(body);
      this.tip(`出牌 ${PbWire.getSint32(f, 1)} -> ${PbWire.getSint32(f, 2)}`);
    });
    MsgBus.ins.sendEmpty(MsgCode.SyncRoomDataCmd);
  }

  refresh() {
    if (this.handLabel) this.handLabel.string = '手牌: ' + this.hand.join(',');
  }

  tip(s: string) {
    if (this.tipLabel) this.tipLabel.string = s;
    console.log('[Table]', s);
  }

  /** UI 按钮：打出手牌第一张（演示） */
  onClickDiscardFirst() {
    if (this.actUser !== this.myId) {
      this.tip('未轮到你');
      return;
    }
    if (!this.hand.length) return;
    const t = this.hand[this.hand.length - 1];
    MsgBus.ins.sendChuPai(t);
  }

  onClickPeng() {
    MsgBus.ins.sendPeng();
  }
}
