type Timings = {
  delayNextCycle: number;
  frameOverview: {
    spotLightMoved: number;
  };
  storyCircle:{
    showFrameTitle: number;
  };
};

const Timing: Timings = {
  delayNextCycle: 1,
  frameOverview: {
    spotLightMoved: 1,
  },
  storyCircle:{
    showFrameTitle: 1,
  },
};

export default Timing;