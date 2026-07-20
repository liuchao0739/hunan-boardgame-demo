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
import CryptoES from "crypto-es";
import {AppVar} from "../../Module/AppVar";
import {EventManager} from "../event/event-management";
import {TimeUtils} from "../utils/time-utils";
import {IPlainHTTPArguments, IPlainHTTPConfig, PLAIN_HTTP_APIS, TPlainHTTPName} from "./plain-http-configs";
import {EProtocolID, IProtocolData, queryProtocolConfig} from "./protocol-configs";
import {ProtocolPacker} from "./protocol-pack";

export namespace GenericHTTPManager {

    interface IHTTPRequestInfo {
        request: XMLHttpRequest,
        listeners: { [name in keyof XMLHttpRequestEventMap]?: (event: ProgressEvent<XMLHttpRequestEventTarget>) => any },
    };

    const MAX_TAG = 100000000000;

    const _requestInfoMap: Map<number, IHTTPRequestInfo> = new Map<number, IHTTPRequestInfo>();
    const _requestHeaderMap: Map<string, string> = new Map<string, string>();

    let _tag = 0;

    export function load(url: string, args?: Map<string, string>): number;
    export function load(url: string, method: 'GET' | 'POST', args?: Map<string, string>): number;
    export function load(url: string, methodOrArgs?: 'GET' | 'POST' | Map<string, string>, args?: Map<string, string>): number {
        let method = 'GET';
        if (typeof methodOrArgs === 'string') {
            method = methodOrArgs;
        } else {
            args = methodOrArgs;
        }

        const request = new XMLHttpRequest();
        const tag = _getTag();
        const loadStartListener = () => EventManager.emit('httpWillLoad', {tag: tag});
        const loadEndListener = () => {
            _requestInfoMap.delete(tag);
            EventManager.emit('httpDidLoad', {
                tag: tag,
                success: request.status === 200,
                response: request.response,
            });
        }

        request.addEventListener('loadstart', loadStartListener);
        request.addEventListener('loadend', loadEndListener);
        request.open(method, url);
        for (const [key, value] of _requestHeaderMap) {
            request.setRequestHeader(key, value);
        }
        if (args && args.size > 0) {
            const formData = new FormData();
            for (const [key, value] of args) {
                formData.append(key, value);
            }
            request.send(formData);
        } else {
            request.send();
        }

        _requestInfoMap.set(tag, {
            request: request,
            listeners: {
                'loadstart': loadStartListener,
                'loadend': loadEndListener,
            }
        });

        return tag;
    }

    export function abort(tag: number) {
        if (tag) {
            const requestInfo = _requestInfoMap.get(tag);
            const request = requestInfo?.request;
            if (request) {
                const listeners = requestInfo.listeners;
                if (listeners) {
                    listeners.loadstart && request.removeEventListener('loadstart', listeners.loadstart);
                    listeners.loadend && request.removeEventListener('loadend', listeners.loadend);
                }
                request.abort();
            }
            _requestInfoMap.delete(tag);
        }
    }

    function _getTag() {
        const tag = _tag;
        _tag = (++_tag) % MAX_TAG;
        return tag;
    }

}

/**
 * 协议 HTTP 管理器，管理 HTTP 的协议通讯。
 */
export namespace ProtocolHTTPManager {

    /* HTTP 头部密钥 */
    const SECRECT_KEY = CryptoES.enc.Utf8.parse('Lv2OlRUMWodnva4O');

    /* 服务器 URL */
    let _serverURL = null;

    // 账号 token
    let _token: string | null = null;
    let _tokenExpiration: number | null = null;

    export function setDefaultUrl() {
        // qipaiplay-maj
        _serverURL = AppVar.isRelease ? 'http://mhonline.openpokergame.net:8086' : 'http://mhtest.openpokergame.net:8086';
        console.log("serverURL:", _serverURL);
    }

    /**
     * 设置服务器 URL
     * @param url 服务器 URL
     */
    export function setServerURL(url: string) {
        if (url.length > 0) {
            if (url.startsWith('http')) {
                _serverURL = url;
            } else {
                _serverURL = `http://${url}`;
            }
        } else {
            console.error(`[HTTP-PROTOCOL] invalid address: ${url}`);
        }
    }

    /**
     * 获取 HTTP 请求 token
     * @returns HTTP 请求 token
     */
    export function getHTTPToken(): string | null {
        let token: string | null = null;
        if (!_tokenExpiration || _tokenExpiration > TimeUtils.getServerTime()) {
            token = _token;
        }
        return token;
    }

    /**
     * 更新 HTTP token
     * @param accountToken 账号 token
     * @param expiration 过期时间
     */
    export function updateHTTPToken(accountToken: string, expiration?: number): void {
        // 生成加密 HTTP 请求 token
        const randomIV = CryptoES.lib.WordArray.random(16);
        const plainText = CryptoES.enc.Utf8.parse(accountToken);
        const encryptedData = CryptoES.AES.encrypt(plainText, SECRECT_KEY, {
            iv: randomIV,
            mode: CryptoES.mode.CFB,
            padding: CryptoES.pad.NoPadding,
        });
        const raw = randomIV.concat(encryptedData.ciphertext);
        _token = CryptoES.enc.Hex.stringify(raw);
        _tokenExpiration = expiration ?? null;
    }

    /**
     * 清除 HTTP token
     */
    export function clearHTTPToken(): void {
        _token = null;
        _tokenExpiration = null;
    }

    /**
     * 发送消息
     * @param protocolID 协议 ID
     * @param data 协议数据
     * @param authRequired 是否需要账号认证（默认需要）
     * @param timeout 允许超时时长（默认 5 秒）
     * @returns
     */
    /** 官方服 502 时：本地伪造全部 HTTP 协议响应，仅用于进大厅看 UI/3D */
    function buildOfflineMockData(protocolID: EProtocolID, data: any): any {
        const phone = data?.phoneNo || data?.id || data?.account || '10000000000';
        const accountId = Number(data?.accountId || data?.account || data?.userID || data?.playerId || data?.roleId || 900001) || 900001;

        switch (protocolID) {
            case EProtocolID.PHONE_CODE_REQ:
                return { code: '888888', phoneNo: String(phone) };
            case EProtocolID.ACCOUNT_TOKEN:
            case EProtocolID.PHONE_CODE_LOGIN:
            case EProtocolID.PHONE_REGISTER:
            case EProtocolID.PHONE_PW_LOGIN: {
                const mock = {
                    res: 'SUCCESS',
                    msg: 'offline ok',
                    token: 'offline-dev-token',
                    account: String(phone),
                    accountId: 900001,
                    isNewAccount: true,
                    timestamp: Math.floor(Date.now() / 1000) + 86400 * 30,
                };
                updateHTTPToken(mock.token, mock.timestamp as number);
                return mock;
            }
            case EProtocolID.GET_SERVER_URL:
                // 离线无真实 WS；空地址避免误连远端
                return { serverURL: '' };
            case EProtocolID.PROFILE_REQ:
            case EProtocolID.PROFILE_MODIFY:
                return {
                    res: 'SUCCESS',
                    msg: 'ok',
                    accountId,
                    account: String(phone),
                    name: '离线玩家',
                    avatarId: '1',
                    avatarUrl: '',
                };
            case EProtocolID.ROLE_USER_INFO:
                return {
                    userID: data?.userID ?? accountId,
                    name: '离线玩家',
                    avatarTID: 1,
                    avatarUrl: '',
                    borderTID: 0,
                    password: 1,
                };
            case EProtocolID.BAG_ITEMS_LIST:
                return { list: [] };
            case EProtocolID.CLUB_GETWBBINDINFO:
                return { isWBBind: false, WBbalance: 0, msg: 'offline' };
            case EProtocolID.CLUB_GET_PLAYER_INFOR_REQ:
                return {
                    res: 'SUCCESS',
                    msg: 'ok',
                    playerInfo: {
                        playerId: data?.playerId ?? accountId,
                        name: '离线玩家',
                        avatarId: 1,
                        avatarUrl: '',
                        balance: 99999,
                        fee: 0,
                        isOnline: true,
                        joinedClubIdList: [],
                        recentClubId: 0,
                        gouyu: 0,
                        tongbi: 0,
                    },
                };
            default:
                return { res: 'SUCCESS', msg: 'offline ok', list: [], items: [] };
        }
    }

    export function load<T extends EProtocolID>(protocolID: T, data: IProtocolData[T]['req'], authRequired: boolean = true, timeout: number = 5000): boolean {
        if (AppVar.offlineAuth) {
            const mockData = buildOfflineMockData(protocolID, data as any);
            console.warn(`[HTTP-PROTOCOL] offlineAuth mock [${protocolID}]`, data, '=>', mockData);
            setTimeout(() => {
                EventManager.emit('protocolDidRespond', {
                    protocolID: protocolID,
                    success: true,
                    data: mockData,
                });
            }, 50);
            return true;
        }

        if (!_serverURL) {
            /* 服务器地址无效 */
            console.error(`[HTTP-PROTOCOL] load error: server url not found`);
            return false;
        }

        let token: string | null = null;
        if (authRequired && !(token = getHTTPToken())) {
            // console.log("===authrequied:", authRequired, "==token：", token)
            /* token 过期 */
            console.warn(`[HTTP-PROTOCOL] load failed: token expired`);
            EventManager.emit('httpTokenDidExpire', null);
            return false;
        }

        // console.log("load 1");
        const protocolConfig = queryProtocolConfig(protocolID)!;
        const url = `${_serverURL}/${protocolConfig.httpAPI ?? ''}`;
        const protocolData = ProtocolPacker.pack(protocolID, data);
        const request = new XMLHttpRequest();
        // console.log("load 2");
        request.addEventListener('loadstart', () => {
            EventManager.emit('protocolWillRequest', {protocolID: protocolID});
        });
        request.addEventListener('loadend', () => {
            let response: ProtocolPacker.IProtocolResponse | null = null;
            if (request.status === 200) {
                response = ProtocolPacker.unpack(request.response);
                if (response) {
                    console.log(`[HTTP-PROTOCOL] [${protocolID}] ${response.success ? 'success' : 'failure'}: ${request.response.byteLength} bytes received`);
                    if (response.data) {
                        if (sys.isBrowser) {
                            console.log(response.data);
                        } else {
                            console.log(JSON.stringify(response.data));
                        }
                    }
                    if (response.id === protocolID) {
                        /**
                         * @todo need data handler for secondary processing?
                         */
                    } else {
                        console.error(`[HTTP-PROTOCOL] [${protocolID}] data error: unexpected protocol ID "${response.id}"`);
                        response = null;
                    }
                }
            } else {
                console.error(`[HTTP-PROTOCOL] [${protocolID}] HTTP error: ${request.status}`);
            }
            // console.log("=========111");
            EventManager.emit('protocolDidRespond', {
                protocolID: protocolID,
                success: response?.success ?? false,
                data: response?.data,
            });
        });
        request.open('POST', url);
        request.responseType = 'arraybuffer';
        request.timeout = timeout;
        if (authRequired) {
            request.setRequestHeader('x-token-content', token!);
        }
        console.log(`[HTTP-PROTOCOL] [${protocolID}] send:`);
        if (data) {
            if (sys.isBrowser) {
                console.log(data);
            } else {
                console.log(JSON.stringify(data));
            }
        }
        if (protocolData.byteLength > 0) {
            request.send(protocolData);
        } else {
            request.send();
        }
        return true;
    }


    export function loadUrl(url: string, authRequired: boolean = true, timeout: number = 5000): boolean {
        let token: string | null = null;
        if (authRequired && !(token = getHTTPToken())) {
            // console.log("===authrequied:", authRequired, "==token：", token)
            /* token 过期 */
            console.warn(`[HTTP-PROTOCOL] load failed: token expired`);
            EventManager.emit('httpTokenDidExpire', null);
            return false;
        }
        const request = new XMLHttpRequest();
        request.addEventListener('loadUrlEnd', () => {
            let response: ProtocolPacker.IProtocolResponse | null = null;
            if (request.status === 200) {
                response = ProtocolPacker.unpack(request.response);
                if (response) {
                    if (response.data) {
                        if (sys.isBrowser) {
                            console.log(response.data);
                        } else {
                            console.log(JSON.stringify(response.data));
                        }
                    }
                }
            } else {
                console.error(`HTTP error: ${request.status}`);
            }
        });


        request.open('GET', url);
        request.setRequestHeader('Access-Control-Allow-Origin', "*");
        request.setRequestHeader('X-Client-Data', `CIe2yQEIpLbJAQipncoBCMj0ygEIlaHLAQiLq8wBCISTzQEIhaDNAQjatM0BCNy9zQEIvL7NAQjfxM0BCO/EzQEIwcXNAQj0xc0BCJbHzQEIt8jNARjZnc0B`);
        request.setRequestHeader("Authority", 'storage.googleapis.com');
        request.setRequestHeader("contentType", 'application/octet-stream');
        request.setRequestHeader("Method", 'GET');
        request.setRequestHeader("Path", '/systemConfig.json');
        request.setRequestHeader("Scheme", 'https');
        request.responseType = 'blob';
        request.timeout = timeout;
        request.send();
        return true;
    }
}

/**
 * 后台 HTTP 接口管理器，管理后台接口的通讯。
 */
export namespace PlainHTTPManager {

    const URL_REG_EXP = /^https*:\/\/[^\s]+$/;
    /* 签名密钥 */
    const SECRECT_KEY = '28c8edde3d61a0411511d3b1866f0636';
    /* 后台 URL */
    let _backendURL: string = '';
    /* 签名 key */
    let _signKey: string = '';

    export function init(): void {
        setBackendURL(AppVar.isRelease ? 'http://www.qipaiplay.com/api' : 'http://test.qipaiplay.com/api');
        setSignKey(AppVar.isRelease ? 'fmMaj' : 'PokerHour_test');
    }

    /**
     * 设置后台 URL
     * @param url 后台 URL
     */
    export function setBackendURL(url: string): void {
        if (!url.startsWith('http')) {
            url = `http://${url}`;
        }

        if (URL_REG_EXP.test(url)) {
            if (url.endsWith('/')) {
                url = url.substring(0, url.length - 1);
            }
            _backendURL = url;
        } else {
            console.error(`[HTTP-PLAIN] invalid address: ${url}`);
        }
    }

    /**
     * 设置签名 key
     * @param key 签名 key
     */
    export function setSignKey(key: string): void {
        _signKey = key;
    }

    /**
     * 发送消息
     * @param name 接口名
     * @param data 待发送数据
     * @param method 发送方法（GET/POST）
     * @param timeout 允许超时时长（默认 10 秒）
     * @returns 是否成功发送
     */
    export function load<T extends TPlainHTTPName>(name: T, data: IPlainHTTPConfig[T]['req'], method: 'GET' | 'POST' = 'POST', timeout: number = 10000): boolean {
        if (!_backendURL) {
            /* 后台地址无效 */
            console.error(`[HTTP-PLAIN] load error: backend url not found`);
            return false;
        }

        const timestamp = Math.floor(TimeUtils.getServerTime());
        let url = `${_backendURL}/${PLAIN_HTTP_APIS[name]}`;

        const request = new XMLHttpRequest();

        // 设置超时
        request.timeout = timeout;

        // 添加监听
        request.addEventListener('loadstart', () => {
            console.log(`[HTTP-PLAIN] [${name}] send:`);
            if (data) {
                if (sys.isBrowser) {
                    console.log(data);
                } else {
                    console.log(JSON.stringify(data));
                }
            }

            EventManager.emit('plainHTTPWillLoad', {name: name});
        });
        request.addEventListener('loadend', () => {
            const success = request.status === 200;
            let response: IPlainHTTPArguments.IResponse | undefined = undefined;

            if (success && request.response) {
                try {
                    const result = JSON.parse(request.response);
                    if (_isValidResponse(result)) {
                        response = result;
                    }
                } catch (e) {
                    console.error(`[HTTP-PLAIN] parse response of ${name} failed: ${e instanceof Error ? e.message : 'unknown error'}`);
                }
            }

            console.log(`[HTTP-PLAIN] [${name}] receive:`);
            if (data) {
                if (sys.isBrowser) {
                    console.log(request.response);
                } else {
                    console.log(JSON.stringify(request.response));
                }
            }

            EventManager.emit('plainHTTPDidLoad', {
                name: name,
                success: success,
                reponse: response,
            });
        });

        // 生成签名
        const signArgumentNames: string[] = ['key', 'timestamp'];
        for (const key in data) {
            signArgumentNames.push(key);
        }
        signArgumentNames.sort((a, b) => a.localeCompare(b));
        const signData: { [key: string]: any } = {...data, key: _signKey, timestamp: timestamp};
        const signArgumentsString: string = signArgumentNames.map(element => `${element}=${signData[element]}`).join('&');
        const sign = CryptoES.MD5(`${signArgumentsString}${SECRECT_KEY}`).toString().toUpperCase();

        // 构造参数
        const argumentPairStrings: string[] = [];
        if (data !== null && data !== undefined) {
            const tmpData = data as { [key: string]: any };
            for (const key in tmpData) {
                argumentPairStrings.push(`${key}=${tmpData[key]}`);
            }
        }
        argumentPairStrings.push(`timestamp=${timestamp}`);
        argumentPairStrings.push(`sign=${sign}`);
        const argumentsString: string = encodeURI(argumentPairStrings.join('&'));

        if (!url.endsWith('?')) {
            url = url + '?';
        }
        url = `${url}${argumentsString}`;

        request.open(method, url);
        request.send();

        return true;
    }

    /**
     * 响应数据是否有效
     * @param object 响应数据
     * @returns 是否有效
     */
    function _isValidResponse(object: any): object is IPlainHTTPArguments.IResponse {
        if (typeof object !== 'object') {
            return false;
        }
        return (typeof object.code === 'number');
    }

}
