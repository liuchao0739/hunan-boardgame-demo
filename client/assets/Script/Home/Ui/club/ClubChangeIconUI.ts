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

import {_decorator, Component, director, EventTouch, Node} from "cc";
import {ClubEntity} from "../../Entity/ClubEntity";
import {E_CLUB_MODULE} from "../../../const/EnumConst";
import {EEventListenerPriority, ProtocolEventManager} from "../../../framework/event/event-management";
import {EProtocolID} from "../../../framework/network/protocol-configs";
import {ToastUI} from "../ToastUI";
import {EventConst} from "../../../const/EventConst";
import {ProtocolHTTPManager} from "../../../framework/network/http";
import {App} from "../../../Module/App";

const {ccclass, property} = _decorator;

@ccclass('ClubChangeIconUI')
export class ClubChangeIconUI extends Component {
    public _closeBtn: Node | null = null;
    public _childCont: Node | null = null;
    public _confirmBtn: Node | null = null;
    private _clubIconID: number = 0;

    onLoad(): void {
        this._closeBtn = this.node.getChildByPath("bg/closeBtn");
        this._confirmBtn = this.node.getChildByPath("bg/confirmBtn");

        let mCont = this.node.getChildByPath("bg/cont");
        this._childCont = mCont;
        for (let mi = 0; mi < mCont.children.length; mi++) {
            mCont.children[mi].on(Node.EventType.TOUCH_END, this._iconTouch, this);
        }

        this._closeBtn.on(Node.EventType.TOUCH_END, this._onCloseTouch, this);
        this._confirmBtn.on(Node.EventType.TOUCH_END, this._onConfirmTouch, this);
        ProtocolEventManager.on(EProtocolID.CLUB_MODIFY_REQ, this._onClubModifyRespond, this, EEventListenerPriority.HIGHER);
    }

    private _onCloseTouch(evt: EventTouch): void {

        this.node.destroy();
    }

    private _iconTouch(evt: EventTouch): void {
        // console.log("===icon touch:", evt);
        let mSelID: number = parseInt(evt.target.name.slice(-1));
        console.log("mID:", mSelID);
        this._clubIconID = mSelID;
        ClubEntity.clubAvatarId = mSelID;
        this._changeIconChoose(mSelID);
    }

    private _onConfirmTouch(evt: EventTouch): void {
        // 在创建俱乐部界面更换图标，不需要发消息，只是本地更换
        if (ClubEntity.prevUI == E_CLUB_MODULE.CREATE_UI) {
            console.log("clubicon:", this._clubIconID);
            director.emit(EventConst.EVT_UPDATE_CLUB_ICON, this._clubIconID);
            this.node.destroy();
        } else {
            let mParamObj = {
                clubId: ClubEntity.modifyClubID,
                avatarId: this._clubIconID,
                clubStatus: 1,// 修改必须带1
            };
            ProtocolHTTPManager.load(EProtocolID.CLUB_MODIFY_REQ, mParamObj, false);
        }
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

    private _changeIconChoose(mSelID: number): void {
        console.log("child cont:", this._childCont, "mselID:", mSelID);
        for (let mi = 0; mi < this._childCont.children.length; mi++) {
            this._childCont.children[mi].getChildByPath("check").active = false;
        }

        this._childCont.children[mSelID - 1].getChildByPath("check").active = true;
    }

    onDestroy(): void {
        ProtocolEventManager.off(EProtocolID.CLUB_MODIFY_REQ, this._onClubModifyRespond, this);
    }

    // 更新数据用，必备
    public refresh(): void {
        this._changeIconChoose(ClubEntity.clubAvatarId);
    }
}

