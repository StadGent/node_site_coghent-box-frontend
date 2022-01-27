import useFrame from '@/composables/useFrame';
import { Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import Development from './defaults.development';

export type AudioHelperFunctions  = {
  DoEvent: (currentTime: number, eventTime: number) => boolean;
  setAudioTrack: (activeStoryData: Story, currentFrameIndex: number) => HTMLAudioElement;
};

const AudioHelper = (threeService: ThreeService): AudioHelperFunctions => {
  const DoEvent = (currentTime: number, eventTime: number) => {
    if(Development().showDevTimeLogs()){
      console.log(`current: ${currentTime}; event: ${eventTime}`);
    }
    return currentTime == eventTime || currentTime > eventTime ;
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
