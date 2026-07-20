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

import {Enum, sys} from "cc";
import {CommUtils} from "../utils/CommUtils";

const pageParams = CommUtils.paramsToJson();

export class LocalStorageMgr {
    public static saveItem(key: string, val: string) {
        if (val === null || val === undefined) val = ''
        let device: string = pageParams.device ? `${pageParams.device}_` : '';
        sys.localStorage.setItem(`${device}${key}`, val)
    }

    public static loadItem(key: string) {
        let device: string = pageParams.device ? `${pageParams.device}_` : '';
        let val = sys.localStorage.getItem(`${device}${key}`)
        if (val === null || val === undefined) val = ''
        return val
    }


    // 登录账号
    public static set loginAccount(mAcc: string) {
        this.saveItem(StorageKey.LOGIN_ACCT, mAcc);
    }

    public static get loginAccount(): string {
        return this.loadItem(StorageKey.LOGIN_ACCT);
    }

    // 登录密码
    public static set loginPass(mPass: string) {
        this.saveItem(StorageKey.LOGIN_PASS, mPass);
    }

    public static get loginPass(): string {
        return this.loadItem(StorageKey.LOGIN_PASS);
    }
}

export const StorageKey = Enum({
    // 玩家账号
    LOGIN_ACCT: "LOGIN_ACCT",
    // 玩家密码
    LOGIN_PASS: "LOGIN_PASS",
});
