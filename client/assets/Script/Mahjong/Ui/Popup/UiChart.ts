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

import {instantiate, math, Node, UITransform, Vec2, Vec3} from "cc";

export class UiChart {
    public root: Node;

    public init(node: Node): void {
        this.root = node;

        this.pfDot = this.root.getChildByPath("pfDot");
        this.pfDot.active = false;

        this.pfLine = this.root.getChildByPath("pfLine");
        this.pfLine.active = false;

        this.rootDot = this.root.getChildByPath("rootDot");
        this.rootLine = this.root.getChildByPath("rootLine");
    }

    // 添加一个点
    public addPoint(coord: Vec2) {

        let xInterval = 30;
        let yInterval = 20;

        let pos = new Vec3(coord.x * xInterval, coord.y * yInterval, 0);

        var dot = instantiate(this.pfDot);
        dot.setParent(this.rootDot);
        dot.active = true;
        dot.position = pos;

        this.dots.push(dot);

        this.updateLine();
    }

    // 更新连线
    public updateLine() {
        for (let node of this.lines) {
            node.destroy();
        }
        this.lines.splice(0, this.lines.length);

        for (let i = 0; i < this.dots.length - 1; ++i) {
            let dot1 = this.dots[i];
            let dot2 = this.dots[i + 1];

            var line = instantiate(this.pfLine);
            this.lines.push(line);
            line.setParent(this.rootLine);
            line.active = true;
            line.position = dot1.position;

            // 拉伸
            var uiTrans = line.getComponent(UITransform);
            let size = uiTrans.contentSize.clone();
            size.x = dot1.position.clone().subtract(dot2.position).length();
            uiTrans.contentSize = size;

            // 旋转
            let v = dot2.position.clone().subtract(dot1.position);
            var r = math.toDegree(Math.atan2(v.y, v.x));
            line.eulerAngles = new Vec3(0, 0, r);

        } // end for
    }

    public clear() {
        for (let node of this.lines) {
            node.destroy();
        }
        this.lines.splice(0, this.lines.length);

        for (let node of this.dots) {
            node.destroy();
        }
        this.dots.splice(0, this.dots.length);
    }

    public dots = new Array<Node>();
    public lines = new Array<Node>();

    private pfDot: Node;
    private pfLine: Node;

    private rootDot: Node;
    private rootLine: Node;
}