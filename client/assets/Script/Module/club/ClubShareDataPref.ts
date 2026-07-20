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

import {_decorator, Button, EditBox, EventTouch, Label, Node} from 'cc';
import {ClubEntity} from '../../Home/Entity/ClubEntity';
import {LoginEnity} from '../../Home/Entity/Login';
import {ToastUI} from '../../Home/Ui/ToastUI';
import {PlainHTTPEventManager} from '../../framework/event/event-management';
import {PlainHTTPManager} from '../../framework/network/http';
import {BaseView} from '../../framework/ui/BaseView';
import {App} from '../App';
import List from '../UICommpont/ListView/List';
import {ClubSharePromoterItemPref} from './ClubSharePromoterItemPref';

const {ccclass, property} = _decorator;

@ccclass('ClubShareDataPref')
export class ClubShareDataPref extends BaseView {

    private declare _backButtonNode: Node;

    private declare _promoterNumberLabel: Label;
    private declare _searchEditBox: EditBox;
    private declare _searchClearButtnNode: Node;

    private declare _sortSpriteNode: Node;
    private declare _sortLabel: Label;
    private declare _sortSelectSpriteNode: Node;

    private declare _itemList: List;

    private declare _currentSearchContent: string;
    private declare _currentSortType: number;

    constructor() {
        super();
        this.skinName = `prefab/club/ClubShareDataPref`;
    }

    public initUI(): void {
        this._backButtonNode = this.root.getChildByPath('Root/TopBarSprite/BackButton');

        this._promoterNumberLabel = this.root.getChildByPath('Root/MainBodySprite/TopBarSprite/PromoterNumberLabel').getComponent(Label);
        this._searchEditBox = this.root.getChildByPath('Root/MainBodySprite/TopBarSprite/SearchSprite/SearchEditBox').getComponent(EditBox);
        this._searchClearButtnNode = this.root.getChildByPath('Root/MainBodySprite/TopBarSprite/SearchSprite/SearchClearButton');

        this._sortSpriteNode = this.root.getChildByPath('Root/MainBodySprite/TopBarSprite/SortSprite');
        this._sortLabel = this.root.getChildByPath('Root/MainBodySprite/TopBarSprite/SortSprite/SortLabel').getComponent(Label);
        this._sortSelectSpriteNode = this.root.getChildByPath('Root/MainBodySprite/SortSelectSprite');

        this._itemList = this.root.getChildByPath('Root/MainBodySprite/ScrollView').getComponent(List);

        this._backButtonNode.on(Button.EventType.CLICK, this.closeSelf, this);
        this._searchEditBox.node.on(EditBox.EventType.EDITING_DID_ENDED, this._onSearchEditBoxEditingDidEnd, this);
        this._searchClearButtnNode.on(Button.EventType.CLICK, this._onSearchClearButtonClick, this);
        this._sortSpriteNode.on(Node.EventType.TOUCH_END, this._onSortTouch, this);
        this._sortSelectSpriteNode.children.forEach(node => node.on(Node.EventType.TOUCH_END, this._onSortItemTouch, this));

        this._promoterNumberLabel.string = '';
        this._sortSelectSpriteNode.active = false;

        this._itemList.setItemRender(ClubSharePromoterItemPref);
    }

    public open(...params: any[]): void {
        PlainHTTPEventManager.on('promoterList', this._onPromoterListRespond, this);

        this._currentSearchContent = '';
        this._currentSortType = 1;

        this._updateList();
    }

    protected _beforeClose(): void {
        PlainHTTPEventManager.off('promoterList', this._onPromoterListRespond, this);
    }

    private _updateList(): void {
        this._promoterNumberLabel.string = '';

        this._itemList.setData([]);

        PlainHTTPManager.load('promoterList', {
            user_id: LoginEnity.playerID,
            club_id: ClubEntity.recentClubID,
            name: '',
            limit: 9999,
            offset: 0,
            order: this._currentSortType,
        });
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

    private _onSortTouch(): void {
        this._sortSelectSpriteNode.active = !this._sortSelectSpriteNode.active;
    }

    private _onSortItemTouch(event: EventTouch): void {
        const item = event.target;
        const index = this._sortSelectSpriteNode.children.indexOf(item);

        this._sortSelectSpriteNode.active = false;

        if (index + 1 === this._currentSortType) {
            return;
        }

        this._currentSortType = index + 1;
        this._sortLabel.string = item.getComponent(Label)?.string ?? '';

        this._updateList();
    }

    private _onPromoterListRespond(event: PlainHTTPEventManager.IPlainHTTPEvent<'promotionDirectList'>): void {
        if (!event.success || event.response?.code !== 1) {
            App.getInst(ToastUI).showTips("请求推荐人数据失败");
            return;
        }

        const promotionNum = event.response?.data?.total;
        if (typeof promotionNum === 'number') {
            this._promoterNumberLabel.string = `推荐人数量：${promotionNum}`;
        }

        const itemDatas = event.response?.data?.list;
        if (!itemDatas) {
            return;
        }

        this._itemList.setData(itemDatas);
    }

}
