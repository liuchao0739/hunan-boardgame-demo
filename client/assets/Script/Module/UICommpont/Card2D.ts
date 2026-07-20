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

import {_decorator, CCInteger, Component, Node, resources, Sprite, SpriteFrame} from "cc";
import {ScMapping} from "../../Mahjong/Communication/CardIdMapping";

const {ccclass, property} = _decorator;

@ccclass("Card2d")
export class Card2d extends Component {
    @property({type: CCInteger, tooltip: "卡牌Id"})
    public cardId: number;
    @property({type: Node, tooltip: "卡牌容器"})
    public spriteNode: Node;

    protected onLoad(): void {
        this.updateCard();
    }

    public updateCard(): void {
        if (this.cardId < 0) return;
        let cardStr = ScMapping.cardId_s2c(this.cardId);
        let url = `ui/Card2d/${cardStr}/spriteFrame`;
        resources.load(url, SpriteFrame, (err, spData) => {
            if (err) {
                console.error(err);
                return;
            }
            if (!this.node.active) return;
            let sp = this.spriteNode.getComponent(Sprite);
            sp.spriteFrame = spData;
        })
    }
}