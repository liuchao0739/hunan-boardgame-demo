/**
 * 创房弹窗：人机立即开局 / 真人等满再开 + 必填房间密码。
 */
import {
  Node, Label, Button, UITransform, Sprite, Layers, Color, Graphics,
} from 'cc';
import { loadSpriteFrame, styleLabel } from '../comm/ArtBg';
import { AudioBus } from '../comm/AudioBus';

export type BotLevel = 'weak' | 'medium' | 'strong';

export type CreateRoomOptions = {
  /** true=配机器人并立即开局；false=真人局，人满开局 */
  withBots: boolean;
  botLevel: BotLevel;
  password: string;
};

const LEVELS: Array<{ id: BotLevel; label: string; desc: string }> = [
  { id: 'weak', label: '弱', desc: '摸啥打啥' },
  { id: 'medium', label: '中', desc: '会算效率' },
  { id: 'strong', label: '强', desc: '效率+防守' },
];

const PANEL_W = 460;
/** 含键盘 + 底栏，需留足底部内边距，避免「创建/取消」贴边溢出 */
const PANEL_H = 600;

export class CreateRoomDialog {
  static show(
    parent: Node,
    onConfirm: (opts: CreateRoomOptions) => void,
    onClose?: () => void,
  ): Node {
    CreateRoomDialog.hide(parent);
    const root = new Node('__CreateRoomDialog');
    parent.addChild(root);
    root.layer = parent.layer || Layers.Enum.UI_2D;
    root.addComponent(UITransform).setContentSize(1280, 720);
    root.setSiblingIndex(parent.children.length - 1);

    const mask = root.addComponent(Graphics);
    mask.fillColor = new Color(0, 0, 0, 170);
    mask.rect(-640, -360, 1280, 720);
    mask.fill();

    const panel = new Node('panel');
    root.addChild(panel);
    panel.layer = root.layer;
    panel.addComponent(UITransform).setContentSize(PANEL_W, PANEL_H);
    panel.setPosition(0, 8, 0);

    const frame = panel.addComponent(Graphics);
    frame.fillColor = new Color(28, 36, 48, 250);
    frame.roundRect(-PANEL_W / 2, -PANEL_H / 2, PANEL_W, PANEL_H, 18);
    frame.fill();
    frame.strokeColor = new Color(210, 170, 80, 200);
    frame.lineWidth = 2;
    frame.roundRect(-PANEL_W / 2, -PANEL_H / 2, PANEL_W, PANEL_H, 18);
    frame.stroke();

    const psp = panel.addComponent(Sprite);
    psp.sizeMode = Sprite.SizeMode.CUSTOM;
    void loadSpriteFrame('weihai/ui/hall/join_dialog_bg').then((sf) => {
      if (!sf || !panel.isValid) return;
      psp.spriteFrame = sf;
      panel.getComponent(UITransform)!.setContentSize(PANEL_W, PANEL_H);
    });

    mkLab(panel, 'title', 0, 262, 360, 34, 24, '创建房间', new Color(255, 236, 180, 255));

    // —— 开局模式 ——
    mkLab(panel, 'tipMode', 0, 226, 400, 20, 14, '开局方式', new Color(220, 210, 180, 255));
    let withBots = true;
    const modeNodes: Array<{ bots: boolean; g: Graphics; lab: Label }> = [];
    const paintMode = () => {
      for (const o of modeNodes) {
        const on = o.bots === withBots;
        o.g.clear();
        o.g.fillColor = on ? new Color(196, 72, 48, 255) : new Color(40, 50, 62, 235);
        o.g.roundRect(-95, -22, 190, 44, 10);
        o.g.fill();
        o.g.strokeColor = on ? new Color(255, 210, 120, 220) : new Color(200, 170, 90, 140);
        o.g.lineWidth = on ? 2 : 1.5;
        o.g.roundRect(-95, -22, 190, 44, 10);
        o.g.stroke();
        o.lab.color = on ? new Color(255, 255, 255, 255) : new Color(255, 245, 220, 255);
      }
      lvHost.active = withBots;
      tipLv.node.active = withBots;
    };

    const modes = [
      { bots: true, label: '人机对战', x: -105 },
      { bots: false, label: '真人开房', x: 105 },
    ];
    for (const m of modes) {
      const btnN = new Node(`mode_${m.bots ? 'bot' : 'human'}`);
      panel.addChild(btnN);
      btnN.layer = root.layer;
      btnN.addComponent(UITransform).setContentSize(190, 44);
      btnN.setPosition(m.x, 192, 0);
      const g = btnN.addComponent(Graphics);
      const lab = mkLab(btnN, 't', 0, 0, 170, 28, 19, m.label);
      modeNodes.push({ bots: m.bots, g, lab });
      const b = btnN.addComponent(Button);
      b.target = btnN;
      b.node.on(Button.EventType.CLICK, () => {
        AudioBus.playButton();
        withBots = m.bots;
        paintMode();
      });
    }

    const tipLv = mkLab(panel, 'tipLv', 0, 154, 400, 20, 14, '机器人难度（创建后立即开局）', new Color(220, 210, 180, 255));
    const lvHost = new Node('lvHost');
    panel.addChild(lvHost);
    lvHost.layer = root.layer;
    lvHost.addComponent(UITransform);
    lvHost.setPosition(0, 112, 0);

    let selected: BotLevel = 'medium';
    const optionNodes: Array<{ id: BotLevel; g: Graphics; lab: Label }> = [];
    const paintLv = () => {
      for (const o of optionNodes) {
        const on = o.id === selected;
        o.g.clear();
        o.g.fillColor = on ? new Color(196, 72, 48, 255) : new Color(40, 50, 62, 235);
        o.g.roundRect(-52, -22, 104, 44, 10);
        o.g.fill();
        o.g.strokeColor = on ? new Color(255, 210, 120, 220) : new Color(200, 170, 90, 140);
        o.g.lineWidth = on ? 2 : 1.5;
        o.g.roundRect(-52, -22, 104, 44, 10);
        o.g.stroke();
        o.lab.color = on ? new Color(255, 255, 255, 255) : new Color(255, 245, 220, 255);
      }
    };
    for (let i = 0; i < LEVELS.length; i++) {
      const lv = LEVELS[i];
      const btnN = new Node(`lv_${lv.id}`);
      lvHost.addChild(btnN);
      btnN.layer = root.layer;
      btnN.addComponent(UITransform).setContentSize(104, 44);
      btnN.setPosition((i - 1) * 118, 0, 0);
      const g = btnN.addComponent(Graphics);
      const lab = mkLab(btnN, 't', 0, 6, 90, 20, 18, lv.label);
      mkLab(btnN, 'd', 0, -12, 96, 14, 11, lv.desc, new Color(230, 220, 190, 220));
      optionNodes.push({ id: lv.id, g, lab });
      const b = btnN.addComponent(Button);
      b.target = btnN;
      b.node.on(Button.EventType.CLICK, () => {
        AudioBus.playButton();
        selected = lv.id;
        paintLv();
      });
    }
    paintLv();
    paintMode();

    mkLab(panel, 'tipPwd', 0, 68, 400, 20, 14, '房间密码（4～6 位数字，必填）', new Color(220, 210, 180, 255));

    let password = '';
    const pwdLab = mkLab(panel, 'pwd', 0, 40, 280, 28, 24, '····', new Color(255, 255, 255, 255));
    const syncPwd = () => {
      pwdLab.string = password.length ? '●'.repeat(password.length) : '····';
      errLab.string = '';
    };
    const errLab = mkLab(panel, 'err', 0, 16, 400, 18, 13, '', new Color(255, 120, 100, 255));

    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '清空', '0', '删'];
    for (let i = 0; i < keys.length; i++) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const key = keys[i];
      const btnN = new Node(`k_${key}`);
      panel.addChild(btnN);
      btnN.layer = root.layer;
      btnN.addComponent(UITransform).setContentSize(100, 36);
      btnN.setPosition((col - 1) * 112, -20 - row * 40, 0);
      const bg = btnN.addComponent(Graphics);
      bg.fillColor = new Color(55, 70, 80, 230);
      bg.roundRect(-50, -18, 100, 36, 8);
      bg.fill();
      mkLab(btnN, 't', 0, 0, 90, 24, key.length > 1 ? 14 : 18, key, new Color(255, 245, 220, 255));
      const kb = btnN.addComponent(Button);
      kb.target = btnN;
      kb.node.on(Button.EventType.CLICK, () => {
        AudioBus.playButton();
        if (key === '清空') password = '';
        else if (key === '删') password = password.slice(0, -1);
        else if (password.length < 6) password += key;
        syncPwd();
      });
    }

    // 面板半高 300；按钮中心 -262 → 底边约 -285，留约 15px 内边距
    const ok = mkBtn(panel, 'ok', -88, -262, 150, 44, '创建', new Color(196, 72, 48, 255));
    ok.node.setSiblingIndex(panel.children.length - 1);
    ok.node.on(Button.EventType.CLICK, () => {
      AudioBus.playButton();
      if (password.length < 4) {
        errLab.string = '密码至少 4 位';
        return;
      }
      onConfirm({ withBots, botLevel: selected, password });
      CreateRoomDialog.hide(parent);
    });

    const close = mkBtn(panel, 'close', 88, -262, 150, 44, '取消', new Color(50, 60, 70, 255));
    close.node.setSiblingIndex(panel.children.length - 1);
    close.node.on(Button.EventType.CLICK, () => {
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

function mkLab(
  parent: Node, name: string, x: number, y: number, w: number, h: number, size: number,
  text: string, color = new Color(255, 245, 220, 255),
): Label {
  const n = new Node(name);
  parent.addChild(n);
  n.layer = parent.layer;
  n.setPosition(x, y, 0);
  n.addComponent(UITransform).setContentSize(w, h);
  const lab = n.addComponent(Label);
  styleLabel(lab, size);
  lab.string = text;
  lab.color = color;
  return lab;
}

function mkBtn(parent: Node, name: string, x: number, y: number, w: number, h: number, text: string, fill: Color): Button {
  const n = new Node(name);
  parent.addChild(n);
  n.layer = parent.layer;
  n.setPosition(x, y, 0);
  n.addComponent(UITransform).setContentSize(w, h);
  const g = n.addComponent(Graphics);
  g.fillColor = fill;
  g.roundRect(-w / 2, -h / 2, w, h, 12);
  g.fill();
  mkLab(n, 't', 0, 0, w - 20, h - 12, 20, text);
  const btn = n.addComponent(Button);
  btn.target = n;
  btn.transition = Button.Transition.SCALE;
  return btn;
}
