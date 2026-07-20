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

import {_decorator, Component, instantiate, Node, Prefab} from 'cc';
import {EEventListenerPriority, ProtocolEventManager} from '../../../framework/event/event-management';
import {ProtocolHTTPManager} from '../../../framework/network/http';
import {EProtocolID} from '../../../framework/network/protocol-configs';
import {LoginEnity} from '../../Entity/Login';
import {ClubEntity} from '../../Entity/ClubEntity';
import {HomeScoreItemUI} from './HomeScoreItemUI';
import {HomeUiMain} from '../HomeUiMain';
import {ToastUI} from '../ToastUI';
import {App} from '../../../Module/App';

const {ccclass, property} = _decorator;

@ccclass('HomeScorePrefUI')
export class HomeScorePrefUI extends Component {
    @property({type: Prefab})
    scoreItemPref: Prefab | null = null;

    // 收藏牌
    private _storeBtn: Node | null = null;
    // 友人场
    private _friendBtn: Node | null = null;
    // 雀馆
    private _mahjongBtn: Node | null = null;
    // 牌谱总览
    private _scoreBtn: Node | null = null;

    // 牌谱查询
    private _searchBtn: Node | null = null;
    private _backBtn: Node | null = null;
    private _contND: Node | null = null;

    start() {
        this._searchBtn = this.node.getChildByPath("searchBtn");
        this._storeBtn = this.node.getChildByPath("ToggleGroup/storeToggle");
        this._friendBtn = this.node.getChildByPath("ToggleGroup/friendToggle");
        this._mahjongBtn = this.node.getChildByPath("ToggleGroup/mahjongToggle");
        this._scoreBtn = this.node.getChildByPath("ToggleGroup/scoreToggle");
        this._backBtn = this.node.getChildByPath("backBtn");
        this._contND = this.node.getChildByPath("ScrollView/view/content");
        console.log("cont:", this._contND);

        this._searchBtn.on(Node.EventType.TOUCH_END, this._onSearchTouch, this);
        this._storeBtn.on(Node.EventType.TOUCH_END, this._onStoreTouch, this);
        this._friendBtn.on(Node.EventType.TOUCH_END, this._onFriendTouch, this);
        this._mahjongBtn.on(Node.EventType.TOUCH_END, this._onMahjongTouch, this);
        this._scoreBtn.on(Node.EventType.TOUCH_END, this._onScoreTouch, this);
        this._backBtn.on(Node.EventType.TOUCH_END, this._onBackTouch, this);

        ProtocolEventManager.on(EProtocolID.CLUB_GET_PLAYER_GAME_HISTORY, this._onGetPlayerGameHistoryRespond, this, EEventListenerPriority.HIGHER);

        ProtocolEventManager.on(EProtocolID.CLUB_SAVEGAMEHISTORY, this._onSaveGameHistoryRespond, this, EEventListenerPriority.HIGHER);

        ProtocolEventManager.on(EProtocolID.CLUB_GETGAMEHISTORYDETAIL, this._onGetHistoryDetailRespond, this, EEventListenerPriority.HIGHER);

        this.init();
        this._getHistoryData(0);
    }

    public init(): void {
        this._contND.removeAllChildren();
    }

    // 牌谱查询
    private _onSearchTouch(): void {
        HomeUiMain.ins.uiModuleMgr.showUi("HomeScoreLinkPref");
    }

    private _onBackTouch(): void {
        console.log("back touch");
        this.node.destroy();
    }

    // 牌谱总览 
    private _onScoreTouch(): void {
        console.log("牌谱总览 touch");
        this.init();
        this._getHistoryData(0);
    }

    // 雀馆
    private _onMahjongTouch(): void {
        console.log("雀馆 touch");
        this.init();
        this._getHistoryData(1);
    }

    // 友人场
    private _onFriendTouch(): void {
        console.log("友人场 touch");
        this.init();
        this._getHistoryData(2);
    }

    // 收藏牌
    private _onStoreTouch(): void {
        console.log("收藏牌 touch");
        this.init();
        this._getHistoryData(3);
    }

    // 0 牌谱总览 1 俱乐部 2 友人场 3 收藏
    private _getHistoryData(mMode: number): void {
        let mParams = {
            "playerId": LoginEnity.playerID,
            // 0 牌谱总览 1 俱乐部 2 友人场 3 收藏
            "mode": mMode
        };
        ProtocolHTTPManager.load(EProtocolID.CLUB_GET_PLAYER_GAME_HISTORY, mParams, false);
    }

    // 获取牌谱
    private _onGetPlayerGameHistoryRespond(event): void {
        if (!this.node.active) {
            return;
        }
        console.log("==game history:", event);
        this._contND.removeAllChildren();
        if (event.success && event.data.res == "SUCCESS") {
            ClubEntity.scoreTableList = event.data.tableList;
            this._updateScoreList();
        }
    }

    // 收藏牌谱
    private _onSaveGameHistoryRespond(event): void {
        console.log("收藏结果：", event);
        if (event.success && event.data.res == "SUCCESS") {
            // 0--取消收藏 1--收藏
            let mTipsSTr: string = ClubEntity.saveHistoryData.save == 1 ? "收藏成功" : "取消收藏成功";
            App.getInst(ToastUI).showTips(mTipsSTr);
            let mCurrItemND: Node = this._contND.getChildByName(ClubEntity.saveHistoryData.tableId);
            if (mCurrItemND) {
                mCurrItemND.getComponent(HomeScoreItemUI).updateStoreIcon(ClubEntity.saveHistoryData.save == 1);
            }
        } else {
            let mTipsSTr: string = ClubEntity.saveHistoryData.save == 1 ? "收藏失败" : "取消收藏失败";
            App.getInst(ToastUI).showTips(mTipsSTr);
        }
        // let mND = this.node.getChildByName("HomeScoreStorePref");
        // console.log("收藏nd:", mND, "this.node:", this.node)
        // if(mND){
        //     mND.destroy();
        // }
        // else{
        //     mND = this.node.getChildByName("HomeScoreNoStorePref");
        //     console.log("取消nd:", mND, "this.node:", this.node);
        //     if(mND){
        //         mND.destroy();
        //     }
        // }
    }

    private _onGetHistoryDetailRespond(event): void {
        console.log("获取牌谱回放：", event)
    }

    private _updateScoreList(): void {
        for (let mi = 0; mi < ClubEntity.scoreTableList.length; mi++) {
            let mInst = instantiate(this.scoreItemPref);
            mInst.name = ClubEntity.scoreTableList[mi].tableId;
            this._contND.addChild(mInst);
            let mInstSC = mInst.getComponent(HomeScoreItemUI);
            // console.log("mi:", mi, "data:", ClubEntity.scoreTableList[mi]);
            mInstSC.updateData(ClubEntity.scoreTableList[mi]);
        }
    }

    onDestroy(): void {
        ProtocolEventManager.off(EProtocolID.CLUB_GET_PLAYER_GAME_HISTORY, this._onGetPlayerGameHistoryRespond, this);
        ProtocolEventManager.off(EProtocolID.CLUB_SAVEGAMEHISTORY, this._onSaveGameHistoryRespond, this);
        ProtocolEventManager.off(EProtocolID.CLUB_GETGAMEHISTORYDETAIL, this._onGetHistoryDetailRespond, this);
    }

    // update(deltaTime: number) {

    // }
}

