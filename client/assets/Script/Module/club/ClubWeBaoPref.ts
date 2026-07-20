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

import {_decorator, sys, WebView} from "cc";
import {LoginEnity} from "../../Home/Entity/Login";
import {ToastUI} from "../../Home/Ui/ToastUI";
import {ViewMgr} from "../../framework/mgr/ViewMgr";
import {protocol} from "../../framework/network/protocol-configs";
import {BaseView} from "../../framework/ui/BaseView";
import {CallBack} from "../../framework/utils/CallBack";
import {Platform} from "../../platform/Platform";
import {App} from "../App";
import {ShopCtrl} from "../store/ShopCtrl";

const {ccclass, property} = _decorator;

@ccclass("ClubWeBaoPref")
export class ClubWeBaoPref extends BaseView {
    /**内嵌网页 */
    public webView: WebView;

    private _webViewCallback = () => {
        console.log("收到h5回调");
        //刷新we包绑定状态
        App.getInst(ShopCtrl).GetWBBindInfoReq(LoginEnity.playerID);
        this.closeSelf();
    };

    constructor() {
        super();
        this.skinName = `prefab/club/ClubWeBaoPref`;
    }

    public initUI(): void {
        this.webView = this.getChildNode("WebView").getComponent(WebView);
    }

    public open(data: protocol.shop.IpbCreateOrderRes): void {
        if (sys.isBrowser) {
            window.addEventListener('message', this._webViewCallback);
        }

        //每次打开之前需要先查询随机码
        App.getInst(ShopCtrl).GetWBRandCodeReq(LoginEnity.playerID, new CallBack(() => {
            if (!App.getInst(ShopCtrl).WBRandCode) {
                //拿不到随机码的话提示异常
                App.getInst(ToastUI).showTips("无法获得we宝随机码");
                this.closeSelf();
                return;
            }

            const cbEventStr = `testkey:\/\/abssd`;
            this.webView.url = `${App.getInst(ShopCtrl).wbUrl}login?appid=${App.getInst(Platform).appID}&randCode=${App.getInst(ShopCtrl).WBRandCode
            }&exitUrl=${cbEventStr}${sys.isBrowser ? '&exitIframe=1' : ''}`;
            // //添加事件监听
            this.webView.setJavascriptInterfaceScheme(`testkey`);
            this.webView.setOnJSCallback(this._webViewCallback);
        }, this))
    }

    public close(viewMgr: ViewMgr): void {
        if (sys.isBrowser) {
            window.removeEventListener('message', this._webViewCallback);
        }

        super.close(viewMgr);
    }

}