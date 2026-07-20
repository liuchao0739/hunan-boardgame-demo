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

import {
    _decorator,
    Component,
    director,
    EventTouch,
    instantiate,
    Label,
    Node,
    resources,
    Sprite,
    SpriteFrame,
    sys
} from "cc";
import {GlobalVar} from "../../../GlobalVar";
import {CommSend} from "../../../Mahjong/Communication/CommSend";
import {App} from "../../../Module/App";
import {ClubCtrl} from "../../../Module/club/ClubCtrl";
import {E_CLUB_MODULE} from "../../../const/EnumConst";
import {EventConst} from "../../../const/EventConst";
import {ItemTableTemplate} from "../../../data/templates/item-table-data";
import {
    EEventListenerPriority,
    PlainHTTPEventManager,
    ProtocolEventManager
} from "../../../framework/event/event-management";
import {SceneMgr} from "../../../framework/mgr/SceneMgr";
import {eSysId, ViewMgr} from "../../../framework/mgr/ViewMgr";
import {PlainHTTPManager, ProtocolHTTPManager} from "../../../framework/network/http";
import {EProtocolID, protocol} from "../../../framework/network/protocol-configs";
import {CallBack} from "../../../framework/utils/CallBack";
import {ClubEntity} from "../../Entity/ClubEntity";
import {LoginEnity} from "../../Entity/Login";
import {HomeUiMain} from "../HomeUiMain";
import {ToastUI} from "../ToastUI";

const {ccclass, property} = _decorator;

@ccclass('ClubMainUI')
export class ClubMainUI extends Component {
    private _backBtn: Node | null = null;

    private _setMenu: Node | null = null;
    private _setExitND: Node | null = null;
    private _setNoteND: Node | null = null;

    private _changeBtn: Node | null = null;
    private _clubDiamondType: Node | null = null;
    private _clubNameLB: Label = null;
    private _clubIDLB: Label = null;

    private _clubMoneyND: Node | null = null;
    private _clubMoneyLB: Label = null;
    private _clubAddMoneyBtn: Node | null = null;

    private _clubShareBtn: Node | null = null;
    private _clubMailBtn: Node | null = null;
    private _clubServBtn: Node | null = null;
    private _clubSettingBtn: Node | null = null;

    private _clubContentND: Node | null = null;

    private _clubRoomBlueCellND: Node | null = null;
    private _clubRoomGreenCellND: Node | null = null;
    private _clubRoomOrangeCellND: Node | null = null;
    private _clubRoomYellowCellND: Node | null = null;

    private _bottomMenuND: Node | null = null;
    private _membersBtn: Node | null = null;
    private _currencyBtn: Node | null = null;
    private _scoreBtn: Node | null = null;
    private _shareBtn: Node | null = null;
    private _createBtn: Node | null = null;
    private _membersTip: Node | null = null;
    private _membersTipLB: Label | null = null;

    public clubRoomCellUI: ClubRoomCellUI = null;
    private _setShowFlag: boolean = false;

    onLoad(): void {
        this._backBtn = this.node.getChildByPath("cont/top/backBtn");

        this._setMenu = this.node.getChildByPath("cont/settingMenu");
        this._setExitND = this.node.getChildByPath("cont/settingMenu/exitLB");
        this._setNoteND = this.node.getChildByPath("cont/settingMenu/noticeLB");

        this._clubDiamondType = this.node.getChildByPath("cont/top/headND/clubDiamondType");
        this._clubNameLB = this.node.getChildByPath("cont/top/headND/clubNameLB").getComponent(Label);
        this._clubIDLB = this.node.getChildByPath("cont/top/clubIDLB").getComponent(Label);
        this._changeBtn = this.node.getChildByPath("cont/top/changeBtn");

        this._clubMoneyND = this.node.getChildByPath("cont/top/money");
        this._clubMoneyLB = this.node.getChildByPath("cont/top/money/clubMoneyLB").getComponent(Label);
        this._clubAddMoneyBtn = this.node.getChildByPath("cont/top/money/clubAddMoneyBtn");

        this._clubShareBtn = this.node.getChildByPath("cont/top/Layout/clubShareBtn");
        this._clubMailBtn = this.node.getChildByPath("cont/top/Layout/clubMailBtn");
        this._clubServBtn = this.node.getChildByPath("cont/top/Layout/servBtn");
        this._clubSettingBtn = this.node.getChildByPath("cont/top/Layout/clubSettingBtn");

        this._clubContentND = this.node.getChildByPath("cont/clubScrollView/view/content");

        this._clubRoomBlueCellND = this.node.getChildByPath("clonable/ClubRoomPref-blue");
        this._clubRoomGreenCellND = this.node.getChildByPath("clonable/ClubRoomPref-green");
        this._clubRoomOrangeCellND = this.node.getChildByPath("clonable/ClubRoomPref-orange");
        this._clubRoomYellowCellND = this.node.getChildByPath("clonable/ClubRoomPref-yellow");

        this._bottomMenuND = this.node.getChildByPath("cont/menu");
        this._membersBtn = this.node.getChildByPath("cont/menu/membersBtn");
        this._currencyBtn = this.node.getChildByPath("cont/menu/currencyBtn");
        this._scoreBtn = this.node.getChildByPath("cont/menu/scoreBtn");
        this._shareBtn = this.node.getChildByPath("cont/menu/shareBtn");
        this._createBtn = this.node.getChildByPath("cont/menu/createBtn");
        this._membersTip = this.node.getChildByPath("cont/menu/membersBtn/tips");
        this._membersTipLB = this.node.getChildByPath("cont/menu/membersBtn/tips/tipsLB").getComponent(Label);

        this._backBtn.on(Node.EventType.TOUCH_END, this._onBackBtnTouch, this);

        this._changeBtn.on(Node.EventType.TOUCH_END, this._onChangeBtnTouch, this);

        this._clubAddMoneyBtn.on(Node.EventType.TOUCH_END, this._onAddMoneyTouch, this);

        this._clubShareBtn.on(Node.EventType.TOUCH_END, this._onShareBtnTouch, this);
        this._clubMailBtn.on(Node.EventType.TOUCH_END, this._onMailBtnTouch, this);
        this._clubServBtn.on(Node.EventType.TOUCH_END, this._onServBtnTouch, this);
        this._clubSettingBtn.on(Node.EventType.TOUCH_END, this._onSettingBtnTouch, this);

        this._setExitND.on(Node.EventType.TOUCH_END, this._onSettingExitTouch, this);
        this._setNoteND.on(Node.EventType.TOUCH_END, this._onSettingNoteTouch, this);

        this._membersBtn.on(Node.EventType.TOUCH_END, this._onMembersTouch, this);
        this._currencyBtn.on(Node.EventType.TOUCH_END, this._onCurrencyTouch, this);
        this._scoreBtn.on(Node.EventType.TOUCH_END, this._onScoreTouch, this);
        this._shareBtn.on(Node.EventType.TOUCH_END, this._onShareTouch, this);
        this._createBtn.on(Node.EventType.TOUCH_END, this._onCreateTouch, this);

        this._setShowFlag = false;

        director.on(EventConst.EVT_UPDATE_TABLE_LIST, this._onUpdateTableList, this);
        // 新申请成员数量变更
        director.on(EventConst.EVT_UPDATE_NEWMEM_NUM, this._onUpdateNewMemNum, this);

        director.on(EventConst.EVT_REMOVE_CLUB_PREF, this._onRemoveClubPref, this);

        ProtocolEventManager.on(EProtocolID.CLUB_GET_INFOR_REQ, this._onClubGetInforRespond, this, EEventListenerPriority.HIGHER);

        ProtocolEventManager.on(EProtocolID.CLUB_GET_TABLELIST_REQ, this._onClubTableListRespond, this, EEventListenerPriority.HIGHER);
        // 获取俱乐部玩家详情
        ProtocolEventManager.on(EProtocolID.CLUB_GET_PLAYERDETAIL_REQ, this._onClubGetPlayerDetailRespond, this, EEventListenerPriority.HIGHER);

        PlainHTTPEventManager.on('promotionState', this._onPromotionStateRespond, this);
    }

    // start(): void {
    //     director.emit(EventConst.EVT_UPDATE_CLUB_MAIN_TOGGLE, true);
    // }

    private _onRemoveClubPref(): void {
        // console.log("===destroy:", this)
        this.node.destroy();
    }

    private _onBackBtnTouch(evt: EventTouch) {
        // console.log("back");
        ClubEntity.prevUI = E_CLUB_MODULE.MAIN_UI;
        HomeUiMain.ins.uiModuleMgr.showUi("ClubChooseHallPref", "ClubChooseHallUI");
        this.node.destroy();
    }

    private _onChangeBtnTouch(evt: EventTouch) {
        // console.log("change");
        // 切换俱乐部，当前的新申请成员数量消失
        ClubEntity.newApplyNum = 0;
        ClubEntity.prevUI = E_CLUB_MODULE.MAIN_UI;
        HomeUiMain.ins.uiModuleMgr.showUi("ClubChooseHallPref", "ClubChooseHallUI");
    }

    private _onAddMoneyTouch(evt: EventTouch) {
        // console.log("add");
        ClubEntity.prevUI = E_CLUB_MODULE.MAIN_UI;

        App.getInst(ViewMgr).open(eSysId.ClubStorePref, null, null, null, this);
    }

    private _onShareBtnTouch(): void {
        App.getInst(ViewMgr).open(eSysId.ClubSharePref);
    }

    private _onMailBtnTouch(evt: EventTouch) {
        console.log("mail");
    }

    // 客服
    private _onServBtnTouch(evt: EventTouch): void {
        sys.openURL(`http://livechat.qipaiplay.com/chat/start?jsvar[1]=${LoginEnity.playerID}`);
    }

    private _onSettingBtnTouch(evt: EventTouch) {
        // console.log("setting");
        this._setShowFlag = !this._setShowFlag;
        this._setMenu.active = this._setShowFlag;
    }

    private _onSettingExitTouch(evt: EventTouch): void {
        console.log("解散退出");
        if (ClubEntity.ownerId == LoginEnity.playerID) {
            // 解散
            HomeUiMain.ins.uiModuleMgr.showUi("ClubDissolvePref", "ClubDissolveUI");
        } else {
            // 退出
            HomeUiMain.ins.uiModuleMgr.showUi("ClubExitPref", "ClubExitUI");
        }
    }

    private _onSettingNoteTouch(evt: EventTouch): void {
        console.log("公告")
    }

    private _onMembersTouch(evt: EventTouch): void {
        console.log("memebers");
        this._membersTip.active = false;

        ClubEntity.prevUI = E_CLUB_MODULE.MAIN_UI;
        HomeUiMain.ins.uiModuleMgr.showUi("ClubMemManagePref", "ClubMemManageUI");
    }

    private _onCurrencyTouch(evt: EventTouch): void {
        console.log("currency");
        ClubEntity.prevUI = E_CLUB_MODULE.MAIN_UI;
        App.getInst(ViewMgr).open(eSysId.ClubMoneyHistoryPref);
    }

    private _onScoreTouch(evt: EventTouch): void {
        // console.log("牌谱战绩，暂无");
        // 调用CLUB_GET_PLAYER_TABLE_HISTORY_REQ（65016）
        HomeUiMain.ins.uiModuleMgr.showUi("HomeScorePref");
    }

    private _onShareTouch(): void {
        App.getInst(ViewMgr).open(eSysId.ClubShareDataPref);
    }

    private _onCreateTouch(evt: EventTouch): void {
        console.log("create");
        ClubEntity.prevUI = E_CLUB_MODULE.MAIN_UI;
        HomeUiMain.ins.uiModuleMgr.showUi("ClubCreateTablePref", "ClubUICreateTable");

    }

    // 更新台桌列表
    private _onUpdateTableList() {
        console.log("===_onUpdateTableList")
        this._clubContentND.removeAllChildren();
        this._updateTableList();
    }

    // 更新新申请成员数量
    private _onUpdateNewMemNum(): void {
        // this._updateNewApplyNum();
        // 获取俱乐部新申请成员数量
        App.getInst(ClubCtrl).GetClubApplicationCountReq(LoginEnity.playerID, ClubEntity.recentClubID, new CallBack((params) => {
            console.log("==params:", params)
            console.log("===count:", params.unreadCount
            )
            if (params && params.unreadCount) {
                ClubEntity.newApplyNum = params.unreadCount;
            } else {
                ClubEntity.newApplyNum = 0;
            }
            this._updateNewApplyNum();

        }, this));
    }

    private _onClubTableListRespond(event): void {
        console.log("=clubTableList======evt:", event)
        if (event.success && event.data?.res == "SUCCESS") {
            console.log("SUCCESS");
            ClubEntity.tableList = event.data.tableList;
            this._clubContentND.removeAllChildren();
            this._updateTableList();
        }
    }

    private _onClubGetInforRespond(event): void {
        // console.log("=club main :", this._root.active);
        console.log("=club get infor respond======evt:", event);
        if (event.success && event.data?.res == "SUCCESS") {
            ClubEntity.clubInfor = event.data.clubInfo;
            ClubEntity.ownerId = event.data.clubInfo.ownerId;
            ClubEntity.recentClubID = event.data.clubInfo.clubId;
            // 俱乐部类型 0--铜 1--钻
            ClubEntity.isDiamond = event.data.clubInfo.clubType == 1 ? true : false;
            this._updateClubInfor();
        }
    }

    private _updateClubInfor(): void {
        if (ClubEntity.clubInfor.ownerId == LoginEnity.playerID) {
            this._setExitND.getComponent(Label).string = "解散俱乐部";
            this._bottomMenuND.active = true;
            // this._clubMailBtn.active = true;// 暂时屏蔽，功能没有
        } else {
            this._setExitND.getComponent(Label).string = "退出俱乐部";
            this._bottomMenuND.active = false;
            // this._clubMailBtn.active = false;
        }

        // 俱乐部类型 0--铜 1--钻
        if (ClubEntity.clubInfor.clubType == 1) {
            this._clubDiamondType.active = true;
            this._currencyBtn.active = true;// 显示货币流水
            this._clubMoneyND.active = true;
            this._clubServBtn.active = true;
        } else {
            this._clubDiamondType.active = false;
            this._currencyBtn.active = false;// 不显示货币流水
            this._clubMoneyND.active = false;
            this._clubServBtn.active = false;
        }

        this._clubNameLB.string = ClubEntity.clubInfor.name;
        this._clubIDLB.string = `（ID：${ClubEntity.clubInfor.clubId}）`;

        // 请求牌桌列表
        let mParams = {
            "clubId": ClubEntity.recentClubID,
            "status": 1
        };
        ProtocolHTTPManager.load(EProtocolID.CLUB_GET_TABLELIST_REQ, mParams, false);

        PlainHTTPManager.load('promotionState', {
            club_id: ClubEntity.recentClubID,
        });
    }

    private _updateTableList() {
        console.log("=======update Table List:", ClubEntity.tableList);
        if (!ClubEntity.tableList) {
            return;
        }
        // if (ClubEntity.tableList.length > 0) {
        //     this._emptyBg.active = false;
        // }
        ClubEntity.tableList.forEach(tableInfo => {
            let cellPrototypeNode = this._clubRoomBlueCellND;

            if (ClubEntity.isDiamond) {
                if (tableInfo.bringInAmount > 100) {
                    cellPrototypeNode = this._clubRoomYellowCellND;
                } else if (tableInfo.bringInAmount > 50) {
                    cellPrototypeNode = this._clubRoomOrangeCellND;
                } else if (tableInfo.bringInAmount > 20) {
                    cellPrototypeNode = this._clubRoomGreenCellND;
                }
            }

            const mRoomCellND = instantiate(cellPrototypeNode);

            const mRoomCellSC: ClubRoomCellUI = mRoomCellND.addComponent(ClubRoomCellUI);
            mRoomCellSC.toInit(mRoomCellND);

            // 游戏模式 模式 0--四人
            let mModeRoundStr = "";
            if (tableInfo.mode === 0) {
                mModeRoundStr = "四人 • ";
            }
            // 局数 0--东风 1--东南战
            if (tableInfo.roundNo === 0) {
                mModeRoundStr += "东风"
            } else if (tableInfo.roundNo === 1) {
                mModeRoundStr += "东南";
            }

            const playerNumber = Math.min(tableInfo.players.length, 4);
            for (let index = 0; index < playerNumber; ++index) {
                mRoomCellSC["head" + (index + 1) + "IconSP"].node.active = true;
                this._updateHeadIcon(mRoomCellSC["head" + (index + 1) + "IconSP"], tableInfo.players[index].avatarId);
                mRoomCellSC["head" + (index + 1) + "NameLB"].node.parent.active = true;
                mRoomCellSC["head" + (index + 1) + "NameLB"].string = tableInfo.players[index].name;

                if (tableInfo.players[index].playerId == LoginEnity.playerID) {
                    mRoomCellSC.isPlayerInTable = true;
                }
            }
            mRoomCellSC.tablePlayerNum = tableInfo.players.length;

            mRoomCellSC.modeRoundLB.string = mModeRoundStr;
            // 游戏级别
            mRoomCellSC.levelLB.string = "等级" + tableInfo.level;
            // 带入要求，起始点数
            mRoomCellSC.withinLB.string = tableInfo.bringInAmount + "";
            // 桌子的UUID
            mRoomCellSC.tableID = tableInfo.tableId;

            // 俱乐部类型 0--铜 1--钻
            mRoomCellSC.isDiamond = ClubEntity.isDiamond; // ClubEntity.clubInfor.clubType == 1 ? true : false;

            // 俱乐部类型 0--铜 1--钻 普通不显示级别、带入
            if (ClubEntity.isDiamond) {
                mRoomCellSC.levelLB.node.active = true;
                mRoomCellSC.withinND.active = true;
                mRoomCellSC.modeRoundLB.node.setPosition(0, 40, 0);
            } else {
                mRoomCellSC.levelLB.node.active = false;
                mRoomCellSC.withinND.active = false;
                mRoomCellSC.modeRoundLB.node.setPosition(0, 18, 0);
            }

            mRoomCellSC.tableInfoData = tableInfo;

            this._clubContentND.addChild(mRoomCellND);
        });
    }

    private _updateHeadIcon(headSP: Sprite, headID: number): void {
        if (!headID) {
            return;
        }
        let conf = ItemTableTemplate.query(headID);
        let url = `ui/itemIcon/${conf.iconPath[0]}/spriteFrame`;
        resources.load(url, SpriteFrame, (err, spData) => {
            if (err) {
                console.error(err);
                return;
            }
            headSP.spriteFrame = spData;
        })
    }

    // 获取俱乐部玩家详情
    private _onClubGetPlayerDetailRespond(event): void {
        console.log("获取俱乐部玩家详情：", event);

        if (event.success && event.data.res == "SUCCESS") {
            ClubEntity.clubPlayerDetail = event.data.clubPlayerInfo;

            // 玩家个人的钱
            this._clubMoneyLB.string = ClubEntity.clubPlayerDetail?.balance.toFixed(0);
        }

    }

    private _onPromotionStateRespond(event: PlainHTTPEventManager.IPlainHTTPEvent<'promotionState'>): void {
        if (!event.success || event.response?.code !== 1) {
            return;
        }

        const available = event.response?.data?.status === 1;
        if (!available) {
            return;
        }

        this._clubShareBtn.active = true;

        if (ClubEntity.clubInfor.clubType == 1 && ClubEntity.clubInfor.ownerId == LoginEnity.playerID) {
            this._shareBtn.active = true;
        }
    }

    private _updateNewApplyNum(): void {
        if (ClubEntity.newApplyNum > 99) {
            this._membersTip.active = true;
            this._membersTipLB.string = "99+";
        } else if (ClubEntity.newApplyNum > 0) {
            this._membersTip.active = true;
            this._membersTipLB.string = ClubEntity.newApplyNum + "";
        } else {
            this._membersTip.active = false;
        }
    }

    // 更新数据用，必备
    public refresh(): void {
        director.emit(EventConst.EVT_UPDATE_CLUB_MAIN_TOGGLE, true);

        this._setShowFlag = false;

        this._setMenu.active = false;
        this._clubContentND.removeAllChildren();

        this._clubShareBtn.active = false;
        this._shareBtn.active = false;

        // 获取俱乐部信息
        let mParams = {
            "clubId": ClubEntity.recentClubID,
        };
        ProtocolHTTPManager.load(EProtocolID.CLUB_GET_INFOR_REQ, mParams, false);

        // 获取俱乐部玩家详情
        ClubEntity.clubPlayerDetail = null;
        let mParams2 = {
            "playerId": LoginEnity.playerID,
            "clubId": ClubEntity.recentClubID,// TODO:TEMP 暂时都是0 ClubEntity.recentClubID
            "startTime": 0,
            "endTime": 0
        };
        ProtocolHTTPManager.load(EProtocolID.CLUB_GET_PLAYERDETAIL_REQ, mParams2, false);

        // 获取俱乐部新申请成员数量
        App.getInst(ClubCtrl).GetClubApplicationCountReq(LoginEnity.playerID, ClubEntity.recentClubID, new CallBack((params) => {
            console.log("==params:", params)
            console.log("===count:", params.unreadCount
            )
            if (params && params.unreadCount) {
                ClubEntity.newApplyNum = params.unreadCount;
            } else {
                ClubEntity.newApplyNum = 0;
            }
            this._updateNewApplyNum();

        }, this));
    }

    onDestroy(): void {
        director.off(EventConst.EVT_UPDATE_TABLE_LIST, this._onUpdateTableList, this);
        // 新申请成员数量变更
        director.off(EventConst.EVT_UPDATE_NEWMEM_NUM, this._onUpdateNewMemNum, this);

        director.off(EventConst.EVT_REMOVE_CLUB_PREF, this._onRemoveClubPref, this);

        director.emit(EventConst.EVT_UPDATE_CLUB_MAIN_TOGGLE, false);

        ProtocolEventManager.off(EProtocolID.CLUB_GET_INFOR_REQ, this._onClubGetInforRespond, this);

        ProtocolEventManager.off(EProtocolID.CLUB_GET_TABLELIST_REQ, this._onClubTableListRespond, this);
        // 获取俱乐部玩家详情
        ProtocolEventManager.off(EProtocolID.CLUB_GET_PLAYERDETAIL_REQ, this._onClubGetPlayerDetailRespond, this);

        PlainHTTPEventManager.off('promotionState', this._onPromotionStateRespond, this);
    }
}

/**
 * 俱乐部主页--房间
 */
export class ClubRoomCellUI extends Component {
    public root: Node = null;
    public modeRoundLB: Label = null;
    public levelLB: Label = null;
    public withinND: Node = null;
    public withinLB: Label = null;
    public head1AddBtn: Node = null;
    public head1IconSP: Sprite = null;
    public head1NameLB: Label = null;
    public head2AddBtn: Node = null;
    public head2IconSP: Sprite = null;
    public head2NameLB: Label = null;
    public head3AddBtn: Node = null;
    public head3IconSP: Sprite = null;
    public head3NameLB: Label = null;
    public head4AddBtn: Node = null;
    public head4IconSP: Sprite = null;
    public head4NameLB: Label = null;
    public tableID: string = null;
    public btnRuleND: Node | null = null;
    public btnAnyCloseND: Node | null = null;
    public btnCloseND: Node | null = null;

    // 是否钻石俱乐部
    public isDiamond: boolean = false;
    public tableInfoData: protocol.club.TableInfo = null;
    // 台桌玩家数量
    public tablePlayerNum: number = 0;
    // 玩家自己是否在牌桌玩家列表中，本不需要，现在Jack与Martin服务器数据不一致
    public isPlayerInTable: boolean = false;

    private _longTouch: boolean = false;
    private _longTouchTimer: number = -1;

    public toInit(mNode: Node) {
        this.root = mNode;
        this.modeRoundLB = mNode.getChildByPath("modeRoundLB").getComponent(Label);
        this.levelLB = mNode.getChildByPath("levelLB").getComponent(Label);
        this.withinND = mNode.getChildByPath("withND");
        this.withinLB = mNode.getChildByPath("withND/withinLB").getComponent(Label);
        this.head1AddBtn = mNode.getChildByPath("head1/addBtn");
        this.head1IconSP = mNode.getChildByPath("head1/headMask/iconSP").getComponent(Sprite);
        this.head1NameLB = mNode.getChildByPath("head1/Node/nameLB").getComponent(Label);
        this.head2AddBtn = mNode.getChildByPath("head2/addBtn");
        this.head2IconSP = mNode.getChildByPath("head2/headMask/iconSP").getComponent(Sprite);
        this.head2NameLB = mNode.getChildByPath("head2/Node/nameLB").getComponent(Label);
        this.head3AddBtn = mNode.getChildByPath("head3/addBtn");
        this.head3IconSP = mNode.getChildByPath("head3/headMask/iconSP").getComponent(Sprite);
        this.head3NameLB = mNode.getChildByPath("head3/Node/nameLB").getComponent(Label);
        this.head4AddBtn = mNode.getChildByPath("head4/addBtn");
        this.head4IconSP = mNode.getChildByPath("head4/headMask/iconSP").getComponent(Sprite);
        this.head4NameLB = mNode.getChildByPath("head4/Node/nameLB").getComponent(Label);
        this.btnRuleND = mNode.getChildByPath("btnRule");
        this.btnAnyCloseND = mNode.getChildByPath("btnAnyClose");
        this.btnCloseND = mNode.getChildByPath("btnClose");

        // console.log("============btnclose:", this.btnCloseND);
        this.head1AddBtn.on(Node.EventType.TOUCH_END, this._onHead1Touch, this);
        this.head2AddBtn.on(Node.EventType.TOUCH_END, this._onHead2Touch, this);
        this.head3AddBtn.on(Node.EventType.TOUCH_END, this._onHead3Touch, this);
        this.head4AddBtn.on(Node.EventType.TOUCH_END, this._onHead4Touch, this);
        this.root.on(Node.EventType.TOUCH_END, this._onRootTouch, this);
        this.btnRuleND.on(Node.EventType.TOUCH_END, this._onRuleTouch, this);
        this.btnCloseND.on(Node.EventType.TOUCH_END, this._onCloseTouch, this);
        this.btnAnyCloseND.on(Node.EventType.TOUCH_END, this._onAnyCloseTouch, this);

        if (ClubEntity.clubInfor.ownerId == LoginEnity.playerID) {
            this.root.on(Node.EventType.TOUCH_START, this._onRootStart, this);
        }

        this._longTouch = false;
        this.btnAnyCloseND.active = false;
        this.btnCloseND.active = false;
    }

    private _onAnyCloseTouch(): void {
        this.btnCloseND.active = false;
        this.btnAnyCloseND.active = false;
        this._longTouchTimer = -1;
    }

    private _onCloseTouch(evt: EventTouch): void {
        console.log("解散")
        HomeUiMain.ins.uiModuleMgr.showUi("ClubCommitPref", "ClubInputUI");

        ClubEntity.dissClubID = this.tableID;
        // // 获取俱乐部新申请成员数量
        // App.getInst(ClubCtrl).GetClubCloseTable(ClubEntity.recentClubID, LoginEnity.playerID, this.tableID, new CallBack((params) => {
        //     console.log("==解散params:", params)
        // }, this));
    }

    private _onRootStart(evt: EventTouch): void {
        this._longTouch = false;
        this._longTouchTimer = setTimeout(this._onLongTouch.bind(this), 2000);
    }

    private _onLongTouch(): void {
        this.btnCloseND.active = true;
        this.btnAnyCloseND.active = true;
        this._longTouch = true;
    }

    private _onRootTouch(evt: EventTouch): void {
        console.log("root加入：", this.tableID);
        if (this._longTouchTimer > 0) {
            clearTimeout(this._longTouchTimer);
        }

        if (!this._longTouch) {
            this._sendEnterRoom();
        }
    }

    private _onHead1Touch(evt: EventTouch): void {
        console.log("加入1：", this.tableID);

        this._sendEnterRoom();
    }

    private _onHead2Touch(evt: EventTouch): void {
        console.log("加入2：", this.tableID);
        this._sendEnterRoom();
    }

    private _onHead3Touch(evt: EventTouch): void {
        console.log("加入3：", this.tableID);
        this._sendEnterRoom();
    }

    private _onHead4Touch(evt: EventTouch): void {
        console.log("加入4：", this.tableID);
        this._sendEnterRoom();
    }

    private _onRuleTouch(evt: EventTouch): void {
        console.log("规则界面");
        ClubEntity.currTableData = this.tableInfoData;
        HomeUiMain.ins.uiModuleMgr.showUi("ClubRulePref", "ClubRuleUI");

    }

    private _sendEnterRoom() {
        // 游戏服未连接情况下，不处理
        // if (!WebSocketMgr.Inst.isConnect()) {
        //     App.getInst(ToastUI).showTips("网络连接失败，请检查网络或稍后再试");
        //     WebSocketMgr.Inst.reset();
        //     WebSocketMgr.Inst.newConnect(LoginEnity.serverURL);
        //     WebSocketMgr.Inst.setExpireInterval(15);
        //     return;
        // }

        // 玩家在牌局中，直接进入 或不满四人
        if (this.isPlayerInTable || this.tablePlayerNum < 4) {
            // 钻石俱乐部判断带入金币
            if (this.isDiamond) {
                console.log("balance:", ClubEntity.clubPlayerDetail.balance, "==with:", this.withinLB.string);
                if (ClubEntity.clubPlayerDetail?.balance < parseFloat(this.withinLB.string)) {
                    App.getInst(ToastUI).showTips("金币不足");
                    return;
                }
            }
            if (this.tableID) {
                GlobalVar.willLoadMoudle = null;
                ClubEntity.enterRoomUUID = this.tableID;
                SceneMgr.runScene("Mahjong", false, () => {
                    CommSend.enterRoomUUID(ClubEntity.enterRoomUUID, ClubEntity.recentClubID);
                }, this);
            }
        } else if (this.tablePlayerNum >= 4) {
            App.getInst(ToastUI).showTips("牌桌人数已满");
            return;
        }
    }

    public refresh() {

    }

    public toShow() {
        this.root.active = true;
    }

    public toHide() {
        this.root.active = false;
    }

}
