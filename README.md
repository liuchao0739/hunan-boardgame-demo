# 湖南棋牌 Demo · 长沙麻将 + 邵阳跑胡子

> **定位**：棋牌全栈技术演示（服务端权威玩法 + WebSocket 房间 + 人机对战）  
> **非求职主叙事**：主作品仍见 [commerce-ops-platform](https://github.com/liuchao0739/commerce-ops-platform)；本仓用于展示「子游戏玩法 / 状态机 / 实时同步」能力。  
> **合规**：娱乐规则 Demo，不含充值赌博；商用需版号与合规方案。

## 在线玩法

```bash
npm install
npm start
# 浏览器打开 http://localhost:3789
```

单人演示路径：**创建房间 → 补齐机器人 → 准备开始** → 点选/双击手牌出牌。

## 技术架构

```
浏览器牌桌 (HTML/CSS/JS)
        ↕ WebSocket JSON
Express 静态资源 + ws 网关
        ↓
Room（房间 / 准备 / 机器人）
        ↓
子游戏引擎（可插拔）
  ├─ changsha_mj  长沙麻将（4 人）
  └─ shaoyang_phz 邵阳跑胡子（3 人）
```

与常见招聘栈的对应关系：

| 本 Demo | 生产常见栈（如 JD） |
|--------|-------------------|
| 浏览器牌桌 | Cocos Creator 3.8 小程序/App |
| Node.js + `ws` | Skynet + Lua |
| 内存房间态 | Redis 房间快照 + MySQL 战绩 |
| TypeScript 玩法模块 | Lua 子游戏脚本 |

**核心相同点**：服务器权威判定；客户端只发意图、收快照。

## 已实现能力

### 长沙麻将
- 108 张（万条筒）、庄闲发牌、出牌 / 吃碰杠 / 接炮与自摸
- 七对、标准 3N+2 胡牌判定
- 简化抓鸟（1/5/9 中鸟加番）与结算
- 4 人桌 + 机器人

### 邵阳跑胡子
- 80 张字牌、三人场、出牌 / 吃碰跑提
- 顺子吃 + 二七十、胡息门槛（Demo 默认 ≥15）
- 3 人桌 + 机器人

### 工程
- 房间创建 / 加入、准备开局、断线提示
- `npm test` 覆盖胡牌与开局发牌

## 目录

```
src/engine/mahjong/   长沙麻将引擎
src/engine/paohuzi/   邵阳跑胡子引擎
src/server/           HTTP + WebSocket 房间服
src/shared/           协议类型
public/               牌桌前端
tests/                引擎单测
```

## 说明与边界

- 规则按湖南常见**简化房规**实现，各地细则（鸟分、臭偎、醒等）未全覆盖，便于演示与单测。
- 机器人策略为规则优先随机，非竞技 AI。
- 刷新页面会丢座位绑定（Demo 未做重连票据）；生产需 session + 房间快照。

## License

MIT
