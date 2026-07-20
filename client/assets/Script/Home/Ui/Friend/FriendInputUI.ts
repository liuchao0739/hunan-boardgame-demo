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

import {EventTouch, Label, Node} from "cc";
import {CommSend} from "../../../Mahjong/Communication/CommSend";
import {SceneMgr} from "../../../framework/mgr/SceneMgr";
import {ToastUI} from "../ToastUI";
import {GlobalVar} from "../../../GlobalVar";
import {App} from "../../../Module/App";

export class FriendInputUI {
    public root: Node = null;
    public closeBtn: Node | null = null;
    // public idEB:EditBox | null = null;
    public idLB: Label | null = null;
    public num1Btn: Node | null = null;
    public num2Btn: Node | null = null;
    public num3Btn: Node | null = null;
    public num4Btn: Node | null = null;
    public num5Btn: Node | null = null;
    public num6Btn: Node | null = null;
    public num7Btn: Node | null = null;
    public num8Btn: Node | null = null;
    public num9Btn: Node | null = null;
    public num0Btn: Node | null = null;
    public clearBtn: Node | null = null;
    public delBtn: Node | null = null;
    public confirmBtn: Node | null = null;
    private _inputStr: string = "";

    public toInit(node: Node) {
        this.root = node;
        this.closeBtn = node.getChildByPath("closeBtn");
        // this.idEB     = node.getChildByPath("idEB").getComponent(EditBox);
        this.idLB = node.getChildByPath("id/Label").getComponent(Label);
        this.num1Btn = node.getChildByPath("1Btn");
        this.num2Btn = node.getChildByPath("2Btn");
        this.num3Btn = node.getChildByPath("3Btn");
        this.num4Btn = node.getChildByPath("4Btn");
        this.num5Btn = node.getChildByPath("5Btn");
        this.num6Btn = node.getChildByPath("6Btn");
        this.num7Btn = node.getChildByPath("7Btn");
        this.num8Btn = node.getChildByPath("8Btn");
        this.num9Btn = node.getChildByPath("9Btn");
        this.num0Btn = node.getChildByPath("0Btn");
        this.delBtn = node.getChildByPath("delBtn");
        this.clearBtn = node.getChildByPath("clearBtn");
        this.confirmBtn = node.getChildByPath("confirmBtn");

        this.closeBtn.on(Node.EventType.TOUCH_END, this._onCloseTouch, this);
        this.num0Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this.num1Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this.num2Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this.num3Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this.num4Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this.num5Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this.num6Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this.num7Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this.num8Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this.num9Btn.on(Node.EventType.TOUCH_END, this._onNumTouch, this);
        this.delBtn.on(Node.EventType.TOUCH_END, this._onDelTouch, this);
        this.clearBtn.on(Node.EventType.TOUCH_END, this._onClearTouch, this);
        this.confirmBtn.on(Node.EventType.TOUCH_END, this._onConfirmTouch, this);
        this._inputStr = "";
        this.idLB.string = "请输入ID";
    }

    private _onCloseTouch(evt: EventTouch): void {
        this.idLB.string = "请输入ID";
        this.toHide();
        this.root.parent.destroy();
    }

    private _onNumTouch(evt: EventTouch): void {
        switch (evt.currentTarget.name) {
            case "1Btn":
                this._inputStr += "1";
                break;
            case "2Btn":
                this._inputStr += "2";
                break;
            case "3Btn":
                this._inputStr += "3";
                break;
            case "4Btn":
                this._inputStr += "4";
                break;
            case "5Btn":
                this._inputStr += "5";
                break;
            case "6Btn":
                this._inputStr += "6";
                break;
            case "7Btn":
                this._inputStr += "7";
                break;
            case "8Btn":
                this._inputStr += "8";
                break;
            case "9Btn":
                this._inputStr += "9";
                break;
            case "0Btn":
                this._inputStr += "0";
                break;
            default:
                break;
        }
        this.idLB.string = this._inputStr;

    }

    private _onDelTouch(evt: EventTouch): void {
        this._inputStr = this._inputStr.slice(0, this._inputStr.length - 1);
        this.idLB.string = this._inputStr;
        console.log("inputstr:", this._inputStr);
        console.log(":", this._inputStr.slice)
    }

    private _onClearTouch(evt: EventTouch): void {
        this._inputStr = "";
        this.idLB.string = "请输入ID";
    }

    private _onConfirmTouch(evt: EventTouch): void {
        if (!this.idLB.string || !this.idLB.string.match(/^[0-9]{1,10}$/g)) {
            App.getInst(ToastUI).showTips("请输入房间1到10位ID");
            return;
        }

        if (this.idLB.string) {
            let mRoomID: number = parseInt(this.idLB.string);
            this._enterRoom(mRoomID);
        }
    }

    private _enterRoom(mRoomID) {
        console.log("加入房间：", mRoomID)
        // WebSocketManager.send(EProtocolID.MJ_JP_ENTER_ROOM , { id : mRoomID } );     

        GlobalVar.willLoadMoudle = null;
        SceneMgr.runScene("Mahjong", false, () => {
            CommSend.enterRoom(mRoomID);
        }, this);
    }

    public toShow() {
        this.root.active = true;
    }

    public toHide() {
        this.root.active = false;
    }

    public toDestroy() {

    }
}

