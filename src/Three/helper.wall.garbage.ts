import CustomAnimation from '@/composables/animation';
import TaggingService, { Tags } from '@/services/TaggingService';
import ThreeService from '@/services/ThreeService';
import AnimationDefaults from './defaults.animation';

export type GarabageHelperForWall = {
  removeGroupsByTag: (_tag: Tags) => void;
  pauseScreen: () => void;
  newStorySelected: () => Promise<void>;
  endOfSessionScreen: () => void;
  startOfSession: () => void;
};

const WallGarbageHelper = (threeService: ThreeService, taggingService: TaggingService): GarabageHelperForWall => {

  const removeGroupsByTag = (_tag: Tags) => {
    const _groups = taggingService.getByTag(_tag);
    if (_groups.length > 0) threeService.RemoveGroupsFromScene(_groups[0].object);
  }

  const pauseScreen = () => {
    removeGroupsByTag(Tags.ActiveStoryCircle);
    removeGroupsByTag(Tags.ActiveStoryCircle);
    removeGroupsByTag(Tags.CircularProgressBar);
  };

  const newStorySelected = async () => {
    const groupOfAssetsTags = taggingService.getByTag(Tags.GroupOfAssets);
    await CustomAnimation().fadeOutGroups([groupOfAssetsTags[0].object], 0, AnimationDefaults.values.fadeStep);
    removeGroupsByTag(Tags.ActiveStoryCircle);
    removeGroupsByTag(Tags.Stories);
    threeService.RemoveFromScene(groupOfAssetsTags[0].object);
  };

  const endOfSessionScreen = () => {
    removeGroupsByTag(Tags.FrameProgressbar);
    removeGroupsByTag(Tags.StoryCircle);
    removeGroupsByTag(Tags.ActiveStoryCircle);
    removeGroupsByTag(Tags.Stories);
    removeGroupsByTag(Tags.CircularProgressBar);
    const groupOfAssetsTags = taggingService.getByTag(Tags.GroupOfAssets);
    threeService.RemoveFromScene(groupOfAssetsTags[0].object);
  };

  const startOfSession = () => {
    removeGroupsByTag(Tags.startSessionText);
  };

  return {
    pauseScreen,
    newStorySelected,
    endOfSessionScreen,
    removeGroupsByTag,
    startOfSession,
  }
};

export default WallGarbageHelper;