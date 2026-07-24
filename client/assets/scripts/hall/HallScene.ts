import { _decorator, Component, Label, EditBox } from 'cc';
import { MsgBus, MsgCode } from '../comm/MsgBus';
import { PbWire } from '../comm/PbWire';

const { ccclass, property } = _decorator;

@ccclass('HallScene')
export class HallScene extends Component {
  @property(Label)
  infoLabel: Label | null = null;

  @property(Label)
  roomLabel: Label | null = null;

  @property(EditBox)
  joinEdit: EditBox | null = null;

  private roomId = -1;

  onLoad() {
    const u = (globalThis as any).__WHMJ__ || {};
    this.setInfo(`玩家 ${u.userName || '?'} (${u.userId || '?'})`);
    MsgBus.ins.on(MsgCode.GetMyDetailzResult, (body) => {
      const f = PbWire.decode(body);
      const cards = PbWire.getSint32(f, 5, 0);
      this.setInfo(`${PbWire.getString(f, 2)} 房卡:${cards}`);
    });
    MsgBus.ins.on(MsgCode.CreateRoomResult, (body) => {
      const f = PbWire.decode(body);
      this.roomId = PbWire.getSint32(f, 1, -1);
      this.setRoom(`房间号 ${this.roomId}`);
    });
    MsgBus.ins.on(MsgCode.JoinRoomResult, (body) => {
      const f = PbWire.decode(body);
      this.roomId = PbWire.getSint32(f, 1, -1);
      this.setRoom(`已加入 ${this.roomId}`);
    });
    MsgBus.ins.on(MsgCode.PrepareBroadcast, () => this.setRoom(`房间 ${this.roomId} 有人准备`));
    MsgBus.ins.on(MsgCode.OfficialStartBroadcast, () => this.setRoom(`房间 ${this.roomId} 开局！进入牌桌场景`));
    MsgBus.ins.on(MsgCode.MahjongInHandChangedResult, (body) => {
      const f = PbWire.decode(body);
      const tiles: number[] = [];
      const arr = f.get(2) || [];
      for (const e of arr) tiles.push(PbWire.zigzagDecode(e.raw as number));
      this.setRoom(`手牌(${tiles.length}): ${tiles.join(',')}`);
    });
    MsgBus.ins.sendEmpty(MsgCode.GetMyDetailzCmd);
  }

  setInfo(s: string) { if (this.infoLabel) this.infoLabel.string = s; }
  setRoom(s: string) { if (this.roomLabel) this.roomLabel.string = s; console.log('[Hall]', s); }

  onClickCreate() {
    MsgBus.ins.sendCreateRoom(1, 1001);
  }

  onClickJoin() {
    const id = parseInt(this.joinEdit?.string || '0', 10);
    MsgBus.ins.sendJoinRoom(id);
  }

  onClickPrepare() {
    MsgBus.ins.sendPrepare();
  }
}
