type Timings = {
  startOfSession: {
    videoDelay: number,
  },
  endOfSession: {
    countdown: number,
  },
  moveObject: {
    refreshStep: number;
    steps: number;
  };
  delayNextCycle: number;
  frameOverview: {
    spotLightMoved: number;
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
    countdown: 30000,
  },
  moveObject: {
    refreshStep: 12,
    steps: 60,
  },
  delayNextCycle: 2,
  frameOverview: {
    spotLightMoved: 3,
  },
  storyCircle: {
    showFrameTitle: 2,
  },
};

export default Timing;
