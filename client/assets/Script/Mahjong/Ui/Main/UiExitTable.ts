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

import {Node} from "cc";
import {CommSend} from "../../Communication/CommSend";

export class UiExitTable {
    public root: Node = null;
    public btnClose: Node | null = null;
    public btnOk: Node | null = null;
    public btnNo: Node | null = null;

    public init(node: Node) {
        this.root = node;
        this.btnClose = node.getChildByPath("btnClose");
        this.btnOk = node.getChildByPath("btnOk");
        this.btnNo = node.getChildByPath("btnNo");

        this.btnClose.on(Node.EventType.TOUCH_END, this._onCloseTouch, this);
        this.btnOk.on(Node.EventType.TOUCH_END, this._onOkTouch, this);
        this.btnNo.on(Node.EventType.TOUCH_END, this._onNoTouch, this);
    }

    private _onCloseTouch(): void {
        this.hide();
    }

    private _onOkTouch(): void {
        CommSend.exitRoom();
        this.hide();
    }

    private _onNoTouch(): void {
        this.hide();
    }

    public show(): void {
        this.root.active = true;
    }

    public hide(): void {
        this.root.active = false;
    }

}

