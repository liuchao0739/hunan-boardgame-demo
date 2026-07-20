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

import {_decorator, EditBox, EventTouch, Node} from "cc";
import {LoginEnity} from "../../Home/Entity/Login";
import {ToastUI} from "../../Home/Ui/ToastUI";
import {BaseView} from "../../framework/ui/BaseView";
import {CommUtils} from "../../framework/utils/CommUtils";
import {RandomUtil} from "../../framework/utils/random-utils";
import {App} from "../App";
import {RoleCtrl} from "../role/RoleCtrl";

const {ccclass, property} = _decorator;

@ccclass("SetNameUIPref")
export class SetNameUIPref extends BaseView {
    public nameEB: EditBox | null = null;
    public randomBtn: Node | null = null;
    public confirmBtn: Node | null = null;
    private _closeBtn: Node | null = null;

    constructor() {
        super();
        this.skinName = `prefab/prorfile/SetNameUIPref`;
    }

    public initUI(): void {
        let node = this.root;//.getChildByName("Canvas");
        this._closeBtn = node.getChildByPath("closeBtn");
        this.nameEB = node.getChildByPath("nameEB").getComponent(EditBox);
        this.randomBtn = node.getChildByPath("randomBtn");
        this.confirmBtn = node.getChildByPath("confirmBtn");

        this._closeBtn.on(Node.EventType.TOUCH_END, this._onCloseTouch, this);
        this.randomBtn.on(Node.EventType.TOUCH_END, this._onRandomBtnTouch, this);
        this.confirmBtn.on(Node.EventType.TOUCH_END, this._onConfirmBtnTouch, this);
    }

    public open(closable: boolean = true): void {
        this.onEvent(RoleCtrl.ROLE_NAME_UPDATE, this._onSetNameRespond, this);

        if (!closable) {
            this._closeBtn.active = false;
        }
    }

    private _onSetNameRespond(): void {
        this.closeSelf();
    }

    private _onCloseTouch(): void {
        this.closeSelf();
    }

    private _onRandomBtnTouch(evt: EventTouch) {
        let mNickName = RandomUtil.getRandomNick();
        this.nameEB.string = mNickName;
    }

    private _onConfirmBtnTouch(evt: EventTouch) {
        let nameStr = this.nameEB.string;
        if (!nameStr) {
            App.getInst(ToastUI).showTips("昵称不能为空");
            return;
        }

        let len = CommUtils.getStrlen(nameStr);
        if (len < 2 || len > 14) {
            App.getInst(ToastUI).showTips("昵称2-7个汉字或者14个字符");
            return;
        }

        if (!nameStr.match(/([a-zA-Z0-9]{2,14})|([\u4e00-\u9fa5]{2,7})/g)) {
            App.getInst(ToastUI).showTips("昵称包含非法字符");
            return;
        }

        App.getInst(RoleCtrl).setNameInfo(LoginEnity.playerID, this.nameEB.string);
    }
}