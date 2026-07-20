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

import {instantiate, Node, Prefab, resources, Sprite} from "cc";

// 预制管理器
export class PrefabMgr {

    public static root: Node = null;

    // 麻将牌
    public static card: Map<string, Node> = null;
    // 麻将牌的阴影 立起
    public static cardShadowStand: Node = null;
    // 麻将牌的阴影 倒伏
    public static cardShadowLie: Node = null;
    // 描边的模型
    // public static CardOutline : Node = null ;

    // 牌 2D
    public static card2d: Map<string, Node> = null;

    public static playerIcon: Map<string, Sprite> = null;

    // 吃、碰、杠、和的箭头指示标志
    public static cardArrow: Node = null;
    // 吃、碰、杠、和的高亮标志
    public static cardBackLight: Node = null;

    // 宝牌闪光
    public static cardFlash: Node = null;
    // 立直特效
    public static cardRiichiEffect: Node = null;
    // 和牌特效
    public static cardWinningEffect: Node = null;

    public static init(onComplete: () => void) {
        resources.load("Prefab", Prefab, (err, data) => {
            console.log("加载预制体完成");
            this.root = instantiate(data);

            this.card = new Map<string, Node>();
            this.map(this.root.getChildByPath("Card/tiao"), this.card);
            this.map(this.root.getChildByPath("Card/tong"), this.card);
            this.map(this.root.getChildByPath("Card/wan"), this.card);
            this.map(this.root.getChildByPath("Card/zi"), this.card);

            this.cardShadowStand = this.root.getChildByPath("Card/ShadowStand");
            this.cardShadowLie = this.root.getChildByPath("Card/ShadowLie");

            this.card2d = new Map<string, Node>();
            this.map(this.root.getChildByPath("Card2d"), this.card2d);

            this.playerIcon = new Map<string, Sprite>();
            this.map2(this.root.getChildByPath("PlayerIcon"), this.playerIcon);

            this.cardArrow = this.root.getChildByPath("Card/CardArrow");
            this.cardBackLight = this.root.getChildByPath("Card/CardBacklight");

            this.cardFlash = this.root.getChildByPath("Card/CardFlash");
            this.cardRiichiEffect = this.root.getChildByPath("Card/RiichiEffect");
            this.cardWinningEffect = this.root.getChildByPath("Card/WinningEffect");

            onComplete();

        });
    }

    public static map2(node: Node, map: Map<string, Sprite>) {
        for (let child of node.children) {
            map.set(child.name, child.getComponent(Sprite));
        } // end for
    }

    // 加入子节点 非遍历
    public static map(node: Node, map: Map<string, Node>) {
        for (let child of node.children) {
            map.set(child.name, child);
        } // end for
    }

}
