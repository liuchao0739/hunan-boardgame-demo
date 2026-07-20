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

import {_decorator, Component, director, EventTouch, Label, Node} from "cc";
import {EProtocolID} from "../../../framework/network/protocol-configs";
import {ClubEntity} from "../../Entity/ClubEntity";
import {ToastUI} from "../ToastUI";
import {EEventListenerPriority, ProtocolEventManager} from "../../../framework/event/event-management";
import {E_CLUB_MODULE} from "../../../const/EnumConst";
import {ProtocolHTTPManager} from "../../../framework/network/http";
import {EventConst} from "../../../const/EventConst";
import {HomeUiMain} from "../HomeUiMain";
import {App} from "../../../Module/App";
import {LoginEnity} from "../../Entity/Login";

const {ccclass, property} = _decorator;

@ccclass('ClubInputUI')
export class ClubInputUI extends Component {
    /**
     * 这个界面设计的比较奇葩，输入俱乐部id后，要先发65006，获取俱乐部信息，
     * 获取到俱乐部信息后，再发（65003），加入俱乐部，参数填（isCheck=true），
     * 然后根据返回参数决定弹出的申请加入俱乐部界面上的按钮文字显示什么，
     * 如果玩家没有加入或申请加入过，再发（65003），加入俱乐部，参数填（isCheck=false），申请加入俱乐部
     */
    /**
     * 输入俱乐部id后，要先发65006，获取俱乐部信息，
     * 获取到俱乐部信息后，再发（65038），获取是否申请过的信息，
     * 然后根据返回参数决定弹出的申请加入俱乐部界面上的按钮文字显示什么，
     * 如果玩家没有加入或申请加入过，再发（65003），加入俱乐部，参数填（isCheck=false），申请加入俱乐部
     * CLUB_CHECKCLUBAPPLICATION
     **/

    private _closeBtn: Node | null = null;
    private idLB: Label | null = null;
    private num1Btn: Node | null = null;
    private num2Btn: Node | null = null;
    private num3Btn: Node | null = null;
    private num4Btn: Node | null = null;
    private num5Btn: Node | null = null;
    private num6Btn: Node | null = null;
    private num7Btn: Node | null = null;
    private num8Btn: Node | null = null;
    private num9Btn: Node | null = null;
    private num0Btn: Node | null = null;
    private _clearBtn: Node | null = null;
    private _delBtn: Node | null = null;
    private _confirmBtn: Node | null = null;
    private _inputStr: string = "";

    onLoad(): void {
        this._closeBtn = this.node.getChildByPath("bg/closeBtn");
        // this.idEB     = node.getChildByPath("idEB").getComponent(EditBox);
        this.idLB = this.node.getChildByPath("bg/id/Label").getComponent(Label);
        this.num1Btn = this.node.getChildByPath("bg/1Btn");
        this.num2Btn = this.node.getChildByPath("bg/2Btn");
        this.num3Btn = this.node.getChildByPath("bg/3Btn");
        this.num4Btn = this.node.getChildByPath("bg/4Btn");
        this.num5Btn = this.node.getChildByPath("bg/5Btn");
        this.num6Btn = this.node.getChildByPath("bg/6Btn");
        this.num7Btn = this.node.getChildByPath("bg/7Btn");
        this.num8Btn = this.node.getChildByPath("bg/8Btn");
        this.num9Btn = this.node.getChildByPath("bg/9Btn");
        this.num0Btn = this.node.getChildByPath("bg/0Btn");
        this._delBtn = this.node.getChildByPath("bg/delBtn");
        this._clearBtn = this.node.getChildByPath("bg/clearBtn");
        this._confirmBtn = this.node.getChildByPath("bg/confirmBtn");

        this._closeBtn.on(Node.EventType.TOUCH_END, this._onCloseTouch, this);
        this.num0Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this.num1Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this.num2Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this.num3Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this.num4Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this.num5Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this.num6Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this.num7Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this.num8Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this.num9Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this._delBtn.on(Node.EventType.TOUCH_END, this._onDelTouch, this);
        this._clearBtn.on(Node.EventType.TOUCH_END, this._onClearTouch, this);
        this._confirmBtn.on(Node.EventType.TOUCH_END, this._onConfirmTouch, this);
        this._inputStr = "";
        this.idLB.string = "请输入ID";

        ProtocolEventManager.on(EProtocolID.CLUB_GET_INFOR_REQ, this._onClubGetInforRespond, this, EEventListenerPriority.HIGHER);
        ProtocolEventManager.on(EProtocolID.CLUB_CHECKCLUBAPPLICATION, this._onClubCheckApplicationRespond, this, EEventListenerPriority.HIGHER);
    }

    start() {
        director.emit(EventConst.EVT_UPDATE_CLUB_MAIN_TOGGLE, true);
    }

    private _onCloseTouch(evt: EventTouch): void {
        this.idLB.string = "请输入ID";
        this.node.destroy();
    }

    private _onNumTouch(evt: EventTouch): void {
        switch (evt.currentTarget.name) {
            case "1Btn":
            case "2Btn":
            case "3Btn":
            case "4Btn":
            case "5Btn":
            case "6Btn":
            case "7Btn":
            case "8Btn":
            case "9Btn":
            case "0Btn":
                this._onNumbtnInput(evt.currentTarget.name.slice(0, 1));
                break;
            default:
                break;
        }
        this.idLB.string = this._inputStr;

    }

    private _onNumbtnInput(mNum: string): void {
        console.log("num:", mNum);
        if (this._inputStr.length < 8) {
            this._inputStr += mNum;
        }
    }

    private _onDelTouch(evt: EventTouch): void {
        this._inputStr = this._inputStr.slice(0, this._inputStr.length - 1);
        this.idLB.string = this._inputStr;
        console.log("inputstr:", this._inputStr);
    }

    private _onClearTouch(evt: EventTouch): void {
        this._inputStr = "";
        this.idLB.string = "请输入ID";
    }

    private _onConfirmTouch(evt: EventTouch): void {
        if (!this.idLB.string) {
            App.getInst(ToastUI).showTips("ID不能为空");
            return;
        }

        if (!this.idLB.string.match(/^[\d]{1,8}$/g)) {
            App.getInst(ToastUI).showTips("ID包含非法字符");
            return;
        }

        if (this.idLB.string) {
            let mClubID: number = parseInt(this.idLB.string);
            // 获取俱乐部信息
            let mParams = {
                "clubId": mClubID,
            };

            ClubEntity.clubSearchInfor = null;
            ProtocolHTTPManager.load(EProtocolID.CLUB_GET_INFOR_REQ, mParams, false);
        }
    }

    private _onClubGetInforRespond(event) {
        console.log("=search get club infor search======evt:", event);

        if (event.success && event.data.res == "SUCCESS") {
            ClubEntity.clubSearchInfor = event.data.clubInfo;

            let mParamObj = {
                playerId: LoginEnity.playerID,
                clubId: ClubEntity.clubSearchInfor.clubId,
                ownerId: ClubEntity.clubSearchInfor.ownerId,
            };
            // 搜索出来的俱乐部类型（0--正常 1--已加入 2--已申请）
            ClubEntity.clubSearchType = 0;
            ProtocolHTTPManager.load(EProtocolID.CLUB_CHECKCLUBAPPLICATION, mParamObj, false);


        } else {
            // console.log("搜索俱乐部失败：", this.idLB.string)
            App.getInst(ToastUI).showTips("该雀馆不存在");
        }
    }

    private _onClubCheckApplicationRespond(event): void {
        console.log("= club check application ======evt:", event);
        if (event.success) {
            if (event.data.res === "SUCCESS") {
                ClubEntity.clubSearchType = 0;
                HomeUiMain.ins.uiModuleMgr.showUi("ClubJoinPref", "ClubJoinUI");
                this.node.destroy();
            } else if (event.data.res === "FAILED") {
                // 搜索出来的俱乐部类型（0--正常 1--已申请 2--已加入）
                ClubEntity.clubSearchType = event.data.code;
                HomeUiMain.ins.uiModuleMgr.showUi("ClubJoinPref", "ClubJoinUI");
                this.node.destroy();
            }


        } else {
            App.getInst(ToastUI).showTips("发送验证加入雀馆失败");
        }
    }

    onDestroy(): void {
        // 从大厅进来
        if (ClubEntity.prevUI == E_CLUB_MODULE.NONE) {
            director.emit(EventConst.EVT_UPDATE_CLUB_MAIN_TOGGLE, false);
        }

        ProtocolEventManager.off(EProtocolID.CLUB_GET_INFOR_REQ, this._onClubGetInforRespond, this);
        ProtocolEventManager.off(EProtocolID.CLUB_CHECKCLUBAPPLICATION, this._onClubCheckApplicationRespond, this);

    }

    // 更新数据用，必备
    public refresh(): void {
    }

}

