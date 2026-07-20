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
import {ClubEntity} from "../../Home/Entity/ClubEntity";
import {LoginEnity} from "../../Home/Entity/Login";
import {HttpCtrl} from "../../framework/ctrl/HttpCtrl";
import {Singleton} from "../../framework/mgr/Singleton";
import {EProtocolID, protocol} from "../../framework/network/protocol-configs";
import {CallBack} from "../../framework/utils/CallBack";
import {ICtrl} from "../../framework/mgr/CtrlMgr";
import {App} from "../App";

export class ClubCtrl extends Singleton implements ICtrl {
    //俱乐部中自身的数据变更
    static CLUB_SELF_DETAIL_CHANGE: string = `CLUB_SELF_DETAIL_CHANGE`;
    //俱乐部中其他人的数据变更
    static CLUB_OTHER_DETAIL_CHANGE: string = `CLUB_OTHER_DETAIL_CHANGE`;

    /**
     * 请求玩家数据
     * @param playerId 玩家ID
     * @param model // 0 不返回统计 1 返回俱乐部统计 2 返回友人场统计
     */
    public GetPlayerInfoReq(playerId: number, mode: number, cb?: CallBack): void {
        App.getInst(HttpCtrl).requestServer(EProtocolID.CLUB_GET_PLAYER_INFOR_REQ, {
            playerId,
            mode
        }, new CallBack((params) => {
            this.GetPlayerInfoResp(params);
            cb?.exe(params);
        }, this));
    }

    public GetPlayerInfoResp(params: protocol.club.IGetPlayerInfoResp): void {
        let playerInfo = params.playerInfo;
        if (playerInfo) {
            if (playerInfo.playerId + "" != LoginEnity.accountID) return;

            ClubEntity.joinedClubIDList = playerInfo.joinedClubIdList;
            ClubEntity.isJoinedClub = ClubEntity.joinedClubIDList.length > 0;
            ClubEntity.recentClubID = playerInfo.recentClubId;
            LoginEnity.balance = playerInfo.balance;
            LoginEnity.jade = playerInfo.gouyu;
            LoginEnity.tongbi = playerInfo.tongbi;
            LoginEnity.clubstatistic = playerInfo.clubstatistic;
            LoginEnity.friendstatistic = playerInfo.friendstatistic;
        }
    }


    /**
     * 获取俱乐部玩家详情
     * @param playerId
     * @param clubId
     * @param startTime
     * @param endTime
     * @param cb
     */
    public GetClubPlayerDetailReq(playerId: number, clubId: number, startTime: number, endTime: number, cb?: CallBack): void {
        App.getInst(HttpCtrl).requestServer(EProtocolID.CLUB_GET_PLAYERDETAIL_REQ, {
            playerId,
            clubId,
            startTime,
            endTime
        }, new CallBack((params) => {
            this.GetClubPlayerDetailResp(params);
            cb?.exe(params);
        }, this));
    }

    public GetClubPlayerDetailResp(params: protocol.club.IGetClubPlayerDetailResp): void {
        if (params.clubPlayerInfo.playerId == LoginEnity.playerID) {
            ClubEntity.clubPlayerDetail = params.clubPlayerInfo;
            director.emit(ClubCtrl.CLUB_SELF_DETAIL_CHANGE);
        } else {
            director.emit(ClubCtrl.CLUB_OTHER_DETAIL_CHANGE);
        }
    }


    /**
     * 请求新申请俱乐部的玩家数量
     * @param roleId 玩家ID
     * @param clubId
     */
    public GetClubApplicationCountReq(roleId: number, clubId: number, cb?: CallBack): void {
        App.getInst(HttpCtrl).requestServer(EProtocolID.MAIL_GET_CLUBAPPLICATION_UNREAD_COUNT, {
            roleId,
            clubId
        }, new CallBack((params) => {
            cb?.exe(params);
        }, this));
    }

    // 解散台桌
    public GetClubCloseTable(clubId: number, ownerId: number, tableId: string, cb?: CallBack): void {
        App.getInst(HttpCtrl).requestServer(EProtocolID.CLUB_CLOSETABLE, {
            clubId,
            ownerId,
            tableId
        }, new CallBack((params) => {
            cb?.exe(params);
        }, this));
    }


    public clearCache(): void {

    }
}