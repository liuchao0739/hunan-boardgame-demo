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

import {IPlainHTTPArguments, TPlainHTTPName} from "../network/plain-http-configs";
import {EProtocolID} from "../network/protocol-configs";

export type EventName = keyof IEventConfig;

export namespace EventArguments {

    export interface IHTTPWillLoad {
        tag: number,
    };

    export interface IHTTPDidLoad {
        tag: number,
        success: boolean,
        response: any,
    };

    export interface IWebSocketDidConnect {
        success: boolean,
    };

    export interface IWebSocketDidDisconnect {
        code: number,
        reason: string,
    };

    export interface IWebSocketDidReceive {
        type: string,
    };

    export interface IWebSocketError {
        eventType: string,
    };

    export interface IProtocolWillRequest {
        protocolID: EProtocolID,
    };

    export interface IProtocolDidRespond {
        protocolID: EProtocolID,
        success: boolean,
        data?: object,
    };

    export interface IPlainHTTPWillLoad {
        name: TPlainHTTPName,
    };

    export interface IPlainHTTPDidLoad extends IPlainHTTPWillLoad {
        success: boolean,
        reponse?: IPlainHTTPArguments.IResponse,
    };

    export interface IAccountDidSignIn {
        success: boolean,
        errorDesc: string,
    };

    export interface IUserInfoDidChange {
        previous: number,
        current: number,
    };

    export interface IAvatarChange {
        id: number,
    }
}

export interface IEventConfig {
    httpWillLoad: EventArguments.IHTTPWillLoad,
    httpDidLoad: EventArguments.IHTTPDidLoad,
    httpTokenDidExpire: null,

    webSocketDidConnect: EventArguments.IWebSocketDidConnect,
    webSocketDidDisconnect: EventArguments.IWebSocketDidDisconnect,
    webSocketDidReceive: EventArguments.IWebSocketDidReceive,
    webSocketError: EventArguments.IWebSocketError,

    protocolWillRequest: EventArguments.IProtocolWillRequest,
    protocolDidRespond: EventArguments.IProtocolDidRespond,

    plainHTTPWillLoad: EventArguments.IPlainHTTPWillLoad,
    plainHTTPDidLoad: EventArguments.IPlainHTTPDidLoad,

    accountWillSignIn: null,
    accountDidSignIn: EventArguments.IAccountDidSignIn,
    accountWillReconnect: null,
    accountDidReconnect: null,
    accountWillConnect: null,
    accountDidConnect: EventArguments.IAccountDidSignIn,

    userLevelDidChange: EventArguments.IUserInfoDidChange,
    userVIPLevelDidChange: EventArguments.IUserInfoDidChange,

    avatarChangeOut: EventArguments.IAvatarChange,

    wheelRefreshOut: null,

    goldChange: null,
    goldAnimationsStart: null,
    goldAnimationsEnd: null
}
