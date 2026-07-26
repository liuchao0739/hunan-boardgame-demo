import { Node, AudioSource, AudioClip, resources } from 'cc';

/** 牌桌音效总线：封装 AudioSource，缓存 AudioClip */
class AudioBusImpl {
  private root: Node | null = null;
  private sfx: AudioSource | null = null;
  private cache = new Map<string, AudioClip>();
  enabled = true;
  volume = 1;

  ensure(host: Node) {
    if (this.root?.isValid) return;
    this.root = new Node('__AudioBus');
    host.addChild(this.root);
    this.sfx = this.root.addComponent(AudioSource);
    this.sfx.loop = false;
    this.sfx.playOnAwake = false;
    this.sfx.volume = this.volume;
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.sfx) this.sfx.volume = this.volume;
  }

  private loadClip(path: string): Promise<AudioClip | null> {
    if (this.cache.has(path)) return Promise.resolve(this.cache.get(path)!);
    return new Promise((resolve) => {
      resources.load(path, AudioClip, (err, clip) => {
        if (err || !clip) {
          console.warn('[AudioBus] load fail', path, err);
          resolve(null);
          return;
        }
        this.cache.set(path, clip);
        resolve(clip);
      });
    });
  }

  async play(path: string, vol = 1) {
    if (!this.enabled || !this.sfx?.isValid) return;
    const clip = await this.loadClip(path);
    if (!clip || !this.sfx.isValid) return;
    this.sfx.stop();
    this.sfx.clip = clip;
    this.sfx.volume = this.volume * vol;
    this.sfx.play();
  }

  playButton() {
    void this.play('weihai/table_res/1/audio/ButtonClicked_0_', 0.85);
  }

  playDiscard() {
    void this.play('weihai/table_res/1/audio/ChuPai', 0.9);
  }

  playHu() {
    void this.play('weihai/table_res/1/audio/sex_0_/Round_Hu_', 1);
  }
}

export const AudioBus = new AudioBusImpl();
