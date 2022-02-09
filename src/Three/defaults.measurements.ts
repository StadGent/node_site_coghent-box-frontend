import Colors from './defaults.color';
import { StoryCircleParams } from './section.storyCircle';
import { SpotLightParams } from './shapes.spotlight';

type GenericCircleObject ={
  radius: number;
};

type ProgressbarParams = {
  radius: number;
  thickness: number;
  dotRadius: number;
  activeDotRadius: number,
  seenDotRadius: number,
  opacity: number;
}

type Textsize = {
  smaller: number;
  small: number;
  medium: number;
  big: number;
  veryBig: number;
};

type TextParams ={
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
    radius: 2.5,
    progressRadius: 3,
    outerCircle: 3.8,
    opacityShadedCircle: 0.4,
    correctionText: 1.5,
  };

  const progressBar = {
    radius: 2.5,
    thickness: 0.16,
    dotRadius: 0.4,
    activeDotRadius: 0.15,
    seenDotRadius: 0.25,
    opacity: 0.95,
  };

  const spotLight = {
    radius: 5.5,
    spaceAroundObject: 1.8,
    opacity: 0.5,
  };

  const pauseScreen = {
    bannerHeight: 5.5,
    bannerOpacity: 1,
    bannerColor: Colors().black,
    spotLightRadius: 5.5,
  };

  const text = {
    size: {
      smaller: 0.2,
      small: 0.3,
      medium: 0.4,
      big: 0.5,
      veryBig: 1.2,
    },
    paddingAround: 0.4,
  };

  const startOfSession = {
    countdownCircleRadius: 3,
    countdownCircleThickness: 0.15,
  };

  return {
    storyCircle,
    progressBar,
    spotLight,
    pauseScreen,
    text,
    startOfSession,
  }
};

export default Measurements;