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

import {director} from "cc";
import {ESceneVar, GlobalVar} from "../../../GlobalVar";
import {UiMain} from "../../Ui/Main/UiMain";
import {PlayerMgr} from "../Entity/Player/Player";
import {ClubEntity} from "../../../Home/Entity/ClubEntity";

export class ExitCtrl {
    public static exe(): void {
        // 清空所有玩家的数据
        UiMain.ins.playerInfoCollection.clearAllList();

        let playerID = PlayerMgr.ins.local.info.id;
        let player = PlayerMgr.ins.all.get(playerID);
        if (player) {
            PlayerMgr.ins.all.clear();
            PlayerMgr.ins.all.set(playerID, player);
            console.log("all:", PlayerMgr.ins.all);
        }
        // SceneMgr.runScene("Home", true);
        // console.log('退出房间', ClubEntity.birdGodMatchMode);
        GlobalVar.willLoadMoudle = ClubEntity.birdGodMatchMode ? 'BirdGodRule' : "CLUB";
        GlobalVar.currScene = ESceneVar.SCENE_HOME;
        director.loadScene("Home")

        // Comm.closeSocket();
        // WebSocketMgr.Inst.closeNetWork(true);
    }
}
