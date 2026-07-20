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

import {ScMapping} from "../../Communication/CardIdMapping";
import {UiMain} from "../../Ui/Main/UiMain";
import {UiSettleDianShu} from "../../Ui/Popup/Settle/UiSettleDianShu";
import {Player, PlayerMgr} from "../Entity/Player/Player";

// 重置 玩家状态设置为初始。
// 为了准备下一局
export class Reset {

    public static exe(): void {
        console.log("====reset exe");
        for (let player of PlayerMgr.ins.all.values()) {
            this.resetSeat(player);
        } // end for

        // 一些UI
        UiSettleDianShu.ins.root.active = false;
        UiMain.ins.popup.settleLocalPlayer.root.active = false;
        UiMain.ins.popup.settleLiuJuHuangPai.root.active = false;
        UiMain.ins.popup.settleLiuJuZhongTu.root.active = false;
        UiMain.ins.touchHandcard.clearDiscardLimit();

        // 振听
        UiMain.ins.zhenTing.active = false;
    }

    // 继续下一场时初始话玩家视角
    public static resetSeatOrien(): void {
        for (let player of PlayerMgr.ins.all.values()) {
            player.gameData.seatOrien = ScMapping.orien_s2c(player.gameData.seatId);
        }
    }

    public static resetSeat(player: Player): void {
        // 手牌
        for (let card of player.gameData.handcard) {
            card.presentation3d?.root.destroy();
            card.presentation2d?.root.destroy();
        }
        player.gameData.handcard.splice(0, player.gameData.handcard.length);

        // 明牌
        for (let cardShown of player.gameData.cardShown) {
            for (let card of cardShown.cards) {
                card.presentation3d.root.destroy();
            }
        }
        player.gameData.cardShown.splice(0, player.gameData.cardShown.length);

        // 打出去的牌
        for (let card of player.gameData.discard) {
            card.presentation3d.root.destroy();
        }
        player.gameData.discard.splice(0, player.gameData.discard.length);

        // 立直
        player.gameData.isLiZhi = false;
        if (player.persentation.seat != null) {
            player.persentation.seat.flagLiZhi.active = false;
        }
    }

}