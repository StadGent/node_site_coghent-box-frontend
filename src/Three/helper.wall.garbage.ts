import CustomAnimation from '@/composables/animation';
import TaggingService, { Tags } from '@/services/TaggingService';
import ThreeService from '@/services/ThreeService';
import { Mesh, MeshBasicMaterial } from 'three';
import AnimationDefaults from './defaults.animation';

const WallGarbageHelper = (threeService: ThreeService, taggingService: TaggingService): {
  pauseScreen: () => void;
  newStorySelected: () => void;
} => {
  const pauseScreen = () => {
    const progressBarTag = taggingService.getByTag(Tags.FrameProgressbar);
    const storyCircleTag = taggingService.getByTag(Tags.ActiveStoryCircle);
    const circularProgresbarTag = taggingService.getByTag(Tags.CircularProgressBar);
    const frameTitleTag = taggingService.getByTag(Tags.FrameTitle);
    threeService.RemoveGroupsFromScene(progressBarTag[0].object);
    threeService.RemoveGroupsFromScene(storyCircleTag[0].object);
    threeService.RemoveGroupsFromScene(circularProgresbarTag[0].object);
    threeService.RemoveFromScene(frameTitleTag[0].object);
  };

  const newStorySelected = async () => {
    const groupOfAssetsTags = taggingService.getByTag(Tags.GroupOfAssets);
    const storyEndTextTags = taggingService.getByTag(Tags.StoryEndText);
    await CustomAnimation().fadeOutGroups([groupOfAssetsTags[0].object], 0, AnimationDefaults.values.fadeStep);
    console.log({storyEndTextTags});
    threeService.RemoveGroupsFromScene(storyEndTextTags[0].object);
    // threeService.RemoveFromScene(groupOfAssetsTags[0].object);
  }

  return {
    pauseScreen,
    newStorySelected,
  }
};

export default WallGarbageHelper;