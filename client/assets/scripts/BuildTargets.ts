/**
 * 构建目标说明（Cocos Creator 3.8.8）
 *
 * 1) 微信小游戏（招聘 JD 里的「小程序」在棋牌场景通常指这个）
 *    菜单：项目 → 构建发布 → 发布平台选「微信小游戏」
 *    AppID：测试可用 wx6ac3f5090a6b99c5；正式填你的小游戏 AppID
 *    方向：Landscape（横屏牌桌）
 *    偏好设置 → 外部程序 → 微信开发者工具路径：
 *      /Applications/wechatwebdevtools.app
 *    构建后点「运行」会打开微信开发者工具
 *    文档：https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-wechatgame.html
 *
 * 2) Android / iOS App
 *    构建发布 → Android / iOS
 *    需配置：JDK、Android SDK / Xcode
 *    文档：https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/
 *
 * 3) 浏览器预览（开发）
 *    编辑器顶部 ▶ 预览
 *
 * 注意：小游戏主包 ≤4MB，牌面等资源建议放远程 CDN（构建面板填资源服务器地址）
 */
export const BUILD_TARGETS = {
  wechatgame: true,
  android: true,
  ios: true,
  webDesktop: true,
} as const;
