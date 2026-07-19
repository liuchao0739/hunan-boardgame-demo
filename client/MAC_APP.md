# Mac App / 桌面端构建备忘

Cocos Creator 3.8.8 可直接发布 **macOS App**（以及 iOS / Android / 微信小游戏）。

## 构建步骤（装好 Creator 后）

1. 打开工程 `hunan-boardgame-demo/client`
2. 菜单 **项目 → 构建发布**
3. 发布平台选 **Mac**（或「原生」里的 macOS，视编辑器文案而定）
4. 填写：
   - 包名 / Bundle Id：例如 `me.xiandan.xiangzhuo`
   - 目标：`macOS`
5. 点 **构建** → 产物在 `client/build/mac/`（名称以构建任务为准）
6. 用 Finder 打开生成的 `.app`，双击运行

真机联网：把 `GameApp` 的 `wsUrl` 改成可访问的 Skynet 地址（本机局域网可用 `ws://你的Mac局域网IP:9948`）。

## 和微信小游戏的关系

同一套前端；构建时换平台即可：

| 平台 | 用途 |
|------|------|
| Mac | 本机可安装的桌面 App |
| 微信小游戏 | 微信里玩 |
| iOS / Android | 手机 App |
