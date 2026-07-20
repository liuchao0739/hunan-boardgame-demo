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

import {instantiate, Node, Prefab, resources, Sprite} from "cc";

export class SpriteMgr {
    public static root: Node = null;
    public static playerHeadMap: Map<string, Sprite> = null;

    public static init(onComplete: () => void) {
        resources.load("prefab/SpritePref", Prefab, (err, data) => {
            this.root = instantiate(data);

            // this.card = new Map< string , Node >() ; 
            // this.map( this.root.getChildByPath( "Card/tiao" ) , this.card ) ;
            // this.map( this.root.getChildByPath( "Card/tong" ) , this.card ) ;
            // this.map( this.root.getChildByPath( "Card/wan" ) , this.card ) ;
            // this.map( this.root.getChildByPath( "Card/zi" ) , this.card ) ;

            // this.cardShadowStand = this.root.getChildByPath( "Card/ShadowStand" ) ;
            // this.cardShadowLie = this.root.getChildByPath( "Card/ShadowLie" ) ;

            // this.card2d = new Map< string , Node >() ;
            // this.map( this.root.getChildByPath( "Card2d" ) , this.card2d ) ;

            this.playerHeadMap = new Map<string, Sprite>();
            this.mapHead(this.root.getChildByPath("PlayerHead"), this.playerHeadMap);

            onComplete();

        });
    }

    public static mapHead(node: Node, map: Map<string, Sprite>) {
        for (let child of node.children) {
            map.set(child.name, child.getComponent(Sprite));
        } // end for 
    }

}
