type Timings = {
  startOfSession: {
    videoDelay: number,
  },
  endOfSession: {
    countdown: number,
  },
  delayToPauseScreen: number,
  moveObject: {
    refreshStep: number;
    steps: number;
  };
  storyCircle: {
    showFrameTitle: number;
  };
};

const Timing: Timings = {
  startOfSession:{
    videoDelay: 3000,
  },
  endOfSession:{
    // countdown: 30000,
    countdown: 2000,
  },
  delayToPauseScreen: 2,
  moveObject: {
    refreshStep: 12,
    steps: 60,
  },
  storyCircle: {
    showFrameTitle: 2,
  },
};

export default Timing;
