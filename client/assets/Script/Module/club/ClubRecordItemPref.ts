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

import {_decorator, Label} from "cc";
import ItemRender from "../UICommpont/ListView/ItemRender";
import {TimeUtils} from "../../framework/utils/time-utils";
import {protocol} from "../../framework/network/protocol-configs";

const {ccclass, property} = _decorator;

@ccclass("ClubRecordItemPref")
export class ClubRecordItemPref extends ItemRender {
    public timeLB: Label | null = null;
    public methodLB: Label | null = null;
    public numLB: Label | null = null;
    public changeLB: Label | null = null;

    protected initUI(): void {
        this.timeLB = this.getChildNode("timeLB").getComponent(Label);
        this.methodLB = this.getChildNode("methodLB").getComponent(Label);
        this.numLB = this.getChildNode("numLB").getComponent(Label);
        this.changeLB = this.getChildNode("changeLB").getComponent(Label);
    }

    public dataChanged(): void {
        let {buyTime, payType, coin, price, balance} = this.data as protocol.shop.IOrderInfo;
        this.timeLB.string = TimeUtils.formatDate(buyTime, "-", true, true);
        // 取款是 paytype'是 5 ， 存款 就是 paytype 就是 4
        let payTypeStr = ``;
        let coinChange = "";
        let costStr;
        if (payType == 4) {
            payTypeStr = `存款`;
            coinChange = `+`;
            costStr = coin.toFixed(1);
        } else {
            payTypeStr = `取款`;
            coinChange = `-`;
            costStr = price.toFixed(1);
        }
        this.methodLB.string = payTypeStr;
        this.changeLB.string = `${coinChange}${costStr}`;
        let balanceStr = balance || 0;
        this.numLB.string = balanceStr.toFixed(1);
    }
}