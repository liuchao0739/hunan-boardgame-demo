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

import {_decorator, Label, Node, resources, Sprite, SpriteFrame} from "cc";
import {ItemTableTemplate} from "../../data/templates/item-table-data";
import {IPlainHTTPArguments} from "../../framework/network/plain-http-configs";
import ItemRender from "../UICommpont/ListView/ItemRender";

const {ccclass, property} = _decorator;

@ccclass('ClubShareItemPref')
export class ClubShareItemPref extends ItemRender {

    private declare _defaultBgSpriteNode: Node;
    private declare _highLightBgSpriteNode: Node;

    private declare _avatarSprite: Sprite;

    private declare _nameLabel: Label;
    private declare _idLabel: Label;
    private declare _statusLabel: Label;
    private declare _bonusLabel: Label;

    protected initUI(): void {
        this._defaultBgSpriteNode = this.node.getChildByPath('DefaultBgSprite');
        this._highLightBgSpriteNode = this.node.getChildByPath('HighlightBgSprite');

        this._avatarSprite = this.node.getChildByPath('AvatarBorder/AvatarMask/AvatarSprite').getComponent(Sprite);

        this._nameLabel = this.node.getChildByPath('NameLabel').getComponent(Label);
        this._idLabel = this.node.getChildByPath('IDLabel').getComponent(Label);
        this._statusLabel = this.node.getChildByPath('StatusLabel').getComponent(Label);
        this._bonusLabel = this.node.getChildByPath('BonusLabel').getComponent(Label);
    }

    public dataChanged(): void {
        const data = this.data as IPlainHTTPArguments.IPromoterListResponse['data']['list'][number];

        if (typeof data.avatar_id === 'number') {
            const template = ItemTableTemplate.query(data.avatar_id);
            if (template !== null && template !== undefined && template.iconPath) {
                const spriteFramePath = `ui/itemIcon/${template.iconPath[0]}/spriteFrame`;
                resources.load(spriteFramePath, SpriteFrame, (error, spriteFrame) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    this._avatarSprite.spriteFrame = spriteFrame;
                });
            }
        }

        this._nameLabel.string = data.nick_name ?? '';
        this._idLabel.string = `ID: ${data.user_id?.toString() ?? ''}`;

        const isOnline = data.is_online === 1;
        if (isOnline) {
            this._defaultBgSpriteNode.active = false;
            this._highLightBgSpriteNode.active = true;

            this._statusLabel.string = '在线';
        } else {
            this._defaultBgSpriteNode.active = true;
            this._highLightBgSpriteNode.active = false;

            this._statusLabel.string = '不在线';
        }

        const bonusString = (data.coins ?? '0').toString();
        const bonus = Number.parseFloat(bonusString);
        if (isNaN(bonus) || bonus < 0.01) {
            this._bonusLabel.string = '0';
        } else {
            const dotIndex = bonusString.lastIndexOf('.');
            if (dotIndex < 0) {
                this._bonusLabel.string = bonusString;
            } else {
                this._bonusLabel.string = bonusString.substring(0, dotIndex + 3);
            }
        }
    }

}
