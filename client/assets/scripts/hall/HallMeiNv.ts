import {
  Node, UITransform, resources, Layers, JsonAsset, TextAsset, ImageAsset, Texture2D,
} from 'cc';
import { sp } from 'cc';

/**
 * 大厅 Spine 美女立绘（原版 Stand / Uh_Huh）
 */
export async function attachHallMeiNv(parent: Node, x = -300, y = -80): Promise<Node | null> {
  if (!(sp as any)?.Skeleton || !(sp as any)?.SkeletonData) {
    console.warn('[Spine] 引擎未启用 Spine 模块：项目设置 → 功能裁剪 → 勾选 Spine，然后重新预览');
    return null;
  }

  const old = parent.getChildByName('__HallMeiNv');
  if (old) old.destroy();

  const data = await loadMeiNvSkeletonData();
  if (!data) {
    console.warn('[Spine] MeiNv SkeletonData 加载失败：请在 Creator 刷新 weihai/spine/meiNv 与 hall_res/.../meiNv');
    return null;
  }

  const n = new Node('__HallMeiNv');
  parent.addChild(n);
  n.layer = parent.layer || Layers.Enum.UI_2D;
  n.addComponent(UITransform).setContentSize(420, 640);
  n.setPosition(x, y, 0);
  n.setScale(0.52, 0.52, 1);

  const sk = n.addComponent(sp.Skeleton);
  sk.skeletonData = data;
  sk.premultipliedAlpha = false;
  try {
    sk.setAnimation(0, 'Stand', true);
  } catch (e) {
    console.warn('[Spine] setAnimation Stand fail', e);
  }

  n.on(Node.EventType.TOUCH_END, () => {
    try {
      const entry = sk.setAnimation(1, 'Uh_Huh', false);
      if (entry) {
        sk.setTrackCompleteListener(entry, () => {
          sk.clearTrack(1);
        });
      }
    } catch (e) {
      console.warn('[Spine] Uh_Huh fail', e);
    }
  });

  return n;
}

function loadMeiNvSkeletonData(): Promise<sp.SkeletonData | null> {
  const paths = [
    'weihai/hall_res/1/spine/meiNv/MJ_weihai_MeiNv',
    'weihai/spine/meiNv/MeiNv',
  ];
  return new Promise((resolve) => {
    const tryNext = (i: number) => {
      if (i >= paths.length) {
        void loadMeiNvManual().then(resolve);
        return;
      }
      resources.load(paths[i], sp.SkeletonData, (err, data) => {
        if (!err && data) {
          console.log('[Spine] loaded', paths[i]);
          resolve(data);
        } else {
          tryNext(i + 1);
        }
      });
    };
    tryNext(0);
  });
}

/** 运行时拼 SkeletonData（Creator 尚未导入 spine-data 时的兜底） */
async function loadMeiNvManual(): Promise<sp.SkeletonData | null> {
  try {
    const [json, atlas, img] = await Promise.all([
      loadRes<JsonAsset>('weihai/spine/meiNv/MeiNv', JsonAsset),
      loadRes<TextAsset>('weihai/spine/meiNv/MeiNv', TextAsset),
      loadRes<ImageAsset>('weihai/spine/meiNv/MeiNv', ImageAsset),
    ]);
    if (!json || !atlas || !img) {
      // try hall_res originals
      const [j2, a2, i2] = await Promise.all([
        loadRes<JsonAsset>('weihai/hall_res/1/spine/meiNv/MJ_weihai_MeiNv', JsonAsset),
        loadTextAny(['weihai/hall_res/1/spine/meiNv/MJ_weihai_MeiNv']),
        loadRes<ImageAsset>('weihai/hall_res/1/spine/meiNv/MJ_weihai_MeiNv', ImageAsset),
      ]);
      if (!j2 || !a2 || !i2) return null;
      return buildSkeletonData(j2, a2, i2, 'MJ_weihai_MeiNv.png');
    }
    return buildSkeletonData(json, atlas.text, img, 'MeiNv.png');
  } catch (e) {
    console.warn('[Spine] manual load fail', e);
    return null;
  }
}

function buildSkeletonData(
  json: JsonAsset,
  atlasText: string,
  img: ImageAsset,
  textureName: string,
): sp.SkeletonData {
  const tex = new Texture2D();
  tex.image = img;
  const asset = new sp.SkeletonData();
  asset.skeletonJson = json.json as any;
  asset.atlasText = atlasText;
  asset.textures = [tex];
  asset.textureNames = [textureName];
  (asset as any)._uuid = `runtime-meinv-${textureName}`;
  return asset;
}

function loadRes<T extends JsonAsset | TextAsset | ImageAsset>(
  path: string,
  type: typeof JsonAsset | typeof TextAsset | typeof ImageAsset,
): Promise<T | null> {
  return new Promise((resolve) => {
    resources.load(path, type as any, (err, asset) => {
      resolve((!err && asset) ? (asset as T) : null);
    });
  });
}

function loadTextAny(paths: string[]): Promise<string | null> {
  return new Promise((resolve) => {
    // atlas may be TextAsset under same basename
    const p = paths[0];
    resources.load(p, TextAsset, (err, a) => {
      if (!err && a) { resolve(a.text); return; }
      resources.load(`${p}.atlas`, TextAsset, (err2, a2) => {
        resolve((!err2 && a2) ? a2.text : null);
      });
    });
  });
}
