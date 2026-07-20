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

import {Input, instantiate, Label, Node, Sprite, UITransform, Vec3} from "cc";
import {PrefabMgr} from "../../World/Support/Prefab";

export class UiSelect {

    public root: Node;
    public bg: Node;
    public itemPf: Node;
    public cardPf: Node;
    public title: Label;

    public items = new Array<UiSelectItem>();

    public init(node: Node): void {
        this.root = node.getChildByPath("Select");
        this.root.active = false;
        this.itemPf = this.root.getChildByName("Item");
        this.itemPf.active = false;

        this.cardPf = this.root.getChildByName("Card");
        this.cardPf.active = false;
        this.bg = this.root.getChildByPath("bg");

        this.root.getChildByName("btnClose").on(Input.EventType.TOUCH_END, () => {
            this.root.active = false;
        });

        this.title = this.root.getChildByPath("Title").getComponent(Label);
        this.title.string = "";

    }

    public show() {
        this.root.active = true;
    }

    public addItem(cardIds: Array<string>): UiSelectItem {

        var itemNode = instantiate(this.itemPf);
        itemNode.setParent(this.root, false);
        var item = new UiSelectItem();
        this.items.push(item);
        item.init(itemNode);
        item.cardPf = this.cardPf;
        item.cardIds = cardIds;
        item.refresh();

        this.arrange();

        return item;

    }

    // 排列位置
    public arrange() {

        var widthList = new Array<number>();
        for (var item of this.items) {
            widthList.push(item.root.getComponent(UITransform).contentSize.width);
        } // end for
        var posList = new Array<Vec3>()
        var widthTotal = ArrangeCalc.exe(widthList, 20, posList);
        for (var i = 0; i < widthList.length; ++i) {
            this.items[i].root.position = posList[i];
        }

        // 设置本UI大小
        var uitrans = this.root.getComponent(UITransform);
        var size = uitrans.contentSize.clone();
        size.width = widthTotal;
        size.width += 100 * 2; // 左右边距
        uitrans.contentSize = size;

    }


    public removeAllItems() {
        // 删除所有
        for (var item of this.items) {
            item.root.destroy();
        }
        this.items.splice(0, this.items.length);
    }


}

class UiSelectItem {

    public root: Node;
    public cardPf: Node;

    public cardIds: Array<string> = null;

    public init(node: Node) {

        this.root = node;
        this.root.active = true;
        // this.root.on( Input.EventType.TOUCH_END , ()=>{ this.onClick() ; } ) ;
    }

    public refresh() {

        var width = this.cardPf.getComponent(UITransform).contentSize.width;
        var posList = new Array<Vec3>();
        var widthTotal = ArrangeCalc.exe2(width, this.cardIds.length, 0, posList);
        for (var i = 0; i < this.cardIds.length; ++i) {
            var card = instantiate(this.cardPf);
            card.active = true;
            card.getComponent(Sprite).spriteFrame = PrefabMgr.card2d.get(this.cardIds[i]).getComponent(Sprite).spriteFrame;
            card.setParent(this.root);

            card.position = posList[i];

        } // end for


        // // 牌中心对其
        // var width = this.cardPf.getComponent( UITransform ).contentSize.width ;
        // var x = -( this.cardIds.length * width / 2 ) + width / 2 ;

        // for( var cardId of this.cardIds ) {

        //     var card = instantiate( this.cardPf ) ;
        //     card.active = true ; 
        //     card.getComponent( Sprite ).spriteFrame = PrefabMgr.card2d.get( cardId ).getComponent( Sprite ).spriteFrame ; 
        //     card.setParent( this.root ) ;

        //     // 位置
        //     card.position = new Vec3( x ) ;
        //     x += width ;

        // } // end for

        // 设置整个大小
        var size = this.root.getComponent(UITransform).contentSize.clone();
        size.width = widthTotal;
        // size.width += 5 * 2 // 左右边距 5。
        this.root.getComponent(UITransform).contentSize = size;

    }

}

// 排列计算
export class ArrangeCalc {

    /*
        中心对其
        itemWidthList 每个条目的宽度
    */
    public static exe(itemWidthList: Array<number>, interval: number, ret: Array<Vec3>): number {

        // 总宽度
        var widthTotal = 0;
        for (var width of itemWidthList) {
            widthTotal += width;
        }
        widthTotal += (itemWidthList.length - 1) * interval;

        var offset = -widthTotal / 2;
        for (var width of itemWidthList) {

            var pos = new Vec3(offset + width / 2, 0, 0);
            ret.push(pos);
            offset += width + interval;

        } // end for

        return widthTotal;

    }

    // 中心对其
    public static exe2(itemWitdh: number, count: number, interval: number, ret: Array<Vec3>): number {

        var widthTotal = itemWitdh * count + (interval * (count - 1));
        var offset = -widthTotal / 2;
        offset += itemWitdh / 2;

        for (var i = 0; i < count; ++i) {
            // 位置
            var pos = new Vec3(offset, 0, 0);
            ret.push(pos);
            offset += itemWitdh + interval;

        } // end for

        return widthTotal;

    }


}