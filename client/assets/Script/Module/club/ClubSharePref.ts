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

import {_decorator, Button, Camera, EditBox, Label, native, Node, sys} from 'cc';
import {ClubEntity} from '../../Home/Entity/ClubEntity';
import {LoginEnity} from '../../Home/Entity/Login';
import {ToastUI} from '../../Home/Ui/ToastUI';
import {PlainHTTPEventManager} from '../../framework/event/event-management';
import {eSysId, ViewMgr} from '../../framework/mgr/ViewMgr';
import {PlainHTTPManager} from '../../framework/network/http';
import {IPlainHTTPArguments} from '../../framework/network/plain-http-configs';
import {BaseView} from '../../framework/ui/BaseView';
import {TimeUtils} from '../../framework/utils/time-utils';
import {MediaUtils} from '../../native/media';
import {App} from '../App';
import {AppVar} from '../AppVar';
import {QRCode} from '../UICommpont/qrcode';

const {ccclass, property} = _decorator;

@ccclass('ClubSharePref')
export class ClubSharePref extends BaseView {

    private declare _backButtonNode: Node;
    private declare _ruleButtonNode: Node;
    private declare _copyCodeButtonNode: Node;
    private declare _bindButtonNode: Node;
    private declare _listButtonNode: Node;
    private declare _claimButtonNode: Node;
    private declare _saveButtonNode: Node;
    private declare _copyLinkButtonNode: Node;

    private declare _promoCodeLabel: Label;
    private declare _promotionLabel: Label;
    private declare _bonusLabel: Label;

    private declare _referenceEditBox: EditBox;

    private declare _shareQRCode: QRCode;

    private declare _captureCamera: Camera;

    constructor() {
        super();
        this.skinName = `prefab/club/ClubSharePref`;
    }

    public initUI(): void {
        this._backButtonNode = this.root.getChildByPath('Root/NavigationBar/BackButton');
        this._ruleButtonNode = this.root.getChildByPath('Root/MainBody/RuleButton');
        this._copyCodeButtonNode = this.root.getChildByPath('Root/MainBody/CopyCodeButton');
        this._bindButtonNode = this.root.getChildByPath('Root/MainBody/BindButton');
        this._listButtonNode = this.root.getChildByPath('Root/MainBody/ListButton');
        this._claimButtonNode = this.root.getChildByPath('Root/MainBody/ClaimButton');
        this._saveButtonNode = this.root.getChildByPath('Root/MainBody/SaveButton');
        this._copyLinkButtonNode = this.root.getChildByPath('Root/MainBody/CopyLinkButton');

        this._promoCodeLabel = this.root.getChildByPath('Root/MainBody/PromoCodeSprite/PromoCodeLabel').getComponent(Label);
        this._promotionLabel = this.root.getChildByPath('Root/MainBody/PromotionLabel').getComponent(Label);
        this._bonusLabel = this.root.getChildByPath('Root/MainBody/BonusLabel').getComponent(Label);

        this._referenceEditBox = this.root.getChildByPath('Root/MainBody/ReferenceSprite/ReferenceEditBox').getComponent(EditBox);

        this._shareQRCode = this.root.getChildByPath('Root/MainBody/QRCode').getComponent(QRCode);

        this._captureCamera = this.root.getChildByPath('Root/MainBody/QRCode/Camera').getComponent(Camera);

        this._backButtonNode.on(Button.EventType.CLICK, this._onBackButtonClick, this);
        this._ruleButtonNode.on(Button.EventType.CLICK, this._onRuleButtonClick, this);
        this._copyCodeButtonNode.on(Button.EventType.CLICK, this._onCopyCodeButtonClick, this);
        this._bindButtonNode.on(Button.EventType.CLICK, this._onBindButtonClick, this);
        this._listButtonNode.on(Button.EventType.CLICK, this._onListButtonClick, this);
        this._claimButtonNode.on(Button.EventType.CLICK, this._onClaimButtonClick, this);
        this._saveButtonNode.on(Button.EventType.CLICK, this._onSaveButtonClick, this);
        this._copyLinkButtonNode.on(Button.EventType.CLICK, this._onCopyLinkButtonClick, this);

        this._copyCodeButtonNode.active = false;
        this._bindButtonNode.active = false;
        this._listButtonNode.active = false;
        this._claimButtonNode.active = false;
        this._saveButtonNode.active = false;
        this._copyLinkButtonNode.active = false;

        this._promoCodeLabel.string = '';
        this._promotionLabel.string = '-';
        this._bonusLabel.string = '-';

        this._referenceEditBox.node.active = false;

        this._shareQRCode.content = '';
    }

    public open(...params: any[]): void {
        PlainHTTPEventManager.on('promotionInfo', this._onPromotionInfoRespond, this);
        PlainHTTPEventManager.on('promotionBind', this._onPromotionBindRespond, this);
        PlainHTTPEventManager.on('promotionClaim', this._onPromotionClaimRespond, this);

        PlainHTTPManager.load('promotionInfo', {
            user_id: LoginEnity.playerID,
            club_id: ClubEntity.recentClubID,
        });
    }

    protected _beforeClose(): void {
        PlainHTTPEventManager.off('promotionInfo', this._onPromotionInfoRespond, this);
        PlainHTTPEventManager.off('promotionBind', this._onPromotionBindRespond, this);
        PlainHTTPEventManager.off('promotionClaim', this._onPromotionClaimRespond, this);
    }

    private _updateWithData(response: IPlainHTTPArguments.IPromotionInfoResponse): void {
        const data = response?.data;
        if (data === null || data === undefined) {
            return;
        }

        this._promoCodeLabel.string = data.promotion_code;

        this._referenceEditBox.node.active = true;
        if (data.p_id <= 0) {
            this._referenceEditBox.string = '';
            this._bindButtonNode.active = true;
        } else {
            this._referenceEditBox.string = data.p_name ?? '';
            this._referenceEditBox.enabled = false;
            this._bindButtonNode.active = false;
        }

        this._promotionLabel.string = `${data.promotion_total}人（${data.range}%）`

        const bonusString = (data.coins ?? '0').toString();
        const bonus = Number.parseFloat(bonusString);
        if (isNaN(bonus) || bonus < 0.01) {
            this._bonusLabel.string = '0';
            this._claimButtonNode.active = false;
        } else {
            const dotIndex = bonusString.lastIndexOf('.');
            if (dotIndex < 0) {
                this._bonusLabel.string = bonusString;
            } else {
                this._bonusLabel.string = bonusString.substring(0, dotIndex + 3);
            }
            this._claimButtonNode.active = true;
        }

        this._shareQRCode.content = AppVar.isRelease ? `http://share.qipaiplay.com/?rcode=${data.promotion_code}` : `http://devshare.qipaiplay.com/?rcode=${data.promotion_code}`;

        this._copyCodeButtonNode.active = true;
        this._listButtonNode.active = true;
        this._saveButtonNode.active = true;
        this._copyLinkButtonNode.active = true;
    }

    private _onBackButtonClick(): void {
        this.closeSelf();
    }

    private _onRuleButtonClick(): void {
        App.getInst(ViewMgr).open(eSysId.ClubShareRulePref);
    }

    private _onCopyCodeButtonClick(): void {
        const promotionCode = this._promoCodeLabel.string;
        if (!promotionCode.match(/^[0-9]{8}$/)) {
            App.getInst(ToastUI).showTips("未找到有效的推广码");
            return;
        }

        if (!sys.isNative) {
            return;
        }

        native.copyTextToClipboard(promotionCode);

        App.getInst(ToastUI).showTips("复制成功");
    }

    private _onBindButtonClick(): void {
        const referenceCode = this._referenceEditBox.string;
        if (!referenceCode.match(/^[0-9]{8}$/)) {
            App.getInst(ToastUI).showTips("请输入正确的8位数字推广码");
            return;
        }

        PlainHTTPManager.load('promotionBind', {
            user_id: LoginEnity.playerID,
            club_id: ClubEntity.recentClubID,
            promotion_code: referenceCode,
        });
    }

    private _onListButtonClick(): void {
        App.getInst(ViewMgr).open(eSysId.ClubShareListPref);
    }

    private _onClaimButtonClick(): void {
        PlainHTTPManager.load('promotionClaim', {
            user_id: LoginEnity.playerID,
            club_id: ClubEntity.recentClubID,
            collection_time: TimeUtils.getServerTime(),
        });
    }

    private _onSaveButtonClick(): void {
        if (!this._shareQRCode.rendered) {
            App.getInst(ToastUI).showTips("二维码加载中");
            return;
        }

        if (!sys.isNative) {
            return;
        }

        const imageData = this._captureCamera.targetTexture.readPixels(0, 0, 250, 250);
        const targetImageData = new Uint8Array(imageData.length);
        const factor = imageData.length / 250 / 250;

        if (sys.os === sys.OS.ANDROID) {
            for (let index = 0; index < 250; ++index) {
                const rowNumber = 249 - index;
                targetImageData.set(imageData.slice(rowNumber * 250 * factor, (rowNumber + 1) * 250 * factor), index * 250 * factor);
            }
        } else {
            for (let index = 0; index < 250; ++index) {
                targetImageData.set(imageData.slice(index * 250 * factor, (index + 1) * 250 * factor), index * 250 * factor);
            }
        }

        const savePath = `${native.fileUtils.getWritablePath()}share_qrcode.png`;

        native.saveImageData(targetImageData, 250, 250, savePath)
            .then(() => MediaUtils.saveImageToPhotoAlbum(savePath, success => {
                if (success) {
                    App.getInst(ToastUI).showTips("二维码已保存");
                } else {
                    App.getInst(ToastUI).showTips("二维码保存失败");
                }
            }))
            .catch(reason => {
                console.error(`saving share qrcode failed: ${reason?.toString() ?? 'unknown reason'}`);
                App.getInst(ToastUI).showTips("二维码保存失败");
            });
    }

    private _onCopyLinkButtonClick(): void {
        const promotionCode = this._promoCodeLabel.string;
        if (!promotionCode.match(/^[0-9]{8}$/)) {
            App.getInst(ToastUI).showTips("未找到有效的推广码");
            return;
        }

        if (!sys.isNative) {
            return;
        }

        const link = AppVar.isRelease ? `http://share.qipaiplay.com/?rcode=${promotionCode}` : `http://devshare.qipaiplay.com/?rcode=${promotionCode}`;
        native.copyTextToClipboard(`加入口袋麻将享受轻松愉快的日麻斗牌体验吧，口袋麻将为您提供公平、可靠的日麻竞技平台。下载链接：${link}`);

        App.getInst(ToastUI).showTips("复制成功");
    }

    private _onPromotionInfoRespond(event: PlainHTTPEventManager.IPlainHTTPEvent<'promotionInfo'>): void {
        if (!event.success || event.response?.code !== 1) {
            App.getInst(ToastUI).showTips("请求推广信息失败");
            return;
        }

        const response = event.response?.data;
        if (!response) {
            App.getInst(ToastUI).showTips("请求推广信息失败");
            return;
        }

        this._updateWithData(event.response);
    }

    private _onPromotionBindRespond(event: PlainHTTPEventManager.IPlainHTTPEvent<'promotionBind'>): void {
        if (!event.success || event.response?.code !== 1) {
            App.getInst(ToastUI).showTips("绑定失败");
            return;
        }

        App.getInst(ToastUI).showTips("绑定成功");

        this._updateWithData(event.response);
    }

    private _onPromotionClaimRespond(event: PlainHTTPEventManager.IPlainHTTPEvent<'promotionClaim'>): void {
        if (!event.success || event.response?.code !== 1) {
            App.getInst(ToastUI).showTips("金币领取失败");
            return;
        }

        App.getInst(ToastUI).showTips("金币领取成功");

        PlainHTTPManager.load('promotionInfo', {
            user_id: LoginEnity.playerID,
            club_id: ClubEntity.recentClubID,
        });
    }

}
