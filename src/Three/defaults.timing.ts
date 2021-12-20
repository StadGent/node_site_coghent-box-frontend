type Timings = {
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
