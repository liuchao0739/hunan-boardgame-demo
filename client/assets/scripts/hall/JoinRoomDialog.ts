/**
 * 加入房间：可加入房间列表 → 点选 → 输入密码进入。
 */
import {
  Node, Label, Button, UITransform, Sprite, Layers, Color, Graphics, EditBox,
} from 'cc';
import { loadSpriteFrame, styleLabel } from '../comm/ArtBg';
import { AudioBus } from '../comm/AudioBus';
import { gameDisplayName } from '../game/TableRouter';

export type RoomListItem = {
  roomId: number;
  gameId?: string;
  ownerName?: string;
  humanCount?: number;
  playerCount?: number;
  maxPlayers?: number;
  hasPassword?: boolean;
  botLevel?: string;
};

const PANEL_W = 560;
const PANEL_H = 520;

export class JoinRoomDialog {
  static show(
    parent: Node,
    loadRooms: () => Promise<RoomListItem[]>,
    onConfirm: (roomId: number, password: string) => void,
    onClose?: () => void,
  ): Node {
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
    panel.addComponent(UITransform).setContentSize(PANEL_W, PANEL_H);
    panel.setPosition(0, 28, 0);
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

    mkLab(panel, 'title', 0, 220, 360, 36, 26, '加入房间', new Color(255, 236, 180, 255));
    const status = mkLab(panel, 'status', 0, 184, 500, 24, 16, '加载房间列表…', new Color(220, 210, 180, 255));

    const listRoot = new Node('list');
    panel.addChild(listRoot);
    listRoot.layer = root.layer;
    listRoot.addComponent(UITransform).setContentSize(500, 320);
    listRoot.setPosition(0, 10, 0);

    const refreshList = async () => {
      status.string = '加载房间列表…';
      listRoot.removeAllChildren();
      let rooms: RoomListItem[] = [];
      try {
        rooms = await loadRooms();
      } catch {
        status.string = '加载失败，请重试';
        return;
      }
      if (!listRoot.isValid) return;
      if (!rooms.length) {
        status.string = '暂无等待中的房间，可先创建房间';
        return;
      }
      status.string = `共 ${rooms.length} 个房间 · 点选后输入密码加入`;
      const maxShow = Math.min(rooms.length, 6);
      for (let i = 0; i < maxShow; i++) {
        const r = rooms[i];
        const row = new Node(`room_${r.roomId}`);
        listRoot.addChild(row);
        row.layer = root.layer;
        row.addComponent(UITransform).setContentSize(480, 48);
        row.setPosition(0, 130 - i * 54, 0);
        const rg = row.addComponent(Graphics);
        rg.fillColor = new Color(40, 52, 68, 240);
        rg.roundRect(-240, -24, 480, 48, 10);
        rg.fill();
        rg.strokeColor = new Color(200, 170, 90, 140);
        rg.lineWidth = 1.2;
        rg.roundRect(-240, -24, 480, 48, 10);
        rg.stroke();

        const humans = r.humanCount ?? 0;
        const maxP = r.maxPlayers ?? 4;
        const game = gameDisplayName(r.gameId || 'changsha_mj');
        const lock = r.hasPassword !== false ? '🔒' : '';
        mkLab(row, 'main', -10, 6, 420, 24, 18,
          `${lock} 房${r.roomId} · ${r.ownerName || '房主'} · ${humans}/${maxP}人`,
          new Color(255, 245, 220, 255));
        mkLab(row, 'sub', -10, -12, 420, 18, 13, game, new Color(180, 200, 190, 255));

        row.addComponent(Button).node.on(Button.EventType.CLICK, () => {
          AudioBus.playButton();
          showPasswordPrompt(root, r.roomId, (pwd) => {
            onConfirm(r.roomId, pwd);
            JoinRoomDialog.hide(parent);
          });
        });
      }
    };

    const refreshBtn = mkBtn(panel, 'refresh', -100, -220, 160, 48, '刷新', new Color(60, 110, 90, 255));
    refreshBtn.node.on(Button.EventType.CLICK, () => {
      AudioBus.playButton();
      void refreshList();
    });

    const close = mkBtn(panel, 'close', 100, -220, 160, 48, '取消', new Color(50, 60, 70, 255));
    close.node.on(Button.EventType.CLICK, () => {
      AudioBus.playButton();
      onClose?.();
      JoinRoomDialog.hide(parent);
    });

    void refreshList();
    return root;
  }

  static hide(parent: Node | null | undefined) {
    const n = parent?.getChildByName('__JoinRoomDialog');
    if (n?.isValid) n.destroy();
  }

  static syncEdit(edit: EditBox | null, roomId: string) {
    if (edit) edit.string = roomId;
  }
}

function showPasswordPrompt(host: Node, roomId: number, onOk: (pwd: string) => void) {
  const old = host.getChildByName('__PwdPrompt');
  if (old?.isValid) old.destroy();

  const wrap = new Node('__PwdPrompt');
  host.addChild(wrap);
  wrap.layer = host.layer;
  wrap.addComponent(UITransform).setContentSize(1280, 720);
  wrap.setSiblingIndex(host.children.length - 1);
  const mg = wrap.addComponent(Graphics);
  mg.fillColor = new Color(0, 0, 0, 140);
  mg.rect(-640, -360, 1280, 720);
  mg.fill();

  const box = new Node('box');
  wrap.addChild(box);
  box.layer = host.layer;
  box.addComponent(UITransform).setContentSize(400, 360);
  box.setPosition(0, 20, 0);
  const bg = box.addComponent(Graphics);
  bg.fillColor = new Color(24, 30, 42, 255);
  bg.roundRect(-200, -180, 400, 360, 14);
  bg.fill();
  bg.strokeColor = new Color(210, 170, 80, 220);
  bg.lineWidth = 2;
  bg.roundRect(-200, -180, 400, 360, 14);
  bg.stroke();

  mkLab(box, 't', 0, 140, 320, 32, 22, `输入房 ${roomId} 密码`, new Color(255, 236, 180, 255));
  let password = '';
  const pwdLab = mkLab(box, 'pwd', 0, 100, 240, 32, 26, '····', new Color(255, 255, 255, 255));
  const err = mkLab(box, 'err', 0, 70, 300, 20, 14, '', new Color(255, 120, 100, 255));
  const sync = () => { pwdLab.string = password.length ? '●'.repeat(password.length) : '····'; };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '清空', '0', '删'];
  for (let i = 0; i < keys.length; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const key = keys[i];
    const btnN = new Node(`pk_${key}`);
    box.addChild(btnN);
    btnN.layer = host.layer;
    btnN.addComponent(UITransform).setContentSize(90, 36);
    btnN.setPosition((col - 1) * 100, 30 - row * 42, 0);
    const g = btnN.addComponent(Graphics);
    g.fillColor = new Color(55, 70, 80, 230);
    g.roundRect(-45, -18, 90, 36, 8);
    g.fill();
    mkLab(btnN, 't', 0, 0, 80, 24, key.length > 1 ? 14 : 20, key);
    btnN.addComponent(Button).node.on(Button.EventType.CLICK, () => {
      AudioBus.playButton();
      if (key === '清空') password = '';
      else if (key === '删') password = password.slice(0, -1);
      else if (password.length < 6) password += key;
      sync();
      err.string = '';
    });
  }

  mkBtn(box, 'ok', -80, -150, 130, 44, '进入', new Color(196, 72, 48, 255)).node.on(Button.EventType.CLICK, () => {
    AudioBus.playButton();
    if (password.length < 4) {
      err.string = '密码至少 4 位';
      return;
    }
    onOk(password);
  });
  mkBtn(box, 'cancel', 80, -150, 130, 44, '返回', new Color(50, 60, 70, 255)).node.on(Button.EventType.CLICK, () => {
    AudioBus.playButton();
    wrap.destroy();
  });
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
  lab.overflow = Label.Overflow.SHRINK;
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
  mkLab(n, 't', 0, 0, w - 16, h - 10, 20, text);
  const btn = n.addComponent(Button);
  btn.target = n;
  btn.transition = Button.Transition.SCALE;
  return btn;
}
