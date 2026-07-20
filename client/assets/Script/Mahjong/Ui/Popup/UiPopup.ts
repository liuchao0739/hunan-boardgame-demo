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

import {Node} from "cc";
import {UiOp, UiOpBack} from "./UiOp";
import {UiSelect} from "./UiSelect";
import {UiTing} from "./UiTing";
import {UiCountdown} from "./UiCountdown";
import {UiSettleZhanJi} from "./Settle/UiSettleZhanJi";
import {UiSettleDianShu} from "./Settle/UiSettleDianShu";
import {UiSettleLiuJuZhongTu} from "./Settle/UiSettleLiuJuZhongTu";
import {UiSettleLiuJuHuangPai} from "./Settle/UiSettleLiuJuHuangPai";
import {UiSettings} from "./UiSettings";
import {UiPlayerDetail} from "./UIPlayerDetail";
import {UiHelp} from "./UiHelp";
import {UiSettleGame} from "./Settle/UiSettleGame";

export class UiPopup {

    public root: Node;

    // 操作UI
    public op = new UiOp();
    public opBack = new UiOpBack();
    // 操作牌型选择
    public select = new UiSelect();
    // 听牌
    public ting = new UiTing();

    public settleLocalPlayer = new UiSettleZhanJi();
    public settleLiuJuZhongTu = new UiSettleLiuJuZhongTu();
    public settleLiuJuHuangPai = new UiSettleLiuJuHuangPai();

    public init(node: Node) {

        this.root = node.getChildByPath("Popup");
        this.root.active = true;

        this.op.init(this.root);

        this.select.init(this.root);

        this.ting.init(this.root);

        this.opBack.init(this.root);

        this.settleLocalPlayer.init(this.root);
        this.settleLiuJuHuangPai.init(this.root);
        this.settleLiuJuZhongTu.init(this.root);

        UiSettleDianShu.ins = new UiSettleDianShu();
        UiSettleDianShu.ins.init(this.root);

        UiSettings.ins = new UiSettings();
        UiSettings.ins.init(this.root);

        UiPlayerDetail.ins = new UiPlayerDetail();
        UiPlayerDetail.ins.init(this.root);

        UiHelp.ins = new UiHelp();
        UiHelp.ins.init(this.root.getChildByPath("Help"));

        UiCountdown.ins = new UiCountdown();
        UiCountdown.ins.init(this.root);

        UiSettleGame.ins = new UiSettleGame();
        UiSettleGame.ins.init(this.root);

    }

}

