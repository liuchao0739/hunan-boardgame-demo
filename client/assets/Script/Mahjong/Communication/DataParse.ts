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

import protocol from "../../protocols/protocol.js";
import {UiMain} from "../Ui/Main/UiMain";
import {CardDisplay} from "../World/Entity/Card/CardDisplay";
import {Player, PlayerTingData} from "../World/Entity/Player/Player";
import {SettingsData} from "../World/Support/SettingsDataPresist";
import {ScMapping} from "./CardIdMapping";
import {CommSend} from "./CommSend";
import {OpCode} from "./OpCode";


// 数据解析
export class DataParse {


    //     public static Uint8ToString(u8a){
    //         // var CHUNK_SZ = 0x8000;
    //         // var c = [];
    //         // for (var i=0; i < u8a.length; i+=CHUNK_SZ)
    //         // {
    //         //     c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
    //         // }
    //         // return c.join("");
    //     } // Usage var u8 = new Uint8Array([65, 66, 67, 68]); var b64encoded = btoa(Uint8ToString(u8));

    // pb 到 内部数据结构
    public static parsePlayer(pbPlayer: protocol.mahjong_jp.IPlayerInfo, player: Player) {
        console.log("【设置setOrien】:", pbPlayer);
        console.log("seattid1:", pbPlayer.seatId);
        player.info.id = pbPlayer.userId;
        player.info.nickname = pbPlayer.nickname;
        player.info.iconId = pbPlayer.headerId;

        player.gameData.seatId = pbPlayer.seatId;
        player.gameData.seatOrien = ScMapping.orien_s2c(pbPlayer.seatId);

        player.gameData.isReady = pbPlayer.ready == 1 ? true : false;

        console.log("seattid2:", player.gameData.seatId);
        console.log("seatOrien:", player.gameData.seatOrien);
        // 统计信息
        this.parsePlayerStatics(pbPlayer.statics, player);

    }

    public static parsePlayerStatics(pb: protocol.mahjong_jp.IPlayerPlayStaticsInfo, player: Player) {

        player.info.chart = pb.shijuStatus;

        // 段位名称: 日麻高手xxxx
        player.info.lvName = pb.nameNick1;
        // 段位等级: 雀圣LV1
        player.info.lvName2 = pb.nameNick2;

        player.info.pjsw = pb.avgShunwei;

        player.info.WL1 = pb.oneLv;
        player.info.WL2 = pb.twoLv;
        player.info.WL3 = pb.threeLv;
        player.info.WL4 = pb.fourLv;

        player.info.HP = pb.heLv;
        player.info.FC = pb.paoLv;
        player.info.LZ = pb.lizhiLv;
        player.info.FL = pb.fuluLv;

        player.info.ZDJS = pb.gameCount;
        player.info.PJHPXM = pb.heXunCount;
        player.info.PJHPDS = pb.avgDianshu;
        player.info.PJFC = pb.avgFangchou;

    }

    // 显示操作UI
    /*
        UserOutCardRespond 发：吃、碰、杠（明杠），胡(荣) --> 日麻胡别人的牌叫荣和
        UserGrabCard 发：自摸、胡、杠（暗杠，补杠），立直(相当于可以中麻的听牌)
        UserOperatorHint 发：抢杠胡
    */
    public static parseOpUi(opCode: number, playerId?: string, cardId?: string, cardIdsGang?: Array<string>) {
        // console.log("==parse op ui, opcode:", opCode, "===cardid:", cardId);
        var op = UiMain.ins.popup.op;
        op.reset();

        if (opCode == 0) return;


        // 是否已发送过操作
        let mHaveSendPass: boolean = false;
        // 2 托管状态下，不显示操作按钮，自动过
        if (SettingsData.ins.isTrustee == true) {
            CommSend.pass();
            op.btnPass.active = false;
            mHaveSendPass = true;
            op.root.active = false;
            return;
        }


        op.root.active = true;
        op.btnPass.active = true;
        op.playerId = playerId;
        op.cardId = cardId;
        op.cardIdsGang = cardIdsGang;

        // 恢复一些状态
        op.gangMing = false;
        op.gangHu = false;
        op.gangAn = false;
        op.gangBu = false;

        let strOp = "";
        // 是否暗杠或者加杠
        let isClosedQuadOrAddedOpenQuad: boolean = false;
        // 除了吃、碰、杠、过之外其他按钮是否有显示
        let mShowExpCPGG: boolean = false;

        // 右吃
        if (opCode & OpCode.OPE_RIGHT_CHI) {
            op.chiRight = true;
            op.btnChi.active = true;
            strOp += "右吃 ";
        }
        // 中吃
        if (opCode & OpCode.OPE_MIDDLE_CHI) {
            op.chiMiddle = true;
            op.btnChi.active = true;
            strOp += "中吃 ";
        }
        // 左吃
        if (opCode & OpCode.OPE_LEFT_CHI) {
            op.chiLeft = true;
            op.btnChi.active = true;
            strOp += "左吃 ";
        }
        // 碰
        if (opCode & OpCode.OPE_PENG) {
            op.btnPeng.active = true;
            strOp += "碰";
        }
        // 碰杠 (大明杠)
        if (opCode & OpCode.OPE_GANG) {
            op.btnGang.active = true;
            op.gangMing = true;
            strOp += "明杠 ";
        }
        // 抢杠胡
        if (opCode & OpCode.OPE_GANG_HU) {
            op.btnHu.active = true;
            op.gangHu = true;
            strOp += "抢杠胡 ";
            mShowExpCPGG = true;
        }
        // 暗杠
        if (opCode & OpCode.OPE_AN_GANG) {
            op.btnGang.active = true;
            op.gangAn = true;
            strOp += "暗杠 ";
            isClosedQuadOrAddedOpenQuad = true;
            if (cardIdsGang) {
                op.cardId = cardIdsGang[0];
            }
        }
        // 补杠
        if (opCode & OpCode.OPE_BU_GANG) {
            op.btnGang.active = true;
            op.gangBu = true;
            strOp += "补杠 ";
            isClosedQuadOrAddedOpenQuad = true;
            if (cardIdsGang) {
                op.cardId = cardIdsGang[0];
            }
        }
        // 胡/荣和
        if (opCode & OpCode.OPE_HU) {
            op.btnHu.active = true;
            strOp += "胡 ";
            mShowExpCPGG = true;
        }
        // 自摸
        if (opCode & OpCode.OPE_ZI_MO) {
            op.btnZiMo.active = true;
            strOp += "自摸 ";
            mShowExpCPGG = true;
        }
        // 立直
        if (opCode & OpCode.OPE_TING) {
            op.btnLiZhi.active = true;
            strOp += "立直 ";
            mShowExpCPGG = true;
        }
        // 新添加--流局
        if (opCode & OpCode.OPE_LIUJU) {
            op.btnLiuJu.active = true;
            strOp += "流局 ";
            mShowExpCPGG = true;
        }

        // 出现和牌选项时，不应该有振听的提示--2023.10.25
        if (op.btnHu.active) {
            UiMain.ins.zhenTing.active = false;
        }

        console.log("本机玩家操作。玩家ID：" + playerId + "opCode:" + opCode + " 操作：" + strOp);

        // "鸣"开启时，不显示吃碰杠（仅包括明杠）；同时屏蔽过操作，自动发送过牌
        // 如果有除了“吃碰杠”的其他按钮，就显示其他按钮。
        // 鸣牌是针对别人打出的牌，自己摸牌加杠或者暗杠是正常提示
        if (SettingsData.ins.mingHint == true) {
            op.btnChi.active = false;
            op.btnPeng.active = false;

            if (!isClosedQuadOrAddedOpenQuad) {
                op.btnGang.active = false;

                if (!mShowExpCPGG && !mHaveSendPass && op.btnPass.active) {
                    CommSend.pass();
                    mHaveSendPass = true;
                    op.btnPass.active = false;
                }
            }
        }
    }

    // 用户和鸣切按下之后的处理，暂未使用
    public static toHandleMing(mShowExpCPGG: boolean, mHaveSendPass: boolean): void {
        var op = UiMain.ins.popup.op;
        if (SettingsData.ins.mingHint == true) {
            // 除了吃、碰、杠、过之外还有其他按钮显示
            if (mShowExpCPGG) {
                op.btnChi.active = false;
                op.btnPeng.active = false;
                op.btnGang.active = false;
            } else {
                op.btnChi.active = false;
                op.btnPeng.active = false;
                op.btnGang.active = false;

                if (!mHaveSendPass && op.btnPass.active) {
                    CommSend.pass();
                    mHaveSendPass = true;
                    op.btnPass.active = false;
                }
            }
        }
    }

    // 胡牌信息
    public static huCardInfo(pb: protocol.mahjong_jp.IHucardInfo[]) {

        PlayerTingData.tingCards = [];
        PlayerTingData.willHuCards = [];
        PlayerTingData.huCardInfor = [];
        // 听牌提示
        if (pb == null || pb.length == 0) {
            console.log("显示听牌--false");
            UiMain.ins.border.btnTing.active = false;
            return;
        }


        // UiMain.ins.border.btnTing.active = true ;
        let ting = UiMain.ins.popup.ting;
        ting.removeAllItems();
        let isZhenTing = UiMain.ins.zhenTing.active;
        for (let pbHucard of pb) {
            for (let pbTing of pbHucard.tings) {
                let mCardItem = ScMapping.cardId_s2c(pbTing.card);
                if (PlayerTingData.tingCards.indexOf(mCardItem) == -1) {
                    PlayerTingData.tingCards.push(ScMapping.cardId_s2c(pbTing.card));
                }

                ting.addItem(ScMapping.cardId_s2c(pbTing.card), pbTing.shengyu, isZhenTing, pbTing.fans);
            } // end for
            PlayerTingData.willHuCards.push(ScMapping.cardId_s2c(pbHucard.card));
        } // end for
        PlayerTingData.huCardInfor = pb;

        // console.log(" HuCardInfo:", pb)
        // console.log("===TINGCARDS:", PlayerTingData.tingCards);
        // console.log("===willHuCards:", PlayerTingData.willHuCards);
        console.log("hucardinfor:", PlayerTingData.huCardInfor);

        // // 立直后，不能出的牌置灰
        // if(PlayerTingData.lizhiHave){
        //     UiMain.ins.touchHandcard.refreshWillHuCard(true);
        // }
    }

    // 吃、碰、杠、和 时高亮最后一张牌
    public static toHighLightLastCard(player: Player): void {
        let op = UiMain.ins.popup.op;
        // 吃、碰、杠、和 时，高亮对应的牌
        if (op.btnChi.active || op.btnPeng.active || op.btnGang.active || op.btnHu.active) {
            console.log("===to show light");
            // 取出被碰玩家打出的最后一张牌
            var discard = player.gameData.discard;
            var card = discard[discard.length - 1];
            CardDisplay.showCardLight(card);
        }
    }
}