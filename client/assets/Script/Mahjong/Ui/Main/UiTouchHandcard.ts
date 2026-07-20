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

import {Color, EventTouch, Input, Node, Sprite, UITransform, Vec3} from "cc";
import {SoundEffect} from "../../World/Support/Audio";
import {UiMain} from "./UiMain";
import {CommSend} from "../../Communication/CommSend";
import {PrefabMgr} from "../../World/Support/Prefab";
import {PlayerMgr, PlayerTingData} from "../../World/Entity/Player/Player";
import {Card} from "../../World/Entity/Card/Card";
import {CardHint} from "../../World/Support/CardHint";
import {ScMapping} from "../../Communication/CardIdMapping";
import {App} from "../../../Module/App";
import {eSettingKey, SettingCtrl} from "../../../Module/Setting/SettingCtrl";

// 手牌触摸

/*
    设置可以出牌的点
    * 自己摸牌
    * 自己操作吃碰成功之后

    设置不能出牌的点
    * 自己出牌成功后
    * 轮到别人摸牌则自己不能出牌 (0x231E)
*/

export class UiTouchHandcard {


    public root: Node;

    // 可以出的牌
    public cardIdsCan = new Set<string>();

    // 不能出的牌
    public cardIdsCannot = new Set<string>();

    // 立直的牌，不能打出去
    public cardIdsLizhi = new Set<string>();

    // 打出去就会立直的牌
    public willHuCards = new Set<string>();

    // 是否可以出牌
    public enabled = true;
    // 当前出牌的操作方式 1--双击出牌 2--拖拽出牌
    public currOperation: number = 1;

    public init(node: Node) {

        this.root = node.getChildByPath("Touch");
        this.root.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.root.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.root.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.root.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        // 获取当前出牌方式，取不到，默认双击出牌
        this.currOperation = App.getInst(SettingCtrl).get(eSettingKey.operationType);
        if (this.currOperation != 1 && this.currOperation != 2) {
            this.currOperation = 1;
        }
        // console.log("operation:", this._currOperation);
    }


    // 清空出牌限制。
    // 摸牌的时候失效。出牌之后失效，操作选择跳过失效，收到别人操作失效，
    public clearDiscardLimit() {
        this.cardIdsCan.clear();
        this.cardIdsCannot.clear();
        this.willHuCards.clear();

        this.cardIdsLizhi.clear();
        this.refresh();
    }

    // 用于拖曳出牌
    private cardSel: Card = null;
    // 选择的牌的原始位置
    private cardSelPos: Vec3;

    // 用于单击选择的牌
    private cardSel2: Card = null;

    private state = 0;

    private onTouchStart(event: EventTouch) {

        console.log(event.getLocation());

        switch (this.state) {
            case 0: {

                let pos = event.getUILocation();
                let pos2 = new Vec3(pos.x, pos.y, 0);
                let pos3 = UiMain.ins.localHandcard.getComponent(UITransform).convertToNodeSpaceAR(pos2);
                this.cardSel = this.hitTest(pos3);
                if (this.cardSel == null) return;
                this.cardSelPos = this.cardSel.presentation2d.root.position.clone();
                let root = this.cardSel.presentation2d.root;
                root.setSiblingIndex(root.parent.children.length);

            }
                break;

        }

    }

    private onTouchMove(event: EventTouch) {

        if (this.cardSel == null) return;

        switch (this.state) {
            case 0: {

                let len = event.getUILocation().clone().subtract(event.getUIStartLocation()).lengthSqr();
                if (len > 10 * 10) {
                    this.state = 1;
                }

            }
                break;

            case 1: {

                let pos = event.getUILocation();
                let pos2 = new Vec3(pos.x, pos.y, 0);
                let pos3 = UiMain.ins.localHandcard.getComponent(UITransform).convertToNodeSpaceAR(pos2);
                this.cardSel.presentation2d.root.position = pos3;

            }
                break;

        }

        // console.log( pos.y ) ;
    }


    private onTouchCancel(event: EventTouch) {

        this.state = 0;

        if (this.cardSel == null) return;

        // 恢复
        this.setDefaultPos();

        let pos = event.getUILocation();
        if (pos.y < 230) return;

        // 当前出牌的操作方式 1--双击出牌 2--拖拽出牌
        if (this.currOperation != 2) {
            return;
        }

        this.tryDiscard(this.cardSel);
        this.cardSel = null;

    }

    private onTouchEnd(event: EventTouch) {

        // 恢复
        // HandcardPersentation.setCardsPosLocal( PlayerMgr.ins.local.gameData.handcard ) ;
        // console.log("on touch end:", this.state);
        switch (this.state) {

            case 0: {

                let pos = event.getUILocation();
                let pos2 = new Vec3(pos.x, pos.y, 0);
                let pos3 = UiMain.ins.localHandcard.getComponent(UITransform).convertToNodeSpaceAR(pos2);
                // console.log( pos3 ) ;

                let card = this.hitTest(pos3);
                if (card == null) return;

                SoundEffect.cardClick();

                // 先取消听牌信息的展示
                UiMain.ins.popup.ting.hide();
                // 如果之前没选中，就先选中
                if (card != this.cardSel2) {
                    this.showSelected(card);
                    this.cardSel2 = card;
                    // 展示听牌信息
                    UiMain.ins.popup.ting.showTingInforWhenTouch(ScMapping.cardId_c2s(card.id), card.id);
                    return;
                }

                this.showSelected(card);

                // 当前出牌的操作方式 1--双击出牌 2--拖拽出牌
                if (this.currOperation == 1) {
                    this.tryDiscard(card);
                }


                // this.state = 0 ;
            }
                break;

            case 1: {

                this.setDefaultPos();
                this.state = 0;
            }
                break;
        }
    }


    private tryDiscard(card: Card) {
        // console.log("==discard 1");
        // 不能触摸
        if (this.enabled == false) {
            console.log("不能发送出牌消息。")
            return;
        }


        // console.log("==discard 2");
        // 立直出牌
        var isLiZhiMode = UiMain.ins.popup.opBack.root.activeInHierarchy;
        // console.log("isLizhiMode:", isLiZhiMode );
        // console.log("立直：", PlayerMgr.ins.local.gameData.isLiZhi);
        if (this.limit(card.id) == false) {
            return;
        }


        // console.log("==discard 3");
        // 立直只能打出摸到的那张牌
        if (PlayerMgr.ins.local.gameData.isLiZhi == true) {
            // console.log("已经立直");
            if (this.isMoQie(card) == false) {
                return;
            }
        }
        // console.log("==discard 4");

        let isMq = this.isMoQie(card);

        // 轮到自己摸牌，有过操作，可以直接出牌 -- 不可以直接判断【过】操作是否显示，先要判断【操作面板】是否显示
        if (UiMain.ins.popup.op.root.active && UiMain.ins.popup.op.btnPass.active) {
            UiMain.ins.popup.op.sendPass();
        }
        // Discard.exe( PlayerMgr.ins.local , card.id , !isLiZhi ) ;
        CommSend.discard(card.id, isLiZhiMode, isMq);

    }

    // 牌是否是模切
    private isMoQie(card: Card): boolean {

        let handcard = PlayerMgr.ins.local.gameData.handcard;
        let width = PrefabMgr.card2d.get("tiao1").getComponent(UITransform).contentSize.width;
        let x = handcard.length * width;

        if (card.presentation2d.root.position.x == x) {
            return true;
        }
        console.log("==discard 5");
        return false;

    }

    // 出牌限制
    private limit(cardId: string): boolean {
        let mCardInd: number = cardId.indexOf("_chibao");
        // 赤五万、赤五筒、赤五条 改为五万、五筒、五条来处理
        if (mCardInd >= 0) {
            cardId = cardId.substring(0, mCardInd);
        }

        // 出牌限制，可以出的牌
        if (this.cardIdsCan.size != 0) {
            // 有出牌限制
            if (this.cardIdsCan.has(cardId) == false) {
                console.log("有出牌限制:", cardId);
                return false;
            }

        }

        // 不能出的牌
        if (this.cardIdsCannot.size != 0) {
            if (this.cardIdsCannot.has(cardId) == true) {
                console.log("不能出的牌:", cardId);
                return false;
            }
        }

        console.log("cardidsLizhi:", this.cardIdsLizhi, "cardID:", cardId);
        console.log("已经立直：", PlayerMgr.ins.local.gameData.isLiZhi);
        // 立直的牌，不能打出去
        if (this.cardIdsLizhi.size != 0) {
            // 立直后
            if (PlayerMgr.ins.local.gameData.isLiZhi == true) {
                if (this.cardIdsLizhi.has(cardId) == true) {
                    console.log("立直的牌1:", cardId);
                    return false;
                }
            }
            // 立直前
            else {
                if (this.cardIdsLizhi.has(cardId) == false) {
                    console.log("立直的牌2:", cardId);
                    return false;
                }
            }
        }

        return true;

    }

    // 点击测试。判断和哪个手牌 在X轴重叠
    private hitTest(pos: Vec3): Card {

        var widthHalf = PrefabMgr.card2d.get("tiao1").getComponent(UITransform).contentSize.width / 2;

        var handcard = PlayerMgr.ins.local.gameData.handcard;
        // console.log("hit handCard:", handcard)
        for (var i = 0; i < handcard.length; ++i) {

            var card = handcard[i];
            var size = card.presentation2d.root.getComponent(UITransform).contentSize;
            var pos2 = card.presentation2d.root.position;
            if (pos2.x - widthHalf <= pos.x && pos.x <= pos2.x + widthHalf) {
                return card;
            }

        } // end for

        return null;

    }

    // 显示点击的手牌
    public showSelected(card: Card) {

        // 全部回缩
        this.setDefaultPos();

        let pos = card.presentation2d.root.position.clone();
        pos.y = 30;
        card.presentation2d.root.position = pos;

        CardHint.meiShu(card.id);

        // Discard.exe( PlayerMgr.ins.local.info.id , card.id ) ;

    }

    // 牌全部回缩
    private setDefaultPos(cardExcluded: Card = null) {

        // 只设置Y轴
        let handcard = PlayerMgr.ins.local.gameData.handcard;
        for (let i = 0; i < handcard.length; ++i) {
            var card2 = handcard[i];
            if (card2 == cardExcluded) continue;
            let pos = card2.presentation2d.root.position.clone();
            pos.y = 0;
            card2.presentation2d.root.position = pos;
        }

        // HandcardPersentation.setCardsPosLocal( PlayerMgr.ins.local.gameData.handcard ) ;

        // 恢复拖拽的牌
        if (this.cardSel != null) {
            this.cardSel.presentation2d.root.position = this.cardSelPos;
        }

    }

    // 刷新
    public refresh() {

        console.log("refresh cannot:", this.cardIdsCannot);
        console.log("refresh lizhi:", this.cardIdsLizhi);
        let handcard = PlayerMgr.ins.local.gameData.handcard;
        console.log("refresh hand:", handcard);
        for (let i = 0; i < handcard.length; ++i) {
            let card = handcard[i];

            let cr = Color.WHITE;
            if (this.cardIdsCannot.has(card.id)) {
                cr = Color.GRAY;
            }

            if (this.cardIdsLizhi.has(card.id)) {
                cr = Color.GRAY;
            }

            card.presentation2d.root.getComponent(Sprite).color = cr;

        } // end for

        // 清空单击已选择的牌
        this.cardSel2 = null;
    }

    // 刷新打出去就会立直的牌
    public refreshWillHuCard(isLiZhi: boolean): void {
        let handcard = PlayerMgr.ins.local.gameData.handcard;

        // 已经立直
        if (isLiZhi) {
            let willHuCards = PlayerTingData.willHuCards;
            this.cardIdsLizhi.clear();
            if (willHuCards.length <= 0) {
                return;
            }

            for (let mi = 0; mi < willHuCards.length; mi++) {
                this.cardIdsLizhi.add(willHuCards[mi]);
            }
            console.log("打出去就会立直的牌：", willHuCards);
            // console.log("cardIdslizhi:", this.cardIdsLizhi);
            for (let i = 0; i < handcard.length; ++i) {
                let card = handcard[i];
                let mCardID: string = card.id;
                let mCardInd: number = mCardID.indexOf("_chibao");
                // 赤五万、赤五筒、赤五条 改为五万、五筒、五条来处理
                if (mCardInd >= 0) {
                    mCardID = mCardID.substring(0, mCardInd);
                }

                let cr = Color.GRAY;
                if (willHuCards.indexOf(mCardID) >= 0) {
                    cr = Color.WHITE;
                }

                card.presentation2d.root.getComponent(Sprite).color = cr;
                // console.log("card:", card)
            } // end for
            // console.log("refresh handcard:", handcard);

        } else {
            this.cardIdsLizhi.clear();

            for (let i = 0; i < handcard.length; ++i) {
                handcard[i].presentation2d.root.getComponent(Sprite).color = Color.WHITE;
            } // end for
        }
    }
}
