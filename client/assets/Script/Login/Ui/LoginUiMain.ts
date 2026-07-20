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

import {director, find, Node} from "cc";
import {ESceneVar, GlobalVar} from "../../GlobalVar";
import {LoginEnity} from "../../Home/Entity/Login";
import {ToastUI} from "../../Home/Ui/ToastUI";
import {App} from "../../Module/App";
import {AppVar} from "../../Module/AppVar";
import {LocalCacheManager} from "../../framework/cache/local-cache";
import {ModuleUIMgr} from "../../framework/mgr/ModuleUIMgr";
import {SceneMgr} from "../../framework/mgr/SceneMgr";
import {eLayer, ViewMgr} from "../../framework/mgr/ViewMgr";
import {TimeUtils} from "../../framework/utils/time-utils";

export class LoginUiMain {
    public static ins: LoginUiMain = new LoginUiMain();

    public root: Node = null;

    public loadingND: Node | null = null;
    public loginND: Node | null = null;
    // 各模块Ui显示层
    public uiModuleMgr: ModuleUIMgr = new ModuleUIMgr();

    public toInit() {
        this.root = find("Canvas");

        this.loadingND = this.root.getChildByPath("loadingND");
        this.loginND = this.root.getChildByPath("loginND");

        App.getInst(ViewMgr).addLayer(eLayer.uiModuleLayer, this.loginND);
        this.uiModuleMgr.toInit(this.loginND);

        App.getInst(ToastUI).toInit(this.root);

        director.preloadScene("Home");

        GlobalVar.currScene = ESceneVar.SCENE_LOAD;

        // 获取TOKEN信息，自动登录(打包时取值，不打包设为null)
        let cacheAccount = null;//
        // 测试服暂时不保存账号，方便测试
        if (AppVar.isRelease) {
            cacheAccount = LocalCacheManager.read('account');//null;//
        } else {
            cacheAccount = null;//LocalCacheManager.read('account');//
        }

        if (cacheAccount && cacheAccount.account.length > 0 && cacheAccount.token.length > 0
            && (cacheAccount.expiration === undefined || cacheAccount.expiration > TimeUtils.getServerTime())) {
            LoginUiMain.ins.loadingND.active = true;

            LoginEnity.account = cacheAccount.account;
            LoginEnity.token = cacheAccount.token;
            LoginEnity.accountID = cacheAccount.accountId;
            LoginEnity.playerID = parseInt(cacheAccount.accountId);
            GlobalVar.willLoadMoudle = null;
            SceneMgr.runScene("Home", false);
        } else {
            LoginUiMain.ins.uiModuleMgr.showLoginUI("PhoneLoginPref", "LoginPhoneUI");
            if (AppVar.offlineAuth) {
                console.warn('[Login] 官方服 502，已启用 offlineAuth：验证码 888888，登录全链路本地伪造');
                setTimeout(() => {
                    App.getInst(ToastUI).showTips('离线模式：验证码 888888，可直接登录进大厅');
                }, 500);
            }
        }
    }

    public toDestroy() {
        console.log("Login main destroy");
    }
}
