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
  checkMarkRadius: number;
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
  spacing: number
} => {
  const storyCircle = {
    radius: 180,
    progressRadius: 230,
    outerCircle: 300,
    opacityShadedCircle: 0.4,
    correctionText: 1.5,
  };

  const progressBar = {
    radius: 300,
    thickness: 16,
    dotRadius: 38,
    activeDotRadius: 13,
    seenDotRadius: 23,
    checkMarkRadius: 28,
    opacity: 0.95,
  };

  const spotLight = {
    radius: 350,
    spaceAroundObject: 0,
    opacity: 0.6,
  };

  const pauseScreen = {
    bannerHeight: 300,
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

  const spacing = 30

  return {
    storyCircle,
    progressBar,
    spotLight,
    pauseScreen,
    text,
    startOfSession,
    spacing,
  };
};

export default Measurements;
