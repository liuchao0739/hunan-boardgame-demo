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

import {AudioClip, director, Prefab, resources, SceneAsset} from "cc";
import {EProtocolID, protocol} from "../network/protocol-configs";
import {LoginEnity} from "../../Home/Entity/Login";
import {PrefabMgr} from "../../Mahjong/World/Support/Prefab";
import {SpriteMgr} from "./SpriteMgr";
import {EEventListenerPriority, ProtocolEventManager} from "../event/event-management";
import {ESceneVar, GlobalVar} from "../../GlobalVar";
import {CardInfo} from "../../Mahjong/World/Support/HandcardOp";
import {PrefabCache} from "../cache/PrefabCache";
import {AudioCache} from "../cache/AudioCache";
import {ProtocolHTTPManager} from "../network/http";
import {RoleCtrl} from "../../Module/role/RoleCtrl";
import {BagCtrl} from "../../Module/bag/BagCtrl";
import {eSettingKey, SettingCtrl} from "../../Module/Setting/SettingCtrl";
import {Player, PlayerMgr} from "../../Mahjong/World/Entity/Player/Player";
import {ShopCtrl} from "../../Module/store/ShopCtrl";
import {ClubCtrl} from "../../Module/club/ClubCtrl";
import {CallBack} from "../utils/CallBack";
import {WebSocketMgr} from "./WebSocketMgr";
import {App} from "../../Module/App";
import {eSysId, ViewMgr} from "./ViewMgr";
import {GameEntrance} from "../../Module/GameEntrance";
import {CommonDialog} from "../../Module/UICommpont/CommonDialog";
import {LocalCacheManager} from "../cache/local-cache";

/***
 * 加载流程
 * 1 preloadScene预加载场景
 *   resources加载prefab资源
 *   resources加载音频资源
 * 2 加载图片预制体（头像）
 * 3 获取游戏服务器地址
 * 4 获取个人信息 PROFILE_REQ(10020)
 * 5 获取个人俱乐部信息 CLUB_GET_PLAYER_INFOR_REQ(65015)
 * 6 连接登录游戏服
 *
 */
export class SceneMgr {
    private static _curProg: number = 0;
    private static _allProg: number = 100;
    private static _loadSceneName: string = "";
    private static _loadSceneCallFunc: Function | null = null;
    private static _loadSceneCallThis: Object | null = null;
    private static _onlyChangeScene: boolean = false;

    private static _curProtocolIDOfTempListener: EProtocolID | null = null;

    static runScene(mSceneName, mOnlyChange: boolean = false, mCallFunc: Function = null, mThisArg: Object = null): void {
        this._loadSceneName = mSceneName;
        this._loadSceneCallFunc = mCallFunc;
        this._loadSceneCallThis = mThisArg;
        this._onlyChangeScene = mOnlyChange;
        if (mSceneName == "Mahjong") {
            director.loadScene("LoadingScene", () => {
                director.preloadScene(mSceneName, (completedCount: number, totalCount: number, item: any) => {
                        // console.log("=====progres comp:", completedCount, "total:", totalCount, "item:", item);
                    },
                    (error: null | Error, sceneAsset?: SceneAsset) => {
                        this._afterLoadHandle();
                    });
            });
        } else {
            console.log("【runscene:】", mSceneName)
            director.preloadScene(mSceneName, (completedCount: number, totalCount: number, item: any) => {
                    // console.log("=====progres comp:", completedCount, "total:", totalCount, "item:", item);
                },
                (error: null | Error, sceneAsset?: SceneAsset) => {
                    this._afterLoadHandle();
                });
        }

    }
    public static runPureScene(mSceneName: string, mModuleName?: string): void {
        director.loadScene(mSceneName, (err, scene) => {

        })
    }

    /**
     * 加载完成后的处理
     */
    private static _afterLoadHandle() {
        switch (this._loadSceneName) {
            case `Home`:
                console.log("【load prefabs】");
                this._loadPrefabRes();
                break;
            case `Mahjong`:
                // 加载预制体
                PrefabMgr.init(() => {
                    CardInfo.init();
                    // Sound.init() ; 
                    // Music.init() ;
                    // Music.play() ;

                    this._loadSceneFinish();
                });
                break;
            default:
                this._loadSceneFinish();
                break;
        }
    }

    private static _loadPrefabRes(): void {
        resources.loadDir("prefab", Prefab, (err, data) => {
            // console.log("【加载prefab资源】", data);
            PrefabCache.init();
            PrefabCache.mapPrefab(data);

            this._loadAudioRes();
        });
    }

    private static _loadAudioRes(): void {
        resources.loadDir("Audio", AudioClip, (err, data) => {
            console.log("【加载Audio资源】", data);
            AudioCache.init();
            AudioCache.mapAudio(data);

            SpriteMgr.init(this._onLoadSpritePrefComp.bind(this));
        });
    }


    private static _onLoadSpritePrefComp() {
        // 3 获取游戏服务器地址

        this._curProtocolIDOfTempListener = EProtocolID.GET_SERVER_URL;
        ProtocolEventManager.on(this._curProtocolIDOfTempListener, this._onServerURLRespond, this, EEventListenerPriority.HIGHER);

        ProtocolHTTPManager.load(EProtocolID.GET_SERVER_URL, {
            account: LoginEnity.accountID,
        }, false);
    }

    private static _onServerURLRespond(event) {
        console.log("服务器地址：", event);
        LoginEnity.serverURL = null;
        if (event.success && event.data) {
            LoginEnity.serverURL = event.data.serverURL;
        }

        this._curProtocolIDOfTempListener = EProtocolID.PROFILE_REQ;
        ProtocolEventManager.on(this._curProtocolIDOfTempListener, this._onProfileRespond, this, EEventListenerPriority.HIGHER);

        // 4 获取个人信息
        ProtocolHTTPManager.load(EProtocolID.PROFILE_REQ, {
            accountId: LoginEnity.accountID,
        }, false);
    }

    private static _onProfileRespond(event): void {
        ProtocolEventManager.off(event.protocolID, this._onProfileRespond, this);
        this._curProtocolIDOfTempListener = null;
        console.log("========profile event:", event);
        if (event.success && event.data.res == "SUCCESS") {
            LoginEnity.nickName = event.data["name"];
            LoginEnity.avatarTID = event.data["avatarId"];
        }

        //获取个人信息
        App.getInst(RoleCtrl).RoleSimpleInfoReq(Number(LoginEnity.accountID), new CallBack(() => {
            //初始化设置
            App.getInst(SettingCtrl).init();
            //获取背包信息
            App.getInst(BagCtrl).pbGetBag(LoginEnity.playerID);
            //获取weBao信息
            App.getInst(ShopCtrl).GetWBBindInfoReq(LoginEnity.playerID);

            // 获取出牌方式 操作方式 1双击出牌  2拖拽出牌
            let cacheOperation = LocalCacheManager.read('operation');
            if (cacheOperation && cacheOperation.type) {
                App.getInst(SettingCtrl).set(eSettingKey.operationType, cacheOperation.type);
            }

            // 5 获取俱乐部个人信息
            App.getInst(ClubCtrl).GetPlayerInfoReq(LoginEnity.playerID, 0, new CallBack(this._onClubPlayerInforRespond, this));
        }, this), new CallBack(() => {
            //登出到登录界面
            let view: CommonDialog = App.getInst(ViewMgr).open(eSysId.CommonDialog, [`登陆失败`, new CallBack(() => {
                App.getInst(GameEntrance).logout();
            }, this), null, "", true, 1]);
        }, this));
    }

    private static _onClubPlayerInforRespond(params: protocol.club.IGetPlayerInfoResp): void {
        this._loadSceneFinish();
    }

    private static _loadSceneFinish() {
        console.log("切换场景:", this._loadSceneName);
        director.loadScene(this._loadSceneName, (err, data) => {


            if (this._loadSceneName === "Login") {

            } else if (this._loadSceneName === "Home") {
                // 在HomeInit中初始话，在数据回来比较快的情况下会导致空
                if (!PlayerMgr.ins) {
                    PlayerMgr.ins = new PlayerMgr();
                }
                if (!PlayerMgr.ins.local) {
                    PlayerMgr.ins.local = new Player();
                }
                console.log("seatoriend:", PlayerMgr.ins.local.gameData.seatOrien);
                console.log("player mgr:", PlayerMgr.ins);

                GlobalVar.currScene = ESceneVar.SCENE_HOME;
                if (!this._onlyChangeScene) {
                    // 连接登录游戏服
                    // Comm.connect3(LoginEnity.account, LoginEnity.token, LoginEnity.accountID, LoginEnity.serverURL);
                    // if(!WebSocketMgr.Inst.isConnect()){
                    //     WebSocketMgr.Inst.connect(LoginEnity.serverURL);
                    // }
                    if (LoginEnity.serverURL) {
                        let websocket = WebSocketMgr.Inst;
                        websocket.reset();
                        websocket.newConnect(LoginEnity.serverURL);
                        websocket.setExpireInterval(15);
                    }
                }
            } else if (this._loadSceneName == "Mahjong") {
                GlobalVar.currScene = ESceneVar.SCENE_GAME;
            }
            if (this._loadSceneCallFunc) {
                this._loadSceneCallFunc.call(this._loadSceneCallThis);
            }
        });
    }
}

