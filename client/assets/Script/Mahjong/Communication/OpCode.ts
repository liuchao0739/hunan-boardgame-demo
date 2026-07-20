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

// 服务器定义
export enum OpCode {
    OPE_RIGHT_CHI = 0x001,      // 右吃
    OPE_MIDDLE_CHI = 0x002,     // 中吃
    OPE_LEFT_CHI = 0x004,       // 左吃
    OPE_PENG = 0x008,           // 碰
    OPE_GANG = 0x010,           // 碰杠
    OPE_HUA_GANG = 0x020,       // 花杠
    OPE_HU = 0x040,             // 胡
    OPE_GANG_HU = 0x080,        // 抢杠胡
    OPE_HUA_HU = 0x100,         // 八花胡
    OPE_AN_GANG = 0x200,        // 暗杠
    OPE_BU_GANG = 0x400,        // 补杠
    OPE_ZI_MO = 0x800,          // 自摸
    OPE_TING = 0x1000,          // 听牌
    OPE_LIUJU = 0x2000,         // 流局
};