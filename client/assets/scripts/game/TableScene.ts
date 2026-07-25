import { _decorator, Component, director } from 'cc';
import { NetBus } from '../comm/NetBus';
import { createTileNode } from '../comm/ArtBg';
import { TableLayout, SeatPlayer } from './TableLayout';

const { ccclass } = _decorator;

@ccclass('TableScene')
export class TableScene extends Component {
  private layout: TableLayout | null = null;
  private myId = 0;
  private mySeat = 0;
  private hand: number[] = [];
  private selectedIdx = -1;
  private handGen = 0;
  private unsubs: Array<() => void> = [];
  private leaving = false;
  private lastOps: any[] = [];
  private lastChi: number[] | null = null;

  onDestroy() {
    this.clearSubs();
    this.layout = null;
  }

  private clearSubs() {
    for (const u of this.unsubs) u();
    this.unsubs = [];
  }

  onLoad() {
    NetBus.ins.offAll();
    const canvas = this.node.parent ?? this.node;
    for (const name of ['TipLabel', 'HandLabel', 'DiscardBtn', 'PengBtn', 'StatusLabel', 'HuBtn']) {
      const n = canvas.getChildByName(name) || this.node.getChildByName(name);
      if (n) n.active = false;
    }
    this.layout = new TableLayout(canvas);
    const u = (globalThis as any).__HNQP__ || {};
    this.myId = u.userId || 0;

    this.layout.btnPeng?.node.on('click', () => void this.act('peng'), this);
    this.layout.btnHu?.node.on('click', () => void this.actHu(), this);
    this.layout.btnGuo?.node.on('click', () => void this.act('guo'), this);
    this.layout.btnChi?.node.on('click', () => void this.actChi(), this);
    this.layout.btnContinue?.node.on('click', () => void this.act('continue'), this);
    this.layout.exitBtn?.node.on('click', () => void this.backToHall(), this);

    this.unsubs.push(NetBus.ins.on('platform', 'state', (body) => this.applyState(body)));
    this.unsubs.push(NetBus.ins.on('platform', 'error', (body) => {
      this.setTip(body?.message || '错误');
    }));

    const cached = (globalThis as any).__HNQP_ROOM__;
    if (cached) this.applyState(cached);
    void NetBus.ins.sync().then((msg) => {
      if (msg?.body) this.applyState(msg.body);
    });
  }

  private applyState(body: any) {
    if (!this.isValid || !this.layout || this.leaving || !body) return;
    const game = body.game;
    if (!game) {
      this.setTip('等待牌局…');
      return;
    }
    // my seat
    for (const s of game.seats || []) {
      if (s.userId === this.myId) {
        this.mySeat = s.seat;
        if (Array.isArray(s.hand)) this.hand = s.hand.slice();
      }
    }
    if (this.layout.roomLabel) this.layout.roomLabel.string = `房${body.roomId}`;
    if (this.layout.roundLabel) this.layout.roundLabel.string = `第 ${game.round || 1} 局`;
    if (this.layout.remainLabel) this.layout.remainLabel.string = `剩 ${game.wallCount ?? '--'}`;
    this.setTip(game.message || '');

    const players: SeatPlayer[] = (game.seats || []).map((s: any) => ({
      userId: s.userId,
      userName: s.userName,
      seatIndex: s.seat,
      totalScore: s.score || 0,
      handCount: s.handCount,
      zhuang: s.seat === game.dealer,
      owner: s.userId === body.ownerId,
      discard: s.discards || [],
      peng: (s.melds || []).filter((m: any) => m.kind === 'peng').map((m: any) => m.tiles[0]),
    }));
    this.layout.updateSeats(players, this.myId, this.seatToUser(game, game.currentSeat));
    void this.layout.updateDiscards(players, this.myId);
    void this.layout.updateMelds(players, this.myId);
    void this.refreshHand();

    this.lastOps = game.availableOps || [];
    this.refreshOps(game);

    if (game.qishou) {
      const lines: string[] = ['起手胡'];
      for (const [seat, hits] of Object.entries(game.qishou)) {
        const names = (hits as any[]).map((h) => h.name).join('、');
        lines.push(`座位${seat}: ${names}`);
      }
      this.setTip(lines.join(' | '));
    }

    if (game.phase === 'settle' && game.settle) {
      const s = game.settle;
      const title = s.reason === 'huangzhuang' ? '荒庄' : (s.reason === 'zimo' ? '自摸！' : '胡牌！');
      this.layout.showResultOverlay(title, s.detail || '本局结束', () => void this.backToHall());
    }
  }

  private seatToUser(game: any, seat: number): number {
    const s = (game.seats || []).find((x: any) => x.seat === seat);
    return s?.userId || 0;
  }

  private refreshOps(game: any) {
    const lay = this.layout!;
    const ops = this.lastOps;
    const phase = game.phase;
    if (phase === 'qishou') {
      lay.setActionButtons(false, false, false, false);
      if (lay.btnContinue) lay.btnContinue.node.active = true;
      return;
    }
    if (lay.btnContinue) lay.btnContinue.node.active = false;

    const canPeng = ops.some((o) => o.action === 'peng');
    const canHu = ops.some((o) => o.action === 'hu' || o.action === 'zimo');
    const canChi = ops.some((o) => o.action === 'chi');
    const showClaim = ops.some((o) => ['peng', 'hu', 'guo', 'chi', 'ming_gang'].includes(o.action));
    lay.setActionButtons(showClaim, canPeng, canHu, canChi);
    if (canChi) {
      const chi = ops.find((o) => o.action === 'chi');
      this.lastChi = chi?.tiles || null;
    } else {
      this.lastChi = null;
    }
  }

  private async act(cmd: string, body: any = {}) {
    try {
      const msg = await NetBus.ins.gameAction(cmd, body);
      if (msg.cmd === 'error') this.setTip(msg.body?.message || '失败');
      // state push follows
      const st = await NetBus.ins.sync();
      if (st?.body) this.applyState(st.body);
    } catch (e) {
      this.setTip('操作超时');
    }
  }

  private async actHu() {
    const zimo = this.lastOps.some((o) => o.action === 'zimo');
    await this.act(zimo ? 'zimo' : 'hu', {});
  }

  private async actChi() {
    if (!this.lastChi) return;
    await this.act('chi', { tiles: this.lastChi });
  }

  private async refreshHand() {
    const lay = this.layout;
    if (!lay?.handRoot) return;
    const gen = ++this.handGen;
    const root = lay.handRoot;
    root.removeAllChildren();
    const tw = 56;
    const closed = this.hand;
    const totalW = closed.length * tw;
    let x = -totalW / 2 + tw / 2;
    for (let i = 0; i < closed.length; i++) {
      if (gen !== this.handGen) return;
      const tile = closed[i];
      const idx = i;
      const n = await createTileNode(tile, root, tw, 78, {
        onSelect: () => this.onSelectTile(idx),
        onDiscard: () => void this.discardAt(idx),
      });
      if (gen !== this.handGen || !n.isValid) return;
      n.setPosition(Math.round(x), this.selectedIdx === idx ? 20 : 0, 0);
      x += tw;
    }
  }

  private onSelectTile(idx: number) {
    if (this.selectedIdx === idx) {
      void this.discardAt(idx);
      return;
    }
    this.selectedIdx = idx;
    const root = this.layout?.handRoot;
    if (!root) return;
    for (let i = 0; i < root.children.length; i++) {
      const n = root.children[i];
      const p = n.position;
      n.setPosition(p.x, this.selectedIdx === i ? 22 : 0, p.z);
    }
  }

  private async discardAt(idx: number) {
    const tile = this.hand[idx];
    if (tile == null) return;
    this.selectedIdx = -1;
    await this.act('discard', { tile });
  }

  private setTip(s: string) {
    if (this.layout?.tipLabel) this.layout.tipLabel.string = s;
    console.log('[Table]', s);
  }

  private async backToHall() {
    if (this.leaving) return;
    this.leaving = true;
    this.clearSubs();
    try { await NetBus.ins.leave(); } catch { /* */ }
    this.layout = null;
    director.loadScene('Hall');
  }
}
