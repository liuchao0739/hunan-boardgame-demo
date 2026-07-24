import { _decorator, Component, director } from 'cc';
import { MsgBus, MsgCode } from '../comm/MsgBus';
import { PbWire } from '../comm/PbWire';
import { createTileNode } from '../comm/ArtBg';
import { TableLayout, SeatPlayer } from './TableLayout';

const { ccclass } = _decorator;

function countTile(hand: number[], tile: number): number {
  let n = 0;
  for (const t of hand) if (t === tile) n++;
  return n;
}

/** 极简胡牌判断：对 + 全是刻/顺（万条饼） */
function canHu(hand: number[]): boolean {
  const c = new Map<number, number>();
  for (const t of hand) c.set(t, (c.get(t) || 0) + 1);
  const keys = [...c.keys()];
  for (const eye of keys) {
    if ((c.get(eye) || 0) < 2) continue;
    const cc = new Map(c);
    cc.set(eye, (cc.get(eye) || 0) - 2);
    if (meldOk(cc)) return true;
  }
  return false;
}

function meldOk(c: Map<number, number>): boolean {
  const keys = [...c.keys()].filter((k) => (c.get(k) || 0) > 0).sort((a, b) => a - b);
  if (!keys.length) return true;
  const t = keys[0];
  const n = c.get(t) || 0;
  if (n >= 3) {
    c.set(t, n - 3);
    if (meldOk(c)) return true;
    c.set(t, n);
  }
  // 顺子：同花色连续（万21-29 条41-49 饼81-89）
  const suit = t < 30 ? 20 : t < 50 ? 40 : t < 90 ? 80 : 0;
  if (suit && t % 10 <= 7) {
    const t2 = t + 1;
    const t3 = t + 2;
    if ((c.get(t) || 0) > 0 && (c.get(t2) || 0) > 0 && (c.get(t3) || 0) > 0) {
      c.set(t, (c.get(t) || 0) - 1);
      c.set(t2, (c.get(t2) || 0) - 1);
      c.set(t3, (c.get(t3) || 0) - 1);
      if (meldOk(c)) return true;
      c.set(t, (c.get(t) || 0) + 1);
      c.set(t2, (c.get(t2) || 0) + 1);
      c.set(t3, (c.get(t3) || 0) + 1);
    }
  }
  return false;
}

@ccclass('TableScene')
export class TableScene extends Component {
  private layout: TableLayout | null = null;
  private hand: number[] = [];
  private moPai = 0;
  private actUser = 0;
  private myId = 0;
  private roomId = 0;
  private remain = 0;
  private round = 1;
  private players: SeatPlayer[] = [];
  private selectedIdx = -1;
  private lastDiscard: { uid: number; tile: number } | null = null;
  private claimPeng = false;
  private claimHu = false;
  private handGen = 0;
  private unsubs: Array<() => void> = [];
  private pendingHuUid = 0;
  private leaving = false;

  onDestroy() {
    this.clearSubs();
    this.layout = null;
  }

  private clearSubs() {
    for (const u of this.unsubs) u();
    this.unsubs = [];
  }

  private listen(code: number, fn: (body: Uint8Array) => void) {
    this.unsubs.push(MsgBus.ins.on(code, (body) => {
      if (!this.isValid || !this.layout || this.leaving) return;
      fn(body);
    }));
  }

  private ui(): TableLayout | null {
    return this.isValid && !this.leaving ? this.layout : null;
  }

  onLoad() {
    // 清掉上一局/大厅残留监听，避免打到已销毁的 TableScene
    MsgBus.ins.offAll();

    const canvas = this.node.parent ?? this.node;
    for (const name of ['TipLabel', 'HandLabel', 'DiscardBtn', 'PengBtn', 'StatusLabel', 'HuBtn']) {
      const n = canvas.getChildByName(name) || this.node.getChildByName(name);
      if (n) n.active = false;
    }

    this.layout = new TableLayout(canvas);
    const u = (globalThis as any).__WHMJ__ || {};
    this.myId = u.userId || 0;
    if (Array.isArray(u.hand) && u.hand.length) {
      this.applyHand(u.hand, u.moPai || 0);
    }

    this.layout.btnPeng?.node.on('click', this.onClickPeng, this);
    this.layout.btnHu?.node.on('click', this.onClickHu, this);
    this.layout.btnGuo?.node.on('click', this.onClickGuo, this);
    this.layout.exitBtn?.node.on('click', this.backToHall, this);

    this.listen(MsgCode.SyncRoomDataResult, (body) => this.onSyncRoom(body));
    this.listen(MsgCode.MahjongInHandChangedResult, (body) => {
      const f = PbWire.decode(body);
      const tiles: number[] = [];
      for (const e of (f.get(2) || [])) tiles.push(PbWire.zigzagDecode(e.raw as number));
      const mo = PbWire.getSint32(f, 3, 0);
      this.applyHand(tiles, mo);
      this.refreshActions();
    });
    this.listen(MsgCode.RedirectActUserIdBroadcast, (body) => {
      const f = PbWire.decode(body);
      this.actUser = PbWire.getSint32(f, 1, 0);
      this.clearClaim();
      this.ui()?.updateSeats(this.players, this.myId, this.actUser);
      this.refreshTip();
      this.refreshActions();
    });
    this.listen(MsgCode.MahjongMoPaiBroadcast, (body) => {
      const f = PbWire.decode(body);
      const left = PbWire.getSint32(f, 1, -1);
      if (left >= 0) this.setRemain(left);
      else this.setRemain(this.remain - 1);
    });
    this.listen(MsgCode.MahjongMoPaiResult, () => {
      // 广播可能先到；若还没更新则本地减一
    });
    this.listen(MsgCode.MahjongChuPaiBroadcast, (body) => {
      const lay = this.ui();
      if (!lay) return;
      const f = PbWire.decode(body);
      const uid = PbWire.getSint32(f, 1, 0);
      const tile = PbWire.getSint32(f, 2, 0);
      this.lastDiscard = { uid, tile };
      const p = this.players.find((x) => x.userId === uid);
      if (p) {
        p.discard = p.discard || [];
        p.discard.push(tile);
        if (uid !== this.myId && (p.handCount || 0) > 0) p.handCount! -= 1;
        void lay.updateDiscards(this.players, this.myId);
        lay.updateSeats(this.players, this.myId, this.actUser);
      }
      if (uid === this.myId) {
        this.clearClaim();
        this.setTip('已出牌');
      } else {
        this.openClaimIfAble(tile);
      }
      this.refreshActions();
    });
    this.listen(MsgCode.MahjongPengBroadcast, (body) => {
      const lay = this.ui();
      if (!lay) return;
      const f = PbWire.decode(body);
      const uid = PbWire.getSint32(f, 1, 0);
      const tile = PbWire.getSint32(f, 2, 0);
      this.clearClaim();
      if (this.lastDiscard) {
        const from = this.players.find((x) => x.userId === this.lastDiscard!.uid);
        if (from?.discard?.length) from.discard.pop();
      }
      const p = this.players.find((x) => x.userId === uid);
      if (p) {
        p.peng = p.peng || [];
        p.peng.push(tile);
        if (uid !== this.myId) p.handCount = Math.max(0, (p.handCount || 0) - 2);
      }
      void lay.updateDiscards(this.players, this.myId);
      void lay.updateMelds(this.players, this.myId);
      this.setTip(uid === this.myId ? '碰！请出牌' : `玩家 ${uid} 碰了`);
      this.refreshActions();
    });
    this.listen(MsgCode.MahjongGuoResult, () => {
      this.clearClaim();
      this.setTip('已过');
      this.refreshActions();
    });
    this.listen(MsgCode.MahjongHuangZhuangBroadcast, () => {
      const lay = this.ui();
      if (!lay) return;
      this.clearClaim();
      lay.setActionButtons(false, false, false);
      this.setTip('荒庄（臭了）');
      lay.showResultOverlay('荒庄', '牌墙摸完了，本局流局（臭了）', () => this.backToHall());
    });
    this.listen(MsgCode.MahjongHuOrZiMoResult, (body) => {
      const f = PbWire.decode(body);
      const ok = Number(f.get(1)?.[0]?.raw) === 1;
      if (!ok) {
        this.setTip('胡牌未成功，请继续');
        return;
      }
      this.scheduleOnce(() => {
        const lay = this.ui();
        if (!lay) return;
        const ui = lay.root.getChildByName('__TableUI');
        if (ui && !ui.getChildByName('__ResultOverlay')) {
          lay.showResultOverlay('胡了！', '本局结束', () => this.backToHall());
        }
      }, 0.4);
    });
    this.listen(MsgCode.MahjongHuOrZiMoBroadcast, (body) => {
      const lay = this.ui();
      if (!lay) return;
      const f = PbWire.decode(body);
      const uid = PbWire.getSint32(f, 1, 0);
      this.clearClaim();
      lay.setActionButtons(false, false, false);
      this.pendingHuUid = uid;
      this.setTip(uid === this.myId ? '胡了！' : `玩家 ${uid} 胡了`);
    });
    this.listen(MsgCode.RoundSettlementBroadcast, (body) => {
      const lay = this.ui();
      if (!lay) return;
      const lines = this.parseSettlement(body);
      const uid = this.pendingHuUid || 0;
      const title = uid === this.myId ? '胡了！' : (uid ? `玩家 ${uid} 胡牌` : '本局结算');
      lay.showResultOverlay(title, lines || '本局结束', () => this.backToHall());
    });

    MsgBus.ins.sendEmpty(MsgCode.SyncRoomDataCmd);
    this.refreshTip();
  }

  private parseSettlement(body: Uint8Array): string {
    try {
      const f = PbWire.decode(body);
      const parts: string[] = [];
      for (const e of (f.get(1) || [])) {
        if (e.kind !== 'bytes') continue;
        const pf = PbWire.decode(e.raw as Uint8Array);
        const uid = PbWire.getSint32(pf, 1, 0);
        const curr = PbWire.getSint32(pf, 2, 0);
        const total = PbWire.getSint32(pf, 3, 0);
        const hu = Number(pf.get(8)?.[0]?.raw) === 1;
        const name = this.players.find((p) => p.userId === uid)?.userName || String(uid);
        parts.push(`${hu ? '★胡 ' : ''}${name} 本局${curr >= 0 ? '+' : ''}${curr} 总分${total}`);
      }
      return parts.length ? parts.join('\n') : '本局结束';
    } catch {
      return '本局结束';
    }
  }

  private backToHall() {
    if (this.leaving) return;
    this.leaving = true;
    this.clearSubs();
    this.layout = null;
    MsgBus.ins.sendEmpty(MsgCode.GetJoinedRoomIdCmd);
    console.log('[Table] back to hall');
    director.loadScene('Hall');
  }

  private applyHand(tiles: number[], mo: number) {
    this.moPai = mo > 0 ? mo : 0;
    let list = tiles.slice();
    if (this.moPai > 0) {
      const i = list.lastIndexOf(this.moPai);
      if (i >= 0) list.splice(i, 1);
    } else if (list.length % 3 === 2 && list.length > 0) {
      this.moPai = list[list.length - 1];
      list = list.slice(0, -1);
    }
    list.sort((a, b) => a - b);
    this.hand = list;
    const g = (globalThis as any).__WHMJ__ || ((globalThis as any).__WHMJ__ = {});
    g.hand = [...this.hand, ...(this.moPai ? [this.moPai] : [])];
    g.moPai = this.moPai;
    this.selectedIdx = -1;
    void this.refreshHand();
  }

  private openClaimIfAble(tile: number) {
    const handForPeng = this.moPai ? [...this.hand, this.moPai] : this.hand.slice();
    this.claimPeng = countTile(handForPeng, tile) >= 2;
    const full = [...handForPeng, tile];
    this.claimHu = canHu(full);
    if (!this.claimPeng && !this.claimHu) {
      this.clearClaim();
      this.setTip('等待出牌');
      return;
    }
    this.setTip(this.claimHu ? '可以胡 / 碰 / 过' : '可以碰 / 过');
  }

  private clearClaim() {
    this.claimPeng = false;
    this.claimHu = false;
  }

  private onSyncRoom(body: Uint8Array) {
    const lay = this.ui();
    if (!lay) return;
    const f = PbWire.decode(body);
    this.roomId = PbWire.getSint32(f, 1, 0);
    this.round = PbWire.getSint32(f, 7, 1) || 1;
    this.actUser = PbWire.getSint32(f, 8, 0);
    this.remain = PbWire.getSint32(f, 9, 0);
    this.players = [];
    let myHandFromSync: number[] = [];
    for (const e of (f.get(11) || [])) {
      if (e.kind !== 'bytes') continue;
      const pf = PbWire.decode(e.raw as Uint8Array);
      const discard: number[] = [];
      for (const d of (pf.get(16) || [])) discard.push(PbWire.zigzagDecode(d.raw as number));
      const handTiles: number[] = [];
      for (const h of (pf.get(14) || [])) handTiles.push(PbWire.zigzagDecode(h.raw as number));
      const peng: number[] = [];
      const uid = PbWire.getSint32(pf, 1, 0);
      if (uid === this.myId) myHandFromSync = handTiles.filter((t) => t > 0);
      this.players.push({
        userId: uid,
        userName: PbWire.getString(pf, 2, ''),
        seatIndex: PbWire.getSint32(pf, 8, 0),
        totalScore: PbWire.getSint32(pf, 7, 0),
        piaoX: PbWire.getSint32(pf, 9, 0),
        zhuang: Number(pf.get(11)?.[0]?.raw) === 1,
        owner: Number(pf.get(10)?.[0]?.raw) === 1,
        handCount: handTiles.length,
        discard,
        peng,
      });
    }
    if (myHandFromSync.length) this.applyHand(myHandFromSync, 0);
    if (lay.roomLabel) lay.roomLabel.string = `房${this.roomId}`;
    if (lay.remainLabel) lay.remainLabel.string = `剩 ${this.remain}`;
    if (lay.roundLabel) lay.roundLabel.string = `第 ${this.round} 局`;
    lay.updateSeats(this.players, this.myId, this.actUser);
    void lay.updateDiscards(this.players, this.myId);
    void lay.updateMelds(this.players, this.myId);
    this.refreshTip();
    this.refreshActions();
  }

  private setRemain(n: number) {
    this.remain = Math.max(0, n | 0);
    const lay = this.ui();
    if (lay?.remainLabel) lay.remainLabel.string = `剩 ${this.remain}`;
  }

  private refreshActions() {
    const lay = this.ui();
    if (!lay) return;
    const claiming = this.claimPeng || this.claimHu;
    lay.setChuVisible(false);
    lay.setActionButtons(claiming, this.claimPeng, this.claimHu);
  }

  private refreshTip() {
    if (this.claimPeng || this.claimHu) return;
    if (this.actUser === this.myId) {
      this.setTip('轮到你：点牌选中后再点一次出牌；或按住上拖');
    } else if (this.actUser) {
      this.setTip(`等待玩家 ${this.actUser} 出牌`);
    } else {
      this.setTip(`牌桌就绪`);
    }
  }

  private setTip(s: string) {
    const lay = this.ui();
    if (lay?.tipLabel) lay.tipLabel.string = s;
    console.log('[Table]', s);
  }

  private async refreshHand() {
    const lay = this.ui();
    if (!lay?.handRoot) return;
    const gen = ++this.handGen;
    const root = lay.handRoot;
    root.removeAllChildren();
    const tw = 56;
    const gap = 0;
    const moGap = 18;
    const closed = this.hand;
    const hasMo = this.moPai > 0;
    const closedW = closed.length * tw + Math.max(0, closed.length - 1) * gap;
    const totalW = closedW + (hasMo ? moGap + tw : 0);
    let x = -totalW / 2 + tw / 2;

    const place = async (tile: number, idx: number, isMo: boolean) => {
      if (gen !== this.handGen || !this.ui()) return;
      const n = await createTileNode(tile, root, tw, 78, {
        onSelect: () => this.onSelectTile(idx, isMo),
        onDiscard: () => this.discardAt(idx),
      });
      if (gen !== this.handGen || !n.isValid || !this.ui()) return;
      const y = this.selectedIdx === idx ? 20 : 0;
      n.setPosition(Math.round(x), y, 0);
      x += tw + gap;
    };

    for (let i = 0; i < closed.length; i++) {
      await place(closed[i], i, false);
    }
    if (hasMo) {
      x += moGap;
      await place(this.moPai, closed.length, true);
    }
  }

  private onSelectTile(idx: number, _isMo: boolean) {
    if (this.actUser !== this.myId) {
      this.setTip('还没轮到你');
      return;
    }
    if (this.claimPeng || this.claimHu) return;
    if (this.selectedIdx === idx) {
      this.discardAt(idx);
      return;
    }
    this.selectedIdx = idx;
    this.applyHandLift();
    this.setTip('已选中：再点一次出牌；或按住往上拖');
  }

  private applyHandLift() {
    const root = this.ui()?.handRoot;
    if (!root) return;
    for (let i = 0; i < root.children.length; i++) {
      const n = root.children[i];
      const p = n.position;
      n.setPosition(p.x, this.selectedIdx === i ? 22 : 0, p.z);
    }
  }

  private tileAt(idx: number): number {
    if (idx < this.hand.length) return this.hand[idx];
    return this.moPai;
  }

  private discardAt(idx: number) {
    if (this.actUser !== this.myId) {
      this.setTip('未轮到你');
      return;
    }
    if (this.claimPeng || this.claimHu) return;
    const t = this.tileAt(idx);
    if (!t) return;
    console.log('[Table] discard', t);
    MsgBus.ins.sendChuPai(t);
    this.selectedIdx = -1;
    this.clearClaim();
    this.setTip('已出牌');
  }

  onClickPeng() {
    if (!this.claimPeng) return;
    MsgBus.ins.sendPeng();
    this.clearClaim();
    this.ui()?.setActionButtons(false, false, false);
    this.setTip('碰！');
  }

  onClickHu() {
    if (!this.claimHu) return;
    MsgBus.ins.sendHu();
    this.clearClaim();
    this.ui()?.setActionButtons(false, false, false);
    this.setTip('胡！结算中…');
    this.pendingHuUid = this.myId;
    this.scheduleOnce(() => {
      const lay = this.ui();
      if (!lay) return;
      const ui = lay.root.getChildByName('__TableUI');
      if (ui && !ui.getChildByName('__ResultOverlay')) {
        lay.showResultOverlay('胡了！', '本局结束（点击回大厅）', () => this.backToHall());
      }
    }, 1.0);
  }

  onClickGuo() {
    MsgBus.ins.sendEmpty(MsgCode.MahjongGuoCmd);
    this.clearClaim();
    this.ui()?.setActionButtons(false, false, false);
    this.setTip('过');
  }
}

