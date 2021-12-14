import useFrame from '@/composables/useFrame';
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

    const audioForFrame = useFrame().getAudioForFrame(activeStoryData.frames[currentFrameIndex]);
    if (audioForFrame.includes('download')) {
      audio = new Audio(audioForFrame);
    }
    return audio;
  };

  return {
    DoEvent,
    setAudioTrack,
  };
};

export default AudioHelper;
