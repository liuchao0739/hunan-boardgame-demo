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

import {instantiate, MeshRenderer, Node, Vec3} from "cc";
import {PrefabMgr} from "./Prefab";

// 3D 空间的艺术字
export class String3d {

    public static showScore(node: Node, str: string) {
        // console.log("show score str:", str)
        this.show(node, str, PrefabMgr.root.getChildByPath("Font/Score"));

    }


    public static showCenter(node: Node, str: string) {

        // console.log("root:", PrefabMgr.root, "str:", str);
        this.show(node, str, PrefabMgr.root.getChildByPath("Font/Center"));

    }

    // 新添加中控台显示房间信息（四人场 东风战 ID:）
    public static showZhong(node: Node, str: string) {
        // console.log("==========: str:",str)
        // console.log("root:", PrefabMgr.root, "str:", str);
        this.show(node, str, PrefabMgr.root.getChildByPath("Font/Zhong"));

    }

    public static show(node: Node, str: string, pfParent: Node) {
        this.clear(node);

        let chNodes = new Array<Node>();

        let len = 0;
        for (let i = 0; i < str.length; ++i) {
            let ch = str.charAt(i);
            let pfCh = pfParent.getChildByPath(ch);

            // console.log("===pfch:", pfCh, "====ch:", ch);
            let chNode = instantiate(pfCh);
            chNode.setParent(node);
            chNodes.push(chNode);

            chNode.getComponent(MeshRenderer).material;

            len += chNode.scale.x;

        } // end for

        let n = len / -2;
        // 居中排列
        for (let i = 0; i < chNodes.length; ++i) {
            let node = chNodes[i];
            let x = node.scale.x
            let x2 = x / 2;
            node.position = new Vec3(n + x2, 0, 0);
            n += x;

        } // end for

    }

    private static clear(node: Node) {

        for (let i = node.children.length - 1; i >= 0; --i) {
            node.children[i].destroy();
        } // end for

    }

}