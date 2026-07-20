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

import {_decorator, Component, instantiate, Label, Node} from "cc";
import {EEventListenerPriority, ProtocolEventManager} from "../../../framework/event/event-management";
import {ProtocolHTTPManager} from "../../../framework/network/http";
import {EProtocolID} from "../../../framework/network/protocol-configs";
import {LoginEnity} from "../../Entity/Login";
import {ClubEntity} from "../../Entity/ClubEntity";
import {TimeUtils} from "../../../framework/utils/time-utils";

const {ccclass, property} = _decorator;

@ccclass('ClubShopRecordUI')
export class ClubShopRecordUI extends Component {
    // private _root:Node | null = null;
    private _backBtn: Node | null = null;
    private _dateLB: Label | null = null;
    private _lastDay: Node | null = null;
    private _sevenDay: Node | null = null;
    private _custom: Node | null = null;
    private _recordCont: Node | null = null;
    private _recordItemND: Node | null = null;
    private recordItemUI: ClubShopRecordItemUI = null;

    onLoad(): void {
        this._backBtn = this.node.getChildByPath("cont/backBtn");
        this._dateLB = this.node.getChildByPath("cont/dateLB").getComponent(Label);
        this._lastDay = this.node.getChildByPath("cont/choose/lastDay");
        this._sevenDay = this.node.getChildByPath("cont/choose/sevenDay");
        this._custom = this.node.getChildByPath("cont/choose/custom");
        this._recordCont = this.node.getChildByPath("cont/ScrollView/view/content");
        this._recordItemND = this.node.getChildByPath("cont/ScrollView/view/content/RecordItem");

        this._backBtn.on(Node.EventType.TOUCH_END, this._onBackTouch, this);

        ProtocolEventManager.on(EProtocolID.SHOP_GET_ORDER_LIST, this._onGetOrderRespond, this, EEventListenerPriority.HIGHER);
    }

    private _onBackTouch(): void {
        this.node.destroy();
    }

    private _onGetOrderRespond(event): void {
        console.log("存取记录：", event);
        ClubEntity.clubOrderList = [];
        if (event.success && event.data) {
            ClubEntity.clubOrderList = event.data.list;
            this._updateOrderList();
        }
    }

    private _updateOrderList(): void {
        if (ClubEntity.clubOrderList) {
            this._recordCont.removeAllChildren();
            for (let mi = 0; mi < ClubEntity.clubOrderList.length; mi++) {
                let mRecordItemND = instantiate(this._recordItemND);
                mRecordItemND.addComponent(ClubShopRecordItemUI);
                let mRecordSC: ClubShopRecordItemUI = mRecordItemND.getComponent(ClubShopRecordItemUI);
                mRecordSC.toInit(mRecordItemND);
                mRecordSC.timeLB.string = TimeUtils.formatDate(ClubEntity.clubOrderList[mi].buyTime, "-", true);
                // 取款是 paytype'是 5 ， 存款 就是 paytype 就是 4
                if (ClubEntity.clubOrderList[mi].payType == 4) {
                    mRecordSC.methodLB.string = "存款";
                } else if (ClubEntity.clubOrderList[mi].payType == 5) {
                    mRecordSC.methodLB.string = "取款";
                }
                // 金币变动
                mRecordSC.changeLB.string = ClubEntity.clubOrderList[mi].coin + "";
                // 金额
                mRecordSC.numLB.string = ClubEntity.clubOrderList[mi].price + "";

                this._recordCont.addChild(mRecordItemND);
            }
        }
    }

    // 更新数据用，必备
    public refresh(): void {
        console.log("show record ui");
        this._recordCont.removeAllChildren();

        let mParams = {
            "uid": LoginEnity.playerID,
            // "token":LoginEnity.token,
            "shopType": 5,//3--购买铜币 4--购买勾玉 5--购买金币
            "shopPlace": ClubEntity.recentClubID,// 俱乐部ID， 如果是0大厅购买 TODO:TEMP 暂时都是0 
        };
        ProtocolHTTPManager.load(EProtocolID.SHOP_GET_ORDER_LIST, mParams, false);
    }

    onDestroy(): void {
        ProtocolEventManager.off(EProtocolID.SHOP_GET_ORDER_LIST, this._onGetOrderRespond, this);
    }

}

export class ClubShopRecordItemUI extends Component {
    public root: Node | null = null;
    public timeLB: Label | null = null;
    public methodLB: Label | null = null;
    public changeLB: Label | null = null;
    public numLB: Label | null = null;

    public toInit(node: Node) {
        this.root = node;
        this.timeLB = node.getChildByPath("timeLB").getComponent(Label);
        this.methodLB = node.getChildByPath("methodLB").getComponent(Label);
        this.changeLB = node.getChildByPath("changeLB").getComponent(Label);
        this.numLB = node.getChildByPath("numLB").getComponent(Label);
    }

    public refresh() {

    }

    public toShow() {
        this.root.active = true;
    }

    public toHide() {
        this.root.active = false;
    }
}