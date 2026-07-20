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

import {_decorator, director, Label, Node} from "cc";
import {BaseView} from "../../framework/ui/BaseView";
import List from "./ListView/List";
import ItemRender from "./ListView/ItemRender";
import {TimeUtils} from "../../framework/utils/time-utils";
import {ToastUI} from "../../Home/Ui/ToastUI";
import {CallBack} from "../../framework/utils/CallBack";
import {App} from "../App";

const {ccclass, property} = _decorator;

@ccclass("DatePicker")
export class DatePicker extends BaseView {
    public rBtn: Node;
    public lBtn: Node;
    public dateLB: Label;
    public monthLB: Label;
    public list: List;
    public contentView: Node;
    public okBtn: Node;

    private curSelIdx: number;  // 0 或者 1，代表当前选中的是开始时间还是结束时间
    private selArr: { time: number, dateStr: string, month: number, day: number }[];   //开始或者结束时间戳数据

    private date: Date;
    private daysInMonth: number;
    private curShowMonth: number;
    private curMonth: number;

    constructor() {
        super();
        this.skinName = `prefab/commonUI/DatePicker`;
    }

    public initUI(): void {
        this.date = new Date();
        this.date.setHours(0);
        this.date.setMinutes(0);
        this.date.setSeconds(0);
        let month = this.date.getMonth() + 1;
        let day = this.date.getDate();
        this.selArr = [this.initDateObj(month, day, 0), this.initDateObj(month, day, 1)];
        this.curSelIdx = 1;
        this.contentView = this.getChildNode(`contentView`);
        this.monthLB = this.getChildNode(`monthLB`).getComponent(Label);
        this.rBtn = this.getChildNode(`rBtn`);
        this.lBtn = this.getChildNode(`lBtn`);
        this.okBtn = this.getChildNode(`okBtn`);
        this.lBtn.on(Node.EventType.TOUCH_END, this.onPreMonth, this);
        this.rBtn.on(Node.EventType.TOUCH_END, this.onNextMonth, this);
        this.okBtn.on(Node.EventType.TOUCH_END, this.onTouchOkBtn, this);

        this.dateLB = this.getChildNode(`dateLB`).getComponent(Label);
        this.list = this.contentView.getComponent(List);
        this.list.setItemRender(DatePickerItem);
        this.list.node.on(List.ON_SELECT_CHANGE, this.onSelectedChange, this);
        this.showPickerDate();
    }

    private onPreMonth(): void {
        let tmpMonth = this.curShowMonth - 1;
        if (tmpMonth < 1) {
            return;
        }
        if (this.curMonth - tmpMonth > 3) {
            App.getInst(ToastUI).showTips(`最多展示最近三个月数据`);
            return;
        }
        let [day, daysInMonth, week, month] = TimeUtils.getMonthInfo(tmpMonth);
        this.setShowMonth(month, daysInMonth, week, this.curMonth == tmpMonth ? day : 0);
        director.emit(`show_picker_date_change`, this.selArr);
    }

    private onNextMonth(): void {
        let tmpMonth = this.curShowMonth + 1;
        if (tmpMonth > this.curMonth) {
            return;
        }

        if (tmpMonth > 12) {
            return;
        }
        let [day, daysInMonth, week, month] = TimeUtils.getMonthInfo(tmpMonth);
        this.setShowMonth(month, daysInMonth, week, this.curMonth == tmpMonth ? day : 0);
        director.emit(`show_picker_date_change`, this.selArr);
    }

    private onTouchOkBtn(): void {
        let startTime = this.selArr[0].time / 1000;
        let endTime = this.selArr[1].time / 1000;
        this.okCb.exe(startTime, endTime);
        this.okCb = null;
        this.closeSelf();
    }

    private okCb: CallBack;

    public open(okCb: CallBack): void {
        this.okCb = okCb;
        let [day, daysInMonth, week, month] = TimeUtils.getMonthInfo();
        //当前月
        this.curMonth = month;
        this.setShowMonth(month, daysInMonth, week, day);
    }

    private setShowMonth(month: number, daysInMonth: number, firstDayWeek: number, day?: number): void {
        this.daysInMonth = daysInMonth;
        this.curShowMonth = month;
        this.monthLB.string = `${month}月`;
        let arr = [];
        let idx = 1;
        for (let i = 1, len = 7 * 5; i <= len; i++) {
            if (i < firstDayWeek) {
                arr.push(0);
                continue;
            } else if (idx > daysInMonth) {
                arr.push(0);
                continue;
            }
            arr.push([idx, day, month]);
            idx++;
        }

        this.list.setData(arr);
    }

    private onSelectedChange(idx: number): void {
        let data = this.list.getListDataByIdx(idx);
        if (data == 0) return;
        let [day, , month] = data;
        //判断日期是左侧还是右侧
        let lDate = this.selArr[this.curSelIdx];
        let tmpLdate = this.initDateObj(month, day, 0)//用左侧的时间戳比较
        //往前就取消之前的选择（起始时间和结束时间相同），往后则记录区间
        if (lDate.time == tmpLdate.time) return;
        else if (tmpLdate.time < lDate.time) {
            //取消之前的区间
            this.selArr[0] = this.initDateObj(month, day, 0);
            this.selArr[1] = this.initDateObj(month, day, 1);
            this.curSelIdx = 0;
        } else {
            //增加区间
            let endObj = this.initDateObj(month, day, 1);
            let dayArea = this.checkDaysInArea(endObj.time);
            console.log("区间：", dayArea, `天`);
            if (dayArea > 30) {
                App.getInst(ToastUI).showTips(`最多选择三十天`);
                return;
            }
            this.selArr[1] = endObj;
            this.curSelIdx = 1;
        }

        this.showPickerDate();
    }

    private initDateObj(month: number, day: number, startOrEnd: number = 0): {
        time: number,
        dateStr: string,
        month: number,
        day: number
    } {
        let date = new Date();
        return {
            time: TimeUtils.getDayTick(month, day, startOrEnd),
            dateStr: `${date.getFullYear()}-${month}-${day}`,
            month,
            day
        };
    }

    private showPickerDate(): void {
        let arr = this.selArr;
        this.dateLB.string = `开始:${arr[0].dateStr} 结束:${arr[1].dateStr}`;
        console.log("选中:", this.dateLB.string);
        director.emit(`show_picker_date_change`, arr);
    }

    private checkDaysInArea(time: number): number {
        let lObj = this.selArr[0];
        let lTime = lObj.time;
        let addTime = time - lTime;
        return Math.ceil(addTime / (TimeUtils.ONE_DAY_TIME_S * 1000))
    }
}

@ccclass("DatePickerItem")
export class DatePickerItem extends ItemRender {
    public dateLB: Label;
    /**底图 */
        // public spriteSplash: Sprite;
    public curDayND: Node;
    public selectedND: Node;

    protected initUI(): void {
        this.dateLB = this.getChildNode(`dateLB`).getComponent(Label);
        this.curDayND = this.getChildNode(`curDayND`);
        this.selectedND = this.getChildNode(`selectedND`);
        director.on(`show_picker_date_change`, this.dateChange, this);
    }

    public dataChanged(): void {
        if (this.data == 0) {
            this.dateLB.string = ``;
            this.curDayND.active = false;
            this.selectedND.active = false;
        } else {
            let [day, curDay] = this.data;
            this.dateLB.string = `${day}`;
            this.curDayND.active = day == curDay;
        }
    }

    private dateChange(arr: { time: number, dateStr: string, month: number, day: number }[]): void {
        if (this.data == 0) return;
        let [day, curDay, month] = this.data;
        let date = new Date();
        date.setMonth(month - 1);
        date.setDate(day);
        let time = date.getTime();
        this.selectedND.active = time > arr[0].time && time < arr[1].time;
    }

    protected onDestroy(): void {
        super.onDestroy();
        director.off(`show_picker_date_change`, this.dateChange, this);
    }
}