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

import {_decorator, EditBox, Label, Node, Toggle, ToggleContainer} from "cc";
import {BaseView} from "../../framework/ui/BaseView";
import List from "../UICommpont/ListView/List";
import {ClubStoreItemPref} from "./ClubStoreItemPref";
import {ShopCtrl} from "./ShopCtrl";
import {ClubEntity} from "../../Home/Entity/ClubEntity";
import {eSysId, ViewMgr} from "../../framework/mgr/ViewMgr";
import {CallBack} from "../../framework/utils/CallBack";
import {LoginEnity} from "../../Home/Entity/Login";
import {ColorConst} from "../../const/ColorCont";
import {ToastUI} from "../../Home/Ui/ToastUI";
import {ClubCtrl} from "../club/ClubCtrl";
import {App} from "../App";
import {protocol} from "../../framework/network/protocol-configs";

export enum eClubStoreTab {
    exchange = 1,
    widthDraw,
}

/**
 * 俱乐部商城
 */
const {ccclass, property} = _decorator;

@ccclass("ClubStorePref")
export class ClubStorePref extends BaseView {
    /**商城列表 */
    public list: List;
    /**列表内容 */
    public contentView: Node;
    /**类型TAB */
    public previewTab: ToggleContainer;
    /**雀的场 */
    public YiPreviewToggle: Toggle;
    /**友人场 */
    public NewBirdToggle: Toggle;
    /**金币 */
    public jadeLB: Label;
    /**weBao币 */
    public webBaoLB: Label;
    public weiBaoNode: Node;
    /**weBao 加号 */
    public weBaoBtn: Node;
    /**weBao 解绑 */
    public unBindBtn: Node;
    /**记录节点 */
    public operationNode: Node;

    public withdrawContent: Node;
    /**取款输入框 */
    public moneyEB: EditBox;
    /**可取金额，取整，货币有可能有小数点，小数点部分不能取 */
    public withdrawMoneyLB: Label;
    /**取款按钮 */
    public confirmBtn: Node;

    private _closeBtn: Node | null = null;
    // 充值优惠
    private _chongzhiND: Node | null = null;
    private _chongzhiCloseTouch: Node | null = null;
    private _chongzhiCloseND: Node | null = null;


    private previewTabName: string;
    private curIdx: number;

    constructor() {
        super();
        this.skinName = `prefab/store/ClubStorePref`;
    }

    public initUI(): void {
        this.contentView = this.getChildNode(`contentView`);
        this.withdrawContent = this.getChildNode(`withdrawContent`);
        this.list = this.contentView.getComponent(List);
        this.list.setItemRender(ClubStoreItemPref);

        this.jadeLB = this.getChildNode(`jadeLB`).getComponent(Label);
        this.webBaoLB = this.getChildNode(`weBaoLB`).getComponent(Label);
        this.weiBaoNode = this.getChildNode(`weiBaoNode`);

        this.YiPreviewToggle = this.getChildNode("YiPreviewToggle").getComponent(Toggle);
        this.NewBirdToggle = this.getChildNode("NewBirdToggle").getComponent(Toggle);
        this.previewTab = this.getChildNode(`previewTab`).getComponent(ToggleContainer);
        this.previewTab.node.children.forEach(tmpNode => {
            tmpNode.on(Toggle.EventType.CLICK, this._onPreviewTabChange, this);
        })

        this.weiBaoNode.on(Node.EventType.TOUCH_END, this.onWeiBaoTouch, this);

        this.operationNode = this.getChildNode(`operationNode`);
        this.operationNode.on(Node.EventType.TOUCH_END, this.onOperationNodeTouch, this);

        this.weBaoBtn = this.getChildNode(`weBaoBtn`);
        this.weBaoBtn.on(Node.EventType.TOUCH_END, this.onWeBaoAddBtnTouch, this);

        this.unBindBtn = this.getChildNode(`unBindBtn`);
        this.unBindBtn.on(Node.EventType.TOUCH_END, this.onUnBindBtnTouch, this);

        this.moneyEB = this.getChildNode(`moneyEB`).getComponent(EditBox);
        this.moneyEB.node.on(EditBox.EventType.EDITING_DID_ENDED, this._onMoneyEB, this);

        this.withdrawMoneyLB = this.getChildNode("withdrawMoneyLB").getComponent(Label);
        this.confirmBtn = this.getChildNode(`confirmBtn`);
        this.confirmBtn.on(Node.EventType.TOUCH_END, this.onConfirmBtnTouch, this);

        this._closeBtn = this.getChildNode("closeBtn");
        this._closeBtn.on(Node.EventType.TOUCH_END, this._onCloseTouch, this);
        this._chongzhiND = this.getChildNode("chongzhiND");
        this._chongzhiCloseTouch = this.getChildNode("czCloseTouch");
        this._chongzhiCloseND = this.getChildNode("czCloseND");
        this._chongzhiCloseND.on(Node.EventType.TOUCH_END, this._chongzhiTouch, this);
        this._chongzhiCloseTouch.on(Node.EventType.TOUCH_END, this._chongzhiTouch, this);
    }

    private _onCloseTouch(): void {
        this.closeSelf();
    }

    private _chongzhiTouch(): void {
        this._chongzhiND.active = false;
    }

    private onUnBindBtnTouch(): void {
        App.getInst(ViewMgr).open(eSysId.CommonDialog, [`解绑后你将无法获取We账户上的余额信息,同时也无法用We宝进行支付,是否确定解绑?`, new CallBack(() => {
            App.getInst(ShopCtrl).CancelWBBindReq(LoginEnity.playerID);
        }, this), null, `解绑账号`], this.node);
    }

    /**
     * 购买的使用外链
     */
    private onWeBaoAddBtnTouch(): void {
        App.getInst(ShopCtrl).openWeBaoUrl();
    }

    /**
     * 查看流水页面
     */
    private onOperationNodeTouch(): void {
        App.getInst(ViewMgr).open(eSysId.ClubShopRecordPref);
    }

    /**
     * 账号绑定（绑定的页面用内嵌网页）
     * @returns
     */
    private onWeiBaoTouch(): void {
        if (this.isWBBind) {
            return;
        }

        App.getInst(ViewMgr).open(eSysId.ClubWeBaoPref, null, this.node);
    }

    public open(...params: any[]): void {
        // 获取商城信息
        // 商城中shopType：3--显示购买铜币 4--显示购买勾玉 5--显示购买金币
        // 商城中shopPlace：俱乐部Id，0--大厅购买
        App.getInst(ShopCtrl).pbGetProductListReq(5, 0);
        //请求webao 所需的randomCode
        App.getInst(ShopCtrl).GetWBRandCodeReq(LoginEnity.playerID);
        this.onEvent(ShopCtrl.UPDATE_GET_PRODUCT_LIST, this.onUpdateGetProductList, this);
        this.onEvent(ShopCtrl.UPDATE_WE_BAO_INFO, this.onUpdateWeBaoInfo, this);
        this.onEvent(ShopCtrl.EVENT_WB_UNBIND, this.onUpdateWeBaoInfo, this);
        this.onEvent(ClubCtrl.CLUB_SELF_DETAIL_CHANGE, this.onUpdateMoney, this);
        this.onUpdateWeBaoInfo();
        this.onUpdateMoney();
    }


    private isWBBind: boolean;

    /**
     * weBao数据
     */
    protected onUpdateWeBaoInfo(): void {
        let {isWBBind, WBbalance} = App.getInst(ShopCtrl).wbInfo;
        this.isWBBind = isWBBind;
        this.webBaoLB.string = isWBBind ? WBbalance.toFixed(2) : `未绑定`;
        this.webBaoLB.color = isWBBind ? ColorConst.NUM_WHITE : ColorConst.NUM_NORMAL;
        this.unBindBtn.active = this.isWBBind;
        this.weBaoBtn.active = this.isWBBind;
        if (this.previewTabName == `NewBirdToggle`) {
            this.initDrawMoneyInfo();
        }
    }

    protected onUpdateGetProductList(): void {
        this.list.setData(App.getInst(ShopCtrl).productList)
    }

    public _onPreviewTabChange(target: Toggle): void {
        let name = target.node.name;
        if (this.previewTabName == name) return;
        this.showPreViewTab(name);
    }

    private showPreViewTab(str: string): void {
        switch (str) {
            case `YiPreviewToggle`:
                this.curIdx = eClubStoreTab.exchange;
                this.contentView.active = true;
                this.withdrawContent.active = false;
                break;
            case `NewBirdToggle`:
                this.curIdx = eClubStoreTab.widthDraw;
                this.contentView.active = false;
                this.withdrawContent.active = true;
                this.initDrawMoneyInfo();
                break;
        }

        this.previewTabName = str;
    }

    private initDrawMoneyInfo(): void {
        let money = ClubEntity.clubPlayerDetail?.balance || 0;
        this.withdrawMoneyLB.string = money.toFixed(0);
    }

    private onUpdateMoney(): void {
        let money = ClubEntity.clubPlayerDetail?.balance || 0;
        this.jadeLB.string = money.toFixed(0);
        this.withdrawMoneyLB.string = money.toFixed(0);
    }


    private _onMoneyEB(evt: EditBox) {
        let val = this.moneyEB.string;
        let value = Number(val);

        let balance = ClubEntity.clubPlayerDetail?.balance;
        if (balance < value) {
            this.moneyEB.string = balance.toFixed(0) + "";
            value = balance;
        }
    }

    private onConfirmBtnTouch(): void {
        let val = this.moneyEB.string;
        if (!val || !val.match(/^[0-9]{1,10}$/g)) {
            App.getInst(ToastUI).showTips("取款金额包含非法字符");
            return;
        }

        let value = Number(val);
        if (value == 0) {
            App.getInst(ToastUI).showTips("取款金额不能为空");
            return;
        }

        if (!App.getInst(ShopCtrl).wbInfo.isWBBind) {
            App.getInst(ToastUI).showTips("请先绑定we宝账户");
            return;
        }

        //todo 去取款
        App.getInst(ShopCtrl).pbCreateWithDrawOrderReq(LoginEnity.playerID, value, ClubEntity.recentClubID, new CallBack((params: protocol.shop.IpbCreateWithDrawOrderRes) => {
            switch (params.orderStatus) {
                case 0://订单尚未完成
                case 1://拒绝
                case 2://失败
                    App.getInst(ToastUI).showTips(params.msg);
                    break;
                case 3:
                    //完成
                    App.getInst(ToastUI).showTips(`取款已完成`);
                    //更新余额
                    App.getInst(ShopCtrl).GetWBBindInfoReq(LoginEnity.playerID);
                    App.getInst(ClubCtrl).GetClubPlayerDetailReq(LoginEnity.playerID, ClubEntity.recentClubID, 0, 0);
                    break;
            }
            this.moneyEB.string = "";
        }, this))
    }
}