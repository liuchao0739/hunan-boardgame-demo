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

import {E_CLUB_MODULE} from "../../const/EnumConst";
import {protocol} from "../../framework/network/protocol-configs";

export class ClubEntity {
    public static clubAvatarId: number | null = null;// 俱乐部头像ID
    public static createClubID: number;// 新创建的俱乐部ID
    public static joinedClubIDList: number[] = [];// 加入的俱乐部ID列表
    public static isJoinedClub: boolean = false;// 是否有创建或加入俱乐部
    public static recentClubID: number | null = null;// 最近进入的俱乐部ID
    public static clubList: protocol.club.ClubInfo[] = [];
    public static prevUI: E_CLUB_MODULE;// 上一个UI界面
    public static willShowUI: E_CLUB_MODULE;// 要显示的UI界面
    public static hideOtherUI: boolean = false;// 是否隐藏其他界面
    public static uiOpenArr: E_CLUB_MODULE[] = [];// 打开的UI数组
    public static tableList: protocol.club.TableInfo[] = [];// 俱乐部牌桌列表
    public static currTableData: protocol.club.TableInfo = null;// 当前点击台桌的数据
    public static ownerId: number;// 俱乐部创建者ID
    public static playerList: protocol.club.PlayerInfo[] = [];// 俱乐部成员列表
    public static applyMailList: protocol.mail.pbNotice[] = [];// 俱乐部新成员申请列表
    public static modifyClubID: number;// 要修改的俱乐部id
    public static enterRoomUUID: string;// 要进入的房间UUID
    public static playerDetailID: number;// 要请求详细信息的玩家ID
    public static dissClubID: string;// 解散的俱乐部ID
    public static createOrDiss: boolean = false;// 是否处于创建或解散俱乐部

    // 当前的俱乐部信息
    public static clubInfor: protocol.club.ClubInfo | null = null;
    // 搜索出来的俱乐部信息
    public static clubSearchInfor: protocol.club.ClubInfo | null = null;
    // 搜索出来的俱乐部类型（0--正常 1--已申请 2--已加入）
    public static clubSearchType: number = 0;

    // 是否是钻石俱乐部
    public static isDiamond: boolean = false;
    // // 俱乐部类型 0--铜 1--钻
    // mRoomCellSC.isDiamond = ClubEntity.clubInfor.clubType == 1 ? true : false;

    public static clubShopList: protocol.shop.IProduct[] = [];// 俱乐部商品列表
    public static clubOrderList: protocol.shop.IOrderInfo[] = [];// 俱乐部货币流水

    public static clubPlayerDetail: protocol.club.IClubPlayerInfo = null;// 俱乐部玩家详情

    public static scoreTableList: protocol.club.TableInfo[] = [];// 牌谱牌桌列表

    // 收藏牌谱时的数据
    public static saveHistoryData: protocol.club.SaveGameHistoryReq = null;
    // 当前牌谱的链接，分享牌谱时用
    public static paipuLink: string = "";
    // 当前牌谱的链接，匿名链接
    public static anoPaipuLink: string = "";
    // 俱乐部新申请成员数，用于显示红点上的数量
    public static newApplyNum: number = 0;

    // 雀神 是否匹配模式进入牌桌房间
    public static birdGodMatchMode: boolean = false;
    // 雀神 默认匹配俱乐部ID
    public static birdGodMatchClubId: number = 10096;
    // 雀神 匹配的牌局等级
    public static birdGodMatchLevel: number = 0;
    // 金币类型
    public static birdGodMatchCoinType: number = 1; // 1金币，2铜币
}
