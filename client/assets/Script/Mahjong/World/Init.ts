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

import {GlobalVar} from "../../GlobalVar";
import {App} from "../../Module/App";
import {eSettingKey, SettingCtrl} from "../../Module/Setting/SettingCtrl";
import {CmdHandleReconnect} from "../Communication/CmdHandleReconnect";
import {UiMain} from "../Ui/Main/UiMain";
import {OpIndicator} from "./Ctrl/Operation/OpIndicator";
import {SoundEffect, SoundMusic} from "./Support/Audio";
import {GameState} from "./Support/GameState";
import {CardInfo} from "./Support/HandcardOp";
import {PrefabMgr} from "./Support/Prefab";
import {SettingsDataPresist} from "./Support/SettingsDataPresist";
import {WorldNodeInit} from "./Support/WorldNode";

export class Init {

    public static exe() {

        GameState.ins = new GameState();


        SettingsDataPresist.load();

        UiMain.ins.init();

        WorldNodeInit.exe();

        OpIndicator.init();

        // 声音开关
        let mSoundEnable = App.getInst(SettingCtrl).get(eSettingKey.Sound);
        // 音效开关
        let mMusicEnable = App.getInst(SettingCtrl).get(eSettingKey.Music);

        PrefabMgr.init(() => {
            CardInfo.init();
            SoundEffect.init();
            SoundEffect.enabled = mMusicEnable;
            SoundMusic.init();
            SoundMusic.enabled = mSoundEnable;
            SoundMusic.play();
        });

        // 放到大厅去初始化
        // PlayerMgr.ins = new PlayerMgr() ;
        // PlayerMgr.ins.local = new Player() ;

        if (GlobalVar.reconnectData) {
            CmdHandleReconnect.exe(GlobalVar.reconnectData);
            GlobalVar.reconnectData = null;
        } else {
            GlobalVar.loadGameOver = true;
        }

    }

}


