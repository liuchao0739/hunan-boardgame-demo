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

/**
 * 数组工具
 *
 * @export
 * @class ArrayUtil
 */
export namespace ArrayUtils {
    /**
     * 创建一个指定长度的一维数组，并指定默认值
     *
     * @static
     * @param {number} length 长度
     * @param {*} element 元素默认值
     * @return {*}  {any[]} 创建的数组
     * @memberof ArrayUtil
     * @example
     * ArrayUtil.createArray(6, ""); // ['', '', '', '', '', '']
     */
    export function createArray(length: number, element: any): any[] {
        return Array(length).fill(element);
    }

    /**
     * 创建一个指定长度的二维数组，并指定默认值
     *
     * @static
     * @param {number} row 行数
     * @param {number} column 列数
     * @param {*} element 元素默认值
     * @return {*}  {any[][]} 创建的数组
     * @memberof ArrayUtil
     * @example
     * ArrayUtil.create2DArray(3, 5, 0);
     * [[0, 0, 0, 0, 0],
     *  [0, 0, 0, 0, 0],
     *  [0, 0, 0, 0, 0]]
     */
    export function create2DArray(row: number, column: number, element: any): any[][] {
        return Array(row).fill(element).map(() => Array(column).fill(element));
    }

    /**
     * 克隆一个数组
     *
     * @static
     * @param {any[]} array 目标数组
     * @return {*}  {any[]} 新数组
     * @memberof ArrayUtil
     */
    export function cloneArray(array: any[]): any[] | null {
        if (!array) return null;
        return array.slice(0, array.length);
    }

    /**
     * 克隆一个数组
     *
     * @static
     * @param {any[][]} array 目标数组
     * @return {*}  {any[][]} 新数组
     * @memberof ArrayUtil
     */
    export function clone2DArray(array: any[][]): any[][] {
        let newArray: any[][] = [];
        for (let i = 0; i < array.length; i++) {
            newArray.push(array[i].concat());
        }
        return newArray;
    }

    /**
     * 数组求和
     *
     * @static
     * @param {number[]} array 目标数组
     * @return {*}  {number} 数组和
     * @memberof ArrayUtil
     * @example
     * ArrayUtil.sum([5,4,7,8,9,2]); // 35
     */
    export function sum(array: number[]): number {
        return array.reduce((a, b) => a + b);
    }

    /**
     * 求数组最大值
     *
     * @static
     * @param {number[]} array 目标数组
     * @return {*}  {number} 数组最大值
     * @memberof ArrayUtil
     * @example
     * ArrayUtil.max([5,4,7,8,9,2]); // 9
     */
    export function max(array: number[]): number {
        return Math.max(...array);
    }

    /**
     * 求数组最小值
     *
     * @static
     * @param {number[]} array 目标数组
     * @return {*}  {number} 数组最小值
     * @memberof ArrayUtil
     * @example
     * ArrayUtil.max([5,4,7,8,9,2]); // 2
     */
    export function min(array: number[]): number {
        return Math.min(...array);
    }

    /**
     * 过滤过滤错误值（false、0、null、undefined...）（不改变原数组，返回新数组）
     *
     * @static
     * @param {any[]} array 目标数组
     * @return {*}  {any[]} 过滤后的数组
     * @memberof ArrayUtil
     */
    export function filterFlase(array: any[]): any[] {
        return array.filter(Boolean);
    }

    /**
     * Fisher-Yates Shuffle 随机置乱算法(改变原数组)
     *
     * @static
     * @param {any[]} array 目标数组
     * @return {*}  {any[]} 置乱后的数组
     * @memberof ArrayUtil
     */
    export function fisherYatesShuffle(array: any[]): any[] {
        let count = array.length;
        while (count) {
            let index = Math.floor(Math.random() * count--);
            let temp = array[count];
            array[count] = array[index];
            array[index] = temp;
        }
        return array;
    }

    /**
     * 混淆数组（不改变原数组，返回新数组）
     *
     * @static
     * @param {any[]} array 目标数组
     * @return {*}  {any[]} 混淆后的数组
     * @memberof ArrayUtil
     */
    export function confound(array: any[]): any[] {
        let result = array.slice().sort(() => Math.random() - .5);
        return result;
    }

    /**
     * 数组扁平化
     *
     * @static
     * @param {any[]} array 目标数组（改变原数组）
     * @return {*} 压扁后的数组
     * @memberof ArrayUtil
     */
    export function flattening(array: any[]): any[] {
        for (; array.some(v => Array.isArray(v));) {    // 判断 array 中是否有数组
            array = [].concat.apply([], array); // 压扁数组
        }
        return array;
    }

    /**
     * 数组去重（不改变原数组，返回新数组）
     *
     * @static
     * @param {any[]} array 目标数组
     * @return {*} 去重后的数组
     * @memberof ArrayUtil
     */
    export function unique(array: any[]): any[] {
        let n = [];
        for (let i = 0; i < array.length; i++) {
            if (n.indexOf(array[i]) == -1) n.push(array[i]);
        }
        return n;
    }

    /**
     * 合并数组
     *
     * @static
     * @param {any[]} array1 目标数组1
     * @param {any[]} array2 目标数组2
     * @return {*}  {any[]} 合并后的新数组
     * @memberof ArrayUtil
     */
    export function combineArrays(array1: any[], array2: any[]): any[] {
        let newArray = [...array1, ...array2];
        return newArray;
    }

    /**
     * 获取随机数组成员
     *
     * @static
     * @param {any[]} array 目标数组
     * @return {*}  {*} 随机成员
     * @memberof ArrayUtil
     */
    export function getRandomValueInArray(array: any[]): any {
        let newArray = array[Math.floor(Math.random() * array.length)];
        return newArray;
    }

    //#region 排序

    /**
     * 快速排序（不改变原数组）
     *
     * @static
     * @param {number[]} array 目标数组
     * @return {*}  {number[]} 排序后的数组
     * @memberof ArrayUtil
     * @example
     * let array1 = [1, 6, 1, 5, 3, 2, 1, 4];
     * let array2 = ArrayUtil.quickSort(array1);
     * console.log(array1); // [1, 6, 1, 5, 3, 2, 1, 4]
     * console.log(array2); // [1, 1, 1, 2, 3, 4, 5, 6]
     */
    export function quickSort(array: number[]): number[] {
        if (array.length < 2) return array;
        const pivot = Math.floor(Math.random() * array.length)
        let minArr = [];
        let maxArr = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i] >= array[pivot] && i !== pivot) {
                maxArr.push(array[i]);
            }
            if (array[i] < array[pivot] && i !== pivot) {
                minArr.push(array[i])
            }
        }
        return [...ArrayUtils.quickSort(minArr), array[pivot], ...ArrayUtils.quickSort(maxArr)];
    }

    /**
     * 根据类型排序
     *
     * @static
     * @param {type} string 类型
     * @memberof ArrayUtils
     * array.sort(ArrayUtils.typeSort('status'))
     * console.log(array1); // [{name:xxx,id:1}, {name:xxx,id:3},{{name:xxx,id:2}}]
     * console.log(array2); // [1,3,2]//根据id排序
     */
    export function typeSort(array: any[], type: string) {
        return array.sort((a, b) => {
            const orederA = a[type];
            const orederB = b[type];
            return orederA - orederB;

        })
    }

    /**
     * 执行冒泡排序
     *
     * @static
     * @param {number[]} array 目标数组
     * @memberof ArrayUtil
     */
    export function bubbleSort(array: any[]): void {
        let isExchange: Boolean = false;
        for (let i: number = 0; i < array.length; i++) {
            isExchange = false;
            for (let j: number = array.length - 1; j > i; j--) {
                if (array[j] < array[j - 1]) {
                    let temp: number = array[j];
                    array[j] = array[j - 1];
                    array[j - 1] = temp;
                    isExchange = true;
                }
            }
            if (!isExchange)
                break;
        }
    }

    /**
     * 执行插入排序
     *
     * @static
     * @param {number[]} array 目标数组
     * @memberof ArrayUtil
     */
    export function insertionSort(array: number[]): void {
        let len: number = array.length;
        for (let i: number = 1; i < len; i++) {
            let val: number = array[i];
            for (var j: number = i; j > 0 && array[j - 1] > val; j--) {
                array[j] = array[j - 1];
            }
            array[j] = val;
        }
    }

    //#endregion

    /**
     * 执行二分搜索
     *
     * @static
     * @param {number[]} ary 搜索的数组（必须排序过）
     * @param {number} value 需要搜索的值
     * @return {*}  {number} 返回匹配结果的数组索引
     * @memberof ArrayUtil
     */
    export function binarySearch(ary: number[], value: number): number {
        let startIndex: number = 0;
        let endIndex: number = ary.length;
        let sub: number = (startIndex + endIndex) >> 1;
        while (startIndex < endIndex) {
            if (value <= ary[sub]) endIndex = sub;
            else if (value >= ary[sub]) startIndex = sub + 1;
            sub = (startIndex + endIndex) >> 1;
        }
        if (ary[startIndex] == value) return startIndex;
        return -1;
    }

    /**
     * 查找项
     * @param key
     * @param value
     * @returns
     */
    export function getIndexByKey<T>(arr: T[], key: string, value: any): number {
        for (let i = 0, len = arr.length; i < len; i++) {
            let vo = arr[i];
            if (vo[key] == value) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 排序
     * @param arr
     * @param key
     * @param sort
     * @returns
     */
    export function sortArr<T>(arr: T[], key: string, sortType: number = 1): T[] {
        return arr.sort(function (a, b) {
            let c = a[key];
            let d = b[key];
            switch (sortType) {
                case 1:
                    if (c < d) return -1;
                    if (c > b) return 1;
                    break;
                case 2:
                    if (c < d) return 1;
                    if (c > b) return -1;
                    break;
            }

            return 0;
        })
    }
}
