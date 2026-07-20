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

import {Game, game} from "cc";
import {ESceneVar, GlobalVar} from "../../GlobalVar";
import {LoginEnity} from "../../Home/Entity/Login";
import {HomeUiMain} from "../../Home/Ui/HomeUiMain";
import {CmdHandleSettleRound} from "../../Mahjong/Communication/CmdHandleSettleRound";
import {CommRecv} from "../../Mahjong/Communication/CommRecv";
import {CommSend} from "../../Mahjong/Communication/CommSend";
import {UiMain} from "../../Mahjong/Ui/Main/UiMain";
import {UiBtnCountDown} from "../../Mahjong/Ui/Popup/Settle/UiBtnCountDown";
import {FirstDrawHandcardLocal} from "../../Mahjong/World/Ctrl/FirstDrawHandcard";
import {App} from "../../Module/App";
import {ShopCtrl} from "../../Module/store/ShopCtrl";
import {UiPopupHelper} from "../utils/UiPopupHelper";
import {PrefabConst} from "../../const/PrefabConst";

enum WS_STATE {
    WS_STATE_NONE = 1,
    WS_STATE_CONNECTING = 2,    //连接中
    WS_STATE_CONNECTED = 3,     //连接完成
    WS_STATE_ERROR = 4,         //连接出错
    WS_STATE_CLOSE = 5,         //连接关闭
    WS_STATE_TIMEOUT = 6,       //连接超时
};

// var IS_LOCAL = true;        //是否使用本地定义的ip，port连接,否则使用服务器下发的
// window.IS_LOCAL = IS_LOCAL;
// var HTTP_IP = "120.79.178.127";
// var SERVER_IP = "120.76.217.110";
// var SERVER_PORT = "29901";  // 印度


// var HTTP_URL = "http://120.76.217.110:8080/kslotAccount/api/";
// websocket.js 导出的自己封装的websocket模块
export class WebSocketMgr {
    private static _instance: WebSocketMgr = null;

    public static get Inst(): WebSocketMgr {
        if (!this._instance) {
            this._instance = new WebSocketMgr();
        }
        return this._instance;
    }

    public constructor() {
        this.addGameEvent();
    }

    public addGameEvent() {
        game.on(Game.EVENT_HIDE, function () {
            console.log("EVENT_HIDE");
        }.bind(this));

        game.on(Game.EVENT_SHOW, function () {
            console.log("EVENT_SHOW");
            if (GlobalVar.currScene === ESceneVar.SCENE_GAME) {
                UiMain.ins.startGameAnim.stopAllAnim(true);
                FirstDrawHandcardLocal.stopTweenAnim();
                CmdHandleSettleRound.stopTweenAnim();
                UiPopupHelper.stopTweenAnim();
                UiBtnCountDown.stopTweenAnim();
                CommSend.reconectRoom();
            }

            // 更新weibao余额
            else if (GlobalVar.currScene === ESceneVar.SCENE_HOME) {
                //更新余额
                App.getInst(ShopCtrl).GetWBBindInfoReq(LoginEnity.playerID);
            }
        }.bind(this));
    }

    public webSock: WebSocket = null; // 连接的socket 对象 WebSocket, h5标准对象;
    public openCall: Function = null;//链接成功的回调函数
    // other_receiveCall: null,//没有监听回调的消息的回调
    public receiveCall: Object = {};//protoId->call
    public other_receiveCall: Object = {};//没有监听回调的消息的回调2 key->call
    public reconnetErrCall: Function = null;//重连失败回调
    public reconnetOkCall: Function = null;//重连成功回调
    public state: WS_STATE = WS_STATE.WS_STATE_NONE;//状态
    public url: string = "ws://127.0.0.1:6080";

    private _checkConnetHandle: number = -1;//检测连接的句柄
    private _timeoutConnetHandle: number = -1;//超时连接的句柄
    private _expireInterval: number = 0;//请求超时检查间隔时长（秒）
    private _expireTimer: number = -1;//请求超时句柄
    private _hbInterval: number = 0;//心跳包间隔时间
    private _hbTimer: number = -1;//心跳包句柄

    private _isHoldClose: boolean = false;//是否手动关闭
    private _reConnetCount: number = 0;

    private _requestId = 1;
    private _requests = [];


    private _latestResponseTime: number = 0;//最后接收到的消息的时间

    private _hbCount: number = 3;//心跳超时次数

    public adResendMessage = null; //广告发送失败后的重新发送

    private _detectingHeartbeat: boolean = false;
    private _heartbeatScheduleID: number | null = null;

    // 连接函数,
    public connect(url: string): boolean {

        console.log("connet url=", url)

        this.url = url;

        // 已连接或连接中
        if (this.state == WS_STATE.WS_STATE_CONNECTED || this.state == WS_STATE.WS_STATE_CONNECTING) {
            console.log("already connect to server. state = " + this.state);
            return false;
        }
        if (!(this.url && this.url.length > 0)) {
            console.log("dstIP is null.");
            return false;
        }

        if (this.webSock == null) {

            // let isWss = url.indexOf("wss");
            // if (isWss >= 0 && sys.Platform.ANDROID === sys.platform) {//wss
            //     let pemUrl = null;
            //     let file = "cacert.pem";
            //     var info = resources.getInfoWithPath(path.mainFileName(file));
            //     if (info) {
            //         // 根据uuid 返回资源路径
            //         pemUrl = assetManager.utils.getUrlWithUuid(info.uuid, { isNative: true, nativeExt: cc.path.extname(file) });
            //     }

            //     this.webSock = new WebSocket(url, null, pemUrl);
            // } else {
            //     this.webSock = new WebSocket(url); // h5标准的websocket对象
            // }
            this.webSock = new WebSocket(url); // h5标准的websocket对象

            this.webSock.binaryType = "arraybuffer"; // 配置接受二进制的数据类型,与服务器保持一次, "Blob"
            // 为这个websocket对象制定对应的回掉函数;
            this.webSock.onopen = this.onSocketOpen.bind(this);
            this.webSock.onmessage = this.onSocketMessage.bind(this);
            this.webSock.onclose = this.onSocketClose.bind(this);
            this.webSock.onerror = this.onSocketError.bind(this);

            this.state = WS_STATE.WS_STATE_CONNECTING;
            this._reConnetCount++;

            if (this._checkConnetHandle != -1) {
                clearTimeout(this._checkConnetHandle);
            }
            this._checkConnetHandle = setTimeout(() => {
                console.log("checkConnet_handle ", this._reConnetCount, (new Date()).valueOf());
                if (!this.isConnect()) {
                    this.webSock && this.closeNetWork(false);
                }
            }, 5000);//单位毫秒
        }
        return true;
    }

    // public resendAdMessage() {
    //     if (this.adResendMessage != null) {//如果有广告回来没发送的数据，重现发送
    //         if (this.adResendMessage.hasOwnProperty("key") &&
    //             this.adResendMessage.hasOwnProperty("step") &&
    //             this.adResendMessage.hasOwnProperty("adDouble")) {
    //             let key = this.adResendMessage.key;
    //             let step = this.adResendMessage.step;
    //             let adDouble = this.adResendMessage.adDouble;
    //             let adUnlockGameId = this.adResendMessage.adUnlockGameId || 0;
    //         }
    //     }
    // }

    // 网络连接成功了以后调用
    public onSocketOpen(event): void {
        console.log("websocket.on_open");
        this.state = WS_STATE.WS_STATE_CONNECTED;
        if (this._checkConnetHandle != -1) {
            clearTimeout(this._checkConnetHandle);
            this._checkConnetHandle = -1;
        }
        this._reConnetCount = 0;
        this._hbCount = 3;

        if (typeof this.openCall === "function") {
            this.openCall(event);
        }

        // console.log("websocket.on_open _expireInterval=", this._expireInterval);
        // if (this._expireInterval > 0) {
        //     if (this._expireTimer != -1) {
        //         clearTimeout(this._expireTimer);
        //         this._expireTimer = -1;
        //     }
        //     this._expireTimer = setTimeout(this._onExpireTimeout.bind(this), this._expireInterval * 1000);
        // }

        console.log("websocket 连接成功 new");
        CommSend.ws = this.webSock;
        CommSend.login(LoginEnity.account, LoginEnity.token, LoginEnity.accountID);

    }

    // 客户端收到数据的时候
    public onSocketMessage(event: MessageEvent): void {
        // console.log("收到：", event)
        CommRecv.exe(event.data);

        // console.log("#####", event.data);

        // let now = new Date().getTime();
        // this._latestResponseTime = now;

        // let mb = new MsgBuf();
        // let array = Array.prototype.slice.call(new Uint8Array(event.data));
        // let ret = mb.decode(array);

        // let proto = pbMgr.getProtoById(mb.protobuf_id);
        // let result = { errorCode: ret, proto: proto, data: mb.buf };
        // if (typeof proto == "undefined") {
        //     console.log("proto undefined");
        //     return;
        // }

        // let request = this._popRequest(mb.request_id);
        // if (request && request.callback) {
        //     if (typeof request.callback === "function") {
        //         // let proto = pbMgr.getProtoById(mb.protobuf_id);
        //         // let result = {errorCode : ret, proto : proto, data : mb.buf};

        //         // console.log("###### result=", JSON.stringify(result));
        //         request.callback(result);
        //     }
        // } else {
        //     // let proto = pbMgr.getProtoById(mb.protobuf_id);
        //     // let result = {errorCode : ret, proto : proto, data : mb.buf};
        //     // if(typeof proto == "undefined"){
        //     //     cc.log("proto undefined");
        //     //     return;
        //     // }

        //     // console.log("###### result=", JSON.stringify(result));

        //     for (var name in this.other_receiveCall) {
        //         let call = this.other_receiveCall[name];
        //         if (typeof call === "function") {
        //             call(result);
        //         }
        //     }
        // }

        // for (let key in this.receiveCall) {
        //     let calls = this.receiveCall[key];
        //     let call = calls[proto.id];
        //     if (typeof call === "function") {
        //         call(result);
        //     }
        // }
    }

    // 客户端收到socket 关闭的时间的时候调用;
    public onSocketClose(event): void {
        console.log("on_websocket_close");
        this.close();
        this.state = WS_STATE.WS_STATE_CLOSE;

        this.timeOutConnect();
    }

    public onSocketError(event): void {
        console.log("on_websocket_error");
        this.close();
        this.state = WS_STATE.WS_STATE_ERROR;
    }

    public close(): void {
        if (this.webSock != null) {
            if (this.isConnect()) {
                this.webSock.close(); // 关闭socket
            }
            this.webSock = null;
        }

        if (this._checkConnetHandle != -1) {
            clearTimeout(this._checkConnetHandle);
            this._checkConnetHandle = -1;
        }

        // Singleton.getInstance().isLogin = false;

    }

    public reset(): void {
        console.log("websocket.reset");

        this._requestId = 1;
        this._requests = [];
        this._reConnetCount = 0;
        this._isHoldClose = false;
        this._expireInterval = 0;

        if (this._expireTimer != -1) {
            clearTimeout(this._expireTimer);
            this._expireTimer = -1;
        }

        if (this._hbTimer != -1) {
            clearTimeout(this._hbTimer);
            this._hbTimer = -1;
        }
        this._hbCount = 3;
    }

    /**
     * 手动关闭连接
     */
    public closeNetWork(isHoldClose): void {
        console.log("closeNetWork");

        this._stopMonitoringHeart();

        // this.url = "";
        // console.log("手动关闭 state : " , this.state);
        this._isHoldClose = isHoldClose;
        if (this.webSock) {
            this.webSock.onopen = () => {
            };
            this.webSock.onclose = () => {
            };
            this.webSock.onerror = () => {
            };
            this.webSock.onmessage = () => {
            };
            this.webSock.close();
        }
        this.onSocketClose(null);
    }

    // public newConnect(ip, port):boolean {
    //     let url = "ws://" + ip + ":" + port;

    //     return this.connect(url);
    // }
    public newConnect(url: string): boolean {
        return this.connect(url);
    }

    public isConnect() {
        return this.state == WS_STATE.WS_STATE_CONNECTED;
    }

    /**
     * 延时重新连接
     */
    public timeOutConnect() {
        this.webSock && this.closeNetWork(false);
        if (!this._isHoldClose) {

            console.log("timeOutConnect ", this._reConnetCount, (new Date()).valueOf());

            if (this._timeoutConnetHandle != -1) {
                clearTimeout(this._timeoutConnetHandle);
                this._timeoutConnetHandle = -1;
            }
            if (this._reConnetCount >= 3) {
                this.closeNetWork(true);
                console.log("3次没连上不连了");
                if (GlobalVar.currScene == ESceneVar.SCENE_HOME) {
                    HomeUiMain.ins.popUpWin.showPopup(PrefabConst.NET_ERROR_UI);
                } else if (GlobalVar.currScene == ESceneVar.SCENE_GAME) {
                    UiMain.ins.popUpWin.showPopup(PrefabConst.NET_ERROR_UI);
                }
                if (typeof this.reconnetErrCall === "function") {
                    this.reconnetErrCall();
                }
            } else {
                this._timeoutConnetHandle = setTimeout(() => {
                    if (!this.connect(this.url)) {
                        // console.log("cancel doConnect.");
                    }
                }, 5000);
            }
        }
    }

    // 发送数据, sock.send;
    public sendSocketData(proto, data, callback) {
        // if (this.webSock && this.isConnect()) {

        //     let request = this._pushRequest(proto.id, callback);

        //     let mb = new MsgBuf();
        //     let arrayBuf = mb.encode(proto, data, this._requestId);

        //     this.webSock.send(arrayBuf);
        // } else {
        //     if (typeof callback == "function") {
        //         // callback({ errorCode: SystemError.timeout });
        //     }
        // }
    }

    public setOpenCall(call) {
        this.openCall = call;
    }

    public setReconnetErrCall(call) {
        this.reconnetErrCall = call;
    }

    public setReconnectOkCall(call) {
        this.reconnetOkCall = call;
    }

    public addReceiveCall(protoId, key, call) {
        if (!this.receiveCall[key]) {
            this.receiveCall[key] = {};
        }
        this.receiveCall[key][protoId] = call;
    }

    public delReceiveCall(protoId, key) {
        if (this.receiveCall[key]) {
            delete this.receiveCall[key][protoId];
        }
    }

    public addOtherReceiveCall(name, call) {
        this.other_receiveCall[name] = call;
    }

    public delOtherReceiveCall(name) {
        delete this.other_receiveCall[name];
    }

    //设置请求超时检查间隔时长（秒）
    public setExpireInterval(value) {
        this._expireInterval = value;
    }

    _onExpireTimeout() {
        let now = new Date().getTime();
        let count = 0;
        for (var i = 0; i < this._requests.length; i++) {
            let request = this._requests[i];
            if (now - request.time > this._expireInterval * 1000) {
                // request.callback({ errorCode: SystemError.timeout });
                count++;
            } else {
                break;
            }
        }

        this._requests.splice(0, count);

        this._expireTimer = setTimeout(this._onExpireTimeout.bind(this), this._expireInterval * 1000);
    }

    public onHeartbeatRespond(): void {
        this._detectingHeartbeat = false;
    }

    /**
     * 开始检测心跳包
     * @param timeoutInMillisecond 超时时长（毫秒）
     */
    public startMonitoringHeart(timeoutInMillisecond: number = 10000): void {
        if (this.state !== WS_STATE.WS_STATE_CONNECTED || this._detectingHeartbeat) {
            return;
        }

        this._detectingHeartbeat = true;
        CommSend.requestHeartbeat();

        if (this._heartbeatScheduleID === null || this._heartbeatScheduleID === undefined) {
            this._heartbeatScheduleID = Number(setTimeout(() => {
                this._heartbeatScheduleID = null;

                if (this._detectingHeartbeat) {
                    this.timeOutConnect();
                } else {
                    this.startMonitoringHeart();
                }
            }, timeoutInMillisecond));
        }
    }

    /**
     * 停止心跳包检测
     */
    private _stopMonitoringHeart(): void {
        this._detectingHeartbeat = false;

        if (this._heartbeatScheduleID !== null && this._heartbeatScheduleID !== undefined) {
            clearTimeout(this._heartbeatScheduleID);
            this._heartbeatScheduleID = null;
        }
    }

    // //开启心跳包发送定时器，开启后，当Session在指定时间内没有请求活动时，则会发送一个心跳包
    // public heartbeat (interval) {
    //     if (!this.isConnect() || this._hbTimer != -1) {
    //         return;
    //     };
    //     this._hbInterval = interval;
    //     if (this._hbInterval > 0) {
    //         this._hbTimer = setTimeout(this._onHBTimeout.bind(this), 1000);
    //     }
    // }

    // private _onHBTimeout (dt) {
    //     // cc.log("设置心跳 发送心跳 1111");
    //     if (!this.isConnect()) {

    //         if (this._hbTimer != -1) {
    //             clearTimeout(this._hbTimer);
    //             this._hbTimer = -1;
    //         }
    //         return;
    //     }
    //     let now = new Date().getTime();
    //     // cc.log("设置心跳 发送心跳 2222", now, this._latestResponseTime, this._hbInterval, now - this._latestResponseTime);
    //     if (now - this._latestResponseTime > this._hbInterval * 1000) {
    //         // cc.log(" 发送心跳 333333");
    //         let proto = pbMgr.getProtoByModeName("Auth", "heartbeat");
    //         this.sendSocketData(proto, null, function (result) {

    //             if (result.errorCode == SystemError.timeout) {
    //                 this._hbCount--;
    //                 if (this._hbCount <= 0) {
    //                     this._hbCount = 0;
    //                     this.reConnetCount = 4;
    //                     this.closeNetWork(false);
    //                 }
    //             }
    //         }.bind(this));
    //         this._latestResponseTime = now;
    //     }

    //     this._hbTimer = setTimeout(this._onHBTimeout.bind(this), 1000);

    // }


    _pushRequest(protoId, callback) {
        if (this._requestId >= 32767) {
            this._requestId = 1;
        } else {
            this._requestId = this._requestId + 1;
        }

        if (callback == null) {
            return;
        }
        let request = {id: protoId, requestId: this._requestId, callback: callback, time: new Date().getTime()};
        this._requests.push(request);

        return request;
    }

    _popRequest(requestId) {
        for (var i = 0; i < this._requests.length; i++) {
            let request = this._requests[i];
            if (request.requestId == requestId) {
                this._requests.splice(i, 1);
                return request;
            }
        }
    }
}

// // --系統錯誤碼 (kesalahan sistem)
// var SystemError = {
//     success                 : add({code : 0x0000, message : "成功"}),
//     forward                 : add({code : 0x0001, message : "重定向"}),
//     unknown                 : add({code : 0x0002, message : "未知错误"}),
//     timeout                 : add({code : 0x0003, message : "请求超时"}),
//     serialize                 : add({code : 0x0004, message : "序列化错误"}),
//     argument                : add({code : 0x0005, message : "参数错误"}),
//     notImplement               : add({code : 0x0006, message : "协议未实现"}),
//     illegalOperation        : add({code : 0x0007, message : "非法操作"}),
//     db                        : add({code : 0x0008, message : "数据库操作失败"}),
//     messageTooLong            : add({code : 0x0009, message : "消息包太长"}),
//     protoNotExisits            : add({code : 0x000a, message : "不存在此协议"}),
//     notLogin                : add({code : 0x000b, message : "未登录"}),
//     serviceIsStoped            : add({code : 0x000c, message : "服务故障"}),
//     busy                    : add({code : 0x000d, message : "服务忙"}),
//     logined                    : add({code : 0x000e, message : "已登录"}),
//     network                    : add({code : 0x000f, message : "网络异常"}),
//     ServerMaintenance        : add({code : 0x0010, message : "服务器维护"}),
//     config                    : add({code : 0x0011, message : "配置错误"}),
//     roleIsSeal                : add({code : 0x0012, message : "您的账号已被封,请与客服联系"}),
//     loginExpetion            : add({code : 0x0013, message : "账号登录受限"}),
//     targetOffline            : add({code : 0x0014, message : "用户不在线"}),
//     targetOnline            : add({code : 0x0015, message : "用户已在线"}),
// };
// var errors = window.errors || {};
// var add = function(error){
//     if(errors[error.code] != null){
//         // console.log("had the same error code[0x"+("0000"+error.code.toString(16)).substr(-4)+"], msg["+error.message+"]");
//     }

//     errors[error.code] = error.message;

//     return error.code;
// };