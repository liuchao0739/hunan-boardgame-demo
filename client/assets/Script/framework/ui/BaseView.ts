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

import {instantiate, js, Node} from "cc";
import {App} from "../../Module/App";
import {ViewMgr} from "../mgr/ViewMgr";
import {CallBack} from "../utils/CallBack";
import {EventWaiter} from "./EventWaiter";
import {NodePicker} from "./NodePicker";

export class BaseView {
    public closeBtn: Node = null;
    public skinName: string;
    public viewKey: string;
    public viewParent: Node;
    public bInited: boolean;
    protected root: Node = null;
    public node: Node = null;
    public nodePicker: NodePicker;
    public eventWaiter: EventWaiter;

    constructor() {
        this.viewKey = js.getClassName(this);
    }

    private mask: Node;

    public setUIPref(pref): void {
        this.root = instantiate(pref);
        if (!this.nodePicker) {
            this.nodePicker = new NodePicker();
            this.nodePicker.root = this.root;
        }
        if (!this.eventWaiter) {
            this.eventWaiter = new EventWaiter();
        }
        let node = this.node = this.getChildNode("Canvas") as Node;
        this.closeBtn = this.getChildNode(`closeBtn`) as Node;
        if (node) {
            this.mask = this.getChildNode(`mask`);
            this.mask?.on(Node.EventType.TOUCH_END, this.onTouchMask, this);
            this.closeBtn?.on(Node.EventType.TOUCH_END, this.closeSelf, this);
        }
    }

    /**
     * 添加全局的事件监听，界面关闭后，监听自动移除
     * @param type
     * @param callback
     * @param thisArg
     * @param once
     * @returns
     */
    protected onEvent(type: string, callback: any, thisArg?: any, once?: boolean): void {
        this.eventWaiter.onEvent(type, callback, thisArg, once);
    }

    private onTouchMask(): void {
        console.log("点击到遮罩层了");
    }

    public reActive(): void {
        !this.root.active && (this.root.active = true);
    }

    public initUI(): void {

    }

    public openCB: CallBack;


    public open(...params): void {

    }

    protected _beforeClose(): void {

    }

    public getChildNode(str: string): Node {
        return this.nodePicker.getChildNode(str);
    }

    public addToParent(): void {
        let viewParent = this.viewParent;

        if (!viewParent || !viewParent.isValid) {
            console.error(`${this.viewKey}无法获取父节点, 显示失败`)
            return;
        }
        if (!this.root || !this.root.isValid) {
            console.error(`${this.viewKey} root 无效, 显示失败`)
            return;
        }
        viewParent.addChild(this.root);
    }

    public hideView(): void {
        this.root.active = false;
    }

    public isShow(): boolean {
        return this.root.active;
    }

    /**
     * 这个方法之提供给ViewMgr调用，其他地方只允许覆写，不允许直接调用
     */
    public close(viewMgr: ViewMgr): void {
        this._beforeClose();
        this.viewParent = null;
        this.nodePicker = null;
        this.eventWaiter?.clearEvent();
    }

    public closeSelf(): void {
        App.getInst(ViewMgr).closeView(this.viewKey)
    }

    public closeCb: Function;
    public closeObj: any;

    public setCloseCb(func: Function, closeFuncObj: any): void {
        this.closeCb = func;
        this.closeObj = closeFuncObj;
    }

    public behindCloseCb(): void {
        if (this.closeCb) {
            this.closeCb.apply(this.closeObj);
        }

        this.closeCb = null;
        this.closeObj = null;
    }
}