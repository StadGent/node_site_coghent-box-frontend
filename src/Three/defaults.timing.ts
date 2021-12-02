type Timings = {
  frameOverview: {
    moveSpotlight: number;
    progressBar: number;
  };
  storyCircle:{
    showFrameTitle: number;
    clearScene: number;
  };
};

const Timing: Timings = {
  frameOverview: {
    moveSpotlight: 1,
    progressBar: 0.4,
  },
  storyCircle:{
    showFrameTitle: 1,
    clearScene: 0,
  },
};

export default Timing;