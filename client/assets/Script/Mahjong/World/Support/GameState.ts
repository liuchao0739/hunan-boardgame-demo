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

import {Player} from "../Entity/Player/Player";

// 游戏状态
export class GameState {

    public static ins: GameState = null;

    // 最后一次出牌的玩家
    public playerLastDiscarded: Player = null;

    // 山牌
    public shanCardNum = 74;

    // 出牌的固定时间
    public fixDurationDiscard = 0;
    // 操作的固定时间
    public fixDurationOp = 0;

    // 游戏状态 0--游戏未开始（刚进入房间） 1--游戏准备开始 2--游戏开始 3--一场结束（只有一场结束才能退出房间）
    public gameStatus: number = 0;

    // 当前东风局还是南风局 0就是东，1就是南
    public currQuan: number = -1;

    public doraValuesMap: Map<number, boolean> = new Map;
}