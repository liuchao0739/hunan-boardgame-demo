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

import {isValid, Size, tween, UITransform, Vec3} from "cc";
import {ScMapping} from "../../Communication/CardIdMapping";
import {UiMain} from "../../Ui/Main/UiMain";
import {Card} from "../Entity/Card/Card";
import {CardDisplay} from "../Entity/Card/CardDisplay";
import {CardSort} from "../Entity/Card/CardSort";
import {Player, PlayerMgr} from "../Entity/Player/Player";
import {PrefabMgr} from "./Prefab";
import {tileUtils} from "./tile-utils";

// 手牌操作
export class HandcardOp {

    // 在手牌中删除，销毁牌实体。
    public static remove(player: Player, cardIds: Array<string>) {

        if (player == PlayerMgr.ins.local) {
            //  本机
            this.removeLoacl(player, cardIds);
            return;
        }

        // 非本机
        this.removeRnd3d(player, cardIds);

    }

    // 本机删除。销毁牌实体。
    public static removeLoacl(player: Player, cardIds: Array<string>) {
        var handcard = player.gameData.handcard;
        for (var i = 0; i < cardIds.length; ++i) {
            var id = cardIds[i];
            var idx = handcard.findIndex((e) => {
                return e.id == id;
            });
            if (idx != -1) {
                // 销毁表现
                handcard[idx].presentation2d.root.destroy();
                handcard.splice(idx, 1);
            }
        } // end for

        HandcardPersentation.rearrageLocal(player);

    }

    // 随机找2个位置删除。销毁牌实体。
    public static removeRnd3d(player: Player, cardIds: Array<string>) {

        var handcard = player.gameData.handcard;
        // 随机找2个位置删除
        var idx = Math.floor(Math.random() * (handcard.length - cardIds.length));
        var del = handcard.splice(idx, cardIds.length);
        for (var card of del) {
            // 销毁表现
            card.presentation3d.root.destroy();
        }

        HandcardPersentation.rearrage3d(player);

    }

    // 是否拥有指定的手牌。数量匹配。
    public static has(player: Player, cardIds: Array<string>): Boolean {

        var list = cardIds.slice();
        var handcard = player.gameData.handcard;

        for (var card of handcard) {
            var idx = list.indexOf(card.id);
            if (idx == -1) continue;

            list.splice(idx, 1);
            if (list.length == 0) {
                return true;
            }

        } // end for

        return false;
    }

}

// 手牌表现
export class HandcardPersentation {

    // 排列间隔
    public static interval = 0.002;

    // 设置手牌每张牌的位置。3D
    public static setCardsPos3d(player: Player) {

        // 显示父节点
        var parent = player.persentation.seat.handcard;

        var cards = player.gameData.handcard;

        for (let i = 0; i < cards.length; ++i) {
            var card = cards[i];
            card.presentation3d.root.setParent(parent);
            card.presentation3d.root.setPosition(new Vec3(i * (CardInfo.cardSize.x + this.interval)));

            // 初始化
            // card.presentation3d.root.active = false ;

        } // end for

    }

    // 设置手牌每张牌的位置。本机2D。最后一个视为摸到的牌
    public static setCardsPosLocal(cards: Array<Card>) {

        let width = PrefabMgr.card2d.get("tiao1").getComponent(UITransform).contentSize.width;
        for (let i = 0; i < cards.length; ++i) {
            let card = cards[i];
            let root = card.presentation2d.root;
            root.getComponent(UITransform).contentSize.width;
            root.setParent(UiMain.ins.localHandcard);
            root.position = new Vec3(i * width, 0, 0);
            // root.active = false ;

        } // end for

    }

    // 手牌显示对其 3D 空间。缓动移动
    public static rearrage3d(player: Player) {

        let handcard = player.gameData.handcard;
        for (let i = 0; i < handcard.length; ++i) {
            let card = handcard[i];
            let root = card.presentation3d.root;
            if (root == null || isValid(root, true) == false) {
                let a = 1;
            }
            tween(root).to(0.2, {position: new Vec3(i * (CardInfo.cardSize.x + this.interval))}).start();

        }

    }

    // 手牌显示对其 本机 2D。缓动移动
    public static rearrageLocal(player: Player) {

        let handcard = player.gameData.handcard;

        // 排序
        CardSort.exe(handcard);

        let interval = PrefabMgr.card2d.get("tiao1").getComponent(UITransform).contentSize.width;

        for (let i = 0; i < handcard.length; ++i) {
            let card = handcard[i];
            let pos = new Vec3(i * interval, 0, 0);
            // card.presentation2d.root.position = pos ;
            tween(card.presentation2d.root).to(0.3, {position: pos}).start();
        } // end for

    }

    public static updateDoraFlashEffectLocal(): void {
        const tiles = PlayerMgr.ins.local.gameData.handcard;

        // 宝牌特效
        tiles.forEach(tile => {
            const tileValue = ScMapping.cardId_c2s(tile.id);

            if (tileUtils.isDoraTile(tileValue)) {
                CardDisplay.showCardUIFlash(tile);
            } else {
                CardDisplay.removeCardUIFlash(tile);
            }
        });
    }

}

// 3D 牌模型信息
export class CardInfo {

    // 模型大小。躺着
    public static cardSize: Vec3 = null;
    // 2D 手牌大小 。
    public static cardSize2d: Size = null;

    public static init() {
        this.cardSize = PrefabMgr.root.getChildByPath("Card/Size").scale;
        this.cardSize2d = PrefabMgr.card2d.get("tiao1").getComponent(UITransform).contentSize;
    }

}
