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

import {sys} from "cc";
import {EventManager} from "../event/event-management";
import {EProtocolID, IProtocolData} from "./protocol-configs";
import {ProtocolPacker} from "./protocol-pack";

/**
 * WebSocket 状态
 */
export enum EWebSocketState {
    CONNECTING,
    OPEN,
    CLOSED,
};

/**
 * WebSocket 代理
 */
export interface WebSocketDelegate {
    onWebSocketOpen: (wrapper: WebSocketWrapper, success: boolean) => any;
    onWebSocketMessage: (wrapper: WebSocketWrapper, event: MessageEvent) => any;
    onWebSocketError: (wrapper: WebSocketWrapper, event: Event) => any;
    onWebSocketClose: (wrapper: WebSocketWrapper, event: CloseEvent) => any;
};

/**
 * WebSocket 包装类，支持地址池连接。<br>
 * 请注意，连接中或已连接状态下，调用 connect 方法并传递新的地址池，原连接将关闭。
 */
export class WebSocketWrapper {

    /* 连接状态 */
    private _state: EWebSocketState = EWebSocketState.CLOSED;
    /* 地址池 */
    private _urlSet: Set<string> = new Set<string>();
    /* 代理 */
    private _delegate: WebSocketDelegate | null = null;

    /* 尝试连接中的 WebSocket 对象表 */
    private _connectingMap: Map<string, WebSocket> = new Map<string, WebSocket>();
    /* 当前可用的 WebSocket 对象 */
    private _webSocket: WebSocket | null = null;

    // 连接超时
    private _timeout: number = 15000;
    private _timeoutScheduleID: number | null = null;

    /**
     * 构造方法
     * @param urls 地址或地址池
     */
    constructor(urls?: string | string[]) {
        if (urls) {
            if (!Array.isArray(urls)) {
                urls = [urls];
            }
            urls.forEach(url => this._urlSet.add(url));
        }
    }

    /**
     * 连接状态
     */
    get state(): EWebSocketState {
        return this._state;
    }

    /**
     * 代理
     */
    set delegate(delegate: WebSocketDelegate | null) {
        this._delegate = delegate;
    }

    /**
     * 超时时长
     */
    get timeout(): number {
        return this._timeout;
    }

    set timeout(timeout: number) {
        if (timeout > 0) {
            this._timeout = timeout;
        }
    }

    /**
     * 已连接的 URL
     */
    get url(): string | null {
        return this._webSocket?.url ?? null;
    }

    /**
     * 连接
     * @param urls 地址或地址池
     */
    connect(urls?: string | string[]): void {
        if (urls) {
            if (!Array.isArray(urls)) {
                urls = [urls];
            }
            this._urlSet.clear();
            urls.forEach(url => this._urlSet.add(url));
            if (this._state === EWebSocketState.CONNECTING || this._state === EWebSocketState.OPEN) {
                // 已连接或连接中，关闭原连接
                console.warn('[WEB-SOCKET-WRAPPER] change connection to new urls');
                this.disconnect();
            }
        } else if (this._state === EWebSocketState.CONNECTING || this._state === EWebSocketState.OPEN) {
            // 已连接，不再重复连接
            console.warn('[WEB-SOCKET-WRAPPER] already connected, need reconnect?');
            return;
        }

        if (this._urlSet.size <= 0) {
            // 地址池为空
            console.error('[WEB-SOCKET-WRAPPER] connect failed: url not found');
            return;
        }

        this._state = EWebSocketState.CONNECTING;

        this._urlSet.forEach(url => {
            const socket = new WebSocket(url);
            socket.binaryType = 'arraybuffer';
            socket.onopen = () => {
                this._onConnectSucceed(socket);
            };
            socket.onclose = () => {
                for (const [_, s] of this._connectingMap) {
                    if (s.readyState !== WebSocket.CLOSED && s.readyState !== WebSocket.CLOSING) {
                        return;
                    }
                }
                // 所有连接失败
                this._onConnectFail();
            };
            this._connectingMap.set(url, socket);
        });

        // 超时倒计时
        this._timeoutScheduleID = Number(setTimeout(() => {
            // 连接超时，关闭所有连接
            this._timeoutScheduleID = null;
            this._onConnectFail();
        }, this._timeout));
    }

    /**
     * 关闭连接
     */
    disconnect(): void {
        this._state = EWebSocketState.CLOSED;

        // 清空尝试中的连接
        this._clearConnectingSockets();

        // 先移除监听，再关闭当前连接，避免发生关闭回调
        if (this._webSocket) {
            this._webSocket.onmessage = null;
            this._webSocket.onerror = null;
            this._webSocket.onclose = null;

            const state = this._webSocket.readyState;
            if (state === WebSocket.CONNECTING || state === WebSocket.OPEN) {
                this._webSocket.close();
            }

            this._webSocket = null;
        }
    }

    /**
     * 发送消息
     * @param data 消息数据（二进制）
     * @returns 发送结果
     */
    send(data: ArrayBuffer): boolean {
        let success = false;
        if (this._webSocket && this._webSocket.readyState === WebSocket.OPEN) {
            this._webSocket.send(data);
            success = true;
        }
        return success;
    }

    /**
     * 连接成功
     * @param socket 成功连接的 WebSocket 对象
     */
    private _onConnectSucceed(socket: WebSocket) {
        this._state = EWebSocketState.OPEN;

        /* 保留成功连接（移除监听），关闭其他连接 */
        this._clearConnectingSockets(socket);

        this._webSocket = socket;
        this._webSocket.onmessage = event => this._delegate?.onWebSocketMessage(this, event);
        this._webSocket.onerror = event => this._delegate?.onWebSocketError(this, event);
        this._webSocket.onclose = event => {
            this._delegate?.onWebSocketClose(this, event);
            this.disconnect();
        };

        this._delegate?.onWebSocketOpen(this, true);
    }

    /**
     * 连接失败
     */
    private _onConnectFail() {
        this._state = EWebSocketState.CLOSED;

        this._clearConnectingSockets();

        this._delegate?.onWebSocketOpen(this, false);
    }

    /**
     * 清空尝试中的连接
     * @param reservedSocket 保留的 WebSocket 对象
     */
    private _clearConnectingSockets(reservedSocket?: WebSocket) {
        // 停止超时倒计时
        if (this._timeoutScheduleID) {
            clearTimeout(this._timeoutScheduleID);
            this._timeoutScheduleID = null;
        }

        for (const [_, s] of this._connectingMap) {
            s.onopen = null;
            s.onmessage = null;
            s.onerror = null;
            s.onclose = null;
            if (s !== reservedSocket && s.readyState !== WebSocket.CLOSED && s.readyState !== WebSocket.CLOSING) {
                s.close();
            }
        }
        this._connectingMap.clear();
    }

}

/**
 * WebSocket 管理器，统一管理 WebSocket 的连接和通讯。
 */
export namespace WebSocketManager {

    /* 服务器 URL 格式的正则表达式 */
    const URL_REG_EXP = /^(?:wss*:\/\/)*(?:\d{1,3}\.){3}\d{1,3}(?::\d+)*$/;
    /* 地址池 */
    const _serverURLs: string[] = ['ws://34.150.79.165:9090/ws'];

    // WebSocket 包装类对象
    const _webSocketWrapper: WebSocketWrapper = new WebSocketWrapper(_serverURLs);
    _webSocketWrapper.delegate = {
        onWebSocketOpen: _onWebSocketOpen,
        onWebSocketMessage: _onWebSocketMessage,
        onWebSocketError: _onWebSocketError,
        onWebSocketClose: _onWebSocketClose,
    }

    /**
     * 获取 WebSocket 状态
     * @returns WebSocket 状态
     */
    export function getState(): EWebSocketState {
        return _webSocketWrapper.state;
    }

    /**
     * 连接
     * @param urls 地址或地址池
     */
    export function connect(urls: string | string[]): void {
        console.log(`[WEB-SOCKET] connecting ${Array.isArray(urls) ? urls.join(', ') : urls}`);
        _webSocketWrapper.connect(urls);
    }

    /**
     * 关闭连接
     */
    export function disconnect(): void {
        console.log(`[WEB-SOCKET] disconnecting`);
        _webSocketWrapper.disconnect();
    }

    /**
     * 发送消息
     * @param protocolID 协议 ID
     * @param data 协议数据
     * @returns 发送结果
     */
    export function send<T extends EProtocolID>(protocolID: T, data: IProtocolData[T]['req']): boolean {
        console.log(`[WEB-SOCKET] [${protocolID}] send:`);
        if (data) {
            if (sys.isBrowser) {
                console.log(data);
            } else {
                console.log(JSON.stringify(data));
            }
        }
        let success = false;
        if (_webSocketWrapper.state === EWebSocketState.OPEN) {
            EventManager.emit('protocolWillRequest', {protocolID: protocolID});
            success = _webSocketWrapper.send(ProtocolPacker.pack(protocolID, data));
        } else {
            console.warn(`[WEB-SOCKET] [${protocolID}] send data failed: websocket disconnected`);
        }
        return success;
    }

    /* 连接事件响应 */
    function _onWebSocketOpen(wrapper: WebSocketWrapper, success: boolean): void {
        if (success) {
            console.log(`[WEB-SOCKET] ${wrapper.url} connected`);
        } else {
            console.log(`[WEB-SOCKET] connect failed`);
        }
        EventManager.emit('webSocketDidConnect', {success: success});
    }

    /* 接收事件响应 */
    function _onWebSocketMessage(wrapper: WebSocketWrapper, event: MessageEvent): void {
        const responseData = event.data;
        EventManager.emit('webSocketDidReceive', {type: typeof responseData});
        if (responseData instanceof ArrayBuffer) {
            const response = ProtocolPacker.unpack(responseData);
            if (response) {
                const protocolID = response.id;
                console.log(`[WEB-SOCKET] [${protocolID}] ${response.success ? 'success' : 'failure'}: ${responseData.byteLength} bytes received`);
                if (response.data) {
                    if (sys.isBrowser) {
                        console.log(response.data);
                    } else {
                        console.log(JSON.stringify(response.data));
                    }
                }
                EventManager.emit('protocolDidRespond', {
                    protocolID: protocolID,
                    success: response.success,
                    data: response.data,
                });
            }
        } else {
            console.error(`[WEB-SOCKET] unexpected type of data received: ${typeof responseData}`);
        }
    }

    /* 错误事件响应 */
    function _onWebSocketError(wrapper: WebSocketWrapper, event: Event): void {
        console.warn(`[WEB-SOCKET] connection error: ${event.type}`);
        EventManager.emit('webSocketError', {eventType: event.type});
    }

    /* 关闭事件响应 */
    function _onWebSocketClose(wrapper: WebSocketWrapper, event: CloseEvent): void {
        console.log(`[WEB-SOCKET] ${wrapper.url} disconnected: ${event.reason}`);
        EventManager.emit('webSocketDidDisconnect', {
            code: event.code,
            reason: event.reason,
        });
    }

}
