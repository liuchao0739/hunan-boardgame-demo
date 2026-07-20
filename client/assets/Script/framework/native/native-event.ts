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

export type TNativeEventName = keyof INativeEvent;

export namespace NativeEventArguments {

    export interface IStatus {
        success: boolean,
    };

    export interface ISignInResult {
        status: ESignInStatus,
        userID: string,
        idToken: string,
    };

    export interface ISignOutResult {
        success: boolean,
    };

    export interface IFetchDeviceID {
        deviceID: string,
    };

    export interface IInAppPurchaseQueryRequest {
        productIDs: string[],
    };

    export interface IInAppPurchaseQueryResult {
        success: boolean,
        products?: { [productID: string]: IProductPrice },
    };

    export interface IInAppPurchasePurchaseRequest {
        userID: number,
        orderID: string,
        productID: string,
    };

    export interface IInAppPurchasePurchaseResult {
        status: EPurchaseStatus,
    };

    export interface IInAppPurchaseVerify {
        receiptDatas: string[],
        clear: boolean,
        receiptIDs: string[],
    };

    export interface IInAppPurchaseFinishRequest {
        receiptIDs: string[],
    };

    export interface IInAppPurchaseFinishResult {
        receipts: { [receiptID: string]: string[] },
    };

    export interface IImage {
        imagePath: string,
    };

};

export interface INativeEvent {

    signInFacebook: { script: null, native: NativeEventArguments.ISignInResult },
    signOutFacebook: { script: null, native: NativeEventArguments.ISignOutResult },

    signInGoogle: { script: null, native: NativeEventArguments.ISignInResult },
    signOutGoogle: { script: null, native: NativeEventArguments.ISignOutResult },

    signInApple: { script: null, native: NativeEventArguments.ISignInResult },
    signOutApple: { script: null, native: NativeEventArguments.ISignOutResult },

    fetchDeviceID: { script: null, native: NativeEventArguments.IFetchDeviceID },

    inAppPurchaseCheck: { script: null, native: null },
    inAppPurchaseQuery: {
        script: NativeEventArguments.IInAppPurchaseQueryRequest,
        native: NativeEventArguments.IInAppPurchaseQueryResult
    },
    inAppPurchasePurchase: {
        script: NativeEventArguments.IInAppPurchasePurchaseRequest,
        native: NativeEventArguments.IInAppPurchasePurchaseResult
    },
    inAppPurchaseVerify: { script: null, native: NativeEventArguments.IInAppPurchaseVerify },
    inAppPurchaseFinish: {
        script: NativeEventArguments.IInAppPurchaseFinishRequest,
        native: NativeEventArguments.IInAppPurchaseFinishResult
    },

    saveImageToPhotoAlbum: { script: NativeEventArguments.IImage, native: NativeEventArguments.IStatus },
};

export enum ESignInStatus {
    SUCCESS = 'success',
    FAILURE = 'failure',
    CANCEL = 'cancel',
    UNSUPPORTED = 'unsupported',
};

export enum EPurchaseStatus {
    SUCCESS = 'success',
    FAILURE = 'failure',
    CANCEL = 'cancel',
    UNSUPPORTED = 'unsupported',
};

export interface IProductPrice {
    currencyCode: string,
    price: number,
    displayPrice: string,
};
