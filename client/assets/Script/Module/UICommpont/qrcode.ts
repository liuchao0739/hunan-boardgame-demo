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

import {QRCodeText} from "@akamfoad/qrcode";
import {_decorator, Color, Component, Graphics, Node, UITransform, v2} from "cc";

const {ccclass, property, requireComponent, executeInEditMode} = _decorator;

@ccclass('QRCode')
@executeInEditMode(true)
@requireComponent(Graphics)
export class QRCode extends Component {

    @property
    get foregroundColor(): Color {
        return this._foregroundColor;
    }

    set foregroundColor(value: Color) {
        if (value.equals(this._foregroundColor)) {
            return;
        }

        this._foregroundColor.set(value);

        this._refresh();
    }

    @property
    get backgroundColor(): Color {
        return this._backgroundColor;
    }

    set backgroundColor(value: Color) {
        if (value.equals(this._backgroundColor)) {
            return;
        }

        this._backgroundColor.set(value);

        this._refresh();
    }

    @property
    get content(): string {
        return this._content;
    }

    set content(value: string) {
        if (value === this._content) {
            return;
        }

        this._content = value;

        this._refresh();
    }

    @property({
        serializable: true,
    })
    private _foregroundColor: Color = Color.BLACK.clone();

    @property({
        serializable: true,
    })
    private _backgroundColor: Color = Color.WHITE.clone();

    @property({
        serializable: true,
    })
    private _content: string = '';

    private _timeout: number | null = null;
    private _rendered: boolean = false;

    get rendered(): boolean {
        return this._rendered;
    }

    protected onLoad(): void {
        this.node.on(Node.EventType.SIZE_CHANGED, this._refresh, this);
        this.node.on(Node.EventType.ANCHOR_CHANGED, this._refresh, this);

        this._refresh();
    }

    protected onDestroy(): void {
        if (this.isValid) {
            this.node.off(Node.EventType.SIZE_CHANGED, this._refresh, this);
            this.node.off(Node.EventType.ANCHOR_CHANGED, this._refresh, this);
        }
    }

    private _refresh(): void {
        this._rendered = true;

        const graphics = this.getComponent(Graphics);
        if (graphics === null || graphics === undefined) {
            return;
        }

        graphics.clear();

        if (this._timeout !== null && this._timeout !== undefined) {
            clearTimeout(this._timeout);
        }

        if (!this._content) {
            return;
        }

        const uiTransform = this.getComponent(UITransform);
        if (!uiTransform) {
            return;
        }

        this._rendered = false;

        this._timeout = setTimeout(() => {
            this._rendered = true;

            const graphics = this.getComponent(Graphics);
            if (graphics === null || graphics === undefined) {
                return;
            }

            const qrCodeText = new QRCodeText(this._content, {
                level: 'M',
                blackSymbol: '1',
                whiteSymbol: '0',
            });

            if (!qrCodeText) {
                console.error(`generating qrcode of "${this._content}" failed`);
                return;
            }

            const qrCodeString = qrCodeText.toString();
            const qrcodeSideLength = qrCodeString.indexOf('\n');

            const size = uiTransform.contentSize;
            const anchorPoint = uiTransform.anchorPoint;

            const startPoint = v2(-size.width * anchorPoint.x, size.height * (1 - anchorPoint.y));
            const unitWidth = size.width / qrcodeSideLength;
            const unitHeight = size.height / qrcodeSideLength;

            let currentStartPoint = startPoint.clone();
            let isPreviousRenderable: boolean = true;

            Array.prototype.forEach.call(qrCodeString, (char: string) => {
                switch (char) {
                    case '0':
                        graphics.fillColor = this._backgroundColor;
                        graphics.fillRect(currentStartPoint.x, currentStartPoint.y - unitHeight, unitWidth, unitHeight);

                        currentStartPoint.x += unitWidth;
                        isPreviousRenderable = true;

                        break;

                    case '1':
                        graphics.fillColor = this._foregroundColor;
                        graphics.fillRect(currentStartPoint.x, currentStartPoint.y - unitHeight, unitWidth, unitHeight);

                        currentStartPoint.x += unitWidth;
                        isPreviousRenderable = true;

                        break;

                    default:
                        if (isPreviousRenderable) {
                            currentStartPoint.x = startPoint.x;
                            currentStartPoint.y -= unitHeight;

                            isPreviousRenderable = false;
                        }
                }
            });
        }, 0.5);
    }

}
