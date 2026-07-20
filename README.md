# 湘桌棋牌

> **Skynet + Lua** · **Cocos Creator 3.8.8** · WebSocket JSON · 服务端权威  
> 7 玩法：长沙麻将 / 血流成河 / 血战到底 / 红中麻将 / 邵阳跑胡子 / 斗地主 / 跑得快

https://github.com/liuchao0739/hunan-boardgame-demo

## 效果预览

| 大厅 | 长沙麻将 |
|:---:|:---:|
| ![大厅](docs/screenshots/01-lobby.png) | ![长沙麻将](docs/screenshots/02-changsha-mj.png) |

| 邵阳跑胡子 | 斗地主 |
|:---:|:---:|
| ![邵阳跑胡子](docs/screenshots/03-shaoyang-phz.png) | ![斗地主](docs/screenshots/04-doudizhu.png) |

## 玩法

| ID | 名称 | 人数 |
|----|------|------|
| `changsha_mj` | 长沙麻将 | 4 |
| `xueliu_mj` | 血流成河 | 4 |
| `xuezhan_mj` | 血战到底 | 4 |
| `hongzhong_mj` | 红中麻将 | 4 |
| `shaoyang_phz` | 邵阳跑胡子 | 3 |
| `doudizhu` | 斗地主 | 3 |
| `paodekuai` | 跑得快 | 3 |

## 平台

- 房卡开房、俱乐部、战绩回放数据、快捷短语、扑克记牌器  
- 热更脚手架（原生，默认关）见 `HotUpdateScaffold.ts`  
- 能力对照：[`docs/PLATFORM.md`](docs/PLATFORM.md)

## 启动

```bash
cd server && ./run.sh   # WS :9948
```

Cocos 打开 `client/` → 预览 → 选玩法 → 一键开局（耗 1 房卡，新号 20 张）。

加入：`window.__join="房号"` 后点「加入房间」。

## 素材与第三方

见 `THIRD_PARTY_NOTICES.md` · `client/assets/resources/ui/`

## License

MIT（自有代码）；第三方资源见各自许可证。
