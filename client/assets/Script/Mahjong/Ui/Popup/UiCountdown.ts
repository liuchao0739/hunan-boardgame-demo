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

import {Label, Node, Tween, tween} from "cc";

// 动作倒计时。包括操作、出牌
/*

    出牌 操作分别是2套不同的固定时间。

    UserGrabCard 摸牌
    如果有操作就用操作固定时间，否者出牌固定时间。

    UserOutCardRespond 玩家出牌
    如果有操作才显示时间，用操作固定时间。无操作不显示。

    UserOperatorRespond 玩家操作后
    使用出牌固定时间。

    UserOperatorHint 操作 抢杠和专用
    使用操作固定时间。

    UserOperatorReply 操作回应
    使用出牌固定时间

    重连
    如果用户是操作状态，灵活时间的含义是操作灵活时间。如果用户是出牌状态，灵活时间的含义是出牌灵活时间。
    直接设置倒计时，不用判断使用什么固定时间。时间-1，不显示。

*/

export class UiCountdown {

    public static ins: UiCountdown = null;

    // 倒计时的值。1用完用2
    public val1Cur: number = 0;
    public val2Cur: number = 0;

    public root: Node;
    private labelVal1: Label;
    private labelVal2: Label;

    public init(node: Node) {

        this.root = node.getChildByPath("Countdown");
        this.root.active = false;

        this.labelVal1 = this.root.getChildByPath("val1").getComponent(Label);
        this.labelVal2 = this.root.getChildByPath("val2").getComponent(Label);

        // this.start() ;

    }

    // 显示倒计时
    public show(val1?: number, val2?: number) {

        this.root.active = true;
        this.val1Cur = val1;
        this.val2Cur = val2;
        this.start();

    }

    // 不显示
    public hide() {
        this.root.active = false;
        this.stop();
    }

    // 开始倒计时
    private start() {

        this.stop();
        this.refresh();

        // 扣减时间1
        let seq = tween(this.root).sequence(
            tween(this.root).delay(1),
            tween(this.root).call(() => {
                this.val1Cur--;
                if (this.val1Cur < 0) {
                    this.startTime2();
                }
                this.refresh();
            }));
        seq.repeatForever().start();

    }

    // 扣减时间2
    private startTime2() {
        this.stop();
        let seq = tween(this.root).sequence(
            tween(this.root).delay(1),
            tween(this.root).call(() => {
                this.val2Cur--;
                if (this.val2Cur < 0) {
                    console.log("倒计时结束：");
                    this.stop();
                }
                this.refresh();
            }));
        seq.repeatForever().start();

    }

    public stop() {
        Tween.stopAllByTarget(this.root);
    }

    public refresh() {

        // // 刷新时间1
        // if( this.val1Cur >= 0 ){
        //     this.labelVal1.node.active = true ;
        //     this.labelVal1.string = this.val1Cur.toString() ;
        // }
        // else{
        //     this.labelVal1.node.active = false ;
        // }

        // // 刷新时间2
        // if( this.val2Cur >= 0 ){
        //     this.labelVal2.node.active = true ;
        //     this.labelVal2.string = this.val2Cur.toString() ;
        // }
        // else{
        //     this.labelVal2.node.active = false ;
        // }


        if (this.val1Cur >= 0) {
            this.labelVal1.node.active = true;
            this.labelVal1.string = this.val1Cur.toString();

            if (this.val2Cur > 0) {
                this.labelVal2.node.active = true;
                this.labelVal2.string = "+" + this.val2Cur.toString();
            } else {
                this.labelVal2.node.active = false;
            }

            return;
        }

        this.labelVal1.node.active = false;

        if (this.val2Cur >= 0) {
            this.labelVal2.node.active = true;
            this.labelVal2.string = this.val2Cur.toString();
            return;
        }

        this.labelVal2.node.active = false;
    }
}