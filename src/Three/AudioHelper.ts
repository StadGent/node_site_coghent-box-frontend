const AudioHelper = (
  audioSchema: any,
): {
  Play: () => void;
  Pause: () => void;
  DoEvent: (currentTime: number, eventTime: number) => boolean;
} => {
  const Play = () => {
    if (audioSchema.audio.isPlaying === false) {
      audioSchema.audio.play();
      console.log(`Playing state: `, audioSchema.audio.isPlaying);
    }
  };
  const Pause = () => {
    if (audioSchema.audio.isPlaying == true) {
      audioSchema.audio.pause();
      console.log(`Playing state: `, audioSchema.audio.isPlaying);
    }
  };

  const DoEvent = (currentTime: number, eventTime: number) => {
    return currentTime < eventTime + 2 && currentTime > eventTime;
  };

  return {
    Play,
    Pause,
    DoEvent,
  };
};

export default AudioHelper;
