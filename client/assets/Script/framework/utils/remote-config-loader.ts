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
import {EventManager} from "../event/event-management";
import {GenericHTTPManager} from "../network/http";

export namespace RemoteConfigLoader {

    const SECRECT_KEY = CryptoES.enc.Utf8.parse('fdo29jw2hdhra2f78sqteef34ze0el5w');
    const IV = CryptoES.enc.Utf8.parse('p0csalfxk3nemcjf');
    const _callbackMap: { [tag: number]: (success: boolean, response: any) => any } = {};

    export function loadJsonUsingHTTP(url: string, callback: (obj: Error | object) => any, shouldDecrypt: boolean): void {
        const tag = GenericHTTPManager.load(url);

        _callbackMap[tag] = (success: boolean, response: any) => {
            let obj: Error | object;

            if (success) {
                let plaintext = response;

                try {
                    if (shouldDecrypt) {
                        plaintext = _decrypt(response);
                    }
                    obj = JSON.parse(plaintext);
                } catch (e) {
                    obj = e as Error;
                }
            } else {
                obj = new Error(`loading JSON failed: ${url}`);
            }

            callback(obj);
        };
    }

    // TODO: 去掉
    export function printConfigText(): void {
        var oritext = "BTFh0ZD1j7NmjLOPa0lfEdCCq6PAdDlxOj65A+Sh/ZE8bx3280RMDBGxYddRS2cki+oCQFDnRESF4oD7IwYzJPE56bSEOoK52u97Z3iYsC80MfftwyEHgnVKV3mfle3vJ27BZiOdbkpUzvEQJU+ZOnrBLIIvVA3AoMiBgda0eGXWgQykFM2nnCRG3uGU9Z5b8Rpe4WktvNnLztnmeMvo464GpumIC4oRxxonzVpDRKLrS1nq5Ki1zCKPXn+meFqNDXsOFrvFjR05Diiawg8dL3hymKSOauHPCHhgageZQaolINierij2ktTeWwFVcHVMG4c/DkdpG5R5V/eCjpN//jCw34ow9GzIufl4z7Snx172mXKObq7yfUJ2Vt4VNpEQ3Fz27jPw1xr7t/bVLv7/LSlxSpmSUhH7K0ZyEosxyCIgU+TJ0VsL2oLysebJHbXOVYNtd6TqnWdMOO1M0SMj3oPTF2wksNh9fwypxlIoXFkAEVNmGq38utHDlFSz4AYV/Zoxi77YeK7lJrktuYFxneCQV7SZrCvzh4av5YosN1fsR2YaRPyfZpdfNysRy5WCWJi0eDaqrulDOw9jDeGqf1VP388Hs2yPqnTXjP/gufmqv+RDns2tpubgWaplO3TuKaxXirXmk43g4cbmbjSFZSaUzgKoeNNE7Ptz1BQfoZX15+qhDLn84+o7yP5AZCJjQ022V/ZoVHpeX0dfoVww27kQoaGkfP/cR/RhDjZC0jMzTQQXi/AySIWbtfzLSxIJJE8qLtevH4VUDQUB2YIcmzR7LmynRJ/6eXZoUHRyiOrb5icMbhWJr1Tf0gfC2HTY/3eMv0DFLX+WUbtQGChBu2S8OqfK2Tr+7VDxX7SdUE30a64cKpFM8+MRsFuCUtW1OOceiJI0+zomyQdvbSiWa7e7N3DJ1iX/DaXe/4yvwZPsed7zxIHM972r3pTwFmSvbYp1FKxsSvpL54Pq9IGx/lwD8k9ZQKeFivGlanZQjMlBqAcCcnPS/1VeaZExJU6tzjHxqudnY1mSKsBFyJi8TE3ZlAJM5wGhH4J+wheHxCWCFT8te2Vn74nPHZxyJKx9bAr1Qz9s/ZxvP28FGSBReWP7CZTL9y99CbnybfzufCP5K74sqrxmDyJGkHihqw/7QtNrrXi1YYwjl9Um6+as2L2LllvfjheoVOJ0cF01smMKDPdHgzArQfGtZCJOarA/AWux8SgoJ7lvTe14RCEIEAzWBUJMsX1yN0w91d1Hc5M8eNYooNXPZRBrtaLKzmMIzf4qR3jxSDavuwY9ptYKv9zDPuJB+Y2dSN0ZDnglGijf7VyfBrJAMGrIVkP6iWXd5Iyqat4QXNmJ8OLwmd5VvsH9jmPTVsSQcJ2fBEFB7cAHPTSMUuRazUYp715Bn+80R8457DXFGJ1j3Tt2/bhAC394Vhs0NfCyM4HzLDask3/3LzArYnxSPeQqoiQh+vZbQNv9+3AGIa3uhMrrkJSCuGd56wcKDTfXaAqwiy5s7rDok/1Yw8QHoAjRerni2LzpBJ8Zmdkz7mcq7yIILve9g7XA2nLOy1hnuHO6LmcNEHhAKMsgX3wswb32hxDzUyjKyYivOwMt0xf/ppVksKFeCe+FHcOw3YpAZ4n9h0xzeYeI0DcKrigEV4iDeVg8DJZUJdtuhRj2LqLGArrYJ+HMN0Zz6xKGWQ+XFtSuG/zlVFM="
        oritext = "BiWZc2mD+DDgQN39u2rU27VT4ZQC+BU7uglGb1XaHshNpGmJR7/E20vCGxdDum2lY/748Ev84nZork0W+9CZ722o1+mm0/kS23ZLhWdNirc5wwAnuwtoMNoN1ZJIDI/C";
        let obj: Error | object;
        try {
            var plaintext = _decrypt(oritext);
            console.error("plaintext:", plaintext);
            obj = JSON.parse(plaintext);
        } catch (e) {
            obj = e as Error;
        }
    }

    EventManager.on('httpDidLoad', (name, args) => {
        const callback = _callbackMap[args.tag];
        if (callback === null || callback === undefined) {
            return;
        }

        delete _callbackMap[args.tag];
        callback(args.success, args.response);
    });

    export function loadJson(url: string, callback: (obj: Error | object) => any, shouldDecrypt: boolean, maxRetryCount: number = 2): void {
        assetManager.loadAny({url: url, ext: '.txt', maxRetryCount: maxRetryCount}, (error, textAsset) => {
            let obj: Error | object;

            if (error || !textAsset) {
                obj = error ?? new Error('Unknown error: asset is null');
                obj = new Error(obj.toString() + `|||| ${url}`);
            } else {
                let plaintext = textAsset;

                try {
                    if (shouldDecrypt) {
                        plaintext = _decrypt(textAsset);
                    }

                    obj = JSON.parse(plaintext);
                } catch (e) {
                    obj = e as Error;
                    obj = new Error(obj.toString() + `&&&& ${url}`);
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
