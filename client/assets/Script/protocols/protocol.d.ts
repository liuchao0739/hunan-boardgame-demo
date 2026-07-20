export namespace protocol {
    // DO NOT EDIT! This is a generated file. Edit the JSDoc in src/*.js instead and run 'npm run build:types'.
    
    export namespace mahjongresult {
    
        interface IFuLuInfo {
            fuluType?: (number|null);
            cards?: (number[]|null);
            pos?: (number|null);
        }
    
        class FuLuInfo implements IFuLuInfo {
            constructor(p?: mahjongresult.IFuLuInfo);
            public fuluType: number;
            public cards: number[];
            public pos: number;
            public static encode(m: mahjongresult.IFuLuInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjongresult.FuLuInfo;
        }
    
        interface IFanInfo {
            type?: (number|null);
            name?: (string|null);
            score?: (number|null);
        }
    
        class FanInfo implements IFanInfo {
            constructor(p?: mahjongresult.IFanInfo);
            public type: number;
            public name: string;
            public score: number;
            public static encode(m: mahjongresult.IFanInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjongresult.FanInfo;
        }
    
        interface IResPlayerInfo {
            userId?: (number|Long|null);
            status?: (number|null);
            moneyPlat?: (number|null);
            turnMoney?: (number|null);
            roundResult?: (number|null);
            remCards?: (number[]|null);
            allFan?: (number|null);
            fu?: (number|null);
            fans?: (mahjongresult.IFanInfo[]|null);
            rank?: (number|null);
            winCard?: (number|null);
            fulus?: (mahjongresult.IFuLuInfo[]|null);
            dora?: (number[]|null);
            lidora?: (number[]|null);
        }
    
        class ResPlayerInfo implements IResPlayerInfo {
            constructor(p?: mahjongresult.IResPlayerInfo);
            public userId: (number|Long);
            public status: number;
            public moneyPlat: number;
            public turnMoney: number;
            public roundResult: number;
            public remCards: number[];
            public allFan: number;
            public fu: number;
            public fans: mahjongresult.IFanInfo[];
            public rank: number;
            public winCard: number;
            public fulus: mahjongresult.IFuLuInfo[];
            public dora: number[];
            public lidora: number[];
            public static encode(m: mahjongresult.IResPlayerInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjongresult.ResPlayerInfo;
        }
    
        interface IMahjongGameUser {
            userId?: (number|Long|null);
            userYuanbao?: (number|null);
            relativeMoney?: (number|null);
            moneyPlat?: (number|null);
            allResult?: (number|null);
            onlineStatus?: (number|null);
            rank?: (number|null);
            dedian?: (number|null);
        }
    
        class MahjongGameUser implements IMahjongGameUser {
            constructor(p?: mahjongresult.IMahjongGameUser);
            public userId: (number|Long);
            public userYuanbao: number;
            public relativeMoney: number;
            public moneyPlat: number;
            public allResult: number;
            public onlineStatus: number;
            public rank: number;
            public dedian: number;
            public static encode(m: mahjongresult.IMahjongGameUser, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjongresult.MahjongGameUser;
        }
    
        interface IMahjongResultReq {
            type?: (number|null);
            tableId?: (string|null);
            nRoundResult?: (number|null);
            timeRound?: (number|Long|null);
            huOrPaoUid?: (number|Long|null);
            huCard?: (number|null);
            stopGame?: (boolean|null);
            nLiuJuType?: (number|null);
            playerInfo?: (mahjongresult.IResPlayerInfo[]|null);
            users?: (mahjongresult.IMahjongGameUser[]|null);
        }
    
        class MahjongResultReq implements IMahjongResultReq {
            constructor(p?: mahjongresult.IMahjongResultReq);
            public type: number;
            public tableId: string;
            public nRoundResult: number;
            public timeRound: (number|Long);
            public huOrPaoUid: (number|Long);
            public huCard: number;
            public stopGame: boolean;
            public nLiuJuType: number;
            public playerInfo: mahjongresult.IResPlayerInfo[];
            public users: mahjongresult.IMahjongGameUser[];
            public static encode(m: mahjongresult.IMahjongResultReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjongresult.MahjongResultReq;
        }
    
        interface IMahjongResultResp {
            status?: (number|null);
        }
    
        class MahjongResultResp implements IMahjongResultResp {
            constructor(p?: mahjongresult.IMahjongResultResp);
            public status: number;
            public static encode(m: mahjongresult.IMahjongResultResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjongresult.MahjongResultResp;
        }
    }
    
    export namespace account {
    
        enum AccountType {
            GUEST = 0,
            FACEBOOK = 1,
            GOOGLE = 2,
            APPLE = 3,
            PHONE = 4,
            REGISTER = 5
        }
    
        interface ITokenReq {
            type?: (account.AccountType|null);
            id?: (string|null);
            token?: (string|null);
            password?: (string|null);
            deviceInfo?: (string|null);
            recommendCode?: (string|null);
        }
    
        class TokenReq implements ITokenReq {
            constructor(p?: account.ITokenReq);
            public type: account.AccountType;
            public id: string;
            public token: string;
            public password: string;
            public deviceInfo: string;
            public recommendCode: string;
            public static encode(m: account.ITokenReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.TokenReq;
        }
    
        interface ITokenResp {
            res?: (string|null);
            msg?: (string|null);
            account?: (string|null);
            token?: (string|null);
            timestamp?: (number|Long|null);
            accountId?: (number|null);
            isNewAccount?: (boolean|null);
        }
    
        class TokenResp implements ITokenResp {
            constructor(p?: account.ITokenResp);
            public res: string;
            public msg: string;
            public account: string;
            public token: string;
            public timestamp: (number|Long);
            public accountId: number;
            public isNewAccount: boolean;
            public static encode(m: account.ITokenResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.TokenResp;
        }
    
        interface ILoginReq {
            account?: (string|null);
            token?: (string|null);
            deviceID?: (string|null);
            userID?: (number|Long|null);
        }
    
        class LoginReq implements ILoginReq {
            constructor(p?: account.ILoginReq);
            public account: string;
            public token: string;
            public deviceID: string;
            public userID: (number|Long);
            public static encode(m: account.ILoginReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.LoginReq;
        }
    
        interface ILoginResp {
            userID?: (number|Long|null);
            timestamp?: (number|Long|null);
        }
    
        class LoginResp implements ILoginResp {
            constructor(p?: account.ILoginResp);
            public userID: (number|Long);
            public timestamp: (number|Long);
            public static encode(m: account.ILoginResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.LoginResp;
        }
    
        interface IHeartbeat {
            timestamp?: (number|Long|null);
        }
    
        class Heartbeat implements IHeartbeat {
            constructor(p?: account.IHeartbeat);
            public timestamp: (number|Long);
            public static encode(m: account.IHeartbeat, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.Heartbeat;
        }
    
        interface ICloseAccountReq {
            account?: (string|null);
            token?: (string|null);
        }
    
        class CloseAccountReq implements ICloseAccountReq {
            constructor(p?: account.ICloseAccountReq);
            public account: string;
            public token: string;
            public static encode(m: account.ICloseAccountReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.CloseAccountReq;
        }
    
        interface ICloseAccountResp {
            status?: (boolean|null);
        }
    
        class CloseAccountResp implements ICloseAccountResp {
            constructor(p?: account.ICloseAccountResp);
            public status: boolean;
            public static encode(m: account.ICloseAccountResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.CloseAccountResp;
        }
    
        interface IServerURLReq {
            account?: (string|null);
        }
    
        class ServerURLReq implements IServerURLReq {
            constructor(p?: account.IServerURLReq);
            public account: string;
            public static encode(m: account.IServerURLReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.ServerURLReq;
        }
    
        interface IServerURLResp {
            serverURL?: (string|null);
        }
    
        class ServerURLResp implements IServerURLResp {
            constructor(p?: account.IServerURLResp);
            public serverURL: string;
            public static encode(m: account.IServerURLResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.ServerURLResp;
        }
    
        interface IIsDeletionAccountReq {
            account?: (string|null);
            token?: (string|null);
            userID?: (number|Long|null);
        }
    
        class IsDeletionAccountReq implements IIsDeletionAccountReq {
            constructor(p?: account.IIsDeletionAccountReq);
            public account: string;
            public token: string;
            public userID: (number|Long);
            public static encode(m: account.IIsDeletionAccountReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.IsDeletionAccountReq;
        }
    
        interface IIsDeletionAccountResp {
            userID?: (number|Long|null);
            isClose?: (boolean|null);
        }
    
        class IsDeletionAccountResp implements IIsDeletionAccountResp {
            constructor(p?: account.IIsDeletionAccountResp);
            public userID: (number|Long);
            public isClose: boolean;
            public static encode(m: account.IIsDeletionAccountResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.IsDeletionAccountResp;
        }
    
        interface IDeletionAccountReq {
            account?: (string|null);
            token?: (string|null);
            userID?: (number|Long|null);
        }
    
        class DeletionAccountReq implements IDeletionAccountReq {
            constructor(p?: account.IDeletionAccountReq);
            public account: string;
            public token: string;
            public userID: (number|Long);
            public static encode(m: account.IDeletionAccountReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.DeletionAccountReq;
        }
    
        interface IDeletionAccountResp {
            userID?: (number|Long|null);
            time?: (number|Long|null);
            isDeletion?: (boolean|null);
        }
    
        class DeletionAccountResp implements IDeletionAccountResp {
            constructor(p?: account.IDeletionAccountResp);
            public userID: (number|Long);
            public time: (number|Long);
            public isDeletion: boolean;
            public static encode(m: account.IDeletionAccountResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.DeletionAccountResp;
        }
    
        interface IAccountBindReq {
            type?: (account.AccountType|null);
            id?: (string|null);
            token?: (string|null);
            bindToken?: (string|null);
            bindAccount?: (string|null);
        }
    
        class AccountBindReq implements IAccountBindReq {
            constructor(p?: account.IAccountBindReq);
            public type: account.AccountType;
            public id: string;
            public token: string;
            public bindToken: string;
            public bindAccount: string;
            public static encode(m: account.IAccountBindReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.AccountBindReq;
        }
    
        interface IAccountBindResp {
            account?: (string|null);
            token?: (string|null);
            timestamp?: (number|Long|null);
            another?: (boolean|null);
        }
    
        class AccountBindResp implements IAccountBindResp {
            constructor(p?: account.IAccountBindResp);
            public account: string;
            public token: string;
            public timestamp: (number|Long);
            public another: boolean;
            public static encode(m: account.IAccountBindResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.AccountBindResp;
        }
    
        interface IDeleteReq {
            userID?: (number|Long|null);
        }
    
        class DeleteReq implements IDeleteReq {
            constructor(p?: account.IDeleteReq);
            public userID: (number|Long);
            public static encode(m: account.IDeleteReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.DeleteReq;
        }
    
        interface IDeleteResp {
            status?: (boolean|null);
        }
    
        class DeleteResp implements IDeleteResp {
            constructor(p?: account.IDeleteResp);
            public status: boolean;
            public static encode(m: account.IDeleteResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.DeleteResp;
        }
    
        interface INoticeLogin {
            userID?: (number|Long|null);
        }
    
        class NoticeLogin implements INoticeLogin {
            constructor(p?: account.INoticeLogin);
            public userID: (number|Long);
            public static encode(m: account.INoticeLogin, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.NoticeLogin;
        }
    
        interface INoticeResp {
            status?: (boolean|null);
        }
    
        class NoticeResp implements INoticeResp {
            constructor(p?: account.INoticeResp);
            public status: boolean;
            public static encode(m: account.INoticeResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.NoticeResp;
        }
    
        interface IPhoneAccountReq {
            phoneNo?: (string|null);
            code?: (string|null);
            password?: (string|null);
            countryCode?: (string|null);
        }
    
        class PhoneAccountReq implements IPhoneAccountReq {
            constructor(p?: account.IPhoneAccountReq);
            public phoneNo: string;
            public code: string;
            public password: string;
            public countryCode: string;
            public static encode(m: account.IPhoneAccountReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.PhoneAccountReq;
        }
    
        interface IPhoneAccountResp {
            res?: (string|null);
            msg?: (string|null);
            account?: (string|null);
            token?: (string|null);
            deviceID?: (string|null);
            code?: (string|null);
            accountId?: (number|Long|null);
        }
    
        class PhoneAccountResp implements IPhoneAccountResp {
            constructor(p?: account.IPhoneAccountResp);
            public res: string;
            public msg: string;
            public account: string;
            public token: string;
            public deviceID: string;
            public code: string;
            public accountId: (number|Long);
            public static encode(m: account.IPhoneAccountResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.PhoneAccountResp;
        }
    
        interface IProfileReq {
            accountId?: (number|Long|null);
            name?: (string|null);
            avatarId?: (string|null);
            avatarUrl?: (string|null);
            account?: (string|null);
            password?: (string|null);
            code?: (string|null);
        }
    
        class ProfileReq implements IProfileReq {
            constructor(p?: account.IProfileReq);
            public accountId: (number|Long);
            public name: string;
            public avatarId: string;
            public avatarUrl: string;
            public account: string;
            public password: string;
            public code: string;
            public static encode(m: account.IProfileReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.ProfileReq;
        }
    
        interface IProfileResp {
            res?: (string|null);
            msg?: (string|null);
            accountId?: (number|Long|null);
            account?: (string|null);
            name?: (string|null);
            avatarId?: (string|null);
            avatarUrl?: (string|null);
        }
    
        class ProfileResp implements IProfileResp {
            constructor(p?: account.IProfileResp);
            public res: string;
            public msg: string;
            public accountId: (number|Long);
            public account: string;
            public name: string;
            public avatarId: string;
            public avatarUrl: string;
            public static encode(m: account.IProfileResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): account.ProfileResp;
        }
    
        enum AccountCode {
            UNSPECIFIED = 0,
            TOKEN = 10000,
            LOGIN = 10001,
            LOGGED_IN_ELSEWHERE = 10002,
            HEARTBEAT = 10003,
            LOGOUT = 10004,
            PRE_CLOSE_ACCOUNT = 10005,
            CLOSE_ACCOUNT = 10006,
            SERVER_URL = 10007,
            ACCOUNT_BIND = 10008,
            PHONE_CODE_REQ = 10009,
            PHONE_PW_CHANGE = 10012,
            PROFILE_REQ = 10020,
            PROFILE_MODIFY = 10021
        }
    }
    
    export namespace roleInfo {
    
        interface IRoleSimpleInfoReq {
            userID?: (number|Long|null);
        }
    
        class RoleSimpleInfoReq implements IRoleSimpleInfoReq {
            constructor(p?: roleInfo.IRoleSimpleInfoReq);
            public userID: (number|Long);
            public static encode(m: roleInfo.IRoleSimpleInfoReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.RoleSimpleInfoReq;
        }
    
        interface IRoleSimpleInfoResp {
            userID?: (number|Long|null);
            name?: (string|null);
            avatarTID?: (number|null);
            avatarUrl?: (string|null);
            borderTID?: (number|null);
            password?: (number|null);
        }
    
        class RoleSimpleInfoResp implements IRoleSimpleInfoResp {
            constructor(p?: roleInfo.IRoleSimpleInfoResp);
            public userID: (number|Long);
            public name: string;
            public avatarTID: number;
            public avatarUrl: string;
            public borderTID: number;
            public password: number;
            public static encode(m: roleInfo.IRoleSimpleInfoResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.RoleSimpleInfoResp;
        }
    
        interface IRoleInfoReq {
            userID?: (number|Long|null);
            infoID?: (number|Long|null);
        }
    
        class RoleInfoReq implements IRoleInfoReq {
            constructor(p?: roleInfo.IRoleInfoReq);
            public userID: (number|Long);
            public infoID: (number|Long);
            public static encode(m: roleInfo.IRoleInfoReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.RoleInfoReq;
        }
    
        interface IRoleStaticsInfo {
            infoID?: (number|Long|null);
            name?: (string|null);
            avatarTID?: (number|null);
            avatarUrl?: (string|null);
            borderTID?: (number|null);
            vip?: (number|null);
            level?: (number|null);
            money?: (number|null);
            totalTimes?: (number|null);
            winTimes?: (number|null);
            inPotNum?: (number|null);
            maxPot?: (number|Long|null);
            tanPaiNum?: (number|null);
            tanPaiWinNum?: (number|null);
            allInNum?: (number|null);
            allInWinNum?: (number|null);
            bestPokerList?: (number[]|null);
        }
    
        class RoleStaticsInfo implements IRoleStaticsInfo {
            constructor(p?: roleInfo.IRoleStaticsInfo);
            public infoID: (number|Long);
            public name: string;
            public avatarTID: number;
            public avatarUrl: string;
            public borderTID: number;
            public vip: number;
            public level: number;
            public money: number;
            public totalTimes: number;
            public winTimes: number;
            public inPotNum: number;
            public maxPot: (number|Long);
            public tanPaiNum: number;
            public tanPaiWinNum: number;
            public allInNum: number;
            public allInWinNum: number;
            public bestPokerList: number[];
            public static encode(m: roleInfo.IRoleStaticsInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.RoleStaticsInfo;
        }
    
        interface IRoleInfoResp {
            info?: (roleInfo.IRoleStaticsInfo|null);
            nameChangeTimes?: (number|null);
        }
    
        class RoleInfoResp implements IRoleInfoResp {
            constructor(p?: roleInfo.IRoleInfoResp);
            public info?: (roleInfo.IRoleStaticsInfo|null);
            public nameChangeTimes: number;
            public static encode(m: roleInfo.IRoleInfoResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.RoleInfoResp;
        }
    
        interface IRoleGameInfo {
            id?: (number|null);
        }
    
        class RoleGameInfo implements IRoleGameInfo {
            constructor(p?: roleInfo.IRoleGameInfo);
            public id: number;
            public static encode(m: roleInfo.IRoleGameInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.RoleGameInfo;
        }
    
        interface IAvatarInfoReq {
            userID?: (number|Long|null);
        }
    
        class AvatarInfoReq implements IAvatarInfoReq {
            constructor(p?: roleInfo.IAvatarInfoReq);
            public userID: (number|Long);
            public static encode(m: roleInfo.IAvatarInfoReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.AvatarInfoReq;
        }
    
        interface IAvatarInfoList {
            list?: (roleInfo.IAvatarInfo[]|null);
        }
    
        class AvatarInfoList implements IAvatarInfoList {
            constructor(p?: roleInfo.IAvatarInfoList);
            public list: roleInfo.IAvatarInfo[];
            public static encode(m: roleInfo.IAvatarInfoList, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.AvatarInfoList;
        }
    
        interface IAvatarInfo {
            ano?: (number|null);
            url?: (string|null);
            status?: (boolean|null);
        }
    
        class AvatarInfo implements IAvatarInfo {
            constructor(p?: roleInfo.IAvatarInfo);
            public ano: number;
            public url: string;
            public status: boolean;
            public static encode(m: roleInfo.IAvatarInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.AvatarInfo;
        }
    
        interface ISetAvatarReq {
            userID?: (number|Long|null);
            ano?: (number|null);
        }
    
        class SetAvatarReq implements ISetAvatarReq {
            constructor(p?: roleInfo.ISetAvatarReq);
            public userID: (number|Long);
            public ano: number;
            public static encode(m: roleInfo.ISetAvatarReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.SetAvatarReq;
        }
    
        interface ISetAvatarResp {
            userID?: (number|Long|null);
            ano?: (number|null);
        }
    
        class SetAvatarResp implements ISetAvatarResp {
            constructor(p?: roleInfo.ISetAvatarResp);
            public userID: (number|Long);
            public ano: number;
            public static encode(m: roleInfo.ISetAvatarResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.SetAvatarResp;
        }
    
        interface ISetNameReq {
            userID?: (number|Long|null);
            name?: (string|null);
        }
    
        class SetNameReq implements ISetNameReq {
            constructor(p?: roleInfo.ISetNameReq);
            public userID: (number|Long);
            public name: string;
            public static encode(m: roleInfo.ISetNameReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.SetNameReq;
        }
    
        interface ISetNameResp {
            userID?: (number|Long|null);
            name?: (string|null);
            status?: (roleInfo.SetNameStatus|null);
        }
    
        class SetNameResp implements ISetNameResp {
            constructor(p?: roleInfo.ISetNameResp);
            public userID: (number|Long);
            public name: string;
            public status: roleInfo.SetNameStatus;
            public static encode(m: roleInfo.ISetNameResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.SetNameResp;
        }
    
        interface IBorderInfoReq {
            userID?: (number|Long|null);
        }
    
        class BorderInfoReq implements IBorderInfoReq {
            constructor(p?: roleInfo.IBorderInfoReq);
            public userID: (number|Long);
            public static encode(m: roleInfo.IBorderInfoReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.BorderInfoReq;
        }
    
        interface IBorderInfoList {
            list?: (roleInfo.IBorderInfo[]|null);
        }
    
        class BorderInfoList implements IBorderInfoList {
            constructor(p?: roleInfo.IBorderInfoList);
            public list: roleInfo.IBorderInfo[];
            public static encode(m: roleInfo.IBorderInfoList, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.BorderInfoList;
        }
    
        interface IBorderInfo {
            bno?: (number|null);
            url?: (string|null);
            name?: (string|null);
            expireTime?: (number|null);
            src?: (roleInfo.BorderSRC|null);
            status?: (boolean|null);
        }
    
        class BorderInfo implements IBorderInfo {
            constructor(p?: roleInfo.IBorderInfo);
            public bno: number;
            public url: string;
            public name: string;
            public expireTime: number;
            public src: roleInfo.BorderSRC;
            public status: boolean;
            public static encode(m: roleInfo.IBorderInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.BorderInfo;
        }
    
        enum SetNameStatus {
            NAME_SUCCESS = 0,
            NAME_EXIST = 1,
            NAME_OUTS_OF_TIMES = 2
        }
    
        enum BorderSRC {
            DEFAULT = 0,
            ACTIVITY = 1,
            OTHER = 2
        }
    
        interface ISetBorderReq {
            userID?: (number|Long|null);
            bno?: (number|null);
        }
    
        class SetBorderReq implements ISetBorderReq {
            constructor(p?: roleInfo.ISetBorderReq);
            public userID: (number|Long);
            public bno: number;
            public static encode(m: roleInfo.ISetBorderReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.SetBorderReq;
        }
    
        interface ISetBorderResp {
            userID?: (number|Long|null);
            bno?: (number|null);
        }
    
        class SetBorderResp implements ISetBorderResp {
            constructor(p?: roleInfo.ISetBorderResp);
            public userID: (number|Long);
            public bno: number;
            public static encode(m: roleInfo.ISetBorderResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.SetBorderResp;
        }
    
        interface ISetResp {
            status?: (boolean|null);
        }
    
        class SetResp implements ISetResp {
            constructor(p?: roleInfo.ISetResp);
            public status: boolean;
            public static encode(m: roleInfo.ISetResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.SetResp;
        }
    
        interface IRoleJsonDataReq {
            userID?: (number|Long|null);
        }
    
        class RoleJsonDataReq implements IRoleJsonDataReq {
            constructor(p?: roleInfo.IRoleJsonDataReq);
            public userID: (number|Long);
            public static encode(m: roleInfo.IRoleJsonDataReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.RoleJsonDataReq;
        }
    
        interface IRoleJsonDataResp {
            userID?: (number|Long|null);
            jsonData?: (string|null);
        }
    
        class RoleJsonDataResp implements IRoleJsonDataResp {
            constructor(p?: roleInfo.IRoleJsonDataResp);
            public userID: (number|Long);
            public jsonData: string;
            public static encode(m: roleInfo.IRoleJsonDataResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.RoleJsonDataResp;
        }
    
        interface IRoleJsonDataSettingReq {
            userID?: (number|Long|null);
            jsonData?: (string|null);
        }
    
        class RoleJsonDataSettingReq implements IRoleJsonDataSettingReq {
            constructor(p?: roleInfo.IRoleJsonDataSettingReq);
            public userID: (number|Long);
            public jsonData: string;
            public static encode(m: roleInfo.IRoleJsonDataSettingReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.RoleJsonDataSettingReq;
        }
    
        interface IRoleJsonDataSettingResp {
            userID?: (number|Long|null);
            jsonData?: (string|null);
        }
    
        class RoleJsonDataSettingResp implements IRoleJsonDataSettingResp {
            constructor(p?: roleInfo.IRoleJsonDataSettingResp);
            public userID: (number|Long);
            public jsonData: string;
            public static encode(m: roleInfo.IRoleJsonDataSettingResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.RoleJsonDataSettingResp;
        }
    
        interface ISendReward {
            userID?: (number|Long|null);
            list?: (roleInfo.IRewardContent[]|null);
        }
    
        class SendReward implements ISendReward {
            constructor(p?: roleInfo.ISendReward);
            public userID: (number|Long);
            public list: roleInfo.IRewardContent[];
            public static encode(m: roleInfo.ISendReward, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.SendReward;
        }
    
        interface IRewardContent {
            itemId?: (number|null);
            itemNum?: (number|null);
        }
    
        class RewardContent implements IRewardContent {
            constructor(p?: roleInfo.IRewardContent);
            public itemId: number;
            public itemNum: number;
            public static encode(m: roleInfo.IRewardContent, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.RewardContent;
        }
    
        interface ISetBankAccountReq {
            userID?: (number|Long|null);
            bankAccountName?: (string|null);
            bankName?: (string|null);
            subBankName?: (string|null);
            bankCardNo?: (string|null);
        }
    
        class SetBankAccountReq implements ISetBankAccountReq {
            constructor(p?: roleInfo.ISetBankAccountReq);
            public userID: (number|Long);
            public bankAccountName: string;
            public bankName: string;
            public subBankName: string;
            public bankCardNo: string;
            public static encode(m: roleInfo.ISetBankAccountReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.SetBankAccountReq;
        }
    
        interface ISetBankAccountResp {
            status?: (boolean|null);
        }
    
        class SetBankAccountResp implements ISetBankAccountResp {
            constructor(p?: roleInfo.ISetBankAccountResp);
            public status: boolean;
            public static encode(m: roleInfo.ISetBankAccountResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.SetBankAccountResp;
        }
    
        interface IGetBankAccountReq {
            userID?: (number|Long|null);
        }
    
        class GetBankAccountReq implements IGetBankAccountReq {
            constructor(p?: roleInfo.IGetBankAccountReq);
            public userID: (number|Long);
            public static encode(m: roleInfo.IGetBankAccountReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.GetBankAccountReq;
        }
    
        interface IGetBankAccountResp {
            status?: (boolean|null);
            bankAccountName?: (string|null);
            bankName?: (string|null);
            subBankName?: (string|null);
            bankCardNo?: (string|null);
        }
    
        class GetBankAccountResp implements IGetBankAccountResp {
            constructor(p?: roleInfo.IGetBankAccountResp);
            public status: boolean;
            public bankAccountName: string;
            public bankName: string;
            public subBankName: string;
            public bankCardNo: string;
            public static encode(m: roleInfo.IGetBankAccountResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): roleInfo.GetBankAccountResp;
        }
    
        enum RoleInfoCode {
            UNSPECIFIED = 0,
            GET_SIMPLE_INFO = 11000,
            ROLE_GAME_INFO = 11001,
            GET_INFO = 11002,
            SET_AVATAR_INFO = 11003,
            SET_NAME_INFO = 11004,
            SET_BORDER_INFO = 11005,
            REQ_JSON_DATA = 11006,
            SET_JSON_DATA = 11007,
            SET_BANKACCOUNT = 11008,
            GET_BANKACCOUNT = 11009
        }
    }
    
    export namespace turntable {
    
        interface ITurnTableInfoReq {
            userID?: (number|Long|null);
            type?: (turntable.TurnTableType|null);
        }
    
        class TurnTableInfoReq implements ITurnTableInfoReq {
            constructor(p?: turntable.ITurnTableInfoReq);
            public userID: (number|Long);
            public type: turntable.TurnTableType;
            public static encode(m: turntable.ITurnTableInfoReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): turntable.TurnTableInfoReq;
        }
    
        enum TurnTableType {
            NORMAL = 0,
            SUPER = 1,
            FREE = 2,
            SHOP1 = 3,
            SHOP2 = 4
        }
    
        interface ITurnTableInfoResp {
            count?: (number|null);
            time?: (number|null);
            freeCount?: (number|null);
        }
    
        class TurnTableInfoResp implements ITurnTableInfoResp {
            constructor(p?: turntable.ITurnTableInfoResp);
            public count: number;
            public time: number;
            public freeCount: number;
            public static encode(m: turntable.ITurnTableInfoResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): turntable.TurnTableInfoResp;
        }
    
        interface ITurnTableReq {
            userID?: (number|Long|null);
            type?: (turntable.TurnTableType|null);
        }
    
        class TurnTableReq implements ITurnTableReq {
            constructor(p?: turntable.ITurnTableReq);
            public userID: (number|Long);
            public type: turntable.TurnTableType;
            public static encode(m: turntable.ITurnTableReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): turntable.TurnTableReq;
        }
    
        interface ITurnTableResp {
            count?: (number|null);
            time?: (number|null);
            freeCount?: (number|null);
            money?: (number|Long|null);
            vipAdd?: (number|Long|null);
        }
    
        class TurnTableResp implements ITurnTableResp {
            constructor(p?: turntable.ITurnTableResp);
            public count: number;
            public time: number;
            public freeCount: number;
            public money: (number|Long);
            public vipAdd: (number|Long);
            public static encode(m: turntable.ITurnTableResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): turntable.TurnTableResp;
        }
    
        interface IShopTurnTableInfoReq {
            userID?: (number|Long|null);
        }
    
        class ShopTurnTableInfoReq implements IShopTurnTableInfoReq {
            constructor(p?: turntable.IShopTurnTableInfoReq);
            public userID?: (number|Long|null);
            public _userID?: "userID";
            public static encode(m: turntable.IShopTurnTableInfoReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): turntable.ShopTurnTableInfoReq;
        }
    
        interface IShopTurnTable {
            type?: (turntable.TurnTableType|null);
            num?: (number|null);
        }
    
        class ShopTurnTable implements IShopTurnTable {
            constructor(p?: turntable.IShopTurnTable);
            public type: turntable.TurnTableType;
            public num: number;
            public static encode(m: turntable.IShopTurnTable, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): turntable.ShopTurnTable;
        }
    
        interface IShopTurnTableInfoResp {
            list?: (turntable.IShopTurnTable[]|null);
        }
    
        class ShopTurnTableInfoResp implements IShopTurnTableInfoResp {
            constructor(p?: turntable.IShopTurnTableInfoResp);
            public list: turntable.IShopTurnTable[];
            public static encode(m: turntable.IShopTurnTableInfoResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): turntable.ShopTurnTableInfoResp;
        }
    
        interface IShopTurnTableResp {
            type?: (turntable.TurnTableType|null);
            num?: (number|null);
            money?: (number|Long|null);
            vipAdd?: (number|Long|null);
        }
    
        class ShopTurnTableResp implements IShopTurnTableResp {
            constructor(p?: turntable.IShopTurnTableResp);
            public type: turntable.TurnTableType;
            public num: number;
            public money: (number|Long);
            public vipAdd: (number|Long);
            public static encode(m: turntable.IShopTurnTableResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): turntable.ShopTurnTableResp;
        }
    
        interface IShopTurnTableBuyCounterReq {
            userID?: (number|Long|null);
        }
    
        class ShopTurnTableBuyCounterReq implements IShopTurnTableBuyCounterReq {
            constructor(p?: turntable.IShopTurnTableBuyCounterReq);
            public userID?: (number|Long|null);
            public _userID?: "userID";
            public static encode(m: turntable.IShopTurnTableBuyCounterReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): turntable.ShopTurnTableBuyCounterReq;
        }
    
        interface IShopTurnTableBuyCounterResp {
            list?: (turntable.IShopTurnTableBuyCounter[]|null);
        }
    
        class ShopTurnTableBuyCounterResp implements IShopTurnTableBuyCounterResp {
            constructor(p?: turntable.IShopTurnTableBuyCounterResp);
            public list: turntable.IShopTurnTableBuyCounter[];
            public static encode(m: turntable.IShopTurnTableBuyCounterResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): turntable.ShopTurnTableBuyCounterResp;
        }
    
        interface IShopTurnTableBuyCounter {
            type?: (turntable.TurnTableType|null);
            num?: (number|null);
        }
    
        class ShopTurnTableBuyCounter implements IShopTurnTableBuyCounter {
            constructor(p?: turntable.IShopTurnTableBuyCounter);
            public type: turntable.TurnTableType;
            public num: number;
            public static encode(m: turntable.IShopTurnTableBuyCounter, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): turntable.ShopTurnTableBuyCounter;
        }
    
        enum TurnTableCode {
            NONE = 0,
            GET_FREE_INFO = 13000,
            FREE_REQ = 13001,
            GET_SHOP_INFO = 13002,
            SHOP_REQ = 13003,
            BUY_COUNTER_REQ = 13004
        }
    }
    
    export namespace push {
    
        interface IInventoryChange {
            info?: (bag.IitemInfo[]|null);
            reason?: (bag.ChangeReason|null);
        }
    
        class InventoryChange implements IInventoryChange {
            constructor(p?: push.IInventoryChange);
            public info: bag.IitemInfo[];
            public reason: bag.ChangeReason;
            public static encode(m: push.IInventoryChange, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): push.InventoryChange;
        }
    
        enum InfoType {
            TEMPLATE = 0,
            EVENT = 1,
            MAIL = 2,
            VIP = 3
        }
    
        interface IInfoChange {
            infoType?: (push.InfoType|null);
            data?: (Uint8Array|null);
            opCode?: (number|null);
        }
    
        class InfoChange implements IInfoChange {
            constructor(p?: push.IInfoChange);
            public infoType: push.InfoType;
            public data: Uint8Array;
            public opCode: number;
            public static encode(m: push.IInfoChange, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): push.InfoChange;
        }
    
        interface IPushStatus {
            status?: (boolean|null);
        }
    
        class PushStatus implements IPushStatus {
            constructor(p?: push.IPushStatus);
            public status: boolean;
            public static encode(m: push.IPushStatus, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): push.PushStatus;
        }
    
        interface IPushData {
            toUid?: (number|Long|null);
            zone?: (push.PushZone|null);
            opCode?: (number|Long|null);
            protoData?: (Uint8Array|null);
        }
    
        class PushData implements IPushData {
            constructor(p?: push.IPushData);
            public toUid: (number|Long);
            public zone: push.PushZone;
            public opCode: (number|Long);
            public protoData: Uint8Array;
            public static encode(m: push.IPushData, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): push.PushData;
        }
    
        enum PushZone {
            PERSON = 0,
            ROOM = 1,
            HALL = 2,
            MTT = 3
        }
    
        interface IMoneyChange {
            toUid?: (number|Long|null);
        }
    
        class MoneyChange implements IMoneyChange {
            constructor(p?: push.IMoneyChange);
            public toUid: (number|Long);
            public static encode(m: push.IMoneyChange, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): push.MoneyChange;
        }
    
        enum PushCode {
            UNSPECIFIED = 0,
            INVENTORY_CHANGE = 14000,
            INFO_CHANGE = 14001
        }
    }
    
    export namespace bag {
    
        interface IpbGetBag {
            roleId?: (number|Long|null);
        }
    
        class pbGetBag implements IpbGetBag {
            constructor(p?: bag.IpbGetBag);
            public roleId: (number|Long);
            public static encode(m: bag.IpbGetBag, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): bag.pbGetBag;
        }
    
        interface IpbBagInfo {
            roleId?: (number|Long|null);
            list?: (bag.IitemInfo[]|null);
        }
    
        class pbBagInfo implements IpbBagInfo {
            constructor(p?: bag.IpbBagInfo);
            public roleId: (number|Long);
            public list: bag.IitemInfo[];
            public static encode(m: bag.IpbBagInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): bag.pbBagInfo;
        }
    
        interface IitemInfo {
            boxId?: (number|null);
            itemId?: (number|null);
            num?: (number|Long|null);
            ExpTime?: (number|Long|null);
            jsonData?: (string|null);
        }
    
        class itemInfo implements IitemInfo {
            constructor(p?: bag.IitemInfo);
            public boxId: number;
            public itemId: number;
            public num: (number|Long);
            public ExpTime: (number|Long);
            public jsonData: string;
            public static encode(m: bag.IitemInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): bag.itemInfo;
        }
    
        interface IpbOpBagItemList {
            roleId?: (number|Long|null);
            list?: (bag.IopBagItem[]|null);
            reason?: (bag.ChangeReason|null);
        }
    
        class pbOpBagItemList implements IpbOpBagItemList {
            constructor(p?: bag.IpbOpBagItemList);
            public roleId: (number|Long);
            public list: bag.IopBagItem[];
            public reason: bag.ChangeReason;
            public static encode(m: bag.IpbOpBagItemList, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): bag.pbOpBagItemList;
        }
    
        interface IopBagItem {
            itemId?: (number|null);
            num?: (number|Long|null);
            expTime?: (number|Long|null);
            jsonData?: (string|null);
        }
    
        class opBagItem implements IopBagItem {
            constructor(p?: bag.IopBagItem);
            public itemId: number;
            public num: (number|Long);
            public expTime: (number|Long);
            public jsonData: string;
            public static encode(m: bag.IopBagItem, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): bag.opBagItem;
        }
    
        interface IpbStatus {
            status?: (boolean|null);
        }
    
        class pbStatus implements IpbStatus {
            constructor(p?: bag.IpbStatus);
            public status: boolean;
            public static encode(m: bag.IpbStatus, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): bag.pbStatus;
        }
    
        interface IpbGetItem {
            roleId?: (number|Long|null);
            itemId?: (number|null);
        }
    
        class pbGetItem implements IpbGetItem {
            constructor(p?: bag.IpbGetItem);
            public roleId: (number|Long);
            public itemId: number;
            public static encode(m: bag.IpbGetItem, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): bag.pbGetItem;
        }
    
        interface IpbGetItemTypeReq {
            roleId?: (number|Long|null);
            itemType?: (bag.ItemType|null);
        }
    
        class pbGetItemTypeReq implements IpbGetItemTypeReq {
            constructor(p?: bag.IpbGetItemTypeReq);
            public roleId: (number|Long);
            public itemType: bag.ItemType;
            public static encode(m: bag.IpbGetItemTypeReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): bag.pbGetItemTypeReq;
        }
    
        interface IpbGetItemTypeRes {
            roleId?: (number|Long|null);
            itemType?: (bag.ItemType|null);
            list?: (bag.IitemInfo[]|null);
        }
    
        class pbGetItemTypeRes implements IpbGetItemTypeRes {
            constructor(p?: bag.IpbGetItemTypeRes);
            public roleId: (number|Long);
            public itemType: bag.ItemType;
            public list: bag.IitemInfo[];
            public static encode(m: bag.IpbGetItemTypeRes, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): bag.pbGetItemTypeRes;
        }
    
        enum BagCode {
            BROADCAST_INIT = 0,
            GET_BAG_LIST = 64001
        }
    
        enum ItemType {
            DEFAUL_TYPE = 0,
            HEAD_PORTRAIT_BOX = 11,
            POKER_BACK = 12,
            HEAD_PIC = 13
        }
    
        enum ChangeReason {
            DEFAULT = 0,
            REGISTER = 1,
            CHARGE = 2,
            CHECKIN = 3,
            TURNTABLE = 4
        }
    }
    
    export namespace vip {
    
        enum noticeType {
            NONE = 0,
            NOTICE_WEEK_PACKET_COUNTER = 15005,
            NOTICE_LEVEL_CHARGE = 15006,
            NOTICE_VIP_UP = 15007,
            NOTICE_VIP_DOWN = 15008
        }
    
        enum BorderLevelType {
            UNSPECIFIED = 0,
            JUNIOR = 1,
            ADVANCED = 2,
            PREMIUM = 3
        }
    
        enum UpgradeStatusType {
            NOTAVAILABLE = 0,
            AVAILABLE = 1,
            ALREADY = 2
        }
    
        interface IpbType {
            userID?: (number|Long|null);
        }
    
        class pbType implements IpbType {
            constructor(p?: vip.IpbType);
            public userID: (number|Long);
            public static encode(m: vip.IpbType, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): vip.pbType;
        }
    
        interface IVipStatus {
            level?: (number|null);
            vipInfoUrl?: (string|null);
            value?: (number|null);
            limit?: (number|null);
            config?: (vip.IvipConfig[]|null);
        }
    
        class VipStatus implements IVipStatus {
            constructor(p?: vip.IVipStatus);
            public level: number;
            public vipInfoUrl: string;
            public value: number;
            public limit: number;
            public config: vip.IvipConfig[];
            public static encode(m: vip.IVipStatus, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): vip.VipStatus;
        }
    
        interface IvipConfig {
            level?: (number|null);
            loginBuff?: (number|null);
            turnBuff?: (number|null);
            weekCounter?: (number|null);
            alreadyBuyWeekCounter?: (number|null);
            isHide?: (boolean|null);
            borderLevel?: (vip.BorderLevelType|null);
            upgradeStatus?: (vip.UpgradeStatusType|null);
            upgradeList?: (vip.IupgradePacket[]|null);
            weekPacketId?: (number|null);
        }
    
        class vipConfig implements IvipConfig {
            constructor(p?: vip.IvipConfig);
            public level: number;
            public loginBuff: number;
            public turnBuff: number;
            public weekCounter: number;
            public alreadyBuyWeekCounter: number;
            public isHide: boolean;
            public borderLevel: vip.BorderLevelType;
            public upgradeStatus: vip.UpgradeStatusType;
            public upgradeList: vip.IupgradePacket[];
            public weekPacketId: number;
            public static encode(m: vip.IvipConfig, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): vip.vipConfig;
        }
    
        interface IupgradePacket {
            packetId?: (number|null);
            packetNum?: (number|null);
        }
    
        class upgradePacket implements IupgradePacket {
            constructor(p?: vip.IupgradePacket);
            public packetId: number;
            public packetNum: number;
            public static encode(m: vip.IupgradePacket, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): vip.upgradePacket;
        }
    
        interface IupgradePacketReq {
            userID?: (number|Long|null);
            level?: (number|null);
        }
    
        class upgradePacketReq implements IupgradePacketReq {
            constructor(p?: vip.IupgradePacketReq);
            public userID: (number|Long);
            public level: number;
            public static encode(m: vip.IupgradePacketReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): vip.upgradePacketReq;
        }
    
        interface IupgradePacketResp {
            level?: (number|null);
            upgradeList?: (vip.IupgradePacket[]|null);
        }
    
        class upgradePacketResp implements IupgradePacketResp {
            constructor(p?: vip.IupgradePacketResp);
            public level: number;
            public upgradeList: vip.IupgradePacket[];
            public static encode(m: vip.IupgradePacketResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): vip.upgradePacketResp;
        }
    
        interface InoticeVipUpgrade {
            level?: (number|null);
            loginBuff?: (number|null);
            turnBuff?: (number|null);
            weekCounter?: (number|null);
            borderLevel?: (vip.BorderLevelType|null);
            upgradeStatus?: (vip.UpgradeStatusType|null);
            upgradeList?: (vip.IupgradePacket[]|null);
            weekPacketId?: (number|null);
        }
    
        class noticeVipUpgrade implements InoticeVipUpgrade {
            constructor(p?: vip.InoticeVipUpgrade);
            public level: number;
            public loginBuff: number;
            public turnBuff: number;
            public weekCounter: number;
            public borderLevel: vip.BorderLevelType;
            public upgradeStatus: vip.UpgradeStatusType;
            public upgradeList: vip.IupgradePacket[];
            public weekPacketId: number;
            public static encode(m: vip.InoticeVipUpgrade, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): vip.noticeVipUpgrade;
        }
    
        interface InoticeVipDowngrade {
            level?: (number|null);
            days?: (number|null);
            status?: (boolean|null);
        }
    
        class noticeVipDowngrade implements InoticeVipDowngrade {
            constructor(p?: vip.InoticeVipDowngrade);
            public level: number;
            public days: number;
            public status: boolean;
            public static encode(m: vip.InoticeVipDowngrade, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): vip.noticeVipDowngrade;
        }
    
        interface IlevelBuff {
            level?: (number|null);
            loginBuff?: (number|null);
            turnBuff?: (number|null);
            weekCounter?: (number|null);
            borderLevel?: (vip.BorderLevelType|null);
            isHide?: (boolean|null);
        }
    
        class levelBuff implements IlevelBuff {
            constructor(p?: vip.IlevelBuff);
            public level: number;
            public loginBuff: number;
            public turnBuff: number;
            public weekCounter: number;
            public borderLevel: vip.BorderLevelType;
            public isHide: boolean;
            public static encode(m: vip.IlevelBuff, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): vip.levelBuff;
        }
    
        interface IdataHideReq {
            userID?: (number|Long|null);
        }
    
        class dataHideReq implements IdataHideReq {
            constructor(p?: vip.IdataHideReq);
            public userID: (number|Long);
            public static encode(m: vip.IdataHideReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): vip.dataHideReq;
        }
    
        interface IdataHideResp {
            enable?: (boolean|null);
        }
    
        class dataHideResp implements IdataHideResp {
            constructor(p?: vip.IdataHideResp);
            public enable: boolean;
            public static encode(m: vip.IdataHideResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): vip.dataHideResp;
        }
    
        interface IsetDataHideReq {
            userID?: (number|Long|null);
            enable?: (boolean|null);
        }
    
        class setDataHideReq implements IsetDataHideReq {
            constructor(p?: vip.IsetDataHideReq);
            public userID: (number|Long);
            public enable: boolean;
            public static encode(m: vip.IsetDataHideReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): vip.setDataHideReq;
        }
    
        interface IsetDataHideResp {
            enable?: (boolean|null);
        }
    
        class setDataHideResp implements IsetDataHideResp {
            constructor(p?: vip.IsetDataHideResp);
            public enable: boolean;
            public static encode(m: vip.IsetDataHideResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): vip.setDataHideResp;
        }
    
        interface InoticeWeekPacketCounter {
            level?: (number|null);
            counter?: (number|null);
        }
    
        class noticeWeekPacketCounter implements InoticeWeekPacketCounter {
            constructor(p?: vip.InoticeWeekPacketCounter);
            public level: number;
            public counter: number;
            public static encode(m: vip.InoticeWeekPacketCounter, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): vip.noticeWeekPacketCounter;
        }
    
        interface InoticeLevelCharge {
            value?: (number|null);
            limit?: (number|null);
        }
    
        class noticeLevelCharge implements InoticeLevelCharge {
            constructor(p?: vip.InoticeLevelCharge);
            public value: number;
            public limit: number;
            public static encode(m: vip.InoticeLevelCharge, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): vip.noticeLevelCharge;
        }
    
        interface IupdateVipPointReq {
            userID?: (number|Long|null);
            vipPoint?: (number|null);
        }
    
        class updateVipPointReq implements IupdateVipPointReq {
            constructor(p?: vip.IupdateVipPointReq);
            public userID: (number|Long);
            public vipPoint: number;
            public static encode(m: vip.IupdateVipPointReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): vip.updateVipPointReq;
        }
    
        interface IupdateResp {
            status?: (boolean|null);
        }
    
        class updateResp implements IupdateResp {
            constructor(p?: vip.IupdateResp);
            public status: boolean;
            public static encode(m: vip.IupdateResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): vip.updateResp;
        }
    
        interface IupdateWeekPackageReq {
            userID?: (number|Long|null);
            level?: (number|null);
        }
    
        class updateWeekPackageReq implements IupdateWeekPackageReq {
            constructor(p?: vip.IupdateWeekPackageReq);
            public userID: (number|Long);
            public level: number;
            public static encode(m: vip.IupdateWeekPackageReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): vip.updateWeekPackageReq;
        }
    
        enum VipCode {
            NONE = 0,
            STATUS = 15001,
            UPGRADE_PACKAGE = 15002,
            DATA_HIDE = 15003,
            SET_DATA_HIDE = 15004,
            NOTICE_WEEK_PACKAGE_COUNTER = 15005,
            NOTICE_VIP_POINT_UPDATE = 15006,
            NOTICE_VIP_UPGRADE = 15007,
            NOTICE_VIP_DOWNGRADE = 15008
        }
    }
    
    export namespace task {
    
        enum TaskType {
            UNSPECIFIED = 0,
            TASK_FOLLOW_OP = 1,
            TASK_RAISE_OP = 2,
            TASK_WIN_RESULT = 3,
            TASK_PLAYER_GAME = 4,
            TASK_ALLIN_OP = 5,
            TASK_ALLIN_WIN = 6,
            TASK_LOGIN = 7,
            TASK_SPE_HANDCARD = 8,
            TASK_SPE_HANDCARD_WIN = 9,
            TASK_SPE_HANDLEVEL = 10,
            TASK_SPE_HANDLEVEL_WIN = 11,
            TASK_CHARGE_SPE_VALUE = 12,
            TASK_CHARGE = 13,
            TASK_PLAYER_SLOTS = 14,
            TASK_SHARE = 15,
            TASK_GIVE_GIFT = 16,
            TASK_WIN_ONCE_CHIP = 17
        }
    
        interface INLHEGameData {
            id?: (number|null);
            round?: (number|null);
            info?: (task.IplayerInfo[]|null);
            phase?: (task.GamePhase|null);
        }
    
        class NLHEGameData implements INLHEGameData {
            constructor(p?: task.INLHEGameData);
            public id: number;
            public round: number;
            public info: task.IplayerInfo[];
            public phase: task.GamePhase;
            public static encode(m: task.INLHEGameData, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): task.NLHEGameData;
        }
    
        enum GamePhase {
            PHASE_NONE = 0,
            PHASE_ACTION = 1,
            PHASE_BALANCE = 2
        }
    
        interface IplayerInfo {
            userId?: (number|Long|null);
            isWin?: (boolean|null);
            isALLIN?: (boolean|null);
            isGiveGift?: (boolean|null);
            showCards?: (number[]|null);
            pokerLev?: (number|null);
            chipOffset?: (number|Long|null);
        }
    
        class playerInfo implements IplayerInfo {
            constructor(p?: task.IplayerInfo);
            public userId: (number|Long);
            public isWin: boolean;
            public isALLIN: boolean;
            public isGiveGift: boolean;
            public showCards: number[];
            public pokerLev: number;
            public chipOffset: (number|Long);
            public static encode(m: task.IplayerInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): task.playerInfo;
        }
    
        interface ItaskInfoNotice {
            type?: (task.TaskType|null);
            userID?: (number|Long|null);
            roundNum?: (number|null);
            value?: (number|Long|null);
            holeCards?: (number[]|null);
            pokerLev?: (number|null);
        }
    
        class taskInfoNotice implements ItaskInfoNotice {
            constructor(p?: task.ItaskInfoNotice);
            public type: task.TaskType;
            public userID: (number|Long);
            public roundNum: number;
            public value: (number|Long);
            public holeCards: number[];
            public pokerLev: number;
            public static encode(m: task.ItaskInfoNotice, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): task.taskInfoNotice;
        }
    
        interface InoticeResp {
            status?: (boolean|null);
        }
    
        class noticeResp implements InoticeResp {
            constructor(p?: task.InoticeResp);
            public status: boolean;
            public static encode(m: task.InoticeResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): task.noticeResp;
        }
    
        interface IreqUserID {
            userID?: (number|Long|null);
        }
    
        class reqUserID implements IreqUserID {
            constructor(p?: task.IreqUserID);
            public userID: (number|Long);
            public static encode(m: task.IreqUserID, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): task.reqUserID;
        }
    
        interface IrespStatus {
            status?: (boolean|null);
        }
    
        class respStatus implements IrespStatus {
            constructor(p?: task.IrespStatus);
            public status: boolean;
            public static encode(m: task.IrespStatus, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): task.respStatus;
        }
    
        interface IreqInfo {
            userID?: (number|Long|null);
        }
    
        class reqInfo implements IreqInfo {
            constructor(p?: task.IreqInfo);
            public userID: (number|Long);
            public static encode(m: task.IreqInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): task.reqInfo;
        }
    
        interface ItaskInfo {
            taskId?: (number|null);
            taskNum?: (number|null);
            taskStatus?: (task.TaskStatusType|null);
        }
    
        class taskInfo implements ItaskInfo {
            constructor(p?: task.ItaskInfo);
            public taskId: number;
            public taskNum: number;
            public taskStatus: task.TaskStatusType;
            public static encode(m: task.ItaskInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): task.taskInfo;
        }
    
        interface ItaskInfoList {
            userID?: (number|Long|null);
            list?: (task.ItaskInfo[]|null);
            status?: (task.TaskClassType|null);
        }
    
        class taskInfoList implements ItaskInfoList {
            constructor(p?: task.ItaskInfoList);
            public userID: (number|Long);
            public list: task.ItaskInfo[];
            public status: task.TaskClassType;
            public static encode(m: task.ItaskInfoList, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): task.taskInfoList;
        }
    
        interface IrewardClaimReq {
            userID?: (number|Long|null);
            taskId?: (number|null);
        }
    
        class rewardClaimReq implements IrewardClaimReq {
            constructor(p?: task.IrewardClaimReq);
            public userID: (number|Long);
            public taskId: number;
            public static encode(m: task.IrewardClaimReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): task.rewardClaimReq;
        }
    
        interface IrewardClaimResp {
            userID?: (number|Long|null);
            rewardTaskList?: (number[]|null);
            list?: (task.ItaskInfo[]|null);
            status?: (number|null);
        }
    
        class rewardClaimResp implements IrewardClaimResp {
            constructor(p?: task.IrewardClaimResp);
            public userID: (number|Long);
            public rewardTaskList: number[];
            public list: task.ItaskInfo[];
            public status: number;
            public static encode(m: task.IrewardClaimResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): task.rewardClaimResp;
        }
    
        interface IjackpotRewardReq {
            userID?: (number|Long|null);
        }
    
        class jackpotRewardReq implements IjackpotRewardReq {
            constructor(p?: task.IjackpotRewardReq);
            public userID: (number|Long);
            public static encode(m: task.IjackpotRewardReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): task.jackpotRewardReq;
        }
    
        interface IjackpotRewardRecord {
            userID?: (number|Long|null);
            reward?: (number|Long|null);
            timestamp?: (number|Long|null);
        }
    
        class jackpotRewardRecord implements IjackpotRewardRecord {
            constructor(p?: task.IjackpotRewardRecord);
            public userID: (number|Long);
            public reward: (number|Long);
            public timestamp: (number|Long);
            public static encode(m: task.IjackpotRewardRecord, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): task.jackpotRewardRecord;
        }
    
        interface IjackpotRewardResp {
            userID?: (number|Long|null);
            reward?: (number|Long|null);
            list?: (task.IjackpotRewardRecord[]|null);
            status?: (boolean|null);
        }
    
        class jackpotRewardResp implements IjackpotRewardResp {
            constructor(p?: task.IjackpotRewardResp);
            public userID: (number|Long);
            public reward: (number|Long);
            public list: task.IjackpotRewardRecord[];
            public status: boolean;
            public static encode(m: task.IjackpotRewardResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): task.jackpotRewardResp;
        }
    
        interface InoticeTaskStatusUpdate {
            userID?: (number|Long|null);
            taskId?: (number|null);
        }
    
        class noticeTaskStatusUpdate implements InoticeTaskStatusUpdate {
            constructor(p?: task.InoticeTaskStatusUpdate);
            public userID: (number|Long);
            public taskId: number;
            public static encode(m: task.InoticeTaskStatusUpdate, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): task.noticeTaskStatusUpdate;
        }
    
        enum TaskOpCode {
            TASK_NONE = 0,
            TASK_REQ_INFO = 17001,
            TASK_REWARD_CLAIM = 17002,
            TASK_JACKPOT_REWARD = 17003,
            TASK_STATUS_UPDATE = 17004,
            TASK_JACKPOT_CLAIM = 17005
        }
    
        enum TaskClassType {
            NONE = 0,
            NEW_HAND = 1,
            NEW_HAND_ALL = 2,
            EVERYDAY = 3
        }
    
        enum TaskStatusType {
            LOCKED = 0,
            TODO = 1,
            FINISH = 2,
            REWARDED = 3
        }
    }
    
    export namespace trace {
    
        enum TraceType {
            UNSPECIFIED = 0,
            TRACE_FEEDBACK = 1
        }
    
        interface ItraceInfo {
            userID?: (number|Long|null);
            type?: (trace.TraceType|null);
            traceData?: (string|null);
        }
    
        class traceInfo implements ItraceInfo {
            constructor(p?: trace.ItraceInfo);
            public userID: (number|Long);
            public type: trace.TraceType;
            public traceData: string;
            public static encode(m: trace.ItraceInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): trace.traceInfo;
        }
    
        interface ItraceStatus {
            status?: (boolean|null);
        }
    
        class traceStatus implements ItraceStatus {
            constructor(p?: trace.ItraceStatus);
            public status: boolean;
            public static encode(m: trace.ItraceStatus, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): trace.traceStatus;
        }
    
        enum TraceOpCode {
            TRACE_NONE = 0,
            TRACE_INFO = 18001
        }
    }
    
    export namespace mail {
    
        interface IpbMsgType {
            roleId?: (number|Long|null);
            type?: (mail.MailType|null);
        }
    
        class pbMsgType implements IpbMsgType {
            constructor(p?: mail.IpbMsgType);
            public roleId?: (number|Long|null);
            public type?: (mail.MailType|null);
            public _roleId?: "roleId";
            public _type?: "type";
            public static encode(m: mail.IpbMsgType, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mail.pbMsgType;
        }
    
        interface IpbClubApplicationReq {
            roleId?: (number|Long|null);
            clubId?: (number|null);
        }
    
        class pbClubApplicationReq implements IpbClubApplicationReq {
            constructor(p?: mail.IpbClubApplicationReq);
            public roleId?: (number|Long|null);
            public clubId?: (number|null);
            public _roleId?: "roleId";
            public _clubId?: "clubId";
            public static encode(m: mail.IpbClubApplicationReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mail.pbClubApplicationReq;
        }
    
        interface IpbClubApplicationCountReq {
            roleId?: (number|Long|null);
            clubId?: (number|null);
        }
    
        class pbClubApplicationCountReq implements IpbClubApplicationCountReq {
            constructor(p?: mail.IpbClubApplicationCountReq);
            public roleId?: (number|Long|null);
            public clubId?: (number|null);
            public _roleId?: "roleId";
            public _clubId?: "clubId";
            public static encode(m: mail.IpbClubApplicationCountReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mail.pbClubApplicationCountReq;
        }
    
        interface IpbClubApplicationCountResp {
            unreadCount?: (number|null);
        }
    
        class pbClubApplicationCountResp implements IpbClubApplicationCountResp {
            constructor(p?: mail.IpbClubApplicationCountResp);
            public unreadCount?: (number|null);
            public _unreadCount?: "unreadCount";
            public static encode(m: mail.IpbClubApplicationCountResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mail.pbClubApplicationCountResp;
        }
    
        interface IpbMailList {
            roleId?: (number|Long|null);
            type?: (mail.MailType|null);
            list?: (mail.IpbNotice[]|null);
        }
    
        class pbMailList implements IpbMailList {
            constructor(p?: mail.IpbMailList);
            public roleId?: (number|Long|null);
            public type?: (mail.MailType|null);
            public list: mail.IpbNotice[];
            public _roleId?: "roleId";
            public _type?: "type";
            public static encode(m: mail.IpbMailList, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mail.pbMailList;
        }
    
        interface IpbNotice {
            index?: (string|null);
            templateId?: (number|null);
            templateData?: (string|null);
            status?: (mail.MailStatus|null);
            time?: (number|Long|null);
        }
    
        class pbNotice implements IpbNotice {
            constructor(p?: mail.IpbNotice);
            public index?: (string|null);
            public templateId?: (number|null);
            public templateData?: (string|null);
            public status?: (mail.MailStatus|null);
            public time?: (number|Long|null);
            public _index?: "index";
            public _templateId?: "templateId";
            public _templateData?: "templateData";
            public _status?: "status";
            public _time?: "time";
            public static encode(m: mail.IpbNotice, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mail.pbNotice;
        }
    
        interface IpbGetMailContent {
            roleId?: (number|Long|null);
            index?: (string|null);
        }
    
        class pbGetMailContent implements IpbGetMailContent {
            constructor(p?: mail.IpbGetMailContent);
            public roleId?: (number|Long|null);
            public index?: (string|null);
            public _roleId?: "roleId";
            public _index?: "index";
            public static encode(m: mail.IpbGetMailContent, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mail.pbGetMailContent;
        }
    
        interface IpbMailContent {
            roleId?: (number|Long|null);
            index?: (string|null);
            type?: (mail.MailType|null);
            templateId?: (number|null);
            templateData?: (string|null);
            time?: (number|Long|null);
            list?: (mail.Imail_attachment[]|null);
        }
    
        class pbMailContent implements IpbMailContent {
            constructor(p?: mail.IpbMailContent);
            public roleId?: (number|Long|null);
            public index?: (string|null);
            public type?: (mail.MailType|null);
            public templateId?: (number|null);
            public templateData?: (string|null);
            public time?: (number|Long|null);
            public list: mail.Imail_attachment[];
            public _roleId?: "roleId";
            public _index?: "index";
            public _type?: "type";
            public _templateId?: "templateId";
            public _templateData?: "templateData";
            public _time?: "time";
            public static encode(m: mail.IpbMailContent, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mail.pbMailContent;
        }
    
        interface Imail_attachment {
            itemId?: (number|null);
            num?: (number|Long|null);
        }
    
        class mail_attachment implements Imail_attachment {
            constructor(p?: mail.Imail_attachment);
            public itemId?: (number|null);
            public num?: (number|Long|null);
            public _itemId?: "itemId";
            public _num?: "num";
            public static encode(m: mail.Imail_attachment, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mail.mail_attachment;
        }
    
        interface IpbGetMailAttachment {
            roleId?: (number|Long|null);
            index?: (string|null);
        }
    
        class pbGetMailAttachment implements IpbGetMailAttachment {
            constructor(p?: mail.IpbGetMailAttachment);
            public roleId?: (number|Long|null);
            public index?: (string|null);
            public _roleId?: "roleId";
            public _index?: "index";
            public static encode(m: mail.IpbGetMailAttachment, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mail.pbGetMailAttachment;
        }
    
        interface IpbMailAttachmentResp {
            roleId?: (number|Long|null);
            index?: (string|null);
            list?: (mail.Imail_attachment[]|null);
        }
    
        class pbMailAttachmentResp implements IpbMailAttachmentResp {
            constructor(p?: mail.IpbMailAttachmentResp);
            public roleId?: (number|Long|null);
            public index?: (string|null);
            public list: mail.Imail_attachment[];
            public _roleId?: "roleId";
            public _index?: "index";
            public static encode(m: mail.IpbMailAttachmentResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mail.pbMailAttachmentResp;
        }
    
        interface IpbDeleteMail {
            roleId?: (number|Long|null);
            index?: (string|null);
        }
    
        class pbDeleteMail implements IpbDeleteMail {
            constructor(p?: mail.IpbDeleteMail);
            public roleId?: (number|Long|null);
            public index?: (string|null);
            public _roleId?: "roleId";
            public _index?: "index";
            public static encode(m: mail.IpbDeleteMail, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mail.pbDeleteMail;
        }
    
        interface IpbGetAllMailAttachment {
            roleId?: (number|Long|null);
        }
    
        class pbGetAllMailAttachment implements IpbGetAllMailAttachment {
            constructor(p?: mail.IpbGetAllMailAttachment);
            public roleId?: (number|Long|null);
            public _roleId?: "roleId";
            public static encode(m: mail.IpbGetAllMailAttachment, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mail.pbGetAllMailAttachment;
        }
    
        interface IpbAllMailAttachmentResp {
            roleId?: (number|Long|null);
            list?: (mail.Imail_attachment[]|null);
        }
    
        class pbAllMailAttachmentResp implements IpbAllMailAttachmentResp {
            constructor(p?: mail.IpbAllMailAttachmentResp);
            public roleId?: (number|Long|null);
            public list: mail.Imail_attachment[];
            public _roleId?: "roleId";
            public static encode(m: mail.IpbAllMailAttachmentResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mail.pbAllMailAttachmentResp;
        }
    
        interface IpbDeleteAll {
            roleId?: (number|Long|null);
            type?: (number|null);
        }
    
        class pbDeleteAll implements IpbDeleteAll {
            constructor(p?: mail.IpbDeleteAll);
            public roleId?: (number|Long|null);
            public type?: (number|null);
            public _roleId?: "roleId";
            public _type?: "type";
            public static encode(m: mail.IpbDeleteAll, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mail.pbDeleteAll;
        }
    
        enum MailType {
            DEFAULTMAIL = 0,
            EVENTMAIL = 1,
            SYSTEMMAIL = 2,
            CLUBAPPLICATION = 3
        }
    
        enum MailStatus {
            UNREAD = 0,
            READ = 1,
            UNREAD_NOT_RECEIVE = 2,
            READ_NOT_RECEIVE = 3
        }
    
        interface IpbSendMail {
            roleId?: (number|Long|null);
            templateId?: (number|null);
            mailAnnex?: (mail.Imail_attachment[]|null);
            templateData?: (string|null);
            startTime?: (number|Long|null);
            endTime?: (number|Long|null);
        }
    
        class pbSendMail implements IpbSendMail {
            constructor(p?: mail.IpbSendMail);
            public roleId?: (number|Long|null);
            public templateId?: (number|null);
            public mailAnnex: mail.Imail_attachment[];
            public templateData?: (string|null);
            public startTime?: (number|Long|null);
            public endTime?: (number|Long|null);
            public _roleId?: "roleId";
            public _templateId?: "templateId";
            public _templateData?: "templateData";
            public _startTime?: "startTime";
            public _endTime?: "endTime";
            public static encode(m: mail.IpbSendMail, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mail.pbSendMail;
        }
    
        interface IpbStatus {
            status?: (boolean|null);
        }
    
        class pbStatus implements IpbStatus {
            constructor(p?: mail.IpbStatus);
            public status?: (boolean|null);
            public _status?: "status";
            public static encode(m: mail.IpbStatus, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mail.pbStatus;
        }
    
        interface IpbSendSysMail {
            roleIdList?: (string|null);
            templateId?: (number|null);
            mailAnnex?: (mail.Imail_attachment[]|null);
            variableName?: (string|null);
            startTime?: (number|Long|null);
            endTime?: (number|Long|null);
        }
    
        class pbSendSysMail implements IpbSendSysMail {
            constructor(p?: mail.IpbSendSysMail);
            public roleIdList?: (string|null);
            public templateId?: (number|null);
            public mailAnnex: mail.Imail_attachment[];
            public variableName?: (string|null);
            public startTime?: (number|Long|null);
            public endTime?: (number|Long|null);
            public _roleIdList?: "roleIdList";
            public _templateId?: "templateId";
            public _variableName?: "variableName";
            public _startTime?: "startTime";
            public _endTime?: "endTime";
            public static encode(m: mail.IpbSendSysMail, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mail.pbSendSysMail;
        }
    
        enum MailCode {
            BROADCAST_INIT = 0,
            BROADCAST_MAIL = 60000,
            GET_MAIL_LIST = 60001,
            OPEN_MAIL_DETAILED = 60002,
            RECEIVE_MAIL = 60003,
            DELETE_MAIL = 60004,
            DELETE_MAIL_ALL = 60005,
            RECEIVE_MAIL_ALL = 60006,
            GET_MAIL_STATUS = 60007,
            PUSH_NEW_MAIL = 60008,
            GET_CLUBAPPLICATION_LIST = 60009,
            GET_CLUBAPPLICATION_UNREAD_COUNT = 60010
        }
    }
    
    export namespace shop {
    
        interface IpbGetShopConfig {
            roleId?: (number|Long|null);
        }
    
        class pbGetShopConfig implements IpbGetShopConfig {
            constructor(p?: shop.IpbGetShopConfig);
            public roleId: (number|Long);
            public static encode(m: shop.IpbGetShopConfig, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbGetShopConfig;
        }
    
        interface IpbShopInfo {
            roleId?: (number|Long|null);
            status?: (shop.roleShopType|null);
            list?: (shop.IpbDiscountShop[]|null);
        }
    
        class pbShopInfo implements IpbShopInfo {
            constructor(p?: shop.IpbShopInfo);
            public roleId: (number|Long);
            public status: shop.roleShopType;
            public list: shop.IpbDiscountShop[];
            public static encode(m: shop.IpbShopInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbShopInfo;
        }
    
        interface IpbDiscountShop {
            productId?: (number|null);
            num?: (number|Long|null);
            label?: (shop.labelType|null);
            percentage?: (number|null);
            time?: (shop.IpbTimeInfo[]|null);
        }
    
        class pbDiscountShop implements IpbDiscountShop {
            constructor(p?: shop.IpbDiscountShop);
            public productId: number;
            public num: (number|Long);
            public label: shop.labelType;
            public percentage: number;
            public time: shop.IpbTimeInfo[];
            public static encode(m: shop.IpbDiscountShop, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbDiscountShop;
        }
    
        interface IpbTimeInfo {
            startTime?: (number|Long|null);
            endTime?: (number|Long|null);
        }
    
        class pbTimeInfo implements IpbTimeInfo {
            constructor(p?: shop.IpbTimeInfo);
            public startTime: (number|Long);
            public endTime: (number|Long);
            public static encode(m: shop.IpbTimeInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbTimeInfo;
        }
    
        interface IpbCreateOrderReq {
            uid?: (number|Long|null);
            productId?: (number|null);
            payType?: (shop.storeType|null);
            shopPlace?: (number|null);
        }
    
        class pbCreateOrderReq implements IpbCreateOrderReq {
            constructor(p?: shop.IpbCreateOrderReq);
            public uid: (number|Long);
            public productId: number;
            public payType: shop.storeType;
            public shopPlace: number;
            public static encode(m: shop.IpbCreateOrderReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbCreateOrderReq;
        }
    
        interface IpbCreateOrderRes {
            uid?: (number|Long|null);
            productId?: (number|null);
            orderId?: (string|null);
            orderStatus?: (number|null);
            msg?: (string|null);
            payType?: (shop.storeType|null);
        }
    
        class pbCreateOrderRes implements IpbCreateOrderRes {
            constructor(p?: shop.IpbCreateOrderRes);
            public uid: (number|Long);
            public productId: number;
            public orderId: string;
            public orderStatus: number;
            public msg: string;
            public payType: shop.storeType;
            public static encode(m: shop.IpbCreateOrderRes, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbCreateOrderRes;
        }
    
        interface IpbCreateWithDrawOrderReq {
            uid?: (number|Long|null);
            amount?: (number|null);
            shopPlace?: (number|null);
        }
    
        class pbCreateWithDrawOrderReq implements IpbCreateWithDrawOrderReq {
            constructor(p?: shop.IpbCreateWithDrawOrderReq);
            public uid: (number|Long);
            public amount: number;
            public shopPlace: number;
            public static encode(m: shop.IpbCreateWithDrawOrderReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbCreateWithDrawOrderReq;
        }
    
        interface IpbCreateWithDrawOrderRes {
            uid?: (number|Long|null);
            orderId?: (string|null);
            orderStatus?: (number|null);
            msg?: (string|null);
        }
    
        class pbCreateWithDrawOrderRes implements IpbCreateWithDrawOrderRes {
            constructor(p?: shop.IpbCreateWithDrawOrderRes);
            public uid: (number|Long);
            public orderId: string;
            public orderStatus: number;
            public msg: string;
            public static encode(m: shop.IpbCreateWithDrawOrderRes, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbCreateWithDrawOrderRes;
        }
    
        interface IpbCheckOrderReq {
            uid?: (number|Long|null);
            payType?: (shop.storeType|null);
            receiptData?: (string|null);
        }
    
        class pbCheckOrderReq implements IpbCheckOrderReq {
            constructor(p?: shop.IpbCheckOrderReq);
            public uid: (number|Long);
            public payType: shop.storeType;
            public receiptData: string;
            public static encode(m: shop.IpbCheckOrderReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbCheckOrderReq;
        }
    
        interface IpbCheckOrderRes {
            uid?: (number|Long|null);
            token?: (string[]|null);
            payType?: (shop.storeType|null);
        }
    
        class pbCheckOrderRes implements IpbCheckOrderRes {
            constructor(p?: shop.IpbCheckOrderRes);
            public uid: (number|Long);
            public token: string[];
            public payType: shop.storeType;
            public static encode(m: shop.IpbCheckOrderRes, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbCheckOrderRes;
        }
    
        interface IpbSendOrderReq {
            uid?: (number|Long|null);
            token?: (string|null);
        }
    
        class pbSendOrderReq implements IpbSendOrderReq {
            constructor(p?: shop.IpbSendOrderReq);
            public uid: (number|Long);
            public token: string;
            public static encode(m: shop.IpbSendOrderReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbSendOrderReq;
        }
    
        interface IpbSendOrderRes {
            uid?: (number|Long|null);
            status?: (boolean|null);
        }
    
        class pbSendOrderRes implements IpbSendOrderRes {
            constructor(p?: shop.IpbSendOrderRes);
            public uid: (number|Long);
            public status: boolean;
            public static encode(m: shop.IpbSendOrderRes, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbSendOrderRes;
        }
    
        interface IpbGetOrderInfoReq {
            uid?: (number|Long|null);
            shopPlace?: (number|null);
            startTime?: (number|Long|null);
            endTime?: (number|Long|null);
        }
    
        class pbGetOrderInfoReq implements IpbGetOrderInfoReq {
            constructor(p?: shop.IpbGetOrderInfoReq);
            public uid: (number|Long);
            public shopPlace: number;
            public startTime: (number|Long);
            public endTime: (number|Long);
            public static encode(m: shop.IpbGetOrderInfoReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbGetOrderInfoReq;
        }
    
        interface IpbGetOrderInfoRes {
            list?: (shop.IOrderInfo[]|null);
        }
    
        class pbGetOrderInfoRes implements IpbGetOrderInfoRes {
            constructor(p?: shop.IpbGetOrderInfoRes);
            public list: shop.IOrderInfo[];
            public static encode(m: shop.IpbGetOrderInfoRes, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbGetOrderInfoRes;
        }
    
        interface IpbGetClubOrderInfoReq {
            clubId?: (number|null);
            startTime?: (number|Long|null);
            endTime?: (number|Long|null);
        }
    
        class pbGetClubOrderInfoReq implements IpbGetClubOrderInfoReq {
            constructor(p?: shop.IpbGetClubOrderInfoReq);
            public clubId: number;
            public startTime: (number|Long);
            public endTime: (number|Long);
            public static encode(m: shop.IpbGetClubOrderInfoReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbGetClubOrderInfoReq;
        }
    
        interface IpbGetClubOrderInfoRes {
            list?: (shop.IOrderInfo[]|null);
        }
    
        class pbGetClubOrderInfoRes implements IpbGetClubOrderInfoRes {
            constructor(p?: shop.IpbGetClubOrderInfoRes);
            public list: shop.IOrderInfo[];
            public static encode(m: shop.IpbGetClubOrderInfoRes, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbGetClubOrderInfoRes;
        }
    
        interface IOrderInfo {
            uid?: (number|null);
            productId?: (number|null);
            buyTime?: (number|null);
            payType?: (number|null);
            price?: (number|null);
            coin?: (number|null);
            reward?: (number|null);
            shopType?: (number|null);
            shopPlace?: (number|null);
            status?: (number|null);
            buyerName?: (string|null);
            balance?: (number|null);
        }
    
        class OrderInfo implements IOrderInfo {
            constructor(p?: shop.IOrderInfo);
            public uid: number;
            public productId: number;
            public buyTime: number;
            public payType: number;
            public price: number;
            public coin: number;
            public reward: number;
            public shopType: number;
            public shopPlace: number;
            public status: number;
            public buyerName: string;
            public balance: number;
            public static encode(m: shop.IOrderInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.OrderInfo;
        }
    
        interface IpbGetStartPackReq {
            uid?: (number|Long|null);
        }
    
        class pbGetStartPackReq implements IpbGetStartPackReq {
            constructor(p?: shop.IpbGetStartPackReq);
            public uid: (number|Long);
            public static encode(m: shop.IpbGetStartPackReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbGetStartPackReq;
        }
    
        interface IpbGetStartPackRes {
            uid?: (number|Long|null);
            isBuy?: (boolean|null);
        }
    
        class pbGetStartPackRes implements IpbGetStartPackRes {
            constructor(p?: shop.IpbGetStartPackRes);
            public uid: (number|Long);
            public isBuy: boolean;
            public static encode(m: shop.IpbGetStartPackRes, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbGetStartPackRes;
        }
    
        interface IpbDeleteDiscountShop {
            productId?: (number|null);
        }
    
        class pbDeleteDiscountShop implements IpbDeleteDiscountShop {
            constructor(p?: shop.IpbDeleteDiscountShop);
            public productId: number;
            public static encode(m: shop.IpbDeleteDiscountShop, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbDeleteDiscountShop;
        }
    
        interface IpbGetProductListReq {
            shopType?: (shop.roleShopType|null);
            shopPlace?: (number|null);
        }
    
        class pbGetProductListReq implements IpbGetProductListReq {
            constructor(p?: shop.IpbGetProductListReq);
            public shopType: shop.roleShopType;
            public shopPlace: number;
            public static encode(m: shop.IpbGetProductListReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbGetProductListReq;
        }
    
        interface IProduct {
            id?: (number|null);
            price?: (number|null);
            name?: (string|null);
            shopType?: (shop.roleShopType|null);
            shopPlace?: (number|null);
            image?: (string|null);
        }
    
        class Product implements IProduct {
            constructor(p?: shop.IProduct);
            public id: number;
            public price: number;
            public name: string;
            public shopType: shop.roleShopType;
            public shopPlace: number;
            public image: string;
            public static encode(m: shop.IProduct, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.Product;
        }
    
        interface IpbGetProductListResp {
            productList?: (shop.IProduct[]|null);
        }
    
        class pbGetProductListResp implements IpbGetProductListResp {
            constructor(p?: shop.IpbGetProductListResp);
            public productList: shop.IProduct[];
            public static encode(m: shop.IpbGetProductListResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbGetProductListResp;
        }
    
        interface IpbStatus {
            status?: (boolean|null);
        }
    
        class pbStatus implements IpbStatus {
            constructor(p?: shop.IpbStatus);
            public status: boolean;
            public static encode(m: shop.IpbStatus, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): shop.pbStatus;
        }
    
        enum BagCode {
            BROADCAST_INIT = 0,
            GET_SHOP_INFO = 61001,
            CREATE_ORDER = 61002,
            CHECK_ORDER = 61003,
            SEND_ORDER = 61004,
            GET_ORDER_INFO = 61005,
            GET_START_PACK_INFO = 61006,
            GET_PRODUCT_LIST = 61007,
            CREATE_WITHDRAW_ORDER = 61008,
            GET_CLUB_ORDER_INFO = 61009
        }
    
        enum storeType {
            TYPE_DEFAULT = 0,
            TYPE_GOOGLE = 1,
            TYPE_APPLE = 2,
            TYPE_GOUYU = 3,
            TYPE_WEBAO = 4,
            TYPE_WITHDRAW = 5,
            TYPE_GAME_IN = 6,
            TYPE_GAME_OUT = 7
        }
    
        enum labelType {
            LABEL_DEFAULT = 0,
            LABEL_HOT = 1,
            LABEL_BEST_DEAL = 2,
            LABEL_POPULAR = 3
        }
    
        enum roleShopType {
            SHOP_FREE = 0,
            SHOP_DAILY = 1,
            SHOP_NONE = 2,
            SHOP_TONGBI = 3,
            SHOP_GOUYU = 4,
            SHOP_COIN = 5
        }
    
        enum ShopPlace {
            PLACE_DEFAULT = 0,
            PLACE_GOUYU = 1
        }
    }
    
    export namespace club {
    
        interface IClubInfo {
            clubId?: (number|null);
            name?: (string|null);
            avatarId?: (number|null);
            avatarUrl?: (string|null);
            ownerId?: (number|null);
            clubType?: (number|null);
            maxPlayerNo?: (number|null);
            curPlayerNo?: (number|null);
            actvieTableNo?: (number|null);
            clubStatus?: (number|null);
            ownerName?: (string|null);
            totalAsset?: (number|null);
        }
    
        class ClubInfo implements IClubInfo {
            constructor(p?: club.IClubInfo);
            public clubId: number;
            public name: string;
            public avatarId: number;
            public avatarUrl: string;
            public ownerId: number;
            public clubType: number;
            public maxPlayerNo: number;
            public curPlayerNo: number;
            public actvieTableNo: number;
            public clubStatus: number;
            public ownerName: string;
            public totalAsset: number;
            public static encode(m: club.IClubInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.ClubInfo;
        }
    
        interface IChangStatistic {
            AveRate?: (number|null);
            No1Rate?: (number|null);
            No2Rate?: (number|null);
            No3Rate?: (number|null);
            No4Rate?: (number|null);
            AveWinXun?: (number|null);
            WinRate?: (number|null);
            FailRate?: (number|null);
            ReadyRate?: (number|null);
            FuluRate?: (number|null);
            TotalRound?: (number|null);
            AveWinPoint?: (number|null);
            AveFailPoint?: (number|null);
        }
    
        class ChangStatistic implements IChangStatistic {
            constructor(p?: club.IChangStatistic);
            public AveRate: number;
            public No1Rate: number;
            public No2Rate: number;
            public No3Rate: number;
            public No4Rate: number;
            public AveWinXun: number;
            public WinRate: number;
            public FailRate: number;
            public ReadyRate: number;
            public FuluRate: number;
            public TotalRound: number;
            public AveWinPoint: number;
            public AveFailPoint: number;
            public static encode(m: club.IChangStatistic, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.ChangStatistic;
        }
    
        interface IFulu {
            FuluType?: (number|null);
            Cards?: (number[]|null);
            Pos?: (number|null);
        }
    
        class Fulu implements IFulu {
            constructor(p?: club.IFulu);
            public FuluType: number;
            public Cards: number[];
            public Pos: number;
            public static encode(m: club.IFulu, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.Fulu;
        }
    
        interface IRecentHeCard {
            RemCards?: (number[]|null);
            Fulus?: (club.IFulu[]|null);
            ShowType?: (number|null);
        }
    
        class RecentHeCard implements IRecentHeCard {
            constructor(p?: club.IRecentHeCard);
            public RemCards: number[];
            public Fulus: club.IFulu[];
            public ShowType: number;
            public static encode(m: club.IRecentHeCard, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.RecentHeCard;
        }
    
        interface IFan {
            type?: (number|null);
            value?: (number|null);
        }
    
        class Fan implements IFan {
            constructor(p?: club.IFan);
            public type: number;
            public value: number;
            public static encode(m: club.IFan, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.Fan;
        }
    
        interface IStatisticExtra {
            heCount?: (number|null);
            roundCount?: (number|null);
            hePoint?: (number|null);
            fuluCount?: (number|null);
            fangpaoCount?: (number|null);
            fangpaoPoint?: (number|null);
        }
    
        class StatisticExtra implements IStatisticExtra {
            constructor(p?: club.IStatisticExtra);
            public heCount: number;
            public roundCount: number;
            public hePoint: number;
            public fuluCount: number;
            public fangpaoCount: number;
            public fangpaoPoint: number;
            public static encode(m: club.IStatisticExtra, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.StatisticExtra;
        }
    
        interface IStatistic {
            recentHeCard?: (club.IRecentHeCard|null);
            winCard?: (number|null);
            power?: (number|null);
            defense?: (number|null);
            speed?: (number|null);
            luck?: (number|null);
            position?: (number[]|null);
            East?: (club.IChangStatistic|null);
            South?: (club.IChangStatistic|null);
            fans?: (club.IFan[]|null);
            Extra?: (club.IStatisticExtra|null);
        }
    
        class Statistic implements IStatistic {
            constructor(p?: club.IStatistic);
            public recentHeCard?: (club.IRecentHeCard|null);
            public winCard: number;
            public power: number;
            public defense: number;
            public speed: number;
            public luck: number;
            public position: number[];
            public East?: (club.IChangStatistic|null);
            public South?: (club.IChangStatistic|null);
            public fans: club.IFan[];
            public Extra?: (club.IStatisticExtra|null);
            public static encode(m: club.IStatistic, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.Statistic;
        }
    
        interface IPlayerInfo {
            playerId?: (number|null);
            name?: (string|null);
            avatarId?: (number|null);
            avatarUrl?: (string|null);
            balance?: (number|null);
            fee?: (number|null);
            isOnline?: (boolean|null);
            joinedClubIdList?: (number[]|null);
            recentClubId?: (number|null);
            gouyu?: (number|null);
            tongbi?: (number|null);
            clubstatistic?: (club.IStatistic|null);
            friendstatistic?: (club.IStatistic|null);
            ledgerBalance?: (number|null);
            lastLoginTime?: (number|Long|null);
            lastPlayTime?: (number|Long|null);
            totalRoundNo?: (number|null);
        }
    
        class PlayerInfo implements IPlayerInfo {
            constructor(p?: club.IPlayerInfo);
            public playerId: number;
            public name: string;
            public avatarId: number;
            public avatarUrl: string;
            public balance: number;
            public fee: number;
            public isOnline: boolean;
            public joinedClubIdList: number[];
            public recentClubId: number;
            public gouyu: number;
            public tongbi: number;
            public clubstatistic?: (club.IStatistic|null);
            public friendstatistic?: (club.IStatistic|null);
            public ledgerBalance: number;
            public lastLoginTime: (number|Long);
            public lastPlayTime: (number|Long);
            public totalRoundNo: number;
            public static encode(m: club.IPlayerInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.PlayerInfo;
        }
    
        interface IClubPlayerInfo {
            clubId?: (number|null);
            playerId?: (number|null);
            balance?: (number|null);
            fee?: (number|null);
            joininTime?: (number|Long|null);
            lastPlayTime?: (number|Long|null);
            maxWinCoins?: (number|null);
            maxWinPoints?: (number|null);
            totalRoundNo?: (number|null);
            ledgerBalance?: (number|null);
            status?: (number|null);
            playerName?: (string|null);
            playerAvatarId?: (number|null);
            playerAvatarUrl?: (string|null);
        }
    
        class ClubPlayerInfo implements IClubPlayerInfo {
            constructor(p?: club.IClubPlayerInfo);
            public clubId: number;
            public playerId: number;
            public balance: number;
            public fee: number;
            public joininTime: (number|Long);
            public lastPlayTime: (number|Long);
            public maxWinCoins: number;
            public maxWinPoints: number;
            public totalRoundNo: number;
            public ledgerBalance: number;
            public status: number;
            public playerName: string;
            public playerAvatarId: number;
            public playerAvatarUrl: string;
            public static encode(m: club.IClubPlayerInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.ClubPlayerInfo;
        }
    
        interface ITablePlayerInfo {
            playerId?: (number|null);
            amount?: (number|null);
            varyAmount?: (number|null);
            name?: (string|null);
            point?: (number|null);
            rank?: (number|null);
            avatarId?: (number|null);
            avatarUrl?: (string|null);
            seatNum?: (number|null);
        }
    
        class TablePlayerInfo implements ITablePlayerInfo {
            constructor(p?: club.ITablePlayerInfo);
            public playerId: number;
            public amount: number;
            public varyAmount: number;
            public name: string;
            public point: number;
            public rank: number;
            public avatarId: number;
            public avatarUrl: string;
            public seatNum: number;
            public static encode(m: club.ITablePlayerInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.TablePlayerInfo;
        }
    
        interface ITableInfo {
            tableId?: (string|null);
            clubId?: (number|null);
            ownerId?: (number|null);
            mode?: (number|null);
            roundNo?: (number|null);
            thinkTime?: (number|null);
            level?: (number|null);
            bringInAmount?: (number|null);
            fee?: (number|null);
            startPoint?: (number|null);
            redCard?: (number|null);
            exPoint1?: (number|null);
            exPoint2?: (number|null);
            exPoint3?: (number|null);
            exPoint4?: (number|null);
            headJumpFlag?: (number|null);
            doubleFlag?: (number|null);
            hintFlag?: (number|null);
            convenientFlag?: (number|null);
            noWinnerFlag?: (number|null);
            autoStartFlag?: (number|null);
            players?: (club.ITablePlayerInfo[]|null);
            startAt?: (number|Long|null);
            finishAt?: (number|Long|null);
            status?: (number|null);
            roomId?: (number|null);
            clubName?: (string|null);
            gameId?: (number|null);
            isSaved?: (number|null);
            paipuLink?: (string|null);
            anoPaipuLink?: (string|null);
            paipuName?: (string|null);
            isDiamondClub?: (number|null);
            isGpsIPCheck?: (boolean|null);
            createSrc?: (number|null);
        }
    
        class TableInfo implements ITableInfo {
            constructor(p?: club.ITableInfo);
            public tableId: string;
            public clubId: number;
            public ownerId: number;
            public mode: number;
            public roundNo: number;
            public thinkTime: number;
            public level: number;
            public bringInAmount: number;
            public fee: number;
            public startPoint: number;
            public redCard: number;
            public exPoint1: number;
            public exPoint2: number;
            public exPoint3: number;
            public exPoint4: number;
            public headJumpFlag: number;
            public doubleFlag: number;
            public hintFlag: number;
            public convenientFlag: number;
            public noWinnerFlag: number;
            public autoStartFlag: number;
            public players: club.ITablePlayerInfo[];
            public startAt: (number|Long);
            public finishAt: (number|Long);
            public status: number;
            public roomId: number;
            public clubName: string;
            public gameId: number;
            public isSaved: number;
            public paipuLink: string;
            public anoPaipuLink: string;
            public paipuName: string;
            public isDiamondClub: number;
            public isGpsIPCheck: boolean;
            public createSrc: number;
            public static encode(m: club.ITableInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.TableInfo;
        }
    
        interface IOrderInfo {
            orderId?: (number|null);
            clubId?: (number|null);
            playerId?: (number|null);
            name?: (string|null);
            payType?: (string|null);
            coins?: (number|null);
            status?: (number|null);
            orderTime?: (number|Long|null);
        }
    
        class OrderInfo implements IOrderInfo {
            constructor(p?: club.IOrderInfo);
            public orderId: number;
            public clubId: number;
            public playerId: number;
            public name: string;
            public payType: string;
            public coins: number;
            public status: number;
            public orderTime: (number|Long);
            public static encode(m: club.IOrderInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.OrderInfo;
        }
    
        interface IMoneyInfo {
            orderId?: (number|null);
            clubId?: (number|null);
            payType?: (number|null);
            coins?: (number|null);
            amount?: (number|null);
            orderTime?: (number|Long|null);
            status?: (number|null);
        }
    
        class MoneyInfo implements IMoneyInfo {
            constructor(p?: club.IMoneyInfo);
            public orderId: number;
            public clubId: number;
            public payType: number;
            public coins: number;
            public amount: number;
            public orderTime: (number|Long);
            public status: number;
            public static encode(m: club.IMoneyInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.MoneyInfo;
        }
    
        interface IApplicationInfo {
            playerId?: (number|null);
            name?: (string|null);
            avatarId?: (number|null);
            avatarUrl?: (string|null);
            comment?: (string|null);
            applyTime?: (number|Long|null);
        }
    
        class ApplicationInfo implements IApplicationInfo {
            constructor(p?: club.IApplicationInfo);
            public playerId: number;
            public name: string;
            public avatarId: number;
            public avatarUrl: string;
            public comment: string;
            public applyTime: (number|Long);
            public static encode(m: club.IApplicationInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.ApplicationInfo;
        }
    
        interface IItemInfo {
            itemId?: (number|null);
            avatarId?: (number|null);
            name?: (string|null);
            coins?: (number|null);
            amount?: (number|null);
        }
    
        class ItemInfo implements IItemInfo {
            constructor(p?: club.IItemInfo);
            public itemId: number;
            public avatarId: number;
            public name: string;
            public coins: number;
            public amount: number;
            public static encode(m: club.IItemInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.ItemInfo;
        }
    
        interface ICreateClubReq {
            name?: (string|null);
            avatarId?: (number|null);
            avatarUrl?: (string|null);
            creatorId?: (number|null);
            clubType?: (number|null);
            maxPlayerNo?: (number|null);
            clubStatus?: (number|null);
        }
    
        class CreateClubReq implements ICreateClubReq {
            constructor(p?: club.ICreateClubReq);
            public name: string;
            public avatarId: number;
            public avatarUrl: string;
            public creatorId: number;
            public clubType: number;
            public maxPlayerNo: number;
            public clubStatus: number;
            public static encode(m: club.ICreateClubReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.CreateClubReq;
        }
    
        interface ICreateClubResp {
            res?: (string|null);
            msg?: (string|null);
            clubId?: (number|null);
        }
    
        class CreateClubResp implements ICreateClubResp {
            constructor(p?: club.ICreateClubResp);
            public res: string;
            public msg: string;
            public clubId: number;
            public static encode(m: club.ICreateClubResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.CreateClubResp;
        }
    
        interface IModifyClubReq {
            clubId?: (number|null);
            name?: (string|null);
            avatarId?: (number|null);
            avatarUrl?: (string|null);
            clubType?: (number|null);
            clubStatus?: (number|null);
            maxPlayerNo?: (number|null);
        }
    
        class ModifyClubReq implements IModifyClubReq {
            constructor(p?: club.IModifyClubReq);
            public clubId: number;
            public name: string;
            public avatarId: number;
            public avatarUrl: string;
            public clubType: number;
            public clubStatus: number;
            public maxPlayerNo: number;
            public static encode(m: club.IModifyClubReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.ModifyClubReq;
        }
    
        interface IModifyClubResp {
            res?: (string|null);
            msg?: (string|null);
        }
    
        class ModifyClubResp implements IModifyClubResp {
            constructor(p?: club.IModifyClubResp);
            public res: string;
            public msg: string;
            public static encode(m: club.IModifyClubResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.ModifyClubResp;
        }
    
        interface IModifyClubTypeReq {
            clubId?: (number|null);
            clubType?: (number|null);
        }
    
        class ModifyClubTypeReq implements IModifyClubTypeReq {
            constructor(p?: club.IModifyClubTypeReq);
            public clubId: number;
            public clubType: number;
            public static encode(m: club.IModifyClubTypeReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.ModifyClubTypeReq;
        }
    
        interface IModifyClubTypeResp {
            res?: (string|null);
            msg?: (string|null);
        }
    
        class ModifyClubTypeResp implements IModifyClubTypeResp {
            constructor(p?: club.IModifyClubTypeResp);
            public res: string;
            public msg: string;
            public static encode(m: club.IModifyClubTypeResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.ModifyClubTypeResp;
        }
    
        interface IGetClubInfoReq {
            clubId?: (number|null);
        }
    
        class GetClubInfoReq implements IGetClubInfoReq {
            constructor(p?: club.IGetClubInfoReq);
            public clubId: number;
            public static encode(m: club.IGetClubInfoReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubInfoReq;
        }
    
        interface IGetClubInfoResp {
            res?: (string|null);
            msg?: (string|null);
            clubInfo?: (club.IClubInfo|null);
        }
    
        class GetClubInfoResp implements IGetClubInfoResp {
            constructor(p?: club.IGetClubInfoResp);
            public res: string;
            public msg: string;
            public clubInfo?: (club.IClubInfo|null);
            public static encode(m: club.IGetClubInfoResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubInfoResp;
        }
    
        interface IQuitClubReq {
            clubId?: (number|null);
            playerId?: (number|null);
        }
    
        class QuitClubReq implements IQuitClubReq {
            constructor(p?: club.IQuitClubReq);
            public clubId: number;
            public playerId: number;
            public static encode(m: club.IQuitClubReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.QuitClubReq;
        }
    
        interface IQuitClubResp {
            res?: (string|null);
            msg?: (string|null);
        }
    
        class QuitClubResp implements IQuitClubResp {
            constructor(p?: club.IQuitClubResp);
            public res: string;
            public msg: string;
            public static encode(m: club.IQuitClubResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.QuitClubResp;
        }
    
        interface IInvitePlayerReq {
            clubId?: (number|null);
            playerId?: (number|null);
            comment?: (string|null);
        }
    
        class InvitePlayerReq implements IInvitePlayerReq {
            constructor(p?: club.IInvitePlayerReq);
            public clubId: number;
            public playerId: number;
            public comment: string;
            public static encode(m: club.IInvitePlayerReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.InvitePlayerReq;
        }
    
        interface IInvitePlayerResp {
            res?: (string|null);
            msg?: (string|null);
        }
    
        class InvitePlayerResp implements IInvitePlayerResp {
            constructor(p?: club.IInvitePlayerResp);
            public res: string;
            public msg: string;
            public static encode(m: club.IInvitePlayerResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.InvitePlayerResp;
        }
    
        interface ICheckApplicationReq {
            playerId?: (number|null);
            clubId?: (number|null);
            ownerId?: (number|null);
        }
    
        class CheckApplicationReq implements ICheckApplicationReq {
            constructor(p?: club.ICheckApplicationReq);
            public playerId: number;
            public clubId: number;
            public ownerId: number;
            public static encode(m: club.ICheckApplicationReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.CheckApplicationReq;
        }
    
        interface ICheckApplicationResp {
            res?: (string|null);
            msg?: (string|null);
            code?: (number|null);
        }
    
        class CheckApplicationResp implements ICheckApplicationResp {
            constructor(p?: club.ICheckApplicationResp);
            public res: string;
            public msg: string;
            public code: number;
            public static encode(m: club.ICheckApplicationResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.CheckApplicationResp;
        }
    
        interface ISendClubJoinReq {
            playerId?: (number|null);
            clubId?: (number|null);
            ownerId?: (number|null);
            comment?: (string|null);
        }
    
        class SendClubJoinReq implements ISendClubJoinReq {
            constructor(p?: club.ISendClubJoinReq);
            public playerId: number;
            public clubId: number;
            public ownerId: number;
            public comment: string;
            public static encode(m: club.ISendClubJoinReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.SendClubJoinReq;
        }
    
        interface ISendClubJoinResp {
            res?: (string|null);
            msg?: (string|null);
        }
    
        class SendClubJoinResp implements ISendClubJoinResp {
            constructor(p?: club.ISendClubJoinResp);
            public res: string;
            public msg: string;
            public static encode(m: club.ISendClubJoinResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.SendClubJoinResp;
        }
    
        interface IGetClubListReq {
            playerId?: (number|null);
        }
    
        class GetClubListReq implements IGetClubListReq {
            constructor(p?: club.IGetClubListReq);
            public playerId: number;
            public static encode(m: club.IGetClubListReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubListReq;
        }
    
        interface IGetClubListResp {
            res?: (string|null);
            msg?: (string|null);
            clubList?: (club.IClubInfo[]|null);
        }
    
        class GetClubListResp implements IGetClubListResp {
            constructor(p?: club.IGetClubListResp);
            public res: string;
            public msg: string;
            public clubList: club.IClubInfo[];
            public static encode(m: club.IGetClubListResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubListResp;
        }
    
        interface ICreateTableReq {
            clubId?: (number|null);
            ownerId?: (number|null);
            mode?: (number|null);
            roundNo?: (number|null);
            thinkTime?: (number|null);
            level?: (number|null);
            bringInAmount?: (number|null);
            fee?: (number|null);
            redCard?: (number|null);
            exPoint1?: (number|null);
            exPoint2?: (number|null);
            exPoint3?: (number|null);
            exPoint4?: (number|null);
            headJumpFlag?: (number|null);
            doubleFlag?: (number|null);
            hintFlag?: (number|null);
            convenientFlag?: (number|null);
            noWinnerFlag?: (number|null);
            autoStartFlag?: (number|null);
            startPoint?: (number|null);
            isGpsIPCheck?: (boolean|null);
        }
    
        class CreateTableReq implements ICreateTableReq {
            constructor(p?: club.ICreateTableReq);
            public clubId: number;
            public ownerId: number;
            public mode: number;
            public roundNo: number;
            public thinkTime: number;
            public level: number;
            public bringInAmount: number;
            public fee: number;
            public redCard: number;
            public exPoint1: number;
            public exPoint2: number;
            public exPoint3: number;
            public exPoint4: number;
            public headJumpFlag: number;
            public doubleFlag: number;
            public hintFlag: number;
            public convenientFlag: number;
            public noWinnerFlag: number;
            public autoStartFlag: number;
            public startPoint: number;
            public isGpsIPCheck: boolean;
            public static encode(m: club.ICreateTableReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.CreateTableReq;
        }
    
        interface ICreateTableResp {
            res?: (string|null);
            msg?: (string|null);
            tableId?: (string|null);
            roomId?: (number|null);
        }
    
        class CreateTableResp implements ICreateTableResp {
            constructor(p?: club.ICreateTableResp);
            public res: string;
            public msg: string;
            public tableId: string;
            public roomId: number;
            public static encode(m: club.ICreateTableResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.CreateTableResp;
        }
    
        interface ICloseTableReq {
            clubId?: (number|null);
            ownerId?: (number|null);
            tableId?: (string|null);
        }
    
        class CloseTableReq implements ICloseTableReq {
            constructor(p?: club.ICloseTableReq);
            public clubId: number;
            public ownerId: number;
            public tableId: string;
            public static encode(m: club.ICloseTableReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.CloseTableReq;
        }
    
        interface ICloseTableResp {
            res?: (string|null);
            msg?: (string|null);
        }
    
        class CloseTableResp implements ICloseTableResp {
            constructor(p?: club.ICloseTableResp);
            public res: string;
            public msg: string;
            public static encode(m: club.ICloseTableResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.CloseTableResp;
        }
    
        interface IModifyTableReq {
            tableId?: (string|null);
            status?: (number|null);
        }
    
        class ModifyTableReq implements IModifyTableReq {
            constructor(p?: club.IModifyTableReq);
            public tableId: string;
            public status: number;
            public static encode(m: club.IModifyTableReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.ModifyTableReq;
        }
    
        interface IModifyTableResp {
            res?: (string|null);
            msg?: (string|null);
        }
    
        class ModifyTableResp implements IModifyTableResp {
            constructor(p?: club.IModifyTableResp);
            public res: string;
            public msg: string;
            public static encode(m: club.IModifyTableResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.ModifyTableResp;
        }
    
        interface IGetTableInfoReq {
            tableId?: (string|null);
        }
    
        class GetTableInfoReq implements IGetTableInfoReq {
            constructor(p?: club.IGetTableInfoReq);
            public tableId: string;
            public static encode(m: club.IGetTableInfoReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetTableInfoReq;
        }
    
        interface IGetTableInfoResp {
            res?: (string|null);
            msg?: (string|null);
            tableInfo?: (club.ITableInfo|null);
        }
    
        class GetTableInfoResp implements IGetTableInfoResp {
            constructor(p?: club.IGetTableInfoResp);
            public res: string;
            public msg: string;
            public tableInfo?: (club.ITableInfo|null);
            public static encode(m: club.IGetTableInfoResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetTableInfoResp;
        }
    
        interface IGetClubPlayerListReq {
            clubId?: (number|null);
        }
    
        class GetClubPlayerListReq implements IGetClubPlayerListReq {
            constructor(p?: club.IGetClubPlayerListReq);
            public clubId: number;
            public static encode(m: club.IGetClubPlayerListReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubPlayerListReq;
        }
    
        interface IGetClubPlayerListResp {
            res?: (string|null);
            msg?: (string|null);
            ownerId?: (number|null);
            playerList?: (club.IPlayerInfo[]|null);
        }
    
        class GetClubPlayerListResp implements IGetClubPlayerListResp {
            constructor(p?: club.IGetClubPlayerListResp);
            public res: string;
            public msg: string;
            public ownerId: number;
            public playerList: club.IPlayerInfo[];
            public static encode(m: club.IGetClubPlayerListResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubPlayerListResp;
        }
    
        interface IGetClubPlayerDetailReq {
            playerId?: (number|null);
            clubId?: (number|null);
            startTime?: (number|Long|null);
            endTime?: (number|Long|null);
        }
    
        class GetClubPlayerDetailReq implements IGetClubPlayerDetailReq {
            constructor(p?: club.IGetClubPlayerDetailReq);
            public playerId: number;
            public clubId: number;
            public startTime: (number|Long);
            public endTime: (number|Long);
            public static encode(m: club.IGetClubPlayerDetailReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubPlayerDetailReq;
        }
    
        interface IGetClubPlayerDetailResp {
            res?: (string|null);
            msg?: (string|null);
            clubPlayerInfo?: (club.IClubPlayerInfo|null);
        }
    
        class GetClubPlayerDetailResp implements IGetClubPlayerDetailResp {
            constructor(p?: club.IGetClubPlayerDetailResp);
            public res: string;
            public msg: string;
            public clubPlayerInfo?: (club.IClubPlayerInfo|null);
            public static encode(m: club.IGetClubPlayerDetailResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubPlayerDetailResp;
        }
    
        interface ISetClubPlayerDetailReq {
            playerId?: (number|null);
            clubId?: (number|null);
            varyBalance?: (number|null);
            timeStamp?: (number|Long|null);
            sign?: (string|null);
            source?: (number|null);
            payType?: (number|null);
        }
    
        class SetClubPlayerDetailReq implements ISetClubPlayerDetailReq {
            constructor(p?: club.ISetClubPlayerDetailReq);
            public playerId: number;
            public clubId: number;
            public varyBalance: number;
            public timeStamp: (number|Long);
            public sign: string;
            public source: number;
            public payType: number;
            public static encode(m: club.ISetClubPlayerDetailReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.SetClubPlayerDetailReq;
        }
    
        interface ISetClubPlayerDetailResp {
            res?: (string|null);
            msg?: (string|null);
            balance?: (number|null);
        }
    
        class SetClubPlayerDetailResp implements ISetClubPlayerDetailResp {
            constructor(p?: club.ISetClubPlayerDetailResp);
            public res: string;
            public msg: string;
            public balance: number;
            public static encode(m: club.ISetClubPlayerDetailResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.SetClubPlayerDetailResp;
        }
    
        interface ISetClubPlayerDCReq {
            playerId?: (number|null);
            clubId?: (number|null);
            varyBalance?: (number|null);
        }
    
        class SetClubPlayerDCReq implements ISetClubPlayerDCReq {
            constructor(p?: club.ISetClubPlayerDCReq);
            public playerId: number;
            public clubId: number;
            public varyBalance: number;
            public static encode(m: club.ISetClubPlayerDCReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.SetClubPlayerDCReq;
        }
    
        interface ISetClubPlayerDCResp {
            status?: (number|null);
        }
    
        class SetClubPlayerDCResp implements ISetClubPlayerDCResp {
            constructor(p?: club.ISetClubPlayerDCResp);
            public status: number;
            public static encode(m: club.ISetClubPlayerDCResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.SetClubPlayerDCResp;
        }
    
        interface IGetClubPlayerDCReq {
            playerId?: (number|null);
            clubId?: (number|null);
        }
    
        class GetClubPlayerDCReq implements IGetClubPlayerDCReq {
            constructor(p?: club.IGetClubPlayerDCReq);
            public playerId: number;
            public clubId: number;
            public static encode(m: club.IGetClubPlayerDCReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubPlayerDCReq;
        }
    
        interface IGetClubPlayerDCResp {
            clubType?: (number|null);
            clubPlayerInfo?: (club.IClubPlayerInfo|null);
        }
    
        class GetClubPlayerDCResp implements IGetClubPlayerDCResp {
            constructor(p?: club.IGetClubPlayerDCResp);
            public clubType: number;
            public clubPlayerInfo?: (club.IClubPlayerInfo|null);
            public static encode(m: club.IGetClubPlayerDCResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubPlayerDCResp;
        }
    
        interface IGetGameStartReq {
            clubId?: (number|null);
            tableId?: (string|null);
            gameId?: (number|Long|null);
            startAt?: (number|Long|null);
            status?: (number|null);
        }
    
        class GetGameStartReq implements IGetGameStartReq {
            constructor(p?: club.IGetGameStartReq);
            public clubId: number;
            public tableId: string;
            public gameId: (number|Long);
            public startAt: (number|Long);
            public status: number;
            public static encode(m: club.IGetGameStartReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetGameStartReq;
        }
    
        interface IGetGameStartResp {
            status?: (number|null);
        }
    
        class GetGameStartResp implements IGetGameStartResp {
            constructor(p?: club.IGetGameStartResp);
            public status: number;
            public static encode(m: club.IGetGameStartResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetGameStartResp;
        }
    
        interface IKickoutClubPlayerReq {
            clubId?: (number|null);
            playerId?: (number|null);
        }
    
        class KickoutClubPlayerReq implements IKickoutClubPlayerReq {
            constructor(p?: club.IKickoutClubPlayerReq);
            public clubId: number;
            public playerId: number;
            public static encode(m: club.IKickoutClubPlayerReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.KickoutClubPlayerReq;
        }
    
        interface IKickoutClubPlayerResp {
            res?: (string|null);
            msg?: (string|null);
        }
    
        class KickoutClubPlayerResp implements IKickoutClubPlayerResp {
            constructor(p?: club.IKickoutClubPlayerResp);
            public res: string;
            public msg: string;
            public static encode(m: club.IKickoutClubPlayerResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.KickoutClubPlayerResp;
        }
    
        interface IGetClubAppliCationListReq {
            clubId?: (number|null);
            ownerId?: (number|null);
        }
    
        class GetClubAppliCationListReq implements IGetClubAppliCationListReq {
            constructor(p?: club.IGetClubAppliCationListReq);
            public clubId: number;
            public ownerId: number;
            public static encode(m: club.IGetClubAppliCationListReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubAppliCationListReq;
        }
    
        interface IGetClubAppliCationListResp {
            res?: (string|null);
            msg?: (string|null);
            applicationList?: (club.IApplicationInfo[]|null);
        }
    
        class GetClubAppliCationListResp implements IGetClubAppliCationListResp {
            constructor(p?: club.IGetClubAppliCationListResp);
            public res: string;
            public msg: string;
            public applicationList: club.IApplicationInfo[];
            public static encode(m: club.IGetClubAppliCationListResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubAppliCationListResp;
        }
    
        interface IGetClubOrderListReq {
            clubId?: (number|null);
            startTime?: (number|Long|null);
            endTime?: (number|Long|null);
        }
    
        class GetClubOrderListReq implements IGetClubOrderListReq {
            constructor(p?: club.IGetClubOrderListReq);
            public clubId: number;
            public startTime: (number|Long);
            public endTime: (number|Long);
            public static encode(m: club.IGetClubOrderListReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubOrderListReq;
        }
    
        interface IGetClubOrderListResp {
            res?: (string|null);
            msg?: (string|null);
            orderList?: (club.IOrderInfo[]|null);
        }
    
        class GetClubOrderListResp implements IGetClubOrderListResp {
            constructor(p?: club.IGetClubOrderListResp);
            public res: string;
            public msg: string;
            public orderList: club.IOrderInfo[];
            public static encode(m: club.IGetClubOrderListResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubOrderListResp;
        }
    
        interface IGetClubTableListReq {
            clubId?: (number|null);
            status?: (number|null);
        }
    
        class GetClubTableListReq implements IGetClubTableListReq {
            constructor(p?: club.IGetClubTableListReq);
            public clubId: number;
            public status: number;
            public static encode(m: club.IGetClubTableListReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubTableListReq;
        }
    
        interface IGetClubTableListResp {
            res?: (string|null);
            msg?: (string|null);
            tableList?: (club.ITableInfo[]|null);
        }
    
        class GetClubTableListResp implements IGetClubTableListResp {
            constructor(p?: club.IGetClubTableListResp);
            public res: string;
            public msg: string;
            public tableList: club.ITableInfo[];
            public static encode(m: club.IGetClubTableListResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubTableListResp;
        }
    
        interface IGetFriendTableListReq {
            playerId?: (number|null);
            status?: (number|null);
        }
    
        class GetFriendTableListReq implements IGetFriendTableListReq {
            constructor(p?: club.IGetFriendTableListReq);
            public playerId: number;
            public status: number;
            public static encode(m: club.IGetFriendTableListReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetFriendTableListReq;
        }
    
        interface IGetFriendTableListResp {
            res?: (string|null);
            msg?: (string|null);
            tableList?: (club.ITableInfo[]|null);
        }
    
        class GetFriendTableListResp implements IGetFriendTableListResp {
            constructor(p?: club.IGetFriendTableListResp);
            public res: string;
            public msg: string;
            public tableList: club.ITableInfo[];
            public static encode(m: club.IGetFriendTableListResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetFriendTableListResp;
        }
    
        interface IGetFriendTableReq {
            roomId?: (number|null);
        }
    
        class GetFriendTableReq implements IGetFriendTableReq {
            constructor(p?: club.IGetFriendTableReq);
            public roomId: number;
            public static encode(m: club.IGetFriendTableReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetFriendTableReq;
        }
    
        interface IGetFriendTableResp {
            res?: (string|null);
            msg?: (string|null);
            tableInfo?: (club.ITableInfo|null);
        }
    
        class GetFriendTableResp implements IGetFriendTableResp {
            constructor(p?: club.IGetFriendTableResp);
            public res: string;
            public msg: string;
            public tableInfo?: (club.ITableInfo|null);
            public static encode(m: club.IGetFriendTableResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetFriendTableResp;
        }
    
        interface IGetPlayerInfoReq {
            playerId?: (number|null);
            mode?: (number|null);
        }
    
        class GetPlayerInfoReq implements IGetPlayerInfoReq {
            constructor(p?: club.IGetPlayerInfoReq);
            public playerId: number;
            public mode: number;
            public static encode(m: club.IGetPlayerInfoReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetPlayerInfoReq;
        }
    
        interface IGetPlayerInfoResp {
            res?: (string|null);
            msg?: (string|null);
            playerInfo?: (club.IPlayerInfo|null);
        }
    
        class GetPlayerInfoResp implements IGetPlayerInfoResp {
            constructor(p?: club.IGetPlayerInfoResp);
            public res: string;
            public msg: string;
            public playerInfo?: (club.IPlayerInfo|null);
            public static encode(m: club.IGetPlayerInfoResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetPlayerInfoResp;
        }
    
        interface IGetClubPlayerGameHistoryReq {
            playerId?: (number|null);
            clubId?: (number|null);
            startTime?: (number|Long|null);
            endTime?: (number|Long|null);
        }
    
        class GetClubPlayerGameHistoryReq implements IGetClubPlayerGameHistoryReq {
            constructor(p?: club.IGetClubPlayerGameHistoryReq);
            public playerId: number;
            public clubId: number;
            public startTime: (number|Long);
            public endTime: (number|Long);
            public static encode(m: club.IGetClubPlayerGameHistoryReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubPlayerGameHistoryReq;
        }
    
        interface IGetClubPlayerGameHistoryResp {
            res?: (string|null);
            msg?: (string|null);
            totalRoundNo?: (number|null);
            fee?: (number|null);
            balance?: (number|null);
            tableList?: (club.ITableInfo[]|null);
        }
    
        class GetClubPlayerGameHistoryResp implements IGetClubPlayerGameHistoryResp {
            constructor(p?: club.IGetClubPlayerGameHistoryResp);
            public res: string;
            public msg: string;
            public totalRoundNo: number;
            public fee: number;
            public balance: number;
            public tableList: club.ITableInfo[];
            public static encode(m: club.IGetClubPlayerGameHistoryResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubPlayerGameHistoryResp;
        }
    
        interface IGetPlayerGameHistoryReq {
            playerId?: (number|null);
            mode?: (number|null);
        }
    
        class GetPlayerGameHistoryReq implements IGetPlayerGameHistoryReq {
            constructor(p?: club.IGetPlayerGameHistoryReq);
            public playerId: number;
            public mode: number;
            public static encode(m: club.IGetPlayerGameHistoryReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetPlayerGameHistoryReq;
        }
    
        interface IGetPlayerGameHistoryResp {
            res?: (string|null);
            msg?: (string|null);
            tableList?: (club.ITableInfo[]|null);
        }
    
        class GetPlayerGameHistoryResp implements IGetPlayerGameHistoryResp {
            constructor(p?: club.IGetPlayerGameHistoryResp);
            public res: string;
            public msg: string;
            public tableList: club.ITableInfo[];
            public static encode(m: club.IGetPlayerGameHistoryResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetPlayerGameHistoryResp;
        }
    
        interface IGetClubItemListReq {
            clubId?: (number|null);
        }
    
        class GetClubItemListReq implements IGetClubItemListReq {
            constructor(p?: club.IGetClubItemListReq);
            public clubId: number;
            public static encode(m: club.IGetClubItemListReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubItemListReq;
        }
    
        interface IGetClubItemListResp {
            res?: (string|null);
            msg?: (string|null);
            itemList?: (club.IItemInfo[]|null);
        }
    
        class GetClubItemListResp implements IGetClubItemListResp {
            constructor(p?: club.IGetClubItemListResp);
            public res: string;
            public msg: string;
            public itemList: club.IItemInfo[];
            public static encode(m: club.IGetClubItemListResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubItemListResp;
        }
    
        interface IGetClubMoneyOrderListReq {
            clubId?: (number|null);
            startTime?: (number|Long|null);
            endTime?: (number|Long|null);
        }
    
        class GetClubMoneyOrderListReq implements IGetClubMoneyOrderListReq {
            constructor(p?: club.IGetClubMoneyOrderListReq);
            public clubId: number;
            public startTime: (number|Long);
            public endTime: (number|Long);
            public static encode(m: club.IGetClubMoneyOrderListReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubMoneyOrderListReq;
        }
    
        interface IGetClubMoneyOrderListResp {
            res?: (string|null);
            msg?: (string|null);
            MoneyList?: (club.IMoneyInfo[]|null);
        }
    
        class GetClubMoneyOrderListResp implements IGetClubMoneyOrderListResp {
            constructor(p?: club.IGetClubMoneyOrderListResp);
            public res: string;
            public msg: string;
            public MoneyList: club.IMoneyInfo[];
            public static encode(m: club.IGetClubMoneyOrderListResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetClubMoneyOrderListResp;
        }
    
        interface IDecideClubJoinReq {
            clubId?: (number|null);
            playerId?: (number|null);
            decision?: (boolean|null);
            ownerId?: (number|null);
            applicationId?: (string|null);
            Comment?: (string|null);
        }
    
        class DecideClubJoinReq implements IDecideClubJoinReq {
            constructor(p?: club.IDecideClubJoinReq);
            public clubId: number;
            public playerId: number;
            public decision: boolean;
            public ownerId: number;
            public applicationId: string;
            public Comment: string;
            public static encode(m: club.IDecideClubJoinReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.DecideClubJoinReq;
        }
    
        interface IDecideClubJoinResp {
            res?: (string|null);
            msg?: (string|null);
        }
    
        class DecideClubJoinResp implements IDecideClubJoinResp {
            constructor(p?: club.IDecideClubJoinResp);
            public res: string;
            public msg: string;
            public static encode(m: club.IDecideClubJoinResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.DecideClubJoinResp;
        }
    
        interface IJoinTableReq {
            tableId?: (string|null);
            playerId?: (number|null);
            seatNum?: (number|null);
        }
    
        class JoinTableReq implements IJoinTableReq {
            constructor(p?: club.IJoinTableReq);
            public tableId: string;
            public playerId: number;
            public seatNum: number;
            public static encode(m: club.IJoinTableReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.JoinTableReq;
        }
    
        interface IJoinTableResp {
            res?: (string|null);
            msg?: (string|null);
        }
    
        class JoinTableResp implements IJoinTableResp {
            constructor(p?: club.IJoinTableResp);
            public res: string;
            public msg: string;
            public static encode(m: club.IJoinTableResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.JoinTableResp;
        }
    
        interface IQuitTableReq {
            tableId?: (string|null);
            playerId?: (number|null);
        }
    
        class QuitTableReq implements IQuitTableReq {
            constructor(p?: club.IQuitTableReq);
            public tableId: string;
            public playerId: number;
            public static encode(m: club.IQuitTableReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.QuitTableReq;
        }
    
        interface IQuitTableResp {
            res?: (string|null);
            msg?: (string|null);
        }
    
        class QuitTableResp implements IQuitTableResp {
            constructor(p?: club.IQuitTableResp);
            public res: string;
            public msg: string;
            public static encode(m: club.IQuitTableResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.QuitTableResp;
        }
    
        interface IQueryTableReq {
            tableId?: (string|null);
        }
    
        class QueryTableReq implements IQueryTableReq {
            constructor(p?: club.IQueryTableReq);
            public tableId: string;
            public static encode(m: club.IQueryTableReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.QueryTableReq;
        }
    
        interface IQueryTableResp {
            res?: (string|null);
            msg?: (string|null);
            players?: (club.IPlayerInfo[]|null);
        }
    
        class QueryTableResp implements IQueryTableResp {
            constructor(p?: club.IQueryTableResp);
            public res: string;
            public msg: string;
            public players: club.IPlayerInfo[];
            public static encode(m: club.IQueryTableResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.QueryTableResp;
        }
    
        interface ISetPredefinedCardReq {
            tableId?: (string|null);
            card?: (string|null);
        }
    
        class SetPredefinedCardReq implements ISetPredefinedCardReq {
            constructor(p?: club.ISetPredefinedCardReq);
            public tableId: string;
            public card: string;
            public static encode(m: club.ISetPredefinedCardReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.SetPredefinedCardReq;
        }
    
        interface ISetPredefinedCardResp {
            res?: (string|null);
            msg?: (string|null);
        }
    
        class SetPredefinedCardResp implements ISetPredefinedCardResp {
            constructor(p?: club.ISetPredefinedCardResp);
            public res: string;
            public msg: string;
            public static encode(m: club.ISetPredefinedCardResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.SetPredefinedCardResp;
        }
    
        interface IUpdateTableReq {
        }
    
        class UpdateTableReq implements IUpdateTableReq {
            constructor(p?: club.IUpdateTableReq);
            public static encode(m: club.IUpdateTableReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.UpdateTableReq;
        }
    
        interface IUpdateTableResp {
        }
    
        class UpdateTableResp implements IUpdateTableResp {
            constructor(p?: club.IUpdateTableResp);
            public static encode(m: club.IUpdateTableResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.UpdateTableResp;
        }
    
        interface ISaveGameHistoryReq {
            playerId?: (number|null);
            tableId?: (string|null);
            gameId?: (number|Long|null);
            save?: (number|null);
            name?: (string|null);
        }
    
        class SaveGameHistoryReq implements ISaveGameHistoryReq {
            constructor(p?: club.ISaveGameHistoryReq);
            public playerId: number;
            public tableId: string;
            public gameId: (number|Long);
            public save: number;
            public name: string;
            public static encode(m: club.ISaveGameHistoryReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.SaveGameHistoryReq;
        }
    
        interface ISaveGameHistoryResp {
            res?: (string|null);
            msg?: (string|null);
        }
    
        class SaveGameHistoryResp implements ISaveGameHistoryResp {
            constructor(p?: club.ISaveGameHistoryResp);
            public res: string;
            public msg: string;
            public static encode(m: club.ISaveGameHistoryResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.SaveGameHistoryResp;
        }
    
        interface IGetGameHistoryDetailReq {
            tableId?: (string|null);
            gameId?: (number|Long|null);
            playerId?: (number|null);
            paipuLink?: (string|null);
            mode?: (number|null);
        }
    
        class GetGameHistoryDetailReq implements IGetGameHistoryDetailReq {
            constructor(p?: club.IGetGameHistoryDetailReq);
            public tableId: string;
            public gameId: (number|Long);
            public playerId: number;
            public paipuLink: string;
            public mode: number;
            public static encode(m: club.IGetGameHistoryDetailReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetGameHistoryDetailReq;
        }
    
        interface IPaipuData {
            holdemcode?: (number|Long|null);
            jsondata?: (string|null);
            logtime?: (number|Long|null);
        }
    
        class PaipuData implements IPaipuData {
            constructor(p?: club.IPaipuData);
            public holdemcode: (number|Long);
            public jsondata: string;
            public logtime: (number|Long);
            public static encode(m: club.IPaipuData, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.PaipuData;
        }
    
        interface IGetGameHistoryDetailResp {
            res?: (string|null);
            msg?: (string|null);
            tableId?: (string|null);
            gameId?: (number|Long|null);
            data?: (club.IPaipuData[]|null);
        }
    
        class GetGameHistoryDetailResp implements IGetGameHistoryDetailResp {
            constructor(p?: club.IGetGameHistoryDetailResp);
            public res: string;
            public msg: string;
            public tableId: string;
            public gameId: (number|Long);
            public data: club.IPaipuData[];
            public static encode(m: club.IGetGameHistoryDetailResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetGameHistoryDetailResp;
        }
    
        interface IPushPlayerInfo {
            PlayerId?: (number|null);
            PlayerName?: (string|null);
            AvatarId?: (number|null);
            AvatarUrl?: (string|null);
            SeatNum?: (number|null);
        }
    
        class PushPlayerInfo implements IPushPlayerInfo {
            constructor(p?: club.IPushPlayerInfo);
            public PlayerId: number;
            public PlayerName: string;
            public AvatarId: number;
            public AvatarUrl: string;
            public SeatNum: number;
            public static encode(m: club.IPushPlayerInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.PushPlayerInfo;
        }
    
        interface IPushMsg {
            Code?: (number|null);
            ClubId?: (number|null);
            ClubName?: (string|null);
            TableId?: (string|null);
            Players?: (club.IPushPlayerInfo[]|null);
        }
    
        class PushMsg implements IPushMsg {
            constructor(p?: club.IPushMsg);
            public Code: number;
            public ClubId: number;
            public ClubName: string;
            public TableId: string;
            public Players: club.IPushPlayerInfo[];
            public static encode(m: club.IPushMsg, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.PushMsg;
        }
    
        interface IGetPlayingTalbeIdReq {
            clubId?: (number|null);
            playerId?: (number|null);
        }
    
        class GetPlayingTalbeIdReq implements IGetPlayingTalbeIdReq {
            constructor(p?: club.IGetPlayingTalbeIdReq);
            public clubId: number;
            public playerId: number;
            public static encode(m: club.IGetPlayingTalbeIdReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetPlayingTalbeIdReq;
        }
    
        interface IGetPlayingTalbeIdResp {
            res?: (string|null);
            msg?: (string|null);
            tableList?: (club.ITableInfo[]|null);
        }
    
        class GetPlayingTalbeIdResp implements IGetPlayingTalbeIdResp {
            constructor(p?: club.IGetPlayingTalbeIdResp);
            public res: string;
            public msg: string;
            public tableList: club.ITableInfo[];
            public static encode(m: club.IGetPlayingTalbeIdResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetPlayingTalbeIdResp;
        }
    
        interface IGetWBBindInfoReq {
            playerId?: (number|null);
        }
    
        class GetWBBindInfoReq implements IGetWBBindInfoReq {
            constructor(p?: club.IGetWBBindInfoReq);
            public playerId: number;
            public static encode(m: club.IGetWBBindInfoReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetWBBindInfoReq;
        }
    
        interface IGetWBBindInfoResp {
            res?: (string|null);
            msg?: (string|null);
            isWBBind?: (boolean|null);
            WBbalance?: (number|null);
            icon?: (string|null);
            mobile?: (string|null);
            nick?: (string|null);
        }
    
        class GetWBBindInfoResp implements IGetWBBindInfoResp {
            constructor(p?: club.IGetWBBindInfoResp);
            public res: string;
            public msg: string;
            public isWBBind: boolean;
            public WBbalance: number;
            public icon: string;
            public mobile: string;
            public nick: string;
            public static encode(m: club.IGetWBBindInfoResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetWBBindInfoResp;
        }
    
        interface IGetWBRandCodeReq {
            playerId?: (number|null);
        }
    
        class GetWBRandCodeReq implements IGetWBRandCodeReq {
            constructor(p?: club.IGetWBRandCodeReq);
            public playerId: number;
            public static encode(m: club.IGetWBRandCodeReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetWBRandCodeReq;
        }
    
        interface IGetWBRandCodeResp {
            res?: (string|null);
            msg?: (string|null);
            code?: (string|null);
            extraParam?: (string|null);
        }
    
        class GetWBRandCodeResp implements IGetWBRandCodeResp {
            constructor(p?: club.IGetWBRandCodeResp);
            public res: string;
            public msg: string;
            public code: string;
            public extraParam: string;
            public static encode(m: club.IGetWBRandCodeResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetWBRandCodeResp;
        }
    
        interface IGetWBLoginTokenReq {
            playerId?: (number|null);
        }
    
        class GetWBLoginTokenReq implements IGetWBLoginTokenReq {
            constructor(p?: club.IGetWBLoginTokenReq);
            public playerId: number;
            public static encode(m: club.IGetWBLoginTokenReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetWBLoginTokenReq;
        }
    
        interface IGetWBLoginTokenResp {
            res?: (string|null);
            msg?: (string|null);
            token?: (string|null);
            time?: (number|Long|null);
        }
    
        class GetWBLoginTokenResp implements IGetWBLoginTokenResp {
            constructor(p?: club.IGetWBLoginTokenResp);
            public res: string;
            public msg: string;
            public token: string;
            public time: (number|Long);
            public static encode(m: club.IGetWBLoginTokenResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.GetWBLoginTokenResp;
        }
    
        interface ICancelWBBindReq {
            playerId?: (number|null);
        }
    
        class CancelWBBindReq implements ICancelWBBindReq {
            constructor(p?: club.ICancelWBBindReq);
            public playerId: number;
            public static encode(m: club.ICancelWBBindReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.CancelWBBindReq;
        }
    
        interface ICancelWBBindResp {
            res?: (string|null);
            msg?: (string|null);
        }
    
        class CancelWBBindResp implements ICancelWBBindResp {
            constructor(p?: club.ICancelWBBindResp);
            public res: string;
            public msg: string;
            public static encode(m: club.ICancelWBBindResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.CancelWBBindResp;
        }
    
        interface IMatchingJoinReq {
            playerId?: (number|null);
            clubId?: (number|null);
            roundNo?: (number|null);
            level?: (number|null);
            clubType?: (number|null);
        }
    
        class MatchingJoinReq implements IMatchingJoinReq {
            constructor(p?: club.IMatchingJoinReq);
            public playerId: number;
            public clubId: number;
            public roundNo: number;
            public level: number;
            public clubType: number;
            public static encode(m: club.IMatchingJoinReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.MatchingJoinReq;
        }
    
        interface IMatchingQuitReq {
            playerId?: (number|null);
        }
    
        class MatchingQuitReq implements IMatchingQuitReq {
            constructor(p?: club.IMatchingQuitReq);
            public playerId: number;
            public static encode(m: club.IMatchingQuitReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.MatchingQuitReq;
        }
    
        interface IMatchingQueryReq {
            playerId?: (number|null);
            clubId?: (number|null);
            roundNo?: (number|null);
            level?: (number|null);
        }
    
        class MatchingQueryReq implements IMatchingQueryReq {
            constructor(p?: club.IMatchingQueryReq);
            public playerId: number;
            public clubId: number;
            public roundNo: number;
            public level: number;
            public static encode(m: club.IMatchingQueryReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.MatchingQueryReq;
        }
    
        interface IMatchingResp {
            res?: (string|null);
            msg?: (string|null);
            playerNo?: (number|null);
            players?: (number[]|null);
        }
    
        class MatchingResp implements IMatchingResp {
            constructor(p?: club.IMatchingResp);
            public res: string;
            public msg: string;
            public playerNo: number;
            public players: number[];
            public static encode(m: club.IMatchingResp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): club.MatchingResp;
        }
    
        enum ClubCode {
            UNSPECIFIED = 0,
            CLUB_CREATECLUB = 65001,
            CLUB_MODIFYCLUB = 65002,
            CLUB_SENDCLUBJOINREQUEST = 65003,
            CLUB_DECIDECLUBJOINREQUEST = 65004,
            CLUB_GETCLUBLIST = 65005,
            CLUB_GETCLUBINFO = 65006,
            CLUB_GETCLUBTABLELIST = 65007,
            CLUB_GETCLUBPLAYERLIST = 65008,
            CLUB_GETCLUBPLAYERDETAIL = 65009,
            CLUB_KICKOUTCLUBPLAYER = 65010,
            CLUB_CREATETABLE = 65011,
            CLUB_JOINTABLE = 65012,
            CLUB_QUITTABLE = 65013,
            CLUB_UPDATETABLE = 65014,
            CLUB_GETPLAYERINFO = 65015,
            CLUB_GETCLUBPLAYERGAMEHISTORY = 65016,
            CLUB_GETCLUBAPPLICATIONLIST = 65017,
            CLUB_GETCLUBORDERLIST = 65018,
            CLUB_GETCLUBITEMLIST = 65019,
            CLUB_GETCLUBMONEYORDERLIST = 65020,
            CLUB_SETCLUBPLAYERDETAIL = 65021,
            CLUB_GETTABLEINFO = 65022,
            CLUB_QUERYTABLE = 65023,
            CLUB_QUITCLUB = 65024,
            CLUB_INVITEPLAYER = 65025,
            CLUB_GETFRIENDTABLELIST = 65026,
            CLUB_GETFRIENDTABLE = 65027,
            CLUB_SETPREDEFINEDCARD = 65028,
            CLUB_GETPLAYERGAMEHISTORY = 65029,
            CLUB_SAVEGAMEHISTORY = 65030,
            CLUB_GETGAMEHISTORYDETAIL = 65031,
            CLUB_GETWBBINDINFO = 65032,
            CLUB_MODIFYTABLE = 65033,
            CLUB_MODIFYCLUBTYPE = 65034,
            CLUB_GETWBRANDCODE = 65035,
            CLUB_GETWBLOGINTOKEN = 65036,
            CLUB_CANCELWBBIND = 65037,
            CLUB_CHECKCLUBAPPLICATION = 65038,
            CLUB_CLOSETABLE = 65039,
            CLUB_MATCHING_JOIN = 65040,
            CLUB_MATCHING_QUIT = 65041,
            CLUB_MATCHING_QUERY = 65042
        }
    }
    
    export namespace pb_common {
    
        interface IpbError {
            errCode?: (pb_common.ERRCode|null);
            errMsg?: (string|null);
        }
    
        class pbError implements IpbError {
            constructor(p?: pb_common.IpbError);
            public errCode?: (pb_common.ERRCode|null);
            public errMsg?: (string|null);
            public _errCode?: "errCode";
            public _errMsg?: "errMsg";
            public static encode(m: pb_common.IpbError, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): pb_common.pbError;
        }
    
        enum ERRCode {
            ERRCode_Router = 0,
            ERRCode_ProtoCode = 1,
            ERRCode_ProtoMsg = 2
        }
    }
    
    export namespace mahjong_jp {
    
        enum SHOW_TYPE {
            SHOW_UNKNOW_TYPE = 0,
            SHOW_YIMAN = 1,
            SHOW_LEIJIYIMAN = 2,
            SHOW_ER_YIMAN = 3,
            SHOW_SAN_YIMAN = 4,
            SHOW_SI_YIMAN = 5,
            SHOW_WU_YIMAN = 6,
            SHOW_LIU_YIMAN = 7,
            SHOW_BEIMAN = 8,
            SHOW_MANGUAN = 9,
            SHOW_TIAOMAN = 10,
            SHOW_SAN_BEIMAN = 11,
            SHOW_LIUJU_MANGUAN = 12
        }
    
        enum FAN_TYPE {
            JP_UNKNOW_TYPE = 0,
            JP_DA_SI_XI = 1,
            JP_SI_AN_KE_DAN_JI = 2,
            JP_GUO_SHI_WU_SHUANG_13MIAN = 3,
            JP_CHUN_JIU_LIAN_BAO_DENG = 4,
            JP_CHUN_LV_YI_SE = 5,
            JP_DA_QI_XING = 6,
            JP_DA_SAN_YUAN = 7,
            JP_LV_YI_SE = 8,
            JP_JIU_LIAN_BAO_DENG = 9,
            JP_SI_GANG = 10,
            JP_XIAO_ZHU_LIN = 11,
            JP_XIAO_CHE_LUN = 12,
            JP_XIAO_SHU_LIN = 13,
            JP_DA_ZHU_LIN = 14,
            JP_DA_CHE_LUN = 15,
            JP_DA_SHU_LIN = 16,
            JP_SHI_SAN_YAO = 17,
            JP_QING_YAO_JIU = 18,
            JP_XIAO_SI_XI = 19,
            JP_ZI_YI_SE = 20,
            JP_SI_AN_KE = 21,
            JP_YI_SE_SHUANG_LONG_HUI = 22,
            JP_YI_SE_SI_JIE_GAO = 23,
            JP_YI_SE_SI_TONG_SHUN = 24,
            JP_YI_SE_SI_BU_GAO = 25,
            JP_DI_HE = 26,
            JP_TIAN_HE = 27,
            JP_SHI_SHANG_SAN_NIAN = 28,
            JP_BA_LIAN_ZHUANG = 29,
            JP_DONG_BEI_XIN_GAN_XIAN = 30,
            JP_HEI_YI_SE = 31,
            JP_BAI_WAN_SHI = 32,
            JP_HONG_KONG_QUE = 33,
            JP_FENG_HUA_XUE_YUE = 34,
            JP_HUA_NIAO_FENG_YUE = 35,
            JP_KAI_LI_ZHI_RONG = 36,
            JP_REN_HE = 37,
            JP_QING_YI_SE = 38,
            JP_YI_TONG_MO_YUE = 39,
            JP_JIU_TONG_LAO_YUE = 40,
            JP_WU_TONG_KAI_HUA = 41,
            JP_JIN_JI_DU_LI = 42,
            JP_DU_DIAO_HAN_JIANG_XUE = 43,
            JP_HUN_YI_SE = 44,
            JP_ER_BEI_KOU = 45,
            JP_CHUN_QUAN_DAI_YAO_JIU = 46,
            JP_WU_XIN_TONG_GUAN = 47,
            JP_SAN_GANG = 48,
            JP_HUN_YAO_JIU = 49,
            JP_HUN_QUAN_DAI_YAO_JIU = 50,
            JP_QI_DUI = 51,
            JP_XIAO_SAN_YUAN = 52,
            JP_YI_SE_SAN_JIE_GAO = 53,
            JP_QING_LONG = 54,
            JP_YI_SE_SAN_BU_GAO = 55,
            JP_SAN_TONG_KE = 56,
            JP_SAN_AN_KE = 57,
            JP_HUA_LONG = 58,
            JP_SAN_SE_SAN_TONG_SHUN = 59,
            JP_PENG_PENG_HE = 60,
            JP_WU_MEN_QI = 61,
            JP_SHUANG_LI_ZHI = 62,
            JP_KAI_LI_ZHI_ZIMO = 63,
            JP_MIAO_SHOU_HUI_CHUN = 64,
            JP_HAI_DI_YAO_YUE = 65,
            JP_GANG_SHANG_KAI_HUA = 66,
            JP_QIANG_GANG_HE = 67,
            JP_SAN_SE_SAN_BU_GAO = 68,
            JP_QUAN_FENG_KE = 69,
            JP_MEN_FENG_KE = 70,
            JP_SANYUAN_KE = 71,
            JP_PING_HE = 72,
            JP_DUAN_YAO = 73,
            JP_YI_BAN_GAO = 74,
            JP_ZI_MO = 75,
            JP_LI_ZHI = 76,
            JP_YI_FA = 77,
            JP_YAN_FAN = 78,
            JP_GANG_ZHEN = 79,
            JP_SHI_ER_LUO_TAI = 80,
            JP_BAO_PAI = 81,
            JP_LI_BAO_PAI = 82,
            JP_CHI_BAO_PAI = 83
        }
    
        interface IPlayer {
            userID?: (number|Long|null);
            seatID?: (number|null);
            holeCards?: (number[]|null);
        }
    
        class Player implements IPlayer {
            constructor(p?: mahjong_jp.IPlayer);
            public userID: (number|Long);
            public seatID: number;
            public holeCards: number[];
            public static encode(m: mahjong_jp.IPlayer, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.Player;
        }
    
        interface IGameStart {
            userIDs?: ((number|Long)[]|null);
            bankerSeatID?: (number|null);
        }
    
        class GameStart implements IGameStart {
            constructor(p?: mahjong_jp.IGameStart);
            public userIDs: (number|Long)[];
            public bankerSeatID: number;
            public static encode(m: mahjong_jp.IGameStart, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.GameStart;
        }
    
        interface IGameID {
            id?: (number|null);
        }
    
        class GameID implements IGameID {
            constructor(p?: mahjong_jp.IGameID);
            public id: number;
            public static encode(m: mahjong_jp.IGameID, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.GameID;
        }
    
        interface IGameUUID {
            uuid?: (string|null);
            clubid?: (number|Long|null);
            lat?: (number|Long|null);
            lon?: (number|Long|null);
        }
    
        class GameUUID implements IGameUUID {
            constructor(p?: mahjong_jp.IGameUUID);
            public uuid: string;
            public clubid: (number|Long);
            public lat: (number|Long);
            public lon: (number|Long);
            public static encode(m: mahjong_jp.IGameUUID, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.GameUUID;
        }
    
        interface IPlayerCards {
            userID?: (number|Long|null);
            holeCards?: (number[]|null);
        }
    
        class PlayerCards implements IPlayerCards {
            constructor(p?: mahjong_jp.IPlayerCards);
            public userID: (number|Long);
            public holeCards: number[];
            public static encode(m: mahjong_jp.IPlayerCards, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.PlayerCards;
        }
    
        interface IPlayerID {
            userId?: (number|Long|null);
        }
    
        class PlayerID implements IPlayerID {
            constructor(p?: mahjong_jp.IPlayerID);
            public userId: (number|Long);
            public static encode(m: mahjong_jp.IPlayerID, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.PlayerID;
        }
    
        interface IExitStatus {
            status?: (number|null);
        }
    
        class ExitStatus implements IExitStatus {
            constructor(p?: mahjong_jp.IExitStatus);
            public status: number;
            public static encode(m: mahjong_jp.IExitStatus, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.ExitStatus;
        }
    
        interface IPlayerPlayStaticsInfo {
            avgShunwei?: (number|null);
            nameNick1?: (string|null);
            nameNick2?: (string|null);
            oneLv?: (number|null);
            twoLv?: (number|null);
            threeLv?: (number|null);
            fourLv?: (number|null);
            heLv?: (number|null);
            paoLv?: (number|null);
            lizhiLv?: (number|null);
            fuluLv?: (number|null);
            gameCount?: (number|Long|null);
            heXunCount?: (number|null);
            avgDianshu?: (number|null);
            avgFangchou?: (number|null);
            shijuStatus?: (number[]|null);
        }
    
        class PlayerPlayStaticsInfo implements IPlayerPlayStaticsInfo {
            constructor(p?: mahjong_jp.IPlayerPlayStaticsInfo);
            public avgShunwei: number;
            public nameNick1: string;
            public nameNick2: string;
            public oneLv: number;
            public twoLv: number;
            public threeLv: number;
            public fourLv: number;
            public heLv: number;
            public paoLv: number;
            public lizhiLv: number;
            public fuluLv: number;
            public gameCount: (number|Long);
            public heXunCount: number;
            public avgDianshu: number;
            public avgFangchou: number;
            public shijuStatus: number[];
            public static encode(m: mahjong_jp.IPlayerPlayStaticsInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.PlayerPlayStaticsInfo;
        }
    
        interface IPlayerInfo {
            userId?: (number|Long|null);
            seatId?: (number|null);
            ready?: (number|null);
            nickname?: (string|null);
            headerId?: (number|null);
            moneyPlat?: (number|Long|null);
            from?: (number|null);
            sex?: (number|null);
            winTimes?: (number|null);
            lostTimes?: (number|null);
            pingTimes?: (number|null);
            level?: (number|null);
            levelName?: (string|null);
            allResult?: (number|Long|null);
            statics?: (mahjong_jp.IPlayerPlayStaticsInfo|null);
        }
    
        class PlayerInfo implements IPlayerInfo {
            constructor(p?: mahjong_jp.IPlayerInfo);
            public userId: (number|Long);
            public seatId: number;
            public ready: number;
            public nickname: string;
            public headerId: number;
            public moneyPlat: (number|Long);
            public from: number;
            public sex: number;
            public winTimes: number;
            public lostTimes: number;
            public pingTimes: number;
            public level: number;
            public levelName: string;
            public allResult: (number|Long);
            public statics?: (mahjong_jp.IPlayerPlayStaticsInfo|null);
            public static encode(m: mahjong_jp.IPlayerInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.PlayerInfo;
        }
    
        interface IMahjongTableEnterResponse {
            tableType?: (number|null);
            level?: (number|null);
            tableId?: (number|null);
            baseChips?: (number|null);
            baseRadix?: (number|null);
            quan?: (number|null);
            curQuan?: (number|null);
            players?: (mahjong_jp.IPlayerInfo[]|null);
            outCardTimeout?: (number|null);
            operationTimeout?: (number|null);
            nextRoundStartTime?: (number|null);
        }
    
        class MahjongTableEnterResponse implements IMahjongTableEnterResponse {
            constructor(p?: mahjong_jp.IMahjongTableEnterResponse);
            public tableType: number;
            public level: number;
            public tableId: number;
            public baseChips: number;
            public baseRadix: number;
            public quan: number;
            public curQuan: number;
            public players: mahjong_jp.IPlayerInfo[];
            public outCardTimeout: number;
            public operationTimeout: number;
            public nextRoundStartTime: number;
            public static encode(m: mahjong_jp.IMahjongTableEnterResponse, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.MahjongTableEnterResponse;
        }
    
        interface IMahjongReadyStart {
            bankerSeatId?: (number|null);
        }
    
        class MahjongReadyStart implements IMahjongReadyStart {
            constructor(p?: mahjong_jp.IMahjongReadyStart);
            public bankerSeatId: number;
            public static encode(m: mahjong_jp.IMahjongReadyStart, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.MahjongReadyStart;
        }
    
        interface IHandCard {
            card?: (number[]|null);
        }
    
        class HandCard implements IHandCard {
            constructor(p?: mahjong_jp.IHandCard);
            public card: number[];
            public static encode(m: mahjong_jp.IHandCard, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.HandCard;
        }
    
        interface ITingCard {
            card?: (number[]|null);
        }
    
        class TingCard implements ITingCard {
            constructor(p?: mahjong_jp.ITingCard);
            public card: number[];
            public static encode(m: mahjong_jp.ITingCard, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.TingCard;
        }
    
        interface ISendCard {
            handCard?: (mahjong_jp.IHandCard|null);
            hucard?: (mahjong_jp.IHucardInfo[]|null);
            changeCard?: (number[]|null);
        }
    
        class SendCard implements ISendCard {
            constructor(p?: mahjong_jp.ISendCard);
            public handCard?: (mahjong_jp.IHandCard|null);
            public hucard: mahjong_jp.IHucardInfo[];
            public changeCard: number[];
            public static encode(m: mahjong_jp.ISendCard, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.SendCard;
        }
    
        interface IGameUserStartInfo {
            userId?: (number|Long|null);
            huaCard?: (number[]|null);
            nDianShu?: (number|Long|null);
        }
    
        class GameUserStartInfo implements IGameUserStartInfo {
            constructor(p?: mahjong_jp.IGameUserStartInfo);
            public userId: (number|Long);
            public huaCard: number[];
            public nDianShu: (number|Long);
            public static encode(m: mahjong_jp.IGameUserStartInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.GameUserStartInfo;
        }
    
        interface IHuaCardsInfo {
            users?: (mahjong_jp.IGameUserStartInfo[]|null);
            doraCard?: (number|null);
            nShaiziCount?: (number|null);
            nQuan?: (number|null);
            nRound?: (number|null);
            nBenJu?: (number|null);
            nBankerSeatId?: (number|null);
            cardMD5?: (string|null);
            outCardTimeout?: (number|null);
            operationTimeout?: (number|null);
            gongtuo?: (number|null);
        }
    
        class HuaCardsInfo implements IHuaCardsInfo {
            constructor(p?: mahjong_jp.IHuaCardsInfo);
            public users: mahjong_jp.IGameUserStartInfo[];
            public doraCard: number;
            public nShaiziCount: number;
            public nQuan: number;
            public nRound: number;
            public nBenJu: number;
            public nBankerSeatId: number;
            public cardMD5: string;
            public outCardTimeout: number;
            public operationTimeout: number;
            public gongtuo: number;
            public static encode(m: mahjong_jp.IHuaCardsInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.HuaCardsInfo;
        }
    
        interface IUserGrabCard {
            byGrabCard?: (number[]|null);
            nActionValue?: (number|null);
            gangCards?: (number[]|null);
            bGrabFinalCard?: (boolean|null);
            hucard?: (mahjong_jp.IHucardInfo[]|null);
            diffTimeout?: (number|null);
        }
    
        class UserGrabCard implements IUserGrabCard {
            constructor(p?: mahjong_jp.IUserGrabCard);
            public byGrabCard: number[];
            public nActionValue: number;
            public gangCards: number[];
            public bGrabFinalCard: boolean;
            public hucard: mahjong_jp.IHucardInfo[];
            public diffTimeout: number;
            public static encode(m: mahjong_jp.IUserGrabCard, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.UserGrabCard;
        }
    
        interface IHucardInfo {
            card?: (number|null);
            tings?: (mahjong_jp.ITingInfo[]|null);
        }
    
        class HucardInfo implements IHucardInfo {
            constructor(p?: mahjong_jp.IHucardInfo);
            public card: number;
            public tings: mahjong_jp.ITingInfo[];
            public static encode(m: mahjong_jp.IHucardInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.HucardInfo;
        }
    
        interface ITingInfo {
            card?: (number|null);
            fans?: (number|null);
            shengyu?: (number|null);
            fanxing?: (number|null);
            comfanxing?: (number|null);
        }
    
        class TingInfo implements ITingInfo {
            constructor(p?: mahjong_jp.ITingInfo);
            public card: number;
            public fans: number;
            public shengyu: number;
            public fanxing: number;
            public comfanxing: number;
            public static encode(m: mahjong_jp.ITingInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.TingInfo;
        }
    
        interface IBroadGrabCard {
            curUserId?: (number|Long|null);
            crabCardIndex?: (number|null);
            huaCards?: (number[]|null);
            grabFinalCard?: (boolean|null);
        }
    
        class BroadGrabCard implements IBroadGrabCard {
            constructor(p?: mahjong_jp.IBroadGrabCard);
            public curUserId: (number|Long);
            public crabCardIndex: number;
            public huaCards: number[];
            public grabFinalCard: boolean;
            public static encode(m: mahjong_jp.IBroadGrabCard, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.BroadGrabCard;
        }
    
        interface IUserOutCard {
            card?: (number|null);
            isTing?: (number|null);
            isMoQie?: (boolean|null);
        }
    
        class UserOutCard implements IUserOutCard {
            constructor(p?: mahjong_jp.IUserOutCard);
            public card: number;
            public isTing: number;
            public isMoQie: boolean;
            public static encode(m: mahjong_jp.IUserOutCard, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.UserOutCard;
        }
    
        interface IGangDoraCard {
            card?: (number|null);
        }
    
        class GangDoraCard implements IGangDoraCard {
            constructor(p?: mahjong_jp.IGangDoraCard);
            public card: number;
            public static encode(m: mahjong_jp.IGangDoraCard, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.GangDoraCard;
        }
    
        interface IUserOutCardRespond {
            nOutCardUserId?: (number|Long|null);
            nOpWeight?: (number|null);
            isTing?: (boolean|null);
            byFan?: (number|null);
            byOutCard?: (number|null);
            diffTimeout?: (number|null);
            moqie?: (boolean|null);
            disableCards?: (number[]|null);
            isZhenTing?: (boolean|null);
            isHengFang?: (boolean|null);
        }
    
        class UserOutCardRespond implements IUserOutCardRespond {
            constructor(p?: mahjong_jp.IUserOutCardRespond);
            public nOutCardUserId: (number|Long);
            public nOpWeight: number;
            public isTing: boolean;
            public byFan: number;
            public byOutCard: number;
            public diffTimeout: number;
            public moqie: boolean;
            public disableCards: number[];
            public isZhenTing: boolean;
            public isHengFang: boolean;
            public static encode(m: mahjong_jp.IUserOutCardRespond, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.UserOutCardRespond;
        }
    
        interface IUserLiZhiUpdateDianShu {
            nUserId?: (number|Long|null);
            nDianShu?: (number|Long|null);
            gongtuo?: (number|null);
        }
    
        class UserLiZhiUpdateDianShu implements IUserLiZhiUpdateDianShu {
            constructor(p?: mahjong_jp.IUserLiZhiUpdateDianShu);
            public nUserId: (number|Long);
            public nDianShu: (number|Long);
            public gongtuo: number;
            public static encode(m: mahjong_jp.IUserLiZhiUpdateDianShu, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.UserLiZhiUpdateDianShu;
        }
    
        interface IUserOperatorRequest {
            opValue?: (number|null);
            opCard?: (number|null);
            redFiveCount?: (number|null);
        }
    
        class UserOperatorRequest implements IUserOperatorRequest {
            constructor(p?: mahjong_jp.IUserOperatorRequest);
            public opValue: number;
            public opCard: number;
            public redFiveCount: number;
            public static encode(m: mahjong_jp.IUserOperatorRequest, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.UserOperatorRequest;
        }
    
        interface IUserOperatorRespond {
            operatorUserID?: (number|Long|null);
            operationValue?: (number|null);
            operationCard?: (number|null);
            targetSeatID?: (number|null);
            hucard?: (mahjong_jp.IHucardInfo[]|null);
            diffTimeout?: (number|null);
            disableCards?: (number[]|null);
            redFiveCount?: (number|null);
        }
    
        class UserOperatorRespond implements IUserOperatorRespond {
            constructor(p?: mahjong_jp.IUserOperatorRespond);
            public operatorUserID: (number|Long);
            public operationValue: number;
            public operationCard: number;
            public targetSeatID: number;
            public hucard: mahjong_jp.IHucardInfo[];
            public diffTimeout: number;
            public disableCards: number[];
            public redFiveCount: number;
            public static encode(m: mahjong_jp.IUserOperatorRespond, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.UserOperatorRespond;
        }
    
        interface IUserOperatorJumpReply {
            operatorUserID?: (number|Long|null);
            diffTimeout?: (number|null);
            isZhenTing?: (boolean|null);
        }
    
        class UserOperatorJumpReply implements IUserOperatorJumpReply {
            constructor(p?: mahjong_jp.IUserOperatorJumpReply);
            public operatorUserID: (number|Long);
            public diffTimeout: number;
            public isZhenTing: boolean;
            public static encode(m: mahjong_jp.IUserOperatorJumpReply, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.UserOperatorJumpReply;
        }
    
        interface IFuLuInfo {
            fuluType?: (number|null);
            cards?: (number[]|null);
            pos?: (number|null);
        }
    
        class FuLuInfo implements IFuLuInfo {
            constructor(p?: mahjong_jp.IFuLuInfo);
            public fuluType: number;
            public cards: number[];
            public pos: number;
            public static encode(m: mahjong_jp.IFuLuInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.FuLuInfo;
        }
    
        interface IPlayerTingInfo {
            userId?: (number|Long|null);
            cards?: (number[]|null);
        }
    
        class PlayerTingInfo implements IPlayerTingInfo {
            constructor(p?: mahjong_jp.IPlayerTingInfo);
            public userId: (number|Long);
            public cards: number[];
            public static encode(m: mahjong_jp.IPlayerTingInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.PlayerTingInfo;
        }
    
        interface IGameRoundResult {
            nRoundResult?: (number|null);
            timeRound?: (number|Long|null);
            huOrPaoUid?: (number|Long|null);
            playerInfo?: (mahjong_jp.IResPlayerInfo[]|null);
            huCard?: (number|null);
            stopGame?: (boolean|null);
            nLiuJuType?: (number|null);
            playerTing?: (mahjong_jp.IPlayerTingInfo[]|null);
        }
    
        class GameRoundResult implements IGameRoundResult {
            constructor(p?: mahjong_jp.IGameRoundResult);
            public nRoundResult: number;
            public timeRound: (number|Long);
            public huOrPaoUid: (number|Long);
            public playerInfo: mahjong_jp.IResPlayerInfo[];
            public huCard: number;
            public stopGame: boolean;
            public nLiuJuType: number;
            public playerTing: mahjong_jp.IPlayerTingInfo[];
            public static encode(m: mahjong_jp.IGameRoundResult, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.GameRoundResult;
        }
    
        interface IResPlayerInfo {
            userId?: (number|Long|null);
            status?: (number|null);
            moneyPlat?: (number|Long|null);
            turnMoney?: (number|Long|null);
            turnMoneyAll?: (number|Long|null);
            roundResult?: (number|null);
            remCards?: (number[]|null);
            allFan?: (number|null);
            fu?: (number|null);
            fans?: (mahjong_jp.IFanInfo[]|null);
            rank?: (number|null);
            winCard?: (number|null);
            fulus?: (mahjong_jp.IFuLuInfo[]|null);
            dora?: (number[]|null);
            lidora?: (number[]|null);
            statics?: (mahjong_jp.IPlayerPlayStaticsInfo|null);
            showType?: (mahjong_jp.SHOW_TYPE|null);
            nickName?: (string|null);
        }
    
        class ResPlayerInfo implements IResPlayerInfo {
            constructor(p?: mahjong_jp.IResPlayerInfo);
            public userId: (number|Long);
            public status: number;
            public moneyPlat: (number|Long);
            public turnMoney: (number|Long);
            public turnMoneyAll: (number|Long);
            public roundResult: number;
            public remCards: number[];
            public allFan: number;
            public fu: number;
            public fans: mahjong_jp.IFanInfo[];
            public rank: number;
            public winCard: number;
            public fulus: mahjong_jp.IFuLuInfo[];
            public dora: number[];
            public lidora: number[];
            public statics?: (mahjong_jp.IPlayerPlayStaticsInfo|null);
            public showType: mahjong_jp.SHOW_TYPE;
            public nickName: string;
            public static encode(m: mahjong_jp.IResPlayerInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.ResPlayerInfo;
        }
    
        interface IFanInfo {
            type?: (number|null);
            name?: (string|null);
            score?: (number|null);
        }
    
        class FanInfo implements IFanInfo {
            constructor(p?: mahjong_jp.IFanInfo);
            public type: number;
            public name: string;
            public score: number;
            public static encode(m: mahjong_jp.IFanInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.FanInfo;
        }
    
        interface IMahjongTableInfo {
            tableType?: (number|null);
            users?: (mahjong_jp.IMahjongGameUser[]|null);
            usersTw?: (mahjong_jp.IMahjongGameUserTw[]|null);
        }
    
        class MahjongTableInfo implements IMahjongTableInfo {
            constructor(p?: mahjong_jp.IMahjongTableInfo);
            public tableType: number;
            public users: mahjong_jp.IMahjongGameUser[];
            public usersTw: mahjong_jp.IMahjongGameUserTw[];
            public static encode(m: mahjong_jp.IMahjongTableInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.MahjongTableInfo;
        }
    
        interface IMahjongGameUser {
            userId?: (number|Long|null);
            userYuanbao?: (number|null);
            relativeMoney?: (number|null);
            moneyPlat?: (number|Long|null);
            allResult?: (number|Long|null);
            onlineStatus?: (number|null);
            rank?: (number|null);
            dedian?: (number|null);
        }
    
        class MahjongGameUser implements IMahjongGameUser {
            constructor(p?: mahjong_jp.IMahjongGameUser);
            public userId: (number|Long);
            public userYuanbao: number;
            public relativeMoney: number;
            public moneyPlat: (number|Long);
            public allResult: (number|Long);
            public onlineStatus: number;
            public rank: number;
            public dedian: number;
            public static encode(m: mahjong_jp.IMahjongGameUser, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.MahjongGameUser;
        }
    
        interface IMahjongGameUserTw {
            userId?: (number|Long|null);
            relativeMoney?: (number|Long|null);
            moneyPlat?: (number|Long|null);
            allResult?: (number|Long|null);
            onlineStatus?: (number|null);
            fangpaoNums?: (number|null);
            zimoNums?: (number|null);
            gangshangkaihuaNums?: (number|null);
            chihuNums?: (number|null);
            maxFan?: (number|null);
        }
    
        class MahjongGameUserTw implements IMahjongGameUserTw {
            constructor(p?: mahjong_jp.IMahjongGameUserTw);
            public userId: (number|Long);
            public relativeMoney: (number|Long);
            public moneyPlat: (number|Long);
            public allResult: (number|Long);
            public onlineStatus: number;
            public fangpaoNums: number;
            public zimoNums: number;
            public gangshangkaihuaNums: number;
            public chihuNums: number;
            public maxFan: number;
            public static encode(m: mahjong_jp.IMahjongGameUserTw, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.MahjongGameUserTw;
        }
    
        interface IPlayerData {
            userId?: (number|Long|null);
            winTimes?: (number|null);
            lostTimes?: (number|null);
            pingTimes?: (number|null);
            level?: (number|null);
            levelName?: (string|null);
            exp?: (number|null);
        }
    
        class PlayerData implements IPlayerData {
            constructor(p?: mahjong_jp.IPlayerData);
            public userId: (number|Long);
            public winTimes: number;
            public lostTimes: number;
            public pingTimes: number;
            public level: number;
            public levelName: string;
            public exp: number;
            public static encode(m: mahjong_jp.IPlayerData, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.PlayerData;
        }
    
        interface IPlayerUpdateData {
            playerDatas?: (mahjong_jp.IPlayerData[]|null);
        }
    
        class PlayerUpdateData implements IPlayerUpdateData {
            constructor(p?: mahjong_jp.IPlayerUpdateData);
            public playerDatas: mahjong_jp.IPlayerData[];
            public static encode(m: mahjong_jp.IPlayerUpdateData, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.PlayerUpdateData;
        }
    
        interface IUserOffline {
            players?: (mahjong_jp.IPlayerID[]|null);
        }
    
        class UserOffline implements IUserOffline {
            constructor(p?: mahjong_jp.IUserOffline);
            public players: mahjong_jp.IPlayerID[];
            public static encode(m: mahjong_jp.IUserOffline, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.UserOffline;
        }
    
        interface IUserTuoGuan {
            type?: (number|null);
        }
    
        class UserTuoGuan implements IUserTuoGuan {
            constructor(p?: mahjong_jp.IUserTuoGuan);
            public type: number;
            public static encode(m: mahjong_jp.IUserTuoGuan, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.UserTuoGuan;
        }
    
        interface IBroadUserTuoGuan {
            userId?: (number|Long|null);
            type?: (number|null);
        }
    
        class BroadUserTuoGuan implements IBroadUserTuoGuan {
            constructor(p?: mahjong_jp.IBroadUserTuoGuan);
            public userId: (number|Long);
            public type: number;
            public static encode(m: mahjong_jp.IBroadUserTuoGuan, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.BroadUserTuoGuan;
        }
    
        interface IUserOperatorHint {
            opValue?: (number|null);
            opCard?: (number|null);
            seatID?: (number|null);
            fan?: (number|null);
            diffTimeout?: (number|null);
        }
    
        class UserOperatorHint implements IUserOperatorHint {
            constructor(p?: mahjong_jp.IUserOperatorHint);
            public opValue: number;
            public opCard: number;
            public seatID: number;
            public fan: number;
            public diffTimeout: number;
            public static encode(m: mahjong_jp.IUserOperatorHint, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.UserOperatorHint;
        }
    
        interface IUserPriMes {
            receiveUid?: (number|Long|null);
            sendUid?: (number|Long|null);
            faceid?: (number|null);
        }
    
        class UserPriMes implements IUserPriMes {
            constructor(p?: mahjong_jp.IUserPriMes);
            public receiveUid: (number|Long);
            public sendUid: (number|Long);
            public faceid: number;
            public static encode(m: mahjong_jp.IUserPriMes, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.UserPriMes;
        }
    
        interface IOutCardInfo {
            outCard?: (number|null);
            status?: (number|null);
            moQie?: (number|null);
        }
    
        class OutCardInfo implements IOutCardInfo {
            constructor(p?: mahjong_jp.IOutCardInfo);
            public outCard: number;
            public status: number;
            public moQie: number;
            public static encode(m: mahjong_jp.IOutCardInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.OutCardInfo;
        }
    
        interface IPlayerInfoReconect {
            userId?: (number|Long|null);
            seatId?: (number|null);
            ai?: (number|null);
            nickname?: (string|null);
            dianshu?: (number|Long|null);
            tingPai?: (number|null);
            holdCount?: (number|null);
            holds?: (number[]|null);
            fulus?: (mahjong_jp.IFuLuInfo[]|null);
            outCards?: (mahjong_jp.IOutCardInfo[]|null);
            statics?: (mahjong_jp.IPlayerPlayStaticsInfo|null);
            lizhiPaiIndex?: (number|null);
            isReady?: (boolean|null);
            headerId?: (number|null);
            huaPais?: (number[]|null);
            sex?: (number|null);
            allResult?: (number|Long|null);
            winTimes?: (number|null);
            lostTimes?: (number|null);
            pingTimes?: (number|null);
            level?: (number|null);
        }
    
        class PlayerInfoReconect implements IPlayerInfoReconect {
            constructor(p?: mahjong_jp.IPlayerInfoReconect);
            public userId: (number|Long);
            public seatId: number;
            public ai: number;
            public nickname: string;
            public dianshu: (number|Long);
            public tingPai: number;
            public holdCount: number;
            public holds: number[];
            public fulus: mahjong_jp.IFuLuInfo[];
            public outCards: mahjong_jp.IOutCardInfo[];
            public statics?: (mahjong_jp.IPlayerPlayStaticsInfo|null);
            public lizhiPaiIndex: number;
            public isReady: boolean;
            public headerId: number;
            public huaPais: number[];
            public sex: number;
            public allResult: (number|Long);
            public winTimes: number;
            public lostTimes: number;
            public pingTimes: number;
            public level: number;
            public static encode(m: mahjong_jp.IPlayerInfoReconect, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.PlayerInfoReconect;
        }
    
        interface ITableReconnectInfo_jp {
            nBenJu?: (number|null);
            gongtuo?: (number|null);
            doraCards?: (number[]|null);
        }
    
        class TableReconnectInfo_jp implements ITableReconnectInfo_jp {
            constructor(p?: mahjong_jp.ITableReconnectInfo_jp);
            public nBenJu: number;
            public gongtuo: number;
            public doraCards: number[];
            public static encode(m: mahjong_jp.ITableReconnectInfo_jp, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.TableReconnectInfo_jp;
        }
    
        interface ITableReconectInfo {
            tableType?: (number|null);
            baseChips?: (number|null);
            baseRadix?: (number|null);
            quan?: (number|null);
            outCardTimeOut?: (number|null);
            operationTimeOut?: (number|null);
            curQaun?: (number|null);
            nRound?: (number|null);
            nBenJu?: (number|null);
            gongtuo?: (number|null);
            eastSeatID?: (number|null);
            bankSeatID?: (number|null);
            shuaizi?: (number|null);
            leftCardCount?: (number|null);
            doraCards?: (number[]|null);
            players?: (mahjong_jp.IPlayerInfoReconect[]|null);
            gameState?: (number|null);
            curState?: (number|null);
            disableCards?: (number[]|null);
            isZhenTing?: (boolean|null);
            fixedTimeout?: (number|null);
            diffTimeout?: (number|null);
            preOutCardUid?: (number|Long|null);
            nOpWeight?: (number|null);
            byOutCard?: (number|null);
            curOutCardUid?: (number|null);
            gangCards?: (number[]|null);
            byGrabCard?: (number|null);
            hucard?: (mahjong_jp.IHucardInfo[]|null);
            tablemode?: (number|null);
            tableLevel?: (number|null);
            tableID?: (number|null);
            lianZhuangCount?: (number|null);
            nextGameTime?: (number|null);
            uuid?: (string|null);
        }
    
        class TableReconectInfo implements ITableReconectInfo {
            constructor(p?: mahjong_jp.ITableReconectInfo);
            public tableType: number;
            public baseChips: number;
            public baseRadix: number;
            public quan: number;
            public outCardTimeOut: number;
            public operationTimeOut: number;
            public curQaun: number;
            public nRound: number;
            public nBenJu: number;
            public gongtuo: number;
            public eastSeatID: number;
            public bankSeatID: number;
            public shuaizi: number;
            public leftCardCount: number;
            public doraCards: number[];
            public players: mahjong_jp.IPlayerInfoReconect[];
            public gameState: number;
            public curState: number;
            public disableCards: number[];
            public isZhenTing: boolean;
            public fixedTimeout: number;
            public diffTimeout: number;
            public preOutCardUid: (number|Long);
            public nOpWeight: number;
            public byOutCard: number;
            public curOutCardUid: number;
            public gangCards: number[];
            public byGrabCard: number;
            public hucard: mahjong_jp.IHucardInfo[];
            public tablemode: number;
            public tableLevel: number;
            public tableID: number;
            public lianZhuangCount: number;
            public nextGameTime: number;
            public uuid: string;
            public static encode(m: mahjong_jp.ITableReconectInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.TableReconectInfo;
        }
    
        interface IKickUser {
            leftTime?: (number|null);
        }
    
        class KickUser implements IKickUser {
            constructor(p?: mahjong_jp.IKickUser);
            public leftTime: number;
            public static encode(m: mahjong_jp.IKickUser, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.KickUser;
        }
    
        interface IGameUUIDTestData {
            uuid?: (string|null);
            clubid?: (number|Long|null);
            isSet?: (boolean|null);
        }
    
        class GameUUIDTestData implements IGameUUIDTestData {
            constructor(p?: mahjong_jp.IGameUUIDTestData);
            public uuid: string;
            public clubid: (number|Long);
            public isSet: boolean;
            public static encode(m: mahjong_jp.IGameUUIDTestData, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.GameUUIDTestData;
        }
    
        interface IGameIDReq {
            roomLevel?: (number|Long|null);
        }
    
        class GameIDReq implements IGameIDReq {
            constructor(p?: mahjong_jp.IGameIDReq);
            public roomLevel: (number|Long);
            public static encode(m: mahjong_jp.IGameIDReq, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.GameIDReq;
        }
    
        interface IRoomLevelInfo {
            level?: (number|null);
            baseChip?: (number|Long|null);
            enterLimit?: (number|Long|null);
            onlineCount?: (number|null);
        }
    
        class RoomLevelInfo implements IRoomLevelInfo {
            constructor(p?: mahjong_jp.IRoomLevelInfo);
            public level: number;
            public baseChip: (number|Long);
            public enterLimit: (number|Long);
            public onlineCount: number;
            public static encode(m: mahjong_jp.IRoomLevelInfo, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.RoomLevelInfo;
        }
    
        interface IRoomLevelInfos {
            roomInfos?: (mahjong_jp.IRoomLevelInfo[]|null);
        }
    
        class RoomLevelInfos implements IRoomLevelInfos {
            constructor(p?: mahjong_jp.IRoomLevelInfos);
            public roomInfos: mahjong_jp.IRoomLevelInfo[];
            public static encode(m: mahjong_jp.IRoomLevelInfos, w?: $protobuf.Writer): $protobuf.Writer;
            public static decode(r: ($protobuf.Reader|Uint8Array), l?: number): mahjong_jp.RoomLevelInfos;
        }
    
        enum mahjongJPCode {
            UNSPECIFIED_MAHJONG_JP = 0,
            MAHJONG_SERVER_LOGIN_SUCCESS = 9001,
            MAHJONG_CLIENT_ROOMLEVEL_REQ = 8724,
            MAHJONG_SERVER_COMMAND_LOGIN_SUCCESS = 8967,
            MAHJONG_CLIENT_RECONNECT_REQ = 8723,
            MAHJONG_SERVER_COMMAND_RECONNECT_SUCCESS = 8968,
            PANGU_CLIENT_COMMAND_CHOOSE_ROOM = 8729,
            PANGU_CLIENT_COMMAND_ENTER_ROOM = 8736,
            PANGU_CLIENT_COMMAND_ENTER_CLUB_ROOM = 9027,
            MAHJONG_CLIENT_COMMAND_LOGOUT = 8705,
            MAHJONG_CLIENT_COMMAND_READY = 8707,
            MAHJONG_SERVER_BROADCAST_USER_READY = 8961,
            MAHJONG_CLIENT_COMMAND_OUT_CARD = 8708,
            MAHJONG_SERVER_BROADCAST_USER_OUT_CARD = 8962,
            MAHJONG_SERVER_COMMAND_LIZHI_UPDATE = 9026,
            MAHJONG_SERVER_BROADCAST_USER_AI = 8963,
            MAHJONG_SERVER_COMMAND_OPEERATION_HINT = 8964,
            MAHJONG_CLIENT_COMMAND_TAKE_OPERATION = 8709,
            MAHJONG_SERVER_COMMAND_JUMP_REPLY = 9025,
            MAHJONG_CLIENT_COMMAND_REQUEST_AI = 8710,
            MAHJONG_SERVER_BROADCAST_USER_LOGIN = 8969,
            MAHJONG_SERVER_COMMAND_LOGOUT_ROOM_RY = 9028,
            MAHJONG_SERVER_BROADCAST_USER_LOGOUT = 8970,
            MAHJONG_SERVER_BROADCAST_OFFLINE_USER = 8971,
            MAHJONG_SERVER_COMMAND_DEAL_CARD = 8983,
            MAHJONG_SERVER_COMMAND_GRAB_CARD = 8984,
            MAHJONG_SERVER_COMMAND_INVALID_OPERATION = 8985,
            MAHJONG_SERVER_BROADCAST_READY_START = 8987,
            MAHJONG_SERVER_BROADCAST_START_GAME = 8988,
            MAHJONG_SERVER_GANG_DORA = 9024,
            MAHJONG_SERVER_BROADCAST_TAKE_OPERATION = 8989,
            MAHJONG_SERVER_BROADCAST_CURRENT_PLAYER = 8990,
            MAHHONG_SERVER_BROADCAST_DATA_UPDATE = 9012,
            MAHJONG_SERVER_BROADCAST_STOP_ROUND = 8991,
            MAHJONG_SERVER_BROADCAST_STOP_GAME = 8992,
            MAHJONG_SERVER_KICK_USER_NOT_READY = 9002,
            MAHJONG_CLIENT_COMMAND_SET_TEST_DATA = 8722
        }
    }

}

export default protocol;
