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

import {_decorator, EditBox, EventTouch, Label, Node} from "cc";
import {BaseView} from "../../framework/ui/BaseView";
import {App} from "../App";
import {ToastUI} from "../../Home/Ui/ToastUI";
import {RoleCtrl} from "../role/RoleCtrl";
import {CallBack} from "../../framework/utils/CallBack";
import {LoginEnity} from "../../Home/Entity/Login";
import {CommUtils} from "../../framework/utils/CommUtils";
import {AppVar} from "../AppVar";

const {ccclass, property} = _decorator;

@ccclass("ChangePhoneViewPref")
export class ChangePhoneViewPref extends BaseView {
    public closeBtn: Node = null;
    public phoneEB: EditBox = null;
    public codeEB: EditBox = null;
    public codeBtn: Node = null;
    public confirmBtn: Node = null;
    private _secLB: Label | null = null;

    constructor() {
        super();
        this.skinName = `prefab/SettingUI/ChangePhoneViewPref`;
    }

    public initUI(): void {
        let node = this.root.getChildByName("Canvas");
        this.closeBtn = node.getChildByPath("closeBtn");
        this.phoneEB = node.getChildByPath("phoneEB").getComponent(EditBox);
        this.codeEB = node.getChildByPath("codeEB").getComponent(EditBox);
        this.codeBtn = node.getChildByPath("codeBtn");
        this._secLB = node.getChildByPath("secLB").getComponent(Label);
        this.confirmBtn = node.getChildByPath("confirmBtn");
        this.phoneEB.node.on(EditBox.EventType.EDITING_DID_ENDED, this._onPhoneEditEnd, this);

        this.closeBtn.on(Node.EventType.TOUCH_END, this.closeSelf, this);
        this.codeBtn.on(Node.EventType.TOUCH_END, this._onCodeBtnTouch, this);
        this.confirmBtn.on(Node.EventType.TOUCH_END, this._onConfirmBtnTouch, this);
    }


    private _onPhoneEditEnd() {
        let val = this.phoneEB.string;
        CommUtils.checkPhoneNo(val);
    }


    private _onCodeBtnTouch(evt: EventTouch): void {
        let val = this.phoneEB.string;
        if (!CommUtils.checkPhoneNo(val)) return;
        // 验证码倒计时
        CommUtils.startTime(this.codeBtn, this._secLB.node, this._secLB, 60, function () {

        }.bind(this));

        App.getInst(RoleCtrl).PhoneAccountReq(val, new CallBack((params) => {
            //正式服不帮玩家填
            // this.codeEB.string = params.code;
            // 测试服自动填写验证码，正式服获取真实验证码
            if (!AppVar.isRelease) {
                this.codeEB.string = params.code + "";
            }
        }, this));
    }

    private _onConfirmBtnTouch(evt: EventTouch): void {
        let val = this.phoneEB.string;
        if (!CommUtils.checkPhoneNo(val)) return;

        let codeStr = this.codeEB.string;
        if (!codeStr || !codeStr.length) {
            App.getInst(ToastUI).showTips(`请先获取验证码`);
            return;
        }

        App.getInst(RoleCtrl).ProfileModifyReq(this.phoneEB.string, codeStr, LoginEnity.accountID, null, new CallBack((params) => {
            if (params.res == `SUCCESS`) {
                App.getInst(ToastUI).showTips(`新账号绑定成功`);
                this.closeSelf();
            } else {
                App.getInst(ToastUI).showTips(params.msg);
            }
        }, this))
    }
}