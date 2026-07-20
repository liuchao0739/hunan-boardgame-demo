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

import {_decorator, Component, Label, Node} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('MailItemUI')
export class MailItemUI extends Component {

    // 打开状态
    private _iconOnND: Node | null = null;
    // 关闭状态
    private _iconOffND: Node | null = null;
    private _dateLB: Label | null = null;
    private _newIcon: Node | null = null;

    onLoad() {
        this._iconOnND = this.node.getChildByPath("iconOn");
        this._iconOffND = this.node.getChildByPath("iconOff")
        this._dateLB = this.node.getChildByPath("dateLB").getComponent(Label);
        this._newIcon = this.node.getChildByPath("newIcon");

        this.node.on(Node.EventType.TOUCH_END, this._onNodeTouch, this)
    }

    private _onNodeTouch(): void {
        this._newIcon.active = false;
        this._iconOnND.active = true;
        this._iconOffND.active = false;
    }

    // start() {

    // }

    // update(deltaTime: number) {

    // }
}

