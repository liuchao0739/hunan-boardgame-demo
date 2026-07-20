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

import {Label, Node, Sprite} from "cc";
import {UiPopupHelper} from "../../../../framework/utils/UiPopupHelper";
import {NumberRoll} from "../../../../framework/utils/NumberRoll";


// 点数结算。4家的概括信息。
export class UiSettleDianShu {

    public static ins: UiSettleDianShu = null;

    public root: Node;
    public players = new Array<UiSettleDianShuPlayer>();
    public arrows = new Array<UiSettleDianShuArrow>();
    public btnOK: Node;

    public init(node: Node) {

        this.root = node.getChildByPath("SettleAllPlayers");
        this.root.active = false;
        this.btnOK = this.root.getChildByPath("btnOK");

        this.players.push(UiSettleDianShuPlayer.create(this.root.getChildByPath("Player1")));
        this.players.push(UiSettleDianShuPlayer.create(this.root.getChildByPath("Player2")));
        this.players.push(UiSettleDianShuPlayer.create(this.root.getChildByPath("Player3")));
        this.players.push(UiSettleDianShuPlayer.create(this.root.getChildByPath("Player4")));

        this.arrows.push(UiSettleDianShuArrow.create(this.root.getChildByPath("Player1Arrow")));
        this.arrows.push(UiSettleDianShuArrow.create(this.root.getChildByPath("Player2Arrow")));
        this.arrows.push(UiSettleDianShuArrow.create(this.root.getChildByPath("Player3Arrow")));
        this.arrows.push(UiSettleDianShuArrow.create(this.root.getChildByPath("Player4Arrow")));

    }

    public show() {
        UiPopupHelper.show(this.root);

        // 重新开始数字滚动。
        for (let uiplayer of this.players) {

            let n = Number(uiplayer.score.string);
            NumberRoll.exe(uiplayer.score, 2, 0, n);

            n = Number(uiplayer.scoreVariation.string);
            NumberRoll.exe(uiplayer.scoreVariation, 2, 0, n);

        } // end for


    }

    public hide() {
        this.root.active = false;
    }

    public hideAllPlayers() {
        for (let e of this.players) {
            e.root.active = false;
        }
    }

}

// 玩家项
export class UiSettleDianShuPlayer {


    public static create(node: Node): UiSettleDianShuPlayer {

        var ui = new UiSettleDianShuPlayer();
        ui.init(node);
        return ui;
    }

    public root: Node;
    public icon: Sprite;
    public nickname: Label;
    public rank: Label;
    public score: Label;
    public scoreVariation: Label;

    public init(node: Node) {
        this.root = node;

        this.icon = this.root.getChildByPath("Icon/Icon").getComponent(Sprite);
        this.nickname = this.root.getChildByPath("Nickname").getComponent(Label);
        this.nickname.string = "";
        this.rank = this.root.getChildByPath("Rank/val").getComponent(Label);
        this.rank.string = "0";
        this.score = this.root.getChildByPath("Score").getComponent(Label);
        this.score.string = "0";
        this.scoreVariation = this.root.getChildByPath("ScoreVariation").getComponent(Label);
        this.scoreVariation.string = "0";

    }

}

// 箭头
export class UiSettleDianShuArrow {

    public root: Node;
    public arrows = new Map<number, Node>();

    public static create(node: Node): UiSettleDianShuArrow {
        var ui = new UiSettleDianShuArrow();
        ui.init(node);
        return ui;
    }

    public init(node: Node) {
        this.root = node;
        this.root.active = true;
        for (let i = 0; i < this.root.children.length; ++i) {
            var t = this.root.children[i];
            this.arrows.set(Number(t.name), t);
        } // end for

    }

    public hideAllArrows() {
        for (let node of this.arrows.values()) {
            if (node == null) continue;
            node.active = false;
        }

    }

}