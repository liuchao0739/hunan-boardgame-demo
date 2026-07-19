# 平台构建指南 · 小游戏 / App

> 引擎：**Cocos Creator 3.8.8**  
> 后端：先起 Skynet `cd ../server && ./run.sh`（`ws://你的服务器IP:9948`）

## 一句话结论

| 目标 | 能否做 | Creator 里选 |
|------|--------|----------------|
| 微信里玩（招聘说的小程序） | ✅ | **微信小游戏**（不是订阅号小程序） |
| iOS / Android App | ✅ | **iOS** / **Android** |
| 浏览器调试 | ✅ | 预览 ▶ |

棋牌行业 JD 写的「小程序」，在 Cocos 侧对应 **微信小游戏**；和「微信小程序（非游戏）」不是同一个模板，但用户入口都在微信里。

---

## 1. 安装 Creator 3.8.8

若本机尚未安装，可用官方包：

- Mac：https://download.cocos.org/CocosCreator/v3.8.8/CocosCreator-v3.8.8-mac-010512.zip  
- 或 [Cocos 下载页](https://www.cocos.com/creator-download) → Dashboard 安装 3.8.8  

安装后打开：**打开其他 →** `/Users/liuchao/hunan-boardgame-demo/client`

---

## 2. 第一次打开工程（约 2 分钟）

1. Creator 打开 `client` 目录  
2. **场景** → 新建 `assets/scenes/Main.scene`  
3. 层级管理器：确保有 **Canvas**（2D）  
4. 选中 Canvas → 添加组件 → 自定义脚本 **`GameApp`**  
5. 属性 `wsUrl`：
   - 本机预览：`ws://127.0.0.1:9948`
   - 真机/小游戏：`ws://你的公网IP或域名:9948`（需 wss 证书时再改 `wss://`）  
6. 菜单 **项目 → 项目设置 → 功能裁剪**：2D 项目可关掉 3D/物理以减小包体  
7. 点顶部 **预览 ▶**

更细步骤见根目录旁的 `README.md`。

---

## 3. 发布微信小游戏

前置：本机已有 **微信开发者工具**（你这台已装 `wechatwebdevtools.app`）。

1. Creator → **Cocos Creator / 文件 → 偏好设置 → 外部程序**  
   微信开发者工具路径填：`/Applications/wechatwebdevtools.app`  
2. **项目 → 构建发布**  
3. 发布平台：**微信小游戏**  
4. 建议选项：
   - 设备方向：**Landscape**（横屏）
   - AppID：测试 `wx6ac3f5090a6b99c5`，上线换正式 ID  
5. 点 **构建** → 完成后点 **运行** → 自动开微信开发者工具  
6. 官方说明：https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-wechatgame.html  

**包体：** 主包 ≤ 4MB。牌面图集大时，在构建面板填「资源服务器地址」，把 `remote` 目录上传 CDN。

**联网：** 小游戏要在微信公众平台配置 **合法域名 / socket 合法域名**（连 Skynet 的 `wss` 域名）。本地开发者工具可勾选不校验。

---

## 4. 发布 App（Android / iOS）

1. **构建发布** → 选 **Android** 或 **iOS**  
2. Android：配置 JDK、Android Studio SDK  
3. iOS：需 Mac + Xcode（你已装 Xcode）→ 构建出 Xcode 工程再 Archive  
4. 文档：https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/

同一套 `GameApp` + Skynet 协议，换构建目标即可，不用重写玩法。

---

## 5. 命令行构建（装好 Creator 后）

```bash
# 路径按实际安装位置改
CREATOR="/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/MacOS/CocosCreator"
PROJECT="/Users/liuchao/hunan-boardgame-demo/client"

"$CREATOR" --project "$PROJECT" --build "platform=wechatgame;debug=true;md5Cache=true"
```

---

## 6. 和「彩蝶」类产品的关系

Creator 负责：**渲染、动画、小游戏/App 打包**。  
Skynet 负责：**房间、出牌权威、结算**。  
微信登录 / 支付 / 分享拉人：用微信小游戏开放能力另接，不改变牌桌协议。
