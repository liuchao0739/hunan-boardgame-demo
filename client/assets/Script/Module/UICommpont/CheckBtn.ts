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

import {_decorator, CCBoolean, CCString, Component, Input, Label, Node} from 'cc';

const {ccclass, property} = _decorator;

@ccclass
export default class CheckBtn extends Component {

    @property({type: Node, tooltip: "控件显示的文字"})
    public label: Node;

    @property({type: CCString, tooltip: "控件文字"})
    public labString: string;

    @property({type: Node, tooltip: "按钮部分"})
    public toggleBtn: Node;

    @property({type: CCBoolean, tooltip: "是否选中"})
    public bSelect: boolean;

    @property({type: Node, tooltip: "打开时显示"})
    public onNode: Node;
    @property({type: Node, tooltip: "关闭时显示"})
    public offNode: Node;


    protected onLoad(): void {
        this.label.getComponent(Label).string = this.labString || "";
        this.toggleBtn.on(Input.EventType.TOUCH_END, this.onToggleBtnTouch, this);
        if (this.bSelect == undefined) {
            this.bSelect = false;
        }

        this.onNode.active = this.bSelect;
        this.offNode.active = !this.bSelect;
    }

    protected onToggleBtnTouch(): void {
        this.bSelect = !this.bSelect;
        this.onNode.active = this.bSelect;
        this.offNode.active = !this.bSelect;
    }

    start() {

    }

    update(deltaTime: number) {

    }
}

