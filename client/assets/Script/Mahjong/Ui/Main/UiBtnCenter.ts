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

import {Input, Node} from "cc";
import {PlayerMgr} from "../../World/Entity/Player/Player";
import {String3d} from "../../World/Support/String3d";

export class UiBtnCenter {

    public root: Node = null;

    public init(node: Node) {

        this.root = node.getChildByPath("btnCenter");
        this.root.on(Input.EventType.TOUCH_END, this.onClick.bind(this));

    }

    private onClick() {
        if (this.mode == true) {
            this.mode = false;
            this.showDianShu();
        } else {
            this.mode = true;
            this.showDianCha();
        }

    }

    public showDianShu() {
        for (let player of PlayerMgr.ins.all.values()) {
            let n = player.info.dianShu;
            if (n == null) continue;
            // player.persentation.seat.score.string = n.toString() ;
            if (n > 0) {
                String3d.showScore(player.persentation.seat.score, n.toString());
            } else {
                String3d.showScore(player.persentation.seat.score, "");
            }

        }
    }

    public showDianCha() {

        let local = PlayerMgr.ins.local;
        for (let player of PlayerMgr.ins.all.values()) {
            if (local == player) continue;

            let diff = local.info.dianShu - player.info.dianShu;
            var str = "0";
            if (diff > 0) {
                str = "+" + diff;
            } else if (diff < 0) {
                str = "-" + diff;
            }

            // player.persentation.seat.score.string = str ;
            String3d.showScore(player.persentation.seat.score, str);

        }

    }

    // 显示模式 true 点数 false 点差
    public mode = true;

}