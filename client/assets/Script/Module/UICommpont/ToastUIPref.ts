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

import {_decorator, Label, tween, UIOpacity} from "cc";
import {BaseView} from "../../framework/ui/BaseView";

const {ccclass, property} = _decorator;

@ccclass('ToastUIPref')
export class ToastUIPref extends BaseView {
    public contLB: Label;
    private _rootOpacity: UIOpacity;
    private _toastTween = null;

    constructor() {
        super();
        this.skinName = `prefab/commonUI/ToastUIPref`;
    }

    public initUI(): void {
        this.contLB = this.getChildNode(`contLB`).getComponent(Label);
        this._rootOpacity = this.node.getComponent(UIOpacity);
    }

    public open(mTips: string): void {
        this.contLB.string = mTips;
        if (this._toastTween) {
            this._toastTween.stop();
        }

        this.root.active = true;
        this._toastTween = tween(this._rootOpacity).to(0.4, {opacity: 255})
            .delay(0.8)
            .to(0.63, {opacity: 0})
            .call(() => {
                this.closeSelf();
                this._rootOpacity.opacity = 255;
            }).start();
    }
}