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

import {_decorator, Component, director} from "cc";

const {ccclass, property} = _decorator;

@ccclass("EventWaiter")
export class EventWaiter extends Component {
    private eventKeyArr = {};
    public static mgr;

    constructor() {
        super();
        if (!EventWaiter.mgr) EventWaiter.mgr = [];
        EventWaiter.mgr.push(this);
    }

    public static clearAll(): void {
        if (!EventWaiter.mgr) return;
        EventWaiter.mgr.forEach(element => {
            element.clearEvent();
        });
        EventWaiter.mgr = null;
    }

    /**
     * 添加全局的事件监听，界面关闭后，监听自动移除
     * @param type
     * @param callback
     * @param thisArg
     * @param once
     * @returns
     */
    public onEvent(type: string, callback: any, thisArg?: any, once?: boolean): void {
        let eventList = this.eventKeyArr[type] || [];
        for (let i = 0, len = eventList.length; i < len; i++) {
            let [func, obj] = eventList[i];
            if (func === callback && obj === thisArg) {
                return;
            }
        }

        eventList.push([callback, thisArg]);
        this.eventKeyArr[type] = eventList;
        //todo director 是全局消息分发的，后面有空要缩小发报范围
        director.on(type, callback, thisArg, once);
    }

    public clearEvent(): void {
        if (this.eventKeyArr) {
            //移除监听
            for (let key in this.eventKeyArr) {
                let eventList = this.eventKeyArr[key];
                for (let len = eventList.length, i = len - 1; i >= 0; i--) {
                    let [func, obj] = eventList[i];
                    director.off(key, func, obj);
                    eventList.splice(i, 1);
                }
            }
            this.eventKeyArr = [];
        }
    }

    /**
     *  发出消息
     * @param eventStr
     * @param params
     */
    public send(eventStr: string, params): void {
        //todo director 是全局消息分发的，后面有空要缩小发报范围
        director.emit(eventStr, params);
    }
}