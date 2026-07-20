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

import {OreinSeatIdx} from "../Support/LocalView";
import {Player} from "../Entity/Player/Player";
import {WorldNode} from "../Support/WorldNode";
import {UiMain} from "../../Ui/Main/UiMain";

// 玩家进入
export class PlayerEnter {

    public static exe(player: Player) {
        // console.log("【=========】");
        // 绑定 2D UI
        this.bindPresentation(player);
    }

    // 绑定表现。3D空间节点，2D UI 等。
    public static bindPresentation(player: Player) {
        var idx = OreinSeatIdx.ins.getIdx(player.gameData.seatOrien);

        player.persentation.idx = idx;

        // 3D 空间
        player.persentation.seat = WorldNode.ins.seats[idx];

        // Ui
        var info = UiMain.ins.playerInfoCollection.list[idx];
        if (info) {
            info.player = player;
            player.persentation.info = info;
            info.root.active = true;
            info.refresh();
        }

        // 刷新开始游戏动画界面的玩家数据
        UiMain.ins.startGameAnim.refresh(player);
    }

}
