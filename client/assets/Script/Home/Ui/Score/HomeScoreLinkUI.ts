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

import {_decorator, Component, EditBox, EventTouch, Node} from 'cc';
import {ToastUI} from '../ToastUI';
import {App} from '../../../Module/App';

const {ccclass, property} = _decorator;

@ccclass('HomeScoreLinkUI')
export class HomeScoreLinkUI extends Component {
    private _closeBtn: Node | null = null;
    private _contEB: EditBox | null = null;
    private _okBtn: Node | null = null;

    onLoad(): void {
        this._closeBtn = this.node.getChildByPath("contbg/closeBtn");
        this._contEB = this.node.getChildByPath("contbg/contEB").getComponent(EditBox);
        this._okBtn = this.node.getChildByPath("contbg/okBtn");

        this._closeBtn.on(Node.EventType.TOUCH_END, this._onCloseTouch, this);
        this._okBtn.on(Node.EventType.TOUCH_END, this._onOKTouch, this);
    }

    private _onCloseTouch(evt: EventTouch): void {
        console.log("link close touch");
        this.node.destroy();
    }

    private _onOKTouch(evt: EventTouch): void {
        console.log("link ok touch:", this._contEB.string);
        if (!this._contEB.string) {
            App.getInst(ToastUI).showTips("请输入牌谱链接");
            return;
        }
        // ProtocolHTTPManager.load(EProtocolID.CLUB_GETGAMEHISTORYDETAIL, ClubEntity.saveHistoryData, false);
    }

    // start() {

    // }

    // update(deltaTime: number) {

    // }
}

