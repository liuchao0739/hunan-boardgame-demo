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

import {_decorator, assetManager, Label, Node, ProgressBar} from "cc";
import {BaseView} from "../../framework/ui/BaseView";
import {AppVar} from "../AppVar";

const {ccclass, property} = _decorator;

@ccclass("HotUpdatePref")
export class HotUpdatePref extends BaseView {
    /**取消下载 (杀掉APP)*/
    public cancelBtn: Node;
    /**开始更新 */
    public okBtn: Node;
    /**下载进度 */
    public progressNode: Node;
    public progressBar: ProgressBar;
    public progressLB: Label;
    /**安装按钮 */
    public installBtn: Node;
    /**使用外联下载链接 */
    public webDownLoadLB: Node;
    /**下载准备界面 */
    public readyDownNode: Node;

    constructor() {
        super();
        this.skinName = `prefab/hotUpdate/HotUpdatePref`;
    }

    public initUI(): void {
        this.cancelBtn = this.getChildNode(`cancelBtn`);
        this.okBtn = this.getChildNode(`okBtn`);
        this.progressNode = this.getChildNode(`progressBar`);
        this.progressBar = this.progressNode.getComponent(ProgressBar);
        this.progressLB = this.getChildNode(`progressLB`).getComponent(Label);
        this.installBtn = this.getChildNode(`installBtn`);
        this.webDownLoadLB = this.getChildNode(`webDownLoadLB`);
        this.readyDownNode = this.getChildNode(`readyDownNode`);
        this.progressLB = this.getChildNode(`progressLB`).getComponent(Label);

        this.okBtn.on(Node.EventType.TOUCH_END, this.onDownLoad, this);
    }

    /**
     * 下载
     */
    private onDownLoad(): void {
        //隐藏按钮
        this.readyDownNode.active = false;
        this.progressNode.active = true;
        assetManager.downloader.download("mahjong", AppVar.downloadUrl, '.apk', {onFileProgress: this.onFileProgress.bind(this)}, this.onLoadCompleted.bind(this));
    }

    private onFileProgress(loaded, total): void {
        let value = Number((loaded / total).toFixed(2));
        this.progressBar.progress = value;
        this.progressLB.string = `${value * 100}%`;
    }

    private onLoadCompleted(err, data): void {
        if (err) {
            console.log(`下载失败`);
            return;
        }
        console.log(`下载成功`);
        this.progressNode.active = false;
        this.installBtn.active = true;
    }
}