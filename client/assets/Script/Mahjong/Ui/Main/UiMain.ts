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

import {Button, find, Input, Node} from "cc";
import {eLayer, ViewMgr} from "../../../framework/mgr/ViewMgr";
import {HomePopupUI} from "../../../Home/Ui/HomePopupUI";
import {App} from "../../../Module/App";
import {SoundEffect} from "../../World/Support/Audio";
import {UiPopup} from "../Popup/UiPopup";
import {UiAutoOp} from "./UiAutoOp";
import {UiBorder} from "./UiBorder";
import {UiBtnCenter} from "./UiBtnCenter";
import {DoraHint} from "./UiDoraHint";
import {UiExitTable} from "./UiExitTable";
import {UiPlayerInfoCollection} from "./UiPlayerInfo";
import {UiStartGameAnim} from "./UiStartGameAnim";
import {UiTouchHandcard} from "./UiTouchHandcard";
import {UITrustee} from "./UITrustee";
import {UiWillStartGame} from "./UiWillStartGame";

export class UiMain {

    public static ins: UiMain = new UiMain();

    public root: Node = null;
    // 玩家信息集合
    public playerInfoCollection = new UiPlayerInfoCollection();
    // 本机手牌
    public localHandcard: Node = null;
    // 边框
    public border = new UiBorder();
    // 振听标志
    public zhenTing: Node;
    // 弹出UI集合
    public popup = new UiPopup();

    // public btnTrustee = new UiBtnTrustee() ;

    public touchHandcard = new UiTouchHandcard();

    public btnCenter = new UiBtnCenter();

    public uiAutoOpUI = new UiAutoOp();
    // 退出房间
    public exitTable = new UiExitTable();
    // 托管界面
    public trusteeUI = new UITrustee();
    // 游戏即将开始界面
    public willStartUI = new UiWillStartGame();
    // 开始游戏动画界面
    public startGameAnim = new UiStartGameAnim();
    // 弹出层
    public popUpWin: HomePopupUI = new HomePopupUI();

    public init() {

        this.root = find("Canvas");

        this.touchHandcard.init(this.root);

        // UiDebug.init() ;

        this.localHandcard = this.root.getChildByPath("LocalHandcard");
        this.playerInfoCollection.init(this.root);

        this.border.init(this.root);

        this.popup.init(this.root);

        this.zhenTing = this.root.getChildByPath("ZhenTing");
        this.zhenTing.active = false;

        // this.btnTrustee.init( this.root ) ;


        DoraHint.ins = new DoraHint();
        DoraHint.ins.init(this.root);

        for (let btn of this.root.getComponentsInChildren(Button)) {
            btn.node.on(Input.EventType.TOUCH_END, SoundEffect.buttonClick.bind(SoundEffect));
        }

        // new UiAutoOp().init( this.root ) ;
        this.uiAutoOpUI.init(this.root);

        this.btnCenter.init(this.root);

        this.exitTable.init(this.root.getChildByPath("ExitTable"));
        this.trusteeUI.init(this.root.getChildByPath("TrusteeUI"));
        this.willStartUI.init(this.root.getChildByPath("WillStartGame"));
        this.startGameAnim.init(this.root.getChildByPath("StartGameAnim"));

        let popupWin = this.root.getChildByPath("PopupWin")
        this.popUpWin.toInit(popupWin);
        App.getInst(ViewMgr).addLayer(eLayer.uiModuleLayer, popupWin);
    }

}
