import Common from '@/composables/common';
import { Story } from '@/models/GraphqlModel';

const AudioHelper = (): {
  DoEvent: (currentTime: number, eventTime: number) => boolean;
  setAudioTrack: (activeStoryData: Story, currentFrameIndex: number, backupAudioFile: string) => HTMLAudioElement;
} => {
  const DoEvent = (currentTime: number, eventTime: number) => {
    console.log(`current: ${currentTime}; event: ${eventTime}`);
    return currentTime < eventTime + 2 && currentTime > eventTime;
  };

  const setAudioTrack = (activeStoryData: Story, currentFrameIndex: number, backupAudioFile: string) => {
    let audio = new Audio(backupAudioFile);
    const relationMetadata = Common().connectRelationMetadata(
      activeStoryData,
      activeStoryData.frames[currentFrameIndex],
    );
    if (relationMetadata.audioFile) {
      audio = new Audio(relationMetadata.audioFile);
    }
    return audio
  };

  return {
    DoEvent,
    setAudioTrack,
  };
};

export default AudioHelper;
