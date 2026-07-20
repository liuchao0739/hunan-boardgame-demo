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

import {_decorator, Component, game, Node} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('tile2DFlash')
export class tile2DFlash extends Component {

    @property(Node)
    flashNode: Node = null!;

    @property
    flashStartPositionY: number = 0;

    @property
    flashEndPositionY: number = 0;

    private _positionYOffset: number = 0;

    protected start(): void {
        this._positionYOffset = this.flashEndPositionY - this.flashStartPositionY;
    }

    protected update(dt: number): void {
        const totalTime = game.totalTime * 0.00283;
        const ratio = Math.floor(totalTime / Math.PI);

        const percentage = Math.cos(totalTime) * (ratio % 2 === 0 ? -1 : 1);
        const offset = (percentage + 1) * 0.5 * this._positionYOffset;

        this.flashNode.setPosition(this.flashNode.position.x, this.flashStartPositionY + offset);
    }

}
