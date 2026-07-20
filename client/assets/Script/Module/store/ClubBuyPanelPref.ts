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

import {_decorator, assetManager, ImageAsset, Label, Node, Sprite, SpriteFrame} from "cc";
import {ClubEntity} from "../../Home/Entity/ClubEntity";
import {LoginEnity} from "../../Home/Entity/Login";
import {ToastUI} from "../../Home/Ui/ToastUI";
import {eSysId, ViewMgr} from "../../framework/mgr/ViewMgr";
import {protocol} from "../../framework/network/protocol-configs";
import {BaseView} from "../../framework/ui/BaseView";
import {CallBack} from "../../framework/utils/CallBack";
import {App} from "../App";
import {CommonDialog} from "../UICommpont/CommonDialog";
import {ePaymentType, ShopCtrl} from "./ShopCtrl";

const {ccclass, property} = _decorator;

@ccclass("ClubBuyPanelPref")
export class ClubBuyPanelPref extends BaseView {
    /**道具图标(头像) */
    public avatarImg: Sprite;
    /**昵称 */
    public nameLB: Label;
    /**账号 */
    public phoneLB: Label;
    /**换绑 */
    public bingChangeLB: Node;
    /**货币名 */
    public priceNameLB: Label;
    /**账号余额 */
    public accountMoneyLB: Label;
    /**本次价格 */
    public priceLB: Label;
    /**充值 */
    public rechargeLB: Node;
    /**确定支付 */
    public okBtn: Node;

    constructor() {
        super();
        this.skinName = `prefab/store/ClubBuyPanelPref`;
    }

    public initUI(): void {
        this.avatarImg = this.getChildNode("avatarImg").getComponent(Sprite);
        this.nameLB = this.getChildNode("nameLB").getComponent(Label);
        this.phoneLB = this.getChildNode("phoneLB").getComponent(Label);
        this.bingChangeLB = this.getChildNode("bingChangeLB");
        this.accountMoneyLB = this.getChildNode("accountMoneyLB").getComponent(Label);
        this.priceLB = this.getChildNode("priceLB").getComponent(Label);
        this.rechargeLB = this.getChildNode("rechargeLB");
        this.okBtn = this.getChildNode("okBtn");


        this.bingChangeLB.on(Node.EventType.TOUCH_END, this.onBindChange, this);
        this.rechargeLB.on(Node.EventType.TOUCH_END, this.onRecharge, this);
        this.okBtn.on(Node.EventType.TOUCH_END, this.onPay, this);
    }

    private _info;

    public open(params): void {
        let {id, price, shopType} = this._info = params;
        let wbInfo = App.getInst(ShopCtrl).wbInfo;
        (wbInfo.icon && wbInfo.icon.length) && assetManager.loadRemote<ImageAsset>(wbInfo.icon, {ext: ".png"}, ((err, asset) => {
            if (err != null) {
                console.log("头像下载失败");
                return;
            }
            this.avatarImg.spriteFrame = SpriteFrame.createWithImage(asset);
        }));

        this.nameLB.string = wbInfo.nick;
        let str: string = wbInfo.mobile;
        this.phoneLB.string = str.slice(0, 3) + "*****" + str.slice(str.length - 4);
        this.accountMoneyLB.string = (App.getInst(ShopCtrl).wbInfo.WBbalance || 0).toFixed(2);
        this.priceLB.string = `${price}`;
    }

    /**
     * 换绑
     */
    private onBindChange(): void {
        App.getInst(ViewMgr).open(eSysId.CommonDialog, [`是否更换另一个we宝账号进行绑定`, new CallBack(() => {
            App.getInst(ShopCtrl).CancelWBBindReq(LoginEnity.playerID);
        }, this), null, `换绑账号`], this.node);
    }


    private onRecharge(): void {
        App.getInst(ShopCtrl).openWeBaoUrl();
    }

    private onPay(): void {
        this.closeSelf();
        let price = this._info.price;
        let parentNode = App.getInst(ViewMgr).getView(eSysId.ClubStorePref);
        //判断we宝货币是否足够
        let b = App.getInst(ShopCtrl).checkMoneyIsEnough(ePaymentType.weBao, price);
        if (!b) {
            let view: CommonDialog = App.getInst(ViewMgr).open(eSysId.CommonDialog, [`请往we宝官网充值WEC`, new CallBack(() => {
                this.onRecharge();
            }, this), null, `WEC余额不足`], parentNode.node);
            view.resetBtnName(`前往`);
        } else {
            //todo 支付
            console.log("调用支付");
            App.getInst(ShopCtrl).pbCreateOrder(LoginEnity.playerID, 4, this._info.id, ClubEntity.recentClubID, new CallBack((params: protocol.shop.IpbCreateOrderRes) => {
                if (params.payType === protocol.shop.storeType.TYPE_GOOGLE || params.payType === protocol.shop.storeType.TYPE_APPLE) {
                    return;
                }

                switch (params.orderStatus) {
                    case 0://订单尚未完成
                    case 1://拒绝
                    case 2://失败
                        App.getInst(ToastUI).showTips(params.msg);
                    case 3:
                        //完成
                        App.getInst(ToastUI).showTips(`订单已完成`);
                        //更新余额
                        App.getInst(ShopCtrl).GetWBBindInfoReq(LoginEnity.playerID);
                        break;
                }
                this.closeSelf();
            }, this));
        }
    }
}