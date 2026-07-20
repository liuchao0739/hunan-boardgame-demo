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

import {_decorator, Component, director, EditBox, Label, Node} from "cc";
import {EProtocolID} from "../../../framework/network/protocol-configs";
import {LoginEnity} from "../../Entity/Login";
import {EEventListenerPriority, ProtocolEventManager} from "../../../framework/event/event-management";
import {ToastUI} from "../ToastUI";
import {ProtocolHTTPManager} from "../../../framework/network/http";
import {ClubEntity} from "../../Entity/ClubEntity";
import {EventConst} from "../../../const/EventConst";
import {App} from "../../../Module/App";

const {ccclass, property} = _decorator;

@ccclass('ClubDissolveUI')
export class ClubDissolveUI extends Component {
    private _closeBtn: Node | null = null;
    private _tipsLB: Label | null = null;
    private _resonEB: EditBox | null = null;
    private _confirmBtn: Node | null = null;

    onLoad(): void {
        this._closeBtn = this.node.getChildByPath("bg/closeBtn");
        this._tipsLB = this.node.getChildByPath("bg/tipsLB").getComponent(Label);
        this._resonEB = this.node.getChildByPath("bg/reasonEB").getComponent(EditBox);
        this._confirmBtn = this.node.getChildByPath("bg/confirmBtn");

        // this._resonEB.node.on(EditBox.EventType.EDITING_DID_ENDED, this._onReasonEnd, this);
        this._closeBtn.on(Node.EventType.TOUCH_END, this._onCloseTouch, this);
        this._confirmBtn.on(Node.EventType.TOUCH_END, this._onConfirmTouch, this);

        ProtocolEventManager.on(EProtocolID.CLUB_MODIFY_REQ, this._onClubModifyRespond, this, EEventListenerPriority.HIGHER);
    }

    // 固定显示俱乐部ID，不再根据玩家输入显示
    // private _onReasonEnd(evt): void {
    //     console.log("========dissolve ===evt:", evt);
    //     this._tipsLB.node.active = true;
    //     this._tipsLB.string = `确定解散俱乐部（ID：${this._resonEB.string}）吗？`;
    // }

    private _onCloseTouch(): void {
        this.node.destroy();
    }

    private _onConfirmTouch(): void {
        if (!this._resonEB.string) {
            App.getInst(ToastUI).showTips("ID不能为空");
            return;
        }

        if (!this._resonEB.string.match(/^[\d]{1,8}$/g)) {
            App.getInst(ToastUI).showTips("ID错误");
            return;
        }

        if (this._resonEB.string != ClubEntity.recentClubID + "") {
            App.getInst(ToastUI).showTips("ID错误");
            return;
        }

        // 解散
        let mParamObj = {
            "clubId": parseInt(this._resonEB.string),
            "clubStatus": 0,// 解散必须带0
        };
        ProtocolHTTPManager.load(EProtocolID.CLUB_MODIFY_REQ, mParamObj, false);
    }


    private _onClubModifyRespond(event): void {
        console.log("===== jiesan ===== evt:", event)
        if (event.success && event.data.res == "SUCCESS") {
            // 获取俱乐部个人信息
            ProtocolHTTPManager.load(EProtocolID.CLUB_GET_PLAYER_INFOR_REQ, {
                playerId: LoginEnity.playerID,
                // 0 不返回统计 1 返回俱乐部统计 2 返回友人场统计
                mode: 1,
            }, false);
            console.log("请求个人信息");

            director.emit(EventConst.EVT_REMOVE_CLUB_PREF);
            this.node.destroy();
        }
    }

    onDestroy(): void {
        ProtocolEventManager.off(EProtocolID.CLUB_MODIFY_REQ, this._onClubModifyRespond, this);
    }

    // 更新数据用，必备
    public refresh(): void {
        this._resonEB.string = "";
        this._tipsLB.node.active = true;
        // this._tipsLB.string = `确定解散俱乐部（ID：）吗？`;
        this._tipsLB.string = `确定解散俱乐部（ID：${ClubEntity.recentClubID}）吗？`;

    }
}
