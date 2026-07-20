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

import {instantiate, Label, Node, Size, Sprite, Tween, tween, UITransform, Vec3} from "cc";
import {CardFactory} from "../../../World/Entity/Card/CardFactory";
import {UiPopupHelper} from "../../../../framework/utils/UiPopupHelper";
import {Player} from "../../../World/Entity/Player/Player";
import {UiBtnCountDown} from "./UiBtnCountDown";
import {CommUtils} from "../../../../framework/utils/CommUtils";
import {protocol} from "../../../../framework/network/protocol-configs";

// 战绩结算。自身的详细信息。
export class UiSettleZhanJi {

    public root: Node;

    // 牌根节点
    public rootCard: Node;

    public icon: Sprite;
    public nickname: Label;

    // 宝牌 根节点
    public rootCardBao: Node;
    // 里宝牌 根节点
    public rootCardLiBao: Node;

    // XXX 符 XXX 番
    public tongJiRoot: Node;
    // 统计役满
    public tongJiYiMan: Node;
    public tongJiYiManNum: Node | null = null;
    public tongJiFu: Label;
    public tongJiFan: Label;

    // 赢的标志
    public winRoot: Node;
    public winZiMo: Node;
    public winRongHe: Node;

    // 分数
    public score: Label;

    public fanLayout1: Node;
    public fanLayout2: Node;
    public pfFanItem: Node;

    // 役满图片
    public yimanND: Node | null = null;
    public yimanNumND: Node | null = null;

    // 亲家子家图片
    public iconQinJia: Node | null = null;
    public iconZiJia: Node | null = null;

    public btnOK: Node;

    public init(node: Node) {

        this.root = node.getChildByPath("SettleLocalPlayer");
        this.root.active = false;
        this.btnOK = this.root.getChildByPath("btnOK");

        this.icon = this.root.getChildByPath("PlayerBase/Icon/Icon").getComponent(Sprite);
        this.nickname = this.root.getChildByPath("PlayerBase/Nickname").getComponent(Label);


        this.iconQinJia = this.root.getChildByPath("Card/iconQinjia");
        this.iconZiJia = this.root.getChildByPath("Card/iconZijia");

        this.rootCard = this.root.getChildByPath("Card/Card");
        var pfCard = this.root.getChildByPath("Card/Card/Card");
        pfCard.active = false;
        this.pfCardSize = pfCard.getComponent(UITransform).contentSize;

        this.rootCardBao = this.root.getChildByPath("Card/CardBao");
        this.rootCardLiBao = this.root.getChildByPath("Card/CardLiBao");

        var pfCard2 = this.root.getChildByPath("Card/CardBao/Card");
        pfCard2.active = false;
        this.pfCardSize2 = pfCard2.getComponent(UITransform).contentSize;

        this.tongJiRoot = this.root.getChildByPath("TongJi");
        this.tongJiFan = this.root.getChildByPath("TongJi/labelFan").getComponent(Label);
        this.tongJiFu = this.root.getChildByPath("TongJi/labelFu").getComponent(Label);

        this.score = this.root.getChildByPath("Score/val").getComponent(Label);

        this.winRoot = this.root.getChildByPath("Win");
        this.winZiMo = this.root.getChildByPath("Win/zimo");
        this.winRongHe = this.root.getChildByPath("Win/ronghe");
        this.winRoot.active = true;

        this.fanLayout1 = this.root.getChildByPath("FanLayout1");
        this.fanLayout2 = this.root.getChildByPath("FanLayout2");
        this.pfFanItem = this.root.getChildByPath("pfFanItem");
        this.pfFanItem.active = false;

        this.tongJiYiMan = this.root.getChildByPath("TongJiYimanND");
        this.tongJiYiManNum = this.root.getChildByPath("TongJiYimanND/numSP");
        this.tongJiYiMan.active = false;
        this.tongJiYiManNum.active = false;

        this.yimanND = this.root.getChildByPath("yimanND");
        this.yimanND.active = false;

        this.yimanNumND = this.root.getChildByPath("yimanND/numSP");
        this.yimanNumND.active = false;

        // this.pfFan1Item = this.root.getChildByPath( "Fan1/pfItem" ) ;
        // this.pfFan1Item.active = false ;

        this.clearCard();

        this.btnOK.on(Node.EventType.TOUCH_END, this._onBtnOkTouch, this);

    }

    private _onBtnOkTouch(): void {
        this.hide();
        UiBtnCountDown.stop(this.btnOK);

        // // 显示点数
        // UiSettleDianShu.ins.show() ;
        // UiSettleDianShu.ins.btnOK.once( Input.EventType.TOUCH_END , ()=>{ 
        //     UiBtnCountDown.stop( UiSettleDianShu.ins.btnOK ) ;
        //     CommSend.ready() ; 
        // } ) ;
        // UiBtnCountDown.start( UiSettleDianShu.ins.btnOK , 3 ) ;
    }

    public refreshPlayerBase(player: Player) {
        CommUtils.updatePlayerHeadIcon(this.icon, player.info.iconId);
        this.nickname.string = player.info.nickname;

    }

    // 显示亲家庄家标志
    public refreshBankerIcon(mIsBanker: boolean): void {
        this.iconQinJia.active = mIsBanker;
        this.iconZiJia.active = !mIsBanker;
    }

    public show() {
        console.log("显示战绩");
        UiPopupHelper.show(this.root);
    }

    public hide() {
        this.root.active = false;
    }


    // 显示手牌 不同组之间有显示间隔
    public showCard(cardIdGroups: Array<Array<string>>) {

        // 删除之前的
        var parent = this.rootCard;
        var c = parent.children;
        for (var i = c.length - 1; i > 0; --i) {
            c[i].destroy();
        } // end for

        var idx = 0;
        var interval = 20;
        for (var i = 0; i < cardIdGroups.length; ++i) {
            var ids = cardIdGroups[i];
            for (var j = 0; j < ids.length; ++j) {
                var card = CardFactory.create2d(ids[j]);
                card.presentation2d.root.setParent(parent);
                card.presentation2d.root.position = new Vec3(idx * this.pfCardSize.width + i * interval);
                card.presentation2d.root.getComponent(UITransform).contentSize = this.pfCardSize;
                ++idx;
            } // end for
        } // end for

    }

    public addCard(cardId: string, isV = true) {

        var card = CardFactory.create2d(cardId);
        card.presentation2d.root.setParent(this.rootCard, false);
        card.presentation2d.root.getComponent(UITransform).contentSize = this.pfCardSize;

        let width1 = this.pfCardSize.width;
        let width2 = this.pfCardSize.height;
        let width1Half = width1 / 2;
        let width2Half = width2 / 2;

        if (isV) {
            card.presentation2d.root.position = new Vec3(this.x + width1Half, 0, 0);
            this.x += width1;
        } else {
            card.presentation2d.root.eulerAngles = new Vec3(0, 0, 90);
            card.presentation2d.root.position = new Vec3(this.x + width2Half, (width1Half - width2Half), 0);
            this.x += width2;
        }

    }

    // 添加补杠的牌
    public addCardBu(cardId: string) {

        var card = CardFactory.create2d(cardId);
        card.presentation2d.root.setParent(this.rootCard, false);
        card.presentation2d.root.getComponent(UITransform).contentSize = this.pfCardSize;

        let width1 = this.pfCardSize.width;
        let width2 = this.pfCardSize.height;
        let width1Half = width1 / 2;
        let width2Half = width2 / 2;

        card.presentation2d.root.eulerAngles = new Vec3(0, 0, 90);
        card.presentation2d.root.position = new Vec3(this.x - width2Half, (width1Half - width2Half) + width1);
    }

    // 添加间隔
    public addCardInterval(n = 20) {
        this.x += n;
    }

    public clearCard() {
        this.rootCard.removeAllChildren();
        this.x = 0;
    }

    public x: number = 0;

    // 显示宝牌
    public showCardBao(cardIds: Array<string>) {
        this.showCardBaoOrLiBao(cardIds, this.rootCardBao);
    }

    // 显示里宝牌
    public showCardLiBao(cardIds: Array<string>) {
        this.showCardBaoOrLiBao(cardIds, this.rootCardLiBao);
    }

    // 显示宝牌或者里宝牌
    private showCardBaoOrLiBao(cardIds: Array<string>, parent: Node) {

        // 删除之前的
        var c = parent.children;
        for (var i = c.length - 1; i >= 0; --i) {
            c[i].destroy();
        } // end for
        console.log("宝牌：", parent.children, "len:", cardIds.length);
        for (var i = 0; i < cardIds.length; ++i) {
            var card = CardFactory.create2d(cardIds[i]);
            card.presentation2d.root.setParent(parent);
            card.presentation2d.root.position = new Vec3(i * this.pfCardSize2.width);
            card.presentation2d.root.getComponent(UITransform).contentSize = this.pfCardSize2;
        } // end for

    }

    // 设置赢的类型。1 自摸 2 荣和
    public setWinFlag(n: number) {

        if (n == 1) {
            this.winZiMo.active = true;
            this.winRongHe.active = false;
        } else if (n == 2) {
            this.winZiMo.active = false;
            this.winRongHe.active = true;
        }

    }

    // 设置番布局模式 1：多条目模式 ， 2：8条目模式
    public setLayoutMode(val: number) {

        if (val == 1) {
            this.tongJiRoot.position = new Vec3(-307.659, 41.66, 0);

            this.fanLayout1.active = true;
            this.fanLayout2.active = false;

            return;
        }

        this.tongJiRoot.position = new Vec3(61.048, 61.048, 0);

        this.fanLayout1.active = false;
        this.fanLayout2.active = true;

    }

    // 添加番条目
    public addFan(name: string, n: number, mShowType: protocol.mahjong_jp.SHOW_TYPE) {

        let layout = this.fanLayout1.active == true ? this.fanLayout1 : this.fanLayout2;
        let root = layout.getChildByPath("Fan");

        let mFanNode = instantiate(this.pfFanItem);
        // mFanNode.active = true ;
        mFanNode.getChildByPath("Name").getComponent(Label).string = name;
        // score==0,只显示役种名称，不显示番数
        // if(n==0){
        // 改为根据showType来决定是否显示番数 ,
        if (mShowType == protocol.mahjong_jp.SHOW_TYPE.SHOW_YIMAN ||
            mShowType == protocol.mahjong_jp.SHOW_TYPE.SHOW_ER_YIMAN ||
            mShowType == protocol.mahjong_jp.SHOW_TYPE.SHOW_SAN_YIMAN ||
            mShowType == protocol.mahjong_jp.SHOW_TYPE.SHOW_SI_YIMAN ||
            mShowType == protocol.mahjong_jp.SHOW_TYPE.SHOW_WU_YIMAN ||
            mShowType == protocol.mahjong_jp.SHOW_TYPE.SHOW_LIU_YIMAN ||
            mShowType == protocol.mahjong_jp.SHOW_TYPE.SHOW_LIUJU_MANGUAN) {
            mFanNode.getChildByPath("val").active = false;
            mFanNode.getChildByPath("fan").active = false;
            mFanNode.getChildByPath("bg").active = false;
            if (mShowType == protocol.mahjong_jp.SHOW_TYPE.SHOW_LIUJU_MANGUAN) {
                mFanNode.getChildByPath("ljmgbg").active = true;
                mFanNode.getChildByPath("yimbg").active = false;
            } else {
                mFanNode.getChildByPath("yimbg").active = true;
                mFanNode.getChildByPath("ljmgbg").active = false;
            }
            mFanNode.getChildByPath("Name").setPosition(new Vec3(-56, 20, 0));
        } else {
            mFanNode.getChildByPath("val").active = true;
            mFanNode.getChildByPath("val").getComponent(Label).string = n.toString();
            mFanNode.getChildByPath("fan").active = true;
            mFanNode.getChildByPath("bg").active = true;
            mFanNode.getChildByPath("ljmgbg").active = false;
            mFanNode.getChildByPath("yimbg").active = false;
            mFanNode.getChildByPath("Name").setPosition(new Vec3(-113, 20, 0));
        }
        mFanNode.setParent(root);
    }

    // 还未调用
    public showFanItemAnim(): void {
        let layout = this.fanLayout1.active == true ? this.fanLayout1 : this.fanLayout2;
        let root = layout.getChildByPath("Fan");
        let mChildren = root.children.length;
        Tween.stopAllByTarget(this);

        let mInd = 0;
        let mRepeatTween = tween(this).delay(0.5)
            .call(() => {
                if (root.children[mInd]) {
                    root.children[mInd].active = true;
                    mInd++;
                }
            });
        tween(this).repeat(mChildren, mRepeatTween).start();
    }

    private _showFanItem(mNDCont: Node[], mInd: number, mAll: number): void {
        mNDCont[mInd].active = true;
        if (mInd + 1 >= mAll) {
            return;
        } else {
            this._showFanItem(mNDCont, mInd + 1, mAll)
        }
    }

    // 清除番条目
    public clearFan() {
        this.fanLayout1.getChildByPath("Fan").removeAllChildren();
        this.fanLayout2.getChildByPath("Fan").removeAllChildren();

    }

    // 新添加规则：
    // 流局满贯只显示(番的名字)的地方
    // 如果是役满，2-6倍役满，显示（番的名字），（统计役满）的地方，其中（统计役满）显示为役满
    // 如果是累计役满，和其他情况，则显示（番的名字），（番的数量），（总番数）的地方，是多少就是多少

    // 显示役满类型 2-6倍役满，役满，流局满贯都不显示中间番数，其他正常显示
    public showYiManType(mYimanType: protocol.mahjong_jp.SHOW_TYPE): void {
        console.log("=役满type：", mYimanType);
        this.yimanND.active = false;
        this.yimanNumND.active = false;
        this.tongJiYiMan.active = false;
        switch (mYimanType) {
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_UNKNOW_TYPE:
                this.yimanND.active = false;
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_YIMAN:
                this.tongJiRoot.active = false;
                this.yimanND.active = true;
                CommUtils.loadSprite(this.yimanND.getComponent(Sprite), "ui/yiman/yman");
                this.tongJiYiMan.active = true;
                CommUtils.loadSprite(this.tongJiYiMan.getComponent(Sprite), "ui/yiman/tjyman");
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_LEIJIYIMAN:
                this.yimanND.active = true;
                CommUtils.loadSprite(this.yimanND.getComponent(Sprite), "ui/yiman/leijiyiman");
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_ER_YIMAN:
                this.tongJiRoot.active = false;
                this.yimanND.active = true;
                CommUtils.loadSprite(this.yimanND.getComponent(Sprite), "ui/yiman/beiyman");
                this.yimanNumND.active = true;
                CommUtils.loadSprite(this.yimanNumND.getComponent(Sprite), "ui/yiman/shuzi2");

                this.tongJiYiMan.active = true;
                CommUtils.loadSprite(this.tongJiYiMan.getComponent(Sprite), "ui/yiman/tjyman");
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_SAN_YIMAN:
                this.tongJiRoot.active = false;
                this.yimanND.active = true;
                CommUtils.loadSprite(this.yimanND.getComponent(Sprite), "ui/yiman/beiyman");
                this.yimanNumND.active = true;
                CommUtils.loadSprite(this.yimanNumND.getComponent(Sprite), "ui/yiman/shuzi3");

                this.tongJiYiMan.active = true;
                CommUtils.loadSprite(this.tongJiYiMan.getComponent(Sprite), "ui/yiman/tjyman");
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_SI_YIMAN:
                this.tongJiRoot.active = false;
                this.yimanND.active = true;
                CommUtils.loadSprite(this.yimanND.getComponent(Sprite), "ui/yiman/beiyman");
                this.yimanNumND.active = true;
                CommUtils.loadSprite(this.yimanNumND.getComponent(Sprite), "ui/yiman/shuzi4");

                this.tongJiYiMan.active = true;
                CommUtils.loadSprite(this.tongJiYiMan.getComponent(Sprite), "ui/yiman/tjyman");
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_WU_YIMAN:
                this.tongJiRoot.active = false;
                this.yimanND.active = true;
                CommUtils.loadSprite(this.yimanND.getComponent(Sprite), "ui/yiman/beiyman");
                this.yimanNumND.active = true;
                CommUtils.loadSprite(this.yimanNumND.getComponent(Sprite), "ui/yiman/shuzi5");

                this.tongJiYiMan.active = true;
                CommUtils.loadSprite(this.tongJiYiMan.getComponent(Sprite), "ui/yiman/tjyman");
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_LIU_YIMAN:
                this.tongJiRoot.active = false;
                this.yimanND.active = true;
                CommUtils.loadSprite(this.yimanND.getComponent(Sprite), "ui/yiman/beiyman");
                this.yimanNumND.active = true;
                CommUtils.loadSprite(this.yimanNumND.getComponent(Sprite), "ui/yiman/shuzi6");

                this.tongJiYiMan.active = true;
                CommUtils.loadSprite(this.tongJiYiMan.getComponent(Sprite), "ui/yiman/tjyman");
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_BEIMAN:
                this.yimanND.active = true;
                CommUtils.loadSprite(this.yimanND.getComponent(Sprite), "ui/yiman/beiman");
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_MANGUAN:
                this.yimanND.active = true;
                CommUtils.loadSprite(this.yimanND.getComponent(Sprite), "ui/yiman/manguan");
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_TIAOMAN:
                this.yimanND.active = true;
                CommUtils.loadSprite(this.yimanND.getComponent(Sprite), "ui/yiman/tman");
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_SAN_BEIMAN:
                this.yimanND.active = true;
                CommUtils.loadSprite(this.yimanND.getComponent(Sprite), "ui/yiman/beiman");
                this.yimanNumND.active = true;
                CommUtils.loadSprite(this.yimanNumND.getComponent(Sprite), "ui/yiman/shuzi3");
                break;
            case protocol.mahjong_jp.SHOW_TYPE.SHOW_LIUJU_MANGUAN:
                this.tongJiRoot.active = false;
                this.yimanND.active = true;
                CommUtils.loadSprite(this.yimanND.getComponent(Sprite), "ui/yiman/ljmg");
                break;
        }

    }

    private pfCardSize: Size;
    private pfCardSize2: Size;
}



