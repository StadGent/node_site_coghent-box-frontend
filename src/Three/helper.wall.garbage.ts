import CustomAnimation from '@/composables/animation';
import TaggingService, { Tags } from '@/services/TaggingService';
import ThreeService from '@/services/ThreeService';
import { Mesh, MeshBasicMaterial } from 'three';
import AnimationDefaults from './defaults.animation';
import Defaults from '@/Three/defaults.config'
import StoryService from '@/services/StoryService';

export type GarabageHelperForWall = {
  removeGroupsByTag: (_tag: Tags) => void;
  pauseScreen: () => void;
  newStorySelected: () => Promise<void>;
  endOfSessionScreen: () => void;
  startOfSession: () => void;
  highlightedAsset: () => void;
};

const WallGarbageHelper = (threeService: ThreeService, taggingService: TaggingService): GarabageHelperForWall => {

  const removeAllInactiveStories = () => {
    storyCircle();
    storyCircle();
    storyCircle();
  };

  const removeArrayOfGroupsByTag = (_tag: Tags) => {
    const _groups = taggingService.getByTag(_tag);
    for(const item of _groups){
      threeService.RemoveGroupsFromScene(item.object);
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
    if (taggedObject.length > 0){
      threeService.RemoveFromScene(taggedObject[0].object);
      removeByTag(_tag);
    }
  };

  const pauseScreen = () => {
    removeArrayOfGroupsByTag(Tags.FrameProgressbar);
    removeArrayOfGroupsByTag(Tags.PauseScreenCenterText);
    logRemoved('pauseScreen');
  };

  const newStorySelected = async () => {
    const groupOfAssetsTags = taggingService.getByTag(Tags.GroupOfAssets);
    await CustomAnimation().fadeOutGroups([groupOfAssetsTags[0].object], 0, AnimationDefaults.values.fadeStep);
    threeService.RemoveFromScene(groupOfAssetsTags[0].object);
    removeAllInactiveStories();
    removeArrayOfGroupsByTag(Tags.PauseScreenCenterText)
    removeByTag(Tags.PauseScreenBanner);    
    logRemoved('newStorySelected')
  };

  const endOfSessionScreen = () => {
    removeArrayOfGroupsByTag(Tags.FrameProgressbar);
    removeByTag(Tags.GroupOfAssets);
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

  const activeStoryCircle = () => {
    removeByTag(Tags.ActiveStoryCircleText);
    removeByTag(Tags.ActiveStoryCircleBasic);
    removeByTag(Tags.ActiveStoryCircleShade);
    removeByTag(Tags.ActiveStoryCircleFrameDot);
    logRemoved('activeStoryCircle');
  };

  const storyCircle = () => {
    removeByTag(Tags.StoryCircleText);
    removeByTag(Tags.StoryCircleBasic);
    removeByTag(Tags.StoryCircleFrameDot);
    logRemoved('storyCircle');
  };

  const logRemoved = (_context: string) => {
    if(Defaults().showDevLogs()){
      console.log(`-------------`);
      console.log(`garbageHelper removed =>`, _context);
      console.log(`-------------`);
    }
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