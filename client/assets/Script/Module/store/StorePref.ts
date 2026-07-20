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

import {_decorator, Button, instantiate, Label, Layout, Node, sys, Toggle, ToggleContainer, UITransform} from "cc";
import {LoginEnity} from "../../Home/Entity/Login";
import {ToastUI} from "../../Home/Ui/ToastUI";
import {ProductTableTemplate} from "../../data/templates/product-table-data";
import {PrefabCache} from "../../framework/cache/PrefabCache";
import {ProtocolEventManager} from "../../framework/event/event-management";
import {eSysId, ViewMgr} from "../../framework/mgr/ViewMgr";
import {IProductPrice} from "../../framework/native/native-event";
import {EProtocolID, protocol} from "../../framework/network/protocol-configs";
import {BaseView} from "../../framework/ui/BaseView";
import {CallBack} from "../../framework/utils/CallBack";
import {inAppPurchase} from "../../native/in-app-purchase";
import {App} from "../App";
import {EStoreType, ShopCtrl} from "./ShopCtrl";
import {StoreItemPref} from "./StoreItemPref";

const {ccclass, property} = _decorator;

const PURCHASE_TYPE = (sys.os === sys.OS.IOS ? protocol.shop.storeType.TYPE_APPLE : protocol.shop.storeType.TYPE_GOOGLE);
const PRODUCT_ID_FIELD_KEY = (sys.os === sys.OS.IOS ? 'appstoreId' : 'googlestoreId');

@ccclass("StorePref")
export class StorePref extends BaseView {

    private declare _backButtonNode: Node;
    private declare _titleLabel: Label;
    private declare _copperNumLabel: Label;
    private declare _magatamaNumLabel: Label;

    private declare _tabToggleContainer: ToggleContainer;
    private declare _copperTabToggle: Toggle;
    private declare _magatamaTabToggle: Toggle;

    private declare _copperItemsScrollViewNode: Node;
    private declare _copperItemsRootLayout: Layout;

    private declare _magatamaItemsScrollViewNode: Node;
    private declare _magatamaItemsRootLayout: Layout;

    private _storeType: EStoreType = EStoreType.COPPER;

    private _copperProductTemplates: Readonly<ProductTableTemplate.IProductTableData>[] | null = null;
    private _magatamaProductTemplates: Readonly<ProductTableTemplate.IProductTableData>[] | null = null;

    constructor() {
        super();
        this.skinName = `prefab/store/StorePref`;
    }

    public initUI(): void {
        this._backButtonNode = this.root.getChildByPath("sprTopBarBg/btnBack");
        this._titleLabel = this.root.getChildByPath("sprTopBarBg/sprTitleBg/lblTitle").getComponent(Label);
        this._copperNumLabel = this.root.getChildByPath("sprTopBarBg/sprCopperBg/lblCopperNum").getComponent(Label);
        this._magatamaNumLabel = this.root.getChildByPath("sprTopBarBg/sprMagatamaBg/lblMagatamaNum").getComponent(Label);

        this._tabToggleContainer = this.root.getChildByPath("sprTabBg/tgcTab").getComponent(ToggleContainer);
        this._copperTabToggle = this.root.getChildByPath("sprTabBg/tgcTab/tglCopperTab").getComponent(Toggle);
        this._magatamaTabToggle = this.root.getChildByPath("sprTabBg/tgcTab/tglMagatamaTab").getComponent(Toggle);

        this._copperItemsScrollViewNode = this.root.getChildByPath("sprContentBg/scvCopperItems");
        this._copperItemsRootLayout = this.root.getChildByPath("sprContentBg/scvCopperItems/view/nodCopperItemsRoot").getComponent(Layout);

        this._magatamaItemsScrollViewNode = this.root.getChildByPath("sprContentBg/scvMagatamaItems");
        this._magatamaItemsRootLayout = this.root.getChildByPath("sprContentBg/scvMagatamaItems/view/nodMagatamaItemsRoot").getComponent(Layout);

        this._backButtonNode.on(Button.EventType.CLICK, this._onBackButtonClick, this);

        this._tabToggleContainer.node.children.forEach(node => node.on(Toggle.EventType.TOGGLE, this._onTabToggleCheck, this));

        this._copperItemsRootLayout.node.parent.on(Node.EventType.SIZE_CHANGED, this._onCopperItemsContainerSizeChange, this);
        this._magatamaItemsRootLayout.node.parent.on(Node.EventType.SIZE_CHANGED, this._onMagatamaItemsContainerSizeChange, this);
    }

    public open(storeType: EStoreType.COPPER | EStoreType.MAGATAMA = EStoreType.COPPER): void {
        ProtocolEventManager.on(EProtocolID.CLUB_GET_PLAYER_INFOR_REQ, this._onClubPlayerInforRespond, this);

        this._copperNumLabel.string = LoginEnity.tongbi.toString();
        this._magatamaNumLabel.string = LoginEnity.jade.toString();

        this._storeType = storeType;

        if (storeType === EStoreType.MAGATAMA) {
            this._tabToggleContainer.toggleItems[1].isChecked = true;
        } else {
            this._storeType = EStoreType.COPPER;
            this._tabToggleContainer.toggleItems[0].isChecked = true;
        }

        this._updateStore();
    }

    protected _beforeClose(): void {
        ProtocolEventManager.off(EProtocolID.CLUB_GET_PLAYER_INFOR_REQ, this._onClubPlayerInforRespond, this);
    }

    public onStoreItemClick(productTID: number): void {
        const template = ProductTableTemplate.query(productTID);

        switch (template.shopType) {
            case 1:
                const price = template.consumeditemNum ?? 0;
                if (LoginEnity.jade < price) {
                    App.getInst(ToastUI).showTips("勾玉不足");
                    return;
                }

                App.getInst(ViewMgr).open(eSysId.CommonDialog, [`确定使用${price}勾玉购买${template.rewardsNum ?? 0}铜币吗？`, new CallBack(() => {
                    App.getInst(ShopCtrl).pbCreateOrder(LoginEnity.playerID, protocol.shop.storeType.TYPE_GOUYU, productTID, 0);
                }, this), null, `购买铜币`]);

                break;

            case 2:
                if (!sys.isMobile || !sys.isNative) {
                    App.getInst(ToastUI).showTips("此设备暂不支持");
                    return;
                }

                App.getInst(ShopCtrl).pbCreateOrder(LoginEnity.playerID, PURCHASE_TYPE, productTID, 0);

                break;
        }
    }

    private _updateStore(): void {
        if (this._storeType === EStoreType.MAGATAMA) {
            this._titleLabel.string = "勾玉商城";

            if (this._magatamaProductTemplates === null || this._magatamaProductTemplates === undefined) {
                this._magatamaProductTemplates = [];

                const templates = ProductTableTemplate.datas();
                for (const productTID in templates) {
                    const template = templates[productTID];
                    if (template.shopType === 2) {
                        this._magatamaProductTemplates.push(template);
                    }
                }

                this._magatamaProductTemplates.sort((templateA, templateB) => {
                    return templateA.shopPlace - templateB.shopPlace;
                });

                this._magatamaItemsRootLayout.node.removeAllChildren();

                new Promise<{ [productID: string]: IProductPrice }>((resolve, reject) => {
                    if (!sys.isMobile || !sys.isNative) {
                        resolve({});
                        return;
                    }

                    const productIDs: string[] = [];

                    for (const template of this._magatamaProductTemplates) {
                        productIDs.push(template[PRODUCT_ID_FIELD_KEY]!);
                    }

                    inAppPurchase.query(productIDs, (success, products) => {
                        if (!this || !this.root || !this.root.isValid) {
                            reject();
                            return;
                        }

                        if (!success) {
                            App.getInst(ToastUI).showTips('Unable to load product information');
                            resolve({});
                            return;
                        }

                        resolve(products ?? {})
                    });
                })
                    .then(productsRecord => {
                        const prefab = PrefabCache.getPrefab("StoreItemPref");

                        this._magatamaProductTemplates.forEach(template => {
                            const price: IProductPrice | undefined = productsRecord[template[PRODUCT_ID_FIELD_KEY]];

                            if (sys.isMobile && sys.isNative && (price === null || price === undefined)) {
                                return;
                            }

                            const itemNode = instantiate(prefab);
                            this._magatamaItemsRootLayout.node.addChild(itemNode);

                            const storeItemComp = itemNode.getComponent(StoreItemPref);
                            storeItemComp.updateWithProductTID(template.productId, price?.displayPrice);
                            storeItemComp.delegate = this;
                        });

                        this._updateItemsLayout(EStoreType.MAGATAMA);
                    })
                    .catch(() => {
                    });
            }

            this._copperItemsScrollViewNode.active = false;
            this._magatamaItemsScrollViewNode.active = true;
        } else {
            this._titleLabel.string = "铜币商城";

            if (this._copperProductTemplates === null || this._copperProductTemplates === undefined) {
                this._copperProductTemplates = [];

                const templates = ProductTableTemplate.datas();
                for (const productTID in templates) {
                    const template = templates[productTID];
                    if (template.shopType === 1) {
                        this._copperProductTemplates.push(template);
                    }
                }

                this._copperProductTemplates.sort((templateA, templateB) => {
                    return templateA.shopPlace - templateB.shopPlace;
                });

                const prefab = PrefabCache.getPrefab("StoreItemPref");

                this._copperItemsRootLayout.node.removeAllChildren();

                this._copperProductTemplates.forEach(template => {
                    const itemNode = instantiate(prefab);
                    this._copperItemsRootLayout.node.addChild(itemNode);

                    const storeItemComp = itemNode.getComponent(StoreItemPref);
                    storeItemComp.updateWithProductTID(template.productId);
                    storeItemComp.delegate = this;
                });

                this._updateItemsLayout(EStoreType.COPPER);
            }

            this._copperItemsScrollViewNode.active = true;
            this._magatamaItemsScrollViewNode.active = false;
        }
    }

    private _updateItemsLayout(storeType: EStoreType.COPPER | EStoreType.MAGATAMA): void {
        const layout = storeType === EStoreType.MAGATAMA ? this._magatamaItemsRootLayout : this._copperItemsRootLayout;

        const containerContentSize = layout.node.parent.getComponent(UITransform)?.contentSize;
        const itemContentSize = layout.node.children[0]?.getComponent(UITransform)?.contentSize;

        if (containerContentSize && itemContentSize) {
            // Layout.Type.GRID + Layout.AxisDirection.HORIZONTAL 模式下水平方向需要强制设置尺寸
            const uiTransform = layout.getComponent(UITransform);
            uiTransform.setContentSize(containerContentSize.width, uiTransform.contentSize.height);

            let columnCount = Math.floor(containerContentSize.width / itemContentSize.width);
            let spacingX = Math.floor((containerContentSize.width - itemContentSize.width * columnCount) / (columnCount + 1));
            let marginX = (containerContentSize.width - itemContentSize.width * columnCount - spacingX * (columnCount - 1)) * 0.5;

            if (spacingX < 10) {
                --columnCount;
                spacingX = Math.floor((containerContentSize.width - itemContentSize.width * columnCount) / (columnCount + 1));
                marginX = (containerContentSize.width - itemContentSize.width * columnCount - spacingX * (columnCount - 1)) * 0.5;
            }

            layout.paddingLeft = marginX;
            layout.spacingX = spacingX;
        }
    }

    private _onBackButtonClick(button: Button): void {
        this.closeSelf();
    }

    private _onTabToggleCheck(): void {
        const toggleItems = this._tabToggleContainer.toggleItems;

        for (const toggle of toggleItems) {
            if (toggle.isChecked) {
                const preStoreType = this._storeType;

                if (toggle === this._magatamaTabToggle) {
                    this._storeType = EStoreType.MAGATAMA;
                } else {
                    this._storeType = EStoreType.COPPER;
                }

                if (this._storeType !== preStoreType) {
                    this._updateStore();
                }

                break;
            }
        }
    }

    private _onCopperItemsContainerSizeChange(): void {
        this._updateItemsLayout(EStoreType.COPPER);
    }

    private _onMagatamaItemsContainerSizeChange(): void {
        this._updateItemsLayout(EStoreType.MAGATAMA);
    }

    private _onClubPlayerInforRespond(event): void {
        if (event.success && event.data.res == "SUCCESS") {
            this._copperNumLabel.string = (LoginEnity.tongbi ?? 0).toString();
            this._magatamaNumLabel.string = (LoginEnity.jade ?? 0).toString();
        }

    }

}