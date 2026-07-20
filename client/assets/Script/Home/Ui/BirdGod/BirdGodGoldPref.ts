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

import {_decorator, Button, Label, Node} from 'cc';
import {BaseView} from '../../../framework/ui/BaseView';
import {eSysId, ViewMgr} from "../../../framework/mgr/ViewMgr";
import {App} from "../../../Module/App";
import {ClubEntity} from '../../Entity/ClubEntity';
import {BirdGodRulePref} from '../BirdGod/BirdGodRulePref';

const {ccclass, property} = _decorator;

@ccclass('BirdGodGoldPref')
export class BirdGodGoldPref extends BaseView {
    @property(Node)
    container: Node = null!;
    public isTongBi: boolean = false;

    constructor() {
        super();
        this.skinName = `prefab/BirdGod/BirdGodGoldPref`;
    }

    public initUI(): void {
        this.container = this.root.getChildByPath('contND')
        this.root.getChildByPath('closeBtn').on(Node.EventType.TOUCH_END, this.onCloseAll, this);
        this.root.getChildByPath('backBtn').on(Node.EventType.TOUCH_END, this.closeSelf, this);
        this.root.getChildByPath('contND/contItemND1').on(Button.EventType.CLICK, this.onContItemClick, this);
        this.root.getChildByPath('contND/contItemND2').on(Button.EventType.CLICK, this.onContItemClick, this);
        this.root.getChildByPath('contND/contItemND3').on(Button.EventType.CLICK, this.onContItemClick, this);
        this.root.getChildByPath('contND/contItemND4').on(Button.EventType.CLICK, this.onContItemClick, this);
        this.root.getChildByPath('contND/contItemND5').on(Button.EventType.CLICK, this.onContItemClick, this);
        this.root.getChildByPath('contND/contItemND6').on(Button.EventType.CLICK, this.onContItemClick, this);
    }

    public open(...params: any[]): void {

    }

    public onContItemClick(event: Event): void {
        console.log('雀神 选择级别')

        let itemNode = event.target as unknown as Node;
        if (!itemNode) {
            return;
        }

        let index = this.container.children.indexOf(itemNode);
        if (index === -1) {
            return;
        }

        let levelArr = [2, 4, 8, 12, 16, 20];
        ClubEntity.birdGodMatchLevel = levelArr[index];
        let view : BirdGodRulePref = App.getInst(ViewMgr).open(eSysId.BirdGodRulePref);
        if (this.isTongBi) {
            ClubEntity.birdGodMatchCoinType = 2;
            view.UpdateTongMatch();
        } else {
            ClubEntity.birdGodMatchCoinType = 1;
            view.UpdateGoldMatch();
        }
    }

    public onCloseAll(): void {
        // 不要 closeAll()：会清空 uiModuleLayer，后续弹窗挂载失败
        App.getInst(ViewMgr).closeView(this.viewKey);
        const match = App.getInst(ViewMgr).getView(eSysId.BirdGodMatchPref);
        if (match) {
            App.getInst(ViewMgr).closeView(match.viewKey);
        }
    }

    public UpdateGold(): void {
        console.log('金币场 点击');
        var bLB = this.root.getChildByPath("contND/contItemND1/bottomLB").getComponent(Label);
        bLB.string = "100金币";
        var bLB = this.root.getChildByPath("contND/contItemND2/bottomLB").getComponent(Label);
        bLB.string = "200金币";
        var bLB = this.root.getChildByPath("contND/contItemND3/bottomLB").getComponent(Label);
        bLB.string = "400金币";
        var bLB = this.root.getChildByPath("contND/contItemND4/bottomLB").getComponent(Label);
        bLB.string = "600金币";
        var bLB = this.root.getChildByPath("contND/contItemND5/bottomLB").getComponent(Label);
        bLB.string = "800金币";
        var bLB = this.root.getChildByPath("contND/contItemND6/bottomLB").getComponent(Label);
        bLB.string = "1000金币";
        this.isTongBi = false;
    }

    public UpdateTong(): void {
        console.log('铜币场 点击');
        var bLB = this.root.getChildByPath("contND/contItemND1/bottomLB").getComponent(Label);
        bLB.string = "100铜币";
        var bLB = this.root.getChildByPath("contND/contItemND2/bottomLB").getComponent(Label);
        bLB.string = "200铜币";
        var bLB = this.root.getChildByPath("contND/contItemND3/bottomLB").getComponent(Label);
        bLB.string = "400铜币";
        var bLB = this.root.getChildByPath("contND/contItemND4/bottomLB").getComponent(Label);
        bLB.string = "600铜币";
        var bLB = this.root.getChildByPath("contND/contItemND5/bottomLB").getComponent(Label);
        bLB.string = "800铜币";
        var bLB = this.root.getChildByPath("contND/contItemND6/bottomLB").getComponent(Label);
        bLB.string = "1000铜币";
        this.isTongBi = true;
    }

}
