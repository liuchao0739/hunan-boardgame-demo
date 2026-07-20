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

export class EventConst {
    public static readonly UPDATE_NICKNAME: string = "UPDATE_NICKNAME";
    public static readonly UPDATE_CLUB_INPUT_TOGGLE: string = "UPDATE_CLUB_INPUT_TOGGLE";// 俱乐部输入模块是否显示
    public static readonly EVT_SHOW_CLUB_MODULE: string = "SHOW_CLUB_MODULE";// 显示俱乐部模块
    public static readonly EVT_REMOVE_CLUB_PREF: string = "REMOVE_CLUB_PREF";// 移除俱乐部模块
    public static readonly EVT_REMOVE_CLUB_CHOOSEHALL: string = "REMOVE_CLUB_CHOOSEHALL";// 移除俱乐部选择大厅模块
    public static readonly EVT_UPDATE_CLUB_MAIN_TOGGLE: string = "UPDATE_CLUB_MAIN_TOGGLE"; // 俱乐部模块是否显示 
    public static readonly EVT_UPDATE_CLUB_ICON: string = "UPDATE_CLUB_ICON";// 更新俱乐部图标
    public static readonly EVT_UPDATE_TABLE_LIST: string = "UPDATE_TABLE_LIST";// 更新俱乐部台桌列表
    public static readonly EVT_UPDATE_NEWMEM_LIST: string = "UPDATE_NEWMEM_LIST"; // 更新俱乐部新申请成员列表
    public static readonly EVT_UPDATE_NEWMEM_NUM: string = "UPDATE_NEWMEM_NUM";  // 更新俱乐部新申请成员数量
    public static readonly EVT_UPDATE_CLUB_LIST: string = "UPDATE_CLUB_LIST"; // 更新俱乐部列表
    public static readonly EVT_GET_ROOM_ID: string = "GetRoomIDMessage"; // 获取房间id，从game服务器获取
}
