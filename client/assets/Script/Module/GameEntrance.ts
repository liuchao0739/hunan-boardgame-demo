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

import {LocalCacheManager} from '../framework/cache/local-cache';
import {CtrlMgr} from '../framework/mgr/CtrlMgr';
import {SceneMgr} from '../framework/mgr/SceneMgr';
import {Singleton} from '../framework/mgr/Singleton';
import {ViewMgr} from '../framework/mgr/ViewMgr';
import {WebSocketMgr} from '../framework/mgr/WebSocketMgr';
import {EventWaiter} from '../framework/ui/EventWaiter';
import {UiMain} from '../Mahjong/Ui/Main/UiMain';
import {App} from './App';
import {Main} from './Main';
import {RoleCtrl} from './role/RoleCtrl';

/**
 * 游戏流程的都在这里处理，方便日后做重连，强更时查看登录流程
 */
export class GameEntrance extends Singleton {
    /**版本对比完毕 */
    static VER_COMPARE_COMPLETED: string = `VER_COMPARE_COMPLETED`;
    public main: Main;
    public eventWaiter: EventWaiter;

    public run(main): void {
        this.main = main;
        this.eventWaiter = new EventWaiter();
        // this.eventWaiter.onEvent(GameEntrance.VER_COMPARE_COMPLETED, this.onVerCompareCompleted, this);

        this.showLogin();
    }

    // private onVerCompareCompleted(): void {
    //     this.showLogin();
    // }

    public showLogin() {
        SceneMgr.runScene("Login", false, null, this);
    }

    public showHome(): void {
        SceneMgr.runScene("Home");
    }

    public logout(): void {
        // 清空所有玩家的数据
        UiMain.ins.playerInfoCollection.clearAllList();
        //to do 清空所有当前可能的缓存数据
        EventWaiter.clearAll();
        App.getInst(RoleCtrl).logout();
        WebSocketMgr.Inst.closeNetWork(true);
        App.getInst(ViewMgr).closeAll();
        CtrlMgr.ins.clearAll();
        // 清空自动登录的token信息
        LocalCacheManager.clear("account");
        SceneMgr.runScene("MainScene");
    }
}
