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

import {SeatOrien} from "./SeatOrien";

// 相对方位
export enum RelativeOrien {
    // 上家
    Previous,
    // 对家
    Opposite,
    // 下家
    Next,
}

// 相对方位计算器
export class RelativeOrienCalc {

    // orien1 自己的方位，orien2 别人的方位。返回：orien2 相对于 orien1 的方位
    public static get(orien1: SeatOrien, orien2: SeatOrien): RelativeOrien {

        this.initData();
        var ret = this.data.get(orien1).get(orien2);
        return ret;

    }

    private static initData() {

        if (this.data != null) return;

        this.data = new Map<SeatOrien, Map<SeatOrien, RelativeOrien>>();

        var map = new Map<SeatOrien, RelativeOrien>();
        this.data.set(SeatOrien.East, map);
        map.set(SeatOrien.North, RelativeOrien.Previous);
        map.set(SeatOrien.West, RelativeOrien.Opposite);
        map.set(SeatOrien.South, RelativeOrien.Next);

        var map = new Map<SeatOrien, RelativeOrien>();
        this.data.set(SeatOrien.South, map);
        map.set(SeatOrien.East, RelativeOrien.Previous);
        map.set(SeatOrien.North, RelativeOrien.Opposite);
        map.set(SeatOrien.West, RelativeOrien.Next);

        var map = new Map<SeatOrien, RelativeOrien>();
        this.data.set(SeatOrien.West, map);
        map.set(SeatOrien.South, RelativeOrien.Previous);
        map.set(SeatOrien.East, RelativeOrien.Opposite);
        map.set(SeatOrien.North, RelativeOrien.Next);

        var map = new Map<SeatOrien, RelativeOrien>();
        this.data.set(SeatOrien.North, map);
        map.set(SeatOrien.West, RelativeOrien.Previous);
        map.set(SeatOrien.South, RelativeOrien.Opposite);
        map.set(SeatOrien.East, RelativeOrien.Next);

    }

    public static data: Map<SeatOrien, Map<SeatOrien, RelativeOrien>> = null;
}