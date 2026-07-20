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

import {_decorator, Component, director, EditBox, EventTouch, Label, Node, Sprite} from "cc";
import {EProtocolID} from "../../../framework/network/protocol-configs";
import {ClubEntity} from "../../Entity/ClubEntity";
import {LoginEnity} from "../../Entity/Login";
import {ToastUI} from "../ToastUI";
import {EEventListenerPriority, ProtocolEventManager} from "../../../framework/event/event-management";
import {EventConst} from "../../../const/EventConst";
import {CommUtils} from "../../../framework/utils/CommUtils";
import {ProtocolHTTPManager} from "../../../framework/network/http";
import {App} from "../../../Module/App";

const {ccclass, property} = _decorator;

@ccclass('ClubJoinUI')
export class ClubJoinUI extends Component {
    private _closeBtn: Node | null = null;
    private _confirmBtn: Node | null = null;
    private _confirmLB: Label | null = null;
    private _nameLB: Label | null = null;
    private _avatarND: Node | null = null;
    private _leadLB: Label | null = null;
    private _idLB: Label | null = null;
    private _memsLB: Label | null = null;// 规模
    private _reasonEB: EditBox | null = null;

    onLoad() {
        this._closeBtn = this.node.getChildByPath("bg/closeBtn");
        this._confirmBtn = this.node.getChildByPath("bg/confirmBtn");
        this._confirmLB = this.node.getChildByPath("bg/confirmBtn/Label").getComponent(Label);
        this._nameLB = this.node.getChildByPath("bg/nameLB").getComponent(Label);
        this._avatarND = this.node.getChildByPath("bg/avatarND/avatar");
        this._leadLB = this.node.getChildByPath("bg/leadLB").getComponent(Label);
        this._idLB = this.node.getChildByPath("bg/idLB").getComponent(Label);
        this._memsLB = this.node.getChildByPath("bg/memsLB").getComponent(Label);
        this._reasonEB = this.node.getChildByPath("bg/reasonEB").getComponent(EditBox);

        this._closeBtn.on(Node.EventType.TOUCH_END, this._onCloseTouch, this);
        this._confirmBtn.on(Node.EventType.TOUCH_END, this._onConfirmTouch, this);

        ProtocolEventManager.on(EProtocolID.CLUB_SEND_JOIN_REQ, this._onClubJoinRespond, this, EEventListenerPriority.HIGHER);
    }

    private _onCloseTouch(evt: EventTouch): void {
        this.node.destroy();
    }

    private _onConfirmTouch(evt: EventTouch): void {
        console.log("==club join confirm:")
        if (!this._reasonEB.string) {
            App.getInst(ToastUI).showTips("申请理由不能为空");
            return;
        }

        // 搜索出来的俱乐部类型（0--正常 1--已申请 2--已加入）
        if (1 == ClubEntity.clubSearchType) {
            App.getInst(ToastUI).showTips("已提交申请，请耐心等待");
            return;
        } else if (2 == ClubEntity.clubSearchType) {
            App.getInst(ToastUI).showTips("你已加入该雀馆");
            return;
        }

        let mParamObj = {
            playerId: LoginEnity.playerID,
            clubId: ClubEntity.clubSearchInfor.clubId,
            ownerId: ClubEntity.clubSearchInfor.ownerId,
            comment: this._reasonEB.string,
            isCheck: false,// 这里是加入，必须填false，奇葩的设计
        };
        ProtocolHTTPManager.load(EProtocolID.CLUB_SEND_JOIN_REQ, mParamObj, false);
    }

    private _onClubJoinRespond(event): void {
        console.log("===join club:", event);

        if (event.success && event.data.res === "SUCCESS") {
            console.log("申请加入发送成功");// 弹框提示，关闭界面

            App.getInst(ToastUI).showTips("发送成功");
            director.emit(EventConst.EVT_REMOVE_CLUB_PREF);
            this.node.destroy();

        } else {
            App.getInst(ToastUI).showTips("发送失败");
        }
    }

    // 更新数据用，必备
    public refresh(): void {
        this._reasonEB.string = "久仰大名，望批准";
        this._nameLB.string = ClubEntity.clubSearchInfor.name;
        this._idLB.string = ClubEntity.clubSearchInfor.clubId + "";
        this._leadLB.string = ClubEntity.clubSearchInfor.ownerName;
        this._memsLB.string = ClubEntity.clubSearchInfor.curPlayerNo + "";

        // 搜索出来的俱乐部类型（0--正常 1--已申请 2--已加入）
        if (0 == ClubEntity.clubSearchType) {
            this._confirmLB.string = "申 请 加 入";
            this._confirmBtn.getComponent(Sprite).grayscale = false;
        } else if (1 == ClubEntity.clubSearchType) {
            this._confirmLB.string = "申 请 中";
            this._confirmBtn.getComponent(Sprite).grayscale = true;
        } else if (2 == ClubEntity.clubSearchType) {
            this._confirmLB.string = "已 加 入";
            this._confirmBtn.getComponent(Sprite).grayscale = true;
        }

        let mAvatarID = ClubEntity.clubSearchInfor.avatarId;
        if (mAvatarID >= 1 && mAvatarID <= 6) {
            CommUtils.loadSprite(this._avatarND.getComponent(Sprite), "ui/clubicon/clubicon_img_n" + mAvatarID);
        }
    }

    onDestroy(): void {
        director.emit(EventConst.EVT_UPDATE_CLUB_MAIN_TOGGLE, false);
        ProtocolEventManager.off(EProtocolID.CLUB_SEND_JOIN_REQ, this._onClubJoinRespond, this);
    }
}

