# 湘桌升级架构（对标商业级欢乐麻将能力）

> 仓库：`/Users/liuchao/xiangzhuo`  
> 演示：https://xiangzhuo.xiandan.me/  
> 模式：对齐 OpenClaw `migration/`（progress + specs + LOOP），本目录为**产品升级**而非换语言。

## 目标技术栈（保持）

| 层 | 技术 |
|----|------|
| 服务端 | Skynet + Lua，JSON WebSocket `:20480` |
| 客户端 | Cocos Creator 3.8.8 |
| 存储 | MySQL 8 + Redis 7（`docker/docker-compose.yml`） |
| 部署 | systemd `xiangzhuo` + Caddy/Nginx 静态站 |

## 分层

```
Layer 0  基础设施：配置、DB、日志、健康检查
Layer 1  平台协议：JSON envelope、账号 ticket、房间状态机
Layer 2  玩法引擎：changsha_mj / shaoyang_phz / 棋类占位
Layer 3  对局会话：重连、超时托管、解散、续桌
Layer 4  大厅与经济：匹配、房卡、俱乐部骨架
Layer 5  客户端表现：动效、音效、结算演出
Layer 6  运维：指标、备份、CI、压测
```

## 阶段

| Phase | id | 目标 |
|-------|-----|------|
| 0 | phase0_foundation | upgrade 框架、DB 接线、配置 |
| 1 | phase1_rules | 长沙规则商业级 + 单测 |
| 2 | phase2_session | 断线重连、超时、托管、解散 |
| 3 | phase3_account | 账号/战绩持久化 |
| 4 | phase4_table_fx | 牌桌动效音效 |
| 5 | phase5_match_social | 匹配与社交 |
| 6 | phase6_economy | 房卡经济 |
| 7 | phase7_multigame | 多玩法 |
| 8 | phase8_ops | 运维与质量 |

## 验收标准（全量 done 时）

- [ ] 真人断线 60s 内可重连回同一局
- [ ] 长沙规则核心单测 ≥ 约定用例通过
- [ ] 牌桌有发/出/胡基础动效与语音
- [ ] 账号与战绩重启不丢失
- [ ] 快速匹配可开一桌（可含机器人）
- [ ] https://xiangzhuo.xiandan.me/ 可玩上述能力

## 原则

1. 一 task 一 commit；改动不超出 spec `touch_files`
2. 行为先正确，再补表现
3. 服务端权威；客户端只做展示与输入
4. 失败标 `failed` + notes，不擅自 skip 阻塞任务
