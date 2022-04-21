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
  pauseMenu: {
    countdown: number,
  }
};

const Timing: Timings = {
  startOfSession:{
    videoDelay: 3000,
  },
  endOfSession:{
    // countdown: 30000,
    countdown: 10000,
  },
  delayForNext: 1,
  moveObject: {
    refreshStep: 12,
    steps: 60,
  },
  storyCircle: {
    showFrameTitle: 2,
  },
  pauseMenu: {
    countdown: 30000,
  }
};

export default Timing;
