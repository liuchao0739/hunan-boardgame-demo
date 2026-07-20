/**
 * 热更新脚手架（参考口袋麻将 HotUpdateMgr）
 * 仅在原生包生效；Web 预览会跳过。
 * 完整接入需：version.manifest / project.manifest + 远端 CDN。
 */
import { native, sys } from 'cc';

export class HotUpdateScaffold {
  static readonly enabled = false; // 上线原生包时改为 true 并配置 remoteUrl
  static remoteUrl = 'https://your-cdn.example.com/xiangzhuo/';

  static async check(): Promise<string> {
    if (!HotUpdateScaffold.enabled) {
      return '热更未启用（Demo 默认关闭，见 HotUpdateScaffold.ts）';
    }
    if (!sys.isNative) {
      return '非原生环境，跳过热更';
    }
    try {
      const storage = `${native.fileUtils.getWritablePath()}xiangzhuo-remote`;
      const am = new native.AssetsManager(
        HotUpdateScaffold.remoteUrl + 'project.manifest',
        storage,
      );
      return `AssetsManager 已创建 · 存储 ${storage}`;
    } catch (e) {
      return `热更初始化失败: ${e}`;
    }
  }
}
