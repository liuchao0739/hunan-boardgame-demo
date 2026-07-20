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

import {ItemTableTemplate} from "../../data/templates/item-table-data";
import {HttpCtrl} from "../../framework/ctrl/HttpCtrl";
import {ICtrl} from "../../framework/mgr/CtrlMgr";
import {Singleton} from "../../framework/mgr/Singleton";
import {EProtocolID, protocol} from "../../framework/network/protocol-configs";
import {CallBack} from "../../framework/utils/CallBack";
import {App} from "../App";

export class BagCtrl extends Singleton implements ICtrl {
    public list: protocol.bag.IitemInfo[];
    public dic: Map<string, IBagInfo> = new Map<string, IBagInfo>();
    public typeList = {};

    /**
     * 请求背包信息
     * @param roleId
     */
    public pbGetBag(roleId: number) {
        App.getInst(HttpCtrl).requestServer(EProtocolID.BAG_ITEMS_LIST, {roleId}, new CallBack(this.pbBagInfo, this));
    }

    /**
     * 获得背包道具列表
     * @param params
     */
    public pbBagInfo(params: protocol.bag.IpbBagInfo): void {
        this.list = params.list;
        this.list.forEach(vo => {
            this.dic[vo.boxId] = vo;
            let config = ItemTableTemplate.query(vo.itemId);
            if (!config) {
                console.error("道具配置缺失 itemId:", vo.itemId);
                return;
            }
            let type = config.itemType;
            this.typeList[type] = this.typeList[type] || [];
            this.typeList[type].push(vo);
        })
    }

    /**
     * 获取指定类型的所有道具
     * @param itemType 道具类型
     * @returns 道具列表
     */
    public getItemsByType(itemType: number): IBagInfo[] {
        return this.typeList[itemType];
    }


    public clearCache(): void {
        this.list = [];
        this.dic = new Map<string, IBagInfo>();
        this.typeList = {};
    }
}

export interface IBagInfo {
    boxId: number;
    itemId: number;
    num: number;
}