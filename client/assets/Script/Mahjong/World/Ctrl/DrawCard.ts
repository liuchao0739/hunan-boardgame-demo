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

import {Color, Sprite, tween, UITransform, Vec3} from "cc";
import {ScMapping} from "../../Communication/CardIdMapping";
import {UiMain} from "../../Ui/Main/UiMain";
import {Card} from "../Entity/Card/Card";
import {CardDisplay} from "../Entity/Card/CardDisplay";
import {CardFactory} from "../Entity/Card/CardFactory";
import {Player} from "../Entity/Player/Player";
import {CardInfo} from "../Support/HandcardOp";
import {PrefabMgr} from "../Support/Prefab";
import {tileUtils} from "../Support/tile-utils";

/*
    抓牌 非本机。手牌最右边出现一张牌，间隔一个牌的距离。打完牌后，整理手牌
*/
export class DrawCardNonlocal {

    public static exe(player: Player, cardId: string): Card {

        var card = CardFactory.create3d(cardId);
        player.gameData.handcard.push(card);

        card.presentation3d.root.setParent(player.persentation.seat.handcard, false);
        var pos = new Vec3(player.gameData.handcard.length * CardInfo.cardSize.x);
        card.presentation3d.root.position = pos;

        CardDisplay.showStand(card);

        return card;
    }
}

// 抓牌 本机。
export class DrawCardLocal {

    public static exe(player: Player, cardId: string, anim = true): Card {
        // console.log("cardID:", cardId);
        var card = CardFactory.create2d(cardId);
        player.gameData.handcard.push(card);

        const tileValue = ScMapping.cardId_c2s(cardId);

        if (tileUtils.isDoraTile(tileValue)) {
            CardDisplay.showCardUIFlash(card);
        } else {
            CardDisplay.removeCardUIFlash(card);
        }

        card.presentation2d.root.setParent(UiMain.ins.localHandcard, false);

        let width = PrefabMgr.card2d.get("tiao1").getComponent(UITransform).contentSize.width;
        card.presentation2d.root.position = new Vec3((player.gameData.handcard.length - 0.6) * width, 0, 0);

        if (anim) {
            this.showAppearAnim(card);
        }
        return card;
    }

    // 显示出牌出现动画
    public static showAppearAnim(card: Card) {
        let root = card.presentation2d.root;

        // 从上掉落
        let pos = root.position.clone();
        root.position = pos.clone().add(new Vec3(0, 50, 0));
        tween(root).to(0.3, {position: pos}).start();

        // 牌渐变显示
        let spr = root.getComponent(Sprite);
        spr.color = new Color(255, 255, 255, 0);
        let t = tween(spr.color.clone()).to(0.3, {a: 255}, {
            onUpdate: (target: any) => {
                if (spr.isValid == false) {
                    t.stop();
                    return;
                }
                spr.color = target;
            }
        }).start();
    }

}