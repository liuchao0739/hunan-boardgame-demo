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

import {EventTouch, Label, Node, resources, Sprite, SpriteFrame} from "cc";

export class NewBirdGuidePagePref {
    public newGuideIMG: Node;
    public lBtn: Node;
    public rBtn: Node;
    public pageLB: Label;
    /**当前页 */
    private curPage: number;
    private max: number = 9;
    private _node: Node;

    constructor(node: Node) {
        this._node = node;
        this.newGuideIMG = node.getChildByPath("Canvas/newGuideIMG");
        this.lBtn = node.getChildByPath("Canvas/Node/lBtn");
        this.rBtn = node.getChildByPath("Canvas/Node/rBtn");
        this.pageLB = node.getChildByPath("Canvas/Node/pageLB").getComponent(Label);

        this.lBtn.on(Node.EventType.TOUCH_END, this.onLBtn, this);
        this.rBtn.on(Node.EventType.TOUCH_END, this.onRBtn, this);
    }

    public showImg(addValue: number): void {
        if (!addValue) {
            this.curPage = 1;
        }
        let value = this.curPage + addValue;
        if (value < 1) {
            value = 1;
        } else if (value > this.max) {
            value = this.max;
        }
        this.curPage = value;
        this.pageLB.string = `${value}/${this.max}`;
        resources.load(`ui/setting/newbrid_${value}/spriteFrame`, SpriteFrame, (err, data) => {
            this.newGuideIMG.getComponent(Sprite).spriteFrame = data;
        })
    }

    private onLBtn(evt: EventTouch): void {
        this.showImg(-1);
    }

    private onRBtn(evt: EventTouch): void {
        this.showImg(1);
    }

    public set active(b: boolean) {
        this._node.active = b;
    }
}