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
import {ScMapping} from "../../Communication/CardIdMapping";
import {Card} from "../Entity/Card/Card";
import {CardDisplay} from "../Entity/Card/CardDisplay";
import {CardFactory} from "../Entity/Card/CardFactory";
import {Player, PlayerMgr} from "../Entity/Player/Player";
import {SoundEffect} from "../Support/Audio";
import {GameState} from "../Support/GameState";
import {CardInfo, HandcardPersentation} from "../Support/HandcardOp";
import {SettingsData} from "../Support/SettingsDataPresist";
import {tileUtils} from "../Support/tile-utils";
import {HandCtrl} from "./HandCtrl";

// 出牌
export class Discard {

    public static exe(player: Player, cardId: string, isV: boolean, mMoQie: boolean, riichi: boolean): Card {
        // console.log("出牌 cardid:", cardId, "==isv:", isV)
        // console.log("GameState:", GameState)
        // console.log("GameState.ins:", GameState.ins)
        // console.log("GameState.playerLastDiscarded:", GameState.ins.playerLastDiscarded)

        // 记录出牌玩家
        GameState.ins.playerLastDiscarded = player;

        if (player == PlayerMgr.ins.local) {
            return DiscardLocal.exe(player, cardId, isV, mMoQie, riichi);

        }

        return DiscardNonlocal.exe(player, cardId, isV, mMoQie, riichi);

    }

}

// 非本机出牌
export class DiscardNonlocal {

    public static exe(player: Player, cardId: string, isV: boolean, mMoQie: boolean, riichi: boolean): Card {

        // 从手牌中减少
        this.removeCardRnd(player);
        HandcardPersentation.rearrage3d(player);

        // 放置到出牌区
        return DiscardedCardPlace.exe(player, cardId, isV, true, riichi);

    }

    // 随机选择一个手牌
    private static removeCardRnd(player: Player) {

        // 随机选择一个手牌
        let handcard = player.gameData.handcard;
        if (handcard.length == 0) return;
        let idx = Math.floor(Math.random() * handcard.length);
        idx = 0;
        var card = handcard[idx];
        handcard.splice(idx, 1);

        // 删除表现
        card.presentation3d.root.destroy();

    }

}

// 本机出牌
export class DiscardLocal {

    public static exe(player: Player, cardId: string, isV: boolean, mMoQie: boolean, riichi: boolean): Card {

        this.removeCard(player, cardId, mMoQie);
        HandcardPersentation.rearrageLocal(player);
        return DiscardedCardPlace.exe(player, cardId, isV, true, riichi);

    }

    // 玩家删除指定的手牌
    public static removeCard(player: Player, cardId: string, mMoQie: boolean) {

        let handcard = player.gameData.handcard;
        let idx = -1;

        // 1 自动模切状态下，选择最后的牌，刚摸到手的，从后往前找
        // 2 托管状态下，进入自动模切，选择最后的牌，刚摸到手的，从后往前找
        // 3 立直后，自动模切状态
        // 4 倒计时结束出的牌，也是模切牌，从后往前找
        if (mMoQie || SettingsData.ins.isAutoMoQie || SettingsData.ins.isTrustee || SettingsData.ins.isLizhi) {
            for (let mi = handcard.length - 1; mi >= 0; mi--) {
                if (handcard[mi].id == cardId) {
                    idx = mi;
                    break;
                }
            }
        }

        // console.log("模切：", mMoQie, "idx:", idx, "handcard:", ...handcard);
        // 再查找选中的
        if (idx == -1) {
            idx = handcard.findIndex((e) => {
                    return e.presentation2d.root.position.y > 5 && e.id == cardId
                }
            );
        }

        if (idx == -1) {
            idx = handcard.findIndex((e) => {
                return e.id == cardId;
            });
        }
        if (idx == -1) {
            // 无此手牌
            return;
        }
        // let card = handcard[ idx ] ;
        // handcard.splice( idx , 1 ) ;

        let card = null;
        card = handcard[idx];
        handcard.splice(idx, 1);

        // 删除显示
        card.presentation2d?.root.destroy();

    }

}

// 出牌区牌的放置。
export class DiscardedCardPlace {

    // 把牌放置到出牌区
    public static exe(player: Player, cardId: string, isV: boolean, anim = true, riichiEffect: boolean = false): Card {

        let card = CardFactory.create3d(cardId);
        var discard = player.gameData.discard;
        discard.push(card);

        // 显示倒放的牌
        if (isV) {
            CardDisplay.showLie(card);
        } else {
            CardDisplay.showLieAnticlockwise90(card);
        }

        // 宝牌特效
        if (tileUtils.isDoraTile(ScMapping.cardId_c2s(cardId))) {
            CardDisplay.showCardFlash(card);
        } else {
            CardDisplay.removeCardFlash(card);
        }

        let discarded = player.persentation.seat.discarded;
        card.presentation3d.root.setParent(discarded, false);
        card.presentation3d.root.position = this.calcPos(discard, discard.length - 1);
        // card.presentation3d.root.active = false ;

        // 随机旋转
        var ea = card.presentation3d.main.eulerAngles.clone();
        // y轴随机旋转角度
        // ea.y += ( math.random() * 6 ) - 3  ;
        card.presentation3d.main.eulerAngles = ea;

        CardDisplay.removeCardRiichiEffect(card);

        // 动画
        if (anim) {
            card.presentation3d.root.active = false;
            HandCtrl.discard(player, card.presentation3d.root.worldPosition, () => {
                card.presentation3d.root.active = true;

                if (riichiEffect) {
                    CardDisplay.showCardRiichiEffect(card);

                    SoundEffect.riichi();
                }

                SoundEffect.discard();
            });
        }


        return card;
    }

    // 取得出牌区位置
    public static calcPos(cards: Array<Card>, idx: number): Vec3 {

        var intervalX = 0.007;
        var intervalY = 0.013;

        // 算出坐标
        var y = Math.floor(idx / 6);
        var x = Math.floor(idx % 6);

        var pos = new Vec3();
        pos.x = x * CardInfo.cardSize.x;
        pos.z = y * (CardInfo.cardSize.z + intervalY);

        // 一行元素的下标范围 ( idx1 , idx2 ]
        var idx1 = y * 6;
        var idx2 = (y + 1) * 6;
        if (idx2 >= cards.length) {
            idx2 = cards.length;
        }

        // 左边缘对齐
        var count1 = 0, count2 = 0;   // 一行中竖放和横放牌的数量
        for (var i = idx1; i < idx; ++i) {
            var card = cards[i];
            if (this.isV(card)) {
                count1++
            } else {
                count2++;
            }

        }
        // console.log("count1:", count1, "count2:", count2, "intervalX:", intervalX);
        var x = count1 * (CardInfo.cardSize.x + intervalX) + count2 * (CardInfo.cardSize.z + intervalX);

        var card = cards[idx];
        var isV = this.isV(card);
        // console.log("isV:", isV)
        if (isV) {
            pos.x = x + CardInfo.cardSize.x / 2
        } else {
            pos.x = x + CardInfo.cardSize.z / 2;
        }

        // console.log("[posx]:", pos.x, "posY:", pos.y, "posZ:", pos.z);
        return pos;

    }

    // 判断一个牌是躺竖还是躺横
    public static isV(card: Card): boolean {

        var eaY = card.presentation3d.main.eulerAngles.y;
        if ((180 - eaY) < 30) return true;
        return false;

        if (card.presentation3d.main.eulerAngles.equals3f(0, 180, 0)) {
            return true;
        } else if (card.presentation3d.main.eulerAngles.equals3f(0, -90, 0)) {
            return false;
        }

    }

    public static updateDoraFlashEffect(player: Player): void {
        player.gameData.discard.forEach(tile => {
            const isDoraTile = tileUtils.isDoraTile(ScMapping.cardId_c2s(tile.id));

            if (isDoraTile) {
                CardDisplay.showCardFlash(tile);
            } else {
                CardDisplay.removeCardFlash(tile);
            }
        });
    }

    public static showWinningEffect(player: Player, cardID: string): boolean {
        const discards = player.gameData.discard;
        const card = discards[discards.length - 1];

        if (card?.id !== cardID) {
            console.error(`牌河未找到和牌对应的牌子"${cardID}"`);
            return false;
        }

        CardDisplay.showCardWinningEffect(card);

        return true;
    }

}
