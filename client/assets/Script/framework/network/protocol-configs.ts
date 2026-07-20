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

import {Constructor} from "cc";
import protocol, {mahjong_jp} from "../../protocols/protocol.js";
// import protocol from "../../../protocols/protocol.js";
export {protocol};

export enum EProtocolID {
    /* 登录 */
    ACCOUNT_TOKEN = 10000,
    ACCOUNT_LOGIN = 10001,
    ACCOUNT_LOGGED_IN_ELSEWHERE = 10002,
    ACCOUNT_HEARTBEAT = 10003,
    ACCOUNT_LOGOUT = 10004,

    // websocket服务器地址
    GET_SERVER_URL = 10007,
    // 获取验证码
    PHONE_CODE_REQ = 10009,
    // 手机验证码登录
    PHONE_CODE_LOGIN = 10010,
    // 手机密码注册
    PHONE_REGISTER = 10011,
    // 修改密码
    PHONE_PW_CHANGE = 10012,
    // 手机密码登录
    PHONE_PW_LOGIN = 10013,
    // 获取玩家基本信息
    PROFILE_REQ = 10020,
    // 修改手机号
    PROFILE_MODIFY = 10021,

    /* 头像与角色信息 */
    ROLE_USER_INFO = 11000,
    ROLE_GET_INFO = 11002,
    ROLE_SET_AVATAR_INFO = 11003,
    ROLE_SET_NAME_INFO = 11004,
    ROLE_SET_BORDER_INFO = 11005,

    /* 转盘 */
    FREE_GET_INFO = 13000,
    FREE_REQ = 13001,
    FREE_GET_SHOP_INFO = 13002,
    FREE_SHOP_REQ = 13003,

    PUSH_BAG_ITEMS_CHANGE = 14000,
    PUSH_INFO_CHANGE = 14001,

    /* 任务 */
    TASK_INFO_LIST = 17001,
    TASK_REWARD_CLAIM = 17002,
    TASK_JACKPOT_INFO = 17003,
    TASK_TASK_STATUS = 17004,
    TASK_JACKPOT_REWARD = 17005,

    /** 打点信息 */
    PUSH_TRACE_INFO = 18001,

    /* 德州扑克 */
    HOLDEM_GAME_SYNC = 20000,
    HOLDEM_GAME_START = 20001,
    HOLDEM_PLAYER_OWN_HOLE = 20002,
    HOLDEM_GAME_DEAL_COMMUNITY = 20003,
    HOLDEM_GAME_SHOWDOWN = 20004,
    HOLDEM_GAME_OVER = 20005,
    HOLDEM_PLAYER_JOIN_QUIT = 20006,
    HOLDEM_PLAYER_UPDATE = 20007,
    HOLDEM_PLAYER_STAND = 20008,
    HOLDEM_PLAYER_TURN = 20009,
    HOLDEM_PLAYER_ACT = 20010,
    HOLDEM_PLAYER_TIMEOUT = 20011,
    HOLDEM_PLAYER_OPERATE = 20012,
    HOLDEM_PLAYER_SHOW_HOLE = 20013,
    HOLDEM_PLAYER_CHANGE_TABLE = 20014,
    HOLDEM_PLAYER_BUY_CHIP = 20015,
    HOLDEM_GAME_DEAL_HOLE = 20016,
    HOLDEM_GAME_ROUND_END = 20017,
    HOLDEM_GAME_ID = 20101,

    /* VIP */
    VIP_GET_STATUS = 15001,
    VIP_GET_UPGRADE_PACKET = 15002,
    VIP_GET_DATA_HIDE_INFO = 15003,
    VIP_SET_DATA_HIDE_INFO = 15004,
    VIP_UPGRADE = 15007,
    VIP_DOWNGRADE = 15008,

    /* 邮箱  */
    MAIL_LIST = 60001,
    MAIL_OPEN_MAIL_DETAILED = 60002,
    MAIL_RECEIVE_MAIL = 60003,
    MAIL_DELETE_MAIL = 60004,
    MAIL_DELETE_MAIL_ALL = 60005,
    MAIL_RECEIVE_MAIL_ALL = 60006,
    MAIL_GET_CLUBAPPLICATION_LIST = 60009,
    MAIL_GET_CLUBAPPLICATION_UNREAD_COUNT = 60010,

    /* 商城 */
    SHOP_GET_INFO = 61001,      //获取商城信息
    SHOP_CREATE_ORDER = 61002,  //创建订单
    SHOP_CHECK_ORDER = 61003,   //谷歌订单查询
    SHOP_SEND_ORDER = 61004,
    SHOP_GET_ORDER_LIST = 61005,// 查询玩家购买记录
    GET_START_PACK_INFO = 61006,// 插叙你玩家首冲礼包
    SHOP_GET_PRODUCT_LIST = 61007,// 获取商品列表支付平台类型为other
    SHOP_CREATE_WITHDRAW_ORDER = 61008,// 取款

    GET_CLUB_ORDER_INFO = 61009,// 查询俱乐部玩家存取记录


    /* 背包 */
    BAG_ITEMS_LIST = 64001,

    /* 俱乐部 */
    CLUB_CREATE_REQ = 65001,
    CLUB_MODIFY_REQ = 65002,
    CLUB_SEND_JOIN_REQ = 65003, // 申请加入
    CLUB_DECIDE_JOIN_REQ = 65004, // 同意或拒绝
    CLUB_GET_CLUBLIST_REQ = 65005, // 获取俱乐部列表
    CLUB_GET_INFOR_REQ = 65006, // 获取俱乐部信息
    CLUB_GET_TABLELIST_REQ = 65007, // 获取俱乐部的牌桌列表
    CLUB_GET_PLAYERLIST_REQ = 65008,// 获取俱乐部下的玩家列表
    CLUB_GET_PLAYERDETAIL_REQ = 65009,// 获取俱乐部里玩家的详情
    CLUB_KICKOUT_PLAYER_REQ = 65010,// 踢出俱乐部
    CLUB_CREATE_TABLE_REQ = 65011,// 创建牌桌
    CLUB_JOIN_TABLE_REQ = 65012, // 弃用
    CLUB_QUIT_TABLE_REQ = 65013, // 弃用
    CLUB_UPDATE_TABLE_REQ = 65014, // 给游戏服务器用
    CLUB_GET_PLAYER_INFOR_REQ = 65015, // 获取玩家信息
    CLUB_GET_CLUB_PLAYER_TABLE_HISTORY_REQ = 65016,// 获取club玩家牌桌历史
    CLUB_GET_APPLICATIONLIST_REQ = 65017,// 弃用
    CLUB_GET_ORDERLIST_REQ = 65018,// 待考虑
    CLUB_GET_ITEMLIST_REQ = 65019,// 待考虑
    CLUB_GET_MONEYORDERLIST_REQ = 65020,// 待考虑
    CLUB_GET_TABLEINFO = 65022, // 获取牌桌信息
    CLUB_QUITCLUB = 65024, // 退出俱乐部

    CLUB_GET_PLAYER_GAME_HISTORY = 65029,// 获取玩家牌桌历史
    CLUB_SAVEGAMEHISTORY = 65030,   //收藏牌谱
    CLUB_GETGAMEHISTORYDETAIL = 65031,   //获取牌谱回放
    CLUB_GETWBBINDINFO = 65032,     //获取we宝绑定信息
    CLUB_MODIFYTABLE = 65033,  //修改牌桌配置
    CLUB_MODIFYCLUBTYPE = 65034,   //修改俱乐部类型
    CLUB_GETWBRANDCODE = 65035,   //WE BAO RANDOM CODE
    CLUB_GETWBLOGINTOKEN = 65036,   //WE BAO LOGIN TOKEN
    CLUB_CANCELWBBIND = 65037,   //CANCLE WE BAO BIND

    CLUB_CHECKCLUBAPPLICATION = 65038,// 检查是否申请过俱乐部
    CLUB_CLOSETABLE = 65039,// 关闭牌桌
    CLUB_MATCHING_JOIN = 65040, // 加入匹配
    CLUB_MATCHING_QUIT = 65041, // 退出匹配
    CLUB_MATCHING_QUERY = 65042, // 匹配查询

    // CLUB_CREATECLUB            = 65001;
    // CLUB_MODIFYCLUB            = 65002;
    // CLUB_SENDCLUBJOINREQUEST   = 65003;
    // CLUB_DECIDECLUBJOINREQUEST = 65004;
    // CLUB_GETCLUBLIST           = 65005;
    // CLUB_GETCLUBINFO           = 65006;
    // CLUB_GETCLUBTABLELIST      = 65007;
    // CLUB_GETCLUBPLAYERLIST     = 65008;
    // CLUB_GETCLUBPLAYERDETAIL   = 65009;
    // CLUB_KICKOUTCLUBPLAYER     = 65010;
    // CLUB_CREATETABLE           = 65011;
    // CLUB_JOINTABLE             = 65012;
    // CLUB_QUITTABLE             = 65013;
    // CLUB_UPDATETABLE           = 65014;
    // CLUB_GETPLAYERINFO         = 65015;
    // CLUB_GETPLAYERTABLEHISTORY = 65016;
    // CLUB_GETCLUBAPPLICATIONLIST = 65017;
    // CLUB_GETCLUBORDERLIST       = 65018;
    // CLUB_GETCLUBITEMLIST        = 65019;
    // CLUB_GETCLUBMONEYORDERLIST  = 65020;


    // 获取麻将房间
    MJ_JP_GET_ROOM = 0x2219,
    // 进入房间
    MJ_JP_ENTER_ROOM = 0x2220,
    // 进入房间(通过UUID)
    MJ_JP_ENTER_ENTER_CLUB_ROOM = 0x2343,

    MJ_JP_ENTER_ROOM_RESP_1 = 0x2307,
    MJ_JP_ENTER_ROOM_RESP_2 = 0x2309,
    MJ_JP_ENTER_ROOM_RESP_3 = 0x2301,

    /*
     * 用户退出房间[俱乐部，友人房都是使用这个]
     * c >> s: 空
     */
    MJ_JP_LOGOUT = 0x2201,
    /*
     * 用户退出回复
     * s >> c: ExitStatus
     */
    MJ_JP_LOGOUT_ROOM_RY = 0x2344,
    /*
     * 广播用户退出
     * s >> c: PlayerID
     */
    MJ_JP_BROADCAST_USER_LOGOUT = 0x230A,

    /*
     * 重连请求
     * c >> s: 空
     */
    MAHJONG_CLIENT_RECONNECT_REQ = 0x2213,
};

export interface IProtocolData {
    [EProtocolID.ACCOUNT_TOKEN]: { req: protocol.account.ITokenReq, resp: protocol.account.ITokenResp },
    [EProtocolID.ACCOUNT_LOGIN]: { req: protocol.account.ILoginReq, resp: protocol.account.ILoginResp },
    [EProtocolID.ACCOUNT_LOGGED_IN_ELSEWHERE]: { req: null, resp: null },
    [EProtocolID.ACCOUNT_HEARTBEAT]: { req: null, resp: protocol.account.IHeartbeat },
    [EProtocolID.ACCOUNT_LOGOUT]: { req: null, resp: null },
    [EProtocolID.GET_SERVER_URL]: { req: protocol.account.IServerURLReq, resp: protocol.account.IServerURLResp },
    [EProtocolID.PHONE_CODE_REQ]: { req: protocol.account.IPhoneAccountReq, resp: protocol.account.IPhoneAccountResp },
    [EProtocolID.PHONE_CODE_LOGIN]: { req: protocol.account.ITokenReq, resp: protocol.account.ITokenResp },
    [EProtocolID.PHONE_REGISTER]: { req: protocol.account.ITokenReq, resp: protocol.account.ITokenResp },
    [EProtocolID.PHONE_PW_CHANGE]: { req: protocol.account.IPhoneAccountReq, resp: protocol.account.IPhoneAccountResp },
    [EProtocolID.PHONE_PW_LOGIN]: { req: protocol.account.ITokenReq, resp: protocol.account.ITokenResp },
    [EProtocolID.PROFILE_REQ]: { req: protocol.account.IProfileReq, resp: protocol.account.IProfileResp },
    [EProtocolID.PROFILE_MODIFY]: { req: protocol.account.IProfileReq, resp: protocol.account.IProfileResp },

    [EProtocolID.ROLE_USER_INFO]: {
        req: protocol.roleInfo.IRoleSimpleInfoReq,
        resp: protocol.roleInfo.IRoleSimpleInfoResp
    },

    [EProtocolID.FREE_GET_INFO]: {
        req: protocol.turntable.ITurnTableInfoReq,
        resp: protocol.turntable.ITurnTableInfoResp
    },
    [EProtocolID.FREE_REQ]: { req: protocol.turntable.ITurnTableReq, resp: protocol.turntable.ITurnTableResp },
    [EProtocolID.FREE_GET_SHOP_INFO]: {
        req: protocol.turntable.IShopTurnTableInfoReq,
        resp: protocol.turntable.IShopTurnTableInfoResp
    },
    [EProtocolID.FREE_SHOP_REQ]: { req: protocol.turntable.ITurnTableReq, resp: protocol.turntable.IShopTurnTableResp },

    [EProtocolID.PUSH_BAG_ITEMS_CHANGE]: { req: null, resp: protocol.push.IInventoryChange },
    [EProtocolID.PUSH_INFO_CHANGE]: { req: null, resp: protocol.push.IInfoChange },

    [EProtocolID.TASK_INFO_LIST]: { req: protocol.task.IreqInfo, resp: protocol.task.ItaskInfoList },
    [EProtocolID.TASK_REWARD_CLAIM]: { req: protocol.task.IrewardClaimReq, resp: protocol.task.IrewardClaimResp },
    [EProtocolID.TASK_JACKPOT_INFO]: { req: protocol.task.IjackpotRewardReq, resp: protocol.task.IjackpotRewardResp },
    [EProtocolID.TASK_TASK_STATUS]: { req: null, resp: protocol.task.InoticeTaskStatusUpdate },
    [EProtocolID.TASK_JACKPOT_REWARD]: { req: protocol.task.IjackpotRewardReq, resp: protocol.task.IjackpotRewardResp },
    [EProtocolID.PUSH_TRACE_INFO]: { req: protocol.trace.ItraceInfo, resp: protocol.trace.ItraceStatus },

    // [EProtocolID.HOLDEM_GAME_SYNC]: { req: null, resp: protocol.texas_holdem.IGameSync },
    // [EProtocolID.HOLDEM_GAME_START]: { req: null, resp: protocol.texas_holdem.IGameStart },
    // [EProtocolID.HOLDEM_PLAYER_OWN_HOLE]: { req: null, resp: protocol.texas_holdem.IGameDeal },
    // [EProtocolID.HOLDEM_GAME_DEAL_COMMUNITY]: { req: null, resp: protocol.texas_holdem.IGameDeal },
    // [EProtocolID.HOLDEM_GAME_SHOWDOWN]: { req: null, resp: protocol.texas_holdem.IGameShowdown },
    // [EProtocolID.HOLDEM_GAME_OVER]: { req: null, resp: protocol.texas_holdem.IGameOver },
    // [EProtocolID.HOLDEM_PLAYER_JOIN_QUIT]: {
    //     req: protocol.texas_holdem.IPlayerJoinQuit,
    //     resp: protocol.texas_holdem.IPlayerJoinQuit
    // },
    // [EProtocolID.HOLDEM_PLAYER_UPDATE]: { req: null, resp: protocol.texas_holdem.IPlayer },
    // [EProtocolID.HOLDEM_PLAYER_STAND]: { req: null, resp: protocol.texas_holdem.IPlayer },
    // [EProtocolID.HOLDEM_PLAYER_TURN]: { req: null, resp: protocol.texas_holdem.IPlayerTurn },
    // [EProtocolID.HOLDEM_PLAYER_ACT]: {
    //     req: protocol.texas_holdem.IPlayerActionReq,
    //     resp: protocol.texas_holdem.IPlayerAction
    // },
    [EProtocolID.HOLDEM_PLAYER_TIMEOUT]: { req: null, resp: null },
    // [EProtocolID.HOLDEM_PLAYER_OPERATE]: { req: protocol.texas_holdem.IPlayerOperationReq, resp: null },
    // [EProtocolID.HOLDEM_PLAYER_SHOW_HOLE]: {
    //     req: protocol.texas_holdem.IPlayerHoleCards,
    //     resp: protocol.texas_holdem.IPlayerHoleCards
    // },
    // [EProtocolID.HOLDEM_PLAYER_CHANGE_TABLE]: { req: null, resp: protocol.texas_holdem.IPlayerJoinQuit },
    // [EProtocolID.HOLDEM_PLAYER_BUY_CHIP]: {
    //     req: protocol.texas_holdem.IPlayerBuyChip,
    //     resp: protocol.texas_holdem.IPlayerBuyChip
    // },
    [EProtocolID.HOLDEM_GAME_DEAL_HOLE]: { req: null, resp: null },
    // [EProtocolID.HOLDEM_GAME_ROUND_END]: { req: null, resp: protocol.texas_holdem.IGameRoundEnd },
    // [EProtocolID.HOLDEM_GAME_ID]: { req: protocol.texas_holdem.IGameIDReq, resp: protocol.texas_holdem.IGameID },
    [EProtocolID.VIP_GET_STATUS]: { req: protocol.vip.IpbType, resp: protocol.vip.IVipStatus },
    [EProtocolID.VIP_GET_UPGRADE_PACKET]: {
        req: protocol.vip.IupgradePacketReq,
        resp: protocol.vip.IupgradePacketResp
    },
    [EProtocolID.VIP_GET_DATA_HIDE_INFO]: { req: protocol.vip.IdataHideReq, resp: protocol.vip.IdataHideResp },
    [EProtocolID.VIP_SET_DATA_HIDE_INFO]: { req: protocol.vip.IsetDataHideReq, resp: protocol.vip.IsetDataHideResp },
    [EProtocolID.VIP_UPGRADE]: { req: null, resp: protocol.vip.InoticeVipUpgrade },
    [EProtocolID.VIP_DOWNGRADE]: { req: null, resp: protocol.vip.InoticeVipDowngrade },

    [EProtocolID.MAIL_LIST]: { req: protocol.mail.IpbMsgType, resp: protocol.mail.IpbMailList },
    [EProtocolID.MAIL_OPEN_MAIL_DETAILED]: { req: protocol.mail.IpbGetMailContent, resp: protocol.mail.IpbMailContent },
    [EProtocolID.MAIL_RECEIVE_MAIL]: {
        req: protocol.mail.IpbGetMailAttachment,
        resp: protocol.mail.IpbAllMailAttachmentResp
    },
    [EProtocolID.MAIL_DELETE_MAIL]: { req: protocol.mail.IpbDeleteMail, resp: protocol.mail.IpbDeleteMail },
    [EProtocolID.MAIL_DELETE_MAIL_ALL]: { req: protocol.mail.IpbDeleteAll, resp: protocol.mail.IpbDeleteAll },
    [EProtocolID.MAIL_RECEIVE_MAIL_ALL]: {
        req: protocol.mail.IpbGetAllMailAttachment,
        resp: protocol.mail.IpbAllMailAttachmentResp
    },
    [EProtocolID.MAIL_GET_CLUBAPPLICATION_LIST]: {
        req: protocol.mail.IpbClubApplicationReq,
        resp: protocol.mail.IpbMailList
    },
    [EProtocolID.MAIL_GET_CLUBAPPLICATION_UNREAD_COUNT]: {
        req: protocol.mail.IpbClubApplicationCountReq,
        resp: protocol.mail.IpbClubApplicationCountResp
    },

    [EProtocolID.SHOP_GET_INFO]: { req: protocol.shop.IpbGetShopConfig, resp: protocol.shop.IpbShopInfo },
    [EProtocolID.SHOP_CREATE_ORDER]: { req: protocol.shop.IpbCreateOrderReq, resp: protocol.shop.IpbCreateOrderRes },
    [EProtocolID.SHOP_CHECK_ORDER]: { req: protocol.shop.IpbCheckOrderReq, resp: protocol.shop.IpbCheckOrderRes },
    [EProtocolID.SHOP_SEND_ORDER]: { req: protocol.shop.IpbSendOrderReq, resp: protocol.shop.IpbSendOrderRes },

    // [EProtocolID.GET_ORDER_INFO]: { req: protocol.shop.IpbSendOrderReq, resp: protocol.shop.IpbSendOrderRes },
    [EProtocolID.SHOP_GET_ORDER_LIST]: {
        req: protocol.shop.IpbGetOrderInfoReq,
        resp: protocol.shop.IpbGetOrderInfoRes
    },
    [EProtocolID.GET_CLUB_ORDER_INFO]: {
        req: protocol.shop.IpbGetClubOrderInfoReq,
        resp: protocol.shop.IpbGetClubOrderInfoRes
    },

    [EProtocolID.GET_START_PACK_INFO]: {
        req: protocol.shop.IpbGetOrderInfoReq,
        resp: protocol.shop.IpbGetOrderInfoRes
    },
    [EProtocolID.SHOP_GET_PRODUCT_LIST]: {
        req: protocol.shop.IpbGetProductListReq,
        resp: protocol.shop.IpbGetProductListResp
    },
    [EProtocolID.SHOP_CREATE_WITHDRAW_ORDER]: {
        req: protocol.shop.IpbCreateWithDrawOrderReq,
        resp: protocol.shop.IpbCreateWithDrawOrderRes
    },

    [EProtocolID.ROLE_GET_INFO]: { req: protocol.roleInfo.IRoleInfoReq, resp: protocol.roleInfo.IRoleInfoResp },
    [EProtocolID.ROLE_SET_AVATAR_INFO]: {
        req: protocol.roleInfo.ISetAvatarReq,
        resp: protocol.roleInfo.ISetAvatarResp
    },
    [EProtocolID.ROLE_SET_NAME_INFO]: { req: protocol.roleInfo.ISetNameReq, resp: protocol.roleInfo.ISetNameResp },
    [EProtocolID.ROLE_SET_BORDER_INFO]: {
        req: protocol.roleInfo.ISetBorderReq,
        resp: protocol.roleInfo.ISetBorderResp
    },

    [EProtocolID.BAG_ITEMS_LIST]: { req: protocol.bag.IpbGetBag, resp: protocol.bag.IpbBagInfo },

    // 俱乐部
    [EProtocolID.CLUB_CREATE_REQ]: { req: protocol.club.ICreateClubReq, resp: protocol.club.ICreateClubResp },
    [EProtocolID.CLUB_MODIFY_REQ]: { req: protocol.club.IModifyClubReq, resp: protocol.club.IModifyClubResp },
    [EProtocolID.CLUB_SEND_JOIN_REQ]: { req: protocol.club.ISendClubJoinReq, resp: protocol.club.ISendClubJoinResp },
    [EProtocolID.CLUB_DECIDE_JOIN_REQ]: {
        req: protocol.club.IDecideClubJoinReq,
        resp: protocol.club.IDecideClubJoinResp
    },
    [EProtocolID.CLUB_GET_CLUBLIST_REQ]: { req: protocol.club.IGetClubListReq, resp: protocol.club.IGetClubListResp },
    [EProtocolID.CLUB_GET_INFOR_REQ]: { req: protocol.club.IGetClubInfoReq, resp: protocol.club.IGetClubInfoResp },
    [EProtocolID.CLUB_GET_TABLELIST_REQ]: {
        req: protocol.club.IGetClubTableListReq,
        resp: protocol.club.IGetClubTableListResp
    },
    [EProtocolID.CLUB_GET_PLAYERLIST_REQ]: {
        req: protocol.club.IGetClubPlayerListReq,
        resp: protocol.club.IGetClubPlayerListResp
    },
    [EProtocolID.CLUB_GET_PLAYERDETAIL_REQ]: {
        req: protocol.club.IGetClubPlayerDetailReq,
        resp: protocol.club.IGetClubPlayerDetailResp
    },
    [EProtocolID.CLUB_KICKOUT_PLAYER_REQ]: {
        req: protocol.club.IKickoutClubPlayerReq,
        resp: protocol.club.IKickoutClubPlayerResp
    },

    [EProtocolID.CLUB_CREATE_TABLE_REQ]: { req: protocol.club.ICreateTableReq, resp: protocol.club.ICreateTableResp },
    [EProtocolID.CLUB_JOIN_TABLE_REQ]: { req: protocol.club.IJoinTableReq, resp: protocol.club.IJoinTableResp },
    [EProtocolID.CLUB_QUIT_TABLE_REQ]: { req: protocol.club.IQuitTableReq, resp: protocol.club.IQuitTableResp },
    [EProtocolID.CLUB_UPDATE_TABLE_REQ]: { req: protocol.club.IUpdateTableReq, resp: protocol.club.IUpdateTableResp },
    [EProtocolID.CLUB_GET_PLAYER_INFOR_REQ]: {
        req: protocol.club.IGetPlayerInfoReq,
        resp: protocol.club.IGetPlayerInfoResp
    },
    [EProtocolID.CLUB_GET_CLUB_PLAYER_TABLE_HISTORY_REQ]: {
        req: protocol.club.IGetClubPlayerGameHistoryReq,
        resp: protocol.club.IGetClubPlayerGameHistoryResp
    },
    [EProtocolID.CLUB_GET_APPLICATIONLIST_REQ]: {
        req: protocol.club.IGetClubAppliCationListReq,
        resp: protocol.club.IGetClubAppliCationListResp
    },
    [EProtocolID.CLUB_GET_ORDERLIST_REQ]: {
        req: protocol.club.IGetClubOrderListReq,
        resp: protocol.club.IGetClubOrderListResp
    },
    [EProtocolID.CLUB_GET_ITEMLIST_REQ]: {
        req: protocol.club.IGetClubItemListReq,
        resp: protocol.club.IGetClubItemListResp
    },
    [EProtocolID.CLUB_GET_MONEYORDERLIST_REQ]: {
        req: protocol.club.IGetClubMoneyOrderListReq,
        resp: protocol.club.IGetClubMoneyOrderListResp
    },
    [EProtocolID.CLUB_GET_TABLEINFO]: { req: protocol.club.IGetTableInfoReq, resp: protocol.club.IGetTableInfoResp },
    [EProtocolID.CLUB_QUITCLUB]: { req: protocol.club.IQuitClubReq, resp: protocol.club.IQuitClubResp },
    [EProtocolID.CLUB_GET_PLAYER_GAME_HISTORY]: {
        req: protocol.club.IGetPlayerGameHistoryReq,
        resp: protocol.club.IGetPlayerGameHistoryResp
    },
    [EProtocolID.CLUB_SAVEGAMEHISTORY]: {
        req: protocol.club.ISaveGameHistoryReq,
        resp: protocol.club.ISaveGameHistoryResp
    },
    [EProtocolID.CLUB_GETGAMEHISTORYDETAIL]: {
        req: protocol.club.IGetGameHistoryDetailReq,
        resp: protocol.club.IGetGameHistoryDetailResp
    },
    [EProtocolID.CLUB_GETWBBINDINFO]: { req: protocol.club.IGetWBBindInfoReq, resp: protocol.club.IGetWBBindInfoResp },
    [EProtocolID.CLUB_MODIFYTABLE]: { req: protocol.club.IModifyTableReq, resp: protocol.club.IModifyTableResp },
    [EProtocolID.CLUB_MODIFYCLUBTYPE]: {
        req: protocol.club.IModifyClubTypeReq,
        resp: protocol.club.IModifyClubTypeResp
    },
    [EProtocolID.CLUB_GETWBRANDCODE]: { req: protocol.club.IGetWBRandCodeReq, resp: protocol.club.IGetWBRandCodeResp },
    [EProtocolID.CLUB_GETWBLOGINTOKEN]: {
        req: protocol.club.IGetWBLoginTokenReq,
        resp: protocol.club.IGetWBLoginTokenResp
    },
    [EProtocolID.CLUB_CANCELWBBIND]: { req: protocol.club.ICancelWBBindReq, resp: protocol.club.ICancelWBBindResp },
    [EProtocolID.CLUB_CHECKCLUBAPPLICATION]: {
        req: protocol.club.ICheckApplicationReq,
        resp: protocol.club.ICheckApplicationResp
    },
    [EProtocolID.CLUB_CLOSETABLE]: { req: protocol.club.ICloseTableReq, resp: protocol.club.ICloseTableResp },
    [EProtocolID.CLUB_MATCHING_JOIN]: { req: protocol.club.IMatchingJoinReq, resp: protocol.club.IMatchingResp },
    [EProtocolID.CLUB_MATCHING_QUIT]: { req: protocol.club.IMatchingQuitReq, resp: protocol.club.IMatchingResp },
    [EProtocolID.CLUB_MATCHING_QUERY]: { req: protocol.club.IMatchingQueryReq, resp: protocol.club.IMatchingResp },


    [EProtocolID.MJ_JP_GET_ROOM]: { req: null, resp: protocol.mahjong_jp.IGameID },
    [EProtocolID.MJ_JP_ENTER_ROOM]: { req: protocol.mahjong_jp.IGameID, resp: protocol.mahjong_jp.IGameID },
    [EProtocolID.MJ_JP_ENTER_ENTER_CLUB_ROOM]: {
        req: protocol.mahjong_jp.IGameUUID,
        resp: protocol.mahjong_jp.IGameUUID
    },
    [EProtocolID.MJ_JP_ENTER_ROOM_RESP_1]: { req: null, resp: protocol.mahjong_jp.IMahjongTableEnterResponse },
    [EProtocolID.MJ_JP_ENTER_ROOM_RESP_2]: { req: null, resp: protocol.mahjong_jp.IPlayerInfo },
    [EProtocolID.MJ_JP_ENTER_ROOM_RESP_3]: { req: null, resp: protocol.mahjong_jp.IPlayerID },
    [EProtocolID.MJ_JP_LOGOUT]: { req: null, resp: null },
    [EProtocolID.MJ_JP_LOGOUT_ROOM_RY]: { req: null, resp: null },
    [EProtocolID.MJ_JP_BROADCAST_USER_LOGOUT]: { req: null, resp: null },
    [EProtocolID.MAHJONG_CLIENT_RECONNECT_REQ]: { req: null, resp: null },
};

export type CoderConstructor<T = unknown> = Constructor<T> & {
    encode: (...args: any[]) => any,
    decode: (...args: any[]) => any
};

export interface IProtocolConfig {
    encoder?: CoderConstructor,
    decoder?: CoderConstructor,
    httpAPI?: string,
};

const _configs: { [id in EProtocolID]: IProtocolConfig } = {
    [EProtocolID.ACCOUNT_TOKEN]: {
        encoder: protocol.account.TokenReq,
        decoder: protocol.account.TokenResp,
        httpAPI: 'account'
    },
    [EProtocolID.ACCOUNT_LOGIN]: {
        encoder: protocol.account.LoginReq,
        decoder: protocol.account.LoginResp,
        httpAPI: 'account'
    },
    [EProtocolID.ACCOUNT_LOGGED_IN_ELSEWHERE]: {},
    [EProtocolID.ACCOUNT_HEARTBEAT]: {decoder: protocol.account.Heartbeat},
    [EProtocolID.ACCOUNT_LOGOUT]: {encoder: null, decoder: null, httpAPI: 'account'},

    [EProtocolID.GET_SERVER_URL]: {
        encoder: protocol.account.ServerURLReq,
        decoder: protocol.account.ServerURLResp,
        httpAPI: 'account'
    },
    [EProtocolID.PHONE_CODE_REQ]: {
        encoder: protocol.account.PhoneAccountReq,
        decoder: protocol.account.PhoneAccountResp,
        httpAPI: 'account'
    },
    [EProtocolID.PHONE_CODE_LOGIN]: {
        encoder: protocol.account.TokenReq,
        decoder: protocol.account.TokenResp,
        httpAPI: 'account'
    },
    [EProtocolID.PHONE_REGISTER]: {
        encoder: protocol.account.TokenReq,
        decoder: protocol.account.TokenResp,
        httpAPI: 'account'
    },
    [EProtocolID.PHONE_PW_CHANGE]: {
        encoder: protocol.account.PhoneAccountReq,
        decoder: protocol.account.PhoneAccountResp,
        httpAPI: 'account'
    },
    [EProtocolID.PHONE_PW_LOGIN]: {
        encoder: protocol.account.TokenReq,
        decoder: protocol.account.TokenResp,
        httpAPI: 'account'
    },
    [EProtocolID.PROFILE_REQ]: {
        encoder: protocol.account.ProfileReq,
        decoder: protocol.account.ProfileResp,
        httpAPI: 'account'
    },
    [EProtocolID.PROFILE_MODIFY]: {
        encoder: protocol.account.ProfileReq,
        decoder: protocol.account.ProfileResp,
        httpAPI: 'account'
    },
    [EProtocolID.ROLE_USER_INFO]: {
        encoder: protocol.roleInfo.RoleSimpleInfoReq,
        decoder: protocol.roleInfo.RoleSimpleInfoResp,
        httpAPI: 'roleInfo'
    },

    [EProtocolID.FREE_GET_INFO]: {
        encoder: protocol.turntable.TurnTableInfoReq,
        decoder: protocol.turntable.TurnTableInfoResp,
        httpAPI: 'turntable'
    },
    [EProtocolID.FREE_REQ]: {
        encoder: protocol.turntable.TurnTableReq,
        decoder: protocol.turntable.TurnTableResp,
        httpAPI: 'turntable'
    },
    [EProtocolID.FREE_GET_SHOP_INFO]: {
        encoder: protocol.turntable.ShopTurnTableInfoReq,
        decoder: protocol.turntable.ShopTurnTableInfoResp,
        httpAPI: 'turntable'
    },
    [EProtocolID.FREE_SHOP_REQ]: {
        encoder: protocol.turntable.TurnTableReq,
        decoder: protocol.turntable.ShopTurnTableResp,
        httpAPI: 'turntable'
    },

    [EProtocolID.PUSH_BAG_ITEMS_CHANGE]: {decoder: protocol.push.InventoryChange},
    [EProtocolID.PUSH_INFO_CHANGE]: {decoder: protocol.push.InfoChange},

    [EProtocolID.TASK_INFO_LIST]: {
        encoder: protocol.task.reqInfo,
        decoder: protocol.task.taskInfoList,
        httpAPI: 'task'
    },
    [EProtocolID.TASK_REWARD_CLAIM]: {
        encoder: protocol.task.rewardClaimReq,
        decoder: protocol.task.rewardClaimResp,
        httpAPI: 'task'
    },
    [EProtocolID.TASK_JACKPOT_INFO]: {
        encoder: protocol.task.jackpotRewardReq,
        decoder: protocol.task.jackpotRewardResp,
        httpAPI: 'task'
    },
    [EProtocolID.TASK_TASK_STATUS]: {decoder: protocol.task.noticeTaskStatusUpdate, httpAPI: 'task'},
    [EProtocolID.TASK_JACKPOT_REWARD]: {
        encoder: protocol.task.jackpotRewardReq,
        decoder: protocol.task.jackpotRewardResp,
        httpAPI: 'task'
    },

    [EProtocolID.PUSH_TRACE_INFO]: {encoder: protocol.trace.traceInfo, decoder: protocol.trace.traceStatus},

    // [EProtocolID.HOLDEM_GAME_SYNC]: {decoder: protocol.texas_holdem.GameSync},
    // [EProtocolID.HOLDEM_GAME_START]: {decoder: protocol.texas_holdem.GameStart},
    // [EProtocolID.HOLDEM_PLAYER_OWN_HOLE]: {decoder: protocol.texas_holdem.GameDeal},
    // [EProtocolID.HOLDEM_GAME_DEAL_COMMUNITY]: {decoder: protocol.texas_holdem.GameDeal},
    // [EProtocolID.HOLDEM_GAME_SHOWDOWN]: {decoder: protocol.texas_holdem.GameShowdown},
    // [EProtocolID.HOLDEM_GAME_OVER]: {decoder: protocol.texas_holdem.GameOver},
    // [EProtocolID.HOLDEM_PLAYER_JOIN_QUIT]: {
    //     encoder: protocol.texas_holdem.PlayerJoinQuit,
    //     decoder: protocol.texas_holdem.PlayerJoinQuit
    // },
    // [EProtocolID.HOLDEM_PLAYER_UPDATE]: {decoder: protocol.texas_holdem.Player},
    // [EProtocolID.HOLDEM_PLAYER_STAND]: {decoder: protocol.texas_holdem.Player},
    // [EProtocolID.HOLDEM_PLAYER_TURN]: {decoder: protocol.texas_holdem.PlayerTurn},
    // [EProtocolID.HOLDEM_PLAYER_ACT]: {
    //     encoder: protocol.texas_holdem.PlayerActionReq,
    //     decoder: protocol.texas_holdem.PlayerAction
    // },
    [EProtocolID.HOLDEM_PLAYER_TIMEOUT]: {},
    // [EProtocolID.HOLDEM_PLAYER_OPERATE]: {encoder: protocol.texas_holdem.PlayerOperationReq},
    // [EProtocolID.HOLDEM_PLAYER_SHOW_HOLE]: {
    //     encoder: protocol.texas_holdem.PlayerHoleCards,
    //     decoder: protocol.texas_holdem.PlayerHoleCards
    // },
    // [EProtocolID.HOLDEM_PLAYER_CHANGE_TABLE]: {decoder: protocol.texas_holdem.PlayerJoinQuit},
    // [EProtocolID.HOLDEM_PLAYER_BUY_CHIP]: {
    //     encoder: protocol.texas_holdem.PlayerBuyChip,
    //     decoder: protocol.texas_holdem.PlayerBuyChip
    // },
    [EProtocolID.HOLDEM_GAME_DEAL_HOLE]: {},
    // [EProtocolID.HOLDEM_GAME_ROUND_END]: {decoder: protocol.texas_holdem.GameRoundEnd},
    // [EProtocolID.HOLDEM_GAME_ID]: {encoder: protocol.texas_holdem.GameIDReq, decoder: protocol.texas_holdem.GameID},
    [EProtocolID.VIP_GET_STATUS]: {encoder: protocol.vip.pbType, decoder: protocol.vip.VipStatus, httpAPI: 'vip'},
    [EProtocolID.VIP_GET_UPGRADE_PACKET]: {
        encoder: protocol.vip.upgradePacketReq,
        decoder: protocol.vip.upgradePacketResp,
        httpAPI: 'vip'
    },
    [EProtocolID.VIP_GET_DATA_HIDE_INFO]: {
        encoder: protocol.vip.dataHideReq,
        decoder: protocol.vip.dataHideResp,
        httpAPI: 'vip'
    },
    [EProtocolID.VIP_SET_DATA_HIDE_INFO]: {
        encoder: protocol.vip.setDataHideReq,
        decoder: protocol.vip.setDataHideResp,
        httpAPI: 'vip'
    },
    [EProtocolID.VIP_UPGRADE]: {decoder: protocol.vip.noticeVipUpgrade},
    [EProtocolID.VIP_DOWNGRADE]: {decoder: protocol.vip.noticeVipDowngrade},

    [EProtocolID.MAIL_LIST]: {encoder: protocol.mail.pbMsgType, decoder: protocol.mail.pbMailList, httpAPI: 'mail'},
    [EProtocolID.MAIL_OPEN_MAIL_DETAILED]: {
        encoder: protocol.mail.pbGetMailContent,
        decoder: protocol.mail.pbMailContent,
        httpAPI: 'mail'
    },
    [EProtocolID.MAIL_RECEIVE_MAIL]: {
        encoder: protocol.mail.pbGetMailAttachment,
        decoder: protocol.mail.pbAllMailAttachmentResp,
        httpAPI: 'mail'
    },
    [EProtocolID.MAIL_DELETE_MAIL]: {
        encoder: protocol.mail.pbDeleteMail,
        decoder: protocol.mail.pbDeleteMail,
        httpAPI: 'mail'
    },
    [EProtocolID.MAIL_DELETE_MAIL_ALL]: {
        encoder: protocol.mail.pbDeleteAll,
        decoder: protocol.mail.pbDeleteAll,
        httpAPI: 'mail'
    },
    [EProtocolID.MAIL_RECEIVE_MAIL_ALL]: {
        encoder: protocol.mail.pbGetAllMailAttachment,
        decoder: protocol.mail.pbAllMailAttachmentResp,
        httpAPI: 'mail'
    },
    [EProtocolID.MAIL_GET_CLUBAPPLICATION_LIST]: {
        encoder: protocol.mail.pbClubApplicationReq,
        decoder: protocol.mail.pbMailList,
        httpAPI: 'mail'
    },
    [EProtocolID.MAIL_GET_CLUBAPPLICATION_UNREAD_COUNT]: {
        encoder: protocol.mail.pbClubApplicationCountReq,
        decoder: protocol.mail.pbClubApplicationCountResp,
        httpAPI: 'mail'
    },

    [EProtocolID.SHOP_GET_INFO]: {
        encoder: protocol.shop.pbGetShopConfig,
        decoder: protocol.shop.pbShopInfo,
        httpAPI: 'shop'
    },
    [EProtocolID.SHOP_CREATE_ORDER]: {
        encoder: protocol.shop.pbCreateOrderReq,
        decoder: protocol.shop.pbCreateOrderRes,
        httpAPI: 'shop'
    },
    [EProtocolID.SHOP_CHECK_ORDER]: {
        encoder: protocol.shop.pbCheckOrderReq,
        decoder: protocol.shop.pbCheckOrderRes,
        httpAPI: 'shop'
    },
    [EProtocolID.SHOP_SEND_ORDER]: {
        encoder: protocol.shop.pbSendOrderReq,
        decoder: protocol.shop.pbSendOrderRes,
        httpAPI: 'shop'
    },

    // [EProtocolID.GET_ORDER_INFO]: { encoder: protocol.shop.pbSendOrderReq, decoder: protocol.shop.pbSendOrderRes, httpAPI:'shop' },
    [EProtocolID.SHOP_GET_ORDER_LIST]: {
        encoder: protocol.shop.pbGetOrderInfoReq,
        decoder: protocol.shop.pbGetOrderInfoRes,
        httpAPI: 'shop'
    },
    [EProtocolID.GET_CLUB_ORDER_INFO]: {
        encoder: protocol.shop.pbGetClubOrderInfoReq,
        decoder: protocol.shop.pbGetClubOrderInfoRes,
        httpAPI: 'shop'
    },

    [EProtocolID.GET_START_PACK_INFO]: {
        encoder: protocol.shop.pbGetOrderInfoReq,
        decoder: protocol.shop.pbGetOrderInfoRes,
        httpAPI: 'shop'
    },
    [EProtocolID.SHOP_GET_PRODUCT_LIST]: {
        encoder: protocol.shop.pbGetProductListReq,
        decoder: protocol.shop.pbGetProductListResp,
        httpAPI: 'shop'
    },
    [EProtocolID.SHOP_CREATE_WITHDRAW_ORDER]: {
        encoder: protocol.shop.pbCreateWithDrawOrderReq,
        decoder: protocol.shop.pbCreateWithDrawOrderRes,
        httpAPI: 'shop'
    },

    [EProtocolID.ROLE_GET_INFO]: {
        encoder: protocol.roleInfo.RoleInfoReq,
        decoder: protocol.roleInfo.RoleInfoResp,
        httpAPI: 'roleInfo'
    },
    [EProtocolID.ROLE_SET_AVATAR_INFO]: {
        encoder: protocol.roleInfo.SetAvatarReq,
        decoder: protocol.roleInfo.SetAvatarResp,
        httpAPI: 'roleInfo'
    },
    [EProtocolID.ROLE_SET_NAME_INFO]: {
        encoder: protocol.roleInfo.SetNameReq,
        decoder: protocol.roleInfo.SetNameResp,
        httpAPI: 'roleInfo'
    },
    [EProtocolID.ROLE_SET_BORDER_INFO]: {
        encoder: protocol.roleInfo.SetBorderReq,
        decoder: protocol.roleInfo.SetBorderResp,
        httpAPI: 'roleInfo'
    },

    [EProtocolID.BAG_ITEMS_LIST]: {encoder: protocol.bag.pbGetBag, decoder: protocol.bag.pbBagInfo, httpAPI: 'bag'},

    // 俱乐部
    [EProtocolID.CLUB_CREATE_REQ]: {
        encoder: protocol.club.CreateClubReq,
        decoder: protocol.club.CreateClubResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_MODIFY_REQ]: {
        encoder: protocol.club.ModifyClubReq,
        decoder: protocol.club.ModifyClubResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_SEND_JOIN_REQ]: {
        encoder: protocol.club.SendClubJoinReq,
        decoder: protocol.club.SendClubJoinResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_DECIDE_JOIN_REQ]: {
        encoder: protocol.club.DecideClubJoinReq,
        decoder: protocol.club.DecideClubJoinResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_GET_CLUBLIST_REQ]: {
        encoder: protocol.club.GetClubListReq,
        decoder: protocol.club.GetClubListResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_GET_INFOR_REQ]: {
        encoder: protocol.club.GetClubInfoReq,
        decoder: protocol.club.GetClubInfoResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_GET_TABLELIST_REQ]: {
        encoder: protocol.club.GetClubTableListReq,
        decoder: protocol.club.GetClubTableListResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_GET_PLAYERLIST_REQ]: {
        encoder: protocol.club.GetClubPlayerListReq,
        decoder: protocol.club.GetClubPlayerListResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_GET_PLAYERDETAIL_REQ]: {
        encoder: protocol.club.GetClubPlayerDetailReq,
        decoder: protocol.club.GetClubPlayerDetailResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_KICKOUT_PLAYER_REQ]: {
        encoder: protocol.club.KickoutClubPlayerReq,
        decoder: protocol.club.KickoutClubPlayerResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_CREATE_TABLE_REQ]: {
        encoder: protocol.club.CreateTableReq,
        decoder: protocol.club.CreateTableResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_JOIN_TABLE_REQ]: {
        encoder: protocol.club.JoinTableReq,
        decoder: protocol.club.JoinTableResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_QUIT_TABLE_REQ]: {
        encoder: protocol.club.QuitTableReq,
        decoder: protocol.club.QuitTableResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_UPDATE_TABLE_REQ]: {
        encoder: protocol.club.UpdateTableReq,
        decoder: protocol.club.UpdateTableResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_GET_PLAYER_INFOR_REQ]: {
        encoder: protocol.club.GetPlayerInfoReq,
        decoder: protocol.club.GetPlayerInfoResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_GET_CLUB_PLAYER_TABLE_HISTORY_REQ]: {
        encoder: protocol.club.GetClubPlayerGameHistoryReq,
        decoder: protocol.club.GetClubPlayerGameHistoryResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_GET_APPLICATIONLIST_REQ]: {
        encoder: protocol.club.GetClubAppliCationListReq,
        decoder: protocol.club.GetClubAppliCationListResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_GET_ORDERLIST_REQ]: {
        encoder: protocol.club.GetClubOrderListReq,
        decoder: protocol.club.GetClubOrderListResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_GET_ITEMLIST_REQ]: {
        encoder: protocol.club.GetClubItemListReq,
        decoder: protocol.club.GetClubItemListResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_GET_MONEYORDERLIST_REQ]: {
        encoder: protocol.club.GetClubMoneyOrderListReq,
        decoder: protocol.club.GetClubMoneyOrderListResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_GET_TABLEINFO]: {
        encoder: protocol.club.GetTableInfoReq,
        decoder: protocol.club.GetTableInfoResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_QUITCLUB]: {
        encoder: protocol.club.QuitClubReq,
        decoder: protocol.club.QuitClubResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_GET_PLAYER_GAME_HISTORY]: {
        encoder: protocol.club.GetPlayerGameHistoryReq,
        decoder: protocol.club.GetPlayerGameHistoryResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_SAVEGAMEHISTORY]: {
        encoder: protocol.club.SaveGameHistoryReq,
        decoder: protocol.club.SaveGameHistoryResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_GETGAMEHISTORYDETAIL]: {
        encoder: protocol.club.GetGameHistoryDetailReq,
        decoder: protocol.club.GetGameHistoryDetailResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_GETWBBINDINFO]: {
        encoder: protocol.club.GetWBBindInfoReq,
        decoder: protocol.club.GetWBBindInfoResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_MODIFYTABLE]: {
        encoder: protocol.club.ModifyTableReq,
        decoder: protocol.club.ModifyTableResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_MODIFYCLUBTYPE]: {
        encoder: protocol.club.ModifyClubTypeReq,
        decoder: protocol.club.ModifyClubTypeResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_GETWBRANDCODE]: {
        encoder: protocol.club.GetWBRandCodeReq,
        decoder: protocol.club.GetWBRandCodeResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_GETWBLOGINTOKEN]: {
        encoder: protocol.club.GetWBLoginTokenReq,
        decoder: protocol.club.GetWBLoginTokenResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_CANCELWBBIND]: {
        encoder: protocol.club.CancelWBBindReq,
        decoder: protocol.club.CancelWBBindResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_CHECKCLUBAPPLICATION]: {
        encoder: protocol.club.CheckApplicationReq,
        decoder: protocol.club.CheckApplicationResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_CLOSETABLE]: {
        encoder: protocol.club.CloseTableReq,
        decoder: protocol.club.CloseTableResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_MATCHING_JOIN]: {
        encoder: protocol.club.MatchingJoinReq,
        decoder: protocol.club.MatchingResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_MATCHING_QUIT]: {
        encoder: protocol.club.MatchingQuitReq,
        decoder: protocol.club.MatchingResp,
        httpAPI: 'club'
    },
    [EProtocolID.CLUB_MATCHING_QUERY]: {
        encoder: protocol.club.MatchingQueryReq,
        decoder: protocol.club.MatchingResp,
        httpAPI: 'club'
    },

    [EProtocolID.MJ_JP_GET_ROOM]: {decoder: protocol.mahjong_jp.GameID, httpAPI: 'bag'},
    [EProtocolID.MJ_JP_ENTER_ROOM]: {},
    [EProtocolID.MJ_JP_ENTER_ENTER_CLUB_ROOM]: {
        encoder: protocol.mahjong_jp.GameUUID,
        decoder: protocol.mahjong_jp.GameUUID
    },
    [EProtocolID.MJ_JP_ENTER_ROOM_RESP_1]: {encoder: protocol.mahjong_jp.MahjongTableEnterResponse, httpAPI: 'bag'},
    [EProtocolID.MJ_JP_ENTER_ROOM_RESP_2]: {encoder: protocol.mahjong_jp.PlayerInfo, httpAPI: 'bag'},
    [EProtocolID.MJ_JP_ENTER_ROOM_RESP_3]: {encoder: protocol.mahjong_jp.PlayerID, httpAPI: 'bag'},
    [EProtocolID.MJ_JP_LOGOUT]: {encoder: null, decoder: null},
    [EProtocolID.MJ_JP_LOGOUT_ROOM_RY]: {encoder: null, decoder: null},
    [EProtocolID.MJ_JP_BROADCAST_USER_LOGOUT]: {encoder: null, decoder: null},
    [EProtocolID.MAHJONG_CLIENT_RECONNECT_REQ]: {encoder: null, decoder: null},
};

export function queryProtocolConfig(protocolID: EProtocolID): Readonly<IProtocolConfig> | null {
    return _configs[protocolID];
}
