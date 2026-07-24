# Cocos Creator 3.8.8 场景绑定（逐步说明）

> 你现在在 **Cocos Dashboard** 的「项目」页，看到名为 `client`、引擎 **Creator 3.8.8** 的项目。  
> 场景绑定必须在 **Creator 编辑器**里做，不能只看 Dashboard。

---

## 0. 打开编辑器

1. 在 Dashboard「项目」列表里，**双击** `client`（路径应是 `/Users/liuchao/hunan-boardgame-demo/client`）。
2. 等待 Creator 打开。左侧是 **资源管理器 (Assets)**，中间是 **层级管理器 (Hierarchy) / 场景**，右侧是 **属性检查器 (Inspector)**。
3. 若提示升级/打开失败：确认 Dashboard 里该项目版本是 **3.8.8**（与截图一致即可）。

---

## 1. 确认脚本已存在

在左侧 Assets 中展开：

```
assets/scripts/
  comm/MsgBus.ts, PbWire.ts
  login/LoginScene.ts
  hall/HallScene.ts
  game/TableScene.ts
```

没有这些文件就先别建场景。有的话继续。

---

## 2. 创建 Login 场景（启动场景）

### 2.1 新建场景文件

1. 在 Assets 里右键 `assets` → **创建 → Scene**，命名为 `Login`（保存到例如 `assets/scenes/Login.scene`，没有 `scenes` 文件夹就先新建）。
2. 双击打开 `Login` 场景。

### 2.2 搭节点树

默认会有 `Canvas`、`Camera` 等。在 **Hierarchy** 里按下面搭（名称必须一致，脚本靠名字找/靠拖拽绑定）：

```
Login（可把根 Canvas 父节点改名，或新建空节点）
└─ Canvas
   ├─ StatusLabel     ← Label（显示连接状态）
   ├─ NameEdit        ← EditBox（昵称）
   ├─ ServerEdit      ← EditBox（服务器，默认 127.0.0.1:20480）
   └─ LoginBtn        ← Button（登录按钮）
```

操作提示：

- 右键 Canvas → **创建 → UI 组件 → Label / EditBox / Button**。
- **改节点名**：选中节点，在 Hierarchy 里点名字改成上面这些（大小写一致）。

### 2.3 挂 LoginScene 脚本

1. 选中 **Canvas**（或你放脚本的根节点，建议 Canvas）。
2. 右侧 Inspector 底部 **添加组件 → 自定义脚本 → LoginScene**（或把 `LoginScene.ts` 拖到 Inspector）。
3. 把节点拖到脚本属性槽：

| 脚本属性 (Inspector) | 拖哪个节点 |
|----------------------|------------|
| Status Label         | `StatusLabel` |
| Name Edit            | `NameEdit` |
| Server Edit          | `ServerEdit` |

### 2.4 绑定登录按钮点击

1. 选中 `LoginBtn`。
2. Inspector 找到 **Button → Click Events**，把 Size 设为 `1`。
3. 把挂了 `LoginScene` 的节点（Canvas）拖进事件的第一个槽（cc.Node）。
4. 组件下拉里选 **LoginScene**。
5. 方法选 **`onClickLogin`**。

### 2.5 设为启动场景

菜单 **项目 → 项目设置 → 功能裁剪/项目数据**（或 **Project → Project Settings → Project Data**）→ **启动场景** 选 `Login`。  
保存场景：`Cmd+S`。

---

## 3. 创建 Hall 场景

1. Assets 右键 → 创建 Scene → 命名 `Hall`，打开。
2. 节点建议：

```
Canvas
├─ InfoLabel      ← Label（玩家信息）
├─ RoomLabel      ← Label（房间状态）
├─ JoinEdit       ← EditBox（输入房间号）
├─ CreateBtn      ← Button（创建房间）
├─ JoinBtn        ← Button（加入）
└─ PrepareBtn     ← Button（准备）
```

3. 给 Canvas 添加组件 **HallScene**，拖属性：

| 属性 | 节点 |
|------|------|
| Info Label | InfoLabel |
| Room Label | RoomLabel |
| Join Edit | JoinEdit |

4. 三个按钮的 Click Events：

| 按钮 | 组件 | 方法 |
|------|------|------|
| CreateBtn | HallScene | `onClickCreate` |
| JoinBtn | HallScene | `onClickJoin` |
| PrepareBtn | HallScene | `onClickPrepare` |

每个按钮都要把挂了 HallScene 的节点拖进 Click Event 的 Node 槽。保存。

---

## 4. 创建 Table 场景

1. 新建 Scene `Table` 并打开。
2. 节点建议：

```
Canvas
├─ HandLabel      ← Label（手牌）
├─ TipLabel       ← Label（提示）
├─ DiscardBtn     ← Button（出牌）
└─ PengBtn        ← Button（碰）
```

3. Canvas 添加 **TableScene**，绑定：

| 属性 | 节点 |
|------|------|
| Hand Label | HandLabel |
| Tip Label | TipLabel |

4. 按钮：

| 按钮 | 方法 |
|------|------|
| DiscardBtn | `onClickDiscardFirst` |
| PengBtn | `onClickPeng` |

保存。

---

## 5. 场景怎么互相跳转

- 登录成功后脚本会 `director.loadScene('Hall')` → 场景资源名必须是 **`Hall`**（文件名一致）。
- 开局后你可在 Hall 里再加跳转，或手动菜单 **场景 → 运行** 测 Login。

建议在 **Build Settings / 项目设置** 里把 `Login`、`Hall`、`Table` 都加入场景列表。

---

## 6. 美术资源（可选）

仓库里已有：

```
assets/resources/weihai/hall_res/
assets/resources/weihai/table_res/
```

在场景里用 **Sprite** 拖图片即可；布局可对照 `_refs/whmj.cocos2d_client`（那是 2.x，只能看布局，不能直接打开 `.fire`）。

---

## 7. 联调检查清单

1. 终端跑服务端：`cd server && ./run.sh`（监听 `20480`）。
2. Creator 点 **预览 / 运行**，应进 Login。
3. 填昵称 → 点登录 → 状态应变「登录成功」并切到 Hall。
4. 创建房间 → 准备；第二台浏览器/手机预览用另一昵称加入同一房号。

若按钮没反应：99% 是 **Click Events 没绑方法**，或绑到了错误节点。

---

## 8. 对照你 Dashboard 截图

| 截图里看到的 | 含义 |
|--------------|------|
| 项目名 `client` | 就是本仓库客户端根目录 |
| Creator **3.8.8** | 正确，用这个打开 |
| 描述里还有「口袋麻将」字样 | 仅显示名，可在 Dashboard 改项目备注；不影响场景绑定 |
| 「3 天前」 | 上次打开时间；双击即可再进编辑器 |

**下一步：双击 `client` → 按第 2～4 节建三个场景并绑按钮。**
