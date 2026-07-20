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

import {Color, Sprite, Tween, tween, Vec3} from "cc";
import {ScMapping} from "../../Communication/CardIdMapping";
import {Card} from "../Entity/Card/Card";
import {CardAnim} from "../Entity/Card/CardAnim";
import {CardDisplay} from "../Entity/Card/CardDisplay";
import {CardFactory} from "../Entity/Card/CardFactory";
import {CardSort} from "../Entity/Card/CardSort";
import {Player} from "../Entity/Player/Player";
import {HandcardPersentation} from "../Support/HandcardOp";

// 开局 手牌 非本机
export class FirstDrawHandcardNonlocal {

    public static exe(player: Player, count = 13, anim: boolean = true) {
        let cards = this.createCards(count);
        player.gameData.handcard = cards;
        HandcardPersentation.setCardsPos3d(player);
        if (anim) {
            this.playAppearAnim(cards);
        }
        // 躺着的坐标 ( 0 , 0.01 , 0 )。原点在底部。立着的坐标。( 0 , 0.021 , 0 )
    }

    private static createCards(count = 13) {
        let cards = new Array<Card>();
        for (let i = 0; i < count; ++i) {
            var card = CardFactory.create3d("tiao1");
            cards.push(card);
            CardDisplay.showStand(card);
        } // end for
        return cards;
    }

    // 播放出现动画
    private static playAppearAnim(cards: Array<Card>) {
        // console.log("cards:", cards)
        var t = tween(this);
        for (let i = 0; i < cards.length; i += 4) {
            for (let k = i; k < i + 4 && k < cards.length; ++k) {
                t.call(() => {
                    let card = cards[k];
                    // console.log("k:", k, "card:", card);
                    if (card) {
                        card.presentation3d.root.active = true;
                        CardAnim.lieBackToStand(card);
                    }
                });
            }
            t.delay(0.5);
        } // end for
        t.start();
    }

    // 展示手中剩余牌
    // mCardArr:玩家手中牌 player.gameData.handcard
    // mCardIDArr:每张牌对应的牌值
    public static showHandCard(mCardArr: Card[], mCardIDArr: number[]): void {
        // console.log("玩家剩余手牌：--1:", mCardArr, "val:", mCardIDArr);
        let mArrLen: number = mCardArr.length;
        if (mCardIDArr.length < mCardArr.length) {
            mArrLen = mCardIDArr.length;
        }
        for (let mi = 0; mi < mArrLen; mi++) {
            CardFactory.setCard3DValue(mCardArr[mi], ScMapping.cardId_s2c(mCardIDArr[mi]));
        }
    }

}

// 开局 手牌 本机
export class FirstDrawHandcardLocal {

    public static isComplete = false;
    public static onComplete = new Array<() => void>();

    public static exe(player: Player, ids?: Array<string>, anim: boolean = true) {
        // console.log("玩家手牌player hand card:", ...player.gameData.handcard);
        // console.log("anim:", anim);
        this.isComplete = false;

        if (ids != null) {
            this.createCards(ids, player.gameData.handcard);
        }
        let cards = player.gameData.handcard;

        HandcardPersentation.updateDoraFlashEffectLocal();
        CardSort.exe(cards);
        HandcardPersentation.setCardsPosLocal(cards);
        if (anim) {
            this.playAppearAnim(cards);
        }
    }

    // 创建牌
    private static createCards(ids: Array<string>, cards: Array<Card>) {
        cards.splice(0, cards.length);
        for (let i = 0; i < ids.length; ++i) {
            let card = CardFactory.create2d(ids[i]);
            cards.push(card);

        } // end for
    }

    // 播放出现动画
    private static playAppearAnim(cards: Array<Card>) {
        // console.log("玩家手牌player appear anim:")
        // tween( cards[ 6 ].presentation2d.root ).to( 0.3 , { position : Vec3.ZERO } ).start() ;
        // return ;

        // 先隐藏 后逐步出现
        for (let card of cards) {
            card.presentation2d.root.active = false;
        }

        Tween.stopAllByTarget(this);
        var t = tween(this);
        for (let i = 0; i < cards.length; i += 4) {
            for (let k = i; k < i + 4 && k < cards.length; ++k) {
                t.call(() => {
                    let card = cards[k];
                    if (card) {
                        let root = card.presentation2d.root;
                        root.active = true;

                        // 从上掉落
                        let pos = root.position.clone();
                        root.position = pos.clone().add(new Vec3(0, 50));
                        tween(root).to(0.3, {position: pos}).start();

                        // 牌渐变显示
                        let spr = root.getComponent(Sprite);
                        if (spr) {
                            spr.color = new Color(255, 255, 255, 0);
                            tween(spr.color.clone()).to(0.3, {a: 255}, {
                                onUpdate: (target: any) => {
                                    if (spr && spr.color) {
                                        spr.color = target;
                                    }
                                }
                            }).start();
                        }
                    }


                });
            }
            t.delay(0.5);
        } // end for
        t.call(() => {
            this.isComplete = true;
            for (let fn of this.onComplete) {
                fn();
            }

        });
        t.start();
    }

    public static stopTweenAnim(): void {
        Tween.stopAllByTarget(this);
    }

}
