import useFrame from '@/composables/useFrame';
import { Frame, Story } from '@/models/GraphqlModel';
import ThreeService from '@/services/ThreeService';
import { Entity } from 'coghent-vue-3-component-library/lib';
import Development from './defaults.development';
import tempUrls from '@/temp-urls';

export type AudioHelperFunctions = {
  DoEvent: (currentTime: number, eventTime: number) => boolean;
  setAudioTrack: (
    activeStory: Entity,
    currentFrameIndex: number,
  ) => HTMLAudioElement | null;
};

const AudioHelper = (threeService: ThreeService): AudioHelperFunctions => {
  const DoEvent = (currentTime: number, eventTime: number) => {
    if (Development().showDevTimeLogs()) {
      console.log(`current: ${currentTime}; event: ${eventTime}`);
    }
    return currentTime == eventTime || currentTime > eventTime;
  };

  const setAudioTrack = (activeStory: Entity, currentFrameIndex: number) => {
    let audio: HTMLAudioElement | null = null;
    const audioSrc = null;
    if (activeStory.frames && activeStory.frames.length > 0) {
      //@ts-ignore
      const audioSrc = tempUrls[activeStory.id][currentFrameIndex].audio;
      // audioSrc = useFrame(threeService).getAudioForFrame(
      //   activeStory.frames[currentFrameIndex] as unknown as Frame,
      // );
      if (audioSrc) {
        audio = new Audio(audioSrc);
      }
    }
    return audio;
  };

  return {
    DoEvent,
    setAudioTrack,
  };
};

export default AudioHelper;
