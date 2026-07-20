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

import {Asset} from "cc";

class AppVarCls {
    miniVer: string;
    systemConfigUrl: string = `http://qipaiplay.com/systemConfig.json`
    /**系统配置 */
    systemConfig: any;
    /**公告信息 */
    noticeConf: any;
    downloadUrl: string = "";
    localVer: string;
    remoteVersion: string;
    /**本地绑定的版本信息 */
    manifestUrl: Asset;

    serverUrl: string = "";
    /**远端版本号地址 */
    public remoteVerUrl: string = ``;

    isInReview: boolean = false;

    /**
     * 官方测试/正式服挂了（502）时：本地伪造验证码与登录，仅用于看大厅/3D。
     * 不能联机对战。
     */
    public offlineAuth: boolean = true;

    public get version(): string {
        return this.remoteVersion || this.localVer || `1.0.0`;
    }

    public get isRelease(): boolean {
        // false = 测试服地址；offlineAuth 为 true 时根本不请求远端
        return false;
    }

    public get isPublishingOnPlatform(): boolean {
        return false;
    }
}

export let AppVar = new AppVarCls();
window[`AppVar`] = AppVar;