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

import {_decorator, Component, EventTouch, Node, Prefab} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('MailPrefUI')
export class MailPrefUI extends Component {
    @property({type: Prefab})
    mailItemPref: Prefab | null = null;

    private _contND: Node | null = null;
    // 踢出雀馆
    private _kickoutBtn: Node | null = null;
    private _backBtn: Node | null = null;

    start() {
        this._contND = this.node.getChildByPath("cont/mailCont/ScrollView/view/content");
        this._kickoutBtn = this.node.getChildByPath("cont/kickoutBtn");
        this._backBtn = this.node.getChildByPath("cont/backBtn");

        this._backBtn.on(Node.EventType.TOUCH_END, this._onBackTouch, this);
        this.init();
    }

    public init(): void {
        this._contND.removeAllChildren();
    }

    // update(deltaTime: number) {

    // }

    private _onBackTouch(evt: EventTouch): void {
        this.node.destroy();
    }
}

