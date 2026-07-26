import { changshaToArtId } from './ArtBg';
import { AudioBus } from './AudioBus';

export type VoiceDialect = 'mandarin' | 'dialect';

export type RoundVoice =
  | 'chi'
  | 'peng'
  | 'gang'
  | 'hu'
  | 'zimo'
  | 'dianpao';

const ROUND_CLIP: Record<RoundVoice, string> = {
  chi: 'Round_Chi_',
  peng: 'Round_Peng_',
  gang: 'Round_Gang_',
  hu: 'Round_Hu_',
  zimo: 'Round_ZiMo_',
  dianpao: 'Round_DianPao_',
};

/** 方言/普通话语音钩子：资源路径 sex_0_(普通话) / sex_1_(方言) */
class VoiceBusImpl {
  dialect: VoiceDialect = 'mandarin';
  enabled = true;

  private folder() {
    return this.dialect === 'dialect'
      ? 'weihai/table_res/1/audio/sex_1_'
      : 'weihai/table_res/1/audio/sex_0_';
  }

  playRound(action: RoundVoice) {
    if (!this.enabled) return;
    const clip = ROUND_CLIP[action];
    if (!clip) return;
    void AudioBus.play(`${this.folder()}/${clip}`, 1);
  }

  /** 出牌报牌：MahjongVal_{artId}_ */
  playTile(tile: number) {
    if (!this.enabled) return;
    const artId = changshaToArtId(tile);
    if (artId <= 0) return;
    void AudioBus.play(`${this.folder()}/MahjongVal_${artId}_`, 1);
  }
}

export const VoiceBus = new VoiceBusImpl();
