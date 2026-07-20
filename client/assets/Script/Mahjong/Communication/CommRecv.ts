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

import {Color, Vec3, director} from "cc";
import {ESceneVar, GlobalVar} from "../../GlobalVar";
import {HomeCommImmediate} from "../../Home/Communication/HomeImmediate";
import {HomeReconect} from "../../Home/Communication/HomeReconect";
import {ClubEntity} from "../../Home/Entity/ClubEntity";
import {HomeUiMain} from "../../Home/Ui/HomeUiMain";
import {App} from "../../Module/App";
import {GameHttpCtrl} from "../../Module/game/GameHttpCtrl";
import {PrefabConst} from "../../const/PrefabConst";
import {SocketCtrl} from "../../framework/ctrl/SocketCtrl";
import {EventManager} from "../../framework/event/event-management";
import {WebSocketMgr} from "../../framework/mgr/WebSocketMgr";
import {CallBack} from "../../framework/utils/CallBack";
import {TimeUtils} from "../../framework/utils/time-utils";
import protocol from "../../protocols/protocol.js";
import {DoraHint} from "../Ui/Main/UiDoraHint";
import {UiMain} from "../Ui/Main/UiMain";
import {UiSettleGame} from "../Ui/Popup/Settle/UiSettleGame";
import {UiCountdown} from "../Ui/Popup/UiCountdown";
import {Discard, DiscardedCardPlace} from "../World/Ctrl/Discard";
import {DrawCardLocal, DrawCardNonlocal} from "../World/Ctrl/DrawCard";
import {ExitCtrl} from "../World/Ctrl/ExitCtrl";
import {FirstDrawHandcardLocal, FirstDrawHandcardNonlocal} from "../World/Ctrl/FirstDrawHandcard";
import {MahjongCtrl} from "../World/Ctrl/MahjongCtrl";
import {ChiHelper, ChiType, OpChi} from "../World/Ctrl/Operation/OpChi";
import {OpGang} from "../World/Ctrl/Operation/OpGang";
import {OpIndicator} from "../World/Ctrl/Operation/OpIndicator";
import {OpPeng} from "../World/Ctrl/Operation/OpPeng";
import {OpRed} from "../World/Ctrl/Operation/OpRed";
import {PlayerEnter} from "../World/Ctrl/PlayerEnter";
import {Reset} from "../World/Ctrl/Reset";
import {CardFactory} from "../World/Entity/Card/CardFactory";
import {CardShownDisplay} from "../World/Entity/CardShown/CardShownDisplay";
import {Player, PlayerMgr, PlayerTingData} from "../World/Entity/Player/Player";
import {CardHint} from "../World/Support/CardHint";
import {GameState} from "../World/Support/GameState";
import {HandcardPersentation} from "../World/Support/HandcardOp";
import {LocalView} from "../World/Support/LocalView";
import {SeatOrien} from "../World/Support/SeatOrien";
import {SettingsData} from "../World/Support/SettingsDataPresist";
import {String3d} from "../World/Support/String3d";
import {WorldNode} from "../World/Support/WorldNode";
import {tileUtils} from "../World/Support/tile-utils";
import {ScMapping} from "./CardIdMapping";
import {CmdHandleReconnect} from "./CmdHandleReconnect";
import {CmdHandleSettleRound} from "./CmdHandleSettleRound";
import {CommSend} from "./CommSend";
import {DataParse} from "./DataParse";
import {OpCode} from "./OpCode";
import {PacketHelper} from "./Packet";
import {EventConst} from "../../const/EventConst";

// 通信数据接收处理
export class CommRecv {

    public static exe(data: ArrayBuffer): void {
        let packet = PacketHelper.parsePacketData(data);
        if (packet.header.state == 1) {
            this.onErr(packet.body);
            return;
        }
        console.log("receive cmd:", packet.header.cmd);
        // console.log("receive state:", packet.header.state);
        // console.log("GlobalVar.loadGameOver:", GlobalVar.loadGameOver);
        // 0是正常pb
        if (packet.header.state === 0) {
            App.getInst(SocketCtrl).C2SResp(packet.header.cmd, packet.body);

            GlobalVar.userGrabCard = null;
            switch (packet.header.cmd) {
                // 登录成功，返回用户信息
                case 9001:
                    this.onLoginPlayerInfor(packet.body);
                    break;
                case 10001:
                    this.onLogin(packet.body);
                    break;
                // （10002）异地登录
                case 10002:
                    this.onElseLogin();
                    break;
                case 10003:
                    this.onHeartbeat(packet.body);
                    break;
                // （14002）及时通讯
                case 14002:
                    this.onCommImmediate(packet.body);
                    break;
                // （8709--0x2205）用户执行操作
                case 0x2205:
                    GlobalVar.loadGameOver && this.respOp(packet.body);
                    break;
                // （8729--0x2219）获取桌子ID
                case 0x2219:
                    this.onGetRoom(packet.body);
                    break;
                // （8961--0x2301）广播用户准备
                case 0x2301:
                    GlobalVar.loadGameOver && this.broadcastPlayerReady(packet.body);
                    break;
                // （8962--0x2302）服务器广播用户出牌
                case 0x2302:
                    GlobalVar.loadGameOver && this.broadcastPlayerDiscard(packet.body);
                    break;
                // （8963--0x2303）广播用户托管
                case 0x2303:
                    GlobalVar.loadGameOver && this.broadcastPlayerTrustee(packet.body);
                    break;
                // （8964--0x2304）服务器告诉客户端可以进行操作(例如抢杠和, 发生在用户杠的时候，通知客户端可以抢杠和)
                case 0x2304:
                    GlobalVar.loadGameOver && this.opQiangGangHe(packet.body);
                    break;
                // （8967--0x2307）进入房间成功，返回桌子信息
                case 0x2307:
                    GlobalVar.loadGameOver && this.onEnterRoomSucceed(packet.body);
                    break;
                // （8968--0x2308）断线重连绑定成功
                case 0x2308:
                    this.reconnect(packet.body);
                    break;
                // （8969--0x2309）广播用户进入
                case 0x2309:
                    GlobalVar.loadGameOver && this.broadcastPlayerEnter(packet.body);
                    break;
                // （8970--0x230A）广播用户退出
                case 0x230A:
                    GlobalVar.loadGameOver && this.broadcastPlayerExit(packet.body);
                    break;
                // （8971--0x230B）广播掉线的用户
                case 0x230B:
                    GlobalVar.loadGameOver && this.broadcastPlayerOffline(packet.body);
                    break;
                // （8983--0x2317）服务器发牌
                case 0x2317:
                    GlobalVar.loadGameOver && this.getHandcard(packet.body);
                    break;
                // （8984--0x2318）服务器抓牌发给用户（本机抓牌）
                case 0x2318:
                    GlobalVar.loadGameOver && this.drawCard(packet.body);
                    break;
                // （8985--0x2319）无效操作(例如: 杠的时候发的牌不合法)
                case 0x2319:
                    GlobalVar.loadGameOver && this.opInvalid(packet.body);
                    break;
                // （8987--0x231B）游戏准备开始，不能离开房间
                case 0x231B:
                    GlobalVar.loadGameOver && this.gameWillStart(packet.body);
                    break;
                // （8988--0x231C）服务器广播游戏开始
                case 0x231C:
                    GlobalVar.loadGameOver && this.gameStart(packet.body);
                    break;
                // （8989--0x231D）广播用户进行了什么操作(例如: 杠)
                case 0x231D:
                    GlobalVar.loadGameOver && this.broadcastPlayerOp(packet.body);
                    break;
                // （8990--0x231E）广播当前玩家ID
                case 0x231E:
                    GlobalVar.loadGameOver && this.broadcastDrawCard(packet.body);
                    break;
                // （8991--0x231F）一局结算
                case 0x231F:
                    GlobalVar.loadGameOver && this.gameRoundEnd(packet.body);
                    break;
                // （8992--0x2320）广播游戏停止(一盘游戏结束，日麻一盘游戏分为很多局组成)
                case 0x2320:
                    GlobalVar.loadGameOver && this.gameEnd(packet.body);
                    break;
                // （9024--0x2340）杠dora指示牌
                case 0x2340:
                    GlobalVar.loadGameOver && this.gangDoraCard(packet.body);
                    break;
                // （9025--0x2341）回复跳过
                case 0x2341:
                    GlobalVar.loadGameOver && this.opJump(packet.body);
                    break;
                // （9026--0x2342）服务器广播立直更新数据
                case 0x2342:
                    GlobalVar.loadGameOver && this.updatePlayer(packet.body);
                    break;
                // （9028--0x2344）用户退出
                case 0x2344:
                    GlobalVar.loadGameOver && this.onExitStatus(packet.body);
                    break;
                // （9002--0x232A）踢出玩家
                case 0x232A:
                    GlobalVar.loadGameOver && this.onKickUser(packet.body);
                    break;
            }
        }
        // 1 pb时通用的错误返回
        else if (packet.header.state === 1) {

        }
    }

    // （9024--0x2340）杠dora指示牌
    static gangDoraCard(data: Uint8Array) {
        let pb = protocol.mahjong_jp.GangDoraCard.decode(data);
        console.log("【9024--0x2340】杠dora指示牌：", pb);
        let cardId = ScMapping.cardId_s2c(pb.card);
        DoraHint.ins.setCardSeq(cardId);

        const doraValue = tileUtils.calculateDoraValue(pb.card);
        GameState.ins.doraValuesMap.set(doraValue, true);

        HandcardPersentation.updateDoraFlashEffectLocal();
        PlayerMgr.ins.all.forEach(player => {
            DiscardedCardPlace.updateDoraFlashEffect(player);
            CardShownDisplay.updateDoraFlashEffect(player);
        });
    }

    // （9026--0x2342）
    static updatePlayer(data: Uint8Array) {
        let pb = protocol.mahjong_jp.UserLiZhiUpdateDianShu.decode(data);
        console.log("【9026--0x2342】服务器广播立直更新数据:", pb)
        let player = PlayerMgr.ins.all.get(pb.nUserId);
        String3d.showScore(player.persentation.seat.score, pb.nDianShu.toString());

        // 应该更新左边的
        // DoraHint.ins.benChangSet(pb.gongtuo);
        DoraHint.ins.gongTuoSet(pb.gongtuo);
    }

    // （9025--0x2341）回复跳过
    static opJump(data: Uint8Array) {
        let pb = protocol.mahjong_jp.UserOperatorJumpReply.decode(data);
        console.log("【0x2341-9025 跳过】", pb);

        // 处理玩家牌上的高光
        UiMain.ins.popup.op.toRemoveCardLight();
        // 隐藏玩家的操作面板
        UiMain.ins.popup.op.root.active = false;
        UiCountdown.ins.hide();

        if (pb.diffTimeout != -1) {
            UiCountdown.ins.show(GameState.ins.fixDurationDiscard, pb.diffTimeout);
        }

        UiMain.ins.touchHandcard.clearDiscardLimit();

        // 振听
        UiMain.ins.zhenTing.active = pb.isZhenTing;
    }

    // （8709--0x2205）用户执行操作
    static respOp(data: Uint8Array) {
        console.log("【8709--0x2205】用户执行操作")

        UiMain.ins.popup.op.root.active = false;
        UiMain.ins.popup.select.root.active = false;
        UiCountdown.ins.hide();
        UiMain.ins.popup.opBack.root.active = false;
    }

    // 游戏结束。包括N局。// （8992--0x2320）广播游戏停止(一盘游戏结束，日麻一盘游戏分为很多局组成)
    static gameEnd(data: Uint8Array) {
        let pb = protocol.mahjong_jp.MahjongTableInfo.decode(data);
        console.log("【8992--0x2320】场结束:", pb);

        // 游戏状态 0--游戏未开始（刚进入房间） 1--游戏准备开始 2--游戏开始 3--一场结束（只有一场结束才能退出房间）
        GameState.ins.gameStatus = 3;
        UiMain.ins.border.btnQuit.active = true;

        // 隐藏玩家的操作面板
        UiMain.ins.popup.op.root.active = false;
        // 玩家的id，用于更新玩家的战斗数据，点击个人头像时展示用
        let mUserIDArr: number[] = [];

        // 排序
        pb.users.sort((a, b) => {
            if (a.rank < b.rank) return -1;
            else if (a.rank > b.rank) return 1;
            return 0;
        });

        let ui = UiSettleGame.ins;
        ui.hideAllPlayers();

        for (let i = 0; i < pb.users.length; ++i) {
            let pbPlayer = pb.users[i];
            let player = PlayerMgr.ins.all.get(pbPlayer.userId);
            let uiPlayer = ui.players[i];

            uiPlayer.icon.spriteFrame = player.persentation.info.icon.spriteFrame;
            // uiPlayer.nickname.string = player.info.nickname ;
            if (PlayerMgr.ins.local.info.id == player.info.id) {
                uiPlayer.nickname.string = player.info.nickname + "（本家）";
            } else {
                uiPlayer.nickname.string = player.info.nickname;
            }
            uiPlayer.root.active = true;

            uiPlayer.score.string = pbPlayer.moneyPlat.toString();
            var n = pbPlayer.dedian;
            uiPlayer.scoreDiff.string = n > 0 ? "+" + n.toFixed(1) : n.toFixed(1);
            uiPlayer.scoreDiff.color = n > 0 ? Color.GREEN : Color.RED;
            uiPlayer.money.string = pbPlayer.relativeMoney > 0 ? "+" + pbPlayer.relativeMoney.toFixed(1) : pbPlayer.relativeMoney.toFixed(1);

            // 钻石俱乐部，普通俱乐部
            if (ClubEntity.isDiamond) {
                uiPlayer.coinND.active = true;
                uiPlayer.rankND.setPosition(new Vec3(17, 11.5, 0));
            } else {
                uiPlayer.coinND.active = false;
                uiPlayer.rankND.setPosition(new Vec3(217, 11.5, 0));
            }
            mUserIDArr.push(pbPlayer.userId);

        } // end for

        // TODO:BETTER 重新请求玩家数据，主要是获取玩家的战斗数据，这个地方以后要优化一下，基本信息不用再次获取了
        if (mUserIDArr.length > 0) {
            GameHttpCtrl.Inst.reqMorePlayerSimpleInfo(mUserIDArr);
        }

        // 游戏结束 初始化中控台
        WorldNode.ins.info.setQuanID(1);

        // 宝牌全部初始化，显示背面
        DoraHint.ins.showAllCardsBack();
        DoraHint.ins.gongTuoSet(0);
        DoraHint.ins.benChangSet(0);
        DoraHint.ins.roundChangSet(-1, -1, -1);

        GlobalVar.reconnectData = null;
        CmdHandleSettleRound.isGameEnd = true;

        // 清空听牌数据
        UiMain.ins.border.btnTing.active = false;
        UiMain.ins.popup.ting.removeAllItems();

        UiCountdown.ins.hide();
        PlayerTingData.huCardInfor = [];
    }

    // 一局结束（8991--0x231F）// （8991--0x231F）一局结算
    static gameRoundEnd(data: Uint8Array) {
        PlayerTingData.huCardInfor = [];
        CmdHandleSettleRound.exe(data);
    }

    // （8985--0x2319）无效操作(例如: 杠的时候发的牌不合法)
    static opInvalid(data: Uint8Array) {
        console.log("【8985--0x2319】操作无效");
    }

    // 玩家可以操作// （8964--0x2304）服务器告诉客户端可以进行操作(例如抢杠和, 发生在用户杠的时候，通知客户端可以抢杠和)
    static opQiangGangHe(data: Uint8Array) {
        let pb = protocol.mahjong_jp.UserOperatorHint.decode(data);
        console.log("【8964-0x2304操作】", pb)
        DataParse.parseOpUi(pb.opValue, undefined, ScMapping.cardId_s2c(pb.opCard));
        this.autoHe(pb.opValue);
        // 除了（吃、碰、杠之外是否还有其他操作）
        let mOpResExpCPG: number = pb.opValue & OpCode.OPE_GANG_HU
            || pb.opValue & OpCode.OPE_HU
            || pb.opValue & OpCode.OPE_ZI_MO
            || pb.opValue & OpCode.OPE_TING
            || pb.opValue & OpCode.OPE_LIUJU;
        // 1鸣牌时（除了吃、碰、杠之外无其他操作），不需要显示倒计时 2托管时，不需要显示倒计时
        if ((SettingsData.ins.mingHint && (mOpResExpCPG == 0))
            || SettingsData.ins.isTrustee) {
            return;
        } else {
            // 显示倒计时
            UiCountdown.ins.show(GameState.ins.fixDurationOp, pb.diffTimeout);
        }
    }

    // （8989--0x231D）广播用户进行了什么操作(例如: 杠)
    static broadcastPlayerOp(data: Uint8Array) {
        let pb = protocol.mahjong_jp.UserOperatorRespond.decode(data);

        // 操作者
        let player = PlayerMgr.ins.all.get(pb.operatorUserID);
        // 操作的牌
        let cardId = ScMapping.cardId_s2c(pb.operationCard);
        // 被操作者
        let player2: Player = null;
        PlayerMgr.ins.all.forEach((v, k) => {
            if (v.gameData.seatId == pb.targetSeatID) {
                player2 = v;
            }
        });

        console.log("【8989-0x231D 广播玩家操作】" + pb.operationValue, "pb:", pb);

        // 显示操作者
        OpIndicator.exe(player);


        // 操作时间
        if (player.info.id == PlayerMgr.ins.local.info.id) {
            // 本机出牌
            UiCountdown.ins.show(GameState.ins.fixDurationDiscard, pb.diffTimeout);

            DataParse.huCardInfo(pb.hucard);

            // Jacket：这个地方加个不能出的牌，因为吃碰的时候，有食替规则，吃，或者，碰，后出牌时，有些牌不能出
            let handcardTouch = UiMain.ins.touchHandcard;
            handcardTouch.clearDiscardLimit();

            for (let item of pb.disableCards) {
                handcardTouch.cardIdsCannot.add(ScMapping.cardId_s2c(item));
            } // end for
            handcardTouch.refresh();
        }


        if (pb.operationValue & OpCode.OPE_LEFT_CHI) {
            // 左吃
            let cardIds = ChiHelper.getCardIdsToChi(ChiType.Left, cardId);
            // 如果有吃赤五牌的情况
            if (pb.redFiveCount > 0) {
                OpRed.chiExe(player, cardIds, player2, cardId);
            } else {
                OpChi.exe(player, cardIds, player2, cardId);
            }
            // OpChi.exe(player, cardIds, player2, cardId);
            if (player == PlayerMgr.ins.local) {
                UiMain.ins.touchHandcard.enabled = true;
            }
        } else if (pb.operationValue & OpCode.OPE_MIDDLE_CHI) {
            // 中吃
            let cardIds = ChiHelper.getCardIdsToChi(ChiType.Middle, cardId);
            // 如果有吃赤五牌的情况
            if (pb.redFiveCount > 0) {
                OpRed.chiExe(player, cardIds, player2, cardId);
            } else {
                OpChi.exe(player, cardIds, player2, cardId);
            }
            // OpChi.exe(player, cardIds, player2, cardId);
            if (player == PlayerMgr.ins.local) {
                UiMain.ins.touchHandcard.enabled = true;
            }
        } else if (pb.operationValue & OpCode.OPE_RIGHT_CHI) {
            // 右吃
            let cardIds = ChiHelper.getCardIdsToChi(ChiType.Right, cardId);
            // 如果有吃赤五牌的情况
            if (pb.redFiveCount > 0) {
                OpRed.chiExe(player, cardIds, player2, cardId);
            } else {
                OpChi.exe(player, cardIds, player2, cardId);
            }

            if (player == PlayerMgr.ins.local) {
                UiMain.ins.touchHandcard.enabled = true;
            }
        } else if (pb.operationValue & OpCode.OPE_PENG) {
            // 碰
            // OpPeng.exe(player, cardId, player2);
            // 如果有碰赤五牌的情况
            if (pb.redFiveCount > 0) {
                OpRed.pengExe(player, cardId, player2, pb.redFiveCount);
            } else {
                OpPeng.exe(player, cardId, player2);
            }

            if (player == PlayerMgr.ins.local) {
                UiMain.ins.touchHandcard.enabled = true;
            } else {
                // 碰、杠了之后隐藏其他玩家的操作按钮
                UiMain.ins.popup.op.root.active = false;
                UiCountdown.ins.hide();
            }
        } else if (pb.operationValue & OpCode.OPE_GANG || pb.operationValue & OpCode.OPE_GANG_HU) {
            // 明杠
            // OpGang.exe(player, cardId, player2);
            // 如果有杠赤五牌的情况
            if (pb.redFiveCount > 0) {
                OpRed.gangExe(player, cardId, player2, pb.redFiveCount);
            } else {
                OpGang.exe(player, cardId, player2);
            }


            if (player == PlayerMgr.ins.local) {
                UiMain.ins.touchHandcard.enabled = true;
            } else {
                // 碰、杠了之后隐藏其他玩家的操作按钮
                UiMain.ins.popup.op.root.active = false;
                UiCountdown.ins.hide();
            }

        } else if (pb.operationValue & OpCode.OPE_AN_GANG) {
            // 暗杠
            // OpGang.dark(player, cardId);
            // 如果有杠赤五牌的情况
            if (pb.redFiveCount) {
                OpRed.darkExe(player, cardId, pb.redFiveCount);
            } else {
                OpGang.dark(player, cardId);
            }
        } else if (pb.operationValue & OpCode.OPE_BU_GANG) {
            // 补杠，不需要特别处理--待验证
            // OpGang.patch(player, cardId);
            // 如果有杠赤五牌的情况
            // if(pb.redFiveCount){
            //     OpRed.patchExe(player, cardId, pb.redFiveCount);
            // }
            // else{
            OpGang.patch(player, cardId);
            // }
        }

        // UiMain.ins.touchHandcard.clearDiscardLimit() ;


    }

    // 广播抓牌// （8990--0x231E）广播当前玩家ID
    static broadcastDrawCard(data: Uint8Array) {

        let pb = protocol.mahjong_jp.BroadGrabCard.decode(data);
        console.log("【0x231E-8990 】广播抓牌：", pb);
        let player = PlayerMgr.ins.all.get(pb.curUserId);
        DrawCardNonlocal.exe(player, "wan1");

        // 显示操作者
        OpIndicator.exe(player);

        // 山牌递减
        GameState.ins.shanCardNum--;
        WorldNode.ins.info.setLeft(GameState.ins.shanCardNum);

        if (player != PlayerMgr.ins.local) {
            console.log("不是自己");
            UiMain.ins.popup.op.root.active = false;
            UiCountdown.ins.hide();

            UiMain.ins.touchHandcard.enabled = false;
        }


    }


    // 本机抓牌// （8984--0x2318）服务器抓牌发给用户
    static drawCard(data: Uint8Array) {

        UiMain.ins.touchHandcard.enabled = true;

        if (FirstDrawHandcardLocal.isComplete == false) {
            // 延迟执行。等发牌完成后执行
            FirstDrawHandcardLocal.onComplete.push(() => {
                this.drawCard(data);
            });
            return;
        }

        UiMain.ins.touchHandcard.clearDiscardLimit();

        let pb = protocol.mahjong_jp.UserGrabCard.decode(data);
        GlobalVar.userGrabCard = pb;
        console.log("【8984-0x2318 本机抓牌】", pb);
        var cardId = ScMapping.cardId_s2c(pb.byGrabCard[0]);
        let localPlayer = PlayerMgr.ins.local;
        DrawCardLocal.exe(localPlayer, cardId);

        // let handcardTouch = UiMain.ins.touchHandcard;
        // handcardTouch.clearDiscardLimit() ;


        // 显示操作者
        OpIndicator.exe(localPlayer);

        // if( localPlayer.gameData.isLiZhi == true ) {
        //     // 限定立直可以出的牌
        //     for( let pb2 of pb.hucard ) {
        //         handcardTouch.cardIdsCan.add( ScMapping.cardId_s2c( pb2.card ) ) ;
        //     }

        // }

        // 操作
        let cardIdsGang2 = new Array<string>();
        for (let n of pb.gangCards) {
            cardIdsGang2.push(ScMapping.cardId_s2c(n));
        }
        DataParse.parseOpUi(pb.nActionValue, undefined, undefined, cardIdsGang2);
        let mIsAutoHe: boolean = this.autoHe(pb.nActionValue);

        // 听牌提示
        DataParse.huCardInfo(pb.hucard);
        // 刷新不能出的牌。
        UiMain.ins.touchHandcard.refresh();

        // 山牌递减
        GameState.ins.shanCardNum--;
        WorldNode.ins.info.setLeft(GameState.ins.shanCardNum);

        // 如何出现自动和，就跳过
        if (mIsAutoHe) {
            return;
        }

        /*
         * 立直状态，只提示自摸、和、暗杠
         * 自动摸切状态，只提示自摸、和、暗杠、加杠、立直、流局
         * 二者可同时存在，立直状态的提示范围更小，应优先判断
         */
        const filteredOpCodeForRiichi = (pb.nActionValue & OpCode.OPE_AN_GANG)
            | (pb.nActionValue & OpCode.OPE_ZI_MO)
            | (pb.nActionValue & OpCode.OPE_HU)
            | (pb.nActionValue & OpCode.OPE_GANG_HU);

        const filteredOpCodeForAutoDiscard = filteredOpCodeForRiichi
            | (pb.nActionValue & OpCode.OPE_BU_GANG)
            | (pb.nActionValue & OpCode.OPE_TING)
            | (pb.nActionValue & OpCode.OPE_LIUJU);

        if ((SettingsData.ins.isLizhi && filteredOpCodeForRiichi === 0)
            || (SettingsData.ins.isAutoMoQie && filteredOpCodeForAutoDiscard === 0)) {
            setTimeout(() => {
                CommSend.discard(cardId, false, true);
            }, 1000);
        }

        // 托管时，不需要显示倒计时
        if (SettingsData.ins.isTrustee) {
            return;
        }

        // 本机显示倒计时
        UiCountdown.ins.show(pb.nActionValue > 0 ? GameState.ins.fixDurationOp : GameState.ins.fixDurationDiscard, pb.diffTimeout);

    }


    // （8971--0x230B）广播掉线的用户
    static broadcastPlayerOffline(data: Uint8Array) {
        let pb = protocol.mahjong_jp.UserOffline.decode(data);
        console.log("【8971--0x230B】广播掉线的用户：", pb)
        for (let pb2 of pb.players) {
            let playerId = pb2.userId;
            console.log("玩家掉线：Id：" + playerId);

            let player = PlayerMgr.ins.all.get(playerId);
            player.persentation.info.flagOffline.active = true;

        }

    }

    // （8963--0x2303）广播用户托管
    static broadcastPlayerTrustee(data: Uint8Array) {
        let pb = protocol.mahjong_jp.BroadUserTuoGuan.decode(data);
        console.log("【8963--0x2303】用户托管：", pb)
        let val = pb.type == 1 ? true : false;
        let player = PlayerMgr.ins.all.get(pb.userId);


        if (player == PlayerMgr.ins.local) {
            // 本机
            SettingsData.ins.isTrustee = val;
            if (val) {
                UiMain.ins.trusteeUI.show();
            } else {
                UiMain.ins.trusteeUI.hide();
            }

            // 本机不显示操作 UI
            UiMain.ins.popup.op.root.active = false;
            UiCountdown.ins.hide();
            UiMain.ins.popup.select.root.active = false;

        }

        player.persentation.info.flagTrustee.active = val;
    }

    // 广播 玩家出牌// （8962--0x2302）服务器广播用户出牌
    static broadcastPlayerDiscard(data: Uint8Array) {
        let pb = protocol.mahjong_jp.UserOutCardRespond.decode(data);
        console.log("【8962-0x2302】玩家出牌:", pb);
        let playerId = pb.nOutCardUserId;
        let cardId = ScMapping.cardId_s2c(pb.byOutCard);
        let player = PlayerMgr.ins.all.get(playerId);

        // 立直操作，先处理立直状态，再处理出牌
        const alreadyRiichi = player.gameData.isLiZhi;
        if (pb.isTing) {
            player.gameData.isLiZhi = true;
            player.persentation.seat.flagLiZhi.active = true;
        }


        let card = Discard.exe(player, cardId, !pb.isHengFang, pb.moqie, !alreadyRiichi && pb.isTing);

        card.isMoQie = pb.moqie;

        // console.log("立直 isTing:", pb.isTing);

        // 显示摸切提示
        CardHint.moQie(card);

        if (playerId == PlayerMgr.ins.local.info.id) {
            // 本机出牌
            UiCountdown.ins.hide();
            UiMain.ins.popup.opBack.root.active = false;
            CardHint.normal();
            UiMain.ins.touchHandcard.enabled = false;

            // 自己出牌后，清空不能出的牌
            let handcardTouch = UiMain.ins.touchHandcard;
            handcardTouch.cardIdsCannot.clear();
            if (pb.isTing) {
                handcardTouch.cardIdsLizhi.clear();
            }
            handcardTouch.refresh();

            // 玩家立直数据
            SettingsData.ins.isLizhi = pb.isTing;
            // console.log("自动模切2:", SettingsData.ins.isLizhi);
        }


        // 振听
        UiMain.ins.zhenTing.active = pb.isZhenTing;
        // 处理听牌信息，
        // 2.UserOutCardRespond 协议收到时，
        // 如果打出的牌在本地hucardinfo信息找到了，则显示听牌的感叹号，
        // 点击感叹号，则显示打出的那张票的听牌信息，
        // 同时hucardinfo清理跟card不一样元素，
        // 如果没找到，则本地的hucardinfo信息全部清理
        UiMain.ins.popup.ting.showTingInforWhenOutCard(pb.byOutCard, cardId);

        // 本机有操作
        if (pb.nOpWeight > 0) {


            // 玩家可以做的操作
            DataParse.parseOpUi(pb.nOpWeight, playerId, cardId);
            // 新添加，高亮最后一张牌
            DataParse.toHighLightLastCard(player);
            // 吃碰杠自动过--暂时注释，没人知道这个规则
            // this.autoPassOpChiPengGang(pb.nOpWeight);
            this.autoHe(pb.nOpWeight);

            // 除了（吃、碰、杠之外是否还有其他操作）
            let mOpResExpCPG: number = pb.nOpWeight & OpCode.OPE_GANG_HU
                || pb.nOpWeight & OpCode.OPE_HU
                || pb.nOpWeight & OpCode.OPE_ZI_MO
                || pb.nOpWeight & OpCode.OPE_TING
                || pb.nOpWeight & OpCode.OPE_LIUJU
            // 1鸣牌时（除了吃、碰、杠之外无其他操作），不需要显示倒计时 2托管时，不需要显示倒计时，自动过
            if ((SettingsData.ins.mingHint && (mOpResExpCPG == 0))
                || SettingsData.ins.isTrustee) {

            } else {
                // 本机操作时间
                UiCountdown.ins.show(GameState.ins.fixDurationOp, pb.diffTimeout);
            }
        }

        let str = "广播玩家出牌：本机ID：" + PlayerMgr.ins.local.info.id + " " +
            "出牌者ID:" + pb.nOutCardUserId + " " +
            "本机操作：" + pb.nOpWeight + " " +
            "出牌：" + pb.byOutCard;
        console.log(str);

        // 这里不需要限制玩家出牌，需要在玩家吃、碰、杠操作后再限制
        // // Jacket：这个地方加个不能出的牌，因为吃碰的时候，有食替规则，吃，或者，碰，后出牌时，有些牌不能出
        // // disableCards里面：card1,card2... 0xFF card3,card4，
        // // 这样，前面的card1，card2就是碰的时候，不能出的牌，card3，card4就是吃的时候，不能出的牌

        // let handcardTouch = UiMain.ins.touchHandcard;
        // handcardTouch.clearDiscardLimit();

        // let m0xFFInd:number = pb.disableCards.indexOf(0xFF);
        // // let mCardsLen:number = 0;
        // console.log("0xFFInd:", m0xFFInd);
        // if(m0xFFInd>-1){
        //     if(pb.nOpWeight & OpCode.OPE_PENG){
        //         if(m0xFFInd>pb.disableCards.length-1){
        //             m0xFFInd = pb.disableCards.length-1;
        //         }
        //         for(let mi=0; mi<m0xFFInd; mi++){
        //             if(mi<m0xFFInd){
        //                 handcardTouch.cardIdsCannot.add(ScMapping.cardId_s2c(pb.disableCards[mi]));
        //             }
        //         }
        //     }
        //     else if((pb.nOpWeight & OpCode.OPE_RIGHT_CHI) ||
        //             (pb.nOpWeight & OpCode.OPE_MIDDLE_CHI) ||
        //             (pb.nOpWeight & OpCode.OPE_LEFT_CHI)  ){
        //         for(let mi=m0xFFInd+1; mi<pb.disableCards.length; mi++){
        //             handcardTouch.cardIdsCannot.add(ScMapping.cardId_s2c(pb.disableCards[mi]));
        //         }
        //     }

        // }

        // // for (let n of pb.disableCards) {
        // //     handcardTouch.cardIdsCannot.add(ScMapping.cardId_s2c(n));
        // // } // end for
        // handcardTouch.refresh();
    }

    // 吃碰杠自动过
    private static autoPassOpChiPengGang(op: number) {

        // 没操作
        if (op == 0) return;

        // 只有 吃 碰 大明杠 任意一个 自动过

        let n = (op & OpCode.OPE_GANG_HU) ||
            (op & OpCode.OPE_AN_GANG) ||
            (op & OpCode.OPE_BU_GANG) ||
            (op & OpCode.OPE_HU) ||
            (op & OpCode.OPE_ZI_MO) ||
            (op & OpCode.OPE_TING);
        if (n == 0) {
            console.log("自动过");
            CommSend.pass();
        }

    }

    // 自动和
    private static autoHe(op: number): boolean {

        if (SettingsData.ins.isAutoHe == false) {
            return false;
        }

        let n = (op & OpCode.OPE_GANG_HU) ||
            (op & OpCode.OPE_HU) ||
            (op & OpCode.OPE_ZI_MO);
        if (n == 0) {
            return false;
        }

        console.log("执行自动和");

        UiMain.ins.popup.op.startAutoHe();
        return true;
    }

    // （8729--0x2219）获取桌子ID
    private static onGetRoom(data: Uint8Array) {
        let obj = protocol.mahjong_jp.GameID.decode(data);
        console.log("【8729--0x2219】获取桌子ID：", obj);
        // CommSend.enterRoom(obj.id);
        director.emit(EventConst.EVT_GET_ROOM_ID, obj.id);
    }

    // 错误
    private static onErr(data: Uint8Array) {
        let obj = protocol.pb_common.pbError.decode(data);
        console.log("协议错误：" + obj.errCode + " " + obj.errMsg);

    }

    private static onLoginPlayerInfor(data: Uint8Array): void {
        let pb = protocol.mahjong_jp.PlayerInfo.decode(data);

        console.log("【9001】登录获取个人信息 :", pb);
    }

    private static onLogin(data: Uint8Array) {
        let pb = protocol.account.LoginResp.decode(data);

        const localPlayer = PlayerMgr.ins.local;
        if (localPlayer.info.id !== pb.userID) {
            let targetPlayer: Player | null = null;

            for (const [userID, player] of PlayerMgr.ins.all) {
                if (userID === pb.userID) {
                    targetPlayer = player;
                    break;
                }
            }

            if (targetPlayer) {
                PlayerMgr.ins.local = targetPlayer;
            } else {
                PlayerMgr.ins.all.delete(localPlayer.info.id);

                localPlayer.info.id = pb.userID;
                PlayerMgr.ins.all.set(pb.userID, localPlayer);
            }
        }

        console.log("【10001】登录成功 :", pb.userID);
        console.log("10001登录成功 :", PlayerMgr.ins.local);

        WebSocketMgr.Inst.startMonitoringHeart();

        EventManager.emit('accountDidSignIn', {
            success: true,
            errorDesc: "",
        });
    }

    // （10002）异地登录
    private static onElseLogin() {

        console.log("【10002】 异地登录 :");


        WebSocketMgr.Inst.closeNetWork(true);
        if (GlobalVar.currScene == ESceneVar.SCENE_HOME) {
            HomeUiMain.ins.popUpWin.showPopup(PrefabConst.REPEAT_LOGIN);
        } else if (GlobalVar.currScene == ESceneVar.SCENE_GAME) {
            UiMain.ins.popUpWin.showPopup(PrefabConst.REPEAT_LOGIN);
        }

    }

    private static onHeartbeat(data: Uint8Array): void {
        const pb = protocol.account.Heartbeat.decode(data);
        console.log("【10003】心跳包：", pb);

        if (pb.timestamp !== null && pb.timestamp !== undefined) {
            TimeUtils.updateServerTime(pb.timestamp);
        }

        WebSocketMgr.Inst.onHeartbeatRespond();
    }

    // （14002）及时通讯
    private static onCommImmediate(data: Uint8Array): void {
        let pb = protocol.club.PushMsg.decode(data);
        console.log("【14002】及时通讯：", pb);
        HomeCommImmediate.exe(pb);
    }

    // （8967--0x2307）进入房间成功，返回桌子信息
    public static onEnterRoomSucceed(data: Uint8Array) {

        let pb = protocol.mahjong_jp.MahjongTableEnterResponse.decode(data);
        console.log("【8967--0x2307】进入房间：", pb);
        // console.log("curque:", pb.curQuan);
        // console.log("players all:", PlayerMgr.ins.all);
        // console.log("players:", pb.players);
        // 玩家的id，四个玩家都要重新请求，服务器数据不准，尤其是名字、头像
        let mUserIDArr: number[] = [];

        const playerIDs: number[] = [];

        for (let pbPlayer of pb.players) {
            const id = pbPlayer.userId;

            playerIDs.push(id);

            let player = PlayerMgr.ins.all.get(id);
            if (player == null) {
                console.log("-- null --:", id);
                player = new Player();
                player.info.id = id;
                PlayerMgr.ins.all.set(id, player);
            }

            mUserIDArr.push(id);

            DataParse.parsePlayer(pbPlayer, player);
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

        // console.log("After players all:", PlayerMgr.ins.all);
        // console.log("local seatId:", PlayerMgr.ins.local.gameData.seatId);
        // 设置本机视角
        LocalView.init(PlayerMgr.ins.local.gameData.seatOrien);

        // 刷新玩家UI
        for (let player of PlayerMgr.ins.all.values()) {
            PlayerEnter.exe(player);
        }

        // 出牌固定时间
        GameState.ins.fixDurationDiscard = pb.outCardTimeout;
        // 操作固定时间
        GameState.ins.fixDurationOp = pb.operationTimeout;

        // 游戏状态 0--游戏未开始（刚进入房间） 1--游戏准备开始 2--游戏开始 3--一场结束（只有一场结束才能退出房间）
        GameState.ins.gameStatus = 0;
        UiMain.ins.border.btnQuit.active = true;

        // 圈0显示东，圈1显示南，加上XX局

        // 刚进入游戏，只能是东风局，设置为0
        GameState.ins.currQuan = 0;
        // 设置中间显示
        WorldNode.ins.info.setQuanID(pb.quan, pb.tableId);

        if (mUserIDArr.length > 0) {
            GameHttpCtrl.Inst.reqMorePlayerSimpleInfo(mUserIDArr);
        }

    }

    // （8968--0x2308）断线重连绑定成功
    public static reconnect(data: Uint8Array) {
        console.log("【8968--0x2308】断线重连")
        GlobalVar.isReconnect = true;
        GlobalVar.reconnectData = data;
        if (GlobalVar.currScene == ESceneVar.SCENE_GAME) {
            CmdHandleReconnect.exe(data);
            GlobalVar.reconnectData = null;
        } else if (GlobalVar.currScene == ESceneVar.SCENE_HOME) {
            HomeReconect.exe(data);
        }
        // CmdHandleReconnect.exe( data ) ;

    }

    // （8969--0x2309）广播用户进入
    public static broadcastPlayerEnter(data: Uint8Array) {

        let pbPlayer = protocol.mahjong_jp.PlayerInfo.decode(data);
        console.log("【8969--0x2309】回应 广播用户进入：", pbPlayer);
        console.log("seatid:", pbPlayer.seatId, "id:", pbPlayer.userId);

        let id = pbPlayer.userId;
        let player = PlayerMgr.ins.all.get(id);
        if (player == null) {
            console.log("---null--");
            player = new Player();
            player.info.id = id;
            PlayerMgr.ins.all.set(id, player);
            DataParse.parsePlayer(pbPlayer, player);
            // 更新用户的头像id信息
            GameHttpCtrl.Inst.playerSimpleInfoReq(id);

            // 更新点击用户头像时，展示的信息
            App.getInst(MahjongCtrl).gameGetPlayerInfoReq(id, 1, new CallBack(() => {

            }, this));
        }
        PlayerEnter.exe(player);

        player.persentation.info.flagOffline.active = false;
        player.persentation.info.flagTrustee.active = false;

    }

    // （8961--0x2301）广播用户准备
    public static broadcastPlayerReady(data: Uint8Array) {

        let pbPlayer = protocol.mahjong_jp.PlayerID.decode(data);
        let id = pbPlayer.userId;
        let player = PlayerMgr.ins.all.get(id);

        console.log("【8961--0x2301】玩家准备 " + pbPlayer);
        console.log("gamedata:", player.gameData)
        console.log("id：", id, "==seatid:", player.gameData.seatId, "seatOrein:", player.gameData.seatOrien);

        player.gameData.isReady = true;
        player.persentation.info.flagReady.active = true;

    }

    // （8970--0x230A）广播用户退出
    public static broadcastPlayerExit(data: Uint8Array) {

        let pbPlayer = protocol.mahjong_jp.PlayerID.decode(data);
        let id = pbPlayer.userId;

        console.log("【8970--0x230A】玩家退出：Id：" + id);

        var player = PlayerMgr.ins.all.get(id);
        if (player) {
            Reset.resetSeat(player);

            // 玩家自己，收到就退出房间
            if (player == PlayerMgr.ins.local) {
                ExitCtrl.exe();
            }
            // console.log("-delete--player:", player.info.id)
            PlayerMgr.ins.all.delete(id);
            player.persentation.info.root.active = false;
        }

        // console.log("player all:", PlayerMgr.ins.all);
        // for( let player of PlayerMgr.ins.all.values() ) {
        //     console.log("退出后====userid:", player.info.id, "seatid:", player.gameData.seatId, "seatorien:", player.gameData.seatOrien)
        // }

    }

    // （8987--0x231B）游戏准备开始，不能离开房间
    public static gameWillStart(data: Uint8Array): void {
        var pb = protocol.mahjong_jp.MahjongReadyStart.decode(data);
        console.log("【8987--0x231B】游戏准备开始：", pb);

        // 游戏状态 0--游戏未开始（刚进入房间） 1--游戏准备开始 2--游戏开始 3--一场结束（只有一场结束才能退出房间）
        GameState.ins.gameStatus = 1;

        if (!UiMain.ins.uiAutoOpUI.root.active) {
            UiMain.ins.uiAutoOpUI.root.active = true;
        }
        UiMain.ins.willStartUI.show();
        UiMain.ins.border.btnQuit.active = false;

        PlayerTingData.tingCards = [];
        PlayerTingData.willHuCards = [];
        PlayerTingData.huCardInfor = [];
        UiMain.ins.border.btnTing.active = false;
        UiMain.ins.popup.ting.removeAllItems();
    }

    // （8988--0x231C）服务器广播游戏开始
    public static gameStart(data: Uint8Array) {

        var pb = protocol.mahjong_jp.HuaCardsInfo.decode(data);
        console.log("【8988--0x231C游戏开始：】", pb);

        GameState.ins.doraValuesMap.clear();
        const doraValue = tileUtils.calculateDoraValue(pb.doraCard);
        GameState.ins.doraValuesMap.set(doraValue, true);

        for (let player of PlayerMgr.ins.all.values()) {
            // 每个玩家显示手牌动画
            if (player == PlayerMgr.ins.local) {

                FirstDrawHandcardLocal.exe(player);
            } else {
                FirstDrawHandcardNonlocal.exe(player);
            }

            player.gameData.isReady = false;

            player.persentation.info.flagReady.active = false;
            // console.log("player ===ready:", player.persentation.info.flagReady.active);
        }

        for (let pbPlayer of pb.users) {
            let player = PlayerMgr.ins.all.get(pbPlayer.userId);
            player.info.dianShu = pbPlayer.nDianShu;
        }
        // 显示点数
        UiMain.ins.btnCenter.showDianShu();
        UiMain.ins.btnCenter.mode = true;

        // DoraHint.ins.showAllCardsBack();
        DoraHint.ins.reset();
        DoraHint.ins.setDoraCard(ScMapping.cardId_s2c(pb.doraCard));
        DoraHint.ins.gongTuoSet(pb.gongtuo ?? 0);

        // UiMain.ins.btnTrustee.root.active = true;
        // console.log("显示托管");

        // 设置山牌136-4*13-14
        GameState.ins.shanCardNum = 70;
        WorldNode.ins.info.setLeft(GameState.ins.shanCardNum);

        // 振听
        UiMain.ins.zhenTing.active = false;


        // 决定方位视角
        PlayerViewHelper.exe(pb.nBankerSeatId);
        PlayerMgr.ins.local.gameData.bankerSeatID = pb.nBankerSeatId;
        console.log("庄家seatId:", PlayerMgr.ins.local.gameData.bankerSeatID);

        // 本场显示
        DoraHint.ins.benChangSet(pb.nBenJu);

        WorldNode.ins.info.setRound(pb.nQuan, pb.nRound);

        // str += " 东家座位ID：" + pb.nBankerSeatId ;

        CmdHandleSettleRound.isGameEnd = false;

        // 游戏状态 0--游戏未开始（刚进入房间） 1--游戏准备开始 2--游戏开始 3--一场结束（只有一场结束才能退出房间）
        GameState.ins.gameStatus = 2;
        UiMain.ins.border.btnQuit.active = false;

        // 隐藏即将开始界面
        UiMain.ins.willStartUI.hide();
        // 显示开始游戏动画，只有第一场
        if (pb.nRound == 1 && pb.nBenJu == 0) {
            UiMain.ins.startGameAnim.show();
        }

        GameState.ins.currQuan = pb.nQuan;
        // 设置XX局XX场
        DoraHint.ins.roundChangSet(pb.nQuan, pb.nRound, pb.nBenJu);


        // 出牌固定时间
        GameState.ins.fixDurationDiscard = pb.outCardTimeout;
        // 操作固定时间
        GameState.ins.fixDurationOp = pb.operationTimeout;

        // 重置和鸣切（每一局都重置）
        SettingsData.ins.isLizhi = false;
        UiMain.ins.uiAutoOpUI.reset();
        PlayerTingData.tingCards = [];
        PlayerTingData.willHuCards = [];

        UiMain.ins.border.btnTing.active = false;
        UiMain.ins.popup.ting.removeAllItems();


    }

    // 得到手牌// （8983--0x2317）服务器发牌
    static getHandcard(data: Uint8Array) {

        Reset.exe();

        // 抓牌动画显示完成后，才可以操作
        UiMain.ins.touchHandcard.enabled = false;
        let onComplete = FirstDrawHandcardLocal.onComplete;
        onComplete.splice(0, onComplete.length);
        onComplete.push(() => {
            UiMain.ins.touchHandcard.enabled = true;
        });

        var pb = protocol.mahjong_jp.SendCard.decode(data);
        console.log("【8983--0x2317】服务器发牌：", pb)

        let local = PlayerMgr.ins.local;

        for (var cardIdS of pb.handCard.card) {
            var cardId = ScMapping.cardId_s2c(cardIdS);
            var card = CardFactory.create2d(cardId);
            let handCard = local.gameData.handcard;
            handCard.push(card);
            // CardSort.exe( handCard ) ;

        } // end for

        // 听牌提示
        DataParse.huCardInfo(pb.hucard);

        // 打印调试
        {
            let str = "", str2 = "";
            for (let i = 0; i < pb.handCard.card.length; ++i) {
                let val = pb.handCard.card[i];
                str += String.fromCharCode(val, 16) + ",";
                str2 += ScMapping.cardId_s2c(val) + ",";
            }
            str = "收到手牌:玩家ID:" + PlayerMgr.ins.local.info.id + " 牌值:" + str + " 映射:" + str2;
            console.log(str);
            console.log("==HandCard len:", pb.handCard.card.length);

        }


    }

    // （9028--0x2344）用户退出
    static onExitStatus(data: Uint8Array) {
        let pb = protocol.mahjong_jp.ExitStatus.decode(data);
        console.log("【9028--0x2344】用户退出：", pb);
        // 退出状态, 1: 退出失败，正在游戏中，2：退出成功
        if (2 === pb.status) {
            ExitCtrl.exe();
        }
    }

    // （9002--0x232A）踢出玩家
    static onKickUser(data: Uint8Array): void {
        let pb = protocol.mahjong_jp.KickUser.decode(data);
        console.log("【9002--0x232A】踢出玩家：", pb);
    }


}


// 玩家视角设置
export class PlayerViewHelper {

    public static exe(nBankerSeatId: number) {
        let local = PlayerMgr.ins.local;

        // 决定方位视角
        let orein = this.orein(nBankerSeatId, local.gameData.seatId);
        LocalView.init(orein);

        // 其他人方位
        PlayerMgr.ins.all.forEach((v, k) => {
            v.gameData.seatOrien = this.orein(nBankerSeatId, v.gameData.seatId);
            PlayerEnter.bindPresentation(v);
            // console.log("userid:", v.info.id, "==seatid:", v.gameData.seatId, "seatorien:", v.gameData.seatOrien);
        });

        // for( let player of PlayerMgr.ins.all.values() ) {
        //     console.log("视角====userid:", player.info.id, "seatid:", player.gameData.seatId, "seatorien:", player.gameData.seatOrien)
        // }

    }

    // 服务器的东南西北规则。
    private static orein(bankerIdx: number, idx: number): SeatOrien {
        // 0-3 东南西北
        let n = idx >= bankerIdx ? idx - bankerIdx : 4 - bankerIdx + idx;
        return n;
    }

}
