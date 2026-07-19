# 湘桌棋牌 · Cocos Creator 3.8.8 客户端

## 环境

1. 安装 [Cocos Creator **3.8.8**](https://www.cocos.com/creator-download)（与招聘 JD 对齐）
2. 先启动 Skynet 服：

```bash
cd ../server && ./run.sh
# 监听 ws://0.0.0.0:9948
```

## 打开工程

1. Creator 启动页 → **打开其他项目** → 选择本目录 `client/`
2. 新建场景 `assets/scenes/Main.scene`
3. 创建空节点挂 `Canvas`（或使用 2D 模板）
4. 将 `assets/scripts/scene/GameApp.ts` 挂到 Canvas
5. 属性检查器中 `wsUrl` 保持 `ws://127.0.0.1:9948`
6. 点击预览 ▶

## 目录

```
assets/scripts/
  net/Protocol.ts     # 与 Skynet JSON 协议
  net/NetClient.ts    # WebSocket
  game/TileUtil.ts    # 牌面
  scene/GameApp.ts    # 大厅 + 牌桌（运行时 UI）
```

## 构建目标

| 目标 | 说明 |
|------|------|
| 浏览器预览 | 开发调试 |
| 微信小游戏 | 构建面板选 WeChat Mini Game |
| App | Android / iOS |

美术资源（牌面图集、特效、音效）可后续替换 `GameApp.makeTileNode` 为 Sprite 图集，无需改协议与服逻辑。
