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

import {Label, Node, UITransform, Vec3} from "cc";
import {NodePicker} from "../../framework/ui/NodePicker";
import {club} from "../../protocols/protocol";
import {CallBack} from "../../framework/utils/CallBack";
import {removeSelf} from "../../framework/mgr/ViewMgr";
import {CommUtils} from "../../framework/utils/CommUtils";

/**
 * 场风数据
 */
export class ChangFengInfoPref {
    private node: Node;
    public nodePicker: NodePicker;
    private _info: club.IChangStatistic;
    public contentNode: Node;

    public no1Rate: Label;
    public no2Rate: Label;
    public no3Rate: Label;
    public no4Rate: Label;
    public kickOutRate: Label;

    public totalRound: Label;
    public aveWinPoint: Label;
    public aveFailPoint: Label;
    public aveRate: Label;
    public LianZhuang: Label;
    public aveWinXun: Label;


    public winRate: Label;
    public ziMoRate: Label;
    public failRate: Label;
    public fuluRate: Label;
    public readyRate: Label;
    public extendIMG: Node;

    /**数据是否折叠 */
    private _bExtend: boolean;
    /**当前控件高度 */
    private _curH: number;
    private _contentH: number;

    private resizeCb: CallBack;

    constructor(node: Node, cb: CallBack) {
        this.node = node;
        this.resizeCb = cb;
        this.nodePicker = new NodePicker();
        this.nodePicker.root = this.node;

        [`aveRate`, `no1Rate`, `no2Rate`, `no3Rate`, `no4Rate`,
            `aveWinXun`, `winRate`, `failRate`, `readyRate`,
            `fuluRate`, `totalRound`, `aveWinPoint`, `aveFailPoint`
        ].forEach(str => {
            this[str] = this.nodePicker.getChildNode(str).getComponent(Label);
        })

        this.extendIMG = this.nodePicker.getChildNode(`extendIMG`);
        this.extendIMG.on(Node.EventType.TOUCH_END, this.onExtendTouch, this);

        this.contentNode = this.nodePicker.getChildNode("contentNode");
        this._curH = this._contentH = 160;
        this.onExtendTouch();
    }

    private onExtendTouch(): void {
        this._bExtend = !this._bExtend;
        this.extendIMG.setRotationFromEuler(new Vec3(0, 0, this._bExtend ? 90 : 0));
        let preH = this._curH;
        if (this._bExtend) {
            this._curH = 30
            removeSelf(this.contentNode);
        } else {
            this.nodePicker.getChildNode("Node").addChild(this.contentNode);
            this._curH = this._contentH + 30;
        }

        let size = this.node.getComponent(UITransform);
        size.height = this._curH;
        this.resizeCb.exen(this._curH - preH);
    }


    public set data(info: club.IChangStatistic) {
        this._info = info;
        this.aveRate.string = CommUtils.formatNum(info.AveRate) + "";
        this.no1Rate.string = CommUtils.formatNum(info.No1Rate) + "%";
        this.no2Rate.string = CommUtils.formatNum(info.No2Rate) + "%";
        this.no3Rate.string = CommUtils.formatNum(info.No3Rate) + "%";
        this.no4Rate.string = CommUtils.formatNum(info.No4Rate) + "%";

        this.winRate.string = CommUtils.formatNum(info.WinRate) + "%";
        this.failRate.string = CommUtils.formatNum(info.FailRate) + "%";
        this.readyRate.string = CommUtils.formatNum(info.ReadyRate) + "%";
        this.fuluRate.string = CommUtils.formatNum(info.FuluRate) + "%";

        this.aveWinXun.string = CommUtils.formatNum(info.AveWinXun) + "";
        this.totalRound.string = (info.TotalRound || 0) + "";
        this.aveWinPoint.string = (info.AveWinPoint || 0) + "";
        this.aveFailPoint.string = (info.AveFailPoint || 0) + "";
    }

    public getH(): number {
        return this._curH;
    }
}