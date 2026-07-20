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

import {Color, Input, Tween, tween} from "cc";
import {NumberRoll} from "../../framework/utils/NumberRoll";
import protocol from "../../protocols/protocol.js";
import {UiMain} from "../Ui/Main/UiMain";
import {UiBtnCountDown} from "../Ui/Popup/Settle/UiBtnCountDown";
import {UiSettleDianShu} from "../Ui/Popup/Settle/UiSettleDianShu";
import {UiSettleGame} from "../Ui/Popup/Settle/UiSettleGame";
import {UiSettleLiuJuHuangPai} from "../Ui/Popup/Settle/UiSettleLiuJuHuangPai";
import {UiSettleZhanJi} from "../Ui/Popup/Settle/UiSettleZhanJi";
import {UiCountdown} from "../Ui/Popup/UiCountdown";
import {DiscardedCardPlace} from "../World/Ctrl/Discard";
import {FirstDrawHandcardNonlocal} from "../World/Ctrl/FirstDrawHandcard";
import {OpIndicator} from "../World/Ctrl/Operation/OpIndicator";
import {Reset} from "../World/Ctrl/Reset";
import {CardDisplay} from "../World/Entity/Card/CardDisplay";
import {CardSort} from "../World/Entity/Card/CardSort";
import {Player, PlayerMgr} from "../World/Entity/Player/Player";
import {SoundEffect} from "../World/Support/Audio";
import {HandcardPersentation} from "../World/Support/HandcardOp";
import {OreinSeatIdx} from "../World/Support/LocalView";
import {SettingsData} from "../World/Support/SettingsDataPresist";
import {String3d} from "../World/Support/String3d";
import {ScMapping} from "./CardIdMapping";
import {CommSend} from "./CommSend";
import {OpCode} from "./OpCode";

/*
    自摸胡牌，放炮胡牌：        战绩结算 -> 点数结算 -> 下局
    流局满贯，庄家听牌流局：    战绩结算 -> 点数结算 -> 下局
    荒牌流局：                 荒牌流局UI ->点数结算 ->下局
    中途流局：                 中途流局UI -> 下局

*/

// 命令处理 局结算
export class CmdHandleSettleRound {

    // 一场完成标记
    public static isGameEnd = false;

    public static exe(data: Uint8Array) {
        let pb = protocol.mahjong_jp.GameRoundResult.decode(data);
        console.log("【8991--0x231F】局结束:", pb);
        // // UI 不显示
        SettingsData.ins.isTrustee = false;
        UiMain.ins.trusteeUI.hide();
        // 本机不显示操作 UI
        UiMain.ins.popup.op.root.active = false;

        UiMain.ins.popup.opBack.root.active = false;
        UiCountdown.ins.hide();

        // 隐藏所有玩家的托管标志
        UiMain.ins.playerInfoCollection.hideAllTrustee();

        this.setCenterInfo(pb);

        // 战绩
        let uiZhanJi = UiMain.ins.popup.settleLocalPlayer;
        // 设置点数结算UI
        let uiDianShu = UiSettleDianShu.ins;
        // 是否产生分数变化
        let mIsScoreChange: boolean = this.setUiDianShu(uiDianShu, pb);


        let uiGame = UiSettleGame.ins;

        // 游戏结果 (荒牌流局: 1 | 途中流局: 2 ｜ 自摸: 3 ｜ 放炮: 4)
        // 流局类型 (如果是流局，则---> 庄家听牌流局: 0x001, 流局满贯: 0x002; 如果是途中流局, 则---> 四杠散了: 1, 四风连打: 2, 四家立直: 3, 九种九牌: 4)
        // 自摸胡牌，放炮胡牌：战绩结算->点数结算->下局
        // 荒牌流局(听牌流局[包含庄家听牌流局])：荒牌流局UI->点数结算->下局
        // 中途流局：中途流局UI->下局
        // 流局满贯：战绩结算->点数结算->下局
        let ret = pb.nRoundResult;

        // 本场展示
        if (ret == 1) {
            // 流局满贯：战绩结算->点数结算->下局
            if (pb.nLiuJuType & 0x002) {

                this.showZhanJi(pb, () => {

                    uiZhanJi.hide();
                    UiBtnCountDown.stop(uiZhanJi.btnOK);

                    // 显示点数
                    // console.log("四家面板1");
                    uiDianShu.show();
                    uiDianShu.btnOK.once(Input.EventType.TOUCH_END, () => {
                        // 隐藏点数
                        uiDianShu.hide();

                        UiBtnCountDown.stop(uiDianShu.btnOK);
                        console.log("一场是否结束：", pb.stopGame)
                        // 不能直接进入下一局，如果一场结束，进入结算界面
                        if (pb.stopGame) {
                            uiGame.show();
                            uiGame.btnOK.once(Input.EventType.TOUCH_END, () => {

                                uiGame.root.active = false;
                                // Reset.exe() ;
                                // Reset.resetSeatOrien();
                                // CommSend.ready() ;
                                this.resetNextGame();
                            });
                        } else {
                            Reset.exe();
                            CommSend.ready();
                        }

                    });
                    UiBtnCountDown.start(uiDianShu.btnOK, 3);

                });

                return;
            }


            // 荒牌流局：先显示荒牌流局界面，再显示四人分数对比（点数）界面
            // // 庄家听牌流局
            // if( pb.nLiuJuType & 0x001 ){

            // }

            let uiLiuJuHuangPai = UiMain.ins.popup.settleLiuJuHuangPai;
            this.setUiLiuJuHuangPai(uiLiuJuHuangPai, pb);

            // let uiDianShu = UiSettleDianShu.ins ;
            // this.setUiDianShu( uiDianShu , pb ) ;

            // 荒牌流局：先显示荒牌流局界面，再显示四人分数对比（点数）界面
            uiLiuJuHuangPai.show();
            UiBtnCountDown.start(uiLiuJuHuangPai.btnOK, 3);
            uiLiuJuHuangPai.btnOK.once(Input.EventType.TOUCH_END, () => {
                uiLiuJuHuangPai.hide();
                UiBtnCountDown.stop(uiLiuJuHuangPai.btnOK);

                // 有分数变化，显示点数界面，
                // 没有分数变化，不显示点数界面
                // liujutype===0 分数没变化
                if (pb.nLiuJuType === 0) {
                    // 不能直接进入下一局，如果一场结束，进入结算界面
                    if (pb.stopGame) {
                        uiGame.show();
                        uiGame.btnOK.once(Input.EventType.TOUCH_END, () => {
                            uiGame.root.active = false;
                            this.resetNextGame();
                            ;
                        });
                    } else {
                        Reset.exe();
                        CommSend.ready();
                    }
                } else {
                    // console.log("四家面板2");
                    uiDianShu.show();
                    UiBtnCountDown.start(uiDianShu.btnOK, 3);
                    uiDianShu.btnOK.once(Input.EventType.TOUCH_END, () => {
                        uiDianShu.hide();
                        UiBtnCountDown.stop(uiDianShu.btnOK);
                        // 不能直接进入下一局，如果一场结束，进入结算界面
                        if (pb.stopGame) {
                            uiGame.show();
                            uiGame.btnOK.once(Input.EventType.TOUCH_END, () => {
                                uiGame.root.active = false;
                                this.resetNextGame();
                                ;
                            });
                        } else {
                            Reset.exe();
                            CommSend.ready();
                        }
                    });
                }


            });
            return;
        } else if (ret == 2) {
            // 中途流局

            let uiLvzt = UiMain.ins.popup.settleLiuJuZhongTu;
            uiLvzt.root.active = true;
            // ①四杠散了②四风连打③四家立直④九种九牌
            let type = pb.nLiuJuType;
            uiLvzt.showType(type);
            UiBtnCountDown.start(uiLvzt.btnOK, 3);
            uiLvzt.root.getChildByPath("btnOK").on(Input.EventType.TOUCH_END, () => {
                UiBtnCountDown.stop(uiLvzt.btnOK);
                uiLvzt.hide();

                console.log("四家面板3");
                uiDianShu.show();
                UiBtnCountDown.start(uiDianShu.btnOK, 3);
                uiDianShu.btnOK.once(Input.EventType.TOUCH_END, () => {
                    uiDianShu.hide();
                    UiBtnCountDown.stop(uiDianShu.btnOK);
                    // 不能直接进入下一局，如果一场结束，进入结算界面
                    if (pb.stopGame) {
                        uiGame.show();
                        uiGame.btnOK.once(Input.EventType.TOUCH_END, () => {
                            uiGame.root.active = false;
                            this.resetNextGame();
                        });
                    } else {
                        Reset.exe();
                        CommSend.ready();
                    }
                });
            });

            return;
        } else if (ret == 4 || ret == 5 || ret == 3) {
            // 自摸 放炮 庄家听牌流局
            // 3D空间动画
            // 显示Ui

            if (ret === 3) {
                SoundEffect.tsumo();
            } else if (ret === 4) {
                SoundEffect.rong();
            }

            new Promise<void>(resolve => {
                if (ret !== 4) {
                    resolve();
                    return;
                }

                const player = PlayerMgr.ins.all.get(pb.huOrPaoUid);
                if (player === null || player === undefined) {
                    console.error(`未找到对应的放炮者`);
                    resolve();
                    return;
                }

                let winnerInfo: protocol.mahjong_jp.IResPlayerInfo | null = null;
                for (const info of pb.playerInfo) {
                    if (info.roundResult === 2) {
                        if (info.userId !== Number(PlayerMgr.ins.local.info.id)) {
                            winnerInfo = info;
                        }
                        break;
                    }
                }

                if (winnerInfo !== null && winnerInfo !== undefined) {
                    const winnerPlayer = PlayerMgr.ins.all.get(winnerInfo.userId);
                    if (winnerPlayer) {
                        const remainingCardValues: number[] = [...winnerInfo.remCards];
                        const targetCardIndex = remainingCardValues.indexOf(pb.huCard);
                        if (targetCardIndex >= 0) {
                            remainingCardValues.splice(targetCardIndex, 1);
                        }

                        FirstDrawHandcardNonlocal.showHandCard(winnerPlayer.gameData.handcard, remainingCardValues);
                        CardSort.exe(winnerPlayer.gameData.handcard);
                        HandcardPersentation.setCardsPos3d(winnerPlayer);
                        winnerPlayer.gameData.handcard.forEach(card => CardDisplay.showLie(card));
                    }
                }

                DiscardedCardPlace.showWinningEffect(player, ScMapping.cardId_s2c(pb.huCard));

                tween(this)
                    .delay(4)
                    .call(() => resolve())
                    .start()
            })
                .then(() => {
                    this.showZhanJi(pb, () => {
                        uiZhanJi.hide();
                        UiBtnCountDown.stop(uiZhanJi.btnOK);

                        // 显示点数
                        console.log("四家面板4");
                        uiDianShu.show();
                        uiDianShu.btnOK.once(Input.EventType.TOUCH_END, () => {
                            // 隐藏点数
                            uiDianShu.hide();

                            if (this.isGameEnd == false) {
                                UiBtnCountDown.stop(uiDianShu.btnOK);
                                // console.log("========ready5");
                                Reset.exe();
                                CommSend.ready();
                                return;
                            }

                            uiGame.show();
                            uiGame.btnOK.once(Input.EventType.TOUCH_END, () => {

                                uiGame.root.active = false;
                                this.resetNextGame();
                            });
                        });
                        UiBtnCountDown.start(uiDianShu.btnOK, 3);
                    });
                });
        }
    }

    // 在进入下一场之前清空数据
    static resetNextGame(): void {
        Reset.exe();
        Reset.resetSeatOrien();
        CommSend.ready();

        // 重置和鸣切（每一局都重置）
        SettingsData.ins.isLizhi = false;
        UiMain.ins.uiAutoOpUI.reset();
        UiMain.ins.uiAutoOpUI.root.active = false;

        for (let player of PlayerMgr.ins.all.values()) {
            player.info.dianShu = 0;
            // 清空
            String3d.showScore(player.persentation.seat.score, "");
        }
        // 显示点数
        UiMain.ins.btnCenter.showDianShu();

        // 隐藏当前玩家的操作指示灯
        OpIndicator.hide();

        console.log("玩家手牌：", PlayerMgr.ins.local.gameData.handcard)

        // for(let mCardItem of PlayerMgr.ins.local.gameData.handcard){
        //     console.log("mCardItem:", mCardItem);
        // }
        // 所有都清空
        // UiMain.ins.touchHandcard.clearDiscardLimit();
        // var card = handcard[ idx ] ;
        // handcard.splice( idx , 1 ) ;
        // // 删除表现
        // card.presentation3d.root.destroy() ;
    }

    // 显示胜利者
    static showZhanJi(pb: protocol.mahjong_jp.GameRoundResult, onComplete: () => void) {

        // 找出所有的赢家
        var list = new Array<protocol.mahjong_jp.IResPlayerInfo>();
        for (let pbPlayer of pb.playerInfo) {
            if (pbPlayer.turnMoneyAll > 0) {
                list.push(pbPlayer);
            }

        } // end for

        let localPlayerUI = UiMain.ins.popup.settleLocalPlayer;

        // // 显示战绩
        // uiZhanJi.show() ;
        // uiZhanJi.btnOK.once( Input.EventType.TOUCH_END , ()=>{

        // } ) ;
        // UiBtnCountDown.start( uiZhanJi.btnOK , 3 ) ;

        // console.log("LIST:", list);
        // console.log("战绩1");
        let mTweenTimeArr: number[] = [];
        for (let mi = 0; mi < list.length; ++mi) {
            mTweenTimeArr.push(list[mi].fans.length + 3);
        }

        // console.log("==mtweentiemArr:", mTweenTimeArr)
        let mTweenZhanji = tween(this);
        for (let i = 0; i < list.length; ++i) {
            let pbPlayer = list[i];
            mTweenZhanji.call(() => {
                this.setUiZhanJi(localPlayerUI, pbPlayer);
                localPlayerUI.show();
                UiBtnCountDown.start(localPlayerUI.btnOK, mTweenTimeArr[i]);
            });
            mTweenZhanji.delay(mTweenTimeArr[i]);// TODO:TEST 以后记得改为3S
        } // end for
        mTweenZhanji.call(onComplete);
        mTweenZhanji.start();
    }

    public static stopTweenAnim(): void {
        Tween.stopAllByTarget(this);
    }

    // 设置战绩UI
    static setUiZhanJi(ui: UiSettleZhanJi, pbPlayer: protocol.mahjong_jp.IResPlayerInfo) {

        let player = PlayerMgr.ins.all.get(pbPlayer.userId);
        ui.refreshPlayerBase(player);
        // console.log("userid:", pbPlayer.userId , "id:", player.info.id, "玩家seatId:", player.gameData.seatId, "庄家seatId:",  PlayerMgr.ins.local.gameData.bankerSeatID)
        // 显示亲家子家ICON
        ui.refreshBankerIcon(player.gameData.seatId == PlayerMgr.ins.local.gameData.bankerSeatID);

        ui.clearCard();

        // 剩余手牌
        let isNoShowHu: boolean = true;
        for (let n of pbPlayer.remCards) {
            // 胡的牌，胡的牌第一张不显示
            if (isNoShowHu && n == pbPlayer.winCard) {
                isNoShowHu = false;
                continue;
            }
            ui.addCard(ScMapping.cardId_s2c(n));
        }

        // 设置一个位置为横牌
        var fn = (cards: number[], idx = -1) => {
            for (let i = 0; i < cards.length; ++i) {
                let isV = idx != i;
                ui.addCard(ScMapping.cardId_s2c(cards[i]), isV);
            }
        }

        // 位置到索引的映射
        var posToIdx = (pos: number): number => {
            var idx = -1;
            if (pos == 3) {
                idx = 0;
            } else if (pos == 2) {
                idx = 1;
            } else if (pos == 1) {
                idx = 2;
            }
            return idx;
        }

        // 明牌
        ui.addCardInterval();
        for (let pbFuLu of pbPlayer.fulus) {

            if (pbFuLu.fuluType == OpCode.OPE_LEFT_CHI ||
                pbFuLu.fuluType == OpCode.OPE_MIDDLE_CHI ||
                pbFuLu.fuluType == OpCode.OPE_RIGHT_CHI) {
                fn(pbFuLu.cards, 0);
            } else if (pbFuLu.fuluType == OpCode.OPE_PENG) {

                let idx = posToIdx(pbFuLu.pos);
                fn(pbFuLu.cards, idx);
            } else if (pbFuLu.fuluType == OpCode.OPE_GANG || pbFuLu.fuluType == OpCode.OPE_GANG_HU) {
                let idx = posToIdx(pbFuLu.pos);
                fn(pbFuLu.cards, idx);
            } else if (pbFuLu.fuluType == OpCode.OPE_AN_GANG) {
                ui.addCard("back");
                ui.addCard(ScMapping.cardId_s2c(pbFuLu.cards[0]));
                ui.addCard(ScMapping.cardId_s2c(pbFuLu.cards[0]));
                ui.addCard("back");
            } else if (pbFuLu.fuluType == OpCode.OPE_BU_GANG) {
                let idx = posToIdx(pbFuLu.pos);
                let cardId = ScMapping.cardId_s2c(pbFuLu.cards[0]);
                if (idx == 0) {
                    ui.addCard(cardId, false);
                    ui.addCardBu(cardId);
                    ui.addCard(cardId);
                    ui.addCard(cardId);
                } else if (idx == 1) {
                    ui.addCard(cardId);
                    ui.addCard(cardId, false);
                    ui.addCardBu(cardId);
                    ui.addCard(cardId);
                } else if (idx == 2) {
                    ui.addCard(cardId);
                    ui.addCard(cardId);
                    ui.addCard(cardId, false);
                    ui.addCardBu(cardId);
                }

            }

            // 间隔
            ui.addCardInterval(5);

        } // end for


        // 胡的牌
        if (pbPlayer.winCard != 0xFF) {
            ui.addCardInterval();
            ui.addCard(ScMapping.cardId_s2c(pbPlayer.winCard));
        }


        // 宝牌
        let cardIdsBao = new Array<string>();
        for (let n of pbPlayer.dora) {
            cardIdsBao.push(ScMapping.cardId_s2c(n));
        }
        // 宝牌，不足五张，用麻将背景图补齐
        if (cardIdsBao.length < 5) {
            let mBuNum = 5 - cardIdsBao.length;
            for (let mi = 0; mi < mBuNum; mi++) {
                cardIdsBao.push("back");// 预制体中的背景图名字是"back"
            }
        }
        ui.showCardBao(cardIdsBao);

        // 里宝牌
        let cardIdsLiBao = new Array<string>();
        for (let n of pbPlayer.lidora) {
            cardIdsLiBao.push(ScMapping.cardId_s2c(n));
        }
        // 里宝牌，不足五张，用麻将背景图补齐
        if (cardIdsLiBao.length < 5) {
            let mBuNumLi = 5 - cardIdsLiBao.length;
            for (let mi = 0; mi < mBuNumLi; mi++) {
                cardIdsLiBao.push("back");// 预制体中的背景图名字是"back"
            }
        }
        ui.showCardLiBao(cardIdsLiBao);

        // 番
        ui.clearFan();
        ui.setLayoutMode(pbPlayer.fans.length > 8 ? 1 : 2);
        for (let i = 0; i < pbPlayer.fans.length; ++i) {
            let pbFan = pbPlayer.fans[i];
            ui.addFan(pbFan.name, pbFan.score, pbPlayer.showType);

        } // end for

        ui.showFanItemAnim();

        // 统计
        // 0番时不需要显示
        if (pbPlayer.allFan == 0) {
            ui.tongJiRoot.active = false;
        } else {
            ui.tongJiRoot.active = true;
            ui.tongJiFan.string = pbPlayer.allFan.toString();
            ui.tongJiFu.string = pbPlayer.fu.toString();
        }


        // 赢的标志：自摸 荣和
        ui.winRoot.active = true;
        if (pbPlayer.roundResult == 1) {
            // 自摸
            ui.setWinFlag(1);
        } else if (pbPlayer.roundResult == 2) {
            // 荣和
            ui.setWinFlag(2);
        } else {
            ui.winRoot.active = false;
        }

        // 点数(以前取moneyPlat是错的，应该取turnMoney的值)
        ui.score.string = pbPlayer.turnMoney.toString();

        // 累计役满更新
        ui.showYiManType(pbPlayer.showType);
    }


    // 设置中间信息
    private static setCenterInfo(pb: protocol.mahjong_jp.GameRoundResult) {
        for (let pbPlayer of pb.playerInfo) {
            let player = PlayerMgr.ins.all.get(pbPlayer.userId);
            // 用户点数
            // player.persentation.seat.score.string = pbPlayer.moneyPlat.toString() ;
            String3d.showScore(player.persentation.seat.score, pbPlayer.moneyPlat.toString());

        } // end for
    }

    // 设置点数UI
    static setUiDianShu(ui: UiSettleDianShu, pb: protocol.mahjong_jp.GameRoundResult): boolean {

        /*
            赢家输家所有的情况：
            1赢+3输，自摸。
            1赢+2输+2平，点炮
            4平，流局
            2赢 + 2输，流局满贯
            3赢 + 1输
        */

        let win = Array<Player>();
        let lose = Array<Player>();
        // 分数是否有变化
        let mScoreChange: boolean = false;
        ui.hideAllPlayers();
        for (let pbPlayer of pb.playerInfo) {
            let player = PlayerMgr.ins.all.get(pbPlayer.userId);

            let uiDianShuPlayer = ui.players[player.persentation.idx];
            uiDianShuPlayer.root.active = true;

            // 头像
            uiDianShuPlayer.icon.spriteFrame = player.persentation.info.icon.spriteFrame;
            // 昵称
            uiDianShuPlayer.nickname.string = player.info.nickname;
            // 点数
            // uiDianShuPlayer.score.string = pbPlayer.moneyPlat.toString() ;
            NumberRoll.exe(uiDianShuPlayer.score, 2, 0, pbPlayer.moneyPlat);

            // 增减点数
            // uiDianShuPlayer.scoreVariation.string = pbPlayer.turnMoney.toString() ;
            NumberRoll.exe(uiDianShuPlayer.scoreVariation, 2, 0, pbPlayer.turnMoneyAll);
            uiDianShuPlayer.scoreVariation.color = pbPlayer.turnMoneyAll >= 0 ? Color.GREEN : Color.RED;

            // 排名
            uiDianShuPlayer.rank.string = pbPlayer.rank.toString();

            // 输赢平。1 2 赢家 3 4 输家 0 平家
            if (pbPlayer.roundResult == 1 || pbPlayer.roundResult == 2) {
                win.push(player);
            } else if (pbPlayer.roundResult == 3 || pbPlayer.roundResult == 4) {
                lose.push(player);
            }

            if (pbPlayer.moneyPlat > 0) {
                mScoreChange = true;
            }

        } // end for

        // 显示转移箭头
        for (let t of ui.arrows) {
            t.hideAllArrows();
        }

        for (let loser of lose) {
            for (let winner of win) {
                ui.arrows[loser.persentation.idx].arrows.get(winner.persentation.idx).active = true;
            } // end for

        } // end for

        return mScoreChange;
    }

    // 设置荒牌流局UI
    static setUiLiuJuHuangPai(ui: UiSettleLiuJuHuangPai, pb: protocol.mahjong_jp.GameRoundResult): boolean {
        // 是否四家都聽牌
        let mHaveAllTing: boolean = true;
        // 是否四家都不听牌
        let mHaveNoTing: boolean = true;
        let mPlayerNum: number = 0;
        ui.hideAllPlayers();

        // 暂时不用这个数据，改用下面的
        // ui.showTingCards( PlayerTingData.tingCards );

        console.log("荒牌听牌：", pb.playerTing);
        // 其他用户听牌处理
        for (let pbPlayerTing of pb.playerTing) {
            let player = PlayerMgr.ins.all.get(pbPlayerTing.userId);
            let idx = OreinSeatIdx.ins.getIdx(player.gameData.seatOrien);
            console.log("==id:", pbPlayerTing.userId, "seatOrien:", player.gameData.seatOrien, "idx:", idx);
            let uiPlayer = ui.players[idx];
            uiPlayer.showTingCards(pbPlayerTing.cards);
            if (!pbPlayerTing.cards || pbPlayerTing.cards.length <= 0) {
                mHaveAllTing = false;
            }

            // 不是自己的玩家，如果有听牌，展示手中牌
            if (player.info.id != PlayerMgr.ins.local.info.id) {
                for (let mi = 0; mi < pb.playerInfo.length; mi++) {
                    if (pb.playerInfo[mi].userId == player.info.id) {
                        FirstDrawHandcardNonlocal.showHandCard(player.gameData.handcard, pb.playerInfo[mi].remCards);
                        break;
                    }
                }
            }
            mPlayerNum++;
        }
        // 少于4个人
        if (mPlayerNum < 4) {
            mHaveAllTing = false;
        }

        // 都聽牌为false，判断是否都不听牌
        if (!mHaveAllTing) {
            mPlayerNum = 0;
            for (let pbPlayerTing of pb.playerTing) {
                if (pbPlayerTing.cards && pbPlayerTing.cards.length > 0) {
                    mHaveNoTing = false;
                }
                mPlayerNum++;
            }
            // 少于4个人
            if (mPlayerNum < 4) {
                mHaveNoTing = false;
            }
        }

        console.log("都聽牌：", mHaveAllTing);
        console.log("都不听牌：", mHaveNoTing);
        // 都聽牌或都不听牌，返回true，其他返回false
        if (mHaveAllTing || mHaveNoTing) {
            return true;
        } else {
            return false;
        }

    }

}