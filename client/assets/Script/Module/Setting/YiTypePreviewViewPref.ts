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

import {_decorator, Toggle, ToggleContainer} from "cc";
import {BaseView} from "../../framework/ui/BaseView";
import {YiTypePreviewPageCom} from "./YiTypePreviewPageCom";
import {NewBirdGuidePagePref} from "./NewBirdGuidePagePref";

const {ccclass, property} = _decorator;

@ccclass("YiTypePreviewViewPref")
export class YiTypePreviewViewPref extends BaseView {
    public previewTab: ToggleContainer;
    public YiPreviewToggle: Toggle;
    public NewBirdToggle: Toggle;
    public yiTypePreviewPagePref: YiTypePreviewPageCom;
    public newBirdGuidePagePref: NewBirdGuidePagePref;

    private previewTabName: string;
    private curIdx: number;

    constructor() {
        super();
        this.skinName = `prefab/SettingUI/YiTypePreviewViewPref`;
    }

    public initUI(): void {
        let node = this.root.getChildByName("Canvas");
        this.previewTab = node.getChildByName(`previewTab`).getComponent(ToggleContainer);
        this.yiTypePreviewPagePref = new YiTypePreviewPageCom(node.getChildByName(`YiTypePreviewPagePref`));
        this.newBirdGuidePagePref = new NewBirdGuidePagePref(node.getChildByName(`NewBirdGuidePagePref`));
        this.YiPreviewToggle = node.getChildByPath("previewTab/YiPreviewToggle").getComponent(Toggle);
        this.NewBirdToggle = node.getChildByPath("previewTab/NewBirdToggle").getComponent(Toggle);

        this.previewTab.node.children.forEach(tmpNode => {
            tmpNode.on(Toggle.EventType.CLICK, this._onPreviewTabChange, this);
        })
    }


    public open(tabIdx: number = 0, subIdx?: number): void {
        this.curIdx = tabIdx;
        this.showPreViewTab([`YiPreviewToggle`, `NewBirdToggle`][tabIdx]);
    }


    private showPreViewTab(str: string): void {
        switch (str) {
            case `YiPreviewToggle`:
                console.log("11111111111111");
                this.curIdx = 0;
                this.yiTypePreviewPagePref.active = true;
                this.newBirdGuidePagePref.active = false;
                this.yiTypePreviewPagePref.showTab();
                break;
            case `NewBirdToggle`:
                console.log("222222222222222");
                this.curIdx = 1;
                this.yiTypePreviewPagePref.active = false;
                this.newBirdGuidePagePref.active = true;
                this.newBirdGuidePagePref.showImg(0);
                break;
        }

        this.previewTabName = str;
    }

    public _onPreviewTabChange(target: Toggle): void {
        let name = target.node.name;
        if (this.previewTabName == name) return;
        this.showPreViewTab(name);
    }
}