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

import {Label, Node, Sprite, Tween, tween, Vec3} from "cc";
import {Player} from "../../World/Entity/Player/Player";
import {CommUtils} from "../../../framework/utils/CommUtils";

export class UiStartGameAnim {
    private _root: Node | null = null;
    private _leftND: Node | null = null;
    private _rightND: Node | null = null;
    private _animHead1: Node | null = null;
    private _animHead2: Node | null = null;
    private _animHead3: Node | null = null;
    private _animHead4: Node | null = null;

    // private _btnEnter: Node | null = null;

    public init(mNode: Node) {
        this._root = mNode;
        this._leftND = mNode.getChildByPath("leftND");
        this._rightND = mNode.getChildByPath("rightND");
        this._animHead1 = mNode.getChildByPath("animHead1");
        this._animHead2 = mNode.getChildByPath("animHead2");
        this._animHead3 = mNode.getChildByPath("animHead3");
        this._animHead4 = mNode.getChildByPath("animHead4");
    }

    public refresh(mPlayer: Player): void {
        this._updateItemData(this._animHead1, mPlayer);
        this._updateItemData(this._animHead2, mPlayer);
        this._updateItemData(this._animHead3, mPlayer);
        this._updateItemData(this._animHead4, mPlayer);
    }

    private _updateItemData(mItemND: Node, mPlayer: Player): void {
        CommUtils.updatePlayerHeadIcon(mItemND.getChildByPath("headMask/headSP").getComponent(Sprite), mPlayer.info.iconId);
        mItemND.getChildByPath("nameLB").getComponent(Label).string = mPlayer.info.nickname;
        mItemND.getChildByPath("idLB").getComponent(Label).string = mPlayer.info.id;
    }

    public show(): void {
        this._root.active = true;
        console.log("start game anim:", this._root);
        console.log("start game anim head:", this._animHead1);

        this.stopAllAnim(false);
        tween(this._root).show().start();
        this._animHead1.position.set(-328, 92, 0);
        this._animHead2.position.set(-328, -94, 0);
        this._animHead3.position.set(340, 92, 0);
        this._animHead4.position.set(340, -94, 0);

        // tween(this._root).parallel(

        // )
        // .start();

        this._leftND.position = new Vec3(-640, 0, 0);
        tween(this._leftND).to(0.5, {position: new Vec3(0, 0, 0)}).start();
        this._rightND.position = new Vec3(640, 0, 0);
        tween(this._rightND).to(0.5, {position: new Vec3(0, 0, 0)}).start();

        tween(this._animHead1).to(0.5, {position: new Vec3(-328, 92, 0)}).start();
        tween(this._animHead2).to(0.5, {position: new Vec3(-328, -94, 0)}).start();
        tween(this._animHead3).to(0.5, {position: new Vec3(340, 92, 0)}).start();
        tween(this._animHead4).to(0.5, {position: new Vec3(340, -94, 0)}).start();
        tween(this._root).delay(1).hide().call(() => {
            this.hide();
        })
            .start();


    }

    public hide(): void {
        console.log("start game anim hide");
        this._root.active = false;
    }

    // 停掉所有动画
    public stopAllAnim(bHide: boolean): void {
        this._root && Tween.stopAllByTarget(this._root);
        this._leftND && Tween.stopAllByTarget(this._leftND);
        this._rightND && Tween.stopAllByTarget(this._rightND);
        this._animHead1 && Tween.stopAllByTarget(this._animHead1);
        this._animHead2 && Tween.stopAllByTarget(this._animHead2);
        this._animHead3 && Tween.stopAllByTarget(this._animHead3);
        this._animHead4 && Tween.stopAllByTarget(this._animHead4);
        if (bHide) {
            this.hide();
        }
    }
}

