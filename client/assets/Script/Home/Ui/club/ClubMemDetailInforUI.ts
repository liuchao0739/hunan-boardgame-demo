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

import {_decorator, Component, EventTouch, Label, Node, Sprite, Toggle} from 'cc';
import {App} from '../../../Module/App';
import {HttpCtrl} from '../../../framework/ctrl/HttpCtrl';
import {EProtocolID, protocol} from '../../../framework/network/protocol-configs';
import {ClubEntity} from '../../Entity/ClubEntity';
import {CallBack} from '../../../framework/utils/CallBack';
import {TimeUtils} from '../../../framework/utils/time-utils';
import {CommUtils} from '../../../framework/utils/CommUtils';

const {ccclass, property} = _decorator;

@ccclass('ClubMemDetailInforUI')
export class ClubMemDetailInforUI extends Component {
    private _backBtn: Node | null = null;
    private _closeBtn: Node | null = null;
    private _headSP: Sprite | null = null;
    private _nameLB: Label | null = null;
    private _idLB: Label | null = null;
    private _joinTimeLB: Label | null = null;
    private _lastTimeLB: Label | null = null;
    private _confirmBtn: Node | null = null;
    // private _titleTG : ToggleContainer | null = null;
    private _zlToggle: Toggle | null = null;
    private _qtToggle: Toggle | null = null;
    private _sxToggle: Toggle | null = null;
    private _contItemND1: Node | null = null;
    private _contItemND2: Node | null = null;
    private _contItemND3: Node | null = null;
    private _contItemND4: Node | null = null;
    private _contItemND5: Node | null = null;
    private _contItemND6: Node | null = null;

    onLoad() {
        this._backBtn = this.node.getChildByPath("bg/backBtn");
        this._closeBtn = this.node.getChildByPath("bg/closeBtn");
        this._headSP = this.node.getChildByPath("bg/headND/headMask/headSP").getComponent(Sprite);
        this._nameLB = this.node.getChildByPath("bg/nameND/nameLB").getComponent(Label);
        this._idLB = this.node.getChildByPath("bg/nameND/idLB").getComponent(Label);
        this._joinTimeLB = this.node.getChildByPath("bg/timeND/joinTimeLB").getComponent(Label);
        this._lastTimeLB = this.node.getChildByPath("bg/timeND/lastTimeLB").getComponent(Label);
        this._zlToggle = this.node.getChildByPath("bg/titleTG/Toggle1").getComponent(Toggle);
        this._qtToggle = this.node.getChildByPath("bg/titleTG/Toggle2").getComponent(Toggle);
        this._sxToggle = this.node.getChildByPath("bg/titleTG/Toggle3").getComponent(Toggle);
        this._contItemND1 = this.node.getChildByPath("bg/contND/contItemND1");
        this._contItemND2 = this.node.getChildByPath("bg/contND/contItemND2");
        this._contItemND3 = this.node.getChildByPath("bg/contND/contItemND3");
        this._contItemND4 = this.node.getChildByPath("bg/contND/contItemND4");
        this._contItemND5 = this.node.getChildByPath("bg/contND/contItemND5");
        this._contItemND6 = this.node.getChildByPath("bg/contND/contItemND6");
        this._confirmBtn = this.node.getChildByPath("bg/confirmBtn");

        this._backBtn.on(Node.EventType.TOUCH_END, this._onCloseTouch, this);
        this._closeBtn.on(Node.EventType.TOUCH_END, this._onCloseTouch, this);
        this._confirmBtn.on(Node.EventType.TOUCH_END, this._onConfirmTouch, this);
        this._zlToggle.node.on(Toggle.EventType.CLICK, this._onZLToggle, this);
        this._qtToggle.node.on(Toggle.EventType.CLICK, this._onQTToggle, this);
        this._sxToggle.node.on(Toggle.EventType.CLICK, this._onSXToggle, this);

        // ProtocolEventManager.on(EProtocolID.CLUB_SEND_JOIN_REQ, this._onClubJoinRespond, this, EEventListenerPriority.HIGHER);
    }

    // start() {
    // }

    // update(deltaTime: number) {
    // }

    private _onCloseTouch(evt: EventTouch): void {
        this.node.destroy();
    }

    private _onConfirmTouch(evt: EventTouch): void {
        App.getInst(HttpCtrl).requestServer(
            EProtocolID.CLUB_KICKOUT_PLAYER_REQ,
            {
                "clubId": ClubEntity.recentClubID,
                "playerId": ClubEntity.playerDetailID,
            },
            new CallBack(this._onPlayerKicoutRes, this)
        );
    }

    private _onPlayerKicoutRes(event): void {
        console.log("=== kicout:", event);
        if (event.res == "SUCCESS") {
            this.node.destroy();
        }
    }


    private _onZLToggle(evt): void {
        console.log("evtzl:", evt);
    }

    private _onQTToggle(evt): void {
        console.log("evtqt:", evt);
    }

    private _onSXToggle(evt): void {
        console.log("evtsx:", evt);
    }

    // 更新数据用，必备
    public refresh(): void {
        App.getInst(HttpCtrl).requestServer(
            EProtocolID.CLUB_GET_PLAYERDETAIL_REQ,
            {
                "playerId": ClubEntity.playerDetailID,
                "clubId": ClubEntity.recentClubID,
                "startTime": 0,
                "endTime": 0
            },
            new CallBack(this._onPlayerDetailRes, this)
        );
    }

    private _onPlayerDetailRes(event): void {
        console.log("=== playerDetail:", event);
        if (event.res == "SUCCESS") {
            this._updatePlayerInfo(event.clubPlayerInfo);
        }

    }

    private _updatePlayerInfo(mPlayerInfo: protocol.club.ClubPlayerInfo): void {
        // 头像
        CommUtils.updatePlayerHeadIcon(this._headSP, mPlayerInfo.playerAvatarId);
        this._nameLB.string = mPlayerInfo.playerName;
        this._idLB.string = mPlayerInfo.playerId + "";
        this._joinTimeLB.string = TimeUtils.formatDate(mPlayerInfo.joininTime, "-", true);
        this._lastTimeLB.string = TimeUtils.formatDate(mPlayerInfo.lastPlayTime, "-", true);

        // 赢得最大金币
        this._contItemND1.getChildByPath("numLB").getComponent(Label).string = mPlayerInfo.maxWinCoins.toFixed(1);
        // 最大得点
        this._contItemND2.getChildByPath("numLB").getComponent(Label).string = mPlayerInfo.maxWinPoints.toFixed(1);
        // 总对局数
        this._contItemND3.getChildByPath("numLB").getComponent(Label).string = mPlayerInfo.totalRoundNo + "";
        // 服务费
        this._contItemND4.getChildByPath("numLB").getComponent(Label).string = mPlayerInfo.fee.toFixed(1);
        // 总输赢
        this._contItemND5.getChildByPath("numLB").getComponent(Label).string = mPlayerInfo.ledgerBalance.toFixed(1);
        // 用户余额
        this._contItemND6.getChildByPath("numLB").getComponent(Label).string = mPlayerInfo.balance.toFixed(1);

        if (ClubEntity.ownerId == mPlayerInfo.playerId) {
            this._confirmBtn.active = false;
        } else {
            this._confirmBtn.active = true;
        }
    }

    onDestroy(): void {

    }
}

