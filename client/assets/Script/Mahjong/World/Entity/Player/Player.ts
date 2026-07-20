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

import {Card} from "../Card/Card";
import {WorldNodeSeat} from "../../Support/WorldNode";
import {SeatOrien} from "../../Support/SeatOrien";
import {CardShown} from "../CardShown/CardShown";
import {SpriteFrame} from "cc";
import {PrefabMgr} from "../../Support/Prefab";
import {UiPlayerInfo} from "../../../Ui/Main/UiPlayerInfo";
import {protocol} from "../../../../framework/network/protocol-configs";

// 玩家
export class Player {

    // 玩家信息
    public info = new PlayerInfo();

    // 游戏数据
    public gameData = new PlayerGameData();

    // 表现
    public persentation = new PlayerPersentation();

}

// 玩家信息
export class PlayerInfo {

    // 玩家ID
    public id: string;

    // 昵称
    public nickname: string;

    // 头像
    public iconId: number;

    // 称号
    public title: string;

    // 点数
    public dianShu: number;

    // 段位名称
    public lvName: string;
    // 段位等级
    public lvName2: string;

    // 平均顺位
    public pjsw: number = 0;

    // 1 - 4 位率
    public WL1: number = 0;
    public WL2: number = 0;
    public WL3: number = 0;
    public WL4: number = 0;
    // 和牌率
    public HP: number = 0;
    // 放铳率
    public FC: number = 0;
    // 立直率
    public LZ: number = 0;
    // 副露率
    public FL: number = 0;
    // 总对局数
    public ZDJS: number = 0;
    // 平均和牌巡目
    public PJHPXM: number = 0;
    // 平均和牌点数
    public PJHPDS: number = 0;
    // 平均放铳点数
    public PJFC: number = 0;

    // 趋势图
    public chart: number[];

}

// 玩家游戏数据
export class PlayerGameData {

    // 座位ID。服务器需要的数据。
    public seatId: number;

    // 座位方位
    public seatOrien: SeatOrien;

    // 手牌
    public handcard = new Array<Card>();

    // 打出去的牌
    public discard = new Array<Card>();

    // 明牌
    public cardShown = new Array<CardShown>();

    // 是否立直
    public isLiZhi = false;

    // 是否托管
    public isTrustee = false;

    // 是否准备
    public isReady = false;

    // 庄位
    public bankerSeatID: number = 0;
}

// 玩家的听牌数据
export class PlayerTingData {
    // 听牌数据--新添加，在处理荒牌流局时使用
    public static tingCards: string[] = [];
    // 玩家听牌数据--新添加，在处理荒牌流局时使用，四个玩家
    public static tingOtherCards: [][] = [[], [], [], []];

    // 立直要打出的牌数据--新添加，打出后会立直，在立直操作时使用
    public static willHuCards: string[] = [];

    // 胡牌信息
    public static huCardInfor: protocol.mahjong_jp.IHucardInfo[] = [];
}

// 表现
export class PlayerPersentation {

    // 座位节点
    public seat: WorldNodeSeat;

    // Ui 玩家信息
    public info: UiPlayerInfo;

    // 表现的节点索引
    public idx: number;
}

// 手的表现
export class Hand {

    public root: Node;


}

export class PlayerMgr {
    public static ins: PlayerMgr;
    public local: Player = null;
    public all = new Map<string, Player>();


}

export class PlayerHelper {

    // 取得头像图片
    public static getIconSpriteFrame(iconId: string): SpriteFrame {

        // 远程网络
        // if( iconId != null ){
        //     assetManager.loadRemote< ImageAsset >(iconId, {ext: ".png" }, ((err, asset) => {
        //         if( err != null ) {
        //             console.log( "头像下载失败" ) ;
        //             return ;
        //         }
        //         this.icon.spriteFrame = SpriteFrame.createWithImage(asset);
        //     }));
        // }

        if (PrefabMgr.playerIcon.has(iconId) == false) {
            // 使用默认
            iconId = "0";
        }
        let spr = PrefabMgr.playerIcon.get(iconId).spriteFrame;
        return spr;

    }

}