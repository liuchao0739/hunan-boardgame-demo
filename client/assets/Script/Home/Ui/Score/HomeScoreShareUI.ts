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

import {_decorator, Component, EventTouch, Label, Node, Toggle} from 'cc';
import {ToastUI} from '../ToastUI';
import {ClubEntity} from '../../Entity/ClubEntity';
import {App} from '../../../Module/App';

const {ccclass, property} = _decorator;

/**
 * 分享牌谱
 */
@ccclass('HomeScoreShareUI')
export class HomeScoreShareUI extends Component {

    private _closeBtn: Node | null = null;
    private _contLB: Label | null = null;
    private _nameToggle: Toggle | null = null;
    private _copyBtn: Node | null = null;

    onLoad(): void {
        this._closeBtn = this.node.getChildByPath("contbg/closeBtn");
        this._contLB = this.node.getChildByPath("contbg/cont/contLB").getComponent(Label);
        this._nameToggle = this.node.getChildByPath("contbg/nameToggle").getComponent(Toggle);
        this._copyBtn = this.node.getChildByPath("contbg/copyBtn");
        this._closeBtn.on(Node.EventType.TOUCH_END, this._onCloseTouch, this);
        this._copyBtn.on(Node.EventType.TOUCH_END, this._onCopyTouch, this);
    }

    private _onCloseTouch(evt: EventTouch): void {
        console.log("share close touch");
        this.node.destroy();
    }

    private _onCopyTouch(evt: EventTouch): void {
        let mCopyStr: string = this._contLB.string;
        // 如果匿名，url后加&n=1// 单独用另一个链接参数
        if (this._nameToggle.isChecked) {
            // mCopyStr+="&n=1";
            mCopyStr = ClubEntity.anoPaipuLink;
        }
        console.log("share copy touch:", mCopyStr, "==:", this._nameToggle.isChecked);
        App.getInst(ToastUI).showTips("复制成功");
    }

    start() {
        this._contLB.string = "牌谱：" + ClubEntity.paipuLink;
    }

    // update(deltaTime: number) {

    // }
}

