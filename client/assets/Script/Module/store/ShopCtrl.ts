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

import {director, sys} from "cc";
import {ClubEntity} from "../../Home/Entity/ClubEntity";
import {LoginEnity} from "../../Home/Entity/Login";
import {HttpCtrl} from "../../framework/ctrl/HttpCtrl";
import {Singleton} from "../../framework/mgr/Singleton";
import {ProtocolHTTPManager} from "../../framework/network/http";
import {EProtocolID, protocol} from "../../framework/network/protocol-configs";
import {CallBack} from "../../framework/utils/CallBack";
import {Platform} from "../../platform/Platform";
import {App} from "../App";
import {AppVar} from "../AppVar";

export enum ePaymentType {
    weBao,      //we宝支付
}

export enum EStoreType {
    COPPER,
    MAGATAMA,
    GOLD,
};

export class ShopCtrl extends Singleton {
    static UPDATE_SHOP_ORDER: string = `UPDATE_SHOP_ORDER`;
    static UPDATE_GET_PRODUCT_LIST: string = `UPDATE_GET_PRODUCT_LIST`;
    /**更新流水列表(货币流水) */
    static UPDATE_ORDER_LIST: string = `UPDATE_ORDER_LIST`;
    /**更新存取款记录 */
    static UPDATE_ORDER_INFO_LIST: string = `UPDATE_ORDER_INFO_LIST`;
    /**更新WE宝信息 */
    static UPDATE_WE_BAO_INFO: string = `UPDATE_WE_BAO_INFO`;
    /**获取到支付方式 */
    static UPDATE_PAYMENT_LIST: string = `UPDATE_PAYMENT_LIST`;
    /**返回支付平台信息 */
    static UPDATE_PAYMENT_PLATFORM_INFO: string = `UPDATE_PAYMENT_PLATFORM_INFO`;
    /**联盟商品列表 */
    public productList;
    // /**流水列表 */
    public moneyList;
    /**weBao 数据 */
    public wbInfo: protocol.club.IGetWBBindInfoResp;
    /** we宝测试服地址 */
    private _wbUrl = ``;

    /**
     * 查询俱乐部货币流水(有其他人信息)
     * @param uid
     * @param shopPlace
     * @param shopType
     */
    public pbGetOrderInfoReq(uid: number, shopPlace: number, startTime: number, endTime: number): void {
        App.getInst(HttpCtrl).requestServer(EProtocolID.SHOP_GET_ORDER_LIST, {
            uid,
            shopPlace,
            startTime,
            endTime
        }, new CallBack(this.pbGetOrderInfoRes, this));
    }

    public get wbUrl(): string {
        if (AppVar.isRelease) {
            return `http://m.bsd.net.cn/`;
        } else {
            return `http://m.mggame.nl/`;
        }
    }

    /**
     * 货币流水
     * @param params
     */
    public pbGetOrderInfoRes(params: protocol.shop.IpbGetClubOrderInfoRes): void {
        ClubEntity.clubOrderList = params.list;
        director.emit(ShopCtrl.UPDATE_ORDER_LIST);
    }


    /**
     * 查看玩家俱乐部商城存取记录(只有自己)
     * @param clubId 俱乐部ID
     * @param startTime 记录起始时间
     * @param endTime 记录结束时间
     */
    public pbGetClubOrderInfoReq(clubId: number, startTime: number, endTime: number): void {
        App.getInst(HttpCtrl).requestServer(EProtocolID.GET_CLUB_ORDER_INFO, {
            clubId,
            startTime,
            endTime
        }, new CallBack(this.pbGetClubOrderInfoRes, this));
    }

    /**
     * 存取记录
     * @param params
     */
    public pbGetClubOrderInfoRes(params): void {
        this.moneyList = params.list;
        director.emit(ShopCtrl.UPDATE_ORDER_INFO_LIST);
    }


    public pbGetProductListReq(shopType, shopPlace: number): void {
        App.getInst(HttpCtrl).requestServer(EProtocolID.SHOP_GET_PRODUCT_LIST, {
            shopType,
            shopPlace
        }, new CallBack(this.pbGetStartPackRes, this));
    }

    public pbGetStartPackRes(params): void {
        this.productList = params.productList;
        director.emit(ShopCtrl.UPDATE_GET_PRODUCT_LIST);
    }


    /**
     * 创建订单
     */
    public pbCreateOrder(uid, payType, productId, shopPlace, cb?: CallBack): void {
        App.getInst(HttpCtrl).requestServer(EProtocolID.SHOP_CREATE_ORDER, {
            uid,
            payType,
            productId,
            shopPlace
        }, new CallBack((params) => {
            this.pbCreateOrderRes(params);
            cb?.exe(params);
        }, this));
    }

    /**
     * 存取记录
     * @param params
     */
    public pbCreateOrderRes(params): void {

    }

    public requestVerifyOrder(userID: number, receiptData: string): void {
        const purchaseType = (sys.os === sys.OS.IOS ? protocol.shop.storeType.TYPE_APPLE : protocol.shop.storeType.TYPE_GOOGLE);

        ProtocolHTTPManager.load(EProtocolID.SHOP_CHECK_ORDER, {
            uid: userID,
            payType: purchaseType,
            receiptData: receiptData,
        }, false);
    }

    public requestFinishOrder(userID: number, receiptID: string): void {
        ProtocolHTTPManager.load(EProtocolID.SHOP_SEND_ORDER, {
            uid: userID,
            token: receiptID,
        }, false);
    }

    // /**
    //  * 请求订单列表(货币流水)
    //  * @param uid
    //  * @param shopType
    //  * @param shopPlace
    //  */
    // public pdGetOrderList(uid, shopType, shopPlace): void {
    //     App.getInst(HttpCtrl).requestServer(EProtocolID.SHOP_GET_ORDER_LIST, { uid, shopType, shopPlace }, new CallBack(this.pdGetOrderRes, this));
    // }


    // public pdGetOrderRes(params): void {
    //     this.moneyList = params.list;

    //     //to test
    //     // this.moneyList.push({ buyerName: `adadas`, buyTime: "222", uid: 123123, coin: 22, shopPlace: 1 })
    //     // this.moneyList.push({ buyerName: `a2as`, buyTime: "222", uid: 123123, coin: 22, shopPlace: 1 })
    //     // this.moneyList.push({ buyerName: `a3adas`, buyTime: "222", uid: 123123, coin: 22, shopPlace: 1 })
    //     // this.moneyList.push({ buyerName: `ad4s`, buyTime: "222", uid: 123123, coin: 22, shopPlace: 1 })
    //     // this.moneyList.push({ buyerName: `ad24s`, buyTime: "222", uid: 123123, coin: 22, shopPlace: 1 })
    //     // this.moneyList.push({ buyerName: `ad14s`, buyTime: "222", uid: 123123, coin: 22, shopPlace: 1 })
    //     // this.moneyList.push({ buyerName: `ad224s`, buyTime: "222", uid: 123123, coin: 22, shopPlace: 1 })
    //     // this.moneyList.push({ buyerName: `ad224s`, buyTime: "222", uid: 123123, coin: 22, shopPlace: 1 })
    //     // this.moneyList.push({ buyerName: `ad224s`, buyTime: "222", uid: 123123, coin: 22, shopPlace: 1 })
    //     // this.moneyList.push({ buyerName: `ad224s`, buyTime: "222", uid: 123123, coin: 22, shopPlace: 1 })
    //     // this.moneyList.push({ buyerName: `ad224s`, buyTime: "222", uid: 123123, coin: 22, shopPlace: 1 })
    //     director.emit(ShopCtrl.UPDATE_ORDER_LIST);
    // }

    /**
     * 取款
     * @param uid
     * @param amount 取款金额
     * @param shopPlace
     */
    public pbCreateWithDrawOrderReq(uid: number, amount: number, shopPlace: number, cb?: CallBack): void {
        App.getInst(HttpCtrl).requestServer(EProtocolID.SHOP_CREATE_WITHDRAW_ORDER, {
            uid,
            amount,
            shopPlace
        }, new CallBack((params) => {
            this.pbCreateWithDrawOrderRes(params);
            cb?.exe(params);
        }, this));
    }

    public pbCreateWithDrawOrderRes(params: protocol.shop.IpbCreateWithDrawOrderRes): void {

    }


    //====================================we宝相关接口============================================================================
    /**
     * 获取we宝账号绑定情况以及余额
     * @param playerId
     */
    public GetWBBindInfoReq(playerId: number, cb?: CallBack): void {
        App.getInst(HttpCtrl).requestServer(EProtocolID.CLUB_GETWBBINDINFO, {playerId}, new CallBack((params) => {
            this.GetWBBindInfoResp(params);
            cb?.exe();
        }, this));
    }

    public GetWBBindInfoResp(params: protocol.club.IGetWBBindInfoResp): void {
        if (!params.isWBBind) {
            this.wbInfo = {isWBBind: false, WBbalance: 0};
            console.log("we宝未绑定:", params.msg);
        } else {
            this.wbInfo = params;
        }

        //to test
        // this.wbInfo = { isWBBind: true, WBbalance: 0 };
        director.emit(ShopCtrl.UPDATE_WE_BAO_INFO);
    }

    /**
     * 获取支付方式列表
     */
    public getPaymentList(): void {
        setTimeout(this.getPaymentListResp, 100);
    }

    public getPaymentListResp(): void {
        director.emit(ShopCtrl.UPDATE_PAYMENT_LIST);
    }

    /**
     * 获取支付平台货币
     */
    public getPayPlatformInfo(payType: ePaymentType): void {
        // setTimeout(this.getPayPlatformInfoResp, 1200);
        switch (payType) {
            case ePaymentType.weBao:
                this.GetWBBindInfoReq(LoginEnity.playerID, new CallBack(() => {
                    this.getPayPlatformInfoResp();
                }, this));
                break;
        }
    }

    public getPayPlatformInfoResp(): void {
        director.emit(ShopCtrl.UPDATE_PAYMENT_PLATFORM_INFO);
    }


    /**
     * 获取当前玩家随机码（随机码用于拉起第三方页面使用的参数)
     * @param playerId
     * @param cb 拿到随机码后的回调
     */
    public GetWBRandCodeReq(playerId: number, cb?: CallBack): void {
        //请求的时候作废旧的
        this.WBRandCode = null;
        App.getInst(HttpCtrl).requestServer(EProtocolID.CLUB_GETWBRANDCODE, {playerId}, new CallBack((params) => {
            this.GetWBRandCodeResp(params);
            cb?.exe();
        }, this));
    }

    /**we宝随机码 */
    public WBRandCode: string;

    public GetWBRandCodeResp(params: protocol.club.IGetWBRandCodeResp): void {
        this.WBRandCode = params.code;
    }

    public checkMoneyIsEnough(paymentType: ePaymentType, money: number): boolean {
        let b = false;
        switch (paymentType) {
            case ePaymentType.weBao:
                b = this.wbInfo.WBbalance >= money;
                break;
        }
        return b;
    }

    /**
     * 获取登录用的token
     * @param playerId
     * @param cb 拿到token 后的回调  params 参数
     */
    public wbGetLoginToken(playerId: number, cb?: CallBack): void {
        App.getInst(HttpCtrl).requestServer(EProtocolID.CLUB_GETWBLOGINTOKEN, {playerId}, cb);
    }

    /**
     * 打开外链
     */
    public openWeBaoUrl(): void {
        //先去获取token 和time
        this.wbGetLoginToken(LoginEnity.playerID, new CallBack((params: protocol.club.IGetWBLoginTokenResp) => {
            let token = params.token;
            let time = params.time;
            sys.openURL(`${App.getInst(ShopCtrl).wbUrl}?appid=${App.getInst(Platform).appID}&token=${token}&time=${time}`);
        }, this));
    }

    //we宝解绑了
    static EVENT_WB_UNBIND: string = `EVENT_WB_UNBIND`;

    /**
     * 解绑 / 换绑
     * @param playerId
     */
    public CancelWBBindReq(playerId: number): void {
        App.getInst(HttpCtrl).requestServer(EProtocolID.CLUB_CANCELWBBIND, {playerId}, new CallBack((params: protocol.club.CancelWBBindResp) => {
            this.wbInfo = {isWBBind: false, WBbalance: 0};
            this.WBRandCode = null;
            director.emit(ShopCtrl.EVENT_WB_UNBIND);
            //打开h5
            this.openWeBaoUrl();
        }, this));
    }
}