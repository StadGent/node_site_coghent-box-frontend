import CustomAnimation from '@/composables/animation';
import TaggingService, { Tags } from '@/services/TaggingService';
import ThreeService from '@/services/ThreeService';
import AnimationDefaults from './defaults.animation';

export type GarabageHelperForWall = {
  removeGroupsByTag: (_tag: Tags) => void;
  pauseScreen: () => void;
  newStorySelected: () => Promise<void>;
  endOfSessionScreen: () => void;
};

const WallGarbageHelper = (threeService: ThreeService, taggingService: TaggingService): GarabageHelperForWall => {

  const removeGroupsByTag = (_tag: Tags) => {
    const _groups = taggingService.getByTag(_tag);
    if (_groups.length > 0) threeService.RemoveGroupsFromScene(_groups[0].object);
  }

  const pauseScreen = () => {
    removeGroupsByTag(Tags.FrameProgressbar);
    const storyCircleTag = taggingService.getByTag(Tags.ActiveStoryCircle);
    const circularProgresbarTag = taggingService.getByTag(Tags.CircularProgressBar);
    const frameTitleTag = taggingService.getByTag(Tags.FrameTitle);
    threeService.RemoveGroupsFromScene(storyCircleTag[0].object);
    threeService.RemoveGroupsFromScene(circularProgresbarTag[0].object);
    // DEMO:
    // threeService.RemoveFromScene(frameTitleTag[0].object);
  };

  const newStorySelected = async () => {
    const groupOfAssetsTags = taggingService.getByTag(Tags.GroupOfAssets);
    const storyEndTextTags = taggingService.getByTag(Tags.StoryEndText);
    await CustomAnimation().fadeOutGroups([groupOfAssetsTags[0].object], 0, AnimationDefaults.values.fadeStep);
    threeService.RemoveFromScene(storyEndTextTags[0].object);
    threeService.RemoveFromScene(groupOfAssetsTags[0].object);
  };

  const endOfSessionScreen = () => {
    removeGroupsByTag(Tags.FrameProgressbar);
    removeGroupsByTag(Tags.StoryCircle);
    removeGroupsByTag(Tags.ActiveStoryCircle);
    removeGroupsByTag(Tags.Stories);
    const groupOfAssetsTags = taggingService.getByTag(Tags.GroupOfAssets);
    threeService.RemoveFromScene(groupOfAssetsTags[0].object);
    console.log('After end screen cleared', taggingService.taggedObjects);
  };

  return {
    pauseScreen,
    newStorySelected,
    endOfSessionScreen,
    removeGroupsByTag,
  }
};

export default WallGarbageHelper;