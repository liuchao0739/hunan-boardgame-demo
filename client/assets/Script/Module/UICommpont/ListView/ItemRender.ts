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

import {_decorator, Component, Node} from "cc";
import {CallBack} from "../../../framework/utils/CallBack";
import {NodePicker} from "../../../framework/ui/NodePicker";

const {ccclass, property} = _decorator;

@ccclass
export default class ItemRender extends Component {
    /**数据 */
    public data: any = null;
    /**索引 0表示第一项*/
    public itemIndex: number = 0;

    public selectCb: CallBack;

    protected nodePicker: NodePicker;

    protected onLoad(): void {
        this.nodePicker = new NodePicker();
        this.nodePicker.root = this.node;
        this.initUI();
    }

    protected start(): void {
        this.node.on(Node.EventType.TOUCH_END, this.onTouchItem, this);
    }

    protected initUI(): void {

    }

    protected onTouchItem(): void {
        if (this.selectCb) {
            this.selectCb.exen(this);
        }
    }

    /**数据改变时调用 */
    public dataChanged() {
        // this.node.getChildByName("rankLab").getComponent(Label).string = this.data.rank + "";
        // this.node.getChildByName("nameLab").getComponent(Label).string = this.data.name + "";
    }

    public unSelectState(): void {

    }

    public selectState(): void {

    }

    protected onDestroy(): void {
        this.selectCb.free();
        this.selectCb = null;
    }

    protected getChildNode(str: string): Node {
        return this.nodePicker.getChildNode(str);
    }
}
