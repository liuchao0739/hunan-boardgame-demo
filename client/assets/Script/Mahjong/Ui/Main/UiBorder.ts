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

import {Input, Node} from "cc";
import {App} from "../../../Module/App";
import {eSysId, ViewMgr} from "../../../framework/mgr/ViewMgr";
import {GameState} from "../../World/Support/GameState";
import {UiMain} from "./UiMain";


export class UiBorder {

    public root: Node;

    public btnTing: Node;

    public btnQuit: Node | null = null;

    public init(node: Node) {

        this.root = node.getChildByPath("Border");
        let popupWin = node.getChildByPath(`PopupWin`);

        let setBtn = this.root.getChildByPath("Top/btnSettings");
        setBtn.on(Input.EventType.TOUCH_END, () => {

            // // 是否显示登出按钮
            // let mShowExit:boolean = false;
            // // 游戏状态 0--游戏未开始（刚进入房间） 1--游戏准备开始 2--游戏开始 3--一场结束（只有一场结束才能退出房间）
            // if(GameState.ins.gameStatus == 0 || GameState.ins.gameStatus == 3){
            //     mShowExit = true;
            // }
            App.getInst(ViewMgr).open(eSysId.SettingViewPraf, [true]);
        }, this);

        let helpBtn = this.root.getChildByPath("Top/btnHelp");
        helpBtn.on(Input.EventType.TOUCH_END, () => {
            App.getInst(ViewMgr).open(eSysId.YiTypePreviewViewPref, null);
        }, this);

        this.btnQuit = this.root.getChildByPath("Top/btnQuit");
        this.btnQuit.on(Node.EventType.TOUCH_END, this._onQuitTouch, this);

        this.btnTing = this.root.getChildByPath("Right/btnTing");
        this.btnTing.active = false;
        this.btnTing.on(Input.EventType.TOUCH_END, () => {

            // 振听状态
            let ui = UiMain.ins.popup.ting;
            for (let item of ui.items) {
                item.zhenTing.active = UiMain.ins.zhenTing.active;
            }

            ui.show();

        }, this);

    }

    private _onQuitTouch(): void {
        // 游戏状态 0--游戏未开始（刚进入房间） 1--游戏准备开始 2--游戏开始 3--一场结束（只有一场结束才能退出房间）
        if (GameState.ins.gameStatus == 0 || GameState.ins.gameStatus == 3) {
            UiMain.ins.exitTable.show();
        } else {
            console.log("游戏中不能退出");
        }
    }

}