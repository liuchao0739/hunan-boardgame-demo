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

import {_decorator, Component, Event, EventTouch, Label, Node, Sprite} from 'cc';
import {country} from '../../data/manual/country';

const {ccclass, property} = _decorator;

@ccclass('LoginCountryCodeUI')
export class LoginCountryCodeUI extends Component {

    @property(Label)
    countryCodeLabel: Label = null!;

    @property(Sprite)
    flagSprite: Sprite = null!;

    @property(Node)
    dropDownNode: Node = null!;

    @property(Node)
    container: Node = null!;

    private _currentCountryID: number = 0;
    private _timeout: number | null = null;

    get countryID(): number {
        return this._currentCountryID;
    }

    set countryID(value: number) {
        if (value === this._currentCountryID) {
            return;
        }

        this._currentCountryID = value;

        const itemNode = this.container.children[value] ?? this.container.children[0];

        this.countryCodeLabel.string = `+${this.countryCode}`;
        this.flagSprite.spriteFrame = itemNode.getComponentInChildren(Sprite)?.spriteFrame ?? null;
    }

    get countryCode(): number {
        return country.query(this._currentCountryID).countryCode;
    }

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
    }

    protected start(): void {
        this.dropDownNode.active = false;
    }

    onItemClick(event: Event, customData: string): void {
        this._dropDownVisible = false;

        const itemNode = event.target as Node;
        if (!itemNode) {
            return;
        }

        const index = this.container.children.indexOf(itemNode);
        if (index === -1) {
            return;
        }

        this._currentCountryID = index;

        this.countryCodeLabel.string = `+${this.countryCode}`;
        this.flagSprite.spriteFrame = itemNode.getComponentInChildren(Sprite)?.spriteFrame ?? null;
    }

    private set _dropDownVisible(value: boolean) {
        if (this._timeout !== null && this._timeout !== undefined) {
            clearTimeout(this._timeout);
        }

        this._timeout = setTimeout(() => {
            this.dropDownNode.active = value;
        }, 0);
    }

    private _onTouchEnd(event: EventTouch): void {
        this._dropDownVisible = !this.dropDownNode.active;
    }

}
