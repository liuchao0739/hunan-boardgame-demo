# 威海麻将 100% 还原路线图

蓝本：

| 仓 | 地址 | 技术 |
|----|------|------|
| 客户端 | [hjj2017/whmj.cocos2d_client](https://github.com/hjj2017/whmj.cocos2d_client) | Cocos Creator **2.4.5** · Bundle · TypeScript · Apache-2.0 |
| 服务端 | [hjj2017/whmj.java_server](https://github.com/hjj2017/whmj.java_server) | Java · proxyserver `:20480` + bizserver · MySQL + Redis · Apache-2.0 |

官方演示：http://cdn0001.afrxvk.cn/whmj/go.html  
本地连服：`?serverAddr=127.0.0.1:20480`

湘桌当前栈：**Cocos 3.8.8 + Skynet/Lua :9948**（三玩法：长沙麻将 / 邵阳跑胡子 / 斗地主）。

---

## 「100% 还原」含义（诚实拆解）

| 层级 | 能否 100% | 做法 |
|------|-----------|------|
| 大厅 UI 布局/素材 | ✅ 可逼近 | 按 `HallScene.fire` 节点坐标等比缩放，资源直接用 `hall/res` |
| 美女 Spine | ⚠️ 可迁 | 2.4 Spine → 3.8 需重导入；现用图集拼装立绘 + Uh_Huh |
| 牌桌 table 内核 | ✅ 可迁逻辑/资源 | 威海 `game/MJ_weihai_/script/table` 是展示内核 |
| 协议 Protobuf | ❌ 不宜整吞 | 威海 MsgBus≠湘桌 JSON；可对照字段，不换栈 |
| Java 服整仓替换 Skynet | ❌ 另开工程 | MySQL/Redis/双进程；与湖南多玩法 Demo 目标冲突 |

---

## 进度（2026-07-20）

### P0 — 大厅视觉
- [x] 全量拷贝 `hall/res` → `ui/weihai_hall` + `ui/lobby`
- [x] HallScene 主按钮区/顶栏/底栏坐标还原（1920×1080 等比）
- [x] BGM `BGMusic_Hall_`、点击音、Uh_Huh
- [x] MeiNv 位：完整立绘 `gamehall_maincharacter_fullbody`（**禁止** Spine 图集碎拼）+ Uh_Huh
- [x] 真 Spine `meiNv` 骨骼（`SpineFx` + PNG 回退）
- [x] MoreArea 滑出（设置关 BGM / 退出）
- [x] Creator 3.8 `sp.Skeleton` 播 Stand/Uh_Huh（失败回退立绘 PNG）

### P1 — 弹窗对齐威海
- [x] 加入房间：`JoinRoomDialog` 素材（背景/数字键/标题/关闭/重输/加入）+ 弹窗缩放动效
- [x] 好友房等待面板（房号 + 补机器人）
- [ ] 创建房间规则弹层（可继续简化为玩法胶囊）

### P2 — 牌桌对齐 `MJ_weihai_`
- [x] 风向盘 Pointer + 东南西北 + 倒计时 + 剩牌
- [x] 四座头像 / 弃牌区 / 右下操作钮 / 聊天
- [x] 吃碰杠胡 glow + 结算自摸/飘分
- [x] Spine `text` 特效（胡/碰字）+ Icon/glow 回退
- [x] table 内核：飞牌轨迹 + 可视牌墙

### P3 — 协议对照（不换栈）
- [x] 好友房 / 加入 / 人机 · `docs/NETWORK.md`
- [ ] 字段对照表 CreateRoom/JoinRoom ↔ 湘桌 JSON

### P4 —（可选）双轨跑通威海 Java 服
- 见下方「单独跑威海官方栈」

---

## 威海大厅节点树

```
Canvas (1920×1080)
├── BG / MeiNvPlace / TopPanel / MainButtonArea
│     ClubButton · CreateRoomButton · JoinRoomButton
├── BottomPanel（活动/客服/战绩/分享）
├── MoreArea（设置/退出）
└── SubViewPlaceHolder（加入房等弹窗）
```

截图：`docs/weihai_ref/screen_shoot_*.png`

---

## 本地资源落点

```
ui/lobby/           # 运行时大厅（含 hero_meinv）
ui/weihai_hall/      # hall/res 全量
ui/weihai_join/      # JoinRoomDialog 数字键/标题
ui/hud|ops|efx|seat|table/
audio/lobby/
docs/weihai_ref/
```

---

## 单独跑威海官方栈（学习用）

1. Clone [whmj.java_server](https://github.com/hjj2017/whmj.java_server)
2. MySQL：`mj_game` / `mj_log` / `mj_log_template` + 导入 `etc/sql/*`
3. Redis + `gen_user_id.py` / `gen_club_id.py`
4. 启动 proxyserver `:20480`、bizserver
5. 浏览器：http://cdn0001.afrxvk.cn/whmj/go.html?serverAddr=127.0.0.1:20480

与湘桌 Skynet **并行学习**，不要混进同一进程。

---

## 立刻验证

1. Cocos **刷新资源** → 预览大厅（应对 `screen_shoot_0`）
2. 点立绘听 Uh_Huh；点「更多」滑出设置
3. 点「加入房间」看威海数字键盘弹窗
4. 联机见 `docs/NETWORK.md`
