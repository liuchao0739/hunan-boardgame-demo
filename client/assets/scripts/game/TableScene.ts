import { _decorator, Component, director, Node, UITransform, Label } from 'cc';
import { NetBus, ConnState } from '../comm/NetBus';
import { createTileNode, sortHandTiles } from '../comm/ArtBg';
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
  private autoPlay = false;
  private roomState = 'playing';
  private resultShown = false;

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
    this.layout.btnAutoPlay?.node.on('click', () => void this.toggleAutoPlay(), this);
    this.layout.btnDissolve?.node.on('click', () => void this.voteDissolve(true), this);
    this.layout.exitBtn?.node.on('click', () => void this.backToHall(), this);

    this.unsubs.push(NetBus.ins.onConnState((state, detail) => this.onConnState(state, detail)));
    this.unsubs.push(NetBus.ins.on('platform', 'state', (body) => this.applyState(body)));
    this.unsubs.push(NetBus.ins.on('platform', 'error', (body) => {
      this.setTip(body?.message || '错误');
    }));
    this.unsubs.push(NetBus.ins.on('platform', 'dissolveResult', (body) => {
      if (body?.dissolved) void this.backToHall();
    }));

    const cached = (globalThis as any).__HNQP_ROOM__;
    if (cached) this.applyState(cached);
    void NetBus.ins.sync().then((msg) => {
      if (msg?.body) this.applyState(msg.body);
    });
  }

  private onConnState(state: ConnState, detail?: string) {
    if (!this.layout) return;
    if (state === 'connected') {
      this.layout.setNetBanner(null);
      return;
    }
    if (state === 'reconnecting') {
      this.layout.setNetBanner(detail || '重连中…');
      return;
    }
    if (state === 'network_poor') {
      this.layout.setNetBanner(detail || '网络不稳定，请稍候…');
      return;
    }
    if (state === 'disconnected') {
      this.layout.setNetBanner(detail || '已断开连接');
    }
  }

  private applyState(body: any) {
    if (!this.isValid || !this.layout || this.leaving || !body) return;
    this.roomState = body.state || this.roomState;
    if (body.state === 'waiting' && !body.game) {
      void this.backToHall();
      return;
    }
    const game = body.game;
    if (!game) {
      this.setTip('等待牌局…');
      return;
    }
    // my seat + 强制整理手牌（万→条→筒）
    for (const s of game.seats || []) {
      if (s.userId === this.myId) {
        this.mySeat = s.seat;
        this.autoPlay = !!s.autoPlay;
        const raw = s.hand;
        if (Array.isArray(raw)) {
          this.hand = sortHandTiles(raw);
        } else if (raw && typeof raw === 'object') {
          // 兼容 Lua/JSON 把数组编成对象
          this.hand = sortHandTiles(Object.keys(raw).sort((a, b) => Number(a) - Number(b)).map((k) => raw[k]));
        }
      }
    }
    if (this.layout.roomLabel) this.layout.roomLabel.string = `房${body.roomId}`;
    if (this.layout.roundLabel) this.layout.roundLabel.string = `第 ${game.round || 1} 局`;
    if (this.layout.remainLabel) this.layout.remainLabel.string = `剩 ${game.wallCount ?? '--'}`;
    const sec = game.deadlineMs != null ? Math.ceil(game.deadlineMs / 1000) : null;
    const baseTip = game.message || '';
    this.setTip(sec != null && sec > 0 ? `${baseTip} (${sec}s)` : baseTip);
    if (this.layout.btnAutoPlay) {
      const lab = this.layout.btnAutoPlay.node.getChildByName('t')?.getComponent(Label);
      if (lab) lab.string = this.autoPlay ? '取消托管' : '托管';
    }

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

    // 仅起手阶段展示起手胡；继续后不再盖住出牌提示
    if (game.phase === 'qishou' && game.qishou) {
      const lines: string[] = ['起手胡'];
      for (const [seat, hits] of Object.entries(game.qishou)) {
        const names = (hits as any[]).map((h) => h.name).join('、');
        lines.push(`座位${seat}: ${names}`);
      }
      this.setTip(lines.join(' | '));
      // 自动继续，避免卡在起手提示
      this.unschedule(this.autoContinueQishou);
      this.scheduleOnce(this.autoContinueQishou, 1.2);
    }

    if (game.phase === 'settle' && game.settle && !this.resultShown) {
      this.resultShown = true;
      const s = game.settle;
      const title = s.reason === 'huangzhuang' ? '荒庄' : (s.reason === 'zimo' ? '自摸！' : '胡牌！');
      const between = this.roomState === 'between_round';
      this.layout.showResultOverlay(
        title,
        s.detail || '本局结束',
        between ? '准备下一局' : '回大厅',
        () => {
          if (between) void this.prepareNextRound();
          else void this.backToHall();
        },
        between ? '回大厅' : undefined,
        between ? () => void this.backToHall() : undefined,
      );
    }
  }

  private async prepareNextRound() {
    this.resultShown = false;
    try {
      const msg = await NetBus.ins.prepare(true);
      if (msg.cmd === 'error') this.setTip(msg.body?.message || '准备失败');
    } catch {
      this.setTip('准备超时');
    }
  }

  private async toggleAutoPlay() {
    try {
      const msg = await NetBus.ins.setAutoPlay(!this.autoPlay);
      if (msg.cmd === 'error') this.setTip(msg.body?.message || '托管失败');
    } catch {
      this.setTip('托管超时');
    }
  }

  private async voteDissolve(agree: boolean) {
    try {
      const msg = await NetBus.ins.dissolveVote(agree);
      if (msg.body?.dissolved) {
        void this.backToHall();
        return;
      }
      if (msg.cmd === 'error') this.setTip(msg.body?.message || '解散失败');
      else this.setTip(agree ? '已同意解散，等待其他玩家' : '已拒绝解散');
    } catch {
      this.setTip('操作超时');
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

  private autoContinueQishou = () => {
    void this.act('continue');
  };

  private async refreshHand() {
    const lay = this.layout;
    if (!lay?.handRoot) return;
    const gen = ++this.handGen;
    const root = lay.handRoot;
    const tiles = sortHandTiles(this.hand);
    this.hand = tiles;

    const tw = 52;
    const gap = 2;
    const suitGap = 16;
    const positions: number[] = [];
    let xCursor = 0;
    for (let i = 0; i < tiles.length; i++) {
      if (i > 0) {
        const prevSuit = Math.floor(tiles[i - 1] / 9);
        const suit = Math.floor(tiles[i] / 9);
        xCursor += tw + (prevSuit !== suit ? suitGap : gap);
      }
      positions.push(xCursor);
    }
    const totalW = tiles.length ? (positions[positions.length - 1] + tw) : 0;
    const origin = -totalW / 2 + tw / 2;

    // 离屏容器建齐后再一次性替换，杜绝半成品/过期节点混进手牌区
    const stage = new Node('__HandStaging');
    stage.layer = root.layer;
    stage.addComponent(UITransform);

    const built: Node[] = [];
    for (let i = 0; i < tiles.length; i++) {
      if (gen !== this.handGen) {
        if (stage.isValid) stage.destroy();
        return;
      }
      const tile = tiles[i];
      const idx = i;
      const n = await createTileNode(tile, stage, tw, 74, {
        onSelect: () => this.onSelectTile(idx),
        onDiscard: () => void this.discardAt(idx),
      });
      if (gen !== this.handGen) {
        if (stage.isValid) stage.destroy();
        return;
      }
      if (!n?.isValid) continue;
      n.setPosition(Math.round(origin + positions[i]), this.selectedIdx === idx ? 20 : 0, 0);
      built.push(n);
    }

    if (gen !== this.handGen) {
      if (stage.isValid) stage.destroy();
      return;
    }
    root.removeAllChildren();
    for (const n of built) {
      if (!n.isValid) continue;
      n.removeFromParent();
      root.addChild(n);
    }
    if (stage.isValid) stage.destroy();
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