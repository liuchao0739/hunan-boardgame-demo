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

import {log} from "cc";
import {PacketHelper} from "../../Mahjong/Communication/Packet";
import {Singleton} from "../mgr/Singleton";
import {WebSocketMgr} from "../mgr/WebSocketMgr";
import {EProtocolID, queryProtocolConfig} from "../network/protocol-configs";
import {CallBack} from "../utils/CallBack";

export class SocketCtrl extends Singleton {
    public respCbList: any;

    public send(protocolID: EProtocolID, params: any, respCB?: CallBack): void {
        //判断连接状态
        if (!WebSocketMgr.Inst.isConnect()) {
            console.error(`网络连接已断开....无法发送:`, protocolID);
            return;
        }

        let config = queryProtocolConfig(protocolID);
        let encoder = config.encoder;
        let body = encoder ? encoder.encode(params).finish() : null;
        let arrayBuffer = PacketHelper.makePacketData2(protocolID, body);
        if (respCB) {
            this.respCbList = this.respCbList || {};
            this.respCbList[protocolID] = {decoder: config.decoder, cb: respCB};
        }

        console.log(`请求协议${protocolID}`, params);
        WebSocketMgr.Inst.webSock.send(arrayBuffer);
    }

    public C2SResp(protocolID: EProtocolID, arrayBuffer: ArrayBuffer): void {
        if (!this.respCbList || !this.respCbList[protocolID]) return;
        let {decoder, cb} = this.respCbList[protocolID];
        let params = decoder.decode(arrayBuffer);
        cb.exe(params);
        delete this.respCbList[protocolID];
    }
}
