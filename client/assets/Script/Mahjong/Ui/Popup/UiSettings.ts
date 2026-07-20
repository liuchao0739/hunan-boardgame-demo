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

import {Input, Node, Slider, Toggle} from "cc";
import {SoundEffect, SoundMusic} from "../../World/Support/Audio";
import {SettingsDataPresist} from "../../World/Support/SettingsDataPresist";
import {UiPopupHelper} from "../../../framework/utils/UiPopupHelper";

export class UiSettings {

    public static ins: UiSettings = null;

    public root: Node = null;

    public init(node: Node) {

        this.root = node.getChildByPath("Settings");
        this.root.active = false;
        this.root.getChildByPath("btnClose").on(Input.EventType.TOUCH_END, () => {
            this.root.active = false;
        });

        // 音乐
        this.music.init(this.root.getChildByPath("Music"));
        this.music.toggle.node.on('toggle', () => {
            SoundMusic.enabled = this.music.toggle.isChecked;
            SettingsDataPresist.save();
        }, this);
        this.music.slider.node.on("slide", () => {
            SoundMusic.volume = this.music.slider.progress * 2;
            SettingsDataPresist.save();
        });

        // 音效
        this.sound.init(this.root.getChildByPath("Sound"));
        this.sound.toggle.node.on('toggle', () => {
            SoundEffect.enabled = this.sound.toggle.isChecked;
            SettingsDataPresist.save();
        }, this);
        this.sound.slider.node.on("slide", () => {
            SoundEffect.volume = this.sound.slider.progress * 2;
            SettingsDataPresist.save();
        });

    }

    // 刷新显示
    public refresh() {

        this.sound.toggle.isChecked = SoundEffect.enabled;
        this.sound.slider.progress = SoundEffect.volume / 2;

        this.music.toggle.isChecked = SoundMusic.enabled;
        this.music.slider.progress = SoundMusic.volume / 2;
    }

    public show() {
        this.refresh();
        UiPopupHelper.show(this.root);
    }

    private music = new UiAudio();
    private sound = new UiAudio();

}

class UiAudio {

    public root: Node;
    public toggle: Toggle;
    public slider: Slider;

    public init(node: Node) {

        this.root = node;
        this.toggle = this.root.getComponentInChildren(Toggle);
        this.toggle.isChecked = true;

        this.slider = this.root.getComponentInChildren(Slider);
        this.slider.progress = 0.5;

    }

}

