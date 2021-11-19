import ThreeService from '@/services/ThreeService';
import { Audio, AudioListener, AudioLoader } from 'three';

const AudioSchema = (
  threeSvc: ThreeService,
): {
  loadAudioFile: (url: string) => { audio: Audio };
  audio: Audio;
  percentageInAudio: number;
} => {
  const listener = new AudioListener();
  const audio = new Audio(listener);
  let percentageInAudio = 0;

  const load = (request: ProgressEvent<EventTarget>) => {
    console.log((request.loaded / request.total) * 100 + '% loaded');
  };
  const progress = (error: any) => {
    console.log('audio error', error);
  };

  const loadAudioFile = (url: string) => {
    threeSvc.state.camera.add(listener);
    threeSvc.state.scene.add(audio);
    new AudioLoader().load(
      url,
      (buffer) => {
        audio.setBuffer(buffer);
        audio.setLoop(false);
        const end = audio.context.getOutputTimestamp().performanceTime as number;
        setInterval(() => {
          percentageInAudio = audio.context.currentTime;
        }, 4);
      },
      (xhr) => load(xhr),
      (error) => progress(error),
    );

    return { audio: audio };
  };
  return {
    loadAudioFile,
    audio,
    percentageInAudio,
  };
};

export default AudioSchema;
