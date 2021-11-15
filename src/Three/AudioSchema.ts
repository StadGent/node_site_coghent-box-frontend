import ThreeService from '@/services/ThreeService';
import { Audio, AudioListener, AudioLoader } from 'three';

const AudioSchema = (
  threeSvc: ThreeService,
): {
  loadAudio: (url: string) => void;
  audio: Audio;
} => {
  const listener = new AudioListener();
  const audio = new Audio(listener);

  const load = (request: ProgressEvent<EventTarget>) => {
    console.log((request.loaded / request.total) * 100 + '% loaded');
  };
  const progress = (error: any) => {
    console.log('audio error', error);
  };

  const loadAudio = (url: string) => {
    // threeSvc.state.camera.add(listener);
    threeSvc.state.scene.add(audio);

    new AudioLoader().load(
      url,
      (buffer) => {
        audio.setBuffer(buffer);
        audio.setLoop(false);
        audio.play();
        setInterval(() => {
          console.log(audio.context.currentTime);
        }, 10);
      },
      (xhr) => load(xhr),
      (error) => progress(error),
    );
  };
  return {
    loadAudio,
    audio,
  };
};

export default AudioSchema;
