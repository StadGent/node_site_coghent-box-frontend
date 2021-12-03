
const AudioHelper = (): {
  DoEvent: (currentTime: number, eventTime: number) => boolean;
} => {
  const DoEvent = (currentTime: number, eventTime: number) => {
    console.log(`current: ${currentTime}; event: ${eventTime}`);
    return currentTime < eventTime + 2 && currentTime > eventTime;
  };

  return {
    DoEvent,
  };
};

export default AudioHelper;
