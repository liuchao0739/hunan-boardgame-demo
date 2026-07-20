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

import {instantiate, Label, Node, UITransform, Vec3} from "cc";
import {NodePicker} from "../../framework/ui/NodePicker";
import {iYiConf, SettingConfHelp} from "../Setting/const/SettingConfHelp";
import {removeSelf} from "../../framework/mgr/ViewMgr";
import {CallBack} from "../../framework/utils/CallBack";
import {club} from "../../protocols/protocol";
import {ArrayUtils} from "../../framework/utils/array-utils";
import {E_FAN_TYPE} from "../../const/EnumConst";

/**
 * 番种达成情况
 */
export class FanZhongCompletedPref {
    public node: Node;
    public nodePicker: NodePicker;
    public contentNode: Node;
    public fanZhongCompletedItemPrefNode: Node;
    public extendIMG: Node;
    public spriteSplash: Node;
    /**数据是否折叠 */
    private _bExtend: boolean = true;
    /**当前控件高度 */
    private _curH: number;
    private _contentH: number;

    private resizeCb: CallBack;
    private bInit: boolean = false;

    constructor(node: Node, cb: CallBack) {
        this.node = node;
        this.resizeCb = cb;
        this.bInit = false;
        this.nodePicker = new NodePicker();
        this.nodePicker.root = this.node;

        this.contentNode = this.nodePicker.getChildNode("contentNode");
        this.fanZhongCompletedItemPrefNode = this.nodePicker.getChildNode(`FanZhongCompletedItemPref`);
        this.contentNode.removeAllChildren();
        this._curH = 30;
        this.resizeCb.exen(-20);

        this.extendIMG = this.nodePicker.getChildNode(`extendIMG`);
        this.extendIMG.on(Node.EventType.TOUCH_END, this.onExtendTouch, this);
        this.extendIMG.setRotationFromEuler(new Vec3(0, 0, this._bExtend ? 90 : 0));

        this.spriteSplash = this.nodePicker.getChildNode("contentBg");
    }

    private onExtendTouch(): void {
        this._bExtend = !this._bExtend;
        this.extendIMG.setRotationFromEuler(new Vec3(0, 0, this._bExtend ? 90 : 0));
        let preH = this._curH;
        let bgSize = this.spriteSplash.getComponent(UITransform);
        if (this._bExtend) {
            this._curH = 30;
            removeSelf(this.contentNode);
            bgSize.height = 0;
        } else {
            if (!this.bInit) {
                this.bInit = true;
                //插入所有的番型
                let height = 0;
                let spaceH = 5;
                let idx = 1;
                for (let i = 1; i <= 7; i++) {
                    let confDataArr = SettingConfHelp.getYiConfsById(i);
                    confDataArr.forEach(conf => {
                        let clz = instantiate(this.fanZhongCompletedItemPrefNode);
                        let item = new FanZhongCompletedItemPref(clz);
                        item.setData(conf, this.getFanValue(conf.id));
                        setInterval(() => {
                            this.contentNode.addChild(clz);
                        }, idx);
                        idx++;
                        height += 20 + spaceH;
                    })
                }

                let size = this.node.getComponent(UITransform);
                size.height = this._curH = this._contentH = 30 + height;
            }
            bgSize.height = this._contentH;
            this.nodePicker.getChildNode("Node").addChild(this.contentNode);
            this._curH = this._contentH + 30;
        }
        this.resizeCb.exen(this._curH - preH);
    }

    private fans;

    public updateData(fans: club.IFan[]): void {
        this.fans = fans;
    }


    public getFanValue(type: number): number {
        if (!this.fans) return 0;
        let fans = this.fans;
        let func = function (id: number): number {
            let idx = ArrayUtils.getIndexByKey(fans, `type`, id);
            if (idx > -1) {
                return fans[idx].value;
            }
            return 0;
        }
        if (type == E_FAN_TYPE.JP_SANYUAN_KE_SCORE) {
            //10 , 11, 12 都代表三元牌
            return func(10) + func(11) + func(12);
        }
        return func(type);
    }

    public getH(): number {
        return this._curH;
    }
}

export class FanZhongCompletedItemPref {
    private node: Node;
    public nodePicker: NodePicker;
    /**役名 */
    public labLB: Label;
    /**达成数量 */
    public cntLB: Label;
    public spaceNB: Node;
    public lineNB: Label
    private _conf: iYiConf;

    constructor(node: Node) {
        this.node = node;
        this.nodePicker = new NodePicker();
        this.nodePicker.root = this.node;
        this.labLB = this.nodePicker.getChildNode(`labLB`).getComponent(Label);
        this.cntLB = this.nodePicker.getChildNode(`cntLB`).getComponent(Label);
        this.spaceNB = this.nodePicker.getChildNode(`spaceNB`);
        this.lineNB = this.nodePicker.getChildNode(`lineNB`).getComponent(Label);
    }

    public setData(data: iYiConf, value: number) {
        console.log("===setdata")
        this._conf = data;
        let name = data.name;
        this.labLB.string = `${data.name}`;
        this.labLB.updateRenderData(true);
        this.setCount(value);
        let lineW = this.spaceNB.getComponent(UITransform).width = 380 - this.labLB.getComponent(UITransform).width - this.cntLB.getComponent(UITransform).width;
        let lineCnt = Math.floor(lineW / 16);
        let strMark = Array(lineCnt).join("---");
        this.lineNB.string = strMark;
    }

    public setCount(cnt: number): void {
        this.cntLB.string = cnt + "";
        this.cntLB.updateRenderData(true);
    }
}