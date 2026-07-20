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

import {_decorator, Label, Node, Toggle, ToggleContainer} from "cc";
import {BaseView} from "../../framework/ui/BaseView";
import {LoginEnity} from "../../Home/Entity/Login";
import {eSysId, ViewMgr} from "../../framework/mgr/ViewMgr";
import {UiPopupHelper} from "../../framework/utils/UiPopupHelper";
import {eRecordTab, ProrfileViewTabContentPref} from "./ProrfileViewTabContentPref";
import {RoleCtrl} from "../role/RoleCtrl";
import {ItemCom} from "../UICommpont/ItemCom";
import {ClubCtrl} from "../club/ClubCtrl";
import {CallBack} from "../../framework/utils/CallBack";
import {App} from "../App";

const {ccclass, property} = _decorator;

@ccclass("ProrfileViewPref")
export class ProrfileViewPref extends BaseView {
    /**头像 */
    public roleImg: Node;
    public roleItemCom: ItemCom;
    /**角色名称 */
    public nameLB: Label;
    /**角色ID */
    public idLB: Label;
    /**类型TAB */
    public previewTab: ToggleContainer;
    /**雀的场 */
    public YiPreviewToggle: Toggle;
    /**友人场 */
    public NewBirdToggle: Toggle;
    /**改名 */
    public editSprite: Node;

    public prorfileViewTabContentPref: ProrfileViewTabContentPref;

    private previewTabName: string;
    private curIdx: number;

    constructor() {
        super();
        this.skinName = `prefab/prorfile/ProrfileViewPref`;
    }


    public initUI(): void {
        UiPopupHelper.fadeIn(this.nodePicker.getChildNode("content"), 0, -500);

        this.prorfileViewTabContentPref = new ProrfileViewTabContentPref(this.getChildNode("ProrfileViewTabContentPref"));

        this.nameLB = this.getChildNode("nameLB").getComponent(Label);
        this.nameLB.string = LoginEnity.nickName;

        this.idLB = this.getChildNode("idLB").getComponent(Label);
        this.idLB.string = LoginEnity.accountID;

        this.YiPreviewToggle = this.getChildNode("YiPreviewToggle").getComponent(Toggle);
        this.NewBirdToggle = this.getChildNode("NewBirdToggle").getComponent(Toggle);
        this.previewTab = this.getChildNode(`previewTab`).getComponent(ToggleContainer);
        this.previewTab.node.children.forEach(tmpNode => {
            tmpNode.on(Toggle.EventType.CLICK, this._onPreviewTabChange, this);
        })

        this.editSprite = this.getChildNode("editSprite");
        this.editSprite.on(Node.EventType.TOUCH_END, this.onEditSpriteTouch, this);

        this.roleImg = this.getChildNode("roleImg");
        this.roleItemCom = this.roleImg.getComponent(ItemCom);
        this.roleImg.on(Node.EventType.TOUCH_END, this.onRoleImgTouch, this);
        this.bSending = false;
    }

    public open(...params: any[]): void {
        this.onEvent(RoleCtrl.ROLE_NAME_UPDATE, this._updateNickName, this);
        this._onPreviewTabChange(this.YiPreviewToggle);
        this.onEvent(RoleCtrl.ROLE_ICON_UPDATE, this.updateRoleIcon, this);
        this.updateRoleIcon();
    }

    private updateRoleIcon(): void {
        this.roleItemCom.updateData(Number(LoginEnity.avatarTID));
    }

    private _updateNickName(): void {
        this.nameLB.string = LoginEnity.nickName;
    }

    private bSending: boolean;

    private showPreViewTab(str: string): void {
        if (this.bSending) return;
        switch (str) {
            case `YiPreviewToggle`:
                this.curIdx = eRecordTab.club;
                break;
            case `NewBirdToggle`:
                this.curIdx = eRecordTab.friend;
                break;
        }

        //请求对应的数据
        this.bSending = true;
        App.getInst(ClubCtrl).GetPlayerInfoReq(LoginEnity.playerID, this.curIdx, new CallBack(() => {
            this.prorfileViewTabContentPref.showTab(this.curIdx);
            this.previewTabName = str;
            this.bSending = false;
        }, this))
    }

    public _onPreviewTabChange(target: Toggle): void {
        let name = target.node.name;
        if (this.previewTabName == name) return;
        this.showPreViewTab(name);
    }

    public onEditSpriteTouch(): void {
        App.getInst(ViewMgr).open(eSysId.SetNameUIPref);
    }

    public onRoleImgTouch(): void {
        App.getInst(ViewMgr).open(eSysId.SetRoleIconPref, null);
    }
}