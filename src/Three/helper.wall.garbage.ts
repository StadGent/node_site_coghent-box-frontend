import CustomAnimation from '@/composables/animation';
import TaggingService, { Tags } from '@/services/TaggingService';
import ThreeService from '@/services/ThreeService';
import { Mesh, MeshBasicMaterial } from 'three';
import AnimationDefaults from './defaults.animation';

export type GarabageHelperForWall = {
  removeGroupsByTag: (_tag: Tags) => void;
  pauseScreen: () => void;
  newStorySelected: () => Promise<void>;
  endOfSessionScreen: () => void;
  startOfSession: () => void;
  highlightedAsset: () => Promise<void>;
};

const WallGarbageHelper = (threeService: ThreeService, taggingService: TaggingService): GarabageHelperForWall => {

  const removeGroupsByTag = (_tag: Tags) => {
    let _groups = taggingService.getByTag(_tag);
    if (_groups.length > 0) {
      threeService.RemoveGroupsFromScene(_groups[0].object);
      _groups = taggingService.getByTag(_tag);
    }
  };

  const removeByTag = (_tag: Tags) => {
    const taggedObject = taggingService.getByTag(_tag);
    if (taggedObject.length > 0)
      threeService.RemoveFromScene(taggedObject[0].object);
  };

  const pauseScreen = () => {
    removeGroupsByTag(Tags.FrameProgressbar);
    removeGroupsByTag(Tags.HighlightedMetadata);
    removeByTag(Tags.HighlightedMetadata);
  };

  const newStorySelected = async () => {
    const groupOfAssetsTags = taggingService.getByTag(Tags.GroupOfAssets);
    await CustomAnimation().fadeOutGroups([groupOfAssetsTags[0].object], 0, AnimationDefaults.values.fadeStep);
    removeGroupsByTag(Tags.ActiveStoryCircle);
    removeGroupsByTag(Tags.Stories);
    threeService.RemoveFromScene(groupOfAssetsTags[0].object);
    removeByTag(Tags.Spotlight);
  };

  const endOfSessionScreen = () => {
    removeGroupsByTag(Tags.FrameProgressbar);
    removeGroupsByTag(Tags.StoryCircle);
    removeGroupsByTag(Tags.ActiveStoryCircle);
    removeGroupsByTag(Tags.Stories);
    removeGroupsByTag(Tags.CircularProgressBar);
    removeByTag(Tags.GroupOfAssets);
  };

  const startOfSession = () => {
    removeGroupsByTag(Tags.startSessionText);
  };

  const highlightedAsset = async () => {
    removeGroupsByTag(Tags.HighlightedMetadata);
    removeByTag(Tags.HighlightedMetadata);

    const zoomSpotlight = taggingService.getByTag(Tags.ZoomSpotlight);
    await CustomAnimation().shrink(zoomSpotlight[0].object as Mesh<any, MeshBasicMaterial>, 0, AnimationDefaults.values.scaleStep);
    removeByTag(Tags.ZoomSpotlight);
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