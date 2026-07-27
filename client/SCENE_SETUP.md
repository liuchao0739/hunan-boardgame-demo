# Cocos Creator 3.8.8 场景绑定（按实操修正）

> 适用版本：**Creator 3.8.8**（中文界面）。  
> 场景必须在编辑器里手动建；`assets/scenes/` 一开始可能是空文件夹，没有现成 `.scene` 可选。

---

## 0. 打开项目

1. Cocos Dashboard → 双击本仓库的 `client`（或已改名的 weihai-mahjong）。
2. 确认引擎版本 **3.8.8**。
3. 资源里应有：

```
assets/scripts/
  comm/NetBus.ts          ← 主线 JSON 总线
  comm/MsgBus.ts, PbWire.ts  ← 威海 Protobuf 遗留对照
  login/LoginScene.ts
  hall/HallScene.ts
  game/TableScene.ts
assets/scenes/          ← 可能是空的，正常
```

---

## 1. 创建 Login 场景文件

1. 资源管理器右键 `assets/scenes` → **创建 → 场景**。
2. 命名为 **`Login`**（文件名必须是 `Login`，后面 `loadScene('Hall')` 同理靠文件名）。
3. **双击** `Login` 打开。  
   层级里默认只有 `Main Light` / `Main Camera`（3D 空场景），正常。

> 不要用顶部未保存的 **Untitled**；始终打开 `assets/scenes/Login`。

---

## 2. 加 Canvas（没有「创建渲染根节点」）

3.8.8 **没有**「创建渲染根节点」这几个字。

1. 在层级管理器空白处右键 → **创建 → UI 组件 → Canvas**。  
2. 会出现 `Canvas`（一般自带 UI 用的 `Camera`）。
3. 原来的 `Main Light`、旧 `Main Camera` 可删掉（可选）。

---

## 3. 在 Canvas 下加控件（菜单是中文名）

右键 **Canvas** → **创建**，按类型选不同子菜单：

| 目标节点名 | 菜单路径（3.8.8 实操） |
|------------|------------------------|
| `StatusLabel` | **2D 对象 → Label**（Label **不在**「UI 组件」里） |
| `NameEdit` | **UI 组件 → 输入框**（即 EditBox） |
| `ServerEdit` | **UI 组件 → 输入框** |
| `LoginBtn` | **UI 组件 → 按钮**（即 Button） |

建好后在层级里**改节点名**（大小写一致）。

> 新建控件默认都在中心 `(0,0)`，预览会叠成一团。`LoginScene` 脚本会在 `onLoad` 里自动排开；也可在编辑器里手动改 Position，例如：
> StatusLabel `y=120`、NameEdit `y=40`、ServerEdit `y=-40`、LoginBtn `y=-130`。

推荐层级（两种都行）：

**写法 A（脚本挂在子节点，实操常用）：**

```
Canvas
└─ LoginScene          ← 空节点，下面挂脚本；控件也可放它下面
   ├─ StatusLabel
   ├─ NameEdit
   ├─ ServerEdit
   └─ LoginBtn
```

**写法 B（脚本直接挂 Canvas）：**

```
Canvas                 ← 挂 LoginScene 脚本
├─ Camera
├─ StatusLabel
├─ NameEdit
├─ ServerEdit
└─ LoginBtn
```

---

## 4. 挂 LoginScene 脚本 + 拖属性

1. 新建空节点并命名 `LoginScene`，或直接选中要挂脚本的节点（Canvas / LoginScene 节点均可）。
2. 把 `assets/scripts/login/LoginScene` **拖到该节点上**，  
   或选中节点 → 右侧 **添加组件** → 搜 **`LoginScene`**。
3. 选中**挂了脚本的那个节点**，右侧应看到三个槽，从层级拖入：

| 槽名 | 拖哪个节点 |
|------|------------|
| Status Label | `StatusLabel` |
| Name Edit | `NameEdit` |
| Server Edit | `ServerEdit` |

> 若点 Canvas 看不到这三个槽：脚本挂在子节点 `LoginScene` 上——去选那个子节点看 Inspector。

---

## 5. 绑登录按钮 Click Events（关键）

1. 选中 **LoginBtn**。
2. 右侧 **cc.Button → Click Events**：把数量从 `0` 改成 **`1`**。
3. 三个格子这样填：

| 格子 | 填什么 |
|------|--------|
| 第 1 格（节点） | 拖 **挂了 LoginScene 脚本的那个节点**（若脚本在子节点上，就拖 **`LoginScene` 节点**，**不要拖 Canvas**） |
| 第 2 格（组件） | 选 **`LoginScene`**（不要选 `cc.Canvas` / `cc.UITransform`） |
| 第 3 格（方法） | 选 **`onClickLogin`** |

### 常见卡点

下拉里只有 `cc.UITransform` / `cc.Canvas` / `cc.Widget`、没有 `LoginScene`：

- 第 1 格拖错了节点（拖成了 Canvas，但脚本在子节点上）。
- 或脚本还没真正加到节点上：选中目标节点确认 Inspector 底部有 `LoginScene` 组件。

`Cmd+S` 保存场景。

---

## 6. 「启动场景」在哪（3.8.8 没有这个名字）

**项目 → 项目设置 → 项目数据** 里：

- **没有**「启动场景」。
- 有的是 **「默认编辑场景」**：把资源里的 **`assets/scenes/Login`（.scene 文件）** 拖进去。  
  - **不要**拖层级里的 `LoginScene` 节点。  
  - **不要**拖 `LoginScene.ts` 脚本。

**预览怎么进 Login：**  
打开 `Login.scene` → 点编辑器上方 **预览/运行**。预览默认跑**当前打开的场景**。

**以后打包：** 右上角 **构建发布** → 在构建面板里设初始场景 / 勾选参与构建的场景。

---

## 7. 创建 Hall 场景

1. `assets/scenes` 右键 → **创建 → 场景** → 命名 **`Hall`**，双击打开。
2. 同样：**UI 组件 → Canvas**。
3. 加控件：

| 节点名 | 怎么建 |
|--------|--------|
| `InfoLabel` | 2D 对象 → Label |
| `RoomLabel` | 2D 对象 → Label |
| `JoinEdit` | UI 组件 → 输入框 |
| `CreateBtn` | UI 组件 → 按钮 |
| `JoinBtn` | UI 组件 → 按钮 |
| `PrepareBtn` | UI 组件 → 按钮 |

4. 挂 `HallScene` 脚本（挂在 Canvas 或名为 `HallScene` 的空节点均可），拖属性：

| 槽 | 节点 |
|----|------|
| Info Label | InfoLabel |
| Room Label | RoomLabel |
| Join Edit | JoinEdit |

5. **按钮**：脚本会在运行时自动按节点名 `CreateBtn` / `JoinBtn` / `PrepareBtn` 绑点击并排版，**可不配 Click Events**。  
   若仍想手绑：第 1 格拖挂了 `HallScene` 的节点，方法分别为 `onClickCreate` / `onClickJoin` / `onClickPrepare`。

6. JoinEdit 的 **Max Length** 建议改成 `16`（脚本也会自动设）。

保存。预览请走 **Login → 登录 → 自动进 Hall**（不要单独预览 Hall，否则 WebSocket 未连接）。登录成功后脚本会 `loadScene('Hall')`，场景文件名必须是 `Hall`。

---

## 8. 创建 Table 场景

1. 新建场景 **`Table`**，加 Canvas。
2. 控件：

| 节点名 | 怎么建 |
|--------|--------|
| `HandLabel` | 2D 对象 → Label |
| `TipLabel` | 2D 对象 → Label |
| `DiscardBtn` | UI 组件 → 按钮 |
| `PengBtn` | UI 组件 → 按钮 |

3. 挂 `TableScene`，拖 Hand Label / Tip Label。
4. Click Events（第 1 格 = 挂了脚本的节点）：

| 按钮 | 方法 |
|------|------|
| DiscardBtn | `onClickDiscardFirst` |
| PengBtn | `onClickPeng` |

保存。

---

## 9. 联调

1. 终端：`cd server && ./run.sh`（`ws://0.0.0.0:20480`）。
2. Creator 打开 `Login` → 预览。
3. 填昵称 → 点登录 → 应显示登录成功并切到 Hall（Hall 未建时会报场景缺失，正常）。
4. Hall：创建房间 / 加入 / 准备；需要两路预览测对局。

按钮没反应：检查 Click Events 第 1 格是否拖对「挂脚本的节点」，第 2 格是否为脚本类名。

---

## 10. 菜单速查（3.8.8）

| 你想要的 | 实际点哪里 |
|----------|------------|
| Canvas | 创建 → **UI 组件 → Canvas** |
| Label | 创建 → **2D 对象 → Label** |
| EditBox | 创建 → **UI 组件 → 输入框** |
| Button | 创建 → **UI 组件 → 按钮** |
| 默认打开哪个场景 | 项目设置 → 项目数据 → **默认编辑场景** ← 拖 `.scene` |
| 预览进 Login | 打开 Login.scene 再点预览 |
| 打包初始场景 | **构建发布** 面板 |

## 11. 关于美术（为什么一开始灰屏只有字）

素材**已经在工程里**：

```
assets/resources/weihai/hall_res/   ← 大厅图
assets/resources/weihai/table_res/ ← 牌桌/牌面图
```

但 Login / Hall / Table 场景是手搭的**纯 UI（Label + Button）**，**不会自动把图铺上去**。  
文档里「美术可选」的意思是：素材可用，需拖进场景，或用脚本 `resources.load` 加载。

当前脚本会自动挂背景（路径 `resources/weihai/bg/hall`、`table`，无 `@` 文件名）：

- Login / Hall → `weihai/bg/hall`
- Table → `weihai/bg/table`

> 原版文件名带 `@2x` 时，`resources.load` 会把 `@` 当成子资源分隔符导致失败，所以拷了一份到 `weihai/bg/`。

### 观感说明（重要）

「100% 长得一样」= 原版 2.x 整页 UI。当前进度：

- 大厅：**Spine 立绘**（`Stand` / 点击 `Uh_Huh`），底栏 + 亲友圈入口
- 出牌：**上滑或双击**手牌（无出牌按钮）
- 荒庄：牌墙摸完弹出「荒庄（臭了）」遮罩，可回大厅
- 创建房间自动 3 机器人

预览前：Creator 刷新 `weihai/spine/meiNv`；若立绘不显示，项目设置 → 功能裁剪 **勾选 Spine**。重启 `server/run.sh`。
