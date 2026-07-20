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

import {_decorator, Component, EventTouch, Node} from 'cc';
import {App} from '../../../Module/App';
import {ClubCtrl} from '../../../Module/club/ClubCtrl';
import {ClubEntity} from '../../Entity/ClubEntity';
import {LoginEnity} from '../../Entity/Login';
import {CallBack} from '../../../framework/utils/CallBack';
import {ToastUI} from '../ToastUI';

const {ccclass, property} = _decorator;

@ccclass('ClubCommitUI')
export class ClubCommitUI extends Component {
    private _okBtn: Node | null = null;
    private _noBtn: Node | null = null;

    onLoad(): void {
        this._okBtn = this.node.getChildByPath("bg/okBtn");
        this._noBtn = this.node.getChildByPath("bg/noBtn");

        this._okBtn.on(Node.EventType.TOUCH_END, this._onOkTouch, this);
        this._noBtn.on(Node.EventType.TOUCH_END, this._onNoTouch, this);
    }


    private _onOkTouch(evt: EventTouch): void {
        // 解散台桌
        App.getInst(ClubCtrl).GetClubCloseTable(ClubEntity.recentClubID, LoginEnity.playerID, ClubEntity.dissClubID, new CallBack((params) => {
            console.log("==解散params:", params);
            if (params.res == "FAILED") {
                ToastUI._ins.showTips(params.msg)
            }

        }, this));
        this.node.destroy();
    }

    private _onNoTouch(evt: EventTouch): void {
        this.node.destroy();
    }

    // 更新数据用，必备
    public refresh(): void {

    }

    onDestroy(): void {

    }

    // start() {

    // }

    // update(deltaTime: number) {

    // }
}

