/****************************************************************************
 Copyright (c) Bit Technologies Inc.

 代码：https://github.com/openpokergame/PocketMahjongClient.git

 官网一：http://qipaiplay.com

 官网二：http://openpokergame.net

 玩法博客：http://www.xgeplayer.com

 email: openpokerorg@gmail.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * 俱乐部模块常量
 */
export enum E_CLUB_MODULE {
    NONE,
    MAIN_UI,
    CHOOSE_HALL,
    MEM_MANAGER,
    MONEY_HISTORY,
    CREATE_TABLE,
    CREATE_UI,
    CHANGE_ICON,
    CHANGE_NAME,
    INPUT_UI,
    JOIN_UI,
    EXIT_UI,
    DISSOLVE_UI,
    SHOP_UI,
    SHOP_RECORD_UI

}

export enum E_FAN_TYPE {
    // 26番
    JP_DA_SI_XI_SCORE = 52,                      // 大四喜
    JP_SI_AN_KE_DAN_JI_SCORE = 48,                  // 四暗刻单骑
    JP_GUO_SHI_WU_SHUANG_13MIAN_SCORE = 43,         // 国士无双十三面
    JP_CHUN_JIU_LIAN_BAO_DENG_SCORE = 46,           // 纯正九莲宝灯
    JP_CHUN_LV_YI_SE_SCORE = 1000,                  // 纯正绿一色 [古]
    JP_DA_QI_XING_SCORE = 999,                      // 大七星 [古]

    // 13番
    JP_DA_SAN_YUAN_SCORE = 53,                      // 大三元
    JP_LV_YI_SE_SCORE = 54,                         // 绿一色
    JP_JIU_LIAN_BAO_DENG_SCORE = 45,                // 九莲宝灯
    JP_SI_GANG_SCORE = 49,                          // 四杠子
    JP_XIAO_ZHU_LIN_SCORE = 998,                    // 小竹林 [古]
    JP_XIAO_CHE_LUN_SCORE = 997,                    // 小车轮 [古]
    JP_XIAO_SHU_LIN_SCORE = 996,                    // 小数邻 [古]
    JP_DA_ZHU_LIN_SCORE = 995,                      // 大竹林 [古]
    JP_DA_CHE_LUN_SCORE = 994,                      // 大车轮 [古]
    JP_DA_SHU_LIN_SCORE = 993,                      // 大数邻 [古]
    JP_SHI_SAN_YAO_SCORE = 42,                      // 国士无双
    JP_QING_YAO_JIU_SCORE = 44,                     // 清老头
    JP_XIAO_SI_XI_SCORE = 51,                       // 小四喜
    JP_ZI_YI_SE_SCORE = 50,                         // 字一色
    JP_SI_AN_KE_SCORE = 47,                         // 四暗刻
    JP_YI_SE_SHUANG_LONG_HUI_SCORE = 992,           // 一色双龙会 [古]
    JP_YI_SE_SI_JIE_GAO_SCORE = 991,                // 四连刻 [古]
    JP_YI_SE_SI_TONG_SHUN_SCORE = 990,              // 一色四顺 [古]
    JP_YI_SE_SI_BU_GAO_SCORE = 989,                 // 金门桥 [古]
    JP_DI_HE_SCORE = 41,                            // 地和
    JP_TIAN_HE_SCORE = 40,                          // 天和
    JP_SHI_SHANG_SAN_NIAN_SCORE = 988,              // 石上三年 [古]
    JP_BA_LIAN_ZHUANG_SCORE = 987,                  // 八连庄 [古]
    JP_DONG_BEI_XIN_GAN_XIAN_SCORE = 986,           // 东北新干线 [古]
    JP_HEI_YI_SE_SCORE = 985,                       // 黑一色 [古]
    JP_BAI_WAN_SHI_SCORE = 984,                     // 百万石 [古]
    JP_HONG_KONG_QUE_SCORE = 983,                   // 红孔雀 [古]
    JP_FENG_HUA_XUE_YUE_SCORE = 982,                // 风花雪月 [古]
    JP_HUA_NIAO_FENG_YUE_SCORE = 981,               // 花鸟风月 [古]
    JP_KAI_LI_ZHI_RONG_SCORE = 980,                 // 开立直 [古]
    JP_REN_HE_SCORE = 979,                          // 人和 [古]

    // 6番
    JP_QING_YI_SE_SCORE = 6,                        // 清一色

    // 5番
    JP_YI_TONG_MO_YUE_SCORE = 978,                  // 一筒摸月 [古]
    JP_JIU_TONG_LAO_YUE_SCORE = 977,                // 九筒捞鱼 [古]
    JP_WU_TONG_KAI_HUA_SCORE = 976,                 // 五筒开花 [古]
    JP_JIN_JI_DU_LI_SCORE = 975,                    // 金鸡独立 [古]
    JP_DU_DIAO_HAN_JIANG_XUE_SCORE = 974,           // 独钓寒江雪 [古]
    JP_LIU_JU_MAN_GUAN_SCORE = 880,                 //流局满贯

    // 3番
    JP_HUN_YI_SE_SCORE = 5,                         // 混一色
    JP_ER_BEI_KOU_SCORE = 18,                       // 二杯口
    JP_CHUN_QUAN_DAI_YAO_JIU_SCORE = 24,            // 纯全带幺九
    JP_WU_XIN_TONG_GUAN_SCORE = 973,                // 五心通贯 [古]

    // 2番
    JP_SAN_GANG_SCORE = 30,                         // 三杠子
    JP_HUN_YAO_JIU_SCORE = 25,                      // 混老头
    JP_HUN_QUAN_DAI_YAO_JIU_SCORE = 23,             // 混全带幺九
    JP_QI_DUI_SCORE = 14,                           // 七对子
    JP_XIAO_SAN_YUAN_SCORE = 7,                     // 小三元
    JP_YI_SE_SAN_JIE_GAO_SCORE = 972,               // 三连刻 [古]
    JP_QING_LONG_SCORE = 26,                        // 一气通贯
    JP_YI_SE_SAN_BU_GAO_SCORE = 971,                // 一色三步 [古]
    JP_SAN_TONG_KE_SCORE = 28,                      // 三色同刻
    JP_SAN_AN_KE_SCORE = 29,                        // 三暗刻
    JP_HUA_LONG_SCORE = 970,                        // 三色通贯 [古]
    JP_SAN_SE_SAN_TONG_SHUN_SCORE = 27,             // 三色同顺
    JP_PENG_PENG_HE_SCORE = 15,                     // 对对和
    JP_WU_MEN_QI_SCORE = 969,                       // 五门齐 [古]
    JP_SHUANG_LI_ZHI_SCORE = 2,                     // 双立直
    JP_KAI_LI_ZHI_ZIMO_SCORE = 968,                 // 开立直 [古]

    // 1番
    JP_MIAO_SHOU_HUI_CHUN_SCORE = 20,               // 海底捞月
    JP_HAI_DI_YAO_YUE_SCORE = 21,                   // 河底捞鱼
    JP_GANG_SHANG_KAI_HUA_SCORE = 19,               // 岭上开花
    JP_QIANG_GANG_HE_SCORE = 22,                    // 抢杠
    JP_SAN_SE_SAN_BU_GAO_SCORE = 967,               // 三色三步 [古]
    JP_QUAN_FENG_KE_SCORE = 8,                      // 圈风刻
    JP_MEN_FENG_KE_SCORE = 9,                       // 门风刻
    JP_SANYUAN_KE_SCORE = 10,                       // 三元牌
    JP_PING_HE_SCORE = 16,                          // 平和
    JP_DUAN_YAO_SCORE = 13,                         // 断幺九
    JP_YI_BAN_GAO_SCORE = 17,                       // 一杯口
    JP_ZI_MO_SCORE = 4,                             // 自摸
    JP_LI_ZHI_SCORE = 1,                            // 立直
    JP_YI_FA_SCORE = 3,                             // 一发
    JP_YAN_FAN_SCORE = 966,                         // 燕返 [古]
    JP_GANG_ZHEN_SCORE = 965,                       // 杠振 [古]
    JP_SHI_ER_LUO_TAI_SCORE = 964,                  // 十二落抬 [古]
    JP_BAO_PAI_SCORE = 32,                          // 宝牌
    JP_LI_BAO_PAI_SCORE = 34,                       // 里宝牌
    JP_CHI_BAO_PAI_SCORE = 33,                      // 赤宝牌
}
