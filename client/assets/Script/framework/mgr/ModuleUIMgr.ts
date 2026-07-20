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

import {instantiate, Node, Prefab, resources} from "cc";
import {PrefabCache} from "../../framework/cache/PrefabCache";

export class ModuleUIMgr {
    public root: Node | null = null;

    private _uiPrefabMap: Map<string, Prefab> = null;

    // prefabMap : Map< string , Prefab> = null;
    public toInit(node: Node) {
        this.root = node;
        // this._uiArr = [];
        if (!this._uiPrefabMap) {
            this._uiPrefabMap = new Map<string, Prefab>();
        }
    }


    public showUi(mUiPrefName: string, mUiScript: string = null) {
        console.log("showPopup:", mUiPrefName);
        this.root.active = true;


        // console.log("children:", this.root.children.length);
        let mUiPref = PrefabCache.getPrefab(mUiPrefName);
        if (mUiPref) {
            if (!this._uiPrefabMap.get(mUiPrefName)) {
                this._uiPrefabMap.set(mUiPrefName, mUiPref);
            }

            let mUiNode = instantiate(mUiPref);
            // console.log("mnode:", mUiNode);
            this.root.addChild(mUiNode);

            if (mUiScript) {
                mUiNode.getComponent(mUiScript)?.["refresh"]();
            }
        } else {


        }
    }

    // 登录界面的资源未加载，单独处理
    public showLoginUI(mUiPrefName: string, mUiScript: string = null): void {
        resources.load("prefab/login/" + mUiPrefName, Prefab, (err, data) => {
            // console.log(`${mUiPrefName}下载完毕`, err, "data:", data);
            if (data) {
                let mUiNode = instantiate(data);
                // console.log("mnode:", mUiNode);
                this.root.addChild(mUiNode);

                if (mUiScript) {
                    mUiNode.getComponent(mUiScript)?.["refresh"]();
                }
            }
        });
    }

    public closeUI(mUiPrefName: string): void {

    }

    public getUiShow(mUiPrefName): boolean {
        if (this._uiPrefabMap.get(mUiPrefName)) {
            return true;
        } else {
            return false;
        }
    }

    public toShow() {
        this.root.active = true;
    }

    public toHide() {
        this.root.active = false;
    }
}

