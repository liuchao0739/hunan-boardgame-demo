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

import {Input, Label, Node} from "cc";
import {CommSend} from "../../Communication/CommSend";


export class UiBtnTrustee {

    public root: Node = null;

    public init(node: Node) {

        this.root = node.getChildByPath("btnTrustee");
        // this.root.active = false ;// TODO:暂时去掉

        this.root.on(Input.EventType.TOUCH_END, this.onClick.bind(this));

        this.setMode(true);

    }

    // true 托管。false 取消托管
    public setMode(val: boolean) {
        console.log("【设置托管】：", val)
        this.mode = val;
        this.root.getComponentInChildren(Label).string = val ? "托管" : "取消托管";
    }

    public onClick() {
        // 先发托管消息
        CommSend.trustee(this.mode);

        this.mode = !this.mode;
        this.root.getComponentInChildren(Label).string = this.mode ? "托管" : "取消托管";
    }

    public mode: boolean;

}