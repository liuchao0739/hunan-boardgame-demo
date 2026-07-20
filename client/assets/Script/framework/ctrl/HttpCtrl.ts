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

import {EEventListenerPriority, ProtocolEventManager} from "../event/event-management";
import {Singleton} from "../mgr/Singleton";
import {ProtocolHTTPManager} from "../network/http";
import {EProtocolID} from "../network/protocol-configs";
import {CallBack} from "../utils/CallBack";

export class HttpCtrl extends Singleton {
    public requestServer(eProtocolID: EProtocolID, params: any, respCB?: CallBack, failedCB?: CallBack) {
        return new Promise((resolve, reject) => {
            let func = (event) => {
                ProtocolEventManager.off(eProtocolID, func, this);
                if (!event.success) {
                    reject();
                    failedCB?.exe();
                    return;
                }

                respCB.exe(event.data);
                respCB.free();
                respCB = null;
                resolve(``);
            }
            ProtocolEventManager.on(eProtocolID, func, this, EEventListenerPriority.HIGHER);
            ProtocolHTTPManager.load(eProtocolID, params, false);
        }).catch(() => {
            console.log("http 请求异常,协议号:", eProtocolID);
            //App.getInst(ToastUI).showTips(`http 请求异常,协议号:${eProtocolID}`);
        })
    }
}