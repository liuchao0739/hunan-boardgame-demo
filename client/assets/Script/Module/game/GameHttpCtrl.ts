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

import {MahjongCtrl} from "../../Mahjong/World/Ctrl/MahjongCtrl";
import {PlayerEnter} from "../../Mahjong/World/Ctrl/PlayerEnter";
import {PlayerMgr} from "../../Mahjong/World/Entity/Player/Player";
import {HttpCtrl} from "../../framework/ctrl/HttpCtrl";
import {EProtocolID, protocol} from "../../framework/network/protocol-configs";
import {CallBack} from "../../framework/utils/CallBack";
import {App} from "../App";

/**
 * 游戏中HTTP链接信息获取汇总
 */
export class GameHttpCtrl {
    private static _instance: GameHttpCtrl = null;

    public static get Inst(): GameHttpCtrl {
        if (!this._instance) {
            this._instance = new GameHttpCtrl();
        }
        return this._instance;
    }

    constructor() {

    }


    private _userIDArr: number[] = [];

    public reqMorePlayerSimpleInfo(mUserIDArr: number[]): void {
        this._userIDArr = mUserIDArr;
        let mUserID = mUserIDArr.shift();
        // 请求玩家头像信息
        this.playerSimpleInfoReq(mUserID);

        // 更新点击用户头像时，展示的信息
        App.getInst(MahjongCtrl).gameGetPlayerInfoReq(mUserID, 1, new CallBack(() => {

        }, this));
    }

    // 玩家简单信息请求
    public playerSimpleInfoReq(userID: number) {
        App.getInst(HttpCtrl).requestServer(EProtocolID.ROLE_USER_INFO, {userID}, new CallBack(this._playerSimpleInfoResp, this));
    }

    private _playerSimpleInfoResp(params: protocol.roleInfo.IRoleSimpleInfoResp): void {
        let player = PlayerMgr.ins.all.get(params.userID);
        if (player) {
            player.info.iconId = params.avatarTID;
            player.info.nickname = params.name;

            PlayerEnter.exe(player);
        }
        if (this._userIDArr.length > 0) {
            this.playerSimpleInfoReq(this._userIDArr.shift());
        } else {
            this._userIDArr = [];
        }
    }
}

