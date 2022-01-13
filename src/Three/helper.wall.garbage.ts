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
  highlightedAsset: () => void;
};

const WallGarbageHelper = (threeService: ThreeService, taggingService: TaggingService): GarabageHelperForWall => {

  const removeGroupsByTag = (_tag: Tags) => {
    let _groups = taggingService.getByTag(_tag);
    if (_groups.length > 0) {
      threeService.RemoveGroupsFromScene(_groups[0].object);
      _groups = taggingService.getByTag(_tag);
    }
  }

  const pauseScreen = () => {
    removeGroupsByTag(Tags.ActiveStoryCircle);
    removeGroupsByTag(Tags.ActiveStoryCircle);
    removeGroupsByTag(Tags.CircularProgressBar);
    removeGroupsByTag(Tags.FrameProgressbar)
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

  const highlightedAsset = () => {
    removeGroupsByTag(Tags.HighlightedMetadata);
    const border = taggingService.getByTag(Tags.HighlightBorder);    
    threeService.RemoveFromScene(border[0].object);
    const metadata = taggingService.getByTag(Tags.HighlightedMetadata);    
    threeService.RemoveFromScene(metadata[0].object);
  }

  return {
    pauseScreen,
    newStorySelected,
    endOfSessionScreen,
    removeGroupsByTag,
    startOfSession,
    highlightedAsset,
  }
};

export default WallGarbageHelper;