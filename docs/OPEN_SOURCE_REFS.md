# 开源棋牌仓库对照（素材 / 结构 / 能抄什么）

目标：用社区「接近商业完整版」的开源工程，把湘桌大厅做到 **素材够、动效够、声音够** 的演示水准。  
结论先说：**素材量足够做出远超当前灰框大厅的商业感 Demo**；要到腾讯麻将同级（全套 Spine/粒子/运营活动/原生包打磨）仍是产品工期，不是「拷仓库即完成」。

本地对照克隆（开发机 `/tmp`，不进本仓库）：

| 仓库 | 本地路径 |
|------|----------|
| 幼麟四川麻将 | `/tmp/babykylin_scmj` |
| 大圣棋牌 | `/tmp/chess` |
| 口袋麻将 | `/tmp/PocketMahjongClient` |
| 威海麻将客户端 | `/tmp/whmj.cocos2d_client` |

---

## 总览

| # | 项目 | 仓库 | 引擎 | 对湘桌最有用 |
|---|------|------|------|----------------|
| 1 | **幼麟棋牌**（首选完整教学案） | [gitee.com/qilinzi/babykylin_scmj](https://gitee.com/qilinzi/babykylin_scmj) · [github.com/babykylin/babykylin_scmj](https://github.com/babykylin/babykylin_scmj) | Creator **2.0.6** + Node | 完整大厅 UI、牌面、音效、登录/开房/回放流程 |
| 2 | **大圣棋牌** | [github.com/WhoIsYourBaby/chess](https://github.com/WhoIsYourBaby/chess) | Pomelo + Creator | 大厅/房间平台骨架；素材完整度弱于幼麟 |
| 3 | **贝密棋牌 Beimi** | 社区多 fork（Gitee 常需登录） | 偏旧 Java/Node + 前端 | 麻将/斗地主/德州「整盘业务」对照；版权与维护需自核 |
| 4 | **口袋麻将** | [github.com/winktzhong/PocketMahjongClient](https://github.com/winktzhong/PocketMahjongClient) | Creator **3.7+** / TS / 3D | **与湘桌引擎最近**；Card2d、大厅 Texture、热更、音效 |
| 5 | **威海麻将** | [github.com/hjj2017/whmj.cocos2d_client](https://github.com/hjj2017/whmj.cocos2d_client) | Creator **2.4.5** Bundle | **商业资源目录范本**：`img` / `audio` / `spine` |

湘桌栈：**Skynet + Cocos 3.8.8**。优先吃 **口袋（3.x）素材路径** + **威海大厅图/音效**；幼麟/威海的 Spine 需按 3.x 重导，不能整仓粘贴。

---

## 1. 幼麟棋牌 `babykylin_scmj`

**是什么：** 成都幼麟官方教学向四川麻将整包（登录、建房、牌桌、回放、聊天等）。

**关键目录：**

| 路径 | 用途 |
|------|------|
| `client/assets/resources/textures/hall/` | 大厅贴图 |
| `client/assets/resources/sounds/` | BGM / 点击等 |
| `client/assets/scenes/hall.fire` | 大厅场景（2.x） |
| `client/assets/scripts/components/Hall.js` | 大厅逻辑参考 |
| `server/` | Node 大厅/游戏服（勿与 Skynet 混用） |

**湘桌已用 / 可继续用：**

- 大厅碎片：`client/assets/resources/ui/babykylin_hall/`
- 操作条参考：`ui/ops/`
- BGM：`audio/lobby/bgMain.mp3`（来自幼麟 sounds）

**注意：** 锁 2.0.6，Prefab/场景不能直接开进 3.8；只抽 **PNG/MP3** 与交互流程。

---

## 2. 大圣棋牌 `WhoIsYourBaby/chess`

**是什么：** Pomelo 大厅式棋牌平台，偏二次开发学习。

**关键目录：** `client_cocos/`、`game-server/`、`web-server/`

**对湘桌：** 学「大厅 → 进房 → 牌桌」模块划分即可；**素材丰富度不如幼麟/威海**，本仓库未整仓拷贝美术。

---

## 3. 贝密棋牌 Beimi

**是什么：** 社区常用「麻将 + 斗地主 + 德州」完整参考。

**对湘桌：** 业务状态机、俱乐部/房卡概念可对照；技术栈与授权需自行核实后再拷资源。  
**本仓库未直接 vendoring**（拉取常遇鉴权失败）。

---

## 4. 口袋麻将 `PocketMahjongClient`（引擎最接近）

**是什么：** 偏日麻的开源平台；大厅/房间/结算截图齐全；MIT。

**详细对照：** 见 [`POCKET_MAHJONG_REF.md`](./POCKET_MAHJONG_REF.md)

**湘桌已落地：**

| 口袋路径 | 湘桌路径 |
|----------|----------|
| `assets/resources/ui/Card2d/` | `resources/ui/Card2d/` |
| `assets/Texture/home/` 等 | `resources/ui/lobby/gamehall_*`、`home_bg_v2` 等 |
| `assets/resources/Audio/` | `resources/audio/game/`（点牌/出牌等） |
| 热更设计 | `HotUpdateScaffold.ts`（默认关） |

**视觉：** 3.7+ 观感新，适合继续补大厅分层与 3D 桌（非湖南玩法可不必跟）。

---

## 5. 威海麻将 `whmj.cocos2d_client`（商业目录范本）

**是什么：** 地方麻将客户端；Bundle 里 **img / audio / spine** 分得很清楚。

**关键目录：**

```
assets/hall/res/{0,1}/img|audio|spine
assets/game/MJ_weihai_/res/{0,1}/img|audio|spine
assets/club|createroom|record|chat|.../res/...
```

**湘桌已落地：**

| 用途 | 路径 |
|------|------|
| 大厅大背景、建房/加入/底栏按钮 | `resources/ui/lobby/HallSceneBG.jpg`、`btn_create_room.png` 等 |
| 完整按钮备份 | `resources/ui/weihai_hall/` |
| 大厅 BGM / 点击音 | `resources/audio/lobby/BGMusic_Hall_.mp3`、`ButtonClicked_*.mp3` |

**Spine：** `hall/res/1/spine`、`MJ_weihai_/res/1/spine` 是「腾讯感」动效主来源之一；Creator 2.4 → 3.8 需重导出，**尚未整包迁入**（体量大、格式不兼容）。下一阶段可单条特效（胡牌/开局）试点接入。

---

## 湘桌当前资源落点

```
client/assets/resources/
  ui/Card2d/          # 口袋 MIT 麻将面 + 自绘红中
  ui/Phz/             # 自绘跑胡子
  ui/Poker/           # 自生成扑克
  ui/lobby/           # 口袋立绘/入口 + 威海大厅 BG/按钮
  ui/table/           # 麻将/扑克桌布
  ui/seat/            # 座位框 / 庄标
  ui/ops/             # 吃碰杠胡过按钮（威海）
  ui/efx/             # 胡牌 glow / 胜负标
  ui/weihai_hall/     # 威海大厅图备份
  ui/babykylin_hall/  # 幼麟碎片
  audio/lobby/        # 威海/幼麟 BGM、点击
  audio/game/         # 麻将 BGM、出牌、吃碰杠胡
  ui/efx/guafeng/     # 胡牌刮风序列帧（幼麟）
  ui/efx/rain/        # 流局/雨序列帧
  spine/meinv|text/   # 威海 Spine 源文件（待 Creator 3.x 正式导入）
```

运行时加载：`GameApp.makeSpriteNode` 优先 `…/spriteFrame`，失败则用 `ImageAsset` 建 `SpriteFrame`（避免 Texture-only meta 导致大厅「全黑」）。

音效：`client/assets/scripts/game/Sfx.ts`

---

## 「腾讯麻将那种效果」可达性

| 维度 | 开源仓库是否够 | 湘桌现状 | 下一步 |
|------|----------------|----------|--------|
| 大厅 | 威海三键结构：立绘左 + 玩法胶囊 + 俱乐部/创建/加入 + 底栏 |
| 牌桌 | 威海 2D：风向盘、四座头像、中心弃牌、右下操作钮 |
| 牌面 | ✅ 口袋麻将够 | 麻将已接；扑克/字牌自绘 | 持续换皮 |
| 点击/BGM | ✅ 威海 + 口袋够 | `Sfx` + 大厅 BGM | 按操作补齐吃碰杠胡音 |
| Spine/粒子/全屏特效 | ⚠️ 威海有，要迁 3.x | 未接 | 单特效试点 |
| 运营级活动页/商城动效 | ❌ 需自研或商用包 | 无 | 非 Demo 必需 |

**判断：** 截图二里的仓库 **素材够支撑「高丰富度商业 Demo 大厅」**；「完全等于腾讯麻将」还要 Spine 迁移动效管线 + 大量打磨，属于后续里程碑，不是缺仓库。

---

## 授权与合规

- 口袋：MIT（见 `THIRD_PARTY_NOTICES.md`）
- 幼麟 / 威海 / 大圣 / 贝密：以各仓库 LICENSE 与作者声明为准；商用前自行复核
- 本仓库自有代码：MIT；第三方资源勿删归属说明

---

## 建议克隆命令（本机对照，勿强行 commit 进 git）

```bash
cd /tmp
git clone --depth 1 https://github.com/babykylin/babykylin_scmj.git
git clone --depth 1 https://github.com/WhoIsYourBaby/chess.git
git clone --depth 1 https://github.com/winktzhong/PocketMahjongClient.git
git clone --depth 1 https://github.com/hjj2017/whmj.cocos2d_client.git
# 贝密：按你找到的 Gitee/GitHub fork 自行 clone
```
