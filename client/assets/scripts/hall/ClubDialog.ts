/**
 * 亲友圈（老友圈）最小可用面板：列表 / 创建 / 加入
 */
import {
  Node, Label, Button, UITransform, Sprite, Layers, Color, Graphics, EditBox,
} from 'cc';
import { loadSpriteFrame, styleLabel } from '../comm/ArtBg';
import { AudioBus } from '../comm/AudioBus';
import { NetBus } from '../comm/NetBus';

export class ClubDialog {
  static show(parent: Node, onToast: (s: string) => void): Node {
    ClubDialog.hide(parent);
    const root = new Node('__ClubDialog');
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
    panel.addComponent(UITransform).setContentSize(640, 480);
    panel.setPosition(0, 10, 0);
    const psp = panel.addComponent(Sprite);
    psp.sizeMode = Sprite.SizeMode.CUSTOM;
    void loadSpriteFrame('weihai/ui/settle/glass_bg').then((sf) => {
      if (sf && panel.isValid) {
        psp.spriteFrame = sf;
        panel.getComponent(UITransform)!.setContentSize(680, 500);
      }
    });

    const title = ClubDialog.mkLabel(panel, 'title', 0, 200, 400, 36, 28, '老友圈');
    title.color = new Color(255, 230, 150, 255);

    const listLab = ClubDialog.mkLabel(panel, 'list', 0, 40, 560, 240, 20, '加载中…');
    listLab.overflow = Label.Overflow.RESIZE_HEIGHT;
    listLab.horizontalAlign = Label.HorizontalAlign.LEFT;
    listLab.verticalAlign = Label.VerticalAlign.TOP;

    const nameEditHost = new Node('nameEdit');
    panel.addChild(nameEditHost);
    nameEditHost.layer = root.layer;
    nameEditHost.setPosition(-140, -150, 0);
    nameEditHost.addComponent(UITransform).setContentSize(240, 44);
    const neb = nameEditHost.addComponent(EditBox);
    neb.maxLength = 16;
    neb.placeholder = '新圈名称';
    neb.string = '';
    // minimal text labels for EditBox
    const ph = new Node('PLACEHOLDER_LABEL');
    nameEditHost.addChild(ph);
    ph.addComponent(UITransform).setContentSize(220, 36);
    const phl = ph.addComponent(Label);
    styleLabel(phl, 18);
    phl.string = '新圈名称';
    phl.color = new Color(180, 180, 180, 180);
    const tx = new Node('TEXT_LABEL');
    nameEditHost.addChild(tx);
    tx.addComponent(UITransform).setContentSize(220, 36);
    const txl = tx.addComponent(Label);
    styleLabel(txl, 18);
    neb.placeholderLabel = phl;
    neb.textLabel = txl;

    const idEditHost = new Node('idEdit');
    panel.addChild(idEditHost);
    idEditHost.layer = root.layer;
    idEditHost.setPosition(140, -150, 0);
    idEditHost.addComponent(UITransform).setContentSize(200, 44);
    const ieb = idEditHost.addComponent(EditBox);
    ieb.maxLength = 10;
    ieb.inputMode = EditBox.InputMode.NUMERIC;
    ieb.placeholder = '圈号';
    const iph = new Node('PLACEHOLDER_LABEL');
    idEditHost.addChild(iph);
    iph.addComponent(UITransform).setContentSize(180, 36);
    const iphl = iph.addComponent(Label);
    styleLabel(iphl, 18);
    iphl.string = '加入圈号';
    iphl.color = new Color(180, 180, 180, 180);
    const itx = new Node('TEXT_LABEL');
    idEditHost.addChild(itx);
    itx.addComponent(UITransform).setContentSize(180, 36);
    const itxl = itx.addComponent(Label);
    styleLabel(itxl, 18);
    ieb.placeholderLabel = iphl;
    ieb.textLabel = itxl;

    const refresh = async () => {
      listLab.string = '加载中…';
      try {
        const msg = await NetBus.ins.listClubs();
        if (msg.cmd === 'error') {
          listLab.string = msg.body?.message || '加载失败';
          return;
        }
        const clubs = (msg.body?.clubs || []) as any[];
        if (!clubs.length) {
          listLab.string = '你还没有加入老友圈。\n可创建新圈，或输入圈号加入。';
          return;
        }
        listLab.string = clubs.map((c) =>
          `· ${c.clubName || c.name || '未命名'}（#${c.clubId || c.id}）`
        ).join('\n');
      } catch {
        listLab.string = '查询超时';
      }
    };
    void refresh();

    ClubDialog.mkBtn(panel, 'create', -200, -220, '创建', async () => {
      AudioBus.playButton();
      const name = (neb.string || '').trim() || '我的老友圈';
      const msg = await NetBus.ins.createClub(name);
      if (msg.cmd === 'error') onToast(msg.body?.message || '创建失败');
      else {
        onToast(`已创建 #${msg.body?.clubId}`);
        void refresh();
      }
    });
    ClubDialog.mkBtn(panel, 'join', 0, -220, '加入', async () => {
      AudioBus.playButton();
      const id = parseInt(ieb.string || '0', 10);
      if (!id) {
        onToast('请输入圈号');
        return;
      }
      const msg = await NetBus.ins.joinClub(id);
      if (msg.cmd === 'error') onToast(msg.body?.message || '加入失败');
      else {
        onToast(`已加入 #${id}`);
        void refresh();
      }
    });
    ClubDialog.mkBtn(panel, 'close', 200, -220, '关闭', () => {
      AudioBus.playButton();
      ClubDialog.hide(parent);
    }, false);

    return root;
  }

  static hide(parent: Node | null | undefined) {
    const n = parent?.getChildByName('__ClubDialog');
    if (n?.isValid) n.destroy();
  }

  private static mkLabel(
    parent: Node, name: string, x: number, y: number, w: number, h: number, size: number, text: string,
  ): Label {
    const n = new Node(name);
    parent.addChild(n);
    n.layer = parent.layer;
    n.setPosition(x, y, 0);
    n.addComponent(UITransform).setContentSize(w, h);
    const lab = n.addComponent(Label);
    styleLabel(lab, size);
    lab.string = text;
    return lab;
  }

  private static mkBtn(
    parent: Node, name: string, x: number, y: number, text: string,
    onClick: () => void, primary = true,
  ) {
    const n = new Node(name);
    parent.addChild(n);
    n.layer = parent.layer;
    n.setPosition(x, y, 0);
    n.addComponent(UITransform).setContentSize(140, 48);
    const g = n.addComponent(Graphics);
    g.fillColor = primary ? new Color(196, 72, 48, 255) : new Color(50, 60, 70, 255);
    g.roundRect(-70, -24, 140, 48, 10);
    g.fill();
    const labN = new Node('t');
    n.addChild(labN);
    labN.addComponent(UITransform).setContentSize(120, 36);
    const lab = labN.addComponent(Label);
    styleLabel(lab, 20);
    lab.string = text;
    n.addComponent(Button).node.on(Button.EventType.CLICK, onClick);
  }
}
