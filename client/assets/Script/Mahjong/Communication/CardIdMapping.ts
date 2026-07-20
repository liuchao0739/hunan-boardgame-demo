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

// 牌ID映射

import {ChiType} from "../World/Ctrl/Operation/OpChi";
import {SeatOrien} from "../World/Support/SeatOrien";
import {OpCode} from "./OpCode";

/*

麻将值对应表
--------------------------------------------------------------------
0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,				//万 红五万是0x00
0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19,				//筒 红五筒是0x10
0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29,				//条 红五条是0x20

0x31, 0x32, 0x33, 0x34,												//风,东南西北

0x41, 0x42, 0x43,													//字,中发白

0x51, 0x52, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58,						//春夏秋冬梅兰菊竹

*/

// 服务器 客户端 映射
export class ScMapping {
    // 方位映射 
    public static orien_s2c(n: number): SeatOrien {
        // 0:东，1:西，2:南，3:北
        // 修正：东南西北
        let seatOrien: SeatOrien;
        if (n == 0) {
            seatOrien = SeatOrien.East;
        } else if (n == 1) {
            seatOrien = SeatOrien.South;
        } else if (n == 2) {
            seatOrien = SeatOrien.West;
        } else if (n == 3) {
            seatOrien = SeatOrien.North;
        }
        return seatOrien;
    }

    public static cardId_s2c(n: number): string {
        this.initS2C();
        if (this.dataS2C.has(n) == false) {
            console.log("S->C 映射出错：牌值：" + n);
            // 无效牌桌映射麻将的背景图
            return "back";
        }
        return this.dataS2C.get(n);
    }

    public static cardId_c2s(id: string): number {
        this.initS2C();
        return this.dataC2S.get(id);
    }

    public static chiType_c2s(type: ChiType): OpCode {
        if (type == ChiType.Left) {
            return OpCode.OPE_LEFT_CHI;
        } else if (type == ChiType.Middle) {
            return OpCode.OPE_MIDDLE_CHI;
        } else if (type == ChiType.Right) {
            return OpCode.OPE_RIGHT_CHI;
        }
    }

    private static initS2C(): void {
        if (this.dataS2C != null) return;
        this.dataS2C = new Map<number, string>();
        let mapping = this.dataS2C;

        for (let i = 0; i < 9; ++i) {
            mapping.set(0x01 + i, "wan" + (i + 1));
            mapping.set(0x11 + i, "tong" + (i + 1));
            mapping.set(0x21 + i, "tiao" + (i + 1));
        } // end for
        mapping.set(0x00, "wan5_chibao");
        mapping.set(0x10, "tong5_chibao");
        mapping.set(0x20, "tiao5_chibao");

        mapping.set(0x31, "ziDong");
        mapping.set(0x32, "ziNan");
        mapping.set(0x33, "ziXi");
        mapping.set(0x34, "ziBei");
        mapping.set(0x41, "ziZhong");
        mapping.set(0x42, "ziFa");
        mapping.set(0x43, "ziBai");
        mapping.set(0x44, "kong")

        // 反向映射
        this.dataC2S = new Map<string, number>();
        mapping.forEach((v, k) => {
            this.dataC2S.set(v, k);
        });
    }

    public static dataS2C: Map<number, string> = null;
    public static dataC2S: Map<string, number> = null;
}
