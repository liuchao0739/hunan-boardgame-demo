/**
 * 加入房间弹窗：数字键盘 + 房号显示（商业大厅壳）。
 */
import {
  Node, Label, Button, UITransform, Sprite, Layers, Color, Graphics, EditBox,
} from 'cc';
import { loadSpriteFrame, styleLabel } from '../comm/ArtBg';
import { AudioBus } from '../comm/AudioBus';

export class JoinRoomDialog {
  static show(parent: Node, onConfirm: (roomId: string) => void, onClose?: () => void): Node {
    JoinRoomDialog.hide(parent);
    const root = new Node('__JoinRoomDialog');
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
    panel.addComponent(UITransform).setContentSize(520, 560);
    panel.setPosition(0, 10, 0);
    const psp = panel.addComponent(Sprite);
    psp.sizeMode = Sprite.SizeMode.CUSTOM;
    void loadSpriteFrame('weihai/ui/hall/join_dialog_bg').then((sf) => {
      if (sf && panel.isValid) {
        psp.spriteFrame = sf;
        const tw = sf.originalSize?.width || 520;
        const th = sf.originalSize?.height || 560;
        const s = Math.min(560 / tw, 600 / th);
        panel.getComponent(UITransform)!.setContentSize(tw * s, th * s);
      }
    });

    const title = new Node('title');
    panel.addChild(title);
    title.layer = root.layer;
    title.setPosition(0, 220, 0);
    title.addComponent(UITransform).setContentSize(300, 40);
    const tl = title.addComponent(Label);
    styleLabel(tl, 28);
    tl.string = '加入房间';
    tl.color = new Color(255, 236, 180, 255);

    const display = new Node('display');
    panel.addChild(display);
    display.layer = root.layer;
    display.setPosition(0, 150, 0);
    display.addComponent(UITransform).setContentSize(360, 56);
    const dsp = display.addComponent(Sprite);
    dsp.sizeMode = Sprite.SizeMode.CUSTOM;
    void loadSpriteFrame('weihai/ui/hall/editbox_bg').then((sf) => {
      if (sf && display.isValid) dsp.spriteFrame = sf;
    });
    const numLab = new Node('num');
    display.addChild(numLab);
    numLab.layer = root.layer;
    numLab.addComponent(UITransform).setContentSize(340, 48);
    const nl = numLab.addComponent(Label);
    styleLabel(nl, 32);
    nl.string = '';
    nl.color = new Color(255, 255, 255, 255);
    let room = '';

    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '重输', '0', '删除'];
    const startY = 70;
    for (let i = 0; i < keys.length; i++) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const key = keys[i];
      const btnN = new Node(`k_${key}`);
      panel.addChild(btnN);
      btnN.layer = root.layer;
      btnN.addComponent(UITransform).setContentSize(120, 56);
      btnN.setPosition((col - 1) * 140, startY - row * 70, 0);
      const bg = btnN.addComponent(Graphics);
      bg.fillColor = new Color(55, 70, 80, 230);
      bg.roundRect(-60, -26, 120, 52, 10);
      bg.fill();
      bg.strokeColor = new Color(200, 170, 90, 180);
      bg.lineWidth = 1.5;
      bg.roundRect(-60, -26, 120, 52, 10);
      bg.stroke();
      const labN = new Node('t');
      btnN.addChild(labN);
      labN.layer = root.layer;
      labN.addComponent(UITransform).setContentSize(110, 40);
      const lab = labN.addComponent(Label);
      styleLabel(lab, key.length > 1 ? 20 : 28);
      lab.string = key;
      lab.color = new Color(255, 245, 220, 255);
      const btn = btnN.addComponent(Button);
      btn.transition = Button.Transition.SCALE;
      btn.node.on(Button.EventType.CLICK, () => {
        AudioBus.playButton();
        if (key === '重输') room = '';
        else if (key === '删除') room = room.slice(0, -1);
        else if (room.length < 8) room += key;
        nl.string = room;
      });
    }

    const ok = new Node('ok');
    panel.addChild(ok);
    ok.layer = root.layer;
    ok.setPosition(-90, -220, 0);
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
    okLab.string = '加入';
    ok.addComponent(Button).node.on(Button.EventType.CLICK, () => {
      AudioBus.playButton();
      if (!room) return;
      onConfirm(room);
      JoinRoomDialog.hide(parent);
    });

    const close = new Node('close');
    panel.addChild(close);
    close.layer = root.layer;
    close.setPosition(90, -220, 0);
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
      JoinRoomDialog.hide(parent);
    });

    return root;
  }

  static hide(parent: Node | null | undefined) {
    const n = parent?.getChildByName('__JoinRoomDialog');
    if (n?.isValid) n.destroy();
  }

  /** 同步场景里的 EditBox（若存在） */
  static syncEdit(edit: EditBox | null, roomId: string) {
    if (edit) edit.string = roomId;
  }
}
