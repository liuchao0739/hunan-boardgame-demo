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

import {Input, Node, Tween, UIOpacity, Vec3, tween} from "cc";

export class UiPopupHelper {

    private static _root: Node = null;

    // 弹出显示
    public static show(root: Node) {
        // console.log("显示四家面板：", root)
        this._root = root;
        root.active = true;
        this.scale(root);
        this.fadeIn(root);
    }

    // 缩放显示
    public static scale(root: Node) {
        // console.log("---------scale")
        Tween.stopAllByTarget(root);

        root.scale = new Vec3(0.9, 0.9, 1);
        // 缩放
        tween(root).sequence(
            tween(root).to(0.1, {scale: new Vec3(1.1, 1.1, 1)}),
            tween(root).to(0.05, {scale: new Vec3(1, 1, 1)}),
        ).start();

    }

    // 淡入
    public static fadeIn(root: Node, offsetX: number = 0, offsetY: number = 0) {
        // console.log("-----------fadeInd")
        let uiOpacity = root.getComponent(UIOpacity);
        if (uiOpacity == null) {
            uiOpacity = root.addComponent(UIOpacity);
        }

        let pos = root.getPosition();
        let tarX = pos.x;
        let tarY = pos.y;
        let startX = offsetX + pos.x;
        let strtY = offsetY + pos.y;
        root.setPosition(new Vec3(startX, strtY, 0));
        tween(root).to(0.15, {position: new Vec3(tarX, tarY, 0)}).start();
        uiOpacity.opacity = 0;
        tween(uiOpacity).to(0.15, {opacity: 255}).start();
    }

    // 关闭按钮点击后隐藏UI
    public static btnCloseHideRoot(root: Node, callback?: () => any) {

        let btn = root.getChildByPath("btnClose");
        if (btn == null) return;
        btn.on(Input.EventType.TOUCH_END, () => {
            root.active = false;
            this._root = null;
            callback?.();
        }, this);
    }

    // 断线重连后清空这些tween操作
    public static stopTweenAnim(): void {
        // console.log("STOP 四家面板", this._root);
        if (this._root) {
            Tween.stopAllByTarget(this._root);
            this._root.active = false;
        }
    }

}
