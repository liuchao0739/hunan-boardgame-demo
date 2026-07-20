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

import {native} from "cc";
import {INativeEvent, TNativeEventName} from "./native-event";

const {jsbBridgeWrapper} = native;

export namespace NativeManager {

    export interface INativeEventListener<T extends TNativeEventName> {
        (name: T, args?: INativeEvent[T]['native']): any,
    };

    interface IPersistentListenerConfig {
        raw: (name: any, args: any) => any;
        wrapped: (arg: string) => void;
    };

    const _persistentListenerConfigsMap = new Map<string, IPersistentListenerConfig[]>();

    export function callNative<T extends TNativeEventName>(name: T, data: INativeEvent[T]['script'], listener?: INativeEventListener<T>): void {
        if (listener !== null && listener !== undefined) {
            const listenerWrapped = (arg?: string) => {
                jsbBridgeWrapper?.removeNativeEventListener?.(`${name}FromNative`, listenerWrapped);

                let dataReceived: INativeEvent[T]['native'] | undefined = undefined;
                if (arg !== null && arg !== undefined) {
                    try {
                        const rawData = JSON.parse(arg);
                        if (rawData !== null && rawData !== undefined) {
                            dataReceived = rawData as INativeEvent[T]['native'];
                        }
                    } catch (e) {
                        console.error(`[NATIVE] parse argument "${arg}" of "${name}" from native failed: ${e}`);
                    }
                }

                listener(name, dataReceived);
            };

            jsbBridgeWrapper?.addNativeEventListener?.(`${name}FromNative`, listenerWrapped);
        }

        let dataToBeSent: string | undefined = undefined;
        if (data !== null && data !== undefined) {
            dataToBeSent = JSON.stringify(data);
        }
        jsbBridgeWrapper?.dispatchEventToNative?.(`${name}FromScript`, dataToBeSent);
    }

    export function addPersistentListener<T extends TNativeEventName>(name: T, listener: INativeEventListener<T>): void {
        let configsOfSingleEvent = _persistentListenerConfigsMap.get(`${name}`);
        if (!configsOfSingleEvent) {
            configsOfSingleEvent = [];
            _persistentListenerConfigsMap.set(`${name}`, configsOfSingleEvent);
        }
        for (const config of configsOfSingleEvent) {
            if (config.raw === listener) {
                console.warn(`[NATIVE] persistent listener already added`);
                return;
            }
        }

        const listenerWrapped = (arg?: string) => {
            let dataReceived: INativeEvent[T]['native'] | undefined = undefined;
            if (arg !== null && arg !== undefined) {
                try {
                    const rawData = JSON.parse(arg);
                    if (rawData !== null && rawData !== undefined) {
                        dataReceived = rawData as INativeEvent[T]['native'];
                    }
                } catch (e) {
                    console.error(`[NATIVE] parse argument "${arg}" of "${name}" from native failed: ${e}`);
                }
            }

            listener(name, dataReceived);
        };

        configsOfSingleEvent.push({
            raw: listener,
            wrapped: listenerWrapped,
        });

        jsbBridgeWrapper?.addNativeEventListener?.(`${name}FromNative`, listenerWrapped);
    }

    export function removePersistentListener<T extends TNativeEventName>(name: T, listener: INativeEventListener<T>): boolean {
        let configsOfSingleEvent = _persistentListenerConfigsMap.get(`${name}`);
        if (configsOfSingleEvent) {
            const configsCount = configsOfSingleEvent.length;
            for (let index = 0; index < configsCount; index++) {
                const config = configsOfSingleEvent[index];
                if (config.raw === listener) {
                    jsbBridgeWrapper?.removeNativeEventListener?.(`${name}FromNative`, config.wrapped);
                    configsOfSingleEvent.splice(index, 1);
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * FIX COCOS BUG: 修复源码中注册原生事件监听器时，错误使用 Array.find 进行查找的问题
     */
    if (jsbBridgeWrapper) {
        const descriptor = Object.getOwnPropertyDescriptor(jsbBridgeWrapper, 'eventMap');
        if (descriptor && descriptor.value) {
            const eventMap = descriptor.value as Map<string, native.OnNativeEventListener[]>;
            jsbBridgeWrapper.addNativeEventListener = (eventName, listener) => {
                const arr = eventMap.get(eventName);

                if (arr === null || arr === undefined) {
                    eventMap.set(eventName, [listener]);
                    return;
                }

                /* 此处源码错误使用 find 方法 */
                if (arr.indexOf(listener) < 0) {
                    arr.push(listener);
                }
            }
        }
    }

}
