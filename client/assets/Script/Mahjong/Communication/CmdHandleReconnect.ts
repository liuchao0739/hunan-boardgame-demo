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

import {GlobalVar} from "../../GlobalVar";
import {ClubEntity} from "../../Home/Entity/ClubEntity";
import {App} from "../../Module/App";
import {HttpCtrl} from "../../framework/ctrl/HttpCtrl";
import {EProtocolID} from "../../framework/network/protocol-configs";
import {CallBack} from "../../framework/utils/CallBack";
import protocol from "../../protocols/protocol.js";
import {DoraHint} from "../Ui/Main/UiDoraHint";
import {UiMain} from "../Ui/Main/UiMain";
import {UiCountdown} from "../Ui/Popup/UiCountdown";
import {DiscardedCardPlace} from "../World/Ctrl/Discard";
import {DrawCardLocal, DrawCardNonlocal} from "../World/Ctrl/DrawCard";
import {FirstDrawHandcardLocal, FirstDrawHandcardNonlocal} from "../World/Ctrl/FirstDrawHandcard";
import {OpIndicator} from "../World/Ctrl/Operation/OpIndicator";
import {Reset} from "../World/Ctrl/Reset";
import {CardFactory} from "../World/Entity/Card/CardFactory";
import {CardSort} from "../World/Entity/Card/CardSort";
import {CardShown, CardShownType} from "../World/Entity/CardShown/CardShown";
import {CardShownDisplay} from "../World/Entity/CardShown/CardShownDisplay";
import {Player, PlayerMgr} from "../World/Entity/Player/Player";
import {CardHint} from "../World/Support/CardHint";
import {GameState} from "../World/Support/GameState";
import {SettingsData} from "../World/Support/SettingsDataPresist";
import {WorldNode} from "../World/Support/WorldNode";
import {tileUtils} from "../World/Support/tile-utils";
import {ScMapping} from "./CardIdMapping";
import {PlayerViewHelper} from "./CommRecv";
import {DataParse} from "./DataParse";
import {OpCode} from "./OpCode";

export class CmdHandleReconnect {

    public static exe(data: Uint8Array) {
        GlobalVar.userGrabCard = null;
        Reset.exe();

        let pb = protocol.mahjong_jp.TableReconectInfo.decode(data);
        console.log("【断线重连】", pb);

        GameState.ins.doraValuesMap.clear();
        if (pb.doraCards) {
            pb.doraCards.forEach(value => {
                const doraValue = tileUtils.calculateDoraValue(value);
                GameState.ins.doraValuesMap.set(doraValue, true)
            });
        }

        this.dora(pb);
        this.center(pb);

        // 预处理玩家对象
        this.players(pb);
        this.players2(pb);

        this.local(pb);

        this.indicator(pb);

        // 操作倒计时
        this.countdown(pb);

        // 游戏状态 1: 游戏中，2: 非游戏中
        if (pb.gameState == 1) {
            // 游戏状态 0--游戏未开始（刚进入房间） 1--游戏准备开始 2--游戏开始 3--一场结束（只有一场结束才能退出房间）
            GameState.ins.gameStatus = 2;
            UiMain.ins.border.btnQuit.active = false;
            UiMain.ins.exitTable.hide();

            if (!UiMain.ins.uiAutoOpUI.root.active) {
                UiMain.ins.uiAutoOpUI.root.active = true;
            }
        } else {
            GameState.ins.gameStatus = 0;
            UiMain.ins.border.btnQuit.active = true;
            // 取消离开房间的展示，因为游戏准备状态，断线重连回来，也是非游戏中
            // UiMain.ins.exitTable.show();
        }

        // 设置XX局XX场
        GameState.ins.currQuan = pb.curQaun;
        DoraHint.ins.roundChangSet(pb.curQaun, pb.nRound, pb.nBenJu);
        GlobalVar.loadGameOver = true;
        PlayerMgr.ins.local.gameData.bankerSeatID = pb.bankSeatID;
        // 0--普通模式 1--钻石模式
        ClubEntity.isDiamond = pb.tablemode == 1 ? true : false;

        // 当前牌桌UUID
        ClubEntity.enterRoomUUID = pb.uuid;
        App.getInst(HttpCtrl).requestServer(EProtocolID.CLUB_GET_TABLEINFO, {tableId: pb.uuid}, new CallBack((params: any) => {
            console.log('重连 获取牌桌信息', params)
            ClubEntity.birdGodMatchLevel = params.level;
            ClubEntity.birdGodMatchMode = params.createSrc == 1;
        }, this)).then(() => {
        });
    }

    // 左上角UI
    private static dora(pb: protocol.mahjong_jp.TableReconectInfo) {
        // 左上角UI
        let doraHint = DoraHint.ins;
        doraHint.gongTuoSet(pb.gongtuo);
        doraHint.benChangSet(pb.nBenJu);

        DoraHint.ins.showAllCardsBack();
        for (let i = 0; i < pb.doraCards.length; ++i) {
            let cardId = ScMapping.cardId_s2c(pb.doraCards[i]);
            doraHint.setCard(i, cardId);
        }
    }

    // 中间信息
    private static center(pb: protocol.mahjong_jp.TableReconectInfo) {
        let info = WorldNode.ins.info;
        info.setRound(pb.curQaun, pb.nRound);
        info.setLeft(pb.leftCardCount);
        GameState.ins.shanCardNum = pb.leftCardCount;
    }

    private static players(pb: protocol.mahjong_jp.TableReconectInfo) {
        const playerIDs: number[] = [];
        for (let pbPlayer of pb.players) {
            const id = pbPlayer.userId;

            playerIDs.push(id);

            let player = PlayerMgr.ins.all.get(id);
            if (player == null) {
                player = new Player();
                player.info.id = id;
                PlayerMgr.ins.all.set(id, player);
            }

            player.gameData.seatId = pbPlayer.seatId;

            player.info.nickname = pbPlayer.nickname;
            player.info.dianShu = pbPlayer.dianshu;

            player.info.iconId = pbPlayer.headerId;


            player.gameData.isTrustee = pbPlayer.ai == 1 ? true : false;
            player.gameData.isReady = pbPlayer.isReady;

            DataParse.parsePlayerStatics(pbPlayer.statics, player);

        } // end for

        // 移除已不在桌上的玩家
        const invalidPlayerIDs: string[] = [];

        for (const [userID, _] of PlayerMgr.ins.all) {
            if (playerIDs.indexOf(Number(userID)) < 0) {
                invalidPlayerIDs.push(userID);
            }
        }

        invalidPlayerIDs.forEach(id => {
            console.log(`delete invalid player: ${id}`);
            PlayerMgr.ins.all.delete(id);
        });

        // console.log("【断线重连】 player all", PlayerMgr.ins.all);
        PlayerViewHelper.exe(pb.bankSeatID);
    }

    private static players2(pb: protocol.mahjong_jp.TableReconectInfo) {

        console.log("=====断线重连==local:", PlayerMgr.ins.local);
        for (let pbPlayer of pb.players) {
            let player = PlayerMgr.ins.all.get(pbPlayer.userId);

            // 手牌
            let ids = new Array<string>();
            for (let n of pbPlayer.holds) {
                ids.push(ScMapping.cardId_s2c(n));
            }

            if (player == PlayerMgr.ins.local) {

                // 本机
                FirstDrawHandcardLocal.exe(player, ids, false);

                // 本机--新添加
                let val = pbPlayer.ai == 1 ? true : false;
                // UiMain.ins.btnTrustee.setMode(!val);
                SettingsData.ins.isTrustee = val;
                if (val) {
                    UiMain.ins.trusteeUI.show();
                } else {
                    UiMain.ins.trusteeUI.hide();
                }

                // 本机不显示操作 UI
                UiMain.ins.popup.op.root.active = false;
                UiMain.ins.popup.select.root.active = false;

                // 是否立直
                PlayerMgr.ins.local.gameData.isLiZhi = pbPlayer.tingPai == 0 ? false : true;
                // 立直数据
                SettingsData.ins.isLizhi = pbPlayer.tingPai == 0 ? false : true;

            } else {
                // 非本机
                if (pb.curOutCardUid == Number(player.info.id)) {
                    // 当前出牌者
                    FirstDrawHandcardNonlocal.exe(player, pbPlayer.holdCount - 1, false);
                    DrawCardNonlocal.exe(player, "wan1");
                } else {
                    FirstDrawHandcardNonlocal.exe(player, pbPlayer.holdCount, false);
                }

            }

            // 打出去的牌
            let idxLiZhi = pbPlayer.lizhiPaiIndex;
            for (let i = 0; i < pbPlayer.outCards.length; ++i) {

                let pbCardInfo = pbPlayer.outCards[i];
                let cardId = ScMapping.cardId_s2c(pbCardInfo.outCard);
                let card = DiscardedCardPlace.exe(player, cardId, idxLiZhi == i ? false : true, false);
                // 显示摸切提示
                if (pbCardInfo.moQie) {
                    CardHint.moQie(card);
                }

            } // end for

            // 是否立直
            player.persentation.seat.flagLiZhi.active = pbPlayer.tingPai == 0 ? false : true;

            // 准备
            player.persentation.info.flagReady.active = pbPlayer.isReady;

            // 点数


            this.fuLu(player, pbPlayer);

        } // end for

        // 显示点数
        UiMain.ins.btnCenter.showDianShu();

        // 出牌固定时间
        GameState.ins.fixDurationDiscard = pb.outCardTimeOut;
        // 操作固定时间
        GameState.ins.fixDurationOp = pb.operationTimeOut;

    }

    // 副露
    private static fuLu(player: Player, pbPlayer: protocol.mahjong_jp.IPlayerInfoReconect) {
        console.log("副露：", pbPlayer.fulus);
        for (let fulu of pbPlayer.fulus) {

            let type = fulu.fuluType;

            var cardShown = new CardShown();

            // 牌值
            for (let n of fulu.cards) {
                let cardId = ScMapping.cardId_s2c(n);
                cardShown.cards.push(CardFactory.create3d(cardId));
            }
            CardSort.exe(cardShown.cards);
            player.gameData.cardShown.push(cardShown);

            if (type & OpCode.OPE_LEFT_CHI) {
                // 吃
                cardShown.type = CardShownType.Chi;
            } else if (type & OpCode.OPE_MIDDLE_CHI) {
                // 吃
                cardShown.type = CardShownType.Chi;
                // 中吃取中间的牌横放在最左边
                let mCardMid = cardShown.cards[1];
                cardShown.cards.splice(1, 1);
                cardShown.cards.unshift(mCardMid);
            } else if (type & OpCode.OPE_RIGHT_CHI) {
                // 吃
                cardShown.type = CardShownType.Chi;
                // 右吃取最大的牌横放在最左边
                let mCardRight = cardShown.cards[2];
                cardShown.cards.splice(2, 1);
                cardShown.cards.unshift(mCardRight);
            } else if (type & OpCode.OPE_PENG) {
                // 碰
                var type2 = CardShownType.None;
                if (fulu.pos == 3) {
                    type2 = CardShownType.PengPrevious
                } else if (fulu.pos == 2) {
                    type2 = CardShownType.PengOpposite
                } else if (fulu.pos == 1) {
                    type2 = CardShownType.PengNext
                }
                cardShown.type = type2;

            } else if (type & OpCode.OPE_GANG || type & OpCode.OPE_GANG_HU) {
                // 明杠
                var type2 = CardShownType.None;
                if (fulu.pos == 3) {
                    type2 = CardShownType.GangPrevious
                } else if (fulu.pos == 2) {
                    type2 = CardShownType.GangOpposite
                } else if (fulu.pos == 1) {
                    type2 = CardShownType.GangNext
                }
                cardShown.type = type2;

            } else if (type & OpCode.OPE_AN_GANG) {
                // 暗杠
                cardShown.type = CardShownType.GangDark;
            } else if (type & OpCode.OPE_BU_GANG) {
                // 补杠
                var type2 = CardShownType.None;
                if (fulu.pos == 3) {
                    type2 = CardShownType.PengPreviousGang
                } else if (fulu.pos == 2) {
                    type2 = CardShownType.PengOppositeGang
                } else if (fulu.pos == 1) {
                    type2 = CardShownType.PengNextGang
                }
                cardShown.type = type2;

            }

        } // end for

        CardShownDisplay.exe(player);

    }

    // 本机显示
    private static local(pb: protocol.mahjong_jp.TableReconectInfo) {

        // 摸牌完成标记
        FirstDrawHandcardLocal.isComplete = true;

        // 振听
        UiMain.ins.zhenTing.active = pb.isZhenTing;

        // 听牌提示
        DataParse.huCardInfo(pb.hucard);

        // console.log("refresh hand 1:", ...PlayerMgr.ins.local.gameData.handcard);
        // 摸起来的牌 游戏中才显示     // 游戏状态 1: 游戏中，2: 非游戏中
        if (pb.gameState == 1 && pb.byGrabCard != 0xFF) {
            let cardId = ScMapping.cardId_s2c(pb.byGrabCard);
            DrawCardLocal.exe(PlayerMgr.ins.local, cardId, false);
        }

        // console.log("refresh hand 2:", ...PlayerMgr.ins.local.gameData.handcard);
        // 操作者不能出的牌
        let touchHandcard = UiMain.ins.touchHandcard;
        touchHandcard.clearDiscardLimit();
        for (let n of pb.disableCards) {
            touchHandcard.cardIdsCannot.add(ScMapping.cardId_s2c(n));
        }
        // console.log("refresh hand 3:", ...PlayerMgr.ins.local.gameData.handcard);
        touchHandcard.refresh();


        if (pb.gameState == 1) {
            // 游戏中

            for (let player of PlayerMgr.ins.all.values()) {
                // 准备标致不显示
                player.persentation.info.flagReady.active = false;
            } // end for

        }


        // 1.轮到用户出牌, 2.轮到用户操作, 3.不是轮到用户，闲置状态
        if (pb.curState == 1) {

        } else if (pb.curState == 2) {

            // 杠牌
            let gangIds: Array<string> = undefined;
            if (pb.gangCards != null) {
                gangIds = new Array<string>();
                for (let n of pb.gangCards) {
                    gangIds.push(ScMapping.cardId_s2c(n));
                }
            }
            DataParse.parseOpUi(pb.nOpWeight, pb.preOutCardUid, ScMapping.cardId_s2c(pb.byOutCard), gangIds);

        }

    }

    // 操作倒计时
    private static countdown(pb: protocol.mahjong_jp.TableReconectInfo) {

        if (pb.fixedTimeout == -1) return;

        if (pb.fixedTimeout <= 0 && pb.diffTimeout <= 0) return;

        if (pb.diffTimeout < 0) {
            pb.diffTimeout = 0;
        }
        // 操作倒计时
        UiCountdown.ins.show(pb.fixedTimeout, pb.diffTimeout);

    }

    // 当前操作者
    private static indicator(pb: protocol.mahjong_jp.TableReconectInfo) {

        let id: any = pb.curOutCardUid;
        let player = PlayerMgr.ins.all.get(id);
        if (player == null) {
            console.log("重连：找不到操作者");
            return;
        }
        OpIndicator.exe(player);

    }

}