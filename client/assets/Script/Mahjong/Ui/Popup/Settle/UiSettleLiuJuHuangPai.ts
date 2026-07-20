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

import {Node, UITransform} from "cc";
import {CardFactory} from "../../../World/Entity/Card/CardFactory";
import {UiPopupHelper} from "../../../../framework/utils/UiPopupHelper";
import {ScMapping} from "../../../Communication/CardIdMapping";

// 荒牌流局
export class UiSettleLiuJuHuangPai {

    public root: Node;
    public btnOK: Node;

    public players = new Array<UiSettleLiuJuHuangPaiPlayer>();


    public init(node: Node) {

        this.root = node.getChildByPath("SettleLiuJuHuangPai");
        ;
        this.root.active = false;
        this.btnOK = this.root.getChildByPath("btnOK");

        this.players = [];
        for (var i = 1; i <= 4; ++i) {

            var uiPlayer = new UiSettleLiuJuHuangPaiPlayer();
            uiPlayer.init(this.root.getChildByPath(i.toString()));
            this.players.push(uiPlayer);

        } // end for
        console.log("UiSettleLiuJuHuangPai ==players:", this.players)

    }

    public show() {
        UiPopupHelper.show(this.root);
    }


    public hide() {
        this.root.active = false;
    }

    public hideAllPlayers() {
        for (let e of this.players) {
            e.root.active = false;
        }
    }

}

// 流局荒牌玩家项
export class UiSettleLiuJuHuangPaiPlayer {

    public root: Node;

    // 听牌两个字
    private _tingBg: Node | null = null;
    private _tingCardCont: Node | null = null;
    private _tingCard: Node | null = null;

    public init(node: Node) {

        this.root = node;

        this._tingBg = this.root.getChildByPath("tingBg");
        this._tingCardCont = this.root.getChildByPath("tingCardCont");
        this._tingCard = this.root.getChildByPath("tingCardCont/card");

        // console.log("ting cardCont children 00:"+ this._tingCardCont.children);
    }

    public showTingCards(cardIds: Array<number>): void {
        // console.log("听牌：", cardIds);
        // console.log("ting cardCont children 0:"+ this._tingCardCont.children);
        this.root.active = true;
        if (!cardIds || cardIds.length == 0) {
            this._tingBg.active = false;
            this._tingCardCont.active = false;
            return;
        }

        // console.log("ting cardCont active 1:"+this._tingCardCont.active);
        // console.log("ting cardCont children 1:"+ this._tingCardCont.children);
        this._tingBg.active = true;
        this._tingCardCont.active = true;
        if (this._tingCardCont.children) {
            this._tingCardCont.removeAllChildren();

            // console.log("ting cardCont children 2:"+ this._tingCardCont.children);

            // console.log("tingcard:", this._tingCard);
            let mCardSize = this._tingCard.getComponent(UITransform).contentSize;
            // console.log("cardids:", cardIds);
            // console.log("ting cardCont2:"+this._tingCardCont+"children:", this._tingCardCont.children);
            for (var mi = 0; mi < cardIds.length; ++mi) {

                let mCardInst = CardFactory.create2d(ScMapping.cardId_s2c(cardIds[mi]));

                // 归0
                mCardInst.presentation2d.root.setPosition(0, 0, 0);

                // mCardInst.presentation2d.root.setParent( this._tingCardCont , false ) ;
                this._tingCardCont.addChild(mCardInst.presentation2d.root);

                mCardInst.presentation2d.root.getComponent(UITransform).contentSize = mCardSize;
            }
        }
    }
}

