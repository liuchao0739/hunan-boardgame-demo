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

import {_decorator, Node} from "cc";
import ItemRender from "../UICommpont/ListView/ItemRender";
import {IBagInfo} from "../bag/BagCtrl";
import {ItemCom} from "../UICommpont/ItemCom";

const {ccclass, property} = _decorator;

@ccclass('RoleIconPrefItemRender')
export class RoleIconPrefItemRender extends ItemRender {
    /**头像 */
    public roleIcon: ItemCom;
    /**选中框 */
    public selectIMG: Node;

    protected initUI(): void {
        this.roleIcon = this.getChildNode(`roleIcon`).getComponent(ItemCom);
        this.selectIMG = this.getChildNode(`selectIMG`);
    }

    public dataChanged(): void {
        let vo: IBagInfo = this.data;
        this.roleIcon.updateData(vo.itemId);
    }

    public unSelectState(): void {
        this.selectIMG.active = false;
    }

    public selectState(): void {
        this.selectIMG.active = true;
    }
}