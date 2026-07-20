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

import {AudioClip, AudioSource, Node} from "cc";
import {PrefabMgr} from "./Prefab";
import {WorldNode} from "./WorldNode";

export class SoundEffect {

    public static enabled: boolean = true;
    public static volume: number = 1;

    public static init() {

        this.data = new Map<string, AudioClip>();

        let root = PrefabMgr.root.getChildByPath("Audio");
        for (let i = 0; i < root.children.length; ++i) {
            let tmp = root.children[i];
            this.data.set(tmp.name, tmp.getComponent(AudioSource).clip);
        } // end for

        let node = new Node("Audio");
        this.audioSource = node.addComponent(AudioSource);
        node.setParent(WorldNode.ins.root);
    }

    // 按钮点击
    public static buttonClick() {
        if (this.enabled == false) return;
        this.audioSource.playOneShot(this.data.get("BtnClick"), this.volume);
    }

    public static cardClick() {
        if (this.enabled == false) return;
        this.audioSource.playOneShot(this.data.get("CardClick"), this.volume);
    }

    public static discard() {
        if (this.enabled == false) return;
        this.audioSource.playOneShot(this.data.get("Discard"), this.volume);
    }

    public static chi() {
        if (this.enabled == false) return;
        this.audioSource.playOneShot(this.data.get("Chi"), this.volume);
    }

    public static peng() {
        if (this.enabled == false) return;
        this.audioSource.playOneShot(this.data.get("Peng"), this.volume);
    }

    public static gang() {
        if (this.enabled == false) return;
        this.audioSource.playOneShot(this.data.get("Gang"), this.volume);
    }

    public static riichi() {
        if (this.enabled == false) return;
        this.audioSource.playOneShot(this.data.get("Riichi"), this.volume);
    }

    public static rong() {
        if (this.enabled == false) return;
        this.audioSource.playOneShot(this.data.get("Rong"), this.volume);
    }

    public static tsumo() {
        if (this.enabled == false) return;
        this.audioSource.playOneShot(this.data.get("Tsumo"), this.volume);
    }


    public static audioSource: AudioSource;
    public static data: Map<string, AudioClip>;

}

export class SoundMusic {

    public static set enabled(value: boolean) {
        console.log("=======music:", value, "audiosource:", this.audioSource)
        this._enabled = value;
        if (this.audioSource == null) return;
        if (value == true) {
            this.audioSource.play();
        } else {
            this.audioSource.stop();
            console.log("---false")
        }

    }

    public static get enabled(): boolean {
        return this._enabled;
    }

    public static _enabled: boolean = true;

    public static set volume(value: number) {
        this._volume = value;
        if (this.audioSource != null) {
            this.audioSource.volume = this.volume;
        }
    }

    public static get volume(): number {
        return this._volume;
    }

    private static _volume = 1;

    public static init() {
        let root = PrefabMgr.root.getChildByPath("Audio/Bg001");
        let node = new Node("Music");
        this.audioSource = node.addComponent(AudioSource);
        node.setParent(WorldNode.ins.root);
        this.audioSource.clip = root.getComponent(AudioSource).clip;
    }

    public static play() {
        if (this.enabled == false) return;
        this.audioSource.volume = this.volume;
        this.audioSource.play();
        console.log("--play")
    }

    public static stop() {
        this.audioSource.stop();
        console.log("--------stop")
    }

    public static audioSource: AudioSource;
    public static data: Map<string, AudioClip>;

}