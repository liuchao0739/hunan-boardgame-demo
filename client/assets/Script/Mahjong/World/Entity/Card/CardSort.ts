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

import {Card} from "./Card";

// 牌的排序
export class CardSort {

    public static exe(cards: Array<Card>) {

        this.initData();

        cards.sort((a, b) => {
            var aN = this.data.get(a.id);
            var bN = this.data.get(b.id);

            if (aN < bN) return -1;
            else if (aN == bN) return 0;
            else if (aN > bN) return 1;

        });

    }

    public static initData() {

        if (this.data != null) return;

        this.data = new Map<string, number>();

        // 万、同、条、字牌，红5排在普通5前。字牌顺序是东南西北白发中。

        for (var i = 1; i <= 9; ++i) {
            this.data.set("wan" + i, i * 2 + 100);
            this.data.set("tong" + i, i * 2 + 200);
            this.data.set("tiao" + i, i * 2 + 300);
        }

        // 赤宝
        this.data.set("wan5_chibao", 5 * 2 - 1 + 100);
        this.data.set("tong5_chibao", 5 * 2 - 1 + 200);
        this.data.set("tiao5_chibao", 5 * 2 - 1 + 300);

        // 字牌
        this.data.set("ziDong", 1 + 400);
        this.data.set("ziNan", 2 + 400);
        this.data.set("ziXi", 3 + 400);
        this.data.set("ziBei", 4 + 400);
        this.data.set("ziBai", 5 + 400);
        this.data.set("ziFa", 6 + 400);
        this.data.set("ziZhong", 7 + 400);

    }

    public static data: Map<string, number> = null;

}