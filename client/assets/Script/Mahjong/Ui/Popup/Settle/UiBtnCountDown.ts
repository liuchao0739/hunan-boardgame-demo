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

import {Input, Label, Node, Tween, tween, Vec3} from "cc";

// 结算的倒计时按钮
export class UiBtnCountDown {

    private static _btnND: Node = null;

    // 开始倒计时
    public static start(btn: Node, sec: number) {

        // 1 -> 0 -> 触发
        this._btnND = btn;
        let label = btn.getChildByPath("Countdown").getComponent(Label);
        label.string = sec.toString();
        let t = tween(btn).sequence(
            tween(btn).call(() => {

                label.string = sec.toString();
                sec--;

            }),
            tween(btn).delay(1),
            tween(btn).call(() => {

                if (sec <= -1) {
                    // onTimeout() ;
                    t2.stop();
                    // this.btnOK.active = false ;
                    btn.emit(Input.EventType.TOUCH_END);
                    this._btnND = null;
                }

            }),
        );

        Tween.stopAllByTarget(btn);
        let t2 = tween(btn).repeat(sec + 1, t).start();

    }

    // 开始倒计时，倒计时结束无任何动作，按钮消失
    public static startNoDoing(btnHide: Node, btnShow: Node, sec: number) {

        // 1 -> 0 -> 触发

        let label = btnHide.getChildByPath("Countdown").getComponent(Label);
        label.string = sec.toString();
        let t = tween(btnHide).sequence(
            tween(btnHide).call(() => {

                label.string = sec.toString();
                sec--;

            }),
            tween(btnHide).delay(1),
            tween(btnHide).call(() => {

                if (sec <= -1) {
                    // onTimeout() ;
                    t2.stop();
                    // this.btnOK.active = false ;
                    // btn.emit( Input.EventType.TOUCH_END ) ;
                    btnHide.active = false;
                    btnShow.setPosition(new Vec3(516, -300, 0));
                }

            }),
        );
        let t2 = tween(btnHide).repeat(sec + 1, t).start();

    }

    public static stop(btn: Node) {
        Tween.stopAllByTarget(btn);
    }

    public static stopTweenAnim(): void {
        if (this._btnND) {
            Tween.stopAllByTarget(this._btnND);
        }
    }
}