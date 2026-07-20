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

import {Input, instantiate, Label, Node, Sprite} from "cc";
import {ScMapping} from "../../Communication/CardIdMapping";
import {PlayerTingData} from "../../World/Entity/Player/Player";
import {PrefabMgr} from "../../World/Support/Prefab";
import {UiMain} from "../Main/UiMain";

// 听牌信息
export class UiTing {

    public root: Node;
    private _tingView: Node;
    public tingCont: Node;
    private itemPf: Node;

    public items = new Array<UiTingItem>();

    public init(node: Node) {
        this.root = node.getChildByPath("Ting");
        this.root.active = false;
        this._tingView = this.root.getChildByPath("ScrollView/view");
        this.tingCont = this.root.getChildByPath("ScrollView/view/content");
        this.itemPf = this.root.getChildByPath("ScrollView/view/content/Item");
        this.itemPf.active = false;

        this.root.getChildByPath("btnClose").on(Input.EventType.TOUCH_END, () => {
            this.root.active = false;
        });
    }

    public show() {
        this.root.active = true;
        // this.root.getComponentInChildren( Widget ).updateAlignment() ;
    }

    public hide() {
        this.root.active = false;
    }

    public addItem(cardId: string, val: number, isZhenTing: boolean, mFans: number) {

        var uiitem = new UiTingItem();
        this.items.push(uiitem);
        uiitem.init(instantiate(this.itemPf));
        // uiitem.root.setParent( this.root , false ) ;
        this.tingCont.addChild(uiitem.root);

        uiitem.refresh(cardId, val, isZhenTing);
        uiitem.card.spriteFrame = PrefabMgr.card2d.get(cardId).getComponent(Sprite).spriteFrame;
        uiitem.count.string = val + "张";
        uiitem.zhenTing.active = isZhenTing;

        // 有役，显示剩余数量，没役，就显示没役
        // 番数大于0就是有役
        if (mFans > 0) {
            uiitem.wuyiND.active = false;
            uiitem.count.node.parent.active = true;
        } else {
            uiitem.wuyiND.active = true;
            uiitem.count.node.parent.active = false;
        }

        // console.log("----------w10:", this.tingCont.getComponent(UITransform).width);
        // this.tingCont.getComponent(Layout).updateLayout();
        // console.log("----------w11:", this.tingCont.getComponent(UITransform).width);
        // if(this.tingCont.getComponent(UITransform).width<1240){
        //     console.log("----------11:", this.tingCont.getComponent(UITransform).width);
        //     this._tingView.getComponent(UITransform).width = this.tingCont.getComponent(UITransform).width;
        // }
        // else{
        //     console.log("----------22:");
        //     this._tingView.getComponent(UITransform).width = 1240;
        // }
        // console.log("----------ww::", this._tingView.getComponent(UITransform).width);
        // this.arrange() ;

    }

    public removeAllItems() {
        // 删除所有
        // for( var item of this.items ) {
        //     item.root.destroy() ;
        // }
        // this.items.splice( 0 , this.items.length ) ;
        this.tingCont.removeAllChildren();
        this.items = [];
    }

    // 排列显示
    // private arrange() {

    //     var interval = 20 ;

    //     var width = this.items[ 0 ].card.getComponent( UITransform ).contentSize.width ;
    //     var posList = new Array< Vec3 >() ;
    //     var widthTotal = ArrangeCalc.exe2( width , this.items.length , interval , posList ) ;
    //     for( var i = 0 ; i < this.items.length ; ++i ) {
    //         // 只设置X坐标
    //         let item = this.items[ i ] ;
    //         let pos = item.root.position.clone() ;
    //         pos.x = posList[ i ].x ;
    //         item.root.position = pos ;
    //     } // end for

    //     // 总大小
    //     var uitrans = this.root.getComponent( UITransform ) ;
    //     var size = uitrans.contentSize.clone() ;
    //     size.width = widthTotal + 80 ;
    //     uitrans.setContentSize( size ) ;

    // }


    // 点击时展示听牌信息，同时隐藏感叹号
    // 1.UserGrabCard 协议收到 hucardinfo时，
    // 则可以更新本地的hucardinfo信息，点击牌时，
    // 如果能在hucardinfo找到话，则牌的上方显示tings信息框，同时隐藏听牌感叹号
    public showTingInforWhenTouch(mCardIDNum: number, mCardIDStr: string): void {
        console.log("显示听牌信息--mCardID:", mCardIDStr, "mCardIDNum:", mCardIDNum);
        // 赤五万、赤五筒、赤五条 改为五万、五筒、五条来处理
        if (mCardIDNum == 0 || mCardIDNum == 16 || mCardIDNum == 32) {
            mCardIDNum += 5;
        }

        for (let mi = 0; mi < PlayerTingData.huCardInfor.length; mi++) {
            if (PlayerTingData.huCardInfor[mi].card == mCardIDNum) {
                console.log("隐藏听牌按钮");
                // 隐藏感叹号
                UiMain.ins.border.btnTing.active = false;
                this.removeAllItems();
                let isZhenTing = UiMain.ins.zhenTing.active;
                for (let pbTing of PlayerTingData.huCardInfor[mi].tings) {
                    this.addItem(ScMapping.cardId_s2c(pbTing.card), pbTing.shengyu, isZhenTing, pbTing.fans);
                }
                this.show();
                break;
            }
        }
    }

    // 2.UserOutCardRespond 协议收到时，
    // 如果打出的牌在本地hucardinfo信息找到了，则显示听牌的感叹号，
    // 点击感叹号，则显示打出的那张票的听牌信息，
    // 同时hucardinfo清理跟card不一样元素，
    // 如果没找到，则本地的hucardinfo信息全部清理

    // 1.找不到，并且card是0xff，则不用管
    // 2.找到了，删除其他，同时将找到的card，设置为0xff
    // 3.找不到，并且card不是0xff，则清空
    // 不过我发给你的hucardinfo，你收到还是要更新本地的hucardinfo进行保存
    public showTingInforWhenOutCard(mCardIDNum: number, mCardIDStr: string): void {
        // console.log("显示听牌--CardINDNUm:", mCardIDNum, "--CardIDStr:", mCardIDStr);
        // console.log("hucardinfor:", PlayerTingData.huCardInfor);
        // 赤五万、赤五筒、赤五条 改为五万、五筒、五条来处理
        if (mCardIDNum == 0 || mCardIDNum == 16 || mCardIDNum == 32) {
            mCardIDNum += 5;
        }

        let mFind: boolean = false;
        let mHaveOxFF: boolean = false;
        let mCardInfor = null;
        for (let mi = 0; mi < PlayerTingData.huCardInfor.length; mi++) {
            if (PlayerTingData.huCardInfor[mi].card == 0xFF) {
                mHaveOxFF = true;
            }
            if (PlayerTingData.huCardInfor[mi].card == mCardIDNum) {
                // 显示感叹号
                UiMain.ins.border.btnTing.active = true;
                this.removeAllItems();
                let isZhenTing = UiMain.ins.zhenTing.active;
                for (let pbTing of PlayerTingData.huCardInfor[mi].tings) {
                    this.addItem(ScMapping.cardId_s2c(pbTing.card), pbTing.shengyu, isZhenTing, pbTing.fans);
                }
                mFind = true;
                mCardInfor = PlayerTingData.huCardInfor[mi];
                break;
            }
        }
        // console.log("mFind:", mFind);

        // 找到只保留这一个
        // 2.找到了，删除其他，同时将找到的card，设置为0xff
        if (mFind) {
            mCardInfor.card = 0xFF;
            PlayerTingData.huCardInfor = [];
            PlayerTingData.huCardInfor.push(mCardInfor);
        } else {
            // 1.找不到，并且card是0xff，则不用管
            if (mHaveOxFF) {

            }
            // 3.找不到，并且card不是0xff，则清空
            else {
                // 找不到清空
                PlayerTingData.huCardInfor = [];
                // 清空面板
                this.removeAllItems();
                // 隐藏感叹号
                UiMain.ins.border.btnTing.active = false;
            }
        }

    }

    // 3.UserOperatorRespond 协议收到时，则可以更新本地的hucardinfo信息，
    // 点击牌时，如果能在hucardinfo找到话，则牌的上方显示tings信息框，同时隐藏听牌感叹号

    // 4.TableReconectInfo 协议收到时，则可以更新本地的hucardinfo信息，
    // 如果是轮到自己出牌或者操作，则跟1，3相同，如果不是自己出牌，
    // 同时hucardinfo只有一个元素，则显示感叹号，点击感叹号显示听牌信息

    // 第三项在DataParse中处理
    // 第四项在断线重连时，已在DataParse中处理


}


export class UiTingItem {

    public root: Node;
    public card: Sprite;
    public zhenTing: Node;
    public count: Label;
    public wuyiND: Node | null = null;

    public init(node: Node) {

        this.root = node;
        this.root.active = true;
        // this.root.on( Input.EventType.TOUCH_END , ()=>{ this.onClick() ; } ) ;
        this.card = this.root.getChildByPath("Card").getComponent(Sprite);
        this.zhenTing = this.root.getChildByPath("ZhenTing");
        this.count = this.root.getChildByPath("Count/val").getComponent(Label);
        this.wuyiND = this.root.getChildByPath("WUYI");

    }

    public refresh(cardId: string, val: number, zhenTing: boolean) {

    }

}