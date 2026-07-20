# 口袋麻将对照清单（资源 / 命名 / 热更）

参考工程：[PocketMahjongClient](https://github.com/winktzhong/PocketMahjongClient)（Creator **3.7.4**，MIT）

本仓库已接入其 **2D 麻将牌面**（长沙麻将手牌/出牌），路径见下。

---

## 1. 目录怎么拆（对照）

| 口袋麻将 | 湘桌 Demo | 用途 |
|----------|-----------|------|
| `assets/Scene/{Login,Home,Mahjong,Main}` | `assets/scenes/Main.scene` | 场景；口袋拆登录/大厅/牌桌，湘桌暂合一 |
| `assets/Script/{Login,Home,Mahjong,Module,framework}` | `assets/scripts/{scene,net,game}` | 逻辑分层；口袋偏完整商业大厅 |
| `assets/resources/`（**Bundle**） | `client/assets/resources/` | 运行时 `resources.load` |
| `assets/resources/ui/Card2d/` | **已拷贝** 同路径 | 2D 牌面 PNG |
| `assets/Texture/home/` | `resources/ui/lobby/gamehall_*` 等 | 大厅立绘/入口图（已接） |
| `assets/resources/Audio/` | `resources/audio/game/` | 点牌/出牌等 SFX |
| `assets/Script/Module/hotUpdate/` | （未接） | 原生热更 |
| `assets/project.manifest` + `version.manifest` | （未接） | 热更清单 |
| `extensions/hot_update` | （未接） | Creator 扩展打清单 |

---

## 2. 牌面命名（已落地）

文件：`resources/ui/Card2d/{name}.png`  
加载：`resources.load('ui/Card2d/' + name + '/spriteFrame', SpriteFrame)`

| name | 含义 |
|------|------|
| `wan1` … `wan9` | 一万～九万 |
| `tiao1` … `tiao9` | 一条～九条 |
| `tong1` … `tong9` | 一筒～九筒 |
| `ziZhong` / `ziFa` / `ziBai` | 中发白 |
| `ziDong` / `ziNan` / `ziXi` / `ziBei` | 东南西北 |
| `back` / `kong` | 牌背 / 空 |
| `*_chibao` | 赤宝（日麻赤五，长沙可忽略） |

**湘桌 tile 映射**（`TileUtil.mjSpriteKey`）：

```
0–8  → wan1–9
9–17 → tiao1–9
18–26→ tong1–9
```

口袋内部协议 ID 不同（见其 `ScMapping.cardId_s2c`），**不要直接复用其 ID**，只复用 **文件名**。

---

## 3. 热更新（口袋做法 · 未接到湘桌）

仅 **原生包** 有效；Web 预览走整包。

1. 本地：`version.manifest` + `project.manifest`（资源 MD5 列表）
2. 运行时：`native.AssetsManager` 对比远端 manifest → 下载到可写目录 → 改 `searchPaths`
3. UI：`prefab/hotUpdate/HotUpdatePref` + `HotUpdateMgr`
4. 构建：Creator 扩展 `extensions/hot_update` 生成清单

湘桌若要热更：先做 **Android/iOS 包**，再抄口袋 `HotUpdateMgr` 流程；Skynet 服与热更无关。

---

## 4. 能抄 / 不要抄

| 可借鉴 | 原因 |
|--------|------|
| Card2d 牌面 + 命名 | MIT，已用于长沙麻将 |
| 大厅 Texture 分层、prefab 分模块 | 商业结构参考 |
| 热更 AssetsManager 流程 | 上线必备 |

| 暂不抄 | 原因 |
|--------|------|
| 3D 日麻牌桌 / 立直特效 | 玩法与栈不同 |
| Protobuf 协议整套 | 湘桌用 JSON WS |
| 俱乐部/商城/邮箱 | 超出 Demo 范围 |
| 跑胡子 / 斗地主牌面 | 口袋没有，需另找或自绘 |

---

## 5. 本地验证

1. Creator 3.8.8 打开 `client/`，确认 `resources` 为 Bundle
2. 启动 Skynet → 预览 → 开 **长沙麻将**
3. 手牌应为图片牌面（非纯文字块）

授权声明见仓库根目录 `THIRD_PARTY_NOTICES.md`。
