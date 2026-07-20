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

import {director, EventTouch, Label, Node, Sprite} from "cc";
import {GlobalVar} from "../../GlobalVar";
import {Player} from "../../Mahjong/World/Entity/Player/Player";
import {App} from "../../Module/App";
import {AppVar} from "../../Module/AppVar";
import {ItemCom} from "../../Module/UICommpont/ItemCom";
import {module} from "../../Module/module-config";
import {RoleCtrl} from "../../Module/role/RoleCtrl";
import {EStoreType} from "../../Module/store/ShopCtrl";
import {E_CLUB_MODULE} from "../../const/EnumConst";
import {EventConst} from "../../const/EventConst";
import {EEventListenerPriority, ProtocolEventManager} from "../../framework/event/event-management";
import {eSysId, ViewMgr} from "../../framework/mgr/ViewMgr";
import {ProtocolHTTPManager} from "../../framework/network/http";
import {EProtocolID, protocol} from "../../framework/network/protocol-configs";
import {NodePicker} from "../../framework/ui/NodePicker";
import {ClubEntity} from "../Entity/ClubEntity";
import {LoginEnity} from "../Entity/Login";
import {HomeUiMain} from "./HomeUiMain";
import {ToastUI} from "./ToastUI";
import { CommSend } from "../../Mahjong/Communication/CommSend";
import {SceneMgr} from "../../framework/mgr/SceneMgr";

let IS_AD_SHOWN: boolean = true;

export class HomeUiMainHall {
    public root: Node = null;

    private _gameBG: Node = null;
    private avatar: Node = null;
    public avatarSP: Sprite = null;
    public avatarItem: ItemCom;
    public nickNameLB: Label = null;
    public idLB: Label = null;

    public coinLB: Label = null;// 铜币
    public jadeLB: Label = null;
    public rightNormNode: Node = null;
    public roomMahjong: Node = null;
    public roomFriendly: Node = null;
    public rightClubNode: Node = null;
    public buttonBg: Node = null;
    public createND: Node = null;
    public joinND: Node = null;
    public backBtn: Node = null;

    public player: Player = null;
    private _isClubInputShow: boolean = false;
    private _isClubMainShow: boolean = false;
    private _btnRoomMahjongCanTouch: boolean = true;

    private nodePicker: NodePicker;

    public toInit(node: Node) {
        this.root = node.getChildByPath("HallUI");

        this.nodePicker = this.root.getComponent(NodePicker);
        this.avatarItem = this.nodePicker.getChildNode(`avatarImg`).getComponent(ItemCom);
        //头像框区域
        this.avatar = node.getChildByPath("HallUI/avatar");

        // 头像
        this.avatarSP = this.nodePicker.getChildNode(`avatarImg`).getComponent(Sprite);
        this.nickNameLB = node.getChildByPath("HallUI/avatar/nameLB").getComponent(Label);
        this.idLB = node.getChildByPath("HallUI/avatar/idLB").getComponent(Label);

        // 商店 铜币 勾玉
        this.coinLB = node.getChildByPath("HallUI/coin/coinLB").getComponent(Label);
        this.jadeLB = node.getChildByPath("HallUI/jade/jadeLB").getComponent(Label);

        const addCopperButtonNode = this.root.getChildByPath("coin/coinBtn");
        const addMagatamaButtonNode = this.root.getChildByPath("jade/jadeBtn");
        if (module.isAvailable("inAppPurchase")) {
            addCopperButtonNode.active = true;
            addMagatamaButtonNode.active = true;

            addCopperButtonNode.on(Node.EventType.TOUCH_END, this._onCoinBtnTouch, this);
            addMagatamaButtonNode.on(Node.EventType.TOUCH_END, this._onJadeBtnTouch, this);
        } else {
            addCopperButtonNode.active = false;
            addMagatamaButtonNode.active = false;
        }

        this.root.getChildByPath("emailBtn").on(Node.EventType.TOUCH_END, this._onEmailBtnTouch, this);
        this.root.getChildByPath("settingsBtn").on(Node.EventType.TOUCH_END, this._settingsBtnTouch, this);

        this.rightNormNode = node.getChildByPath("HallUI/rightNormNode");
        this.roomMahjong = node.getChildByPath("HallUI/rightNormNode/roomMahjong");
        this.roomFriendly = node.getChildByPath("HallUI/rightNormNode/roomFriendly");
        this.rightClubNode = node.getChildByPath("HallUI/rightClubNode");
        this.buttonBg = node.getChildByPath("HallUI/buttonbg");
        this.createND = node.getChildByPath("HallUI/rightClubNode/create");
        this.joinND = node.getChildByPath("HallUI/rightClubNode/join");
        this.backBtn = node.getChildByPath("HallUI/rightClubNode/back");

        this.avatar.on(Node.EventType.TOUCH_END, this._onOpenPrerfileTouch, this);
        this.roomMahjong.on(Node.EventType.TOUCH_END, this._roomMahjongTouch, this);
        this.roomFriendly.on(Node.EventType.TOUCH_END, this._roomFriendlyTouch, this);
        this.createND.on(Node.EventType.TOUCH_END, this._onCreateTouch, this);
        this.joinND.on(Node.EventType.TOUCH_END, this._onJoinTouch, this);
        this.backBtn.on(Node.EventType.TOUCH_END, this._onClubBackTouch, this);

        // 大厅事件
        director.on(EventConst.EVT_GET_ROOM_ID, this._onGetRoomID, this);

        // 公告
        this.root.getChildByPath("buttonbg/boardBtn").on(Node.EventType.TOUCH_END, this._boardBtnTouch, this);
        // 牌谱
        this.root.getChildByPath("buttonbg/instructionBtn").on(Node.EventType.TOUCH_END, this._instBtnTouch, this);
        // 商店
        this.root.getChildByPath("buttonbg/storeBtn").on(Node.EventType.TOUCH_END, this._storeBtnTouch, this);
        // 快速开始
        this.root.getChildByPath("buttonbg/quickStartBtn").on(Node.EventType.TOUCH_END, this._quickStartBtnTouch, this);

        this._btnRoomMahjongCanTouch = true;
        director.on(RoleCtrl.ROLE_NAME_UPDATE, this._updateNickName, this);
        director.on(EventConst.UPDATE_CLUB_INPUT_TOGGLE, this._updateClubInputToggle, this);
        director.on(EventConst.EVT_UPDATE_CLUB_MAIN_TOGGLE, this._updateClubMainToggle, this);

        ProtocolEventManager.on(EProtocolID.CLUB_GET_PLAYER_INFOR_REQ, this._onClubPlayerInforRespond, this, EEventListenerPriority.HIGHER);
        // 获取俱乐部信息
        ProtocolEventManager.on(EProtocolID.CLUB_GET_INFOR_REQ, this._onClubInforRespond, this, EEventListenerPriority.HIGHER);

        // 监听头像变更
        director.on(RoleCtrl.ROLE_ICON_UPDATE, this.onRoleIconUpdate, this);
        this.onRoleIconUpdate();

        let helpBtn = this.root.getChildByPath("btnHelp");
        helpBtn.on(Node.EventType.TOUCH_END, () => {
            App.getInst(ViewMgr).open(eSysId.YiTypePreviewViewPref, null);
        }, this); 

        if (AppVar.isInReview) {
            this.roomFriendly.active = false;
            this.root.getChildByPath("buttonbg/boardBtn").active = false;
        }
    }

    private _onGetRoomID(roomID): void {
        console.log("Get room id:", roomID);
        if (roomID == 0) {
            return;
        }
        GlobalVar.willLoadMoudle = null;
        SceneMgr.runScene("Mahjong", true, () => {
            CommSend.enterRoom(roomID);
        }, null);
    }

    private onRoleIconUpdate(): void {
        console.log("avatarID:", LoginEnity.avatarTID);
        this.avatarItem.updateData(Number(LoginEnity.avatarTID));
    }

    private _onClubPlayerInforRespond(event): void {
        console.log("========get club player infor event:", event);
        if (event.success && event.data.res == "SUCCESS") {
            if (event.data.playerInfo) {
                let playerInfo = event.data.playerInfo as protocol.club.IPlayerInfo;
                if (playerInfo.playerId + `` == LoginEnity.accountID) {
                    ClubEntity.joinedClubIDList = playerInfo.joinedClubIdList;
                    if (ClubEntity.joinedClubIDList.length > 0) {
                        ClubEntity.isJoinedClub = true;
                    } else {
                        ClubEntity.isJoinedClub = false;
                    }
                    ClubEntity.recentClubID = playerInfo.recentClubId;
                    // 如果最近俱乐部ID在俱乐部列表中找不到，就是被解散或退出了，因为服务器未处理，所以前端来处理
                    if (ClubEntity.joinedClubIDList.indexOf(ClubEntity.recentClubID) < 0) {
                        ClubEntity.recentClubID = 0;
                    }

                    LoginEnity.balance = playerInfo.balance;
                    LoginEnity.jade = playerInfo.gouyu;
                    LoginEnity.tongbi = playerInfo.tongbi;
                    LoginEnity.clubstatistic = playerInfo.clubstatistic;
                    LoginEnity.friendstatistic = playerInfo.friendstatistic;

                    this.coinLB.string = (LoginEnity.tongbi ?? 0).toString();
                    this.jadeLB.string = (LoginEnity.jade ?? 0).toString();
                }
            }
        }
    }

    private _onClubInforRespond(event): void {
        // if(this._isClubInputShow){
        //     return;
        // }
        console.log("===club mainshow:", this._isClubMainShow);
        this._btnRoomMahjongCanTouch = true;

        if (this._isClubMainShow) {
            return;
        }
        console.log("大厅获取俱乐部信息======evt:", event);

        if (event.success && event.data.res == "SUCCESS") {
            ClubEntity.clubInfor = event.data.clubInfo;
            // 俱乐部类型 0--铜 1--钻
            ClubEntity.isDiamond = ClubEntity.clubInfor.clubType == 1 ? true : false;
            ClubEntity.ownerId = event.data.clubInfo.ownerId;
            ClubEntity.recentClubID = event.data.clubInfo.clubId;
            // 0代表已解散，返回俱乐部选择大厅
            if (0 == event.data.clubInfo.clubStatus) {
                console.log("显示选择大厅")

                if (ClubEntity.joinedClubIDList.length > 0) {
                    for (let mi = 0; mi < ClubEntity.joinedClubIDList.length; mi++) {
                        if (ClubEntity.joinedClubIDList[mi] == ClubEntity.recentClubID) {
                            ClubEntity.joinedClubIDList.splice(mi, 1);
                            break;
                        }
                    }
                }

                // console.log("===len:", ClubEntity.joinedClubIDList);
                if (ClubEntity.joinedClubIDList.length > 0) {
                    // 获取其他的俱乐部信息
                    ClubEntity.recentClubID = ClubEntity.joinedClubIDList[0];
                    let mParams = {
                        "clubId": ClubEntity.recentClubID,
                    };
                    ProtocolHTTPManager.load(EProtocolID.CLUB_GET_INFOR_REQ, mParams, false);
                } else {
                    ClubEntity.prevUI = E_CLUB_MODULE.NONE;
                    HomeUiMain.ins.uiModuleMgr.showUi("ClubChooseHallPref", "ClubChooseHallUI");
                }
            } else {
                // 创建或解散台桌
                if (ClubEntity.createOrDiss) {
                    ClubEntity.createOrDiss = false;
                } else {
                    // console.log("显示主页")
                    // 进入最近进入的俱乐部主页
                    ClubEntity.prevUI = E_CLUB_MODULE.NONE;
                    HomeUiMain.ins.uiModuleMgr.showUi("ClubMainPref", "ClubMainUI");
                }
            }
        }
    }

    private _onCoinBtnTouch(evt: EventTouch): void {
        App.getInst(ViewMgr).open(eSysId.StorePref, [EStoreType.COPPER]);
    }

    private _onJadeBtnTouch(evt: EventTouch): void {
        App.getInst(ViewMgr).open(eSysId.StorePref, [EStoreType.MAGATAMA]);
    }

    private _onEmailBtnTouch(evt: EventTouch): void {
        console.log("btn Email 按下");
        App.getInst(ToastUI).showTips("暂未开放，敬请期待");
    }

    private _settingsBtnTouch(evt: EventTouch): void {
        App.getInst(ViewMgr).open(eSysId.SettingViewPraf)
        // console.log("btn settings 按下");
        // HomeUiMain.ins.homeSetting.show();

        // this.hide();
    }

    private _onOpenPrerfileTouch(): void {
        App.getInst(ViewMgr).open(eSysId.ProrfileViewPref);
    }

    private _roomMahjongTouch(): void {
        if (this._btnRoomMahjongCanTouch) {
            this._btnRoomMahjongCanTouch = false;
        } else {
            return;
        }
        console.log("btn room Mahjong按下:", ClubEntity.joinedClubIDList.length);
        console.log("====:", ClubEntity.isJoinedClub)

        if (!ClubEntity.isJoinedClub) {
            this.rightNormNode.active = false;
            this.rightClubNode.active = true;
            this.buttonBg.active = false;
        } else {
            // 获取最近的俱乐部信息
            this._getRecentClubInfor();
        }
    }

    // 获取最近的俱乐部信息
    private _getRecentClubInfor() {
        // 进入最近进入的俱乐部主页，先获取俱乐部信息，判断是否已解散
        // 获取俱乐部信息
        console.log("recent:", ClubEntity.recentClubID);
        if (ClubEntity.recentClubID == 0 && ClubEntity.joinedClubIDList.length > 0) {
            ClubEntity.recentClubID = ClubEntity.joinedClubIDList[0];
        }
        let mParams = {
            "clubId": ClubEntity.recentClubID,
        };
        ProtocolHTTPManager.load(EProtocolID.CLUB_GET_INFOR_REQ, mParams, false);
    }

    private _roomFriendlyTouch(): void {
        console.log("btn room Friendly按下");
        // HomeUiMain.ins.uiModuleMgr.showUi("FriendPref");
        // App.getInst(ToastUI).showTips("暂未开放");
        App.getInst(ViewMgr).open(eSysId.BirdGodMatchPref);
    }

    private _onCreateTouch(evt: EventTouch): void {
        HomeUiMain.ins.uiModuleMgr.showUi("ClubCreatePref", "ClubCreateUI");

        this._onClubBackTouch(null);
    }

    private _onJoinTouch(evt: EventTouch): void {
        ClubEntity.prevUI = E_CLUB_MODULE.NONE;
        HomeUiMain.ins.uiModuleMgr.showUi("ClubInputPref", "ClubInputUI");

        this._onClubBackTouch(null);
    }

    private _onClubBackTouch(evt: EventTouch): void {
        console.log("club back touch");
        this._btnRoomMahjongCanTouch = true;
        this.rightNormNode.active = true;
        this.rightClubNode.active = false;
        this.buttonBg.active = true;
    }

    private _boardBtnTouch(): void {
        console.log("公告 按下");
        let mParamObj = {
            title: "游戏公告",
            cont: "    欢迎来到口袋雀神麻将，我们将为你提供所有的麻将玩法，本app将持续更新。"
        };
        HomeUiMain.ins.popUpWin.showCommPopup(mParamObj);
    }

    private _instBtnTouch(): void {
        console.log("牌谱 按下");
        HomeUiMain.ins.uiModuleMgr.showUi("HomeScorePref");
    }

    private _storeBtnTouch(): void {
        if (module.isAvailable("inAppPurchase")) {
            App.getInst(ViewMgr).open(eSysId.StorePref);
        }
    }

    private _quickStartBtnTouch(): void {
        CommSend.getRoomX(0);
    }

    public toShow() {
        this.root.active = true;
        this.nickNameLB.string = LoginEnity.nickName;
        this.idLB.string = LoginEnity.accountID;
        this.coinLB.string = LoginEnity.tongbi + "";
        this.jadeLB.string = LoginEnity.jade + "";

        if (!IS_AD_SHOWN) {
            IS_AD_SHOWN = true;
            App.getInst(ViewMgr).open(eSysId.ClubShareAdPref);
        }

        console.log("首次登录：", LoginEnity.isNewAccount);
        if (LoginEnity.isNewAccount) {
            App.getInst(ViewMgr).open(eSysId.SetNameUIPref, [false]);
        }

        // console.log("websocket:", Comm.webSoc.readyState);
        // 连接登录游戏服，如果socket未连接，则重新连接
        // if (Comm.webSoc.readyState != 0) {
        //     Comm.connect3(LoginEnity.account, LoginEnity.token, LoginEnity.accountID, LoginEnity.serverURL);
        // }
        // if (!WebSocketMgr.Inst.isConnect()) {
        //     // WebSocketMgr.Inst.connect(LoginEnity.serverURL);
        //     let websocket = WebSocketMgr.Inst;
        //     websocket.reset();
        //     websocket.newConnect(LoginEnity.serverURL);
        //     websocket.setExpireInterval(15);
        // }

        if (GlobalVar.willLoadMoudle == "CLUB") {
            GlobalVar.willLoadMoudle = null;
            HomeUiMain.ins.uiModuleMgr.showUi("ClubMainPref", "ClubMainUI");
        } else if (GlobalVar.willLoadMoudle == "BirdGodRule") {
            console.log('退出房间 加载匹配页面');
            App.getInst(ViewMgr).open(eSysId.BirdGodRulePref, [true]);
        }
    }

    public toHide() {
        this.root.active = false;
    }

    public toDestroy(): void {
        director.off(RoleCtrl.ROLE_NAME_UPDATE, this._updateNickName, this);
        director.off(EventConst.UPDATE_CLUB_INPUT_TOGGLE, this._updateClubInputToggle, this);
        director.off(EventConst.EVT_UPDATE_CLUB_MAIN_TOGGLE, this._updateClubMainToggle, this);
        director.off(EventConst.EVT_GET_ROOM_ID, this._onGetRoomID, this);

        ProtocolEventManager.off(EProtocolID.CLUB_GET_PLAYER_INFOR_REQ, this._onClubPlayerInforRespond, this);
        ProtocolEventManager.off(EProtocolID.CLUB_GET_INFOR_REQ, this._onClubInforRespond, this);
    }

    private _updateNickName(): void {
        this.nickNameLB.string = LoginEnity.nickName;
    }

    private _updateClubMainToggle(event): void {
        console.log("updateClubmainToggle:", event);
        this._isClubMainShow = event;
    }

    private _updateClubInputToggle(event): void {
        // console.log("updateClubToggle:", event);
        this._isClubInputShow = event;

    }

    public refresh() {
        // 昵称
        this.nickNameLB.string = this.player.info.nickname;
        // 头像
        // var url = this.player.info.icon ;
        // if( url != null ){
        //     assetManager.loadRemote< ImageAsset >(url, {ext: ".png" }, ((err, asset) => {
        //         if( err != null ) {
        //             console.log( "头像下载失败" ) ;
        //             return ;
        //         }
        //         this.avatarSP.spriteFrame = SpriteFrame.createWithImage(asset);
        //     }));
        // }
        // Id
        this.idLB.string = this.player.info.id + "," + this.player.gameData.seatId;
    }
}
