import Colors from './defaults.color';
import { StoryCircleParams } from './section.storyCircle';
import { SpotLightParams } from './shapes.spotlight';

type GenericCircleObject ={
  radius: number;
};

type TextParams ={
  size: number;
  paddingAround: number;
};

type PauseScreenParams = {
  bannerHeight: number;
  bannerOpacity: number;
  bannerColor: number;
  spotLightRadius: number;
};

const Measurements = (): {
  storyCircle: StoryCircleParams;
  progressBar: GenericCircleObject;
  spotLight: SpotLightParams;
  pauseScreen: PauseScreenParams;
  text: TextParams;
} => {
  const storyCircle = {
    radius: 2,
    outerCircle: 4,
  };

  const progressBar = {
    radius: 2.5,
  };

  const spotLight ={
    radius: 5.5,
    spaceAroundObject: 1.8,
  };

  const pauseScreen = {
    bannerHeight: 5.5,
    bannerOpacity: 0.9,
    bannerColor: Colors().black,
    spotLightRadius: 5.5,
  };

  const text = {
    size: 0.3,
    paddingAround: 0.3,
  };

  return {
    storyCircle,
    progressBar,
    spotLight,
    pauseScreen,
    text,
  }
};

export default Measurements;