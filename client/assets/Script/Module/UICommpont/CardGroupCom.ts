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

import {_decorator, CCInteger, Component, instantiate, Node, Size, UITransform, Vec3} from "cc";
import {Card2d} from "./Card2D";
import {club} from "../../protocols/protocol";

const {ccclass, property} = _decorator;

@ccclass("CardGroupCom")
export class CardGroupCom extends Component {
    @property({type: [CCInteger], tooltip: "手牌数组"})
    public remCards: Array<number> = Array<number>();

    @property({type: Node, tooltip: "卡牌容器"})
    public rootCard: Node;

    @property({type: Node, tooltip: "卡牌模板"})
    public pfCard: Node;

    private pfCardSize: Size;

    private x = 0;

    protected onLoad(): void {
        this.rootCard.removeAllChildren();
        this.pfCardSize = this.pfCard.getComponent(UITransform).contentSize;
        this.updateDate();
    }

    public updateDate(recentHeCard: club.IRecentHeCard = null, winCard?: number): void {
        console.log("============reenthecard:", recentHeCard, "wincard:", winCard);
        this.rootCard.removeAllChildren();
        this.x = 0;
        if (!winCard) {
            winCard = -1;//暗杠后端的副露或者手牌会一张0的牌代表暗杠，会导致后面 0 == winCard的异常
        }
        if (!recentHeCard) return;
        let arr = recentHeCard.RemCards || [];
        // 副露
        if (recentHeCard.Fulus && recentHeCard.Fulus.length) {
            for (let fulu of recentHeCard.Fulus) {
                for (let card of fulu.Cards) {
                    this.addCard(card);
                }
                this.x += 25;
            }
        }

        arr && (this.remCards = arr);
        // 剩余手牌
        let mIsFindWin = false;
        for (let n of this.remCards) {
            if (!mIsFindWin && winCard > 0 && n == winCard) {
                mIsFindWin = true;
                continue;
            }
            this.addCard(n);
        }

        //听牌
        if (winCard > 0) {
            // 添加一个空白，作为分隔
            this.x += 25;
            this.addCard(0x44);

            this.x += 25;
            this.addCard(winCard);
        }
    }

    public addCard(cardId: number, isV = true): void {
        var card = instantiate(this.pfCard).getComponent(Card2d);
        card.cardId = cardId;
        card.updateCard();
        this.rootCard.addChild(card.node);

        let width1 = this.pfCardSize.width;
        let width2 = this.pfCardSize.height;
        let width1Half = width1 / 2;
        let width2Half = width2 / 2;

        if (isV) {
            card.node.position = new Vec3(this.x + width1Half, 0, 0);
            this.x += width1;
        } else {
            card.node.eulerAngles = new Vec3(0, 0, 90);
            card.node.position = new Vec3(this.x + width2Half, (width1Half - width2Half), 0);
            this.x += width2;
        }

    }
}