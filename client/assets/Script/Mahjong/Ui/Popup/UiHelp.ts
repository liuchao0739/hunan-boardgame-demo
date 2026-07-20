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
import {UiPopupHelper} from "../../../framework/utils/UiPopupHelper";

export class UiHelp {

    public static ins: UiHelp = null;

    public static create() {

    }

    public root: Node = null;

    public init(node: Node) {

        this.root = node;
        this.root.active = false;

        UiPopupHelper.btnCloseHideRoot(this.root);

        this.TabHeaderBtn1 = this.root.getChildByPath("TabHeader/btn1");
        this.TabHeaderBtn2 = this.root.getChildByPath("TabHeader/btn2");
        this.page1 = this.root.getChildByPath("Page1");
        this.page2 = this.root.getChildByPath("Page2");

        this.TabHeaderBtn1.on(Input.EventType.TOUCH_END, () => {
            this.page1.active = true;
            this.page2.active = false;
        });
        this.TabHeaderBtn2.on(Input.EventType.TOUCH_END, () => {
            this.page1.active = false;
            this.page2.active = true;
        });

        let page1 = new UiHelpPage1();
        page1.init(this.root);

        let page2 = new UiHelpPage2();
        page2.init(this.root);

    }

    public initPage1(node: Node) {


    }

    public show() {
        this.root.active = true;
        UiPopupHelper.show(this.root);

    }

    private TabHeaderBtn1: Node;
    private TabHeaderBtn2: Node;

    private page1: Node;
    private page2: Node;

}


class UiHelpPage1 {

    public root: Node;

    public init(node: Node) {

        this.root = node.getChildByPath("Page1");

        let rootTabHeader = this.root.getChildByPath("TabHeader");
        let rootPage = this.root.getChildByPath("Page");

        for (let i = 0; i < 8; ++i) {

            let page = rootPage.children[i];
            this.pages.push(page);

            let idx = i;
            let tabHeaderBtn = rootTabHeader.children[i];
            tabHeaderBtn.on(Input.EventType.TOUCH_END, () => {
                this.hideAllPages();
                this.pages[idx].active = true;

            });
        }

    }

    public hideAllPages() {
        for (let i = 0; i < this.pages.length; ++i) {
            this.pages[i].active = false;
        }
    }

    private pages = new Array<Node>();

}

class UiHelpPage2 {

    public root: Node;

    public init(node: Node) {

        this.root = node.getChildByPath("Page2");

        this.root.getChildByPath("Btns/btn1").on(Input.EventType.TOUCH_END, () => {
            if (this.idx <= 0) return;
            --this.idx;
            this.refreshNo();
        });
        this.root.getChildByPath("Btns/btn2").on(Input.EventType.TOUCH_END, () => {
            if (this.idx >= 7) return;
            ++this.idx;
            this.refreshNo();
        });
        this.pageNo = this.root.getChildByPath("Btns/Label").getComponent(Label);

        this.refreshNo();

        let c = this.root.getChildByPath("Page").children;
        for (let t of c) {
            this.pages.push(t);
        }

    }

    public refreshNo() {
        this.pageNo.string = (this.idx + 1) + "/8";
    }

    public showPageCurrent() {
        this.hideAllPages();
        this.pages[this.idx].active = true;
    }

    public hideAllPages() {
        for (let i = 0; i < this.pages.length; ++i) {
            this.pages[i].active = false;
        }
    }

    private idx = 0;

    private pages = new Array<Node>();
    private pageNo: Label;

}