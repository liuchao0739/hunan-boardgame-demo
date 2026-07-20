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

import {App} from "../../../Module/App";
import {HttpCtrl} from "../../../framework/ctrl/HttpCtrl";
import {ICtrl} from "../../../framework/mgr/CtrlMgr";
import {Singleton} from "../../../framework/mgr/Singleton";
import {EProtocolID, protocol} from "../../../framework/network/protocol-configs";
import {CallBack} from "../../../framework/utils/CallBack";
import {club} from "../../../protocols/protocol";
import {UiMain} from "../../Ui/Main/UiMain";
import {PlayerMgr} from "../Entity/Player/Player";
import {GameState} from "../Support/GameState";
import {OreinSeatIdx} from "../Support/LocalView";

export class MahjongCtrl extends Singleton implements ICtrl {
    /**
     * 游戏中请求玩家数据
     * @param playerId 玩家ID
     * @param model // 0 不返回统计 1 返回俱乐部统计 2 返回友人场统计
     */
    public gameGetPlayerInfoReq(playerId: number, mode: number, cb?: CallBack): void {
        App.getInst(HttpCtrl).requestServer(EProtocolID.CLUB_GET_PLAYER_INFOR_REQ, {
            playerId,
            mode
        }, new CallBack((params) => {
            this._onGetPlayerInfoResp(params);
            cb?.exe(params);
        }, this));
    }

    private _onGetPlayerInfoResp(params: protocol.club.IGetPlayerInfoResp): void {
        let mPlayerInfo = params.playerInfo;
        if (mPlayerInfo) {
            let playerid: any = mPlayerInfo.playerId;
            let mCurrPlayer = PlayerMgr.ins.all.get(playerid);
            // console.log("all:",PlayerMgr.ins.all);
            // console.log("playerID:", mPlayerInfo.playerId);
            // console.log("mCurrPlayer:", mCurrPlayer);
            if (mCurrPlayer) {
                let idx = OreinSeatIdx.ins.getIdx(mCurrPlayer.gameData.seatOrien);
                let info = UiMain.ins.playerInfoCollection.list[idx];

                if (info) {
                    // info.player.info.iconId = mPlayerInfo.avatarId;

                    let mChangInfo: club.IChangStatistic = null;
                    // 当前东风局还是南风局 0就是东，1就是南
                    if (0 == GameState.ins.currQuan) {
                        mChangInfo = mPlayerInfo.clubstatistic.East;
                    } else if (1 == GameState.ins.currQuan) {
                        mChangInfo = mPlayerInfo.clubstatistic.South;
                    }
                    // console.log("currquan:", GameState.ins.currQuan);
                    // console.log("chang inro:", mChangInfo);
                    if (mChangInfo) {
                        // 1 - 4 位率
                        info.player.info.WL1 = mChangInfo.No1Rate;
                        info.player.info.WL2 = mChangInfo.No2Rate;
                        info.player.info.WL3 = mChangInfo.No3Rate;
                        info.player.info.WL4 = mChangInfo.No4Rate;

                        // 和牌率
                        info.player.info.HP = mChangInfo.WinRate;
                        // 放铳率
                        info.player.info.FC = mChangInfo.FailRate;
                        // 立直率
                        info.player.info.LZ = mChangInfo.ReadyRate;
                        // 副露率
                        info.player.info.FL = mChangInfo.FuluRate;

                        // 总对局数
                        info.player.info.ZDJS = mChangInfo.TotalRound;
                        // 平均和牌巡目
                        info.player.info.PJHPXM = mChangInfo.AveWinXun;
                        // 平均和牌点数
                        info.player.info.PJHPDS = mChangInfo.AveWinPoint;
                        // 平均放铳点数
                        info.player.info.PJFC = mChangInfo.AveFailPoint;
                    }
                    info.player.info.nickname = mPlayerInfo.name;
                    // 趋势图
                    info.player.info.chart = mPlayerInfo.clubstatistic.position;
                }
                // console.log("=============:", info.player);
                // UiPlayerDetail.ins.refresh( info.player ) ;
            }
        }
    }

    public clearCache(): void {

    }
}