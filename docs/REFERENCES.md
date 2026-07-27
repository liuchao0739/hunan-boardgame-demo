# 上游参考仓库

湘桌在架构与观感上参考以下三个开源项目。本地对照源码放在 `_refs/`（已 `.gitignore`，用脚本拉取）。

| 仓库 | 说明 | 本地路径 |
|------|------|----------|
| [whmj.cocos2d_client](https://github.com/hjj2017/whmj.cocos2d_client) | 威海麻将 Cocos 2.4.5 客户端（Bundle 模块化、牌桌内核） | `_refs/whmj.cocos2d_client` |
| [whmj.java_server](https://github.com/hjj2017/whmj.java_server) | 威海麻将 Java 服务端（proxyserver + bizserver、Protobuf） | `_refs/whmj.java_server` |
| [PocketMahjongClient](https://github.com/winktzhong/PocketMahjongClient) | 口袋麻将 Cocos Creator 3.x 客户端（仅前端，3D 牌桌体验） | `_refs/PocketMahjongClient` |

拉取/更新：

```bash
./scripts/update_refs.sh
```

## 与湘桌的对应关系

### 服务端

| 威海原版 | 湘桌 |
|----------|------|
| `proxyserver` WebSocket `:20480` | `server/service/ws_gate.lua` |
| `bizserver`（PASSPORT/HALL/GAME/CLUB…） | Skynet 服务：`passport.lua`、`room_mgr.lua`、`matchmaking.lua` 等 |
| `etc/protocol/*.proto` | `server/protocol/`（已 vendored） |
| Java 房间/算分逻辑 | `server/lualib/game/changsha_mj/`（长沙玩法，非威海规则） |
| 威海遗留兼容层 | `server/lualib/weihai/`（Protobuf 号段、codec，**非主线路**） |

**主协议**：JSON Envelope（[PROTOCOL_PLATFORM.md](./PROTOCOL_PLATFORM.md)）。威海 Protobuf 帧格式见 [PROTOCOL_WEIHAI.md](./PROTOCOL_WEIHAI.md)（已废弃于生产，保留对照）。

### 客户端

| 威海 / 口袋 | 湘桌（Cocos Creator 3.8.8） |
|-------------|----------------------------|
| `userlogin` 入口场景 | `assets/scenes/Login` + `login/LoginScene.ts` |
| `hall` Bundle | `hall/HallScene.ts`、`JoinRoomDialog.ts`、`CreateRoomDialog.ts` |
| `game/MJ_weihai_/script/table` 牌桌内核 | `game/TableLayout.ts`、`TableScene.ts`（长沙规则 + 口袋式中控台） |
| `MsgBus.ts` + `PbWire` Protobuf 帧 | `comm/MsgBus.ts`、`PbWire.ts`（遗留）；**主线** `comm/NetBus.ts` |
| `assets/.../weihai` 美术 | `assets/resources/weihai/`（大厅/牌桌/结算 UI、牌面、Spine） |
| 口袋麻将牌桌操作（上滑出牌、摸牌间距） | `TableScene.ts`、`TableLayout.ts` 注释与交互 |

引擎差异：威海为 **Creator 2.4.5**（`.fire` 场景、Bundle 按目录拆分）；湘桌为 **3.8.8**（`.scene`、单仓脚本 + `resources/weihai` 资源）。**不要**直接拷贝 2.x 场景，只对照逻辑与美术路径。

## 演示与截图

| 项目 | 地址 |
|------|------|
| 威海原版 H5 | http://cdn0001.afrxvk.cn/whmj/go.html |
| 口袋麻将 Web | http://magame.110x.com |
| 湘桌 | https://xiangzhuo.xiandan.me/ |

威海 UI 观感基线截图（phase9 验收对照）：[weihai_ref/](./weihai_ref/)（`screen_shoot_0`–`4`）。

## 维护约定

1. **协议**：以 `server/protocol/` 与 `_refs/whmj.java_server/etc/protocol`  diff；平台 JSON 变更只改 `PROTOCOL_PLATFORM.md`。
2. **美术**：新 UI 优先复用 `client/assets/resources/weihai/`；从 `_refs/whmj.cocos2d_client` 对照路径时留意 `@2x` 命名（见 [SCENE_SETUP.md](../client/SCENE_SETUP.md)）。
3. **牌桌交互**：对照 `_refs/whmj.cocos2d_client/.../table` 与 `_refs/PocketMahjongClient` 牌桌场景，保持内核（`TableLayout`）与操作层（`TableScene`）分离。
4. **升级任务**：商业能力对标见 [upgrade/REFERENCE.md](../upgrade/REFERENCE.md)；上游仓库仅作实现参考，不阻塞湘桌自己的 phase 进度。

## 许可

- 威海前后端：Apache-2.0（`whmj.*`）
- 口袋麻将：见上游仓库 README
- 湘桌衍生代码与文档：MIT（见根目录 README）
