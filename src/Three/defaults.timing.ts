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
    moveSpotlight: 0.5,
    progressBar: 0.4,
  },
  storyCircle:{
    showFrameTitle: 0.5,
    clearScene: 0.01,
  },
};

export default Timing;