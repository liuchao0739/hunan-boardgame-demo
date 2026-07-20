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

import {director} from "cc";
import {LoginEnity} from "../../Home/Entity/Login";
import {SocketCtrl} from "../../framework/ctrl/SocketCtrl";
import {Singleton} from "../../framework/mgr/Singleton";
import {EProtocolID, protocol} from "../../framework/network/protocol-configs";
import {CallBack} from "../../framework/utils/CallBack";
import {HttpCtrl} from "../../framework/ctrl/HttpCtrl";
import {ToastUI} from "../../Home/Ui/ToastUI";
import {ICtrl} from "../../framework/mgr/CtrlMgr";
import {PlayerMgr} from "../../Mahjong/World/Entity/Player/Player";
import {App} from "../App";
import {eSettingKey, SettingCtrl} from "../Setting/SettingCtrl";

export class RoleCtrl extends Singleton implements ICtrl {
    /**角色基础信息变更 */
    static ROLE_INFO_UPDATE: string = `ROLE_INFO_UPDATE`;
    /**头像变更 */
    static ROLE_ICON_UPDATE: string = `ROLE_ICON_UPDATE`;
    /**角色名变更 */
    static ROLE_NAME_UPDATE: string = `ROLE_NAME_UPDATE`;
    /**绑定账号(手机号)变更 */
    static BIND_ACCOUNT_CHANGE: string = `BIND_ACCOUNT_CHANGE`;
    /**修改账号密码 */
    static PWD_CHANGE: string = `PWD_CHANGE`;
    ////////////////// MODULE ROLE //////////////////
    /* 玩家简单信息请求
    * c >> s: RoleSimpleInfoReq
    * s >> c: RoleSimpleInfoResp
    */
    //     GET_SIMPLE_INFO = 11000;
    // 玩家简单信息请求
    public RoleSimpleInfoReq(userID: number, cb?: CallBack, failCB?: CallBack) {
        App.getInst(HttpCtrl).requestServer(EProtocolID.ROLE_USER_INFO, {userID}, new CallBack((params) => {
            cb?.exe();
            this.RoleSimpleInfoResp(params);
        }, this), failCB);
    }

    public RoleSimpleInfoResp(params: protocol.roleInfo.IRoleSimpleInfoResp): void {
        if (Number(LoginEnity.accountID) == params.userID) {
            LoginEnity.avatarTID = params.avatarTID;
            App.getInst(SettingCtrl).set(eSettingKey.bSettingPWd, params.password > 0);
            director.emit(RoleCtrl.ROLE_INFO_UPDATE);
        }
    }

    /*
    * 设置头像
    * c >> s: SetAvatarReq
    * s >> c: SetAvatarResp
    */

    // SET_AVATAR_INFO = 11003;
    public setAvatarInfo(userID: number, ano: number) {
        App.getInst(HttpCtrl).requestServer(EProtocolID.ROLE_SET_AVATAR_INFO, {
            userID,
            ano
        }, new CallBack(this.setAvatarInfoCB, this));
    }

    public setAvatarInfoCB(params: protocol.roleInfo.ISetAvatarReq) {
        App.getInst(ToastUI).showTips("头像设置成功");
        LoginEnity.avatarTID = params.ano;
        PlayerMgr.ins.local.info.iconId = params.ano;
        director.emit(RoleCtrl.ROLE_ICON_UPDATE);
    }


    /*
    * 玩家修改名称
    * c >> s: SetNameReq
    * s >> c: SetNameResp
    */

    // SET_NAME_INFO = 11004; protocol.roleInfo.RoleInfoCode.SET_NAME_INFO //
    public setNameInfo(userID: number, name: string) {
        App.getInst(HttpCtrl).requestServer(EProtocolID.ROLE_SET_NAME_INFO, {
            userID,
            name
        }, new CallBack(this.SetNameResp, this));
    }

    public SetNameResp(params: protocol.roleInfo.ISetNameResp): void {
        if (params.status != 0) {
            if (params.status == 1) {
                App.getInst(ToastUI).showTips("昵称已存在");
                console.log("昵称已存在");
            } else if (params.status == 2) {
                App.getInst(ToastUI).showTips("修改次数已用完");
                console.log("修改次数已用完");
            }
            return;
        }
        LoginEnity.nickName = params.name;
        LoginEnity.isNewAccount = false;
        PlayerMgr.ins.local.info.nickname = params.name;
        director.emit(RoleCtrl.ROLE_NAME_UPDATE);
    }


    /**
     * 请求验证码
     * @param phoneNo
     * @param cb
     */
    public PhoneAccountReq(phoneNo: string, cb?: CallBack): void {
        App.getInst(HttpCtrl).requestServer(EProtocolID.PHONE_CODE_REQ, {phoneNo}, new CallBack((params) => {
            this.PhoneAccountResp(params);
            cb?.exe(params);
        }, this));
    }

    public PhoneAccountResp(params: protocol.account.IPhoneAccountResp): void {

    }

    /**
     * 修改绑定的手机
     * @param account
     * @param code
     * @param password
     * @param cb
     */
    public ProfileModifyReq(account: string, code: string, accountId?: string, password?: string, cb?: CallBack): void {
        App.getInst(HttpCtrl).requestServer(EProtocolID.PROFILE_MODIFY, {
            account,
            code,
            accountId,
            password
        }, new CallBack((params) => {
            if (password) {
                //修改密码
                App.getInst(SettingCtrl).set(eSettingKey.bSettingPWd, 1, true);
            } else {
                //修改绑定电话
                LoginEnity.account = account;
                director.emit(RoleCtrl.BIND_ACCOUNT_CHANGE);
            }
            this.ProfileModifyResp(params);
            cb?.exe(params);
        }, this));
    }

    public ProfileModifyResp(params): void {

    }

    /**
     * 账号登出
     */
    public logout(): void {
        App.getInst(SocketCtrl).send(EProtocolID.ACCOUNT_LOGOUT, {});
    }

    public clearCache(): void {

    }
}