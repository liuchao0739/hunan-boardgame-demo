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

import {_decorator, Component, Label, resources, Sprite, SpriteFrame} from "cc";
import {ProductTableTemplate} from "../../data/templates/product-table-data";

const {ccclass, property} = _decorator;

export interface IStoreItemDelegate {
    onStoreItemClick: (productTID: number) => any,
};

@ccclass("StoreItemPref")
export class StoreItemPref extends Component {

    @property(Sprite)
    iconSprite: Sprite = null!;

    @property(Label)
    nameLabel: Label = null!;

    @property(Label)
    copperPriceLabel: Label = null!;

    @property(Label)
    magatamaPriceLabel: Label = null!;

    set delegate(object: IStoreItemDelegate | null) {
        this._delegate = object;
    }

    private _delegate: IStoreItemDelegate | null = null;

    private _productTID: number = -1;

    public updateWithProductTID(productTID: number, displayPrice?: string): void {
        if (productTID === this._productTID) {
            return;
        }

        this._clear();

        this._productTID = productTID;

        const template = ProductTableTemplate.query(productTID);
        if (!template || (template.shopType !== 1 && template.shopType !== 2)) {
            return;
        }

        if (template.productImg) {
            resources.load(`ui/itemIcon/${template.productImg}/spriteFrame`, SpriteFrame, (error, spriteFrame) => {
                if (!this.isValid || !this.iconSprite.isValid) {
                    return;
                }

                if (error || !spriteFrame) {
                    console.error(`loading product icon "${template.productImg}" failed: ${error?.message ?? "unknown reason"}`);
                    return;
                }

                this.iconSprite.spriteFrame = spriteFrame;
            });
        }

        this.nameLabel.string = template.productName ?? "";

        if (template.shopType === 1) {
            this.copperPriceLabel.node.parent.active = true;
            this.copperPriceLabel.string = template.consumeditemNum?.toString() ?? "";
        } else {
            let templatePrice: string = "";
            if (template.productPrice) {
                templatePrice = `￥${(template.productPrice * 0.01).toFixed(2)}`;
            }
            this.copperPriceLabel.node.parent.active = false;
            this.magatamaPriceLabel.string = displayPrice ?? templatePrice;
        }
    }

    public onItemClick(): void {
        if (this._delegate && this._productTID !== null && this._productTID !== undefined) {
            this._delegate.onStoreItemClick(this._productTID);
        }
    }

    private _clear(): void {
        this.iconSprite.spriteFrame = null;
        this.nameLabel.string = "";
        this.copperPriceLabel.string = "";
        this.copperPriceLabel.node.parent.active = false;
        this.magatamaPriceLabel.string = "";
    }

}
