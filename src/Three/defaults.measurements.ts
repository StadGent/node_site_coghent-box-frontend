import { StoryCircleParams } from './section.storyCircle';
import { SpotLightParams } from './shapes.spotlight';

type GenericCircleObject ={
  radius: number;
}

const Measurements = (): {
  storyCircle: StoryCircleParams;
  progressBar: GenericCircleObject;
  spotLight: SpotLightParams;
} => {
  const storyCircle = {
    radius: 2,
    outerCircle: 4,
  } as StoryCircleParams;

  const progressBar = {
    radius: 2.5,
  }as GenericCircleObject;

  const spotLight ={
    radius: 5.5,
    spaceAroundObject: 1.8,
  } as SpotLightParams;

  return {
    storyCircle,
    progressBar,
    spotLight,
  }
};

export default Measurements;