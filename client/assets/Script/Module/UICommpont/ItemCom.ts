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

/**
 * 道具控件
 */

import {_decorator, CCInteger, Component, Node, resources, Sprite, SpriteFrame} from "cc";
import {ItemTableTemplate} from "../../data/templates/item-table-data";

const {ccclass, property} = _decorator;

@ccclass('ItemCom')
export class ItemCom extends Component {
    @property({type: CCInteger, tooltip: "道具id"})
    public itemId: number;
    @property({type: Node, tooltip: "道具图标节点"})
    public icon: Node;

    protected onLoad(): void {
        this.updateData();
    }

    public updateData(itemId?: number): void {
        let sp = this.icon.getComponent(Sprite);
        if (!itemId) {
            sp.spriteFrame = null;
            return;
        }
        this.itemId = itemId;
        let conf = ItemTableTemplate.query(this.itemId);
        let url = `ui/itemIcon/${conf.iconPath[0]}/spriteFrame`;
        resources.load(url, SpriteFrame, (err, spData) => {
            if (err) {
                console.error(err);
                return;
            }
            if (!this.node?.active) return;
            sp.spriteFrame = spData;
        })
    }

    public setIcon(iconUrl: string): void {

    }
}