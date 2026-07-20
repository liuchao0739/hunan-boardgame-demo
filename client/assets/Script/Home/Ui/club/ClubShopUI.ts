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

import {_decorator, Component, director, instantiate, Label, Node, Toggle} from "cc";
import {ProtocolHTTPManager} from "../../../framework/network/http";
import {EProtocolID} from "../../../framework/network/protocol-configs";
import {LoginEnity} from "../../Entity/Login";
import {EEventListenerPriority, ProtocolEventManager} from "../../../framework/event/event-management";
import {ClubEntity} from "../../Entity/ClubEntity";
import {E_CLUB_MODULE} from "../../../const/EnumConst";
import {EventConst} from "../../../const/EventConst";
import {ShopCtrl} from "../../../Module/store/ShopCtrl";
import {App} from "../../../Module/App";

const {ccclass, property} = _decorator;

@ccclass('ClubShopUI')
export class ClubShopUI extends Component {
    // private _root: Node | null = null;
    private _backBtn: Node | null = null;
    private _menuBtn: Node | null = null;
    private _chargeTog: Toggle | null = null;
    private _withdrawTog: Toggle | null = null;
    private _storeCont: Node | null = null;
    private _storeItemND: Node | null = null;
    private _clubMoneyLB: Label = null;
    private _clubMoneyNode: Node = null;

    // public memberItemUI:ClubMemItemUI = null;

    onLoad(): void {
        this._backBtn = this.node.getChildByPath("cont/backBtn");
        this._menuBtn = this.node.getChildByPath("cont/menuBtn");
        this._chargeTog = this.node.getChildByPath("cont/ToggleGroup/chargeTog").getComponent(Toggle);
        this._withdrawTog = this.node.getChildByPath("cont/ToggleGroup/withdrawTog").getComponent(Toggle);

        this._clubMoneyNode = this.node.getChildByPath("cont/money");
        this._clubMoneyNode.on(Node.EventType.TOUCH_END, this._onOpenWebBaoTouch, this);
        this._clubMoneyLB = this.node.getChildByPath("cont/money/clubMoneyLB").getComponent(Label);

        this._storeCont = this.node.getChildByPath("cont/ScrollView/view/content");
        this._storeItemND = this.node.getChildByPath("cont/ScrollView/view/content/ClubStoreItem");

        this._backBtn.on(Node.EventType.TOUCH_END, this._onBackTouch, this);
        this._menuBtn.on(Node.EventType.TOUCH_END, this._onMenuTouch, this);
        this._chargeTog.node.on(Node.EventType.TOUCH_END, this._onChargeTouch, this);
        this._withdrawTog.node.on(Node.EventType.TOUCH_END, this._onWithdrawTouch, this);

        // 获取商城信息
        ProtocolEventManager.on(EProtocolID.SHOP_GET_PRODUCT_LIST, this._onShopInfoRespond, this, EEventListenerPriority.HIGHER);
        // 创建订单
        ProtocolEventManager.on(EProtocolID.SHOP_CREATE_ORDER, this._onClubShopCreateOrderRespond, this, EEventListenerPriority.HIGHER);
    }

    private _onOpenWebBaoTouch(): void {
        App.getInst(ShopCtrl).openWeBaoUrl();
    }

    private _onBackTouch(): void {
        director.emit(EventConst.EVT_REMOVE_CLUB_PREF);
        this.node.destroy();
    }

    private _onMenuTouch(): void {
        console.log("跳转到3-6-1存取记录界面");
        // this.hide();
        ClubEntity.prevUI = E_CLUB_MODULE.SHOP_UI;
        // HomeUiMain.ins.uiModuleMgr.showUi("ClubShopRecordPref", "ClubShopRecordUI");
    }

    // 充值按下
    private _onChargeTouch(): void {
        console.log("充值按下");
        this._storeCont.removeAllChildren();
        this._updateStoreList();
    }

    // 取款按下
    private _onWithdrawTouch(): void {
        console.log("取款界面");
        this._storeCont.removeAllChildren();
    }

    private _onShopInfoRespond(event): void {
        console.log("=shop infor:", event);
        if (event.success && event.data) {
            ClubEntity.clubShopList = event.data.productList;
            this._updateStoreList();
        }
    }

    // 创建订单
    private _onClubShopCreateOrderRespond(event): void {
        console.log("==shop check:", event);
    }

    private _updateStoreList(): void {
        if (ClubEntity.clubShopList) {
            for (let mi = 0; mi < ClubEntity.clubShopList.length; mi++) {
                let mShopItemND = instantiate(this._storeItemND);
                mShopItemND.addComponent(ClubShopItemUI);
                let mSopSC: ClubShopItemUI = mShopItemND.getComponent(ClubShopItemUI);
                mSopSC.toInit(mShopItemND);
                mSopSC.nameLB.string = ClubEntity.clubShopList[mi].name;
                mSopSC.valueLB.string = ClubEntity.clubShopList[mi].price + "";
                mSopSC.productId = ClubEntity.clubShopList[mi].id;
                mSopSC.shopType = ClubEntity.clubShopList[mi].shopType;

                this._storeCont.addChild(mShopItemND);
            }
        }
    }

    // 更新数据用，必备
    public refresh(): void {
        this._storeCont.removeAllChildren();

        // 获取商城信息
        // 商城中shopType：3--显示购买铜币 4--显示购买勾玉 5--显示购买金币
        // 商城中shopPlace：俱乐部Id，0--大厅购买
        let mParams = {
            "shopType": 5,
            "shopPlace": 0// TODO:TEMP 暂时都是0 ClubEntity.recentClubID
        };
        ProtocolHTTPManager.load(EProtocolID.SHOP_GET_PRODUCT_LIST, mParams, false);

        // 玩家个人的钱
        this._clubMoneyLB.string = ClubEntity.clubPlayerDetail?.balance.toFixed(1);
    }

    onDestroy(): void {
        // 获取商城信息
        ProtocolEventManager.off(EProtocolID.SHOP_GET_PRODUCT_LIST, this._onShopInfoRespond, this);
        // 创建订单
        ProtocolEventManager.off(EProtocolID.SHOP_CREATE_ORDER, this._onClubShopCreateOrderRespond, this);
    }
}

export class ClubShopItemUI extends Component {
    public root: Node | null = null;
    public icon: Node | null = null;
    public nameLB: Label | null = null;
    public valueLB: Label | null = null;
    public productId: number = 0;
    public shopType: number = 0;

    public toInit(node: Node) {
        this.root = node;
        this.icon = node.getChildByPath("icon");
        this.nameLB = node.getChildByPath("nameLB").getComponent(Label);
        this.valueLB = node.getChildByPath("valueLB").getComponent(Label);

        this.root.on(Node.EventType.TOUCH_END, this._onRootTouch, this);
    }

    private _onRootTouch(): void {
        console.log("shop item node touch:", this.nameLB.string);
        let mParams = {
            "uid": LoginEnity.playerID,
            "payType": 4,//3 勾玉购买铜币 4 webao支付可以购买勾玉和金币 5 取款
            "productId": this.productId,
            "shopPlace": ClubEntity.recentClubID// TODO:TEMP 暂时都是0 ClubEntity.recentClubID
        };
        ProtocolHTTPManager.load(EProtocolID.SHOP_CREATE_ORDER, mParams, false);
    }

    public toShow() {
        this.root.active = true;
    }

    public toHide() {
        this.root.active = false;
    }
}