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

import {Label, Node, Sprite, Vec3} from "cc";
import {UiPopupHelper} from "../../../../framework/utils/UiPopupHelper";
import {CommSend} from "../../../Communication/CommSend";
import {Reset} from "../../../World/Ctrl/Reset";
import {UiBtnCountDown} from "./UiBtnCountDown";
import {ClubEntity} from "../../../../Home/Entity/ClubEntity";
import {App} from "../../../../Module/App";
import {HttpCtrl} from "../../../../framework/ctrl/HttpCtrl";
import {EProtocolID} from "../../../../framework/network/protocol-configs";
import {CallBack} from "../../../../framework/utils/CallBack";

export class UiSettleGame {

    public static ins: UiSettleGame = null;

    public root: Node;

    public players = new Array<UiSettleGamePlayer>();
    public btnOK: Node;
    public btnNo: Node;


    public init(node: Node): void {
        this.root = node.getChildByPath("SettleGame");
        this.root.active = false;

        for (let i = 1; i <= 4; ++i) {
            let node = this.root.getChildByPath("Players/" + i);
            let uiPlayer = new UiSettleGamePlayer();
            uiPlayer.init(node);
            this.players.push(uiPlayer);
        } // end for

        this.btnOK = this.root.getChildByPath("btnOK");
        UiPopupHelper.btnCloseHideRoot(this.root, () => {
            Reset.exe();
        });

        this.btnNo = this.root.getChildByPath("btnNo");
        this.btnNo.on(Node.EventType.TOUCH_END, this._onBtnNoTouch, this);

    }

    private _onBtnNoTouch(): void {
        CommSend.exitRoom();
    }

    public hideAllPlayers() {
        for (let p of this.players) {
            p.root.active = false;
        }
    }

    public async show() {
        await App.getInst(HttpCtrl).requestServer(EProtocolID.CLUB_GET_TABLEINFO, {tableId: ClubEntity.enterRoomUUID}, new CallBack((params: any) => {
            console.log('结算 获取牌桌信息', params)
            // 0--普通模式 1--钻石模式
            ClubEntity.isDiamond = params.isDiamondClub == 1;
            ClubEntity.birdGodMatchLevel = params.tableInfo?.level;
            ClubEntity.birdGodMatchMode = params.tableInfo?.createSrc == 1;
        }, this)).then(() => {
        });

        UiPopupHelper.show(this.root);
        this.btnNo.setPosition(new Vec3(364, -300, 0));
        // 匹配模式的对局 下一局按钮不显示
        if (ClubEntity.birdGodMatchMode) {
            this.btnOK.active = false;
            this.btnNo.setPosition(new Vec3(510, -300, 0));
            return;
        }
        this.btnOK.active = true;
        // 结算的倒计时按钮（待验证）
        // UiBtnCountDown.start( this.btnOK , 10 ) ;
        UiBtnCountDown.startNoDoing(this.btnOK, this.btnNo, 15);

    }

}

export class UiSettleGamePlayer {

    public root: Node = null;

    public icon: Sprite;
    public nickname: Label;
    public score: Label;
    public scoreDiff: Label;
    public money: Label;
    public coinND: Node = null;
    public rankND: Node = null;

    public init(node: Node) {
        this.root = node;
        this.icon = this.root.getChildByPath("Icon/Icon").getComponent(Sprite);
        this.nickname = this.root.getChildByPath("Nickname").getComponent(Label);
        this.score = this.root.getChildByPath("Score").getComponent(Label);
        this.scoreDiff = this.root.getChildByPath("ScoreDiff").getComponent(Label);
        this.money = this.root.getChildByPath("Coin/val").getComponent(Label);

        this.coinND = this.root.getChildByPath("Coin");
        this.rankND = this.root.getChildByPath("Rank");

    }


}