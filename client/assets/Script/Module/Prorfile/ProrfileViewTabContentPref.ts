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

import {Graphics, instantiate, Label, Node, UITransform, Vec3} from "cc";
import {NodePicker} from "../../framework/ui/NodePicker";
import {LoginEnity} from "../../Home/Entity/Login";
import {club} from "../../protocols/protocol";
import {ChangFengInfoPref} from "./ChangFengInfoPref";
import {FanZhongCompletedPref} from "./FanZhongCompletedPref";
import {CallBack} from "../../framework/utils/CallBack";
import {CardGroupCom} from "../UICommpont/CardGroupCom";
import {CommUtils} from "../../framework/utils/CommUtils";
import {eSysId, ViewMgr} from "../../framework/mgr/ViewMgr";
import {App} from "../App";

export enum eRecordTab {
    club = 1,
    friend
}

export class ProrfileViewTabContentPref {
    public node: Node;
    public nodePicker: NodePicker;
    private info: club.IStatistic;

    public gongLB: Label;
    public fangLB: Label;
    public yunLB: Label;
    public suLB: Label;

    /**暂无和牌 */
    public NoHeLB: Node;
    /**役满/倍满/跳满 */
    public HeImg: Node;
    public yimanND1: Node;
    public yimanND2: Node;
    /**问号 */
    public helpND: Node;


    /**绘制属性雷达*/
    public radarNode: Graphics;
    /**雷达的四个轴最大长度*/
    public radarMax: number[];
    public radarBase: number[];
    /**数据最大值是100 */
    public radarMaxValue = 100;

    /**走势节点 */
    public lastStateContent: Node;
    /**走势点 */
    public statePoint: Node;
    /**走势划线渲染器 */
    public statePointNode: Graphics;
    /**卡牌牌堆 */
    public cardGroupCom: CardGroupCom;


    public changFengInfoPrefD: ChangFengInfoPref;
    public changFengInfoPrefN: ChangFengInfoPref;
    public fanZhongCompletedPref: FanZhongCompletedPref;

    private curIdx: eRecordTab;
    private defaultH: number;

    constructor(node: Node) {
        this.node = node;
        this.nodePicker = new NodePicker();
        this.nodePicker.root = this.node;


        this.NoHeLB = this.getChildNode(`NoHeLB`);
        this.HeImg = this.getChildNode(`HeImg`);
        this.yimanND1 = this.getChildNode(`yimanND1`);
        this.yimanND2 = this.getChildNode(`yimanND2`);
        this.helpND = this.getChildNode(`helpND`);
        this.helpND.on(Node.EventType.TOUCH_END, this.onHelpND, this);
        this.cardGroupCom = this.getChildNode("CardGroupCom").getComponent(CardGroupCom);
        this.gongLB = this.getChildNode(`gongLB`).getComponent(Label);
        this.fangLB = this.getChildNode(`fangLB`).getComponent(Label);
        this.yunLB = this.getChildNode(`yunLB`).getComponent(Label);
        this.suLB = this.getChildNode(`suLB`).getComponent(Label);

        this.radarNode = this.getChildNode(`radarNode`).getComponent(Graphics);
        let uiTransform = this.radarNode.getComponent(UITransform);
        let top = uiTransform.height / 2;
        let right = uiTransform.width / 2;
        let left = -right;
        let bottom = -top;
        this.radarMax = [top, right, left, bottom];
        let base = 20;
        this.radarBase = [base, base, -base, -base];


        this.lastStateContent = this.getChildNode("lastStateContent");
        this.statePoint = this.getChildNode(`statePoint`);

        this.statePointNode = this.getChildNode(`statePointNode`).getComponent(Graphics);
        this.fanZhongCompletedPref = new FanZhongCompletedPref(this.getChildNode(`FanZhongCompletedPref`), new CallBack(this.updateSize, this));

        let listContentNode = this.getChildNode(`listContent`);
        this.changFengInfoPrefD = new ChangFengInfoPref(this.nodePicker.getChildFormNode(listContentNode, `ChangFengInfoPrefD`), new CallBack(this.updateSize, this));
        this.changFengInfoPrefN = new ChangFengInfoPref(this.nodePicker.getChildFormNode(listContentNode, `ChangFengInfoPrefN`), new CallBack(this.updateSize, this));

        let size = this.node.getComponent(UITransform);
        this.defaultH = size.height;
    }

    private onHelpND(): void {
        App.getInst(ViewMgr).open(eSysId.FengGeHelpPref);
    }

    public getChildNode(str: string): Node {
        return this.nodePicker.getChildNode(str);
    }

    public showTab(idx: eRecordTab): void {
        if (idx == eRecordTab.club) {
            this.info = LoginEnity.clubstatistic;
        } else if (idx == eRecordTab.friend) {
            this.info = LoginEnity.friendstatistic;
        }

        this.curIdx = idx;

        this.gongLB.string = `${this.info.power}` || `0`;
        this.fangLB.string = `${this.info.defense}` || `0`;
        this.yunLB.string = `${this.info.luck}` || `0`;
        this.suLB.string = `${this.info.speed}` || `0`;
        let arr = [];
        let tmp = [this.info.power, this.info.luck, this.info.defense, this.info.speed];


        for (let i = 0, len = tmp.length; i < len; i++) {
            let value = tmp[i];
            let baseLen = this.radarBase[i];
            let max = this.radarMax[i] - baseLen;
            let p = value / this.radarMaxValue * max + baseLen; //算出目标点实际长度
            let func = (idx, b) => {
                switch (idx) {
                    case 0:
                        return new Vec3(0, b, 0);
                    case 1:
                        return new Vec3(b, 0, 0);
                    case 2:
                        return new Vec3(0, b, 0);
                    case 3:
                        return new Vec3(b, 0, 0);
                }
                return null;
            }
            arr.push(func(i, p))
        }

        let remCards = this.info.recentHeCard ? this.info.recentHeCard.RemCards : [];
        this.cardGroupCom.updateDate(this.info.recentHeCard, this.info.winCard);
        if (remCards.length) {
            this.HeImg.active = true;
            //判断牌型
            CommUtils.showYiMan([this.yimanND1, this.yimanND2], this.info.recentHeCard.ShowType);
        } else {
            this.HeImg.active = false;
        }

        this.NoHeLB.active = !remCards.length;


        //先清除
        this.radarNode.clear();
        let pos = arr[0];
        this.radarNode.moveTo(pos.x, pos.y);
        let pNode = this.getChildNode(`point0`);
        let v3 = new Vec3(pos.x, pos.y, 0);
        pNode.setPosition(v3);
        for (let i = 1, len = arr.length; i < len; i++) {
            let pos = arr[i];
            pNode = this.getChildNode(`point${i}`);
            v3.x = pos.x;
            v3.y = pos.y;
            pNode.setPosition(v3)
            this.radarNode.lineTo(pos.x, pos.y);
        }
        this.radarNode.close();
        this.radarNode.fill();
        this.radarNode.stroke();


        //添加走势节点
        this.drawPosition();

        //场风数据
        this.changFengInfoPrefD.data = this.info.East || {};
        this.changFengInfoPrefN.data = this.info.South || {};

        //胡牌记录
        this.fanZhongCompletedPref.updateData(this.info.fans);
    }

    public updateSize(offsetH: number): void {
        let size = this.node.getComponent(UITransform);
        size.height += offsetH;
    }

    private drawPosition(): void {
        this.lastStateContent.removeAllChildren();
        let position = this.info.position;
        this.statePointNode.clear();
        if (!position || !position.length) return;
        let v3 = new Vec3();
        let spaceW = 35;
        let spaceH = 24;
        for (let i = 0, len = position.length; i < len; i++) {
            let pos = position[i] - 1;
            v3.x = i * spaceW;
            v3.y = -pos * spaceH;
            let node = instantiate(this.statePoint);
            node.setPosition(v3.x, v3.y);
            this.lastStateContent.addChild(node);
            if (i == 0) {
                this.statePointNode.moveTo(v3.x, v3.y);
            } else {
                this.statePointNode.lineTo(v3.x, v3.y);
            }
        }

        this.statePointNode.stroke();
    }
}