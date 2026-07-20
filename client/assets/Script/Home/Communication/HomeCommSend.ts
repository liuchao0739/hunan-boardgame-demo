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

import {PacketHelper} from "../../Mahjong/Communication/Packet";
import {sys} from "cc";
import {EProtocolID, protocol} from "../../framework/network/protocol-configs";

export class HomeCommSend {
    public static ws: WebSocket;

    ////////////////// MODULE 邮箱 //////////////////
    // 请求token
    public static requestMailToken() {
        let data = PacketHelper.makePacketData2(protocol.mail.MailCode.BROADCAST_MAIL);
        this.ws.send(data);
    }

    // 获取邮箱
    public static requestMailList() {
        let pb = new protocol.mail.pbMsgType();// 创建protobuf
        // pb.roleId = HomeUiMainHall.ins.player.info.id;		
        pb.type = protocol.mail.MailType.DEFAULTMAIL;
        let data = PacketHelper.makePacketData2(EProtocolID.MAIL_LIST, protocol.mail.pbMsgType.encode(pb).finish());
        this.ws.send(data);
    }

    //     /*
    //   * 打开邮件详情（阅读邮件）
    //   * c >> s: pbGetMailContent
    //   * s >> c: pbMailContent
    //   */
    //   OPEN_MAIL_DETAILED = 60002;
    // 打开邮件详情
    public static requestMailContent(mInd: number) {
        let pb = new protocol.mail.pbGetMailContent();
        pb.index = mInd + "";
        let data = PacketHelper.makePacketData2(EProtocolID.MAIL_OPEN_MAIL_DETAILED, protocol.mail.pbGetMailContent.encode(pb).finish());
        this.ws.send(data);
    }

    // /*
    // * 领取附件（单个)
    // * c >> s: pbGetMailAttachment
    // * s >> c: pbAllMailAttachmentResp
    // */
    // RECEIVE_MAIL = 60003;
    public static requestMailAttach(mInd: number) {
        let pb = new protocol.mail.pbGetMailAttachment();
        pb.index = mInd + "";
        let data = PacketHelper.makePacketData2(EProtocolID.MAIL_RECEIVE_MAIL, protocol.mail.pbGetMailAttachment.encode(pb).finish());
        this.ws.send(data);
    }

    // /*
    // * 删除邮件（单个)
    // * c >> s: pbDeleteMail
    // * s >> c: pbDeleteMail
    // */
    // DELETE_MAIL = 60004;
    public static requestMailDelete(mInd: number) {
        let pb = new protocol.mail.pbDeleteMail();
        pb.index = mInd + "";
        let data = PacketHelper.makePacketData2(EProtocolID.MAIL_DELETE_MAIL, protocol.mail.pbDeleteMail.encode(pb).finish());
        this.ws.send(data);
    }

    // /*
    // * 批量删除邮件
    // * c >> s: pbDeleteAll
    // * s >> c: pbDeleteAll
    // */
    // DELETE_MAIL_ALL = 60005;
    public static requestMailDeleteAll() {
        let pb = new protocol.mail.pbDeleteAll();
        // pb.type = 
        let data = PacketHelper.makePacketData2(EProtocolID.MAIL_DELETE_MAIL_ALL, protocol.mail.pbDeleteAll.encode(pb).finish());
        this.ws.send(data);
    }

    // /*
    // * 提取所有邮件附件
    // * c >> s: pbGetAllMailAttachment
    // * s >> c: pbAllMailAttachmentResp
    // */
    // RECEIVE_MAIL_ALL = 60006;
    public static requestMailAllAttach() {
        let pb = new protocol.mail.pbGetAllMailAttachment();
        let data = PacketHelper.makePacketData2(EProtocolID.MAIL_RECEIVE_MAIL_ALL, protocol.mail.pbGetAllMailAttachment.encode(pb).finish());
        this.ws.send(data);
    }

    ////////////////// MODULE ROLE //////////////////
    /* 玩家简单信息请求
    * c >> s: RoleSimpleInfoReq
    * s >> c: RoleSimpleInfoResp
    */
    //     GET_SIMPLE_INFO = 11000;
    // 玩家简单信息请求
    // public static requestRoleInfoSimple(mUserID:number){
    //     let pb = new protocol.roleInfo.RoleSimpleInfoReq();
    //     pb.userID = mUserID;
    //     let data = PacketHelper.makePacketData2(EProtocolID.ROLE_USER_INFO, protocol.roleInfo.RoleSimpleInfoReq.encode(pb).finish());
    //     this.ws.send(data);
    // }

    /*
    * 当前牌局信息（登录后请求，用于返回牌局）
    * c >> s: -
    * s >> c: RoleGameInfo
    */
    // ROLE_GAME_INFO = 11001;
    // public static requestRoleGameInfo(){
    //     this.ws.send(PacketHelper.makePacketData2(protocol.roleInfo.RoleInfoCode.ROLE_GAME_INFO));
    // }

    /*
    * 玩家信息请求
    * c >> s: RoleInfoReq
    * s >> c: RoleInfoResp
    */
    // GET_INFO = 11002;
    // public static requestRoleInfo(mUserID:number, mInforID:number){
    //     let pb = new protocol.roleInfo.RoleInfoReq();
    //     pb.userID = mUserID;
    //     pb.infoID = mInforID;
    //     this.ws.send(PacketHelper.makePacketData2(EProtocolID.ROLE_GET_INFO, protocol.roleInfo.RoleInfoReq.encode(pb).finish()));
    // }

    /*
    * 设置头像
    * c >> s: SetAvatarReq
    * s >> c: SetAvatarResp
    */
    // SET_AVATAR_INFO = 11003;
    // public static setAvatarInfo(mUserID:number, mAvatarID){
    //     let pb = new protocol.roleInfo.SetAvatarReq();
    //     pb.userID = mUserID;
    //     pb.ano    = mAvatarID;
    //     this.ws.send(PacketHelper.makePacketData2(EProtocolID.ROLE_SET_AVATAR_INFO, protocol.roleInfo.SetAvatarReq.encode(pb).finish()));
    // }

    /*
    * 玩家修改名称
    * c >> s: SetNameReq
    * s >> c: SetNameResp
    */
    // SET_NAME_INFO = 11004; protocol.roleInfo.RoleInfoCode.SET_NAME_INFO //
    // public static setNameInfo(mUserID:number, mName:string){
    //     let pb = new protocol.roleInfo.SetNameReq();
    //     pb.userID = mUserID;
    //     pb.name   = mName;
    //     this.ws.send(PacketHelper.makePacketData2(EProtocolID.ROLE_SET_NAME_INFO, protocol.roleInfo.SetNameReq.encode(pb).finish()));
    // }

    /*
    * 设置头像框
    * c >> s: SetBorderReq
    * s >> c: SetBorderResp
    */
    // SET_BORDER_INFO = 11005;
    // public static setBorderInfo(mUserID:number, mbno:number){
    //     let pb = new protocol.roleInfo.SetBorderReq();
    //     pb.userID = mUserID;
    //     pb.bno    = mbno;
    //     this.ws.send(PacketHelper.makePacketData2(EProtocolID.ROLE_SET_BORDER_INFO, protocol.roleInfo.SetBorderReq.encode(pb).finish()))
    // }

    ////////////////// MODULE Account //////////////////
    /*
    * 请求token
    * c >> s: TokenReq
    * s >> c: TokenResp
    */

    // TOKEN = 10000;
    public static requestAccountToken(mType: protocol.account.AccountType, mID: string, mToken: string) {
        let pb = new protocol.account.TokenReq();
        pb.type = mType; // protocol.account.AccountType.GUEST;
        pb.id = mID;
        pb.token = mToken;
        pb.deviceInfo = JSON.stringify({os: sys.os});
        this.ws.send(PacketHelper.makePacketData2(EProtocolID.ACCOUNT_TOKEN, protocol.account.TokenReq.encode(pb).finish()));
    }

    /*
    * 登录
    * c >> s: LoginReq
    * s >> c: LoginResp
    */

    // LOGIN = 10001;
    public static requestAccountLoginReq(mAccount: string, mDeviceID: string, mToken: string) {
        let pb = new protocol.account.LoginReq();
        pb.account = mAccount;
        pb.deviceID = mDeviceID;
        pb.token = mDeviceID;
        this.ws.send(PacketHelper.makePacketData2(EProtocolID.ACCOUNT_LOGIN, protocol.account.LoginReq.encode(pb).finish()));
    }

    /*
    * 账号在别处登录
    * s >> c: -
    */
    // LOGGED_IN_ELSEWHERE = 10002;
    // public static requestAccountLoggedInElseWhere(){
    // }
    /*
    * 心跳包
    * c >> s: -
    * s >> c: Heartbeat
    */

    // HEARTBEAT = 10003;
    public static requestHeartBeat() {
        this.ws.send(PacketHelper.makePacketData2(EProtocolID.ACCOUNT_HEARTBEAT));
    }

    /*
    * 登出
    * c >> s: -
    */

    // LOGOUT = 10004;
    public static requestLogout() {
        this.ws.send(PacketHelper.makePacketData2(EProtocolID.ACCOUNT_LOGOUT));
    }

}

