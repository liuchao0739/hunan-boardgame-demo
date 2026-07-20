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

import {_decorator, Button, EditBox, Label, Node, Toggle, ToggleContainer} from 'cc';
import {ClubEntity} from '../../Home/Entity/ClubEntity';
import {LoginEnity} from '../../Home/Entity/Login';
import {ToastUI} from '../../Home/Ui/ToastUI';
import {PlainHTTPEventManager} from '../../framework/event/event-management';
import {PlainHTTPManager} from '../../framework/network/http';
import {BaseView} from '../../framework/ui/BaseView';
import {App} from '../App';
import List from '../UICommpont/ListView/List';
import {ClubShareItemPref} from './ClubShareItemPref';

const {ccclass, property} = _decorator;

@ccclass('ClubShareListPref')
export class ClubShareListPref extends BaseView {

    private declare _backButtonNode: Node;

    private declare _tabToggleContainer: ToggleContainer;
    private declare _directTabToggle: Toggle;
    private declare _indirectTabToggle: Toggle;

    private declare _promotionNumberLabel: Label;
    private declare _searchEditBox: EditBox;
    private declare _searchClearButtnNode: Node;

    private declare _itemList: List;

    private declare _isDirect: boolean;

    private declare _currentSearchContent: string;

    constructor() {
        super();
        this.skinName = `prefab/club/ClubShareListPref`;
    }

    public initUI(): void {
        this._backButtonNode = this.root.getChildByPath('Root/TopBarSprite/BackButton');

        this._tabToggleContainer = this.root.getChildByPath('Root/SideBarSprite/ToggleGroup').getComponent(ToggleContainer);
        this._directTabToggle = this.root.getChildByPath('Root/SideBarSprite/ToggleGroup/Toggle1').getComponent(Toggle);
        this._indirectTabToggle = this.root.getChildByPath('Root/SideBarSprite/ToggleGroup/Toggle2').getComponent(Toggle);

        this._promotionNumberLabel = this.root.getChildByPath('Root/MainBodySprite/TopBarSprite/PromotionNumberLabel').getComponent(Label);
        this._searchEditBox = this.root.getChildByPath('Root/MainBodySprite/TopBarSprite/SearchSprite/SearchEditBox').getComponent(EditBox);
        this._searchClearButtnNode = this.root.getChildByPath('Root/MainBodySprite/TopBarSprite/SearchSprite/SearchClearButton');

        this._itemList = this.root.getChildByPath('Root/MainBodySprite/ScrollView').getComponent(List);

        this._backButtonNode.on(Button.EventType.CLICK, this.closeSelf, this);
        this._searchEditBox.node.on(EditBox.EventType.EDITING_DID_ENDED, this._onSearchEditBoxEditingDidEnd, this);
        this._searchClearButtnNode.on(Button.EventType.CLICK, this._onSearchClearButtonClick, this);

        this._tabToggleContainer.node.children.forEach(node => node.on(Toggle.EventType.TOGGLE, this._onTabToggleCheck, this));

        this._promotionNumberLabel.node.active = false;

        this._itemList.setItemRender(ClubShareItemPref);
    }

    public open(...params: any[]): void {
        PlainHTTPEventManager.on('promotionDirectList', this._onPromotionDirectListRespond, this);
        PlainHTTPEventManager.on('promotionIndirectList', this._onPromotionIndirectListRespond, this);

        this._isDirect = true;
        this._currentSearchContent = '';

        this._updateList();
    }

    protected _beforeClose(): void {
        PlainHTTPEventManager.off('promotionDirectList', this._onPromotionDirectListRespond, this);
        PlainHTTPEventManager.off('promotionIndirectList', this._onPromotionIndirectListRespond, this);
    }

    private _updateList(): void {
        this._promotionNumberLabel.node.active = false;

        this._itemList.setData([]);

        if (this._isDirect) {
            PlainHTTPManager.load('promotionDirectList', {
                user_id: LoginEnity.playerID,
                club_id: ClubEntity.recentClubID,
                name: this._currentSearchContent,
                limit: 9999,
                offset: 0,
                order: 1,
            });
        } else {
            PlainHTTPManager.load('promotionIndirectList', {
                user_id: LoginEnity.playerID,
                club_id: ClubEntity.recentClubID,
                name: this._currentSearchContent,
                limit: 9999,
                offset: 0,
                order: 1,
            });
        }
    }

    private _onTabToggleCheck(): void {
        const toggleItems = this._tabToggleContainer.toggleItems;

        for (const toggle of toggleItems) {
            if (!toggle.isChecked) {
                continue;
            }

            const preIsDirect = this._isDirect;

            this._isDirect = toggle !== this._indirectTabToggle;

            if (this._isDirect !== preIsDirect) {
                this._updateList();
            }

            break;
        }
    }

    private _onSearchEditBoxEditingDidEnd(): void {
        const previousSearchContent = this._currentSearchContent;
        this._currentSearchContent = this._searchEditBox.string;

        if (this._currentSearchContent === previousSearchContent) {
            return;
        }

        this._updateList();
    }

    private _onSearchClearButtonClick(button: Button): void {
        const previousSearchContent = this._currentSearchContent;

        this._currentSearchContent = this._searchEditBox.string = '';

        if (this._currentSearchContent === previousSearchContent) {
            return;
        }

        this._updateList();
    }

    private _onPromotionDirectListRespond(event: PlainHTTPEventManager.IPlainHTTPEvent<'promotionDirectList'>): void {
        if (!event.success || event.response?.code !== 1) {
            App.getInst(ToastUI).showTips("请求直属推广数据失败");
            return;
        }

        if (!this._isDirect) {
            return;
        }

        const promotionNum = event.response?.data?.total;
        if (typeof promotionNum === 'number') {
            this._promotionNumberLabel.string = `已推广人数：${promotionNum}`;
            this._promotionNumberLabel.node.active = true;
        }

        const itemDatas = event.response?.data?.list;
        if (!itemDatas) {
            return;
        }

        this._itemList.setData(itemDatas);
    }

    private _onPromotionIndirectListRespond(event: PlainHTTPEventManager.IPlainHTTPEvent<'promotionIndirectList'>): void {
        if (!event.success || event.response?.code !== 1) {
            App.getInst(ToastUI).showTips("请求间接推广数据失败");
            return;
        }

        if (this._isDirect) {
            return;
        }

        const itemDatas = event.response?.data.list;
        if (!itemDatas) {
            return;
        }

        this._itemList.setData(itemDatas);
    }

}
