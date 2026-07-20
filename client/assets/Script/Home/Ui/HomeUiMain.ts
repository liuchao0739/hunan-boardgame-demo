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

import {director, find, Node} from "cc";
import {HomeUiMainHall} from "./HomeUiMainHall";
import {ToastUI} from "./ToastUI";
import {HomePopupUI} from "./HomePopupUI";
import {ModuleUIMgr} from "../../framework/mgr/ModuleUIMgr";
import {eLayer, ViewMgr} from "../../framework/mgr/ViewMgr";
import {App} from "../../Module/App";

export class HomeUiMain {
    public static ins: HomeUiMain = new HomeUiMain();
    public root: Node = null;
    // 大厅界面
    public homeHall = new HomeUiMainHall();
    // 各模块Ui显示层
    public uiModuleMgr: ModuleUIMgr = new ModuleUIMgr();
    // 弹窗层
    public popUpWin: HomePopupUI = new HomePopupUI();

    public init() {
        this.root = find("Canvas");
        this.homeHall.toInit(this.root);
        let UiModuleWin = this.root.getChildByPath("UiModuleWin");
        let popupWin = this.root.getChildByPath("PopupWin");
        // 清掉登录场景残留的 View（父节点已销毁），再挂大厅层级
        App.getInst(ViewMgr).closeAll();
        App.getInst(ViewMgr).addLayer(eLayer.uiModuleLayer, UiModuleWin);
        this.uiModuleMgr.toInit(UiModuleWin);
        this.popUpWin.toInit(popupWin);
        App.getInst(ViewMgr).addLayer(eLayer.popUpWinLayer, popupWin);
        App.getInst(ToastUI).toInit(this.root.getChildByPath("ToastUI"));
        director.preloadScene("LoadingScene");
        director.preloadScene("Mahjong");
        this.homeHall.toShow();
    }

    public toDestroy() {

    }

}
