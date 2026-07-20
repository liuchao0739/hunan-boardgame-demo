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

import {CardShownDisplay} from "../../Entity/CardShown/CardShownDisplay";
import {CardShownFactory} from "../../Entity/CardShown/CardShownFactory";
import {Player} from "../../Entity/Player/Player";
import {HandcardOp} from "../../Support/HandcardOp";
import {HandCtrl} from "../HandCtrl";
import {SoundEffect} from "../../Support/Audio";


// 吃的操作
export class OpChi {

    // player 操作者。cardIds 操作者去吃的牌。player2 被吃者。cardId 被吃的牌
    public static exe(player: Player, cardIds: Array<string>, player2: Player, cardId: string) {

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


        // 从手牌中移除牌
        HandcardOp.remove(player, cardIds);

        var cardShown = CardShownFactory.createChi(cardIds, cardId);
        player.gameData.cardShown.push(cardShown);

        CardShownDisplay.exe(player);

        HandCtrl.cardShown(player, cardShown);
        SoundEffect.chi();

    }

}

// 吃的类型

export enum ChiType {

    None,

    // 左吃。被吃的牌排列在左边。45 去吃 3
    Left,

    // 中吃
    Middle,

    // 右吃
    Right,

}

export class ChiHelper {

    // 取得去吃的牌的ID。
    public static getCardIdsToChi(type: ChiType, cardId: string): Array<string> {

        var len = cardId.startsWith("wan") ? 3 : 4;
        var str = cardId.substring(0, len);
        var n = Number(cardId.charAt(len));
        var n1 = -1, n2 = -1;
        if (type == ChiType.Left) {
            n1 = n + 1;
            n2 = n + 2;
        } else if (type == ChiType.Middle) {
            n1 = n - 1;
            n2 = n + 1;
        } else if (type == ChiType.Right) {
            n1 = n - 2;
            n2 = n - 1;
        }

        // console.log("chi type:", type, "cardid:", cardId, "str:", str, "n:", n, "n1:", n1, "n2:", n2);
        if (n1 >= 10 || n1 <= 0) {
            console.log("吃牌错误：" + "类型：" + type.toString() + "CardId：" + cardId);
        }

        var cardIds = new Array<string>();
        cardIds.push(str + n1);
        cardIds.push(str + n2);
        return cardIds;
    }

}