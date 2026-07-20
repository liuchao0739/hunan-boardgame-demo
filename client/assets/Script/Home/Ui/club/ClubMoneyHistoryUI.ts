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

// import { Component, Label, Node, _decorator, instantiate } from "cc";
// import { EEventListenerPriority, ProtocolEventManager } from "../../../framework/event/event-management";
// import { ProtocolHTTPManager } from "../../../framework/network/http";
// import { EProtocolID } from "../../../framework/network/protocol-configs";
// import { LoginEnity } from "../../Entity/Login";
// import { ClubEntity } from "../../Entity/ClubEntity";

// const { ccclass, property } = _decorator;

// @ccclass('ClubMoneyHistoryUI')
// export class ClubMoneyHistoryUI extends Component {
//     private _backBtn: Node | null = null;
//     private _dateLB: Label | null = null;
//     private _lastDay: Node | null = null;
//     private _sevenDay: Node | null = null;
//     private _custom: Node | null = null;
//     private _historyCont: Node | null = null;
//     private _historyItemND: Node | null = null;
//     private _historyItemUI: ClubMoneyHistoryItemUI = null;

//     onLoad(): void {
//         this._backBtn = this.node.getChildByPath("cont/backBtn");
//         this._dateLB = this.node.getChildByPath("cont/dateLB").getComponent(Label);
//         this._lastDay = this.node.getChildByPath("cont/choose/lastDay");
//         this._sevenDay = this.node.getChildByPath("cont/choose/sevenDay");
//         this._custom = this.node.getChildByPath("cont/choose/custom");
//         this._historyCont = this.node.getChildByPath("cont/ScrollView/view/content");
//         this._historyItemND = this.node.getChildByPath("cont/ScrollView/view/content/HistoryItem");
//         this._historyItemUI = new ClubMoneyHistoryItemUI();
//         this._historyItemUI.toInit(this._historyItemND);

//         this._backBtn.on(Node.EventType.TOUCH_END, this._onBackTouch, this);
//         ProtocolEventManager.on(EProtocolID.SHOP_GET_ORDER_LIST, this._onGetOrderRespond, this, EEventListenerPriority.HIGHER);
//     }


//     private _onBackTouch(): void {
//         this.node.destroy();
//     }

//     private _onGetOrderRespond(event): void {
//         console.log("货币流水记录：", event);

//         if (event.success && event.data) {
//             let mMoneyList = event.data.list;
//             if (mMoneyList) {
//                 for (let mi = 0; mi < mMoneyList.length; mi++) {
//                     let mHistoryItemND = instantiate(this._historyItemND);
//                     mHistoryItemND.addComponent(ClubMoneyHistoryItemUI);
//                     let mHistoryItemSC: ClubMoneyHistoryItemUI = mHistoryItemND.getComponent(ClubMoneyHistoryItemUI);
//                     mHistoryItemSC.toInit(mHistoryItemND);
//                     mHistoryItemSC.idLB.string = mMoneyList[mi].uid + "";
//                     mHistoryItemSC.nameLB.string = mMoneyList[mi].buyerName;//昵称
//                     mHistoryItemSC.timeLB.string = mMoneyList[mi].buyTime + "";
//                     // shopPlace：俱乐部Id，0--大厅购买
//                     if (mMoneyList[mi].shopPlace === 0) {
//                         mHistoryItemSC.methodLB.string = "大厅购买";
//                     }
//                     else {
//                         mHistoryItemSC.methodLB.string = "俱乐部购买";
//                     }
//                     mHistoryItemSC.numLB.string = mMoneyList[mi].coin + "";// 金币变动
//                 }
//             }
//         }


//     }

//     // 更新数据用，必备
//     public refresh(): void {
//         this._historyCont.removeAllChildren();

//         let mParams = {
//             "uid": LoginEnity.playerID,
//             "shopType": 5,//3--购买铜币 4--购买勾玉 5--购买金币
//             "shopPlace": ClubEntity.recentClubID,//  俱乐部ID，如果是0大厅购买 TODO:TEMP 暂时都是0

//         };
//         ProtocolHTTPManager.load(EProtocolID.SHOP_GET_ORDER_LIST, mParams, false);
//     }

//     onDestroy(): void {
//         ProtocolEventManager.off(EProtocolID.SHOP_GET_ORDER_LIST, this._onGetOrderRespond, this);
//     }
// }

// export class ClubMoneyHistoryItemUI extends Component {
//     public root: Node | null = null;
//     public idLB: Label | null = null;
//     public nameLB: Label | null = null;
//     public timeLB: Label | null = null;
//     public methodLB: Label | null = null;
//     public numLB: Label | null = null;


//     public toInit(node: Node) {
//         this.root = node;
//         this.idLB = node.getChildByPath("idLB").getComponent(Label);
//         this.nameLB = node.getChildByPath("nameLB").getComponent(Label);
//         this.timeLB = node.getChildByPath("timeLB").getComponent(Label);
//         this.methodLB = node.getChildByPath("methodLB").getComponent(Label);
//         this.numLB = node.getChildByPath("numLB").getComponent(Label);
//     }


//     public refresh() {

//     }

//     public toShow() {
//         this.root.active = true;


//     }

//     public toHide() {
//         this.root.active = false;
//     }
// }