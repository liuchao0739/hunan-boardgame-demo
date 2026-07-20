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

import {_decorator, Node} from "cc";
import {BaseView} from "../../framework/ui/BaseView";
import List from "../UICommpont/ListView/List";
import {RoleIconPrefItemRender} from "./RoleIconPrefItemRender";
import {RoleCtrl} from "../role/RoleCtrl";
import {LoginEnity} from "../../Home/Entity/Login";
import {BagCtrl, IBagInfo} from "../bag/BagCtrl";
import {ArrayUtils} from "../../framework/utils/array-utils";
import {App} from "../App";

const {ccclass, property} = _decorator;

@ccclass("SetRoleIconPref")
export class SetRoleIconPref extends BaseView {
    public list: List;
    public contentView: Node;
    public changBTN: Node;
    public roleIconList: IBagInfo[];

    constructor() {
        super();
        this.skinName = `prefab/prorfile/SetRoleIconPref`;
    }

    public initUI(): void {
        this.list = this.getChildNode(`contentView`).getComponent(List);
        this.list.setItemRender(RoleIconPrefItemRender);
        this.changBTN = this.getChildNode(`changBTN`);
        this.changBTN.on(Node.EventType.TOUCH_END, this.onChangeBtnTouch, this);
        this.list.node.on(List.ON_SELECT_CHANGE, this.onSelectedChange, this);
    }

    public open(...params: any[]): void {
        let arr = this.roleIconList = App.getInst(BagCtrl).getItemsByType(13);
        console.log("====open arr:", arr)
        this.list.setData(arr);
        this.onEvent(RoleCtrl.ROLE_ICON_UPDATE, this.onUpdateRoleIcon, this);
        this.onUpdateRoleIcon();
    }

    private onChangeBtnTouch(): void {
        let vo: IBagInfo = this.list.selectData;
        App.getInst(RoleCtrl).setAvatarInfo(Number(LoginEnity.accountID), vo.itemId);
    }

    private onSelectedChange(idx: number): void {
        console.log("选中:", this.list.selectData);
    }

    private onUpdateRoleIcon(): void {
        let idx = ArrayUtils.getIndexByKey(this.roleIconList, `itemId`, LoginEnity.avatarTID);
        this.list.selectIndex = idx;
    }

}