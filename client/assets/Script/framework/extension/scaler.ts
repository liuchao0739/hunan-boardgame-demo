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

import {Component, Enum, Node, NodeEventType, UITransform, _decorator} from 'cc';

const {ccclass, executeInEditMode, menu, property} = _decorator;

/**
 * 缩放条件
 */
export enum EScaleCondition {
    /**
     * 随时生效
     */
    ALWAYS,
    /**
     * 小于目标节点
     */
    SMALLER_THAN_TARGET,
    /**
     * 大于目标节点
     */
    LARGER_THAN_TARGET,
};
Enum(EScaleCondition);

/**
 * 缩放策略
 */
export enum EScalePolicy {
    /**
     * 保持在目标区域内且至少有一个方向完全填充，纵横的缩放比例相同，另一方向上可能无法完全填充
     */
    SHOW_ALL,
    /**
     * 完全填充目标区域，纵横的缩放比例相同，可能有部分内容超出目标区域
     */
    NO_BORDER,
    /**
     * 在横向上填充目标区域，纵横的缩放比例相同，在纵向上可能无法完全填充或有部分内容超出
     */
    FIXED_WIDTH,
    /**
     * 在纵向上填充目标区域，纵横的缩放比例相同，在横向上可能无法完全填充或有部分内容超出
     */
    FIXED_HEIGHT,
    /**
     * 完全填充目标区域，所有内容均在目标区域内，纵横的缩放比例可能不同
     */
    EXACT_FIT,
};
Enum(EScalePolicy);

// 辅助函数
const IS_UNEQUAL = (num1: number, num2: number) => num1 !== num2;
const IS_LESS = (num1: number, num2: number) => num1 < num2;
const IS_GREATER = (num1: number, num2: number) => num1 > num2;

/**
 * 缩放器组件，以指定的目标节点或父节点的尺寸为基准，根据指定的缩放条件和策略自动进行缩放。
 */
@ccclass('Scaler')
@menu('Extension/Scaler')
@executeInEditMode
export class Scaler extends Component {

    /* 目标节点 */
    @property({
        type: Node,
        tooltip: '指定一个基准目标，为空时使用父节点',
    })
    get target(): Node | null {
        return this._target;
    }

    set target(node: Node | null) {
        if (node !== this._target) {
            const preTargetNode = this._target ?? this.node.parent;
            if (preTargetNode && preTargetNode.isValid) {
                /* 移除旧的监听 */
                preTargetNode.off(NodeEventType.SIZE_CHANGED, this._updateScale, this);
            }
            const targetNode = node ?? this.node.parent;
            if (targetNode && targetNode.isValid) {
                /* 注册新的监听 */
                targetNode.on(NodeEventType.SIZE_CHANGED, this._updateScale, this);
            }

            this._target = node;
            this._updateScale();
        }
    }

    /* 缩放条件 */
    @property({
        type: EScaleCondition,
        tooltip: '指定缩放条件',
    })
    get scaleCondition(): EScaleCondition {
        return this._condition;
    }

    set scaleCondition(mode: EScaleCondition) {
        if (mode !== this._condition) {
            this._condition = mode;
            this._updateScale();
        }
    }

    /* 缩放策略 */
    @property({
        type: EScalePolicy,
        tooltip: '指定缩放策略',
    })
    get scalePolicy(): EScalePolicy {
        return this._policy;
    }

    set scalePolicy(mode: EScalePolicy) {
        if (mode !== this._policy) {
            this._policy = mode;
            this._updateScale();
        }
    }

    @property({
        tooltip: '指定水平边距',
    })
    get horizontalMargin(): number {
        return this._horizontalMargin;
    }

    set horizontalMargin(margin: number) {
        if (margin !== this._horizontalMargin) {
            this._horizontalMargin = margin;
            this._updateScale();
        }
    }

    @property({
        tooltip: '指定垂直边距',
    })
    get verticalMargin(): number {
        return this._verticalMargin;
    }

    set verticalMargin(margin: number) {
        if (margin !== this._verticalMargin) {
            this._verticalMargin = margin;
            this._updateScale();
        }
    }

    /* 目标节点 */
    @property({serializable: true})
    private _target: Node | null = null;
    /* 缩放条件 */
    @property({serializable: true})
    private _condition: EScaleCondition = EScaleCondition.ALWAYS;
    /* 缩放策略 */
    @property({serializable: true})
    private _policy: EScalePolicy = EScalePolicy.SHOW_ALL;
    /* 水平边距 */
    @property({serializable: true})
    private _horizontalMargin: number = 0;
    /* 垂直边距 */
    @property({serializable: true})
    private _verticalMargin: number = 0;

    onEnable(): void {
        super.onEnable?.();

        this.node.on(NodeEventType.SIZE_CHANGED, this._updateScale, this);
        this.node.on(NodeEventType.PARENT_CHANGED, this._onParentChange, this);

        const targetNode = this._target ?? this.node.parent;
        if (targetNode && targetNode.isValid) {
            targetNode.on(NodeEventType.SIZE_CHANGED, this._updateScale, this);
        }

        this._updateScale();
    }

    onDisable(): void {
        this.node.off(NodeEventType.SIZE_CHANGED, this._updateScale, this);
        this.node.off(NodeEventType.PARENT_CHANGED, this._onParentChange, this);

        const targetNode = this._target ?? this.node.parent;
        if (targetNode && targetNode.isValid) {
            targetNode.off(NodeEventType.SIZE_CHANGED, this._updateScale, this);
        }

        super.onDisable?.();
    }

    /**
     * 父节点变化
     * @param oldParent 旧的父节点
     */
    private _onParentChange(oldParent: Node): void {
        if (!this._target) {
            /* 移除旧的监听 */
            oldParent.off(NodeEventType.SIZE_CHANGED, this._updateScale, this);
            /* 注册新的监听 */
            if (this.node.parent) {
                this.node.parent.on(NodeEventType.SIZE_CHANGED, this._updateScale, this);
            }

            this._updateScale();
        }
    }

    /**
     * 更新缩放
     */
    private _updateScale(): void {
        /* 取消缩放 */
        this.node.setScale(1, 1);

        const targetNode = this._target ?? this.node.parent;
        if (!targetNode || !targetNode.isValid) {
            return;
        }

        const transform = this.getComponent(UITransform);
        const targetTransform = targetNode.getComponent(UITransform);
        if (transform && targetTransform) {
            let compareFunc = IS_UNEQUAL;
            if (this._condition === EScaleCondition.SMALLER_THAN_TARGET) {
                compareFunc = IS_LESS;
            } else if (this._condition === EScaleCondition.LARGER_THAN_TARGET) {
                compareFunc = IS_GREATER;
            }

            const size = transform.contentSize;
            const targetSize = targetTransform.contentSize;
            const targetWidth = targetSize.width - this._horizontalMargin * 2;
            const targetHeight = targetSize.height - this._verticalMargin * 2;

            switch (this._policy) {
                case EScalePolicy.SHOW_ALL:
                    if (compareFunc(size.width, targetWidth) || compareFunc(size.height, targetHeight)) {
                        const scale = Math.min(targetWidth / size.width, targetHeight / size.height);
                        this.node.setScale(scale, scale);
                    }
                    break;
                case EScalePolicy.NO_BORDER:
                    if (compareFunc(size.width, targetWidth) || compareFunc(size.height, targetHeight)) {
                        const scale = Math.max(targetWidth / size.width, targetHeight / size.height);
                        this.node.setScale(scale, scale);
                    }
                    break;
                case EScalePolicy.FIXED_WIDTH:
                    if (compareFunc(size.width, targetWidth)) {
                        const scale = targetWidth / size.width;
                        this.node.setScale(scale, scale);
                    }
                    break;
                case EScalePolicy.FIXED_HEIGHT:
                    if (compareFunc(size.height, targetHeight)) {
                        const scale = targetHeight / size.height;
                        this.node.setScale(scale, scale);
                    }
                    break;
                default:
                    if (compareFunc(size.width, targetWidth) || compareFunc(size.height, targetHeight)) {
                        this.node.setScale(targetWidth / size.width, targetHeight / size.height);
                    }
                    break;
            }
        }
    }

}
