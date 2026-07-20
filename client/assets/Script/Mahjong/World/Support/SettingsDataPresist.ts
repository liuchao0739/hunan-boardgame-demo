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

import {sys} from "cc";
import {SoundEffect, SoundMusic} from "./Audio";

export class SettingsData {

    // 1、自动和牌（和），开启后，摸到听的牌后自动和牌，该牌同时满足吃、碰、杠、和时，自动和牌；

    // 2、不吃碰杠（鸣），开启后，摸牌满足吃、碰、杠时，不显示吃、碰、杠提示；

    // 3、摸切手牌（切），开启后，将摸回来的牌自动切出去，当摸牌符合明杠、暗杠、和牌时，会显示杠、和选项，不会自动切出去；符合吃、碰、大明杠时，会自动切出去；

    public static ins: SettingsData = null;

    // 是否自动和牌。默认关闭
    public isAutoHe = false;
    /*
        是否鸣牌提示。
        如果 true 遇到只有“吃碰杠”的按钮，自动选择过。
        如果有除了“吃碰杠”的其他按钮，就显示其他按钮。
        鸣牌是针对别人打出的牌，自己摸牌加杠或者暗杠是正常提示
        默认关闭
        默认是关闭的，鸣牌关闭时，“出现吃碰杠”
    */
    public mingHint = false;
    // 是否自动模切。摸什么打什么，默认关闭
    public isAutoMoQie = false;

    // 是否处于托管状态
    public isTrustee: boolean = false;

    // 是否已经立直，立直后自动模切
    public isLizhi: boolean = false;
}

// 设置数据持久化
export class SettingsDataPresist {

    public static save() {

        // 音乐
        sys.localStorage.setItem("Music", SoundMusic.enabled ? "true" : "false");
        sys.localStorage.setItem("MusicVolume", SoundMusic.volume.toString());

        // 音效
        sys.localStorage.setItem("Sound", SoundEffect.enabled ? "true" : "false");
        sys.localStorage.setItem("SoundVolume", SoundEffect.volume.toString());

        // 和鸣切不需要获取本地数据
        // sys.localStorage.setItem( "isAutoHe", SettingsData.ins.isAutoHe ? "true" : "false" ) ;
        // sys.localStorage.setItem( "mingHint", SettingsData.ins.mingHint ? "true" : "false" ) ;
        // sys.localStorage.setItem( "isAutoMoQie", SettingsData.ins.isAutoMoQie ? "true" : "false" ) ;

    }

    public static load() {

        SettingsData.ins = new SettingsData();

        // 音乐
        let val = sys.localStorage.getItem("Music");
        if (val != null) {
            SoundMusic.enabled = val == "true" ? true : false
        }
        ;
        val = sys.localStorage.getItem("MusicVolume");
        if (val != null) {
            SoundMusic.volume = Number(val);
        }

        // 音效
        val = sys.localStorage.getItem("Sound");
        if (val != null) {
            SoundEffect.enabled = val == "true" ? true : false
        }
        ;
        val = sys.localStorage.getItem("SoundVolume");
        if (val != null) {
            SoundEffect.volume = Number(val);
        }


        // 和鸣切不需要获取本地数据
        // val = sys.localStorage.getItem( "isAutoHe" ) ;
        // if( val != null ) { SettingsData.ins.isAutoHe = val == "true" ? true : false ; }

        // val = sys.localStorage.getItem( "mingHint" ) ;
        // if( val != null ) { SettingsData.ins.mingHint = val == "true" ? true : false ; }

        // val = sys.localStorage.getItem( "isAutoMoQie" ) ;
        // if( val != null ) { SettingsData.ins.isAutoMoQie = val == "true" ? true : false ; }

        // // 测试
        // SettingsData.ins.isAutoMoQie = true ; 
        // SettingsData.ins.isAutoHe = true ; 
        // SettingsData.ins.mingHint = false ; 

    }

}