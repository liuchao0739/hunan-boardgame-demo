import {
  resources, Sprite, SpriteFrame, Node, UITransform, view, Texture2D, ImageAsset,
  Button, Label, Color, Layers, EventTouch, NodeEventType,
} from 'cc';

const frameCache = new Map<string, SpriteFrame>();

export function loadSpriteFrame(path: string): Promise<SpriteFrame | null> {
  if (frameCache.has(path)) return Promise.resolve(frameCache.get(path)!);
  return new Promise((resolve) => {
    const done = (f: SpriteFrame | null) => {
      if (f) frameCache.set(path, f);
      resolve(f);
    };
    resources.load(`${path}/spriteFrame`, SpriteFrame, (err, frame) => {
      if (!err && frame) { done(frame); return; }
      resources.load(path, SpriteFrame, (err2, frame2) => {
        if (!err2 && frame2) { done(frame2); return; }
        resources.load(path, ImageAsset, (err3, img) => {
          if (err3 || !img) {
            console.warn('[Art] load fail', path, err || err2 || err3);
            done(null);
            return;
          }
          const tex = new Texture2D();
          tex.image = img;
          const sf = new SpriteFrame();
          sf.texture = tex;
          done(sf);
        });
      });
    });
  });
}

export function attachBg(parent: Node, path: string): void {
  if (!parent || parent.getChildByName('__AutoBg')) return;
  const bg = new Node('__AutoBg');
  parent.insertChild(bg, 0);
  bg.layer = parent.layer || Layers.Enum.UI_2D;
  const ui = bg.addComponent(UITransform);
  const vs = view.getVisibleSize();
  ui.setContentSize(vs.width, vs.height);
  bg.setPosition(0, 0, 0);
  const sp = bg.addComponent(Sprite);
  sp.sizeMode = Sprite.SizeMode.CUSTOM;
  void loadSpriteFrame(path).then((frame) => {
    if (!frame || !bg.isValid) return;
    sp.spriteFrame = frame;
    const tw = frame.originalSize?.width || frame.rect.width;
    const th = frame.originalSize?.height || frame.rect.height;
    if (tw > 0 && th > 0) {
      const s = Math.max(vs.width / tw, vs.height / th);
      ui.setContentSize(tw * s, th * s);
    }
  });
}

/** 用独立子节点贴图，避免默认 Button 白块；成功后再藏 Label */
export function skinButton(btn: Button | null | undefined, path: string, hideLabel = true, maxW = 360): void {
  if (!btn) return;
  btn.transition = Button.Transition.SCALE;
  btn.zoomScale = 0.94;
  void loadSpriteFrame(path).then((frame) => {
    if (!frame || !btn.node?.isValid) return;
    let skin = btn.node.getChildByName('__Skin');
    if (!skin) {
      skin = new Node('__Skin');
      btn.node.insertChild(skin, 0);
      skin.layer = btn.node.layer;
      skin.addComponent(UITransform);
      skin.addComponent(Sprite);
    }
    const sp = skin.getComponent(Sprite)!;
    const ui = skin.getComponent(UITransform)!;
    sp.sizeMode = Sprite.SizeMode.CUSTOM;
    sp.type = Sprite.Type.SIMPLE;
    sp.spriteFrame = frame;
    const tw = frame.originalSize?.width || frame.rect.width || 200;
    const th = frame.originalSize?.height || frame.rect.height || 80;
    const scale = Math.min(1, maxW / tw);
    ui.setContentSize(tw * scale, th * scale);
    const host = btn.node.getComponent(UITransform);
    if (host) host.setContentSize(tw * scale, th * scale);
    const hostSp = btn.getComponent(Sprite);
    if (hostSp) hostSp.enabled = false;
    if (hideLabel) {
      for (const lab of btn.node.getComponentsInChildren(Label)) {
        if (lab.node.parent === skin) continue;
        lab.string = '';
        lab.node.active = false;
      }
    }
  });
}

export function styleLabel(lab: Label | null | undefined, size = 28): void {
  if (!lab) return;
  lab.fontSize = size;
  lab.color = new Color(255, 255, 255, 255);
  lab.enableOutline = true;
  lab.outlineColor = new Color(40, 20, 0, 220);
  lab.outlineWidth = 2;
}

export type TileGesture = {
  onSelect?: (tile: number, node: Node) => void;
  onDiscard?: (tile: number, node: Node) => void;
};

/** 统一成长沙 0–26；兼容误传的威海贴图编号 */
export function normalizeTileId(tile: number): number {
  const t = Number(tile);
  if (Number.isNaN(t)) return -1;
  if (t >= 0 && t <= 26) return t;
  if (t >= 21 && t <= 29) return t - 21; // 万
  if (t >= 41 && t <= 49) return 9 + (t - 41); // 条
  if (t >= 81 && t <= 89) return 18 + (t - 81); // 筒
  return -1;
}

/** 长沙编码 0-26 → 现有 weihai 贴图 万21-29/条41-49/饼81-89 */
export function changshaToArtId(tile: number): number {
  const id = normalizeTileId(tile);
  if (id < 0) return 0;
  const suit = Math.floor(id / 9);
  const rank = (id % 9) + 1;
  if (suit === 0) return 20 + rank;
  if (suit === 1) return 40 + rank;
  return 80 + rank;
}

export function sortHandTiles(tiles: number[]): number[] {
  return tiles
    .map((t) => normalizeTileId(t))
    .filter((t) => t >= 0)
    .sort((a, b) => a - b);
}

/**
 * 手牌交互（只走 TOUCH，避免和 MOUSE 双触发把逻辑打坏）：
 * - 单击 → onSelect（外层再点同一张 = 出牌）
 * - 上滑超过阈值 → onDiscard（滑动中途就出，不等松手）
 *
 * 重要：先加载贴图，再挂到 parent，避免并发 refresh 时半成品子节点残留。
 */
export async function createTileNode(
  tile: number,
  parent: Node,
  w = 52,
  h = 72,
  gesture?: TileGesture | ((tile: number, node: Node) => void),
): Promise<Node> {
  const artId = changshaToArtId(tile);
  // 完整牌体 + 牌面（对标商业麻将手感）
  const bodySf = await loadSpriteFrame('weihai/ui/tile_body')
    || await loadSpriteFrame('weihai/tiles/back');
  const faceSf = artId > 0 ? await loadSpriteFrame(`weihai/tiles/${artId}`) : null;

  const n = new Node(`T_${normalizeTileId(tile)}`);
  n.layer = parent.layer;
  const ui = n.addComponent(UITransform);
  ui.setContentSize(w, h);
  const back = n.addComponent(Sprite);
  back.sizeMode = Sprite.SizeMode.CUSTOM;
  if (bodySf) back.spriteFrame = bodySf;

  const face = new Node('face');
  n.addChild(face);
  face.layer = parent.layer;
  const fui = face.addComponent(UITransform);
  fui.setContentSize(w * 0.82, h * 0.72);
  face.setPosition(0, 2, 0);
  const fsp = face.addComponent(Sprite);
  fsp.sizeMode = Sprite.SizeMode.CUSTOM;
  if (faceSf) fsp.spriteFrame = faceSf;
  else face.active = false;

  const g: TileGesture = typeof gesture === 'function'
    ? { onSelect: gesture }
    : (gesture || {});

  if (g.onSelect || g.onDiscard) {
    let startY = 0;
    let baseY = 0;
    let fired = false;

    n.on(NodeEventType.TOUCH_START, (e: EventTouch) => {
      startY = e.getUILocation().y;
      baseY = n.position.y;
      fired = false;
    }, n);

    n.on(NodeEventType.TOUCH_MOVE, (e: EventTouch) => {
      if (fired) return;
      const dy = e.getUILocation().y - startY;
      if (dy > 0) {
        n.setPosition(n.position.x, baseY + dy, n.position.z);
      }
      if (g.onDiscard && dy > 24) {
        fired = true;
        g.onDiscard(tile, n);
      }
    }, n);

    n.on(NodeEventType.TOUCH_END, (e: EventTouch) => {
      if (fired) return;
      const dy = e.getUILocation().y - startY;
      if (g.onDiscard && dy > 24) {
        fired = true;
        g.onDiscard(tile, n);
        return;
      }
      n.setPosition(n.position.x, baseY, n.position.z);
      g.onSelect?.(tile, n);
    }, n);

    n.on(NodeEventType.TOUCH_CANCEL, () => {
      if (fired) return;
      if (n.isValid) n.setPosition(n.position.x, baseY, n.position.z);
    }, n);
  }

  if (!parent.isValid) {
    n.destroy();
    return n;
  }
  parent.addChild(n);
  return n;
}
