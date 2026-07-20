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

import {E_FAN_TYPE} from "../../../const/EnumConst";

export class SettingConfHelp {
    /**
     * 获得役种列表
     * @param id 按钮ID
     * @returns
     */
    static getYiConfsById(id: number): iYiConf[] {
        return YiConfs[id];
    }
}

///////////////////////////////////配置/////////////////////////////////////////
const YiConfs = {
    [1]: [{
        id: E_FAN_TYPE.JP_LI_ZHI_SCORE,
        name: `立直`,
        des: "门前清状态听牌即可立直，立直状态下和牌",
        img: "prefab/SettingUI/YiTypes/1/LiZhi",
        preconditions: "门前清限定"
    },
        {
            id: E_FAN_TYPE.JP_DUAN_YAO_SCORE,
            name: `断幺九`,
            des: "手牌中不包括幺九牌（19万， 19筒， 19条，字牌）",
            img: "prefab/SettingUI/YiTypes/1/DuanYaoJiu"
        },
        {
            id: E_FAN_TYPE.JP_ZI_MO_SCORE,
            name: `门前清自摸和`,
            des: "门前清状态下自摸和牌",
            img: "prefab/SettingUI/YiTypes/1/MenQianQingZiMoHe",
            preconditions: "门前清限定"
        },
        {
            id: E_FAN_TYPE.JP_MEN_FENG_KE_SCORE,
            name: `役牌：自风牌`,
            des: "包含自风刻子",
            img: "prefab/SettingUI/YiTypes/1/YP_ZiFengPai"
        },
        {
            id: E_FAN_TYPE.JP_QUAN_FENG_KE_SCORE,
            name: `役牌：场风牌`,
            des: "包含场风刻子",
            img: "prefab/SettingUI/YiTypes/1/YP_ChangFengPai"
        },
        {
            id: E_FAN_TYPE.JP_SANYUAN_KE_SCORE,
            name: `役牌：三元牌`,
            des: "包含白，发，中的刻子",
            img: "prefab/SettingUI/YiTypes/1/YP_SanYuanPai"
        },
        {
            id: E_FAN_TYPE.JP_PING_HE_SCORE,
            name: `平和`,
            des: "4组顺子+非役牌的雀头+最后是顺子的两面听",
            img: "prefab/SettingUI/YiTypes/1/PingHe",
            preconditions: "门前清限定"
        },
        {
            id: E_FAN_TYPE.JP_YI_BAN_GAO_SCORE,
            name: `一杯口`,
            des: "2组完全相同的顺子",
            img: "prefab/SettingUI/YiTypes/1/YiBeiKou",
            preconditions: "门前清限定"
        },
        {
            id: E_FAN_TYPE.JP_QIANG_GANG_HE_SCORE,
            name: `抢杠`,
            des: "别家加杠的时候荣和（国士无双可以抢暗杠）",
            img: "prefab/SettingUI/YiTypes/1/QiangGang",
            preconditions: "门前清限定"
        },
        {
            id: E_FAN_TYPE.JP_GANG_SHANG_KAI_HUA_SCORE,
            name: `岭上开花`,
            des: "用摸到的岭上牌和牌",
            img: "prefab/SettingUI/YiTypes/1/LingShangKaiHua"
        },
        {
            id: E_FAN_TYPE.JP_MIAO_SHOU_HUI_CHUN_SCORE,
            name: `海底捞月`,
            des: "最后一张牌自摸和牌",
            img: "prefab/SettingUI/YiTypes/1/HaiDiMoYue"
        },
        {
            id: E_FAN_TYPE.JP_HAI_DI_YAO_YUE_SCORE,
            name: `河底捞鱼`,
            des: "最后一张牌荣和",
            img: "prefab/SettingUI/YiTypes/1/HaiDiLaoYu"
        },
        {
            id: E_FAN_TYPE.JP_YI_FA_SCORE,
            name: `一发`,
            des: "立直后，无人鸣牌的状态下一巡和牌",
            img: "prefab/SettingUI/YiTypes/1/YiFa"
        },
        {
            id: E_FAN_TYPE.JP_BAO_PAI_SCORE,
            name: `宝牌`,
            des: "宝牌指示牌的下一张牌",
            img: "prefab/SettingUI/YiTypes/1/BaoPai",
            preconditions: "不是役"
        },
        {
            id: E_FAN_TYPE.JP_CHI_BAO_PAI_SCORE,
            name: `赤宝牌`,
            des: "红5万，红5筒，红5索",
            img: "prefab/SettingUI/YiTypes/1/ChiBaoPai",
            preconditions: "不是役"
        },
        // { id: E_FAN_TYPE.JP_LI_BAO_PAI_SCORE, name: `北宝牌`, des: "在三人麻将种，北风在拔北操作后可以被当作宝牌（手牌中不算）", img: "prefab/SettingUI/YiTypes/1/BeiBaoPai", preconditions: "不是役" },
        //  {id:1, name:`古役：燕返`, des:"荣和别家的立直宣言牌（仅第一张的宣言牌）", img:"ui/setting/tiao4/spriteFrame", preconditions:"段位场不使用"},
        //  {id:1, name:`古役：杠振`, des:"在别家杠完后打出一张牌时自家荣和", img:"ui/setting/tiao4/spriteFrame", preconditions:"段位场不使用"},
        //  {id:1, name:`古役：十二落抬`, des:"四幅露自摸或者荣和", img:"ui/setting/tiao4/spriteFrame", preconditions:"段位场不使用"},
    ],
    [2]: [{
        id: E_FAN_TYPE.JP_SHUANG_LI_ZHI_SCORE,
        name: `两立直`,
        des: "轮到自己之前无人鸣牌的状态下第一巡就立直",
        img: "prefab/SettingUI/YiTypes/2/LiangLiZhi",
        preconditions: "门前清限定"
    },
        {
            id: E_FAN_TYPE.JP_SAN_TONG_KE_SCORE,
            name: `三色同刻`,
            des: "万，筒，索都有相同数字的刻子",
            img: "prefab/SettingUI/YiTypes/2/SanSeTongKe"
        },
        {
            id: E_FAN_TYPE.JP_SAN_GANG_SCORE,
            name: `三杠子`,
            des: "一人开杠3次",
            img: "prefab/SettingUI/YiTypes/2/SanGangZi"
        },
        {
            id: E_FAN_TYPE.JP_PENG_PENG_HE_SCORE,
            name: `对对和`,
            des: "拥有4组刻子或者杠",
            img: "prefab/SettingUI/YiTypes/2/DuiDuiHe"
        },
        {
            id: E_FAN_TYPE.JP_SAN_AN_KE_SCORE,
            name: `三暗刻`,
            des: "拥有3组没有碰的刻子",
            img: "prefab/SettingUI/YiTypes/2/SanAnKe"
        },
        {
            id: E_FAN_TYPE.JP_XIAO_SAN_YUAN_SCORE,
            name: `小三元`,
            des: "包含白、发、中其中2种的刻子+剩下1种的雀头",
            img: "prefab/SettingUI/YiTypes/2/XiaoSanYuan"
        },
        {
            id: E_FAN_TYPE.JP_HUN_YAO_JIU_SCORE,
            name: `混老头`,
            des: "胡牌时只包含老头牌（19万，19筒，19索）和字牌",
            img: "prefab/SettingUI/YiTypes/2/HunLaoTou"
        },
        {
            id: E_FAN_TYPE.JP_QI_DUI_SCORE,
            name: `七对子`,
            des: "7组不同的对子",
            img: "prefab/SettingUI/YiTypes/2/QiDuiZi",
            preconditions: "门前清限定"
        },
        {
            id: E_FAN_TYPE.JP_HUN_QUAN_DAI_YAO_JIU_SCORE,
            name: `混全带幺九`,
            des: "包含老头牌加上字牌的4组顺子和刻子+幺九牌的雀头",
            img: "prefab/SettingUI/YiTypes/2/HunQuanDaiYaoJiu",
            preconditions: "副露减1番"
        },
        {
            id: E_FAN_TYPE.JP_QING_LONG_SCORE,
            name: `一气通贯`,
            des: "同种数牌组成123，456，789的顺子",
            img: "prefab/SettingUI/YiTypes/2/YiQiGuanTong",
            preconditions: "副露减1番"
        },
        {
            id: E_FAN_TYPE.JP_SAN_SE_SAN_TONG_SHUN_SCORE,
            name: `三色同顺`,
            des: "万，筒，索都有相同数字的顺子",
            img: "prefab/SettingUI/YiTypes/2/SanSeTongShun",
            preconditions: "副露减1番"
        },
        //  {id:2, name:`古役：五门齐`, des:"包含万，筒，索，风牌，三元牌", img:"ui/setting/tiao4/spriteFrame", preconditions:"段位场不使用"},
        //  {id:2, name:`古役：三连刻`, des:"包含三个连续的同种类的刻字", img:"ui/setting/tiao4/spriteFrame", preconditions:"段位场不使用"},   
    ],
    [3]: [{
        id: E_FAN_TYPE.JP_ER_BEI_KOU_SCORE,
        name: `二杯口`,
        des: "包含2组一杯口",
        img: "prefab/SettingUI/YiTypes/3/ErBeiKou",
        preconditions: "门前清限定"
    },
        {
            id: E_FAN_TYPE.JP_CHUN_QUAN_DAI_YAO_JIU_SCORE,
            name: `纯全带幺九`,
            des: "只包含老头牌的4组顺子和刻子+老头牌的雀头",
            img: "prefab/SettingUI/YiTypes/3/ChunQuanDaiYaoJiu",
            preconditions: "副露减1番"
        },
        {
            id: E_FAN_TYPE.JP_HUN_YI_SE_SCORE,
            name: `混一色`,
            des: "只包含1种牌数，并且含有字牌的刻子或者雀头",
            img: "prefab/SettingUI/YiTypes/3/HunYiSe",
            preconditions: "副露减1番"
        },
        //  {id:3, name:`古役：一色三同顺`, des:"包含三组完全相同的顺子", img:"ui/setting/tiao4/spriteFrame", preconditions:"副露减1番, 段位场不使用"},
    ],
    [4]: [
        {
            id: E_FAN_TYPE.JP_QING_YI_SE_SCORE,
            name: `清一色`,
            des: "只包含1种数牌，不能含有字牌",
            img: "prefab/SettingUI/YiTypes/4/QingYiSe",
            preconditions: "副露减1番"
        },
    ],
    [5]: [
        {
            id: E_FAN_TYPE.JP_LIU_JU_MAN_GUAN_SCORE,
            name: `流局满贯`,
            des: "自己的舍张全是幺九牌并且没有被他家吃碰杠的状态下荒牌流局",
            img: "prefab/SettingUI/YiTypes/5/LiuJuManGuan"
        },
        // {id:5, name:`古役：一筒摸月`, des:"最后一张牌自摸和牌，且这张牌为1筒（5番）", img:"ui/setting/tiao4/spriteFrame", preconditions:"段位场不使用"},
        // {id:5, name:`古役：九筒捞鱼`, des:"最后一张牌自摸和牌，且这张牌为9筒（5番）", img:"ui/setting/tiao4/spriteFrame", preconditions:"段位场不使用"},
    ],
    [6]: [
        {
            id: E_FAN_TYPE.JP_TIAN_HE_SCORE,
            name: `天和`,
            des: "庄家第一巡和牌",
            img: "prefab/SettingUI/YiTypes/6/TianHe",
            preconditions: "庄家限定"
        },
        {
            id: E_FAN_TYPE.JP_DI_HE_SCORE,
            name: `地和`,
            des: "轮到自己之前无人鸣牌的状态下第一巡自摸和牌",
            img: "prefab/SettingUI/YiTypes/6/DiHe",
            preconditions: "子家限定"
        },
        {
            id: E_FAN_TYPE.JP_DA_SAN_YUAN_SCORE,
            name: `大三元`,
            des: "包含白、发、中的三组刻子",
            img: "prefab/SettingUI/YiTypes/6/DaSanYuan"
        },
        {
            id: E_FAN_TYPE.JP_SI_AN_KE_SCORE,
            name: `四暗刻`,
            des: "包含没有碰的4组刻子",
            img: "prefab/SettingUI/YiTypes/6/SiAnKe",
            preconditions: "门前清限定"
        },
        {id: E_FAN_TYPE.JP_ZI_YI_SE_SCORE, name: `字一色`, des: "只包含字牌", img: "prefab/SettingUI/YiTypes/6/ZiYiSe"},
        {
            id: E_FAN_TYPE.JP_LV_YI_SE_SCORE,
            name: `绿一色`,
            des: "只包含索子的23468以及发",
            img: "prefab/SettingUI/YiTypes/6/LvYiSe",
            preconditions: "无发也可以"
        },
        {
            id: E_FAN_TYPE.JP_QING_YAO_JIU_SCORE,
            name: `清老头`,
            des: "手牌中只有老头牌(19万，19筒，19索）",
            img: "prefab/SettingUI/YiTypes/6/QingLaoTou"
        },
        {
            id: E_FAN_TYPE.JP_SHI_SAN_YAO_SCORE,
            name: `国士无双`,
            des: "全部十三种幺九牌各1张外加其中一张再有1张",
            img: "prefab/SettingUI/YiTypes/6/GuoShiWuShuang",
            preconditions: "门前清限定"
        },
        {
            id: E_FAN_TYPE.JP_XIAO_SI_XI_SCORE,
            name: `小四喜`,
            des: "包含三种风牌的刻子+剩下一种风牌的雀头",
            img: "prefab/SettingUI/YiTypes/6/XiaoSiXi"
        },
        {
            id: E_FAN_TYPE.JP_SI_GANG_SCORE,
            name: `四杠子`,
            des: "1人开杠4次",
            img: "prefab/SettingUI/YiTypes/6/SiGangZi"
        },
        {
            id: E_FAN_TYPE.JP_JIU_LIAN_BAO_DENG_SCORE,
            name: `九莲宝灯`,
            des: "同一种数牌1112345678999+中任意一种再有1张",
            img: "prefab/SettingUI/YiTypes/6/JiuLianBaoDeng",
            preconditions: "门前清限定"
        },
        // {id:6, name:`古役：人和`, des:"身为子家，第一巡无人鸣牌的情况下，轮到自己摸牌前荣和", img:"ui/setting/tiao4/spriteFrame", preconditions:"门前清限定， 段位场不使用"},
        // {id:6, name:`古役：大车轮`, des:`由筒子“2-8"各两张牌所组成的七对子`, img:"ui/setting/tiao4/spriteFrame", preconditions:"门前清限定， 段位场不使用"},
        // {id:6, name:`古役：大竹林`, des:`由索子“2-8"各两张牌所组成的七对子`, img:"ui/setting/tiao4/spriteFrame", preconditions:"门前清限定， 段位场不使用"},
        // {id:6, name:`古役：大数邻`, des:`由万子“2-8"各两张牌所组成的七对子`, img:"ui/setting/tiao4/spriteFrame", preconditions:"门前清限定， 段位场不使用"},
        // {id:6, name:`古役：石上三年`, des:`两立直+海底捞月 或 两立直+河底捞鱼`, img:"ui/setting/tiao4/spriteFrame", preconditions:"门前清限定， 段位场不使用"},
    ],
    [7]: [
        {
            id: E_FAN_TYPE.JP_SI_AN_KE_DAN_JI_SCORE,
            name: `四暗刻单骑`,
            des: "四暗刻最后单骑听牌和牌",
            img: "prefab/SettingUI/YiTypes/7/SiAnKeDanQi",
            preconditions: "门前清限定"
        },
        {
            id: E_FAN_TYPE.JP_GUO_SHI_WU_SHUANG_13MIAN_SCORE,
            name: `国士无双十三面`,
            des: "国士无双追后13面听牌和牌",
            img: "prefab/SettingUI/YiTypes/7/GuoShiWuShuangShiSanMian",
            preconditions: "门前清限定"
        },
        {
            id: E_FAN_TYPE.JP_CHUN_JIU_LIAN_BAO_DENG_SCORE,
            name: `纯正九莲宝灯`,
            des: "九连宝灯最后9面听牌和牌",
            img: "prefab/SettingUI/YiTypes/7/ChunZhengJiuLianBaoDeng",
            preconditions: "门前清限定"
        },
        {
            id: E_FAN_TYPE.JP_DA_SI_XI_SCORE,
            name: `大四喜`,
            des: "包含4种风牌的刻子",
            img: "prefab/SettingUI/YiTypes/7/DaSiXi"
        },
        // {id:7, name:`古役：大七星`, des:"由其中字牌所组成的七对子", img:"ui/setting/tiao4/spriteFrame", preconditions:"门前清限定， 段位场不使用"},
    ],
    [8]: [
        {
            id: 8888,
            name: `四风连打`,
            des: "无人鸣牌的状况下4人都在第一巡打出同一种风牌",
            img: "prefab/SettingUI/YiTypes/8/SiFengLianDa"
        },
        {id: 8888, name: `四杠散了`, des: "2人以上合计开杠4次", img: "prefab/SettingUI/YiTypes/8/SiGangSanLe"},
        {
            id: 8888,
            name: `九种九牌`,
            des: "第一巡轮到自己之前无人鸣牌的状态下拥有9种及以上的幺九牌",
            img: "prefab/SettingUI/YiTypes/8/JiuZhongJiuPai"
        },
        {id: 8888, name: `四家立直`, des: "4人全部宣告立直成功", img: ""},
    ]
}

export interface iYiConf {
    /**番数*/
    id: number;
    /**番数名称*/
    name: string;
    /**牌型说明 */
    des: string;
    /**牌型展示图片 */
    img: string;
    /**前置条件 */
    preconditions?: string;
}