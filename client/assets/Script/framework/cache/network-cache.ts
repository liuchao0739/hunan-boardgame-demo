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

import {EProtocolID, IProtocolData} from "../network/protocol-configs";

export type NetworkSingleCache<T extends EProtocolID> = IProtocolData[T]['resp'];
export type NetworkMutipleCache<T extends EProtocolID> = Map<string, NetworkSingleCache<T>>;
export type NetworkCache<T extends EProtocolID> = NetworkSingleCache<T> | NetworkMutipleCache<T>;

export namespace NetworkCacheManager {
    type NetworkCacheMap = { [K in EProtocolID]?: object | null };

    let _cacheMap: NetworkCacheMap = {};

    export function set<T extends EProtocolID>(protocolID: T, data: IProtocolData[T]['resp'], key?: string): void {
        let cache: NetworkCache<T> | undefined = _cacheMap[protocolID];
        if (cache) {
            const mutiple = cache instanceof Map;
            if ((key && !mutiple) || (!key && mutiple)) {
                console.warn(`[NETWORK-CACHE] changing cache type of ${protocolID}`);
            }
            if (key) {
                if (mutiple) {
                    (cache as NetworkMutipleCache<T>).set(key, data);
                } else {
                    cache = new Map<string, NetworkSingleCache<T>>;
                    cache.set(key, data);
                    _cacheMap[protocolID] = cache;
                }
            } else {
                _cacheMap[protocolID] = data;
            }
        } else {
            if (key) {
                const subCache = new Map<string, NetworkSingleCache<T>>;
                subCache.set(key, data);
                _cacheMap[protocolID] = subCache;
            } else {
                _cacheMap[protocolID] = data;
            }
        }
    }

    export function get<T extends EProtocolID>(protocolID: T, key?: string): NetworkCache<T> | null {
        let cache: NetworkCache<T> | undefined = _cacheMap[protocolID];
        if (key && cache instanceof Map) {
            return cache.get(key) ?? null;
        } else {
            return cache ?? null;
        }
    }

    export function clear(): void {
        _cacheMap = {};
    }

}