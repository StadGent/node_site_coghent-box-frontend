import Colors from './defaults.color';
import { StoryCircleParams } from './section.storyCircle';
import { SpotLightParams } from './shapes.spotlight';

type GenericCircleObject = {
  radius: number;
};

type ProgressbarParams = {
  radius: number;
  thickness: number;
  dotRadius: number;
  activeDotRadius: number;
  seenDotRadius: number;
  opacity: number;
};

type Textsize = {
  smaller: number;
  small: number;
  medium: number;
  big: number;
  veryBig: number;
};

type TextParams = {
  size: Textsize;
  paddingAround: number;
};

type PauseScreenParams = {
  bannerHeight: number;
  bannerOpacity: number;
  bannerColor: number;
  spotLightRadius: number;
};

type StartOfSessionScreenParams = {
  countdownCircleRadius: number;
  countdownCircleThickness: number;
};

const Measurements = (): {
  storyCircle: StoryCircleParams;
  progressBar: ProgressbarParams;
  spotLight: SpotLightParams;
  pauseScreen: PauseScreenParams;
  text: TextParams;
  startOfSession: StartOfSessionScreenParams;
} => {
  const storyCircle = {
    radius: 200,
    progressRadius: 250,
    outerCircle: 320,
    opacityShadedCircle: 0.4,
    correctionText: 1.5,
  };

  const progressBar = {
    radius: 300,
    thickness: 16,
    dotRadius: 40,
    activeDotRadius: 15,
    seenDotRadius: 25,
    opacity: 0.95,
  };

  const spotLight = {
    radius: 350,
    spaceAroundObject: 1.8,
    opacity: 0.5,
  };

  const pauseScreen = {
    bannerHeight: 550,
    bannerOpacity: 1,
    bannerColor: Colors().black,
    spotLightRadius: 350,
  };

  const text = {
    size: {
      smaller: 20,
      small: 30,
      medium: 40,
      big: 50,
      veryBig: 120,
    },
    paddingAround: 40,
  };

  const startOfSession = {
    countdownCircleRadius: 300,
    countdownCircleThickness: 15,
  };

  return {
    storyCircle,
    progressBar,
    spotLight,
    pauseScreen,
    text,
    startOfSession,
  };
};

export default Measurements;
