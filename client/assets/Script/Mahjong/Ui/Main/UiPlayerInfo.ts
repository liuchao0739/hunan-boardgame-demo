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

import {Label, Node, Sprite} from "cc";
import {CommUtils} from "../../../framework/utils/CommUtils";
import {Player} from "../../World/Entity/Player/Player";


export class UiPlayerInfoCollection {

    public root: Node;
    public list = new Array<UiPlayerInfo>();

    public init(node: Node) {

        this.root = node.getChildByPath("PlayerInfo");
        var c = this.root.children;
        for (var i = 0; i < c.length; ++i) {
            var playerInfo = new UiPlayerInfo();
            playerInfo.init(c[i]);
            this.list.push(playerInfo);
            playerInfo.root.active = false;

        }
    }

    // 隐藏所有的托管标志
    public hideAllTrustee(): void {
        let cont = this.root.children;
        for (let mi = 0; mi < cont.length; ++mi) {
            cont[mi].getChildByPath("FlagTrustee").active = false;
        }
    }

    public clearAllList(): void {
        this.list = [];
    }


}

// 玩家信息
export class UiPlayerInfo {

    public root: Node;
    public icon: Sprite;
    public nickname: Label;
    public title: Label;
    public flagOffline: Node;
    public flagTrustee: Node;
    public flagReady: Node;
    public id: Label;

    public player: Player;

    public init(node: Node) {

        this.root = node;
        this.icon = this.root.getChildByPath("Icon").getComponent(Sprite);
        this.nickname = this.root.getChildByPath("Nickname/val").getComponent(Label);
        this.nickname.string = "";
        this.title = this.root.getChildByPath("Title/val").getComponent(Label);
        this.title.string = "";

        this.flagOffline = this.root.getChildByPath("FlagOffline");
        this.flagOffline.active = false;

        this.flagTrustee = this.root.getChildByPath("FlagTrustee");
        this.flagTrustee.active = false;

        this.flagReady = this.root.getChildByPath("FlagReady");
        this.flagReady.active = false;

        this.id = this.root.getChildByPath("Id/val").getComponent(Label);
        // this.id.node.parent.active = false ;

        // this.root.on( Input.EventType.TOUCH_END , ()=>{
        //     UiPlayerDetail.ins.show() ;
        //     UiPlayerDetail.ins.refresh( this.player ) ;
        // } ) ;

    }

    public refresh() {

        // 昵称
        this.nickname.string = this.player.info.nickname;
        // 称号
        this.title.string = this.player.info.title;

        // 头像
        CommUtils.updatePlayerHeadIcon(this.icon, this.player.info.iconId);

        // Id
        this.id.string = this.player.info.id + "," + this.player.gameData.seatId;

        // 准备
        this.flagReady.active = this.player.gameData.isReady;
        console.log(" refresh=====ready:", this.flagReady.active);

    }

}