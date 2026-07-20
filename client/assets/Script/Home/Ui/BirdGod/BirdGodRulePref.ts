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

import {_decorator, Animation, Button, Label, Node} from 'cc';
import {BaseView} from '../../../framework/ui/BaseView';
import {App} from "../../../Module/App";
import {ToastUI} from "../ToastUI";
import {SoutheastLevel} from '../../../data/manual/SoutheastLevel';
import {EEventListenerPriority, ProtocolEventManager} from "../../../framework/event/event-management";
import {ProtocolHTTPManager} from "../../../framework/network/http";
import {EProtocolID} from "../../../framework/network/protocol-configs";
import {LoginEnity} from "../../Entity/Login";
import {AppVar} from "../../../Module/AppVar";
import {ClubEntity} from '../../Entity/ClubEntity';
import {AudioMgr} from '../../../framework/media/AudioMgr';
import { CommSend } from "../../../Mahjong/Communication/CommSend";
import {eSysId, ViewMgr} from "../../../framework/mgr/ViewMgr";

const {ccclass, property} = _decorator;

// const { schedule, unschedule } = new Component;

@ccclass('BirdGodRulePref')
export class BirdGodRulePref extends BaseView {

    public levelInfo: SoutheastLevel.ISoutheastLevel;
    public levelLB: Label; // 级别
    public balanceLB: Label; // 带入
    public thinkTimeLB: Label; // 时长
    public confirmBtnLB: Label; // 开始匹配
    public timerId: any;
    public cancelBtnND: Node;
    public isMatching: boolean = false;

    constructor() {
        super();
        this.skinName = `prefab/BirdGod/BirdGodRulePref`;
    }

    public initUI(): void {
        this.levelInfo = SoutheastLevel.query(ClubEntity.birdGodMatchLevel || 2);

        this.levelLB = this.root.getChildByPath("bg/cont/item2/valueLB").getComponent(Label);
        this.balanceLB = this.root.getChildByPath("bg/cont/item3/valueLB").getComponent(Label);
        this.thinkTimeLB = this.root.getChildByPath("bg/cont/item1/valueLB").getComponent(Label);
        this.confirmBtnLB = this.root.getChildByPath("bg/btnConfirm/confirmTextLB").getComponent(Label);
        this.cancelBtnND = this.root.getChildByPath('bg/btnCancel');

        this.root.getChildByPath('bg/btnClose').on(Node.EventType.TOUCH_END, this.closeSelf, this);
        this.root.getChildByPath('bg/btnConfirm').on(Button.EventType.CLICK, this.onStartMatching, this);
        this.cancelBtnND.on(Button.EventType.CLICK, this.onCancelMatching, this);

        ProtocolEventManager.on(EProtocolID.CLUB_MATCHING_JOIN, this.onMatchingJoinRespond, this, EEventListenerPriority.HIGHER);
        // ProtocolEventManager.on(EProtocolID.CLUB_MATCHING_QUIT, this.onMatchingQuitRespond, this, EEventListenerPriority.HIGHER);
        ProtocolEventManager.on(EProtocolID.CLUB_MATCHING_QUERY, this.onMatchingQueryRespond, this, EEventListenerPriority.HIGHER);

        this.onUpdateRuleInfo();
    }

    public open(keep: boolean = false): void {
        // 继续匹配
        // if (keep) {
        //     this.onStartMatching()
        // }
    }

    protected _beforeClose(): void {
        console.log('关闭 RulePref')
        if (this.isMatching) {
            this.onCancelMatching();
        } else {
            this._cancelMatching()
        }

        ProtocolEventManager.off(EProtocolID.CLUB_MATCHING_JOIN, this.onMatchingJoinRespond, this);
        // ProtocolEventManager.off(EProtocolID.CLUB_MATCHING_QUIT, this.onMatchingQuitRespond, this);
        ProtocolEventManager.off(EProtocolID.CLUB_MATCHING_QUERY, this.onMatchingQueryRespond, this);
    }

    public onUpdateRuleInfo(): void {
        console.log(this.levelLB)
        this.levelLB.string = `K ${this.levelInfo.level.toString()}`;
        this.balanceLB.string = this.levelInfo.balance.toString();
        this.thinkTimeLB.string = this.levelInfo.thinkTime;
    }

    public onStartMatching(): void {
        console.log('匹配开始');
        if (this.isMatching) {
            return;
        }
        if (AppVar.offlineAuth) {
            App.getInst(ToastUI).showTips('离线模式无法匹配，官方服不可用');
            return;
        }
        this.isMatching = true;
        App.getInst(ViewMgr).closeAll();
        CommSend.getRoomX(ClubEntity.birdGodMatchLevel);
        // ProtocolHTTPManager.load(EProtocolID.CLUB_MATCHING_JOIN, {
        //     playerId: LoginEnity.playerID,
        //     clubId: AppVar.isRelease ? 10018 : 10096,
        //     roundNo: 0,
        //     level: this.levelInfo.level,
        //     clubType: 1,
        // }, false);
    }

    public onCancelMatching(): void {
        ProtocolHTTPManager.load(EProtocolID.CLUB_MATCHING_QUIT, {
            playerId: LoginEnity.playerID,
        }, false);
        this._cancelMatching()
    }

    public _cancelMatching(): void {
        console.log('Rule 弹窗关闭')
        clearInterval(this.timerId);
        this.confirmBtnLB.getComponent(Animation).pause()
        this.confirmBtnLB.string = '开始匹配';
        this.cancelBtnND.active = false;
        this.isMatching = false
        AudioMgr.inst.remove()
    }

    public onMatchingJoinRespond(event: any): void {
        console.log('加入匹配 返回')
        if (event.success && event.data?.res != 'SUCCESS') {
            App.getInst(ToastUI).showTips(event.data?.msg || '请求失败');
            this._cancelMatching()
            return;
        }
        AudioMgr.inst.play('Audio/Sound/match_matching', true);
        this.confirmBtnLB.getComponent(Animation).play()
        this.confirmBtnLB.string = `正在匹配 1/4`;
        this.cancelBtnND.active = true;

        let timer = function () {
            ProtocolHTTPManager.load(EProtocolID.CLUB_MATCHING_QUERY, {
                playerId: LoginEnity.playerID,
            }, false);
        }
        timer();
        this.timerId = setInterval(timer, 5000);
    }

    public onMatchingQueryRespond(event: any): void {
        console.log('匹配查询 返回', event)
        if (event.success && event.data?.res != 'SUCCESS') {
            // App.getInst(ToastUI).showTips(event.data?.msg || '请求失败');
            // this._cancelMatching()
            this.closeSelf();
            return;
        }
        let {playerNo} = event.data;
        this.confirmBtnLB.string = `正在匹配 ${playerNo.toString()}/4`
    }

    public onMatchingQuitRespond(event: any): void {
        console.log('匹配退出 返回', event)
    }

    public UpdateGoldMatch(): void {
        var ruleNameLB = this.root.getChildByPath("bg/ruleNameLB").getComponent(Label);
        ruleNameLB.string = '四人    •    东风战    •    金币场';
    }

    public UpdateTongMatch(): void {
        var ruleNameLB = this.root.getChildByPath("bg/ruleNameLB").getComponent(Label);
        ruleNameLB.string = '四人    •    东风战    •    铜币场';
    }

}
