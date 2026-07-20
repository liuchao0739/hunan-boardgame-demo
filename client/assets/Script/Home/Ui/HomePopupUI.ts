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

import {instantiate, Node} from "cc";
import {PrefabCache} from "../../framework/cache/PrefabCache";
import {HomeCommPopupUI} from "./HomeCommPopupUI";

export class HomePopupUI {
    public root: Node | null = null;

    public toInit(node: Node) {
        this.root = node;
    }

    public showPopup(mPrefName: string) {
        // console.log("showPopup:", mPrefName);
        if (this.root) {
            this.root.active = true;

            let mPref = PrefabCache.getPrefab(mPrefName);
            if (mPref) {
                let mNode = instantiate(mPref);
                // console.log("mnode:", mNode);
                this.root.addChild(mNode);
            }
        }
    }

    /**
     * 显示通用弹窗
     */
    public showCommPopup(mParamObj: any): void {
        this.root.active = true;
        let mPref = PrefabCache.getPrefab("HomeCommPopupPref");
        if (mPref) {
            let mNode = instantiate(mPref);
            this.root.addChild(mNode);
            mNode.getComponent(HomeCommPopupUI)?.updateCont(mParamObj.title, mParamObj.cont);
        }
    }

    public toShow() {
        this.root.active = true;
    }

    public toHide() {
        this.root.active = false;
    }

    public toDestroy() {

    }

}
