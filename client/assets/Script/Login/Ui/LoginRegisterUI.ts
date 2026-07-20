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

import {_decorator, Button, Component, EditBox, EventTouch, Label, Node, sys, Toggle, Tween, tween} from 'cc';
import {LocalCacheManager} from '../../framework/cache/local-cache';
import {EEventListenerPriority, ProtocolEventManager} from '../../framework/event/event-management';
import {SceneMgr} from '../../framework/mgr/SceneMgr';
import {ProtocolHTTPManager} from '../../framework/network/http';
import {EProtocolID} from '../../framework/network/protocol-configs';
import {CommUtils} from '../../framework/utils/CommUtils';
import {GlobalVar} from '../../GlobalVar';
import {LoginEnity} from '../../Home/Entity/Login';
import {ToastUI} from '../../Home/Ui/ToastUI';
import {App} from '../../Module/App';
import {AppVar} from '../../Module/AppVar';
import {UiPopupHelper} from '../../framework/utils/UiPopupHelper';
import {LoginCountryCodeUI} from './LoginCountryCodeUI';
import {LoginUiMain} from './LoginUiMain';

const {ccclass, property} = _decorator;

@ccclass('LoginRegisterUI')
export class LoginRegisterUI extends Component {
    private _backBtn: Node = null;

    private _phoneEB: EditBox = null;
    private _phoneDelBtn: Node = null;

    private _codeEB: EditBox = null;
    private _codeBtn: Node = null;
    private _secLB: Label | null = null;

    private _passEB: EditBox = null;
    private _passShowBtn: Node = null;
    private _passOpen: Node | null = null;
    private _passClose: Node | null = null;
    private _passDelBtn: Node = null;

    private _promoCodeEB: EditBox = null;
    private _promoCodeDelBtn: Node = null;

    private _confirmBtn: Node = null;

    private _agreeToggle: Toggle = null;
    private _agreeLabelNode: Node = null;
    private _protocolButton: Button | null = null;

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

        this._promoCodeEB = this.node.getChildByPath("bg/promoCodeEB").getComponent(EditBox);
        this._promoCodeDelBtn = this.node.getChildByPath("bg/promoCodeDelBtn");

        this._confirmBtn = this.node.getChildByPath("bg/confirmBtn");

        this._agreeToggle = this.node.getChildByPath("bg/Node/agreeToggle").getComponent(Toggle);
        this._agreeLabelNode = this.node.getChildByPath("bg/Node/Label");
        this._protocolButton = this.node.getChildByPath("bg/Node/ProtocolButton").getComponent(Button);

        this._countryCodeUI = this.node.getChildByPath("bg/CountryCodePref").getComponent(LoginCountryCodeUI);

        this._backBtn.on(Node.EventType.TOUCH_END, this._onBackBtnTouch, this);

        this._phoneEB.node.on(EditBox.EventType.EDITING_DID_ENDED, this._onPhoneEditEnd, this);
        this._phoneDelBtn.on(Node.EventType.TOUCH_END, this._onPhoneDelTouch, this);

        this._codeBtn.on(Node.EventType.TOUCH_END, this._onGetCodeBtnTouch, this);

        this._passDelBtn.on(Node.EventType.TOUCH_END, this._onPassDelTouch, this);
        this._passShowBtn.on(Node.EventType.TOUCH_END, this._onPassShowBtnTouch, this);

        this._promoCodeDelBtn.on(Node.EventType.TOUCH_END, this._onPromoCodeDelTouch, this);

        this._confirmBtn.on(Node.EventType.TOUCH_END, this._onConfirmTouch, this);

        this._agreeLabelNode.on(Node.EventType.TOUCH_END, this._onAgreeLabelTouch, this);
        this._protocolButton.node.on(Button.EventType.CLICK, this._onProtocolButtonClick, this);

        this._showPass = false;
        this._passClose.active = true;
        this._passOpen.active = false;

        ProtocolEventManager.on(EProtocolID.PHONE_CODE_REQ, this._onPhoneCodeRespond, this, EEventListenerPriority.HIGHER);
        ProtocolEventManager.on(EProtocolID.ACCOUNT_TOKEN, this._onAccountRespond, this, EEventListenerPriority.HIGHER);
    }

    // public toInit(node: Node) {
    //     // this.root = node;
    // }

    private _onBackBtnTouch(evt: EventTouch) {
        this.node.destroy();
        LoginUiMain.ins.uiModuleMgr.showLoginUI("PhoneLoginPref", "LoginPhoneUI");
    }

    private _onPhoneEditEnd(evt: EditBox) {
        // console.log("edit end:", evt);
        let val = this._phoneEB.string;
        if (val.match(/^[0-9]{11}$/g)) {
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
        if (this._isCodeBtnAble) {
            this._isCodeBtnAble = false;
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

    private _onPassDelTouch(): void {
        this._passEB.string = "";
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

    private _onPromoCodeDelTouch(): void {
        this._promoCodeEB.string = "";
    }

    private _onAgreeLabelTouch(): void {
        this._agreeToggle.isChecked = !this._agreeToggle.isChecked;
    }

    private _onProtocolButtonClick(evt: EventTouch): void {
        sys.openURL("http://qipaiplay.com/serverprotocol.html");
    }

    private _onConfirmTouch(evt: EventTouch) {
        if (!this._agreeToggle.isChecked) {
            App.getInst(ToastUI).showTips("请阅读并同意游戏许可及服务协议");
            return;
        }
        if (!CommUtils.checkPhoneNumber(this._phoneEB.string, this._countryCodeUI.countryCode)) {
            App.getInst(ToastUI).showTips("请填写有效手机号码");
            return;
        }
        if (!this._passEB.string) {
            App.getInst(ToastUI).showTips("请输入密码");
            return;
        }

        if (!this._codeEB.string) {
            App.getInst(ToastUI).showTips("请输入验证码");
            return;
        }

        if (!this._passEB.string.match(/^[0-9a-zA-Z]{6,20}$/g)) {
            App.getInst(ToastUI).showTips("密码请输入6-20位字母和数字，不含空格及其他字符");
            return;
        }

        if (this._promoCodeEB.string.length > 0 && !this._promoCodeEB.string.match(/^[0-9]{8}$/g)) {
            App.getInst(ToastUI).showTips("请输入8位数字的推广码");
            return;
        }

        if (this._isConfirmBtnAble) {
            this._isConfirmBtnAble = false;
            this._tweenAct = tween(this.node).delay(60).call(() => {
                this._isConfirmBtnAble = true;
            }).start();

            LoginUiMain.ins.loadingND.active = true;

            let mParamObj = {
                type: 5,// AccountType.REGISTER=5
                id: this._phoneEB.string,
                token: this._codeEB.string,
                password: this._passEB.string,
            };
            if (this._promoCodeEB.string.length > 0) {
                //@ts-ignore
                mParamObj.recommendCode = this._promoCodeEB.string;
            }
            ProtocolHTTPManager.load(EProtocolID.ACCOUNT_TOKEN, mParamObj, false);
        }
    }

    private _onPhoneCodeRespond(event): void {
        if (!this.node.active) {
            return;
        }

        if (event.success) {
            // 测试服自动填写验证码，正式服获取真实验证码
            if (!AppVar.isRelease) {
                this._codeEB.string = event.data["code"];
            }
        }

        this._tweenAct?.stop();
        this._isCodeBtnAble = true;
    }

    private _onAccountRespond(event): void {
        if (!this.node.active) {
            return;
        }
        console.log("===phone register:", event);

        if (event.success && event.data.token) {
            LoginEnity.account = event.data["account"];
            LoginEnity.accountID = event.data["accountId"] + "";
            LoginEnity.playerID = event.data["accountId"];
            LoginEnity.token = event.data["token"];
            LoginEnity.isNewAccount = event.data["isNewAccount"];

            LocalCacheManager.write('account', {
                account: event.data.account,
                token: event.data.token,
                accountId: event.data.accountId + "",
                expiration: event.data.timestamp ?? undefined,
            });
            LocalCacheManager.write("login", {
                account: this._phoneEB.string,
                pass: this._passEB.string,
                countryID: this._countryCodeUI.countryID,
            });

            this.node.destroy();
            GlobalVar.willLoadMoudle = null;
            SceneMgr.runScene("Home", false);
        } else {
            LoginUiMain.ins.loadingND.active = false;
            LoginUiMain.ins.loginND.active = true;
            if (this._tweenAct) {
                this._tweenAct.stop();
            }
            this._isConfirmBtnAble = true;
            if (event.data) {
                App.getInst(ToastUI).showTips(event.data.msg);
            }
        }

    }

    onDestroy(): void {
        ProtocolEventManager.off(EProtocolID.PHONE_CODE_REQ, this._onPhoneCodeRespond, this);
        ProtocolEventManager.off(EProtocolID.ACCOUNT_TOKEN, this._onAccountRespond, this);
    }

    // 更新数据用，必备
    public refresh(): void {
        this.node.active = true;
        UiPopupHelper.show(this.node);
        this._isCodeBtnAble = true;
        this._isConfirmBtnAble = true;
        if (this._tweenAct) {
            this._tweenAct.stop();
        }

        if (LoginEnity.inputPhone) {
            this._phoneEB.string = LoginEnity.inputPhone;
        }

        this._countryCodeUI.countryID = LoginEnity.countryID;
    }

    // public toShow() {
    //     this.node.active = true;
    //     UiPopupHelper.show(this.node);
    //     this._isCodeBtnAble = true;
    //     this._isConfirmBtnAble = true;
    //     if (this._tweenAct) {
    //         this._tweenAct.stop();
    //     }

    //     if (LoginEnity.inputPhone) {
    //         this.phoneEB.string = LoginEnity.inputPhone;
    //     }
    // }

    // public toHide() {
    //     this.node.active = false;

    // }

    // public toDestroy() {
    //     ProtocolEventManager.off(EProtocolID.PHONE_CODE_REQ, this._onPhoneCodeRespond, this);
    //     ProtocolEventManager.off(EProtocolID.ACCOUNT_TOKEN, this._onAccountRespond, this);
    // }
}
