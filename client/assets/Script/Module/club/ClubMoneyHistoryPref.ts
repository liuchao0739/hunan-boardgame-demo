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

import {_decorator, Label, Node} from "cc";
import {BaseView} from "../../framework/ui/BaseView";
import List from "../UICommpont/ListView/List";
import {ClubMoneyHistoryItemPref} from "./ClubMoneyHistoryItemPref";
import {ShopCtrl} from "../store/ShopCtrl";
import {ClubEntity} from "../../Home/Entity/ClubEntity";
import {TimeUtils} from "../../framework/utils/time-utils";
import {ArrayUtils} from "../../framework/utils/array-utils";
import {eSysId, ViewMgr} from "../../framework/mgr/ViewMgr";
import {CallBack} from "../../framework/utils/CallBack";
import {ToastUI} from "../../Home/Ui/ToastUI";
import {App} from "../App";

const {ccclass, property} = _decorator;

@ccclass("ClubMoneyHistoryPref")
export class ClubMoneyHistoryPref extends BaseView {
    /**记录列表 */
    public list: List;
    public contentView: Node;
    public dateLB: Node;
    public lastDay: Node;
    public sevenDay: Node;
    public custom: Node;
    public dateParentND: Node;
    public lBtn: Node;
    public rBtn: Node;

    constructor() {
        super();
        this.skinName = `prefab/club/ClubMoneyHistoryPref`;
    }

    public initUI(): void {
        this.contentView = this.getChildNode(`contentView`);
        this.list = this.contentView.getComponent(List);
        this.dateLB = this.getChildNode(`dateLB`);
        this.list.setItemRender(ClubMoneyHistoryItemPref);

        this.lastDay = this.getChildNode(`lastDay`);
        this.lastDay.on(Node.EventType.TOUCH_END, this.onLastDay, this);
        this.sevenDay = this.getChildNode(`sevenDay`);
        this.sevenDay.on(Node.EventType.TOUCH_END, this.onSevenDay, this);
        this.custom = this.getChildNode(`custom`);
        this.custom.on(Node.EventType.TOUCH_END, this.onCustom, this);

        this.dateParentND = this.getChildNode(`dateParentND`);

        this.lBtn = this.getChildNode(`lBtn`);
        this.lBtn.on(Node.EventType.TOUCH_END, this.onlBtnChange, this);
        this.rBtn = this.getChildNode(`rBtn`);
        this.rBtn.on(Node.EventType.TOUCH_END, this.onrBtnChange, this);
    }

    private lMonth: number;
    private lDay: number;
    private rMonth: number;
    private rDay: number;

    private onlBtnChange(): void {
        let time = TimeUtils.getDayTick(this.lMonth, this.lDay, 0) / 1000;
        let offsetTime = time - TimeUtils.ONE_DAY_TIME_S;
        let curTime = new Date().getTime() / 1000;
        let addTime = curTime - offsetTime;
        if (addTime > 30 * TimeUtils.ONE_DAY_TIME_S) {
            App.getInst(ToastUI).showTips(`最多查看最近三十天记录`);
            return;
        }
        this.showOrder(offsetTime, time - 1);
    }

    private onrBtnChange(): void {
        let time = TimeUtils.getDayTick(this.rMonth, this.rDay, 1) / 1000;
        let offsetTime = time + TimeUtils.ONE_DAY_TIME_S;
        if (offsetTime * 1000 > new Date().getTime()) {
            App.getInst(ToastUI).showTips(`当前已是最新记录`);
            return;
        }
        this.showOrder(time + 1, offsetTime);
    }

    public open(...params: any[]): void {
        //默认显示当天信息
        let endTime = (TimeUtils.getServerTimeZero() - 1) / 1000;
        //当天  
        let startTime = endTime + 1 - TimeUtils.ONE_DAY_TIME_S;
        this.showOrder(startTime, endTime);
        this.onEvent(ShopCtrl.UPDATE_ORDER_INFO_LIST, this.onOrderList, this);
    }

    private onOrderList(): void {
        let arr = ArrayUtils.typeSort(App.getInst(ShopCtrl).moneyList, `buyTime`);
        arr.reverse();
        this.list.setData(arr);
    }

    /**
     * 单位为秒
     * @param start 开始时间
     * @param end 结束时间
     */
    private showOrder(start: number, end: number): void {
        let startDate = TimeUtils.formatDate(start, "-", true);
        let endDate = TimeUtils.formatDate(end, "-", true);
        this.dateLB.getComponent(Label).string = `${startDate} - ${endDate}`;
        let arr = startDate.split(`-`);
        this.lMonth = Number(arr[1]);
        this.lDay = Number(arr[2]);

        arr = endDate.split(`-`);
        this.rMonth = Number(arr[1]);
        this.rDay = Number(arr[2]);
        App.getInst(ShopCtrl).pbGetClubOrderInfoReq(ClubEntity.recentClubID, start, end);
    }

    /**
     * 昨天
     */
    private onLastDay(): void {
        let curDate = (TimeUtils.getServerTimeZero() - 1) / 1000;
        let endTime = curDate - TimeUtils.ONE_DAY_TIME_S;
        let startTime = endTime + 1 - TimeUtils.ONE_DAY_TIME_S;
        this.showOrder(startTime, endTime);
    }

    /**
     * 最近7天
     */
    private onSevenDay(): void {
        let curDate = (TimeUtils.getServerTimeZero() - 1) / 1000;
        let endTime = curDate;
        let startTime = endTime + 1 - 7 * TimeUtils.ONE_DAY_TIME_S;
        this.showOrder(startTime, endTime);
    }

    private onCustom(): void {
        App.getInst(ViewMgr).open(eSysId.DatePicker, [new CallBack((startTime, endTime) => {
            //日历选择时间返回
            this.showOrder(startTime, endTime);
        }, this)], this.dateParentND);
    }
}