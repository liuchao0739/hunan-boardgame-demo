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

/**
 * 热更新管理器,只在native环境中生效
 */
import {game, native, sys} from "cc";
import {Singleton} from "../../framework/mgr/Singleton";
import {CallBack} from "../../framework/utils/CallBack";
import {AppVar} from "../AppVar";
import {eSysId, ViewMgr} from "../../framework/mgr/ViewMgr";
import {RemoteConfigLoader} from "../../framework/utils/remote-config-loader";
import {App} from "../App";

const jsb = (<any>window).jsb;

export class HotUpdateMgr extends Singleton {
    public jsb: any;
    private _updating = false;
    private _canRetry = false;
    private _storagePath = '';
    private _am: native.AssetsManager = null!;
    private _checkListener = null;
    private _updateListener = null;
    private _failCount = 0;
    public versionCompareHandle: (versionA: string, versionB: string) => number = null!;
    /**最低支持的版本好，如果小于这个版本，则需要整包更新 */
    public miniVer: string;


    public init(jsb): void {
        this.jsb = jsb;
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'blackjack-remote-asset');
        console.log('Storage path for remote asset : ' + this._storagePath);

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        this.versionCompareHandle = function (versionA: string, versionB: string) {
            console.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || '0');
                if (a === b) {
                    continue;
                } else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            } else {
                return 0;
            }
        };

        // Init with empty manifest url for testing custom manifest
        this._am = new native.AssetsManager('', this._storagePath, this.versionCompareHandle);
        // var panel = this.panel;
        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback(function (path: string, asset: any) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                // panel.info.string = "Verification passed : " + relativePath;
                return true;
            } else {
                // panel.info.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
                return true;
            }
        });

        // this.panel.info.string = 'Hot update is ready, please check or directly update.';
        // this.panel.fileProgress.progress = 0;
        // this.panel.byteProgress.progress = 0;
    }

    /**
     * 下载后台的配置
     */
    loadServerConf() {
        return new Promise((resolve, reject) => {
            RemoteConfigLoader.loadJsonUsingHTTP(AppVar.systemConfigUrl + `?t=${(new Date).getTime()}`, (obj) => {
                if (obj instanceof Error) {
                    reject(obj);
                } else {
                    AppVar.systemConfig = obj;
                    console.log(JSON.stringify(obj));
                    AppVar.serverUrl = AppVar.systemConfig.server_address;
                    //使用远端的配置地址
                    let key = `${sys.platform}_mhr_url`.toLowerCase();
                    if (obj[key] && obj[key].length) {
                        AppVar.remoteVerUrl = obj[key] + "/";
                    }
                    console.log(`远端平台${key}`, AppVar.remoteVerUrl);
                    resolve(``);
                }
            }, false);
        });
    }

    loadNoticeConf() {
        return new Promise((resolve, reject) => {
            let notice_url = AppVar.systemConfig.notice_url;
            RemoteConfigLoader.loadJsonUsingHTTP(notice_url + `?t=${(new Date).getTime()}`, (obj) => {
                if (obj instanceof Error) {
                    reject();
                } else {
                    AppVar.noticeConf = obj;
                    resolve(``);
                }
            }, true);
        });
    }

    async loadNativeManifest(url: string) {
        return new Promise((resolve, reject) => {
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                console.log("start nativeUrl:", url);
                this._am.loadLocalManifest(url);
            }
            let manifest = this._am.getLocalManifest();
            let remoteUrl;
            if (manifest) {
                let ver = manifest.getVersion();
                console.log("native version:", ver);
                AppVar.localVer = ver;
                console.log("packageUrl", manifest.getPackageUrl());
                remoteUrl = manifest.getManifestFileUrl();
                console.log("remote versionUrl:", remoteUrl);
                this.loadRemoteManifest(remoteUrl + `?t=${(new Date().getTime())}`, new CallBack((remoteManifest) => {
                    if (remoteManifest) {
                        resolve(remoteUrl);
                    } else {
                        console.log("RemoteManifest is null");
                        reject();
                    }
                }, this));
            } else {
                console.log("NativeManifest is null");
                reject();
            }
        })
    }

    loadRemoteManifest(remoteUrl, cb: CallBack) {
        console.log("load remote versionUrl:", remoteUrl);

        RemoteConfigLoader.loadJsonUsingHTTP(remoteUrl, (json) => {
            let manifest = null;
            if (json instanceof Error) {
            } else {
                const jsonContent = JSON.stringify(json);
                const localManifest = new native.Manifest(jsonContent, this._storagePath);

                this._am.loadLocalManifest(localManifest, this._storagePath);
                manifest = this._am.getRemoteManifest();
                let remoteV = manifest.getVersion();
                console.log("remoteV::::::", remoteV);
            }
            cb.exe(manifest);
        }, false);
    }

    private checkUpdateResolveCb: CallBack;
    private checkUpdateRejectCb: CallBack;

    checkUpdate() {
        return new Promise((resolve, reject) => {
            this.checkUpdateResolveCb = new CallBack((str) => {
                this._updating = false;
                this.checkUpdateRejectCb = null;
                this.checkUpdateResolveCb = null;
                resolve(str);
            }, this);

            this.checkUpdateRejectCb = new CallBack((str) => {
                console.error(str);
                this._updating = false;
                this.checkUpdateRejectCb = null;
                this.checkUpdateResolveCb = null;
                reject(str);
            }, this);


            if (this._updating) {
                this.checkUpdateRejectCb?.exe('Checking or updating ...');
                return;
            }

            if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
                this.checkUpdateRejectCb?.exe('Failed to load local manifest ...');
                return;
            }

            //判断是否需要整包更新（本地版本低于服务器设置的最小本版，就会要求整包更新）
            if (AppVar.miniVer && AppVar.miniVer.length) {
                let verState = this.versionCompareHandle(AppVar.localVer, AppVar.miniVer);
                if (verState < 0) {
                    App.getInst(ViewMgr).open(eSysId.HotUpdatePref);
                    return;
                }
            }

            this._am.setEventCallback(this.checkCb.bind(this));
            console.log("开始比对版本=======");
            this._am.checkUpdate();
            this._updating = true;
        });
    }


    checkCb(event: any) {
        console.log('Code: ' + event.getEventCode());
        let hasNew = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.checkUpdateRejectCb?.exe("找不到本地manifest文件,终止更新");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.checkUpdateRejectCb?.exe("远程manifest文件丢失,终止更新");
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.checkUpdateResolveCb?.exe("已经更新到最新了");
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                let updateBytes = this._am.getTotalBytes()
                console.log('New version found, please try to update. (' + Math.ceil(updateBytes / 1024) + 'kb)');
                hasNew = updateBytes > 0;
                if (!hasNew) {
                    this.checkUpdateResolveCb?.exe("与上个版本没有差异");
                }
                // this.panel.checkBtn.active = false;
                // this.panel.fileProgress.progress = 0;
                // this.panel.byteProgress.progress = 0;
                break;
            default:
                return;
        }


        this._am.setEventCallback(null!);
        this._checkListener = null;
        this._updating = false;
        hasNew && this.hotUpdate();
    }

    hotUpdate() {
        if (this._am && !this._updating) {
            this._am.setEventCallback(this.updateCb.bind(this));

            this._failCount = 0;
            this._am.update();
            this._updating = true;
        }
    }


    /**进度条更新方法 */
    public progressUpdateCB: CallBack;

    updateCb(event: any) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log('No local manifest file found, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                // this.panel.byteProgress.progress = event.getPercent();
                // this.panel.fileProgress.progress = event.getPercentByFile();

                // this.panel.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                // this.panel.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                // console.log(this.panel.fileLabel.string, this.panel.byteLabel.string);
                // var msg = event.getMessage();
                // if (msg) {
                // this.panel.info.string = 'Updated file: ' + msg;
                // log(event.getPercent() / 100 + '% : ' + msg);

                // }
                this.progressUpdateCB.exen(event.getPercent(), "");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log('Fail to download manifest file, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log('Already up to date with the latest remote version.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                console.log('Update finished. ' + event.getMessage());
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                console.error('Update failed. ' + event.getMessage());
                // this.panel.retryBtn.active = true;
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                console.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                console.error(`ERROR_DECOMPRESS`, event.getMessage());
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null!);
            this._updateListener = null;
            this._updating = false;
        }

        if (needRestart) {
            this._am.setEventCallback(null!);
            this._updateListener = null;
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            // restart game.
            setTimeout(() => {
                game.restart();
            }, 1000)
        }
    }
}