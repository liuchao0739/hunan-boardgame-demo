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

import {Label, Node, ProgressBar, sys} from "cc";
import {Main} from "../Main";
import {AppVar} from "../AppVar";

export class HotUpdate {
    public main: Main;
    /**当前版本 */
    public curVer: Label;
    /**热更新进度 */
    public progressND: Node;
    public progressBar: ProgressBar;
    /**进度值 */
    public progressLB: Label;
    public currentPlatform: Label;

    constructor(mainIns) {
        this.main = mainIns;
        this.progressND = this.getChildNode(`progressBar`);
        this.progressBar = this.progressND.getComponent(ProgressBar);
        this.progressBar.progress = 0;
        this.progressLB = this.getChildNode(`progressLB`).getComponent(Label);
        this.progressLB.string = `0%`;
        //更新的进度条隐藏
        this.progressND.active = false;

        this.curVer = this.getChildNode(`curVer`).getComponent(Label);
        this.currentPlatform = this.getChildNode(`currentPlatform`).getComponent(Label);
    }

    public initView(): void {
        let platform = sys.platform;
        this.currentPlatform.string = platform;
    }

    public showVer(): void {
        this.curVer.string = `ver:${AppVar.localVer}`;
    }

    public setText(str: string): void {
        this.currentPlatform.string = str;
    }


    public updateProgress(value: number, msg: string): void {
        if (!this.progressND.active) {
            this.progressND.active = true;
        }
        if (value == null) {
            value = 0;
        }
        this.progressLB.string = Math.floor(value * 100) + '%';
        this.progressBar.progress = value;
    }

    public getChildNode(str: string): Node {
        return this.main.nodePicker.getChildNode(str);
    }
}