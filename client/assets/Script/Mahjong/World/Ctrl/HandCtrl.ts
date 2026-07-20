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

import {AnimationClip, tween, Vec3} from "cc";
import {Player} from "../Entity/Player/Player";
import {CardShown} from "../Entity/CardShown/CardShown";

// 手模型控制
export class HandCtrl {

    // 出牌动画
    public static discard(player: Player, pos: Vec3, fn: () => void) {

        let hand = player.persentation.seat.hand;
        let root = hand.root;
        let sa = hand.sa;

        let state = hand.sa.getState("lpHandsAction");
        state.speed = 2.5;
        state.wrapMode = AnimationClip.WrapMode.Normal;

        root.active = true;
        sa.play("lpHandsAction");

        // 放牌目标移动位置
        let pos1 = new Vec3(0, 0, 0.115);
        // 回缩的位置
        let pos2 = new Vec3(0, 0.25, 0.541);


        pos1 = pos;
        pos2 = pos.clone().add(new Vec3(0, 0.25, 0.44));

        root.position = pos2;

        // tween( root ).sequence( 
        //     tween( root ).delay( 0.1 ) , 
        //     tween( root ).call( ()=>{ sa.play( "lpHandsAction" ) ; } )
        // ).start() ;

        tween(root).sequence(
            tween(root).to(0.4, {worldPosition: pos1}),
            tween(root).call(() => {
                // 放牌
                fn();
            }),
            tween(root).to(0.2, {position: pos2}),
            tween(root).call(() => {
                root.active = false;
            })
        ).start();

    }

    // 明牌动画
    public static cardShown(player: Player, cardShown: CardShown) {

        let hand = player.persentation.seat.hand;
        let root = hand.root;
        let sa = hand.sa;

        let state = hand.sa.getState("lpHandsAction");
        state.speed = 4;
        state.wrapMode = AnimationClip.WrapMode.Normal;

        root.active = true;
        sa.play("lpHandsAction");

        // 放牌目标移动位置
        let pos1 = new Vec3(0, 0, 0.115);
        // 回缩的位置
        let pos2 = new Vec3(0, 0.25, 0.541);

        pos1 = cardShown.cards[1].presentation3d.root.worldPosition;
        pos2 = pos1.clone().add(new Vec3(0, 0.25, 0.44));

        root.position = pos2;

        // tween( root ).sequence( 
        //     tween( root ).delay( 0.1 ) , 
        //     tween( root ).call( ()=>{ sa.play( "lpHandsAction" ) ; } )
        // ).start() ;

        tween(root).sequence(
            tween(root).to(0.3, {worldPosition: pos1}),
            tween(root).call(() => {
                // 放牌
                // fn() ;
            }),
            tween(root).to(0.2, {position: pos2}),
            tween(root).call(() => {
                root.active = false;
            })
        ).start();

    }

}