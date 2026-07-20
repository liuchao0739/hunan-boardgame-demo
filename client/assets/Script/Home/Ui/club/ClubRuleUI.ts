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

import {_decorator, Component, EventTouch, Label, Node} from 'cc';
import {ClubEntity} from '../../Entity/ClubEntity';

const {ccclass, property} = _decorator;

@ccclass('ClubRuleUI')
export class ClubRuleUI extends Component {
    private _btnClose: Node | null = null;
    private _ruleNameLB: Label | null = null;
    private _item1ValLB: Label | null = null;// 时长
    private _item2ND: Node | null = null;    // 级别节点
    private _item2ValLB: Label | null = null;// 级别
    private _item3ND: Node | null = null;    // 带入节点
    private _item3ValLB: Label | null = null;// 带入
    private _item4ValLB: Label | null = null;// 起始
    private _item5ValLB: Label | null = null;// 赤宝牌
    private _item6ValLB: Label | null = null;// 头跳
    private _item7ValLB: Label | null = null;// 双倍役满
    private _item8ValLB: Label | null = null;// 模切提示
    private _item9ValLB: Label | null = null;// 便捷提示
    private _item10ValLB: Label | null = null;// 途中流局
    private _item11: Node | null = null;// 额外得点
    private _exp1ValLB: Label | null = null;
    private _exp2ValLB: Label | null = null;
    private _exp3ValLB: Label | null = null;
    private _exp4ValLB: Label | null = null;

    onLoad() {
        this._btnClose = this.node.getChildByPath("bg/btnClose");
        this._ruleNameLB = this.node.getChildByPath("bg/ruleNameLB").getComponent(Label);
        this._item1ValLB = this.node.getChildByPath("bg/cont/item1/valueLB").getComponent(Label);
        this._item2ND = this.node.getChildByPath("bg/cont/item2");
        this._item2ValLB = this.node.getChildByPath("bg/cont/item2/valueLB").getComponent(Label);
        this._item3ND = this.node.getChildByPath("bg/cont/item3");
        this._item3ValLB = this.node.getChildByPath("bg/cont/item3/valueLB").getComponent(Label);
        this._item4ValLB = this.node.getChildByPath("bg/cont/item4/valueLB").getComponent(Label);
        this._item5ValLB = this.node.getChildByPath("bg/cont/item5/valueLB").getComponent(Label);
        this._item6ValLB = this.node.getChildByPath("bg/cont/item6/valueLB").getComponent(Label);
        this._item7ValLB = this.node.getChildByPath("bg/cont/item7/valueLB").getComponent(Label);
        this._item8ValLB = this.node.getChildByPath("bg/cont/item8/valueLB").getComponent(Label);
        this._item9ValLB = this.node.getChildByPath("bg/cont/item9/valueLB").getComponent(Label);
        this._item10ValLB = this.node.getChildByPath("bg/cont/item10/valueLB").getComponent(Label);
        this._exp1ValLB = this.node.getChildByPath("bg/cont/item11/exp1/valueLB").getComponent(Label);
        this._exp2ValLB = this.node.getChildByPath("bg/cont/item11/exp2/valueLB").getComponent(Label);
        this._exp3ValLB = this.node.getChildByPath("bg/cont/item11/exp3/valueLB").getComponent(Label);
        this._exp4ValLB = this.node.getChildByPath("bg/cont/item11/exp4/valueLB").getComponent(Label);

        this._btnClose.on(Node.EventType.TOUCH_END, this._onCloseTouch, this);
    }

    private _onCloseTouch(evt: EventTouch): void {
        this.node.destroy();
    }

    refresh(): void {
        let mTableData = ClubEntity.currTableData
        console.log("mtableData:", mTableData);
        if (mTableData) {
            let mDataStr: string = "";
            mDataStr = mTableData.mode == 0 ? "四人 • " : "";
            mDataStr += mTableData.roundNo == 0 ? "东风战" : "东南战";
            this._ruleNameLB.string = mDataStr;

            mDataStr = "";
            if (mTableData.thinkTime == 0) {
                mDataStr = "3+5";
            } else if (mTableData.thinkTime == 1) {
                mDataStr = "5+20";
            } else if (mTableData.thinkTime == 2) {
                mDataStr = "60+0";
            } else if (mTableData.thinkTime == 3) {
                mDataStr = "300+0";
            }
            // 时长
            this._item1ValLB.string = mDataStr;

            // 级别
            this._item2ValLB.string = "等级" + mTableData.level;
            // 带入
            this._item3ValLB.string = "" + mTableData.bringInAmount;


            // 起始
            this._item4ValLB.string = "" + mTableData.startPoint;

            mDataStr = "";
            if (mTableData.redCard == 0) {
                mDataStr = "无赤";
            }
                // 赤宝牌 0--无赤 3--3赤
            // TODO:TEST 原来定的规矩是1为3赤，为兼容原来的数据
            else if (mTableData.redCard == 1 || mTableData.redCard == 3) {
                mDataStr = "3赤";
            }
            // 赤宝牌
            this._item5ValLB.string = mDataStr;
            // 头跳
            this._item6ValLB.string = mTableData.headJumpFlag === 1 ? "开启" : "关闭";
            // 双倍役满
            this._item7ValLB.string = mTableData.doubleFlag === 1 ? "开启" : "关闭";
            // 模切提示
            this._item8ValLB.string = mTableData.hintFlag === 1 ? "开启" : "关闭";
            // 便捷提示
            this._item9ValLB.string = mTableData.convenientFlag === 1 ? "开启" : "关闭";
            // 途中流局
            this._item10ValLB.string = mTableData.noWinnerFlag === 1 ? "开启" : "关闭";
            this._exp1ValLB.string = mTableData.exPoint1 + "";
            this._exp2ValLB.string = mTableData.exPoint2 + "";
            this._exp3ValLB.string = mTableData.exPoint3 + "";
            this._exp4ValLB.string = mTableData.exPoint4 + "";

            // 俱乐部类型 0--铜 1--钻 普通不显示级别、带入
            if (ClubEntity.clubInfor.clubType == 1) {
                this._item2ND.active = true;
                this._item3ND.active = true;
            } else {
                this._item2ND.active = false;
                this._item3ND.active = false;
            }
        }

    }

    // start() {

    // }

    // update(deltaTime: number) {

    // }
}

