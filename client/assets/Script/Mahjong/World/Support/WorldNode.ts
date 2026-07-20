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

import {find, Node, SkeletalAnimation} from "cc";
import {String3d} from "./String3d";

// 游戏空间节点引用
export class WorldNode {

    public static ins: WorldNode;
    public root: Node;
    public table: WorldNodeTable = new WorldNodeTable();
    public seats: Array<WorldNodeSeat> = new Array<WorldNodeSeat>();
    public info = new WorldNodeInfoTableCenter();

}

// 桌子节点
export class WorldNodeTable {

    public root: Node;

}

// 桌位节点
export class WorldNodeSeat {

    public root: Node;

    // 手牌
    public handcard: Node;

    // 出牌区
    public discarded: Node;

    // 鸣牌区
    public shown: Node;

    // 得分
    // public score : Label3D ; 

    public score: Node;

    // 手
    public hand: Hand;

    // 立直标志
    public flagLiZhi: Node;

}

// 手模型
export class Hand {

    public root: Node;
    public main: Node;
    public sa: SkeletalAnimation;

}

// 桌子中间的展示信息
export class WorldNodeInfoTableCenter {

    public root: Node;

    // 局次
    public round: Node;
    // 剩余的牌
    public left: Node;

    // nQuan 0-3 东南西北，nRound 第N局
    public setRound(nQuan: number, nRound: number) {
        console.log("set round quan:", nQuan, "round:", nRound);
        let strs = ["东", "南", "西", "北"];
        let strs2 = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
        // this.round.string = strs[ n ]  ;
        nQuan = nQuan % 4;// 防止溢出
        String3d.showCenter(this.round, strs[nQuan] + strs2[nRound] + "局");

    }

    public setLeft(n: number) {
        // this.left.string = "残牌x" + n ;
        console.log("剩余：", n);
        if (n >= 0) {
            String3d.showCenter(this.left, n.toString());
        }
    }

    // 显示牌桌类型、id
    public setQuanID(nQuan: number, nTableID: number = 0): void {
        // console.log("【中控台自风：】", nQuan, "tableID:", nTableID);
        // 暂时处理不了，风、战、ID:等字符没有
        let strs = ["", "东风战", "东南战"];
        nQuan = nQuan % 3;
        String3d.showZhong(this.round, "四人场");

        String3d.showZhong(this.left, strs[nQuan]);
        // String3d.showZhong(this.left, "D"+nTableID);

    }

}

// 初始化
export class WorldNodeInit {

    public static exe() {

        WorldNode.ins = new WorldNode();
        var ins = WorldNode.ins;

        ins.root = find("World");

        // 桌子
        ins.table.root = ins.root.getChildByPath("Table");

        // 座位
        let seats = ins.root.getChildByPath("Seat");
        for (var node of seats.children) {
            var seat = new WorldNodeSeat();
            ins.seats.push(seat);
            seat.root = node;
            seat.handcard = node.getChildByPath("Handcard");
            seat.discarded = node.getChildByPath("Discard");
            seat.shown = node.getChildByPath("Shown");
            // seat.score = node.getChildByPath( "Score" ).getComponent( Label3D ) ;
            // seat.score.string = "" ; 
            seat.score = node.getChildByPath("Score");
            ;
            seat.flagLiZhi = node.getChildByPath("FlagLiZhi");
            seat.flagLiZhi.active = false;

            let hand = new Hand();
            seat.hand = hand;
            hand.root = node.getChildByPath("Hand");
            hand.main = hand.root.getChildByPath("Main");
            hand.sa = hand.main.getComponent(SkeletalAnimation);
            hand.root.active = false;

        } // end for

        // 桌子中心展示的信息
        ins.info.root = ins.root.getChildByPath("Info");
        ins.info.round = ins.info.root.getChildByPath("Round");
        ins.info.left = ins.info.root.getChildByPath("Left");

    }

}