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

import {_decorator, EventTouch, Node, sys, Tween, tween, UITransform, Widget} from "cc";
import {BaseView} from "../../framework/ui/BaseView";
import {ePaymentType, ShopCtrl} from "./ShopCtrl";
import {eSysId, ViewMgr} from "../../framework/mgr/ViewMgr";
import {CallBack} from "../../framework/utils/CallBack";
import {CommonDialog} from "../UICommpont/CommonDialog";
import {App} from "../App";

/**
 * 拉取当前支持的支付方式
 */

const {ccclass, property} = _decorator;

@ccclass("SelectPaymentPref")
export class SelectPaymentPref extends BaseView {
    /**支付方式列表节点 */
    public menuNode: Node;
    /**列表容器节点 */
    public list: Node;
    /**加载页面 */
    public loadingND: Node;
    /**we宝支付 */
    private weBao: Node;
    /**支付黑色遮罩 */
    public maskPay: Node;

    private tw: Tween<Widget>;

    constructor() {
        super();
        this.skinName = `prefab/commonUI/SelectPaymentPref`;
    }

    public initUI(): void {
        this.menuNode = this.getChildNode(`menuNode`);
        this.list = this.getChildNode("list");
        this.loadingND = this.getChildNode("loadingND");
        this.list.children.forEach(child => {
            child.on(Node.EventType.TOUCH_END, this.onPaymentTouch, this);
        })
        this.maskPay = this.getChildNode(`maskPay`);
        this.maskPay.on(Node.EventType.TOUCH_END, this.onMaskTouch, this);
        this.menuNode.on(Node.EventType.TOUCH_END, () => {
            //拦截点击
        }, this);

        //隐藏界面
        this.loadingND.active = false;
        this.menuNode.active = false;
    }

    private onMaskTouch(): void {
        if (!this.menuNode.active || this.tw) return;
        this.hideMenu().then(() => {
            this.closeSelf();
        });
    }

    private _info;

    public open(id, price, shopType): void {
        this._info = {id, price, shopType};
        //请求当前允许的支付方式
        App.getInst(ShopCtrl).getPaymentList();
        this.onEvent(ShopCtrl.UPDATE_PAYMENT_LIST, this.onPaymentListChange, this);
        this.onEvent(ShopCtrl.UPDATE_PAYMENT_PLATFORM_INFO, this.onUpdatePaymentInfo, this);
    }

    private onPaymentListChange(): void {
        this.showMenu();
    }

    private onUpdatePaymentInfo(): void {
        this.loadingND.active = false;
        //未绑定we宝
        if (!App.getInst(ShopCtrl).wbInfo.isWBBind) {
            let view: CommonDialog = App.getInst(ViewMgr).open(eSysId.CommonDialog, [`检测到暂未绑定we宝账户，请先绑定`, new CallBack(() => {
                //跳转去绑定账号
                App.getInst(ViewMgr).open(eSysId.ClubWeBaoPref, null, this.node);
            }, this), new CallBack(() => {
                this.closeSelf();
            }, this), ` `], this.node);
            view.setBtnCnt(1);
            return;
        }

        //to do 显示购买弹窗
        this.closeSelf();
        //打开购买界面
        let parentNode = App.getInst(ViewMgr).getView(eSysId.ClubStorePref);
        App.getInst(ViewMgr).open(eSysId.ClubBuyPanelPref, [this._info], parentNode.node);
    }

    private showMenu(): void {
        this.menuNode.active = true;
        let w = this.menuNode.getComponent(Widget);
        let size = this.menuNode.getComponent(UITransform);
        w.bottom = -size.height;
        this.tw = tween(w).to(0.3, {bottom: 20}).call(() => {
            this.tw.stop();
            this.tw = null;
        }).start();
    }

    private hideMenu() {
        return new Promise((resolve, reject) => {
            let w = this.menuNode.getComponent(Widget);
            let size = this.menuNode.getComponent(UITransform);
            this.tw = tween(w).to(0.3, {bottom: -size.height}).call(() => {
                this.tw.stop();
                this.tw = null;
                resolve(``);
            }).start();
        });
    }


    /**
     * 根据选中的支付类型，获取对应货币信息
     */
    private getPaymentInfo(): void {
        this.loadingND.active = true;
        App.getInst(ShopCtrl).getPayPlatformInfo(ePaymentType.weBao);
    }

    private onPaymentTouch(evt: EventTouch): void {
        console.log("click", evt);
        // 客服
        if (evt.currentTarget.name == "serve") {
            // chat 链接
            sys.openURL(``);
        } else {
            this.hideMenu().then(() => {
                this.getPaymentInfo();
            });
        }

    }
}