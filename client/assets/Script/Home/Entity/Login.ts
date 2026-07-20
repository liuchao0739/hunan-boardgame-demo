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

import {club} from "../../protocols/protocol";

export class LoginEnity {
    public static account: string = "";
    public static accountID: string = "";// playerID
    public static playerID: number = 0;//
    public static balance: number = 0;   // 金币
    public static jade: number = 0;     // 勾玉
    public static tongbi: number = 0;    // 铜币
    public static token: string = "";
    public static nickName: string = "天才日麻选手";   // 昵称
    public static isNewAccount: boolean = false;// 是否首次登录
    public static serverURL: string = null;// 从服务器获取，不能写死"ws://47.106.137.12:9087/ws";
    public static clubstatistic: club.IStatistic;    //俱乐部统计
    public static friendstatistic: club.IStatistic;  //友人场统计
    public static inputPhone: string = "";
    public static countryID: number = 0;
    public static avatarTID: number;        //头像模板ID
}
