/**
 * 创房弹窗：选择机器人难度 弱/中/强。
 */
import {
  Node, Label, Button, UITransform, Sprite, Layers, Color, Graphics,
} from 'cc';
import { loadSpriteFrame, styleLabel } from '../comm/ArtBg';
import { AudioBus } from '../comm/AudioBus';

export type BotLevel = 'weak' | 'medium' | 'strong';

const LEVELS: Array<{ id: BotLevel; label: string; desc: string }> = [
  { id: 'weak', label: '弱', desc: '摸啥打啥' },
  { id: 'medium', label: '中', desc: '会算效率' },
  { id: 'strong', label: '强', desc: '效率+防守' },
];

export class CreateRoomDialog {
  static show(
    parent: Node,
    onConfirm: (botLevel: BotLevel) => void,
    onClose?: () => void,
  ): Node {
    CreateRoomDialog.hide(parent);
    const root = new Node('__CreateRoomDialog');
    parent.addChild(root);
    root.layer = parent.layer || Layers.Enum.UI_2D;
    root.addComponent(UITransform).setContentSize(1280, 720);
    root.setSiblingIndex(parent.children.length - 1);

    const mask = root.addComponent(Graphics);
    mask.fillColor = new Color(0, 0, 0, 160);
    mask.rect(-640, -360, 1280, 720);
    mask.fill();

    const panel = new Node('panel');
    root.addChild(panel);
    panel.layer = root.layer;
    panel.addComponent(UITransform).setContentSize(480, 420);
    panel.setPosition(0, 20, 0);
    const psp = panel.addComponent(Sprite);
    psp.sizeMode = Sprite.SizeMode.CUSTOM;
    void loadSpriteFrame('weihai/ui/hall/join_dialog_bg').then((sf) => {
      if (sf && panel.isValid) {
        psp.spriteFrame = sf;
        const tw = sf.originalSize?.width || 480;
        const th = sf.originalSize?.height || 420;
        const s = Math.min(520 / tw, 460 / th);
        panel.getComponent(UITransform)!.setContentSize(tw * s, th * s);
      }
    });

    const title = new Node('title');
    panel.addChild(title);
    title.layer = root.layer;
    title.setPosition(0, 160, 0);
    title.addComponent(UITransform).setContentSize(360, 40);
    const tl = title.addComponent(Label);
    styleLabel(tl, 28);
    tl.string = '创建房间';
    tl.color = new Color(255, 236, 180, 255);

    const tip = new Node('tip');
    panel.addChild(tip);
    tip.layer = root.layer;
    tip.setPosition(0, 110, 0);
    tip.addComponent(UITransform).setContentSize(400, 32);
    const tipLab = tip.addComponent(Label);
    styleLabel(tipLab, 18);
    tipLab.string = '选择机器人难度';
    tipLab.color = new Color(220, 210, 180, 255);

    let selected: BotLevel = 'medium';
    const optionNodes: Array<{ id: BotLevel; g: Graphics; lab: Label }> = [];

    const paint = () => {
      for (const o of optionNodes) {
        const on = o.id === selected;
        o.g.clear();
        o.g.fillColor = on ? new Color(196, 72, 48, 255) : new Color(55, 70, 80, 230);
        o.g.roundRect(-70, -36, 140, 72, 12);
        o.g.fill();
        o.g.strokeColor = on ? new Color(255, 210, 120, 220) : new Color(200, 170, 90, 140);
        o.g.lineWidth = on ? 2 : 1.5;
        o.g.roundRect(-70, -36, 140, 72, 12);
        o.g.stroke();
        o.lab.color = on ? new Color(255, 255, 255, 255) : new Color(255, 245, 220, 255);
      }
    };

    for (let i = 0; i < LEVELS.length; i++) {
      const lv = LEVELS[i];
      const btnN = new Node(`lv_${lv.id}`);
      panel.addChild(btnN);
      btnN.layer = root.layer;
      btnN.addComponent(UITransform).setContentSize(140, 72);
      btnN.setPosition((i - 1) * 150, 20, 0);
      const g = btnN.addComponent(Graphics);
      const labN = new Node('t');
      btnN.addChild(labN);
      labN.layer = root.layer;
      labN.setPosition(0, 10, 0);
      labN.addComponent(UITransform).setContentSize(120, 36);
      const lab = labN.addComponent(Label);
      styleLabel(lab, 26);
      lab.string = lv.label;
      const descN = new Node('d');
      btnN.addChild(descN);
      descN.layer = root.layer;
      descN.setPosition(0, -18, 0);
      descN.addComponent(UITransform).setContentSize(130, 24);
      const desc = descN.addComponent(Label);
      styleLabel(desc, 14);
      desc.string = lv.desc;
      desc.color = new Color(230, 220, 190, 220);
      optionNodes.push({ id: lv.id, g, lab });
      btnN.addComponent(Button).node.on(Button.EventType.CLICK, () => {
        AudioBus.playButton();
        selected = lv.id;
        paint();
      });
    }
    paint();

    const ok = new Node('ok');
    panel.addChild(ok);
    ok.layer = root.layer;
    ok.setPosition(-90, -140, 0);
    ok.addComponent(UITransform).setContentSize(160, 52);
    const okg = ok.addComponent(Graphics);
    okg.fillColor = new Color(196, 72, 48, 255);
    okg.roundRect(-80, -26, 160, 52, 12);
    okg.fill();
    const okl = new Node('t');
    ok.addChild(okl);
    okl.layer = root.layer;
    okl.addComponent(UITransform).setContentSize(140, 40);
    const okLab = okl.addComponent(Label);
    styleLabel(okLab, 22);
    okLab.string = '创建';
    ok.addComponent(Button).node.on(Button.EventType.CLICK, () => {
      AudioBus.playButton();
      onConfirm(selected);
      CreateRoomDialog.hide(parent);
    });

    const close = new Node('close');
    panel.addChild(close);
    close.layer = root.layer;
    close.setPosition(90, -140, 0);
    close.addComponent(UITransform).setContentSize(160, 52);
    const cg = close.addComponent(Graphics);
    cg.fillColor = new Color(50, 60, 70, 255);
    cg.roundRect(-80, -26, 160, 52, 12);
    cg.fill();
    const cln = new Node('t');
    close.addChild(cln);
    cln.layer = root.layer;
    cln.addComponent(UITransform).setContentSize(140, 40);
    const cl = cln.addComponent(Label);
    styleLabel(cl, 22);
    cl.string = '取消';
    close.addComponent(Button).node.on(Button.EventType.CLICK, () => {
      AudioBus.playButton();
      onClose?.();
      CreateRoomDialog.hide(parent);
    });

    return root;
  }

  static hide(parent: Node | null | undefined) {
    const n = parent?.getChildByName('__CreateRoomDialog');
    if (n?.isValid) n.destroy();
  }
}
