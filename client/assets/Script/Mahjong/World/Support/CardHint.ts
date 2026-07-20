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

import {Color} from "cc";
import {Card} from "../Entity/Card/Card";
import {PlayerMgr} from "../Entity/Player/Player";
import {CardColorSet} from "./CardColorSet";

// 牌提示
export class CardHint {

    // 牌枚数提示
    public static meiShu(cardId: string) {

        this.normal();

        // 遍历牌河
        PlayerMgr.ins.all.forEach((v, k) => {

            for (let card of v.gameData.discard) {
                if (card.id == cardId) {
                    CardColorSet.set3d(card, new Color(150, 150, 255));
                }

            } // end for

        });

    }

    // 显示常态
    public static normal() {

        PlayerMgr.ins.all.forEach((v, k) => {

            for (let card of v.gameData.discard) {
                CardColorSet.set3d(card, Color.WHITE);
                this.moQie(card);
            }

        });

    }

    // 摸切牌提示
    public static moQie(card: Card) {

        // if( card.isMoQie ) {
        //     CardColorSet.set3d( card , new Color( 150 , 150 , 150 ) ) ;
        // }

    }

}