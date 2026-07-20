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

import {assetManager} from "cc";

export namespace version {

    /* 有效版本号的正则表达式 */
    const VERSION_REGULAR_EXPRESSION = /^(\d+)\.(\d{1,2})\.(\d{1,2})$/;

    /* 默认版本号（版本信息文件读取失败时使用此版本号） */
    const DEFAULT_VERSION = '1.0.0';

    export function fetchVersion(callback: (version: string) => any): void {
        const url = assetManager.utils.transform({bundle: 'resources', path: 'version/version', ext: '.manifest'});
        if (typeof url === 'string') {
            const uuid = assetManager.utils.getUuidFromURL(url);
            const nativeURL = assetManager.utils.getUrlWithUuid(uuid, {isNative: true, nativeExt: '.manifest'});
            assetManager.loadAny({url: nativeURL}, {ext: '.json'}, (error, json) => {
                let version: string = DEFAULT_VERSION;

                if (error) {
                    console.error(`[VERSION] fetching version failed: ${error.message}`);
                } else if (!_isVersionJson(json) || !VERSION_REGULAR_EXPRESSION.test(json.version)) {
                    console.error(`[VERSION] invalid json: ${json ?? (typeof json)}`);
                } else {
                    version = json.version;
                }

                callback(version);
            });
        } else {
            console.error(`[VERSION] fetching version failed: invalid url ${url} of "version.manifest"`);
            callback(DEFAULT_VERSION);
        }
    }

    /**
     * 判断是否有效的版本信息 json
     * @param object 目标对象
     * @returns 是否有效的版本信息 json
     */
    function _isVersionJson(object: any): object is { version: string } {
        if (typeof object !== 'object') {
            return false;
        }

        return (object.version !== null && object.version !== undefined);
    }

}
