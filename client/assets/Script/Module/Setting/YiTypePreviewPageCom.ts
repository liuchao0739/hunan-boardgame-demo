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

import {Node, Toggle, ToggleContainer} from "cc";
import List from "../UICommpont/ListView/List";
import {SettingConfHelp} from "./const/SettingConfHelp";
import {YiTypeListItemRender} from "./YiTypeListItemRender";

export class YiTypePreviewPageCom {
    public tabBarContent: ToggleContainer;
    public list: List;
    private _node: Node;
    private _preIdx: number;

    constructor(node: Node) {
        this._node = node;
        this.tabBarContent = node.getChildByName(`tabBarContent`).getComponent(ToggleContainer)
        this.list = node.getChildByName(`contentView`).getComponent(List);
        this.list.setItemRender(YiTypeListItemRender);

        this.tabBarContent.node.children.forEach(tmpNode => {
            tmpNode.on(Toggle.EventType.CLICK, this._onYiTypeTabChange, this);
        })
    }


    public _onYiTypeTabChange(target: Toggle): void {
        let name = target.node.name;
        console.log("点击到了：", name);
        let idx = Number(name.split(`tabBar`)[1]);
        this.showTab(idx);
    }

    public showTab(idx?: number): void {
        if (!idx) {
            idx = this._preIdx || 1;
        }
        this._preIdx = idx;
        let arr = SettingConfHelp.getYiConfsById(idx);
        this.list.removeAll();
        this.list.setData(arr);
    }

    public set active(b: boolean) {
        this._node.active = b;
    }
}