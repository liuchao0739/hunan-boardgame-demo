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

// 赤宝
export class ChiBaoHelper {

    // 取得赤宝牌ID。如果牌没有赤宝版本，返回 null
    public static getChiBaoId(cardId: string): string {

        if (cardId == "wan5") {
            return "wan5_chibao";
        } else if (cardId == "tiao5") {
            return "tiao5_chibao";
        } else if (cardId == "tong5") {
            return "tong5_chibao";
        }

        return null;

    }

    // 取得赤宝版本。如果没有赤宝版本，返回 null。
    public static getChiBaoCardIds(cardIds: Array<string>): Array<string> {

        let b = false;
        let ret = new Array<string>();
        for (let id of cardIds) {
            let id2 = this.getChiBaoId(id);
            if (id2 != null) {
                ret.push(id2);
                b = true;
            } else {
                ret.push(id);
            }

        }

        if (b == true) {
            return ret;
        }

        return null;

    }

}