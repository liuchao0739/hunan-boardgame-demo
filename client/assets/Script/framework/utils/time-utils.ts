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

export namespace TimeUtils {
    /**一天的秒数 */
    export const ONE_DAY_TIME_S = 3600 * 24;
    /** 预设时区 */
    const _presetedTimezone = -8;
    /** 服务器与本地时差 */
    let _millisecondDiff = 0;

    export function getServerTime(): number {
        return (Date.now() + _millisecondDiff) * 0.001;
    }

    export function updateServerTime(timestamp: number): void {
        _millisecondDiff = timestamp * 1000 - Date.now();
    }

    /** 获取当地24小时的时间戳 */
    export function getServerTimeZero(): number {
        return new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000).getTime();
    }

    /** 获取当前时间戳（西八区） */
    export function getTimeZone(time: number = 0): number {
        let timezoneOffset = new Date().getTimezoneOffset() / 60;
        if (time === 0) {
            time = TimeUtils.getServerTime() * 1000;
        }
        return (time + ((timezoneOffset + _presetedTimezone) * 3600000)) * 0.001;
    }

    /**
     * 格式化日期 YYYY-MM-DD
     *
     * @static
     * @param {Date} date 时间
     * @param {string} [partition="-"] 分隔符
     * @param {boolean} [isShowYear=false] 是否显示年份
     * @return {*}  {string}
     * @memberof TimeUtil
     * @example
     * TimeUtil.formatDate(new Date()); // 2022-02-29
     */
    export function formatDate(time: number, partition: string = "-", isShowYear: boolean = false, bShowTime: boolean = false): string {
        let date = new Date(time * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear();
        let M = date.getMonth() + 1;
        let D = date.getDate();
        let H = date.getHours();
        let Minutes = date.getMinutes();

        let dateStr = ``;
        if (isShowYear) {
            dateStr = Y + partition + M + partition + D;
        } else {
            dateStr = M + partition + D;
        }
        if (bShowTime) {
            dateStr += ` ${checkTime(H)}:${checkTime(Minutes)}`;
        }

        return dateStr;
    }

    /**
     * 'Valid until {month}/{day}/{year}' === 'Valid until 10/7/2022'
     *
     * @static
     * @param {string} st 字符串
     * @param {number} time 分隔符
     * @memberof TimeUtil
     */
    export function formatDateBystring(st: string, time: number): string {
        let date = new Date(time * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let day = st.includes('{day}');
        let month = st.includes('{month}');
        let year = st.includes('{year}');
        let Y = date.getFullYear();
        let M = date.getMonth() + 1;
        let D = date.getDate();
        if (day) {
            st = st.replace(/{day}/g, D.toString());
        }

        if (month) {
            st = st.replace(/{month}/g, M.toString());
        }

        if (year) {
            st = st.replace(/{year}/g, Y.toString());
        }
        return st;
    }

    /**
     * 'Valid until {month}/{day}/{year}' === 'Valid until 10/7/2022'
     * '计算当前与结束时间差'
     * @static
     * @param {string} st 返回格式({month} = 月,{day} = 天,{hour} = 小时,{minute} = 分钟,{second} = 秒)
     * @param {number} endtime 结束时间戳
     * @param {number} startTime 开始时间戳，不传默认为当前时间戳
     * @memberof TimeUtil
     */
    export function distanceDateBystring(st: string, endtime: number, startTime?: number): string {
        let date = new Date(endtime).getTime();
        let date2 = new Date(TimeUtils.getServerTime()).getTime();
        if (startTime) {
            date2 = new Date(startTime).getTime();
        }
        let ts = date - date2;//计算剩余的毫秒数
        let day = st.includes('{day}');//天
        let month = st.includes('{month}');//月
        let hour = st.includes('{hour}');//小时
        let minute = st.includes('{minute}');//分钟
        let second = st.includes('{second}');//秒

        if (minute) {
            let mm = parseInt((ts / 60 % 60).toString(), 10);//计算剩余的分钟数
            let minutes = checkTime(mm);
            st = st.replace(/{minute}/g, minutes.toString());
        }

        if (second) {
            let ss = parseInt((ts % 60).toString(), 10);//计算剩余的秒数
            let seconds = checkTime(ss);
            st = st.replace(/{second}/g, seconds.toString());
        }

        if (hour) {
            let hh = 0;
            if (day) {
                hh = parseInt((ts / 60 / 60 % 24).toString(), 10);//计算剩余的小时数
            } else {
                hh = parseInt((ts / 60 / 60).toString(), 10);//计算剩余的小时数
            }
            let hours = checkTime(hh);
            st = st.replace(/{hour}/g, hours.toString());
        }

        if (day) {
            let dd = parseInt((ts / 60 / 60 / 24).toString(), 10);//计算剩余的天数
            let days = checkTime(dd);
            st = st.replace(/{day}/g, days.toString());
        }

        if (month) {
            let mmm = parseInt((ts / 60 / 60 / 24 / 30).toString(), 10);//计算剩余的月
            let months = checkTime(mmm);
            st = st.replace(/{month}/g, months.toString());
        }

        return st;
    }

    export function checkTime(i: number) {
        let str = `${i}`;
        if (i < 10) {
            if (i < 0) {
                str = '00';
            } else {
                str = "0" + i;
            }
        }
        return str;
    }

    /**
     * 获取当月信息
     * @returns  [当前几号， 总共有多少天， 当月一号是周几, 当前是几月]
     */
    export function getMonthInfo(monthParam?: number): number[] {
        let date = new Date();
        let month = monthParam || date.getMonth() + 1;
        date.setMonth(month);
        let day = date.getDate();//当前几号
        date.setDate(0);//设置到最后一天
        let daysInMonth = date.getDate();
        date.setDate(1);//设置到当月第一天
        let week = date.getDay();
        return [day, daysInMonth, week, month];
    }

    /**
     * 获取当日时间戳
     * @param month 指定月
     * @param day 指定日期
     * @param startOrEnd 是起点 还是终点 比如 11号，起点就是11号0点到终点11号凌晨23:59:59秒
     * @returns
     */
    export function getDayTick(month: number, day: number, startOrEnd: number = 0): number {
        let date = new Date();
        date.setMonth(month - 1);
        date.setDate(day);
        if (startOrEnd == 0) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
        } else {
            date.setHours(23);
            date.setMinutes(59);
            date.setSeconds(59);
        }
        return date.getTime();
    }

    export function getLeftTime(time: number): string {
        let day = Math.floor(time / 3600 / 24);
        let leftTime = time - day * TimeUtils.ONE_DAY_TIME_S;
        if (leftTime > 0) {
            let hour = Math.floor(leftTime / 3600);
            leftTime = leftTime - hour * 3600;
            let minute = Math.floor(leftTime / 60);
            leftTime = leftTime - minute * 60;
            let leftSec = leftTime;
            let tmp = ` ${checkTime(hour)}小时:${checkTime(minute)}分钟:${checkTime(leftSec)}秒`;
            let dayStr = day > 0 ? `${day}天` : ``;
            return `${dayStr}${tmp}`;
        } else {
            return `${day}天`;
        }
    }
}