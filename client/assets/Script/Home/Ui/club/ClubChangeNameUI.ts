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

import {_decorator, Component, director, EditBox, EventTouch, Node} from "cc";
import {ToastUI} from "../ToastUI";
import {EProtocolID} from "../../../framework/network/protocol-configs";
import {ClubEntity} from "../../Entity/ClubEntity";
import {EEventListenerPriority, ProtocolEventManager} from "../../../framework/event/event-management";
import {EventConst} from "../../../const/EventConst";
import {ProtocolHTTPManager} from "../../../framework/network/http";
import {App} from "../../../Module/App";

const {ccclass, property} = _decorator;

@ccclass('ClubChangeNameUI')
export class ClubChangeNameUI extends Component {
    public closeBtn: Node | null = null;
    public confirmBtn: Node | null = null;
    public newNameEB: EditBox | null = null;

    onLoad(): void {
        this.closeBtn = this.node.getChildByPath("bg/closeBtn");
        this.confirmBtn = this.node.getChildByPath("bg/confirmBtn");
        this.newNameEB = this.node.getChildByPath("bg/newNameEB").getComponent(EditBox);
        this.closeBtn.on(Node.EventType.TOUCH_END, this._onCloseTouch, this);
        this.confirmBtn.on(Node.EventType.TOUCH_END, this._onConfirmTouch, this);
        ProtocolEventManager.on(EProtocolID.CLUB_MODIFY_REQ, this._onClubModifyRespond, this, EEventListenerPriority.HIGHER);
    }

    private _onCloseTouch(evt: EventTouch): void {
        this.node.destroy();
    }

    private _onConfirmTouch(evt: EventTouch): void {
        if (!this.newNameEB.string) {
            App.getInst(ToastUI).showTips("名称不能为空");
            return;
        }
        if (this.newNameEB.string.length < 3 || this.newNameEB.string.length > 8) {
            App.getInst(ToastUI).showTips("名称应为3-8个汉字、英文、日文、数字");
            return;
        }
        if (!this.newNameEB.string.match(/^[\u4e00-\u9fa5a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF]{3,8}$/g)) {
            App.getInst(ToastUI).showTips("名称包含非法字符");
            return;
        }

        let mParamObj = {
            clubId: ClubEntity.modifyClubID,
            name: this.newNameEB.string,
            clubStatus: 1,// 修改必须带1
        };
        ProtocolHTTPManager.load(EProtocolID.CLUB_MODIFY_REQ, mParamObj, false);
    }

    private _onClubModifyRespond(event): void {
        console.log("====modify call evt:", event);
        if (event.success && event.data.res == "SUCCESS") {
            App.getInst(ToastUI).showTips("修改成功");
            director.emit(EventConst.EVT_UPDATE_CLUB_LIST);
        } else {
            if (event.data?.msg) {
                App.getInst(ToastUI).showTips(event.data.msg);
            }
        }
        this.node.destroy();
    }

    onDestroy(): void {
        ProtocolEventManager.off(EProtocolID.CLUB_MODIFY_REQ, this._onClubModifyRespond, this);
    }

    // 更新数据用，必备
    public refresh(): void {
    }

}
