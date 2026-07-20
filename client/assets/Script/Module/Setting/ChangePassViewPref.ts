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

import {_decorator, EditBox, EventTouch, Label, Node, Toggle} from "cc";
import {BaseView} from "../../framework/ui/BaseView";
import {App} from "../App";
import {ToastUI} from "../../Home/Ui/ToastUI";
import {RoleCtrl} from "../role/RoleCtrl";
import {CallBack} from "../../framework/utils/CallBack";
import {LoginEnity} from "../../Home/Entity/Login";
import {CommUtils} from "../../framework/utils/CommUtils";
import {GameEntrance} from "../GameEntrance";
import {LocalCacheManager} from "../../framework/cache/local-cache";
import {AppVar} from "../AppVar";

const {ccclass, property} = _decorator;

@ccclass("ChangePassViewPref")
export class ChangePassViewPref extends BaseView {
    public closeBtn: Node = null;
    public phoneEB: EditBox = null;
    public codeEB: EditBox = null;
    public codeBtn: Node = null;
    public passShowBtn: Node = null;
    private _passToggle: Toggle | null = null;
    private _secLB: Label | null = null;
    public passDelBtn: Node = null;
    public passEB: EditBox = null;
    public backBtn: Node = null;
    // public phoneDelBtn: Node = null;
    // public hideBtn : Node   = null;
    public confirmBtn: Node = null;
    private _showPass: boolean = true;

    constructor() {
        super();
        this.skinName = `prefab/SettingUI/ChangePassViewPref`;
    }

    public initUI(): void {
        let node = this.root.getChildByName("Canvas");
        this.closeBtn = node.getChildByPath("closeBtn");
        this.phoneEB = node.getChildByPath("phoneEB").getComponent(EditBox);
        this.phoneEB.enabled = false;
        this.phoneEB.string = LoginEnity.account;
        this.codeEB = node.getChildByPath("codeEB").getComponent(EditBox);
        this.codeBtn = node.getChildByPath("codeBtn");
        this._secLB = node.getChildByPath("secLB").getComponent(Label);
        this.passEB = node.getChildByPath("passEB").getComponent(EditBox);
        this.confirmBtn = node.getChildByPath("confirmBtn");
        this.passShowBtn = node.getChildByPath("passShowBtn");
        this._passToggle = this.node.getChildByPath("passToggle").getComponent(Toggle);
        this.passDelBtn = node.getChildByPath("passDelBtn");
        this.backBtn = node.getChildByPath("backBtn");

        this.closeBtn.on(Node.EventType.TOUCH_END, this._onCloseBtnTouch, this);
        this.confirmBtn.on(Node.EventType.TOUCH_END, this._onConfirmBtnTouch, this);
        this.codeBtn.on(Node.EventType.TOUCH_END, this._onGetCodeBtnTouch, this);
        // this.passShowBtn.on(Node.EventType.TOUCH_END, this._onPassShowBtnTouch, this);
        this._passToggle.node.on(Node.EventType.TOUCH_END, this._onPassShowBtnTouch, this);
        this.passDelBtn.on(Node.EventType.TOUCH_END, this._onPassDelTouch, this);
        this.backBtn.on(Node.EventType.TOUCH_END, this.closeSelf, this);

        this._showPass = false;
        this._passToggle.isChecked = false;
    }

    private _onPassDelTouch(): void {
        this.passEB.string = "";
    }

    private _onPassShowBtnTouch(evt: EventTouch) {
        console.log("touch end:", evt);
        this._showPass = !this._showPass;
        if (this._showPass) {
            this.passEB.inputFlag = EditBox.InputFlag.DEFAULT;
        } else {
            this.passEB.inputFlag = EditBox.InputFlag.PASSWORD;
        }

    }

    private _onGetCodeBtnTouch(evt: EventTouch) {
        // 验证码倒计时
        CommUtils.startTime(this.codeBtn, this._secLB.node, this._secLB, 60, function () {

        }.bind(this));
        App.getInst(RoleCtrl).PhoneAccountReq(this.phoneEB.string, new CallBack((params) => {
            //正式服不帮玩家填
            // this.codeEB.string = params.code + "";
            // 测试服自动填写验证码，正式服获取真实验证码
            if (!AppVar.isRelease) {
                this.codeEB.string = params.code + "";
            }
        }, this));
    }

    private _onCloseBtnTouch(evt: EventTouch): void {
        this.closeSelf();
    }

    private _onConfirmBtnTouch(evt: EventTouch): void {
        let codeStr = this.codeEB.string;
        if (!codeStr || !codeStr.length) {
            App.getInst(ToastUI).showTips(`请先获取验证码`);
            return;
        }
        let passEB = this.passEB.string;
        if (!passEB || !passEB.length) {
            App.getInst(ToastUI).showTips(`密码不能为空`);
            return;
        }

        App.getInst(RoleCtrl).ProfileModifyReq(this.phoneEB.string, codeStr, LoginEnity.accountID, passEB, new CallBack((params) => {
            if (params.res != `SUCCESS`) {
                App.getInst(ToastUI).showTips(params.msg);
                return;
            }
            App.getInst(ToastUI).showTips("密码修改成功");
            this.closeSelf();

            LocalCacheManager.write("login", {
                account: this.phoneEB.string,
                pass: this.passEB.string,
                countryID: LoginEnity.countryID,
            })
            //登出到登录界面
            App.getInst(GameEntrance).logout();

        }, this));
    }
}