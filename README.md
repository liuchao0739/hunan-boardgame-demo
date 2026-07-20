# 口袋麻将（对标 PocketMahjongClient）

本仓库客户端已切换为开源 **[口袋麻将全集](https://github.com/winktzhong/PocketMahjongClient)** 原版工程（Cocos Creator · 真 3D 麻将桌）。

演示地址（官方）：http://magame.110x.com

> 湘桌自制大厅 / 跑胡子 / 斗地主等已移出主线，见 `_archive/xiangzhuo-client/`（仅归档，不再维护）。

## 启动（唯一推荐方式）

1. 安装 **Cocos Creator 3.7.4+**（本机可用 **3.8.8** 打开，按提示升级工程）
2. 打开工程目录：`hunan-boardgame-demo/client/`
3. 首次可在 `client/` 执行：`npm install --legacy-peer-deps`
4. **启动场景选 `assets/Scene/Main/MainScene`**
5. 点预览 / 运行

### 登录 / 验证码（重要）

口袋麻将 **不连** 本仓库 `server/`（Skynet `:9948`）。

官方测试服 `mhtest.openpokergame.net:8086` 当前 **502 挂了**（浏览器 Network 可见），真短信/真验证码都不可用。

因此工程已默认开启 **本地离线登录旁路**（`AppVar.offlineAuth = true`），会伪造验证码、登录、角色、俱乐部等全部 HTTP：

1. **停预览再开**（必须重载）
2. 注册：验证码自动 `888888`，密码如 `abc123`
3. 或直接登录：同一手机号 + 密码
4. 应进入大厅（控制台一串 `offlineAuth mock [...]`，**不应再出现** `mhtest...502`）

说明：离线模式只能进客户端 UI / 看 3D 场景资源，**不能联机对战**。  
想看完整联机可去官网：http://magame.110x.com

## 工程结构（口袋原版）

| 路径 | 说明 |
|------|------|
| `assets/Scene/Main` | 入口场景（必选） |
| `assets/Scene/Login` | 登录 |
| `assets/Scene/Home` | 大厅 |
| `assets/Scene/Mahjong` | **真 3D 牌桌** |
| `assets/Script/Mahjong` | 3D 牌桌逻辑 / CardFactory |
| `assets/Scene/Mahjong/World/Card` | 3D 牌模型 FBX |

## 已去掉的无关内容

- 自制 `GameApp` 灰盒大厅 / 伪 3D `Table3D`
- 长沙/跑胡子/斗地主多玩法 Skynet Demo 客户端（归档）
- 威海大厅拼装、加入房数字键盘等湘桌临时 UI

服务端 `server/`（Skynet）与口袋协议不兼容，**跑口袋麻将请用其自带联机**，不必再启 `./server/run.sh`。

## 许可

口袋麻将客户端源码按其上游许可证使用（见 [PocketMahjongClient](https://github.com/winktzhong/PocketMahjongClient) README）。  
归档的湘桌自制代码仍为 MIT。

## 免责

严禁用于任何非法用途，后果自负。
