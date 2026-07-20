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

import {_decorator, Component, director, ResolutionPolicy, screen, size, view} from 'cc';

const {ccclass, menu} = _decorator;

/**
 * 应用类，贯穿于应用的整个生命周期，在启动的第一时间加载并持久化，可用于执行初始化任务
 */
@ccclass('ResolutionAdapter')
@menu('UI/ResolutionAdapter')
export class ResolutionAdapter extends Component {

    onLoad(): void {
        director.addPersistRootNode(this.node);
        this._updateDesignResolutionSize();
    }

    onEnable(): void {
        super.onEnable?.();
        view.setResizeCallback(() => {
            this._updateDesignResolutionSize();
        });
    }

    onDisable(): void {
        view.setResizeCallback(null);
        super.onDisable?.();
    }

    /**
     * 更新适配策略
     */
    private _updateDesignResolutionSize(): void {
        const standardSize = size(1280, 720);
        const standardRatio = standardSize.width / standardSize.height;
        const windowSize = screen.windowSize;
        const windowRatio = windowSize.width / windowSize.height;
        if (windowRatio > standardRatio) {
            view.setDesignResolutionSize(standardSize.height * windowRatio, standardSize.height, ResolutionPolicy.FIXED_HEIGHT);
        } else {
            view.setDesignResolutionSize(standardSize.width, standardSize.width / windowRatio, ResolutionPolicy.FIXED_WIDTH);
        }
    }

}
