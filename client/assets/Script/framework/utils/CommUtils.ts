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

import {Label, Node, Sprite, SpriteFrame, Tween, resources, tween} from "cc";
import {ToastUI} from "../../Home/Ui/ToastUI";
import {App} from "../../Module/App";
import {ItemTableTemplate} from "../../data/templates/item-table-data";
import {protocol} from "../network/protocol-configs";
import {CallBack} from "./CallBack";

export namespace CommUtils {

    export function loadSprite(mSP: Sprite, mURL: string): void {
        // console.log("url:", mURL)
        // let url = `ui/yiman/yiman`;
        resources.load(mURL + "/spriteFrame", SpriteFrame, (err, spData) => {
            if (err) {
                console.error(err);
                return;
            }
            mSP.spriteFrame = spData;
        })
    }

    // 更换头像
    export function updatePlayerHeadIcon(headSP: Sprite, headID: number): void {
        if (!headID) {
            return;
        }
        let conf = ItemTableTemplate.query(headID);
        if (conf) {
            let url = `ui/itemIcon/${conf.iconPath[0]}/spriteFrame`;
            resources.load(url, SpriteFrame, (err, spData) => {
                if (err) {
                    console.error(err);
                    return;
                }
                headSP.spriteFrame = spData;
            })
        }
    }

    /**
     * 显示役满标记
     * @param nodes 节点列表，需要最少两个
     * @param type 牌型
     * @returns
     */
    export function showYiMan(nodes: Node[], type: number): void {
        // SHOW_UNKNOW_TYPE = 0;                   // 无
        // SHOW_YIMAN = 1;                         // 役满
        // SHOW_LEIJIYIMAN = 2;                    // 累计役满
        // SHOW_ER_YIMAN = 3;                      // 二倍役满
        // SHOW_SAN_YIMAN = 4;                     // 三倍役满
        // SHOW_SI_YIMAN = 5;                      // 四倍役满
        // SHOW_WU_YIMAN = 6;                      // 五倍役满
        // SHOW_LIU_YIMAN = 7;                     // 六倍役满
        // SHOW_BEIMAN = 8;                        // 倍满
        // SHOW_MANGUAN = 9;                       // 满贯
        // SHOW_TIAOMAN = 10;                      // 跳满
        // SHOW_SAN_BEIMAN = 11;                   // 三倍满
        // SHOW_LIUJU_MANGUAN = 12;                // 流局满贯
        let urls = [];
        switch (type) {
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_UNKNOW_TYPE:
                return null;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_YIMAN:
                urls = [`ui/yiman/yman`];
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_LEIJIYIMAN:
                urls = [`ui/yiman/leijiyiman`];
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_ER_YIMAN:
                urls = [`ui/yiman/shuzi2`, `ui/yiman/beiyman`];
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_SAN_YIMAN:
                urls = [`ui/yiman/shuzi3`, `ui/yiman/beiyman`];
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_SI_YIMAN:
                urls = [`ui/yiman/shuzi4`, `ui/yiman/beiyman`];
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_WU_YIMAN:
                urls = [`ui/yiman/shuzi5`, `ui/yiman/beiyman`];
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_LIU_YIMAN:
                urls = [`ui/yiman/shuzi6`, `ui/yiman/beiyman`];
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_BEIMAN:
                urls = [`ui/yiman/beiman`];
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_MANGUAN:
                urls = [`ui/yiman/manguan`];
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_TIAOMAN:
                urls = [`ui/yiman/yman`];
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_SAN_BEIMAN:
                urls = [`ui/yiman/sbeiman`];
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_LIUJU_MANGUAN:
                urls = [`ui/yiman/ljmg`];
                break;
        }
        for (let len = nodes.length, i = len - 1; i >= 0; i--) {
            let node = nodes[i];
            let url = urls[i];
            url && CommUtils.loadSprite(node.getComponent(Sprite), url);
        }
    }

    /**
     * 获取数值精度
     * @param num  数据
     * @param n 默认1位精度
     * @returns
     */
    export function formatNum(num: number, n: number = 1): number {
        let v = 10 * n;
        let value = Math.floor(num * v);
        return value / v;
    }

    /**
     * 是否是合规的手机号
     * @param phoneNum 手机号
     * @returns
     */
    export function checkPhoneNo(phoneNum: string, bShopTip: boolean = true): boolean {
        if (phoneNum.match(/^[0-9]{11}$/g)) {
            return true;
        }
        bShopTip && App.getInst(ToastUI).showTips(`请输入正确的手机号`);
        return false;
    }

    /**
     * 获取文字字符长度，汉字算两个字
     * @param str
     * @returns
     */
    export function getStrlen(str: string): number {
        let a = 0;
        for (let i = 0, len = str.length; i < len; i++) {
            if (str.charCodeAt(i) > 255) {
                a += 2;
            } else {
                a++;
            }
        }
        return a;
    }

    /**
     * &符号连接起来的参数字符串转换为 {key: value}
     * @param params eg: a=1&b=2
     * @returns
     */
    export function paramsToJson(params: any = ''): any {
        var _result = {}, _pairs, _pair, _query, _key, _value;

        if (typeof (params) === 'object') {
            return params;
        }

        _query = params || window.location.search;
        _query = _query.replace(/['"<>;?]/g, '');
        _pairs = _query.split('&');

        _pairs.forEach((keyVal) => {
            _pair = keyVal.split('=');
            _key = _pair[0];
            _value = _pair.slice(1).join('=');
            _result[decodeURIComponent(_key)] = decodeURIComponent(_value);
        });

        return _result;
    }

    /**
     * 转换为 &连接的参数字符串
     * @param json eg: {key: value}
     * @param decodeUri
     * @returns
     */
    export function objectToParams(json: any, decodeUri?: boolean): string {
        var param = '';
        for (var o in json) {
            if (o) {
                var v = typeof (json[o]) === 'object' ? JSON.stringify(json[o]) : json[o];
                if (!param) param += o + '=' + v;
                else param += '&' + o + '=' + v;
            }
        }

        if (decodeUri) {
            param = decodeURIComponent(param);
        }
        return param;
    }

    // 获取验证码的倒计时界面
    export function startTime(mHideND: Node, mTimeND: Node, mTimeLB: Label, mCountTime: number, callBack: CallBack): void {
        mHideND.active = false;
        mTimeND.active = true;
        mTimeLB.string = mCountTime + "";
        Tween.stopAllByTarget(mTimeND);
        let seq = tween(mTimeND).sequence(
            tween(mTimeND).delay(1),
            tween(mTimeND).call(() => {
                mCountTime--;
                if (mCountTime < 0) {
                    mCountTime = 0;
                    console.log("倒计时结束：");
                    Tween.stopAllByTarget(mTimeND);
                    mHideND.active = true;
                    mTimeND.active = false;
                    if (callBack) {
                        callBack;
                    }
                }
                mTimeLB.string = mCountTime + "";
            }));
        seq.repeatForever().start();
    }

    export function checkPhoneNumber(phoneNumber: string, countryCode: number): boolean {
        const regularExpression = countryCode === 86 ? /^[0-9]{11}$/g : /^[0-9]+$/g;
        const matchResult = phoneNumber.match(regularExpression);
        return (matchResult !== null && matchResult !== undefined);
    }

    export function getQualifiedClassName(value: any): string {
        let type = typeof value;
        if (!value || (type != "object" && !value.prototype)) {
            return type;
        }
        let prototype: any = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        if (prototype.hasOwnProperty("__class__")) {
            return prototype["__class__"];
        }
        let constructorString: string = prototype.constructor.toString().trim();
        let index: number = constructorString.indexOf("(");
        let className: string = constructorString.substring(9, index);
        Object.defineProperty(prototype, "__class__", {
            value: className,
            enumerable: false,
            writable: true
        });
        return className;
    }
}

export class NodeTraversal {

    public static bfs(node: Node, fn: (node: Node) => void): Node {

        let c = new Array<Node>();
        c.push(node);

        for (; c.length > 0;) {

            node = c.pop();
            fn(node);

            let children = node.children;
            for (let i = 0; i < children.length; ++i) {
                c.push(children[i]);
            } // end for

        } // end for
        return null;
    }

}
