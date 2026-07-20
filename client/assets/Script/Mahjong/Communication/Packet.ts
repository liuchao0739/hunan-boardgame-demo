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

// 通信数据包
export class Packet {
    public header = new PacketHeader();
    public body: Uint8Array = null;
}

// 包头 (4byte, 即proto的长度+偏移10) + cmd（4byte）+ 序列号（4byte）+ state（1byte）+ crc（1byte）
export class PacketHeader {
    // public len : number ;
    public cmd: number = 0;
    public sn: number = 0;
    public state: number = 0;
    public crc: number = 0;
}


export class PacketHelper {

    public static makePacketData(packet: Packet): ArrayBuffer {
        var header = packet.header;
        var body = packet.body;

        var bodyLen = packet.body != null ? packet.body.byteLength : 0;

        var headLen = 14;
        var lenTotal = headLen + bodyLen;
        const dv = new DataView(new ArrayBuffer(lenTotal));
        /** protobuf length + offset */
        dv.setUint32(0, 10 + bodyLen);
        /** protocol ID */
        dv.setUint32(4, header.cmd);
        /** serial number */
        dv.setUint32(8, header.sn);
        /** status */
        dv.setUint8(12, header.state);
        /** check code */
        dv.setUint8(13, header.crc);

        for (let i = 0; i < bodyLen; ++i) {
            dv.setUint8(headLen + i, body[i]);
        }

        return dv.buffer;
    }


    public static makePacketData2(cmd: number, body?: Uint8Array): ArrayBuffer {
        let packet = new Packet();
        packet.header.cmd = cmd;
        packet.body = body;
        return this.makePacketData(packet);
    }

    public static parsePacketData(data: ArrayBuffer): Packet {
        if (data.byteLength < 14) {
            console.log("包体长度错误");
            return;
        }

        var packet = new Packet();

        var header = packet.header;
        var dv = new DataView(data);
        header.cmd = dv.getUint32(4);
        header.sn = dv.getUint32(8);
        header.state = dv.getUint8(12);
        header.crc = dv.getUint8(13);

        packet.body = new Uint8Array(data.slice(14, data.byteLength));

        return packet;
    }

}