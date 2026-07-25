#!/usr/bin/env python3
"""Generate upgrade/progress.json and stub specs for XiangZhuo commercial upgrade."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(__file__).resolve().parent / "progress.json"
SPECS = Path(__file__).resolve().parent / "specs"

# (id, phase, title, acceptance, touch_files, detail)
TASKS: list[tuple[str, str, str, str, list[str], str]] = [
    # phase0
    ("T001", "phase0_foundation", "落盘 upgrade/ 骨架与 REFERENCE", "upgrade/ 含 ARCHITECTURE LOOP REFERENCE progress specs", ["upgrade/"], "创建升级任务体系目录与文档。"),
    ("T002", "phase0_foundation", "MySQL schema：用户与战绩表", "mysql-init 含 users/game_records DDL 可启动", ["docker/mysql-init/"], "新建 users、game_records、room_cards 表。"),
    ("T003", "phase0_foundation", "Lua DB 客户端封装", "server 可 query MySQL（skynet mysql 或 luasql 方案落地）", ["server/lualib/platform/db.lua", "server/service/"], "封装连接与简单 query/execute。"),
    ("T004", "phase0_foundation", "passport 持久化用户", "登录写入/读取 MySQL，重启 userId 稳定", ["server/service/passport.lua"], "替换纯内存用户表为 DB。"),
    ("T005", "phase0_foundation", "Redis 会话 ticket", "ticket 存 Redis TTL，校验接口可用", ["server/lualib/platform/redis.lua", "server/service/passport.lua"], "login 发 ticket，请求可校验。"),
    ("T006", "phase0_foundation", "服务配置 config.lua", "DB/Redis/端口从配置文件读取", ["server/lualib/platform/config.lua", "server/config"], "统一配置加载。"),
    ("T007", "phase0_foundation", "协议版本字段文档化", "PROTOCOL 标明 v=1 兼容策略", ["docs/PROTOCOL_PLATFORM.md"], "补充版本与扩展字段约定。"),
    ("T008", "phase0_foundation", "健康检查 HTTP/WS ping", "ping 命令返回 ok+uptime", ["server/service/ws_gate.lua"], "platform.ping → pong。"),
    # phase1 rules
    ("T009", "phase1_rules", "番型表数据结构", "fan_table.lua 可查询番型", ["server/lualib/game/changsha_mj/fan.lua"], "定义基础番与加成。"),
    ("T010", "phase1_rules", "杠分结算（明/暗/补）", "杠后即时计分写入 snapshot", ["server/lualib/game/changsha_mj/init.lua"], "三种杠分规则落地。"),
    ("T011", "phase1_rules", "抢杠胡检测", "补杠时可被抢并胡", ["server/lualib/game/changsha_mj/init.lua"], "wait_claim 扩展抢杠。"),
    ("T012", "phase1_rules", "一炮多响策略可配置", "rules.multiHu=all|first 生效", ["server/lualib/game/changsha_mj/init.lua"], "配置驱动多响。"),
    ("T013", "phase1_rules", "吃牌合法性服务端校验", "chi body.tiles 必须匹配 chi_options", ["server/lualib/game/changsha_mj/init.lua"], "禁止客户端伪造吃组合。"),
    ("T014", "phase1_rules", "将将胡与平胡互斥/叠加规则明确", "文档+代码一致", ["server/lualib/game/changsha_mj/", "docs/RULES_CHANGSHA.md"], "澄清计分。"),
    ("T015", "phase1_rules", "起手胡 fan 计入结算明细", "settle.detail 含起手条目", ["server/lualib/game/changsha_mj/"], "起手分进流水。"),
    ("T016", "phase1_rules", "中途四喜/六六顺即时分", "触发后分数变化可测", ["server/lualib/game/changsha_mj/"], "已有逻辑补测试与明细。"),
    ("T017", "phase1_rules", "抓鸟规则与文档对齐", "niao 座位映射单测通过", ["server/lualib/game/changsha_mj/niao.lua", "docs/RULES_CHANGSHA.md"], "固定算法单测。"),
    ("T018", "phase1_rules", "牌墙余牌与荒庄边界", "wall=0 荒庄无异常", ["server/lualib/game/changsha_mj/init.lua"], "边界用例。"),
    ("T019", "phase1_rules", "Lua 规则单测 runner", "server/test 可跑 tiles/qishou/niao", ["server/test/", "server/lualib/game/changsha_mj/"], "无 Skynet 可跑单测。"),
    ("T020", "phase1_rules", "胡牌用例集 ≥20", "can_hu 正反例覆盖", ["server/test/test_hu.lua"], "构造手牌断言。"),
    ("T021", "phase1_rules", "吃碰杠用例集", "chi/peng/gang 用例通过", ["server/test/test_meld.lua"], "操作合法性。"),
    ("T022", "phase1_rules", "起手胡用例集", "qishou detect 用例通过", ["server/test/test_qishou.lua"], "各图案至少 1 例。"),
    # phase2 session
    ("T023", "phase2_session", "断线保留座位不立即 leave", "ws close 进入 disconnected 态", ["server/service/ws_gate.lua", "server/service/room_mgr.lua"], "宽限期内占座。"),
    ("T024", "phase2_session", "重连 bind ticket→原房间", "reconnect 协议恢复座位与 snapshot", ["server/service/", "client/assets/scripts/comm/NetBus.ts"], "客户端自动重连。"),
    ("T025", "phase2_session", "断线宽限 60s 超时踢出", "超时后机器人或空位策略", ["server/service/room_mgr.lua"], "定时器。"),
    ("T026", "phase2_session", "操作倒计时服务端驱动", "state 含 deadlineMs", ["server/lualib/game/changsha_mj/init.lua"], "出牌/抢牌超时。"),
    ("T027", "phase2_session", "超时自动出牌/过", "超时触发 discard/guo", ["server/lualib/game/changsha_mj/init.lua"], "防卡死。"),
    ("T028", "phase2_session", "托管 autoPlay 开关", "玩家可进托管，自动行牌", ["server/", "client/"], "协议+UI。"),
    ("T029", "phase2_session", "房间解散投票", "发起/同意/拒绝满票解散", ["server/service/room_mgr.lua", "client/"], "打牌中解散。"),
    ("T030", "phase2_session", "局间续桌 ready", "settle 后准备开下一局", ["server/lualib/game/changsha_mj/", "client/"], "多局。"),
    ("T031", "phase2_session", "客户端断线提示与重连中 UI", "Table/Hall 显示重连状态", ["client/assets/scripts/"], "体验。"),
    ("T032", "phase2_session", "心跳 keepalive", "客户端定时 ping，超时判离线", ["client/assets/scripts/comm/NetBus.ts", "server/service/ws_gate.lua"], "双向心跳。"),
    # phase3 account
    ("T033", "phase3_account", "注册/登录口令哈希", "password 哈希入库", ["server/service/passport.lua"], "bcrypt/sha 方案。"),
    ("T034", "phase3_account", "设备 guest 一键登录", "deviceId 创建游客", ["server/", "client/"], "无密码进。"),
    ("T035", "phase3_account", "ticket 刷新与过期", "过期拒绝并提示重登", ["server/service/passport.lua"], "TTL。"),
    ("T036", "phase3_account", "战绩写入 game_records", "每局 settle 落库", ["server/service/room_mgr.lua"], "异步写。"),
    ("T037", "phase3_account", "战绩查询协议", "platform.getRecords 分页", ["server/", "client/"], "大厅列表。"),
    ("T038", "phase3_account", "个人资料改名头像", "updateProfile", ["server/", "client/"], "基础资料。"),
    ("T039", "phase3_account", "登录页账号模式 UI", "支持用户名密码/游客", ["client/assets/scripts/login/"], "替换仅昵称。"),
    ("T040", "phase3_account", "大厅显示战绩入口", "可打开最近对局", ["client/assets/scripts/hall/"], "UI。"),
    # phase4 fx
    ("T041", "phase4_table_fx", "出牌飞牌动画", "discard 有位移动画", ["client/assets/scripts/game/"], "tween。"),
    ("T042", "phase4_table_fx", "摸牌插入动画", "draw 后手牌补位动画", ["client/assets/scripts/game/"], "理牌动画。"),
    ("T043", "phase4_table_fx", "吃碰杠展示动画", "meld 区有过渡", ["client/assets/scripts/game/"], "动画。"),
    ("T044", "phase4_table_fx", "胡牌特效层", "hu/zimo 全屏特效节点", ["client/assets/scripts/game/"], "特效。"),
    ("T045", "phase4_table_fx", "音效管理器 AudioBus", "出牌/胡/按钮有声", ["client/assets/scripts/comm/AudioBus.ts"], "封装 AudioSource。"),
    ("T046", "phase4_table_fx", "方言/普通话语音钩子", "关键事件播 voice", ["client/assets/scripts/", "client/assets/resources/"], "资源挂载。"),
    ("T047", "phase4_table_fx", "发牌动画开局", "开局发牌序列", ["client/assets/scripts/game/"], "开局演出。"),
    ("T048", "phase4_table_fx", "结算面板动效", "分数滚动/亮牌", ["client/assets/scripts/game/TableLayout.ts"], "结算。"),
    ("T049", "phase4_table_fx", "倒计时环 UI", "客户端显示剩余秒", ["client/assets/scripts/game/"], "对齐 deadline。"),
    ("T050", "phase4_table_fx", "操作按钮动效统一", "吃碰杠胡过同风格出现", ["client/assets/scripts/game/TableLayout.ts"], "已有吃按钮风格延续。"),
    # phase5 match social
    ("T051", "phase5_match_social", "快速匹配队列", "matchmaking 服务入队成桌", ["server/service/", "client/"], "匹配。"),
    ("T052", "phase5_match_social", "取消匹配", "离开队列", ["server/", "client/"], "取消。"),
    ("T053", "phase5_match_social", "好友房密码可选", "join 校验 password", ["server/service/room_mgr.lua"], "私密房。"),
    ("T054", "phase5_match_social", "桌面表情协议", "emoji 广播", ["server/", "client/"], "互动。"),
    ("T055", "phase5_match_social", "快捷短语", "短语广播", ["server/", "client/"], "互动。"),
    ("T056", "phase5_match_social", "俱乐部表结构", "clubs/members DDL", ["docker/mysql-init/"], "骨架。"),
    ("T057", "phase5_match_social", "俱乐部创建/加入 stub", "协议可通返回 ok", ["server/service/club_record.lua"], "占位可用。"),
    ("T058", "phase5_match_social", "大厅玩法卡片 UI", "长沙可点、跑胡子灰显说明", ["client/assets/scripts/hall/"], "选择器。"),
    ("T059", "phase5_match_social", "房间列表旁观禁止默认", "非成员不可 sync 他人房", ["server/service/room_mgr.lua"], "隐私。"),
    ("T060", "phase5_match_social", "踢人（房主）", "owner kick", ["server/service/room_mgr.lua"], "管理。"),
    # phase6 economy
    ("T061", "phase6_economy", "房卡账本表", "ledger DDL", ["docker/mysql-init/"], "流水。"),
    ("T062", "phase6_economy", "创房扣房卡", "余额不足拒绝", ["server/service/room_mgr.lua"], "扣费。"),
    ("T063", "phase6_economy", "局结返还/消耗策略配置", "rules.cost 生效", ["server/"], "配置。"),
    ("T064", "phase6_economy", "钻石字段与兑换 stub", "协议占位", ["server/", "client/"], "经济扩展。"),
    ("T065", "phase6_economy", "商城列表 stub", "返回商品 JSON", ["server/", "client/"], "商城。"),
    ("T066", "phase6_economy", "流水查询", "getLedger", ["server/", "client/"], "账单。"),
    ("T067", "phase6_economy", "防重入扣费", "同 roomId 不重复扣", ["server/"], "幂等。"),
    ("T068", "phase6_economy", "大厅显示房卡余额", "登录后刷新", ["client/assets/scripts/hall/"], "UI。"),
    # phase7 multigame
    ("T069", "phase7_multigame", "跑胡子牌张模型", "phz tiles 模块", ["server/lualib/game/shaoyang_phz/"], "模型。"),
    ("T070", "phase7_multigame", "跑胡子发牌与出牌骨架", "可开局出一张", ["server/lualib/game/shaoyang_phz/"], "MVP。"),
    ("T071", "phase7_multigame", "跑胡子吃碰提跑占位 ops", "availableOps stub", ["server/lualib/game/shaoyang_phz/"], "操作。"),
    ("T072", "phase7_multigame", "大厅启用跑胡子入口", "可 createRoom shaoyang_phz", ["client/assets/scripts/hall/"], "入口。"),
    ("T073", "phase7_multigame", "象棋 gameId 注册占位", "registry 有 chess stub", ["server/lualib/game/"], "占位。"),
    ("T074", "phase7_multigame", "围棋 gameId 注册占位", "registry 有 go stub", ["server/lualib/game/"], "占位。"),
    ("T075", "phase7_multigame", "客户端按 gameId 加载牌桌", "路由 Table 或占位场景", ["client/assets/scripts/"], "多玩法客户端。"),
    ("T076", "phase7_multigame", "协议 game 命名空间校验", "未知 gameId 明确错误", ["server/service/"], "校验。"),
    # phase8 ops
    ("T077", "phase8_ops", "structured 日志字段", "roomId/userId 入日志", ["server/"], "可观测。"),
    ("T078", "phase8_ops", "metrics 计数器 stub", "局数/在线人数", ["server/"], "指标。"),
    ("T079", "phase8_ops", "systemd 与文档对齐 xiangzhuo", "DEPLOY 文档无 whmj 残留", ["docs/", "Seafile 可选"], "文档。"),
    ("T080", "phase8_ops", "备份脚本 MySQL dump", "scripts/backup_mysql.sh", ["scripts/"], "备份。"),
    ("T081", "phase8_ops", "CI：Lua 单测", "GitHub Action 跑 test", [".github/workflows/"], "CI。"),
    ("T082", "phase8_ops", "压测脚本 WS login+create", "scripts/bench_ws.py", ["scripts/"], "基线。"),
    ("T083", "phase8_ops", "错误码表", "docs/ERROR_CODES.md", ["docs/"], "错误码。"),
    ("T084", "phase8_ops", "灰度配置开关", "feature flags 文件", ["server/lualib/platform/"], "开关。"),
    ("T085", "phase8_ops", "演示站部署检查清单", "升级 checklist 进 DEPLOY", ["docs/DEPLOY_SEAFILE.md"], "运维。"),
    # extra polish to reach ~100
    ("T086", "phase1_rules", "禁止非法出牌（非手牌）", "discard 校验归属", ["server/lualib/game/changsha_mj/init.lua"], "安全。"),
    ("T087", "phase1_rules", "碰后可选开杠提示", "ops 含 ming_gang/bu_gang", ["server/lualib/game/changsha_mj/"], "完整性。"),
    ("T088", "phase2_session", "暂停/网络差提示", "连续丢包 UI", ["client/"], "体验。"),
    ("T089", "phase2_session", "同账号顶号踢旧连接", "单点登录策略", ["server/service/ws_gate.lua"], "会话。"),
    ("T090", "phase3_account", "管理员只读接口 stub", "listOnline", ["server/"], "运维接口。"),
    ("T091", "phase4_table_fx", "罗盘转向动画", "currentSeat 变化平滑转", ["client/assets/scripts/game/"], "罗盘。"),
    ("T092", "phase4_table_fx", "余牌数滚动更新", "remain 变化动画可选", ["client/assets/scripts/game/"], "微调。"),
    ("T093", "phase5_match_social", "分享房间号到剪贴板", "大厅一键复制", ["client/assets/scripts/hall/"], "分享。"),
    ("T094", "phase6_economy", "每日登录赠房卡 stub", "可配置赠送", ["server/"], "拉新。"),
    ("T095", "phase7_multigame", "RULES_SHAOYANG.md 初稿", "规则文档占位", ["docs/RULES_SHAOYANG.md"], "文档。"),
    ("T096", "phase8_ops", "README 升级循环说明", "链到 upgrade/LOOP.md", ["README.md"], "入口。"),
    ("T097", "phase0_foundation", "json 安全编码工具", "0-based table 转数组 helper", ["server/lualib/platform/jsonutil.lua"], "防 sparse。"),
    ("T098", "phase0_foundation", "room snapshot JSON 回归", "settle/birdHits 永可 encode", ["server/test/", "server/lualib/game/changsha_mj/"], "回归。"),
    ("T099", "phase2_session", "机器人填充策略可关", "rules.fillBots=false", ["server/service/room_mgr.lua"], "真人局。"),
    ("T100", "phase8_ops", "升级完成验收脚本", "scripts/verify_upgrade.sh 检查关键项", ["scripts/verify_upgrade.sh"], "总验收。"),
]


def write_spec(tid: str, phase: str, title: str, acceptance: str, touch: list[str], detail: str) -> None:
    path = SPECS / f"{tid}.md"
    if path.exists() and tid == "T001":
        return
    body = f"""# {tid} {title}

## Phase

`{phase}`

## Goal

{detail}

## Touch files

{chr(10).join(f"- `{p}`" for p in touch)}

## Acceptance

{acceptance}

## Notes

- 一 task 一 commit
- 完成后将 progress.json 中本 task status 设为 done，并更新 stats
"""
    path.write_text(body, encoding="utf-8")


def main() -> None:
    SPECS.mkdir(parents=True, exist_ok=True)
    tasks = []
    for tid, phase, title, acceptance, touch, detail in TASKS:
        write_spec(tid, phase, title, acceptance, touch, detail)
        tasks.append(
            {
                "id": tid,
                "phase": phase,
                "title": title,
                "status": "pending",
                "spec": f"upgrade/specs/{tid}.md",
                "acceptance": acceptance,
                "touch_files": touch,
            }
        )

    # T001 marked done after scaffold lands in same commit as this generator output
    tasks[0]["status"] = "done"
    tasks[0]["completed_at"] = datetime.now(timezone.utc).isoformat()

    done = sum(1 for t in tasks if t["status"] == "done")
    pending = sum(1 for t in tasks if t["status"] == "pending")
    payload = {
        "version": "1.0.0",
        "repo": "/Users/liuchao/xiangzhuo",
        "demo": "https://xiangzhuo.xiandan.me/",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "stats": {
            "total": len(tasks),
            "done": done,
            "pending": pending,
            "failed": 0,
        },
        "current_phase": "phase0_foundation",
        "current_task": next((t["id"] for t in tasks if t["status"] == "pending"), None),
        "tasks": tasks,
        "notes": "对标商业级欢乐麻将能力；按 upgrade/LOOP.md 循环执行。",
    }
    OUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Generated {len(tasks)} tasks -> {OUT} (done={done}, pending={pending})")


if __name__ == "__main__":
    main()
