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

import {_decorator, Color, EventTouch, Label, Node, sys} from "cc";
import {LoginEnity} from "../../Home/Entity/Login";
import {UiMain} from "../../Mahjong/Ui/Main/UiMain";
import {SoundEffect, SoundMusic} from "../../Mahjong/World/Support/Audio";
import {version} from "../../application/version-management";
import {LocalCacheManager} from "../../framework/cache/local-cache";
import {eSysId, ViewMgr} from "../../framework/mgr/ViewMgr";
import {BaseView} from "../../framework/ui/BaseView";
import {CallBack} from "../../framework/utils/CallBack";
import {App} from "../App";
import {GameEntrance} from "../GameEntrance";
import CheckBtn from "../UICommpont/CheckBtn";
import {CommonDialog} from "../UICommpont/CommonDialog";
import {RoleCtrl} from "../role/RoleCtrl";
import {eSettingKey, SettingCtrl} from "./SettingCtrl";

const {ccclass, property} = _decorator;

@ccclass("SettingViewPraf")
export class SettingViewPraf extends BaseView {

    public soundToggle: CheckBtn = null;
    public musicToggle: CheckBtn = null;
    public shockToggle: CheckBtn = null;
    public cardToggle: Node = null;
    public cardToggle1: Node = null;
    public phoneLB: Label = null;
    public changePhoneBtn: Node = null;
    public passLB: Label = null;
    public setPassBtn: Node = null;
    public logoutBtn: Node = null;
    public yizBtn: Node = null;
    public yinsiBtn: Node = null;

    public toggle1: Label;
    public toggle1Bg: Node;
    public toggle2: Label;
    public toggle2Bg: Node;

    public contactUsLB: Label;
    public verLB: Label;

    constructor() {
        super();
        this.skinName = `prefab/SettingUI/SettingViewPref`;
    }

    public initUI(): void {
        this.soundToggle = this.getChildNode("soundToggle").getComponent(CheckBtn);
        this.musicToggle = this.getChildNode("musicToggle").getComponent(CheckBtn);
        this.shockToggle = this.getChildNode("shockToggle").getComponent(CheckBtn);
        this.cardToggle = this.getChildNode("cardToggle");
        this.cardToggle1 = this.getChildNode("cardToggle1");
        this.phoneLB = this.getChildNode("phoneLB").getComponent(Label);
        this.changePhoneBtn = this.getChildNode("changePhoneBtn");
        this.setPassBtn = this.getChildNode("setPassBtn");
        this.logoutBtn = this.getChildNode("logoutBtn");
        this.yizBtn = this.getChildNode("yizBtn");
        this.yinsiBtn = this.getChildNode("yinsiBtn");
        this.passLB = this.getChildNode("passLB").getComponent(Label);

        this.toggle1 = this.getChildNode("toggle1Lab").getComponent(Label);
        this.toggle1Bg = this.getChildNode("toggle1Off");
        this.toggle2 = this.getChildNode("toggle2Lab").getComponent(Label);
        this.toggle2Bg = this.getChildNode("toggle2Off");

        this.contactUsLB = this.getChildNode(`contactUsLB`).getComponent(Label);
        this.verLB = this.getChildNode(`verLB`).getComponent(Label);

        this.verLB.string = ``;
        version.fetchVersion(version => {
            if (this && this.verLB && this.verLB.isValid) {
                this.verLB.string = `当前版本：${version}`
            }
        });

        //初始化
        this.soundToggle.bSelect = App.getInst(SettingCtrl).get(eSettingKey.Sound);
        this.musicToggle.bSelect = App.getInst(SettingCtrl).get(eSettingKey.Music);
        this.shockToggle.bSelect = App.getInst(SettingCtrl).get(eSettingKey.Shock);
        let type = App.getInst(SettingCtrl).get(eSettingKey.operationType);
        this.dragSendCard(type == 2);


        this.soundToggle.node.on(Node.EventType.TOUCH_END, this._onSoundToggleTouch, this);
        this.musicToggle.node.on(Node.EventType.TOUCH_END, this._onMusicToggleTouch, this);
        this.shockToggle.node.on(Node.EventType.TOUCH_END, this._onShockToggleTouch, this);
        this.cardToggle.on(Node.EventType.TOUCH_END, this._onCardToggleTouch, this);
        this.cardToggle1.on(Node.EventType.TOUCH_END, this._onCardToggleTouch, this);
        this.changePhoneBtn.on(Node.EventType.TOUCH_END, this._onChangePhoneTouch, this);
        this.setPassBtn.on(Node.EventType.TOUCH_END, this._onSetPassTouch, this);
        this.logoutBtn.on(Node.EventType.TOUCH_END, this._onLogoutTouch, this);
        this.yizBtn.on(Node.EventType.TOUCH_END, this._onYizTouch, this);
        this.yinsiBtn.on(Node.EventType.TOUCH_END, this._onYinsiTouch, this);

        this.onEvent(SettingCtrl.getSettingEvent(eSettingKey.operationType), this.onOperationChange, this);
        this.onEvent(RoleCtrl.BIND_ACCOUNT_CHANGE, this.onAccountChange, this);
        this.onAccountChange();


        this.onEvent(SettingCtrl.getSettingEvent(eSettingKey.bSettingPWd), this.onSettingPWdChange, this);
        this.onSettingPWdChange();
    }

    private onAccountChange(): void {
        let account = `${LoginEnity.account}`;
        this.phoneLB.string = `${account.slice(0, 3)}****${account.slice(account.length - 3)}`;
    }

    private onSettingPWdChange(): void {
        let b = App.getInst(SettingCtrl).get(eSettingKey.bSettingPWd);
        this.passLB.string = b ? `已设置` : `未设置`;
    }

    private onOperationChange(): void {
        App.getInst(SettingCtrl).get(eSettingKey.operationType)
    }

    public open(bHideAccountSet?: boolean): void {
        this.changePhoneBtn.active = !bHideAccountSet;
        this.setPassBtn.active = !bHideAccountSet;
    }

    private _onSoundToggleTouch(evt: EventTouch): void {
        App.getInst(SettingCtrl).set(eSettingKey.Sound, this.soundToggle.bSelect);
        SoundMusic.enabled = this.soundToggle.bSelect;

    }

    private _onMusicToggleTouch(evt: EventTouch): void {
        App.getInst(SettingCtrl).set(eSettingKey.Music, this.musicToggle.bSelect);
        SoundEffect.enabled = this.musicToggle.bSelect;
    }

    private _onShockToggleTouch(evt: EventTouch): void {
        App.getInst(SettingCtrl).set(eSettingKey.Shock, this.shockToggle.bSelect);
    }

    private _onCardToggleTouch(evt: EventTouch): void {
        let tar = evt.target;
        let bDoubleClick = tar == this.cardToggle;
        if (bDoubleClick) {
            //双击出牌
            this.dragSendCard(false);
        } else {
            this.dragSendCard(true);
        }
        App.getInst(SettingCtrl).set(eSettingKey.operationType, bDoubleClick ? 1 : 2);
        UiMain.ins.touchHandcard.currOperation = bDoubleClick ? 1 : 2;
        // 保存出牌方式 操作方式 1双击出牌  2拖拽出牌
        let bOperationType: number = bDoubleClick ? 1 : 2;
        LocalCacheManager.write('operation', {type: bOperationType});
    }

    private dragSendCard(b: boolean): void {
        this.showToggleBtn(1, !b);
        this.showToggleBtn(2, b);
    }


    private showToggleBtn(idx: number, b: boolean): void {
        let lab: Label, bg: Node;
        if (idx == 1) {
            lab = this.toggle1;
            bg = this.toggle1Bg;
        } else if (idx == 2) {
            lab = this.toggle2;
            bg = this.toggle2Bg;
        }
        let tmpColor = b ? new Color(207, 118, 22) : new Color(141, 104, 55);
        lab.color = tmpColor;
        bg.active = !b;
    }

    private _onChangePhoneTouch(evt: EventTouch): void {
        App.getInst(ViewMgr).open(eSysId.ChangePhoneViewPref, null);//, this.node
    }

    private _onSetPassTouch(evt: EventTouch): void {
        App.getInst(ViewMgr).open(eSysId.ChangePassViewPref, null);//, this.node
    }

    private _onLogoutTouch(evt: EventTouch): void {
        //登出到登录界面
        let view: CommonDialog = App.getInst(ViewMgr).open(eSysId.CommonDialog, [`确定退出当前账号并返回登录界面吗？`, new CallBack(() => {
            App.getInst(GameEntrance).logout();
        }, this), null, ``]);//, this.node
        view.resetBtnName(`登出账号`);
    }

    private _onYizTouch(evt: EventTouch): void {
        App.getInst(ViewMgr).open(eSysId.YiTypePreviewViewPref, null);//, this.node
    }

    private _onYinsiTouch(evt: EventTouch): void {
        sys.openURL(`http://qipaiplay.com/serverprotocol.html`);
    }

    public behindCloseCb(): void {
        //保存设置变更
        App.getInst(SettingCtrl).clientSaveSetting();
    }
}
