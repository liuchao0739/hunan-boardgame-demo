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
import {ESceneVar, GlobalVar} from "../../GlobalVar";
import {App} from "../../Module/App";
import {ClubCtrl} from "../../Module/club/ClubCtrl";
import {EventConst} from "../../const/EventConst";
import {ProtocolHTTPManager} from "../../framework/network/http";
import {EProtocolID, protocol} from "../../framework/network/protocol-configs";
import {ClubEntity} from "../Entity/ClubEntity";
import {LoginEnity} from "../Entity/Login";
import {SceneMgr} from "../../framework/mgr/SceneMgr";
import {CommSend} from "../../Mahjong/Communication/CommSend";
import {ViewMgr} from "../../framework/mgr/ViewMgr";
import {AudioMgr} from "../../framework/media/AudioMgr";
import {ToastUI} from "../Ui/ToastUI";

export class HomeCommImmediate {
    public static exe(data: protocol.club.PushMsg) {
        console.log("【大厅及时推送】:", data);
        console.log("==:", GlobalVar.currScene)
        if (GlobalVar.currScene != ESceneVar.SCENE_HOME) {
            return;
        }
        //     uint32    Code     = 1;    //1 俱乐部解散 2 收到加入俱乐部申请 3 同意加入俱乐部 4 拒绝加入俱乐部 5 牌桌人员变动 6 新建牌桌 7 金币变更
        // uint32    ClubId   = 2;
        // string    ClubName = 3;
        // string    TableId  = 4;
        // repeated  PushPlayerInfo Players = 5;
        // 1 俱乐部解散
        if (data.Code == 1) {

        }
        // 2 收到加入俱乐部申请
        else if (data.Code == 2) {
            ClubEntity.newApplyNum++;
            director.emit(EventConst.EVT_UPDATE_NEWMEM_NUM);
        }
        // 3 同意加入俱乐部
        else if (data.Code == 3) {
            // 获取俱乐部个人信息
            ProtocolHTTPManager.load(EProtocolID.CLUB_GET_PLAYER_INFOR_REQ, {
                playerId: LoginEnity.playerID,
                // 0 不返回统计 1 返回俱乐部统计 2 返回友人场统计
                mode: 0,
            }, false);

            // 更新俱乐部列表
            let mParamObj = {"playerId": LoginEnity.playerID};
            ProtocolHTTPManager.load(EProtocolID.CLUB_GET_CLUBLIST_REQ, mParamObj, false);
        }
        // 4 拒绝加入俱乐部
        else if (data.Code == 4) {
            // 获取俱乐部个人信息
            ProtocolHTTPManager.load(EProtocolID.CLUB_GET_PLAYER_INFOR_REQ, {
                playerId: LoginEnity.playerID,
                // 0 不返回统计 1 返回俱乐部统计 2 返回友人场统计
                mode: 0,
            }, false);
        }
        // 5 牌桌人员变动
        else if (data.Code == 5) {
            // 更新大厅俱乐部界面的玩家信息，目前还不行，不进入游戏的玩家是收不到这个及时推送的
            if (ClubEntity.recentClubID == data.ClubId) {
                // 请求牌桌列表
                let mParams = {
                    "clubId": ClubEntity.recentClubID,
                    "status": 1
                };
                ProtocolHTTPManager.load(EProtocolID.CLUB_GET_TABLELIST_REQ, mParams, false);
            }
        }
        // 6 新建牌桌
        else if (data.Code == 6) {
            console.log("新建牌桌--请求俱乐部信息", ClubEntity.recentClubID);
            ClubEntity.createOrDiss = true;
            // 获取俱乐部信息
            let mParams = {
                "clubId": ClubEntity.recentClubID,
            };
            ProtocolHTTPManager.load(EProtocolID.CLUB_GET_INFOR_REQ, mParams, false);
        }
        // 7 金币发生变更
        else if (data.Code == 7) {
            console.log("请求最近的金币情况");
            App.getInst(ClubCtrl).GetClubPlayerDetailReq(LoginEnity.playerID, ClubEntity.recentClubID, 0, 0);
        }
        // 8 关闭牌桌
        else if (data.Code == 8) {
            console.log("关闭牌桌--请求俱乐部信息", ClubEntity.recentClubID);
            ClubEntity.createOrDiss = true;
            // 获取俱乐部信息
            let mParams = {
                "clubId": ClubEntity.recentClubID,
            };
            ProtocolHTTPManager.load(EProtocolID.CLUB_GET_INFOR_REQ, mParams, false);

        }
            // 9 勾玉变化 / 10 铜币变化
            // else if (data.Code === 9 || data.Code === 10) {
            //     ProtocolHTTPManager.load(EProtocolID.CLUB_GET_PLAYER_INFOR_REQ, {
            //         playerId: LoginEnity.playerID,
            //         // 0 不返回统计 1 返回俱乐部统计 2 返回友人场统计
            //         mode: 0,
            //     }, false);
            // }
        // 9 匹配成功
        else if (data.Code === 9) {
            // 推送和查询返回失败有时间差，不是在首页场景则忽略消息
            console.log('匹配成功 即将进入牌桌', director.getScene().name);
            App.getInst(ViewMgr).closeAll();
            AudioMgr.inst.remove();
            AudioMgr.inst.playOneShot('Audio/Sound/match_success');
            App.getInst(ToastUI).showTips('匹配成功 即将进入牌桌...');
            setTimeout(function () {
                GlobalVar.willLoadMoudle = null;
                ClubEntity.isDiamond = true;
                ClubEntity.enterRoomUUID = data.TableId;
                ClubEntity.recentClubID = data.ClubId;
                SceneMgr.runScene("Mahjong", false, () => {
                    CommSend.enterRoomUUID(ClubEntity.enterRoomUUID, ClubEntity.recentClubID);
                }, this);
            }, 3000)
        }

    }
}
