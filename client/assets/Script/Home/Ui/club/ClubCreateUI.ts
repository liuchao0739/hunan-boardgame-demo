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

import {_decorator, Component, director, EditBox, EventTouch, Node, Sprite} from "cc";
import {EProtocolID} from "../../../framework/network/protocol-configs";
import {ClubEntity} from "../../Entity/ClubEntity";
import {LoginEnity} from "../../Entity/Login";
import {ToastUI} from "../ToastUI";
import {EEventListenerPriority, ProtocolEventManager} from "../../../framework/event/event-management";
import {E_CLUB_MODULE} from "../../../const/EnumConst";
import {ProtocolHTTPManager} from "../../../framework/network/http";
import {EventConst} from "../../../const/EventConst";
import {HomeUiMain} from "../HomeUiMain";
import {CommUtils} from "../../../framework/utils/CommUtils";
import {App} from "../../../Module/App";

const {ccclass, property} = _decorator;

@ccclass('ClubCreateUI')
export class ClubCreateUI extends Component {
    private _closeBtn: Node | null = null;
    private _avatarND: Node | null = null;

    private _changeBtn: Node | null = null;
    private _nameEB: EditBox | null = null;
    private _createBtn: Node | null = null;

    onLoad(): void {
        this._closeBtn = this.node.getChildByPath("bg/closeBtn");
        this._avatarND = this.node.getChildByPath("bg/avatarND/avatar");
        this._changeBtn = this.node.getChildByPath("bg/avatarND/changeBtn");
        this._nameEB = this.node.getChildByPath("bg/nameEB").getComponent(EditBox);
        this._createBtn = this.node.getChildByPath("bg/createBtn");

        this._closeBtn.on(Node.EventType.TOUCH_END, this._onCloseTouch, this);
        this._changeBtn.on(Node.EventType.TOUCH_END, this._onChangeTouch, this);
        this._createBtn.on(Node.EventType.TOUCH_END, this._onCreateTouch, this);
        ClubEntity.clubAvatarId = 1;
        ProtocolEventManager.on(EProtocolID.CLUB_CREATE_REQ, this._onClubCreateRespond, this, EEventListenerPriority.HIGHER);
        director.on(EventConst.EVT_UPDATE_CLUB_ICON, this._onUpdateClubIcon, this);
    }

    start(): void {
        // director.emit(EventConst.EVT_UPDATE_CLUB_MAIN_TOGGLE, true);
    }

    private _onCloseTouch(evt: EventTouch): void {
        this.node.destroy();
    }

    private _onChangeTouch(evt: EventTouch) {
        ClubEntity.prevUI = E_CLUB_MODULE.CREATE_UI;
        HomeUiMain.ins.uiModuleMgr.showUi("ClubChangeIconPref", "ClubChangeIconUI");
    }

    private _onCreateTouch(evt: EventTouch) {
        if (!this._nameEB.string) {
            App.getInst(ToastUI).showTips("名称不能为空");
            return;
        }
        if (this._nameEB.string.length < 3 || this._nameEB.string.length > 8) {
            App.getInst(ToastUI).showTips("名称应为3-8个汉字、英文、日文、数字");
            return;
        }
        // 中文英文日文
        if (!this._nameEB.string.match(/^[\u4e00-\u9fa5a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF]{3,8}$/g)) {
            App.getInst(ToastUI).showTips("名称包含非法字符");
            return;
        }

        let mParamObj = {
            name: this._nameEB.string,
            avatarId: ClubEntity.clubAvatarId,
            creatorId: LoginEnity.playerID
        };
        ProtocolHTTPManager.load(EProtocolID.CLUB_CREATE_REQ, mParamObj, false);
    }

    private _onClubCreateRespond(event) {
        console.log("=俱乐部创建======evt:", event)
        if (event.success && event.data?.res == "SUCCESS") {
            console.log("SUCCESS");
            ClubEntity.createClubID = event.data["clubId"];
            ClubEntity.recentClubID = event.data["clubId"];
            ClubEntity.isJoinedClub = true;

            ClubEntity.clubInfor = null;
            ClubEntity.isDiamond = false;

            director.emit(EventConst.EVT_UPDATE_CLUB_LIST);

            let mParams = {
                "clubId": ClubEntity.recentClubID,
            };
            ProtocolHTTPManager.load(EProtocolID.CLUB_GET_INFOR_REQ, mParams, false);
            this.node.destroy();
        } else {
            if (event.data?.msg) {
                App.getInst(ToastUI).showTips(event.data.msg);
            }
            this._nameEB.string = "";
        }
    }

    private _onUpdateClubIcon(evt): void {
        console.log("update icon:", evt);
        if (evt >= 1 && evt <= 6) {
            CommUtils.loadSprite(this._avatarND.getComponent(Sprite), "ui/clubicon/clubicon_img_n" + evt);
        }
    }

    onDestroy(): void {
        ProtocolEventManager.off(EProtocolID.CLUB_CREATE_REQ, this._onClubCreateRespond, this);
        director.off(EventConst.EVT_UPDATE_CLUB_ICON, this._onUpdateClubIcon, this);
    }

    // 更新数据用，必备
    public refresh(): void {
        this._nameEB.string = "";
    }
}
