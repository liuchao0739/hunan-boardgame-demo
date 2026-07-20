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

import {Button, Label, Node, Sprite, Vec2} from "cc";
import {Player} from "../../World/Entity/Player/Player";
import {UiPopupHelper} from "../../../framework/utils/UiPopupHelper";
import {UiChart} from "./UiChart";
import {CommUtils} from "../../../framework/utils/CommUtils";

export class UiPlayerDetail {
    public static ins: UiPlayerDetail = null;

    public root: Node;

    // 场次玩法
    public round: Label;

    // 玩家头像
    public icon: Sprite;
    // // 玩家ID
    // public id : Label ;
    // // 玩家段位
    // public level : Label ;

    // 玩家昵称
    public nickNameLB: Label;
    // 平均顺位
    public pysw: Label;

    // 数据统计

    public WL1: Label;
    public WL2: Label;
    public WL3: Label;
    public WL4: Label;

    public HP: Label;
    public FC: Label;
    public LZ: Label;
    public FL: Label;

    public ZDJS: Label;
    public PJHPXM: Label;
    public PJHPDS: Label;
    public PJFC: Label;

    public chart: UiChart;

    public init(node: Node) {

        this.root = node.getChildByPath("PlayerDetail");
        this.root.active = false;

        this.root.getChildByPath("btnClose").on(Button.EventType.CLICK, () => {
            this.root.active = false;
        });

        // 基础信息
        this.icon = this.root.getChildByPath("Icon").getComponent(Sprite);
        // this.id = this.root.getChildByPath( "Id" ).getComponent( Label ) ;
        // this.level = this.root.getChildByPath( "Level" ).getComponent( Label ) ;
        this.nickNameLB = this.root.getChildByPath("nickLB").getComponent(Label);
        this.pysw = this.root.getChildByPath("PJSW/val").getComponent(Label);

        // 统计

        let root2 = this.root.getChildByPath("Statistical");

        this.WL1 = root2.getChildByPath("WL1/val").getComponent(Label);
        this.WL2 = root2.getChildByPath("WL2/val").getComponent(Label);
        this.WL3 = root2.getChildByPath("WL3/val").getComponent(Label);
        this.WL4 = root2.getChildByPath("WL4/val").getComponent(Label);

        this.HP = root2.getChildByPath("HP/val").getComponent(Label);
        this.FC = root2.getChildByPath("FC/val").getComponent(Label);
        this.LZ = root2.getChildByPath("LZ/val").getComponent(Label);
        this.FL = root2.getChildByPath("FL/val").getComponent(Label);

        this.ZDJS = root2.getChildByPath("ZDJS/val").getComponent(Label);
        this.PJHPXM = root2.getChildByPath("PJHPXM/val").getComponent(Label);
        this.PJHPDS = root2.getChildByPath("PJHPDS/val").getComponent(Label);
        this.PJFC = root2.getChildByPath("PJFC/val").getComponent(Label);

        this.chart = new UiChart();
        this.chart.init(this.root.getChildByPath("Chart"));

    }

    public show() {
        this.root.active = true;
        UiPopupHelper.show(this.root);

    }

    public refresh(player: Player) {
        this.refreshBase(player);
        this.refreshChart(player);
        this.refreshStatistical(player);
    }

    private refreshBase(player: Player) {
        CommUtils.updatePlayerHeadIcon(this.icon, player.info.iconId);
        // this.id.string = player.info.lvName ;
        // this.level.string = player.info.lvName2 ; 
        this.nickNameLB.string = player.info.nickname;
        this.pysw.string = player.info.pjsw.toFixed(2);

    }

    private refreshChart(player: Player) {

        this.chart.clear();
        let chartData = player.info.chart;
        for (let i = 0; i < chartData.length; ++i) {

            let n = chartData[i];
            this.chart.addPoint(new Vec2(i, 4 - n));

        } // end for
    }

    private refreshStatistical(player: Player) {
        let info = player.info;

        console.log("player:", player.info);
        console.log("infor:", info);
        this.WL1.string = info.WL1.toFixed(2) + "%";
        this.WL2.string = info.WL2.toFixed(2) + "%";
        this.WL3.string = info.WL3.toFixed(2) + "%";
        this.WL4.string = info.WL4.toFixed(2) + "%";

        this.HP.string = info.HP.toFixed(2) + "%";
        this.FC.string = info.FC.toFixed(2) + "%";
        this.LZ.string = info.LZ.toFixed(2) + "%";
        this.FL.string = info.FL.toFixed(2) + "%";

        this.ZDJS.string = info.ZDJS.toString();
        this.PJHPXM.string = info.PJHPXM.toFixed(2);
        this.PJHPDS.string = info.PJHPDS.toString();
        this.PJFC.string = info.PJFC.toString();
    }

}