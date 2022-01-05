import CustomAnimation from '@/composables/animation';
import TaggingService, { Tags } from '@/services/TaggingService';
import ThreeService from '@/services/ThreeService';
import { Mesh, MeshBasicMaterial } from 'three';
import AnimationDefaults from './defaults.animation';

const WallGarbageHelper = (threeService: ThreeService, taggingService: TaggingService): {
  pauseScreen: () => void;
} => {
  const pauseScreen = async () => {
    const progressBarTag = taggingService.getByTag(Tags.FrameProgressbar);
    const storyCircleTag = taggingService.getByTag(Tags.ActiveStoryCircle);
    const circularProgresbarTag = taggingService.getByTag(Tags.CircularProgressBar);
    const frameTitleTag = taggingService.getByTag(Tags.FrameTitle);
    threeService.RemoveGroupsFromScene(progressBarTag[0].object);
    threeService.RemoveGroupsFromScene(storyCircleTag[0].object);
    threeService.RemoveGroupsFromScene(circularProgresbarTag[0].object);
    threeService.RemoveFromScene(frameTitleTag[0].object);
  };

  return {
    pauseScreen,
  }
};

export default WallGarbageHelper;