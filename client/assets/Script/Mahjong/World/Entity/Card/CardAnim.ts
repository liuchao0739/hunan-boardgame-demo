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

import {tween, Vec3} from "cc";
import {Card} from "./Card";
import {CardDisplay} from "./CardDisplay";

// 牌动画
export class CardAnim {

    // 背躺着到站立
    public static lieBackToStand(card: Card) {
        card.presentation3d.main.eulerAngles = new Vec3(180, 180, 0);
        card.presentation3d.main.setPosition(new Vec3(0, 0.021, 0));

        tween(card.presentation3d.main).to(0.5, {eulerAngles: new Vec3(270, 180, 0)}).call(() => {
            // 阴影
            CardDisplay.showShadowStand(card);
            card.presentation3d.shadowStand.scale = new Vec3(0.06, 0.04, 0);
        }).start();
    }

    // 站立到平躺
    public static lieStandToBack(card: Card) {
        card.presentation3d.main.eulerAngles = new Vec3(0, 0, 0);
    }
}
