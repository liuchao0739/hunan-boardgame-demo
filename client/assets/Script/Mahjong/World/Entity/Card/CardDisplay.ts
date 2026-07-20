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

import {instantiate, Node, tween, v3, Vec3} from "cc";
import {PrefabMgr} from "../../Support/Prefab";
import {Card} from "./Card";

// 牌的显示控制
export class CardDisplay {

    // 显示立牌
    public static showStand(card: Card) {
        card.presentation3d.main.eulerAngles = new Vec3(270, 180, 0);
        card.presentation3d.main.setPosition(new Vec3(0, 0.021, 0));
        // 阴影
        this.showShadowStand(card);
    }

    // 显示阴影立
    public static showShadowStand(card: Card) {
        card.presentation3d.shadowLie?.destroy();

        let shadow: Node;
        if (card.presentation3d.shadowStand != null) return

        shadow = instantiate(PrefabMgr.cardShadowStand);
        card.presentation3d.shadowStand = shadow;
        shadow.setParent(card.presentation3d.root);
    }

    // 显示躺
    public static showLie(card: Card) {
        card.presentation3d.main.eulerAngles = new Vec3(0, 180, 0);
        card.presentation3d.main.setPosition(new Vec3(0, 0.01, 0));
        // console.log("show lie card eulerangles:", card.presentation3d.main.eulerAngles);
        this.showShadowLie(card);
    }

    // 躺 背面
    static showLieBack(card: Card) {
        card.presentation3d.main.eulerAngles = new Vec3(0, 180, 180);
        card.presentation3d.main.setPosition(new Vec3(0, 0.01, 0));
        this.showShadowLie(card);
    }

    // 显示阴影躺
    public static showShadowLie(card: Card) {
        card.presentation3d.shadowStand?.destroy();
        let shadow: Node;
        if (card.presentation3d.shadowLie != null) return
        shadow = instantiate(PrefabMgr.cardShadowLie);
        card.presentation3d.shadowLie = shadow;
        shadow.setParent(card.presentation3d.root);
    }

    // 显示躺。逆时针90度。底部对其。
    public static showLieAnticlockwise90(card: Card) {
        card.presentation3d.main.eulerAngles = new Vec3(0, -90, 0);
        card.presentation3d.main.setPosition(new Vec3(0, 0.01, 0.006));
        // 阴影
        this.showShadowLie(card);
        card.presentation3d.shadowLie.position = new Vec3(0, 0.001, 0.005);
        card.presentation3d.shadowLie.eulerAngles = new Vec3(-90, 90, 0);
    }

    // 显示牌的高亮图形与箭头
    public static showCardLight(card: Card) {
        if (!card.presentation3d.cardLight) {
            const lightNode: Node = instantiate(PrefabMgr.cardBackLight);
            card.presentation3d.cardLight = lightNode;
            lightNode.setParent(card.presentation3d.root);
        }
        card.presentation3d.cardLight.active = true;
        card.presentation3d.cardLight.eulerAngles = card.presentation3d.shadowLie.eulerAngles;
        if (!card.presentation3d.cardArrow) {
            const arrowNode: Node = instantiate(PrefabMgr.cardArrow);
            card.presentation3d.cardArrow = arrowNode;
            arrowNode.setParent(card.presentation3d.root);
        }
        card.presentation3d.cardArrow.active = true;
        card.presentation3d.cardArrow.eulerAngles = new Vec3(card.presentation3d.shadowLie.eulerAngles.x, 90, 0);
    }

    public static removeCardLight(card: Card): void {
        if (card.presentation3d.cardLight) {
            card.presentation3d.cardLight.destroy();
            card.presentation3d.cardLight = null;
        }
        if (card.presentation3d.cardArrow) {
            card.presentation3d.cardArrow.destroy();
            card.presentation3d.cardArrow = null;
        }
    }

    public static showCardFlash(card: Card): void {
        if (!card.presentation3d.cardFlash) {
            const flashNode: Node = instantiate(PrefabMgr.cardFlash);
            flashNode.position = v3(0, 0, 0);
            flashNode.setParent(card.presentation3d.main);
            card.presentation3d.cardFlash = flashNode;
        }
        card.presentation3d.cardFlash.active = true;
    }

    public static removeCardFlash(card: Card): void {
        if (card.presentation3d.cardFlash) {
            card.presentation3d.cardFlash.destroy();
            card.presentation3d.cardFlash = null;
        }
    }

    public static showCardWinningEffect(card: Card): void {
        if (!card.presentation3d.winningEffect) {
            const winningEffectNode: Node = instantiate(PrefabMgr.cardWinningEffect);
            winningEffectNode.position = v3(0, 0, 0);
            winningEffectNode.setParent(card.presentation3d.root);
            card.presentation3d.winningEffect = winningEffectNode;
        }
    }

    public static removeCardWinningEffect(card: Card): void {
        if (card.presentation3d.winningEffect) {
            card.presentation3d.winningEffect.destroy()
            card.presentation3d.winningEffect = null;
        }
    }

    public static showCardRiichiEffect(card: Card): void {
        if (!card.presentation3d.riichiEffect) {
            card.presentation3d.main.active = false;
            if (card.presentation3d.shadowStand) {
                card.presentation3d.shadowStand.active = false;
            }
            if (card.presentation3d.shadowLie) {
                card.presentation3d.shadowLie.active = false;
            }
            if (card.presentation3d.cardLight) {
                card.presentation3d.cardLight.active = false;
            }
            if (card.presentation3d.cardArrow) {
                card.presentation3d.cardArrow.active = false;
            }
            if (card.presentation3d.cardFlash) {
                card.presentation3d.cardFlash.active = false;
            }

            const riichiEffectNode: Node = instantiate(PrefabMgr.cardRiichiEffect);
            riichiEffectNode.position = v3(0, 0, 0);
            riichiEffectNode.setParent(card.presentation3d.root);

            card.presentation3d.riichiEffect = riichiEffectNode;

            tween(riichiEffectNode)
                .delay(0.81)
                .call(() => {
                    card.presentation3d.main.active = true;
                    if (card.presentation3d.shadowStand) {
                        card.presentation3d.shadowStand.active = true;
                    }
                    if (card.presentation3d.shadowLie) {
                        card.presentation3d.shadowLie.active = true;
                    }
                    if (card.presentation3d.cardLight) {
                        card.presentation3d.cardLight.active = true;
                    }
                    if (card.presentation3d.cardArrow) {
                        card.presentation3d.cardArrow.active = true;
                    }
                    if (card.presentation3d.cardFlash) {
                        card.presentation3d.cardFlash.active = true;
                    }
                })
                .start();
        }
    }

    public static removeCardRiichiEffect(card: Card): void {
        if (card.presentation3d.riichiEffect) {
            card.presentation3d.riichiEffect.destroy()
            card.presentation3d.riichiEffect = null;

            card.presentation3d.main.active = true;
        }
    }

    public static showCardUIFlash(card: Card): void {
        if (!card.presentation2d.cardFlash) {
            const flashNode: Node = instantiate(PrefabMgr.card2d.get("flash"));
            flashNode.position = v3(0, 0, 0);
            flashNode.setParent(card.presentation2d.root);

            card.presentation2d.cardFlash = flashNode;
        }
        card.presentation2d.cardFlash.active = true;
    }

    public static removeCardUIFlash(card: Card): void {
        if (card.presentation2d.cardFlash) {
            card.presentation2d.cardFlash.destroy();
            card.presentation2d.cardFlash = null;
        }
    }

}
