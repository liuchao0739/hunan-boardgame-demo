# 湘桌棋牌 · 长沙麻将 / 邵阳跑胡子 / 斗地主 / 跑得快

> **技术栈（对齐商业招聘）**  
> 后端：**Skynet + Lua** · 前端：**Cocos Creator 3.8.8** · 通信：**WebSocket JSON**  
> 玩法：长沙麻将 · 邵阳跑胡子 · 斗地主 · 跑得快 · **服务端权威**

仓库：[github.com/liuchao0739/hunan-boardgame-demo](https://github.com/liuchao0739/hunan-boardgame-demo)

---

## 效果预览

| 大厅 | 长沙麻将 |
|:---:|:---:|
| ![大厅](docs/screenshots/01-lobby.png) | ![长沙麻将](docs/screenshots/02-changsha-mj.png) |

| 邵阳跑胡子 | 斗地主 |
|:---:|:---:|
| ![邵阳跑胡子](docs/screenshots/03-shaoyang-phz.png) | ![斗地主](docs/screenshots/04-doudizhu.png) |

> Cocos Creator 3.8.8 预览 · Skynet Lua 权威 · 人机对战 · 素材见 `client/assets/resources/`

---

## 玩法一览

| ID | 名称 | 人数 | 说明 |
|----|------|------|------|
| `changsha_mj` | 长沙麻将 | 4 | 吃碰杠胡、七对、抓鸟；**口袋麻将 Card2d 牌面** |
| `shaoyang_phz` | 邵阳跑胡子 | 3 | 吃碰跑提、胡息；同牌叠列 |
| `doudizhu` | 斗地主 | 3 | 叫分 + 出牌；**扑克贴图** |
| `paodekuai` | 跑得快 | 3 | 16 张、♥3 先出；扑克贴图 |

扩展玩法：在 `server/lualib/game_catalog.lua` + `client/.../GameCatalog.ts` 注册即可。

---

## 架构

```
Cocos Creator 3.8.8 客户端（client/）
        │  WebSocket JSON
        ▼
Skynet ws_gate（多 agent）
        ▼
room_mgr ── room.lua ── game_catalog.lua
        ├── game/changsha_mj.lua
        ├── game/shaoyang_phz.lua
        ├── game/doudizhu.lua
        └── game/paodekuai.lua
```

| 模块 | 路径 |
|------|------|
| 玩法注册表 | `server/lualib/game_catalog.lua` |
| 麻将牌面 | `client/assets/resources/ui/Card2d/`（口袋麻将 MIT） |
| 扑克牌面 | `client/assets/resources/ui/Poker/`（自生成 0–53） |
| 大厅参考图 | `client/assets/resources/ui/lobby/`（口袋麻将） |
| 幼麟 UI 参考 | `client/assets/resources/ui/babykylin_hall/` · `ops/` |
| 安铺扑克备份 | `client/assets/resources/ui/poker_anpu/`（Apache-2.0） |

平台能力对照与开源参考：[`docs/PLATFORM.md`](docs/PLATFORM.md) · 口袋麻将对照：[`docs/POCKET_MAHJONG_REF.md`](docs/POCKET_MAHJONG_REF.md)

---

## 快速启动

### 1. Skynet

```bash
cd server && ./run.sh
# → 湘桌 Skynet WS :9948
```

### 2. Cocos

打开 `client/`（Creator 3.8.8）→ 预览 → 选玩法 → **一键开局**。  
加入房间：控制台 `window.__join="房号"` 后点「加入房间」。

---

## 协议摘要

客户端 → 服：`create_room` / `join_room` / `fill_bots` / `ready` / `action` / `chat`  
服 → 客户端：`hello`(含 games 列表) / `room_created` / `joined` / `state` / `chat` / `error`

---

## 说明

- 权威逻辑在 **Lua/Skynet**；`src/` 旧 TS 引擎仅对照单测。
- 牌型为可玩 Demo（斗地主/跑得快未覆盖全部商业变体）。
- 第三方素材声明：`THIRD_PARTY_NOTICES.md`。

## License

MIT（自有代码）；第三方资源见各自许可证。
