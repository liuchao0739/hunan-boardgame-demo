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

import {_decorator, Component, director, EventTouch, instantiate, Label, Node, Sprite} from "cc";
import {EProtocolID} from "../../../framework/network/protocol-configs";
import {ClubEntity} from "../../Entity/ClubEntity";
import {LoginEnity} from "../../Entity/Login";
import {EEventListenerPriority, ProtocolEventManager} from "../../../framework/event/event-management";
import {E_CLUB_MODULE} from "../../../const/EnumConst";
import {EventConst} from "../../../const/EventConst";
import {HomeUiMain} from "../HomeUiMain";
import {CommUtils} from "../../../framework/utils/CommUtils";
import {ProtocolHTTPManager} from "../../../framework/network/http";

const {ccclass, property} = _decorator;

@ccclass('ClubChooseHallUI')
export class ClubChooseHallUI extends Component {
    private _backBtn: Node | null = null;
    private _contND: Node | null = null;
    private _clubChooseItemND: Node = null;
    private _createBtn: Node | null = null;
    private _joinBtn: Node | null = null;

    onLoad(): void {
        this._backBtn = this.node.getChildByPath("bg/backBtn");
        let mContND = this.node.getChildByPath("bg/ScrollView/view/content");
        this._contND = mContND;
        this._clubChooseItemND = mContND.getChildByPath("ClubChooseItem");
        this._createBtn = this.node.getChildByPath("bg/createBtn");
        this._joinBtn = this.node.getChildByPath("bg/joinBtn");

        this._backBtn.on(Node.EventType.TOUCH_END, this._onBackTouch, this);
        this._createBtn.on(Node.EventType.TOUCH_END, this._onCreateTouch, this);
        this._joinBtn.on(Node.EventType.TOUCH_END, this._onJoinTouch, this);

        director.on(EventConst.EVT_UPDATE_CLUB_LIST, this._onUpdateClubList, this);
        director.on(EventConst.EVT_REMOVE_CLUB_CHOOSEHALL, this._onRemoveChooseHall, this);
        ProtocolEventManager.on(EProtocolID.CLUB_GET_CLUBLIST_REQ, this._onClubListRespond, this, EEventListenerPriority.HIGHER);
    }

    private _onBackTouch(evt: EventTouch): void {
        console.log("back touch, ", this.node)
        director.emit(EventConst.EVT_REMOVE_CLUB_PREF);
        this.node.destroy();
    }

    private _onRemoveChooseHall(): void {
        this.node.destroy();
    }

    private _onCreateTouch(): void {
        ClubEntity.prevUI = E_CLUB_MODULE.CHOOSE_HALL;

        HomeUiMain.ins.uiModuleMgr.showUi("ClubCreatePref", "ClubCreateUI");
    }

    private _onJoinTouch(): void {
        // console.log("join");
        ClubEntity.prevUI = E_CLUB_MODULE.CHOOSE_HALL;
        HomeUiMain.ins.uiModuleMgr.showUi("ClubInputPref", "ClubInputUI");
    }

    private _onClubListRespond(event): void {
        console.log("=get club list======evt:", event)
        if (event.success && event.data?.res == "SUCCESS") {
            console.log("SUCCESS");

            ClubEntity.clubList = event.data.clubList;
            this._updateClubListHall();
        }
    }

    private _updateClubListHall() {
        this._contND.removeAllChildren();
        if (ClubEntity.clubList) {
            for (let mi = 0; mi < ClubEntity.clubList.length; mi++) {
                let mChooseND = instantiate(this._clubChooseItemND);
                mChooseND.addComponent(ClubChooseItemUI);
                let mChooseSC: ClubChooseItemUI = mChooseND.getComponent(ClubChooseItemUI);
                mChooseSC.toInit(mChooseND);
                if (LoginEnity.playerID === ClubEntity.clubList[mi].ownerId) {
                    mChooseSC.showEditBtn(true);
                    mChooseSC.leaderLB.string = "馆长：" + ClubEntity.clubList[mi].ownerName + '（你）';
                    mChooseSC.changeBtn.active = true;
                    mChooseSC.avatarTouchND.active = true;
                    mChooseSC.canChangeAvatar = true;
                } else {
                    mChooseSC.showEditBtn(false);
                    mChooseSC.leaderLB.string = "馆长：" + ClubEntity.clubList[mi].ownerName;
                    mChooseSC.changeBtn.active = false;
                    mChooseSC.avatarTouchND.active = false;
                    mChooseSC.canChangeAvatar = false;
                }
                mChooseSC.clubNameLB.string = ClubEntity.clubList[mi].name;

                mChooseSC.guimoLB.string = ClubEntity.clubList[mi].curPlayerNo + "/" + ClubEntity.clubList[mi].maxPlayerNo;
                // 1 钻 0 铜
                if (ClubEntity.clubList[mi].clubType == 1) {
                    mChooseSC.moneyND.active = true;
                    mChooseSC.moneyLB.string = ClubEntity.clubList[mi].totalAsset.toFixed(0);
                } else {
                    mChooseSC.moneyND.active = false;
                }

                mChooseSC.tablesLB.string = ClubEntity.clubList[mi].actvieTableNo + "";

                mChooseSC.clubId = ClubEntity.clubList[mi].clubId;
                let mAvatarID = ClubEntity.clubList[mi].avatarId;
                if (mAvatarID >= 1 && mAvatarID <= 6) {
                    CommUtils.loadSprite(mChooseSC.avatar.getComponent(Sprite), "ui/clubicon/clubicon_img_n" + mAvatarID);
                    mChooseSC.avatarID = mAvatarID;
                }
                this._contND.addChild(mChooseND);
                // console.log("====choose node:", mChooseND)
            }
        }
    }

    private _onUpdateClubList() {
        this.refresh();
    }

    // 更新数据用，必备
    public refresh(): void {
        this._contND.removeAllChildren();
        ClubEntity.clubList = [];
        let mParamObj = {"playerId": LoginEnity.playerID};
        ProtocolHTTPManager.load(EProtocolID.CLUB_GET_CLUBLIST_REQ, mParamObj, false);
    }

    onDestroy(): void {
        director.off(EventConst.EVT_UPDATE_CLUB_LIST, this._onUpdateClubList, this);
        director.off(EventConst.EVT_REMOVE_CLUB_CHOOSEHALL, this._onRemoveChooseHall, this);
        ProtocolEventManager.off(EProtocolID.CLUB_GET_CLUBLIST_REQ, this._onClubListRespond, this);
    }

}

export class ClubChooseItemUI extends Component {
    public _root: Node | null = null;
    public rightPatternND: Node | null = null;
    public editNameBtn: Node | null = null;
    public clubNameLB: Label | null = null;// 俱乐部名字
    public leaderLB: Label | null = null; // 馆长
    public avatarTouchND: Node | null = null;
    public avatar: Sprite | null = null; // 头像
    public avatarID: number | null = null;
    public changeBtn: Node | null = null;
    public guimoLB: Label | null = null;
    public moneyLB: Label | null = null;
    public tablesLB: Label | null = null;
    public moneyND: Node | null = null;
    public clubId: number;
    public canChangeAvatar: boolean = false;

    public toInit(node: Node) {
        this._root = node;
        this.rightPatternND = node.getChildByPath("rightPatternND");
        this.editNameBtn = node.getChildByPath("editNameBtn");
        this.clubNameLB = node.getChildByPath("clubNameLB").getComponent(Label);
        this.leaderLB = node.getChildByPath("leaderLB").getComponent(Label);
        this.avatarTouchND = node.getChildByPath("avatarND/touchND");
        this.avatar = node.getChildByPath("avatarND/avatar").getComponent(Sprite);
        this.changeBtn = node.getChildByPath("avatarND/changeBtn");
        this.guimoLB = node.getChildByPath("item1/LB").getComponent(Label);
        this.tablesLB = node.getChildByPath("item2/LB").getComponent(Label);
        this.moneyLB = node.getChildByPath("item3/LB").getComponent(Label);
        this.moneyND = node.getChildByPath("item3");

        this.avatarTouchND.on(Node.EventType.TOUCH_END, this._onChangeTouch, this);
        this.changeBtn.on(Node.EventType.TOUCH_END, this._onChangeTouch, this);
        this.editNameBtn.on(Node.EventType.TOUCH_END, this._onEditNameTouch, this);
        this.editNameBtn.active = false;
        this._root.on(Node.EventType.TOUCH_END, this._onRootTouch, this);
    }

    public showEditBtn(mCreate: boolean) {
        if (mCreate) {
            this.rightPatternND.active = false;
            this.editNameBtn.active = true;
        } else {
            this.rightPatternND.active = true;
            this.editNameBtn.active = false;
        }
    }

    private _onChangeTouch(evt: EventTouch) {
        console.log("avatartND");
        if (this.canChangeAvatar) {
            ClubEntity.modifyClubID = this.clubId;
            ClubEntity.prevUI = E_CLUB_MODULE.CHOOSE_HALL;
            ClubEntity.clubAvatarId = this.avatarID;

            HomeUiMain.ins.uiModuleMgr.showUi("ClubChangeIconPref", "ClubChangeIconUI");
        }
    }

    private _onEditNameTouch() {
        console.log("edit name touch");
        ClubEntity.modifyClubID = this.clubId;
        ClubEntity.prevUI = E_CLUB_MODULE.CHOOSE_HALL;

        HomeUiMain.ins.uiModuleMgr.showUi("ClubChangeNamePref", "ClubChangeNameUI");
    }

    private _onRootTouch() {
        console.log("mChooseSC.clubId:", this.clubId);
        this.toHide();

        ClubEntity.recentClubID = this.clubId;
        ClubEntity.prevUI = E_CLUB_MODULE.NONE;
        director.emit(EventConst.EVT_REMOVE_CLUB_CHOOSEHALL);
        HomeUiMain.ins.uiModuleMgr.showUi("ClubMainPref", "ClubMainUI");

    }

    public toShow() {
        this._root.active = true;
    }

    public toHide() {
        this._root.active = false;
    }

}
