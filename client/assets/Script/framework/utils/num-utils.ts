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

export namespace NumberUtils {
    /**
     * 返回[n,m]随机整数, 要求n <= m
     *
     * @param min 最小数
     * @param max 最大数
     */
    export function int(min: number, max: number): number | null {
        if (min > max) {
            console.warn("randomInt输入不合法");
            return null;
        }
        let random = Math.floor(Math.random() * (max - min + 1) + min);
        return random;
    }

    /**
     * 返回[n,m)随机数, 要求n < m
     *
     * @param min 最小数
     * @param max 最大数
     */
    export function float(min: number, max: number): number | null {
        if (min > max) {
            console.warn("randomFloat输入不合法");
            return null;
        }
        let random = Math.random() * (max - min) + min;
        return random;
    }

    /**
     * 金额转换 100000 === 100,000
     * @param num 金额
     * @returns
     */
    export function thousand(num: number | string) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /**
     * 金额转换 100000 === 10M
     * @param size 金额
     * @returns
     */
    export function numFormat(size: number) {
        if (!size)
            return "";
        var num = 1000; //byte
        if (size < num)
            return size + "B";
        if (size < Math.pow(num, 2))
            return (size / num) + "K"; //kb
        if (size < Math.pow(num, 3))
            return (size / Math.pow(num, 2)) + "M"; //M
        if (size < Math.pow(num, 4))
            return (size / Math.pow(num, 3)) + "B"; //G
        return (size / Math.pow(num, 4)) + "T"; //T
    }
}