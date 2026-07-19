# 湘桌棋牌 · 长沙麻将 + 邵阳跑胡子

> **技术栈（对齐商业招聘）**  
> 后端：**Skynet + Lua** · 前端：**Cocos Creator 3.8.8** · 通信：**WebSocket JSON**  
> 玩法：长沙麻将（4 人）/ 邵阳跑胡子（3 人）· **服务端权威**

仓库：[github.com/liuchao0739/hunan-boardgame-demo](https://github.com/liuchao0739/hunan-boardgame-demo)

---

## 架构

```
Cocos Creator 3.8.8 客户端（client/）
        │  WebSocket JSON
        ▼
Skynet ws_gate（多 agent）
        ▼
room_mgr ── room.lua
        ├── game/changsha_mj.lua
        └── game/shaoyang_phz.lua
```

| 模块 | 路径 | 说明 |
|------|------|------|
| Skynet 框架 | `server/skynet/` | cloudwu/skynet，已支持 macOS 编译 |
| 业务配置 | `server/config` | `ws_port=9948` |
| 网关 | `server/service/ws_gate.lua` | WebSocket 接入 |
| 房间 | `server/service/room_mgr.lua` + `lualib/room.lua` | 座位/机器人/广播 |
| 长沙麻将 | `server/lualib/game/changsha_mj.lua` | 吃碰杠胡、七对、抓鸟 |
| 邵阳跑胡子 | `server/lualib/game/shaoyang_phz.lua` | 吃碰跑提、胡息 |
| Cocos 客户端 | `client/` | Creator 3.8.8 工程 |
| Web 预览壳 | `public/` | 同协议调试 UI（非生产前端） |

---

## 快速启动

### 1. 启动 Skynet 服（必须）

```bash
cd server
./run.sh
# → ========== 湘桌 Skynet WS :9948 ==========
```

### 2a. Cocos 客户端（正式前端）

1. 安装 **Cocos Creator 3.8.8**
2. 打开工程目录 `client/`（见 `client/README.md`）
3. 挂载 `GameApp` 到 Canvas，预览

### 2b. Web 预览（无 Creator 时调试协议）

另开终端：

```bash
# 需已 npm install（仓库根目录）
npx serve public -l 3789
# 浏览器打开 http://127.0.0.1:3789
# 右上角应显示「已连接 · Skynet」
```

流程：选玩法 → 创建房间 → 补齐机器人 → 准备开始。

---

## 协议摘要

客户端 → 服：`create_room` / `join_room` / `fill_bots` / `ready` / `action`  
服 → 客户端：`hello` / `room_created` / `joined` / `state` / `error`

`state` 内含手牌（仅自己）、副露、牌河、可操作列表、结算信息。

---

## 与 Node 旧 Demo 的关系

早期 Node/TS 引擎保留在 `src/` 作单测与对照；**线上权威逻辑以 Lua/Skynet 为准**。  
根目录 `npm test` 仍可跑 TS 引擎单测。

---

## 商业化差距（诚实说明）

本仓库已是 **可运行的 Skynet + Cocos 工程骨架 + 完整双玩法状态机**，不是「假 README」。  
与上线产品仍差：精美牌面/骨骼动画、微信登录、支付与房卡、Redis/MySQL 持久化、断线重连票据、反作弊、版号合规。可按模块继续迭代。

## License

MIT
