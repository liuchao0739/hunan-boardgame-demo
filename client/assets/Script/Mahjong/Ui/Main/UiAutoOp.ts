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

import {Button, Color, Input, Label, Node} from "cc";
import {SettingsData} from "../../World/Support/SettingsDataPresist";
import {UiMain} from "./UiMain";
import {CommSend} from "../../Communication/CommSend";
import {GlobalVar} from "../../../GlobalVar";
import {ScMapping} from "../../Communication/CardIdMapping";

export class UiAutoOp {

    public root: Node;

    private btnArrowRight: Node;// 左右箭头用的空白区域，位置对应的图片上的箭头位置
    private btnArrowLeft: Node;// 左右箭头用的空白区域，位置对应的图片上的箭头位置
    // private root2 : Node ;

    private _bg1: Node | null = null;
    private _bg2: Node | null = null;
    private btnHe: Node;
    private btnMing: Node;
    private btnQie: Node;

    private btnHe2: Node;
    private btnMing2: Node;
    private btnQie2: Node;

    private readonly COLOR_LIGHT: Color = new Color(225, 202, 146);
    private readonly COLOR_GRAY: Color = new Color(90, 83, 60);

    public init(node: Node) {

        this.root = node.getChildByPath("AutoOp");

        // let root2 = this.root.getChildByPath( "1" ) ;
        // this.root2 = root2 ;
        let mRoot = this.root;

        this._bg1 = mRoot.getChildByPath("bg1");
        this._bg2 = mRoot.getChildByPath("bg2");
        this.btnHe = mRoot.getChildByPath("btnHe");
        this.btnHe.on(Button.EventType.CLICK, this.onClick_He.bind(this));
        this.btnHe2 = mRoot.getChildByPath("btnHe2");
        this.btnHe2.on(Button.EventType.CLICK, this.onClick_He.bind(this));

        this.btnMing = mRoot.getChildByPath("btnMing");
        this.btnMing.on(Button.EventType.CLICK, this.onClick_Ming.bind(this));
        this.btnMing2 = mRoot.getChildByPath("btnMing2");
        this.btnMing2.on(Button.EventType.CLICK, this.onClick_Ming.bind(this));

        this.btnQie = mRoot.getChildByPath("btnQie");
        this.btnQie.on(Button.EventType.CLICK, this.onClick_Qie.bind(this));
        this.btnQie2 = mRoot.getChildByPath("btnQie2");
        this.btnQie2.on(Button.EventType.CLICK, this.onClick_Qie.bind(this));


        this.btnArrowRight = mRoot.getChildByPath("btnArrowRight");
        this.btnArrowRight.on(Button.EventType.CLICK, this.onClick_ArrowRight.bind(this));

        this.btnArrowLeft = mRoot.getChildByPath("btnArrowLeft");
        this.btnArrowLeft.on(Button.EventType.CLICK, this.onClick_ArrowLeft.bind(this));

        this.onClick_ArrowLeft();

        // this.refreshHe() ;
        // this.refreshMing() ;
        // this.refreshQie() ;
        this.refreshHMQ();

    }

    private onClick_ArrowRight() {
        // this.root2.position = new Vec3( 160 ) ;
        // tween( this.root2 ).to( 0.1 , { position : new Vec3( 160 ) } ).start() ;

        this._bg1.active = false;
        this._bg2.active = true;
        this.btnHe.active = false;
        this.btnHe2.active = true;
        this.btnMing.active = false;
        this.btnMing2.active = true;
        this.btnQie.active = false;
        this.btnQie2.active = true;

        this.btnArrowRight.active = false;
        this.btnArrowLeft.active = true;


    }

    private onClick_ArrowLeft() {
        // tween( this.root2 ).to( 0.1 , { position : new Vec3( ) } ).start() ;
        // this.root2.position = new Vec3( ) ;

        this._bg1.active = true;
        this._bg2.active = false;
        this.btnHe.active = true;
        this.btnHe2.active = false;
        this.btnMing.active = true;
        this.btnMing2.active = false;
        this.btnQie.active = true;
        this.btnQie2.active = false;

        this.btnArrowRight.active = true;
        this.btnArrowLeft.active = false;
    }

    private onClick_He() {
        SettingsData.ins.isAutoHe = !SettingsData.ins.isAutoHe;
        // SettingsDataPresist.save() ;
        this.refreshHe();
        // 立刻执行和操作
        this._startAutoHe();
    }


    private onClick_Ming() {
        SettingsData.ins.mingHint = !SettingsData.ins.mingHint;
        console.log("点击鸣：", SettingsData.ins.mingHint)
        // SettingsDataPresist.save() ;
        this.refreshMing();
        // 立刻执行鸣操作
        this._startAutoMing();
    }

    private onClick_Qie() {
        SettingsData.ins.isAutoMoQie = !SettingsData.ins.isAutoMoQie;
        // SettingsDataPresist.save() ;
        this.refreshQie();
        // 立刻执行切操作
        this._startAutoQie();
    }

    private refreshHe() {
        console.log("和：", SettingsData.ins.isAutoHe);
        // var color = SettingsData.ins.isAutoHe ? Color.WHITE : Color.GRAY ;
        let color = SettingsData.ins.isAutoHe ? this.COLOR_LIGHT : this.COLOR_GRAY;
        this.btnHe.getComponentInChildren(Label).color = color;
        this.btnHe2.getComponentInChildren(Label).color = color;
    }

    private refreshMing() {
        console.log("鸣：", SettingsData.ins.mingHint);
        let color = SettingsData.ins.mingHint ? this.COLOR_LIGHT : this.COLOR_GRAY;
        this.btnMing.getComponentInChildren(Label).color = color;
        this.btnMing2.getComponentInChildren(Label).color = color;
    }

    private refreshQie() {
        console.log("切：", SettingsData.ins.isAutoMoQie);
        let color = SettingsData.ins.isAutoMoQie ? this.COLOR_LIGHT : this.COLOR_GRAY;
        this.btnQie.getComponentInChildren(Label).color = color;
        this.btnQie2.getComponentInChildren(Label).color = color;
    }

    public refreshHMQ(): void {
        // console.log("刷新和鸣切");
        this.refreshHe();
        this.refreshMing();
        this.refreshQie();
    }


    public reset(): void {
        // 重置和鸣切（每一局都重置）
        SettingsData.ins.isAutoHe = false;
        SettingsData.ins.mingHint = false;
        SettingsData.ins.isAutoMoQie = false;
        this.refreshHMQ();
    }

    // 点击和操作之后，立刻执行和
    private _startAutoHe(): void {

        if (SettingsData.ins.isAutoHe == false) {
            return;
        }

        if (UiMain.ins.popup.op.btnHu.active) {
            UiMain.ins.popup.op.btnHu.emit(Input.EventType.TOUCH_END);
        } else if (UiMain.ins.popup.op.btnZiMo.active) {
            UiMain.ins.popup.op.btnZiMo.emit(Input.EventType.TOUCH_END);
        }
    }

    // 点击鸣操作之后，立刻执行鸣
    private _startAutoMing(): void {
        // 除了吃碰杠，是否有其他按钮显示
        let mShowExpCPGG: boolean = false;
        let opUI = UiMain.ins.popup.op;
        if (opUI.btnHu.active || opUI.btnZiMo.active || opUI.btnLiZhi.active || opUI.btnLiuJu.active) {
            mShowExpCPGG = true;
        }

        if (mShowExpCPGG) {
            opUI.btnChi.active = false;
            opUI.btnPeng.active = false;
            opUI.btnGang.active = false;
        } else {
            opUI.btnChi.active = false;
            opUI.btnPeng.active = false;
            opUI.btnGang.active = false;
            if (opUI.btnPass.active) {
                CommSend.pass();
                opUI.btnPass.active = false;
            }
        }
    }

    // 点击切操作之后，立刻执行切
    private _startAutoQie(): void {
        if (GlobalVar.userGrabCard && GlobalVar.userGrabCard.nActionValue == 0) {

            let mCardId = ScMapping.cardId_s2c(GlobalVar.userGrabCard.byGrabCard[0]);
            // 自动模切。没有其他操作
            CommSend.discard(mCardId, false, true);
        }
    }


    public load() {

    }

    public save() {

    }

}
