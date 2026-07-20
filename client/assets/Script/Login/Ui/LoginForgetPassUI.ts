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

import {_decorator, Component, EditBox, EventTouch, Label, Node, tween, Tween} from 'cc';
import {LocalCacheManager} from '../../framework/cache/local-cache';
import {EEventListenerPriority, ProtocolEventManager} from '../../framework/event/event-management';
import {ProtocolHTTPManager} from '../../framework/network/http';
import {EProtocolID} from '../../framework/network/protocol-configs';
import {CommUtils} from '../../framework/utils/CommUtils';
import {LoginEnity} from '../../Home/Entity/Login';
import {ToastUI} from '../../Home/Ui/ToastUI';
import {App} from '../../Module/App';
import {AppVar} from '../../Module/AppVar';
import {UiPopupHelper} from '../../framework/utils/UiPopupHelper';
import {LoginCountryCodeUI} from './LoginCountryCodeUI';
import {LoginUiMain} from './LoginUiMain';

const {ccclass, property} = _decorator;

@ccclass('LoginForgetPassUI')
export class LoginForgetPassUI extends Component {
    private _backBtn: Node = null;

    private _phoneEB: EditBox = null;
    private _phoneDelBtn: Node = null;

    private _codeEB: EditBox = null;
    private _codeBtn: Node = null;
    private _secLB: Label | null = null;

    private _passEB: EditBox = null;
    private _passShowBtn: Node | null = null;
    private _passOpen: Node | null = null;
    private _passClose: Node | null = null;
    private _passDelBtn: Node = null;

    private _confirmBtn: Node = null;

    private _countryCodeUI: LoginCountryCodeUI = null;

    private _showPass: boolean = false;
    private _isCodeBtnAble: boolean = true;
    private _isConfirmBtnAble: boolean = true;
    private _tweenAct: Tween<Node> = null;

    onLoad(): void {
        this._backBtn = this.node.getChildByPath("bg/backBtn");

        this._phoneEB = this.node.getChildByPath("bg/phoneEB").getComponent(EditBox);
        this._phoneDelBtn = this.node.getChildByPath("bg/phoneDelBtn");

        this._codeEB = this.node.getChildByPath("bg/codeEB").getComponent(EditBox);
        this._codeBtn = this.node.getChildByPath("bg/codeBtn");
        this._secLB = this.node.getChildByPath("bg/secLB").getComponent(Label);

        this._passEB = this.node.getChildByPath("bg/passEB").getComponent(EditBox);
        this._passShowBtn = this.node.getChildByPath("bg/passShowBtn");
        this._passClose = this.node.getChildByPath("bg/passShowBtn/close");
        this._passOpen = this.node.getChildByPath("bg/passShowBtn/open");
        this._passDelBtn = this.node.getChildByPath("bg/passDelBtn");

        this._confirmBtn = this.node.getChildByPath("bg/confirmBtn");

        this._countryCodeUI = this.node.getChildByPath("bg/CountryCodePref").getComponent(LoginCountryCodeUI);

        this._backBtn.on(Node.EventType.TOUCH_END, this._onBackBtnTouch, this);

        this._phoneDelBtn.on(Node.EventType.TOUCH_END, this._onPhoneDelTouch, this);
        this._phoneEB.node.on(EditBox.EventType.EDITING_DID_ENDED, this._onPhoneEditEnd, this);

        this._codeBtn.on(Node.EventType.TOUCH_END, this._onGetCodeBtnTouch, this);

        this._passDelBtn.on(Node.EventType.TOUCH_END, this._onPassDelTouch, this);
        this._passShowBtn.on(Node.EventType.TOUCH_END, this._onPassShowBtnTouch, this);

        this._confirmBtn.on(Node.EventType.TOUCH_END, this._onConfirmTouch, this);

        this._showPass = false;
        this._passClose.active = true;
        this._passOpen.active = false;

        ProtocolEventManager.on(EProtocolID.PHONE_CODE_REQ, this._onPhoneCodeRespond, this, EEventListenerPriority.HIGHER);
        ProtocolEventManager.on(EProtocolID.PHONE_PW_CHANGE, this._onPhonePassChangeRespond, this, EEventListenerPriority.HIGHER);
    }

    private _onBackBtnTouch(evt: EventTouch) {
        this.node.destroy();
        LoginUiMain.ins.uiModuleMgr.showLoginUI("PhoneLoginPref", "LoginPhoneUI");
    }

    private _onPhoneEditEnd(evt: EditBox) {
        let val = this._phoneEB.string;
        if (CommUtils.checkPhoneNumber(val, this._countryCodeUI.countryCode)) {
            console.log("输入正确，手机号：", val);
        } else {
            console.log("输入错误，重新输入");
        }
    }

    private _onPhoneDelTouch(): void {
        this._phoneEB.string = "";
    }

    private _onGetCodeBtnTouch(evt: EventTouch) {
        if (!CommUtils.checkPhoneNumber(this._phoneEB.string, this._countryCodeUI.countryCode)) {
            App.getInst(ToastUI).showTips("请填写有效手机号码");
            return;
        }
        if (this._phoneEB.string) {
            if (this._isCodeBtnAble) {
                this._isCodeBtnAble = false;
                // if (this._tweenAct) {
                //     this._tweenAct.stop();
                // }
                // this._tweenAct = tween(this.node).delay(60).call(() => {
                //     this._isCodeBtnAble = true;
                // }).start();
                CommUtils.startTime(this._codeBtn, this._secLB.node, this._secLB, 60, function () {
                    this._isCodeBtnAble = true;
                }.bind(this));

                ProtocolHTTPManager.load(EProtocolID.PHONE_CODE_REQ, {
                    phoneNo: this._phoneEB.string,
                    countryCode: this._countryCodeUI.countryCode.toString(),
                }, false);
            }
        }
    }

    private _onPassShowBtnTouch(evt: EventTouch) {
        console.log("touch end:", evt);
        this._showPass = !this._showPass;
        if (this._showPass) {
            this._passEB.inputFlag = EditBox.InputFlag.DEFAULT;
            this._passClose.active = false;
            this._passOpen.active = true;
        } else {
            this._passEB.inputFlag = EditBox.InputFlag.PASSWORD;
            this._passClose.active = true;
            this._passOpen.active = false;
        }
    }

    private _onPassDelTouch(): void {
        this._passEB.string = "";
    }

    private _onConfirmTouch(evt: EventTouch) {
        console.log("-----")
        if (!CommUtils.checkPhoneNumber(this._phoneEB.string, this._countryCodeUI.countryCode)) {
            App.getInst(ToastUI).showTips("请填写有效手机号码");
            return;
        }
        if (!this._codeEB.string) {
            App.getInst(ToastUI).showTips("请输入验证码");
            return;
        }
        if (!this._passEB.string) {
            App.getInst(ToastUI).showTips("请输入密码");
            return;
        }
        if (!this._passEB.string.match(/^[0-9a-zA-Z]{6,20}$/g)) {
            App.getInst(ToastUI).showTips("密码请输入6-20位字母和数字，不含空格");
            return;
        }

        if (this._isConfirmBtnAble) {
            this._isConfirmBtnAble = false;
            if (this._tweenAct) {
                this._tweenAct.stop();
            }
            this._tweenAct = tween(this.node).delay(60).call(() => {
                this._isConfirmBtnAble = true;
            }).start();

            let mParamObj = {
                phoneNo: this._phoneEB.string,
                code: this._codeEB.string,
                password: this._passEB.string
            };
            ProtocolHTTPManager.load(EProtocolID.PHONE_PW_CHANGE, mParamObj, false);
        }
    }

    private _onPhoneCodeRespond(event): void {
        if (!this.node.active) {
            return;
        }
        if (this._tweenAct) {
            this._tweenAct.stop();
        }
        this._isCodeBtnAble = true;
        if (event.success) {
            // 测试服自动填写验证码，正式服获取真实验证码
            if (!AppVar.isRelease) {
                this._codeEB.string = event.data["code"];
            }
        }
    }

    private _onPhonePassChangeRespond(event): void {
        if (!this.node.active) {
            return;
        }
        console.log("===pass change:", event);
        if (event.success && event.data?.res == "SUCCESS") {
            App.getInst(ToastUI).showTips("修改成功");
            // 返回登录界面
            LoginUiMain.ins.uiModuleMgr.showLoginUI("PhoneLoginPref", "LoginPhoneUI");
            LocalCacheManager.write("login", {
                account: this._phoneEB.string,
                pass: this._passEB.string,
                countryID: this._countryCodeUI.countryID,
            });
        } else {
            if (this._tweenAct) {
                this._tweenAct.stop();
            }
            this._isConfirmBtnAble = true;

            if (event.data.msg) {
                App.getInst(ToastUI).showTips("" + event.data.msg);
            }
        }
    }

    onDestroy(): void {
        ProtocolEventManager.off(EProtocolID.PHONE_CODE_REQ, this._onPhoneCodeRespond, this);
        ProtocolEventManager.off(EProtocolID.PHONE_PW_CHANGE, this._onPhonePassChangeRespond, this);
    }

    // 更新数据用，必备
    public refresh(): void {
        this.node.active = true;
        this._isCodeBtnAble = true;
        this._isConfirmBtnAble = true;
        if (this._tweenAct) {
            this._tweenAct.stop();
        }
        UiPopupHelper.show(this.node);

        if (LoginEnity.inputPhone) {
            this._phoneEB.string = LoginEnity.inputPhone;
        }
        this._countryCodeUI.countryID = LoginEnity.countryID;
    }
}
