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

import protocol from "../../protocols/protocol.js";
import {IPlainHTTPConfig, TPlainHTTPName} from "../network/plain-http-configs";
import {EProtocolID, IProtocolData} from "../network/protocol-configs";
import {EventArguments, EventName, IEventConfig} from "./event";

/* 事件监听器优先级 */
export enum EEventListenerPriority {
    MANAGER = -999,
    RECEIVER = -200,
    HIGHER = -10,
    HIGH = -9,
    DEFAULT = 0,
    LOW = 9,
    LOWER = 10
};

/* 事件监听器 */
interface IGenericEventListener {
    (...args: any[]): any,
};

/* 事件监听器信息 */
interface IEventListenerData {
    /* 监听器 */
    listener: IGenericEventListener,
    /* 优先级 */
    priority: EEventListenerPriority,
    /* this 对象 */
    thisArg?: any,
};

/**
 * 事件监听管理器类
 */
class EventListenerManager {

    /* 事件监听器集合映射表（事件名为 key） */
    protected _map: Map<string, IEventListenerData[]> = new Map();

    /**
     * 发送事件
     * @param eventName 事件名
     * @param args 事件参数
     */
    emit(eventName: string, ...args: any[]): void {
        let targetDatas: IEventListenerData[] = [];

        let datasOfSingleEvent = this._map.get(eventName);
        if (datasOfSingleEvent) {
            targetDatas.push(...datasOfSingleEvent);
        }

        for (const data of targetDatas) {
            data.listener.call(data.thisArg, ...args);
        }
    }

    /**
     * 添加监听器
     * @param eventName 事件名
     * @param listener 监听器
     * @param thisArg this 对象
     * @param priority 优先级
     */
    add(eventName: string, listener: IGenericEventListener, thisArg?: any, priority: EEventListenerPriority = EEventListenerPriority.DEFAULT): void {
        let datasOfSingleEvent = this._map.get(eventName);

        if (!datasOfSingleEvent) {
            datasOfSingleEvent = [];
            this._map.set(eventName, datasOfSingleEvent);
        }

        const hasThisArg = (thisArg !== null && thisArg !== undefined);

        let targetData: IEventListenerData | undefined = undefined;
        let searchIndex = 0;

        for (let index = 0; index < datasOfSingleEvent.length; ++index) {
            const data = datasOfSingleEvent[index];

            if (data.listener !== listener) {
                continue;
            }

            if (data.thisArg === thisArg || (!hasThisArg && (data.thisArg === null || data.thisArg === undefined))) {
                if (data.priority !== priority) {
                    targetData = data;
                    datasOfSingleEvent.splice(index, 1);
                    if (priority > data.priority) {
                        searchIndex = index;
                    }
                    break;
                } else {
                    return;
                }
            }
        }

        if (!targetData) {
            targetData = {
                listener: listener,
                priority: priority,
                thisArg: thisArg,
            };
        }

        for (let index = searchIndex; index < datasOfSingleEvent.length; ++index) {
            const data = datasOfSingleEvent[index];
            if (priority < data.priority) {
                datasOfSingleEvent.splice(index, 0, targetData);
                return;
            }
        }
        datasOfSingleEvent.push(targetData);
    }

    /**
     * 移除监听器
     * @param eventName 事件名
     * @param listener 监听器
     * @param thisArg this 对象
     */
    remove(eventName: string, listener: IGenericEventListener, thisArg?: any): void {
        const datasOfSingleEvent = this._map.get(eventName);

        if (!datasOfSingleEvent) {
            return;
        }

        const hasThisArg = (thisArg !== null && thisArg !== undefined);

        for (let index = 0; index < datasOfSingleEvent.length; ++index) {
            const data = datasOfSingleEvent[index];

            if (data.listener !== listener) {
                continue;
            }

            if (data.thisArg === thisArg || (!hasThisArg && (data.thisArg === null || data.thisArg === undefined))) {
                datasOfSingleEvent.splice(index, 1);
                break;
            }
        }
    }

    /**
     * 移除所有监听器
     */
    removeAllListeners(): void {
        this._map.clear();
    }

    /**
     * 移除指定对象的所有监听器
     * @param thisArg this 对象
     */
    removeAllListenerOfTarget(thisArg: any): void {
        if (thisArg !== null && thisArg !== undefined) {
            for (const [_, datasOfSingleEvent] of this._map) {
                for (let index = datasOfSingleEvent.length - 1; index >= 0; --index) {
                    const data = datasOfSingleEvent[index];
                    if (data.thisArg === thisArg) {
                        datasOfSingleEvent.splice(index, 1);
                    }
                }
            }
        }
    }

    /**
     * 移除指定事件名的所有监听器
     * @param eventName 事件名
     */
    removeAllListenerOfEventName(eventName: string): void {
        this._map.delete(eventName);
    }

}

/**
 * 事件管理器
 */
export namespace EventManager {

    /* 事件监听器 */
    interface IEventListener<T extends EventName> {
        (name: T, args: IEventConfig[T]): any,
    };

    /* 事件监听器的管理器 */
    const _listenerManager: EventListenerManager = new EventListenerManager();

    /**
     * 发送事件
     * @param name 事件名
     * @param args 事件参数
     */
    export function emit<T extends EventName>(name: T, args: IEventConfig[T]): void {
        _listenerManager.emit(`${name}`, name, args);
    }

    /**
     * 添加监听器
     * @param name 事件名
     * @param listener 监听器
     * @param thisArg this 对象
     * @param priority 优先级
     */
    export function on<T extends EventName>(name: T, listener: IEventListener<T>, thisArg?: any, priority: EEventListenerPriority = EEventListenerPriority.DEFAULT): void {
        _listenerManager.add(`${name}`, listener, thisArg, priority);
    }

    /**
     * 移除监听器
     * @param name 事件名
     * @param listener 监听器
     * @param thisArg this 对象
     */
    export function off<T extends EventName>(name: T, listener: IEventListener<T>, thisArg?: any): void {
        _listenerManager.remove(`${name}`, listener, thisArg);
    }

    /**
     * 移除指定对象的所有监听器
     * @param thisArg this 对象
     */
    export function targetOff(thisArg: any): void {
        _listenerManager.removeAllListenerOfTarget(thisArg);
    }

    /**
     * 移除指定事件名的所有监听器
     * @param name 事件名
     */
    export function eventOff(name: EventName): void {
        _listenerManager.removeAllListenerOfEventName(`${name}`);
    }

    /**
     * 移除所有监听器
     */
    export function clear(): void {
        _listenerManager.removeAllListeners();
    }

}

/**
 * 协议事件管理器
 */
export namespace ProtocolEventManager {

    /* 协议成功事件 */
    interface IProtocolSuccessEvent<T extends EProtocolID> {
        protocolID: T,
        success: true,
        data: IProtocolData[T]['resp'],
    };

    /* 协议失败事件 */
    interface IProtocolFailureEvent<T extends EProtocolID> {
        protocolID: T,
        success: false,
        data?: protocol.pb_common.pbError,
    };

    /* 协议事件 */
    export type IProtocolEvent<T extends EProtocolID> = IProtocolSuccessEvent<T> | IProtocolFailureEvent<T>;

    /* 协议事件监听器 */
    interface IProtocolEventListener<T extends EProtocolID> {
        (event: IProtocolEvent<T>): any,
    };

    /* 协议事件监听器的管理器 */
    const _listenerManager: EventListenerManager = new EventListenerManager();

    /* 提示处理器 */
    let _toastHandler: ((text: string) => any) | null = null;

    /**
     * 设置提示处理器
     * @param handler 提示处理器
     */
    export function setToastHandler(handler: ((text: string) => any) | null): void {
        _toastHandler = handler;
    }

    /**
     * 添加监听器
     * @param protocolID 协议 ID
     * @param listener 监听器
     * @param thisArg this 对象
     * @param priority 优先级
     */
    export function on<T extends EProtocolID>(protocolID: T, listener: IProtocolEventListener<T>, thisArg?: any, priority: EEventListenerPriority = EEventListenerPriority.DEFAULT): void {
        _listenerManager.add(`${protocolID}`, listener, thisArg, priority);
    }

    /**
     * 移除监听器
     * @param protocolID 协议 ID
     * @param listener 监听器
     * @param thisArg this 对象
     */
    export function off<T extends EProtocolID>(protocolID: T, listener: IProtocolEventListener<T>, thisArg?: any): void {
        _listenerManager.remove(`${protocolID}`, listener, thisArg);
    }

    /**
     * 移除指定对象的所有监听器
     * @param thisArg this 对象
     */
    export function targetOff(thisArg: any): void {
        _listenerManager.removeAllListenerOfTarget(thisArg);
    }

    /**
     * 移除指定事件名的所有监听器
     * @param protocolID 协议 ID
     */
    export function eventOff(protocolID: EProtocolID): void {
        _listenerManager.removeAllListenerOfEventName(`${protocolID}`);
    }

    /**
     * 移除所有监听器
     */
    export function clear(): void {
        _listenerManager.removeAllListeners();
    }

    /**
     * 协议返回响应
     * @param name 协议返回事件名
     * @param args 响应数据
     */
    function _onProtocolDidRespond(name: 'protocolDidRespond', args: EventArguments.IProtocolDidRespond) {
        if (!args.success && _toastHandler) {
            if (args.data) {
                const data = args.data as protocol.pb_common.pbError;
                if (data.errMsg && data.errMsg.length > 0) {
                    _toastHandler(data.errMsg);
                }
            }
        }

        // 发送协议事件
        _listenerManager.emit(`${args.protocolID}`, {
            protocolID: args.protocolID,
            success: args.success,
            data: args.data,
        });
    }

    /* 监听协议返回 */
    EventManager.on('protocolDidRespond', _onProtocolDidRespond, null, EEventListenerPriority.MANAGER);

}

/**
 * 后台 HTTP 事件管理器
 */
export namespace PlainHTTPEventManager {

    /* 后台 HTTP 事件 */
    export interface IPlainHTTPEvent<T extends TPlainHTTPName> {
        /* 接口名 */
        name: T,
        /* 请求是否成功（仅表示请求本身成功与否，不包括业务逻辑的成功） */
        success: boolean,
        /* 响应数据 */
        response?: IPlainHTTPConfig[T]['resp'],
    };

    /* 后台 HTTP 事件监听器 */
    interface IPlainHTTPEventListener<T extends TPlainHTTPName> {
        (event: IPlainHTTPEvent<T>): any,
    };

    /* 后台 HTTP 事件监听器的管理器 */
    const _listenerManager: EventListenerManager = new EventListenerManager();

    /**
     * 添加监听器
     * @param name 接口名
     * @param listener 监听器
     * @param thisArg this 对象
     * @param priority 优先级
     */
    export function on<T extends TPlainHTTPName>(name: T, listener: IPlainHTTPEventListener<T>, thisArg?: any, priority: EEventListenerPriority = EEventListenerPriority.DEFAULT): void {
        _listenerManager.add(`${name}`, listener, thisArg, priority);
    }

    /**
     * 移除监听器
     * @param name 接口名
     * @param listener 监听器
     * @param thisArg this 对象
     */
    export function off<T extends TPlainHTTPName>(name: T, listener: IPlainHTTPEventListener<T>, thisArg?: any): void {
        _listenerManager.remove(`${name}`, listener, thisArg);
    }

    /**
     * 移除指定对象的所有监听器
     * @param thisArg this 对象
     */
    export function targetOff(thisArg: any): void {
        _listenerManager.removeAllListenerOfTarget(thisArg);
    }

    /**
     * 移除指定接口名的所有监听器
     * @param name 接口名
     */
    export function eventOff(name: TPlainHTTPName): void {
        _listenerManager.removeAllListenerOfEventName(`${name}`);
    }

    /**
     * 移除所有监听器
     */
    export function clear(): void {
        _listenerManager.removeAllListeners();
    }

    /**
     * 后台 HTTP 请求返回响应
     * @param name 请求返回事件名
     * @param args 响应数据
     */
    function _onPlainHTTPDidLoad(name: 'plainHTTPDidLoad', args: EventArguments.IPlainHTTPDidLoad): void {
        _listenerManager.emit(`${args.name}`, {
            name: args.name,
            success: args.success,
            response: args.reponse,
        });
    }

    /* 监听后台 HTTP 请求返回 */
    EventManager.on('plainHTTPDidLoad', _onPlainHTTPDidLoad, null, EEventListenerPriority.MANAGER);

}
