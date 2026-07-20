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

import {sys} from "cc";
import {LoginEnity} from "../../Home/Entity/Login";
import {device} from "../../native/device";
import {EProtocolID} from "../../framework/network/protocol-configs";
import protocol from "../../protocols/protocol.js";
import {ChiType} from "../World/Ctrl/Operation/OpChi";
import {PlayerMgr} from "../World/Entity/Player/Player";
import {ScMapping} from "./CardIdMapping";
import {OpCode} from "./OpCode";
import {Packet, PacketHelper} from "./Packet";

// 通信数据发送
export class CommSend {


    public static ws: WebSocket;

    // 登录
    public static login(accountName: string, token: string, id?: string) {

        console.log("平台:", sys.platform);
        device.fetchDeviceID(deviceID => {
            if (deviceID == undefined || deviceID == null) {
                return;
            }

            // if( id != undefined && id != null ) {
            //     deviceID = id ;
            // }

            // 发送请求
            let packet = new Packet();
            packet.header.cmd = 10001;

            let obj = new protocol.account.LoginReq();
            obj.account = accountName;
            obj.token = token;
            obj.deviceID = deviceID;
            obj.userID = LoginEnity.playerID;// TODO:临时添加

            packet.body = protocol.account.LoginReq.encode(obj).finish();

            let data = PacketHelper.makePacketData(packet);
            this.ws.send(data);

            // SocketCtrl.ins.send(10001, obj, new CallBack((param) => {
            //     console.log("测试:", param);
            // }, this));

            console.log("发送请求 登录");
            console.log("发送：cmd：10001 登录:", LoginEnity.playerID);
        });

    }

    public static requestHeartbeat(): void {
        let packet = new Packet();
        packet.header.cmd = 10003;

        let data = PacketHelper.makePacketData(packet);
        this.ws.send(data);

        console.log("发送：cmd：" + packet.header.cmd + " 请求心跳包");
    }

    ////////////////// MODULE ROLE //////////////////
    /* 玩家简单信息请求
    * c >> s: RoleSimpleInfoReq
    * s >> c: RoleSimpleInfoResp
    */
    //     GET_SIMPLE_INFO = 11000;
    // 玩家简单信息请求
    public static requestRoleInfoSimple(mUserID: number) {
        let pb = new protocol.roleInfo.RoleSimpleInfoReq();
        pb.userID = mUserID;
        let data = PacketHelper.makePacketData2(EProtocolID.ROLE_USER_INFO, protocol.roleInfo.RoleSimpleInfoReq.encode(pb).finish());
        this.ws.send(data);
    }

    // 请求房间
    public static getRoom() {

        let packet = new Packet();
        packet.header.cmd = 0x2219;
        let data = PacketHelper.makePacketData(packet);
        this.ws.send(data);

        console.log("发送：cmd：" + packet.header.cmd + " 请求房间");
    }

    // 请求房间
    public static getRoomX(roomLevel: number) {
        let pb = new protocol.mahjong_jp.GameIDReq();
        pb.roomLevel = roomLevel;
        let data = PacketHelper.makePacketData2(EProtocolID.MJ_JP_GET_ROOM, protocol.mahjong_jp.GameIDReq.encode(pb).finish());
        // let packet = new Packet(); packet.header.cmd = 0x2219;
        // let data = PacketHelper.makePacketData(packet);
        this.ws.send(data);
        console.log("发送：cmd：" + EProtocolID.MJ_JP_GET_ROOM + " 请求房间");
    }

    // 进入房间
    public static enterRoom(id: number) {
        let pb = new protocol.mahjong_jp.GameID();
        pb.id = id;
        let data = PacketHelper.makePacketData2(EProtocolID.MJ_JP_ENTER_ROOM, protocol.mahjong_jp.GameID.encode(pb).finish());
        this.ws.send(data);

        console.log("发送：cmd：0x2220[8736] 进入房间");

    }

    public static enterRoomUUID(uuid: string, clubid: number) {
        let pb = new protocol.mahjong_jp.GameUUID();
        pb.uuid = uuid;
        pb.clubid = clubid;
        let data = PacketHelper.makePacketData2(EProtocolID.MJ_JP_ENTER_ENTER_CLUB_ROOM, protocol.mahjong_jp.GameUUID.encode(pb).finish());
        this.ws.send(data);

        console.log("发送：cmd：0x2343[9027] 进入房间:", uuid, "clubid:", clubid);
    }

    // 重连请求
    public static reconectRoom(): void {
        let packet = new Packet();
        packet.header.cmd = 0x2213;
        let data = PacketHelper.makePacketData(packet);
        this.ws.send(data);

        console.log("发送：cmd：" + packet.header.cmd + " 重连请求");
    }

    // 玩家准备
    public static ready() {
        let data = PacketHelper.makePacketData2(0x2203);
        this.ws.send(data);
        console.log("发送：cmd：0x2203[8707] 玩家准备");
    }

    // 出牌
    public static discard(cardId: string, isLiZhi: boolean, isMoQie: boolean) {
        console.log("出牌 cardid：", cardId, "立直：", isLiZhi, "模切：", isMoQie);
        let pb = new protocol.mahjong_jp.UserOutCard();
        pb.card = ScMapping.cardId_c2s(cardId);
        pb.isTing = isLiZhi == true ? 1 : 0;
        pb.isMoQie = isMoQie;
        let data = PacketHelper.makePacketData2(0x2204, protocol.mahjong_jp.UserOutCard.encode(pb).finish());
        this.ws.send(data);

        console.log(
            "发送：cmd：0x2204 [8708]出牌：玩家ID:" +
            PlayerMgr.ins.local.info.id +
            " 牌ID：" + cardId +
            " 服务器牌值：" + pb.card +
            " 立直：" + isLiZhi + " " +
            "是否摸切：" + isMoQie
        );

    }

    // 托管
    public static trustee(val: boolean) {

        let pb = new protocol.mahjong_jp.UserTuoGuan();
        pb.type = val ? 1 : 0;
        this.ws.send(PacketHelper.makePacketData2(0x2206, protocol.mahjong_jp.UserTuoGuan.encode(pb).finish()));
        console.log("发送：cmd：0x2206[8710] 托管:", val, "type:", pb.type);
    }

    // 过
    public static pass() {

        let pb = new protocol.mahjong_jp.UserOperatorRequest();
        pb.opValue = 0;
        this.ws.send(PacketHelper.makePacketData2(0x2205, protocol.mahjong_jp.UserOperatorRequest.encode(pb).finish()));
        console.log("发送：cmd：0x2205[8709] 过");
    }

    // 吃
    // public static chi(type: ChiType, cardId: string, isChiBao: boolean) {
    public static chi(type: ChiType, cardId: string, mChiBaoNum: number) {

        let pb = new protocol.mahjong_jp.UserOperatorRequest();
        pb.opValue = ScMapping.chiType_c2s(type);
        pb.opCard = ScMapping.cardId_c2s(cardId);
        pb.redFiveCount = mChiBaoNum;// ? 1 : 0;

        this.ws.send(PacketHelper.makePacketData2(0x2205, protocol.mahjong_jp.UserOperatorRequest.encode(pb).finish()));

        console.log("发送：cmd：0x2205[8709] 吃 chinum:", mChiBaoNum);

    }

    // 碰
    // public static peng(cardId: string, isChiBao: boolean) {
    public static peng(cardId: string, mChiBaoNum: number) {
        let pb = new protocol.mahjong_jp.UserOperatorRequest();
        pb.opValue = OpCode.OPE_PENG;
        pb.opCard = ScMapping.cardId_c2s(cardId);
        pb.redFiveCount = mChiBaoNum;// ? 1 : 0;
        this.ws.send(PacketHelper.makePacketData2(0x2205, protocol.mahjong_jp.UserOperatorRequest.encode(pb).finish()));

        console.log("发送：cmd：0x2205[8709] 碰");

    }

    // 明杠
    public static gangMing(cardId: string, mChiBaoNum: number) {

        let pb = new protocol.mahjong_jp.UserOperatorRequest();
        pb.opValue = OpCode.OPE_GANG;
        pb.opCard = ScMapping.cardId_c2s(cardId);
        pb.redFiveCount = mChiBaoNum;
        this.ws.send(PacketHelper.makePacketData2(0x2205, protocol.mahjong_jp.UserOperatorRequest.encode(pb).finish()));

        console.log("发送：cmd：0x2205[8709] 明杠");

    }

    // 暗杠
    static GangAn(cardId: string, mChiBaoNum: number) {

        let pb = new protocol.mahjong_jp.UserOperatorRequest();
        pb.opValue = OpCode.OPE_AN_GANG;
        pb.opCard = ScMapping.cardId_c2s(cardId);
        pb.redFiveCount = mChiBaoNum;
        this.ws.send(PacketHelper.makePacketData2(0x2205, protocol.mahjong_jp.UserOperatorRequest.encode(pb).finish()));

        console.log("发送：cmd：0x2205[8709] 暗杠");

    }

    // 补杠
    static gangBu(cardId: string, mChiBaoNum: number) {

        let pb = new protocol.mahjong_jp.UserOperatorRequest();
        pb.opValue = OpCode.OPE_BU_GANG;
        pb.opCard = ScMapping.cardId_c2s(cardId);
        pb.redFiveCount = mChiBaoNum;
        this.ws.send(PacketHelper.makePacketData2(0x2205, protocol.mahjong_jp.UserOperatorRequest.encode(pb).finish()));

        console.log("发送：cmd：0x2205[8709] 补杠");

    }

    // 杠胡
    static gangHu(cardId: string) {

        let pb = new protocol.mahjong_jp.UserOperatorRequest();
        pb.opValue = OpCode.OPE_GANG_HU;
        pb.opCard = ScMapping.cardId_c2s(cardId);
        this.ws.send(PacketHelper.makePacketData2(0x2205, protocol.mahjong_jp.UserOperatorRequest.encode(pb).finish()));

        console.log("发送：cmd：0x2205[8709] 杠胡");

    }

    // 自摸
    public static zimo(cardId: string) {

        let pb = new protocol.mahjong_jp.UserOperatorRequest();
        pb.opValue = OpCode.OPE_ZI_MO;
        pb.opCard = ScMapping.cardId_c2s(cardId);
        this.ws.send(PacketHelper.makePacketData2(0x2205, protocol.mahjong_jp.UserOperatorRequest.encode(pb).finish()));

        console.log("发送：cmd：0x2205[8709] 自摸");
    }

    // 胡
    public static hu(cardId: string) {
        let pb = new protocol.mahjong_jp.UserOperatorRequest();
        pb.opValue = OpCode.OPE_HU;
        pb.opCard = ScMapping.cardId_c2s(cardId);
        this.ws.send(PacketHelper.makePacketData2(0x2205, protocol.mahjong_jp.UserOperatorRequest.encode(pb).finish()));

        console.log("发送：cmd：0x2205[8709] 胡");

    }

    // 流局
    public static LiuJu() {
        let pb = new protocol.mahjong_jp.UserOperatorRequest();
        pb.opValue = OpCode.OPE_LIUJU;
        this.ws.send(PacketHelper.makePacketData2(0x2205, protocol.mahjong_jp.UserOperatorRequest.encode(pb).finish()));

        console.log("发送：cmd：0x2205[8709] 流局");

    }

    // 胡
    public static exitRoom() {
        let data = PacketHelper.makePacketData2(0x2201);
        this.ws.send(data);
        console.log("发送：cmd：0x2201[8705] 玩家退出");
    }

    // 测试--已不需要，通过配牌后台即可
    public static sendTestData(mUUID: string, mClubID: number) {

        let pb = new protocol.mahjong_jp.GameUUIDTestData();
        pb.uuid = mUUID;
        pb.clubid = mClubID;
        pb.isSet = true;
        this.ws.send(PacketHelper.makePacketData2(0x2212, protocol.mahjong_jp.GameUUIDTestData.encode(pb).finish()));
        console.log("发送：cmd：0x2212[8722] 测试数据: uuID", mUUID, "clubid:", mClubID);
    }
}
