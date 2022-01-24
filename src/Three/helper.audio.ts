import useFrame from '@/composables/useFrame';
import { Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import Development from './defaults.development';

const AudioHelper = (threeService: ThreeService): {
  DoEvent: (currentTime: number, eventTime: number) => boolean;
  setAudioTrack: (activeStoryData: Story, currentFrameIndex: number) => HTMLAudioElement;
} => {
  const DoEvent = (currentTime: number, eventTime: number) => {
    if(Development().showDevTimeLogs()){
      console.log(`current: ${currentTime}; event: ${eventTime}`);
    }
    return currentTime < eventTime + 2 && currentTime > eventTime;
  };

  const setAudioTrack = (activeStoryData: Story, currentFrameIndex: number) => {
    const audioForFrame = useFrame(threeService).getAudioForFrame(activeStoryData.frames[currentFrameIndex]);
    return new Audio(audioForFrame);
  };

  return {
    DoEvent,
    setAudioTrack,
  };
};

export default AudioHelper;
