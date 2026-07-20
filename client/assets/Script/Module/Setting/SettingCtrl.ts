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

import {director} from "cc";
import {Singleton} from "../../framework/mgr/Singleton";
import {ICtrl} from "../../framework/mgr/CtrlMgr";

export class SettingCtrl extends Singleton implements ICtrl {
    /** 设置*/
    private settingMap: Map<eSettingKey, any>;
    /**数据是否发生了改变（需要出发保存的时候，可以作为依据） */
    private bChange: boolean;

    /**
     * 获取设置对应的消息(函数根据传入的key生成对应的消息名，从而发送更精确的消息)
     * @param key
     * @returns
     */
    public static getSettingEvent(key: eSettingKey): string {
        return `Update_Setting_${eSettingKey[key]}_Change`;
    }

    /**
     * 初始化设置/读取上一次保存的设置
     */
    public init(): void {
        this.settingMap = new Map<eSettingKey, any>();
        this.set(eSettingKey.Sound, 1, false);
        this.set(eSettingKey.Music, 1, false);
        this.set(eSettingKey.Shock, 0, false);
        this.set(eSettingKey.operationType, 2, false);
        this.set(eSettingKey.bSettingPWd, 0, false);
    }

    /**
     *
     * @param key 设置key
     * @param value 值
     * @param bSendEvent 是否通知变更
     */
    public set(key: eSettingKey, value: any, bSendEvent: boolean = true): void {
        let pre = this.settingMap[key];
        if (pre == value) return;
        this.settingMap[key] = value;
        console.log(`设置变更:${eSettingKey[key]} : ${value}`);
        if (!bSendEvent) return;
        this.bChange = true;
        director.emit(SettingCtrl.getSettingEvent(key));
    }

    /**
     * 获取设置的值
     * @param key
     * @returns
     */
    public get(key: eSettingKey): any {
        return this.settingMap[key];
    }

    /**
     * 保存设置
     */
    public clientSaveSetting(): void {
        if (!this.bChange) return;
        console.log("前端设置保存");
        //todo 这里可以将数据保存到本地缓存，也可以和服务器通信，保存到服务器去
        this.bChange = false;
    }

    clearCache(): void {

    }
}

export enum eSettingKey {
    Sound,          //声音
    Music,    //音效
    Shock,          //震动
    operationType,  //操作方式 1双击出牌  2拖拽出牌
    bSettingPWd,    //是否设置过密码
}