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

import {Card} from "../Card/Card";
import {CardFactory} from "../Card/CardFactory";
import {CardSort} from "../Card/CardSort";
import {CardShown, CardShownType} from "./CardShown";

export class CardShownFactory {

    /*
        创建 吃。
        cardIds 去吃的牌。
        CardId 被吃的牌。
        顺序：被吃的牌，2张自己的（从小到大）

    */
    public static createChi(cardIds: Array<string>, cardId: string): CardShown {

        var cardShown = new CardShown();
        cardShown.type = CardShownType.Chi;

        for (var id of cardIds) {
            cardShown.cards.push(CardFactory.create3d(id));
        }
        CardSort.exe(cardShown.cards);

        cardShown.cards.unshift(CardFactory.create3d(cardId));

        return cardShown;
    }

    // 创建 吃
    public static createChi2(cardIds: Array<string>, card: Card): CardShown {

        var cardShown = new CardShown();
        cardShown.type = CardShownType.Chi;

        for (var id of cardIds) {
            cardShown.cards.push(CardFactory.create3d(id));
        }
        CardSort.exe(cardShown.cards);

        cardShown.cards.unshift(card);

        return cardShown;
    }

    // 创建 碰
    public static createPeng(type: CardShownType, cardIds: Array<string>) {

        var cardShown = new CardShown();
        cardShown.type = type;
        for (var id of cardIds) {
            cardShown.cards.push(CardFactory.create3d(id));
        }

        return cardShown;
    }

    // 创建 杠
    public static createGang(type: CardShownType, cardIds: Array<string>) {

        var cardShown = new CardShown();
        cardShown.type = type;
        for (var id of cardIds) {
            cardShown.cards.push(CardFactory.create3d(id));
        }

        return cardShown;
    }
}