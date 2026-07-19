# 湘桌棋牌 · Cocos Creator 3.8.8 客户端

**可以做微信小游戏，也可以做 iOS/Android App。**  
详细步骤见 [BUILD.md](./BUILD.md)。

## 你现在要做的（装好 Creator 后）

```bash
# 1. 起 Skynet 服
cd ../server && ./run.sh

# 2. 打开本工程（装好 3.8.8 后）
./open-creator.sh
# 或：Creator → 打开其他 → 选本 client 目录
```

编辑器内：

1. 新建场景 `assets/scenes/Main.scene`，放 **Canvas**
2. Canvas 挂脚本 **`GameApp`**
3. `wsUrl` = `ws://127.0.0.1:9948`
4. 点预览 ▶

## 导出

| 产品形态 | 构建平台 | 本机工具 |
|----------|----------|----------|
| 微信里玩 | **微信小游戏** | 已装 `wechatwebdevtools.app` |
| 手机 App | Android / iOS | Android Studio / Xcode |
| 网页调试 | 预览 / Web Desktop | 浏览器 |

> 招聘 JD 说的「小程序 + App」，在 Cocos 里就是：**微信小游戏 + 原生 App** 两个构建目标，同一套前端代码。

## 目录

```
assets/scripts/
  scene/GameApp.ts    # 大厅+牌桌入口
  net/NetClient.ts    # WebSocket → Skynet
  net/Protocol.ts
  game/TileUtil.ts
BUILD.md              # 小游戏 / App 发布说明
open-creator.sh       # 一键打开工程
```
