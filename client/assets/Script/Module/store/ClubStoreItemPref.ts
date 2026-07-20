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

import {_decorator, Label, Node, resources, Sprite, SpriteFrame, tween, Vec3} from "cc";
import ItemRender from "../UICommpont/ListView/ItemRender";
import {eSysId, ViewMgr} from "../../framework/mgr/ViewMgr";
import {App} from "../App";

const {ccclass, property} = _decorator;

@ccclass('ClubStoreItemPref')
export class ClubStoreItemPref extends ItemRender {
    public storeIcon: Node;
    public itemLB: Label;
    public priceLB: Label;
    private v: Vec3;
    private v1: Vec3;
    private tw = null;
    /**价格 */
    private price: number;

    protected initUI(): void {
        this.storeIcon = this.getChildNode(`storeIcon`);
        this.itemLB = this.getChildNode(`itemLB`).getComponent(Label);
        this.priceLB = this.getChildNode(`priceLB`).getComponent(Label);
        this.v = new Vec3(1.03, 1.03, 0);
        this.v1 = new Vec3(1, 1, 0);
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
    }

    public dataChanged(): void {
        let {image, name, price, id} = this.data;
        this.itemLB.string = name;
        this.priceLB.string = `￥${price}`;
        this.price = price;
        let url = `ui/store/icon/${image}/spriteFrame`;
        resources.load(url, SpriteFrame, (err, spData) => {
            if (err) {
                console.error(err);
                return;
            }
            if (!this.node.active) return;
            this.storeIcon.getComponent(Sprite).spriteFrame = spData;
        })
    }

    private onClick(): void {
        let node: Node = this.getChildNode(`Node`);
        if (this.tw) {
            this.tw.stop();
        }
        this.tw = tween(node).to(0.1, {scale: this.v}).to(0.1, {scale: this.v1}).start();

        let {id} = this.data;
        //App.getInst(ShopCtrl).pbCreateOrder(LoginEnity.playerID, 4, id, ClubEntity.recentClubID);
        let mainUi = App.getInst(ViewMgr).getView(eSysId.ClubStorePref);
        App.getInst(ViewMgr).open(eSysId.SelectPaymentPref, [id, this.price, this.data.shopType], mainUi.node);//
    }

}