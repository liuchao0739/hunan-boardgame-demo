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

import {protocol} from "./framework/network/protocol-configs";

export class GlobalVar {
    public static bgScale: number = 1;
    public static currScene: ESceneVar = 0;//当前游戏场景
    public static isReconnect: boolean = false;// 是否处于断线重连状态
    public static reconnectData: Uint8Array = null;// 断线重连的数据
    public static reconnectOver: boolean = false;// 重连操作完成
    public static loadGameOver: boolean = false;// 游戏场景加载完成，可以接收消息
    public static willLoadMoudle: string = null; // 场景切换完成后，需要显示的模块
    public static userGrabCard: protocol.mahjong_jp.UserGrabCard = null; // 用户抓牌的协议内容
}

export enum ESceneVar {
    SCENE_NONE,
    SCENE_LOAD,
    SCENE_HOME,
    SCENE_GAME,
}
