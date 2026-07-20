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
// import { AccountManager } from "../../modules/account/account";
import {ILocalCacheConfig, isLocalCacheGlobal, LocalCacheID} from "./local-cache-configs";

export namespace LocalCacheManager {

    export function write<T extends LocalCacheID>(cacheID: T, data: ILocalCacheConfig[T]): boolean {
        let success = false;
        const cacheName = _getCacheName(cacheID);
        const json = JSON.stringify(data);
        if (cacheName && json) {
            try {
                sys.localStorage.setItem(cacheName, json);
                success = true;
            } catch (e) {
                console.error(`[LOCAL-CACHE] writing cache for ${cacheID} failed: ${e}`);
            }
        }
        return success;
    }

    export function read<T extends LocalCacheID>(cacheID: T): ILocalCacheConfig[T] | null {
        let data: ILocalCacheConfig[T] | null = null;
        const cacheName = _getCacheName(cacheID);
        if (cacheName) {
            const json = sys.localStorage.getItem(cacheName);
            if (json) {
                data = JSON.parse(json) ?? null;
            }
        }
        return data;
    }

    export function clear(cacheID: LocalCacheID) {
        const cacheName = _getCacheName(cacheID);
        if (cacheName) {
            sys.localStorage.removeItem(cacheName);
        }
    }

    function _getCacheName(cacheID: LocalCacheID): string | null {
        let name: string | null = null;
        if (isLocalCacheGlobal(cacheID)) {
            name = `cache-${cacheID}`;
        } else {
            // const userID = AccountManager.getUserID();
            // if (userID) {
            //     name = `cache-${userID}-${cacheID}`;
            // }
        }
        return name;
    }

}
