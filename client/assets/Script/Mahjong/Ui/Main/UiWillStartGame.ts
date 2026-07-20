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

import {Node, Tween, tween, Vec3} from "cc";

export class UiWillStartGame {
    private _root: Node = null;
    private _leftND: Node | null = null;
    private _rightND: Node | null = null;
    private _btnEnter: Node | null = null;

    public init(mNode: Node) {
        this._root = mNode;
        // this._btnEnter = mNode.getChildByPath("bg/btnEnter");
        // this._btnEnter.on(Node.EventType.TOUCH_END,  this._onEnterTouch, this);
        this._leftND = mNode.getChildByPath("leftND");
        this._rightND = mNode.getChildByPath("rightND");
    }

    private _onEnterTouch(): void {
        this.hide();
    }

    public show(): void {
        this._root.active = true;
        this._startAnim();
    }

    private _startAnim(): void {
        this._leftND.active = true;
        this._rightND.active = true;
        Tween.stopAllByTarget(this._leftND);
        Tween.stopAllByTarget(this._rightND);
        this._leftND.position = new Vec3(0, 0, 0);
        tween(this._leftND).delay(0.5).to(1, {position: new Vec3(-640, 0, 0)}).call(function () {
            this._leftND.active = false;
        }.bind(this)).start();
        this._rightND.position = new Vec3(0, 0, 0);
        tween(this._rightND).delay(0.5).to(1, {position: new Vec3(640, 0, 0)}).call(function () {
            this._rightND.active = false;
        }.bind(this)).start();
    }

    public hide(): void {
        this._root.active = false;
    }
}
