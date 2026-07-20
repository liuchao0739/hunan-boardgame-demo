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

import {_decorator, Component, director, instantiate, Label, Node, Sprite, Toggle, Vec3} from "cc";
import {EProtocolID} from "../../../framework/network/protocol-configs";
import {ClubEntity} from "../../Entity/ClubEntity";
import {LoginEnity} from "../../Entity/Login";
import {EEventListenerPriority, ProtocolEventManager} from "../../../framework/event/event-management";
import {ProtocolHTTPManager} from "../../../framework/network/http";
import {EventConst} from "../../../const/EventConst";
import {CommUtils} from "../../../framework/utils/CommUtils";
import {TimeUtils} from "../../../framework/utils/time-utils";
import {HomeUiMain} from "../HomeUiMain";
import {E_CLUB_MODULE} from "../../../const/EnumConst";
import {App} from "../../../Module/App";
import {ClubCtrl} from "../../../Module/club/ClubCtrl";
import {CallBack} from "../../../framework/utils/CallBack";

const {ccclass, property} = _decorator;

@ccclass('ClubMemManageUI')
export class ClubMemManageUI extends Component {
    private _backBtn: Node | null = null;
    private _inviteBtn: Node | null = null;
    private _titleND: Node | null = null;
    private _scrollND: Node | null = null;
    private _viewND: Node | null = null;
    private _memberLB: Label | null = null;
    private _optionLB: Label | null = null;
    private _optionBtn: Node | null = null;
    private _optionCont: Node | null = null;
    private _memListTog: Toggle | null = null;
    private _newMemTog: Toggle | null = null;
    private _memberCont: Node | null = null;
    private _memberItemND: Node | null = null;
    private _newMemTips: Node | null = null;
    private _newMemTipsLB: Label | null = null;
    private _currToggleInd: number = 0;

    onLoad(): void {
        this._backBtn = this.node.getChildByPath("backBtn");
        this._inviteBtn = this.node.getChildByPath("inviteBtn");
        this._titleND = this.node.getChildByPath("title");
        this._scrollND = this.node.getChildByPath("ScrollView");
        this._viewND = this.node.getChildByPath("ScrollView/view");
        this._memberLB = this.node.getChildByPath("title/memberLB").getComponent(Label);
        this._optionBtn = this.node.getChildByPath("title/option/optionBtn");
        this._optionLB = this.node.getChildByPath("title/option/optionLB").getComponent(Label);
        this._optionCont = this.node.getChildByPath("title/option/optionCont");
        this._memListTog = this.node.getChildByPath("ToggleGroup/memListTog").getComponent(Toggle);
        this._newMemTog = this.node.getChildByPath("ToggleGroup/newMemTog").getComponent(Toggle);
        this._newMemTips = this.node.getChildByPath("ToggleGroup/newMemTog/tips");
        this._newMemTipsLB = this.node.getChildByPath("ToggleGroup/newMemTog/tips/tipsLB").getComponent(Label);

        this._memberCont = this.node.getChildByPath("ScrollView/view/content");
        this._memberItemND = this.node.getChildByPath("ScrollView/view/content/ClubMemItem");

        this._backBtn.on(Node.EventType.TOUCH_END, this._onBackTouch, this);
        this._inviteBtn.on(Node.EventType.TOUCH_END, this._onInviteTouch, this);
        this._optionBtn.on(Node.EventType.TOUCH_END, this._onOptionTouch, this);
        this._memListTog.node.on(Node.EventType.TOUCH_END, this._onMemListTouch, this);
        this._newMemTog.node.on(Node.EventType.TOUCH_END, this._onNewMemTouch, this);
        // console.log("===children:",  this._optionCont.children);
        for (let mi = 0; mi < this._optionCont.children.length; mi++) {
            this._optionCont.children[mi].on(Node.EventType.TOUCH_END, this._onOptionContChildTouch, this);
        }

        // 新申请成员数量变更
        director.on(EventConst.EVT_UPDATE_NEWMEM_NUM, this._onUpdateNewMemNum, this);
        ProtocolEventManager.on(EProtocolID.CLUB_GET_PLAYERLIST_REQ, this._onPlayerListRespond, this, EEventListenerPriority.HIGHER);
        // ProtocolEventManager.on(EProtocolID.MAIL_LIST, this._onMailListRespond, this, EEventListenerPriority.HIGHER);
        ProtocolEventManager.on(EProtocolID.MAIL_GET_CLUBAPPLICATION_LIST, this._onClubMailListRespond, this, EEventListenerPriority.HIGHER);

        ProtocolEventManager.on(EProtocolID.CLUB_DECIDE_JOIN_REQ, this._onDecideJoinRespond, this, EEventListenerPriority.HIGHER);
        director.on(EventConst.EVT_UPDATE_NEWMEM_LIST, this._onUpdateNewMemList, this);
    }

    private _onBackTouch(): void {
        this.node.destroy();
    }

    private _onInviteTouch(): void {

    }

    private _onOptionTouch(): void {
        console.log("dddd")
        this._optionCont.active = !this._optionCont.active;
        if (this._optionCont.active) {
            this._optionCont.children[this._currToggleInd].getComponent(Toggle).isChecked = true;
        }
    }

    // 成员列表按下
    private _onMemListTouch(): void {
        console.log("成员列表按下");
        this._titleND.active = true;
        this._scrollND.position = new Vec3(0, 126, 0);
        // this._viewND.getComponent(UITransform).contentSize.set(1060, 400);
        this._memberCont.removeAllChildren();
        let mParams = {"clubId": ClubEntity.recentClubID};
        ProtocolHTTPManager.load(EProtocolID.CLUB_GET_PLAYERLIST_REQ, mParams, false);
    }

    // 新成员界面按下
    private _onNewMemTouch(): void {
        console.log("新成员界面");

        this._newMemTips.active = false;
        this._newMemTipsLB.string = "";
        ClubEntity.newApplyNum = 0;

        this._titleND.active = false;
        this._scrollND.position = new Vec3(0, 216, 0);
        // this._viewND.getComponent(UITransform).contentSize.set(1060, 490);

        this._memberCont.removeAllChildren();
        // let mParams = { "roleId":LoginEnity.playerID,
        //                 type:protocol.mail.MailType.CLUBAPPLICATION,
        //                 };
        // ProtocolHTTPManager.load(EProtocolID.MAIL_LIST, mParams, false);

        let mParams = {
            "roleId": LoginEnity.playerID,
            "clubId": ClubEntity.recentClubID,
        };
        ProtocolHTTPManager.load(EProtocolID.MAIL_GET_CLUBAPPLICATION_LIST, mParams, false);
    }

    private _onOptionContChildTouch(event): void {
        console.log("event t ouch:", event);
        let mType: number = 0;
        if (event.currentTarget.name == "Toggle1") {
            this._optionLB.string = "服务费";
            mType = 1;
            this._optionCont.children[0].getComponent(Toggle).isChecked = true;
        } else if (event.currentTarget.name == "Toggle2") {
            this._optionLB.string = "盈亏";
            mType = 2;
            this._optionCont.children[1].getComponent(Toggle).isChecked = true;
        } else if (event.currentTarget.name == "Toggle3") {
            this._optionLB.string = "总对局数";
            mType = 3;
            this._optionCont.children[2].getComponent(Toggle).isChecked = true;
        } else if (event.currentTarget.name == "Toggle4") {
            this._optionLB.string = "最后登录时间";
            mType = 4;
            this._optionCont.children[3].getComponent(Toggle).isChecked = true;
        } else if (event.currentTarget.name == "Toggle5") {
            this._optionLB.string = "最后游戏时间";
            mType = 5;
            this._optionCont.children[4].getComponent(Toggle).isChecked = true;
        }
        this._currToggleInd = mType - 1;
        this._optionCont.active = false;

        this._updateMemberListFee(mType);
    }

    private _onClubMailListRespond(event): void {
        console.log("=get mail list======evt:", event);
        if (event.success) {
            ClubEntity.applyMailList = event.data.list;
            this._updateNewMemList();
        }
    }

    private _onPlayerListRespond(event) {
        console.log("=get player list======evt:", event)

        if (event.success && event.data?.res == "SUCCESS") {
            ClubEntity.ownerId = event.data.ownerId;
            ClubEntity.playerList = event.data.playerList;
            this._memberCont.removeAllChildren();
            this._updateMemeberList();
        }
    }

    private _onDecideJoinRespond(event): void {
        console.log("==decide join evt:", event);

        if (event.success && event.data.res == "SUCCESS") {
            director.emit(EventConst.EVT_UPDATE_NEWMEM_LIST);
        }
    }

    private _updateMemeberList() {
        if (ClubEntity.playerList) {
            // 管理员排在最上面
            ClubEntity.playerList.sort((a, b) => {
                if (b.playerId == ClubEntity.ownerId) {
                    return 1;
                } else {
                    return -1;
                }
            });
            for (let mi = 0; mi < ClubEntity.playerList.length; mi++) {
                let mMemberND = instantiate(this._memberItemND);
                mMemberND.addComponent(ClubMemItemUI);
                let mMemberSC: ClubMemItemUI = mMemberND.getComponent(ClubMemItemUI);
                mMemberSC.toInit(mMemberND);
                mMemberSC.memSubND.active = true;
                mMemberSC.newSubND.active = false;

                if (ClubEntity.ownerId === ClubEntity.playerList[mi].playerId) {
                    mMemberSC.managerND.active = true;
                } else {
                    mMemberSC.managerND.active = false;
                }

                mMemberSC.playerID = ClubEntity.playerList[mi].playerId;
                mMemberSC.needShowDetail = true;
                mMemberSC.updateHeadSp(ClubEntity.playerList[mi].avatarId + "");
                mMemberSC.nameLB.string = ClubEntity.playerList[mi].name;
                mMemberSC.idLB.string = "ID：" + ClubEntity.playerList[mi].playerId + "";
                mMemberSC.lineLB.string = ClubEntity.playerList[mi].isOnline ? "在线" : "离线";
                mMemberSC.balanceLB.string = ClubEntity.playerList[mi].balance.toFixed(1);

                mMemberSC.dataFee = ClubEntity.playerList[mi].fee;
                mMemberSC.dataYingKui = ClubEntity.playerList[mi].ledgerBalance;
                mMemberSC.dataTotalRound = ClubEntity.playerList[mi].totalRoundNo;
                mMemberSC.dataLastLogin = ClubEntity.playerList[mi].lastLoginTime;
                mMemberSC.dataLastPlay = ClubEntity.playerList[mi].lastPlayTime;


                // 俱乐部类型 0--铜 1--钻
                if (ClubEntity.clubInfor.clubType == 1) {
                    mMemberSC.chipND.active = true;
                    mMemberSC.feeLB.string = ClubEntity.playerList[mi].fee.toFixed(1);
                } else {
                    mMemberSC.chipND.active = false;
                    mMemberSC.feeLB.string = ClubEntity.playerList[mi].totalRoundNo + "";
                }

                this._memberCont.addChild(mMemberND);
            }
        }

    }

    // 更新成员列表的fee显示
    // 1--服务费 2--盈亏 3--总对局数 4--最后登录时间 5--最后游戏时间
    private _updateMemberListFee(mType: number): void {
        for (let mi = 0; mi < this._memberCont.children.length; mi++) {
            let mMemberSC: ClubMemItemUI = this._memberCont.children[mi].getComponent(ClubMemItemUI);
            if (mMemberSC) {
                if (mType == 1) {
                    mMemberSC.feeLB.string = ClubEntity.playerList[mi].fee.toFixed(1);
                } else if (mType == 2) {
                    mMemberSC.feeLB.string = ClubEntity.playerList[mi].ledgerBalance.toFixed(1);
                } else if (mType == 3) {
                    mMemberSC.feeLB.string = ClubEntity.playerList[mi].totalRoundNo + "";
                } else if (mType == 4) {
                    mMemberSC.feeLB.string = TimeUtils.formatDate(ClubEntity.playerList[mi].lastLoginTime, "-", true);
                } else if (mType == 5) {
                    if (0 == ClubEntity.playerList[mi].lastPlayTime) {
                        mMemberSC.feeLB.string = "--";
                    } else {
                        mMemberSC.feeLB.string = TimeUtils.formatDate(ClubEntity.playerList[mi].lastPlayTime, "-", true);
                    }

                }
            }
        }
    }

    private _updateNewMemList() {
        if (ClubEntity.applyMailList) {
            for (let mi = 0; mi < ClubEntity.applyMailList.length; mi++) {
                let mMemberND = instantiate(this._memberItemND);
                mMemberND.addComponent(ClubMemItemUI);
                let mMemberSC: ClubMemItemUI = mMemberND.getComponent(ClubMemItemUI);
                mMemberSC.toInit(mMemberND);
                mMemberSC.managerND.active = false;
                mMemberSC.memSubND.active = false;
                mMemberSC.newSubND.active = true;


                let mContObj = JSON.parse(ClubEntity.applyMailList[mi].templateData);
                // console.log("=======apply cont:", mContObj);
                mMemberSC.needShowDetail = false;
                mMemberSC.nameLB.string = mContObj.PlayerName;
                mMemberSC.idLB.string = mContObj.PlayerId + "";
                mMemberSC.reasonLB.string = mContObj.Comment;
                mMemberSC.updateHeadSp(mContObj.AvatarId + "");
                mMemberSC.applicationId = ClubEntity.applyMailList[mi].index;
                this._memberCont.addChild(mMemberND);
            }
        }

    }

    // 更新新申请成员列表
    private _onUpdateNewMemList() {
        this._onNewMemTouch();
    }

    // 更新新申请成员数量
    private _onUpdateNewMemNum(): void {
        // this._updateNewApplyNum();
        // 获取俱乐部新申请成员数量
        App.getInst(ClubCtrl).GetClubApplicationCountReq(LoginEnity.playerID, ClubEntity.recentClubID, new CallBack((params) => {
            // console.log("==params:", params)
            // console.log("===count:", params.unreadCount)
            if (params && params.unreadCount) {
                ClubEntity.newApplyNum = params.unreadCount;
            } else {
                ClubEntity.newApplyNum = 0;
            }
            this._updateNewApplyNum();

        }, this));
    }

    private _updateNewApplyNum(): void {
        if (ClubEntity.newApplyNum > 99) {
            this._newMemTips.active = true;
            this._newMemTipsLB.string = "99+";
        } else if (ClubEntity.newApplyNum > 0) {
            this._newMemTips.active = true;
            this._newMemTipsLB.string = ClubEntity.newApplyNum + "";
        } else {
            this._newMemTips.active = false;
        }
    }

    // 更新数据用，必备
    public refresh(): void {
        this._memberLB.string = ClubEntity.clubInfor.curPlayerNo + "/" + ClubEntity.clubInfor.maxPlayerNo;
        this._memberCont.removeAllChildren();

        this._updateNewApplyNum();

        // 俱乐部类型 0--铜 1--钻
        // 普通俱乐部不显示[服务费]、[盈亏]，只显示[总对局数]、[最后登录时间]、[最后游戏时间]
        if (ClubEntity.isDiamond) {
            this._optionCont.children[0].active = true;
            this._optionCont.children[1].active = true;
            this._currToggleInd = 0;
        } else {
            this._optionCont.children[0].active = false;
            this._optionCont.children[1].active = false;
            this._optionLB.string = "总对局数";
            this._currToggleInd = 2;
        }

        this._memListTog.isChecked = true;
        let mParams = {"clubId": ClubEntity.recentClubID};
        ProtocolHTTPManager.load(EProtocolID.CLUB_GET_PLAYERLIST_REQ, mParams, false);
    }

    onDestroy(): void {
        // 新申请成员数量变更
        director.off(EventConst.EVT_UPDATE_NEWMEM_NUM, this._onUpdateNewMemNum, this);
        director.off(EventConst.EVT_UPDATE_NEWMEM_LIST, this._onUpdateNewMemList, this);
        ProtocolEventManager.off(EProtocolID.CLUB_GET_PLAYERLIST_REQ, this._onPlayerListRespond, this);
        // ProtocolEventManager.off(EProtocolID.MAIL_LIST, this._onMailListRespond, this);
        ProtocolEventManager.off(EProtocolID.MAIL_GET_CLUBAPPLICATION_LIST, this._onClubMailListRespond, this);

        ProtocolEventManager.off(EProtocolID.CLUB_DECIDE_JOIN_REQ, this._onDecideJoinRespond, this);
    }

}

export class ClubMemItemUI extends Component {
    public root: Node | null = null;
    public managerND: Node | null = null;
    public headSP: Sprite | null = null;
    public nameLB: Label | null = null;
    public idLB: Label | null = null;
    public memSubND: Node | null = null;
    public lineLB: Label | null = null;
    public chipND: Node | null = null;
    public balanceLB: Label | null = null;
    public feeLB: Label | null = null;
    public newSubND: Node | null = null;
    public reasonLB: Label | null = null;
    public agreeBtn: Node | null = null;
    public rejectBtn: Node | null = null;
    public applicationId: string | null = null;// 申请ID,同意或拒绝时使用
    public needShowDetail: boolean = false;// 是否需要展示详情信息

    public dataFee: number = 0;    // 服务费
    public dataYingKui: number = 0;// 盈亏
    public dataTotalRound: number = 0;// 总对局数
    public dataLastLogin: number = 0; // 最后登录时间
    public dataLastPlay: number = 0; // 最后游戏时间
    public playerID: number = 0;

    public toInit(node: Node) {
        this.root = node;
        this.managerND = node.getChildByPath("managerND");
        this.headSP = node.getChildByPath("head/mask/headSP").getComponent(Sprite);
        this.nameLB = node.getChildByPath("nameLB").getComponent(Label);
        this.idLB = node.getChildByPath("idLB").getComponent(Label);
        this.memSubND = node.getChildByPath("memSubND");
        this.lineLB = node.getChildByPath("memSubND/lineLB").getComponent(Label);
        this.feeLB = node.getChildByPath("memSubND/feeLB").getComponent(Label);
        this.chipND = node.getChildByPath("memSubND/chip");
        this.balanceLB = node.getChildByPath("memSubND/chip/balanceLB").getComponent(Label);
        this.newSubND = node.getChildByPath("newSubND");
        this.reasonLB = node.getChildByPath("newSubND/reason/mask/reasonLB").getComponent(Label);
        this.agreeBtn = node.getChildByPath("newSubND/agreeBtn");
        this.rejectBtn = node.getChildByPath("newSubND/rejectBtn");
        this.agreeBtn.once(Node.EventType.TOUCH_END, this._onAgreeTouch, this);
        this.rejectBtn.once(Node.EventType.TOUCH_END, this._onRejectTouch, this);
        this.root.on(Node.EventType.TOUCH_END, this._onNodeTouch, this);
    }

    public refresh() {
        this.memSubND.active = true;
        this.newSubND.active = false;
    }

    public updateHeadSp(mPlayerIconId: string) {
        // 头像
        CommUtils.updatePlayerHeadIcon(this.headSP, parseInt(mPlayerIconId));
    }

    private _onAgreeTouch(): void {
        console.log("agree 同意：", this.idLB.string, this);

        let mParams = {
            clubId: ClubEntity.recentClubID,
            playerId: parseInt(this.idLB.string),
            decision: true,
            ownerId: ClubEntity.ownerId,
            applicationId: this.applicationId
        };

        ProtocolHTTPManager.load(EProtocolID.CLUB_DECIDE_JOIN_REQ, mParams, false);
    }

    private _onRejectTouch(): void {
        console.log("reject 拒绝：", this.idLB.string, this);
        let mParams = {
            clubId: ClubEntity.recentClubID,
            playerId: parseInt(this.idLB.string),
            decision: false,
            ownerId: ClubEntity.ownerId,
            applicationId: this.applicationId
        };

        ProtocolHTTPManager.load(EProtocolID.CLUB_DECIDE_JOIN_REQ, mParams, false);
    }

    private _onNodeTouch(): void {
        if (this.needShowDetail) {
            ClubEntity.playerDetailID = this.playerID;
            ClubEntity.prevUI = E_CLUB_MODULE.MEM_MANAGER;
            HomeUiMain.ins.uiModuleMgr.showUi("ClubMemDetailInforPref", "ClubMemDetailInforUI");
        }
    }

    public toShow() {
        this.root.active = true;
    }

    public toHide() {
        this.root.active = false;
    }
}

