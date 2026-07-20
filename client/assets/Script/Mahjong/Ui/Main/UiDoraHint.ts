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

import {Label, Node, Sprite} from "cc";
import {PrefabMgr} from "../../World/Support/Prefab";

// 宝牌提示牌，显示在左上角UI
export class DoraHint {

    public static ins: DoraHint;

    public root: Node;

    public init(node: Node) {

        this.root = node.getChildByPath("DoraHint");

        let cardRoot = this.root.getChildByPath("Card");
        for (let node of cardRoot.children) {
            this.cardSprites.push(node.getComponent(Sprite));
        }

        this.gongTuo = this.root.getChildByPath("GongTuo").getComponent(Label);
        this.benChang = this.root.getChildByPath("BenChang").getComponent(Label);
        this.roundChangLB = this.root.getChildByPath("RoundChang").getComponent(Label);

        // 显示背面牌
        // this.showAllCardsBack() ;
        this.gongTuoSet(0);
        this.benChangSet(0);

        this.roundChangSet(-1, -1, -1);
    }

    // 重置
    public reset(): void {
        this.showAllCardsBack();
        this.gongTuoSet(0);
        this.benChangSet(0);

        // this.roundChangSet( 0, 1 , 0);
    }

    // 设置宝牌显示
    public setDoraCard(cardId: string) {
        this.cardSprites[0].spriteFrame = PrefabMgr.card2d.get(cardId).getComponent(Sprite).spriteFrame;
    }

    // 设置牌
    public setCard(idx: number, cardId: string) {
        if (idx >= this.cardSprites.length) return;
        this.cardSprites[idx].spriteFrame = PrefabMgr.card2d.get(cardId).getComponent(Sprite).spriteFrame;
    }

    // 设置牌 找最先的背面的牌
    public setCardSeq(cardId: string) {
        let back = PrefabMgr.card2d.get("back").getComponent(Sprite).spriteFrame
        for (let spr of this.cardSprites) {
            if (spr.spriteFrame != back) continue;
            spr.spriteFrame = PrefabMgr.card2d.get(cardId).getComponent(Sprite).spriteFrame;
            break;
        }

    }

    // 设置供托
    public gongTuoSet(val: number) {
        console.log("供托：", val)
        this.gongTuo.string = val.toString();
    }

    public gongTuoAdd() {
        this.gongTuo.string = (Number(this.gongTuo.string) + 1).toString();
    }

    // 设置本场
    public benChangSet(val: number) {
        console.log("本场：", val)
        this.benChang.string = val.toString();
    }

    public benChangAdd() {
        this.benChang.string = (Number(this.benChang.string) + 1).toString();
    }


    // 所有牌显示背面
    public showAllCardsBack() {
        for (let spr of this.cardSprites) {
            spr.spriteFrame = PrefabMgr.card2d.get("back").getComponent(Sprite).spriteFrame;
        }

    }

    private cardSprites = new Array<Sprite>();


    /*
        供托展示，立直+1，如果流局，下一盘继续累加，否者，变成0。
        本场展示，流局+1，否者变成0。
    */

    // 供托展示
    private gongTuo: Label;
    // 本场展示
    private benChang: Label;

    // 东X局X本场
    private roundChangLB: Label;
    private _NUM_TO_STR = {1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六", 7: "七", 8: "八", 9: "九", 10: "十"};

    // 设置局场 nQuan:-1 清空
    public roundChangSet(nQuan: number, nRound: number, nBenJu: number): void {
        console.log("nQuan:", nQuan, "nRound:", nRound, "nBenj:", nBenJu);
        // 清空
        if (nQuan == -1) {
            this.roundChangLB.string = "";
            return;
        }


        let mJuChangStr = "";
        // 0就是东，1就是南
        if (nQuan == 0) {
            mJuChangStr = "东";
        } else if (nQuan == 1) {
            mJuChangStr = "南";
        }

        // 第几本局就是x本场
        // mJuChangStr += `${this._NUM_TO_STR[nRound]}局 ${this._NUM_TO_STR[nBenJu]}本场`;
        mJuChangStr += `${nRound}局 ${nBenJu}本场`;
        this.roundChangLB.string = mJuChangStr;
    }

}