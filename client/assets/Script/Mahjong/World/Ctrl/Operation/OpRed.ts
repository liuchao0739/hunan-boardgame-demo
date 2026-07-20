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

import {Input} from "cc";
import {CommSend} from "../../../Communication/CommSend";
import {UiMain} from "../../../Ui/Main/UiMain";
import {CardShownDisplay} from "../../Entity/CardShown/CardShownDisplay";
import {CardShownFactory} from "../../Entity/CardShown/CardShownFactory";
import {Player, PlayerMgr} from "../../Entity/Player/Player";
import {SoundEffect} from "../../Support/Audio";
import {HandcardOp} from "../../Support/HandcardOp";
import {HandCtrl} from "../HandCtrl";
import {CardShownType} from "../../Entity/CardShown/CardShown";
import {RelativeOrien, RelativeOrienCalc} from "../../Support/RelativeOrien";
import {CardFactory} from "../../Entity/Card/CardFactory";

/**
 * 赤宝牌操作
 */
export class OpRed {
    private static readonly CARD_WILLCHI_ARR: string[] = ["wan5", "tiao5", "tong5"];
    private static readonly CARD_CHISTR_ARR: string[] = ["wan5_chibao", "tiao5_chibao", "tong5_chibao"];

    // player 操作者。cardIds 操作者去吃的牌。player2 被吃者。cardId 被吃的牌
    public static chiExe(player: Player, mWillCardIdArr: Array<string>, player2: Player, cardId: string) {
        // const CARD_WILLCHI_ARR:string[] = ["wan5", "tiao5", "tong5"];
        // const CARD_CHISTR_ARR:string[] = ["wan5_chibao", "tiao5_chibao", "tong5_chibao"];

        // 取出被吃玩家打出的最后一张牌
        if (player2 != null) {
            var discard = player2.gameData.discard;
            if (discard.length > 0) {
                var cardLast = discard[discard.length - 1];
                if (cardLast.id == cardId) {
                    discard.splice(discard.length - 1, 1);
                    cardLast.presentation3d.root.destroy();
                }
            }
        }

        let mWillOperArr: Array<string> = [];
        // 被吃的是赤宝牌，不需要处理
        if (this.CARD_CHISTR_ARR.indexOf(cardId) >= 0) {
            mWillOperArr = mWillCardIdArr;
        }
        // 被吃的不是赤宝牌，需要计算玩家手中哪一张是赤宝牌，吃的时候，赤宝牌只能是1张
        else {
            // 存放操作者去吃的牌的数组，包含赤宝牌
            let mChiCardIdArr: Array<string> = [];
            let mIsHaveChi: boolean = false;

            for (let mCardStr of mWillCardIdArr) {
                console.log("mCardStr:", mCardStr, "index:", this.CARD_WILLCHI_ARR.indexOf(mCardStr));
                if (this.CARD_WILLCHI_ARR.indexOf(mCardStr) >= 0) {
                    mChiCardIdArr.push(mCardStr + "_chibao");
                    mIsHaveChi = true;
                } else {
                    mChiCardIdArr.push(mCardStr);
                }
            }

            mWillOperArr = mChiCardIdArr;
        }


        // 从手牌中移除牌
        HandcardOp.remove(player, mWillOperArr);

        var cardShown = CardShownFactory.createChi(mWillOperArr, cardId);
        player.gameData.cardShown.push(cardShown);

        CardShownDisplay.exe(player);

        HandCtrl.cardShown(player, cardShown);
        SoundEffect.chi();

    }

    // player 碰牌者。cardIds 碰牌者的牌。player2 被碰的玩家。
    public static pengExe(player: Player, cardId: string, player2: Player, mRedFive: number) {
        console.log("cardid:", cardId, " red fivecount:", mRedFive);
        // 取出被碰玩家打出的最后一张牌
        var discard = player2.gameData.discard;
        var card = discard[discard.length - 1];
        discard.splice(discard.length - 1, 1);
        card.presentation3d.root.destroy();


        // 存放操作者去碰的牌的数组，包含赤宝牌
        let mWillOperArr: Array<string> = [];

        // 存放玩家显示的牌数组
        let mWillShowArr: Array<string> = [];

        // 被碰的是赤宝牌，不需要处理
        if (this.CARD_CHISTR_ARR.indexOf(cardId) >= 0) {
            let mIndex: number = cardId.indexOf("_chibao");
            let mCardVal: string = cardId.slice(0, mIndex);

            mWillOperArr = [mCardVal, mCardVal];
            mWillShowArr = [mCardVal, mCardVal];
            console.log("mwillOperateor arr1:", mWillOperArr);
        }
        // 被碰的不是赤宝牌，需要计算玩家手中哪一张是赤宝牌，碰的时候，赤宝牌只能是1张
        else {
            // 碰的牌有可能是赤宝牌
            if (this.CARD_WILLCHI_ARR.indexOf(cardId) >= 0) {
                mWillOperArr = [cardId, cardId + "_chibao"];
                mWillShowArr = [cardId, cardId + "_chibao"];
                console.log("mwillOperateor arr2:", mWillOperArr);
            } else {
                mWillOperArr = [cardId, cardId];
                mWillShowArr = [cardId, cardId];
                console.log("mwillOperateor arr3:", mWillOperArr);
            }
        }
        console.log("mwillOperateor arr4:", mWillOperArr);

        // 从手牌中移除牌。只用剔除2张
        HandcardOp.remove(player, mWillOperArr);
        // HandcardOp.remove( player , [ cardId , cardId ] ) ;
        console.log("mWIllshowarr1:", mWillShowArr);
        var type = CardShownType.None;
        var relativeOrien = RelativeOrienCalc.get(player.gameData.seatOrien, player2.gameData.seatOrien);
        if (relativeOrien == RelativeOrien.Previous) {
            type = CardShownType.PengPrevious;
            mWillShowArr.unshift(cardId);
            console.log("mWIllshowarr2:", mWillShowArr);

        } else if (relativeOrien == RelativeOrien.Opposite) {
            type = CardShownType.PengOpposite;
            mWillShowArr.splice(1, 0, cardId);
            console.log("mWIllshowarr3:", mWillShowArr);
        } else if (relativeOrien == RelativeOrien.Next) {
            type = CardShownType.PengNext;
            mWillShowArr.push(cardId);
            console.log("mWIllshowarr4:", mWillShowArr);
        }

        console.log("mWIllshowarr:", mWillShowArr);
        // 创建明牌
        // var cardIds = [ cardId , cardId , cardId ] ;
        var cardShown = CardShownFactory.createPeng(type, mWillShowArr);
        // cardShown.cards.push( card );
        player.gameData.cardShown.push(cardShown);

        CardShownDisplay.exe(player);
        HandCtrl.cardShown(player, cardShown);

        SoundEffect.peng();

    }


    // 明杠
    public static gangExe(player: Player, cardId: string, player2: Player, mRedFive: number) {
        console.log("gangexe cardId:", cardId)
        // 取出玩家打出的最后一张牌
        if (player2 != null) {
            var discard = player2.gameData.discard;
            var card = discard[discard.length - 1];
            discard.splice(discard.length - 1, 1);
            // 销毁
            card.presentation3d.root.destroy();
        }


        // 存放操作者去杠的牌的数组，包含赤宝牌
        let mWillOperArr: Array<string> = [];
        // 存放玩家显示的牌数组
        let mWillShowArr: Array<string> = [];

        // 被杠的是赤宝牌，不需要处理
        if (this.CARD_CHISTR_ARR.indexOf(cardId) >= 0) {
            let mIndex: number = cardId.indexOf("_chibao");
            let mCardVal: string = cardId.slice(0, mIndex);

            mWillOperArr = [mCardVal, mCardVal, mCardVal];
            mWillShowArr = [mCardVal, mCardVal, mCardVal];
            console.log("mwillOperateor arr1:", mWillOperArr);
        }
        // 被杠的不是赤宝牌，需要计算玩家手中哪一张是赤宝牌，杠的时候，赤宝牌只能是1张
        else {
            // 杠的牌有可能是赤宝牌
            if (this.CARD_WILLCHI_ARR.indexOf(cardId) >= 0) {
                mWillOperArr = [cardId, cardId + "_chibao", cardId];
                mWillShowArr = [cardId, cardId + "_chibao", cardId];
                console.log("mwillOperateor arr2:", mWillOperArr);
            } else {
                mWillOperArr = [cardId, cardId, cardId];
                mWillShowArr = [cardId, cardId, cardId];
                console.log("mwillOperateor arr3:", mWillOperArr);
            }
        }

        // 从手牌中移除牌。明杠只用剔除3张
        HandcardOp.remove(player, mWillOperArr);

        var type = CardShownType.None;
        var relativeOrien = RelativeOrienCalc.get(player.gameData.seatOrien, player2.gameData.seatOrien);
        if (relativeOrien == RelativeOrien.Previous) {
            type = CardShownType.GangPrevious;
            mWillShowArr.unshift(cardId);
        } else if (relativeOrien == RelativeOrien.Opposite) {
            type = CardShownType.GangOpposite;
            mWillShowArr.splice(1, 0, cardId);
        } else if (relativeOrien == RelativeOrien.Next) {
            type = CardShownType.GangNext;
            mWillShowArr.push(cardId);
        }

        // 创建明牌
        var cardIds = mWillShowArr;//[ cardId , cardId , cardId , cardId ] ;
        var cardShown = CardShownFactory.createGang(type, cardIds);
        player.gameData.cardShown.push(cardShown);

        CardShownDisplay.exe(player);
        HandCtrl.cardShown(player, cardShown);

        SoundEffect.gang();
    }

    // 暗杠
    public static darkExe(player: Player, cardId: string, mRedFive: number) {
        // console.log("===cardID:", cardId, "===redfive:", mRedFive);
        // 存放操作者去杠的牌的数组，包含赤宝牌
        let mWillOperArr: Array<string> = [];
        // 存放玩家显示的牌数组
        let mWillShowArr: Array<string> = [];

        // 被杠的是赤宝牌，不需要处理
        if (this.CARD_CHISTR_ARR.indexOf(cardId) >= 0) {
            let mIndex: number = cardId.indexOf("_chibao");
            let mCardVal: string = cardId.slice(0, mIndex);

            mWillOperArr = [mCardVal, mCardVal, mCardVal, cardId];
            mWillShowArr = [mCardVal, mCardVal, mCardVal, cardId];
            console.log("mwillOperateor arr1:", mWillOperArr);
        }
        // 被杠的不是赤宝牌，需要计算玩家手中哪一张是赤宝牌，杠的时候，赤宝牌只能是1张
        else {
            // 杠的牌有可能是赤宝牌
            if (this.CARD_WILLCHI_ARR.indexOf(cardId) >= 0) {
                mWillOperArr = [cardId, cardId, cardId + "_chibao", cardId];
                mWillShowArr = [cardId, cardId, cardId + "_chibao", cardId];
                console.log("mwillOperateor arr2:", mWillOperArr);
            } else {
                mWillOperArr = [cardId, cardId, cardId, cardId];
                mWillShowArr = [cardId, cardId, cardId, cardId];
                console.log("mwillOperateor arr3:", mWillOperArr);
            }
        }

        // var ids = [ cardId , cardId , cardId , cardId ] ;

        // 从手牌中移除牌
        HandcardOp.remove(player, mWillOperArr);

        // 创建明牌
        var cardShown = CardShownFactory.createGang(CardShownType.GangDark, mWillShowArr);
        player.gameData.cardShown.push(cardShown);

        CardShownDisplay.exe(player);
        HandCtrl.cardShown(player, cardShown);

        SoundEffect.gang();

    }

    // 补杠
    public static patchExe(player: Player, cardId: string, mRedFive: number) {
        console.log("补杠 cardid:", cardId, " red fivecount:", mRedFive);

        var mapping = new Map<CardShownType, CardShownType>();
        mapping.set(CardShownType.PengPrevious, CardShownType.PengPreviousGang);
        mapping.set(CardShownType.PengOpposite, CardShownType.PengOppositeGang);
        mapping.set(CardShownType.PengNext, CardShownType.PengNextGang);

        // 找之前的碰
        var cardShown = player.gameData.cardShown.find((e) => {
            return mapping.has(e.type) && e.cards[0].id == cardId;
        });
        if (cardShown == null) {
            console.log("补杠找不到碰");
            return;
        }

        // 从手牌中移除牌
        HandcardOp.remove(player, [cardId]);

        // 修改类型
        cardShown.type = mapping.get(cardShown.type);
        // 补的牌放在最后
        var card = CardFactory.create3d(cardId);
        cardShown.cards.push(card);

        // 显示
        CardShownDisplay.exe(player);
        HandCtrl.cardShown(player, cardShown);

        SoundEffect.gang();
    }

    // 点击界面【碰】按钮时，处理玩家碰的情况
    public static doHandPengCardOperate(mCardId: string): void {
        console.log("===do hand operate peng  cardId:", mCardId)
        // const CARD_WILLCHI_ARR:string[] = ["wan5", "tiao5", "tong5"];
        // const CARD_CHISTR_ARR:string[] = ["wan5_chibao", "tiao5_chibao", "tong5_chibao"];

        var mSelectUI = UiMain.ins.popup.select;
        mSelectUI.removeAllItems();

        // 要检查的数组
        let mCheckCardIdArr: Array<string> = [];
        let mIsHaveChi: boolean = false;

        // 要碰的是赤宝牌
        if (mCardId.indexOf("_chibao") > 0) {
            let mIndex: number = mCardId.indexOf("_chibao");
            console.log("mIndex:", mIndex);
            let mCardVal: string = mCardId.slice(0, mIndex);
            console.log("mCardVal:", mCardVal);

            mCheckCardIdArr = [mCardVal, mCardVal];
            console.log("mCheckCardIDARr1:", mCheckCardIdArr);
            if (HandcardOp.has(PlayerMgr.ins.local, mCheckCardIdArr)) {
                mSelectUI.addItem(mCheckCardIdArr).root.on(Input.EventType.TOUCH_END, () => {
                    console.log("点击 碰 有赤宝1");
                    CommSend.peng(mCardId, 1);
                });
            }


            mIsHaveChi = true;
        }
        // 要碰的不是赤宝牌
        else {
            // 要碰的是5万、5条、5筒之一
            if (this.CARD_WILLCHI_ARR.indexOf(mCardId) >= 0) {
                // 检查玩家手上是否有赤宝
                mCheckCardIdArr = [mCardId, mCardId + "_chibao"];
                console.log("mcheckcard id arr1:", mCheckCardIdArr);
                if (HandcardOp.has(PlayerMgr.ins.local, mCheckCardIdArr)) {
                    mSelectUI.addItem(mCheckCardIdArr).root.on(Input.EventType.TOUCH_END, () => {
                        console.log("点击 碰 有赤宝2");
                        CommSend.peng(mCardId, 1);
                    });
                }

                // 检查玩家手上是否有非赤宝
                mCheckCardIdArr = [mCardId, mCardId];
                console.log("mcheckcard id arr2:", mCheckCardIdArr);
                if (HandcardOp.has(PlayerMgr.ins.local, mCheckCardIdArr)) {
                    mSelectUI.addItem(mCheckCardIdArr).root.on(Input.EventType.TOUCH_END, () => {
                        console.log("点击 碰 无赤宝1");
                        CommSend.peng(mCardId, 0);
                    });
                }

            } else {
                mSelectUI.addItem([mCardId, mCardId]).root.on(Input.EventType.TOUCH_END, () => {
                    console.log("点击 碰 无赤宝2");
                    CommSend.peng(mCardId, 0);
                });
            }
        }
    }

    // 点击界面【杠】按钮时，处理玩家杠的情况
    public static doHandGangOperate(mGangMing: boolean, mGangAn: boolean, mGangBu: boolean, mGangArr: string[], mCardId: string): void {
        console.log("gameming :", mGangMing, "==gangan:", mGangAn, "===gangbu:", mGangBu, "==cardid:", mCardId);
        // 要检查的数组
        let mCheckCardIdArr: Array<string> = [];
        // 要操作的是否是赤宝牌
        let mIsTodoChi: boolean = false;
        let mIndex: number = 0;
        let mCardVal: string = "";

        let mSelectUI = UiMain.ins.popup.select;
        mSelectUI.removeAllItems();


        // 要杠的是赤宝牌
        if (mCardId.indexOf("_chibao") > 0) {
            mIndex = mCardId.indexOf("_chibao");
            mCardVal = mCardId.slice(0, mIndex);

            mIsTodoChi = true;
        }

        // 明杠
        if (mGangMing) {
            console.log("=========明");
            // 明杠。没有选择，只有一种。

            // 要杠的是赤宝牌
            if (mIsTodoChi) {
                // CommSend.gangMing( mCardId , 1) ;
                // 设置其中一张是赤宝牌
                mSelectUI.addItem([mCardId, mCardVal]).root.on(Input.EventType.TOUCH_END, () => {
                    console.log("点击 明杠1");
                    CommSend.gangMing(mCardId, 1);
                });
            } else {
                // 要杠的是5万、5条、5筒之一
                if (this.CARD_WILLCHI_ARR.indexOf(mCardId) >= 0) {
                    mCheckCardIdArr = [mCardId + "_chibao"];
                    // 检查玩家手上是否有赤宝
                    if (HandcardOp.has(PlayerMgr.ins.local, mCheckCardIdArr)) {
                        // CommSend.gangMing( mCardId , 1) ;
                        // 设置其中一张是赤宝牌
                        mSelectUI.addItem([mCardId, mCardId + "_chibao"]).root.on(Input.EventType.TOUCH_END, () => {
                            console.log("点击 明杠2");
                            CommSend.gangMing(mCardId, 1);
                        });
                    } else {
                        // CommSend.gangMing( mCardId , 0) ;
                        mSelectUI.addItem([mCardId, mCardId]).root.on(Input.EventType.TOUCH_END, () => {
                            console.log("点击 明杠3");
                            CommSend.gangMing(mCardId, 0);
                        });
                    }
                } else {
                    // CommSend.gangMing( mCardId , 0) ;
                    mSelectUI.addItem([mCardId, mCardId]).root.on(Input.EventType.TOUCH_END, () => {
                        console.log("点击 明杠4");
                        CommSend.gangMing(mCardId, 0);
                    });
                }
            }

        }

        // let select = UiMain.ins.popup.select ;
        // select.removeAllItems() ; 

        // 判断是暗杠还是补杠
        let isBu = (cardId: string): Boolean => {
            // 搜索明牌
            for (let t of PlayerMgr.ins.local.gameData.cardShown) {
                if (t.cards[0].id == cardId) return true;
            }
            return false;

            // return HandcardOp.has( PlayerMgr.ins.local , [ cardId ] ) ;
        };

        // 暗杠
        if (mGangAn) {
            console.log("=========暗");
            // 要杠的是赤宝牌
            if (mIsTodoChi) {
                console.log("点击 暗杠");
                // CommSend.GangAn( mCardId , 1) ;
                // 设置其中一张是赤宝牌
                mSelectUI.addItem([mCardId, mCardVal]).root.on(Input.EventType.TOUCH_END, () => {
                    console.log("点击 暗杠1");
                    CommSend.GangAn(mCardId, 1);
                });
            } else {
                // 要杠的是5万、5条、5筒之一
                if (this.CARD_WILLCHI_ARR.indexOf(mCardId) >= 0) {
                    mCheckCardIdArr = [mCardId + "_chibao"];
                    // 检查玩家手上是否有赤宝
                    if (HandcardOp.has(PlayerMgr.ins.local, mCheckCardIdArr)) {
                        // CommSend.GangAn( mCardId , 1) ;
                        // 设置其中一张是赤宝牌
                        mSelectUI.addItem([mCardId, mCardId + "_chibao"]).root.on(Input.EventType.TOUCH_END, () => {
                            console.log("点击 暗杠2");
                            CommSend.GangAn(mCardId, 1);
                        });
                    } else {
                        // CommSend.GangAn( mCardId , 0) ;
                        mSelectUI.addItem([mCardId, mCardId]).root.on(Input.EventType.TOUCH_END, () => {
                            console.log("点击 暗杠3");
                            CommSend.GangAn(mCardId, 0);
                        });
                    }
                } else {
                    console.log("点击 非赤宝 暗杠");
                    // CommSend.GangAn( mCardId , 0) ;
                    mSelectUI.addItem([mCardId, mCardId]).root.on(Input.EventType.TOUCH_END, () => {
                        console.log("点击 暗杠4");
                        CommSend.GangAn(mCardId, 0);
                    });
                }
            }
            // // 暗杠
            // for( let i = 0 ; i < mGangArr.length ; ++i ) {
            //     let cardId = mGangArr[ i ] ;
            //     if( isBu( cardId ) == true ) continue ;

            //     select.addItem( [ cardId , cardId ] ).root.on( Input.EventType.TOUCH_END , ()=>
            //     {
            //         console.log( "点击 暗杠" ) ; 
            //         CommSend.GangAn( cardId , 0) ;
            //     } ) ;

            // } // end for
        }

        // 补杠
        if (mGangBu) {
            console.log("=========补");
            // 要杠的是赤宝牌
            if (mIsTodoChi) {
                // CommSend.gangBu( mCardId , 1) ;
                // 设置其中一张是赤宝牌
                mSelectUI.addItem([mCardId, mCardVal]).root.on(Input.EventType.TOUCH_END, () => {
                    console.log("点击 补杠1");
                    CommSend.gangBu(mCardId, 1);
                });
            } else {
                // 要杠的是5万、5条、5筒之一
                if (this.CARD_WILLCHI_ARR.indexOf(mCardId) >= 0) {
                    mCheckCardIdArr = [mCardId + "_chibao"];
                    // 检查玩家手上是否有赤宝
                    if (HandcardOp.has(PlayerMgr.ins.local, mCheckCardIdArr)) {
                        // CommSend.gangBu( mCardId , 1) ;
                        // 设置其中一张是赤宝牌
                        mSelectUI.addItem([mCardId, mCardId]).root.on(Input.EventType.TOUCH_END, () => {
                            console.log("点击 补杠2");
                            CommSend.gangBu(mCardId, 1);
                        });
                    } else {
                        // CommSend.gangBu( mCardId , 0) ;
                        mSelectUI.addItem([mCardId, mCardId]).root.on(Input.EventType.TOUCH_END, () => {
                            console.log("点击 补杠3");
                            CommSend.gangBu(mCardId, 0);
                        });
                    }
                } else {
                    // CommSend.gangBu( mCardId , 0) ;
                    mSelectUI.addItem([mCardId, mCardId]).root.on(Input.EventType.TOUCH_END, () => {
                        console.log("点击 补杠4");
                        CommSend.gangBu(mCardId, 0);
                    });
                }
            }


            // for( let i = 0 ; i < mGangArr.length ; ++i ) {
            //     let cardId = mGangArr[ i ] ;
            //     if( isBu( cardId ) == false ) continue ;

            //     select.addItem( [ cardId , cardId ] ).root.on( Input.EventType.TOUCH_END , ()=>
            //     {
            //         console.log( "点击 补杠" ) ; 
            //         CommSend.gangBu( cardId , 0 ) ;
            //     } ) ;

            // } // end for

        }

        console.log("len===:", mSelectUI.items.length)
        // 弹出选择或直接发送
        mSelectUI.title.string = "请选择要杠的牌";
        if (mSelectUI.items.length > 2) {
            mSelectUI.show();
        } else {

            mSelectUI.items[0].root.emit(Input.EventType.TOUCH_END);
        }

    }
}

