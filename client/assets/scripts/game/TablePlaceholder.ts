import { _decorator, Component, Label, Node, UITransform, director, Color } from 'cc';
import { NetBus } from '../comm/NetBus';
import { gameDisplayName } from './TableRouter';

const { ccclass } = _decorator;

/** 象棋/围棋等未实现玩法的占位牌桌 */
@ccclass('TablePlaceholder')
export class TablePlaceholder extends Component {
  onLoad() {
    const canvas = this.node.parent ?? this.node;
    let tipNode = canvas.getChildByName('PlaceholderTip');
    if (!tipNode) {
      tipNode = new Node('PlaceholderTip');
      canvas.addChild(tipNode);
      tipNode.addComponent(UITransform).setContentSize(800, 120);
      tipNode.setPosition(0, 0, 0);
    }
    const tip = tipNode.getComponent(Label) ?? tipNode.addComponent(Label);
    const room = (globalThis as any).__HNQP_ROOM__ || {};
    const gid = room.gameId || 'chess';
    tip.string = `${gameDisplayName(gid)} · 占位场景\n规则与 UI 开发中，请回大厅`;
    tip.fontSize = 28;
    tip.color = new Color(240, 230, 200, 255);

    NetBus.ins.offAll();
  }

  private async backToHall() {
    try { await NetBus.ins.leave(); } catch { /* */ }
    director.loadScene('Hall');
  }
}
