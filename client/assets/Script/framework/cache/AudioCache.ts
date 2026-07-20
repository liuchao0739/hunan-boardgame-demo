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

import {AudioClip} from "cc";

export class AudioCache {
    public static audioMap: Map<string, AudioClip> = null;

    public static init() {
        if (!this.audioMap) {
            this.audioMap = new Map<string, AudioClip>();
        }
    }

    public static mapAudio(assetArr: AudioClip[]) {
        if (assetArr) {
            for (let mi = 0; mi < assetArr.length; mi++) {
                this.audioMap.set(assetArr[mi].name, assetArr[mi]);
            }
        }
    }

    //
    /**
     * 获取Prefab资源
     * @param name Prefab名称
     * @returns 对应的Prefab资源
     */
    public static getPrefab(name: string): AudioClip {
        let mResPref: AudioClip = null;
        mResPref = this.audioMap?.get(name);
        return mResPref;
    }
}

