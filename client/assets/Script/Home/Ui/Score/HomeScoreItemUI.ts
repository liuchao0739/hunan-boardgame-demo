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

import {_decorator, Component, Label, Node, Toggle} from 'cc';
import {HomeScorePlayerUI} from './HomeScorePlayerUI';
import {EProtocolID, protocol} from '../../../framework/network/protocol-configs';
import {ProtocolHTTPManager} from '../../../framework/network/http';
import {LoginEnity} from '../../Entity/Login';
import {HomeUiMain} from '../HomeUiMain';
import {ClubEntity} from '../../Entity/ClubEntity';
import {TimeUtils} from '../../../framework/utils/time-utils';

const {ccclass, property} = _decorator;

@ccclass('HomeScoreItemUI')
export class HomeScoreItemUI extends Component {

    // 收藏的名字
    private _scoreNameLB: Label | null = null;
    // 收藏
    private _storeND: Node | null = null;
    private _storeTog: Toggle | null = null;
    // 分享
    private _shareBtn: Node | null = null;
    // 查看
    private _checkBtn: Node | null = null;
    // 改名
    private _editBtn: Node | null = null;

    // 俱乐部名字
    private _clubNameLB: Label | null = null;
    // 牌局模式
    private _tableModeLB: Label | null = null;
    // 牌局时间
    private _timeLB: Label | null = null;

    private _playerUIArr: HomeScorePlayerUI[] = [];

    private _gameId: number = null;
    private _tableId: string = null;
    private _paipuLink: string = null;
    private _anoPaipuLink: string = null;


    // 牌谱是否已收藏
    private _isStoreFlag: boolean = false;

    onLoad() {
        this._scoreNameLB = this.node.getChildByPath("head/scoreNameLB").getComponent(Label);
        this._storeND = this.node.getChildByPath("head/storeND");
        this._storeTog = this.node.getChildByPath("head/storeTog").getComponent(Toggle);
        this._shareBtn = this.node.getChildByPath("head/shareBtn");
        this._checkBtn = this.node.getChildByPath("head/checkBtn");
        this._editBtn = this.node.getChildByPath("head/editBtn");
        this._clubNameLB = this.node.getChildByPath("clubInfor/clubNameLB").getComponent(Label);
        this._tableModeLB = this.node.getChildByPath("clubInfor/modeLB").getComponent(Label);
        this._timeLB = this.node.getChildByPath("clubInfor/timeLB").getComponent(Label);

        this._playerUIArr = [];
        this._playerUIArr.push(this.node.getChildByPath("playerInforND0").getComponent(HomeScorePlayerUI));
        this._playerUIArr.push(this.node.getChildByPath("playerInforND1").getComponent(HomeScorePlayerUI));
        this._playerUIArr.push(this.node.getChildByPath("playerInforND2").getComponent(HomeScorePlayerUI));
        this._playerUIArr.push(this.node.getChildByPath("playerInforND3").getComponent(HomeScorePlayerUI));

        this._storeND.on(Node.EventType.TOUCH_END, this._storeNodeTouch, this);
        this._shareBtn.on(Node.EventType.TOUCH_END, this._shareTouch, this);
        this._checkBtn.on(Node.EventType.TOUCH_END, this._checkTouch, this);
        this._editBtn.on(Node.EventType.TOUCH_END, this._onEditTouch, this);


        // console.log("score item ui start");
    }

    private _storeNodeTouch() {
        // console.log("收藏");

        if (this._storeTog.isChecked) {
            ClubEntity.saveHistoryData = {
                playerId: LoginEnity.playerID,
                gameId: this._gameId,
                tableId: this._tableId,
                // 0--取消收藏 1--收藏
                save: 0,
                name: "",
            };
            HomeUiMain.ins.uiModuleMgr.showUi("HomeScoreNoStorePref");
        } else {
            ClubEntity.saveHistoryData = {
                playerId: LoginEnity.playerID,
                gameId: this._gameId,
                tableId: this._tableId,
                // 0--取消收藏 1--收藏
                save: 1,
                name: "",
            };
            HomeUiMain.ins.uiModuleMgr.showUi("HomeScoreStorePref");
        }
    }

    // 分享
    private _shareTouch() {
        console.log("分享");
        ClubEntity.paipuLink = this._paipuLink;
        ClubEntity.anoPaipuLink = this._anoPaipuLink;
        HomeUiMain.ins.uiModuleMgr.showUi("HomeScoreSharePref");
    }

    // 查看
    private _checkTouch() {
        // console.log("查看");
        // App.getInst(ToastUI).showTips("暂时不能查看");// 等Martin与Jack调试好
        // return;
        let mParams = {
            gameId: this._gameId,
            tableId: this._tableId,
            playerId: LoginEnity.playerID,
            paipuLink: this._paipuLink,
            // 0--查看牌谱 1--链接查询牌谱
            mode: 0
        };
        ProtocolHTTPManager.load(EProtocolID.CLUB_GETGAMEHISTORYDETAIL, mParams, false);
    }

    // 改名
    private _onEditTouch(): void {

    }


    public updateData(mResData: protocol.club.TableInfo): void {
        // console.log("this:", this.node);
        this._gameId = mResData.gameId;
        this._tableId = mResData.tableId;
        this._paipuLink = mResData.paipuLink;
        this._anoPaipuLink = mResData.anoPaipuLink;

        // 有收藏名字显示收藏名字
        if (mResData.paipuName) {
            this._scoreNameLB.string = mResData.paipuName;
        } else {
            this._scoreNameLB.string = "雀の战";
        }


        this._clubNameLB.string = mResData.clubName;
        // 0--取消收藏 1--收藏
        this._storeTog.isChecked = (mResData.isSaved == 1 ? true : false);
        this._isStoreFlag = (mResData.isSaved == 1 ? true : false);
        if (mResData.mode == 0) {
            this._tableModeLB.string = "四人•";
        }
        // 局数 0--东风 1--东南战
        if (mResData.roundNo == 0) {
            this._tableModeLB.string += "东风";
        } else if (mResData.roundNo == 1) {
            this._tableModeLB.string += "东南战";
        }
        // finishAt        = 23;                 //牌桌结束时间
        this._timeLB.string = TimeUtils.formatDate(mResData.finishAt, "-", true); // mResData.finishAt;

        // 对数据排序
        mResData.players.sort((a, b) => {
            return a.rank - b.rank;
        });

        for (let mi = 0; mi < mResData.players.length; mi++) {
            if (mi > 3) {
                break;
            }
            this._playerUIArr[mi].updateData(mResData.isDiamondClub == 1, mResData.players[mi].playerId == LoginEnity.playerID, mResData.players[mi]);
        }

    }

    public updateStoreIcon(mShowStore: boolean) {
        this._storeTog.isChecked = mShowStore;
        this._isStoreFlag = mShowStore;

    }

    protected onDestroy(): void {

    }

    // update(deltaTime: number) {

    // }
}

