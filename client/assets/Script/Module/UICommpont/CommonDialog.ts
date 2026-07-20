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
import {CallBack} from "../../framework/utils/CallBack";

const {ccclass, property} = _decorator;

@ccclass("CommonDialog")
export class CommonDialog extends BaseView {
    /**标题 */
    public titleLB: Label;
    public titleND: Node;
    /**内容 */
    public contentLB: Label;
    /**OK按钮 */
    public okBtn: Node;
    /**取消按钮 */
    public cancelBtn: Node;
    /**关闭按钮 */
    public ctn: Node;

    private okCb: CallBack;
    private cancelCb: CallBack;

    private okLb: Label;
    private cancelLb: Label;
    private bAutoClose: boolean;

    /**按钮数量 */
    private btnCnt: number = 2;

    constructor() {
        super();
        this.skinName = `prefab/commonUI/CommonDialog`;
    }

    public initUI(): void {
        this.titleND = this.getChildNode(`titleND`);
        this.titleLB = this.getChildNode(`titleLB`).getComponent(Label);
        this.okBtn = this.getChildNode(`okBtn`);
        this.cancelBtn = this.getChildNode(`cancelBtn`);
        this.contentLB = this.getChildNode(`contentLB`).getComponent(Label);
        this.okBtn.on(Node.EventType.TOUCH_END, this.onOkBtnTouch, this);
        this.cancelBtn.on(Node.EventType.TOUCH_END, this.onCancelBtnTouch, this);
        this.ctn = this.getChildNode(`ctn`);
        this.okLb = this.getChildNode(`okLb`).getComponent(Label);
        this.cancelLb = this.getChildNode(`cancelLB`).getComponent(Label);
        this.ctn.on(Node.EventType.TOUCH_END, this.onCancelBtnTouch, this);
        this.setBtnCnt(this.btnCnt);
    }

    public open(content: string, okCb?: CallBack, cancelCB?: CallBack, title?: string, bAutoClose: boolean = true, btnCnt = 2): void {
        this.contentLB.string = content;
        this.okCb = okCb;
        this.cancelCb = cancelCB;
        title && (this.titleLB.string = title);
        this.titleND.active = title.length > 0;
        this.bAutoClose = bAutoClose;
        this.setBtnCnt(btnCnt);
    }

    public setBtnCnt(cnt: number): void {
        this.btnCnt = cnt;
        if (cnt < 2) {
            this.cancelBtn && (this.cancelBtn.active = false);
        }
    }

    public resetBtnName(okName: string, cancelName?: string): void {
        if (okName) {
            this.okLb.string = okName;
        }

        if (cancelName) {
            this.cancelLb.string = cancelName;
        }
    }

    private onOkBtnTouch(): void {
        this.bAutoClose && this.closeSelf();
        this.okCb?.exe();
    }

    private onCancelBtnTouch(): void {
        this.bAutoClose && this.closeSelf();
        this.cancelCb?.exe();
    }
}