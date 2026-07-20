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

import {Node, AudioSource, AudioClip, resources, director} from 'cc';
import {AudioCache} from '../cache/AudioCache';
import {SettingsDataPresist} from '../../Mahjong/World/Support/SettingsDataPresist';
import {SoundEffect, SoundMusic} from '../../Mahjong/World/Support/Audio';

/**
 * @en
 * this is a sington class for audio play, can be easily called from anywhere in you project.
 * @zh
 * 这是一个用于播放音频的单件类，可以很方便地在项目的任何地方调用。
 */
export class AudioMgr {
    private static _inst: AudioMgr;
    public static get inst(): AudioMgr {
        if (this._inst == null) {
            this._inst = new AudioMgr();
        }
        return this._inst;
    }

    private _audioSource: AudioSource;

    constructor() {
        //@en create a node as audioMgr
        //@zh 创建一个节点作为 audioMgr
        let audioMgr = new Node();
        audioMgr.name = '__audioMgr__';

        //@en add to the scene.
        //@zh 添加节点到场景
        director.getScene().addChild(audioMgr);

        //@en make it as a persistent node, so it won't be destroied when scene change.
        //@zh 标记为常驻节点，这样场景切换的时候就不会被销毁了
        director.addPersistRootNode(audioMgr);

        //@en add AudioSource componrnt to play audios.
        //@zh 添加 AudioSource 组件，用于播放音频。
        this._audioSource = audioMgr.addComponent(AudioSource);

        SettingsDataPresist.load();
    }

    public get audioSource() {
        return this._audioSource;
    }

    /**
     * @en
     * play short audio, such as strikes,explosions
     * @zh
     * 播放短音频,比如 打击音效，爆炸音效等
     * @param sound clip or url for the audio
     * @param volume
     */
    playOneShot(sound: AudioClip | string, volume: number = SoundEffect.volume) {
        if (SoundEffect.enabled == false) {
            return;
        }
        // 读缓存
        if (typeof sound == 'string') {
            sound = AudioCache.getPrefab(sound.split('/').pop()) || sound;
        }
        if (sound instanceof AudioClip) {
            this._audioSource.playOneShot(sound, volume);
        } else {
            resources.load(sound, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err);
                } else {
                    this._audioSource.playOneShot(clip, volume);
                }
            });
        }
    }

    /**
     * @en
     * play long audio, such as the bg music
     * @zh
     * 播放长音频，比如 背景音乐
     * @param sound clip or url for the sound
     * @param volume
     */
    play(sound: AudioClip | string, loop: boolean = false, volume: number = SoundMusic.volume) {
        if (SoundMusic.enabled == false) {
            return;
        }
        // 读缓存
        if (typeof sound == 'string') {
            sound = AudioCache.getPrefab(sound.split('/').pop()) || sound;
        }
        if (sound instanceof AudioClip) {
            this._audioSource.clip = sound;
            this._audioSource.loop = loop;
            this._audioSource.play();
            this.audioSource.volume = volume;
        } else {
            resources.load(sound, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err);
                } else {
                    this._audioSource.clip = clip;
                    this._audioSource.loop = loop;
                    this._audioSource.play();
                    this.audioSource.volume = volume;
                }
            });
        }
    }

    /**
     * stop the audio play
     */
    stop() {
        this._audioSource.stop();
    }

    /**
     * pause the audio play
     */
    pause() {
        this._audioSource.pause();
    }

    /**
     * resume the audio play
     */
    resume() {
        this._audioSource.play();
    }

    /* 暂按播放并移除资源 */
    remove() {
        this._audioSource.stop();
        this._audioSource.clip = null;
    }
}