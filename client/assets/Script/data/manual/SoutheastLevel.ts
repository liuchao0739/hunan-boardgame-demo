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

export namespace SoutheastLevel {

    export interface ISoutheastLevel {
        name: string,
        level: number,
        balance: number,
        thinkTime: string,
    };

    const _configs: Record<number, ISoutheastLevel> = {
        [2]: {
            name: '雀影',
            level: 2,
            balance: 100,
            thinkTime: '5+15s',
        },
        [4]: {
            name: '雀技',
            level: 4,
            balance: 200,
            thinkTime: '60s',
        },
        [8]: {
            name: '雀王',
            level: 8,
            balance: 400,
            thinkTime: '60s',
        },
        [12]: {
            name: '雀圣',
            level: 12,
            balance: 600,
            thinkTime: '60s',
        },
        [16]: {
            name: '雀仙',
            level: 16,
            balance: 800,
            thinkTime: '60s',
        },
        [20]: {
            name: '雀神',
            level: 20,
            balance: 1000,
            thinkTime: '60s',
        },
    };

    export function query(id: number): ISoutheastLevel {
        return _configs[id] ?? _configs[0];
    }

}
