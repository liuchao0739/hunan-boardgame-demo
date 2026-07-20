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

import {_decorator, Component, Node} from "cc";

const {ccclass, property} = _decorator;

@ccclass("NodePicker")
export class NodePicker extends Component {
    @property({type: Node, tooltip: "搜索根节点"})
    public root: Node;

    public getChildNode(str: string): Node {
        return this.getChildFormNode(this.root, str);
    }

    public getChildFormNode(node: Node, str: string): Node {
        if (node.name == str) return node;
        let childrens = node.children;
        if (!childrens.length) return;
        for (let len = childrens.length, i = 0; i < len; i++) {
            let node = childrens[i];
            if (node.name == str) {
                return node;
            } else {
                let tmpNode = this.getChildFormNode(node, str);
                if (tmpNode) return tmpNode;
            }
        }
        return null;
    }
}
