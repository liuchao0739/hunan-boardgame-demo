# 湘桌平台能力

目标：在 **Skynet + Cocos 3.8** 上尽量齐备地方棋牌玩法与平台功能。

## 玩法（7）

| ID | 名称 | 说明 |
|----|------|------|
| `changsha_mj` | 长沙麻将 | 经典吃碰杠胡 |
| `xueliu_mj` | 血流成河 | 胡了继续，牌墙空结束 |
| `xuezhan_mj` | 血战到底 | 胡了出局 |
| `hongzhong_mj` | 红中麻将 | 红中癞子，无吃 |
| `shaoyang_phz` | 邵阳跑胡子 | 字牌叠列 + Phz 贴图 |
| `doudizhu` | 斗地主 | 飞机/连对/四带二等 + 记牌器 |
| `paodekuai` | 跑得快 | 同上牌型子集 + 记牌器 |

注册表：`server/lualib/game_catalog.lua` ↔ `client/.../GameCatalog.ts`

## 平台功能

| 能力 | 状态 |
|------|------|
| 一键开局 / 人机 | ✅ |
| 房号加入 | ✅ |
| 房卡（开房扣 1，新号 20） | ✅ |
| 俱乐部创建/列表/加入 | ✅ 内存版 |
| 战绩列表 / 回放数据 | ✅ `history` · 点「战绩」 |
| 快捷语音短语 | ✅ 牌桌顶栏 |
| 记牌器 | ✅ 扑克局点「记牌器」 |
| 热更脚手架 | ✅ `HotUpdateScaffold.ts`（默认关闭） |

## 素材

| 路径 | 来源 |
|------|------|
| `ui/Card2d/` | 口袋麻将 MIT + 自绘红中 |
| `ui/Phz/` | 自绘字牌 0–19 |
| `ui/Poker/` | 自生成 0–53 |
| `ui/lobby/` | 口袋大厅参考 |
| `ui/poker_anpu/` | 安铺 Apache-2.0 备份 |

## 参考未整仓并入

幼麟 / 贝密 / 威海：引擎过旧或授权需自核；结构见早期对照文档。

## 加玩法

1. `server/lualib/game/xxx.lua`  
2. `game_catalog.lua` + `GameCatalog.ts` + `Protocol.ts`  
3. `GameApp` 手牌分支  
4. 更新本表与 README  
