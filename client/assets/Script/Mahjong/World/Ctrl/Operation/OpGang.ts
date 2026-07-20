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

import {CardFactory} from "../../Entity/Card/CardFactory";
import {CardShownType} from "../../Entity/CardShown/CardShown";
import {CardShownDisplay} from "../../Entity/CardShown/CardShownDisplay";
import {CardShownFactory} from "../../Entity/CardShown/CardShownFactory";
import {Player} from "../../Entity/Player/Player";
import {SoundEffect} from "../../Support/Audio";
import {HandcardOp} from "../../Support/HandcardOp";
import {RelativeOrien, RelativeOrienCalc} from "../../Support/RelativeOrien";
import {HandCtrl} from "../HandCtrl";


export class OpGang {

    // 明杠
    public static exe(player: Player, cardId: string, player2: Player) {

        // 取出玩家打出的最后一张牌
        if (player2 != null) {
            var discard = player2.gameData.discard;
            var card = discard[discard.length - 1];
            discard.splice(discard.length - 1, 1);
            // 销毁
            card.presentation3d.root.destroy();
        }


        // 从手牌中移除牌。明杠只用剔除3张
        HandcardOp.remove(player, [cardId, cardId, cardId]);

        var type = CardShownType.None;
        var relativeOrien = RelativeOrienCalc.get(player.gameData.seatOrien, player2.gameData.seatOrien);
        if (relativeOrien == RelativeOrien.Previous) {
            type = CardShownType.GangPrevious
        } else if (relativeOrien == RelativeOrien.Opposite) {
            type = CardShownType.GangOpposite
        } else if (relativeOrien == RelativeOrien.Next) {
            type = CardShownType.GangNext
        }

        // 创建明牌
        var cardIds = [cardId, cardId, cardId, cardId];
        var cardShown = CardShownFactory.createGang(type, cardIds);
        player.gameData.cardShown.push(cardShown);

        CardShownDisplay.exe(player);
        HandCtrl.cardShown(player, cardShown);

        SoundEffect.gang();
    }

    // 暗杠
    public static dark(player: Player, cardId: string) {

        var ids = [cardId, cardId, cardId, cardId];

        // 从手牌中移除牌
        HandcardOp.remove(player, ids);

        // 创建明牌
        var cardShown = CardShownFactory.createGang(CardShownType.GangDark, ids);
        player.gameData.cardShown.push(cardShown);

        CardShownDisplay.exe(player);
        HandCtrl.cardShown(player, cardShown);

        SoundEffect.gang();

    }

    // 补杠
    public static patch(player: Player, cardId: string) {

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

}