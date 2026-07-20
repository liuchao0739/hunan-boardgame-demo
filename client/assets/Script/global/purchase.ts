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

import {sys} from "cc";
import {LoginEnity} from "../Home/Entity/Login";
import {ToastUI} from "../Home/Ui/ToastUI";
import {App} from "../Module/App";
import {ShopCtrl} from "../Module/store/ShopCtrl";
import {ProductTableTemplate} from "../data/templates/product-table-data";
import {EventArguments} from "../framework/event/event";
import {EEventListenerPriority, EventManager, ProtocolEventManager} from "../framework/event/event-management";
import {EPurchaseStatus, NativeEventArguments} from "../framework/native/native-event";
import {NativeManager} from "../framework/native/native-management";
import {EProtocolID, protocol} from "../framework/network/protocol-configs";
import {TimeUtils} from "../framework/utils/time-utils";
import {inAppPurchase} from "../native/in-app-purchase";

/**
 * 内购管理器
 */
export namespace purchase {

    /* 配置表中的商品 ID 字段名 */
    const PRODUCT_ID_FIELD_KEY = (sys.os === sys.OS.IOS ? 'appstoreId' : 'googlestoreId');

    /* 闲时的定时任务时间间隔 */
    const TIMEOUT_IDLE = 1800000;
    /* 忙时的定时任务时间间隔 */
    const TIMEOUT_BUSY = 120000;

    /* 待完成的订单号集合 */
    let _receiptIDsSet: Set<string> = new Set();

    // 定时检查未完成的订单
    let _timeoutScheduleID: number | null = null;
    let _nextScheduleTime: number = 0;

    /**
     * 开启
     * @param userID 用户 ID
     */
    function _start(): void {
        ProtocolEventManager.on(EProtocolID.SHOP_CREATE_ORDER, _onShopCreateOrderRespond, null, EEventListenerPriority.MANAGER);
        ProtocolEventManager.on(EProtocolID.SHOP_CHECK_ORDER, _onShopVerifyOrderRespond, null, EEventListenerPriority.MANAGER);
        NativeManager.addPersistentListener('inAppPurchasePurchase', _onNativeInAppPurchasePurchase);
        NativeManager.addPersistentListener('inAppPurchaseVerify', _onNativeInAppPurchaseVerify);
        NativeManager.addPersistentListener('inAppPurchaseFinish', _onNativeInAppPurchaseFinish);
        _receiptIDsSet.clear();
        inAppPurchase.check();
        _startSchedule();
    }

    /**
     * 停止
     */
    function _stop(): void {
        ProtocolEventManager.off(EProtocolID.SHOP_CREATE_ORDER, _onShopCreateOrderRespond);
        ProtocolEventManager.off(EProtocolID.SHOP_CHECK_ORDER, _onShopVerifyOrderRespond);
        NativeManager.removePersistentListener('inAppPurchasePurchase', _onNativeInAppPurchasePurchase);
        NativeManager.removePersistentListener('inAppPurchaseVerify', _onNativeInAppPurchaseVerify);
        NativeManager.removePersistentListener('inAppPurchaseFinish', _onNativeInAppPurchaseFinish);
        _receiptIDsSet.clear();
        _stopSchedule();
    }

    function _startSchedule(): void {
        const timeout = _receiptIDsSet.size > 0 ? TIMEOUT_BUSY : TIMEOUT_IDLE;
        if (_timeoutScheduleID !== null && _timeoutScheduleID !== undefined && _nextScheduleTime - TimeUtils.getServerTime() <= timeout) {
            return;
        }
        _stopSchedule();
        _nextScheduleTime = TimeUtils.getServerTime() + timeout;
        _timeoutScheduleID = Number(setTimeout(() => {
            _timeoutScheduleID = null;
            _nextScheduleTime = 0;
            inAppPurchase.check();
            _startSchedule();
        }, timeout))
    }

    function _stopSchedule(): void {
        if (_timeoutScheduleID !== null && _timeoutScheduleID !== undefined) {
            clearTimeout(_timeoutScheduleID);
            _timeoutScheduleID = null;
        }
        _nextScheduleTime = 0;
    }

    function _onShopCreateOrderRespond(event: ProtocolEventManager.IProtocolEvent<EProtocolID.SHOP_CREATE_ORDER>): void {
        const userID = LoginEnity.playerID;
        if (userID === null || userID === undefined) {
            return;
        }
        if (!event.success) {
            return;
        }
        const response = event.data;
        if (response.payType === protocol.shop.storeType.TYPE_GOOGLE || response.payType === protocol.shop.storeType.TYPE_APPLE) {
            const response = event.data;
            if (response.productId !== null && response.productId !== undefined && response.orderId) {
                const productTemplate = ProductTableTemplate.query(response.productId);
                const productID = productTemplate?.[PRODUCT_ID_FIELD_KEY];
                if (productID) {
                    inAppPurchase.purchase(userID, response.orderId, productID);
                }
            }
        }
    }

    function _onShopVerifyOrderRespond(event: ProtocolEventManager.IProtocolEvent<EProtocolID.SHOP_CHECK_ORDER>): void {
        if (event.success) {
            const response = event.data;
            if (response.token) {
                inAppPurchase.finish(response.token);
            }
        }
    }

    function _onNativeInAppPurchasePurchase(name: 'inAppPurchasePurchase', args?: NativeEventArguments.IInAppPurchasePurchaseResult): void {
        switch (args.status) {
            case EPurchaseStatus.SUCCESS:
                App.getInst(ToastUI).showTips("购买成功，请等待处理");
                break;
            case EPurchaseStatus.CANCEL:
                App.getInst(ToastUI).showTips("购买已取消");
                break;
            case EPurchaseStatus.UNSUPPORTED:
                App.getInst(ToastUI).showTips("此设备不支持");
                break;
            default:
                App.getInst(ToastUI).showTips("购买失败");
                break;
        }
    }

    function _onNativeInAppPurchaseVerify(name: 'inAppPurchaseVerify', args?: NativeEventArguments.IInAppPurchaseVerify): void {
        const userID = LoginEnity.playerID;
        if (userID === null || userID === undefined) {
            return;
        }

        if (args.clear) {
            _receiptIDsSet.clear();
        }
        for (const receiptID of args.receiptIDs) {
            _receiptIDsSet.add(receiptID);
        }
        _startSchedule();

        for (const receiptData of args.receiptDatas) {
            App.getInst(ShopCtrl).requestVerifyOrder(userID, receiptData);
        }
    }

    function _onNativeInAppPurchaseFinish(name: 'inAppPurchaseFinish', args?: NativeEventArguments.IInAppPurchaseFinishResult): void {
        const userID = LoginEnity.playerID;
        if (userID === null || userID === undefined) {
            return;
        }

        for (const receiptID in args.receipts) {
            _receiptIDsSet.delete(receiptID);
        }

        if (sys.os === sys.OS.ANDROID) {
            for (const receiptID in args.receipts) {
                App.getInst(ShopCtrl).requestFinishOrder(userID, receiptID);
            }
        }
    }

    function _onAccountDidSignIn(name: string, args: EventArguments.IAccountDidSignIn): void {
        if (args.success) {
            _start();
        } else {
            _stop();
        }
    }

    EventManager.on('accountDidSignIn', _onAccountDidSignIn);

}
