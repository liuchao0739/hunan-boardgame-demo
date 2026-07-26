import { _decorator, Component, director, Node, UITransform, Label, Vec3 } from 'cc';
import { NetBus, ConnState } from '../comm/NetBus';
import { createTileNode, sortHandTiles } from '../comm/ArtBg';
import { AudioBus } from '../comm/AudioBus';
import { VoiceBus, RoundVoice } from '../comm/VoiceBus';
import { TableLayout, SeatPlayer, ResultSettleInfo } from './TableLayout';
import { gameDisplayName } from './TableRouter';
import { chiHandTiles, tingTiles } from './ChangshaTiles';
import { buildInviteUrl, peekRoomPassword, clearRoomPassword } from '../comm/InviteLink';

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
  private lastChiOptions: number[][] = [];
  private _lastDiscardTile: number | null = null;
  private autoPlay = false;
  private roomState = 'playing';
  private roomId = 0;
  private activeGameId = 'changsha_mj';
  private resultShown = false;
  private prevGame: any = null;
  private prevHandLen = 0;
  private dealRoundKey = '';
  private dealing = false;

  onDestroy() {
    this.unschedule(this.tickCountdown);
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
    AudioBus.ensure(canvas);
    const u = (globalThis as any).__HNQP__ || {};
    this.myId = u.userId || 0;
    VoiceBus.dialect = u.voiceDialect === 'dialect' ? 'dialect' : 'mandarin';

    const clickSfx = () => AudioBus.playButton();
    this.layout.btnPeng?.node.on('click', () => { clickSfx(); void this.act('peng'); }, this);
    this.layout.btnHu?.node.on('click', () => { clickSfx(); void this.actHu(); }, this);
    this.layout.btnGuo?.node.on('click', () => { clickSfx(); void this.act('guo'); }, this);
    this.layout.btnChi?.node.on('click', () => { clickSfx(); void this.actChi(); }, this);
    this.layout.btnContinue?.node.on('click', () => void this.act('continue'), this);
    this.layout.btnAutoPlay?.node.on('click', () => void this.toggleAutoPlay(), this);
    this.layout.btnDissolve?.node.on('click', () => void this.voteDissolve(true), this);
    this.layout.exitBtn?.node.on('click', () => { clickSfx(); void this.backToHall(); }, this);
    this.layout.shareBtn?.node.on('click', () => { clickSfx(); this.copyShareLink(); }, this);
    this.schedule(this.tickCountdown, 0.1);

    this.unsubs.push(NetBus.ins.onConnState((state, detail) => this.onConnState(state, detail)));
    this.unsubs.push(NetBus.ins.on('platform', 'state', (body) => this.applyState(body)));
    this.unsubs.push(NetBus.ins.on('platform', 'error', (body) => {
      this.setTip(body?.message || '错误');
    }));
    this.unsubs.push(NetBus.ins.on('platform', 'dissolveResult', (body) => {
      if (body?.dissolved) void this.backToHall();
    }));
    this.unsubs.push(NetBus.ins.on('platform', 'emojiEvent', (body) => {
      if (body?.emojiId != null) this.setTip(`😀 表情 ${body.emojiId}`);
    }));
    this.unsubs.push(NetBus.ins.on('platform', 'phraseEvent', (body) => {
      if (body?.text) this.setTip(`💬 ${body.text}`);
    }));
    this.unsubs.push(NetBus.ins.on('platform', 'kicked', (body) => {
      // duplicate_login：NetBus 清会话并回 Login；房主踢人回大厅
      if (body?.reason === 'host_kick') void this.backToHall();
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

  private tickCountdown = () => {
    this.layout?.tickCountdown(0.1);
  };

  private applyState(body: any) {
    if (!this.isValid || !this.layout || this.leaving || !body) return;
    this.roomState = body.state || this.roomState;
    if (body.roomId) this.roomId = Number(body.roomId) || this.roomId;
    if (body.gameId) this.activeGameId = body.gameId;
    if (body.state === 'waiting' && !body.game) {
      this.applyWaiting(body);
      return;
    }
    this.layout.setWaitingMode(false);
    const game = body.game;
    if (!game) {
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
          this.hand = sortHandTiles(Object.keys(raw).sort((a, b) => Number(a) - Number(b)).map((k) => raw[k]));
        }
      }
    }
    const fx = this.detectFxEvents(game);
    if (this.layout.roomLabel) {
      this.layout.roomLabel.string = `房${body.roomId} · ${gameDisplayName(this.activeGameId)}`;
    }
    if (this.layout.roundLabel) {
      this.layout.roundLabel.string = `第 ${game.round || 1} 局`;
      if (this.layout.consoleRoundLab) {
        this.layout.consoleRoundLab.string = `第${game.round || 1}局`;
      }
    }
    this.layout.updateRemainCount(game.wallCount);
    this.layout.updateWall(game.wallCount);
    this.layout.updateCountdown(game.deadlineMs ?? null);
    // 不再用顶栏文案提示「谁出牌」——罗盘指示灯 + 倒计时即可
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
      melds: (s.melds || []).map((m: any) => ({ kind: m.kind, tiles: m.tiles || [] })),
    }));
    this.layout.updateSeats(players, this.myId, this.seatToUser(game, game.currentSeat));
    // 必须在 refreshHand 之前写入，否则吃碰高亮会读到空 ops
    this.lastOps = game.availableOps || [];
    this._lastDiscardTile = game.lastDiscard?.tile != null ? Number(game.lastDiscard.tile) : null;
    void this.runStateFx(fx, game, players);
    this.refreshOps(game);

    // 仅起手阶段短暂展示起手胡，随后自动继续
    if (game.phase === 'qishou' && game.qishou) {
      this.unschedule(this.autoContinueQishou);
      this.scheduleOnce(this.autoContinueQishou, 0.6);
    }

    if (game.phase === 'settle' && game.settle && !this.resultShown) {
      this.resultShown = true;
      const s = game.settle;
      const settleInfo = this.buildSettleInfo(s, game);
      settleInfo.roomId = body.roomId;
      const between = this.roomState === 'between_round';
      const title = s.reason === 'huangzhuang'
        ? '荒庄'
        : (s.reason === 'zimo' ? '自摸！' : '胡牌！');
      const openSettle = () => {
        this.layout?.showResultOverlay(
          title,
          s.detail || '本局结束',
          between ? '准备下一局' : '回大厅',
          () => {
            if (between) void this.prepareNextRound();
            else void this.backToHall();
          },
          between ? '回大厅' : undefined,
          between ? () => void this.backToHall() : undefined,
          settleInfo,
        );
      };
      if (s.reason === 'zimo' || s.reason === 'hu' || s.reason === 'dianpao' || s.reason === 'qiang_gang') {
        this.layout.showHuEffect(s.reason === 'zimo' ? 'zimo' : (s.reason === 'dianpao' ? 'dianpao' : 'hu'));
        VoiceBus.playRound(s.reason === 'zimo' ? 'zimo' : (s.reason === 'dianpao' ? 'dianpao' : 'hu'));
        // 先播胡特效，再弹出商业结算窗
        this.scheduleOnce(openSettle, 1.05);
      } else {
        openSettle();
      }
    } else if (game.phase !== 'settle' && this.resultShown) {
      // 新一局已开始：务必关掉结算遮罩，否则点不到牌
      this.resultShown = false;
      this.layout.hideResultOverlay();
    }
    this.prevGame = this.snapshotGame(game);
    this.prevHandLen = this.hand.length;
  }

  private snapshotGame(game: any) {
    const meldCounts: number[] = [];
    for (const s of game.seats || []) {
      meldCounts[s.seat] = (s.melds || []).length;
    }
    const discardLens: number[] = [];
    const scores: number[] = [];
    for (const s of game.seats || []) {
      discardLens[s.seat] = (s.discards || []).length;
      scores[s.seat] = s.score || 0;
    }
    return {
      phase: game.phase,
      round: game.round,
      currentSeat: game.currentSeat,
      wallCount: game.wallCount,
      lastDiscard: game.lastDiscard ? { ...game.lastDiscard } : null,
      meldCounts,
      discardLens,
      scores,
    };
  }

  private buildSettleInfo(s: any, game: any): ResultSettleInfo {
    const winner = s.winnerSeat;
    const scoreArr: number[] = Array.isArray(s.scores) ? s.scores : [];
    const seatByIdx = new Map<number, any>();
    for (const seat of game.seats || []) seatByIdx.set(Number(seat.seat), seat);

    const rows = (game.seats || [])
      .map((seat: any) => {
        const total = Number(seat.score ?? scoreArr[seat.seat] ?? 0);
        const prev = this.prevGame?.scores?.[seat.seat];
        const score = prev != null ? total - prev : total;
        return {
          seat: seat.seat as number,
          name: String(seat.userName || `座位${seat.seat}`),
          score: Number(score) || 0,
          isMe: seat.userId === this.myId,
          isWinner: winner != null && Number(seat.seat) === Number(winner),
        };
      })
      .sort((a: { seat: number }, b: { seat: number }) => a.seat - b.seat);

    let fanItems = Array.isArray(s.fanItems) ? s.fanItems : [];
    if (fanItems.length && fanItems[0]?.fanItems) {
      const flat: any[] = [];
      for (const block of fanItems) {
        for (const it of block.fanItems || []) flat.push(it);
      }
      fanItems = flat;
    }

    const winnerSeat = winner != null ? seatByIdx.get(Number(winner)) : null;
    const paoSeat = s.paoSeat != null ? seatByIdx.get(Number(s.paoSeat)) : null;

    const winMelds = Array.isArray(s.winMelds)
      ? s.winMelds.map((m: any) => ({
        kind: String(m.kind || 'peng'),
        tiles: Array.isArray(m.tiles) ? m.tiles.map((t: any) => Number(t)) : [],
      }))
      : (winnerSeat?.melds || []).map((m: any) => ({
        kind: String(m.kind || 'peng'),
        tiles: Array.isArray(m.tiles) ? m.tiles.map((t: any) => Number(t)) : [],
      }));

    return {
      reason: String(s.reason || ''),
      detail: s.detail,
      fan: s.fan != null ? Number(s.fan) : undefined,
      fanItems: fanItems.map((f: any) => ({
        name: String(f.name || f.id || '番'),
        fan: Number(f.fan) || 0,
      })),
      birds: Array.isArray(s.birds) ? s.birds.map((t: any) => Number(t)) : [],
      winnerName: String(s.winnerName || winnerSeat?.userName || (winner != null ? `座位${winner}` : '')),
      paoName: s.paoName || paoSeat?.userName || undefined,
      winHand: Array.isArray(s.winHand) ? s.winHand.map((t: any) => Number(t)) : undefined,
      winMelds,
      huTile: s.huTile != null ? Number(s.huTile) : null,
      rows,
    };
  }

  private detectFxEvents(game: any) {
    const prev = this.prevGame;
    const roundKey = `${game.round || 0}:${game.dealer ?? 0}`;
    const dealStart = prev == null
      || (roundKey !== this.dealRoundKey && (game.phase === 'qishou' || game.phase === 'wait_discard'));
    if (dealStart) this.dealRoundKey = roundKey;

    let discardFly: { rel: number; tile: number; from?: Vec3 } | null = null;
    if (game.lastDiscard?.tile != null) {
      const ld = game.lastDiscard;
      const fromSeat = ld.fromSeat ?? ld.seat;
      const prevTile = prev?.lastDiscard?.tile;
      const prevLd = prev?.lastDiscard as { fromSeat?: number; seat?: number } | null | undefined;
      const prevFrom = prevLd?.fromSeat ?? prevLd?.seat;
      if (!prev || prevTile !== ld.tile || prevFrom !== fromSeat) {
        const rel = ((Number(fromSeat) - this.mySeat) + 4) % 4;
        discardFly = { rel, tile: ld.tile };
        AudioBus.playDiscard();
        VoiceBus.playTile(ld.tile);
      }
    }

    let meldNew = false;
    if (prev?.meldCounts) {
      for (const s of game.seats || []) {
        const cnt = (s.melds || []).length;
        if (cnt > (prev.meldCounts[s.seat] || 0)) meldNew = true;
      }
    }

    let roundVoice: RoundVoice | null = null;
    if (meldNew && prev) {
      for (const s of game.seats || []) {
        const melds = s.melds || [];
        const prevCnt = prev.meldCounts?.[s.seat] || 0;
        if (melds.length > prevCnt) {
          const kind = melds[melds.length - 1]?.kind;
          if (kind === 'chi') roundVoice = 'chi';
          else if (kind === 'peng') roundVoice = 'peng';
          else if (kind === 'gang' || kind === 'ming_gang' || kind === 'an_gang' || kind === 'bu_gang') {
            roundVoice = 'gang';
          }
        }
      }
    }

    const handDraw = this.hand.length > this.prevHandLen && this.prevHandLen > 0;

    return {
      dealStart: dealStart && !this.dealing,
      discardFly,
      meldNew,
      roundVoice,
      handDraw,
    };
  }

  private async runStateFx(
    fx: ReturnType<TableScene['detectFxEvents']>,
    game: any,
    players: SeatPlayer[],
  ) {
    await this.playTableFx(fx, game, players);
    await this.refreshHand(fx.handDraw);
  }

  private async playTableFx(
    fx: ReturnType<TableScene['detectFxEvents']>,
    game: any,
    players: SeatPlayer[],
  ) {
    const lay = this.layout!;
    if (fx.roundVoice) VoiceBus.playRound(fx.roundVoice);

    if (fx.dealStart) {
      // 开局直接亮牌桌（牌山/手牌/副露），不做发牌飞行动效
      this.dealing = false;
    }

    if (fx.discardFly) {
      let from: Vec3 | undefined;
      if (fx.discardFly.rel === 0 && lay.handRoot.children.length) {
        const last = lay.handRoot.children[lay.handRoot.children.length - 1];
        from = last.getComponent(UITransform)!.convertToWorldSpaceAR(new Vec3(0, 0, 0));
      }
      await lay.flyDiscardToRiver(fx.discardFly.rel, fx.discardFly.tile, from);
    }

    const riverHl = this.claimRiverHighlight();
    await lay.updateDiscards(players, this.myId, riverHl ? this._lastDiscardTile : null, riverHl);
    await lay.updateMelds(players, this.myId, fx.meldNew);
  }

  private async prepareNextRound() {
    this.resultShown = false;
    this.layout?.hideResultOverlay();
    this.prevGame = null;
    this.prevHandLen = 0;
    try {
      const msg = await NetBus.ins.prepare(true);
      if (msg.cmd === 'error') this.setTip(msg.body?.message || '准备失败');
      else if (msg.body) this.applyState(msg.body);
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
    const nextChi = ops
      .filter((o) => o.action === 'chi' && Array.isArray(o.tiles) && o.tiles.length >= 2)
      .map((o) => (o.tiles as number[]).map((t) => Number(t)));
    const chiSig = (arr: number[][]) => arr.map((t) => t.join(',')).join('|');
    const chiChanged = chiSig(nextChi) !== chiSig(this.lastChiOptions);
    this.lastChiOptions = nextChi;
    this.lastChi = nextChi[0] || null;
    // 倒计时等会反复推 state：吃法面板已打开且选项未变时不要拆掉
    const picking = !!lay.chiPicker?.isValid;
    if (!showClaim || !canChi || chiChanged) {
      lay.hideChiPicker();
    }
    if (!(picking && canChi && !chiChanged)) {
      lay.setActionButtons(showClaim, canPeng, canHu, canChi);
    }
  }

  private async act(cmd: string, body: any = {}) {
    try {
      this.layout?.hideChiPicker();
      const msg = await NetBus.ins.gameAction(cmd, body, this.activeGameId);
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
    const opts = this.lastChiOptions;
    if (!opts.length) return;
    if (opts.length === 1) {
      await this.act('chi', { tiles: opts[0].slice(0, 2) });
      return;
    }
    // 多种吃法：弹出选择，暂时收起操作钮
    const lay = this.layout;
    if (!lay) return;
    lay.setActionButtons(false, false, false, false);
    lay.showChiPicker(
      opts,
      (tiles) => { void this.act('chi', { tiles }); },
      () => {
        const canPeng = this.lastOps.some((o) => o.action === 'peng');
        const canHu = this.lastOps.some((o) => o.action === 'hu' || o.action === 'zimo');
        lay.setActionButtons(true, canPeng, canHu, true);
      },
    );
  }

  private autoContinueQishou = () => {
    void this.act('continue');
  };

  /** 吃/碰相关手牌黄框；点炮可胡时河牌红框（手牌不整手刷红） */
  private collectHighlightTiles(): Map<number, 'claim' | 'hu'> {
    const map = new Map<number, 'claim' | 'hu'>();
    const ops = this.lastOps || [];
    for (const t of chiHandTiles(ops)) map.set(t, 'claim');
    const discardTile = this._lastDiscardTile;
    if (discardTile != null && ops.some((o) => o.action === 'peng' || o.action === 'ming_gang')) {
      map.set(discardTile, 'claim');
    }
    return map;
  }

  private claimRiverHighlight(): 'claim' | 'hu' | null {
    const ops = this.lastOps || [];
    if (ops.some((o) => o.action === 'hu')) return 'hu';
    if (ops.some((o) => o.action === 'chi' || o.action === 'peng' || o.action === 'ming_gang')) {
      return 'claim';
    }
    return null;
  }

  private updateTingTips() {
    if (!this.layout) return;
    if (this.hand.length % 3 === 1) {
      this.layout.setTingTips(tingTiles(this.hand));
    } else {
      this.layout.setTingTips([]);
    }
  }

  private async refreshHand(animateDraw = false) {
    const lay = this.layout;
    if (!lay?.handRoot) return;
    const gen = ++this.handGen;
    const root = lay.handRoot;
    const tiles = sortHandTiles(this.hand);
    this.hand = tiles;

    const tw = 52;
    const gap = 4;
    const drawGap = 18; // 摸进的牌与手牌分开（口袋麻将）
    const justDrew = tiles.length % 3 === 2;
    const positions: number[] = [];
    let xCursor = 0;
    for (let i = 0; i < tiles.length; i++) {
      if (i > 0) {
        xCursor += tw + gap;
        if (justDrew && i === tiles.length - 1) xCursor += drawGap;
      }
      positions.push(xCursor);
    }
    const totalW = tiles.length ? (positions[positions.length - 1] + tw) : 0;
    const origin = -totalW / 2 + tw / 2;

    const highlight = this.collectHighlightTiles();

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
      const hl = highlight.get(tile);
      if (hl) TableLayout.markTileHighlight(n, hl);
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

    if (animateDraw && built.length > 0) {
      lay.animateHandReflow(root, positions, origin, built.length - 1);
    }
    this.updateTingTips();
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

  private applyWaiting(body: any) {
    const seats = Array.isArray(body.seats) ? body.seats : [];
    const humans = seats.filter((s: any) => !s.isBot).length;
    const cap = body.gameId === 'shaoyang_phz' ? 3 : 4;
    if (this.layout!.roomLabel) {
      this.layout!.roomLabel.string = `房${body.roomId} · ${gameDisplayName(this.activeGameId)}`;
    }
    this.layout!.applyWaitingSeats(seats, this.myId, Number(body.ownerId) || 0);
    this.layout!.setWaitingMode(
      true,
      `等待好友加入 ${humans}/${cap}\n人满自动开局 · 可复制链接发给微信好友`,
    );
    (globalThis as any).__HNQP_ROOM__ = body;
  }

  private copyShareLink() {
    const pwd = peekRoomPassword();
    const id = this.roomId;
    if (!id) {
      this.setTip('暂无房间号');
      return;
    }
    if (!pwd) {
      this.setTip('无房间密码，无法生成链接（请用本局创建时的密码分享）');
      return;
    }
    const url = buildInviteUrl(id, pwd);
    if (NetBus.copyToClipboard(url)) {
      this.setTip('分享链接已复制，发给微信好友即可进房');
    } else {
      this.setTip(url);
    }
  }

  private setTip(s: string) {
    const tip = this.layout?.tipLabel;
    if (!tip) return;
    tip.string = s || '';
    const wrap = tip.node.parent;
    if (wrap?.isValid) wrap.active = !!s;
    console.log('[Table]', s);
  }

  private async backToHall() {
    if (this.leaving) return;
    this.leaving = true;
    this.clearSubs();
    try { await NetBus.ins.leave(true); } catch { /* */ }
    try { delete (globalThis as any).__HNQP_ROOM__; } catch { /* */ }
    clearRoomPassword();
    this.layout = null;
    director.loadScene('Hall');
  }
}