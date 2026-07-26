# 循环执行指令（单行，避免 JSON 换行错误）

从 upgrade/progress.json 读取 status=pending 的第一个 task（当前主线 phase9_visual 观感对标），按 task 的 spec 文件（upgrade/specs/<id>.md）完成实现（必要时补测试），更新 progress.json 为 done 并刷新 stats，git commit，然后继续下一个 pending task；若全部 done 则输出 XIANGZHUO_UPGRADE_COMPLETE。观感验收以演示站截图为准，能力骨架打满不等于观感完成。
