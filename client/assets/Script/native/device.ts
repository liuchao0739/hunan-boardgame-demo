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

import CryptoES from 'crypto-es';
import {sys} from "cc";
import {NativeManager} from '../framework/native/native-management';

export namespace device {

    /* "Device-deviceID" MD5 */
    const DEVICE_ID_KEY = 'C297B8ABC0DFB4068E695C4C36F10C99';

    /**
     * 获取设备 ID
     * @param callback 回调
     */
    export function fetchDeviceID(callback: (deviceID: string | null) => void): void {
        if (sys.isMobile && sys.isNative) {
            NativeManager.callNative('fetchDeviceID', null, (name, args) => {
                if (args) {
                    callback(args.deviceID);
                } else {
                    console.error('[DEVICE] fetch deive ID failed');
                    callback(null);
                }
            });
        } else {
            let deviceID = sys.localStorage.getItem(DEVICE_ID_KEY);
            if (!deviceID) {
                let browserInfo = '';
                if (sys.isBrowser) {
                    browserInfo = `-${sys.browserType}-${sys.browserVersion}`;
                }
                const randomString = CryptoES.lib.WordArray.random(16).toString();
                const raw = `${sys.os}-${sys.osVersion}${browserInfo}-${randomString}`;
                const data = CryptoES.MD5(raw).toString();
                const uuid = `${data.slice(0, 8)}-${data.slice(8, 12)}-${data.slice(12, 16)}-${data.slice(16, 20)}-${data.slice(20)}`.toLowerCase();
                try {
                    sys.localStorage.setItem(DEVICE_ID_KEY, uuid);
                    deviceID = uuid;
                } catch (e) {
                    console.error('[DEVICE] save deive ID failed');
                }
            }
            setTimeout(() => {
                callback(deviceID);
            });
        }
    }
}