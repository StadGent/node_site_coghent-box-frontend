import CustomAnimation from '@/composables/animation';
import TaggingService, { Tags } from '@/services/TaggingService';
import ThreeService from '@/services/ThreeService';
import AnimationDefaults from './defaults.animation';
import Development from './defaults.development';
import TaggingHelper from './helper.tagging';

export type GarabageHelperForWall = {
  removeArrayOfGroupsByTag: (_tag: Tags) => void;
  removeGroupsByTag: (_tag: Tags) => void;
  pauseScreen: () => void;
  newStorySelected: () => Promise<void>;
  newStorySelectedWithNoActive: () => void;
  endOfSessionScreen: () => void;
  startOfSession: () => void;
  highlightedAsset: () => void;
  removeActiveFrameDots: () => void;
  activeStoryCircle: () => void;
  smallCountdownTimer: () => void;
};

const WallGarbageHelper = (threeService: ThreeService, taggingService: TaggingService): GarabageHelperForWall => {

  const removeArrayOfGroupsByTag = (_tag: Tags) => {
    const _groups = taggingService.getByTag(_tag);
    for (const item of _groups) {
      if (item.object) {
        threeService.RemoveGroupsFromScene(item.object);
      }
    }
    taggingService.removeAllTagsFrom(_tag);
  };

  const removeGroupsByTag = (_tag: Tags) => {
    let _groups = taggingService.getByTag(_tag);
    if (_groups.length > 0) {
      threeService.RemoveGroupsFromScene(_groups[0].object);
      _groups = taggingService.getByTag(_tag);
    }
  };

  const removeByTag = (_tag: Tags) => {
    const taggedObject = taggingService.getByTag(_tag);
    if (taggedObject.length > 0 && taggedObject[0]) {
      threeService.RemoveFromScene(taggedObject[0].object);
      removeByTag(_tag);
    }
  };

  const pauseScreen = () => {
    removeArrayOfGroupsByTag(Tags.FrameProgressbar);
    removeByTag(Tags.ActiveStoryCircleFrameInnerDot);
    removeArrayOfGroupsByTag(Tags.PauseScreenCenterText);
    logRemoved('pauseScreen');
  };

  const newStorySelected = async () => {
    const groupOfAssetsTags = TaggingHelper(taggingService).getByTag(Tags.GroupOfAssets);
    if (groupOfAssetsTags && groupOfAssetsTags[0]) {
      await CustomAnimation().fadeOutGroups([groupOfAssetsTags[0].object], 0, AnimationDefaults.values.fadeStep);
      threeService.RemoveFromScene(groupOfAssetsTags[0].object);
    }
    storyCircle();
    removeArrayOfGroupsByTag(Tags.PauseScreenCenterText)
    removeByTag(Tags.PauseScreenBanner);
    logRemoved('newStorySelected')
  };

  const newStorySelectedWithNoActive = () => {
    storyCircle();
    removeArrayOfGroupsByTag(Tags.PauseScreenCenterText)
    removeByTag(Tags.PauseScreenBanner);
    logRemoved('newStorySelected')
  };

  const endOfSessionScreen = () => {
    removeArrayOfGroupsByTag(Tags.FrameProgressbar);
    removeByTag(Tags.GroupOfAssets);
    removeByTag(Tags.ActiveStoryCircleFrameInnerDot);
    removeByTag(Tags.ActiveStoryCircleFrameDot);
    activeStoryCircle();
    logRemoved('endOfSessionScreen');
  };

  const startOfSession = () => {
    removeGroupsByTag(Tags.startSessionText);
    logRemoved('startOfSession');
  };

  const highlightedAsset = () => {
    removeArrayOfGroupsByTag(Tags.HighlightedMetadata);
    logRemoved(`highlightedAsset`);
  };

  const removeActiveFrameDots = () => {
    removeByTag(Tags.ActiveStoryCircleFrameDot);
    removeByTag(Tags.ActiveStoryCircleFrameInnerDot);
  };

  const activeStoryCircle = () => {
    removeByTag(Tags.ActiveStoryCircleText);
    removeByTag(Tags.ActiveStoryCircleBasic);
    removeByTag(Tags.ActiveStoryCircleShade);
    removeArrayOfGroupsByTag(Tags.ActiveStoryCircleFrameRing);
    removeByTag(Tags.ActiveStoryCircleFrameDot);
    removeByTag(Tags.ActiveStoryCircleFrameInnerDot);
    logRemoved('activeStoryCircle');
  };

  const storyCircle = () => {
    removeByTag(Tags.StoryCircleText);
    removeByTag(Tags.StoryCircleBasic);
    removeArrayOfGroupsByTag(Tags.StoryCircleFrameRing);
    removeByTag(Tags.StoryCircleFrameDot);
    removeByTag(Tags.StoryCircleFrameInnerDot);
    logRemoved('storyCircle');
  };

  const logRemoved = (_context: string) => {
    if (Development().showGarbageLogs()) {
      console.log(`-------------`);
      console.log(`garbageHelper removed =>`, _context);
      console.log(`-------------`);
    }
  }

  const smallCountdownTimer = () => {
    removeByTag(Tags.SmallCountdownProgressRing);
    removeByTag(Tags.SmallCountdowndownNumber);
    removeByTag(Tags.SmallCountdownRing);
    logRemoved('smallCountdown');
  }

  return {
    removeArrayOfGroupsByTag,
    pauseScreen,
    newStorySelected,
    newStorySelectedWithNoActive,
    endOfSessionScreen,
    removeGroupsByTag,
    startOfSession,
    highlightedAsset,
    removeActiveFrameDots,
    activeStoryCircle,
    smallCountdownTimer,
  }
};

export default WallGarbageHelper;