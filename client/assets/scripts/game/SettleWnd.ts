/**
 * 商业风结算窗：优先挂 RoundSettlementWnd 预制体；失败则用 weihai/ui/settle 美术壳。
 * 数据来自 ResultSettleInfo（赢家牌面 / 番型 / 中鸟 / 四人得分）。
 */
import {
  Node, Prefab, resources, instantiate, Label, Button, UITransform, Sprite, UIOpacity,
  Color, Layers, Vec3, tween, Graphics, Mask, ScrollView,
} from 'cc';
import { createTileNode, loadSpriteFrame, styleLabel } from '../comm/ArtBg';
import { AudioBus } from '../comm/AudioBus';
import { popIn, rollNumber } from './TableFx';
import type { ResultSettleInfo } from './TableLayout';

export type SettleShowOpts = {
  title: string;
  sub: string;
  roomId?: string | number;
  primaryLabel: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  settle?: ResultSettleInfo | null;
  mySeat?: number;
  /** 战绩回看：跳过牌桌结算预制体，用干净美术壳 +「关闭」 */
  historyMode?: boolean;
};

function findDeep(root: Node, name: string): Node | null {
  if (root.name === name) return root;
  for (const c of root.children) {
    const hit = findDeep(c, name);
    if (hit) return hit;
  }
  return null;
}

function setLab(root: Node | null, name: string, text: string, size?: number) {
  if (!root) return;
  const n = findDeep(root, name);
  const lab = n?.getComponent(Label) || n?.getComponentInChildren(Label);
  if (!lab) return;
  lab.string = text;
  if (size) styleLabel(lab, size);
}

export class SettleWnd {
  static async show(parent: Node, opts: SettleShowOpts): Promise<Node> {
    SettleWnd.hide(parent);
    const ov = new Node('__ResultOverlay');
    parent.addChild(ov);
    ov.setSiblingIndex(parent.children.length - 1);
    ov.layer = parent.layer || Layers.Enum.UI_2D;
    ov.addComponent(UITransform).setContentSize(1280, 720);
    ov.setPosition(0, 0, 0);
    const dim = ov.addComponent(UIOpacity);
    dim.opacity = 0;
    tween(dim).to(0.25, { opacity: 255 }).start();

    const g = ov.addComponent(Graphics);
    g.fillColor = new Color(0, 0, 0, opts.historyMode ? 220 : 200);
    g.rect(-640, -360, 1280, 720);
    g.fill();

    const prefab = opts.historyMode ? null : await SettleWnd.loadPrefab();
    if (prefab) {
      try {
        await SettleWnd.bindPrefab(ov, prefab, opts);
        return ov;
      } catch (e) {
        console.warn('[SettleWnd] prefab bind failed, fallback art shell', e);
        for (const c of [...ov.children]) c.destroy();
      }
    }
    await SettleWnd.buildArtShell(ov, opts);
    return ov;
  }

  static hide(parent: Node | null | undefined) {
    if (!parent?.isValid) return;
    const ov = parent.getChildByName('__ResultOverlay');
    if (ov?.isValid) ov.destroy();
  }

  private static loadPrefab(): Promise<Prefab | null> {
    return new Promise((resolve) => {
      resources.load('weihai/table_res/1/prefab/RoundSettlementWnd', Prefab, (err, prefab) => {
        if (err || !prefab) {
          console.warn('[SettleWnd] RoundSettlementWnd missing', err);
          resolve(null);
          return;
        }
        resolve(prefab);
      });
    });
  }

  private static async bindPrefab(ov: Node, prefab: Prefab, opts: SettleShowOpts) {
    const wnd = instantiate(prefab);
    ov.addChild(wnd);
    wnd.layer = ov.layer;
    wnd.setPosition(0, 0, 0);
    wnd.setScale(0.67, 0.67, 1);

    const settle = opts.settle;
    const reason = settle?.reason || '';
    const isDraw = reason === 'huangzhuang';
    const iWin = !!settle?.rows?.some((r) => r.isMe && r.isWinner)
      || (settle?.rows?.find((r) => r.isMe)?.score ?? 0) > 0;

    const winN = findDeep(wnd, 'Win');
    const loseN = findDeep(wnd, 'Lose');
    const drawN = findDeep(wnd, 'DrawGame');
    if (winN) winN.active = !isDraw && iWin;
    if (loseN) loseN.active = !isDraw && !iWin;
    if (drawN) drawN.active = isDraw;

    setLab(wnd, 'CurrRoomId', opts.roomId != null ? `房${opts.roomId}` : '');
    setLab(wnd, 'PlayMethodDesc', '长沙麻将');

    const rows = [...(settle?.rows || [])].sort((a, b) => a.seat - b.seat);
    for (let i = 0; i < 4; i++) {
      const item = findDeep(wnd, `Item_${i}_`);
      if (!item) continue;
      const row = rows[i];
      if (!row) {
        item.active = false;
        continue;
      }
      item.active = true;
      setLab(item, 'UserName', `${row.isWinner ? '★' : ''}${row.name}${row.isMe ? '(我)' : ''}`);
      setLab(item, 'UserId', `座位${row.seat}`);
      const scoreLab = findDeep(item, 'Score')?.getComponent(Label)
        || findDeep(item, 'Score')?.getComponentInChildren(Label);
      if (scoreLab) {
        scoreLab.color = row.score >= 0 ? new Color(80, 200, 120, 255) : new Color(255, 120, 100, 255);
        rollNumber(scoreLab, 0, row.score, row.score >= 0 ? '+' : '', 0.45 + i * 0.05);
      }
      const pattern = row.isWinner
        ? (settle?.fanItems || []).map((f) => `${f.name}×${f.fan}`).join(' ')
          || (settle?.fan != null ? `${settle.fan}番` : '')
        : '';
      setLab(item, 'HuPattern', pattern);

      const hu = findDeep(item, 'Hu');
      const dp = findDeep(item, 'DianPao');
      const zm = findDeep(item, 'ZiMo');
      if (hu) hu.active = !!row.isWinner && reason !== 'zimo' && reason !== 'dianpao';
      if (zm) zm.active = !!row.isWinner && reason === 'zimo';
      if (dp) {
        const isPao = !row.isWinner && settle?.paoName && row.name === settle.paoName;
        dp.active = !!isPao || (!!row.isWinner && reason === 'dianpao' && false);
        // 点炮方显示 DianPao 图标
        if (!row.isWinner && settle?.paoName && (row.name === settle.paoName || row.name.includes(settle.paoName))) {
          dp.active = true;
        }
      }

      const list = findDeep(item, 'MahjongListArea');
      if (list && row.isWinner) {
        list.removeAllChildren();
        await SettleWnd.fillTiles(list, settle!, 28, 40);
      } else if (list) {
        list.removeAllChildren();
      }
    }

    // 中鸟：挂到面板下方附加条
    if (settle?.birds?.length) {
      const birdHost = new Node('__Birds');
      wnd.addChild(birdHost);
      birdHost.layer = wnd.layer;
      birdHost.addComponent(UITransform);
      birdHost.setPosition(0, -420, 0);
      const bl = new Node('t');
      birdHost.addChild(bl);
      bl.layer = wnd.layer;
      bl.addComponent(UITransform).setContentSize(200, 28);
      bl.setPosition(0, 40, 0);
      const lab = bl.addComponent(Label);
      styleLabel(lab, 22);
      lab.string = '中鸟';
      lab.color = new Color(255, 230, 160, 255);
      await SettleWnd.fillBirdRow(birdHost, settle.birds, 0);
    }

    const cont = findDeep(wnd, 'Button_Continue_');
    if (cont) {
      let btn = cont.getComponent(Button);
      if (!btn) btn = cont.addComponent(Button);
      btn.node.off(Button.EventType.CLICK);
      btn.node.on(Button.EventType.CLICK, () => {
        AudioBus.playButton();
        opts.onPrimary?.();
      });
    }

    if (opts.secondaryLabel && opts.onSecondary) {
      const back = new Node('__BackHall');
      ov.addChild(back);
      back.layer = ov.layer;
      back.setPosition(220, -300, 0);
      back.addComponent(UITransform).setContentSize(160, 48);
      const lab = back.addComponent(Label);
      styleLabel(lab, 22);
      lab.string = opts.secondaryLabel;
      lab.color = new Color(220, 220, 220, 255);
      const b = back.addComponent(Button);
      b.node.on(Button.EventType.CLICK, () => {
        AudioBus.playButton();
        opts.onSecondary?.();
      });
    }

    wnd.setScale(0.55, 0.55, 1);
    tween(wnd).to(0.3, { scale: new Vec3(0.67, 0.67, 1) }, { easing: 'backOut' }).start();
  }

  /** 美术壳：对齐商业结算构图 */
  private static async buildArtShell(ov: Node, opts: SettleShowOpts) {
    const settle = opts.settle;
    const reason = settle?.reason || '';
    const isDraw = reason === 'huangzhuang';
    const me = settle?.rows?.find((r) => r.isMe);
    const iWin = !!me?.isWinner || (me?.score ?? 0) > 0;
    const history = !!opts.historyMode;

    const PANEL_W = 780;
    const PANEL_H = history ? 560 : 540;
    const panel = new Node('panel');
    ov.addChild(panel);
    panel.layer = ov.layer;
    panel.addComponent(UITransform).setContentSize(PANEL_W, PANEL_H);
    panel.setPosition(0, history ? 16 : 24, 0);

    const base = panel.addComponent(Graphics);
    base.fillColor = new Color(22, 30, 42, 255);
    base.roundRect(-PANEL_W / 2, -PANEL_H / 2, PANEL_W, PANEL_H, 16);
    base.fill();
    base.strokeColor = new Color(212, 168, 72, 220);
    base.lineWidth = 2;
    base.roundRect(-PANEL_W / 2, -PANEL_H / 2, PANEL_W, PANEL_H, 16);
    base.stroke();

    // 牌桌结算可套 glass；战绩回看不用（半透明框容易看成「空方框」）
    if (!history) {
      const glass = panel.addComponent(Sprite);
      glass.sizeMode = Sprite.SizeMode.CUSTOM;
      const glassSf = await loadSpriteFrame('weihai/ui/settle/glass_bg');
      if (glassSf) {
        glass.spriteFrame = glassSf;
        panel.getComponent(UITransform)!.setContentSize(PANEL_W, PANEL_H);
      }
    }

    // 标题贴面板顶边（红绸带顶对齐）
    const titleImg = new Node('titleImg');
    panel.addChild(titleImg);
    titleImg.layer = ov.layer;
    titleImg.addComponent(UITransform).setContentSize(280, 72);
    const tsp = titleImg.addComponent(Sprite);
    tsp.sizeMode = Sprite.SizeMode.CUSTOM;
    const titlePath = isDraw
      ? 'weihai/ui/settle/draw'
      : (iWin ? 'weihai/ui/settle/win' : 'weihai/ui/settle/lose');
    const tsf = await loadSpriteFrame(titlePath);
    let titleH = 72;
    if (tsf) {
      tsp.spriteFrame = tsf;
      const tw = tsf.originalSize?.width || 320;
      const th = tsf.originalSize?.height || 100;
      const s = Math.min(280 / tw, 78 / th);
      titleH = th * s;
      titleImg.getComponent(UITransform)!.setContentSize(tw * s, titleH);
    } else {
      const labN = new Node('t');
      titleImg.addChild(labN);
      labN.layer = ov.layer;
      labN.addComponent(UITransform).setContentSize(200, 48);
      const lab = labN.addComponent(Label);
      styleLabel(lab, 40);
      lab.string = opts.title;
      lab.color = new Color(255, 230, 140, 255);
      titleH = 48;
    }
    titleImg.setPosition(0, PANEL_H / 2 - titleH / 2 - 2, 0);
    popIn(titleImg);

    // 滚动区：标题下沿 → 关闭钮上沿，留足间距避免裁切
    const btnY = -PANEL_H / 2 + 44;
    const titleBottom = PANEL_H / 2 - titleH - 4;
    const scrollTop = titleBottom - 8;
    const scrollBottom = btnY + 36;
    const viewH = Math.max(280, scrollTop - scrollBottom);
    const scrollY = (scrollTop + scrollBottom) / 2;

    const scrollHost = new Node('scrollHost');
    panel.addChild(scrollHost);
    scrollHost.layer = ov.layer;
    scrollHost.setPosition(0, scrollY, 0);
    scrollHost.addComponent(UITransform).setContentSize(740, viewH);
    // 透明热区，保证空白处也能拖拽滚动
    const hitG = scrollHost.addComponent(Graphics);
    hitG.fillColor = new Color(0, 0, 0, 1);
    hitG.rect(-370, -viewH / 2, 740, viewH);
    hitG.fill();

    const viewN = new Node('view');
    scrollHost.addChild(viewN);
    viewN.layer = ov.layer;
    const viewUi = viewN.addComponent(UITransform);
    viewUi.setContentSize(740, viewH);
    const mask = viewN.addComponent(Mask);
    mask.type = Mask.Type.GRAPHICS_RECT;

    const content = new Node('content');
    viewN.addChild(content);
    content.layer = ov.layer;
    const contentUi = content.addComponent(UITransform);
    // 顶锚点：子节点 y 从 0 往下排，默认顶对齐
    contentUi.setAnchorPoint(0.5, 1);
    contentUi.setContentSize(740, viewH);
    content.setPosition(0, viewH / 2, 0);

    let y = -6; // 相对 content 顶边向下

    const wName = settle?.winnerName
      || settle?.rows?.find((r) => r.isWinner)?.name
      || '';
    const how = isDraw
      ? '本局荒庄'
      : `★ ${wName || '赢家'}　${SettleWnd.reasonText(settle)}${settle?.paoName ? `（点炮：${settle.paoName}）` : ''}`;
    const roomBit = opts.roomId != null ? `房${opts.roomId}　` : '';
    y = SettleWnd.addTextLineTop(content, ov.layer, y, `${roomBit}${how}`, 20, new Color(255, 220, 150, 255), 700);
    y -= 6;

    const fans = (settle?.fanItems || []).filter((f) => f && String(f.name || '').trim());
    if (fans.length) {
      const host = new Node('fans');
      content.addChild(host);
      host.layer = ov.layer;
      host.setPosition(0, y - 14, 0);
      host.addComponent(UITransform);
      const cw = 120;
      const total = Math.min(fans.length, 5) * cw;
      fans.slice(0, 5).forEach((f, i) => {
        const chip = new Node(`f${i}`);
        host.addChild(chip);
        chip.layer = ov.layer;
        chip.setPosition(-total / 2 + cw / 2 + i * cw, 0, 0);
        chip.addComponent(UITransform).setContentSize(110, 28);
        const cg = chip.addComponent(Graphics);
        cg.fillColor = new Color(50, 40, 20, 230);
        cg.roundRect(-55, -12, 110, 24, 8);
        cg.fill();
        cg.strokeColor = new Color(220, 180, 80, 220);
        cg.lineWidth = 1.5;
        cg.roundRect(-55, -12, 110, 24, 8);
        cg.stroke();
        const labN = new Node('t');
        chip.addChild(labN);
        labN.layer = ov.layer;
        labN.addComponent(UITransform).setContentSize(100, 24);
        const cl = labN.addComponent(Label);
        styleLabel(cl, 16);
        cl.string = `${f.name}×${f.fan}`;
        cl.color = new Color(255, 230, 170, 255);
      });
      y -= 36;
    }

    if (settle?.winHand?.length) {
      y = SettleWnd.addTextLineTop(content, ov.layer, y, '胡牌', 18, new Color(200, 210, 200, 255), 100);
      y -= 4;
      const handHost = new Node('winHand');
      content.addChild(handHost);
      handHost.layer = ov.layer;
      handHost.setPosition(0, y - 24, 0);
      handHost.addComponent(UITransform);
      await SettleWnd.fillTiles(handHost, settle, 30, 44);
      y -= 56;
    }

    if (settle?.birds?.length) {
      y = SettleWnd.addTextLineTop(content, ov.layer, y, '中鸟', 18, new Color(200, 210, 200, 255), 100);
      y -= 4;
      const birdHost = new Node('birds');
      content.addChild(birdHost);
      birdHost.layer = ov.layer;
      birdHost.setPosition(0, y - 22, 0);
      birdHost.addComponent(UITransform);
      await SettleWnd.fillBirdRow(birdHost, settle.birds, 0);
      y -= 52;
    }

    y = SettleWnd.addTextLineTop(content, ov.layer, y, '本局得分', 18, new Color(200, 210, 200, 255), 120);
    y -= 4;

    const rows = [...(settle?.rows || [])].sort((a, b) => {
      if (a.isWinner && !b.isWinner) return -1;
      if (!a.isWinner && b.isWinner) return 1;
      return a.seat - b.seat;
    });
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const row = new Node(`row${i}`);
      content.addChild(row);
      row.layer = ov.layer;
      row.setPosition(0, y - 18, 0);
      row.addComponent(UITransform).setContentSize(700, 36);
      const rg = row.addComponent(Graphics);
      rg.fillColor = r.isWinner ? new Color(90, 60, 28, 235) : new Color(35, 42, 50, 230);
      rg.roundRect(-350, -16, 700, 32, 8);
      rg.fill();
      if (r.isWinner) {
        rg.strokeColor = new Color(230, 180, 90, 200);
        rg.lineWidth = 1.5;
        rg.roundRect(-350, -16, 700, 32, 8);
        rg.stroke();
      }

      if (r.isWinner) {
        const tag = new Node('tag');
        row.addChild(tag);
        tag.layer = ov.layer;
        tag.setPosition(-300, 0, 0);
        tag.addComponent(UITransform).setContentSize(56, 28);
        const tg = tag.addComponent(Graphics);
        tg.fillColor = new Color(196, 72, 48, 255);
        tg.roundRect(-28, -12, 56, 24, 8);
        tg.fill();
        const labN = new Node('t');
        tag.addChild(labN);
        labN.layer = ov.layer;
        labN.addComponent(UITransform).setContentSize(52, 24);
        const tl = labN.addComponent(Label);
        styleLabel(tl, 14);
        tl.string = reason === 'zimo' ? '自摸' : (reason === 'dianpao' ? '胡牌' : '胡');
        tl.color = new Color(255, 245, 220, 255);
      }

      const name = new Node('n');
      row.addChild(name);
      name.layer = ov.layer;
      name.setPosition(-100, 0, 0);
      name.addComponent(UITransform).setContentSize(360, 28);
      const nl = name.addComponent(Label);
      styleLabel(nl, 18);
      const dispName = r.name && !/^座位\d+$/.test(r.name) ? r.name : (r.isWinner ? (wName || r.name) : r.name);
      nl.string = `${r.isWinner ? '★ ' : ''}${dispName}${r.isMe ? '（我）' : ''}`;
      nl.color = r.isWinner ? new Color(255, 230, 150, 255) : new Color(230, 230, 230, 255);
      nl.horizontalAlign = Label.HorizontalAlign.LEFT;

      const sc = new Node('s');
      row.addChild(sc);
      sc.layer = ov.layer;
      sc.setPosition(260, 0, 0);
      sc.addComponent(UITransform).setContentSize(140, 28);
      const scl = sc.addComponent(Label);
      styleLabel(scl, 22);
      scl.color = r.score >= 0 ? new Color(120, 230, 160, 255) : new Color(255, 130, 110, 255);
      rollNumber(scl, 0, r.score, r.score >= 0 ? '+' : '', 0.35 + i * 0.04);

      popIn(row, 0.1 + i * 0.03);
      y -= 40;
    }

    const contentH = Math.max(viewH + 1, -y + 24);
    contentUi.setContentSize(740, contentH);
    content.setPosition(0, viewH / 2, 0);

    const sv = scrollHost.addComponent(ScrollView);
    sv.horizontal = false;
    sv.vertical = true;
    sv.inertia = true;
    sv.brake = 0.75;
    sv.elastic = true;
    sv.bounceDuration = 0.23;
    sv.cancelInnerEvents = false;
    sv.content = content;
    // view 由 content.parent 推导；下一帧再顶对齐，避开 size 变更后的边界校正
    scrollHost.getComponent(ScrollView)?.scheduleOnce(() => {
      if (!sv.isValid) return;
      sv.stopAutoScroll();
      sv.scrollToTop(0);
    }, 0);

    // 关闭 / 继续
    if (history) {
      const close = SettleWnd.mkTextBtn(panel, 'close', 0, btnY, opts.primaryLabel || '关闭', 160, 48);
      close.on(Button.EventType.CLICK, () => {
        AudioBus.playButton();
        opts.onPrimary?.();
      });
    } else {
      const cont = await SettleWnd.mkImgBtn(panel, 'cont', opts.secondaryLabel ? -120 : 0, btnY,
        'weihai/ui/settle/btn_continue', opts.primaryLabel, 200);
      cont.on(Button.EventType.CLICK, () => {
        AudioBus.playButton();
        opts.onPrimary?.();
      });
      if (opts.secondaryLabel && opts.onSecondary) {
        const back = SettleWnd.mkTextBtn(panel, 'back', 120, btnY, opts.secondaryLabel, 150, 48);
        back.on(Button.EventType.CLICK, () => {
          AudioBus.playButton();
          opts.onSecondary?.();
        });
      }
    }

    panel.setScale(0.9, 0.9, 1);
    tween(panel).to(0.28, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' }).start();
  }

  /** 顶锚点布局：y 为距顶边的负方向光标，返回新的光标 */
  private static addTextLineTop(
    parent: Node,
    layer: number,
    yTop: number,
    text: string,
    size: number,
    color: Color,
    width: number,
  ): number {
    const n = new Node('line');
    parent.addChild(n);
    n.layer = layer;
    n.setPosition(0, yTop - size / 2 - 2, 0);
    n.addComponent(UITransform).setContentSize(width, size + 6);
    const lab = n.addComponent(Label);
    styleLabel(lab, size);
    lab.string = text;
    lab.color = color;
    return yTop - size - 10;
  }

  private static mkTextBtn(
    parent: Node,
    name: string,
    x: number,
    y: number,
    text: string,
    w: number,
    h: number,
  ): Node {
    const n = new Node(name);
    parent.addChild(n);
    n.layer = parent.layer;
    n.setPosition(x, y, 0);
    n.addComponent(UITransform).setContentSize(w, h);
    const g = n.addComponent(Graphics);
    g.fillColor = new Color(196, 72, 48, 255);
    g.roundRect(-w / 2, -h / 2, w, h, 12);
    g.fill();
    const labN = new Node('t');
    n.addChild(labN);
    labN.layer = parent.layer;
    labN.addComponent(UITransform).setContentSize(w - 8, h - 8);
    const lab = labN.addComponent(Label);
    styleLabel(lab, 22);
    lab.string = text;
    lab.color = new Color(255, 245, 220, 255);
    const btn = n.addComponent(Button);
    btn.transition = Button.Transition.SCALE;
    btn.zoomScale = 0.94;
    return n;
  }

  private static reasonText(settle?: ResultSettleInfo | null): string {
    if (!settle) return '';
    const map: Record<string, string> = {
      zimo: '自摸',
      dianpao: '点炮胡',
      hu: '胡牌',
      qiang_gang: '抢杠胡',
      duo_xiang: '一炮多响',
      huangzhuang: '荒庄',
    };
    const base = map[settle.reason] || '';
    return settle.fan != null && settle.fan > 0 ? `${base} · ${settle.fan} 番` : base;
  }

  private static async fillTiles(host: Node, settle: ResultSettleInfo, tw: number, th: number) {
    const melds = settle.winMelds || [];
    const hand = [...(settle.winHand || [])];
    const huTile = settle.huTile != null ? Number(settle.huTile) : null;
    let show = hand;
    let trailing: number | null = null;
    if (huTile != null) {
      const idx = show.lastIndexOf(huTile);
      if (idx >= 0) {
        show = show.slice();
        show.splice(idx, 1);
        trailing = huTile;
      } else trailing = huTile;
    }
    type Slot = { tile: number; hu?: boolean; gap?: boolean };
    const slots: Slot[] = [];
    for (const m of melds) {
      const tiles = m.tiles || [];
      const cnt = /gang/.test(m.kind) ? 4 : Math.max(3, tiles.length);
      for (let k = 0; k < cnt; k++) slots.push({ tile: tiles[Math.min(k, tiles.length - 1)] ?? 0 });
      slots.push({ tile: -1, gap: true });
    }
    if (slots.length && slots[slots.length - 1].gap) slots.pop();
    for (const t of show) slots.push({ tile: t });
    if (trailing != null) {
      slots.push({ tile: -1, gap: true });
      slots.push({ tile: trailing, hu: true });
    }
    let total = 0;
    for (const s of slots) total += s.gap ? 8 : tw + 2;
    let x = -total / 2 + tw / 2;
    let i = 0;
    for (const s of slots) {
      if (s.gap) {
        x += 8;
        continue;
      }
      const n = await createTileNode(s.tile, host, tw, th);
      if (!n?.isValid) continue;
      n.setPosition(x, 0, 0);
      if (s.hu) {
        // 红框
        const mark = new Node('__HL');
        n.addChild(mark);
        mark.layer = n.layer;
        mark.addComponent(UITransform).setContentSize(tw + 6, th + 6);
        const mg = mark.addComponent(Graphics);
        mg.lineWidth = 3;
        mg.strokeColor = new Color(255, 70, 60, 255);
        mg.roundRect(-(tw + 4) / 2, -(th + 4) / 2, tw + 4, th + 4, 4);
        mg.stroke();
      }
      n.setScale(0.4, 0.4, 1);
      tween(n).delay(0.05 + i * 0.02).to(0.18, { scale: new Vec3(s.hu ? 1.12 : 1, s.hu ? 1.12 : 1, 1) }, { easing: 'backOut' }).start();
      x += tw + 2;
      i += 1;
    }
  }

  private static async fillBirdRow(host: Node, birds: number[], y: number) {
    const tw = 36;
    const gap = 6;
    const total = birds.length * (tw + gap) - gap;
    for (let i = 0; i < birds.length; i++) {
      const n = await createTileNode(birds[i], host, tw, 50);
      if (!n?.isValid) continue;
      n.setPosition(-total / 2 + tw / 2 + i * (tw + gap), y, 0);
      n.setScale(0.4, 0.4, 1);
      popIn(n, 0.15 + i * 0.05);
    }
  }

  private static async mkImgBtn(
    parent: Node,
    name: string,
    x: number,
    y: number,
    imgPath: string,
    fallback: string,
    maxW: number,
  ): Promise<Node> {
    const n = new Node(name);
    parent.addChild(n);
    n.layer = parent.layer;
    n.setPosition(x, y, 0);
    n.addComponent(UITransform).setContentSize(maxW, 56);
    const sp = n.addComponent(Sprite);
    sp.sizeMode = Sprite.SizeMode.CUSTOM;
    const sf = await loadSpriteFrame(imgPath);
    if (sf) {
      sp.spriteFrame = sf;
      const tw = sf.originalSize?.width || maxW;
      const th = sf.originalSize?.height || 56;
      const s = Math.min(maxW / tw, 56 / th);
      n.getComponent(UITransform)!.setContentSize(tw * s, th * s);
    } else {
      const lab = n.addComponent(Label);
      styleLabel(lab, 22);
      lab.string = fallback;
    }
    const btn = n.addComponent(Button);
    btn.transition = Button.Transition.SCALE;
    btn.zoomScale = 0.94;
    return n;
  }
}
