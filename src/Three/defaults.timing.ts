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
  delayNextCycle: 1,
  frameOverview: {
    spotLightMoved: 4,
  },
  storyCircle: {
    showFrameTitle: 2,
  },
};

export default Timing;
