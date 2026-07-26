/**
 * 战绩：结算风列表（可滚动）+ 点击打开 SettleWnd 详情。
 */
import {
  Node, Label, Button, UITransform, Sprite, Layers, Color, Graphics, Mask, ScrollView,
} from 'cc';
import { loadSpriteFrame, styleLabel } from '../comm/ArtBg';
import { AudioBus } from '../comm/AudioBus';
import { NetBus } from '../comm/NetBus';
import { SettleWnd } from '../game/SettleWnd';
import type { ResultSettleInfo } from '../game/TableLayout';

type RecordItem = {
  id: number;
  roomId: number;
  reason?: string;
  scoreDelta?: number;
  winnerName?: string;
  fan?: number;
  createdAt?: number;
  hasDetail?: boolean;
};

const PANEL_W = 720;
const PANEL_H = 480;
const PAGE_SIZE = 30;
const CARD_H = 56;
const CARD_GAP = 8;
const VIEW_W = 660;
const VIEW_H = 340;

function reasonText(reason?: string): string {
  const r = (reason || '').toLowerCase();
  if (r.includes('zimo') || r.includes('自摸')) return '自摸';
  if (r.includes('dianpao') || r.includes('点炮')) return '点炮';
  if (r.includes('qiang')) return '抢杠胡';
  if (r.includes('huang') || r.includes('流局') || r.includes('荒庄')) return '荒庄';
  return reason || '结算';
}

/** 流局只看 reason；得分 0 但有人胡牌仍算失败（抓鸟持平等） */
function recordOutcome(rec: RecordItem): 'win' | 'lose' | 'draw' {
  const r = (rec.reason || '').toLowerCase();
  if (r.includes('huang') || r.includes('流局') || r.includes('荒庄')) return 'draw';
  const d = Number(rec.scoreDelta) || 0;
  if (d > 0) return 'win';
  return 'lose';
}

function formatTime(ts?: number): string {
  if (!ts) return '';
  const d = new Date(ts * 1000);
  const p = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return `${d.getMonth() + 1}/${d.getDate()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function snapToSettle(snap: any): ResultSettleInfo {
  const seats = Array.isArray(snap?.seats) ? snap.seats : [];
  const mySeat = snap?.mySeat;
  const winnerSeat = snap?.winnerSeat != null ? Number(snap.winnerSeat) : null;
  const rows = seats.map((s: any) => ({
    seat: Number(s.seat),
    name: String(s.userName || s.name || `座位${s.seat}`),
    score: Number(s.scoreDelta != null ? s.scoreDelta : s.score) || 0,
    isMe: mySeat != null && Number(s.seat) === Number(mySeat),
    isWinner: winnerSeat != null && Number(s.seat) === winnerSeat,
  })).sort((a: { seat: number }, b: { seat: number }) => a.seat - b.seat);

  if (!rows.length && Array.isArray(snap?.scores)) {
    for (let i = 0; i < 4; i++) {
      const v = snap.scores[i] ?? snap.scores[i + 1];
      rows.push({
        seat: i,
        name: winnerSeat === i ? (snap.winnerName || '赢家') : `座位${i}`,
        score: Number(v) || 0,
        isMe: mySeat != null && i === Number(mySeat),
        isWinner: winnerSeat === i,
      });
    }
  }

  let winnerName = snap?.winnerName;
  if (!winnerName) {
    const w = rows.find((r) => r.isWinner);
    if (w) winnerName = w.name;
  }

  let fanItems = Array.isArray(snap?.fanItems) ? snap.fanItems : [];
  fanItems = fanItems.map((f: any) => ({
    name: String(f.name || f.id || ''),
    fan: Number(f.fan) || 0,
  })).filter((f: { name: string }) => !!f.name);

  return {
    reason: String(snap?.reason || ''),
    detail: snap?.detail,
    fan: snap?.fan != null ? Number(snap.fan) : undefined,
    fanItems,
    birds: Array.isArray(snap?.birds) ? snap.birds.map((t: any) => Number(t)) : [],
    winnerName,
    paoName: snap?.paoName,
    winHand: Array.isArray(snap?.winHand) ? snap.winHand.map((t: any) => Number(t)) : undefined,
    winMelds: Array.isArray(snap?.winMelds)
      ? snap.winMelds.map((m: any) => ({
        kind: String(m.kind || 'peng'),
        tiles: Array.isArray(m.tiles) ? m.tiles.map((t: any) => Number(t)) : [],
      }))
      : undefined,
    huTile: snap?.huTile != null ? Number(snap.huTile) : null,
    roomId: snap?.roomId,
    rows,
  };
}

export class RecordsWnd {
  static async show(parent: Node): Promise<Node> {
    RecordsWnd.hide(parent);
    const layer = parent.layer || Layers.Enum.UI_2D;
    const root = new Node('__RecordsWnd');
    parent.addChild(root);
    root.layer = layer;
    root.addComponent(UITransform).setContentSize(1280, 720);
    root.setSiblingIndex(parent.children.length - 1);

    const dim = root.addComponent(Graphics);
    dim.fillColor = new Color(0, 0, 0, 180);
    dim.rect(-640, -360, 1280, 720);
    dim.fill();

    const panel = new Node('panel');
    root.addChild(panel);
    panel.layer = layer;
    panel.addComponent(UITransform).setContentSize(PANEL_W, PANEL_H);
    panel.setPosition(0, 36, 0);

    const pg = panel.addComponent(Graphics);
    pg.fillColor = new Color(22, 30, 42, 255);
    pg.roundRect(-PANEL_W / 2, -PANEL_H / 2, PANEL_W, PANEL_H, 18);
    pg.fill();
    pg.strokeColor = new Color(210, 170, 80, 200);
    pg.lineWidth = 2;
    pg.roundRect(-PANEL_W / 2, -PANEL_H / 2, PANEL_W, PANEL_H, 18);
    pg.stroke();

    const title = new Node('title');
    panel.addChild(title);
    title.layer = layer;
    title.setPosition(0, PANEL_H / 2 - 36, 0);
    title.addComponent(UITransform).setContentSize(280, 40);
    const tl = title.addComponent(Label);
    styleLabel(tl, 28);
    tl.string = '最近对局';
    tl.color = new Color(255, 236, 180, 255);

    // ScrollView：标题下 → 关闭钮上
    const scrollHost = new Node('scrollHost');
    panel.addChild(scrollHost);
    scrollHost.layer = layer;
    scrollHost.setPosition(0, 12, 0);
    scrollHost.addComponent(UITransform).setContentSize(VIEW_W, VIEW_H);
    const hitG = scrollHost.addComponent(Graphics);
    hitG.fillColor = new Color(0, 0, 0, 1);
    hitG.rect(-VIEW_W / 2, -VIEW_H / 2, VIEW_W, VIEW_H);
    hitG.fill();

    const viewN = new Node('view');
    scrollHost.addChild(viewN);
    viewN.layer = layer;
    viewN.addComponent(UITransform).setContentSize(VIEW_W, VIEW_H);
    const mask = viewN.addComponent(Mask);
    mask.type = Mask.Type.GRAPHICS_RECT;

    const content = new Node('content');
    viewN.addChild(content);
    content.layer = layer;
    const contentUi = content.addComponent(UITransform);
    contentUi.setAnchorPoint(0.5, 1);
    contentUi.setContentSize(VIEW_W, VIEW_H);
    content.setPosition(0, VIEW_H / 2, 0);

    const tip = new Node('tip');
    content.addChild(tip);
    tip.layer = layer;
    tip.setPosition(0, -VIEW_H / 2, 0);
    tip.addComponent(UITransform).setContentSize(600, 40);
    const tipLab = tip.addComponent(Label);
    styleLabel(tipLab, 20);
    tipLab.string = '加载中…';
    tipLab.color = new Color(230, 220, 190, 255);

    const sv = scrollHost.addComponent(ScrollView);
    sv.horizontal = false;
    sv.vertical = true;
    sv.inertia = true;
    sv.brake = 0.75;
    sv.elastic = true;
    sv.bounceDuration = 0.23;
    sv.cancelInnerEvents = false;
    sv.content = content;

    RecordsWnd.mkBtn(panel, layer, 0, -PANEL_H / 2 + 40, 150, 44, '关闭', () => {
      RecordsWnd.hide(parent);
    });

    void RecordsWnd.loadList(content, contentUi, tipLab, root, sv);

    return root;
  }

  static hide(parent: Node | null | undefined) {
    if (!parent?.isValid) return;
    SettleWnd.hide(parent);
    const n = parent.getChildByName('__RecordsWnd');
    if (n?.isValid) n.destroy();
  }

  private static mkBtn(
    parent: Node,
    layer: number,
    x: number,
    y: number,
    w: number,
    h: number,
    text: string,
    onClick: () => void,
  ): Node {
    const n = new Node(`btn_${text}`);
    parent.addChild(n);
    n.layer = layer;
    n.setPosition(x, y, 0);
    n.addComponent(UITransform).setContentSize(w, h);
    const g = n.addComponent(Graphics);
    g.fillColor = new Color(196, 72, 48, 255);
    g.roundRect(-w / 2, -h / 2, w, h, 12);
    g.fill();
    const labN = new Node('t');
    n.addChild(labN);
    labN.layer = layer;
    labN.addComponent(UITransform).setContentSize(w - 10, h - 8);
    const lab = labN.addComponent(Label);
    styleLabel(lab, 22);
    lab.string = text;
    n.addComponent(Button).node.on(Button.EventType.CLICK, () => {
      AudioBus.playButton();
      onClick();
    });
    return n;
  }

  private static async loadList(
    content: Node,
    contentUi: UITransform,
    tipLab: Label,
    root: Node,
    sv: ScrollView,
  ) {
    try {
      const msg = await NetBus.ins.getRecords(1, PAGE_SIZE);
      if (msg.cmd === 'error') {
        tipLab.string = msg.body?.message || '加载失败';
        return;
      }
      const list = (msg.body?.list || []) as RecordItem[];
      tipLab.node.active = false;
      if (!list.length) {
        tipLab.node.active = true;
        tipLab.string = '暂无对局记录\n打完一局结算后会出现在这里';
        tipLab.node.setPosition(0, -40, 0);
        return;
      }

      const rowH = CARD_H + CARD_GAP;
      const contentH = Math.max(VIEW_H + 1, list.length * rowH + 12);
      contentUi.setContentSize(VIEW_W, contentH);
      content.setPosition(0, VIEW_H / 2, 0);

      for (let i = 0; i < list.length; i++) {
        // 顶锚点：第一条贴近顶边
        const y = -CARD_H / 2 - 6 - i * rowH;
        await RecordsWnd.addCard(content, list[i], y, root);
      }

      sv.scheduleOnce(() => {
        if (!sv.isValid) return;
        sv.stopAutoScroll();
        sv.scrollToTop(0);
      }, 0);
    } catch (e) {
      console.warn('[RecordsWnd] load', e);
      tipLab.node.active = true;
      tipLab.string = '查询超时，请稍后重试';
    }
  }

  private static async addCard(host: Node, rec: RecordItem, y: number, root: Node) {
    const layer = host.layer;
    const outcome = recordOutcome(rec);
    const win = outcome === 'win';
    const lose = outcome === 'lose';

    const card = new Node(`rec_${rec.id}`);
    host.addChild(card);
    card.layer = layer;
    card.setPosition(0, y, 0);
    card.addComponent(UITransform).setContentSize(640, CARD_H);

    const bg = card.addComponent(Graphics);
    bg.fillColor = win
      ? new Color(40, 70, 50, 230)
      : lose
        ? new Color(70, 40, 40, 230)
        : new Color(40, 48, 60, 230);
    bg.roundRect(-320, -CARD_H / 2, 640, CARD_H, 10);
    bg.fill();
    bg.strokeColor = win
      ? new Color(120, 200, 140, 180)
      : lose
        ? new Color(220, 120, 100, 180)
        : new Color(180, 160, 100, 140);
    bg.lineWidth = 1.5;
    bg.roundRect(-320, -CARD_H / 2, 640, CARD_H, 10);
    bg.stroke();

    const badge = new Node('badge');
    card.addChild(badge);
    badge.layer = layer;
    badge.setPosition(-250, 0, 0);
    badge.addComponent(UITransform).setContentSize(100, 28);
    const bsp = badge.addComponent(Sprite);
    bsp.sizeMode = Sprite.SizeMode.CUSTOM;
    const badgePath = win
      ? 'weihai/ui/settle/win'
      : lose
        ? 'weihai/ui/settle/lose'
        : 'weihai/ui/settle/draw';
    void loadSpriteFrame(badgePath).then((sf) => {
      if (!sf || !badge.isValid) return;
      bsp.spriteFrame = sf;
      const tw = sf.originalSize?.width || 340;
      const th = sf.originalSize?.height || 70;
      const s = Math.min(100 / tw, 28 / th);
      badge.getComponent(UITransform)!.setContentSize(tw * s, th * s);
    });

    const mid = new Node('mid');
    card.addChild(mid);
    mid.layer = layer;
    mid.setPosition(40, 8, 0);
    mid.addComponent(UITransform).setContentSize(360, 24);
    const midLab = mid.addComponent(Label);
    styleLabel(midLab, 18);
    const who = rec.winnerName ? `${rec.winnerName} · ` : '';
    midLab.string = `房${rec.roomId}  ${who}${reasonText(rec.reason)}${rec.fan ? ` · ${rec.fan}番` : ''}`;
    midLab.color = new Color(255, 240, 210, 255);
    midLab.horizontalAlign = Label.HorizontalAlign.LEFT;

    const sub = new Node('sub');
    card.addChild(sub);
    sub.layer = layer;
    sub.setPosition(40, -14, 0);
    sub.addComponent(UITransform).setContentSize(360, 20);
    const subLab = sub.addComponent(Label);
    styleLabel(subLab, 14);
    subLab.string = `${formatTime(rec.createdAt)}  ·  点击查看结算详情`;
    subLab.color = new Color(200, 190, 160, 220);
    subLab.horizontalAlign = Label.HorizontalAlign.LEFT;

    const score = new Node('score');
    card.addChild(score);
    score.layer = layer;
    score.setPosition(255, 0, 0);
    score.addComponent(UITransform).setContentSize(100, 36);
    const scoreLab = score.addComponent(Label);
    styleLabel(scoreLab, 26);
    const d = rec.scoreDelta || 0;
    scoreLab.string = d > 0 ? `+${d}` : `${d}`;
    scoreLab.color = d > 0
      ? new Color(120, 230, 150, 255)
      : d < 0
        ? new Color(255, 140, 120, 255)
        : new Color(230, 220, 180, 255);

    card.addComponent(Button).node.on(Button.EventType.CLICK, () => {
      AudioBus.playButton();
      void RecordsWnd.openDetail(root, rec);
    });
  }

  private static async openDetail(root: Node, rec: RecordItem) {
    const parent = root.parent;
    if (!parent?.isValid) return;
    const panel = root.getChildByName('panel');
    try {
      const msg = await NetBus.ins.getRecord(rec.id);
      if (msg.cmd === 'error') {
        console.warn('[RecordsWnd] detail', msg.body?.message);
        return;
      }
      const snap = msg.body || {};
      const settle = snapToSettle(snap);
      const myRow = settle.rows?.find((r) => r.isMe);
      const myScore = myRow?.score ?? rec.scoreDelta ?? 0;
      const isDraw = recordOutcome({
        id: rec.id,
        roomId: rec.roomId,
        reason: settle.reason || rec.reason,
        scoreDelta: myScore,
        winnerName: settle.winnerName || rec.winnerName,
      }) === 'draw';
      const title = isDraw ? '流局' : (myScore > 0 ? '胜利' : '失败');
      if (panel?.isValid) panel.active = false;
      await SettleWnd.show(parent, {
        title,
        sub: settle.detail || '',
        roomId: settle.roomId ?? rec.roomId,
        primaryLabel: '关闭',
        onPrimary: () => {
          SettleWnd.hide(parent);
          if (panel?.isValid) panel.active = true;
        },
        settle,
        historyMode: true,
      });
    } catch (e) {
      console.warn('[RecordsWnd] openDetail', e);
      if (panel?.isValid) panel.active = true;
    }
  }
}
