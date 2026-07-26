import {
  Node, tween, Vec3, Tween, UIOpacity, UITransform, Color, Graphics, Label,
} from 'cc';
import { createTileNode, styleLabel } from '../comm/ArtBg';

/** 通用 tween 工具，牌桌动效复用 */
export function stopNodeTweens(n: Node | null | undefined) {
  if (!n?.isValid) return;
  Tween.stopAllByTarget(n);
  for (const c of n.children) stopNodeTweens(c);
}

export function popIn(node: Node, delay = 0) {
  if (!node?.isValid) return;
  stopNodeTweens(node);
  node.setScale(0.55, 0.55, 1);
  let op = node.getComponent(UIOpacity);
  if (!op) op = node.addComponent(UIOpacity);
  op.opacity = 0;
  tween(node)
    .delay(delay)
    .parallel(
      tween().to(0.22, { scale: new Vec3(1.06, 1.06, 1) }, { easing: 'backOut' }),
      tween(op).to(0.18, { opacity: 255 }),
    )
    .to(0.08, { scale: new Vec3(1, 1, 1) })
    .start();
}

export function fadeScaleOut(node: Node, dur = 0.35, onDone?: () => void) {
  if (!node?.isValid) return;
  stopNodeTweens(node);
  let op = node.getComponent(UIOpacity);
  if (!op) op = node.addComponent(UIOpacity);
  tween(node)
    .parallel(
      tween().to(dur, { scale: new Vec3(1.25, 1.25, 1) }),
      tween(op).to(dur, { opacity: 0 }),
    )
    .call(() => {
      if (node.isValid) node.destroy();
      onDone?.();
    })
    .start();
}

export async function flyTile(
  parent: Node,
  tile: number,
  from: Vec3,
  to: Vec3,
  w = 52,
  h = 74,
  dur = 0.32,
): Promise<void> {
  if (!parent?.isValid) return;
  const n = await createTileNode(tile, parent, w, h);
  if (!n?.isValid) return;
  n.setPosition(from);
  n.setScale(1.1, 1.1, 1);
  return new Promise((resolve) => {
    tween(n)
      .to(dur, { position: to, scale: new Vec3(1, 1, 1) }, { easing: 'quadOut' })
      .call(() => {
        if (n.isValid) n.destroy();
        resolve();
      })
      .start();
  });
}

export function slideNodes(nodes: Node[], targetXs: number[], dur = 0.2) {
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (!n?.isValid) continue;
    const tx = targetXs[i] ?? n.position.x;
    const ty = n.position.y;
    stopNodeTweens(n);
    tween(n).to(dur, { position: new Vec3(tx, ty, 0) }, { easing: 'quadOut' }).start();
  }
}

export function buildHuEffectLayer(parent: Node, kind: 'hu' | 'zimo'): Node {
  const ov = new Node('__HuFx');
  parent.addChild(ov);
  ov.layer = parent.layer;
  ov.addComponent(UITransform).setContentSize(1280, 720);
  ov.setSiblingIndex(parent.children.length - 1);

  const dim = new Node('dim');
  ov.addChild(dim);
  dim.layer = parent.layer;
  dim.addComponent(UITransform).setContentSize(1280, 720);
  const dg = dim.addComponent(Graphics);
  dg.fillColor = new Color(0, 0, 0, 120);
  dg.rect(-640, -360, 1280, 720);
  dg.fill();
  let dop = dim.addComponent(UIOpacity);
  dop.opacity = 0;
  tween(dop).to(0.15, { opacity: 255 }).start();

  const burst = new Node('burst');
  ov.addChild(burst);
  burst.layer = parent.layer;
  burst.addComponent(UITransform).setContentSize(420, 420);
  const bg = burst.addComponent(Graphics);
  const c = kind === 'zimo' ? new Color(255, 200, 60, 220) : new Color(255, 80, 60, 220);
  bg.fillColor = c;
  bg.circle(0, 0, 180);
  bg.fill();
  bg.strokeColor = new Color(255, 255, 220, 255);
  bg.lineWidth = 6;
  bg.circle(0, 0, 180);
  bg.stroke();
  burst.setScale(0.2, 0.2, 1);

  const titleN = new Node('title');
  burst.addChild(titleN);
  titleN.layer = parent.layer;
  titleN.addComponent(UITransform).setContentSize(360, 80);
  const lab = titleN.addComponent(Label);
  styleLabel(lab, 56);
  lab.string = kind === 'zimo' ? '自摸' : '胡牌';
  lab.color = new Color(255, 255, 220, 255);

  tween(burst)
    .to(0.35, { scale: new Vec3(1.15, 1.15, 1) }, { easing: 'backOut' })
    .to(0.2, { scale: new Vec3(1, 1, 1) })
    .delay(0.6)
    .call(() => fadeScaleOut(ov, 0.4))
    .start();

  return ov;
}

export function rollNumber(
  label: Label,
  from: number,
  to: number,
  prefix: string,
  dur = 0.45,
) {
  if (!label?.isValid) return;
  const obj = { v: from };
  tween(obj)
    .to(dur, { v: to }, {
      easing: 'quadOut',
      onUpdate: () => {
        if (label.isValid) label.string = `${prefix}${Math.round(obj.v)}`;
      },
    })
    .call(() => {
      if (label.isValid) label.string = `${prefix}${to}`;
    })
    .start();
}
