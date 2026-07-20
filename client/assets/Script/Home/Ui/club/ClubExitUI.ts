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

import {_decorator, Component, director, Node} from "cc";
import {ClubEntity} from "../../Entity/ClubEntity";
import {LoginEnity} from "../../Entity/Login";
import {EProtocolID} from "../../../framework/network/protocol-configs";
import {EEventListenerPriority, ProtocolEventManager} from "../../../framework/event/event-management";
import {ProtocolHTTPManager} from "../../../framework/network/http";
import {EventConst} from "../../../const/EventConst";

const {ccclass, property} = _decorator;

@ccclass('ClubExitUI')
export class ClubExitUI extends Component {
    private _closeBtn: Node | null = null;
    private _confirmBtn: Node | null = null;
    private _cancelBtn: Node | null = null;

    onLoad(): void {
        this._closeBtn = this.node.getChildByPath("bg/closeBtn");
        this._confirmBtn = this.node.getChildByPath("bg/confirmBtn");
        this._cancelBtn = this.node.getChildByPath("bg/cancelBtn");

        this._closeBtn.on(Node.EventType.TOUCH_END, this._onCloseTouch, this);
        this._confirmBtn.on(Node.EventType.TOUCH_END, this._onConfirmTouch, this);
        this._cancelBtn.on(Node.EventType.TOUCH_END, this._onCancelTouch, this);

        ProtocolEventManager.on(EProtocolID.CLUB_QUITCLUB, this._onClubQuitRespond, this, EEventListenerPriority.HIGHER);
    }

    private _onCloseTouch(): void {
        console.log("close");
        // this.toHide();
        this.node.destroy();
    }

    private _onConfirmTouch(): void {
        // 退出
        let mParams = {
            "clubId": ClubEntity.recentClubID,
            "playerId": LoginEnity.playerID
        };
        ProtocolHTTPManager.load(EProtocolID.CLUB_QUITCLUB, mParams, false);
    }

    private _onCancelTouch(): void {
        console.log("cancel");
        this.node.destroy();
    }

    private _onClubQuitRespond(event): void {
        console.log("=quit club ======evt:", event);

        if (event.success && event.data.res == "SUCCESS") {

            // 获取俱乐部个人信息
            ProtocolHTTPManager.load(EProtocolID.CLUB_GET_PLAYER_INFOR_REQ, {
                playerId: LoginEnity.playerID,
                // 0 不返回统计 1 返回俱乐部统计 2 返回友人场统计
                mode: 1,
            }, false);

            director.emit(EventConst.EVT_REMOVE_CLUB_PREF);
            this.node.destroy();
        }
    }

    onDestroy(): void {
        ProtocolEventManager.off(EProtocolID.CLUB_QUITCLUB, this._onClubQuitRespond, this);
    }

    // 更新数据用，必备
    public refresh(): void {
    }
}

