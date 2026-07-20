/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal.js");

var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.mahjongresult = (function() {

    var mahjongresult = {};

    mahjongresult.FuLuInfo = (function() {

        function FuLuInfo(p) {
            this.cards = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        FuLuInfo.prototype.fuluType = 0;
        FuLuInfo.prototype.cards = $util.emptyArray;
        FuLuInfo.prototype.pos = 0;

        FuLuInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.fuluType != null && Object.hasOwnProperty.call(m, "fuluType"))
                w.uint32(8).int32(m.fuluType);
            if (m.cards != null && m.cards.length) {
                w.uint32(18).fork();
                for (var i = 0; i < m.cards.length; ++i)
                    w.int32(m.cards[i]);
                w.ldelim();
            }
            if (m.pos != null && Object.hasOwnProperty.call(m, "pos"))
                w.uint32(24).int32(m.pos);
            return w;
        };

        FuLuInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjongresult.FuLuInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.fuluType = r.int32();
                        break;
                    }
                case 2: {
                        if (!(m.cards && m.cards.length))
                            m.cards = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.cards.push(r.int32());
                        } else
                            m.cards.push(r.int32());
                        break;
                    }
                case 3: {
                        m.pos = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return FuLuInfo;
    })();

    mahjongresult.FanInfo = (function() {

        function FanInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        FanInfo.prototype.type = 0;
        FanInfo.prototype.name = "";
        FanInfo.prototype.score = 0;

        FanInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.type != null && Object.hasOwnProperty.call(m, "type"))
                w.uint32(8).int32(m.type);
            if (m.name != null && Object.hasOwnProperty.call(m, "name"))
                w.uint32(18).string(m.name);
            if (m.score != null && Object.hasOwnProperty.call(m, "score"))
                w.uint32(24).int32(m.score);
            return w;
        };

        FanInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjongresult.FanInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.type = r.int32();
                        break;
                    }
                case 2: {
                        m.name = r.string();
                        break;
                    }
                case 3: {
                        m.score = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return FanInfo;
    })();

    mahjongresult.ResPlayerInfo = (function() {

        function ResPlayerInfo(p) {
            this.remCards = [];
            this.fans = [];
            this.fulus = [];
            this.dora = [];
            this.lidora = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ResPlayerInfo.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        ResPlayerInfo.prototype.status = 0;
        ResPlayerInfo.prototype.moneyPlat = 0;
        ResPlayerInfo.prototype.turnMoney = 0;
        ResPlayerInfo.prototype.roundResult = 0;
        ResPlayerInfo.prototype.remCards = $util.emptyArray;
        ResPlayerInfo.prototype.allFan = 0;
        ResPlayerInfo.prototype.fu = 0;
        ResPlayerInfo.prototype.fans = $util.emptyArray;
        ResPlayerInfo.prototype.rank = 0;
        ResPlayerInfo.prototype.winCard = 0;
        ResPlayerInfo.prototype.fulus = $util.emptyArray;
        ResPlayerInfo.prototype.dora = $util.emptyArray;
        ResPlayerInfo.prototype.lidora = $util.emptyArray;

        ResPlayerInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userId != null && Object.hasOwnProperty.call(m, "userId"))
                w.uint32(8).int64(m.userId);
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(16).int32(m.status);
            if (m.moneyPlat != null && Object.hasOwnProperty.call(m, "moneyPlat"))
                w.uint32(29).float(m.moneyPlat);
            if (m.turnMoney != null && Object.hasOwnProperty.call(m, "turnMoney"))
                w.uint32(37).float(m.turnMoney);
            if (m.roundResult != null && Object.hasOwnProperty.call(m, "roundResult"))
                w.uint32(40).int32(m.roundResult);
            if (m.remCards != null && m.remCards.length) {
                w.uint32(50).fork();
                for (var i = 0; i < m.remCards.length; ++i)
                    w.int32(m.remCards[i]);
                w.ldelim();
            }
            if (m.allFan != null && Object.hasOwnProperty.call(m, "allFan"))
                w.uint32(56).int32(m.allFan);
            if (m.fu != null && Object.hasOwnProperty.call(m, "fu"))
                w.uint32(64).int32(m.fu);
            if (m.fans != null && m.fans.length) {
                for (var i = 0; i < m.fans.length; ++i)
                    $root.mahjongresult.FanInfo.encode(m.fans[i], w.uint32(74).fork()).ldelim();
            }
            if (m.rank != null && Object.hasOwnProperty.call(m, "rank"))
                w.uint32(80).int32(m.rank);
            if (m.winCard != null && Object.hasOwnProperty.call(m, "winCard"))
                w.uint32(88).int32(m.winCard);
            if (m.fulus != null && m.fulus.length) {
                for (var i = 0; i < m.fulus.length; ++i)
                    $root.mahjongresult.FuLuInfo.encode(m.fulus[i], w.uint32(98).fork()).ldelim();
            }
            if (m.dora != null && m.dora.length) {
                w.uint32(106).fork();
                for (var i = 0; i < m.dora.length; ++i)
                    w.int32(m.dora[i]);
                w.ldelim();
            }
            if (m.lidora != null && m.lidora.length) {
                w.uint32(114).fork();
                for (var i = 0; i < m.lidora.length; ++i)
                    w.int32(m.lidora[i]);
                w.ldelim();
            }
            return w;
        };

        ResPlayerInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjongresult.ResPlayerInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userId = r.int64();
                        break;
                    }
                case 2: {
                        m.status = r.int32();
                        break;
                    }
                case 3: {
                        m.moneyPlat = r.float();
                        break;
                    }
                case 4: {
                        m.turnMoney = r.float();
                        break;
                    }
                case 5: {
                        m.roundResult = r.int32();
                        break;
                    }
                case 6: {
                        if (!(m.remCards && m.remCards.length))
                            m.remCards = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.remCards.push(r.int32());
                        } else
                            m.remCards.push(r.int32());
                        break;
                    }
                case 7: {
                        m.allFan = r.int32();
                        break;
                    }
                case 8: {
                        m.fu = r.int32();
                        break;
                    }
                case 9: {
                        if (!(m.fans && m.fans.length))
                            m.fans = [];
                        m.fans.push($root.mahjongresult.FanInfo.decode(r, r.uint32()));
                        break;
                    }
                case 10: {
                        m.rank = r.int32();
                        break;
                    }
                case 11: {
                        m.winCard = r.int32();
                        break;
                    }
                case 12: {
                        if (!(m.fulus && m.fulus.length))
                            m.fulus = [];
                        m.fulus.push($root.mahjongresult.FuLuInfo.decode(r, r.uint32()));
                        break;
                    }
                case 13: {
                        if (!(m.dora && m.dora.length))
                            m.dora = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.dora.push(r.int32());
                        } else
                            m.dora.push(r.int32());
                        break;
                    }
                case 14: {
                        if (!(m.lidora && m.lidora.length))
                            m.lidora = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.lidora.push(r.int32());
                        } else
                            m.lidora.push(r.int32());
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ResPlayerInfo;
    })();

    mahjongresult.MahjongGameUser = (function() {

        function MahjongGameUser(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        MahjongGameUser.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        MahjongGameUser.prototype.userYuanbao = 0;
        MahjongGameUser.prototype.relativeMoney = 0;
        MahjongGameUser.prototype.moneyPlat = 0;
        MahjongGameUser.prototype.allResult = 0;
        MahjongGameUser.prototype.onlineStatus = 0;
        MahjongGameUser.prototype.rank = 0;
        MahjongGameUser.prototype.dedian = 0;

        MahjongGameUser.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userId != null && Object.hasOwnProperty.call(m, "userId"))
                w.uint32(8).int64(m.userId);
            if (m.userYuanbao != null && Object.hasOwnProperty.call(m, "userYuanbao"))
                w.uint32(21).float(m.userYuanbao);
            if (m.relativeMoney != null && Object.hasOwnProperty.call(m, "relativeMoney"))
                w.uint32(29).float(m.relativeMoney);
            if (m.moneyPlat != null && Object.hasOwnProperty.call(m, "moneyPlat"))
                w.uint32(37).float(m.moneyPlat);
            if (m.allResult != null && Object.hasOwnProperty.call(m, "allResult"))
                w.uint32(45).float(m.allResult);
            if (m.onlineStatus != null && Object.hasOwnProperty.call(m, "onlineStatus"))
                w.uint32(48).int32(m.onlineStatus);
            if (m.rank != null && Object.hasOwnProperty.call(m, "rank"))
                w.uint32(56).int32(m.rank);
            if (m.dedian != null && Object.hasOwnProperty.call(m, "dedian"))
                w.uint32(69).float(m.dedian);
            return w;
        };

        MahjongGameUser.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjongresult.MahjongGameUser();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userId = r.int64();
                        break;
                    }
                case 2: {
                        m.userYuanbao = r.float();
                        break;
                    }
                case 3: {
                        m.relativeMoney = r.float();
                        break;
                    }
                case 4: {
                        m.moneyPlat = r.float();
                        break;
                    }
                case 5: {
                        m.allResult = r.float();
                        break;
                    }
                case 6: {
                        m.onlineStatus = r.int32();
                        break;
                    }
                case 7: {
                        m.rank = r.int32();
                        break;
                    }
                case 8: {
                        m.dedian = r.float();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return MahjongGameUser;
    })();

    mahjongresult.MahjongResultReq = (function() {

        function MahjongResultReq(p) {
            this.playerInfo = [];
            this.users = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        MahjongResultReq.prototype.type = 0;
        MahjongResultReq.prototype.tableId = "";
        MahjongResultReq.prototype.nRoundResult = 0;
        MahjongResultReq.prototype.timeRound = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        MahjongResultReq.prototype.huOrPaoUid = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        MahjongResultReq.prototype.huCard = 0;
        MahjongResultReq.prototype.stopGame = false;
        MahjongResultReq.prototype.nLiuJuType = 0;
        MahjongResultReq.prototype.playerInfo = $util.emptyArray;
        MahjongResultReq.prototype.users = $util.emptyArray;

        MahjongResultReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.type != null && Object.hasOwnProperty.call(m, "type"))
                w.uint32(8).int32(m.type);
            if (m.tableId != null && Object.hasOwnProperty.call(m, "tableId"))
                w.uint32(18).string(m.tableId);
            if (m.nRoundResult != null && Object.hasOwnProperty.call(m, "nRoundResult"))
                w.uint32(24).int32(m.nRoundResult);
            if (m.timeRound != null && Object.hasOwnProperty.call(m, "timeRound"))
                w.uint32(32).int64(m.timeRound);
            if (m.huOrPaoUid != null && Object.hasOwnProperty.call(m, "huOrPaoUid"))
                w.uint32(40).int64(m.huOrPaoUid);
            if (m.huCard != null && Object.hasOwnProperty.call(m, "huCard"))
                w.uint32(48).int32(m.huCard);
            if (m.stopGame != null && Object.hasOwnProperty.call(m, "stopGame"))
                w.uint32(56).bool(m.stopGame);
            if (m.nLiuJuType != null && Object.hasOwnProperty.call(m, "nLiuJuType"))
                w.uint32(64).int32(m.nLiuJuType);
            if (m.playerInfo != null && m.playerInfo.length) {
                for (var i = 0; i < m.playerInfo.length; ++i)
                    $root.mahjongresult.ResPlayerInfo.encode(m.playerInfo[i], w.uint32(74).fork()).ldelim();
            }
            if (m.users != null && m.users.length) {
                for (var i = 0; i < m.users.length; ++i)
                    $root.mahjongresult.MahjongGameUser.encode(m.users[i], w.uint32(82).fork()).ldelim();
            }
            return w;
        };

        MahjongResultReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjongresult.MahjongResultReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.type = r.int32();
                        break;
                    }
                case 2: {
                        m.tableId = r.string();
                        break;
                    }
                case 3: {
                        m.nRoundResult = r.int32();
                        break;
                    }
                case 4: {
                        m.timeRound = r.int64();
                        break;
                    }
                case 5: {
                        m.huOrPaoUid = r.int64();
                        break;
                    }
                case 6: {
                        m.huCard = r.int32();
                        break;
                    }
                case 7: {
                        m.stopGame = r.bool();
                        break;
                    }
                case 8: {
                        m.nLiuJuType = r.int32();
                        break;
                    }
                case 9: {
                        if (!(m.playerInfo && m.playerInfo.length))
                            m.playerInfo = [];
                        m.playerInfo.push($root.mahjongresult.ResPlayerInfo.decode(r, r.uint32()));
                        break;
                    }
                case 10: {
                        if (!(m.users && m.users.length))
                            m.users = [];
                        m.users.push($root.mahjongresult.MahjongGameUser.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return MahjongResultReq;
    })();

    mahjongresult.MahjongResultResp = (function() {

        function MahjongResultResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        MahjongResultResp.prototype.status = 0;

        MahjongResultResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(8).int32(m.status);
            return w;
        };

        MahjongResultResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjongresult.MahjongResultResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.status = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return MahjongResultResp;
    })();

    return mahjongresult;
})();

$root.account = (function() {

    var account = {};

    account.AccountType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "GUEST"] = 0;
        values[valuesById[1] = "FACEBOOK"] = 1;
        values[valuesById[2] = "GOOGLE"] = 2;
        values[valuesById[3] = "APPLE"] = 3;
        values[valuesById[4] = "PHONE"] = 4;
        values[valuesById[5] = "REGISTER"] = 5;
        return values;
    })();

    account.TokenReq = (function() {

        function TokenReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        TokenReq.prototype.type = 0;
        TokenReq.prototype.id = "";
        TokenReq.prototype.token = "";
        TokenReq.prototype.password = "";
        TokenReq.prototype.deviceInfo = "";
        TokenReq.prototype.recommendCode = "";

        TokenReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.type != null && Object.hasOwnProperty.call(m, "type"))
                w.uint32(8).int32(m.type);
            if (m.id != null && Object.hasOwnProperty.call(m, "id"))
                w.uint32(18).string(m.id);
            if (m.token != null && Object.hasOwnProperty.call(m, "token"))
                w.uint32(26).string(m.token);
            if (m.password != null && Object.hasOwnProperty.call(m, "password"))
                w.uint32(34).string(m.password);
            if (m.deviceInfo != null && Object.hasOwnProperty.call(m, "deviceInfo"))
                w.uint32(42).string(m.deviceInfo);
            if (m.recommendCode != null && Object.hasOwnProperty.call(m, "recommendCode"))
                w.uint32(50).string(m.recommendCode);
            return w;
        };

        TokenReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.TokenReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.type = r.int32();
                        break;
                    }
                case 2: {
                        m.id = r.string();
                        break;
                    }
                case 3: {
                        m.token = r.string();
                        break;
                    }
                case 4: {
                        m.password = r.string();
                        break;
                    }
                case 5: {
                        m.deviceInfo = r.string();
                        break;
                    }
                case 6: {
                        m.recommendCode = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return TokenReq;
    })();

    account.TokenResp = (function() {

        function TokenResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        TokenResp.prototype.res = "";
        TokenResp.prototype.msg = "";
        TokenResp.prototype.account = "";
        TokenResp.prototype.token = "";
        TokenResp.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        TokenResp.prototype.accountId = 0;
        TokenResp.prototype.isNewAccount = false;

        TokenResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.account != null && Object.hasOwnProperty.call(m, "account"))
                w.uint32(26).string(m.account);
            if (m.token != null && Object.hasOwnProperty.call(m, "token"))
                w.uint32(34).string(m.token);
            if (m.timestamp != null && Object.hasOwnProperty.call(m, "timestamp"))
                w.uint32(40).uint64(m.timestamp);
            if (m.accountId != null && Object.hasOwnProperty.call(m, "accountId"))
                w.uint32(48).uint32(m.accountId);
            if (m.isNewAccount != null && Object.hasOwnProperty.call(m, "isNewAccount"))
                w.uint32(56).bool(m.isNewAccount);
            return w;
        };

        TokenResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.TokenResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        m.account = r.string();
                        break;
                    }
                case 4: {
                        m.token = r.string();
                        break;
                    }
                case 5: {
                        m.timestamp = r.uint64();
                        break;
                    }
                case 6: {
                        m.accountId = r.uint32();
                        break;
                    }
                case 7: {
                        m.isNewAccount = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return TokenResp;
    })();

    account.LoginReq = (function() {

        function LoginReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        LoginReq.prototype.account = "";
        LoginReq.prototype.token = "";
        LoginReq.prototype.deviceID = "";
        LoginReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        LoginReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.account != null && Object.hasOwnProperty.call(m, "account"))
                w.uint32(10).string(m.account);
            if (m.token != null && Object.hasOwnProperty.call(m, "token"))
                w.uint32(18).string(m.token);
            if (m.deviceID != null && Object.hasOwnProperty.call(m, "deviceID"))
                w.uint32(26).string(m.deviceID);
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(32).uint64(m.userID);
            return w;
        };

        LoginReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.LoginReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.account = r.string();
                        break;
                    }
                case 2: {
                        m.token = r.string();
                        break;
                    }
                case 3: {
                        m.deviceID = r.string();
                        break;
                    }
                case 4: {
                        m.userID = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return LoginReq;
    })();

    account.LoginResp = (function() {

        function LoginResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        LoginResp.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        LoginResp.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        LoginResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.timestamp != null && Object.hasOwnProperty.call(m, "timestamp"))
                w.uint32(16).uint64(m.timestamp);
            return w;
        };

        LoginResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.LoginResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.timestamp = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return LoginResp;
    })();

    account.Heartbeat = (function() {

        function Heartbeat(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        Heartbeat.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        Heartbeat.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.timestamp != null && Object.hasOwnProperty.call(m, "timestamp"))
                w.uint32(8).uint64(m.timestamp);
            return w;
        };

        Heartbeat.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.Heartbeat();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.timestamp = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return Heartbeat;
    })();

    account.CloseAccountReq = (function() {

        function CloseAccountReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        CloseAccountReq.prototype.account = "";
        CloseAccountReq.prototype.token = "";

        CloseAccountReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.account != null && Object.hasOwnProperty.call(m, "account"))
                w.uint32(10).string(m.account);
            if (m.token != null && Object.hasOwnProperty.call(m, "token"))
                w.uint32(18).string(m.token);
            return w;
        };

        CloseAccountReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.CloseAccountReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.account = r.string();
                        break;
                    }
                case 2: {
                        m.token = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return CloseAccountReq;
    })();

    account.CloseAccountResp = (function() {

        function CloseAccountResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        CloseAccountResp.prototype.status = false;

        CloseAccountResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(8).bool(m.status);
            return w;
        };

        CloseAccountResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.CloseAccountResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.status = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return CloseAccountResp;
    })();

    account.ServerURLReq = (function() {

        function ServerURLReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ServerURLReq.prototype.account = "";

        ServerURLReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.account != null && Object.hasOwnProperty.call(m, "account"))
                w.uint32(10).string(m.account);
            return w;
        };

        ServerURLReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.ServerURLReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.account = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ServerURLReq;
    })();

    account.ServerURLResp = (function() {

        function ServerURLResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ServerURLResp.prototype.serverURL = "";

        ServerURLResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.serverURL != null && Object.hasOwnProperty.call(m, "serverURL"))
                w.uint32(10).string(m.serverURL);
            return w;
        };

        ServerURLResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.ServerURLResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.serverURL = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ServerURLResp;
    })();

    account.IsDeletionAccountReq = (function() {

        function IsDeletionAccountReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        IsDeletionAccountReq.prototype.account = "";
        IsDeletionAccountReq.prototype.token = "";
        IsDeletionAccountReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        IsDeletionAccountReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.account != null && Object.hasOwnProperty.call(m, "account"))
                w.uint32(10).string(m.account);
            if (m.token != null && Object.hasOwnProperty.call(m, "token"))
                w.uint32(18).string(m.token);
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(24).uint64(m.userID);
            return w;
        };

        IsDeletionAccountReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.IsDeletionAccountReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.account = r.string();
                        break;
                    }
                case 2: {
                        m.token = r.string();
                        break;
                    }
                case 3: {
                        m.userID = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return IsDeletionAccountReq;
    })();

    account.IsDeletionAccountResp = (function() {

        function IsDeletionAccountResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        IsDeletionAccountResp.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        IsDeletionAccountResp.prototype.isClose = false;

        IsDeletionAccountResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.isClose != null && Object.hasOwnProperty.call(m, "isClose"))
                w.uint32(16).bool(m.isClose);
            return w;
        };

        IsDeletionAccountResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.IsDeletionAccountResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.isClose = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return IsDeletionAccountResp;
    })();

    account.DeletionAccountReq = (function() {

        function DeletionAccountReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        DeletionAccountReq.prototype.account = "";
        DeletionAccountReq.prototype.token = "";
        DeletionAccountReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        DeletionAccountReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.account != null && Object.hasOwnProperty.call(m, "account"))
                w.uint32(10).string(m.account);
            if (m.token != null && Object.hasOwnProperty.call(m, "token"))
                w.uint32(18).string(m.token);
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(24).uint64(m.userID);
            return w;
        };

        DeletionAccountReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.DeletionAccountReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.account = r.string();
                        break;
                    }
                case 2: {
                        m.token = r.string();
                        break;
                    }
                case 3: {
                        m.userID = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return DeletionAccountReq;
    })();

    account.DeletionAccountResp = (function() {

        function DeletionAccountResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        DeletionAccountResp.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        DeletionAccountResp.prototype.time = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        DeletionAccountResp.prototype.isDeletion = false;

        DeletionAccountResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.time != null && Object.hasOwnProperty.call(m, "time"))
                w.uint32(16).uint64(m.time);
            if (m.isDeletion != null && Object.hasOwnProperty.call(m, "isDeletion"))
                w.uint32(24).bool(m.isDeletion);
            return w;
        };

        DeletionAccountResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.DeletionAccountResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.time = r.uint64();
                        break;
                    }
                case 3: {
                        m.isDeletion = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return DeletionAccountResp;
    })();

    account.AccountBindReq = (function() {

        function AccountBindReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        AccountBindReq.prototype.type = 0;
        AccountBindReq.prototype.id = "";
        AccountBindReq.prototype.token = "";
        AccountBindReq.prototype.bindToken = "";
        AccountBindReq.prototype.bindAccount = "";

        AccountBindReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.type != null && Object.hasOwnProperty.call(m, "type"))
                w.uint32(8).int32(m.type);
            if (m.id != null && Object.hasOwnProperty.call(m, "id"))
                w.uint32(18).string(m.id);
            if (m.token != null && Object.hasOwnProperty.call(m, "token"))
                w.uint32(26).string(m.token);
            if (m.bindToken != null && Object.hasOwnProperty.call(m, "bindToken"))
                w.uint32(34).string(m.bindToken);
            if (m.bindAccount != null && Object.hasOwnProperty.call(m, "bindAccount"))
                w.uint32(42).string(m.bindAccount);
            return w;
        };

        AccountBindReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.AccountBindReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.type = r.int32();
                        break;
                    }
                case 2: {
                        m.id = r.string();
                        break;
                    }
                case 3: {
                        m.token = r.string();
                        break;
                    }
                case 4: {
                        m.bindToken = r.string();
                        break;
                    }
                case 5: {
                        m.bindAccount = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return AccountBindReq;
    })();

    account.AccountBindResp = (function() {

        function AccountBindResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        AccountBindResp.prototype.account = "";
        AccountBindResp.prototype.token = "";
        AccountBindResp.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        AccountBindResp.prototype.another = false;

        AccountBindResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.account != null && Object.hasOwnProperty.call(m, "account"))
                w.uint32(10).string(m.account);
            if (m.token != null && Object.hasOwnProperty.call(m, "token"))
                w.uint32(18).string(m.token);
            if (m.timestamp != null && Object.hasOwnProperty.call(m, "timestamp"))
                w.uint32(24).uint64(m.timestamp);
            if (m.another != null && Object.hasOwnProperty.call(m, "another"))
                w.uint32(32).bool(m.another);
            return w;
        };

        AccountBindResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.AccountBindResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.account = r.string();
                        break;
                    }
                case 2: {
                        m.token = r.string();
                        break;
                    }
                case 3: {
                        m.timestamp = r.uint64();
                        break;
                    }
                case 4: {
                        m.another = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return AccountBindResp;
    })();

    account.DeleteReq = (function() {

        function DeleteReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        DeleteReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        DeleteReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            return w;
        };

        DeleteReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.DeleteReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return DeleteReq;
    })();

    account.DeleteResp = (function() {

        function DeleteResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        DeleteResp.prototype.status = false;

        DeleteResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(8).bool(m.status);
            return w;
        };

        DeleteResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.DeleteResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.status = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return DeleteResp;
    })();

    account.NoticeLogin = (function() {

        function NoticeLogin(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        NoticeLogin.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        NoticeLogin.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            return w;
        };

        NoticeLogin.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.NoticeLogin();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return NoticeLogin;
    })();

    account.NoticeResp = (function() {

        function NoticeResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        NoticeResp.prototype.status = false;

        NoticeResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(8).bool(m.status);
            return w;
        };

        NoticeResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.NoticeResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.status = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return NoticeResp;
    })();

    account.PhoneAccountReq = (function() {

        function PhoneAccountReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        PhoneAccountReq.prototype.phoneNo = "";
        PhoneAccountReq.prototype.code = "";
        PhoneAccountReq.prototype.password = "";
        PhoneAccountReq.prototype.countryCode = "";

        PhoneAccountReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.phoneNo != null && Object.hasOwnProperty.call(m, "phoneNo"))
                w.uint32(10).string(m.phoneNo);
            if (m.code != null && Object.hasOwnProperty.call(m, "code"))
                w.uint32(18).string(m.code);
            if (m.password != null && Object.hasOwnProperty.call(m, "password"))
                w.uint32(26).string(m.password);
            if (m.countryCode != null && Object.hasOwnProperty.call(m, "countryCode"))
                w.uint32(34).string(m.countryCode);
            return w;
        };

        PhoneAccountReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.PhoneAccountReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.phoneNo = r.string();
                        break;
                    }
                case 2: {
                        m.code = r.string();
                        break;
                    }
                case 3: {
                        m.password = r.string();
                        break;
                    }
                case 4: {
                        m.countryCode = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return PhoneAccountReq;
    })();

    account.PhoneAccountResp = (function() {

        function PhoneAccountResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        PhoneAccountResp.prototype.res = "";
        PhoneAccountResp.prototype.msg = "";
        PhoneAccountResp.prototype.account = "";
        PhoneAccountResp.prototype.token = "";
        PhoneAccountResp.prototype.deviceID = "";
        PhoneAccountResp.prototype.code = "";
        PhoneAccountResp.prototype.accountId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        PhoneAccountResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.account != null && Object.hasOwnProperty.call(m, "account"))
                w.uint32(26).string(m.account);
            if (m.token != null && Object.hasOwnProperty.call(m, "token"))
                w.uint32(34).string(m.token);
            if (m.deviceID != null && Object.hasOwnProperty.call(m, "deviceID"))
                w.uint32(42).string(m.deviceID);
            if (m.code != null && Object.hasOwnProperty.call(m, "code"))
                w.uint32(50).string(m.code);
            if (m.accountId != null && Object.hasOwnProperty.call(m, "accountId"))
                w.uint32(56).uint64(m.accountId);
            return w;
        };

        PhoneAccountResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.PhoneAccountResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        m.account = r.string();
                        break;
                    }
                case 4: {
                        m.token = r.string();
                        break;
                    }
                case 5: {
                        m.deviceID = r.string();
                        break;
                    }
                case 6: {
                        m.code = r.string();
                        break;
                    }
                case 7: {
                        m.accountId = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return PhoneAccountResp;
    })();

    account.ProfileReq = (function() {

        function ProfileReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ProfileReq.prototype.accountId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        ProfileReq.prototype.name = "";
        ProfileReq.prototype.avatarId = "";
        ProfileReq.prototype.avatarUrl = "";
        ProfileReq.prototype.account = "";
        ProfileReq.prototype.password = "";
        ProfileReq.prototype.code = "";

        ProfileReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.accountId != null && Object.hasOwnProperty.call(m, "accountId"))
                w.uint32(8).uint64(m.accountId);
            if (m.name != null && Object.hasOwnProperty.call(m, "name"))
                w.uint32(18).string(m.name);
            if (m.avatarId != null && Object.hasOwnProperty.call(m, "avatarId"))
                w.uint32(26).string(m.avatarId);
            if (m.avatarUrl != null && Object.hasOwnProperty.call(m, "avatarUrl"))
                w.uint32(34).string(m.avatarUrl);
            if (m.account != null && Object.hasOwnProperty.call(m, "account"))
                w.uint32(42).string(m.account);
            if (m.password != null && Object.hasOwnProperty.call(m, "password"))
                w.uint32(50).string(m.password);
            if (m.code != null && Object.hasOwnProperty.call(m, "code"))
                w.uint32(58).string(m.code);
            return w;
        };

        ProfileReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.ProfileReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.accountId = r.uint64();
                        break;
                    }
                case 2: {
                        m.name = r.string();
                        break;
                    }
                case 3: {
                        m.avatarId = r.string();
                        break;
                    }
                case 4: {
                        m.avatarUrl = r.string();
                        break;
                    }
                case 5: {
                        m.account = r.string();
                        break;
                    }
                case 6: {
                        m.password = r.string();
                        break;
                    }
                case 7: {
                        m.code = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ProfileReq;
    })();

    account.ProfileResp = (function() {

        function ProfileResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ProfileResp.prototype.res = "";
        ProfileResp.prototype.msg = "";
        ProfileResp.prototype.accountId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        ProfileResp.prototype.account = "";
        ProfileResp.prototype.name = "";
        ProfileResp.prototype.avatarId = "";
        ProfileResp.prototype.avatarUrl = "";

        ProfileResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.accountId != null && Object.hasOwnProperty.call(m, "accountId"))
                w.uint32(24).uint64(m.accountId);
            if (m.account != null && Object.hasOwnProperty.call(m, "account"))
                w.uint32(34).string(m.account);
            if (m.name != null && Object.hasOwnProperty.call(m, "name"))
                w.uint32(42).string(m.name);
            if (m.avatarId != null && Object.hasOwnProperty.call(m, "avatarId"))
                w.uint32(50).string(m.avatarId);
            if (m.avatarUrl != null && Object.hasOwnProperty.call(m, "avatarUrl"))
                w.uint32(58).string(m.avatarUrl);
            return w;
        };

        ProfileResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.account.ProfileResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        m.accountId = r.uint64();
                        break;
                    }
                case 4: {
                        m.account = r.string();
                        break;
                    }
                case 5: {
                        m.name = r.string();
                        break;
                    }
                case 6: {
                        m.avatarId = r.string();
                        break;
                    }
                case 7: {
                        m.avatarUrl = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ProfileResp;
    })();

    account.AccountCode = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UNSPECIFIED"] = 0;
        values[valuesById[10000] = "TOKEN"] = 10000;
        values[valuesById[10001] = "LOGIN"] = 10001;
        values[valuesById[10002] = "LOGGED_IN_ELSEWHERE"] = 10002;
        values[valuesById[10003] = "HEARTBEAT"] = 10003;
        values[valuesById[10004] = "LOGOUT"] = 10004;
        values[valuesById[10005] = "PRE_CLOSE_ACCOUNT"] = 10005;
        values[valuesById[10006] = "CLOSE_ACCOUNT"] = 10006;
        values[valuesById[10007] = "SERVER_URL"] = 10007;
        values[valuesById[10008] = "ACCOUNT_BIND"] = 10008;
        values[valuesById[10009] = "PHONE_CODE_REQ"] = 10009;
        values[valuesById[10012] = "PHONE_PW_CHANGE"] = 10012;
        values[valuesById[10020] = "PROFILE_REQ"] = 10020;
        values[valuesById[10021] = "PROFILE_MODIFY"] = 10021;
        return values;
    })();

    return account;
})();

$root.roleInfo = (function() {

    var roleInfo = {};

    roleInfo.RoleSimpleInfoReq = (function() {

        function RoleSimpleInfoReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        RoleSimpleInfoReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        RoleSimpleInfoReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            return w;
        };

        RoleSimpleInfoReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.RoleSimpleInfoReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return RoleSimpleInfoReq;
    })();

    roleInfo.RoleSimpleInfoResp = (function() {

        function RoleSimpleInfoResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        RoleSimpleInfoResp.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        RoleSimpleInfoResp.prototype.name = "";
        RoleSimpleInfoResp.prototype.avatarTID = 0;
        RoleSimpleInfoResp.prototype.avatarUrl = "";
        RoleSimpleInfoResp.prototype.borderTID = 0;
        RoleSimpleInfoResp.prototype.password = 0;

        RoleSimpleInfoResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.name != null && Object.hasOwnProperty.call(m, "name"))
                w.uint32(18).string(m.name);
            if (m.avatarTID != null && Object.hasOwnProperty.call(m, "avatarTID"))
                w.uint32(24).uint32(m.avatarTID);
            if (m.avatarUrl != null && Object.hasOwnProperty.call(m, "avatarUrl"))
                w.uint32(34).string(m.avatarUrl);
            if (m.borderTID != null && Object.hasOwnProperty.call(m, "borderTID"))
                w.uint32(40).uint32(m.borderTID);
            if (m.password != null && Object.hasOwnProperty.call(m, "password"))
                w.uint32(48).uint32(m.password);
            return w;
        };

        RoleSimpleInfoResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.RoleSimpleInfoResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.name = r.string();
                        break;
                    }
                case 3: {
                        m.avatarTID = r.uint32();
                        break;
                    }
                case 4: {
                        m.avatarUrl = r.string();
                        break;
                    }
                case 5: {
                        m.borderTID = r.uint32();
                        break;
                    }
                case 6: {
                        m.password = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return RoleSimpleInfoResp;
    })();

    roleInfo.RoleInfoReq = (function() {

        function RoleInfoReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        RoleInfoReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        RoleInfoReq.prototype.infoID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        RoleInfoReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.infoID != null && Object.hasOwnProperty.call(m, "infoID"))
                w.uint32(16).uint64(m.infoID);
            return w;
        };

        RoleInfoReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.RoleInfoReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.infoID = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return RoleInfoReq;
    })();

    roleInfo.RoleStaticsInfo = (function() {

        function RoleStaticsInfo(p) {
            this.bestPokerList = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        RoleStaticsInfo.prototype.infoID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        RoleStaticsInfo.prototype.name = "";
        RoleStaticsInfo.prototype.avatarTID = 0;
        RoleStaticsInfo.prototype.avatarUrl = "";
        RoleStaticsInfo.prototype.borderTID = 0;
        RoleStaticsInfo.prototype.vip = 0;
        RoleStaticsInfo.prototype.level = 0;
        RoleStaticsInfo.prototype.money = 0;
        RoleStaticsInfo.prototype.totalTimes = 0;
        RoleStaticsInfo.prototype.winTimes = 0;
        RoleStaticsInfo.prototype.inPotNum = 0;
        RoleStaticsInfo.prototype.maxPot = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        RoleStaticsInfo.prototype.tanPaiNum = 0;
        RoleStaticsInfo.prototype.tanPaiWinNum = 0;
        RoleStaticsInfo.prototype.allInNum = 0;
        RoleStaticsInfo.prototype.allInWinNum = 0;
        RoleStaticsInfo.prototype.bestPokerList = $util.emptyArray;

        RoleStaticsInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.infoID != null && Object.hasOwnProperty.call(m, "infoID"))
                w.uint32(8).uint64(m.infoID);
            if (m.name != null && Object.hasOwnProperty.call(m, "name"))
                w.uint32(18).string(m.name);
            if (m.avatarTID != null && Object.hasOwnProperty.call(m, "avatarTID"))
                w.uint32(24).uint32(m.avatarTID);
            if (m.avatarUrl != null && Object.hasOwnProperty.call(m, "avatarUrl"))
                w.uint32(34).string(m.avatarUrl);
            if (m.borderTID != null && Object.hasOwnProperty.call(m, "borderTID"))
                w.uint32(40).uint32(m.borderTID);
            if (m.vip != null && Object.hasOwnProperty.call(m, "vip"))
                w.uint32(48).uint32(m.vip);
            if (m.level != null && Object.hasOwnProperty.call(m, "level"))
                w.uint32(56).uint32(m.level);
            if (m.money != null && Object.hasOwnProperty.call(m, "money"))
                w.uint32(64).uint32(m.money);
            if (m.totalTimes != null && Object.hasOwnProperty.call(m, "totalTimes"))
                w.uint32(72).uint32(m.totalTimes);
            if (m.winTimes != null && Object.hasOwnProperty.call(m, "winTimes"))
                w.uint32(80).uint32(m.winTimes);
            if (m.inPotNum != null && Object.hasOwnProperty.call(m, "inPotNum"))
                w.uint32(88).uint32(m.inPotNum);
            if (m.maxPot != null && Object.hasOwnProperty.call(m, "maxPot"))
                w.uint32(96).uint64(m.maxPot);
            if (m.tanPaiNum != null && Object.hasOwnProperty.call(m, "tanPaiNum"))
                w.uint32(104).uint32(m.tanPaiNum);
            if (m.tanPaiWinNum != null && Object.hasOwnProperty.call(m, "tanPaiWinNum"))
                w.uint32(112).uint32(m.tanPaiWinNum);
            if (m.allInNum != null && Object.hasOwnProperty.call(m, "allInNum"))
                w.uint32(120).uint32(m.allInNum);
            if (m.allInWinNum != null && Object.hasOwnProperty.call(m, "allInWinNum"))
                w.uint32(128).uint32(m.allInWinNum);
            if (m.bestPokerList != null && m.bestPokerList.length) {
                w.uint32(138).fork();
                for (var i = 0; i < m.bestPokerList.length; ++i)
                    w.uint32(m.bestPokerList[i]);
                w.ldelim();
            }
            return w;
        };

        RoleStaticsInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.RoleStaticsInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.infoID = r.uint64();
                        break;
                    }
                case 2: {
                        m.name = r.string();
                        break;
                    }
                case 3: {
                        m.avatarTID = r.uint32();
                        break;
                    }
                case 4: {
                        m.avatarUrl = r.string();
                        break;
                    }
                case 5: {
                        m.borderTID = r.uint32();
                        break;
                    }
                case 6: {
                        m.vip = r.uint32();
                        break;
                    }
                case 7: {
                        m.level = r.uint32();
                        break;
                    }
                case 8: {
                        m.money = r.uint32();
                        break;
                    }
                case 9: {
                        m.totalTimes = r.uint32();
                        break;
                    }
                case 10: {
                        m.winTimes = r.uint32();
                        break;
                    }
                case 11: {
                        m.inPotNum = r.uint32();
                        break;
                    }
                case 12: {
                        m.maxPot = r.uint64();
                        break;
                    }
                case 13: {
                        m.tanPaiNum = r.uint32();
                        break;
                    }
                case 14: {
                        m.tanPaiWinNum = r.uint32();
                        break;
                    }
                case 15: {
                        m.allInNum = r.uint32();
                        break;
                    }
                case 16: {
                        m.allInWinNum = r.uint32();
                        break;
                    }
                case 17: {
                        if (!(m.bestPokerList && m.bestPokerList.length))
                            m.bestPokerList = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.bestPokerList.push(r.uint32());
                        } else
                            m.bestPokerList.push(r.uint32());
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return RoleStaticsInfo;
    })();

    roleInfo.RoleInfoResp = (function() {

        function RoleInfoResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        RoleInfoResp.prototype.info = null;
        RoleInfoResp.prototype.nameChangeTimes = 0;

        RoleInfoResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.info != null && Object.hasOwnProperty.call(m, "info"))
                $root.roleInfo.RoleStaticsInfo.encode(m.info, w.uint32(10).fork()).ldelim();
            if (m.nameChangeTimes != null && Object.hasOwnProperty.call(m, "nameChangeTimes"))
                w.uint32(16).uint32(m.nameChangeTimes);
            return w;
        };

        RoleInfoResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.RoleInfoResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.info = $root.roleInfo.RoleStaticsInfo.decode(r, r.uint32());
                        break;
                    }
                case 2: {
                        m.nameChangeTimes = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return RoleInfoResp;
    })();

    roleInfo.RoleGameInfo = (function() {

        function RoleGameInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        RoleGameInfo.prototype.id = 0;

        RoleGameInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.id != null && Object.hasOwnProperty.call(m, "id"))
                w.uint32(8).uint32(m.id);
            return w;
        };

        RoleGameInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.RoleGameInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.id = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return RoleGameInfo;
    })();

    roleInfo.AvatarInfoReq = (function() {

        function AvatarInfoReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        AvatarInfoReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        AvatarInfoReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            return w;
        };

        AvatarInfoReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.AvatarInfoReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return AvatarInfoReq;
    })();

    roleInfo.AvatarInfoList = (function() {

        function AvatarInfoList(p) {
            this.list = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        AvatarInfoList.prototype.list = $util.emptyArray;

        AvatarInfoList.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.list != null && m.list.length) {
                for (var i = 0; i < m.list.length; ++i)
                    $root.roleInfo.AvatarInfo.encode(m.list[i], w.uint32(10).fork()).ldelim();
            }
            return w;
        };

        AvatarInfoList.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.AvatarInfoList();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        if (!(m.list && m.list.length))
                            m.list = [];
                        m.list.push($root.roleInfo.AvatarInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return AvatarInfoList;
    })();

    roleInfo.AvatarInfo = (function() {

        function AvatarInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        AvatarInfo.prototype.ano = 0;
        AvatarInfo.prototype.url = "";
        AvatarInfo.prototype.status = false;

        AvatarInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.ano != null && Object.hasOwnProperty.call(m, "ano"))
                w.uint32(8).uint32(m.ano);
            if (m.url != null && Object.hasOwnProperty.call(m, "url"))
                w.uint32(18).string(m.url);
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(24).bool(m.status);
            return w;
        };

        AvatarInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.AvatarInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.ano = r.uint32();
                        break;
                    }
                case 2: {
                        m.url = r.string();
                        break;
                    }
                case 3: {
                        m.status = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return AvatarInfo;
    })();

    roleInfo.SetAvatarReq = (function() {

        function SetAvatarReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SetAvatarReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        SetAvatarReq.prototype.ano = 0;

        SetAvatarReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.ano != null && Object.hasOwnProperty.call(m, "ano"))
                w.uint32(16).uint32(m.ano);
            return w;
        };

        SetAvatarReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.SetAvatarReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.ano = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SetAvatarReq;
    })();

    roleInfo.SetAvatarResp = (function() {

        function SetAvatarResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SetAvatarResp.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        SetAvatarResp.prototype.ano = 0;

        SetAvatarResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.ano != null && Object.hasOwnProperty.call(m, "ano"))
                w.uint32(16).uint32(m.ano);
            return w;
        };

        SetAvatarResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.SetAvatarResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.ano = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SetAvatarResp;
    })();

    roleInfo.SetNameReq = (function() {

        function SetNameReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SetNameReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        SetNameReq.prototype.name = "";

        SetNameReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.name != null && Object.hasOwnProperty.call(m, "name"))
                w.uint32(18).string(m.name);
            return w;
        };

        SetNameReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.SetNameReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.name = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SetNameReq;
    })();

    roleInfo.SetNameResp = (function() {

        function SetNameResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SetNameResp.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        SetNameResp.prototype.name = "";
        SetNameResp.prototype.status = 0;

        SetNameResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.name != null && Object.hasOwnProperty.call(m, "name"))
                w.uint32(18).string(m.name);
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(24).int32(m.status);
            return w;
        };

        SetNameResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.SetNameResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.name = r.string();
                        break;
                    }
                case 3: {
                        m.status = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SetNameResp;
    })();

    roleInfo.BorderInfoReq = (function() {

        function BorderInfoReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        BorderInfoReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        BorderInfoReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            return w;
        };

        BorderInfoReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.BorderInfoReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return BorderInfoReq;
    })();

    roleInfo.BorderInfoList = (function() {

        function BorderInfoList(p) {
            this.list = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        BorderInfoList.prototype.list = $util.emptyArray;

        BorderInfoList.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.list != null && m.list.length) {
                for (var i = 0; i < m.list.length; ++i)
                    $root.roleInfo.BorderInfo.encode(m.list[i], w.uint32(10).fork()).ldelim();
            }
            return w;
        };

        BorderInfoList.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.BorderInfoList();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        if (!(m.list && m.list.length))
                            m.list = [];
                        m.list.push($root.roleInfo.BorderInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return BorderInfoList;
    })();

    roleInfo.BorderInfo = (function() {

        function BorderInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        BorderInfo.prototype.bno = 0;
        BorderInfo.prototype.url = "";
        BorderInfo.prototype.name = "";
        BorderInfo.prototype.expireTime = 0;
        BorderInfo.prototype.src = 0;
        BorderInfo.prototype.status = false;

        BorderInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.bno != null && Object.hasOwnProperty.call(m, "bno"))
                w.uint32(8).uint32(m.bno);
            if (m.url != null && Object.hasOwnProperty.call(m, "url"))
                w.uint32(18).string(m.url);
            if (m.name != null && Object.hasOwnProperty.call(m, "name"))
                w.uint32(26).string(m.name);
            if (m.expireTime != null && Object.hasOwnProperty.call(m, "expireTime"))
                w.uint32(32).uint32(m.expireTime);
            if (m.src != null && Object.hasOwnProperty.call(m, "src"))
                w.uint32(40).int32(m.src);
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(48).bool(m.status);
            return w;
        };

        BorderInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.BorderInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.bno = r.uint32();
                        break;
                    }
                case 2: {
                        m.url = r.string();
                        break;
                    }
                case 3: {
                        m.name = r.string();
                        break;
                    }
                case 4: {
                        m.expireTime = r.uint32();
                        break;
                    }
                case 5: {
                        m.src = r.int32();
                        break;
                    }
                case 6: {
                        m.status = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return BorderInfo;
    })();

    roleInfo.SetNameStatus = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "NAME_SUCCESS"] = 0;
        values[valuesById[1] = "NAME_EXIST"] = 1;
        values[valuesById[2] = "NAME_OUTS_OF_TIMES"] = 2;
        return values;
    })();

    roleInfo.BorderSRC = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "DEFAULT"] = 0;
        values[valuesById[1] = "ACTIVITY"] = 1;
        values[valuesById[2] = "OTHER"] = 2;
        return values;
    })();

    roleInfo.SetBorderReq = (function() {

        function SetBorderReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SetBorderReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        SetBorderReq.prototype.bno = 0;

        SetBorderReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.bno != null && Object.hasOwnProperty.call(m, "bno"))
                w.uint32(16).uint32(m.bno);
            return w;
        };

        SetBorderReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.SetBorderReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.bno = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SetBorderReq;
    })();

    roleInfo.SetBorderResp = (function() {

        function SetBorderResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SetBorderResp.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        SetBorderResp.prototype.bno = 0;

        SetBorderResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.bno != null && Object.hasOwnProperty.call(m, "bno"))
                w.uint32(16).uint32(m.bno);
            return w;
        };

        SetBorderResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.SetBorderResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.bno = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SetBorderResp;
    })();

    roleInfo.SetResp = (function() {

        function SetResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SetResp.prototype.status = false;

        SetResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(8).bool(m.status);
            return w;
        };

        SetResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.SetResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.status = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SetResp;
    })();

    roleInfo.RoleJsonDataReq = (function() {

        function RoleJsonDataReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        RoleJsonDataReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        RoleJsonDataReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            return w;
        };

        RoleJsonDataReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.RoleJsonDataReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return RoleJsonDataReq;
    })();

    roleInfo.RoleJsonDataResp = (function() {

        function RoleJsonDataResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        RoleJsonDataResp.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        RoleJsonDataResp.prototype.jsonData = "";

        RoleJsonDataResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).int64(m.userID);
            if (m.jsonData != null && Object.hasOwnProperty.call(m, "jsonData"))
                w.uint32(18).string(m.jsonData);
            return w;
        };

        RoleJsonDataResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.RoleJsonDataResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.int64();
                        break;
                    }
                case 2: {
                        m.jsonData = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return RoleJsonDataResp;
    })();

    roleInfo.RoleJsonDataSettingReq = (function() {

        function RoleJsonDataSettingReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        RoleJsonDataSettingReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        RoleJsonDataSettingReq.prototype.jsonData = "";

        RoleJsonDataSettingReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.jsonData != null && Object.hasOwnProperty.call(m, "jsonData"))
                w.uint32(18).string(m.jsonData);
            return w;
        };

        RoleJsonDataSettingReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.RoleJsonDataSettingReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.jsonData = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return RoleJsonDataSettingReq;
    })();

    roleInfo.RoleJsonDataSettingResp = (function() {

        function RoleJsonDataSettingResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        RoleJsonDataSettingResp.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        RoleJsonDataSettingResp.prototype.jsonData = "";

        RoleJsonDataSettingResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.jsonData != null && Object.hasOwnProperty.call(m, "jsonData"))
                w.uint32(18).string(m.jsonData);
            return w;
        };

        RoleJsonDataSettingResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.RoleJsonDataSettingResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.jsonData = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return RoleJsonDataSettingResp;
    })();

    roleInfo.SendReward = (function() {

        function SendReward(p) {
            this.list = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SendReward.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        SendReward.prototype.list = $util.emptyArray;

        SendReward.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.list != null && m.list.length) {
                for (var i = 0; i < m.list.length; ++i)
                    $root.roleInfo.RewardContent.encode(m.list[i], w.uint32(18).fork()).ldelim();
            }
            return w;
        };

        SendReward.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.SendReward();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        if (!(m.list && m.list.length))
                            m.list = [];
                        m.list.push($root.roleInfo.RewardContent.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SendReward;
    })();

    roleInfo.RewardContent = (function() {

        function RewardContent(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        RewardContent.prototype.itemId = 0;
        RewardContent.prototype.itemNum = 0;

        RewardContent.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.itemId != null && Object.hasOwnProperty.call(m, "itemId"))
                w.uint32(8).uint32(m.itemId);
            if (m.itemNum != null && Object.hasOwnProperty.call(m, "itemNum"))
                w.uint32(16).uint32(m.itemNum);
            return w;
        };

        RewardContent.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.RewardContent();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.itemId = r.uint32();
                        break;
                    }
                case 2: {
                        m.itemNum = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return RewardContent;
    })();

    roleInfo.SetBankAccountReq = (function() {

        function SetBankAccountReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SetBankAccountReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        SetBankAccountReq.prototype.bankAccountName = "";
        SetBankAccountReq.prototype.bankName = "";
        SetBankAccountReq.prototype.subBankName = "";
        SetBankAccountReq.prototype.bankCardNo = "";

        SetBankAccountReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.bankAccountName != null && Object.hasOwnProperty.call(m, "bankAccountName"))
                w.uint32(18).string(m.bankAccountName);
            if (m.bankName != null && Object.hasOwnProperty.call(m, "bankName"))
                w.uint32(26).string(m.bankName);
            if (m.subBankName != null && Object.hasOwnProperty.call(m, "subBankName"))
                w.uint32(34).string(m.subBankName);
            if (m.bankCardNo != null && Object.hasOwnProperty.call(m, "bankCardNo"))
                w.uint32(42).string(m.bankCardNo);
            return w;
        };

        SetBankAccountReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.SetBankAccountReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.bankAccountName = r.string();
                        break;
                    }
                case 3: {
                        m.bankName = r.string();
                        break;
                    }
                case 4: {
                        m.subBankName = r.string();
                        break;
                    }
                case 5: {
                        m.bankCardNo = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SetBankAccountReq;
    })();

    roleInfo.SetBankAccountResp = (function() {

        function SetBankAccountResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SetBankAccountResp.prototype.status = false;

        SetBankAccountResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(8).bool(m.status);
            return w;
        };

        SetBankAccountResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.SetBankAccountResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.status = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SetBankAccountResp;
    })();

    roleInfo.GetBankAccountReq = (function() {

        function GetBankAccountReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetBankAccountReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        GetBankAccountReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            return w;
        };

        GetBankAccountReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.GetBankAccountReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetBankAccountReq;
    })();

    roleInfo.GetBankAccountResp = (function() {

        function GetBankAccountResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetBankAccountResp.prototype.status = false;
        GetBankAccountResp.prototype.bankAccountName = "";
        GetBankAccountResp.prototype.bankName = "";
        GetBankAccountResp.prototype.subBankName = "";
        GetBankAccountResp.prototype.bankCardNo = "";

        GetBankAccountResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(8).bool(m.status);
            if (m.bankAccountName != null && Object.hasOwnProperty.call(m, "bankAccountName"))
                w.uint32(18).string(m.bankAccountName);
            if (m.bankName != null && Object.hasOwnProperty.call(m, "bankName"))
                w.uint32(26).string(m.bankName);
            if (m.subBankName != null && Object.hasOwnProperty.call(m, "subBankName"))
                w.uint32(34).string(m.subBankName);
            if (m.bankCardNo != null && Object.hasOwnProperty.call(m, "bankCardNo"))
                w.uint32(42).string(m.bankCardNo);
            return w;
        };

        GetBankAccountResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.roleInfo.GetBankAccountResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.status = r.bool();
                        break;
                    }
                case 2: {
                        m.bankAccountName = r.string();
                        break;
                    }
                case 3: {
                        m.bankName = r.string();
                        break;
                    }
                case 4: {
                        m.subBankName = r.string();
                        break;
                    }
                case 5: {
                        m.bankCardNo = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetBankAccountResp;
    })();

    roleInfo.RoleInfoCode = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UNSPECIFIED"] = 0;
        values[valuesById[11000] = "GET_SIMPLE_INFO"] = 11000;
        values[valuesById[11001] = "ROLE_GAME_INFO"] = 11001;
        values[valuesById[11002] = "GET_INFO"] = 11002;
        values[valuesById[11003] = "SET_AVATAR_INFO"] = 11003;
        values[valuesById[11004] = "SET_NAME_INFO"] = 11004;
        values[valuesById[11005] = "SET_BORDER_INFO"] = 11005;
        values[valuesById[11006] = "REQ_JSON_DATA"] = 11006;
        values[valuesById[11007] = "SET_JSON_DATA"] = 11007;
        values[valuesById[11008] = "SET_BANKACCOUNT"] = 11008;
        values[valuesById[11009] = "GET_BANKACCOUNT"] = 11009;
        return values;
    })();

    return roleInfo;
})();

$root.turntable = (function() {

    var turntable = {};

    turntable.TurnTableInfoReq = (function() {

        function TurnTableInfoReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        TurnTableInfoReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        TurnTableInfoReq.prototype.type = 0;

        TurnTableInfoReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.type != null && Object.hasOwnProperty.call(m, "type"))
                w.uint32(16).int32(m.type);
            return w;
        };

        TurnTableInfoReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.turntable.TurnTableInfoReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.type = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return TurnTableInfoReq;
    })();

    turntable.TurnTableType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "NORMAL"] = 0;
        values[valuesById[1] = "SUPER"] = 1;
        values[valuesById[2] = "FREE"] = 2;
        values[valuesById[3] = "SHOP1"] = 3;
        values[valuesById[4] = "SHOP2"] = 4;
        return values;
    })();

    turntable.TurnTableInfoResp = (function() {

        function TurnTableInfoResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        TurnTableInfoResp.prototype.count = 0;
        TurnTableInfoResp.prototype.time = 0;
        TurnTableInfoResp.prototype.freeCount = 0;

        TurnTableInfoResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.count != null && Object.hasOwnProperty.call(m, "count"))
                w.uint32(8).uint32(m.count);
            if (m.time != null && Object.hasOwnProperty.call(m, "time"))
                w.uint32(16).uint32(m.time);
            if (m.freeCount != null && Object.hasOwnProperty.call(m, "freeCount"))
                w.uint32(24).uint32(m.freeCount);
            return w;
        };

        TurnTableInfoResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.turntable.TurnTableInfoResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.count = r.uint32();
                        break;
                    }
                case 2: {
                        m.time = r.uint32();
                        break;
                    }
                case 3: {
                        m.freeCount = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return TurnTableInfoResp;
    })();

    turntable.TurnTableReq = (function() {

        function TurnTableReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        TurnTableReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        TurnTableReq.prototype.type = 0;

        TurnTableReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.type != null && Object.hasOwnProperty.call(m, "type"))
                w.uint32(16).int32(m.type);
            return w;
        };

        TurnTableReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.turntable.TurnTableReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.type = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return TurnTableReq;
    })();

    turntable.TurnTableResp = (function() {

        function TurnTableResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        TurnTableResp.prototype.count = 0;
        TurnTableResp.prototype.time = 0;
        TurnTableResp.prototype.freeCount = 0;
        TurnTableResp.prototype.money = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        TurnTableResp.prototype.vipAdd = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        TurnTableResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.count != null && Object.hasOwnProperty.call(m, "count"))
                w.uint32(8).uint32(m.count);
            if (m.time != null && Object.hasOwnProperty.call(m, "time"))
                w.uint32(16).uint32(m.time);
            if (m.freeCount != null && Object.hasOwnProperty.call(m, "freeCount"))
                w.uint32(24).uint32(m.freeCount);
            if (m.money != null && Object.hasOwnProperty.call(m, "money"))
                w.uint32(32).uint64(m.money);
            if (m.vipAdd != null && Object.hasOwnProperty.call(m, "vipAdd"))
                w.uint32(40).uint64(m.vipAdd);
            return w;
        };

        TurnTableResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.turntable.TurnTableResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.count = r.uint32();
                        break;
                    }
                case 2: {
                        m.time = r.uint32();
                        break;
                    }
                case 3: {
                        m.freeCount = r.uint32();
                        break;
                    }
                case 4: {
                        m.money = r.uint64();
                        break;
                    }
                case 5: {
                        m.vipAdd = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return TurnTableResp;
    })();

    turntable.ShopTurnTableInfoReq = (function() {

        function ShopTurnTableInfoReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ShopTurnTableInfoReq.prototype.userID = null;

        var $oneOfFields;

        Object.defineProperty(ShopTurnTableInfoReq.prototype, "_userID", {
            get: $util.oneOfGetter($oneOfFields = ["userID"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        ShopTurnTableInfoReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            return w;
        };

        ShopTurnTableInfoReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.turntable.ShopTurnTableInfoReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ShopTurnTableInfoReq;
    })();

    turntable.ShopTurnTable = (function() {

        function ShopTurnTable(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ShopTurnTable.prototype.type = 0;
        ShopTurnTable.prototype.num = 0;

        ShopTurnTable.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.type != null && Object.hasOwnProperty.call(m, "type"))
                w.uint32(8).int32(m.type);
            if (m.num != null && Object.hasOwnProperty.call(m, "num"))
                w.uint32(16).uint32(m.num);
            return w;
        };

        ShopTurnTable.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.turntable.ShopTurnTable();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.type = r.int32();
                        break;
                    }
                case 2: {
                        m.num = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ShopTurnTable;
    })();

    turntable.ShopTurnTableInfoResp = (function() {

        function ShopTurnTableInfoResp(p) {
            this.list = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ShopTurnTableInfoResp.prototype.list = $util.emptyArray;

        ShopTurnTableInfoResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.list != null && m.list.length) {
                for (var i = 0; i < m.list.length; ++i)
                    $root.turntable.ShopTurnTable.encode(m.list[i], w.uint32(10).fork()).ldelim();
            }
            return w;
        };

        ShopTurnTableInfoResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.turntable.ShopTurnTableInfoResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        if (!(m.list && m.list.length))
                            m.list = [];
                        m.list.push($root.turntable.ShopTurnTable.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ShopTurnTableInfoResp;
    })();

    turntable.ShopTurnTableResp = (function() {

        function ShopTurnTableResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ShopTurnTableResp.prototype.type = 0;
        ShopTurnTableResp.prototype.num = 0;
        ShopTurnTableResp.prototype.money = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        ShopTurnTableResp.prototype.vipAdd = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        ShopTurnTableResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.type != null && Object.hasOwnProperty.call(m, "type"))
                w.uint32(8).int32(m.type);
            if (m.num != null && Object.hasOwnProperty.call(m, "num"))
                w.uint32(16).uint32(m.num);
            if (m.money != null && Object.hasOwnProperty.call(m, "money"))
                w.uint32(32).uint64(m.money);
            if (m.vipAdd != null && Object.hasOwnProperty.call(m, "vipAdd"))
                w.uint32(40).uint64(m.vipAdd);
            return w;
        };

        ShopTurnTableResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.turntable.ShopTurnTableResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.type = r.int32();
                        break;
                    }
                case 2: {
                        m.num = r.uint32();
                        break;
                    }
                case 4: {
                        m.money = r.uint64();
                        break;
                    }
                case 5: {
                        m.vipAdd = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ShopTurnTableResp;
    })();

    turntable.ShopTurnTableBuyCounterReq = (function() {

        function ShopTurnTableBuyCounterReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ShopTurnTableBuyCounterReq.prototype.userID = null;

        var $oneOfFields;

        Object.defineProperty(ShopTurnTableBuyCounterReq.prototype, "_userID", {
            get: $util.oneOfGetter($oneOfFields = ["userID"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        ShopTurnTableBuyCounterReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            return w;
        };

        ShopTurnTableBuyCounterReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.turntable.ShopTurnTableBuyCounterReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ShopTurnTableBuyCounterReq;
    })();

    turntable.ShopTurnTableBuyCounterResp = (function() {

        function ShopTurnTableBuyCounterResp(p) {
            this.list = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ShopTurnTableBuyCounterResp.prototype.list = $util.emptyArray;

        ShopTurnTableBuyCounterResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.list != null && m.list.length) {
                for (var i = 0; i < m.list.length; ++i)
                    $root.turntable.ShopTurnTableBuyCounter.encode(m.list[i], w.uint32(10).fork()).ldelim();
            }
            return w;
        };

        ShopTurnTableBuyCounterResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.turntable.ShopTurnTableBuyCounterResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        if (!(m.list && m.list.length))
                            m.list = [];
                        m.list.push($root.turntable.ShopTurnTableBuyCounter.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ShopTurnTableBuyCounterResp;
    })();

    turntable.ShopTurnTableBuyCounter = (function() {

        function ShopTurnTableBuyCounter(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ShopTurnTableBuyCounter.prototype.type = 0;
        ShopTurnTableBuyCounter.prototype.num = 0;

        ShopTurnTableBuyCounter.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.type != null && Object.hasOwnProperty.call(m, "type"))
                w.uint32(8).int32(m.type);
            if (m.num != null && Object.hasOwnProperty.call(m, "num"))
                w.uint32(16).uint32(m.num);
            return w;
        };

        ShopTurnTableBuyCounter.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.turntable.ShopTurnTableBuyCounter();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.type = r.int32();
                        break;
                    }
                case 2: {
                        m.num = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ShopTurnTableBuyCounter;
    })();

    turntable.TurnTableCode = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "NONE"] = 0;
        values[valuesById[13000] = "GET_FREE_INFO"] = 13000;
        values[valuesById[13001] = "FREE_REQ"] = 13001;
        values[valuesById[13002] = "GET_SHOP_INFO"] = 13002;
        values[valuesById[13003] = "SHOP_REQ"] = 13003;
        values[valuesById[13004] = "BUY_COUNTER_REQ"] = 13004;
        return values;
    })();

    return turntable;
})();

$root.push = (function() {

    var push = {};

    push.InventoryChange = (function() {

        function InventoryChange(p) {
            this.info = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        InventoryChange.prototype.info = $util.emptyArray;
        InventoryChange.prototype.reason = 0;

        InventoryChange.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.info != null && m.info.length) {
                for (var i = 0; i < m.info.length; ++i)
                    $root.bag.itemInfo.encode(m.info[i], w.uint32(10).fork()).ldelim();
            }
            if (m.reason != null && Object.hasOwnProperty.call(m, "reason"))
                w.uint32(16).int32(m.reason);
            return w;
        };

        InventoryChange.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.push.InventoryChange();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        if (!(m.info && m.info.length))
                            m.info = [];
                        m.info.push($root.bag.itemInfo.decode(r, r.uint32()));
                        break;
                    }
                case 2: {
                        m.reason = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return InventoryChange;
    })();

    push.InfoType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "TEMPLATE"] = 0;
        values[valuesById[1] = "EVENT"] = 1;
        values[valuesById[2] = "MAIL"] = 2;
        values[valuesById[3] = "VIP"] = 3;
        return values;
    })();

    push.InfoChange = (function() {

        function InfoChange(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        InfoChange.prototype.infoType = 0;
        InfoChange.prototype.data = $util.newBuffer([]);
        InfoChange.prototype.opCode = 0;

        InfoChange.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.infoType != null && Object.hasOwnProperty.call(m, "infoType"))
                w.uint32(8).int32(m.infoType);
            if (m.data != null && Object.hasOwnProperty.call(m, "data"))
                w.uint32(18).bytes(m.data);
            if (m.opCode != null && Object.hasOwnProperty.call(m, "opCode"))
                w.uint32(24).int32(m.opCode);
            return w;
        };

        InfoChange.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.push.InfoChange();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.infoType = r.int32();
                        break;
                    }
                case 2: {
                        m.data = r.bytes();
                        break;
                    }
                case 3: {
                        m.opCode = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return InfoChange;
    })();

    push.PushStatus = (function() {

        function PushStatus(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        PushStatus.prototype.status = false;

        PushStatus.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(8).bool(m.status);
            return w;
        };

        PushStatus.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.push.PushStatus();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.status = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return PushStatus;
    })();

    push.PushData = (function() {

        function PushData(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        PushData.prototype.toUid = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        PushData.prototype.zone = 0;
        PushData.prototype.opCode = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        PushData.prototype.protoData = $util.newBuffer([]);

        PushData.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.toUid != null && Object.hasOwnProperty.call(m, "toUid"))
                w.uint32(8).int64(m.toUid);
            if (m.zone != null && Object.hasOwnProperty.call(m, "zone"))
                w.uint32(16).int32(m.zone);
            if (m.opCode != null && Object.hasOwnProperty.call(m, "opCode"))
                w.uint32(24).int64(m.opCode);
            if (m.protoData != null && Object.hasOwnProperty.call(m, "protoData"))
                w.uint32(34).bytes(m.protoData);
            return w;
        };

        PushData.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.push.PushData();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.toUid = r.int64();
                        break;
                    }
                case 2: {
                        m.zone = r.int32();
                        break;
                    }
                case 3: {
                        m.opCode = r.int64();
                        break;
                    }
                case 4: {
                        m.protoData = r.bytes();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return PushData;
    })();

    push.PushZone = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "PERSON"] = 0;
        values[valuesById[1] = "ROOM"] = 1;
        values[valuesById[2] = "HALL"] = 2;
        values[valuesById[3] = "MTT"] = 3;
        return values;
    })();

    push.MoneyChange = (function() {

        function MoneyChange(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        MoneyChange.prototype.toUid = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        MoneyChange.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.toUid != null && Object.hasOwnProperty.call(m, "toUid"))
                w.uint32(8).int64(m.toUid);
            return w;
        };

        MoneyChange.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.push.MoneyChange();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.toUid = r.int64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return MoneyChange;
    })();

    push.PushCode = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UNSPECIFIED"] = 0;
        values[valuesById[14000] = "INVENTORY_CHANGE"] = 14000;
        values[valuesById[14001] = "INFO_CHANGE"] = 14001;
        return values;
    })();

    return push;
})();

$root.bag = (function() {

    var bag = {};

    bag.pbGetBag = (function() {

        function pbGetBag(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbGetBag.prototype.roleId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        pbGetBag.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            return w;
        };

        pbGetBag.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.bag.pbGetBag();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbGetBag;
    })();

    bag.pbBagInfo = (function() {

        function pbBagInfo(p) {
            this.list = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbBagInfo.prototype.roleId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        pbBagInfo.prototype.list = $util.emptyArray;

        pbBagInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            if (m.list != null && m.list.length) {
                for (var i = 0; i < m.list.length; ++i)
                    $root.bag.itemInfo.encode(m.list[i], w.uint32(18).fork()).ldelim();
            }
            return w;
        };

        pbBagInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.bag.pbBagInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                case 2: {
                        if (!(m.list && m.list.length))
                            m.list = [];
                        m.list.push($root.bag.itemInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbBagInfo;
    })();

    bag.itemInfo = (function() {

        function itemInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        itemInfo.prototype.boxId = 0;
        itemInfo.prototype.itemId = 0;
        itemInfo.prototype.num = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        itemInfo.prototype.ExpTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        itemInfo.prototype.jsonData = "";

        itemInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.boxId != null && Object.hasOwnProperty.call(m, "boxId"))
                w.uint32(8).uint32(m.boxId);
            if (m.itemId != null && Object.hasOwnProperty.call(m, "itemId"))
                w.uint32(16).uint32(m.itemId);
            if (m.num != null && Object.hasOwnProperty.call(m, "num"))
                w.uint32(24).uint64(m.num);
            if (m.ExpTime != null && Object.hasOwnProperty.call(m, "ExpTime"))
                w.uint32(32).uint64(m.ExpTime);
            if (m.jsonData != null && Object.hasOwnProperty.call(m, "jsonData"))
                w.uint32(42).string(m.jsonData);
            return w;
        };

        itemInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.bag.itemInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.boxId = r.uint32();
                        break;
                    }
                case 2: {
                        m.itemId = r.uint32();
                        break;
                    }
                case 3: {
                        m.num = r.uint64();
                        break;
                    }
                case 4: {
                        m.ExpTime = r.uint64();
                        break;
                    }
                case 5: {
                        m.jsonData = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return itemInfo;
    })();

    bag.pbOpBagItemList = (function() {

        function pbOpBagItemList(p) {
            this.list = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbOpBagItemList.prototype.roleId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        pbOpBagItemList.prototype.list = $util.emptyArray;
        pbOpBagItemList.prototype.reason = 0;

        pbOpBagItemList.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            if (m.list != null && m.list.length) {
                for (var i = 0; i < m.list.length; ++i)
                    $root.bag.opBagItem.encode(m.list[i], w.uint32(18).fork()).ldelim();
            }
            if (m.reason != null && Object.hasOwnProperty.call(m, "reason"))
                w.uint32(24).int32(m.reason);
            return w;
        };

        pbOpBagItemList.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.bag.pbOpBagItemList();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                case 2: {
                        if (!(m.list && m.list.length))
                            m.list = [];
                        m.list.push($root.bag.opBagItem.decode(r, r.uint32()));
                        break;
                    }
                case 3: {
                        m.reason = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbOpBagItemList;
    })();

    bag.opBagItem = (function() {

        function opBagItem(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        opBagItem.prototype.itemId = 0;
        opBagItem.prototype.num = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        opBagItem.prototype.expTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        opBagItem.prototype.jsonData = "";

        opBagItem.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.itemId != null && Object.hasOwnProperty.call(m, "itemId"))
                w.uint32(16).uint32(m.itemId);
            if (m.num != null && Object.hasOwnProperty.call(m, "num"))
                w.uint32(24).int64(m.num);
            if (m.expTime != null && Object.hasOwnProperty.call(m, "expTime"))
                w.uint32(32).uint64(m.expTime);
            if (m.jsonData != null && Object.hasOwnProperty.call(m, "jsonData"))
                w.uint32(42).string(m.jsonData);
            return w;
        };

        opBagItem.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.bag.opBagItem();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 2: {
                        m.itemId = r.uint32();
                        break;
                    }
                case 3: {
                        m.num = r.int64();
                        break;
                    }
                case 4: {
                        m.expTime = r.uint64();
                        break;
                    }
                case 5: {
                        m.jsonData = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return opBagItem;
    })();

    bag.pbStatus = (function() {

        function pbStatus(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbStatus.prototype.status = false;

        pbStatus.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(8).bool(m.status);
            return w;
        };

        pbStatus.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.bag.pbStatus();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.status = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbStatus;
    })();

    bag.pbGetItem = (function() {

        function pbGetItem(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbGetItem.prototype.roleId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        pbGetItem.prototype.itemId = 0;

        pbGetItem.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            if (m.itemId != null && Object.hasOwnProperty.call(m, "itemId"))
                w.uint32(16).uint32(m.itemId);
            return w;
        };

        pbGetItem.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.bag.pbGetItem();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                case 2: {
                        m.itemId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbGetItem;
    })();

    bag.pbGetItemTypeReq = (function() {

        function pbGetItemTypeReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbGetItemTypeReq.prototype.roleId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        pbGetItemTypeReq.prototype.itemType = 0;

        pbGetItemTypeReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            if (m.itemType != null && Object.hasOwnProperty.call(m, "itemType"))
                w.uint32(16).int32(m.itemType);
            return w;
        };

        pbGetItemTypeReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.bag.pbGetItemTypeReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                case 2: {
                        m.itemType = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbGetItemTypeReq;
    })();

    bag.pbGetItemTypeRes = (function() {

        function pbGetItemTypeRes(p) {
            this.list = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbGetItemTypeRes.prototype.roleId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        pbGetItemTypeRes.prototype.itemType = 0;
        pbGetItemTypeRes.prototype.list = $util.emptyArray;

        pbGetItemTypeRes.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            if (m.itemType != null && Object.hasOwnProperty.call(m, "itemType"))
                w.uint32(16).int32(m.itemType);
            if (m.list != null && m.list.length) {
                for (var i = 0; i < m.list.length; ++i)
                    $root.bag.itemInfo.encode(m.list[i], w.uint32(26).fork()).ldelim();
            }
            return w;
        };

        pbGetItemTypeRes.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.bag.pbGetItemTypeRes();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                case 2: {
                        m.itemType = r.int32();
                        break;
                    }
                case 3: {
                        if (!(m.list && m.list.length))
                            m.list = [];
                        m.list.push($root.bag.itemInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbGetItemTypeRes;
    })();

    bag.BagCode = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "BROADCAST_INIT"] = 0;
        values[valuesById[64001] = "GET_BAG_LIST"] = 64001;
        return values;
    })();

    bag.ItemType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "DEFAUL_TYPE"] = 0;
        values[valuesById[11] = "HEAD_PORTRAIT_BOX"] = 11;
        values[valuesById[12] = "POKER_BACK"] = 12;
        values[valuesById[13] = "HEAD_PIC"] = 13;
        return values;
    })();

    bag.ChangeReason = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "DEFAULT"] = 0;
        values[valuesById[1] = "REGISTER"] = 1;
        values[valuesById[2] = "CHARGE"] = 2;
        values[valuesById[3] = "CHECKIN"] = 3;
        values[valuesById[4] = "TURNTABLE"] = 4;
        return values;
    })();

    return bag;
})();

$root.vip = (function() {

    var vip = {};

    vip.noticeType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "NONE"] = 0;
        values[valuesById[15005] = "NOTICE_WEEK_PACKET_COUNTER"] = 15005;
        values[valuesById[15006] = "NOTICE_LEVEL_CHARGE"] = 15006;
        values[valuesById[15007] = "NOTICE_VIP_UP"] = 15007;
        values[valuesById[15008] = "NOTICE_VIP_DOWN"] = 15008;
        return values;
    })();

    vip.BorderLevelType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UNSPECIFIED"] = 0;
        values[valuesById[1] = "JUNIOR"] = 1;
        values[valuesById[2] = "ADVANCED"] = 2;
        values[valuesById[3] = "PREMIUM"] = 3;
        return values;
    })();

    vip.UpgradeStatusType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "NOTAVAILABLE"] = 0;
        values[valuesById[1] = "AVAILABLE"] = 1;
        values[valuesById[2] = "ALREADY"] = 2;
        return values;
    })();

    vip.pbType = (function() {

        function pbType(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbType.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        pbType.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            return w;
        };

        pbType.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.vip.pbType();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbType;
    })();

    vip.VipStatus = (function() {

        function VipStatus(p) {
            this.config = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        VipStatus.prototype.level = 0;
        VipStatus.prototype.vipInfoUrl = "";
        VipStatus.prototype.value = 0;
        VipStatus.prototype.limit = 0;
        VipStatus.prototype.config = $util.emptyArray;

        VipStatus.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.level != null && Object.hasOwnProperty.call(m, "level"))
                w.uint32(8).uint32(m.level);
            if (m.vipInfoUrl != null && Object.hasOwnProperty.call(m, "vipInfoUrl"))
                w.uint32(18).string(m.vipInfoUrl);
            if (m.value != null && Object.hasOwnProperty.call(m, "value"))
                w.uint32(24).uint32(m.value);
            if (m.limit != null && Object.hasOwnProperty.call(m, "limit"))
                w.uint32(32).uint32(m.limit);
            if (m.config != null && m.config.length) {
                for (var i = 0; i < m.config.length; ++i)
                    $root.vip.vipConfig.encode(m.config[i], w.uint32(42).fork()).ldelim();
            }
            return w;
        };

        VipStatus.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.vip.VipStatus();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.level = r.uint32();
                        break;
                    }
                case 2: {
                        m.vipInfoUrl = r.string();
                        break;
                    }
                case 3: {
                        m.value = r.uint32();
                        break;
                    }
                case 4: {
                        m.limit = r.uint32();
                        break;
                    }
                case 5: {
                        if (!(m.config && m.config.length))
                            m.config = [];
                        m.config.push($root.vip.vipConfig.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return VipStatus;
    })();

    vip.vipConfig = (function() {

        function vipConfig(p) {
            this.upgradeList = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        vipConfig.prototype.level = 0;
        vipConfig.prototype.loginBuff = 0;
        vipConfig.prototype.turnBuff = 0;
        vipConfig.prototype.weekCounter = 0;
        vipConfig.prototype.alreadyBuyWeekCounter = 0;
        vipConfig.prototype.isHide = false;
        vipConfig.prototype.borderLevel = 0;
        vipConfig.prototype.upgradeStatus = 0;
        vipConfig.prototype.upgradeList = $util.emptyArray;
        vipConfig.prototype.weekPacketId = 0;

        vipConfig.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.level != null && Object.hasOwnProperty.call(m, "level"))
                w.uint32(8).uint32(m.level);
            if (m.loginBuff != null && Object.hasOwnProperty.call(m, "loginBuff"))
                w.uint32(16).uint32(m.loginBuff);
            if (m.turnBuff != null && Object.hasOwnProperty.call(m, "turnBuff"))
                w.uint32(24).uint32(m.turnBuff);
            if (m.weekCounter != null && Object.hasOwnProperty.call(m, "weekCounter"))
                w.uint32(32).uint32(m.weekCounter);
            if (m.alreadyBuyWeekCounter != null && Object.hasOwnProperty.call(m, "alreadyBuyWeekCounter"))
                w.uint32(40).uint32(m.alreadyBuyWeekCounter);
            if (m.isHide != null && Object.hasOwnProperty.call(m, "isHide"))
                w.uint32(48).bool(m.isHide);
            if (m.borderLevel != null && Object.hasOwnProperty.call(m, "borderLevel"))
                w.uint32(56).int32(m.borderLevel);
            if (m.upgradeStatus != null && Object.hasOwnProperty.call(m, "upgradeStatus"))
                w.uint32(64).int32(m.upgradeStatus);
            if (m.upgradeList != null && m.upgradeList.length) {
                for (var i = 0; i < m.upgradeList.length; ++i)
                    $root.vip.upgradePacket.encode(m.upgradeList[i], w.uint32(74).fork()).ldelim();
            }
            if (m.weekPacketId != null && Object.hasOwnProperty.call(m, "weekPacketId"))
                w.uint32(80).uint32(m.weekPacketId);
            return w;
        };

        vipConfig.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.vip.vipConfig();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.level = r.uint32();
                        break;
                    }
                case 2: {
                        m.loginBuff = r.uint32();
                        break;
                    }
                case 3: {
                        m.turnBuff = r.uint32();
                        break;
                    }
                case 4: {
                        m.weekCounter = r.uint32();
                        break;
                    }
                case 5: {
                        m.alreadyBuyWeekCounter = r.uint32();
                        break;
                    }
                case 6: {
                        m.isHide = r.bool();
                        break;
                    }
                case 7: {
                        m.borderLevel = r.int32();
                        break;
                    }
                case 8: {
                        m.upgradeStatus = r.int32();
                        break;
                    }
                case 9: {
                        if (!(m.upgradeList && m.upgradeList.length))
                            m.upgradeList = [];
                        m.upgradeList.push($root.vip.upgradePacket.decode(r, r.uint32()));
                        break;
                    }
                case 10: {
                        m.weekPacketId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return vipConfig;
    })();

    vip.upgradePacket = (function() {

        function upgradePacket(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        upgradePacket.prototype.packetId = 0;
        upgradePacket.prototype.packetNum = 0;

        upgradePacket.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.packetId != null && Object.hasOwnProperty.call(m, "packetId"))
                w.uint32(8).uint32(m.packetId);
            if (m.packetNum != null && Object.hasOwnProperty.call(m, "packetNum"))
                w.uint32(16).uint32(m.packetNum);
            return w;
        };

        upgradePacket.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.vip.upgradePacket();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.packetId = r.uint32();
                        break;
                    }
                case 2: {
                        m.packetNum = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return upgradePacket;
    })();

    vip.upgradePacketReq = (function() {

        function upgradePacketReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        upgradePacketReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        upgradePacketReq.prototype.level = 0;

        upgradePacketReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.level != null && Object.hasOwnProperty.call(m, "level"))
                w.uint32(16).uint32(m.level);
            return w;
        };

        upgradePacketReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.vip.upgradePacketReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.level = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return upgradePacketReq;
    })();

    vip.upgradePacketResp = (function() {

        function upgradePacketResp(p) {
            this.upgradeList = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        upgradePacketResp.prototype.level = 0;
        upgradePacketResp.prototype.upgradeList = $util.emptyArray;

        upgradePacketResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.level != null && Object.hasOwnProperty.call(m, "level"))
                w.uint32(8).uint32(m.level);
            if (m.upgradeList != null && m.upgradeList.length) {
                for (var i = 0; i < m.upgradeList.length; ++i)
                    $root.vip.upgradePacket.encode(m.upgradeList[i], w.uint32(18).fork()).ldelim();
            }
            return w;
        };

        upgradePacketResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.vip.upgradePacketResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.level = r.uint32();
                        break;
                    }
                case 2: {
                        if (!(m.upgradeList && m.upgradeList.length))
                            m.upgradeList = [];
                        m.upgradeList.push($root.vip.upgradePacket.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return upgradePacketResp;
    })();

    vip.noticeVipUpgrade = (function() {

        function noticeVipUpgrade(p) {
            this.upgradeList = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        noticeVipUpgrade.prototype.level = 0;
        noticeVipUpgrade.prototype.loginBuff = 0;
        noticeVipUpgrade.prototype.turnBuff = 0;
        noticeVipUpgrade.prototype.weekCounter = 0;
        noticeVipUpgrade.prototype.borderLevel = 0;
        noticeVipUpgrade.prototype.upgradeStatus = 0;
        noticeVipUpgrade.prototype.upgradeList = $util.emptyArray;
        noticeVipUpgrade.prototype.weekPacketId = 0;

        noticeVipUpgrade.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.level != null && Object.hasOwnProperty.call(m, "level"))
                w.uint32(8).uint32(m.level);
            if (m.loginBuff != null && Object.hasOwnProperty.call(m, "loginBuff"))
                w.uint32(16).uint32(m.loginBuff);
            if (m.turnBuff != null && Object.hasOwnProperty.call(m, "turnBuff"))
                w.uint32(24).uint32(m.turnBuff);
            if (m.weekCounter != null && Object.hasOwnProperty.call(m, "weekCounter"))
                w.uint32(32).uint32(m.weekCounter);
            if (m.borderLevel != null && Object.hasOwnProperty.call(m, "borderLevel"))
                w.uint32(40).int32(m.borderLevel);
            if (m.upgradeStatus != null && Object.hasOwnProperty.call(m, "upgradeStatus"))
                w.uint32(48).int32(m.upgradeStatus);
            if (m.upgradeList != null && m.upgradeList.length) {
                for (var i = 0; i < m.upgradeList.length; ++i)
                    $root.vip.upgradePacket.encode(m.upgradeList[i], w.uint32(58).fork()).ldelim();
            }
            if (m.weekPacketId != null && Object.hasOwnProperty.call(m, "weekPacketId"))
                w.uint32(64).uint32(m.weekPacketId);
            return w;
        };

        noticeVipUpgrade.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.vip.noticeVipUpgrade();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.level = r.uint32();
                        break;
                    }
                case 2: {
                        m.loginBuff = r.uint32();
                        break;
                    }
                case 3: {
                        m.turnBuff = r.uint32();
                        break;
                    }
                case 4: {
                        m.weekCounter = r.uint32();
                        break;
                    }
                case 5: {
                        m.borderLevel = r.int32();
                        break;
                    }
                case 6: {
                        m.upgradeStatus = r.int32();
                        break;
                    }
                case 7: {
                        if (!(m.upgradeList && m.upgradeList.length))
                            m.upgradeList = [];
                        m.upgradeList.push($root.vip.upgradePacket.decode(r, r.uint32()));
                        break;
                    }
                case 8: {
                        m.weekPacketId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return noticeVipUpgrade;
    })();

    vip.noticeVipDowngrade = (function() {

        function noticeVipDowngrade(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        noticeVipDowngrade.prototype.level = 0;
        noticeVipDowngrade.prototype.days = 0;
        noticeVipDowngrade.prototype.status = false;

        noticeVipDowngrade.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.level != null && Object.hasOwnProperty.call(m, "level"))
                w.uint32(8).uint32(m.level);
            if (m.days != null && Object.hasOwnProperty.call(m, "days"))
                w.uint32(16).uint32(m.days);
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(24).bool(m.status);
            return w;
        };

        noticeVipDowngrade.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.vip.noticeVipDowngrade();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.level = r.uint32();
                        break;
                    }
                case 2: {
                        m.days = r.uint32();
                        break;
                    }
                case 3: {
                        m.status = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return noticeVipDowngrade;
    })();

    vip.levelBuff = (function() {

        function levelBuff(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        levelBuff.prototype.level = 0;
        levelBuff.prototype.loginBuff = 0;
        levelBuff.prototype.turnBuff = 0;
        levelBuff.prototype.weekCounter = 0;
        levelBuff.prototype.borderLevel = 0;
        levelBuff.prototype.isHide = false;

        levelBuff.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.level != null && Object.hasOwnProperty.call(m, "level"))
                w.uint32(8).uint32(m.level);
            if (m.loginBuff != null && Object.hasOwnProperty.call(m, "loginBuff"))
                w.uint32(16).uint32(m.loginBuff);
            if (m.turnBuff != null && Object.hasOwnProperty.call(m, "turnBuff"))
                w.uint32(24).uint32(m.turnBuff);
            if (m.weekCounter != null && Object.hasOwnProperty.call(m, "weekCounter"))
                w.uint32(32).uint32(m.weekCounter);
            if (m.borderLevel != null && Object.hasOwnProperty.call(m, "borderLevel"))
                w.uint32(40).int32(m.borderLevel);
            if (m.isHide != null && Object.hasOwnProperty.call(m, "isHide"))
                w.uint32(48).bool(m.isHide);
            return w;
        };

        levelBuff.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.vip.levelBuff();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.level = r.uint32();
                        break;
                    }
                case 2: {
                        m.loginBuff = r.uint32();
                        break;
                    }
                case 3: {
                        m.turnBuff = r.uint32();
                        break;
                    }
                case 4: {
                        m.weekCounter = r.uint32();
                        break;
                    }
                case 5: {
                        m.borderLevel = r.int32();
                        break;
                    }
                case 6: {
                        m.isHide = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return levelBuff;
    })();

    vip.dataHideReq = (function() {

        function dataHideReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        dataHideReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        dataHideReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            return w;
        };

        dataHideReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.vip.dataHideReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return dataHideReq;
    })();

    vip.dataHideResp = (function() {

        function dataHideResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        dataHideResp.prototype.enable = false;

        dataHideResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.enable != null && Object.hasOwnProperty.call(m, "enable"))
                w.uint32(8).bool(m.enable);
            return w;
        };

        dataHideResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.vip.dataHideResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.enable = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return dataHideResp;
    })();

    vip.setDataHideReq = (function() {

        function setDataHideReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        setDataHideReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        setDataHideReq.prototype.enable = false;

        setDataHideReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.enable != null && Object.hasOwnProperty.call(m, "enable"))
                w.uint32(16).bool(m.enable);
            return w;
        };

        setDataHideReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.vip.setDataHideReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.enable = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return setDataHideReq;
    })();

    vip.setDataHideResp = (function() {

        function setDataHideResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        setDataHideResp.prototype.enable = false;

        setDataHideResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.enable != null && Object.hasOwnProperty.call(m, "enable"))
                w.uint32(8).bool(m.enable);
            return w;
        };

        setDataHideResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.vip.setDataHideResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.enable = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return setDataHideResp;
    })();

    vip.noticeWeekPacketCounter = (function() {

        function noticeWeekPacketCounter(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        noticeWeekPacketCounter.prototype.level = 0;
        noticeWeekPacketCounter.prototype.counter = 0;

        noticeWeekPacketCounter.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.level != null && Object.hasOwnProperty.call(m, "level"))
                w.uint32(8).uint32(m.level);
            if (m.counter != null && Object.hasOwnProperty.call(m, "counter"))
                w.uint32(16).uint32(m.counter);
            return w;
        };

        noticeWeekPacketCounter.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.vip.noticeWeekPacketCounter();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.level = r.uint32();
                        break;
                    }
                case 2: {
                        m.counter = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return noticeWeekPacketCounter;
    })();

    vip.noticeLevelCharge = (function() {

        function noticeLevelCharge(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        noticeLevelCharge.prototype.value = 0;
        noticeLevelCharge.prototype.limit = 0;

        noticeLevelCharge.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.value != null && Object.hasOwnProperty.call(m, "value"))
                w.uint32(8).uint32(m.value);
            if (m.limit != null && Object.hasOwnProperty.call(m, "limit"))
                w.uint32(16).uint32(m.limit);
            return w;
        };

        noticeLevelCharge.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.vip.noticeLevelCharge();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.value = r.uint32();
                        break;
                    }
                case 2: {
                        m.limit = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return noticeLevelCharge;
    })();

    vip.updateVipPointReq = (function() {

        function updateVipPointReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        updateVipPointReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        updateVipPointReq.prototype.vipPoint = 0;

        updateVipPointReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.vipPoint != null && Object.hasOwnProperty.call(m, "vipPoint"))
                w.uint32(16).uint32(m.vipPoint);
            return w;
        };

        updateVipPointReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.vip.updateVipPointReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.vipPoint = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return updateVipPointReq;
    })();

    vip.updateResp = (function() {

        function updateResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        updateResp.prototype.status = false;

        updateResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(8).bool(m.status);
            return w;
        };

        updateResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.vip.updateResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.status = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return updateResp;
    })();

    vip.updateWeekPackageReq = (function() {

        function updateWeekPackageReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        updateWeekPackageReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        updateWeekPackageReq.prototype.level = 0;

        updateWeekPackageReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.level != null && Object.hasOwnProperty.call(m, "level"))
                w.uint32(16).uint32(m.level);
            return w;
        };

        updateWeekPackageReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.vip.updateWeekPackageReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.level = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return updateWeekPackageReq;
    })();

    vip.VipCode = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "NONE"] = 0;
        values[valuesById[15001] = "STATUS"] = 15001;
        values[valuesById[15002] = "UPGRADE_PACKAGE"] = 15002;
        values[valuesById[15003] = "DATA_HIDE"] = 15003;
        values[valuesById[15004] = "SET_DATA_HIDE"] = 15004;
        values[valuesById[15005] = "NOTICE_WEEK_PACKAGE_COUNTER"] = 15005;
        values[valuesById[15006] = "NOTICE_VIP_POINT_UPDATE"] = 15006;
        values[valuesById[15007] = "NOTICE_VIP_UPGRADE"] = 15007;
        values[valuesById[15008] = "NOTICE_VIP_DOWNGRADE"] = 15008;
        return values;
    })();

    return vip;
})();

$root.task = (function() {

    var task = {};

    task.TaskType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UNSPECIFIED"] = 0;
        values[valuesById[1] = "TASK_FOLLOW_OP"] = 1;
        values[valuesById[2] = "TASK_RAISE_OP"] = 2;
        values[valuesById[3] = "TASK_WIN_RESULT"] = 3;
        values[valuesById[4] = "TASK_PLAYER_GAME"] = 4;
        values[valuesById[5] = "TASK_ALLIN_OP"] = 5;
        values[valuesById[6] = "TASK_ALLIN_WIN"] = 6;
        values[valuesById[7] = "TASK_LOGIN"] = 7;
        values[valuesById[8] = "TASK_SPE_HANDCARD"] = 8;
        values[valuesById[9] = "TASK_SPE_HANDCARD_WIN"] = 9;
        values[valuesById[10] = "TASK_SPE_HANDLEVEL"] = 10;
        values[valuesById[11] = "TASK_SPE_HANDLEVEL_WIN"] = 11;
        values[valuesById[12] = "TASK_CHARGE_SPE_VALUE"] = 12;
        values[valuesById[13] = "TASK_CHARGE"] = 13;
        values[valuesById[14] = "TASK_PLAYER_SLOTS"] = 14;
        values[valuesById[15] = "TASK_SHARE"] = 15;
        values[valuesById[16] = "TASK_GIVE_GIFT"] = 16;
        values[valuesById[17] = "TASK_WIN_ONCE_CHIP"] = 17;
        return values;
    })();

    task.NLHEGameData = (function() {

        function NLHEGameData(p) {
            this.info = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        NLHEGameData.prototype.id = 0;
        NLHEGameData.prototype.round = 0;
        NLHEGameData.prototype.info = $util.emptyArray;
        NLHEGameData.prototype.phase = 0;

        NLHEGameData.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.id != null && Object.hasOwnProperty.call(m, "id"))
                w.uint32(8).uint32(m.id);
            if (m.round != null && Object.hasOwnProperty.call(m, "round"))
                w.uint32(16).uint32(m.round);
            if (m.info != null && m.info.length) {
                for (var i = 0; i < m.info.length; ++i)
                    $root.task.playerInfo.encode(m.info[i], w.uint32(26).fork()).ldelim();
            }
            if (m.phase != null && Object.hasOwnProperty.call(m, "phase"))
                w.uint32(32).int32(m.phase);
            return w;
        };

        NLHEGameData.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.task.NLHEGameData();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.id = r.uint32();
                        break;
                    }
                case 2: {
                        m.round = r.uint32();
                        break;
                    }
                case 3: {
                        if (!(m.info && m.info.length))
                            m.info = [];
                        m.info.push($root.task.playerInfo.decode(r, r.uint32()));
                        break;
                    }
                case 4: {
                        m.phase = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return NLHEGameData;
    })();

    task.GamePhase = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "PHASE_NONE"] = 0;
        values[valuesById[1] = "PHASE_ACTION"] = 1;
        values[valuesById[2] = "PHASE_BALANCE"] = 2;
        return values;
    })();

    task.playerInfo = (function() {

        function playerInfo(p) {
            this.showCards = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        playerInfo.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        playerInfo.prototype.isWin = false;
        playerInfo.prototype.isALLIN = false;
        playerInfo.prototype.isGiveGift = false;
        playerInfo.prototype.showCards = $util.emptyArray;
        playerInfo.prototype.pokerLev = 0;
        playerInfo.prototype.chipOffset = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        playerInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userId != null && Object.hasOwnProperty.call(m, "userId"))
                w.uint32(8).uint64(m.userId);
            if (m.isWin != null && Object.hasOwnProperty.call(m, "isWin"))
                w.uint32(24).bool(m.isWin);
            if (m.isALLIN != null && Object.hasOwnProperty.call(m, "isALLIN"))
                w.uint32(32).bool(m.isALLIN);
            if (m.isGiveGift != null && Object.hasOwnProperty.call(m, "isGiveGift"))
                w.uint32(40).bool(m.isGiveGift);
            if (m.showCards != null && m.showCards.length) {
                w.uint32(50).fork();
                for (var i = 0; i < m.showCards.length; ++i)
                    w.uint32(m.showCards[i]);
                w.ldelim();
            }
            if (m.pokerLev != null && Object.hasOwnProperty.call(m, "pokerLev"))
                w.uint32(56).int32(m.pokerLev);
            if (m.chipOffset != null && Object.hasOwnProperty.call(m, "chipOffset"))
                w.uint32(64).uint64(m.chipOffset);
            return w;
        };

        playerInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.task.playerInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userId = r.uint64();
                        break;
                    }
                case 3: {
                        m.isWin = r.bool();
                        break;
                    }
                case 4: {
                        m.isALLIN = r.bool();
                        break;
                    }
                case 5: {
                        m.isGiveGift = r.bool();
                        break;
                    }
                case 6: {
                        if (!(m.showCards && m.showCards.length))
                            m.showCards = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.showCards.push(r.uint32());
                        } else
                            m.showCards.push(r.uint32());
                        break;
                    }
                case 7: {
                        m.pokerLev = r.int32();
                        break;
                    }
                case 8: {
                        m.chipOffset = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return playerInfo;
    })();

    task.taskInfoNotice = (function() {

        function taskInfoNotice(p) {
            this.holeCards = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        taskInfoNotice.prototype.type = 0;
        taskInfoNotice.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        taskInfoNotice.prototype.roundNum = 0;
        taskInfoNotice.prototype.value = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        taskInfoNotice.prototype.holeCards = $util.emptyArray;
        taskInfoNotice.prototype.pokerLev = 0;

        taskInfoNotice.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.type != null && Object.hasOwnProperty.call(m, "type"))
                w.uint32(8).int32(m.type);
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(16).uint64(m.userID);
            if (m.roundNum != null && Object.hasOwnProperty.call(m, "roundNum"))
                w.uint32(24).uint32(m.roundNum);
            if (m.value != null && Object.hasOwnProperty.call(m, "value"))
                w.uint32(40).uint64(m.value);
            if (m.holeCards != null && m.holeCards.length) {
                w.uint32(50).fork();
                for (var i = 0; i < m.holeCards.length; ++i)
                    w.uint32(m.holeCards[i]);
                w.ldelim();
            }
            if (m.pokerLev != null && Object.hasOwnProperty.call(m, "pokerLev"))
                w.uint32(56).int32(m.pokerLev);
            return w;
        };

        taskInfoNotice.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.task.taskInfoNotice();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.type = r.int32();
                        break;
                    }
                case 2: {
                        m.userID = r.uint64();
                        break;
                    }
                case 3: {
                        m.roundNum = r.uint32();
                        break;
                    }
                case 5: {
                        m.value = r.uint64();
                        break;
                    }
                case 6: {
                        if (!(m.holeCards && m.holeCards.length))
                            m.holeCards = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.holeCards.push(r.uint32());
                        } else
                            m.holeCards.push(r.uint32());
                        break;
                    }
                case 7: {
                        m.pokerLev = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return taskInfoNotice;
    })();

    task.noticeResp = (function() {

        function noticeResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        noticeResp.prototype.status = false;

        noticeResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(8).bool(m.status);
            return w;
        };

        noticeResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.task.noticeResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.status = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return noticeResp;
    })();

    task.reqUserID = (function() {

        function reqUserID(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        reqUserID.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        reqUserID.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            return w;
        };

        reqUserID.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.task.reqUserID();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return reqUserID;
    })();

    task.respStatus = (function() {

        function respStatus(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        respStatus.prototype.status = false;

        respStatus.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(8).bool(m.status);
            return w;
        };

        respStatus.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.task.respStatus();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.status = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return respStatus;
    })();

    task.reqInfo = (function() {

        function reqInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        reqInfo.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        reqInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            return w;
        };

        reqInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.task.reqInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return reqInfo;
    })();

    task.taskInfo = (function() {

        function taskInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        taskInfo.prototype.taskId = 0;
        taskInfo.prototype.taskNum = 0;
        taskInfo.prototype.taskStatus = 0;

        taskInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.taskId != null && Object.hasOwnProperty.call(m, "taskId"))
                w.uint32(8).int32(m.taskId);
            if (m.taskNum != null && Object.hasOwnProperty.call(m, "taskNum"))
                w.uint32(16).uint32(m.taskNum);
            if (m.taskStatus != null && Object.hasOwnProperty.call(m, "taskStatus"))
                w.uint32(24).int32(m.taskStatus);
            return w;
        };

        taskInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.task.taskInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.taskId = r.int32();
                        break;
                    }
                case 2: {
                        m.taskNum = r.uint32();
                        break;
                    }
                case 3: {
                        m.taskStatus = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return taskInfo;
    })();

    task.taskInfoList = (function() {

        function taskInfoList(p) {
            this.list = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        taskInfoList.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        taskInfoList.prototype.list = $util.emptyArray;
        taskInfoList.prototype.status = 0;

        taskInfoList.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.list != null && m.list.length) {
                for (var i = 0; i < m.list.length; ++i)
                    $root.task.taskInfo.encode(m.list[i], w.uint32(18).fork()).ldelim();
            }
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(24).int32(m.status);
            return w;
        };

        taskInfoList.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.task.taskInfoList();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        if (!(m.list && m.list.length))
                            m.list = [];
                        m.list.push($root.task.taskInfo.decode(r, r.uint32()));
                        break;
                    }
                case 3: {
                        m.status = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return taskInfoList;
    })();

    task.rewardClaimReq = (function() {

        function rewardClaimReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        rewardClaimReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        rewardClaimReq.prototype.taskId = 0;

        rewardClaimReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.taskId != null && Object.hasOwnProperty.call(m, "taskId"))
                w.uint32(16).int32(m.taskId);
            return w;
        };

        rewardClaimReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.task.rewardClaimReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.taskId = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return rewardClaimReq;
    })();

    task.rewardClaimResp = (function() {

        function rewardClaimResp(p) {
            this.rewardTaskList = [];
            this.list = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        rewardClaimResp.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        rewardClaimResp.prototype.rewardTaskList = $util.emptyArray;
        rewardClaimResp.prototype.list = $util.emptyArray;
        rewardClaimResp.prototype.status = 0;

        rewardClaimResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.rewardTaskList != null && m.rewardTaskList.length) {
                w.uint32(18).fork();
                for (var i = 0; i < m.rewardTaskList.length; ++i)
                    w.int32(m.rewardTaskList[i]);
                w.ldelim();
            }
            if (m.list != null && m.list.length) {
                for (var i = 0; i < m.list.length; ++i)
                    $root.task.taskInfo.encode(m.list[i], w.uint32(26).fork()).ldelim();
            }
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(32).int32(m.status);
            return w;
        };

        rewardClaimResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.task.rewardClaimResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        if (!(m.rewardTaskList && m.rewardTaskList.length))
                            m.rewardTaskList = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.rewardTaskList.push(r.int32());
                        } else
                            m.rewardTaskList.push(r.int32());
                        break;
                    }
                case 3: {
                        if (!(m.list && m.list.length))
                            m.list = [];
                        m.list.push($root.task.taskInfo.decode(r, r.uint32()));
                        break;
                    }
                case 4: {
                        m.status = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return rewardClaimResp;
    })();

    task.jackpotRewardReq = (function() {

        function jackpotRewardReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        jackpotRewardReq.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        jackpotRewardReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            return w;
        };

        jackpotRewardReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.task.jackpotRewardReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return jackpotRewardReq;
    })();

    task.jackpotRewardRecord = (function() {

        function jackpotRewardRecord(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        jackpotRewardRecord.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        jackpotRewardRecord.prototype.reward = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        jackpotRewardRecord.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        jackpotRewardRecord.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.reward != null && Object.hasOwnProperty.call(m, "reward"))
                w.uint32(16).uint64(m.reward);
            if (m.timestamp != null && Object.hasOwnProperty.call(m, "timestamp"))
                w.uint32(24).uint64(m.timestamp);
            return w;
        };

        jackpotRewardRecord.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.task.jackpotRewardRecord();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.reward = r.uint64();
                        break;
                    }
                case 3: {
                        m.timestamp = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return jackpotRewardRecord;
    })();

    task.jackpotRewardResp = (function() {

        function jackpotRewardResp(p) {
            this.list = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        jackpotRewardResp.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        jackpotRewardResp.prototype.reward = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        jackpotRewardResp.prototype.list = $util.emptyArray;
        jackpotRewardResp.prototype.status = false;

        jackpotRewardResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.reward != null && Object.hasOwnProperty.call(m, "reward"))
                w.uint32(16).uint64(m.reward);
            if (m.list != null && m.list.length) {
                for (var i = 0; i < m.list.length; ++i)
                    $root.task.jackpotRewardRecord.encode(m.list[i], w.uint32(26).fork()).ldelim();
            }
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(32).bool(m.status);
            return w;
        };

        jackpotRewardResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.task.jackpotRewardResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.reward = r.uint64();
                        break;
                    }
                case 3: {
                        if (!(m.list && m.list.length))
                            m.list = [];
                        m.list.push($root.task.jackpotRewardRecord.decode(r, r.uint32()));
                        break;
                    }
                case 4: {
                        m.status = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return jackpotRewardResp;
    })();

    task.noticeTaskStatusUpdate = (function() {

        function noticeTaskStatusUpdate(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        noticeTaskStatusUpdate.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        noticeTaskStatusUpdate.prototype.taskId = 0;

        noticeTaskStatusUpdate.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.taskId != null && Object.hasOwnProperty.call(m, "taskId"))
                w.uint32(16).int32(m.taskId);
            return w;
        };

        noticeTaskStatusUpdate.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.task.noticeTaskStatusUpdate();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.taskId = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return noticeTaskStatusUpdate;
    })();

    task.TaskOpCode = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "TASK_NONE"] = 0;
        values[valuesById[17001] = "TASK_REQ_INFO"] = 17001;
        values[valuesById[17002] = "TASK_REWARD_CLAIM"] = 17002;
        values[valuesById[17003] = "TASK_JACKPOT_REWARD"] = 17003;
        values[valuesById[17004] = "TASK_STATUS_UPDATE"] = 17004;
        values[valuesById[17005] = "TASK_JACKPOT_CLAIM"] = 17005;
        return values;
    })();

    task.TaskClassType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "NONE"] = 0;
        values[valuesById[1] = "NEW_HAND"] = 1;
        values[valuesById[2] = "NEW_HAND_ALL"] = 2;
        values[valuesById[3] = "EVERYDAY"] = 3;
        return values;
    })();

    task.TaskStatusType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "LOCKED"] = 0;
        values[valuesById[1] = "TODO"] = 1;
        values[valuesById[2] = "FINISH"] = 2;
        values[valuesById[3] = "REWARDED"] = 3;
        return values;
    })();

    return task;
})();

$root.trace = (function() {

    var trace = {};

    trace.TraceType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UNSPECIFIED"] = 0;
        values[valuesById[1] = "TRACE_FEEDBACK"] = 1;
        return values;
    })();

    trace.traceInfo = (function() {

        function traceInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        traceInfo.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        traceInfo.prototype.type = 0;
        traceInfo.prototype.traceData = "";

        traceInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.type != null && Object.hasOwnProperty.call(m, "type"))
                w.uint32(16).int32(m.type);
            if (m.traceData != null && Object.hasOwnProperty.call(m, "traceData"))
                w.uint32(26).string(m.traceData);
            return w;
        };

        traceInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.trace.traceInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        m.type = r.int32();
                        break;
                    }
                case 3: {
                        m.traceData = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return traceInfo;
    })();

    trace.traceStatus = (function() {

        function traceStatus(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        traceStatus.prototype.status = false;

        traceStatus.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(8).bool(m.status);
            return w;
        };

        traceStatus.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.trace.traceStatus();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.status = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return traceStatus;
    })();

    trace.TraceOpCode = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "TRACE_NONE"] = 0;
        values[valuesById[18001] = "TRACE_INFO"] = 18001;
        return values;
    })();

    return trace;
})();

$root.mail = (function() {

    var mail = {};

    mail.pbMsgType = (function() {

        function pbMsgType(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbMsgType.prototype.roleId = null;
        pbMsgType.prototype.type = null;

        var $oneOfFields;

        Object.defineProperty(pbMsgType.prototype, "_roleId", {
            get: $util.oneOfGetter($oneOfFields = ["roleId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbMsgType.prototype, "_type", {
            get: $util.oneOfGetter($oneOfFields = ["type"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        pbMsgType.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            if (m.type != null && Object.hasOwnProperty.call(m, "type"))
                w.uint32(16).int32(m.type);
            return w;
        };

        pbMsgType.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mail.pbMsgType();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                case 2: {
                        m.type = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbMsgType;
    })();

    mail.pbClubApplicationReq = (function() {

        function pbClubApplicationReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbClubApplicationReq.prototype.roleId = null;
        pbClubApplicationReq.prototype.clubId = null;

        var $oneOfFields;

        Object.defineProperty(pbClubApplicationReq.prototype, "_roleId", {
            get: $util.oneOfGetter($oneOfFields = ["roleId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbClubApplicationReq.prototype, "_clubId", {
            get: $util.oneOfGetter($oneOfFields = ["clubId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        pbClubApplicationReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(24).uint32(m.clubId);
            return w;
        };

        pbClubApplicationReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mail.pbClubApplicationReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                case 3: {
                        m.clubId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbClubApplicationReq;
    })();

    mail.pbClubApplicationCountReq = (function() {

        function pbClubApplicationCountReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbClubApplicationCountReq.prototype.roleId = null;
        pbClubApplicationCountReq.prototype.clubId = null;

        var $oneOfFields;

        Object.defineProperty(pbClubApplicationCountReq.prototype, "_roleId", {
            get: $util.oneOfGetter($oneOfFields = ["roleId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbClubApplicationCountReq.prototype, "_clubId", {
            get: $util.oneOfGetter($oneOfFields = ["clubId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        pbClubApplicationCountReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(24).uint32(m.clubId);
            return w;
        };

        pbClubApplicationCountReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mail.pbClubApplicationCountReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                case 3: {
                        m.clubId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbClubApplicationCountReq;
    })();

    mail.pbClubApplicationCountResp = (function() {

        function pbClubApplicationCountResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbClubApplicationCountResp.prototype.unreadCount = null;

        var $oneOfFields;

        Object.defineProperty(pbClubApplicationCountResp.prototype, "_unreadCount", {
            get: $util.oneOfGetter($oneOfFields = ["unreadCount"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        pbClubApplicationCountResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.unreadCount != null && Object.hasOwnProperty.call(m, "unreadCount"))
                w.uint32(8).uint32(m.unreadCount);
            return w;
        };

        pbClubApplicationCountResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mail.pbClubApplicationCountResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.unreadCount = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbClubApplicationCountResp;
    })();

    mail.pbMailList = (function() {

        function pbMailList(p) {
            this.list = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbMailList.prototype.roleId = null;
        pbMailList.prototype.type = null;
        pbMailList.prototype.list = $util.emptyArray;

        var $oneOfFields;

        Object.defineProperty(pbMailList.prototype, "_roleId", {
            get: $util.oneOfGetter($oneOfFields = ["roleId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbMailList.prototype, "_type", {
            get: $util.oneOfGetter($oneOfFields = ["type"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        pbMailList.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            if (m.type != null && Object.hasOwnProperty.call(m, "type"))
                w.uint32(16).int32(m.type);
            if (m.list != null && m.list.length) {
                for (var i = 0; i < m.list.length; ++i)
                    $root.mail.pbNotice.encode(m.list[i], w.uint32(26).fork()).ldelim();
            }
            return w;
        };

        pbMailList.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mail.pbMailList();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                case 2: {
                        m.type = r.int32();
                        break;
                    }
                case 3: {
                        if (!(m.list && m.list.length))
                            m.list = [];
                        m.list.push($root.mail.pbNotice.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbMailList;
    })();

    mail.pbNotice = (function() {

        function pbNotice(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbNotice.prototype.index = null;
        pbNotice.prototype.templateId = null;
        pbNotice.prototype.templateData = null;
        pbNotice.prototype.status = null;
        pbNotice.prototype.time = null;

        var $oneOfFields;

        Object.defineProperty(pbNotice.prototype, "_index", {
            get: $util.oneOfGetter($oneOfFields = ["index"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbNotice.prototype, "_templateId", {
            get: $util.oneOfGetter($oneOfFields = ["templateId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbNotice.prototype, "_templateData", {
            get: $util.oneOfGetter($oneOfFields = ["templateData"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbNotice.prototype, "_status", {
            get: $util.oneOfGetter($oneOfFields = ["status"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbNotice.prototype, "_time", {
            get: $util.oneOfGetter($oneOfFields = ["time"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        pbNotice.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.index != null && Object.hasOwnProperty.call(m, "index"))
                w.uint32(10).string(m.index);
            if (m.templateId != null && Object.hasOwnProperty.call(m, "templateId"))
                w.uint32(16).uint32(m.templateId);
            if (m.templateData != null && Object.hasOwnProperty.call(m, "templateData"))
                w.uint32(26).string(m.templateData);
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(32).int32(m.status);
            if (m.time != null && Object.hasOwnProperty.call(m, "time"))
                w.uint32(40).uint64(m.time);
            return w;
        };

        pbNotice.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mail.pbNotice();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.index = r.string();
                        break;
                    }
                case 2: {
                        m.templateId = r.uint32();
                        break;
                    }
                case 3: {
                        m.templateData = r.string();
                        break;
                    }
                case 4: {
                        m.status = r.int32();
                        break;
                    }
                case 5: {
                        m.time = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbNotice;
    })();

    mail.pbGetMailContent = (function() {

        function pbGetMailContent(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbGetMailContent.prototype.roleId = null;
        pbGetMailContent.prototype.index = null;

        var $oneOfFields;

        Object.defineProperty(pbGetMailContent.prototype, "_roleId", {
            get: $util.oneOfGetter($oneOfFields = ["roleId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbGetMailContent.prototype, "_index", {
            get: $util.oneOfGetter($oneOfFields = ["index"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        pbGetMailContent.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            if (m.index != null && Object.hasOwnProperty.call(m, "index"))
                w.uint32(18).string(m.index);
            return w;
        };

        pbGetMailContent.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mail.pbGetMailContent();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                case 2: {
                        m.index = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbGetMailContent;
    })();

    mail.pbMailContent = (function() {

        function pbMailContent(p) {
            this.list = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbMailContent.prototype.roleId = null;
        pbMailContent.prototype.index = null;
        pbMailContent.prototype.type = null;
        pbMailContent.prototype.templateId = null;
        pbMailContent.prototype.templateData = null;
        pbMailContent.prototype.time = null;
        pbMailContent.prototype.list = $util.emptyArray;

        var $oneOfFields;

        Object.defineProperty(pbMailContent.prototype, "_roleId", {
            get: $util.oneOfGetter($oneOfFields = ["roleId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbMailContent.prototype, "_index", {
            get: $util.oneOfGetter($oneOfFields = ["index"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbMailContent.prototype, "_type", {
            get: $util.oneOfGetter($oneOfFields = ["type"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbMailContent.prototype, "_templateId", {
            get: $util.oneOfGetter($oneOfFields = ["templateId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbMailContent.prototype, "_templateData", {
            get: $util.oneOfGetter($oneOfFields = ["templateData"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbMailContent.prototype, "_time", {
            get: $util.oneOfGetter($oneOfFields = ["time"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        pbMailContent.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            if (m.index != null && Object.hasOwnProperty.call(m, "index"))
                w.uint32(18).string(m.index);
            if (m.type != null && Object.hasOwnProperty.call(m, "type"))
                w.uint32(24).int32(m.type);
            if (m.templateId != null && Object.hasOwnProperty.call(m, "templateId"))
                w.uint32(32).uint32(m.templateId);
            if (m.templateData != null && Object.hasOwnProperty.call(m, "templateData"))
                w.uint32(42).string(m.templateData);
            if (m.time != null && Object.hasOwnProperty.call(m, "time"))
                w.uint32(48).uint64(m.time);
            if (m.list != null && m.list.length) {
                for (var i = 0; i < m.list.length; ++i)
                    $root.mail.mail_attachment.encode(m.list[i], w.uint32(58).fork()).ldelim();
            }
            return w;
        };

        pbMailContent.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mail.pbMailContent();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                case 2: {
                        m.index = r.string();
                        break;
                    }
                case 3: {
                        m.type = r.int32();
                        break;
                    }
                case 4: {
                        m.templateId = r.uint32();
                        break;
                    }
                case 5: {
                        m.templateData = r.string();
                        break;
                    }
                case 6: {
                        m.time = r.uint64();
                        break;
                    }
                case 7: {
                        if (!(m.list && m.list.length))
                            m.list = [];
                        m.list.push($root.mail.mail_attachment.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbMailContent;
    })();

    mail.mail_attachment = (function() {

        function mail_attachment(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        mail_attachment.prototype.itemId = null;
        mail_attachment.prototype.num = null;

        var $oneOfFields;

        Object.defineProperty(mail_attachment.prototype, "_itemId", {
            get: $util.oneOfGetter($oneOfFields = ["itemId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(mail_attachment.prototype, "_num", {
            get: $util.oneOfGetter($oneOfFields = ["num"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        mail_attachment.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.itemId != null && Object.hasOwnProperty.call(m, "itemId"))
                w.uint32(8).uint32(m.itemId);
            if (m.num != null && Object.hasOwnProperty.call(m, "num"))
                w.uint32(16).uint64(m.num);
            return w;
        };

        mail_attachment.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mail.mail_attachment();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.itemId = r.uint32();
                        break;
                    }
                case 2: {
                        m.num = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return mail_attachment;
    })();

    mail.pbGetMailAttachment = (function() {

        function pbGetMailAttachment(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbGetMailAttachment.prototype.roleId = null;
        pbGetMailAttachment.prototype.index = null;

        var $oneOfFields;

        Object.defineProperty(pbGetMailAttachment.prototype, "_roleId", {
            get: $util.oneOfGetter($oneOfFields = ["roleId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbGetMailAttachment.prototype, "_index", {
            get: $util.oneOfGetter($oneOfFields = ["index"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        pbGetMailAttachment.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            if (m.index != null && Object.hasOwnProperty.call(m, "index"))
                w.uint32(18).string(m.index);
            return w;
        };

        pbGetMailAttachment.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mail.pbGetMailAttachment();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                case 2: {
                        m.index = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbGetMailAttachment;
    })();

    mail.pbMailAttachmentResp = (function() {

        function pbMailAttachmentResp(p) {
            this.list = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbMailAttachmentResp.prototype.roleId = null;
        pbMailAttachmentResp.prototype.index = null;
        pbMailAttachmentResp.prototype.list = $util.emptyArray;

        var $oneOfFields;

        Object.defineProperty(pbMailAttachmentResp.prototype, "_roleId", {
            get: $util.oneOfGetter($oneOfFields = ["roleId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbMailAttachmentResp.prototype, "_index", {
            get: $util.oneOfGetter($oneOfFields = ["index"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        pbMailAttachmentResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            if (m.index != null && Object.hasOwnProperty.call(m, "index"))
                w.uint32(18).string(m.index);
            if (m.list != null && m.list.length) {
                for (var i = 0; i < m.list.length; ++i)
                    $root.mail.mail_attachment.encode(m.list[i], w.uint32(26).fork()).ldelim();
            }
            return w;
        };

        pbMailAttachmentResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mail.pbMailAttachmentResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                case 2: {
                        m.index = r.string();
                        break;
                    }
                case 3: {
                        if (!(m.list && m.list.length))
                            m.list = [];
                        m.list.push($root.mail.mail_attachment.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbMailAttachmentResp;
    })();

    mail.pbDeleteMail = (function() {

        function pbDeleteMail(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbDeleteMail.prototype.roleId = null;
        pbDeleteMail.prototype.index = null;

        var $oneOfFields;

        Object.defineProperty(pbDeleteMail.prototype, "_roleId", {
            get: $util.oneOfGetter($oneOfFields = ["roleId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbDeleteMail.prototype, "_index", {
            get: $util.oneOfGetter($oneOfFields = ["index"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        pbDeleteMail.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            if (m.index != null && Object.hasOwnProperty.call(m, "index"))
                w.uint32(18).string(m.index);
            return w;
        };

        pbDeleteMail.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mail.pbDeleteMail();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                case 2: {
                        m.index = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbDeleteMail;
    })();

    mail.pbGetAllMailAttachment = (function() {

        function pbGetAllMailAttachment(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbGetAllMailAttachment.prototype.roleId = null;

        var $oneOfFields;

        Object.defineProperty(pbGetAllMailAttachment.prototype, "_roleId", {
            get: $util.oneOfGetter($oneOfFields = ["roleId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        pbGetAllMailAttachment.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            return w;
        };

        pbGetAllMailAttachment.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mail.pbGetAllMailAttachment();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbGetAllMailAttachment;
    })();

    mail.pbAllMailAttachmentResp = (function() {

        function pbAllMailAttachmentResp(p) {
            this.list = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbAllMailAttachmentResp.prototype.roleId = null;
        pbAllMailAttachmentResp.prototype.list = $util.emptyArray;

        var $oneOfFields;

        Object.defineProperty(pbAllMailAttachmentResp.prototype, "_roleId", {
            get: $util.oneOfGetter($oneOfFields = ["roleId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        pbAllMailAttachmentResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            if (m.list != null && m.list.length) {
                for (var i = 0; i < m.list.length; ++i)
                    $root.mail.mail_attachment.encode(m.list[i], w.uint32(18).fork()).ldelim();
            }
            return w;
        };

        pbAllMailAttachmentResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mail.pbAllMailAttachmentResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                case 2: {
                        if (!(m.list && m.list.length))
                            m.list = [];
                        m.list.push($root.mail.mail_attachment.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbAllMailAttachmentResp;
    })();

    mail.pbDeleteAll = (function() {

        function pbDeleteAll(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbDeleteAll.prototype.roleId = null;
        pbDeleteAll.prototype.type = null;

        var $oneOfFields;

        Object.defineProperty(pbDeleteAll.prototype, "_roleId", {
            get: $util.oneOfGetter($oneOfFields = ["roleId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbDeleteAll.prototype, "_type", {
            get: $util.oneOfGetter($oneOfFields = ["type"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        pbDeleteAll.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            if (m.type != null && Object.hasOwnProperty.call(m, "type"))
                w.uint32(16).uint32(m.type);
            return w;
        };

        pbDeleteAll.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mail.pbDeleteAll();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                case 2: {
                        m.type = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbDeleteAll;
    })();

    mail.MailType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "DEFAULTMAIL"] = 0;
        values[valuesById[1] = "EVENTMAIL"] = 1;
        values[valuesById[2] = "SYSTEMMAIL"] = 2;
        values[valuesById[3] = "CLUBAPPLICATION"] = 3;
        return values;
    })();

    mail.MailStatus = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UNREAD"] = 0;
        values[valuesById[1] = "READ"] = 1;
        values[valuesById[2] = "UNREAD_NOT_RECEIVE"] = 2;
        values[valuesById[3] = "READ_NOT_RECEIVE"] = 3;
        return values;
    })();

    mail.pbSendMail = (function() {

        function pbSendMail(p) {
            this.mailAnnex = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbSendMail.prototype.roleId = null;
        pbSendMail.prototype.templateId = null;
        pbSendMail.prototype.mailAnnex = $util.emptyArray;
        pbSendMail.prototype.templateData = null;
        pbSendMail.prototype.startTime = null;
        pbSendMail.prototype.endTime = null;

        var $oneOfFields;

        Object.defineProperty(pbSendMail.prototype, "_roleId", {
            get: $util.oneOfGetter($oneOfFields = ["roleId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbSendMail.prototype, "_templateId", {
            get: $util.oneOfGetter($oneOfFields = ["templateId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbSendMail.prototype, "_templateData", {
            get: $util.oneOfGetter($oneOfFields = ["templateData"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbSendMail.prototype, "_startTime", {
            get: $util.oneOfGetter($oneOfFields = ["startTime"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbSendMail.prototype, "_endTime", {
            get: $util.oneOfGetter($oneOfFields = ["endTime"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        pbSendMail.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            if (m.templateId != null && Object.hasOwnProperty.call(m, "templateId"))
                w.uint32(16).uint32(m.templateId);
            if (m.mailAnnex != null && m.mailAnnex.length) {
                for (var i = 0; i < m.mailAnnex.length; ++i)
                    $root.mail.mail_attachment.encode(m.mailAnnex[i], w.uint32(26).fork()).ldelim();
            }
            if (m.templateData != null && Object.hasOwnProperty.call(m, "templateData"))
                w.uint32(34).string(m.templateData);
            if (m.startTime != null && Object.hasOwnProperty.call(m, "startTime"))
                w.uint32(40).uint64(m.startTime);
            if (m.endTime != null && Object.hasOwnProperty.call(m, "endTime"))
                w.uint32(48).uint64(m.endTime);
            return w;
        };

        pbSendMail.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mail.pbSendMail();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                case 2: {
                        m.templateId = r.uint32();
                        break;
                    }
                case 3: {
                        if (!(m.mailAnnex && m.mailAnnex.length))
                            m.mailAnnex = [];
                        m.mailAnnex.push($root.mail.mail_attachment.decode(r, r.uint32()));
                        break;
                    }
                case 4: {
                        m.templateData = r.string();
                        break;
                    }
                case 5: {
                        m.startTime = r.uint64();
                        break;
                    }
                case 6: {
                        m.endTime = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbSendMail;
    })();

    mail.pbStatus = (function() {

        function pbStatus(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbStatus.prototype.status = null;

        var $oneOfFields;

        Object.defineProperty(pbStatus.prototype, "_status", {
            get: $util.oneOfGetter($oneOfFields = ["status"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        pbStatus.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(8).bool(m.status);
            return w;
        };

        pbStatus.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mail.pbStatus();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.status = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbStatus;
    })();

    mail.pbSendSysMail = (function() {

        function pbSendSysMail(p) {
            this.mailAnnex = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbSendSysMail.prototype.roleIdList = null;
        pbSendSysMail.prototype.templateId = null;
        pbSendSysMail.prototype.mailAnnex = $util.emptyArray;
        pbSendSysMail.prototype.variableName = null;
        pbSendSysMail.prototype.startTime = null;
        pbSendSysMail.prototype.endTime = null;

        var $oneOfFields;

        Object.defineProperty(pbSendSysMail.prototype, "_roleIdList", {
            get: $util.oneOfGetter($oneOfFields = ["roleIdList"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbSendSysMail.prototype, "_templateId", {
            get: $util.oneOfGetter($oneOfFields = ["templateId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbSendSysMail.prototype, "_variableName", {
            get: $util.oneOfGetter($oneOfFields = ["variableName"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbSendSysMail.prototype, "_startTime", {
            get: $util.oneOfGetter($oneOfFields = ["startTime"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbSendSysMail.prototype, "_endTime", {
            get: $util.oneOfGetter($oneOfFields = ["endTime"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        pbSendSysMail.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleIdList != null && Object.hasOwnProperty.call(m, "roleIdList"))
                w.uint32(10).string(m.roleIdList);
            if (m.templateId != null && Object.hasOwnProperty.call(m, "templateId"))
                w.uint32(16).uint32(m.templateId);
            if (m.mailAnnex != null && m.mailAnnex.length) {
                for (var i = 0; i < m.mailAnnex.length; ++i)
                    $root.mail.mail_attachment.encode(m.mailAnnex[i], w.uint32(26).fork()).ldelim();
            }
            if (m.variableName != null && Object.hasOwnProperty.call(m, "variableName"))
                w.uint32(34).string(m.variableName);
            if (m.startTime != null && Object.hasOwnProperty.call(m, "startTime"))
                w.uint32(40).uint64(m.startTime);
            if (m.endTime != null && Object.hasOwnProperty.call(m, "endTime"))
                w.uint32(48).uint64(m.endTime);
            return w;
        };

        pbSendSysMail.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mail.pbSendSysMail();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleIdList = r.string();
                        break;
                    }
                case 2: {
                        m.templateId = r.uint32();
                        break;
                    }
                case 3: {
                        if (!(m.mailAnnex && m.mailAnnex.length))
                            m.mailAnnex = [];
                        m.mailAnnex.push($root.mail.mail_attachment.decode(r, r.uint32()));
                        break;
                    }
                case 4: {
                        m.variableName = r.string();
                        break;
                    }
                case 5: {
                        m.startTime = r.uint64();
                        break;
                    }
                case 6: {
                        m.endTime = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbSendSysMail;
    })();

    mail.MailCode = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "BROADCAST_INIT"] = 0;
        values[valuesById[60000] = "BROADCAST_MAIL"] = 60000;
        values[valuesById[60001] = "GET_MAIL_LIST"] = 60001;
        values[valuesById[60002] = "OPEN_MAIL_DETAILED"] = 60002;
        values[valuesById[60003] = "RECEIVE_MAIL"] = 60003;
        values[valuesById[60004] = "DELETE_MAIL"] = 60004;
        values[valuesById[60005] = "DELETE_MAIL_ALL"] = 60005;
        values[valuesById[60006] = "RECEIVE_MAIL_ALL"] = 60006;
        values[valuesById[60007] = "GET_MAIL_STATUS"] = 60007;
        values[valuesById[60008] = "PUSH_NEW_MAIL"] = 60008;
        values[valuesById[60009] = "GET_CLUBAPPLICATION_LIST"] = 60009;
        values[valuesById[60010] = "GET_CLUBAPPLICATION_UNREAD_COUNT"] = 60010;
        return values;
    })();

    return mail;
})();

$root.shop = (function() {

    var shop = {};

    shop.pbGetShopConfig = (function() {

        function pbGetShopConfig(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbGetShopConfig.prototype.roleId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        pbGetShopConfig.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            return w;
        };

        pbGetShopConfig.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbGetShopConfig();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbGetShopConfig;
    })();

    shop.pbShopInfo = (function() {

        function pbShopInfo(p) {
            this.list = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbShopInfo.prototype.roleId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        pbShopInfo.prototype.status = 0;
        pbShopInfo.prototype.list = $util.emptyArray;

        pbShopInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roleId != null && Object.hasOwnProperty.call(m, "roleId"))
                w.uint32(8).uint64(m.roleId);
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(16).int32(m.status);
            if (m.list != null && m.list.length) {
                for (var i = 0; i < m.list.length; ++i)
                    $root.shop.pbDiscountShop.encode(m.list[i], w.uint32(26).fork()).ldelim();
            }
            return w;
        };

        pbShopInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbShopInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roleId = r.uint64();
                        break;
                    }
                case 2: {
                        m.status = r.int32();
                        break;
                    }
                case 3: {
                        if (!(m.list && m.list.length))
                            m.list = [];
                        m.list.push($root.shop.pbDiscountShop.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbShopInfo;
    })();

    shop.pbDiscountShop = (function() {

        function pbDiscountShop(p) {
            this.time = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbDiscountShop.prototype.productId = 0;
        pbDiscountShop.prototype.num = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        pbDiscountShop.prototype.label = 0;
        pbDiscountShop.prototype.percentage = 0;
        pbDiscountShop.prototype.time = $util.emptyArray;

        pbDiscountShop.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.productId != null && Object.hasOwnProperty.call(m, "productId"))
                w.uint32(8).uint32(m.productId);
            if (m.num != null && Object.hasOwnProperty.call(m, "num"))
                w.uint32(16).uint64(m.num);
            if (m.label != null && Object.hasOwnProperty.call(m, "label"))
                w.uint32(24).int32(m.label);
            if (m.percentage != null && Object.hasOwnProperty.call(m, "percentage"))
                w.uint32(32).uint32(m.percentage);
            if (m.time != null && m.time.length) {
                for (var i = 0; i < m.time.length; ++i)
                    $root.shop.pbTimeInfo.encode(m.time[i], w.uint32(42).fork()).ldelim();
            }
            return w;
        };

        pbDiscountShop.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbDiscountShop();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.productId = r.uint32();
                        break;
                    }
                case 2: {
                        m.num = r.uint64();
                        break;
                    }
                case 3: {
                        m.label = r.int32();
                        break;
                    }
                case 4: {
                        m.percentage = r.uint32();
                        break;
                    }
                case 5: {
                        if (!(m.time && m.time.length))
                            m.time = [];
                        m.time.push($root.shop.pbTimeInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbDiscountShop;
    })();

    shop.pbTimeInfo = (function() {

        function pbTimeInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbTimeInfo.prototype.startTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        pbTimeInfo.prototype.endTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        pbTimeInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.startTime != null && Object.hasOwnProperty.call(m, "startTime"))
                w.uint32(8).uint64(m.startTime);
            if (m.endTime != null && Object.hasOwnProperty.call(m, "endTime"))
                w.uint32(16).uint64(m.endTime);
            return w;
        };

        pbTimeInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbTimeInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.startTime = r.uint64();
                        break;
                    }
                case 2: {
                        m.endTime = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbTimeInfo;
    })();

    shop.pbCreateOrderReq = (function() {

        function pbCreateOrderReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbCreateOrderReq.prototype.uid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        pbCreateOrderReq.prototype.productId = 0;
        pbCreateOrderReq.prototype.payType = 0;
        pbCreateOrderReq.prototype.shopPlace = 0;

        pbCreateOrderReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.uid != null && Object.hasOwnProperty.call(m, "uid"))
                w.uint32(8).uint64(m.uid);
            if (m.productId != null && Object.hasOwnProperty.call(m, "productId"))
                w.uint32(16).uint32(m.productId);
            if (m.payType != null && Object.hasOwnProperty.call(m, "payType"))
                w.uint32(24).int32(m.payType);
            if (m.shopPlace != null && Object.hasOwnProperty.call(m, "shopPlace"))
                w.uint32(32).uint32(m.shopPlace);
            return w;
        };

        pbCreateOrderReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbCreateOrderReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.uid = r.uint64();
                        break;
                    }
                case 2: {
                        m.productId = r.uint32();
                        break;
                    }
                case 3: {
                        m.payType = r.int32();
                        break;
                    }
                case 4: {
                        m.shopPlace = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbCreateOrderReq;
    })();

    shop.pbCreateOrderRes = (function() {

        function pbCreateOrderRes(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbCreateOrderRes.prototype.uid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        pbCreateOrderRes.prototype.productId = 0;
        pbCreateOrderRes.prototype.orderId = "";
        pbCreateOrderRes.prototype.orderStatus = 0;
        pbCreateOrderRes.prototype.msg = "";
        pbCreateOrderRes.prototype.payType = 0;

        pbCreateOrderRes.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.uid != null && Object.hasOwnProperty.call(m, "uid"))
                w.uint32(8).uint64(m.uid);
            if (m.productId != null && Object.hasOwnProperty.call(m, "productId"))
                w.uint32(16).uint32(m.productId);
            if (m.orderId != null && Object.hasOwnProperty.call(m, "orderId"))
                w.uint32(26).string(m.orderId);
            if (m.orderStatus != null && Object.hasOwnProperty.call(m, "orderStatus"))
                w.uint32(32).uint32(m.orderStatus);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(42).string(m.msg);
            if (m.payType != null && Object.hasOwnProperty.call(m, "payType"))
                w.uint32(48).int32(m.payType);
            return w;
        };

        pbCreateOrderRes.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbCreateOrderRes();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.uid = r.uint64();
                        break;
                    }
                case 2: {
                        m.productId = r.uint32();
                        break;
                    }
                case 3: {
                        m.orderId = r.string();
                        break;
                    }
                case 4: {
                        m.orderStatus = r.uint32();
                        break;
                    }
                case 5: {
                        m.msg = r.string();
                        break;
                    }
                case 6: {
                        m.payType = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbCreateOrderRes;
    })();

    shop.pbCreateWithDrawOrderReq = (function() {

        function pbCreateWithDrawOrderReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbCreateWithDrawOrderReq.prototype.uid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        pbCreateWithDrawOrderReq.prototype.amount = 0;
        pbCreateWithDrawOrderReq.prototype.shopPlace = 0;

        pbCreateWithDrawOrderReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.uid != null && Object.hasOwnProperty.call(m, "uid"))
                w.uint32(8).uint64(m.uid);
            if (m.amount != null && Object.hasOwnProperty.call(m, "amount"))
                w.uint32(21).float(m.amount);
            if (m.shopPlace != null && Object.hasOwnProperty.call(m, "shopPlace"))
                w.uint32(24).uint32(m.shopPlace);
            return w;
        };

        pbCreateWithDrawOrderReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbCreateWithDrawOrderReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.uid = r.uint64();
                        break;
                    }
                case 2: {
                        m.amount = r.float();
                        break;
                    }
                case 3: {
                        m.shopPlace = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbCreateWithDrawOrderReq;
    })();

    shop.pbCreateWithDrawOrderRes = (function() {

        function pbCreateWithDrawOrderRes(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbCreateWithDrawOrderRes.prototype.uid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        pbCreateWithDrawOrderRes.prototype.orderId = "";
        pbCreateWithDrawOrderRes.prototype.orderStatus = 0;
        pbCreateWithDrawOrderRes.prototype.msg = "";

        pbCreateWithDrawOrderRes.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.uid != null && Object.hasOwnProperty.call(m, "uid"))
                w.uint32(8).uint64(m.uid);
            if (m.orderId != null && Object.hasOwnProperty.call(m, "orderId"))
                w.uint32(18).string(m.orderId);
            if (m.orderStatus != null && Object.hasOwnProperty.call(m, "orderStatus"))
                w.uint32(24).uint32(m.orderStatus);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(34).string(m.msg);
            return w;
        };

        pbCreateWithDrawOrderRes.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbCreateWithDrawOrderRes();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.uid = r.uint64();
                        break;
                    }
                case 2: {
                        m.orderId = r.string();
                        break;
                    }
                case 3: {
                        m.orderStatus = r.uint32();
                        break;
                    }
                case 4: {
                        m.msg = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbCreateWithDrawOrderRes;
    })();

    shop.pbCheckOrderReq = (function() {

        function pbCheckOrderReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbCheckOrderReq.prototype.uid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        pbCheckOrderReq.prototype.payType = 0;
        pbCheckOrderReq.prototype.receiptData = "";

        pbCheckOrderReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.uid != null && Object.hasOwnProperty.call(m, "uid"))
                w.uint32(8).uint64(m.uid);
            if (m.payType != null && Object.hasOwnProperty.call(m, "payType"))
                w.uint32(16).int32(m.payType);
            if (m.receiptData != null && Object.hasOwnProperty.call(m, "receiptData"))
                w.uint32(26).string(m.receiptData);
            return w;
        };

        pbCheckOrderReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbCheckOrderReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.uid = r.uint64();
                        break;
                    }
                case 2: {
                        m.payType = r.int32();
                        break;
                    }
                case 3: {
                        m.receiptData = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbCheckOrderReq;
    })();

    shop.pbCheckOrderRes = (function() {

        function pbCheckOrderRes(p) {
            this.token = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbCheckOrderRes.prototype.uid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        pbCheckOrderRes.prototype.token = $util.emptyArray;
        pbCheckOrderRes.prototype.payType = 0;

        pbCheckOrderRes.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.uid != null && Object.hasOwnProperty.call(m, "uid"))
                w.uint32(8).uint64(m.uid);
            if (m.token != null && m.token.length) {
                for (var i = 0; i < m.token.length; ++i)
                    w.uint32(18).string(m.token[i]);
            }
            if (m.payType != null && Object.hasOwnProperty.call(m, "payType"))
                w.uint32(24).int32(m.payType);
            return w;
        };

        pbCheckOrderRes.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbCheckOrderRes();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.uid = r.uint64();
                        break;
                    }
                case 2: {
                        if (!(m.token && m.token.length))
                            m.token = [];
                        m.token.push(r.string());
                        break;
                    }
                case 3: {
                        m.payType = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbCheckOrderRes;
    })();

    shop.pbSendOrderReq = (function() {

        function pbSendOrderReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbSendOrderReq.prototype.uid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        pbSendOrderReq.prototype.token = "";

        pbSendOrderReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.uid != null && Object.hasOwnProperty.call(m, "uid"))
                w.uint32(8).uint64(m.uid);
            if (m.token != null && Object.hasOwnProperty.call(m, "token"))
                w.uint32(18).string(m.token);
            return w;
        };

        pbSendOrderReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbSendOrderReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.uid = r.uint64();
                        break;
                    }
                case 2: {
                        m.token = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbSendOrderReq;
    })();

    shop.pbSendOrderRes = (function() {

        function pbSendOrderRes(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbSendOrderRes.prototype.uid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        pbSendOrderRes.prototype.status = false;

        pbSendOrderRes.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.uid != null && Object.hasOwnProperty.call(m, "uid"))
                w.uint32(8).uint64(m.uid);
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(16).bool(m.status);
            return w;
        };

        pbSendOrderRes.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbSendOrderRes();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.uid = r.uint64();
                        break;
                    }
                case 2: {
                        m.status = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbSendOrderRes;
    })();

    shop.pbGetOrderInfoReq = (function() {

        function pbGetOrderInfoReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbGetOrderInfoReq.prototype.uid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        pbGetOrderInfoReq.prototype.shopPlace = 0;
        pbGetOrderInfoReq.prototype.startTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        pbGetOrderInfoReq.prototype.endTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        pbGetOrderInfoReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.uid != null && Object.hasOwnProperty.call(m, "uid"))
                w.uint32(8).uint64(m.uid);
            if (m.shopPlace != null && Object.hasOwnProperty.call(m, "shopPlace"))
                w.uint32(16).uint32(m.shopPlace);
            if (m.startTime != null && Object.hasOwnProperty.call(m, "startTime"))
                w.uint32(24).int64(m.startTime);
            if (m.endTime != null && Object.hasOwnProperty.call(m, "endTime"))
                w.uint32(32).int64(m.endTime);
            return w;
        };

        pbGetOrderInfoReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbGetOrderInfoReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.uid = r.uint64();
                        break;
                    }
                case 2: {
                        m.shopPlace = r.uint32();
                        break;
                    }
                case 3: {
                        m.startTime = r.int64();
                        break;
                    }
                case 4: {
                        m.endTime = r.int64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbGetOrderInfoReq;
    })();

    shop.pbGetOrderInfoRes = (function() {

        function pbGetOrderInfoRes(p) {
            this.list = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbGetOrderInfoRes.prototype.list = $util.emptyArray;

        pbGetOrderInfoRes.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.list != null && m.list.length) {
                for (var i = 0; i < m.list.length; ++i)
                    $root.shop.OrderInfo.encode(m.list[i], w.uint32(10).fork()).ldelim();
            }
            return w;
        };

        pbGetOrderInfoRes.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbGetOrderInfoRes();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        if (!(m.list && m.list.length))
                            m.list = [];
                        m.list.push($root.shop.OrderInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbGetOrderInfoRes;
    })();

    shop.pbGetClubOrderInfoReq = (function() {

        function pbGetClubOrderInfoReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbGetClubOrderInfoReq.prototype.clubId = 0;
        pbGetClubOrderInfoReq.prototype.startTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        pbGetClubOrderInfoReq.prototype.endTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        pbGetClubOrderInfoReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            if (m.startTime != null && Object.hasOwnProperty.call(m, "startTime"))
                w.uint32(24).int64(m.startTime);
            if (m.endTime != null && Object.hasOwnProperty.call(m, "endTime"))
                w.uint32(32).int64(m.endTime);
            return w;
        };

        pbGetClubOrderInfoReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbGetClubOrderInfoReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 3: {
                        m.startTime = r.int64();
                        break;
                    }
                case 4: {
                        m.endTime = r.int64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbGetClubOrderInfoReq;
    })();

    shop.pbGetClubOrderInfoRes = (function() {

        function pbGetClubOrderInfoRes(p) {
            this.list = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbGetClubOrderInfoRes.prototype.list = $util.emptyArray;

        pbGetClubOrderInfoRes.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.list != null && m.list.length) {
                for (var i = 0; i < m.list.length; ++i)
                    $root.shop.OrderInfo.encode(m.list[i], w.uint32(10).fork()).ldelim();
            }
            return w;
        };

        pbGetClubOrderInfoRes.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbGetClubOrderInfoRes();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        if (!(m.list && m.list.length))
                            m.list = [];
                        m.list.push($root.shop.OrderInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbGetClubOrderInfoRes;
    })();

    shop.OrderInfo = (function() {

        function OrderInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        OrderInfo.prototype.uid = 0;
        OrderInfo.prototype.productId = 0;
        OrderInfo.prototype.buyTime = 0;
        OrderInfo.prototype.payType = 0;
        OrderInfo.prototype.price = 0;
        OrderInfo.prototype.coin = 0;
        OrderInfo.prototype.reward = 0;
        OrderInfo.prototype.shopType = 0;
        OrderInfo.prototype.shopPlace = 0;
        OrderInfo.prototype.status = 0;
        OrderInfo.prototype.buyerName = "";
        OrderInfo.prototype.balance = 0;

        OrderInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.uid != null && Object.hasOwnProperty.call(m, "uid"))
                w.uint32(8).uint32(m.uid);
            if (m.productId != null && Object.hasOwnProperty.call(m, "productId"))
                w.uint32(16).uint32(m.productId);
            if (m.buyTime != null && Object.hasOwnProperty.call(m, "buyTime"))
                w.uint32(24).uint32(m.buyTime);
            if (m.payType != null && Object.hasOwnProperty.call(m, "payType"))
                w.uint32(32).uint32(m.payType);
            if (m.price != null && Object.hasOwnProperty.call(m, "price"))
                w.uint32(45).float(m.price);
            if (m.coin != null && Object.hasOwnProperty.call(m, "coin"))
                w.uint32(53).float(m.coin);
            if (m.reward != null && Object.hasOwnProperty.call(m, "reward"))
                w.uint32(56).uint32(m.reward);
            if (m.shopType != null && Object.hasOwnProperty.call(m, "shopType"))
                w.uint32(64).uint32(m.shopType);
            if (m.shopPlace != null && Object.hasOwnProperty.call(m, "shopPlace"))
                w.uint32(72).uint32(m.shopPlace);
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(80).uint32(m.status);
            if (m.buyerName != null && Object.hasOwnProperty.call(m, "buyerName"))
                w.uint32(90).string(m.buyerName);
            if (m.balance != null && Object.hasOwnProperty.call(m, "balance"))
                w.uint32(101).float(m.balance);
            return w;
        };

        OrderInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.OrderInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.uid = r.uint32();
                        break;
                    }
                case 2: {
                        m.productId = r.uint32();
                        break;
                    }
                case 3: {
                        m.buyTime = r.uint32();
                        break;
                    }
                case 4: {
                        m.payType = r.uint32();
                        break;
                    }
                case 5: {
                        m.price = r.float();
                        break;
                    }
                case 6: {
                        m.coin = r.float();
                        break;
                    }
                case 7: {
                        m.reward = r.uint32();
                        break;
                    }
                case 8: {
                        m.shopType = r.uint32();
                        break;
                    }
                case 9: {
                        m.shopPlace = r.uint32();
                        break;
                    }
                case 10: {
                        m.status = r.uint32();
                        break;
                    }
                case 11: {
                        m.buyerName = r.string();
                        break;
                    }
                case 12: {
                        m.balance = r.float();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return OrderInfo;
    })();

    shop.pbGetStartPackReq = (function() {

        function pbGetStartPackReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbGetStartPackReq.prototype.uid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        pbGetStartPackReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.uid != null && Object.hasOwnProperty.call(m, "uid"))
                w.uint32(8).uint64(m.uid);
            return w;
        };

        pbGetStartPackReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbGetStartPackReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.uid = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbGetStartPackReq;
    })();

    shop.pbGetStartPackRes = (function() {

        function pbGetStartPackRes(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbGetStartPackRes.prototype.uid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        pbGetStartPackRes.prototype.isBuy = false;

        pbGetStartPackRes.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.uid != null && Object.hasOwnProperty.call(m, "uid"))
                w.uint32(8).uint64(m.uid);
            if (m.isBuy != null && Object.hasOwnProperty.call(m, "isBuy"))
                w.uint32(16).bool(m.isBuy);
            return w;
        };

        pbGetStartPackRes.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbGetStartPackRes();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.uid = r.uint64();
                        break;
                    }
                case 2: {
                        m.isBuy = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbGetStartPackRes;
    })();

    shop.pbDeleteDiscountShop = (function() {

        function pbDeleteDiscountShop(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbDeleteDiscountShop.prototype.productId = 0;

        pbDeleteDiscountShop.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.productId != null && Object.hasOwnProperty.call(m, "productId"))
                w.uint32(8).uint32(m.productId);
            return w;
        };

        pbDeleteDiscountShop.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbDeleteDiscountShop();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.productId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbDeleteDiscountShop;
    })();

    shop.pbGetProductListReq = (function() {

        function pbGetProductListReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbGetProductListReq.prototype.shopType = 0;
        pbGetProductListReq.prototype.shopPlace = 0;

        pbGetProductListReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.shopType != null && Object.hasOwnProperty.call(m, "shopType"))
                w.uint32(8).int32(m.shopType);
            if (m.shopPlace != null && Object.hasOwnProperty.call(m, "shopPlace"))
                w.uint32(16).uint32(m.shopPlace);
            return w;
        };

        pbGetProductListReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbGetProductListReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.shopType = r.int32();
                        break;
                    }
                case 2: {
                        m.shopPlace = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbGetProductListReq;
    })();

    shop.Product = (function() {

        function Product(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        Product.prototype.id = 0;
        Product.prototype.price = 0;
        Product.prototype.name = "";
        Product.prototype.shopType = 0;
        Product.prototype.shopPlace = 0;
        Product.prototype.image = "";

        Product.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.id != null && Object.hasOwnProperty.call(m, "id"))
                w.uint32(8).uint32(m.id);
            if (m.price != null && Object.hasOwnProperty.call(m, "price"))
                w.uint32(21).float(m.price);
            if (m.name != null && Object.hasOwnProperty.call(m, "name"))
                w.uint32(26).string(m.name);
            if (m.shopType != null && Object.hasOwnProperty.call(m, "shopType"))
                w.uint32(32).int32(m.shopType);
            if (m.shopPlace != null && Object.hasOwnProperty.call(m, "shopPlace"))
                w.uint32(40).uint32(m.shopPlace);
            if (m.image != null && Object.hasOwnProperty.call(m, "image"))
                w.uint32(50).string(m.image);
            return w;
        };

        Product.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.Product();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.id = r.uint32();
                        break;
                    }
                case 2: {
                        m.price = r.float();
                        break;
                    }
                case 3: {
                        m.name = r.string();
                        break;
                    }
                case 4: {
                        m.shopType = r.int32();
                        break;
                    }
                case 5: {
                        m.shopPlace = r.uint32();
                        break;
                    }
                case 6: {
                        m.image = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return Product;
    })();

    shop.pbGetProductListResp = (function() {

        function pbGetProductListResp(p) {
            this.productList = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbGetProductListResp.prototype.productList = $util.emptyArray;

        pbGetProductListResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.productList != null && m.productList.length) {
                for (var i = 0; i < m.productList.length; ++i)
                    $root.shop.Product.encode(m.productList[i], w.uint32(10).fork()).ldelim();
            }
            return w;
        };

        pbGetProductListResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbGetProductListResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        if (!(m.productList && m.productList.length))
                            m.productList = [];
                        m.productList.push($root.shop.Product.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbGetProductListResp;
    })();

    shop.pbStatus = (function() {

        function pbStatus(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbStatus.prototype.status = false;

        pbStatus.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(8).bool(m.status);
            return w;
        };

        pbStatus.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.shop.pbStatus();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.status = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbStatus;
    })();

    shop.BagCode = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "BROADCAST_INIT"] = 0;
        values[valuesById[61001] = "GET_SHOP_INFO"] = 61001;
        values[valuesById[61002] = "CREATE_ORDER"] = 61002;
        values[valuesById[61003] = "CHECK_ORDER"] = 61003;
        values[valuesById[61004] = "SEND_ORDER"] = 61004;
        values[valuesById[61005] = "GET_ORDER_INFO"] = 61005;
        values[valuesById[61006] = "GET_START_PACK_INFO"] = 61006;
        values[valuesById[61007] = "GET_PRODUCT_LIST"] = 61007;
        values[valuesById[61008] = "CREATE_WITHDRAW_ORDER"] = 61008;
        values[valuesById[61009] = "GET_CLUB_ORDER_INFO"] = 61009;
        return values;
    })();

    shop.storeType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "TYPE_DEFAULT"] = 0;
        values[valuesById[1] = "TYPE_GOOGLE"] = 1;
        values[valuesById[2] = "TYPE_APPLE"] = 2;
        values[valuesById[3] = "TYPE_GOUYU"] = 3;
        values[valuesById[4] = "TYPE_WEBAO"] = 4;
        values[valuesById[5] = "TYPE_WITHDRAW"] = 5;
        values[valuesById[6] = "TYPE_GAME_IN"] = 6;
        values[valuesById[7] = "TYPE_GAME_OUT"] = 7;
        return values;
    })();

    shop.labelType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "LABEL_DEFAULT"] = 0;
        values[valuesById[1] = "LABEL_HOT"] = 1;
        values[valuesById[2] = "LABEL_BEST_DEAL"] = 2;
        values[valuesById[3] = "LABEL_POPULAR"] = 3;
        return values;
    })();

    shop.roleShopType = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "SHOP_FREE"] = 0;
        values[valuesById[1] = "SHOP_DAILY"] = 1;
        values[valuesById[2] = "SHOP_NONE"] = 2;
        values[valuesById[3] = "SHOP_TONGBI"] = 3;
        values[valuesById[4] = "SHOP_GOUYU"] = 4;
        values[valuesById[5] = "SHOP_COIN"] = 5;
        return values;
    })();

    shop.ShopPlace = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "PLACE_DEFAULT"] = 0;
        values[valuesById[1] = "PLACE_GOUYU"] = 1;
        return values;
    })();

    return shop;
})();

$root.club = (function() {

    var club = {};

    club.ClubInfo = (function() {

        function ClubInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ClubInfo.prototype.clubId = 0;
        ClubInfo.prototype.name = "";
        ClubInfo.prototype.avatarId = 0;
        ClubInfo.prototype.avatarUrl = "";
        ClubInfo.prototype.ownerId = 0;
        ClubInfo.prototype.clubType = 0;
        ClubInfo.prototype.maxPlayerNo = 0;
        ClubInfo.prototype.curPlayerNo = 0;
        ClubInfo.prototype.actvieTableNo = 0;
        ClubInfo.prototype.clubStatus = 0;
        ClubInfo.prototype.ownerName = "";
        ClubInfo.prototype.totalAsset = 0;

        ClubInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            if (m.name != null && Object.hasOwnProperty.call(m, "name"))
                w.uint32(18).string(m.name);
            if (m.avatarId != null && Object.hasOwnProperty.call(m, "avatarId"))
                w.uint32(24).uint32(m.avatarId);
            if (m.avatarUrl != null && Object.hasOwnProperty.call(m, "avatarUrl"))
                w.uint32(34).string(m.avatarUrl);
            if (m.ownerId != null && Object.hasOwnProperty.call(m, "ownerId"))
                w.uint32(40).uint32(m.ownerId);
            if (m.clubType != null && Object.hasOwnProperty.call(m, "clubType"))
                w.uint32(48).uint32(m.clubType);
            if (m.maxPlayerNo != null && Object.hasOwnProperty.call(m, "maxPlayerNo"))
                w.uint32(56).uint32(m.maxPlayerNo);
            if (m.curPlayerNo != null && Object.hasOwnProperty.call(m, "curPlayerNo"))
                w.uint32(64).uint32(m.curPlayerNo);
            if (m.actvieTableNo != null && Object.hasOwnProperty.call(m, "actvieTableNo"))
                w.uint32(72).uint32(m.actvieTableNo);
            if (m.clubStatus != null && Object.hasOwnProperty.call(m, "clubStatus"))
                w.uint32(80).uint32(m.clubStatus);
            if (m.ownerName != null && Object.hasOwnProperty.call(m, "ownerName"))
                w.uint32(90).string(m.ownerName);
            if (m.totalAsset != null && Object.hasOwnProperty.call(m, "totalAsset"))
                w.uint32(101).float(m.totalAsset);
            return w;
        };

        ClubInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.ClubInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 2: {
                        m.name = r.string();
                        break;
                    }
                case 3: {
                        m.avatarId = r.uint32();
                        break;
                    }
                case 4: {
                        m.avatarUrl = r.string();
                        break;
                    }
                case 5: {
                        m.ownerId = r.uint32();
                        break;
                    }
                case 6: {
                        m.clubType = r.uint32();
                        break;
                    }
                case 7: {
                        m.maxPlayerNo = r.uint32();
                        break;
                    }
                case 8: {
                        m.curPlayerNo = r.uint32();
                        break;
                    }
                case 9: {
                        m.actvieTableNo = r.uint32();
                        break;
                    }
                case 10: {
                        m.clubStatus = r.uint32();
                        break;
                    }
                case 11: {
                        m.ownerName = r.string();
                        break;
                    }
                case 12: {
                        m.totalAsset = r.float();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ClubInfo;
    })();

    club.ChangStatistic = (function() {

        function ChangStatistic(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ChangStatistic.prototype.AveRate = 0;
        ChangStatistic.prototype.No1Rate = 0;
        ChangStatistic.prototype.No2Rate = 0;
        ChangStatistic.prototype.No3Rate = 0;
        ChangStatistic.prototype.No4Rate = 0;
        ChangStatistic.prototype.AveWinXun = 0;
        ChangStatistic.prototype.WinRate = 0;
        ChangStatistic.prototype.FailRate = 0;
        ChangStatistic.prototype.ReadyRate = 0;
        ChangStatistic.prototype.FuluRate = 0;
        ChangStatistic.prototype.TotalRound = 0;
        ChangStatistic.prototype.AveWinPoint = 0;
        ChangStatistic.prototype.AveFailPoint = 0;

        ChangStatistic.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.AveRate != null && Object.hasOwnProperty.call(m, "AveRate"))
                w.uint32(13).float(m.AveRate);
            if (m.No1Rate != null && Object.hasOwnProperty.call(m, "No1Rate"))
                w.uint32(21).float(m.No1Rate);
            if (m.No2Rate != null && Object.hasOwnProperty.call(m, "No2Rate"))
                w.uint32(29).float(m.No2Rate);
            if (m.No3Rate != null && Object.hasOwnProperty.call(m, "No3Rate"))
                w.uint32(37).float(m.No3Rate);
            if (m.No4Rate != null && Object.hasOwnProperty.call(m, "No4Rate"))
                w.uint32(45).float(m.No4Rate);
            if (m.AveWinXun != null && Object.hasOwnProperty.call(m, "AveWinXun"))
                w.uint32(53).float(m.AveWinXun);
            if (m.WinRate != null && Object.hasOwnProperty.call(m, "WinRate"))
                w.uint32(61).float(m.WinRate);
            if (m.FailRate != null && Object.hasOwnProperty.call(m, "FailRate"))
                w.uint32(69).float(m.FailRate);
            if (m.ReadyRate != null && Object.hasOwnProperty.call(m, "ReadyRate"))
                w.uint32(77).float(m.ReadyRate);
            if (m.FuluRate != null && Object.hasOwnProperty.call(m, "FuluRate"))
                w.uint32(85).float(m.FuluRate);
            if (m.TotalRound != null && Object.hasOwnProperty.call(m, "TotalRound"))
                w.uint32(88).uint32(m.TotalRound);
            if (m.AveWinPoint != null && Object.hasOwnProperty.call(m, "AveWinPoint"))
                w.uint32(101).float(m.AveWinPoint);
            if (m.AveFailPoint != null && Object.hasOwnProperty.call(m, "AveFailPoint"))
                w.uint32(109).float(m.AveFailPoint);
            return w;
        };

        ChangStatistic.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.ChangStatistic();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.AveRate = r.float();
                        break;
                    }
                case 2: {
                        m.No1Rate = r.float();
                        break;
                    }
                case 3: {
                        m.No2Rate = r.float();
                        break;
                    }
                case 4: {
                        m.No3Rate = r.float();
                        break;
                    }
                case 5: {
                        m.No4Rate = r.float();
                        break;
                    }
                case 6: {
                        m.AveWinXun = r.float();
                        break;
                    }
                case 7: {
                        m.WinRate = r.float();
                        break;
                    }
                case 8: {
                        m.FailRate = r.float();
                        break;
                    }
                case 9: {
                        m.ReadyRate = r.float();
                        break;
                    }
                case 10: {
                        m.FuluRate = r.float();
                        break;
                    }
                case 11: {
                        m.TotalRound = r.uint32();
                        break;
                    }
                case 12: {
                        m.AveWinPoint = r.float();
                        break;
                    }
                case 13: {
                        m.AveFailPoint = r.float();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ChangStatistic;
    })();

    club.Fulu = (function() {

        function Fulu(p) {
            this.Cards = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        Fulu.prototype.FuluType = 0;
        Fulu.prototype.Cards = $util.emptyArray;
        Fulu.prototype.Pos = 0;

        Fulu.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.FuluType != null && Object.hasOwnProperty.call(m, "FuluType"))
                w.uint32(8).int32(m.FuluType);
            if (m.Cards != null && m.Cards.length) {
                w.uint32(18).fork();
                for (var i = 0; i < m.Cards.length; ++i)
                    w.int32(m.Cards[i]);
                w.ldelim();
            }
            if (m.Pos != null && Object.hasOwnProperty.call(m, "Pos"))
                w.uint32(24).int32(m.Pos);
            return w;
        };

        Fulu.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.Fulu();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.FuluType = r.int32();
                        break;
                    }
                case 2: {
                        if (!(m.Cards && m.Cards.length))
                            m.Cards = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.Cards.push(r.int32());
                        } else
                            m.Cards.push(r.int32());
                        break;
                    }
                case 3: {
                        m.Pos = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return Fulu;
    })();

    club.RecentHeCard = (function() {

        function RecentHeCard(p) {
            this.RemCards = [];
            this.Fulus = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        RecentHeCard.prototype.RemCards = $util.emptyArray;
        RecentHeCard.prototype.Fulus = $util.emptyArray;
        RecentHeCard.prototype.ShowType = 0;

        RecentHeCard.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.RemCards != null && m.RemCards.length) {
                w.uint32(10).fork();
                for (var i = 0; i < m.RemCards.length; ++i)
                    w.int32(m.RemCards[i]);
                w.ldelim();
            }
            if (m.Fulus != null && m.Fulus.length) {
                for (var i = 0; i < m.Fulus.length; ++i)
                    $root.club.Fulu.encode(m.Fulus[i], w.uint32(18).fork()).ldelim();
            }
            if (m.ShowType != null && Object.hasOwnProperty.call(m, "ShowType"))
                w.uint32(24).uint32(m.ShowType);
            return w;
        };

        RecentHeCard.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.RecentHeCard();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        if (!(m.RemCards && m.RemCards.length))
                            m.RemCards = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.RemCards.push(r.int32());
                        } else
                            m.RemCards.push(r.int32());
                        break;
                    }
                case 2: {
                        if (!(m.Fulus && m.Fulus.length))
                            m.Fulus = [];
                        m.Fulus.push($root.club.Fulu.decode(r, r.uint32()));
                        break;
                    }
                case 3: {
                        m.ShowType = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return RecentHeCard;
    })();

    club.Fan = (function() {

        function Fan(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        Fan.prototype.type = 0;
        Fan.prototype.value = 0;

        Fan.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.type != null && Object.hasOwnProperty.call(m, "type"))
                w.uint32(8).uint32(m.type);
            if (m.value != null && Object.hasOwnProperty.call(m, "value"))
                w.uint32(16).uint32(m.value);
            return w;
        };

        Fan.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.Fan();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.type = r.uint32();
                        break;
                    }
                case 2: {
                        m.value = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return Fan;
    })();

    club.StatisticExtra = (function() {

        function StatisticExtra(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        StatisticExtra.prototype.heCount = 0;
        StatisticExtra.prototype.roundCount = 0;
        StatisticExtra.prototype.hePoint = 0;
        StatisticExtra.prototype.fuluCount = 0;
        StatisticExtra.prototype.fangpaoCount = 0;
        StatisticExtra.prototype.fangpaoPoint = 0;

        StatisticExtra.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.heCount != null && Object.hasOwnProperty.call(m, "heCount"))
                w.uint32(8).uint32(m.heCount);
            if (m.roundCount != null && Object.hasOwnProperty.call(m, "roundCount"))
                w.uint32(16).uint32(m.roundCount);
            if (m.hePoint != null && Object.hasOwnProperty.call(m, "hePoint"))
                w.uint32(29).float(m.hePoint);
            if (m.fuluCount != null && Object.hasOwnProperty.call(m, "fuluCount"))
                w.uint32(32).uint32(m.fuluCount);
            if (m.fangpaoCount != null && Object.hasOwnProperty.call(m, "fangpaoCount"))
                w.uint32(40).uint32(m.fangpaoCount);
            if (m.fangpaoPoint != null && Object.hasOwnProperty.call(m, "fangpaoPoint"))
                w.uint32(53).float(m.fangpaoPoint);
            return w;
        };

        StatisticExtra.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.StatisticExtra();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.heCount = r.uint32();
                        break;
                    }
                case 2: {
                        m.roundCount = r.uint32();
                        break;
                    }
                case 3: {
                        m.hePoint = r.float();
                        break;
                    }
                case 4: {
                        m.fuluCount = r.uint32();
                        break;
                    }
                case 5: {
                        m.fangpaoCount = r.uint32();
                        break;
                    }
                case 6: {
                        m.fangpaoPoint = r.float();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return StatisticExtra;
    })();

    club.Statistic = (function() {

        function Statistic(p) {
            this.position = [];
            this.fans = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        Statistic.prototype.recentHeCard = null;
        Statistic.prototype.winCard = 0;
        Statistic.prototype.power = 0;
        Statistic.prototype.defense = 0;
        Statistic.prototype.speed = 0;
        Statistic.prototype.luck = 0;
        Statistic.prototype.position = $util.emptyArray;
        Statistic.prototype.East = null;
        Statistic.prototype.South = null;
        Statistic.prototype.fans = $util.emptyArray;
        Statistic.prototype.Extra = null;

        Statistic.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.recentHeCard != null && Object.hasOwnProperty.call(m, "recentHeCard"))
                $root.club.RecentHeCard.encode(m.recentHeCard, w.uint32(10).fork()).ldelim();
            if (m.winCard != null && Object.hasOwnProperty.call(m, "winCard"))
                w.uint32(16).uint32(m.winCard);
            if (m.power != null && Object.hasOwnProperty.call(m, "power"))
                w.uint32(24).uint32(m.power);
            if (m.defense != null && Object.hasOwnProperty.call(m, "defense"))
                w.uint32(32).uint32(m.defense);
            if (m.speed != null && Object.hasOwnProperty.call(m, "speed"))
                w.uint32(40).uint32(m.speed);
            if (m.luck != null && Object.hasOwnProperty.call(m, "luck"))
                w.uint32(48).uint32(m.luck);
            if (m.position != null && m.position.length) {
                w.uint32(58).fork();
                for (var i = 0; i < m.position.length; ++i)
                    w.uint32(m.position[i]);
                w.ldelim();
            }
            if (m.East != null && Object.hasOwnProperty.call(m, "East"))
                $root.club.ChangStatistic.encode(m.East, w.uint32(66).fork()).ldelim();
            if (m.South != null && Object.hasOwnProperty.call(m, "South"))
                $root.club.ChangStatistic.encode(m.South, w.uint32(74).fork()).ldelim();
            if (m.fans != null && m.fans.length) {
                for (var i = 0; i < m.fans.length; ++i)
                    $root.club.Fan.encode(m.fans[i], w.uint32(82).fork()).ldelim();
            }
            if (m.Extra != null && Object.hasOwnProperty.call(m, "Extra"))
                $root.club.StatisticExtra.encode(m.Extra, w.uint32(90).fork()).ldelim();
            return w;
        };

        Statistic.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.Statistic();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.recentHeCard = $root.club.RecentHeCard.decode(r, r.uint32());
                        break;
                    }
                case 2: {
                        m.winCard = r.uint32();
                        break;
                    }
                case 3: {
                        m.power = r.uint32();
                        break;
                    }
                case 4: {
                        m.defense = r.uint32();
                        break;
                    }
                case 5: {
                        m.speed = r.uint32();
                        break;
                    }
                case 6: {
                        m.luck = r.uint32();
                        break;
                    }
                case 7: {
                        if (!(m.position && m.position.length))
                            m.position = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.position.push(r.uint32());
                        } else
                            m.position.push(r.uint32());
                        break;
                    }
                case 8: {
                        m.East = $root.club.ChangStatistic.decode(r, r.uint32());
                        break;
                    }
                case 9: {
                        m.South = $root.club.ChangStatistic.decode(r, r.uint32());
                        break;
                    }
                case 10: {
                        if (!(m.fans && m.fans.length))
                            m.fans = [];
                        m.fans.push($root.club.Fan.decode(r, r.uint32()));
                        break;
                    }
                case 11: {
                        m.Extra = $root.club.StatisticExtra.decode(r, r.uint32());
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return Statistic;
    })();

    club.PlayerInfo = (function() {

        function PlayerInfo(p) {
            this.joinedClubIdList = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        PlayerInfo.prototype.playerId = 0;
        PlayerInfo.prototype.name = "";
        PlayerInfo.prototype.avatarId = 0;
        PlayerInfo.prototype.avatarUrl = "";
        PlayerInfo.prototype.balance = 0;
        PlayerInfo.prototype.fee = 0;
        PlayerInfo.prototype.isOnline = false;
        PlayerInfo.prototype.joinedClubIdList = $util.emptyArray;
        PlayerInfo.prototype.recentClubId = 0;
        PlayerInfo.prototype.gouyu = 0;
        PlayerInfo.prototype.tongbi = 0;
        PlayerInfo.prototype.clubstatistic = null;
        PlayerInfo.prototype.friendstatistic = null;
        PlayerInfo.prototype.ledgerBalance = 0;
        PlayerInfo.prototype.lastLoginTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        PlayerInfo.prototype.lastPlayTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        PlayerInfo.prototype.totalRoundNo = 0;

        PlayerInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            if (m.name != null && Object.hasOwnProperty.call(m, "name"))
                w.uint32(18).string(m.name);
            if (m.avatarId != null && Object.hasOwnProperty.call(m, "avatarId"))
                w.uint32(24).uint32(m.avatarId);
            if (m.avatarUrl != null && Object.hasOwnProperty.call(m, "avatarUrl"))
                w.uint32(34).string(m.avatarUrl);
            if (m.balance != null && Object.hasOwnProperty.call(m, "balance"))
                w.uint32(45).float(m.balance);
            if (m.fee != null && Object.hasOwnProperty.call(m, "fee"))
                w.uint32(53).float(m.fee);
            if (m.isOnline != null && Object.hasOwnProperty.call(m, "isOnline"))
                w.uint32(56).bool(m.isOnline);
            if (m.joinedClubIdList != null && m.joinedClubIdList.length) {
                w.uint32(66).fork();
                for (var i = 0; i < m.joinedClubIdList.length; ++i)
                    w.uint32(m.joinedClubIdList[i]);
                w.ldelim();
            }
            if (m.recentClubId != null && Object.hasOwnProperty.call(m, "recentClubId"))
                w.uint32(72).uint32(m.recentClubId);
            if (m.gouyu != null && Object.hasOwnProperty.call(m, "gouyu"))
                w.uint32(80).uint32(m.gouyu);
            if (m.tongbi != null && Object.hasOwnProperty.call(m, "tongbi"))
                w.uint32(88).uint32(m.tongbi);
            if (m.clubstatistic != null && Object.hasOwnProperty.call(m, "clubstatistic"))
                $root.club.Statistic.encode(m.clubstatistic, w.uint32(98).fork()).ldelim();
            if (m.friendstatistic != null && Object.hasOwnProperty.call(m, "friendstatistic"))
                $root.club.Statistic.encode(m.friendstatistic, w.uint32(106).fork()).ldelim();
            if (m.ledgerBalance != null && Object.hasOwnProperty.call(m, "ledgerBalance"))
                w.uint32(117).float(m.ledgerBalance);
            if (m.lastLoginTime != null && Object.hasOwnProperty.call(m, "lastLoginTime"))
                w.uint32(120).int64(m.lastLoginTime);
            if (m.lastPlayTime != null && Object.hasOwnProperty.call(m, "lastPlayTime"))
                w.uint32(128).int64(m.lastPlayTime);
            if (m.totalRoundNo != null && Object.hasOwnProperty.call(m, "totalRoundNo"))
                w.uint32(136).uint32(m.totalRoundNo);
            return w;
        };

        PlayerInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.PlayerInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 2: {
                        m.name = r.string();
                        break;
                    }
                case 3: {
                        m.avatarId = r.uint32();
                        break;
                    }
                case 4: {
                        m.avatarUrl = r.string();
                        break;
                    }
                case 5: {
                        m.balance = r.float();
                        break;
                    }
                case 6: {
                        m.fee = r.float();
                        break;
                    }
                case 7: {
                        m.isOnline = r.bool();
                        break;
                    }
                case 8: {
                        if (!(m.joinedClubIdList && m.joinedClubIdList.length))
                            m.joinedClubIdList = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.joinedClubIdList.push(r.uint32());
                        } else
                            m.joinedClubIdList.push(r.uint32());
                        break;
                    }
                case 9: {
                        m.recentClubId = r.uint32();
                        break;
                    }
                case 10: {
                        m.gouyu = r.uint32();
                        break;
                    }
                case 11: {
                        m.tongbi = r.uint32();
                        break;
                    }
                case 12: {
                        m.clubstatistic = $root.club.Statistic.decode(r, r.uint32());
                        break;
                    }
                case 13: {
                        m.friendstatistic = $root.club.Statistic.decode(r, r.uint32());
                        break;
                    }
                case 14: {
                        m.ledgerBalance = r.float();
                        break;
                    }
                case 15: {
                        m.lastLoginTime = r.int64();
                        break;
                    }
                case 16: {
                        m.lastPlayTime = r.int64();
                        break;
                    }
                case 17: {
                        m.totalRoundNo = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return PlayerInfo;
    })();

    club.ClubPlayerInfo = (function() {

        function ClubPlayerInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ClubPlayerInfo.prototype.clubId = 0;
        ClubPlayerInfo.prototype.playerId = 0;
        ClubPlayerInfo.prototype.balance = 0;
        ClubPlayerInfo.prototype.fee = 0;
        ClubPlayerInfo.prototype.joininTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        ClubPlayerInfo.prototype.lastPlayTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        ClubPlayerInfo.prototype.maxWinCoins = 0;
        ClubPlayerInfo.prototype.maxWinPoints = 0;
        ClubPlayerInfo.prototype.totalRoundNo = 0;
        ClubPlayerInfo.prototype.ledgerBalance = 0;
        ClubPlayerInfo.prototype.status = 0;
        ClubPlayerInfo.prototype.playerName = "";
        ClubPlayerInfo.prototype.playerAvatarId = 0;
        ClubPlayerInfo.prototype.playerAvatarUrl = "";

        ClubPlayerInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(16).uint32(m.playerId);
            if (m.balance != null && Object.hasOwnProperty.call(m, "balance"))
                w.uint32(29).float(m.balance);
            if (m.fee != null && Object.hasOwnProperty.call(m, "fee"))
                w.uint32(37).float(m.fee);
            if (m.joininTime != null && Object.hasOwnProperty.call(m, "joininTime"))
                w.uint32(40).int64(m.joininTime);
            if (m.lastPlayTime != null && Object.hasOwnProperty.call(m, "lastPlayTime"))
                w.uint32(48).int64(m.lastPlayTime);
            if (m.maxWinCoins != null && Object.hasOwnProperty.call(m, "maxWinCoins"))
                w.uint32(61).float(m.maxWinCoins);
            if (m.maxWinPoints != null && Object.hasOwnProperty.call(m, "maxWinPoints"))
                w.uint32(69).float(m.maxWinPoints);
            if (m.totalRoundNo != null && Object.hasOwnProperty.call(m, "totalRoundNo"))
                w.uint32(72).uint32(m.totalRoundNo);
            if (m.ledgerBalance != null && Object.hasOwnProperty.call(m, "ledgerBalance"))
                w.uint32(85).float(m.ledgerBalance);
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(88).uint32(m.status);
            if (m.playerName != null && Object.hasOwnProperty.call(m, "playerName"))
                w.uint32(98).string(m.playerName);
            if (m.playerAvatarId != null && Object.hasOwnProperty.call(m, "playerAvatarId"))
                w.uint32(104).uint32(m.playerAvatarId);
            if (m.playerAvatarUrl != null && Object.hasOwnProperty.call(m, "playerAvatarUrl"))
                w.uint32(114).string(m.playerAvatarUrl);
            return w;
        };

        ClubPlayerInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.ClubPlayerInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 2: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 3: {
                        m.balance = r.float();
                        break;
                    }
                case 4: {
                        m.fee = r.float();
                        break;
                    }
                case 5: {
                        m.joininTime = r.int64();
                        break;
                    }
                case 6: {
                        m.lastPlayTime = r.int64();
                        break;
                    }
                case 7: {
                        m.maxWinCoins = r.float();
                        break;
                    }
                case 8: {
                        m.maxWinPoints = r.float();
                        break;
                    }
                case 9: {
                        m.totalRoundNo = r.uint32();
                        break;
                    }
                case 10: {
                        m.ledgerBalance = r.float();
                        break;
                    }
                case 11: {
                        m.status = r.uint32();
                        break;
                    }
                case 12: {
                        m.playerName = r.string();
                        break;
                    }
                case 13: {
                        m.playerAvatarId = r.uint32();
                        break;
                    }
                case 14: {
                        m.playerAvatarUrl = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ClubPlayerInfo;
    })();

    club.TablePlayerInfo = (function() {

        function TablePlayerInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        TablePlayerInfo.prototype.playerId = 0;
        TablePlayerInfo.prototype.amount = 0;
        TablePlayerInfo.prototype.varyAmount = 0;
        TablePlayerInfo.prototype.name = "";
        TablePlayerInfo.prototype.point = 0;
        TablePlayerInfo.prototype.rank = 0;
        TablePlayerInfo.prototype.avatarId = 0;
        TablePlayerInfo.prototype.avatarUrl = "";
        TablePlayerInfo.prototype.seatNum = 0;

        TablePlayerInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            if (m.amount != null && Object.hasOwnProperty.call(m, "amount"))
                w.uint32(21).float(m.amount);
            if (m.varyAmount != null && Object.hasOwnProperty.call(m, "varyAmount"))
                w.uint32(29).float(m.varyAmount);
            if (m.name != null && Object.hasOwnProperty.call(m, "name"))
                w.uint32(34).string(m.name);
            if (m.point != null && Object.hasOwnProperty.call(m, "point"))
                w.uint32(45).float(m.point);
            if (m.rank != null && Object.hasOwnProperty.call(m, "rank"))
                w.uint32(48).uint32(m.rank);
            if (m.avatarId != null && Object.hasOwnProperty.call(m, "avatarId"))
                w.uint32(56).uint32(m.avatarId);
            if (m.avatarUrl != null && Object.hasOwnProperty.call(m, "avatarUrl"))
                w.uint32(66).string(m.avatarUrl);
            if (m.seatNum != null && Object.hasOwnProperty.call(m, "seatNum"))
                w.uint32(72).uint32(m.seatNum);
            return w;
        };

        TablePlayerInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.TablePlayerInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 2: {
                        m.amount = r.float();
                        break;
                    }
                case 3: {
                        m.varyAmount = r.float();
                        break;
                    }
                case 4: {
                        m.name = r.string();
                        break;
                    }
                case 5: {
                        m.point = r.float();
                        break;
                    }
                case 6: {
                        m.rank = r.uint32();
                        break;
                    }
                case 7: {
                        m.avatarId = r.uint32();
                        break;
                    }
                case 8: {
                        m.avatarUrl = r.string();
                        break;
                    }
                case 9: {
                        m.seatNum = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return TablePlayerInfo;
    })();

    club.TableInfo = (function() {

        function TableInfo(p) {
            this.players = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        TableInfo.prototype.tableId = "";
        TableInfo.prototype.clubId = 0;
        TableInfo.prototype.ownerId = 0;
        TableInfo.prototype.mode = 0;
        TableInfo.prototype.roundNo = 0;
        TableInfo.prototype.thinkTime = 0;
        TableInfo.prototype.level = 0;
        TableInfo.prototype.bringInAmount = 0;
        TableInfo.prototype.fee = 0;
        TableInfo.prototype.startPoint = 0;
        TableInfo.prototype.redCard = 0;
        TableInfo.prototype.exPoint1 = 0;
        TableInfo.prototype.exPoint2 = 0;
        TableInfo.prototype.exPoint3 = 0;
        TableInfo.prototype.exPoint4 = 0;
        TableInfo.prototype.headJumpFlag = 0;
        TableInfo.prototype.doubleFlag = 0;
        TableInfo.prototype.hintFlag = 0;
        TableInfo.prototype.convenientFlag = 0;
        TableInfo.prototype.noWinnerFlag = 0;
        TableInfo.prototype.autoStartFlag = 0;
        TableInfo.prototype.players = $util.emptyArray;
        TableInfo.prototype.startAt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        TableInfo.prototype.finishAt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        TableInfo.prototype.status = 0;
        TableInfo.prototype.roomId = 0;
        TableInfo.prototype.clubName = "";
        TableInfo.prototype.gameId = 0;
        TableInfo.prototype.isSaved = 0;
        TableInfo.prototype.paipuLink = "";
        TableInfo.prototype.anoPaipuLink = "";
        TableInfo.prototype.paipuName = "";
        TableInfo.prototype.isDiamondClub = 0;
        TableInfo.prototype.isGpsIPCheck = false;
        TableInfo.prototype.createSrc = 0;

        TableInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.tableId != null && Object.hasOwnProperty.call(m, "tableId"))
                w.uint32(10).string(m.tableId);
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(16).uint32(m.clubId);
            if (m.ownerId != null && Object.hasOwnProperty.call(m, "ownerId"))
                w.uint32(24).uint32(m.ownerId);
            if (m.mode != null && Object.hasOwnProperty.call(m, "mode"))
                w.uint32(32).uint32(m.mode);
            if (m.roundNo != null && Object.hasOwnProperty.call(m, "roundNo"))
                w.uint32(40).uint32(m.roundNo);
            if (m.thinkTime != null && Object.hasOwnProperty.call(m, "thinkTime"))
                w.uint32(48).uint32(m.thinkTime);
            if (m.level != null && Object.hasOwnProperty.call(m, "level"))
                w.uint32(56).uint32(m.level);
            if (m.bringInAmount != null && Object.hasOwnProperty.call(m, "bringInAmount"))
                w.uint32(69).float(m.bringInAmount);
            if (m.fee != null && Object.hasOwnProperty.call(m, "fee"))
                w.uint32(72).uint32(m.fee);
            if (m.startPoint != null && Object.hasOwnProperty.call(m, "startPoint"))
                w.uint32(80).uint32(m.startPoint);
            if (m.redCard != null && Object.hasOwnProperty.call(m, "redCard"))
                w.uint32(88).uint32(m.redCard);
            if (m.exPoint1 != null && Object.hasOwnProperty.call(m, "exPoint1"))
                w.uint32(96).int32(m.exPoint1);
            if (m.exPoint2 != null && Object.hasOwnProperty.call(m, "exPoint2"))
                w.uint32(104).int32(m.exPoint2);
            if (m.exPoint3 != null && Object.hasOwnProperty.call(m, "exPoint3"))
                w.uint32(112).int32(m.exPoint3);
            if (m.exPoint4 != null && Object.hasOwnProperty.call(m, "exPoint4"))
                w.uint32(120).int32(m.exPoint4);
            if (m.headJumpFlag != null && Object.hasOwnProperty.call(m, "headJumpFlag"))
                w.uint32(128).uint32(m.headJumpFlag);
            if (m.doubleFlag != null && Object.hasOwnProperty.call(m, "doubleFlag"))
                w.uint32(136).uint32(m.doubleFlag);
            if (m.hintFlag != null && Object.hasOwnProperty.call(m, "hintFlag"))
                w.uint32(144).uint32(m.hintFlag);
            if (m.convenientFlag != null && Object.hasOwnProperty.call(m, "convenientFlag"))
                w.uint32(152).uint32(m.convenientFlag);
            if (m.noWinnerFlag != null && Object.hasOwnProperty.call(m, "noWinnerFlag"))
                w.uint32(160).uint32(m.noWinnerFlag);
            if (m.autoStartFlag != null && Object.hasOwnProperty.call(m, "autoStartFlag"))
                w.uint32(168).uint32(m.autoStartFlag);
            if (m.players != null && m.players.length) {
                for (var i = 0; i < m.players.length; ++i)
                    $root.club.TablePlayerInfo.encode(m.players[i], w.uint32(178).fork()).ldelim();
            }
            if (m.startAt != null && Object.hasOwnProperty.call(m, "startAt"))
                w.uint32(184).int64(m.startAt);
            if (m.finishAt != null && Object.hasOwnProperty.call(m, "finishAt"))
                w.uint32(192).int64(m.finishAt);
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(200).uint32(m.status);
            if (m.roomId != null && Object.hasOwnProperty.call(m, "roomId"))
                w.uint32(208).uint32(m.roomId);
            if (m.clubName != null && Object.hasOwnProperty.call(m, "clubName"))
                w.uint32(218).string(m.clubName);
            if (m.gameId != null && Object.hasOwnProperty.call(m, "gameId"))
                w.uint32(224).uint32(m.gameId);
            if (m.isSaved != null && Object.hasOwnProperty.call(m, "isSaved"))
                w.uint32(232).uint32(m.isSaved);
            if (m.paipuLink != null && Object.hasOwnProperty.call(m, "paipuLink"))
                w.uint32(242).string(m.paipuLink);
            if (m.anoPaipuLink != null && Object.hasOwnProperty.call(m, "anoPaipuLink"))
                w.uint32(250).string(m.anoPaipuLink);
            if (m.paipuName != null && Object.hasOwnProperty.call(m, "paipuName"))
                w.uint32(258).string(m.paipuName);
            if (m.isDiamondClub != null && Object.hasOwnProperty.call(m, "isDiamondClub"))
                w.uint32(264).uint32(m.isDiamondClub);
            if (m.isGpsIPCheck != null && Object.hasOwnProperty.call(m, "isGpsIPCheck"))
                w.uint32(272).bool(m.isGpsIPCheck);
            if (m.createSrc != null && Object.hasOwnProperty.call(m, "createSrc"))
                w.uint32(280).uint32(m.createSrc);
            return w;
        };

        TableInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.TableInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.tableId = r.string();
                        break;
                    }
                case 2: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 3: {
                        m.ownerId = r.uint32();
                        break;
                    }
                case 4: {
                        m.mode = r.uint32();
                        break;
                    }
                case 5: {
                        m.roundNo = r.uint32();
                        break;
                    }
                case 6: {
                        m.thinkTime = r.uint32();
                        break;
                    }
                case 7: {
                        m.level = r.uint32();
                        break;
                    }
                case 8: {
                        m.bringInAmount = r.float();
                        break;
                    }
                case 9: {
                        m.fee = r.uint32();
                        break;
                    }
                case 10: {
                        m.startPoint = r.uint32();
                        break;
                    }
                case 11: {
                        m.redCard = r.uint32();
                        break;
                    }
                case 12: {
                        m.exPoint1 = r.int32();
                        break;
                    }
                case 13: {
                        m.exPoint2 = r.int32();
                        break;
                    }
                case 14: {
                        m.exPoint3 = r.int32();
                        break;
                    }
                case 15: {
                        m.exPoint4 = r.int32();
                        break;
                    }
                case 16: {
                        m.headJumpFlag = r.uint32();
                        break;
                    }
                case 17: {
                        m.doubleFlag = r.uint32();
                        break;
                    }
                case 18: {
                        m.hintFlag = r.uint32();
                        break;
                    }
                case 19: {
                        m.convenientFlag = r.uint32();
                        break;
                    }
                case 20: {
                        m.noWinnerFlag = r.uint32();
                        break;
                    }
                case 21: {
                        m.autoStartFlag = r.uint32();
                        break;
                    }
                case 22: {
                        if (!(m.players && m.players.length))
                            m.players = [];
                        m.players.push($root.club.TablePlayerInfo.decode(r, r.uint32()));
                        break;
                    }
                case 23: {
                        m.startAt = r.int64();
                        break;
                    }
                case 24: {
                        m.finishAt = r.int64();
                        break;
                    }
                case 25: {
                        m.status = r.uint32();
                        break;
                    }
                case 26: {
                        m.roomId = r.uint32();
                        break;
                    }
                case 27: {
                        m.clubName = r.string();
                        break;
                    }
                case 28: {
                        m.gameId = r.uint32();
                        break;
                    }
                case 29: {
                        m.isSaved = r.uint32();
                        break;
                    }
                case 30: {
                        m.paipuLink = r.string();
                        break;
                    }
                case 31: {
                        m.anoPaipuLink = r.string();
                        break;
                    }
                case 32: {
                        m.paipuName = r.string();
                        break;
                    }
                case 33: {
                        m.isDiamondClub = r.uint32();
                        break;
                    }
                case 34: {
                        m.isGpsIPCheck = r.bool();
                        break;
                    }
                case 35: {
                        m.createSrc = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return TableInfo;
    })();

    club.OrderInfo = (function() {

        function OrderInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        OrderInfo.prototype.orderId = 0;
        OrderInfo.prototype.clubId = 0;
        OrderInfo.prototype.playerId = 0;
        OrderInfo.prototype.name = "";
        OrderInfo.prototype.payType = "";
        OrderInfo.prototype.coins = 0;
        OrderInfo.prototype.status = 0;
        OrderInfo.prototype.orderTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        OrderInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.orderId != null && Object.hasOwnProperty.call(m, "orderId"))
                w.uint32(8).uint32(m.orderId);
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(16).uint32(m.clubId);
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(24).uint32(m.playerId);
            if (m.name != null && Object.hasOwnProperty.call(m, "name"))
                w.uint32(34).string(m.name);
            if (m.payType != null && Object.hasOwnProperty.call(m, "payType"))
                w.uint32(42).string(m.payType);
            if (m.coins != null && Object.hasOwnProperty.call(m, "coins"))
                w.uint32(53).float(m.coins);
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(56).uint32(m.status);
            if (m.orderTime != null && Object.hasOwnProperty.call(m, "orderTime"))
                w.uint32(64).int64(m.orderTime);
            return w;
        };

        OrderInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.OrderInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.orderId = r.uint32();
                        break;
                    }
                case 2: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 3: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 4: {
                        m.name = r.string();
                        break;
                    }
                case 5: {
                        m.payType = r.string();
                        break;
                    }
                case 6: {
                        m.coins = r.float();
                        break;
                    }
                case 7: {
                        m.status = r.uint32();
                        break;
                    }
                case 8: {
                        m.orderTime = r.int64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return OrderInfo;
    })();

    club.MoneyInfo = (function() {

        function MoneyInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        MoneyInfo.prototype.orderId = 0;
        MoneyInfo.prototype.clubId = 0;
        MoneyInfo.prototype.payType = 0;
        MoneyInfo.prototype.coins = 0;
        MoneyInfo.prototype.amount = 0;
        MoneyInfo.prototype.orderTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        MoneyInfo.prototype.status = 0;

        MoneyInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.orderId != null && Object.hasOwnProperty.call(m, "orderId"))
                w.uint32(8).uint32(m.orderId);
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(16).uint32(m.clubId);
            if (m.coins != null && Object.hasOwnProperty.call(m, "coins"))
                w.uint32(37).float(m.coins);
            if (m.amount != null && Object.hasOwnProperty.call(m, "amount"))
                w.uint32(45).float(m.amount);
            if (m.orderTime != null && Object.hasOwnProperty.call(m, "orderTime"))
                w.uint32(48).int64(m.orderTime);
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(56).uint32(m.status);
            if (m.payType != null && Object.hasOwnProperty.call(m, "payType"))
                w.uint32(256).uint32(m.payType);
            return w;
        };

        MoneyInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.MoneyInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.orderId = r.uint32();
                        break;
                    }
                case 2: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 32: {
                        m.payType = r.uint32();
                        break;
                    }
                case 4: {
                        m.coins = r.float();
                        break;
                    }
                case 5: {
                        m.amount = r.float();
                        break;
                    }
                case 6: {
                        m.orderTime = r.int64();
                        break;
                    }
                case 7: {
                        m.status = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return MoneyInfo;
    })();

    club.ApplicationInfo = (function() {

        function ApplicationInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ApplicationInfo.prototype.playerId = 0;
        ApplicationInfo.prototype.name = "";
        ApplicationInfo.prototype.avatarId = 0;
        ApplicationInfo.prototype.avatarUrl = "";
        ApplicationInfo.prototype.comment = "";
        ApplicationInfo.prototype.applyTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        ApplicationInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            if (m.name != null && Object.hasOwnProperty.call(m, "name"))
                w.uint32(18).string(m.name);
            if (m.avatarId != null && Object.hasOwnProperty.call(m, "avatarId"))
                w.uint32(24).uint32(m.avatarId);
            if (m.avatarUrl != null && Object.hasOwnProperty.call(m, "avatarUrl"))
                w.uint32(34).string(m.avatarUrl);
            if (m.comment != null && Object.hasOwnProperty.call(m, "comment"))
                w.uint32(42).string(m.comment);
            if (m.applyTime != null && Object.hasOwnProperty.call(m, "applyTime"))
                w.uint32(48).int64(m.applyTime);
            return w;
        };

        ApplicationInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.ApplicationInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 2: {
                        m.name = r.string();
                        break;
                    }
                case 3: {
                        m.avatarId = r.uint32();
                        break;
                    }
                case 4: {
                        m.avatarUrl = r.string();
                        break;
                    }
                case 5: {
                        m.comment = r.string();
                        break;
                    }
                case 6: {
                        m.applyTime = r.int64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ApplicationInfo;
    })();

    club.ItemInfo = (function() {

        function ItemInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ItemInfo.prototype.itemId = 0;
        ItemInfo.prototype.avatarId = 0;
        ItemInfo.prototype.name = "";
        ItemInfo.prototype.coins = 0;
        ItemInfo.prototype.amount = 0;

        ItemInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.itemId != null && Object.hasOwnProperty.call(m, "itemId"))
                w.uint32(8).uint32(m.itemId);
            if (m.avatarId != null && Object.hasOwnProperty.call(m, "avatarId"))
                w.uint32(16).uint32(m.avatarId);
            if (m.name != null && Object.hasOwnProperty.call(m, "name"))
                w.uint32(26).string(m.name);
            if (m.coins != null && Object.hasOwnProperty.call(m, "coins"))
                w.uint32(32).uint32(m.coins);
            if (m.amount != null && Object.hasOwnProperty.call(m, "amount"))
                w.uint32(45).float(m.amount);
            return w;
        };

        ItemInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.ItemInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.itemId = r.uint32();
                        break;
                    }
                case 2: {
                        m.avatarId = r.uint32();
                        break;
                    }
                case 3: {
                        m.name = r.string();
                        break;
                    }
                case 4: {
                        m.coins = r.uint32();
                        break;
                    }
                case 5: {
                        m.amount = r.float();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ItemInfo;
    })();

    club.CreateClubReq = (function() {

        function CreateClubReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        CreateClubReq.prototype.name = "";
        CreateClubReq.prototype.avatarId = 0;
        CreateClubReq.prototype.avatarUrl = "";
        CreateClubReq.prototype.creatorId = 0;
        CreateClubReq.prototype.clubType = 0;
        CreateClubReq.prototype.maxPlayerNo = 0;
        CreateClubReq.prototype.clubStatus = 0;

        CreateClubReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.name != null && Object.hasOwnProperty.call(m, "name"))
                w.uint32(10).string(m.name);
            if (m.avatarId != null && Object.hasOwnProperty.call(m, "avatarId"))
                w.uint32(16).uint32(m.avatarId);
            if (m.avatarUrl != null && Object.hasOwnProperty.call(m, "avatarUrl"))
                w.uint32(26).string(m.avatarUrl);
            if (m.creatorId != null && Object.hasOwnProperty.call(m, "creatorId"))
                w.uint32(32).uint32(m.creatorId);
            if (m.clubType != null && Object.hasOwnProperty.call(m, "clubType"))
                w.uint32(40).uint32(m.clubType);
            if (m.maxPlayerNo != null && Object.hasOwnProperty.call(m, "maxPlayerNo"))
                w.uint32(48).uint32(m.maxPlayerNo);
            if (m.clubStatus != null && Object.hasOwnProperty.call(m, "clubStatus"))
                w.uint32(56).uint32(m.clubStatus);
            return w;
        };

        CreateClubReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.CreateClubReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.name = r.string();
                        break;
                    }
                case 2: {
                        m.avatarId = r.uint32();
                        break;
                    }
                case 3: {
                        m.avatarUrl = r.string();
                        break;
                    }
                case 4: {
                        m.creatorId = r.uint32();
                        break;
                    }
                case 5: {
                        m.clubType = r.uint32();
                        break;
                    }
                case 6: {
                        m.maxPlayerNo = r.uint32();
                        break;
                    }
                case 7: {
                        m.clubStatus = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return CreateClubReq;
    })();

    club.CreateClubResp = (function() {

        function CreateClubResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        CreateClubResp.prototype.res = "";
        CreateClubResp.prototype.msg = "";
        CreateClubResp.prototype.clubId = 0;

        CreateClubResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(24).uint32(m.clubId);
            return w;
        };

        CreateClubResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.CreateClubResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        m.clubId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return CreateClubResp;
    })();

    club.ModifyClubReq = (function() {

        function ModifyClubReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ModifyClubReq.prototype.clubId = 0;
        ModifyClubReq.prototype.name = "";
        ModifyClubReq.prototype.avatarId = 0;
        ModifyClubReq.prototype.avatarUrl = "";
        ModifyClubReq.prototype.clubType = 0;
        ModifyClubReq.prototype.clubStatus = 0;
        ModifyClubReq.prototype.maxPlayerNo = 0;

        ModifyClubReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            if (m.name != null && Object.hasOwnProperty.call(m, "name"))
                w.uint32(18).string(m.name);
            if (m.avatarId != null && Object.hasOwnProperty.call(m, "avatarId"))
                w.uint32(24).uint32(m.avatarId);
            if (m.avatarUrl != null && Object.hasOwnProperty.call(m, "avatarUrl"))
                w.uint32(34).string(m.avatarUrl);
            if (m.clubType != null && Object.hasOwnProperty.call(m, "clubType"))
                w.uint32(40).uint32(m.clubType);
            if (m.clubStatus != null && Object.hasOwnProperty.call(m, "clubStatus"))
                w.uint32(48).uint32(m.clubStatus);
            if (m.maxPlayerNo != null && Object.hasOwnProperty.call(m, "maxPlayerNo"))
                w.uint32(56).uint32(m.maxPlayerNo);
            return w;
        };

        ModifyClubReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.ModifyClubReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 2: {
                        m.name = r.string();
                        break;
                    }
                case 3: {
                        m.avatarId = r.uint32();
                        break;
                    }
                case 4: {
                        m.avatarUrl = r.string();
                        break;
                    }
                case 5: {
                        m.clubType = r.uint32();
                        break;
                    }
                case 6: {
                        m.clubStatus = r.uint32();
                        break;
                    }
                case 7: {
                        m.maxPlayerNo = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ModifyClubReq;
    })();

    club.ModifyClubResp = (function() {

        function ModifyClubResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ModifyClubResp.prototype.res = "";
        ModifyClubResp.prototype.msg = "";

        ModifyClubResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            return w;
        };

        ModifyClubResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.ModifyClubResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ModifyClubResp;
    })();

    club.ModifyClubTypeReq = (function() {

        function ModifyClubTypeReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ModifyClubTypeReq.prototype.clubId = 0;
        ModifyClubTypeReq.prototype.clubType = 0;

        ModifyClubTypeReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            if (m.clubType != null && Object.hasOwnProperty.call(m, "clubType"))
                w.uint32(16).uint32(m.clubType);
            return w;
        };

        ModifyClubTypeReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.ModifyClubTypeReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 2: {
                        m.clubType = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ModifyClubTypeReq;
    })();

    club.ModifyClubTypeResp = (function() {

        function ModifyClubTypeResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ModifyClubTypeResp.prototype.res = "";
        ModifyClubTypeResp.prototype.msg = "";

        ModifyClubTypeResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            return w;
        };

        ModifyClubTypeResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.ModifyClubTypeResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ModifyClubTypeResp;
    })();

    club.GetClubInfoReq = (function() {

        function GetClubInfoReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubInfoReq.prototype.clubId = 0;

        GetClubInfoReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            return w;
        };

        GetClubInfoReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubInfoReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubInfoReq;
    })();

    club.GetClubInfoResp = (function() {

        function GetClubInfoResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubInfoResp.prototype.res = "";
        GetClubInfoResp.prototype.msg = "";
        GetClubInfoResp.prototype.clubInfo = null;

        GetClubInfoResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.clubInfo != null && Object.hasOwnProperty.call(m, "clubInfo"))
                $root.club.ClubInfo.encode(m.clubInfo, w.uint32(26).fork()).ldelim();
            return w;
        };

        GetClubInfoResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubInfoResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        m.clubInfo = $root.club.ClubInfo.decode(r, r.uint32());
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubInfoResp;
    })();

    club.QuitClubReq = (function() {

        function QuitClubReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        QuitClubReq.prototype.clubId = 0;
        QuitClubReq.prototype.playerId = 0;

        QuitClubReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(16).uint32(m.playerId);
            return w;
        };

        QuitClubReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.QuitClubReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 2: {
                        m.playerId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return QuitClubReq;
    })();

    club.QuitClubResp = (function() {

        function QuitClubResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        QuitClubResp.prototype.res = "";
        QuitClubResp.prototype.msg = "";

        QuitClubResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            return w;
        };

        QuitClubResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.QuitClubResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return QuitClubResp;
    })();

    club.InvitePlayerReq = (function() {

        function InvitePlayerReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        InvitePlayerReq.prototype.clubId = 0;
        InvitePlayerReq.prototype.playerId = 0;
        InvitePlayerReq.prototype.comment = "";

        InvitePlayerReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(16).uint32(m.playerId);
            if (m.comment != null && Object.hasOwnProperty.call(m, "comment"))
                w.uint32(26).string(m.comment);
            return w;
        };

        InvitePlayerReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.InvitePlayerReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 2: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 3: {
                        m.comment = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return InvitePlayerReq;
    })();

    club.InvitePlayerResp = (function() {

        function InvitePlayerResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        InvitePlayerResp.prototype.res = "";
        InvitePlayerResp.prototype.msg = "";

        InvitePlayerResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            return w;
        };

        InvitePlayerResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.InvitePlayerResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return InvitePlayerResp;
    })();

    club.CheckApplicationReq = (function() {

        function CheckApplicationReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        CheckApplicationReq.prototype.playerId = 0;
        CheckApplicationReq.prototype.clubId = 0;
        CheckApplicationReq.prototype.ownerId = 0;

        CheckApplicationReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(16).uint32(m.clubId);
            if (m.ownerId != null && Object.hasOwnProperty.call(m, "ownerId"))
                w.uint32(24).uint32(m.ownerId);
            return w;
        };

        CheckApplicationReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.CheckApplicationReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 2: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 3: {
                        m.ownerId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return CheckApplicationReq;
    })();

    club.CheckApplicationResp = (function() {

        function CheckApplicationResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        CheckApplicationResp.prototype.res = "";
        CheckApplicationResp.prototype.msg = "";
        CheckApplicationResp.prototype.code = 0;

        CheckApplicationResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.code != null && Object.hasOwnProperty.call(m, "code"))
                w.uint32(24).uint32(m.code);
            return w;
        };

        CheckApplicationResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.CheckApplicationResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        m.code = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return CheckApplicationResp;
    })();

    club.SendClubJoinReq = (function() {

        function SendClubJoinReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SendClubJoinReq.prototype.playerId = 0;
        SendClubJoinReq.prototype.clubId = 0;
        SendClubJoinReq.prototype.ownerId = 0;
        SendClubJoinReq.prototype.comment = "";

        SendClubJoinReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(16).uint32(m.clubId);
            if (m.ownerId != null && Object.hasOwnProperty.call(m, "ownerId"))
                w.uint32(24).uint32(m.ownerId);
            if (m.comment != null && Object.hasOwnProperty.call(m, "comment"))
                w.uint32(34).string(m.comment);
            return w;
        };

        SendClubJoinReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.SendClubJoinReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 2: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 3: {
                        m.ownerId = r.uint32();
                        break;
                    }
                case 4: {
                        m.comment = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SendClubJoinReq;
    })();

    club.SendClubJoinResp = (function() {

        function SendClubJoinResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SendClubJoinResp.prototype.res = "";
        SendClubJoinResp.prototype.msg = "";

        SendClubJoinResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            return w;
        };

        SendClubJoinResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.SendClubJoinResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SendClubJoinResp;
    })();

    club.GetClubListReq = (function() {

        function GetClubListReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubListReq.prototype.playerId = 0;

        GetClubListReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            return w;
        };

        GetClubListReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubListReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubListReq;
    })();

    club.GetClubListResp = (function() {

        function GetClubListResp(p) {
            this.clubList = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubListResp.prototype.res = "";
        GetClubListResp.prototype.msg = "";
        GetClubListResp.prototype.clubList = $util.emptyArray;

        GetClubListResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.clubList != null && m.clubList.length) {
                for (var i = 0; i < m.clubList.length; ++i)
                    $root.club.ClubInfo.encode(m.clubList[i], w.uint32(26).fork()).ldelim();
            }
            return w;
        };

        GetClubListResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubListResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        if (!(m.clubList && m.clubList.length))
                            m.clubList = [];
                        m.clubList.push($root.club.ClubInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubListResp;
    })();

    club.CreateTableReq = (function() {

        function CreateTableReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        CreateTableReq.prototype.clubId = 0;
        CreateTableReq.prototype.ownerId = 0;
        CreateTableReq.prototype.mode = 0;
        CreateTableReq.prototype.roundNo = 0;
        CreateTableReq.prototype.thinkTime = 0;
        CreateTableReq.prototype.level = 0;
        CreateTableReq.prototype.bringInAmount = 0;
        CreateTableReq.prototype.fee = 0;
        CreateTableReq.prototype.redCard = 0;
        CreateTableReq.prototype.exPoint1 = 0;
        CreateTableReq.prototype.exPoint2 = 0;
        CreateTableReq.prototype.exPoint3 = 0;
        CreateTableReq.prototype.exPoint4 = 0;
        CreateTableReq.prototype.headJumpFlag = 0;
        CreateTableReq.prototype.doubleFlag = 0;
        CreateTableReq.prototype.hintFlag = 0;
        CreateTableReq.prototype.convenientFlag = 0;
        CreateTableReq.prototype.noWinnerFlag = 0;
        CreateTableReq.prototype.autoStartFlag = 0;
        CreateTableReq.prototype.startPoint = 0;
        CreateTableReq.prototype.isGpsIPCheck = false;

        CreateTableReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            if (m.ownerId != null && Object.hasOwnProperty.call(m, "ownerId"))
                w.uint32(16).uint32(m.ownerId);
            if (m.mode != null && Object.hasOwnProperty.call(m, "mode"))
                w.uint32(24).uint32(m.mode);
            if (m.roundNo != null && Object.hasOwnProperty.call(m, "roundNo"))
                w.uint32(32).uint32(m.roundNo);
            if (m.thinkTime != null && Object.hasOwnProperty.call(m, "thinkTime"))
                w.uint32(40).uint32(m.thinkTime);
            if (m.level != null && Object.hasOwnProperty.call(m, "level"))
                w.uint32(48).uint32(m.level);
            if (m.bringInAmount != null && Object.hasOwnProperty.call(m, "bringInAmount"))
                w.uint32(61).float(m.bringInAmount);
            if (m.fee != null && Object.hasOwnProperty.call(m, "fee"))
                w.uint32(64).uint32(m.fee);
            if (m.redCard != null && Object.hasOwnProperty.call(m, "redCard"))
                w.uint32(80).uint32(m.redCard);
            if (m.exPoint1 != null && Object.hasOwnProperty.call(m, "exPoint1"))
                w.uint32(88).int32(m.exPoint1);
            if (m.exPoint2 != null && Object.hasOwnProperty.call(m, "exPoint2"))
                w.uint32(96).int32(m.exPoint2);
            if (m.exPoint3 != null && Object.hasOwnProperty.call(m, "exPoint3"))
                w.uint32(104).int32(m.exPoint3);
            if (m.exPoint4 != null && Object.hasOwnProperty.call(m, "exPoint4"))
                w.uint32(112).int32(m.exPoint4);
            if (m.headJumpFlag != null && Object.hasOwnProperty.call(m, "headJumpFlag"))
                w.uint32(120).uint32(m.headJumpFlag);
            if (m.doubleFlag != null && Object.hasOwnProperty.call(m, "doubleFlag"))
                w.uint32(128).uint32(m.doubleFlag);
            if (m.hintFlag != null && Object.hasOwnProperty.call(m, "hintFlag"))
                w.uint32(136).uint32(m.hintFlag);
            if (m.convenientFlag != null && Object.hasOwnProperty.call(m, "convenientFlag"))
                w.uint32(144).uint32(m.convenientFlag);
            if (m.noWinnerFlag != null && Object.hasOwnProperty.call(m, "noWinnerFlag"))
                w.uint32(152).uint32(m.noWinnerFlag);
            if (m.autoStartFlag != null && Object.hasOwnProperty.call(m, "autoStartFlag"))
                w.uint32(160).uint32(m.autoStartFlag);
            if (m.startPoint != null && Object.hasOwnProperty.call(m, "startPoint"))
                w.uint32(168).uint32(m.startPoint);
            if (m.isGpsIPCheck != null && Object.hasOwnProperty.call(m, "isGpsIPCheck"))
                w.uint32(176).bool(m.isGpsIPCheck);
            return w;
        };

        CreateTableReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.CreateTableReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 2: {
                        m.ownerId = r.uint32();
                        break;
                    }
                case 3: {
                        m.mode = r.uint32();
                        break;
                    }
                case 4: {
                        m.roundNo = r.uint32();
                        break;
                    }
                case 5: {
                        m.thinkTime = r.uint32();
                        break;
                    }
                case 6: {
                        m.level = r.uint32();
                        break;
                    }
                case 7: {
                        m.bringInAmount = r.float();
                        break;
                    }
                case 8: {
                        m.fee = r.uint32();
                        break;
                    }
                case 10: {
                        m.redCard = r.uint32();
                        break;
                    }
                case 11: {
                        m.exPoint1 = r.int32();
                        break;
                    }
                case 12: {
                        m.exPoint2 = r.int32();
                        break;
                    }
                case 13: {
                        m.exPoint3 = r.int32();
                        break;
                    }
                case 14: {
                        m.exPoint4 = r.int32();
                        break;
                    }
                case 15: {
                        m.headJumpFlag = r.uint32();
                        break;
                    }
                case 16: {
                        m.doubleFlag = r.uint32();
                        break;
                    }
                case 17: {
                        m.hintFlag = r.uint32();
                        break;
                    }
                case 18: {
                        m.convenientFlag = r.uint32();
                        break;
                    }
                case 19: {
                        m.noWinnerFlag = r.uint32();
                        break;
                    }
                case 20: {
                        m.autoStartFlag = r.uint32();
                        break;
                    }
                case 21: {
                        m.startPoint = r.uint32();
                        break;
                    }
                case 22: {
                        m.isGpsIPCheck = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return CreateTableReq;
    })();

    club.CreateTableResp = (function() {

        function CreateTableResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        CreateTableResp.prototype.res = "";
        CreateTableResp.prototype.msg = "";
        CreateTableResp.prototype.tableId = "";
        CreateTableResp.prototype.roomId = 0;

        CreateTableResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.tableId != null && Object.hasOwnProperty.call(m, "tableId"))
                w.uint32(26).string(m.tableId);
            if (m.roomId != null && Object.hasOwnProperty.call(m, "roomId"))
                w.uint32(32).uint32(m.roomId);
            return w;
        };

        CreateTableResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.CreateTableResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        m.tableId = r.string();
                        break;
                    }
                case 4: {
                        m.roomId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return CreateTableResp;
    })();

    club.CloseTableReq = (function() {

        function CloseTableReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        CloseTableReq.prototype.clubId = 0;
        CloseTableReq.prototype.ownerId = 0;
        CloseTableReq.prototype.tableId = "";

        CloseTableReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            if (m.ownerId != null && Object.hasOwnProperty.call(m, "ownerId"))
                w.uint32(16).uint32(m.ownerId);
            if (m.tableId != null && Object.hasOwnProperty.call(m, "tableId"))
                w.uint32(26).string(m.tableId);
            return w;
        };

        CloseTableReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.CloseTableReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 2: {
                        m.ownerId = r.uint32();
                        break;
                    }
                case 3: {
                        m.tableId = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return CloseTableReq;
    })();

    club.CloseTableResp = (function() {

        function CloseTableResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        CloseTableResp.prototype.res = "";
        CloseTableResp.prototype.msg = "";

        CloseTableResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            return w;
        };

        CloseTableResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.CloseTableResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return CloseTableResp;
    })();

    club.ModifyTableReq = (function() {

        function ModifyTableReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ModifyTableReq.prototype.tableId = "";
        ModifyTableReq.prototype.status = 0;

        ModifyTableReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.tableId != null && Object.hasOwnProperty.call(m, "tableId"))
                w.uint32(10).string(m.tableId);
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(16).uint32(m.status);
            return w;
        };

        ModifyTableReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.ModifyTableReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.tableId = r.string();
                        break;
                    }
                case 2: {
                        m.status = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ModifyTableReq;
    })();

    club.ModifyTableResp = (function() {

        function ModifyTableResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ModifyTableResp.prototype.res = "";
        ModifyTableResp.prototype.msg = "";

        ModifyTableResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            return w;
        };

        ModifyTableResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.ModifyTableResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ModifyTableResp;
    })();

    club.GetTableInfoReq = (function() {

        function GetTableInfoReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetTableInfoReq.prototype.tableId = "";

        GetTableInfoReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.tableId != null && Object.hasOwnProperty.call(m, "tableId"))
                w.uint32(10).string(m.tableId);
            return w;
        };

        GetTableInfoReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetTableInfoReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.tableId = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetTableInfoReq;
    })();

    club.GetTableInfoResp = (function() {

        function GetTableInfoResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetTableInfoResp.prototype.res = "";
        GetTableInfoResp.prototype.msg = "";
        GetTableInfoResp.prototype.tableInfo = null;

        GetTableInfoResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.tableInfo != null && Object.hasOwnProperty.call(m, "tableInfo"))
                $root.club.TableInfo.encode(m.tableInfo, w.uint32(26).fork()).ldelim();
            return w;
        };

        GetTableInfoResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetTableInfoResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        m.tableInfo = $root.club.TableInfo.decode(r, r.uint32());
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetTableInfoResp;
    })();

    club.GetClubPlayerListReq = (function() {

        function GetClubPlayerListReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubPlayerListReq.prototype.clubId = 0;

        GetClubPlayerListReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            return w;
        };

        GetClubPlayerListReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubPlayerListReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubPlayerListReq;
    })();

    club.GetClubPlayerListResp = (function() {

        function GetClubPlayerListResp(p) {
            this.playerList = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubPlayerListResp.prototype.res = "";
        GetClubPlayerListResp.prototype.msg = "";
        GetClubPlayerListResp.prototype.ownerId = 0;
        GetClubPlayerListResp.prototype.playerList = $util.emptyArray;

        GetClubPlayerListResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.ownerId != null && Object.hasOwnProperty.call(m, "ownerId"))
                w.uint32(24).uint32(m.ownerId);
            if (m.playerList != null && m.playerList.length) {
                for (var i = 0; i < m.playerList.length; ++i)
                    $root.club.PlayerInfo.encode(m.playerList[i], w.uint32(34).fork()).ldelim();
            }
            return w;
        };

        GetClubPlayerListResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubPlayerListResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        m.ownerId = r.uint32();
                        break;
                    }
                case 4: {
                        if (!(m.playerList && m.playerList.length))
                            m.playerList = [];
                        m.playerList.push($root.club.PlayerInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubPlayerListResp;
    })();

    club.GetClubPlayerDetailReq = (function() {

        function GetClubPlayerDetailReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubPlayerDetailReq.prototype.playerId = 0;
        GetClubPlayerDetailReq.prototype.clubId = 0;
        GetClubPlayerDetailReq.prototype.startTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        GetClubPlayerDetailReq.prototype.endTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        GetClubPlayerDetailReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(16).uint32(m.clubId);
            if (m.startTime != null && Object.hasOwnProperty.call(m, "startTime"))
                w.uint32(24).int64(m.startTime);
            if (m.endTime != null && Object.hasOwnProperty.call(m, "endTime"))
                w.uint32(32).int64(m.endTime);
            return w;
        };

        GetClubPlayerDetailReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubPlayerDetailReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 2: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 3: {
                        m.startTime = r.int64();
                        break;
                    }
                case 4: {
                        m.endTime = r.int64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubPlayerDetailReq;
    })();

    club.GetClubPlayerDetailResp = (function() {

        function GetClubPlayerDetailResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubPlayerDetailResp.prototype.res = "";
        GetClubPlayerDetailResp.prototype.msg = "";
        GetClubPlayerDetailResp.prototype.clubPlayerInfo = null;

        GetClubPlayerDetailResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.clubPlayerInfo != null && Object.hasOwnProperty.call(m, "clubPlayerInfo"))
                $root.club.ClubPlayerInfo.encode(m.clubPlayerInfo, w.uint32(26).fork()).ldelim();
            return w;
        };

        GetClubPlayerDetailResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubPlayerDetailResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        m.clubPlayerInfo = $root.club.ClubPlayerInfo.decode(r, r.uint32());
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubPlayerDetailResp;
    })();

    club.SetClubPlayerDetailReq = (function() {

        function SetClubPlayerDetailReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SetClubPlayerDetailReq.prototype.playerId = 0;
        SetClubPlayerDetailReq.prototype.clubId = 0;
        SetClubPlayerDetailReq.prototype.varyBalance = 0;
        SetClubPlayerDetailReq.prototype.timeStamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        SetClubPlayerDetailReq.prototype.sign = "";
        SetClubPlayerDetailReq.prototype.source = 0;
        SetClubPlayerDetailReq.prototype.payType = 0;

        SetClubPlayerDetailReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(16).uint32(m.clubId);
            if (m.varyBalance != null && Object.hasOwnProperty.call(m, "varyBalance"))
                w.uint32(29).float(m.varyBalance);
            if (m.timeStamp != null && Object.hasOwnProperty.call(m, "timeStamp"))
                w.uint32(32).int64(m.timeStamp);
            if (m.sign != null && Object.hasOwnProperty.call(m, "sign"))
                w.uint32(42).string(m.sign);
            if (m.source != null && Object.hasOwnProperty.call(m, "source"))
                w.uint32(48).uint32(m.source);
            if (m.payType != null && Object.hasOwnProperty.call(m, "payType"))
                w.uint32(56).uint32(m.payType);
            return w;
        };

        SetClubPlayerDetailReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.SetClubPlayerDetailReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 2: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 3: {
                        m.varyBalance = r.float();
                        break;
                    }
                case 4: {
                        m.timeStamp = r.int64();
                        break;
                    }
                case 5: {
                        m.sign = r.string();
                        break;
                    }
                case 6: {
                        m.source = r.uint32();
                        break;
                    }
                case 7: {
                        m.payType = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SetClubPlayerDetailReq;
    })();

    club.SetClubPlayerDetailResp = (function() {

        function SetClubPlayerDetailResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SetClubPlayerDetailResp.prototype.res = "";
        SetClubPlayerDetailResp.prototype.msg = "";
        SetClubPlayerDetailResp.prototype.balance = 0;

        SetClubPlayerDetailResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.balance != null && Object.hasOwnProperty.call(m, "balance"))
                w.uint32(29).float(m.balance);
            return w;
        };

        SetClubPlayerDetailResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.SetClubPlayerDetailResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        m.balance = r.float();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SetClubPlayerDetailResp;
    })();

    club.SetClubPlayerDCReq = (function() {

        function SetClubPlayerDCReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SetClubPlayerDCReq.prototype.playerId = 0;
        SetClubPlayerDCReq.prototype.clubId = 0;
        SetClubPlayerDCReq.prototype.varyBalance = 0;

        SetClubPlayerDCReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(16).uint32(m.clubId);
            if (m.varyBalance != null && Object.hasOwnProperty.call(m, "varyBalance"))
                w.uint32(29).float(m.varyBalance);
            return w;
        };

        SetClubPlayerDCReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.SetClubPlayerDCReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 2: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 3: {
                        m.varyBalance = r.float();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SetClubPlayerDCReq;
    })();

    club.SetClubPlayerDCResp = (function() {

        function SetClubPlayerDCResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SetClubPlayerDCResp.prototype.status = 0;

        SetClubPlayerDCResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(8).uint32(m.status);
            return w;
        };

        SetClubPlayerDCResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.SetClubPlayerDCResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.status = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SetClubPlayerDCResp;
    })();

    club.GetClubPlayerDCReq = (function() {

        function GetClubPlayerDCReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubPlayerDCReq.prototype.playerId = 0;
        GetClubPlayerDCReq.prototype.clubId = 0;

        GetClubPlayerDCReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(16).uint32(m.clubId);
            return w;
        };

        GetClubPlayerDCReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubPlayerDCReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 2: {
                        m.clubId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubPlayerDCReq;
    })();

    club.GetClubPlayerDCResp = (function() {

        function GetClubPlayerDCResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubPlayerDCResp.prototype.clubType = 0;
        GetClubPlayerDCResp.prototype.clubPlayerInfo = null;

        GetClubPlayerDCResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubType != null && Object.hasOwnProperty.call(m, "clubType"))
                w.uint32(8).uint32(m.clubType);
            if (m.clubPlayerInfo != null && Object.hasOwnProperty.call(m, "clubPlayerInfo"))
                $root.club.ClubPlayerInfo.encode(m.clubPlayerInfo, w.uint32(18).fork()).ldelim();
            return w;
        };

        GetClubPlayerDCResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubPlayerDCResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubType = r.uint32();
                        break;
                    }
                case 2: {
                        m.clubPlayerInfo = $root.club.ClubPlayerInfo.decode(r, r.uint32());
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubPlayerDCResp;
    })();

    club.GetGameStartReq = (function() {

        function GetGameStartReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetGameStartReq.prototype.clubId = 0;
        GetGameStartReq.prototype.tableId = "";
        GetGameStartReq.prototype.gameId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        GetGameStartReq.prototype.startAt = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        GetGameStartReq.prototype.status = 0;

        GetGameStartReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            if (m.tableId != null && Object.hasOwnProperty.call(m, "tableId"))
                w.uint32(18).string(m.tableId);
            if (m.gameId != null && Object.hasOwnProperty.call(m, "gameId"))
                w.uint32(24).int64(m.gameId);
            if (m.startAt != null && Object.hasOwnProperty.call(m, "startAt"))
                w.uint32(32).int64(m.startAt);
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(40).uint32(m.status);
            return w;
        };

        GetGameStartReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetGameStartReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 2: {
                        m.tableId = r.string();
                        break;
                    }
                case 3: {
                        m.gameId = r.int64();
                        break;
                    }
                case 4: {
                        m.startAt = r.int64();
                        break;
                    }
                case 5: {
                        m.status = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetGameStartReq;
    })();

    club.GetGameStartResp = (function() {

        function GetGameStartResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetGameStartResp.prototype.status = 0;

        GetGameStartResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(8).uint32(m.status);
            return w;
        };

        GetGameStartResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetGameStartResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.status = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetGameStartResp;
    })();

    club.KickoutClubPlayerReq = (function() {

        function KickoutClubPlayerReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        KickoutClubPlayerReq.prototype.clubId = 0;
        KickoutClubPlayerReq.prototype.playerId = 0;

        KickoutClubPlayerReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(16).uint32(m.playerId);
            return w;
        };

        KickoutClubPlayerReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.KickoutClubPlayerReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 2: {
                        m.playerId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return KickoutClubPlayerReq;
    })();

    club.KickoutClubPlayerResp = (function() {

        function KickoutClubPlayerResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        KickoutClubPlayerResp.prototype.res = "";
        KickoutClubPlayerResp.prototype.msg = "";

        KickoutClubPlayerResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            return w;
        };

        KickoutClubPlayerResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.KickoutClubPlayerResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return KickoutClubPlayerResp;
    })();

    club.GetClubAppliCationListReq = (function() {

        function GetClubAppliCationListReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubAppliCationListReq.prototype.clubId = 0;
        GetClubAppliCationListReq.prototype.ownerId = 0;

        GetClubAppliCationListReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            if (m.ownerId != null && Object.hasOwnProperty.call(m, "ownerId"))
                w.uint32(16).uint32(m.ownerId);
            return w;
        };

        GetClubAppliCationListReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubAppliCationListReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 2: {
                        m.ownerId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubAppliCationListReq;
    })();

    club.GetClubAppliCationListResp = (function() {

        function GetClubAppliCationListResp(p) {
            this.applicationList = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubAppliCationListResp.prototype.res = "";
        GetClubAppliCationListResp.prototype.msg = "";
        GetClubAppliCationListResp.prototype.applicationList = $util.emptyArray;

        GetClubAppliCationListResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.applicationList != null && m.applicationList.length) {
                for (var i = 0; i < m.applicationList.length; ++i)
                    $root.club.ApplicationInfo.encode(m.applicationList[i], w.uint32(26).fork()).ldelim();
            }
            return w;
        };

        GetClubAppliCationListResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubAppliCationListResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        if (!(m.applicationList && m.applicationList.length))
                            m.applicationList = [];
                        m.applicationList.push($root.club.ApplicationInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubAppliCationListResp;
    })();

    club.GetClubOrderListReq = (function() {

        function GetClubOrderListReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubOrderListReq.prototype.clubId = 0;
        GetClubOrderListReq.prototype.startTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        GetClubOrderListReq.prototype.endTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        GetClubOrderListReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            if (m.startTime != null && Object.hasOwnProperty.call(m, "startTime"))
                w.uint32(16).int64(m.startTime);
            if (m.endTime != null && Object.hasOwnProperty.call(m, "endTime"))
                w.uint32(24).int64(m.endTime);
            return w;
        };

        GetClubOrderListReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubOrderListReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 2: {
                        m.startTime = r.int64();
                        break;
                    }
                case 3: {
                        m.endTime = r.int64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubOrderListReq;
    })();

    club.GetClubOrderListResp = (function() {

        function GetClubOrderListResp(p) {
            this.orderList = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubOrderListResp.prototype.res = "";
        GetClubOrderListResp.prototype.msg = "";
        GetClubOrderListResp.prototype.orderList = $util.emptyArray;

        GetClubOrderListResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.orderList != null && m.orderList.length) {
                for (var i = 0; i < m.orderList.length; ++i)
                    $root.club.OrderInfo.encode(m.orderList[i], w.uint32(26).fork()).ldelim();
            }
            return w;
        };

        GetClubOrderListResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubOrderListResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        if (!(m.orderList && m.orderList.length))
                            m.orderList = [];
                        m.orderList.push($root.club.OrderInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubOrderListResp;
    })();

    club.GetClubTableListReq = (function() {

        function GetClubTableListReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubTableListReq.prototype.clubId = 0;
        GetClubTableListReq.prototype.status = 0;

        GetClubTableListReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(16).uint32(m.status);
            return w;
        };

        GetClubTableListReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubTableListReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 2: {
                        m.status = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubTableListReq;
    })();

    club.GetClubTableListResp = (function() {

        function GetClubTableListResp(p) {
            this.tableList = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubTableListResp.prototype.res = "";
        GetClubTableListResp.prototype.msg = "";
        GetClubTableListResp.prototype.tableList = $util.emptyArray;

        GetClubTableListResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.tableList != null && m.tableList.length) {
                for (var i = 0; i < m.tableList.length; ++i)
                    $root.club.TableInfo.encode(m.tableList[i], w.uint32(26).fork()).ldelim();
            }
            return w;
        };

        GetClubTableListResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubTableListResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        if (!(m.tableList && m.tableList.length))
                            m.tableList = [];
                        m.tableList.push($root.club.TableInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubTableListResp;
    })();

    club.GetFriendTableListReq = (function() {

        function GetFriendTableListReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetFriendTableListReq.prototype.playerId = 0;
        GetFriendTableListReq.prototype.status = 0;

        GetFriendTableListReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(16).uint32(m.status);
            return w;
        };

        GetFriendTableListReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetFriendTableListReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 2: {
                        m.status = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetFriendTableListReq;
    })();

    club.GetFriendTableListResp = (function() {

        function GetFriendTableListResp(p) {
            this.tableList = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetFriendTableListResp.prototype.res = "";
        GetFriendTableListResp.prototype.msg = "";
        GetFriendTableListResp.prototype.tableList = $util.emptyArray;

        GetFriendTableListResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.tableList != null && m.tableList.length) {
                for (var i = 0; i < m.tableList.length; ++i)
                    $root.club.TableInfo.encode(m.tableList[i], w.uint32(26).fork()).ldelim();
            }
            return w;
        };

        GetFriendTableListResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetFriendTableListResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        if (!(m.tableList && m.tableList.length))
                            m.tableList = [];
                        m.tableList.push($root.club.TableInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetFriendTableListResp;
    })();

    club.GetFriendTableReq = (function() {

        function GetFriendTableReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetFriendTableReq.prototype.roomId = 0;

        GetFriendTableReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roomId != null && Object.hasOwnProperty.call(m, "roomId"))
                w.uint32(8).uint32(m.roomId);
            return w;
        };

        GetFriendTableReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetFriendTableReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roomId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetFriendTableReq;
    })();

    club.GetFriendTableResp = (function() {

        function GetFriendTableResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetFriendTableResp.prototype.res = "";
        GetFriendTableResp.prototype.msg = "";
        GetFriendTableResp.prototype.tableInfo = null;

        GetFriendTableResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.tableInfo != null && Object.hasOwnProperty.call(m, "tableInfo"))
                $root.club.TableInfo.encode(m.tableInfo, w.uint32(26).fork()).ldelim();
            return w;
        };

        GetFriendTableResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetFriendTableResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        m.tableInfo = $root.club.TableInfo.decode(r, r.uint32());
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetFriendTableResp;
    })();

    club.GetPlayerInfoReq = (function() {

        function GetPlayerInfoReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetPlayerInfoReq.prototype.playerId = 0;
        GetPlayerInfoReq.prototype.mode = 0;

        GetPlayerInfoReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            if (m.mode != null && Object.hasOwnProperty.call(m, "mode"))
                w.uint32(16).uint32(m.mode);
            return w;
        };

        GetPlayerInfoReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetPlayerInfoReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 2: {
                        m.mode = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetPlayerInfoReq;
    })();

    club.GetPlayerInfoResp = (function() {

        function GetPlayerInfoResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetPlayerInfoResp.prototype.res = "";
        GetPlayerInfoResp.prototype.msg = "";
        GetPlayerInfoResp.prototype.playerInfo = null;

        GetPlayerInfoResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.playerInfo != null && Object.hasOwnProperty.call(m, "playerInfo"))
                $root.club.PlayerInfo.encode(m.playerInfo, w.uint32(26).fork()).ldelim();
            return w;
        };

        GetPlayerInfoResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetPlayerInfoResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        m.playerInfo = $root.club.PlayerInfo.decode(r, r.uint32());
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetPlayerInfoResp;
    })();

    club.GetClubPlayerGameHistoryReq = (function() {

        function GetClubPlayerGameHistoryReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubPlayerGameHistoryReq.prototype.playerId = 0;
        GetClubPlayerGameHistoryReq.prototype.clubId = 0;
        GetClubPlayerGameHistoryReq.prototype.startTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        GetClubPlayerGameHistoryReq.prototype.endTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        GetClubPlayerGameHistoryReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(16).uint32(m.clubId);
            if (m.startTime != null && Object.hasOwnProperty.call(m, "startTime"))
                w.uint32(24).int64(m.startTime);
            if (m.endTime != null && Object.hasOwnProperty.call(m, "endTime"))
                w.uint32(32).int64(m.endTime);
            return w;
        };

        GetClubPlayerGameHistoryReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubPlayerGameHistoryReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 2: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 3: {
                        m.startTime = r.int64();
                        break;
                    }
                case 4: {
                        m.endTime = r.int64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubPlayerGameHistoryReq;
    })();

    club.GetClubPlayerGameHistoryResp = (function() {

        function GetClubPlayerGameHistoryResp(p) {
            this.tableList = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubPlayerGameHistoryResp.prototype.res = "";
        GetClubPlayerGameHistoryResp.prototype.msg = "";
        GetClubPlayerGameHistoryResp.prototype.totalRoundNo = 0;
        GetClubPlayerGameHistoryResp.prototype.fee = 0;
        GetClubPlayerGameHistoryResp.prototype.balance = 0;
        GetClubPlayerGameHistoryResp.prototype.tableList = $util.emptyArray;

        GetClubPlayerGameHistoryResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.totalRoundNo != null && Object.hasOwnProperty.call(m, "totalRoundNo"))
                w.uint32(24).uint32(m.totalRoundNo);
            if (m.fee != null && Object.hasOwnProperty.call(m, "fee"))
                w.uint32(37).float(m.fee);
            if (m.balance != null && Object.hasOwnProperty.call(m, "balance"))
                w.uint32(45).float(m.balance);
            if (m.tableList != null && m.tableList.length) {
                for (var i = 0; i < m.tableList.length; ++i)
                    $root.club.TableInfo.encode(m.tableList[i], w.uint32(50).fork()).ldelim();
            }
            return w;
        };

        GetClubPlayerGameHistoryResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubPlayerGameHistoryResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        m.totalRoundNo = r.uint32();
                        break;
                    }
                case 4: {
                        m.fee = r.float();
                        break;
                    }
                case 5: {
                        m.balance = r.float();
                        break;
                    }
                case 6: {
                        if (!(m.tableList && m.tableList.length))
                            m.tableList = [];
                        m.tableList.push($root.club.TableInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubPlayerGameHistoryResp;
    })();

    club.GetPlayerGameHistoryReq = (function() {

        function GetPlayerGameHistoryReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetPlayerGameHistoryReq.prototype.playerId = 0;
        GetPlayerGameHistoryReq.prototype.mode = 0;

        GetPlayerGameHistoryReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            if (m.mode != null && Object.hasOwnProperty.call(m, "mode"))
                w.uint32(16).uint32(m.mode);
            return w;
        };

        GetPlayerGameHistoryReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetPlayerGameHistoryReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 2: {
                        m.mode = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetPlayerGameHistoryReq;
    })();

    club.GetPlayerGameHistoryResp = (function() {

        function GetPlayerGameHistoryResp(p) {
            this.tableList = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetPlayerGameHistoryResp.prototype.res = "";
        GetPlayerGameHistoryResp.prototype.msg = "";
        GetPlayerGameHistoryResp.prototype.tableList = $util.emptyArray;

        GetPlayerGameHistoryResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.tableList != null && m.tableList.length) {
                for (var i = 0; i < m.tableList.length; ++i)
                    $root.club.TableInfo.encode(m.tableList[i], w.uint32(26).fork()).ldelim();
            }
            return w;
        };

        GetPlayerGameHistoryResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetPlayerGameHistoryResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        if (!(m.tableList && m.tableList.length))
                            m.tableList = [];
                        m.tableList.push($root.club.TableInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetPlayerGameHistoryResp;
    })();

    club.GetClubItemListReq = (function() {

        function GetClubItemListReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubItemListReq.prototype.clubId = 0;

        GetClubItemListReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            return w;
        };

        GetClubItemListReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubItemListReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubItemListReq;
    })();

    club.GetClubItemListResp = (function() {

        function GetClubItemListResp(p) {
            this.itemList = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubItemListResp.prototype.res = "";
        GetClubItemListResp.prototype.msg = "";
        GetClubItemListResp.prototype.itemList = $util.emptyArray;

        GetClubItemListResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.itemList != null && m.itemList.length) {
                for (var i = 0; i < m.itemList.length; ++i)
                    $root.club.ItemInfo.encode(m.itemList[i], w.uint32(26).fork()).ldelim();
            }
            return w;
        };

        GetClubItemListResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubItemListResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        if (!(m.itemList && m.itemList.length))
                            m.itemList = [];
                        m.itemList.push($root.club.ItemInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubItemListResp;
    })();

    club.GetClubMoneyOrderListReq = (function() {

        function GetClubMoneyOrderListReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubMoneyOrderListReq.prototype.clubId = 0;
        GetClubMoneyOrderListReq.prototype.startTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        GetClubMoneyOrderListReq.prototype.endTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        GetClubMoneyOrderListReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            if (m.startTime != null && Object.hasOwnProperty.call(m, "startTime"))
                w.uint32(16).int64(m.startTime);
            if (m.endTime != null && Object.hasOwnProperty.call(m, "endTime"))
                w.uint32(24).int64(m.endTime);
            return w;
        };

        GetClubMoneyOrderListReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubMoneyOrderListReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 2: {
                        m.startTime = r.int64();
                        break;
                    }
                case 3: {
                        m.endTime = r.int64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubMoneyOrderListReq;
    })();

    club.GetClubMoneyOrderListResp = (function() {

        function GetClubMoneyOrderListResp(p) {
            this.MoneyList = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetClubMoneyOrderListResp.prototype.res = "";
        GetClubMoneyOrderListResp.prototype.msg = "";
        GetClubMoneyOrderListResp.prototype.MoneyList = $util.emptyArray;

        GetClubMoneyOrderListResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.MoneyList != null && m.MoneyList.length) {
                for (var i = 0; i < m.MoneyList.length; ++i)
                    $root.club.MoneyInfo.encode(m.MoneyList[i], w.uint32(26).fork()).ldelim();
            }
            return w;
        };

        GetClubMoneyOrderListResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetClubMoneyOrderListResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        if (!(m.MoneyList && m.MoneyList.length))
                            m.MoneyList = [];
                        m.MoneyList.push($root.club.MoneyInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetClubMoneyOrderListResp;
    })();

    club.DecideClubJoinReq = (function() {

        function DecideClubJoinReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        DecideClubJoinReq.prototype.clubId = 0;
        DecideClubJoinReq.prototype.playerId = 0;
        DecideClubJoinReq.prototype.decision = false;
        DecideClubJoinReq.prototype.ownerId = 0;
        DecideClubJoinReq.prototype.applicationId = "";
        DecideClubJoinReq.prototype.Comment = "";

        DecideClubJoinReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(16).uint32(m.playerId);
            if (m.decision != null && Object.hasOwnProperty.call(m, "decision"))
                w.uint32(24).bool(m.decision);
            if (m.ownerId != null && Object.hasOwnProperty.call(m, "ownerId"))
                w.uint32(32).uint32(m.ownerId);
            if (m.applicationId != null && Object.hasOwnProperty.call(m, "applicationId"))
                w.uint32(42).string(m.applicationId);
            if (m.Comment != null && Object.hasOwnProperty.call(m, "Comment"))
                w.uint32(50).string(m.Comment);
            return w;
        };

        DecideClubJoinReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.DecideClubJoinReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 2: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 3: {
                        m.decision = r.bool();
                        break;
                    }
                case 4: {
                        m.ownerId = r.uint32();
                        break;
                    }
                case 5: {
                        m.applicationId = r.string();
                        break;
                    }
                case 6: {
                        m.Comment = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return DecideClubJoinReq;
    })();

    club.DecideClubJoinResp = (function() {

        function DecideClubJoinResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        DecideClubJoinResp.prototype.res = "";
        DecideClubJoinResp.prototype.msg = "";

        DecideClubJoinResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            return w;
        };

        DecideClubJoinResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.DecideClubJoinResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return DecideClubJoinResp;
    })();

    club.JoinTableReq = (function() {

        function JoinTableReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        JoinTableReq.prototype.tableId = "";
        JoinTableReq.prototype.playerId = 0;
        JoinTableReq.prototype.seatNum = 0;

        JoinTableReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.tableId != null && Object.hasOwnProperty.call(m, "tableId"))
                w.uint32(10).string(m.tableId);
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(16).uint32(m.playerId);
            if (m.seatNum != null && Object.hasOwnProperty.call(m, "seatNum"))
                w.uint32(24).uint32(m.seatNum);
            return w;
        };

        JoinTableReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.JoinTableReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.tableId = r.string();
                        break;
                    }
                case 2: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 3: {
                        m.seatNum = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return JoinTableReq;
    })();

    club.JoinTableResp = (function() {

        function JoinTableResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        JoinTableResp.prototype.res = "";
        JoinTableResp.prototype.msg = "";

        JoinTableResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            return w;
        };

        JoinTableResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.JoinTableResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return JoinTableResp;
    })();

    club.QuitTableReq = (function() {

        function QuitTableReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        QuitTableReq.prototype.tableId = "";
        QuitTableReq.prototype.playerId = 0;

        QuitTableReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.tableId != null && Object.hasOwnProperty.call(m, "tableId"))
                w.uint32(10).string(m.tableId);
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(16).uint32(m.playerId);
            return w;
        };

        QuitTableReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.QuitTableReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.tableId = r.string();
                        break;
                    }
                case 2: {
                        m.playerId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return QuitTableReq;
    })();

    club.QuitTableResp = (function() {

        function QuitTableResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        QuitTableResp.prototype.res = "";
        QuitTableResp.prototype.msg = "";

        QuitTableResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            return w;
        };

        QuitTableResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.QuitTableResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return QuitTableResp;
    })();

    club.QueryTableReq = (function() {

        function QueryTableReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        QueryTableReq.prototype.tableId = "";

        QueryTableReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.tableId != null && Object.hasOwnProperty.call(m, "tableId"))
                w.uint32(10).string(m.tableId);
            return w;
        };

        QueryTableReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.QueryTableReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.tableId = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return QueryTableReq;
    })();

    club.QueryTableResp = (function() {

        function QueryTableResp(p) {
            this.players = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        QueryTableResp.prototype.res = "";
        QueryTableResp.prototype.msg = "";
        QueryTableResp.prototype.players = $util.emptyArray;

        QueryTableResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.players != null && m.players.length) {
                for (var i = 0; i < m.players.length; ++i)
                    $root.club.PlayerInfo.encode(m.players[i], w.uint32(26).fork()).ldelim();
            }
            return w;
        };

        QueryTableResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.QueryTableResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        if (!(m.players && m.players.length))
                            m.players = [];
                        m.players.push($root.club.PlayerInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return QueryTableResp;
    })();

    club.SetPredefinedCardReq = (function() {

        function SetPredefinedCardReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SetPredefinedCardReq.prototype.tableId = "";
        SetPredefinedCardReq.prototype.card = "";

        SetPredefinedCardReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.tableId != null && Object.hasOwnProperty.call(m, "tableId"))
                w.uint32(10).string(m.tableId);
            if (m.card != null && Object.hasOwnProperty.call(m, "card"))
                w.uint32(18).string(m.card);
            return w;
        };

        SetPredefinedCardReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.SetPredefinedCardReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.tableId = r.string();
                        break;
                    }
                case 2: {
                        m.card = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SetPredefinedCardReq;
    })();

    club.SetPredefinedCardResp = (function() {

        function SetPredefinedCardResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SetPredefinedCardResp.prototype.res = "";
        SetPredefinedCardResp.prototype.msg = "";

        SetPredefinedCardResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            return w;
        };

        SetPredefinedCardResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.SetPredefinedCardResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SetPredefinedCardResp;
    })();

    club.UpdateTableReq = (function() {

        function UpdateTableReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        UpdateTableReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            return w;
        };

        UpdateTableReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.UpdateTableReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return UpdateTableReq;
    })();

    club.UpdateTableResp = (function() {

        function UpdateTableResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        UpdateTableResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            return w;
        };

        UpdateTableResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.UpdateTableResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return UpdateTableResp;
    })();

    club.SaveGameHistoryReq = (function() {

        function SaveGameHistoryReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SaveGameHistoryReq.prototype.playerId = 0;
        SaveGameHistoryReq.prototype.tableId = "";
        SaveGameHistoryReq.prototype.gameId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        SaveGameHistoryReq.prototype.save = 0;
        SaveGameHistoryReq.prototype.name = "";

        SaveGameHistoryReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            if (m.tableId != null && Object.hasOwnProperty.call(m, "tableId"))
                w.uint32(18).string(m.tableId);
            if (m.gameId != null && Object.hasOwnProperty.call(m, "gameId"))
                w.uint32(24).int64(m.gameId);
            if (m.save != null && Object.hasOwnProperty.call(m, "save"))
                w.uint32(32).uint32(m.save);
            if (m.name != null && Object.hasOwnProperty.call(m, "name"))
                w.uint32(42).string(m.name);
            return w;
        };

        SaveGameHistoryReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.SaveGameHistoryReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 2: {
                        m.tableId = r.string();
                        break;
                    }
                case 3: {
                        m.gameId = r.int64();
                        break;
                    }
                case 4: {
                        m.save = r.uint32();
                        break;
                    }
                case 5: {
                        m.name = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SaveGameHistoryReq;
    })();

    club.SaveGameHistoryResp = (function() {

        function SaveGameHistoryResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SaveGameHistoryResp.prototype.res = "";
        SaveGameHistoryResp.prototype.msg = "";

        SaveGameHistoryResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            return w;
        };

        SaveGameHistoryResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.SaveGameHistoryResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SaveGameHistoryResp;
    })();

    club.GetGameHistoryDetailReq = (function() {

        function GetGameHistoryDetailReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetGameHistoryDetailReq.prototype.tableId = "";
        GetGameHistoryDetailReq.prototype.gameId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        GetGameHistoryDetailReq.prototype.playerId = 0;
        GetGameHistoryDetailReq.prototype.paipuLink = "";
        GetGameHistoryDetailReq.prototype.mode = 0;

        GetGameHistoryDetailReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.tableId != null && Object.hasOwnProperty.call(m, "tableId"))
                w.uint32(10).string(m.tableId);
            if (m.gameId != null && Object.hasOwnProperty.call(m, "gameId"))
                w.uint32(16).int64(m.gameId);
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(24).uint32(m.playerId);
            if (m.paipuLink != null && Object.hasOwnProperty.call(m, "paipuLink"))
                w.uint32(34).string(m.paipuLink);
            if (m.mode != null && Object.hasOwnProperty.call(m, "mode"))
                w.uint32(40).uint32(m.mode);
            return w;
        };

        GetGameHistoryDetailReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetGameHistoryDetailReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.tableId = r.string();
                        break;
                    }
                case 2: {
                        m.gameId = r.int64();
                        break;
                    }
                case 3: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 4: {
                        m.paipuLink = r.string();
                        break;
                    }
                case 5: {
                        m.mode = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetGameHistoryDetailReq;
    })();

    club.PaipuData = (function() {

        function PaipuData(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        PaipuData.prototype.holdemcode = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        PaipuData.prototype.jsondata = "";
        PaipuData.prototype.logtime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        PaipuData.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.holdemcode != null && Object.hasOwnProperty.call(m, "holdemcode"))
                w.uint32(8).int64(m.holdemcode);
            if (m.jsondata != null && Object.hasOwnProperty.call(m, "jsondata"))
                w.uint32(18).string(m.jsondata);
            if (m.logtime != null && Object.hasOwnProperty.call(m, "logtime"))
                w.uint32(24).int64(m.logtime);
            return w;
        };

        PaipuData.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.PaipuData();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.holdemcode = r.int64();
                        break;
                    }
                case 2: {
                        m.jsondata = r.string();
                        break;
                    }
                case 3: {
                        m.logtime = r.int64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return PaipuData;
    })();

    club.GetGameHistoryDetailResp = (function() {

        function GetGameHistoryDetailResp(p) {
            this.data = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetGameHistoryDetailResp.prototype.res = "";
        GetGameHistoryDetailResp.prototype.msg = "";
        GetGameHistoryDetailResp.prototype.tableId = "";
        GetGameHistoryDetailResp.prototype.gameId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        GetGameHistoryDetailResp.prototype.data = $util.emptyArray;

        GetGameHistoryDetailResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.tableId != null && Object.hasOwnProperty.call(m, "tableId"))
                w.uint32(26).string(m.tableId);
            if (m.gameId != null && Object.hasOwnProperty.call(m, "gameId"))
                w.uint32(32).int64(m.gameId);
            if (m.data != null && m.data.length) {
                for (var i = 0; i < m.data.length; ++i)
                    $root.club.PaipuData.encode(m.data[i], w.uint32(42).fork()).ldelim();
            }
            return w;
        };

        GetGameHistoryDetailResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetGameHistoryDetailResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        m.tableId = r.string();
                        break;
                    }
                case 4: {
                        m.gameId = r.int64();
                        break;
                    }
                case 5: {
                        if (!(m.data && m.data.length))
                            m.data = [];
                        m.data.push($root.club.PaipuData.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetGameHistoryDetailResp;
    })();

    club.PushPlayerInfo = (function() {

        function PushPlayerInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        PushPlayerInfo.prototype.PlayerId = 0;
        PushPlayerInfo.prototype.PlayerName = "";
        PushPlayerInfo.prototype.AvatarId = 0;
        PushPlayerInfo.prototype.AvatarUrl = "";
        PushPlayerInfo.prototype.SeatNum = 0;

        PushPlayerInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.PlayerId != null && Object.hasOwnProperty.call(m, "PlayerId"))
                w.uint32(8).uint32(m.PlayerId);
            if (m.PlayerName != null && Object.hasOwnProperty.call(m, "PlayerName"))
                w.uint32(18).string(m.PlayerName);
            if (m.AvatarId != null && Object.hasOwnProperty.call(m, "AvatarId"))
                w.uint32(24).uint32(m.AvatarId);
            if (m.AvatarUrl != null && Object.hasOwnProperty.call(m, "AvatarUrl"))
                w.uint32(34).string(m.AvatarUrl);
            if (m.SeatNum != null && Object.hasOwnProperty.call(m, "SeatNum"))
                w.uint32(40).uint32(m.SeatNum);
            return w;
        };

        PushPlayerInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.PushPlayerInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.PlayerId = r.uint32();
                        break;
                    }
                case 2: {
                        m.PlayerName = r.string();
                        break;
                    }
                case 3: {
                        m.AvatarId = r.uint32();
                        break;
                    }
                case 4: {
                        m.AvatarUrl = r.string();
                        break;
                    }
                case 5: {
                        m.SeatNum = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return PushPlayerInfo;
    })();

    club.PushMsg = (function() {

        function PushMsg(p) {
            this.Players = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        PushMsg.prototype.Code = 0;
        PushMsg.prototype.ClubId = 0;
        PushMsg.prototype.ClubName = "";
        PushMsg.prototype.TableId = "";
        PushMsg.prototype.Players = $util.emptyArray;

        PushMsg.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.Code != null && Object.hasOwnProperty.call(m, "Code"))
                w.uint32(8).uint32(m.Code);
            if (m.ClubId != null && Object.hasOwnProperty.call(m, "ClubId"))
                w.uint32(16).uint32(m.ClubId);
            if (m.ClubName != null && Object.hasOwnProperty.call(m, "ClubName"))
                w.uint32(26).string(m.ClubName);
            if (m.TableId != null && Object.hasOwnProperty.call(m, "TableId"))
                w.uint32(34).string(m.TableId);
            if (m.Players != null && m.Players.length) {
                for (var i = 0; i < m.Players.length; ++i)
                    $root.club.PushPlayerInfo.encode(m.Players[i], w.uint32(42).fork()).ldelim();
            }
            return w;
        };

        PushMsg.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.PushMsg();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.Code = r.uint32();
                        break;
                    }
                case 2: {
                        m.ClubId = r.uint32();
                        break;
                    }
                case 3: {
                        m.ClubName = r.string();
                        break;
                    }
                case 4: {
                        m.TableId = r.string();
                        break;
                    }
                case 5: {
                        if (!(m.Players && m.Players.length))
                            m.Players = [];
                        m.Players.push($root.club.PushPlayerInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return PushMsg;
    })();

    club.GetPlayingTalbeIdReq = (function() {

        function GetPlayingTalbeIdReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetPlayingTalbeIdReq.prototype.clubId = 0;
        GetPlayingTalbeIdReq.prototype.playerId = 0;

        GetPlayingTalbeIdReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(8).uint32(m.clubId);
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(16).uint32(m.playerId);
            return w;
        };

        GetPlayingTalbeIdReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetPlayingTalbeIdReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 2: {
                        m.playerId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetPlayingTalbeIdReq;
    })();

    club.GetPlayingTalbeIdResp = (function() {

        function GetPlayingTalbeIdResp(p) {
            this.tableList = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetPlayingTalbeIdResp.prototype.res = "";
        GetPlayingTalbeIdResp.prototype.msg = "";
        GetPlayingTalbeIdResp.prototype.tableList = $util.emptyArray;

        GetPlayingTalbeIdResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.tableList != null && m.tableList.length) {
                for (var i = 0; i < m.tableList.length; ++i)
                    $root.club.TableInfo.encode(m.tableList[i], w.uint32(26).fork()).ldelim();
            }
            return w;
        };

        GetPlayingTalbeIdResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetPlayingTalbeIdResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        if (!(m.tableList && m.tableList.length))
                            m.tableList = [];
                        m.tableList.push($root.club.TableInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetPlayingTalbeIdResp;
    })();

    club.GetWBBindInfoReq = (function() {

        function GetWBBindInfoReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetWBBindInfoReq.prototype.playerId = 0;

        GetWBBindInfoReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            return w;
        };

        GetWBBindInfoReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetWBBindInfoReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetWBBindInfoReq;
    })();

    club.GetWBBindInfoResp = (function() {

        function GetWBBindInfoResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetWBBindInfoResp.prototype.res = "";
        GetWBBindInfoResp.prototype.msg = "";
        GetWBBindInfoResp.prototype.isWBBind = false;
        GetWBBindInfoResp.prototype.WBbalance = 0;
        GetWBBindInfoResp.prototype.icon = "";
        GetWBBindInfoResp.prototype.mobile = "";
        GetWBBindInfoResp.prototype.nick = "";

        GetWBBindInfoResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.isWBBind != null && Object.hasOwnProperty.call(m, "isWBBind"))
                w.uint32(24).bool(m.isWBBind);
            if (m.WBbalance != null && Object.hasOwnProperty.call(m, "WBbalance"))
                w.uint32(37).float(m.WBbalance);
            if (m.icon != null && Object.hasOwnProperty.call(m, "icon"))
                w.uint32(42).string(m.icon);
            if (m.mobile != null && Object.hasOwnProperty.call(m, "mobile"))
                w.uint32(50).string(m.mobile);
            if (m.nick != null && Object.hasOwnProperty.call(m, "nick"))
                w.uint32(58).string(m.nick);
            return w;
        };

        GetWBBindInfoResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetWBBindInfoResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        m.isWBBind = r.bool();
                        break;
                    }
                case 4: {
                        m.WBbalance = r.float();
                        break;
                    }
                case 5: {
                        m.icon = r.string();
                        break;
                    }
                case 6: {
                        m.mobile = r.string();
                        break;
                    }
                case 7: {
                        m.nick = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetWBBindInfoResp;
    })();

    club.GetWBRandCodeReq = (function() {

        function GetWBRandCodeReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetWBRandCodeReq.prototype.playerId = 0;

        GetWBRandCodeReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            return w;
        };

        GetWBRandCodeReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetWBRandCodeReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetWBRandCodeReq;
    })();

    club.GetWBRandCodeResp = (function() {

        function GetWBRandCodeResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetWBRandCodeResp.prototype.res = "";
        GetWBRandCodeResp.prototype.msg = "";
        GetWBRandCodeResp.prototype.code = "";
        GetWBRandCodeResp.prototype.extraParam = "";

        GetWBRandCodeResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.code != null && Object.hasOwnProperty.call(m, "code"))
                w.uint32(26).string(m.code);
            if (m.extraParam != null && Object.hasOwnProperty.call(m, "extraParam"))
                w.uint32(34).string(m.extraParam);
            return w;
        };

        GetWBRandCodeResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetWBRandCodeResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        m.code = r.string();
                        break;
                    }
                case 4: {
                        m.extraParam = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetWBRandCodeResp;
    })();

    club.GetWBLoginTokenReq = (function() {

        function GetWBLoginTokenReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetWBLoginTokenReq.prototype.playerId = 0;

        GetWBLoginTokenReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            return w;
        };

        GetWBLoginTokenReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetWBLoginTokenReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetWBLoginTokenReq;
    })();

    club.GetWBLoginTokenResp = (function() {

        function GetWBLoginTokenResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GetWBLoginTokenResp.prototype.res = "";
        GetWBLoginTokenResp.prototype.msg = "";
        GetWBLoginTokenResp.prototype.token = "";
        GetWBLoginTokenResp.prototype.time = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        GetWBLoginTokenResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.token != null && Object.hasOwnProperty.call(m, "token"))
                w.uint32(26).string(m.token);
            if (m.time != null && Object.hasOwnProperty.call(m, "time"))
                w.uint32(32).int64(m.time);
            return w;
        };

        GetWBLoginTokenResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.GetWBLoginTokenResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        m.token = r.string();
                        break;
                    }
                case 4: {
                        m.time = r.int64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GetWBLoginTokenResp;
    })();

    club.CancelWBBindReq = (function() {

        function CancelWBBindReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        CancelWBBindReq.prototype.playerId = 0;

        CancelWBBindReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            return w;
        };

        CancelWBBindReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.CancelWBBindReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return CancelWBBindReq;
    })();

    club.CancelWBBindResp = (function() {

        function CancelWBBindResp(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        CancelWBBindResp.prototype.res = "";
        CancelWBBindResp.prototype.msg = "";

        CancelWBBindResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            return w;
        };

        CancelWBBindResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.CancelWBBindResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return CancelWBBindResp;
    })();

    club.MatchingJoinReq = (function() {

        function MatchingJoinReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        MatchingJoinReq.prototype.playerId = 0;
        MatchingJoinReq.prototype.clubId = 0;
        MatchingJoinReq.prototype.roundNo = 0;
        MatchingJoinReq.prototype.level = 0;
        MatchingJoinReq.prototype.clubType = 0;

        MatchingJoinReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(16).uint32(m.clubId);
            if (m.roundNo != null && Object.hasOwnProperty.call(m, "roundNo"))
                w.uint32(24).uint32(m.roundNo);
            if (m.level != null && Object.hasOwnProperty.call(m, "level"))
                w.uint32(32).uint32(m.level);
            if (m.clubType != null && Object.hasOwnProperty.call(m, "clubType"))
                w.uint32(40).uint32(m.clubType);
            return w;
        };

        MatchingJoinReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.MatchingJoinReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 2: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 3: {
                        m.roundNo = r.uint32();
                        break;
                    }
                case 4: {
                        m.level = r.uint32();
                        break;
                    }
                case 5: {
                        m.clubType = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return MatchingJoinReq;
    })();

    club.MatchingQuitReq = (function() {

        function MatchingQuitReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        MatchingQuitReq.prototype.playerId = 0;

        MatchingQuitReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            return w;
        };

        MatchingQuitReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.MatchingQuitReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return MatchingQuitReq;
    })();

    club.MatchingQueryReq = (function() {

        function MatchingQueryReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        MatchingQueryReq.prototype.playerId = 0;
        MatchingQueryReq.prototype.clubId = 0;
        MatchingQueryReq.prototype.roundNo = 0;
        MatchingQueryReq.prototype.level = 0;

        MatchingQueryReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerId != null && Object.hasOwnProperty.call(m, "playerId"))
                w.uint32(8).uint32(m.playerId);
            if (m.clubId != null && Object.hasOwnProperty.call(m, "clubId"))
                w.uint32(16).uint32(m.clubId);
            if (m.roundNo != null && Object.hasOwnProperty.call(m, "roundNo"))
                w.uint32(24).uint32(m.roundNo);
            if (m.level != null && Object.hasOwnProperty.call(m, "level"))
                w.uint32(32).uint32(m.level);
            return w;
        };

        MatchingQueryReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.MatchingQueryReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.playerId = r.uint32();
                        break;
                    }
                case 2: {
                        m.clubId = r.uint32();
                        break;
                    }
                case 3: {
                        m.roundNo = r.uint32();
                        break;
                    }
                case 4: {
                        m.level = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return MatchingQueryReq;
    })();

    club.MatchingResp = (function() {

        function MatchingResp(p) {
            this.players = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        MatchingResp.prototype.res = "";
        MatchingResp.prototype.msg = "";
        MatchingResp.prototype.playerNo = 0;
        MatchingResp.prototype.players = $util.emptyArray;

        MatchingResp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.res != null && Object.hasOwnProperty.call(m, "res"))
                w.uint32(10).string(m.res);
            if (m.msg != null && Object.hasOwnProperty.call(m, "msg"))
                w.uint32(18).string(m.msg);
            if (m.playerNo != null && Object.hasOwnProperty.call(m, "playerNo"))
                w.uint32(24).uint32(m.playerNo);
            if (m.players != null && m.players.length) {
                w.uint32(34).fork();
                for (var i = 0; i < m.players.length; ++i)
                    w.uint32(m.players[i]);
                w.ldelim();
            }
            return w;
        };

        MatchingResp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.club.MatchingResp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.res = r.string();
                        break;
                    }
                case 2: {
                        m.msg = r.string();
                        break;
                    }
                case 3: {
                        m.playerNo = r.uint32();
                        break;
                    }
                case 4: {
                        if (!(m.players && m.players.length))
                            m.players = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.players.push(r.uint32());
                        } else
                            m.players.push(r.uint32());
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return MatchingResp;
    })();

    club.ClubCode = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UNSPECIFIED"] = 0;
        values[valuesById[65001] = "CLUB_CREATECLUB"] = 65001;
        values[valuesById[65002] = "CLUB_MODIFYCLUB"] = 65002;
        values[valuesById[65003] = "CLUB_SENDCLUBJOINREQUEST"] = 65003;
        values[valuesById[65004] = "CLUB_DECIDECLUBJOINREQUEST"] = 65004;
        values[valuesById[65005] = "CLUB_GETCLUBLIST"] = 65005;
        values[valuesById[65006] = "CLUB_GETCLUBINFO"] = 65006;
        values[valuesById[65007] = "CLUB_GETCLUBTABLELIST"] = 65007;
        values[valuesById[65008] = "CLUB_GETCLUBPLAYERLIST"] = 65008;
        values[valuesById[65009] = "CLUB_GETCLUBPLAYERDETAIL"] = 65009;
        values[valuesById[65010] = "CLUB_KICKOUTCLUBPLAYER"] = 65010;
        values[valuesById[65011] = "CLUB_CREATETABLE"] = 65011;
        values[valuesById[65012] = "CLUB_JOINTABLE"] = 65012;
        values[valuesById[65013] = "CLUB_QUITTABLE"] = 65013;
        values[valuesById[65014] = "CLUB_UPDATETABLE"] = 65014;
        values[valuesById[65015] = "CLUB_GETPLAYERINFO"] = 65015;
        values[valuesById[65016] = "CLUB_GETCLUBPLAYERGAMEHISTORY"] = 65016;
        values[valuesById[65017] = "CLUB_GETCLUBAPPLICATIONLIST"] = 65017;
        values[valuesById[65018] = "CLUB_GETCLUBORDERLIST"] = 65018;
        values[valuesById[65019] = "CLUB_GETCLUBITEMLIST"] = 65019;
        values[valuesById[65020] = "CLUB_GETCLUBMONEYORDERLIST"] = 65020;
        values[valuesById[65021] = "CLUB_SETCLUBPLAYERDETAIL"] = 65021;
        values[valuesById[65022] = "CLUB_GETTABLEINFO"] = 65022;
        values[valuesById[65023] = "CLUB_QUERYTABLE"] = 65023;
        values[valuesById[65024] = "CLUB_QUITCLUB"] = 65024;
        values[valuesById[65025] = "CLUB_INVITEPLAYER"] = 65025;
        values[valuesById[65026] = "CLUB_GETFRIENDTABLELIST"] = 65026;
        values[valuesById[65027] = "CLUB_GETFRIENDTABLE"] = 65027;
        values[valuesById[65028] = "CLUB_SETPREDEFINEDCARD"] = 65028;
        values[valuesById[65029] = "CLUB_GETPLAYERGAMEHISTORY"] = 65029;
        values[valuesById[65030] = "CLUB_SAVEGAMEHISTORY"] = 65030;
        values[valuesById[65031] = "CLUB_GETGAMEHISTORYDETAIL"] = 65031;
        values[valuesById[65032] = "CLUB_GETWBBINDINFO"] = 65032;
        values[valuesById[65033] = "CLUB_MODIFYTABLE"] = 65033;
        values[valuesById[65034] = "CLUB_MODIFYCLUBTYPE"] = 65034;
        values[valuesById[65035] = "CLUB_GETWBRANDCODE"] = 65035;
        values[valuesById[65036] = "CLUB_GETWBLOGINTOKEN"] = 65036;
        values[valuesById[65037] = "CLUB_CANCELWBBIND"] = 65037;
        values[valuesById[65038] = "CLUB_CHECKCLUBAPPLICATION"] = 65038;
        values[valuesById[65039] = "CLUB_CLOSETABLE"] = 65039;
        values[valuesById[65040] = "CLUB_MATCHING_JOIN"] = 65040;
        values[valuesById[65041] = "CLUB_MATCHING_QUIT"] = 65041;
        values[valuesById[65042] = "CLUB_MATCHING_QUERY"] = 65042;
        return values;
    })();

    return club;
})();

$root.pb_common = (function() {

    var pb_common = {};

    pb_common.pbError = (function() {

        function pbError(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        pbError.prototype.errCode = null;
        pbError.prototype.errMsg = null;

        var $oneOfFields;

        Object.defineProperty(pbError.prototype, "_errCode", {
            get: $util.oneOfGetter($oneOfFields = ["errCode"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        Object.defineProperty(pbError.prototype, "_errMsg", {
            get: $util.oneOfGetter($oneOfFields = ["errMsg"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        pbError.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.errCode != null && Object.hasOwnProperty.call(m, "errCode"))
                w.uint32(8).int32(m.errCode);
            if (m.errMsg != null && Object.hasOwnProperty.call(m, "errMsg"))
                w.uint32(18).string(m.errMsg);
            return w;
        };

        pbError.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.pb_common.pbError();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.errCode = r.int32();
                        break;
                    }
                case 2: {
                        m.errMsg = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return pbError;
    })();

    pb_common.ERRCode = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "ERRCode_Router"] = 0;
        values[valuesById[1] = "ERRCode_ProtoCode"] = 1;
        values[valuesById[2] = "ERRCode_ProtoMsg"] = 2;
        return values;
    })();

    return pb_common;
})();

$root.mahjong_jp = (function() {

    var mahjong_jp = {};

    mahjong_jp.SHOW_TYPE = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "SHOW_UNKNOW_TYPE"] = 0;
        values[valuesById[1] = "SHOW_YIMAN"] = 1;
        values[valuesById[2] = "SHOW_LEIJIYIMAN"] = 2;
        values[valuesById[3] = "SHOW_ER_YIMAN"] = 3;
        values[valuesById[4] = "SHOW_SAN_YIMAN"] = 4;
        values[valuesById[5] = "SHOW_SI_YIMAN"] = 5;
        values[valuesById[6] = "SHOW_WU_YIMAN"] = 6;
        values[valuesById[7] = "SHOW_LIU_YIMAN"] = 7;
        values[valuesById[8] = "SHOW_BEIMAN"] = 8;
        values[valuesById[9] = "SHOW_MANGUAN"] = 9;
        values[valuesById[10] = "SHOW_TIAOMAN"] = 10;
        values[valuesById[11] = "SHOW_SAN_BEIMAN"] = 11;
        values[valuesById[12] = "SHOW_LIUJU_MANGUAN"] = 12;
        return values;
    })();

    mahjong_jp.FAN_TYPE = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "JP_UNKNOW_TYPE"] = 0;
        values[valuesById[1] = "JP_DA_SI_XI"] = 1;
        values[valuesById[2] = "JP_SI_AN_KE_DAN_JI"] = 2;
        values[valuesById[3] = "JP_GUO_SHI_WU_SHUANG_13MIAN"] = 3;
        values[valuesById[4] = "JP_CHUN_JIU_LIAN_BAO_DENG"] = 4;
        values[valuesById[5] = "JP_CHUN_LV_YI_SE"] = 5;
        values[valuesById[6] = "JP_DA_QI_XING"] = 6;
        values[valuesById[7] = "JP_DA_SAN_YUAN"] = 7;
        values[valuesById[8] = "JP_LV_YI_SE"] = 8;
        values[valuesById[9] = "JP_JIU_LIAN_BAO_DENG"] = 9;
        values[valuesById[10] = "JP_SI_GANG"] = 10;
        values[valuesById[11] = "JP_XIAO_ZHU_LIN"] = 11;
        values[valuesById[12] = "JP_XIAO_CHE_LUN"] = 12;
        values[valuesById[13] = "JP_XIAO_SHU_LIN"] = 13;
        values[valuesById[14] = "JP_DA_ZHU_LIN"] = 14;
        values[valuesById[15] = "JP_DA_CHE_LUN"] = 15;
        values[valuesById[16] = "JP_DA_SHU_LIN"] = 16;
        values[valuesById[17] = "JP_SHI_SAN_YAO"] = 17;
        values[valuesById[18] = "JP_QING_YAO_JIU"] = 18;
        values[valuesById[19] = "JP_XIAO_SI_XI"] = 19;
        values[valuesById[20] = "JP_ZI_YI_SE"] = 20;
        values[valuesById[21] = "JP_SI_AN_KE"] = 21;
        values[valuesById[22] = "JP_YI_SE_SHUANG_LONG_HUI"] = 22;
        values[valuesById[23] = "JP_YI_SE_SI_JIE_GAO"] = 23;
        values[valuesById[24] = "JP_YI_SE_SI_TONG_SHUN"] = 24;
        values[valuesById[25] = "JP_YI_SE_SI_BU_GAO"] = 25;
        values[valuesById[26] = "JP_DI_HE"] = 26;
        values[valuesById[27] = "JP_TIAN_HE"] = 27;
        values[valuesById[28] = "JP_SHI_SHANG_SAN_NIAN"] = 28;
        values[valuesById[29] = "JP_BA_LIAN_ZHUANG"] = 29;
        values[valuesById[30] = "JP_DONG_BEI_XIN_GAN_XIAN"] = 30;
        values[valuesById[31] = "JP_HEI_YI_SE"] = 31;
        values[valuesById[32] = "JP_BAI_WAN_SHI"] = 32;
        values[valuesById[33] = "JP_HONG_KONG_QUE"] = 33;
        values[valuesById[34] = "JP_FENG_HUA_XUE_YUE"] = 34;
        values[valuesById[35] = "JP_HUA_NIAO_FENG_YUE"] = 35;
        values[valuesById[36] = "JP_KAI_LI_ZHI_RONG"] = 36;
        values[valuesById[37] = "JP_REN_HE"] = 37;
        values[valuesById[38] = "JP_QING_YI_SE"] = 38;
        values[valuesById[39] = "JP_YI_TONG_MO_YUE"] = 39;
        values[valuesById[40] = "JP_JIU_TONG_LAO_YUE"] = 40;
        values[valuesById[41] = "JP_WU_TONG_KAI_HUA"] = 41;
        values[valuesById[42] = "JP_JIN_JI_DU_LI"] = 42;
        values[valuesById[43] = "JP_DU_DIAO_HAN_JIANG_XUE"] = 43;
        values[valuesById[44] = "JP_HUN_YI_SE"] = 44;
        values[valuesById[45] = "JP_ER_BEI_KOU"] = 45;
        values[valuesById[46] = "JP_CHUN_QUAN_DAI_YAO_JIU"] = 46;
        values[valuesById[47] = "JP_WU_XIN_TONG_GUAN"] = 47;
        values[valuesById[48] = "JP_SAN_GANG"] = 48;
        values[valuesById[49] = "JP_HUN_YAO_JIU"] = 49;
        values[valuesById[50] = "JP_HUN_QUAN_DAI_YAO_JIU"] = 50;
        values[valuesById[51] = "JP_QI_DUI"] = 51;
        values[valuesById[52] = "JP_XIAO_SAN_YUAN"] = 52;
        values[valuesById[53] = "JP_YI_SE_SAN_JIE_GAO"] = 53;
        values[valuesById[54] = "JP_QING_LONG"] = 54;
        values[valuesById[55] = "JP_YI_SE_SAN_BU_GAO"] = 55;
        values[valuesById[56] = "JP_SAN_TONG_KE"] = 56;
        values[valuesById[57] = "JP_SAN_AN_KE"] = 57;
        values[valuesById[58] = "JP_HUA_LONG"] = 58;
        values[valuesById[59] = "JP_SAN_SE_SAN_TONG_SHUN"] = 59;
        values[valuesById[60] = "JP_PENG_PENG_HE"] = 60;
        values[valuesById[61] = "JP_WU_MEN_QI"] = 61;
        values[valuesById[62] = "JP_SHUANG_LI_ZHI"] = 62;
        values[valuesById[63] = "JP_KAI_LI_ZHI_ZIMO"] = 63;
        values[valuesById[64] = "JP_MIAO_SHOU_HUI_CHUN"] = 64;
        values[valuesById[65] = "JP_HAI_DI_YAO_YUE"] = 65;
        values[valuesById[66] = "JP_GANG_SHANG_KAI_HUA"] = 66;
        values[valuesById[67] = "JP_QIANG_GANG_HE"] = 67;
        values[valuesById[68] = "JP_SAN_SE_SAN_BU_GAO"] = 68;
        values[valuesById[69] = "JP_QUAN_FENG_KE"] = 69;
        values[valuesById[70] = "JP_MEN_FENG_KE"] = 70;
        values[valuesById[71] = "JP_SANYUAN_KE"] = 71;
        values[valuesById[72] = "JP_PING_HE"] = 72;
        values[valuesById[73] = "JP_DUAN_YAO"] = 73;
        values[valuesById[74] = "JP_YI_BAN_GAO"] = 74;
        values[valuesById[75] = "JP_ZI_MO"] = 75;
        values[valuesById[76] = "JP_LI_ZHI"] = 76;
        values[valuesById[77] = "JP_YI_FA"] = 77;
        values[valuesById[78] = "JP_YAN_FAN"] = 78;
        values[valuesById[79] = "JP_GANG_ZHEN"] = 79;
        values[valuesById[80] = "JP_SHI_ER_LUO_TAI"] = 80;
        values[valuesById[81] = "JP_BAO_PAI"] = 81;
        values[valuesById[82] = "JP_LI_BAO_PAI"] = 82;
        values[valuesById[83] = "JP_CHI_BAO_PAI"] = 83;
        return values;
    })();

    mahjong_jp.Player = (function() {

        function Player(p) {
            this.holeCards = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        Player.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        Player.prototype.seatID = 0;
        Player.prototype.holeCards = $util.emptyArray;

        Player.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.seatID != null && Object.hasOwnProperty.call(m, "seatID"))
                w.uint32(24).uint32(m.seatID);
            if (m.holeCards != null && m.holeCards.length) {
                w.uint32(58).fork();
                for (var i = 0; i < m.holeCards.length; ++i)
                    w.uint32(m.holeCards[i]);
                w.ldelim();
            }
            return w;
        };

        Player.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.Player();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 3: {
                        m.seatID = r.uint32();
                        break;
                    }
                case 7: {
                        if (!(m.holeCards && m.holeCards.length))
                            m.holeCards = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.holeCards.push(r.uint32());
                        } else
                            m.holeCards.push(r.uint32());
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return Player;
    })();

    mahjong_jp.GameStart = (function() {

        function GameStart(p) {
            this.userIDs = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GameStart.prototype.userIDs = $util.emptyArray;
        GameStart.prototype.bankerSeatID = 0;

        GameStart.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userIDs != null && m.userIDs.length) {
                w.uint32(10).fork();
                for (var i = 0; i < m.userIDs.length; ++i)
                    w.uint64(m.userIDs[i]);
                w.ldelim();
            }
            if (m.bankerSeatID != null && Object.hasOwnProperty.call(m, "bankerSeatID"))
                w.uint32(16).uint32(m.bankerSeatID);
            return w;
        };

        GameStart.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.GameStart();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        if (!(m.userIDs && m.userIDs.length))
                            m.userIDs = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.userIDs.push(r.uint64());
                        } else
                            m.userIDs.push(r.uint64());
                        break;
                    }
                case 2: {
                        m.bankerSeatID = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GameStart;
    })();

    mahjong_jp.GameID = (function() {

        function GameID(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GameID.prototype.id = 0;

        GameID.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.id != null && Object.hasOwnProperty.call(m, "id"))
                w.uint32(8).uint32(m.id);
            return w;
        };

        GameID.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.GameID();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.id = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GameID;
    })();

    mahjong_jp.GameUUID = (function() {

        function GameUUID(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GameUUID.prototype.uuid = "";
        GameUUID.prototype.clubid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        GameUUID.prototype.lat = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        GameUUID.prototype.lon = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        GameUUID.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.uuid != null && Object.hasOwnProperty.call(m, "uuid"))
                w.uint32(10).string(m.uuid);
            if (m.clubid != null && Object.hasOwnProperty.call(m, "clubid"))
                w.uint32(16).uint64(m.clubid);
            if (m.lat != null && Object.hasOwnProperty.call(m, "lat"))
                w.uint32(24).uint64(m.lat);
            if (m.lon != null && Object.hasOwnProperty.call(m, "lon"))
                w.uint32(32).uint64(m.lon);
            return w;
        };

        GameUUID.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.GameUUID();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.uuid = r.string();
                        break;
                    }
                case 2: {
                        m.clubid = r.uint64();
                        break;
                    }
                case 3: {
                        m.lat = r.uint64();
                        break;
                    }
                case 4: {
                        m.lon = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GameUUID;
    })();

    mahjong_jp.PlayerCards = (function() {

        function PlayerCards(p) {
            this.holeCards = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        PlayerCards.prototype.userID = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        PlayerCards.prototype.holeCards = $util.emptyArray;

        PlayerCards.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userID != null && Object.hasOwnProperty.call(m, "userID"))
                w.uint32(8).uint64(m.userID);
            if (m.holeCards != null && m.holeCards.length) {
                w.uint32(18).fork();
                for (var i = 0; i < m.holeCards.length; ++i)
                    w.uint32(m.holeCards[i]);
                w.ldelim();
            }
            return w;
        };

        PlayerCards.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.PlayerCards();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userID = r.uint64();
                        break;
                    }
                case 2: {
                        if (!(m.holeCards && m.holeCards.length))
                            m.holeCards = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.holeCards.push(r.uint32());
                        } else
                            m.holeCards.push(r.uint32());
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return PlayerCards;
    })();

    mahjong_jp.PlayerID = (function() {

        function PlayerID(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        PlayerID.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        PlayerID.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userId != null && Object.hasOwnProperty.call(m, "userId"))
                w.uint32(8).int64(m.userId);
            return w;
        };

        PlayerID.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.PlayerID();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userId = r.int64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return PlayerID;
    })();

    mahjong_jp.ExitStatus = (function() {

        function ExitStatus(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ExitStatus.prototype.status = 0;

        ExitStatus.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(8).int32(m.status);
            return w;
        };

        ExitStatus.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.ExitStatus();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.status = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ExitStatus;
    })();

    mahjong_jp.PlayerPlayStaticsInfo = (function() {

        function PlayerPlayStaticsInfo(p) {
            this.shijuStatus = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        PlayerPlayStaticsInfo.prototype.avgShunwei = 0;
        PlayerPlayStaticsInfo.prototype.nameNick1 = "";
        PlayerPlayStaticsInfo.prototype.nameNick2 = "";
        PlayerPlayStaticsInfo.prototype.oneLv = 0;
        PlayerPlayStaticsInfo.prototype.twoLv = 0;
        PlayerPlayStaticsInfo.prototype.threeLv = 0;
        PlayerPlayStaticsInfo.prototype.fourLv = 0;
        PlayerPlayStaticsInfo.prototype.heLv = 0;
        PlayerPlayStaticsInfo.prototype.paoLv = 0;
        PlayerPlayStaticsInfo.prototype.lizhiLv = 0;
        PlayerPlayStaticsInfo.prototype.fuluLv = 0;
        PlayerPlayStaticsInfo.prototype.gameCount = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        PlayerPlayStaticsInfo.prototype.heXunCount = 0;
        PlayerPlayStaticsInfo.prototype.avgDianshu = 0;
        PlayerPlayStaticsInfo.prototype.avgFangchou = 0;
        PlayerPlayStaticsInfo.prototype.shijuStatus = $util.emptyArray;

        PlayerPlayStaticsInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.avgShunwei != null && Object.hasOwnProperty.call(m, "avgShunwei"))
                w.uint32(13).float(m.avgShunwei);
            if (m.nameNick1 != null && Object.hasOwnProperty.call(m, "nameNick1"))
                w.uint32(18).string(m.nameNick1);
            if (m.nameNick2 != null && Object.hasOwnProperty.call(m, "nameNick2"))
                w.uint32(26).string(m.nameNick2);
            if (m.oneLv != null && Object.hasOwnProperty.call(m, "oneLv"))
                w.uint32(37).float(m.oneLv);
            if (m.twoLv != null && Object.hasOwnProperty.call(m, "twoLv"))
                w.uint32(45).float(m.twoLv);
            if (m.threeLv != null && Object.hasOwnProperty.call(m, "threeLv"))
                w.uint32(53).float(m.threeLv);
            if (m.fourLv != null && Object.hasOwnProperty.call(m, "fourLv"))
                w.uint32(61).float(m.fourLv);
            if (m.heLv != null && Object.hasOwnProperty.call(m, "heLv"))
                w.uint32(69).float(m.heLv);
            if (m.paoLv != null && Object.hasOwnProperty.call(m, "paoLv"))
                w.uint32(77).float(m.paoLv);
            if (m.lizhiLv != null && Object.hasOwnProperty.call(m, "lizhiLv"))
                w.uint32(85).float(m.lizhiLv);
            if (m.fuluLv != null && Object.hasOwnProperty.call(m, "fuluLv"))
                w.uint32(93).float(m.fuluLv);
            if (m.gameCount != null && Object.hasOwnProperty.call(m, "gameCount"))
                w.uint32(96).int64(m.gameCount);
            if (m.heXunCount != null && Object.hasOwnProperty.call(m, "heXunCount"))
                w.uint32(109).float(m.heXunCount);
            if (m.avgDianshu != null && Object.hasOwnProperty.call(m, "avgDianshu"))
                w.uint32(112).int32(m.avgDianshu);
            if (m.avgFangchou != null && Object.hasOwnProperty.call(m, "avgFangchou"))
                w.uint32(120).int32(m.avgFangchou);
            if (m.shijuStatus != null && m.shijuStatus.length) {
                w.uint32(130).fork();
                for (var i = 0; i < m.shijuStatus.length; ++i)
                    w.int32(m.shijuStatus[i]);
                w.ldelim();
            }
            return w;
        };

        PlayerPlayStaticsInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.PlayerPlayStaticsInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.avgShunwei = r.float();
                        break;
                    }
                case 2: {
                        m.nameNick1 = r.string();
                        break;
                    }
                case 3: {
                        m.nameNick2 = r.string();
                        break;
                    }
                case 4: {
                        m.oneLv = r.float();
                        break;
                    }
                case 5: {
                        m.twoLv = r.float();
                        break;
                    }
                case 6: {
                        m.threeLv = r.float();
                        break;
                    }
                case 7: {
                        m.fourLv = r.float();
                        break;
                    }
                case 8: {
                        m.heLv = r.float();
                        break;
                    }
                case 9: {
                        m.paoLv = r.float();
                        break;
                    }
                case 10: {
                        m.lizhiLv = r.float();
                        break;
                    }
                case 11: {
                        m.fuluLv = r.float();
                        break;
                    }
                case 12: {
                        m.gameCount = r.int64();
                        break;
                    }
                case 13: {
                        m.heXunCount = r.float();
                        break;
                    }
                case 14: {
                        m.avgDianshu = r.int32();
                        break;
                    }
                case 15: {
                        m.avgFangchou = r.int32();
                        break;
                    }
                case 16: {
                        if (!(m.shijuStatus && m.shijuStatus.length))
                            m.shijuStatus = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.shijuStatus.push(r.int32());
                        } else
                            m.shijuStatus.push(r.int32());
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return PlayerPlayStaticsInfo;
    })();

    mahjong_jp.PlayerInfo = (function() {

        function PlayerInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        PlayerInfo.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        PlayerInfo.prototype.seatId = 0;
        PlayerInfo.prototype.ready = 0;
        PlayerInfo.prototype.nickname = "";
        PlayerInfo.prototype.headerId = 0;
        PlayerInfo.prototype.moneyPlat = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        PlayerInfo.prototype.from = 0;
        PlayerInfo.prototype.sex = 0;
        PlayerInfo.prototype.winTimes = 0;
        PlayerInfo.prototype.lostTimes = 0;
        PlayerInfo.prototype.pingTimes = 0;
        PlayerInfo.prototype.level = 0;
        PlayerInfo.prototype.levelName = "";
        PlayerInfo.prototype.allResult = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        PlayerInfo.prototype.statics = null;

        PlayerInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userId != null && Object.hasOwnProperty.call(m, "userId"))
                w.uint32(8).int64(m.userId);
            if (m.seatId != null && Object.hasOwnProperty.call(m, "seatId"))
                w.uint32(16).int32(m.seatId);
            if (m.ready != null && Object.hasOwnProperty.call(m, "ready"))
                w.uint32(24).int32(m.ready);
            if (m.nickname != null && Object.hasOwnProperty.call(m, "nickname"))
                w.uint32(34).string(m.nickname);
            if (m.headerId != null && Object.hasOwnProperty.call(m, "headerId"))
                w.uint32(40).int32(m.headerId);
            if (m.moneyPlat != null && Object.hasOwnProperty.call(m, "moneyPlat"))
                w.uint32(48).int64(m.moneyPlat);
            if (m.from != null && Object.hasOwnProperty.call(m, "from"))
                w.uint32(56).int32(m.from);
            if (m.sex != null && Object.hasOwnProperty.call(m, "sex"))
                w.uint32(64).int32(m.sex);
            if (m.winTimes != null && Object.hasOwnProperty.call(m, "winTimes"))
                w.uint32(72).int32(m.winTimes);
            if (m.lostTimes != null && Object.hasOwnProperty.call(m, "lostTimes"))
                w.uint32(80).int32(m.lostTimes);
            if (m.pingTimes != null && Object.hasOwnProperty.call(m, "pingTimes"))
                w.uint32(88).int32(m.pingTimes);
            if (m.level != null && Object.hasOwnProperty.call(m, "level"))
                w.uint32(96).int32(m.level);
            if (m.levelName != null && Object.hasOwnProperty.call(m, "levelName"))
                w.uint32(106).string(m.levelName);
            if (m.allResult != null && Object.hasOwnProperty.call(m, "allResult"))
                w.uint32(112).int64(m.allResult);
            if (m.statics != null && Object.hasOwnProperty.call(m, "statics"))
                $root.mahjong_jp.PlayerPlayStaticsInfo.encode(m.statics, w.uint32(122).fork()).ldelim();
            return w;
        };

        PlayerInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.PlayerInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userId = r.int64();
                        break;
                    }
                case 2: {
                        m.seatId = r.int32();
                        break;
                    }
                case 3: {
                        m.ready = r.int32();
                        break;
                    }
                case 4: {
                        m.nickname = r.string();
                        break;
                    }
                case 5: {
                        m.headerId = r.int32();
                        break;
                    }
                case 6: {
                        m.moneyPlat = r.int64();
                        break;
                    }
                case 7: {
                        m.from = r.int32();
                        break;
                    }
                case 8: {
                        m.sex = r.int32();
                        break;
                    }
                case 9: {
                        m.winTimes = r.int32();
                        break;
                    }
                case 10: {
                        m.lostTimes = r.int32();
                        break;
                    }
                case 11: {
                        m.pingTimes = r.int32();
                        break;
                    }
                case 12: {
                        m.level = r.int32();
                        break;
                    }
                case 13: {
                        m.levelName = r.string();
                        break;
                    }
                case 14: {
                        m.allResult = r.int64();
                        break;
                    }
                case 15: {
                        m.statics = $root.mahjong_jp.PlayerPlayStaticsInfo.decode(r, r.uint32());
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return PlayerInfo;
    })();

    mahjong_jp.MahjongTableEnterResponse = (function() {

        function MahjongTableEnterResponse(p) {
            this.players = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        MahjongTableEnterResponse.prototype.tableType = 0;
        MahjongTableEnterResponse.prototype.level = 0;
        MahjongTableEnterResponse.prototype.tableId = 0;
        MahjongTableEnterResponse.prototype.baseChips = 0;
        MahjongTableEnterResponse.prototype.baseRadix = 0;
        MahjongTableEnterResponse.prototype.quan = 0;
        MahjongTableEnterResponse.prototype.curQuan = 0;
        MahjongTableEnterResponse.prototype.players = $util.emptyArray;
        MahjongTableEnterResponse.prototype.outCardTimeout = 0;
        MahjongTableEnterResponse.prototype.operationTimeout = 0;
        MahjongTableEnterResponse.prototype.nextRoundStartTime = 0;

        MahjongTableEnterResponse.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.tableType != null && Object.hasOwnProperty.call(m, "tableType"))
                w.uint32(8).int32(m.tableType);
            if (m.level != null && Object.hasOwnProperty.call(m, "level"))
                w.uint32(16).int32(m.level);
            if (m.tableId != null && Object.hasOwnProperty.call(m, "tableId"))
                w.uint32(24).int32(m.tableId);
            if (m.baseChips != null && Object.hasOwnProperty.call(m, "baseChips"))
                w.uint32(32).int32(m.baseChips);
            if (m.baseRadix != null && Object.hasOwnProperty.call(m, "baseRadix"))
                w.uint32(40).int32(m.baseRadix);
            if (m.quan != null && Object.hasOwnProperty.call(m, "quan"))
                w.uint32(48).int32(m.quan);
            if (m.curQuan != null && Object.hasOwnProperty.call(m, "curQuan"))
                w.uint32(56).int32(m.curQuan);
            if (m.players != null && m.players.length) {
                for (var i = 0; i < m.players.length; ++i)
                    $root.mahjong_jp.PlayerInfo.encode(m.players[i], w.uint32(66).fork()).ldelim();
            }
            if (m.outCardTimeout != null && Object.hasOwnProperty.call(m, "outCardTimeout"))
                w.uint32(72).int32(m.outCardTimeout);
            if (m.operationTimeout != null && Object.hasOwnProperty.call(m, "operationTimeout"))
                w.uint32(80).int32(m.operationTimeout);
            if (m.nextRoundStartTime != null && Object.hasOwnProperty.call(m, "nextRoundStartTime"))
                w.uint32(88).int32(m.nextRoundStartTime);
            return w;
        };

        MahjongTableEnterResponse.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.MahjongTableEnterResponse();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.tableType = r.int32();
                        break;
                    }
                case 2: {
                        m.level = r.int32();
                        break;
                    }
                case 3: {
                        m.tableId = r.int32();
                        break;
                    }
                case 4: {
                        m.baseChips = r.int32();
                        break;
                    }
                case 5: {
                        m.baseRadix = r.int32();
                        break;
                    }
                case 6: {
                        m.quan = r.int32();
                        break;
                    }
                case 7: {
                        m.curQuan = r.int32();
                        break;
                    }
                case 8: {
                        if (!(m.players && m.players.length))
                            m.players = [];
                        m.players.push($root.mahjong_jp.PlayerInfo.decode(r, r.uint32()));
                        break;
                    }
                case 9: {
                        m.outCardTimeout = r.int32();
                        break;
                    }
                case 10: {
                        m.operationTimeout = r.int32();
                        break;
                    }
                case 11: {
                        m.nextRoundStartTime = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return MahjongTableEnterResponse;
    })();

    mahjong_jp.MahjongReadyStart = (function() {

        function MahjongReadyStart(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        MahjongReadyStart.prototype.bankerSeatId = 0;

        MahjongReadyStart.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.bankerSeatId != null && Object.hasOwnProperty.call(m, "bankerSeatId"))
                w.uint32(8).int32(m.bankerSeatId);
            return w;
        };

        MahjongReadyStart.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.MahjongReadyStart();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.bankerSeatId = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return MahjongReadyStart;
    })();

    mahjong_jp.HandCard = (function() {

        function HandCard(p) {
            this.card = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        HandCard.prototype.card = $util.emptyArray;

        HandCard.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.card != null && m.card.length) {
                w.uint32(10).fork();
                for (var i = 0; i < m.card.length; ++i)
                    w.int32(m.card[i]);
                w.ldelim();
            }
            return w;
        };

        HandCard.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.HandCard();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        if (!(m.card && m.card.length))
                            m.card = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.card.push(r.int32());
                        } else
                            m.card.push(r.int32());
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return HandCard;
    })();

    mahjong_jp.TingCard = (function() {

        function TingCard(p) {
            this.card = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        TingCard.prototype.card = $util.emptyArray;

        TingCard.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.card != null && m.card.length) {
                w.uint32(10).fork();
                for (var i = 0; i < m.card.length; ++i)
                    w.int32(m.card[i]);
                w.ldelim();
            }
            return w;
        };

        TingCard.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.TingCard();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        if (!(m.card && m.card.length))
                            m.card = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.card.push(r.int32());
                        } else
                            m.card.push(r.int32());
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return TingCard;
    })();

    mahjong_jp.SendCard = (function() {

        function SendCard(p) {
            this.hucard = [];
            this.changeCard = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        SendCard.prototype.handCard = null;
        SendCard.prototype.hucard = $util.emptyArray;
        SendCard.prototype.changeCard = $util.emptyArray;

        SendCard.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.handCard != null && Object.hasOwnProperty.call(m, "handCard"))
                $root.mahjong_jp.HandCard.encode(m.handCard, w.uint32(10).fork()).ldelim();
            if (m.hucard != null && m.hucard.length) {
                for (var i = 0; i < m.hucard.length; ++i)
                    $root.mahjong_jp.HucardInfo.encode(m.hucard[i], w.uint32(18).fork()).ldelim();
            }
            if (m.changeCard != null && m.changeCard.length) {
                w.uint32(26).fork();
                for (var i = 0; i < m.changeCard.length; ++i)
                    w.int32(m.changeCard[i]);
                w.ldelim();
            }
            return w;
        };

        SendCard.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.SendCard();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.handCard = $root.mahjong_jp.HandCard.decode(r, r.uint32());
                        break;
                    }
                case 2: {
                        if (!(m.hucard && m.hucard.length))
                            m.hucard = [];
                        m.hucard.push($root.mahjong_jp.HucardInfo.decode(r, r.uint32()));
                        break;
                    }
                case 3: {
                        if (!(m.changeCard && m.changeCard.length))
                            m.changeCard = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.changeCard.push(r.int32());
                        } else
                            m.changeCard.push(r.int32());
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return SendCard;
    })();

    mahjong_jp.GameUserStartInfo = (function() {

        function GameUserStartInfo(p) {
            this.huaCard = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GameUserStartInfo.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        GameUserStartInfo.prototype.huaCard = $util.emptyArray;
        GameUserStartInfo.prototype.nDianShu = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        GameUserStartInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userId != null && Object.hasOwnProperty.call(m, "userId"))
                w.uint32(8).int64(m.userId);
            if (m.huaCard != null && m.huaCard.length) {
                w.uint32(18).fork();
                for (var i = 0; i < m.huaCard.length; ++i)
                    w.int32(m.huaCard[i]);
                w.ldelim();
            }
            if (m.nDianShu != null && Object.hasOwnProperty.call(m, "nDianShu"))
                w.uint32(24).int64(m.nDianShu);
            return w;
        };

        GameUserStartInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.GameUserStartInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userId = r.int64();
                        break;
                    }
                case 2: {
                        if (!(m.huaCard && m.huaCard.length))
                            m.huaCard = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.huaCard.push(r.int32());
                        } else
                            m.huaCard.push(r.int32());
                        break;
                    }
                case 3: {
                        m.nDianShu = r.int64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GameUserStartInfo;
    })();

    mahjong_jp.HuaCardsInfo = (function() {

        function HuaCardsInfo(p) {
            this.users = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        HuaCardsInfo.prototype.users = $util.emptyArray;
        HuaCardsInfo.prototype.doraCard = 0;
        HuaCardsInfo.prototype.nShaiziCount = 0;
        HuaCardsInfo.prototype.nQuan = 0;
        HuaCardsInfo.prototype.nRound = 0;
        HuaCardsInfo.prototype.nBenJu = 0;
        HuaCardsInfo.prototype.nBankerSeatId = 0;
        HuaCardsInfo.prototype.cardMD5 = "";
        HuaCardsInfo.prototype.outCardTimeout = 0;
        HuaCardsInfo.prototype.operationTimeout = 0;
        HuaCardsInfo.prototype.gongtuo = 0;

        HuaCardsInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.users != null && m.users.length) {
                for (var i = 0; i < m.users.length; ++i)
                    $root.mahjong_jp.GameUserStartInfo.encode(m.users[i], w.uint32(10).fork()).ldelim();
            }
            if (m.doraCard != null && Object.hasOwnProperty.call(m, "doraCard"))
                w.uint32(16).int32(m.doraCard);
            if (m.nShaiziCount != null && Object.hasOwnProperty.call(m, "nShaiziCount"))
                w.uint32(24).int32(m.nShaiziCount);
            if (m.nQuan != null && Object.hasOwnProperty.call(m, "nQuan"))
                w.uint32(32).int32(m.nQuan);
            if (m.nRound != null && Object.hasOwnProperty.call(m, "nRound"))
                w.uint32(40).int32(m.nRound);
            if (m.nBenJu != null && Object.hasOwnProperty.call(m, "nBenJu"))
                w.uint32(48).int32(m.nBenJu);
            if (m.nBankerSeatId != null && Object.hasOwnProperty.call(m, "nBankerSeatId"))
                w.uint32(56).int32(m.nBankerSeatId);
            if (m.cardMD5 != null && Object.hasOwnProperty.call(m, "cardMD5"))
                w.uint32(66).string(m.cardMD5);
            if (m.outCardTimeout != null && Object.hasOwnProperty.call(m, "outCardTimeout"))
                w.uint32(72).int32(m.outCardTimeout);
            if (m.operationTimeout != null && Object.hasOwnProperty.call(m, "operationTimeout"))
                w.uint32(80).int32(m.operationTimeout);
            if (m.gongtuo != null && Object.hasOwnProperty.call(m, "gongtuo"))
                w.uint32(88).int32(m.gongtuo);
            return w;
        };

        HuaCardsInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.HuaCardsInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        if (!(m.users && m.users.length))
                            m.users = [];
                        m.users.push($root.mahjong_jp.GameUserStartInfo.decode(r, r.uint32()));
                        break;
                    }
                case 2: {
                        m.doraCard = r.int32();
                        break;
                    }
                case 3: {
                        m.nShaiziCount = r.int32();
                        break;
                    }
                case 4: {
                        m.nQuan = r.int32();
                        break;
                    }
                case 5: {
                        m.nRound = r.int32();
                        break;
                    }
                case 6: {
                        m.nBenJu = r.int32();
                        break;
                    }
                case 7: {
                        m.nBankerSeatId = r.int32();
                        break;
                    }
                case 8: {
                        m.cardMD5 = r.string();
                        break;
                    }
                case 9: {
                        m.outCardTimeout = r.int32();
                        break;
                    }
                case 10: {
                        m.operationTimeout = r.int32();
                        break;
                    }
                case 11: {
                        m.gongtuo = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return HuaCardsInfo;
    })();

    mahjong_jp.UserGrabCard = (function() {

        function UserGrabCard(p) {
            this.byGrabCard = [];
            this.gangCards = [];
            this.hucard = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        UserGrabCard.prototype.byGrabCard = $util.emptyArray;
        UserGrabCard.prototype.nActionValue = 0;
        UserGrabCard.prototype.gangCards = $util.emptyArray;
        UserGrabCard.prototype.bGrabFinalCard = false;
        UserGrabCard.prototype.hucard = $util.emptyArray;
        UserGrabCard.prototype.diffTimeout = 0;

        UserGrabCard.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.byGrabCard != null && m.byGrabCard.length) {
                w.uint32(10).fork();
                for (var i = 0; i < m.byGrabCard.length; ++i)
                    w.int32(m.byGrabCard[i]);
                w.ldelim();
            }
            if (m.nActionValue != null && Object.hasOwnProperty.call(m, "nActionValue"))
                w.uint32(16).int32(m.nActionValue);
            if (m.gangCards != null && m.gangCards.length) {
                w.uint32(26).fork();
                for (var i = 0; i < m.gangCards.length; ++i)
                    w.int32(m.gangCards[i]);
                w.ldelim();
            }
            if (m.bGrabFinalCard != null && Object.hasOwnProperty.call(m, "bGrabFinalCard"))
                w.uint32(32).bool(m.bGrabFinalCard);
            if (m.hucard != null && m.hucard.length) {
                for (var i = 0; i < m.hucard.length; ++i)
                    $root.mahjong_jp.HucardInfo.encode(m.hucard[i], w.uint32(42).fork()).ldelim();
            }
            if (m.diffTimeout != null && Object.hasOwnProperty.call(m, "diffTimeout"))
                w.uint32(48).int32(m.diffTimeout);
            return w;
        };

        UserGrabCard.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.UserGrabCard();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        if (!(m.byGrabCard && m.byGrabCard.length))
                            m.byGrabCard = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.byGrabCard.push(r.int32());
                        } else
                            m.byGrabCard.push(r.int32());
                        break;
                    }
                case 2: {
                        m.nActionValue = r.int32();
                        break;
                    }
                case 3: {
                        if (!(m.gangCards && m.gangCards.length))
                            m.gangCards = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.gangCards.push(r.int32());
                        } else
                            m.gangCards.push(r.int32());
                        break;
                    }
                case 4: {
                        m.bGrabFinalCard = r.bool();
                        break;
                    }
                case 5: {
                        if (!(m.hucard && m.hucard.length))
                            m.hucard = [];
                        m.hucard.push($root.mahjong_jp.HucardInfo.decode(r, r.uint32()));
                        break;
                    }
                case 6: {
                        m.diffTimeout = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return UserGrabCard;
    })();

    mahjong_jp.HucardInfo = (function() {

        function HucardInfo(p) {
            this.tings = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        HucardInfo.prototype.card = 0;
        HucardInfo.prototype.tings = $util.emptyArray;

        HucardInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.card != null && Object.hasOwnProperty.call(m, "card"))
                w.uint32(8).int32(m.card);
            if (m.tings != null && m.tings.length) {
                for (var i = 0; i < m.tings.length; ++i)
                    $root.mahjong_jp.TingInfo.encode(m.tings[i], w.uint32(18).fork()).ldelim();
            }
            return w;
        };

        HucardInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.HucardInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.card = r.int32();
                        break;
                    }
                case 2: {
                        if (!(m.tings && m.tings.length))
                            m.tings = [];
                        m.tings.push($root.mahjong_jp.TingInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return HucardInfo;
    })();

    mahjong_jp.TingInfo = (function() {

        function TingInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        TingInfo.prototype.card = 0;
        TingInfo.prototype.fans = 0;
        TingInfo.prototype.shengyu = 0;
        TingInfo.prototype.fanxing = 0;
        TingInfo.prototype.comfanxing = 0;

        TingInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.card != null && Object.hasOwnProperty.call(m, "card"))
                w.uint32(8).int32(m.card);
            if (m.fans != null && Object.hasOwnProperty.call(m, "fans"))
                w.uint32(16).int32(m.fans);
            if (m.shengyu != null && Object.hasOwnProperty.call(m, "shengyu"))
                w.uint32(24).int32(m.shengyu);
            if (m.fanxing != null && Object.hasOwnProperty.call(m, "fanxing"))
                w.uint32(32).int32(m.fanxing);
            if (m.comfanxing != null && Object.hasOwnProperty.call(m, "comfanxing"))
                w.uint32(40).int32(m.comfanxing);
            return w;
        };

        TingInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.TingInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.card = r.int32();
                        break;
                    }
                case 2: {
                        m.fans = r.int32();
                        break;
                    }
                case 3: {
                        m.shengyu = r.int32();
                        break;
                    }
                case 4: {
                        m.fanxing = r.int32();
                        break;
                    }
                case 5: {
                        m.comfanxing = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return TingInfo;
    })();

    mahjong_jp.BroadGrabCard = (function() {

        function BroadGrabCard(p) {
            this.huaCards = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        BroadGrabCard.prototype.curUserId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        BroadGrabCard.prototype.crabCardIndex = 0;
        BroadGrabCard.prototype.huaCards = $util.emptyArray;
        BroadGrabCard.prototype.grabFinalCard = false;

        BroadGrabCard.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.curUserId != null && Object.hasOwnProperty.call(m, "curUserId"))
                w.uint32(8).int64(m.curUserId);
            if (m.crabCardIndex != null && Object.hasOwnProperty.call(m, "crabCardIndex"))
                w.uint32(16).int32(m.crabCardIndex);
            if (m.huaCards != null && m.huaCards.length) {
                w.uint32(26).fork();
                for (var i = 0; i < m.huaCards.length; ++i)
                    w.int32(m.huaCards[i]);
                w.ldelim();
            }
            if (m.grabFinalCard != null && Object.hasOwnProperty.call(m, "grabFinalCard"))
                w.uint32(32).bool(m.grabFinalCard);
            return w;
        };

        BroadGrabCard.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.BroadGrabCard();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.curUserId = r.int64();
                        break;
                    }
                case 2: {
                        m.crabCardIndex = r.int32();
                        break;
                    }
                case 3: {
                        if (!(m.huaCards && m.huaCards.length))
                            m.huaCards = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.huaCards.push(r.int32());
                        } else
                            m.huaCards.push(r.int32());
                        break;
                    }
                case 4: {
                        m.grabFinalCard = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return BroadGrabCard;
    })();

    mahjong_jp.UserOutCard = (function() {

        function UserOutCard(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        UserOutCard.prototype.card = 0;
        UserOutCard.prototype.isTing = 0;
        UserOutCard.prototype.isMoQie = false;

        UserOutCard.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.card != null && Object.hasOwnProperty.call(m, "card"))
                w.uint32(8).int32(m.card);
            if (m.isTing != null && Object.hasOwnProperty.call(m, "isTing"))
                w.uint32(16).int32(m.isTing);
            if (m.isMoQie != null && Object.hasOwnProperty.call(m, "isMoQie"))
                w.uint32(24).bool(m.isMoQie);
            return w;
        };

        UserOutCard.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.UserOutCard();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.card = r.int32();
                        break;
                    }
                case 2: {
                        m.isTing = r.int32();
                        break;
                    }
                case 3: {
                        m.isMoQie = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return UserOutCard;
    })();

    mahjong_jp.GangDoraCard = (function() {

        function GangDoraCard(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GangDoraCard.prototype.card = 0;

        GangDoraCard.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.card != null && Object.hasOwnProperty.call(m, "card"))
                w.uint32(8).int32(m.card);
            return w;
        };

        GangDoraCard.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.GangDoraCard();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.card = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GangDoraCard;
    })();

    mahjong_jp.UserOutCardRespond = (function() {

        function UserOutCardRespond(p) {
            this.disableCards = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        UserOutCardRespond.prototype.nOutCardUserId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        UserOutCardRespond.prototype.nOpWeight = 0;
        UserOutCardRespond.prototype.isTing = false;
        UserOutCardRespond.prototype.byFan = 0;
        UserOutCardRespond.prototype.byOutCard = 0;
        UserOutCardRespond.prototype.diffTimeout = 0;
        UserOutCardRespond.prototype.moqie = false;
        UserOutCardRespond.prototype.disableCards = $util.emptyArray;
        UserOutCardRespond.prototype.isZhenTing = false;
        UserOutCardRespond.prototype.isHengFang = false;

        UserOutCardRespond.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.nOutCardUserId != null && Object.hasOwnProperty.call(m, "nOutCardUserId"))
                w.uint32(8).int64(m.nOutCardUserId);
            if (m.nOpWeight != null && Object.hasOwnProperty.call(m, "nOpWeight"))
                w.uint32(16).int32(m.nOpWeight);
            if (m.isTing != null && Object.hasOwnProperty.call(m, "isTing"))
                w.uint32(24).bool(m.isTing);
            if (m.byFan != null && Object.hasOwnProperty.call(m, "byFan"))
                w.uint32(32).int32(m.byFan);
            if (m.byOutCard != null && Object.hasOwnProperty.call(m, "byOutCard"))
                w.uint32(40).int32(m.byOutCard);
            if (m.diffTimeout != null && Object.hasOwnProperty.call(m, "diffTimeout"))
                w.uint32(48).int32(m.diffTimeout);
            if (m.moqie != null && Object.hasOwnProperty.call(m, "moqie"))
                w.uint32(56).bool(m.moqie);
            if (m.disableCards != null && m.disableCards.length) {
                w.uint32(66).fork();
                for (var i = 0; i < m.disableCards.length; ++i)
                    w.int32(m.disableCards[i]);
                w.ldelim();
            }
            if (m.isZhenTing != null && Object.hasOwnProperty.call(m, "isZhenTing"))
                w.uint32(72).bool(m.isZhenTing);
            if (m.isHengFang != null && Object.hasOwnProperty.call(m, "isHengFang"))
                w.uint32(80).bool(m.isHengFang);
            return w;
        };

        UserOutCardRespond.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.UserOutCardRespond();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.nOutCardUserId = r.int64();
                        break;
                    }
                case 2: {
                        m.nOpWeight = r.int32();
                        break;
                    }
                case 3: {
                        m.isTing = r.bool();
                        break;
                    }
                case 4: {
                        m.byFan = r.int32();
                        break;
                    }
                case 5: {
                        m.byOutCard = r.int32();
                        break;
                    }
                case 6: {
                        m.diffTimeout = r.int32();
                        break;
                    }
                case 7: {
                        m.moqie = r.bool();
                        break;
                    }
                case 8: {
                        if (!(m.disableCards && m.disableCards.length))
                            m.disableCards = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.disableCards.push(r.int32());
                        } else
                            m.disableCards.push(r.int32());
                        break;
                    }
                case 9: {
                        m.isZhenTing = r.bool();
                        break;
                    }
                case 10: {
                        m.isHengFang = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return UserOutCardRespond;
    })();

    mahjong_jp.UserLiZhiUpdateDianShu = (function() {

        function UserLiZhiUpdateDianShu(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        UserLiZhiUpdateDianShu.prototype.nUserId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        UserLiZhiUpdateDianShu.prototype.nDianShu = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        UserLiZhiUpdateDianShu.prototype.gongtuo = 0;

        UserLiZhiUpdateDianShu.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.nUserId != null && Object.hasOwnProperty.call(m, "nUserId"))
                w.uint32(8).int64(m.nUserId);
            if (m.nDianShu != null && Object.hasOwnProperty.call(m, "nDianShu"))
                w.uint32(16).int64(m.nDianShu);
            if (m.gongtuo != null && Object.hasOwnProperty.call(m, "gongtuo"))
                w.uint32(24).int32(m.gongtuo);
            return w;
        };

        UserLiZhiUpdateDianShu.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.UserLiZhiUpdateDianShu();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.nUserId = r.int64();
                        break;
                    }
                case 2: {
                        m.nDianShu = r.int64();
                        break;
                    }
                case 3: {
                        m.gongtuo = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return UserLiZhiUpdateDianShu;
    })();

    mahjong_jp.UserOperatorRequest = (function() {

        function UserOperatorRequest(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        UserOperatorRequest.prototype.opValue = 0;
        UserOperatorRequest.prototype.opCard = 0;
        UserOperatorRequest.prototype.redFiveCount = 0;

        UserOperatorRequest.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.opValue != null && Object.hasOwnProperty.call(m, "opValue"))
                w.uint32(8).int32(m.opValue);
            if (m.opCard != null && Object.hasOwnProperty.call(m, "opCard"))
                w.uint32(16).int32(m.opCard);
            if (m.redFiveCount != null && Object.hasOwnProperty.call(m, "redFiveCount"))
                w.uint32(24).int32(m.redFiveCount);
            return w;
        };

        UserOperatorRequest.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.UserOperatorRequest();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.opValue = r.int32();
                        break;
                    }
                case 2: {
                        m.opCard = r.int32();
                        break;
                    }
                case 3: {
                        m.redFiveCount = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return UserOperatorRequest;
    })();

    mahjong_jp.UserOperatorRespond = (function() {

        function UserOperatorRespond(p) {
            this.hucard = [];
            this.disableCards = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        UserOperatorRespond.prototype.operatorUserID = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        UserOperatorRespond.prototype.operationValue = 0;
        UserOperatorRespond.prototype.operationCard = 0;
        UserOperatorRespond.prototype.targetSeatID = 0;
        UserOperatorRespond.prototype.hucard = $util.emptyArray;
        UserOperatorRespond.prototype.diffTimeout = 0;
        UserOperatorRespond.prototype.disableCards = $util.emptyArray;
        UserOperatorRespond.prototype.redFiveCount = 0;

        UserOperatorRespond.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.operatorUserID != null && Object.hasOwnProperty.call(m, "operatorUserID"))
                w.uint32(8).int64(m.operatorUserID);
            if (m.operationValue != null && Object.hasOwnProperty.call(m, "operationValue"))
                w.uint32(16).int32(m.operationValue);
            if (m.operationCard != null && Object.hasOwnProperty.call(m, "operationCard"))
                w.uint32(24).int32(m.operationCard);
            if (m.targetSeatID != null && Object.hasOwnProperty.call(m, "targetSeatID"))
                w.uint32(32).int32(m.targetSeatID);
            if (m.hucard != null && m.hucard.length) {
                for (var i = 0; i < m.hucard.length; ++i)
                    $root.mahjong_jp.HucardInfo.encode(m.hucard[i], w.uint32(42).fork()).ldelim();
            }
            if (m.diffTimeout != null && Object.hasOwnProperty.call(m, "diffTimeout"))
                w.uint32(48).int32(m.diffTimeout);
            if (m.disableCards != null && m.disableCards.length) {
                w.uint32(58).fork();
                for (var i = 0; i < m.disableCards.length; ++i)
                    w.int32(m.disableCards[i]);
                w.ldelim();
            }
            if (m.redFiveCount != null && Object.hasOwnProperty.call(m, "redFiveCount"))
                w.uint32(64).int32(m.redFiveCount);
            return w;
        };

        UserOperatorRespond.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.UserOperatorRespond();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.operatorUserID = r.int64();
                        break;
                    }
                case 2: {
                        m.operationValue = r.int32();
                        break;
                    }
                case 3: {
                        m.operationCard = r.int32();
                        break;
                    }
                case 4: {
                        m.targetSeatID = r.int32();
                        break;
                    }
                case 5: {
                        if (!(m.hucard && m.hucard.length))
                            m.hucard = [];
                        m.hucard.push($root.mahjong_jp.HucardInfo.decode(r, r.uint32()));
                        break;
                    }
                case 6: {
                        m.diffTimeout = r.int32();
                        break;
                    }
                case 7: {
                        if (!(m.disableCards && m.disableCards.length))
                            m.disableCards = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.disableCards.push(r.int32());
                        } else
                            m.disableCards.push(r.int32());
                        break;
                    }
                case 8: {
                        m.redFiveCount = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return UserOperatorRespond;
    })();

    mahjong_jp.UserOperatorJumpReply = (function() {

        function UserOperatorJumpReply(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        UserOperatorJumpReply.prototype.operatorUserID = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        UserOperatorJumpReply.prototype.diffTimeout = 0;
        UserOperatorJumpReply.prototype.isZhenTing = false;

        UserOperatorJumpReply.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.operatorUserID != null && Object.hasOwnProperty.call(m, "operatorUserID"))
                w.uint32(8).int64(m.operatorUserID);
            if (m.diffTimeout != null && Object.hasOwnProperty.call(m, "diffTimeout"))
                w.uint32(16).int32(m.diffTimeout);
            if (m.isZhenTing != null && Object.hasOwnProperty.call(m, "isZhenTing"))
                w.uint32(24).bool(m.isZhenTing);
            return w;
        };

        UserOperatorJumpReply.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.UserOperatorJumpReply();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.operatorUserID = r.int64();
                        break;
                    }
                case 2: {
                        m.diffTimeout = r.int32();
                        break;
                    }
                case 3: {
                        m.isZhenTing = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return UserOperatorJumpReply;
    })();

    mahjong_jp.FuLuInfo = (function() {

        function FuLuInfo(p) {
            this.cards = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        FuLuInfo.prototype.fuluType = 0;
        FuLuInfo.prototype.cards = $util.emptyArray;
        FuLuInfo.prototype.pos = 0;

        FuLuInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.fuluType != null && Object.hasOwnProperty.call(m, "fuluType"))
                w.uint32(8).int32(m.fuluType);
            if (m.cards != null && m.cards.length) {
                w.uint32(18).fork();
                for (var i = 0; i < m.cards.length; ++i)
                    w.int32(m.cards[i]);
                w.ldelim();
            }
            if (m.pos != null && Object.hasOwnProperty.call(m, "pos"))
                w.uint32(24).int32(m.pos);
            return w;
        };

        FuLuInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.FuLuInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.fuluType = r.int32();
                        break;
                    }
                case 2: {
                        if (!(m.cards && m.cards.length))
                            m.cards = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.cards.push(r.int32());
                        } else
                            m.cards.push(r.int32());
                        break;
                    }
                case 3: {
                        m.pos = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return FuLuInfo;
    })();

    mahjong_jp.PlayerTingInfo = (function() {

        function PlayerTingInfo(p) {
            this.cards = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        PlayerTingInfo.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        PlayerTingInfo.prototype.cards = $util.emptyArray;

        PlayerTingInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userId != null && Object.hasOwnProperty.call(m, "userId"))
                w.uint32(8).int64(m.userId);
            if (m.cards != null && m.cards.length) {
                w.uint32(18).fork();
                for (var i = 0; i < m.cards.length; ++i)
                    w.int32(m.cards[i]);
                w.ldelim();
            }
            return w;
        };

        PlayerTingInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.PlayerTingInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userId = r.int64();
                        break;
                    }
                case 2: {
                        if (!(m.cards && m.cards.length))
                            m.cards = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.cards.push(r.int32());
                        } else
                            m.cards.push(r.int32());
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return PlayerTingInfo;
    })();

    mahjong_jp.GameRoundResult = (function() {

        function GameRoundResult(p) {
            this.playerInfo = [];
            this.playerTing = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GameRoundResult.prototype.nRoundResult = 0;
        GameRoundResult.prototype.timeRound = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        GameRoundResult.prototype.huOrPaoUid = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        GameRoundResult.prototype.playerInfo = $util.emptyArray;
        GameRoundResult.prototype.huCard = 0;
        GameRoundResult.prototype.stopGame = false;
        GameRoundResult.prototype.nLiuJuType = 0;
        GameRoundResult.prototype.playerTing = $util.emptyArray;

        GameRoundResult.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.nRoundResult != null && Object.hasOwnProperty.call(m, "nRoundResult"))
                w.uint32(8).int32(m.nRoundResult);
            if (m.timeRound != null && Object.hasOwnProperty.call(m, "timeRound"))
                w.uint32(16).int64(m.timeRound);
            if (m.huOrPaoUid != null && Object.hasOwnProperty.call(m, "huOrPaoUid"))
                w.uint32(24).int64(m.huOrPaoUid);
            if (m.playerInfo != null && m.playerInfo.length) {
                for (var i = 0; i < m.playerInfo.length; ++i)
                    $root.mahjong_jp.ResPlayerInfo.encode(m.playerInfo[i], w.uint32(34).fork()).ldelim();
            }
            if (m.huCard != null && Object.hasOwnProperty.call(m, "huCard"))
                w.uint32(40).int32(m.huCard);
            if (m.stopGame != null && Object.hasOwnProperty.call(m, "stopGame"))
                w.uint32(48).bool(m.stopGame);
            if (m.nLiuJuType != null && Object.hasOwnProperty.call(m, "nLiuJuType"))
                w.uint32(56).int32(m.nLiuJuType);
            if (m.playerTing != null && m.playerTing.length) {
                for (var i = 0; i < m.playerTing.length; ++i)
                    $root.mahjong_jp.PlayerTingInfo.encode(m.playerTing[i], w.uint32(66).fork()).ldelim();
            }
            return w;
        };

        GameRoundResult.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.GameRoundResult();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.nRoundResult = r.int32();
                        break;
                    }
                case 2: {
                        m.timeRound = r.int64();
                        break;
                    }
                case 3: {
                        m.huOrPaoUid = r.int64();
                        break;
                    }
                case 4: {
                        if (!(m.playerInfo && m.playerInfo.length))
                            m.playerInfo = [];
                        m.playerInfo.push($root.mahjong_jp.ResPlayerInfo.decode(r, r.uint32()));
                        break;
                    }
                case 5: {
                        m.huCard = r.int32();
                        break;
                    }
                case 6: {
                        m.stopGame = r.bool();
                        break;
                    }
                case 7: {
                        m.nLiuJuType = r.int32();
                        break;
                    }
                case 8: {
                        if (!(m.playerTing && m.playerTing.length))
                            m.playerTing = [];
                        m.playerTing.push($root.mahjong_jp.PlayerTingInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GameRoundResult;
    })();

    mahjong_jp.ResPlayerInfo = (function() {

        function ResPlayerInfo(p) {
            this.remCards = [];
            this.fans = [];
            this.fulus = [];
            this.dora = [];
            this.lidora = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        ResPlayerInfo.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        ResPlayerInfo.prototype.status = 0;
        ResPlayerInfo.prototype.moneyPlat = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        ResPlayerInfo.prototype.turnMoney = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        ResPlayerInfo.prototype.turnMoneyAll = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        ResPlayerInfo.prototype.roundResult = 0;
        ResPlayerInfo.prototype.remCards = $util.emptyArray;
        ResPlayerInfo.prototype.allFan = 0;
        ResPlayerInfo.prototype.fu = 0;
        ResPlayerInfo.prototype.fans = $util.emptyArray;
        ResPlayerInfo.prototype.rank = 0;
        ResPlayerInfo.prototype.winCard = 0;
        ResPlayerInfo.prototype.fulus = $util.emptyArray;
        ResPlayerInfo.prototype.dora = $util.emptyArray;
        ResPlayerInfo.prototype.lidora = $util.emptyArray;
        ResPlayerInfo.prototype.statics = null;
        ResPlayerInfo.prototype.showType = 0;
        ResPlayerInfo.prototype.nickName = "";

        ResPlayerInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userId != null && Object.hasOwnProperty.call(m, "userId"))
                w.uint32(8).int64(m.userId);
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(16).int32(m.status);
            if (m.moneyPlat != null && Object.hasOwnProperty.call(m, "moneyPlat"))
                w.uint32(24).int64(m.moneyPlat);
            if (m.turnMoney != null && Object.hasOwnProperty.call(m, "turnMoney"))
                w.uint32(32).int64(m.turnMoney);
            if (m.roundResult != null && Object.hasOwnProperty.call(m, "roundResult"))
                w.uint32(40).int32(m.roundResult);
            if (m.remCards != null && m.remCards.length) {
                w.uint32(50).fork();
                for (var i = 0; i < m.remCards.length; ++i)
                    w.int32(m.remCards[i]);
                w.ldelim();
            }
            if (m.allFan != null && Object.hasOwnProperty.call(m, "allFan"))
                w.uint32(56).int32(m.allFan);
            if (m.fu != null && Object.hasOwnProperty.call(m, "fu"))
                w.uint32(64).int32(m.fu);
            if (m.fans != null && m.fans.length) {
                for (var i = 0; i < m.fans.length; ++i)
                    $root.mahjong_jp.FanInfo.encode(m.fans[i], w.uint32(74).fork()).ldelim();
            }
            if (m.rank != null && Object.hasOwnProperty.call(m, "rank"))
                w.uint32(80).int32(m.rank);
            if (m.winCard != null && Object.hasOwnProperty.call(m, "winCard"))
                w.uint32(88).int32(m.winCard);
            if (m.fulus != null && m.fulus.length) {
                for (var i = 0; i < m.fulus.length; ++i)
                    $root.mahjong_jp.FuLuInfo.encode(m.fulus[i], w.uint32(98).fork()).ldelim();
            }
            if (m.dora != null && m.dora.length) {
                w.uint32(106).fork();
                for (var i = 0; i < m.dora.length; ++i)
                    w.int32(m.dora[i]);
                w.ldelim();
            }
            if (m.lidora != null && m.lidora.length) {
                w.uint32(114).fork();
                for (var i = 0; i < m.lidora.length; ++i)
                    w.int32(m.lidora[i]);
                w.ldelim();
            }
            if (m.statics != null && Object.hasOwnProperty.call(m, "statics"))
                $root.mahjong_jp.PlayerPlayStaticsInfo.encode(m.statics, w.uint32(122).fork()).ldelim();
            if (m.turnMoneyAll != null && Object.hasOwnProperty.call(m, "turnMoneyAll"))
                w.uint32(128).int64(m.turnMoneyAll);
            if (m.showType != null && Object.hasOwnProperty.call(m, "showType"))
                w.uint32(136).int32(m.showType);
            if (m.nickName != null && Object.hasOwnProperty.call(m, "nickName"))
                w.uint32(146).string(m.nickName);
            return w;
        };

        ResPlayerInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.ResPlayerInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userId = r.int64();
                        break;
                    }
                case 2: {
                        m.status = r.int32();
                        break;
                    }
                case 3: {
                        m.moneyPlat = r.int64();
                        break;
                    }
                case 4: {
                        m.turnMoney = r.int64();
                        break;
                    }
                case 16: {
                        m.turnMoneyAll = r.int64();
                        break;
                    }
                case 5: {
                        m.roundResult = r.int32();
                        break;
                    }
                case 6: {
                        if (!(m.remCards && m.remCards.length))
                            m.remCards = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.remCards.push(r.int32());
                        } else
                            m.remCards.push(r.int32());
                        break;
                    }
                case 7: {
                        m.allFan = r.int32();
                        break;
                    }
                case 8: {
                        m.fu = r.int32();
                        break;
                    }
                case 9: {
                        if (!(m.fans && m.fans.length))
                            m.fans = [];
                        m.fans.push($root.mahjong_jp.FanInfo.decode(r, r.uint32()));
                        break;
                    }
                case 10: {
                        m.rank = r.int32();
                        break;
                    }
                case 11: {
                        m.winCard = r.int32();
                        break;
                    }
                case 12: {
                        if (!(m.fulus && m.fulus.length))
                            m.fulus = [];
                        m.fulus.push($root.mahjong_jp.FuLuInfo.decode(r, r.uint32()));
                        break;
                    }
                case 13: {
                        if (!(m.dora && m.dora.length))
                            m.dora = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.dora.push(r.int32());
                        } else
                            m.dora.push(r.int32());
                        break;
                    }
                case 14: {
                        if (!(m.lidora && m.lidora.length))
                            m.lidora = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.lidora.push(r.int32());
                        } else
                            m.lidora.push(r.int32());
                        break;
                    }
                case 15: {
                        m.statics = $root.mahjong_jp.PlayerPlayStaticsInfo.decode(r, r.uint32());
                        break;
                    }
                case 17: {
                        m.showType = r.int32();
                        break;
                    }
                case 18: {
                        m.nickName = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return ResPlayerInfo;
    })();

    mahjong_jp.FanInfo = (function() {

        function FanInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        FanInfo.prototype.type = 0;
        FanInfo.prototype.name = "";
        FanInfo.prototype.score = 0;

        FanInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.type != null && Object.hasOwnProperty.call(m, "type"))
                w.uint32(8).int32(m.type);
            if (m.name != null && Object.hasOwnProperty.call(m, "name"))
                w.uint32(18).string(m.name);
            if (m.score != null && Object.hasOwnProperty.call(m, "score"))
                w.uint32(24).int32(m.score);
            return w;
        };

        FanInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.FanInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.type = r.int32();
                        break;
                    }
                case 2: {
                        m.name = r.string();
                        break;
                    }
                case 3: {
                        m.score = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return FanInfo;
    })();

    mahjong_jp.MahjongTableInfo = (function() {

        function MahjongTableInfo(p) {
            this.users = [];
            this.usersTw = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        MahjongTableInfo.prototype.tableType = 0;
        MahjongTableInfo.prototype.users = $util.emptyArray;
        MahjongTableInfo.prototype.usersTw = $util.emptyArray;

        MahjongTableInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.tableType != null && Object.hasOwnProperty.call(m, "tableType"))
                w.uint32(8).int32(m.tableType);
            if (m.users != null && m.users.length) {
                for (var i = 0; i < m.users.length; ++i)
                    $root.mahjong_jp.MahjongGameUser.encode(m.users[i], w.uint32(18).fork()).ldelim();
            }
            if (m.usersTw != null && m.usersTw.length) {
                for (var i = 0; i < m.usersTw.length; ++i)
                    $root.mahjong_jp.MahjongGameUserTw.encode(m.usersTw[i], w.uint32(26).fork()).ldelim();
            }
            return w;
        };

        MahjongTableInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.MahjongTableInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.tableType = r.int32();
                        break;
                    }
                case 2: {
                        if (!(m.users && m.users.length))
                            m.users = [];
                        m.users.push($root.mahjong_jp.MahjongGameUser.decode(r, r.uint32()));
                        break;
                    }
                case 3: {
                        if (!(m.usersTw && m.usersTw.length))
                            m.usersTw = [];
                        m.usersTw.push($root.mahjong_jp.MahjongGameUserTw.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return MahjongTableInfo;
    })();

    mahjong_jp.MahjongGameUser = (function() {

        function MahjongGameUser(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        MahjongGameUser.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        MahjongGameUser.prototype.userYuanbao = 0;
        MahjongGameUser.prototype.relativeMoney = 0;
        MahjongGameUser.prototype.moneyPlat = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        MahjongGameUser.prototype.allResult = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        MahjongGameUser.prototype.onlineStatus = 0;
        MahjongGameUser.prototype.rank = 0;
        MahjongGameUser.prototype.dedian = 0;

        MahjongGameUser.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userId != null && Object.hasOwnProperty.call(m, "userId"))
                w.uint32(8).int64(m.userId);
            if (m.userYuanbao != null && Object.hasOwnProperty.call(m, "userYuanbao"))
                w.uint32(21).float(m.userYuanbao);
            if (m.relativeMoney != null && Object.hasOwnProperty.call(m, "relativeMoney"))
                w.uint32(29).float(m.relativeMoney);
            if (m.moneyPlat != null && Object.hasOwnProperty.call(m, "moneyPlat"))
                w.uint32(32).int64(m.moneyPlat);
            if (m.allResult != null && Object.hasOwnProperty.call(m, "allResult"))
                w.uint32(40).int64(m.allResult);
            if (m.onlineStatus != null && Object.hasOwnProperty.call(m, "onlineStatus"))
                w.uint32(48).int32(m.onlineStatus);
            if (m.rank != null && Object.hasOwnProperty.call(m, "rank"))
                w.uint32(56).int32(m.rank);
            if (m.dedian != null && Object.hasOwnProperty.call(m, "dedian"))
                w.uint32(69).float(m.dedian);
            return w;
        };

        MahjongGameUser.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.MahjongGameUser();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userId = r.int64();
                        break;
                    }
                case 2: {
                        m.userYuanbao = r.float();
                        break;
                    }
                case 3: {
                        m.relativeMoney = r.float();
                        break;
                    }
                case 4: {
                        m.moneyPlat = r.int64();
                        break;
                    }
                case 5: {
                        m.allResult = r.int64();
                        break;
                    }
                case 6: {
                        m.onlineStatus = r.int32();
                        break;
                    }
                case 7: {
                        m.rank = r.int32();
                        break;
                    }
                case 8: {
                        m.dedian = r.float();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return MahjongGameUser;
    })();

    mahjong_jp.MahjongGameUserTw = (function() {

        function MahjongGameUserTw(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        MahjongGameUserTw.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        MahjongGameUserTw.prototype.relativeMoney = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        MahjongGameUserTw.prototype.moneyPlat = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        MahjongGameUserTw.prototype.allResult = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        MahjongGameUserTw.prototype.onlineStatus = 0;
        MahjongGameUserTw.prototype.fangpaoNums = 0;
        MahjongGameUserTw.prototype.zimoNums = 0;
        MahjongGameUserTw.prototype.gangshangkaihuaNums = 0;
        MahjongGameUserTw.prototype.chihuNums = 0;
        MahjongGameUserTw.prototype.maxFan = 0;

        MahjongGameUserTw.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userId != null && Object.hasOwnProperty.call(m, "userId"))
                w.uint32(8).int64(m.userId);
            if (m.relativeMoney != null && Object.hasOwnProperty.call(m, "relativeMoney"))
                w.uint32(16).int64(m.relativeMoney);
            if (m.moneyPlat != null && Object.hasOwnProperty.call(m, "moneyPlat"))
                w.uint32(24).int64(m.moneyPlat);
            if (m.allResult != null && Object.hasOwnProperty.call(m, "allResult"))
                w.uint32(32).int64(m.allResult);
            if (m.onlineStatus != null && Object.hasOwnProperty.call(m, "onlineStatus"))
                w.uint32(40).int32(m.onlineStatus);
            if (m.fangpaoNums != null && Object.hasOwnProperty.call(m, "fangpaoNums"))
                w.uint32(48).int32(m.fangpaoNums);
            if (m.zimoNums != null && Object.hasOwnProperty.call(m, "zimoNums"))
                w.uint32(56).int32(m.zimoNums);
            if (m.gangshangkaihuaNums != null && Object.hasOwnProperty.call(m, "gangshangkaihuaNums"))
                w.uint32(64).int32(m.gangshangkaihuaNums);
            if (m.chihuNums != null && Object.hasOwnProperty.call(m, "chihuNums"))
                w.uint32(72).int32(m.chihuNums);
            if (m.maxFan != null && Object.hasOwnProperty.call(m, "maxFan"))
                w.uint32(80).int32(m.maxFan);
            return w;
        };

        MahjongGameUserTw.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.MahjongGameUserTw();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userId = r.int64();
                        break;
                    }
                case 2: {
                        m.relativeMoney = r.int64();
                        break;
                    }
                case 3: {
                        m.moneyPlat = r.int64();
                        break;
                    }
                case 4: {
                        m.allResult = r.int64();
                        break;
                    }
                case 5: {
                        m.onlineStatus = r.int32();
                        break;
                    }
                case 6: {
                        m.fangpaoNums = r.int32();
                        break;
                    }
                case 7: {
                        m.zimoNums = r.int32();
                        break;
                    }
                case 8: {
                        m.gangshangkaihuaNums = r.int32();
                        break;
                    }
                case 9: {
                        m.chihuNums = r.int32();
                        break;
                    }
                case 10: {
                        m.maxFan = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return MahjongGameUserTw;
    })();

    mahjong_jp.PlayerData = (function() {

        function PlayerData(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        PlayerData.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        PlayerData.prototype.winTimes = 0;
        PlayerData.prototype.lostTimes = 0;
        PlayerData.prototype.pingTimes = 0;
        PlayerData.prototype.level = 0;
        PlayerData.prototype.levelName = "";
        PlayerData.prototype.exp = 0;

        PlayerData.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userId != null && Object.hasOwnProperty.call(m, "userId"))
                w.uint32(8).int64(m.userId);
            if (m.winTimes != null && Object.hasOwnProperty.call(m, "winTimes"))
                w.uint32(16).int32(m.winTimes);
            if (m.lostTimes != null && Object.hasOwnProperty.call(m, "lostTimes"))
                w.uint32(24).int32(m.lostTimes);
            if (m.pingTimes != null && Object.hasOwnProperty.call(m, "pingTimes"))
                w.uint32(32).int32(m.pingTimes);
            if (m.level != null && Object.hasOwnProperty.call(m, "level"))
                w.uint32(40).int32(m.level);
            if (m.levelName != null && Object.hasOwnProperty.call(m, "levelName"))
                w.uint32(50).string(m.levelName);
            if (m.exp != null && Object.hasOwnProperty.call(m, "exp"))
                w.uint32(56).int32(m.exp);
            return w;
        };

        PlayerData.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.PlayerData();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userId = r.int64();
                        break;
                    }
                case 2: {
                        m.winTimes = r.int32();
                        break;
                    }
                case 3: {
                        m.lostTimes = r.int32();
                        break;
                    }
                case 4: {
                        m.pingTimes = r.int32();
                        break;
                    }
                case 5: {
                        m.level = r.int32();
                        break;
                    }
                case 6: {
                        m.levelName = r.string();
                        break;
                    }
                case 7: {
                        m.exp = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return PlayerData;
    })();

    mahjong_jp.PlayerUpdateData = (function() {

        function PlayerUpdateData(p) {
            this.playerDatas = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        PlayerUpdateData.prototype.playerDatas = $util.emptyArray;

        PlayerUpdateData.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.playerDatas != null && m.playerDatas.length) {
                for (var i = 0; i < m.playerDatas.length; ++i)
                    $root.mahjong_jp.PlayerData.encode(m.playerDatas[i], w.uint32(10).fork()).ldelim();
            }
            return w;
        };

        PlayerUpdateData.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.PlayerUpdateData();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        if (!(m.playerDatas && m.playerDatas.length))
                            m.playerDatas = [];
                        m.playerDatas.push($root.mahjong_jp.PlayerData.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return PlayerUpdateData;
    })();

    mahjong_jp.UserOffline = (function() {

        function UserOffline(p) {
            this.players = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        UserOffline.prototype.players = $util.emptyArray;

        UserOffline.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.players != null && m.players.length) {
                for (var i = 0; i < m.players.length; ++i)
                    $root.mahjong_jp.PlayerID.encode(m.players[i], w.uint32(10).fork()).ldelim();
            }
            return w;
        };

        UserOffline.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.UserOffline();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        if (!(m.players && m.players.length))
                            m.players = [];
                        m.players.push($root.mahjong_jp.PlayerID.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return UserOffline;
    })();

    mahjong_jp.UserTuoGuan = (function() {

        function UserTuoGuan(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        UserTuoGuan.prototype.type = 0;

        UserTuoGuan.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.type != null && Object.hasOwnProperty.call(m, "type"))
                w.uint32(8).int32(m.type);
            return w;
        };

        UserTuoGuan.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.UserTuoGuan();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.type = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return UserTuoGuan;
    })();

    mahjong_jp.BroadUserTuoGuan = (function() {

        function BroadUserTuoGuan(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        BroadUserTuoGuan.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        BroadUserTuoGuan.prototype.type = 0;

        BroadUserTuoGuan.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userId != null && Object.hasOwnProperty.call(m, "userId"))
                w.uint32(8).int64(m.userId);
            if (m.type != null && Object.hasOwnProperty.call(m, "type"))
                w.uint32(16).int32(m.type);
            return w;
        };

        BroadUserTuoGuan.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.BroadUserTuoGuan();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userId = r.int64();
                        break;
                    }
                case 2: {
                        m.type = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return BroadUserTuoGuan;
    })();

    mahjong_jp.UserOperatorHint = (function() {

        function UserOperatorHint(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        UserOperatorHint.prototype.opValue = 0;
        UserOperatorHint.prototype.opCard = 0;
        UserOperatorHint.prototype.seatID = 0;
        UserOperatorHint.prototype.fan = 0;
        UserOperatorHint.prototype.diffTimeout = 0;

        UserOperatorHint.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.opValue != null && Object.hasOwnProperty.call(m, "opValue"))
                w.uint32(8).int32(m.opValue);
            if (m.opCard != null && Object.hasOwnProperty.call(m, "opCard"))
                w.uint32(16).int32(m.opCard);
            if (m.seatID != null && Object.hasOwnProperty.call(m, "seatID"))
                w.uint32(24).int32(m.seatID);
            if (m.fan != null && Object.hasOwnProperty.call(m, "fan"))
                w.uint32(32).int32(m.fan);
            if (m.diffTimeout != null && Object.hasOwnProperty.call(m, "diffTimeout"))
                w.uint32(40).int32(m.diffTimeout);
            return w;
        };

        UserOperatorHint.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.UserOperatorHint();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.opValue = r.int32();
                        break;
                    }
                case 2: {
                        m.opCard = r.int32();
                        break;
                    }
                case 3: {
                        m.seatID = r.int32();
                        break;
                    }
                case 4: {
                        m.fan = r.int32();
                        break;
                    }
                case 5: {
                        m.diffTimeout = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return UserOperatorHint;
    })();

    mahjong_jp.UserPriMes = (function() {

        function UserPriMes(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        UserPriMes.prototype.receiveUid = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        UserPriMes.prototype.sendUid = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        UserPriMes.prototype.faceid = 0;

        UserPriMes.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.receiveUid != null && Object.hasOwnProperty.call(m, "receiveUid"))
                w.uint32(8).int64(m.receiveUid);
            if (m.sendUid != null && Object.hasOwnProperty.call(m, "sendUid"))
                w.uint32(16).int64(m.sendUid);
            if (m.faceid != null && Object.hasOwnProperty.call(m, "faceid"))
                w.uint32(24).int32(m.faceid);
            return w;
        };

        UserPriMes.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.UserPriMes();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.receiveUid = r.int64();
                        break;
                    }
                case 2: {
                        m.sendUid = r.int64();
                        break;
                    }
                case 3: {
                        m.faceid = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return UserPriMes;
    })();

    mahjong_jp.OutCardInfo = (function() {

        function OutCardInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        OutCardInfo.prototype.outCard = 0;
        OutCardInfo.prototype.status = 0;
        OutCardInfo.prototype.moQie = 0;

        OutCardInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.outCard != null && Object.hasOwnProperty.call(m, "outCard"))
                w.uint32(8).int32(m.outCard);
            if (m.status != null && Object.hasOwnProperty.call(m, "status"))
                w.uint32(16).int32(m.status);
            if (m.moQie != null && Object.hasOwnProperty.call(m, "moQie"))
                w.uint32(24).int32(m.moQie);
            return w;
        };

        OutCardInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.OutCardInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.outCard = r.int32();
                        break;
                    }
                case 2: {
                        m.status = r.int32();
                        break;
                    }
                case 3: {
                        m.moQie = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return OutCardInfo;
    })();

    mahjong_jp.PlayerInfoReconect = (function() {

        function PlayerInfoReconect(p) {
            this.holds = [];
            this.fulus = [];
            this.outCards = [];
            this.huaPais = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        PlayerInfoReconect.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        PlayerInfoReconect.prototype.seatId = 0;
        PlayerInfoReconect.prototype.ai = 0;
        PlayerInfoReconect.prototype.nickname = "";
        PlayerInfoReconect.prototype.dianshu = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        PlayerInfoReconect.prototype.tingPai = 0;
        PlayerInfoReconect.prototype.holdCount = 0;
        PlayerInfoReconect.prototype.holds = $util.emptyArray;
        PlayerInfoReconect.prototype.fulus = $util.emptyArray;
        PlayerInfoReconect.prototype.outCards = $util.emptyArray;
        PlayerInfoReconect.prototype.statics = null;
        PlayerInfoReconect.prototype.lizhiPaiIndex = 0;
        PlayerInfoReconect.prototype.isReady = false;
        PlayerInfoReconect.prototype.headerId = 0;
        PlayerInfoReconect.prototype.huaPais = $util.emptyArray;
        PlayerInfoReconect.prototype.sex = 0;
        PlayerInfoReconect.prototype.allResult = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        PlayerInfoReconect.prototype.winTimes = 0;
        PlayerInfoReconect.prototype.lostTimes = 0;
        PlayerInfoReconect.prototype.pingTimes = 0;
        PlayerInfoReconect.prototype.level = 0;

        PlayerInfoReconect.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.userId != null && Object.hasOwnProperty.call(m, "userId"))
                w.uint32(8).int64(m.userId);
            if (m.seatId != null && Object.hasOwnProperty.call(m, "seatId"))
                w.uint32(16).int32(m.seatId);
            if (m.ai != null && Object.hasOwnProperty.call(m, "ai"))
                w.uint32(24).int32(m.ai);
            if (m.nickname != null && Object.hasOwnProperty.call(m, "nickname"))
                w.uint32(34).string(m.nickname);
            if (m.dianshu != null && Object.hasOwnProperty.call(m, "dianshu"))
                w.uint32(40).int64(m.dianshu);
            if (m.tingPai != null && Object.hasOwnProperty.call(m, "tingPai"))
                w.uint32(48).int32(m.tingPai);
            if (m.holdCount != null && Object.hasOwnProperty.call(m, "holdCount"))
                w.uint32(56).int32(m.holdCount);
            if (m.holds != null && m.holds.length) {
                w.uint32(66).fork();
                for (var i = 0; i < m.holds.length; ++i)
                    w.int32(m.holds[i]);
                w.ldelim();
            }
            if (m.fulus != null && m.fulus.length) {
                for (var i = 0; i < m.fulus.length; ++i)
                    $root.mahjong_jp.FuLuInfo.encode(m.fulus[i], w.uint32(74).fork()).ldelim();
            }
            if (m.outCards != null && m.outCards.length) {
                for (var i = 0; i < m.outCards.length; ++i)
                    $root.mahjong_jp.OutCardInfo.encode(m.outCards[i], w.uint32(82).fork()).ldelim();
            }
            if (m.statics != null && Object.hasOwnProperty.call(m, "statics"))
                $root.mahjong_jp.PlayerPlayStaticsInfo.encode(m.statics, w.uint32(90).fork()).ldelim();
            if (m.lizhiPaiIndex != null && Object.hasOwnProperty.call(m, "lizhiPaiIndex"))
                w.uint32(96).int32(m.lizhiPaiIndex);
            if (m.isReady != null && Object.hasOwnProperty.call(m, "isReady"))
                w.uint32(104).bool(m.isReady);
            if (m.headerId != null && Object.hasOwnProperty.call(m, "headerId"))
                w.uint32(112).int32(m.headerId);
            if (m.huaPais != null && m.huaPais.length) {
                w.uint32(122).fork();
                for (var i = 0; i < m.huaPais.length; ++i)
                    w.int32(m.huaPais[i]);
                w.ldelim();
            }
            if (m.sex != null && Object.hasOwnProperty.call(m, "sex"))
                w.uint32(128).int32(m.sex);
            if (m.allResult != null && Object.hasOwnProperty.call(m, "allResult"))
                w.uint32(136).int64(m.allResult);
            if (m.winTimes != null && Object.hasOwnProperty.call(m, "winTimes"))
                w.uint32(144).int32(m.winTimes);
            if (m.lostTimes != null && Object.hasOwnProperty.call(m, "lostTimes"))
                w.uint32(152).int32(m.lostTimes);
            if (m.pingTimes != null && Object.hasOwnProperty.call(m, "pingTimes"))
                w.uint32(160).int32(m.pingTimes);
            if (m.level != null && Object.hasOwnProperty.call(m, "level"))
                w.uint32(168).int32(m.level);
            return w;
        };

        PlayerInfoReconect.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.PlayerInfoReconect();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.userId = r.int64();
                        break;
                    }
                case 2: {
                        m.seatId = r.int32();
                        break;
                    }
                case 3: {
                        m.ai = r.int32();
                        break;
                    }
                case 4: {
                        m.nickname = r.string();
                        break;
                    }
                case 5: {
                        m.dianshu = r.int64();
                        break;
                    }
                case 6: {
                        m.tingPai = r.int32();
                        break;
                    }
                case 7: {
                        m.holdCount = r.int32();
                        break;
                    }
                case 8: {
                        if (!(m.holds && m.holds.length))
                            m.holds = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.holds.push(r.int32());
                        } else
                            m.holds.push(r.int32());
                        break;
                    }
                case 9: {
                        if (!(m.fulus && m.fulus.length))
                            m.fulus = [];
                        m.fulus.push($root.mahjong_jp.FuLuInfo.decode(r, r.uint32()));
                        break;
                    }
                case 10: {
                        if (!(m.outCards && m.outCards.length))
                            m.outCards = [];
                        m.outCards.push($root.mahjong_jp.OutCardInfo.decode(r, r.uint32()));
                        break;
                    }
                case 11: {
                        m.statics = $root.mahjong_jp.PlayerPlayStaticsInfo.decode(r, r.uint32());
                        break;
                    }
                case 12: {
                        m.lizhiPaiIndex = r.int32();
                        break;
                    }
                case 13: {
                        m.isReady = r.bool();
                        break;
                    }
                case 14: {
                        m.headerId = r.int32();
                        break;
                    }
                case 15: {
                        if (!(m.huaPais && m.huaPais.length))
                            m.huaPais = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.huaPais.push(r.int32());
                        } else
                            m.huaPais.push(r.int32());
                        break;
                    }
                case 16: {
                        m.sex = r.int32();
                        break;
                    }
                case 17: {
                        m.allResult = r.int64();
                        break;
                    }
                case 18: {
                        m.winTimes = r.int32();
                        break;
                    }
                case 19: {
                        m.lostTimes = r.int32();
                        break;
                    }
                case 20: {
                        m.pingTimes = r.int32();
                        break;
                    }
                case 21: {
                        m.level = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return PlayerInfoReconect;
    })();

    mahjong_jp.TableReconnectInfo_jp = (function() {

        function TableReconnectInfo_jp(p) {
            this.doraCards = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        TableReconnectInfo_jp.prototype.nBenJu = 0;
        TableReconnectInfo_jp.prototype.gongtuo = 0;
        TableReconnectInfo_jp.prototype.doraCards = $util.emptyArray;

        TableReconnectInfo_jp.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.nBenJu != null && Object.hasOwnProperty.call(m, "nBenJu"))
                w.uint32(8).int32(m.nBenJu);
            if (m.gongtuo != null && Object.hasOwnProperty.call(m, "gongtuo"))
                w.uint32(16).int32(m.gongtuo);
            if (m.doraCards != null && m.doraCards.length) {
                w.uint32(26).fork();
                for (var i = 0; i < m.doraCards.length; ++i)
                    w.int32(m.doraCards[i]);
                w.ldelim();
            }
            return w;
        };

        TableReconnectInfo_jp.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.TableReconnectInfo_jp();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.nBenJu = r.int32();
                        break;
                    }
                case 2: {
                        m.gongtuo = r.int32();
                        break;
                    }
                case 3: {
                        if (!(m.doraCards && m.doraCards.length))
                            m.doraCards = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.doraCards.push(r.int32());
                        } else
                            m.doraCards.push(r.int32());
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return TableReconnectInfo_jp;
    })();

    mahjong_jp.TableReconectInfo = (function() {

        function TableReconectInfo(p) {
            this.doraCards = [];
            this.players = [];
            this.disableCards = [];
            this.gangCards = [];
            this.hucard = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        TableReconectInfo.prototype.tableType = 0;
        TableReconectInfo.prototype.baseChips = 0;
        TableReconectInfo.prototype.baseRadix = 0;
        TableReconectInfo.prototype.quan = 0;
        TableReconectInfo.prototype.outCardTimeOut = 0;
        TableReconectInfo.prototype.operationTimeOut = 0;
        TableReconectInfo.prototype.curQaun = 0;
        TableReconectInfo.prototype.nRound = 0;
        TableReconectInfo.prototype.nBenJu = 0;
        TableReconectInfo.prototype.gongtuo = 0;
        TableReconectInfo.prototype.eastSeatID = 0;
        TableReconectInfo.prototype.bankSeatID = 0;
        TableReconectInfo.prototype.shuaizi = 0;
        TableReconectInfo.prototype.leftCardCount = 0;
        TableReconectInfo.prototype.doraCards = $util.emptyArray;
        TableReconectInfo.prototype.players = $util.emptyArray;
        TableReconectInfo.prototype.gameState = 0;
        TableReconectInfo.prototype.curState = 0;
        TableReconectInfo.prototype.disableCards = $util.emptyArray;
        TableReconectInfo.prototype.isZhenTing = false;
        TableReconectInfo.prototype.fixedTimeout = 0;
        TableReconectInfo.prototype.diffTimeout = 0;
        TableReconectInfo.prototype.preOutCardUid = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
        TableReconectInfo.prototype.nOpWeight = 0;
        TableReconectInfo.prototype.byOutCard = 0;
        TableReconectInfo.prototype.curOutCardUid = 0;
        TableReconectInfo.prototype.gangCards = $util.emptyArray;
        TableReconectInfo.prototype.byGrabCard = 0;
        TableReconectInfo.prototype.hucard = $util.emptyArray;
        TableReconectInfo.prototype.tablemode = 0;
        TableReconectInfo.prototype.tableLevel = 0;
        TableReconectInfo.prototype.tableID = 0;
        TableReconectInfo.prototype.lianZhuangCount = 0;
        TableReconectInfo.prototype.nextGameTime = 0;
        TableReconectInfo.prototype.uuid = "";

        TableReconectInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.tableType != null && Object.hasOwnProperty.call(m, "tableType"))
                w.uint32(8).int32(m.tableType);
            if (m.baseChips != null && Object.hasOwnProperty.call(m, "baseChips"))
                w.uint32(16).int32(m.baseChips);
            if (m.baseRadix != null && Object.hasOwnProperty.call(m, "baseRadix"))
                w.uint32(24).int32(m.baseRadix);
            if (m.quan != null && Object.hasOwnProperty.call(m, "quan"))
                w.uint32(32).int32(m.quan);
            if (m.outCardTimeOut != null && Object.hasOwnProperty.call(m, "outCardTimeOut"))
                w.uint32(40).int32(m.outCardTimeOut);
            if (m.operationTimeOut != null && Object.hasOwnProperty.call(m, "operationTimeOut"))
                w.uint32(48).int32(m.operationTimeOut);
            if (m.curQaun != null && Object.hasOwnProperty.call(m, "curQaun"))
                w.uint32(56).int32(m.curQaun);
            if (m.nRound != null && Object.hasOwnProperty.call(m, "nRound"))
                w.uint32(64).int32(m.nRound);
            if (m.nBenJu != null && Object.hasOwnProperty.call(m, "nBenJu"))
                w.uint32(72).int32(m.nBenJu);
            if (m.gongtuo != null && Object.hasOwnProperty.call(m, "gongtuo"))
                w.uint32(80).int32(m.gongtuo);
            if (m.eastSeatID != null && Object.hasOwnProperty.call(m, "eastSeatID"))
                w.uint32(88).int32(m.eastSeatID);
            if (m.bankSeatID != null && Object.hasOwnProperty.call(m, "bankSeatID"))
                w.uint32(96).int32(m.bankSeatID);
            if (m.shuaizi != null && Object.hasOwnProperty.call(m, "shuaizi"))
                w.uint32(104).int32(m.shuaizi);
            if (m.leftCardCount != null && Object.hasOwnProperty.call(m, "leftCardCount"))
                w.uint32(112).int32(m.leftCardCount);
            if (m.doraCards != null && m.doraCards.length) {
                w.uint32(122).fork();
                for (var i = 0; i < m.doraCards.length; ++i)
                    w.int32(m.doraCards[i]);
                w.ldelim();
            }
            if (m.players != null && m.players.length) {
                for (var i = 0; i < m.players.length; ++i)
                    $root.mahjong_jp.PlayerInfoReconect.encode(m.players[i], w.uint32(130).fork()).ldelim();
            }
            if (m.gameState != null && Object.hasOwnProperty.call(m, "gameState"))
                w.uint32(136).int32(m.gameState);
            if (m.curState != null && Object.hasOwnProperty.call(m, "curState"))
                w.uint32(144).int32(m.curState);
            if (m.disableCards != null && m.disableCards.length) {
                w.uint32(154).fork();
                for (var i = 0; i < m.disableCards.length; ++i)
                    w.int32(m.disableCards[i]);
                w.ldelim();
            }
            if (m.isZhenTing != null && Object.hasOwnProperty.call(m, "isZhenTing"))
                w.uint32(160).bool(m.isZhenTing);
            if (m.fixedTimeout != null && Object.hasOwnProperty.call(m, "fixedTimeout"))
                w.uint32(168).int32(m.fixedTimeout);
            if (m.diffTimeout != null && Object.hasOwnProperty.call(m, "diffTimeout"))
                w.uint32(176).int32(m.diffTimeout);
            if (m.preOutCardUid != null && Object.hasOwnProperty.call(m, "preOutCardUid"))
                w.uint32(184).int64(m.preOutCardUid);
            if (m.nOpWeight != null && Object.hasOwnProperty.call(m, "nOpWeight"))
                w.uint32(192).int32(m.nOpWeight);
            if (m.byOutCard != null && Object.hasOwnProperty.call(m, "byOutCard"))
                w.uint32(200).int32(m.byOutCard);
            if (m.curOutCardUid != null && Object.hasOwnProperty.call(m, "curOutCardUid"))
                w.uint32(208).int32(m.curOutCardUid);
            if (m.gangCards != null && m.gangCards.length) {
                w.uint32(218).fork();
                for (var i = 0; i < m.gangCards.length; ++i)
                    w.int32(m.gangCards[i]);
                w.ldelim();
            }
            if (m.byGrabCard != null && Object.hasOwnProperty.call(m, "byGrabCard"))
                w.uint32(224).int32(m.byGrabCard);
            if (m.hucard != null && m.hucard.length) {
                for (var i = 0; i < m.hucard.length; ++i)
                    $root.mahjong_jp.HucardInfo.encode(m.hucard[i], w.uint32(234).fork()).ldelim();
            }
            if (m.tablemode != null && Object.hasOwnProperty.call(m, "tablemode"))
                w.uint32(240).int32(m.tablemode);
            if (m.tableLevel != null && Object.hasOwnProperty.call(m, "tableLevel"))
                w.uint32(248).int32(m.tableLevel);
            if (m.tableID != null && Object.hasOwnProperty.call(m, "tableID"))
                w.uint32(256).int32(m.tableID);
            if (m.lianZhuangCount != null && Object.hasOwnProperty.call(m, "lianZhuangCount"))
                w.uint32(264).int32(m.lianZhuangCount);
            if (m.nextGameTime != null && Object.hasOwnProperty.call(m, "nextGameTime"))
                w.uint32(272).int32(m.nextGameTime);
            if (m.uuid != null && Object.hasOwnProperty.call(m, "uuid"))
                w.uint32(282).string(m.uuid);
            return w;
        };

        TableReconectInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.TableReconectInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.tableType = r.int32();
                        break;
                    }
                case 2: {
                        m.baseChips = r.int32();
                        break;
                    }
                case 3: {
                        m.baseRadix = r.int32();
                        break;
                    }
                case 4: {
                        m.quan = r.int32();
                        break;
                    }
                case 5: {
                        m.outCardTimeOut = r.int32();
                        break;
                    }
                case 6: {
                        m.operationTimeOut = r.int32();
                        break;
                    }
                case 7: {
                        m.curQaun = r.int32();
                        break;
                    }
                case 8: {
                        m.nRound = r.int32();
                        break;
                    }
                case 9: {
                        m.nBenJu = r.int32();
                        break;
                    }
                case 10: {
                        m.gongtuo = r.int32();
                        break;
                    }
                case 11: {
                        m.eastSeatID = r.int32();
                        break;
                    }
                case 12: {
                        m.bankSeatID = r.int32();
                        break;
                    }
                case 13: {
                        m.shuaizi = r.int32();
                        break;
                    }
                case 14: {
                        m.leftCardCount = r.int32();
                        break;
                    }
                case 15: {
                        if (!(m.doraCards && m.doraCards.length))
                            m.doraCards = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.doraCards.push(r.int32());
                        } else
                            m.doraCards.push(r.int32());
                        break;
                    }
                case 16: {
                        if (!(m.players && m.players.length))
                            m.players = [];
                        m.players.push($root.mahjong_jp.PlayerInfoReconect.decode(r, r.uint32()));
                        break;
                    }
                case 17: {
                        m.gameState = r.int32();
                        break;
                    }
                case 18: {
                        m.curState = r.int32();
                        break;
                    }
                case 19: {
                        if (!(m.disableCards && m.disableCards.length))
                            m.disableCards = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.disableCards.push(r.int32());
                        } else
                            m.disableCards.push(r.int32());
                        break;
                    }
                case 20: {
                        m.isZhenTing = r.bool();
                        break;
                    }
                case 21: {
                        m.fixedTimeout = r.int32();
                        break;
                    }
                case 22: {
                        m.diffTimeout = r.int32();
                        break;
                    }
                case 23: {
                        m.preOutCardUid = r.int64();
                        break;
                    }
                case 24: {
                        m.nOpWeight = r.int32();
                        break;
                    }
                case 25: {
                        m.byOutCard = r.int32();
                        break;
                    }
                case 26: {
                        m.curOutCardUid = r.int32();
                        break;
                    }
                case 27: {
                        if (!(m.gangCards && m.gangCards.length))
                            m.gangCards = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.gangCards.push(r.int32());
                        } else
                            m.gangCards.push(r.int32());
                        break;
                    }
                case 28: {
                        m.byGrabCard = r.int32();
                        break;
                    }
                case 29: {
                        if (!(m.hucard && m.hucard.length))
                            m.hucard = [];
                        m.hucard.push($root.mahjong_jp.HucardInfo.decode(r, r.uint32()));
                        break;
                    }
                case 30: {
                        m.tablemode = r.int32();
                        break;
                    }
                case 31: {
                        m.tableLevel = r.int32();
                        break;
                    }
                case 32: {
                        m.tableID = r.int32();
                        break;
                    }
                case 33: {
                        m.lianZhuangCount = r.int32();
                        break;
                    }
                case 34: {
                        m.nextGameTime = r.int32();
                        break;
                    }
                case 35: {
                        m.uuid = r.string();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return TableReconectInfo;
    })();

    mahjong_jp.KickUser = (function() {

        function KickUser(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        KickUser.prototype.leftTime = 0;

        KickUser.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.leftTime != null && Object.hasOwnProperty.call(m, "leftTime"))
                w.uint32(8).uint32(m.leftTime);
            return w;
        };

        KickUser.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.KickUser();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.leftTime = r.uint32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return KickUser;
    })();

    mahjong_jp.GameUUIDTestData = (function() {

        function GameUUIDTestData(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GameUUIDTestData.prototype.uuid = "";
        GameUUIDTestData.prototype.clubid = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        GameUUIDTestData.prototype.isSet = false;

        GameUUIDTestData.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.uuid != null && Object.hasOwnProperty.call(m, "uuid"))
                w.uint32(10).string(m.uuid);
            if (m.clubid != null && Object.hasOwnProperty.call(m, "clubid"))
                w.uint32(16).uint64(m.clubid);
            if (m.isSet != null && Object.hasOwnProperty.call(m, "isSet"))
                w.uint32(24).bool(m.isSet);
            return w;
        };

        GameUUIDTestData.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.GameUUIDTestData();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.uuid = r.string();
                        break;
                    }
                case 2: {
                        m.clubid = r.uint64();
                        break;
                    }
                case 3: {
                        m.isSet = r.bool();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GameUUIDTestData;
    })();

    mahjong_jp.GameIDReq = (function() {

        function GameIDReq(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        GameIDReq.prototype.roomLevel = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        GameIDReq.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roomLevel != null && Object.hasOwnProperty.call(m, "roomLevel"))
                w.uint32(8).uint64(m.roomLevel);
            return w;
        };

        GameIDReq.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.GameIDReq();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.roomLevel = r.uint64();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return GameIDReq;
    })();

    mahjong_jp.RoomLevelInfo = (function() {

        function RoomLevelInfo(p) {
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        RoomLevelInfo.prototype.level = 0;
        RoomLevelInfo.prototype.baseChip = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        RoomLevelInfo.prototype.enterLimit = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
        RoomLevelInfo.prototype.onlineCount = 0;

        RoomLevelInfo.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.level != null && Object.hasOwnProperty.call(m, "level"))
                w.uint32(8).int32(m.level);
            if (m.baseChip != null && Object.hasOwnProperty.call(m, "baseChip"))
                w.uint32(16).uint64(m.baseChip);
            if (m.enterLimit != null && Object.hasOwnProperty.call(m, "enterLimit"))
                w.uint32(24).uint64(m.enterLimit);
            if (m.onlineCount != null && Object.hasOwnProperty.call(m, "onlineCount"))
                w.uint32(32).int32(m.onlineCount);
            return w;
        };

        RoomLevelInfo.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.RoomLevelInfo();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        m.level = r.int32();
                        break;
                    }
                case 2: {
                        m.baseChip = r.uint64();
                        break;
                    }
                case 3: {
                        m.enterLimit = r.uint64();
                        break;
                    }
                case 4: {
                        m.onlineCount = r.int32();
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return RoomLevelInfo;
    })();

    mahjong_jp.RoomLevelInfos = (function() {

        function RoomLevelInfos(p) {
            this.roomInfos = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }

        RoomLevelInfos.prototype.roomInfos = $util.emptyArray;

        RoomLevelInfos.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.roomInfos != null && m.roomInfos.length) {
                for (var i = 0; i < m.roomInfos.length; ++i)
                    $root.mahjong_jp.RoomLevelInfo.encode(m.roomInfos[i], w.uint32(10).fork()).ldelim();
            }
            return w;
        };

        RoomLevelInfos.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.mahjong_jp.RoomLevelInfos();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1: {
                        if (!(m.roomInfos && m.roomInfos.length))
                            m.roomInfos = [];
                        m.roomInfos.push($root.mahjong_jp.RoomLevelInfo.decode(r, r.uint32()));
                        break;
                    }
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };

        return RoomLevelInfos;
    })();

    mahjong_jp.mahjongJPCode = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "UNSPECIFIED_MAHJONG_JP"] = 0;
        values[valuesById[9001] = "MAHJONG_SERVER_LOGIN_SUCCESS"] = 9001;
        values[valuesById[8724] = "MAHJONG_CLIENT_ROOMLEVEL_REQ"] = 8724;
        values[valuesById[8967] = "MAHJONG_SERVER_COMMAND_LOGIN_SUCCESS"] = 8967;
        values[valuesById[8723] = "MAHJONG_CLIENT_RECONNECT_REQ"] = 8723;
        values[valuesById[8968] = "MAHJONG_SERVER_COMMAND_RECONNECT_SUCCESS"] = 8968;
        values[valuesById[8729] = "PANGU_CLIENT_COMMAND_CHOOSE_ROOM"] = 8729;
        values[valuesById[8736] = "PANGU_CLIENT_COMMAND_ENTER_ROOM"] = 8736;
        values[valuesById[9027] = "PANGU_CLIENT_COMMAND_ENTER_CLUB_ROOM"] = 9027;
        values[valuesById[8705] = "MAHJONG_CLIENT_COMMAND_LOGOUT"] = 8705;
        values[valuesById[8707] = "MAHJONG_CLIENT_COMMAND_READY"] = 8707;
        values[valuesById[8961] = "MAHJONG_SERVER_BROADCAST_USER_READY"] = 8961;
        values[valuesById[8708] = "MAHJONG_CLIENT_COMMAND_OUT_CARD"] = 8708;
        values[valuesById[8962] = "MAHJONG_SERVER_BROADCAST_USER_OUT_CARD"] = 8962;
        values[valuesById[9026] = "MAHJONG_SERVER_COMMAND_LIZHI_UPDATE"] = 9026;
        values[valuesById[8963] = "MAHJONG_SERVER_BROADCAST_USER_AI"] = 8963;
        values[valuesById[8964] = "MAHJONG_SERVER_COMMAND_OPEERATION_HINT"] = 8964;
        values[valuesById[8709] = "MAHJONG_CLIENT_COMMAND_TAKE_OPERATION"] = 8709;
        values[valuesById[9025] = "MAHJONG_SERVER_COMMAND_JUMP_REPLY"] = 9025;
        values[valuesById[8710] = "MAHJONG_CLIENT_COMMAND_REQUEST_AI"] = 8710;
        values[valuesById[8969] = "MAHJONG_SERVER_BROADCAST_USER_LOGIN"] = 8969;
        values[valuesById[9028] = "MAHJONG_SERVER_COMMAND_LOGOUT_ROOM_RY"] = 9028;
        values[valuesById[8970] = "MAHJONG_SERVER_BROADCAST_USER_LOGOUT"] = 8970;
        values[valuesById[8971] = "MAHJONG_SERVER_BROADCAST_OFFLINE_USER"] = 8971;
        values[valuesById[8983] = "MAHJONG_SERVER_COMMAND_DEAL_CARD"] = 8983;
        values[valuesById[8984] = "MAHJONG_SERVER_COMMAND_GRAB_CARD"] = 8984;
        values[valuesById[8985] = "MAHJONG_SERVER_COMMAND_INVALID_OPERATION"] = 8985;
        values[valuesById[8987] = "MAHJONG_SERVER_BROADCAST_READY_START"] = 8987;
        values[valuesById[8988] = "MAHJONG_SERVER_BROADCAST_START_GAME"] = 8988;
        values[valuesById[9024] = "MAHJONG_SERVER_GANG_DORA"] = 9024;
        values[valuesById[8989] = "MAHJONG_SERVER_BROADCAST_TAKE_OPERATION"] = 8989;
        values[valuesById[8990] = "MAHJONG_SERVER_BROADCAST_CURRENT_PLAYER"] = 8990;
        values[valuesById[9012] = "MAHHONG_SERVER_BROADCAST_DATA_UPDATE"] = 9012;
        values[valuesById[8991] = "MAHJONG_SERVER_BROADCAST_STOP_ROUND"] = 8991;
        values[valuesById[8992] = "MAHJONG_SERVER_BROADCAST_STOP_GAME"] = 8992;
        values[valuesById[9002] = "MAHJONG_SERVER_KICK_USER_NOT_READY"] = 9002;
        values[valuesById[8722] = "MAHJONG_CLIENT_COMMAND_SET_TEST_DATA"] = 8722;
        return values;
    })();

    return mahjong_jp;
})();

module.exports = $root;
