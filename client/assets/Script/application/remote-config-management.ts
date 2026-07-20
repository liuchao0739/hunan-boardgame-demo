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

import {TextAsset, assetManager} from "cc";
import CryptoES from "crypto-es";

export namespace remoteConfig {
    const SECRECT_KEY = CryptoES.enc.Utf8.parse('fdo29jw2hdhra2f78sqteef34ze0el5w');
    const IV = CryptoES.enc.Utf8.parse('p0csalfxk3nemcjf');

    export function loadJson(url: string, callback: (obj: Error | object) => any, shouldDecrypt: boolean, maxRetryCount: number = 2): void {
        assetManager.loadRemote<TextAsset>(url, {ext: '.txt', maxRetryCount: maxRetryCount}, (error, textAsset) => {
            let obj: Error | object;

            if (error || !textAsset) {
                obj = error ?? new Error('Unknown error: asset is null');
            } else {
                let plaintext = textAsset.text;

                try {
                    if (shouldDecrypt) {
                        plaintext = _decrypt(textAsset.text);
                    }

                    obj = JSON.parse(plaintext);
                } catch (e) {
                    obj = e as Error;
                }
            }

            callback(obj);
        });
    }

    function _decrypt(ciphertext: string): string {
        const decryptedData = CryptoES.AES.decrypt(ciphertext, SECRECT_KEY, {
            iv: IV,
            mode: CryptoES.mode.CBC,
            padding: CryptoES.pad.Pkcs7,
        });

        return CryptoES.enc.Utf8.stringify(decryptedData);
    }

}
