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

import {Color, MeshRenderer, Node, tween, Tween} from "cc";
import {SeatOrien} from "../../Support/SeatOrien";
import {WorldNode} from "../../Support/WorldNode";
import {Player} from "../../Entity/Player/Player";

// 操作指示器
export class OpIndicator {

    public static init() {

        this.data = new Map<SeatOrien, Node>();
        let root = WorldNode.ins.table.root.getChildByPath("OpIndicator");

        this.data.set(SeatOrien.East, root.getChildByPath("1"));
        this.data.set(SeatOrien.South, root.getChildByPath("2"));
        this.data.set(SeatOrien.West, root.getChildByPath("3"));
        this.data.set(SeatOrien.North, root.getChildByPath("4"));

        this.hide();
    }

    public static hide() {
        this.data.forEach((v, k) => {
            v.active = false;
        });
    }

    public static exe(player: Player) {

        this.hide();

        var item = this.data.get(player.gameData.seatOrien);
        item.active = true;

        this.playAnim(item);

    }

    static playAnim(item: Node) {

        let mr = item.getComponent(MeshRenderer);
        let m = mr.materials[0];
        let cr = new Color(255, 255, 255, 0);
        m.setProperty("mainColor", cr);

        let duration = 0.4;
        let duration2 = 0.8;

        const start = 0;
        const end = 255;
        this.obj = {a: start};
        let t1 = tween(this.obj).to(duration, {a: end}, {
            progress: (start, end, current, ratio) => {
                let cr = new Color(255, 255, 255, current);
                m.setProperty("mainColor", cr);
                return start + (end - start) * ratio;
            }
        });


        let t2 = tween(this.obj).to(duration2, {a: end}, {
            progress: (start, end, current, ratio) => {
                let cr = new Color(255, 255, 255, 255 - current);
                m.setProperty("mainColor", cr);
                return start + (end - start) * ratio;
            }
        });

        Tween.stopAllByTarget(this);
        Tween.stopAllByTarget(this);
        tween(this).sequence(
            tween().call(() => {
                    this.obj.a = start;
                    t1.start()
                }
            ),
            tween().delay(duration + 0.5),
            tween().call(() => {
                    this.obj.a = start;
                    t2.start()
                }
            ),
            tween().delay(duration2))
            .repeatForever().start();

    }

    static obj = null;

    static data: Map<SeatOrien, Node> = null;

}