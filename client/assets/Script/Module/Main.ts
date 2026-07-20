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

import {_decorator, Asset, assetManager, Component, log, sys} from "cc";
import {ToastUI} from "../Home/Ui/ToastUI";
import {SceneMgr} from "../framework/mgr/SceneMgr";
import {eLayer, eSysId, ViewMgr} from "../framework/mgr/ViewMgr";
import {PlainHTTPManager, ProtocolHTTPManager} from "../framework/network/http";
import {NodePicker} from "../framework/ui/NodePicker";
import {CallBack} from "../framework/utils/CallBack";
import {RemoteConfigLoader} from "../framework/utils/remote-config-loader";
import {App} from "./App";
import {AppVar} from "./AppVar";
import {GameEntrance} from "./GameEntrance";
import {CommonDialog} from "./UICommpont/CommonDialog";
import {HotUpdate} from "./hotUpdate/HotUpdate";
import {HotUpdateMgr} from "./hotUpdate/HotUpdateMgr";

const {ccclass, property} = _decorator;
const jsb = (<any>window).jsb;

enum ELaunchInterruptionType {
    APPLICATION_CONFIG_ERROR,
    UNDER_MAINTENANCE,
    NEW_VERSION_FOUND,
};

@ccclass('Main')
export class Main extends Component {
    /**本地版本文件 */
    @property(Asset)
    manifestUrl: Asset = null!;
    public hotUpdate: HotUpdate;
    public nodePicker: NodePicker;

    protected onLoad(): void {
        log("main init completed...");

        if (jsb?.Device) {
            console.log(`keep screen on`);
            jsb.Device.setKeepScreenOn(true);
        }

        //do test
        // AppVar.miniVer = `1.0.5`;
        if (!this.manifestUrl) {
            console.error("本地manifestUrl没有绑定");
            return;
        }

        if (AppVar.isRelease) {
            AppVar.systemConfigUrl = `http://qipaiplay.com/systemConfig.json`
        } else {
            AppVar.systemConfigUrl = `http://qipaiplay.com/systemConfig.json`
        }
        RemoteConfigLoader.printConfigText();

        ProtocolHTTPManager.setDefaultUrl();
        PlainHTTPManager.init();
        AppVar.manifestUrl = this.manifestUrl;
        this.nodePicker = this.getComponent(NodePicker);
        this.hotUpdate = new HotUpdate(this);
        let root = this.nodePicker.getChildNode("Canvas");
        // game.addPersistRootNode(root);
        let UiModuleWin = root.getChildByPath("loginND");
        App.getInst(ViewMgr).addLayer(eLayer.uiModuleLayer, UiModuleWin);
        App.getInst(ToastUI).toInit(root);
    }

    protected start(): void {
        this.runGame();
        return;
        // if (sys.isBrowser) {
        //     this.runGame();
        //     return;
        // }
        
        // this.loadConfig()
        //     .then(obj => {
        //         if (obj === null || obj === undefined) {
        //             return Promise.reject(ELaunchInterruptionType.APPLICATION_CONFIG_ERROR);
        //         }

        //         const config = obj as { [key: string]: string };
        //         AppVar.systemConfig = config;

        //         const url = config.notice_url;
        //         if (url) {
        //             return this.loadMaintenanceAnnouncement(url);
        //         } else {
        //             return Promise.resolve(null);
        //         }
        //     })
        //     .then(obj => {
        //         if (obj === null || obj === undefined) {
        //             return Promise.resolve();
        //         }

        //         const config: { [key: string]: any } = obj as { [key: string]: any };
        //         if (config.maintain !== true) {
        //             return Promise.resolve();
        //         }

        //         AppVar.noticeConf = config;
        //         App.getInst(ViewMgr).open(eSysId.NoticeDialogPref);
        //         return Promise.reject(ELaunchInterruptionType.UNDER_MAINTENANCE);
        //     })
        //     .then(() => {
        //         return this.loadVersion();
        //     })
        //     .then(version => {
        //         const config = AppVar.systemConfig as { [key: string]: string };

        //         let reviewVersion = '';
        //         let appVersion = '';
        //         let appURL = '';
        //         let appPlatformURL = '';

        //         switch (sys.os) {
        //             case sys.OS.IOS:
        //                 reviewVersion = config.ios_audit ?? '';
        //                 appVersion = config.ios_package ?? '';
        //                 appURL = config.ios_package_url ?? '';
        //                 appPlatformURL = config.ios_package_platform_url ?? '';
        //                 break;

        //             case sys.OS.ANDROID:
        //                 reviewVersion = config.android_audit ?? '';
        //                 appVersion = config.android_package ?? '';
        //                 appURL = config.android_package_url ?? '';
        //                 appPlatformURL = config.android_package_platform_url ?? '';
        //                 break;
        //         }

        //         if (AppVar.isPublishingOnPlatform) {
        //             appURL = appPlatformURL;
        //             AppVar.isInReview = (this._compareVersion(version, reviewVersion) === 0);
        //         } else {
        //             AppVar.isInReview = false;
        //         }

        //         if (!AppVar.isInReview && appVersion && appURL && this._compareVersion(version, appVersion) < 0) {
        //             let view: CommonDialog = App.getInst(ViewMgr).open(eSysId.CommonDialog, [`即将更新最新版本`, new CallBack(() => {
        //                 sys.openURL(appURL);
        //             }, this), null, `发现新版本`], this.node);

        //             view.openCB = new CallBack(() => {
        //                 view.setBtnCnt(1);
        //                 view.resetBtnName(`前往`);
        //             }, this);

        //             return Promise.reject(ELaunchInterruptionType.NEW_VERSION_FOUND);
        //         }

        //         return Promise.resolve();
        //     })
        //     .then(() => {
        //         this.runGame();
        //     })
        //     .catch(reason => {
        //         switch (reason) {
        //             case ELaunchInterruptionType.UNDER_MAINTENANCE:
        //                 break;

        //             case ELaunchInterruptionType.NEW_VERSION_FOUND:
        //                 break;

        //             default:
        //                 let view: CommonDialog = App.getInst(ViewMgr).open(eSysId.CommonDialog, [`加载资源失败`, new CallBack(() => {
        //                     SceneMgr.runScene('db://assets/Scene/Main/MainScene.scene');
        //                 }, this), null, `提示`, true, 1], this.node);

        //                 view.openCB = new CallBack(() => {
        //                     view.resetBtnName(`重试`);
        //                 }, this);

        //                 break;
        //         }
        //     });
    }

    checkPlatform(): Promise<boolean> {
        //判断当前平台
        let localManifest = JSON.parse(this.manifestUrl[`_file`])
        AppVar.localVer = localManifest.version;
        this.hotUpdate.initView();
        let mgr = App.getInst(HotUpdateMgr);

        //下载后台配置
        return mgr.loadServerConf()
            .then(() => {
                this.hotUpdate.setText(`下载后台配置结束`);
            })
            .then(() => {
                return new Promise<boolean>(resolve => {
                    // 这里增加一个通过后台读取服务器地址的过程，如果这句注释掉，就是读取本地设置的服务器地址
                    ProtocolHTTPManager.setServerURL(AppVar.serverUrl);

                    if (!sys.isNative) {
                        resolve(false);
                        return;
                    }

                    let appURL: string | undefined = undefined;

                    if (sys.os === sys.OS.IOS) {
                        if (this._compareVersion(AppVar.localVer, AppVar.systemConfig.ios_package ?? '0') < 0) {
                            appURL = AppVar.systemConfig.ios_package_url ?? undefined;
                        }
                    } else if (sys.os === sys.OS.ANDROID) {
                        if (this._compareVersion(AppVar.localVer, AppVar.systemConfig.android_package ?? '0') < 0) {
                            appURL = AppVar.systemConfig.android_package_url ?? undefined;
                        }
                    }

                    if (appURL !== null && appURL !== undefined && appURL.length > 0) {
                        // 整包更新
                        let view: CommonDialog = App.getInst(ViewMgr).open(eSysId.CommonDialog, [`请往官网更新最新版本`, new CallBack(() => {
                            this.hotUpdate.setText(`发现新版本`);
                            sys.openURL(appURL);
                        }, this), null, `版本更新`], this.node);

                        view.openCB = new CallBack(() => {
                            view.setBtnCnt(1);
                            view.resetBtnName(`前往`);
                        }, this);

                        resolve(true);
                    }

                    resolve(false);
                });
            });
    }

    loadConfig(): Promise<object | null> {
        return new Promise<object | null>(resolve => {
            RemoteConfigLoader.loadJsonUsingHTTP(`${AppVar.systemConfigUrl}?${Date.now()}`, obj => {
                if (obj instanceof Error) {
                    console.error(`[APPLICATION] load app config from "${AppVar.systemConfigUrl}" failed: ${obj.message ?? 'unknown error'}`);
                    resolve(null);
                } else {
                    resolve(obj);
                }
            }, false);
        });
    }

    loadMaintenanceAnnouncement(url: string): Promise<object | null> {
        return new Promise<object | null>(resolve => {
            RemoteConfigLoader.loadJsonUsingHTTP(`${url}?${Date.now()}`, obj => {
                if (obj instanceof Error) {
                    console.error(`[APPLICATION] load maintenance announcement from "${url}" failed: ${obj.message ?? 'unknown error'}`);
                    resolve(null);
                } else {
                    resolve(obj);
                }
            }, false);
        });
    }

    loadVersion(): Promise<string> {
        return new Promise<string>(resolve => {
            const url = assetManager.utils.transform({bundle: 'resources', path: 'version/version', ext: '.manifest'});
            if (typeof url === 'string') {
                const uuid = assetManager.utils.getUuidFromURL(url);
                const nativeURL = assetManager.utils.getUrlWithUuid(uuid, {isNative: true, nativeExt: '.manifest'});
                assetManager.loadAny({url: nativeURL}, {ext: '.json'}, (error, json) => {
                    if (error || !json) {
                        resolve('1.0.0');
                    } else {
                        resolve(json['version']);
                    }
                });
            }
        });
    }

    private runGame(): void {
        // CtrlMgr.ins.initControl();
        console.log("run game......")
        App.getInst(GameEntrance).run(this);
    }

    private _compareVersion(version1: string, version2: string): number {
        let result = 0;

        const versionsGroup1 = version1.split('.');
        const versionsGroup2 = version2.split('.');

        const versionCount = Math.max(versionsGroup1.length, versionsGroup2.length);
        for (let index = 0; index < versionCount; ++index) {
            let number1 = Number.parseInt(versionsGroup1[index] ?? '0');
            let number2 = Number.parseInt(versionsGroup2[index] ?? '0');

            if (Number.isNaN(number1)) {
                number1 = 0;
            }
            if (Number.isNaN(number2)) {
                number2 = 0;
            }

            if (number1 < number2) {
                result = -1;
                break;
            } else if (number1 > number2) {
                result = 1;
                break;
            }
        }

        return result;
    }

    // protected update(dt: number): void {
    //     EventAutoClearSys.ins.update(dt);
    // }
}