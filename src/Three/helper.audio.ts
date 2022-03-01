import useFrame from '@/composables/useFrame';
import { Frame, Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import { Entity } from 'coghent-vue-3-component-library/lib';
import Development from './defaults.development';

export type AudioHelperFunctions  = {
  DoEvent: (currentTime: number, eventTime: number) => boolean;
  setAudioTrack: (activeStory: Entity, currentFrameIndex: number) => HTMLAudioElement;
};

const AudioHelper = (threeService: ThreeService): AudioHelperFunctions => {
  const DoEvent = (currentTime: number, eventTime: number) => {
    if(Development().showDevTimeLogs()){
      console.log(`current: ${currentTime}; event: ${eventTime}`);
    }
    return currentTime == eventTime || currentTime > eventTime ;
  };

  const setAudioTrack = (activeStory: Entity, currentFrameIndex: number) => {
    let audioSrc = ''
    if(activeStory.frames && activeStory.frames.length > 0){
      audioSrc = useFrame(threeService).getAudioForFrame(activeStory.frames[currentFrameIndex] as unknown as Frame)
    }
    console.log('Audio Source', audioSrc)
    return new Audio(audioSrc)
  };

  return {
    DoEvent,
    setAudioTrack,
  };
};

export default AudioHelper;
