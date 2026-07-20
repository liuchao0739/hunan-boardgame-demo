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

import {_decorator, Component, director, EditBox, EventTouch, Node, Toggle, ToggleContainer, UITransform} from "cc";
import {EProtocolID} from "../../../framework/network/protocol-configs";
import {ClubEntity} from "../../Entity/ClubEntity";
import {LoginEnity} from "../../Entity/Login";
import {EEventListenerPriority, ProtocolEventManager} from "../../../framework/event/event-management";
import {ProtocolHTTPManager} from "../../../framework/network/http";
import {HomeUiMain} from "../HomeUiMain";
import {EventConst} from "../../../const/EventConst";
import {ToastUI} from "../ToastUI";
import {App} from "../../../Module/App";

const {ccclass, property} = _decorator;

@ccclass('ClubUICreateTable')
export class ClubUICreateTable extends Component {
    private _backBtn: Node | null = null;
    private _contND: Node | null = null;
    private _roundTG: ToggleContainer | null = null;
    private _thinkTG: ToggleContainer | null = null;
    private _levelND: Node | null = null;
    private _bringND: Node | null = null;
    private _feeND: Node | null = null;
    private _feeNote: Node | null = null;
    private _levelEB: EditBox | null = null;
    private _bringEB: EditBox | null = null;
    private _feeEB: EditBox | null = null;
    private _moreTG: Toggle | null = null;
    private _noMoreTG: Toggle | null = null;
    private _moreSetND: Node | null = null;
    private _startEB: EditBox | null = null;
    private _redTG: ToggleContainer | null = null;
    // private _exp1EB: EditBox | null = null;
    // private _exp2EB: EditBox | null = null;
    // private _exp3EB: EditBox | null = null;
    // private _exp4EB: EditBox | null = null;
    private _expTG: ToggleContainer | null = null;
    private _headTG: ToggleContainer | null = null;
    private _doubleTG: ToggleContainer | null = null;
    private _hintTG: ToggleContainer | null = null;
    private _shortTG: ToggleContainer | null = null;
    private _noWinTG: ToggleContainer | null = null;
    // public autoTG:ToggleContainer | null = null;// 暂时去掉自动开桌
    private _createBtn: Node | null = null;
    private _headNote: Node | null = null;// 头跳问号
    private _doubleNote: Node | null = null;// 双倍役满问号
    private _tipsNote: Node | null = null;// 便捷提示问号
    private _liujuNote: Node | null = null;// 途中流局问号
    // private _autoNote:Node | null = null;// 自动开桌问号

    private readonly CONT_H_S = 550;
    private readonly CONT_H_L = 950;
    private _moreFlag: boolean = false;

    onLoad(): void {
        this._backBtn = this.node.getChildByPath("bg/backBtn");
        let mContND = this.node.getChildByPath("bg/contNode/contSV/view/content");
        this._contND = mContND;
        this._roundTG = mContND.getChildByPath("Label02/roundTG").getComponent(ToggleContainer);
        this._thinkTG = mContND.getChildByPath("Label03/thinkTG").getComponent(ToggleContainer);
        this._levelND = mContND.getChildByPath("Label04");
        this._bringND = mContND.getChildByPath("Label05");
        this._feeND = mContND.getChildByPath("Label06");
        this._feeNote = mContND.getChildByPath("Label06/feeNote");
        this._levelEB = mContND.getChildByPath("Label04/level/levelEB").getComponent(EditBox);
        this._bringEB = mContND.getChildByPath("Label05/bring/bringEB").getComponent(EditBox);
        this._feeEB = mContND.getChildByPath("Label06/fee/feeEB").getComponent(EditBox);
        this._moreTG = mContND.getChildByPath("Label07/moreTG/Toggle2").getComponent(Toggle);
        this._noMoreTG = mContND.getChildByPath("Label07/moreTG/Toggle1").getComponent(Toggle);
        this._moreSetND = mContND.getChildByPath("moreSetND");
        this._startEB = mContND.getChildByPath("moreSetND/start/startEB").getComponent(EditBox);
        this._redTG = mContND.getChildByPath("moreSetND/redTG").getComponent(ToggleContainer);
        // this._exp1EB = mContND.getChildByPath("moreSetND/exp1/exp1EB").getComponent(EditBox);
        // this._exp2EB = mContND.getChildByPath("moreSetND/exp2/exp2EB").getComponent(EditBox);
        // this._exp3EB = mContND.getChildByPath("moreSetND/exp3/exp3EB").getComponent(EditBox);
        // this._exp4EB = mContND.getChildByPath("moreSetND/exp4/exp4EB").getComponent(EditBox);
        this._expTG = mContND.getChildByPath("moreSetND/expTG").getComponent(ToggleContainer);
        this._headTG = mContND.getChildByPath("moreSetND/headTG").getComponent(ToggleContainer);
        this._doubleTG = mContND.getChildByPath("moreSetND/doubleTG").getComponent(ToggleContainer);
        this._hintTG = mContND.getChildByPath("moreSetND/hintTG").getComponent(ToggleContainer);
        this._shortTG = mContND.getChildByPath("moreSetND/shortTG").getComponent(ToggleContainer);
        this._noWinTG = mContND.getChildByPath("moreSetND/noWinTG").getComponent(ToggleContainer);
        // this.autoTG    = mContND.getChildByPath("moreSetND/autoTG").getComponent(ToggleContainer);
        this._headNote = mContND.getChildByPath("moreSetND/Label11/headNote");
        this._doubleNote = mContND.getChildByPath("moreSetND/Label12/doubleNote");
        this._tipsNote = mContND.getChildByPath("moreSetND/Label14/tipsNote");
        this._liujuNote = mContND.getChildByPath("moreSetND/Label15/liujuNote");
        // this._autoNote   = mContND.getChildByPath("moreSetND/Label16/autoNote");
        this._createBtn = this.node.getChildByPath("bg/createBtn");
        this._backBtn.on(Node.EventType.TOUCH_END, this._onBackTouch, this);
        this._levelEB.node.on(EditBox.EventType.EDITING_DID_ENDED, this._onLevelEditEnd, this);
        this._bringEB.node.on(EditBox.EventType.EDITING_DID_ENDED, this._onBringEditEnd, this);
        this._feeEB.node.on(EditBox.EventType.EDITING_DID_ENDED, this._onFeeEditEnd, this);
        this._createBtn.on(Node.EventType.TOUCH_END, this._onCreateTouch, this);
        this._moreTG.node.on(Toggle.EventType.CLICK, this._onMoreToggle, this);
        this._noMoreTG.node.on(Toggle.EventType.CLICK, this._onNoMoreToggle, this);
        this._feeNote.on(Node.EventType.TOUCH_END, this._onFeeNoteTouch, this);
        this._headNote.on(Node.EventType.TOUCH_END, this._onHeadNoteTouch, this);
        this._doubleNote.on(Node.EventType.TOUCH_END, this._onDoubleNoteTouch, this);
        this._tipsNote.on(Node.EventType.TOUCH_END, this._onTipsNoteTouch, this);
        this._liujuNote.on(Node.EventType.TOUCH_END, this._onLiujuNoteTouch, this);
        // this._autoNote.on(Node.EventType.TOUCH_END, this._onAutoNoteTouch, this);
        this._moreFlag = false;

        ProtocolEventManager.on(EProtocolID.CLUB_CREATE_TABLE_REQ, this._onTableCreateRespond, this, EEventListenerPriority.HIGHER);
        ProtocolEventManager.on(EProtocolID.CLUB_GET_TABLELIST_REQ, this._onTableListRespond, this, EEventListenerPriority.HIGHER);
    }

    private _onBackTouch(evt: EventTouch) {
        this.node.destroy();
    }

    private _onFeeNoteTouch(): void {
        let mParamObj = {title: "服务费", cont: "    最终结算时，按百分比扣除排名第一的玩家的盈利。扣除金币归平台所有。"};
        HomeUiMain.ins.popUpWin.showCommPopup(mParamObj);
    }

    private _onHeadNoteTouch(): void {
        let mParamObj = {
            title: "头跳",
            cont: `    启用后，当点炮有多家点和的时候，只有逆时针方向最靠近放铳的玩家的荣和才能成立；`
        };
        HomeUiMain.ins.popUpWin.showCommPopup(mParamObj);
    }

    private _onDoubleNoteTouch(): void {
        let mParamObj = {
            title: "双倍役满",
            cont: `    不启用时，四暗刻单骑、纯正九莲宝灯、国士无双十三面、大四喜等牌型只计算单倍役满；`
        };
        HomeUiMain.ins.popUpWin.showCommPopup(mParamObj);
    }

    private _onTipsNoteTouch(): void {
        let mParamObj = {
            title: "便捷提示",
            cont: "    包含同牌提示，即鼠标指针悬停在手牌某张牌上时，会显示亮色。听牌提示：听牌时，提示可胡哪几张牌。宝牌提示：宝牌（包括杠后新出现的宝牌）、赤牌，均显示闪亮；"
        };
        HomeUiMain.ins.popUpWin.showCommPopup(mParamObj);
    }

    private _onLiujuNoteTouch(): void {
        let mParamObj = {
            title: "途中流局", cont: `    设置为有时，
        四杠散了流局，2人及以上合计开杠4次则流局。若1人开杠4次，则不流局，且当前牌局其他人不可再杠牌。
        四风连打流局，在无人鸣牌的状况下四人第一巡打出同-张风牌 (东/南/西/北)        
        四家立直流局，四人全部宣告立直成功则流局        
        九种九牌流局，第一巡轮到自己之前目无人鸣牌的状况下拥有9种及以上不同的么九牌 (注意是不同种类的么九派，不是个数)，流局。`
        };
        HomeUiMain.ins.popUpWin.showCommPopup(mParamObj);
    }


    private _onAutoNoteTouch(): void {
        let mParamObj = {
            title: "自动开桌", cont: `    创建牌桌后，如果开启自动开桌功能后，牌桌坐满后，自动开启一张相同配置的新桌；
        如果存在配置不同的牌桌A和牌桌B，A和B都满人后，分别自动创建两张和A、B相同配置的新桌；
        每张牌桌只会重复创建一次，关闭空白牌桌后，不会自动创建，如牌桌A1满员后创建相同的空牌桌A2，手动解散A2后，A1不会再创建牌桌。`
        };
        HomeUiMain.ins.popUpWin.showCommPopup(mParamObj);
    }

    private _onLevelEditEnd(): void {
        console.log("level end:");
        let mLevelNum = parseFloat(this._levelEB.string);
        if (mLevelNum < 0 || mLevelNum !== parseInt(this._levelEB.string)) {
            this._levelEB.string = "";
            return;
        }
    }

    private _onBringEditEnd(): void {
        let mBringNum = parseFloat(this._bringEB.string);
        let mLevelNum = parseInt(this._levelEB.string);
        console.log("bringNum:", mBringNum)
        if (mBringNum < 20 || mBringNum != parseInt(this._bringEB.string)) {
            this._bringEB.string = "20";// (mLevelNum * 50) + "";
            return;
        }

        // console.log('mLevel:', mLevelNum)
        // if (mBringNum < mLevelNum * 50) {
        //     mBringNum = mLevelNum * 50;
        //     this._bringEB.string = mBringNum + "";
        // }
    }

    private _onFeeEditEnd(): void {
        let mFeeNum = parseFloat(this._feeEB.string);
        if (mFeeNum < 0 || mFeeNum != parseInt(this._feeEB.string)) {
            this._feeEB.string = "";
            return;
        }
        if (mFeeNum > 100) {
            this._feeEB.string = "100";
        }

    }

    private _onCreateTouch(evt: EventTouch) {
        // console.log("roundTG0:", this.roundTG.toggleItems[0].isChecked, "roundTG1:", this.roundTG.toggleItems[1].isChecked);
        // console.log("thinkTG0:", this.thinkTG.toggleItems[0].isChecked, "thinkTG1:", this.thinkTG.toggleItems[1].isChecked, "thinkTG2:", this.thinkTG.toggleItems[2].isChecked);
        // console.log("levelEB:", this.levelEB.string);

        // uint32  roundNo        = 4;//局数 0 东风 1 东南战
        // uint32  thinkTime      = 5;//0 3+5 1 15+15 2 60+0 3 300+0
        // uint32  level          = 6;// 金币每点
        // float   bringInAmount  = 7;//带入要求/起始点数
        // uint32  fee            = 8;//服务费
        // uint32  redCard        = 10;//赤宝牌 0 无赤 1 3赤
        // int32   exPoint1       = 11; //额外得点 
        // int32   exPoint2       = 12; //额外得点 
        // int32   exPoint3       = 13; //额外得点 
        // int32   exPoint4       = 14; //额外得点 
        // uint32  headJumpFlag   = 15;//头跳 0 否 1 是

        let mParams = {};
        mParams["clubId"] = ClubEntity.recentClubID;
        mParams["ownerId"] = LoginEnity.playerID;
        mParams["mode"] = 0;// 模式 0--四人
        if (this._roundTG.toggleItems[0].isChecked) {
            mParams["roundNo"] = 0;// 局数 0东风 1 东南战
        } else {
            mParams["roundNo"] = 1;// 局数 0东风 1 东南战
        }
        // 思考时间 0--3+5 1--5+15 2--60+0 3--300+0
        if (this._thinkTG.toggleItems[0].isChecked) {
            mParams["thinkTime"] = 0;
        } else if (this._thinkTG.toggleItems[1].isChecked) {
            mParams["thinkTime"] = 1;
        } else if (this._thinkTG.toggleItems[2].isChecked) {
            mParams["thinkTime"] = 2;
        } else if (this._thinkTG.toggleItems[3].isChecked) {
            mParams["thinkTime"] = 3;
        }

        // 游戏级别
        mParams["level"] = parseInt(this._levelEB.string);
        // 带入要求
        mParams["bringInAmount"] = parseFloat(this._bringEB.string);
        // 服务费
        mParams["fee"] = parseInt(this._feeEB.string);


        // 下面5个参数Martin要求加的，不是高级设置也要加
        // 起始点数 
        // console.log("this.startEB.str:", this.startEB.string)
        mParams["startPoint"] = 25000;
        // 额外得点
        // let mExp1: number = parseInt(this._exp1EB.string);
        // let mExp2: number = parseInt(this._exp2EB.string);
        // let mExp3: number = parseInt(this._exp3EB.string);
        // let mExp4: number = parseInt(this._exp4EB.string);
        // let mExpSum = mExp1 + mExp2 + mExp3 + mExp4;
        // console.log("sum:", mExpSum);
        // if (mExpSum > 0.0000001 || mExpSum < -0.0000001) {
        //     App.getInst(ToastUI).showTips("额外得点相加必须为0");
        //     return;
        // }

        // mParams["exPoint1"] = mExp1;
        // mParams["exPoint2"] = mExp2;
        // mParams["exPoint3"] = mExp3;
        // mParams["exPoint4"] = mExp4;

        let mExpNum1: number = 15;
        let mExpNum2: number = 5;
        if (this._expTG.toggleItems[0].isChecked) {
            mExpNum1 = 15;
            mExpNum2 = 5;
        } else if (this._expTG.toggleItems[1].isChecked) {
            mExpNum1 = 20;
            mExpNum2 = 10;
        } else if (this._expTG.toggleItems[2].isChecked) {
            mExpNum1 = 30;
            mExpNum2 = 10;
        }

        mParams["exPoint1"] = mExpNum1;
        mParams["exPoint2"] = mExpNum2;
        mParams["exPoint3"] = -mExpNum2;
        mParams["exPoint4"] = -mExpNum1;

        // 默认带赤 赤宝牌 0--无赤 3--3赤
        mParams["redCard"] = 3;

        if (this._moreFlag) {
            if (parseInt(this._startEB.string) < 1000) {
                App.getInst(ToastUI).showTips("起始点数最小1000");
                return;
            }

            mParams["startPoint"] = parseInt(this._startEB.string);
            // 赤宝牌 0--无赤 3--3赤
            if (this._redTG.toggleItems[0].isChecked) {
                mParams["redCard"] = 0;
            } else if (this._redTG.toggleItems[1].isChecked) {
                mParams["redCard"] = 3;
            }
            // // 额外得点
            // mParams["exPoint1"] = parseInt(this.exp1EB.string);
            // mParams["exPoint2"] = parseInt(this.exp2EB.string);
            // mParams["exPoint3"] = parseInt(this.exp3EB.string);
            // mParams["exPoint4"] = parseInt(this.exp4EB.string);

            // 头跳 0--否 1--是
            if (this._headTG.toggleItems[0].isChecked) {
                mParams["headJumpFlag"] = 0;
            } else if (this._headTG.toggleItems[1].isChecked) {
                mParams["headJumpFlag"] = 1;
            }

            // 双倍役满 0 否 1 是
            if (this._doubleTG.toggleItems[0].isChecked) {
                mParams["doubleFlag"] = 0;
            } else if (this._doubleTG.toggleItems[1].isChecked) {
                mParams["doubleFlag"] = 1;
            }

            // 摸切提示 0 否 1 是
            if (this._hintTG.toggleItems[0].isChecked) {
                mParams["hintFlag"] = 1;
            } else if (this._hintTG.toggleItems[1].isChecked) {
                mParams["hintFlag"] = 0;
            }

            // 便捷提示 0 否 1 是
            if (this._shortTG.toggleItems[0].isChecked) {
                mParams["convenientFlag"] = 1;
            } else if (this._shortTG.toggleItems[1].isChecked) {
                mParams["convenientFlag"] = 0;
            }

            // 途中流局 0 否 1 是
            if (this._noWinTG.toggleItems[0].isChecked) {
                mParams["noWinnerFlag"] = 1;
            } else if (this._noWinTG.toggleItems[1].isChecked) {
                mParams["noWinnerFlag"] = 0;
            }

            // 自动开桌 0 否 1 是
            // if(this.autoTG.toggleItems[0].isChecked){
            mParams["autoStartFlag"] = 0;
            // }
            // else if(this.autoTG.toggleItems[1].isChecked){
            //     mParams["autoStartFlag"] =1;
            // }
        }

        ProtocolHTTPManager.load(EProtocolID.CLUB_CREATE_TABLE_REQ, mParams, false);
    }

    private _onMoreToggle(evt) {
        console.log("====more evt:", evt);
        this._moreFlag = true;
        this._moreSetND.active = true;
        this._contND.getComponent(UITransform).height = this.CONT_H_L;
    }

    private _onNoMoreToggle(evt) {
        console.log("====no more evt:", evt);
        this._moreSetND.active = false;
        this._contND.getComponent(UITransform).height = this.CONT_H_S;
    }

    private _onTableCreateRespond(event): void {
        console.log("create table call:", event);
        if (event.success) {
            if (event.data?.res == "SUCCESS") {
                // console.log("SUCCESS");
                // 创建牌桌成功
                let mParams = {
                    "clubId": ClubEntity.recentClubID,
                    "status": 1
                };
                ProtocolHTTPManager.load(EProtocolID.CLUB_GET_TABLELIST_REQ, mParams, false);
                this.node.destroy();
            } else {
                App.getInst(ToastUI).showTips(event.data.msg);
            }

        }
    }

    private _onTableListRespond(event) {
        console.log("=clubTableList======evt:", event)
        if (event.success && event.data?.res == "SUCCESS") {
            // console.log("SUCCESS");
            ClubEntity.tableList = event.data.tableList;
            director.emit(EventConst.EVT_UPDATE_TABLE_LIST);
        }
    }

    // 更新数据用，必备
    public refresh(): void {
        // 俱乐部类型 0--铜 1--钻
        if (ClubEntity.clubInfor.clubType == 1) {
            this._levelND.active = true;
            this._bringND.active = true;
            this._feeND.active = true;
        } else {
            this._levelND.active = false;
            this._bringND.active = false;
            this._feeND.active = false;
        }
    }

    onDestroy(): void {
        ProtocolEventManager.off(EProtocolID.CLUB_CREATE_TABLE_REQ, this._onTableCreateRespond, this);
        ProtocolEventManager.off(EProtocolID.CLUB_GET_TABLELIST_REQ, this._onTableListRespond, this);
    }

}

