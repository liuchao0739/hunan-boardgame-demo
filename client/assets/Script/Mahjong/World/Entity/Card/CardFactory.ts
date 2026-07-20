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

import {instantiate, Node, Vec3} from "cc";
import {PrefabMgr} from "../../Support/Prefab";
import {Card, CardPresentation2d, CardPresentation3d} from "./Card";

// 工厂
export class CardFactory {

    public static create(id: string): Card {
        var tile = new Card();
        tile.id = id;

        // this.setPresentation3d( tile ) ;
        return tile;
    }

    // 创建 带有 3D 表现
    public static create3d(id: string): Card {
        var tile = new Card();
        tile.id = id;
        this.setPresentation3d(tile);
        return tile;
    }

    // 创建 带有 2D 表现
    public static create2d(id: string): Card {
        var tile = new Card();
        tile.id = id;
        this.setPresentation2d(tile);
        return tile;
    }

    // 设置 3D 表现
    public static setPresentation3d(card: Card) {
        var pf = PrefabMgr.card.get(card.id);

        if (pf == null) {
            console.log("找不到3D牌显示对象：牌ID：" + card.id);
        }

        card.presentation3d = new CardPresentation3d();
        var root = instantiate(pf);
        card.presentation3d.root = root;
        card.presentation3d.main = root.getChildByPath("Main");

        // 描边
        var pf2 = PrefabMgr.root.getChildByPath("Card/CardOutline");
        var outline = instantiate(pf2);
        outline.setParent(card.presentation3d.main, false);
        outline.position = Vec3.ZERO;
    }

    // 设置 2D 表现
    public static setPresentation2d(card: Card) {
        var pf = PrefabMgr.card2d.get(card.id);
        if (pf == null) {
            console.log("找不到2D牌显示对象：牌ID：" + card.id);
        }
        card.presentation2d = new CardPresentation2d();
        var root = instantiate(pf);
        card.presentation2d.root = root;
    }

    // 设置牌的3D表现--已经存在的牌，不是新创建
    public static setCard3DValue(mCard: Card, mCardID: string): void {
        if (!mCard) {
            console.warn(`牌不存在`);
            return;
        }
        let pf = PrefabMgr.card.get(mCardID);
        if (pf == null) {
            console.log("找不到3D牌显示对象：牌ID：" + mCardID);
            return;
        }
        let mOldPos: Vec3 = mCard.presentation3d.root.position;
        let mOldParent: Node = mCard.presentation3d.root.getParent();
        mCard.presentation3d.root.destroy();
        mCard.presentation3d = new CardPresentation3d();

        // card.presentation3d.root.setParent( player.persentation.seat.handcard , false ) ;
        // var pos = new Vec3( player.gameData.handcard.length * CardInfo.cardSize.x ) ;
        // card.presentation3d.root.position = pos ;

        let root = instantiate(pf);
        mCard.presentation3d.root = root;
        mCard.presentation3d.main = root.getChildByPath("Main");
        mCard.presentation3d.main.eulerAngles = new Vec3(0, 180, 0);
        mCard.presentation3d.root.position = mOldPos;
        mCard.presentation3d.root.setParent(mOldParent, false);
        // console.log("玩家剩余手牌：--11:", root);
        // console.log("mCard:", mCard, "mCardID:", mCardID, "angle:", mCard.presentation3d.main.eulerAngles);
        // // 描边
        // var pf2 = PrefabMgr.root.getChildByPath( "Card/CardOutline" ) ;
        // var outline = instantiate( pf2 ) ;
        // outline.setParent( mCard.presentation3d.main , false ) ;
        // outline.position = Vec3.ZERO ;
    }
}
