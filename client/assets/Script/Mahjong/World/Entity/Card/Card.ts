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

// 麻将牌
export class Card {
    public id: string;

    // 是否是摸切牌
    public isMoQie = false;

    // 表现 3D
    public presentation3d: CardPresentation3d;
    // 表现 2D
    public presentation2d: CardPresentation2d;
}

// 显示组件
export class CardPresentation3d {
    public root: Node;
    // 主体
    public main: Node;
    // 阴影 立
    public shadowStand: Node;
    // 阴影 躺
    public shadowLie: Node;

    // 牌的高亮标志
    public cardLight: Node = null;
    // 高亮牌的箭头
    public cardArrow: Node = null;

    // 闪光
    public cardFlash: Node = null;
    // 立直特效
    public riichiEffect: Node = null;
    // 和牌特效
    public winningEffect: Node = null;
}

// 显示组件 2D
export class CardPresentation2d {
    public root: Node;

    // 闪光
    public cardFlash: Node = null;
}
