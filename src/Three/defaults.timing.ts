type Timings = {
  startOfSession: {
    videoDelay: number,
  },
  endOfSession: {
    countdown: number,
  },
  delayForNext: number,
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
    countdown: 30000,
  },
  delayForNext: 1,
  moveObject: {
    refreshStep: 12,
    steps: 60,
  },
  storyCircle: {
    showFrameTitle: 2,
  },
};

export default Timing;
