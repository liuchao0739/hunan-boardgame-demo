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

import {Vec3} from "cc";
import {ScMapping} from "../../../Communication/CardIdMapping";
import {CardInfo} from "../../Support/HandcardOp";
import {tileUtils} from "../../Support/tile-utils";
import {Card} from "../Card/Card";
import {CardDisplay} from "../Card/CardDisplay";
import {Player} from "../Player/Player";
import {CardShown, CardShownType} from "./CardShown";

const SPACING = 0.004;

// 明牌展示
export class CardShownDisplay {

    public static exe(player: Player) {

        var offset = 0;
        for (var cardShown of player.gameData.cardShown) {

            this.show(cardShown);

            this.addOffset(cardShown.cards, offset);
            offset += -this.getWidth(cardShown.type);

            // 设置父节点
            var parent = player.persentation.seat.shown;
            for (var card of cardShown.cards) {
                card.presentation3d.root.setParent(parent, false);
            }

        } // end for

    }

    public static show(cardShown: CardShown) {

        switch (cardShown.type) {
            case CardShownType.Chi: {
                this.showChi(cardShown);
            }
                break;

            case CardShownType.PengPrevious:
            case CardShownType.PengOpposite:
            case CardShownType.PengNext: {
                this.showPeng(cardShown);
            }
                break;

            case CardShownType.GangPrevious:
            case CardShownType.GangOpposite:
            case CardShownType.GangNext: {
                this.showGang(cardShown);
            }
                break;

            case CardShownType.GangDark: {
                this.showGangDark(cardShown);
            }
                break;

            case CardShownType.PengPreviousGang:
            case CardShownType.PengOppositeGang:
            case CardShownType.PengNextGang: {
                this.showGangPatch(cardShown);
            }
                break;
        }

    }

    // 吃
    public static showChi(cardShown: CardShown) {

        this.showH(cardShown.cards, 0);

    }

    // 碰
    public static showPeng(cardShown: CardShown) {

        var type = cardShown.type;
        var idx = -1;
        if (type == CardShownType.PengPrevious) {
            idx = 0
        } else if (type == CardShownType.PengOpposite) {
            idx = 1
        } else if (type == CardShownType.PengNext) {
            idx = 2
        }

        this.showH(cardShown.cards, idx);
    }

    // 杠
    public static showGang(cardShown: CardShown) {

        var type = cardShown.type;
        var idx = -1;
        if (type == CardShownType.GangPrevious) {
            idx = 0
        } else if (type == CardShownType.GangOpposite) {
            idx = 1
        } else if (type == CardShownType.GangNext) {
            idx = 3
        }

        this.showH(cardShown.cards, idx);
    }

    // 暗杠
    public static showGangDark(cardShown: CardShown) {

        // 全部摆正
        this.showH(cardShown.cards, -1);

        CardDisplay.showLieBack(cardShown.cards[0]);
        CardDisplay.showLieBack(cardShown.cards[3]);
    }

    // 补杠
    public static showGangPatch(cardShown: CardShown) {

        var idx = -1;
        if (cardShown.type == CardShownType.PengPreviousGang) {
            idx = 0;
        } else if (cardShown.type == CardShownType.PengOppositeGang) {
            idx = 1;
        } else if (cardShown.type == CardShownType.PengNextGang) {
            idx = 2;
        }

        this.showH(cardShown.cards.slice(0, 3), idx);

        var card = cardShown.cards[3]
        var card2 = cardShown.cards[idx];
        CardDisplay.showLieAnticlockwise90(card);
        card.presentation3d.root.position = card2.presentation3d.root.position.clone().add(new Vec3(0, 0, -CardInfo.cardSize.x));
    }

    // 显示一组牌。idx 横放的牌
    public static showH(cards: Array<Card>, idx: number) {
        //
        var offset = 0;
        // 碰后加杠 把加杠的牌放在横的牌上面
        for (var i = cards.length - 1; i >= 0; --i) {

            var card = cards[i];

            // 宝牌特效
            if (tileUtils.isDoraTile(ScMapping.cardId_c2s(card.id))) {
                CardDisplay.showCardFlash(card);
            } else {
                CardDisplay.removeCardFlash(card);
            }

            if (i == idx) {
                // 横放
                CardDisplay.showLieAnticlockwise90(card);
                card.presentation3d.root.position = new Vec3(offset - CardInfo.cardSize.z / 2 - SPACING, 0, 0);
                // 下一个位置
                offset -= (CardInfo.cardSize.z + SPACING);
                continue;
            }

            CardDisplay.showLie(card);
            card.presentation3d.root.position = new Vec3(offset - CardInfo.cardSize.x / 2 - SPACING, 0, 0);
            offset -= (CardInfo.cardSize.x + SPACING);
        }
    }

    // 取得显示宽度
    public static getWidth(type: CardShownType): number {

        switch (type) {

            case CardShownType.Chi:
            case CardShownType.PengNext:
            case CardShownType.PengNextGang:
            case CardShownType.PengOpposite:
            case CardShownType.PengOppositeGang:
            case CardShownType.PengPrevious:
            case CardShownType.PengPreviousGang: {
                return CardInfo.cardSize.x * 2 + CardInfo.cardSize.z + SPACING * 3;
            }
                break;

            case CardShownType.GangNext:
            case CardShownType.GangOpposite:
            case CardShownType.GangPrevious: {
                return CardInfo.cardSize.x * 3 + CardInfo.cardSize.z + SPACING * 4;
            }
                break;

            case CardShownType.GangDark: {
                return CardInfo.cardSize.x * 4 + SPACING * 4;
            }

        }

        return 0;
    }

    // 加上一个X偏移量
    public static addOffset(cards: Array<Card>, offset: number) {

        for (var card of cards) {
            card.presentation3d.root.position = card.presentation3d.root.position.add(new Vec3(offset, 0, 0));
        } // end for

    }

    public static updateDoraFlashEffect(player: Player): void {
        player.gameData.cardShown.forEach(meld => {
            meld.cards.forEach(tile => {
                const isDoraTile = tileUtils.isDoraTile(ScMapping.cardId_c2s(tile.id));

                if (isDoraTile) {
                    CardDisplay.showCardFlash(tile);
                } else {
                    CardDisplay.removeCardFlash(tile);
                }
            });
        });
    }

}