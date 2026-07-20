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

import {_decorator, Component, Label, Node} from 'cc';
import {protocol} from '../../../framework/network/protocol-configs';

const {ccclass, property} = _decorator;

@ccclass('HomeScorePlayerUI')
export class HomeScorePlayerUI extends Component {
    @property({type: Node})
    roomLogo: Node | null = null;
    @property({type: Label})
    nameLB: Label | null = null;
    // 排名
    @property({type: Label})
    positionLB: Label | null = null;
    // 分数--余额 暂时隐藏，不让显示
    @property({type: Label})
    scoreLB: Label | null = null;
    // 筹码
    @property({type: Label})
    amountLB: Label | null = null;
    // 点数
    @property({type: Label})
    pointLB: Label | null = null;

    start() {

    }

    updateData(isDiamond: boolean, roomer: boolean, mResData: protocol.club.ITablePlayerInfo): void {
        this.roomLogo.active = roomer;
        this.nameLB.string = mResData.name;
        // 排名
        this.positionLB.string = mResData.rank + "位"
        // 分数--余额
        this.scoreLB.string = mResData.amount.toFixed(1);
        if (isDiamond) {
            this.amountLB.node.active = true;
            // 筹码
            this.amountLB.string = mResData.varyAmount.toFixed(1);
        } else {
            this.amountLB.node.active = false;
        }
        // 点数
        this.pointLB.string = mResData.point.toFixed(0);
    }

    update(deltaTime: number) {

    }

}

