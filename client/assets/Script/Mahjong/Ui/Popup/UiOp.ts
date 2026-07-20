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

import {Input, Node, Tween, tween} from "cc";
import {ChiHelper, ChiType} from "../../World/Ctrl/Operation/OpChi";
import {PlayerMgr} from "../../World/Entity/Player/Player";
import {ChiBaoHelper} from "../../World/Support/ChiBaoHelper";
import {HandcardOp} from "../../World/Support/HandcardOp";
import {CommSend} from "../../Communication/CommSend";
import {UiMain} from "../Main/UiMain";
import {OpRed} from "../../World/Ctrl/Operation/OpRed";
import {CardDisplay} from "../../World/Entity/Card/CardDisplay";

// 操作
export class UiOp {
    public root: Node;
    public btnPass: Node;
    public btnChi: Node;
    public btnPeng: Node;
    public btnGang: Node;
    public btnHu: Node;
    public btnLiZhi: Node;
    public btnZiMo: Node;
    public btnLiuJu: Node;

    // 包含哪种吃
    public chiLeft = false;
    public chiMiddle = false;
    public chiRight = false;

    // 包含的杠的类型
    public gangMing = false;
    public gangAn = false;
    public gangBu = false;

    // 胡法，是否是抢杠胡
    public gangHu = false;
    // 被操作的玩家
    public playerId: string;
    // 被操作的牌
    public cardId: string;
    // 杠牌信息。暗杠 补杠用到。明杠不用
    public cardIdsGang: string[];

    public init(node: Node) {
        this.root = node.getChildByPath("Operation");
        this.root.active = false;
        this.btnChi = this.root.getChildByPath("btnChi");
        this.btnChi.on(Input.EventType.TOUCH_END, this.onClick_Chi.bind(this));
        this.btnPeng = this.root.getChildByPath("btnPeng");
        this.btnPeng.on(Input.EventType.TOUCH_END, this.onClick_Peng.bind(this));
        this.btnGang = this.root.getChildByPath("btnGang");
        this.btnGang.on(Input.EventType.TOUCH_END, this.onClick_Gang.bind(this));
        this.btnHu = this.root.getChildByPath("btnHu");
        this.btnHu.on(Input.EventType.TOUCH_END, this.onClick_RongHe.bind(this));
        this.btnLiZhi = this.root.getChildByPath("btnLiZhi");
        this.btnLiZhi.on(Input.EventType.TOUCH_END, this.onClick_LiZhi.bind(this));
        this.btnPass = this.root.getChildByPath("btnPass");
        this.btnPass.on(Input.EventType.TOUCH_END, this.onClick_Pass.bind(this));
        this.btnZiMo = this.root.getChildByPath("btnZiMo");
        this.btnZiMo.on(Input.EventType.TOUCH_END, this.onClick_ZiMo.bind(this));
        this.btnLiuJu = this.root.getChildByPath("btnLiuJu");
        this.btnLiuJu.on(Input.EventType.TOUCH_END, this.onClick_LiuJu.bind(this));
    }

    public reset() {
        this.hideAllBtns();
        this.chiLeft = false;
        this.chiMiddle = false;
        this.chiRight = false;
    }

    public hideAllBtns() {
        for (let child of this.root.children) {
            child.active = false;
        }
    }

    // 在玩家未点过的情况下，直接发过
    public sendPass(): void {
        this.onClick_Pass();
    }

    private onClick_LiuJu() {
        CommSend.LiuJu();
    }

    private onClick_Pass() {
        this.toRemoveCardLight();
        this.stopAutoHe();
        CommSend.pass();
    }

    public toRemoveCardLight(): void {
        // 玩家过时，移除吃碰杠时高亮的标志与箭头
        console.log("PASS player id:", this.playerId)
        if (this.playerId) {
            // console.log("btn chi:", this.btnChi.active , " peng active:", this.btnPeng.active, " gang:", this.btnGang.active);
            if (this.btnChi.active || this.btnPeng.active || this.btnGang.active || this.btnHu.active) {
                let player = PlayerMgr.ins.all.get(this.playerId);
                // 取出被碰玩家打出的最后一张牌
                var discard = player.gameData.discard;
                var card = discard[discard.length - 1];
                // console.log("card:", card)
                if (card) {
                    CardDisplay.removeCardLight(card);
                }
            }
        }
    }

    // 获取赤宝牌的数量，包括玩家手中要操作的与对方出的
    private getChiBaoCardNum(mHandCardArr: string[], mOperCardID: string): number {
        let mCardNum = 0;
        const CHI_CARD_ARR: string[] = ["wan5_chibao", "tiao5_chibao", "tong5_chibao"];
        if (CHI_CARD_ARR.indexOf(mOperCardID) >= 0) {
            mCardNum++;
        }
        // 获取玩家手中赤宝牌的数量
        let mCardIdArrChibao: string[] = ChiBaoHelper.getChiBaoCardIds(mHandCardArr);
        if (mCardIdArrChibao != null && HandcardOp.has(PlayerMgr.ins.local, mCardIdArrChibao)) {
            // return mCardIdArrChibao ;
            mCardNum += mCardIdArrChibao.length;
        }
        return mCardNum;
    }

    // 获取玩家手中可以吃的牌数组
    private _doHandChiCardOperate(mChiType, mWillCardIdArr: Array<string>, mCardId: string): void {
        console.log("===do hand operate will card arr", mWillCardIdArr, "cardId:", mCardId)
        const CARD_WILLCHI_ARR: string[] = ["wan5", "tiao5", "tong5"];
        const CARD_CHISTR_ARR: string[] = ["wan5_chibao", "tiao5_chibao", "tong5_chibao"];
        // 要操作的数组
        // let mWillOperateArr:Array<string> = [];
        let mChiCardIdArr: Array<string> = [];
        let mIsHaveChi: boolean = false;

        for (let mCardStr of mWillCardIdArr) {
            console.log("mCardStr:", mCardStr, "index:", CARD_WILLCHI_ARR.indexOf(mCardStr));
            if (CARD_WILLCHI_ARR.indexOf(mCardStr) >= 0) {
                mChiCardIdArr.push(mCardStr + "_chibao");
                mIsHaveChi = true;
            } else {
                mChiCardIdArr.push(mCardStr);
            }
        }

        console.log("is have chi:", mIsHaveChi, " mchicardIDarr:", mChiCardIdArr);
        // 要操作的牌中有赤牌
        if (mIsHaveChi) {
            // 手中有赤牌
            if (HandcardOp.has(PlayerMgr.ins.local, mChiCardIdArr)) {
                console.log("有赤：", mChiCardIdArr);
                UiMain.ins.popup.select.addItem(mChiCardIdArr).root.on(Input.EventType.TOUCH_END, () => {
                    console.log("吃 赤宝 点击");
                    CommSend.chi(mChiType, mCardId, 1);
                });
            }
            // 手中有非赤牌
            if (HandcardOp.has(PlayerMgr.ins.local, mWillCardIdArr)) {
                console.log("无赤：", mChiCardIdArr);
                UiMain.ins.popup.select.addItem(mWillCardIdArr).root.on(Input.EventType.TOUCH_END, () => {
                    console.log("吃 非赤宝 点击");
                    CommSend.chi(mChiType, mCardId, 0);
                });
            }
        }
        // 要操作的牌中没有赤牌
        else {
            // 对方出的牌是赤牌
            if (CARD_CHISTR_ARR.indexOf(mCardId) >= 0) {
                if (HandcardOp.has(PlayerMgr.ins.local, mWillCardIdArr)) {
                    UiMain.ins.popup.select.addItem(mWillCardIdArr).root.on(Input.EventType.TOUCH_END, () => {
                        console.log("吃 赤宝 点击");
                        CommSend.chi(mChiType, mCardId, 1);
                    });
                }
            } else {
                if (HandcardOp.has(PlayerMgr.ins.local, mWillCardIdArr)) {
                    UiMain.ins.popup.select.addItem(mWillCardIdArr).root.on(Input.EventType.TOUCH_END, () => {
                        console.log("吃 非赤宝 点击");
                        CommSend.chi(mChiType, mCardId, 0);
                    });
                }
            }
        }

    }


    private onClick_Chi() {
        // 检查合法性
        let player = PlayerMgr.ins.all.get(this.playerId);
        let discard = player?.gameData?.discard;
        if (this.cardId != discard[discard.length - 1].id) {
            console.log("吃操作错误");
            // return ;
        }

        let cardId = this.cardId;

        // 测试
        // cardId = "tiao7" ; 
        // this.chiLeft = true ;
        // this.chiMiddle = true ;
        // this.chiRight = true ;

        let select = UiMain.ins.popup.select;
        select.removeAllItems();

        // 判断是否有赤宝版本
        let getChiBaoCard = (mWillCardIdArr: Array<string>): Array<string> => {
            var cardIdsChibao = ChiBaoHelper.getChiBaoCardIds(mWillCardIdArr);
            if (cardIdsChibao != null && HandcardOp.has(PlayerMgr.ins.local, cardIdsChibao)) {
                return cardIdsChibao;
            }
            return null;
        };


        if (this.chiLeft) {
            // 左吃
            let cardIds = ChiHelper.getCardIdsToChi(ChiType.Left, cardId);
            console.log("=====zuo chi cardID:", cardId, "willChiCardids:", cardIds);
            // // 赤宝处理
            // let cardIds2 = getChiBaoCard( cardIds ) ;
            // console.log("赤宝：", cardIds2)
            // if( cardIds2 != null ){ 
            //     select.addItem( cardIds2 ).root.on( Input.EventType.TOUCH_END , ()=>{ 
            //         console.log( "左吃 赤宝 点击" ) ; 
            //         CommSend.chi( ChiType.Left , cardId , cardIds2.length ) ;
            //     } ) ; 
            // }
            // else{
            //     select.addItem( cardIds ).root.on( Input.EventType.TOUCH_END , ()=>{ 
            //         console.log( "左吃 点击" ) ; 
            //         CommSend.chi( ChiType.Left , cardId , 0 ) ;
            //     } ) ; 
            // }
            this._doHandChiCardOperate(ChiType.Left, cardIds, cardId);
        }

        if (this.chiMiddle) {
            // 中吃--获取准备要吃的牌
            let mWillChiCardIdArr = ChiHelper.getCardIdsToChi(ChiType.Middle, cardId);
            console.log("=====zhong chi cardID:", cardId, "willChiCardids:", mWillChiCardIdArr);

            // // 赤宝处理--获取准备要吃的牌
            // let mChiWillChiCardIdArr = getChiBaoCard( mWillChiCardIdArr ) ;
            // console.log("赤宝cardIdsChi:", mChiWillChiCardIdArr);
            // // 赤宝的数量
            // let cardChiNum = this.getChiBaoCardNum(mWillChiCardIdArr, cardId);
            // console.log("赤宝num:", cardChiNum);
            // if( cardChiNum != 0 ){ 
            //     select.addItem( mChiWillChiCardIdArr ).root.on( Input.EventType.TOUCH_END , ()=>{ 
            //         console.log( "中吃 赤宝 点击" ) ; 
            //         CommSend.chi( ChiType.Middle , cardId , cardChiNum ) ;
            //     } ) ; 
            // }
            // else{
            //     select.addItem( mWillChiCardIdArr ).root.on( Input.EventType.TOUCH_END , ()=>{ 
            //         console.log( "中吃 点击" ) ; 
            //         CommSend.chi( ChiType.Middle , cardId , 0 ) ;
            //     } ) ; 
            // }

            this._doHandChiCardOperate(ChiType.Middle, mWillChiCardIdArr, cardId);
        }

        if (this.chiRight) {
            // 右吃
            let cardIds = ChiHelper.getCardIdsToChi(ChiType.Right, cardId);
            console.log("=====you chi cardID:", cardId, "willChiCardids:", cardIds);
            // // select.addItem( cardIds ).root.on( Input.EventType.TOUCH_END , ()=>{ 
            // //     console.log( "右吃 点击" ) ; 
            // //     CommSend.chi( ChiType.Right , cardId , 0 ) ;
            // // } ) ;
            // // 赤宝处理
            // let cardIds2 = getChiBaoCard( cardIds ) ;
            // if( cardIds2 != null ){ 
            //     select.addItem( cardIds2 ).root.on( Input.EventType.TOUCH_END , ()=>{ 
            //         console.log( "右吃 赤宝 点击" ) ; 
            //         CommSend.chi( ChiType.Right , cardId , cardIds2.length ) ;
            //     } ) ;  
            // }
            // else{
            //     select.addItem( cardIds ).root.on( Input.EventType.TOUCH_END , ()=>{ 
            //         console.log( "右吃 点击" ) ; 
            //         CommSend.chi( ChiType.Right , cardId , 0 ) ;
            //     } ) ;
            // }
            this._doHandChiCardOperate(ChiType.Right, cardIds, cardId);
        }

        // 弹出选择或直接发送
        select.title.string = "请选择要吃的牌";
        if (select.items.length > 1) {
            select.show();
        } else {
            select.items[0].root.emit(Input.EventType.TOUCH_END);
        }

        this.stopAutoHe();
    }

    private onClick_Peng() {

        var select = UiMain.ins.popup.select;
        // select.removeAllItems() ; 

        // var cardId = this.cardId ; 
        // console.log("peng carid:", this.cardId);
        // select.addItem( [ cardId , cardId ] ).root.on( Input.EventType.TOUCH_END , ()=>{ 
        //     console.log( "点击 碰 无赤宝" ) ; 
        //     CommSend.peng( cardId , 0 ) ;
        // } ) ;

        // // 处理 三赤的情况
        // var chibao = ChiBaoHelper.getChiBaoId( cardId ) ; 
        // if( chibao != null ) {
        //     var cardIds2 = [ chibao , cardId ] ;
        //     if( HandcardOp.has( PlayerMgr.ins.local , cardIds2 ) == true ) {
        //         // 有赤宝牌

        //         select.addItem( cardIds2 ).root.on( Input.EventType.TOUCH_END , ()=>{
        //             console.log( "点击 碰 有赤宝" ) ; 
        //             CommSend.peng( cardId , 1 ) ;
        //         } ) ;

        //     }
        // } 
        OpRed.doHandPengCardOperate(this.cardId);

        // 弹出选择或直接发送
        select.title.string = "请选择要碰的牌";
        if (select.items.length > 1) {
            select.show();
        } else {
            select.items[0].root.emit(Input.EventType.TOUCH_END);
        }
        this.stopAutoHe();
    }


    private onClick_Gang() {
        // if( this.gangMing ) {

        //     // 明杠。没有选择，只有一种。
        //     CommSend.gangMing( this.cardId , 0) ;
        //     return ;
        // }

        // var select = UiMain.ins.popup.select ;
        // select.removeAllItems() ; 

        // // 判断是暗杠还是补杠
        // let isBu = ( cardId : string ) : Boolean =>  {
        //     // 搜索明牌
        //     for( let t of PlayerMgr.ins.local.gameData.cardShown ) {
        //         if( t.cards[ 0 ].id == cardId ) return true ;
        //     }
        //     return false ;

        //     // return HandcardOp.has( PlayerMgr.ins.local , [ cardId ] ) ;
        // } ;

        // if( this.gangAn )  {
        //     // 暗杠
        //     for( let i = 0 ; i < this.cardIdsGang.length ; ++i ) {
        //         let cardId = this.cardIdsGang[ i ] ;
        //         if( isBu( cardId ) == true ) continue ;

        //         select.addItem( [ cardId , cardId ] ).root.on( Input.EventType.TOUCH_END , ()=>
        //         {
        //             console.log( "点击 暗杠" ) ; 
        //             CommSend.GangAn( cardId , 0) ;
        //         } ) ;

        //     } // end for

        // }

        // if( this.gangBu ) {
        //     // 补杠
        //     for( let i = 0 ; i < this.cardIdsGang.length ; ++i ) {
        //         let cardId = this.cardIdsGang[ i ] ;
        //         if( isBu( cardId ) == false ) continue ;

        //         select.addItem( [ cardId , cardId ] ).root.on( Input.EventType.TOUCH_END , ()=>
        //         {
        //             console.log( "点击 补杠" ) ; 
        //             CommSend.gangBu( cardId , 0 ) ;
        //         } ) ;

        //     } // end for

        // }

        // // 弹出选择或直接发送
        // select.title.string = "请选择要杠的牌" ;
        // if( select.items.length > 1 ){select.show() ; } else { select.items[ 0 ].root.emit( Input.EventType.TOUCH_END ) ; }

        OpRed.doHandGangOperate(this.gangMing, this.gangAn, this.gangBu, this.cardIdsGang, this.cardId);

        this.stopAutoHe();
    }

    private onClick_RongHe() {
        this.stopAutoHe();
        console.log("click hu ");
        if (this.gangHu) {
            CommSend.gangHu(this.cardId);
            return;
        }

        CommSend.hu(this.cardId);
    }

    private onClick_ZiMo() {
        console.log("click zimo ");
        this.stopAutoHe();
        CommSend.zimo(this.cardId);
    }

    private onClick_LiZhi() {
        this.stopAutoHe();
        this.root.active = false;
        UiMain.ins.popup.opBack.root.active = true;

        // 刷新立直要打出的牌颜色
        // 刷新打出去就会立直的牌
        UiMain.ins.touchHandcard.refreshWillHuCard(true);
    }

    // 开始自动和
    public startAutoHe() {
        // console.log("start auto he");
        tween(this.root).sequence(
            tween(this.root).delay(3),
            tween(this.root).call(() => {

                // console.log("btn hu active:", this.btnHu.active);
                // console.log("btn zimo active:", this.btnZiMo.active);
                if (this.btnHu.active == true) {
                    this.btnHu.emit(Input.EventType.TOUCH_END);
                } else if (this.btnZiMo.active == true) {
                    this.btnZiMo.emit(Input.EventType.TOUCH_END);
                }

            }),
        ).start();
    }

    // 停止自动和
    public stopAutoHe() {
        Tween.stopAllByTarget(this.root);
    }

}

// 返回
export class UiOpBack {

    public root: Node;

    public init(node: Node) {

        this.root = node.getChildByPath("OpBack");
        this.root.active = false;
        this.root.on(Input.EventType.TOUCH_END, () => {

            this.root.active = false;
            UiMain.ins.popup.op.root.active = true;

            // 重置立直要打出的牌颜色
            UiMain.ins.touchHandcard.refreshWillHuCard(false);

        });
    }

}