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

export type TPlainHTTPName = keyof IPlainHTTPConfig;

export namespace IPlainHTTPArguments {

    export interface IResponse {
        code: number,
        msg?: string,
        time?: number,
        data: any,
    };

    export interface IPromotionStateRequest {
        club_id: number,
    };

    export interface IPromotionStateResponse extends IResponse {
        data: {
            status: number,
        },
    };

    export interface IPromotionInfoRequest {
        user_id: number,
        club_id: number,
    };

    export interface IPromotionInfoResponse extends IResponse {
        data: {
            user_id: number,
            club_id: number,
            promotion_code: string,
            promotion_status: number,
            time: number,
            coins: string,
            range: number,
            promotion_total: number,
            p_id: number,
            p_name: string,
        },
    };

    export interface IPromotionBindRequest {
        user_id: number,
        club_id: number,
        promotion_code: string,
    };

    export interface IPromotionClaimRequest {
        user_id: number,
        club_id: number,
        collection_time: number,
    };

    export interface IPromotionClaimResponse extends IResponse {
        coins: string,
        coins_num: number,
    };

    export interface IPromotionListRequest {
        user_id: number,
        club_id: number,
        name: string,
        limit: number,
        offset: number,
        order: number,
    };

    export interface IPromotionListResponse extends IResponse {
        data: {
            total: number,
            list: {
                user_id: number,
                nick_name: string,
                avatar_id: number,
                avatar_url: string,
                is_online: number,
                coins: string,
            }[],
        },
    };

    export interface IPromoterListResponse extends IResponse {
        data: {
            total: number,
            list: {
                user_id: number,
                nick_name: string,
                avatar_id: number,
                avatar_url: string,
                is_online: number,
                coins: string,
                promotion_total: number,
            }[],
        },
    };

}
;

export interface IPlainHTTPConfig {
    promotionState: {
        req: IPlainHTTPArguments.IPromotionStateRequest,
        resp: IPlainHTTPArguments.IPromotionStateResponse
    },
    promotionInfo: { req: IPlainHTTPArguments.IPromotionInfoRequest, resp: IPlainHTTPArguments.IPromotionInfoResponse },
    promotionBind: { req: IPlainHTTPArguments.IPromotionBindRequest, resp: IPlainHTTPArguments.IPromotionInfoResponse },
    promotionClaim: {
        req: IPlainHTTPArguments.IPromotionClaimRequest,
        resp: IPlainHTTPArguments.IPromotionClaimResponse
    },
    promotionDirectList: {
        req: IPlainHTTPArguments.IPromotionListRequest,
        resp: IPlainHTTPArguments.IPromotionListResponse
    },
    promotionIndirectList: {
        req: IPlainHTTPArguments.IPromotionListRequest,
        resp: IPlainHTTPArguments.IPromotionListResponse
    },
    promoterList: { req: IPlainHTTPArguments.IPromotionListRequest, resp: IPlainHTTPArguments.IPromoterListResponse },
};

export const PLAIN_HTTP_APIS: Readonly<{ [name in TPlainHTTPName]: string }> = {
    promotionState: 'Promotion/systemOpenness',
    promotionInfo: 'Promotion/userPromotionInfo',
    promotionBind: 'Promotion/bindPromotionCode',
    promotionClaim: 'Promotion/collectCoins',
    promotionDirectList: 'Promotion/getDirectPromotion',
    promotionIndirectList: 'Promotion/getIndirectPromotion',
    promoterList: 'Promotion/getListOfPromoters',
};
