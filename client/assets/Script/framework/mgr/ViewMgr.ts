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

import {find, js, Node, Prefab, resources} from "cc";
import {PrefabCache} from "../cache/PrefabCache";
import {BaseView} from "../ui/BaseView";
import {Singleton} from "./Singleton";

export enum eSysId {
    "SettingViewPraf",
    "ChangePhoneViewPref",
    "ChangePassViewPref",
    "YiTypePreviewViewPref",
    "ProrfileViewPref",
    "SetNameUIPref",
    "SetRoleIconPref",
    "ClubStorePref",
    "ToastUIPref",
    "ClubWeBaoPref",
    "ClubMoneyHistoryPref",
    "CommonDialog",
    "SelectPaymentPref",
    "ClubBuyPanelPref",
    "HotUpdatePref",
    "ClubShopRecordPref",
    "DatePicker",
    "FengGeHelpPref",
    "NoticeDialogPref",
    "StorePref",
    "ClubSharePref",
    "ClubShareRulePref",
    "ClubShareListPref",
    "ClubShareDataPref",
    "ClubShareAdPref",
    "BirdGodMatchPref",
    "BirdGodGoldPref",
    "BirdGodRulePref"
}

export enum eLayer {
    uiModuleLayer,  //模块层
    popUpWinLayer,  //弹窗层
}

/**
 * 用于处理UI界面的加载-》弹出-》关闭
 */
export class ViewMgr extends Singleton {
    private _viewDic = {};
    private _hideViews = {};
    private _openedViews = [];

    /**模块层 */
    private _layer = {};

    public addLayer(layerName: eLayer, ins: Node): void {
        if (!this._layer) this._layer = {};
        this._layer[layerName] = ins;
    }

    public getLayer(layerName: eLayer): Node {
        const node = this._layer[layerName];
        // 切场景后旧节点会销毁，不能再当父节点用
        if (node && (node as Node).isValid) {
            return node as Node;
        }
        return null;
    }

    /** 解析可用的挂载父节点 */
    private resolveParent(viewParent?: Node): Node {
        if (viewParent && viewParent.isValid) {
            return viewParent;
        }
        const layer = this.getLayer(eLayer.uiModuleLayer);
        if (layer) {
            return layer;
        }
        const popup = this.getLayer(eLayer.popUpWinLayer);
        if (popup) {
            return popup;
        }
        // Canvas 不在 scene 根下，需 find
        const canvas = find("Canvas");
        if (canvas && canvas.isValid) {
            const uiModule = canvas.getChildByPath("UiModuleWin");
            if (uiModule && uiModule.isValid) {
                this.addLayer(eLayer.uiModuleLayer, uiModule);
                return uiModule;
            }
            return canvas;
        }
        return null;
    }

    /**
     * 弹出界面
     * @param iViewConf 界面配置
     * @param viewParams 给界面传入初始参数（选填)
     * @param closeFunc 关闭界面时的回调函数
     * @param closeFuncObj 回调函数实例
     * @returns
     */
    public open<T extends BaseView>(sysId: eSysId, viewParams?: any[], viewParent?: Node, closeFunc?: Function, closeFuncObj?: any): T {
        let viewName = eSysId[sysId];
        let viewClz = js.getClassByName(viewName);
        let clz = viewClz;
        console.log(`${viewName} call open function`);

        let view = this._viewDic[viewName];
        let tarParent = this.resolveParent(viewParent);
        if (!tarParent) {
            console.error(`[ViewMgr] open ${viewName} failed: no valid parent`);
            return null;
        }
        if (view) {
            view.viewParent = tarParent;
            this._open(view, viewParams, closeFunc, closeFuncObj);
            return view;
        }

        view = new clz();
        view.viewParent = tarParent;
        this._openedViews.push(view);
        this._viewDic[viewName] = view;
        let prefabPath = view.skinName;
        let temp = prefabPath.split("/");
        //先去读取缓存
        let file = temp[temp.length - 1];

        let prefab = PrefabCache.getPrefab(file);
        if (prefab) {
            view.setUIPref(prefab);
            this._open(view, viewParams, closeFunc, closeFuncObj);
        } else {
            //开启下载
            resources.load(prefabPath, Prefab, (err, data) => {
                if (err || !data) {
                    console.error(`[ViewMgr] load prefab failed: ${prefabPath}`, err);
                    delete this._viewDic[viewName];
                    const idx = this._openedViews.indexOf(view);
                    if (idx !== -1) this._openedViews.splice(idx, 1);
                    return;
                }
                console.log(`${viewName}下载完毕`);
                // 异步回来时重新解析父节点（可能已切场景）
                view.viewParent = this.resolveParent(viewParent);
                if (!view.viewParent) {
                    console.error(`[ViewMgr] open ${viewName} failed after load: no valid parent`);
                    return;
                }
                view.setUIPref(data);
                this._open(view, viewParams, closeFunc, closeFuncObj);
            })
        }

        return view;
    }


    private _open(view: BaseView, viewParams: any[], closeFunc?: Function, closeFuncObj?: any) {
        //隐藏同层级的其他界面
        let preView = this.getTopView(view.viewParent);
        if (preView && view.viewKey != preView.viewKey && preView.isShow()) {
            this.hideView(preView);
        }

        closeFunc && view.setCloseCb(closeFunc, closeFuncObj);
        view.reActive();
        view.initUI();
        view.bInited = true;
        view.addToParent();

        console.log(`${view.viewKey}UI初始化完毕`);
        let params = viewParams || [];
        view.open(...params);
        if (view.openCB) {
            view.openCB.exe();
            view.openCB = null;
        }
        console.log(`${view.viewKey}UI open完毕`);
    }

    private hideView(view: BaseView): void {
        this._hideViews = this._hideViews || {};
        view.hideView();

        let parentName = view.viewParent.uuid;
        let arr = this._hideViews[parentName] || [];

        let idx = arr.indexOf(view);
        if (idx == -1) {
            arr.push(view);
            this._hideViews[parentName] = arr;
        }
    }

    private getTopView(parant: Node): BaseView {
        for (let len = this._openedViews.length, i = len - 1; i >= 0; i--) {
            let view = this._openedViews[i];
            if (view.bInited && view.viewParent == parant) {
                return view;
            }
        }
        return null;
    }

    /**
     * 当前方法取出后，会直接移除
     * @param parent
     * @returns
     */
    private getPreHideView(parent): BaseView {
        if (!parent) return null;
        let arr = this._hideViews[parent.uuid] || [];
        for (let len = arr.length, i = len - 1; i >= 0; i--) {
            let view = arr[i];
            if (view.viewParent == parent) {
                arr.splice(i, 1);
                return view;
            }
        }
        return null;
    }


    public getView(sysId: eSysId): BaseView {
        return this._viewDic[eSysId[sysId]];
    }

    /**
     * 关闭界面
     * @param viewKey
     * @returns
     */
    public closeView(viewKey: string): void {
        let view = this._viewDic[viewKey];
        if (!view) {
            return;
        }

        let root = view.root as Node;
        root.active = false;
        root.parent?.removeChild(view.root);
        console.log(`${viewKey}界面关闭`);
        delete this._viewDic[viewKey];
        let idx = this._openedViews.indexOf(view);
        if (idx != -1) {
            this._openedViews.splice(idx, 1);
        }

        //提前取出parent句柄，不然调用view.close()以后view里面就清掉了
        let preView = this.getPreHideView(view.viewParent);
        view.close(this);
        view.behindCloseCb();

        //假如当前层隐藏过弹窗，则显示之前隐藏了的弹窗
        preView?.reActive();
    }

    public closeAll(): void {
        for (let key in this._viewDic) {
            let view = this._viewDic[key];
            this.closeView(view.viewKey);
        }
        this._viewDic = {};
        this._hideViews = {};
        this._openedViews = [];

        this._layer = {};
    }
}

export function removeSelf(node: Node): void {
    if (!node.parent) return;
    node.parent.removeChild(node);
}