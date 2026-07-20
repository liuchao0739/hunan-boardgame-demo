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

import {Node} from "cc";
import {UiPopupHelper} from "../../../../framework/utils/UiPopupHelper";

// 中途流局
export class UiSettleLiuJuZhongTu {

    public root: Node;
    public types = new Array<Node>();
    public btnOK: Node;

    public init(node: Node) {

        this.root = node.getChildByPath("SettleLiuJuZhongTu");
        this.root.active = false;
        this.btnOK = this.root.getChildByPath("btnOK");

        // 因为没有0，0随便填一个空数据;
        this.types.push(this.root.getChildByPath("Type/empty"))
        this.types.push(this.root.getChildByPath("Type/sigangsanle"));
        this.types.push(this.root.getChildByPath("Type/sifenglianda"));
        this.types.push(this.root.getChildByPath("Type/sijializhi"));
        this.types.push(this.root.getChildByPath("Type/jiuzhongjiupai"));

        for (var e of this.types) {
            e.active = false;
        }
    }

    public show() {
        UiPopupHelper.show(this.root);
    }

    public hide() {
        this.root.active = false;
    }

    // 显示流局类型。①四杠散了②四风连打③四家立直④九种九牌（新）
    public showType(type: number) {
        console.log("流局类型：", type);
        // 0为无效值
        if (type == 0) {
            return;
        }

        for (var e of this.types) {
            e.active = false;
        }

        console.log("types:", this.types);
        this.types[type].active = true;

    }


}