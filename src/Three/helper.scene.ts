import { PauseScreenObjects } from '@/screens/StoryPaused';
import { Tags } from '@/services/TaggingService';
import ThreeService from '@/services/ThreeService';
import { StoryCircleObjects } from './section.storyCircle';
import CustomAnimation from '@/composables/animation';
import AnimationDefaults from './defaults.animation';
import Common from '@/composables/common';
import StoryService from '@/services/StoryService';
import { DotWithinDotObjects } from './shapes.dotWithinDot';
import MoveObject from '@/composables/moveObject';
import { Vector3 } from 'three';
import Layers from './defaults.layers';
import { Zone } from '@/services/ZoneService';
import Measurements from './defaults.measurements';

const SceneHelper = (_threeService: ThreeService, _storyService: StoryService): {
  addStoryCircleToScene: (storyId: string, storyCircle: StoryCircleObjects, _displayShadedCircle: boolean) => Promise<void>;
  addPauseScreenObjectsToScene: (_objects: PauseScreenObjects, _sceneZone: Zone) => Promise<void>;
  addFrameProgressDotsToScene: (_dots: Array<DotWithinDotObjects>, _storyId: string, _progress: number, _animation: boolean) => Promise<void>;
} => {

  const addStoryCircleToScene = async (storyId: string, storyCircle: StoryCircleObjects, _displayShadedCircle: boolean) => {
    if (_displayShadedCircle) {
      _threeService.AddToScene(
        storyCircle.shade,
        Tags.StoryCircleShade,
        'The shaded circle of a storycircle.',
        storyId,
      );
    }
    _threeService.AddToScene(
      storyCircle.text,
      Tags.StoryCircleText,
      'The text of a storycircle.',
      storyId,
    );
    _threeService.AddToScene(
      storyCircle.basic,
      Tags.StoryCircleBasic,
      'The middle circle of the storycircle.',
      storyId,
    );
    _threeService.AddGroupsToScene(
      storyCircle.progress.ring,
      Tags.StoryCircleFrameRing,
      'The progress ring of the storycircle.',
      storyId,
    );

  await addFrameProgressDotsToScene(storyCircle.progress.dots, storyId, _storyService.getStoryDataOfStory(storyId).totalOfFramesSeen, true);
  };

  const addPauseScreenObjectsToScene = async (_objects: PauseScreenObjects, _sceneZone: Zone) => {
    _threeService.AddToScene(_objects.banner, Tags.PauseScreenBanner);
    await MoveObject().startMoving(_objects.banner, new Vector3(0,-(_sceneZone.height / 2) + Measurements().pauseScreen.bannerHeight / 2,Layers.background));
    _threeService.AddGroupsToScene(_objects.text, Tags.PauseScreenCenterText);
    for (const _item in _objects.storyCircles) {
      await addStoryCircleToScene(_item, _objects.storyCircles[_item], false);
    }
  };

  const addFrameProgressDotsToScene = async (_dots: Array<DotWithinDotObjects>, _storyId: string, _progress: number, _animation: boolean) => {
    let framesSeen = _progress;
    if(_storyService.storyIsActive(_storyId)){
      framesSeen++;
    }
    for (let index = 0;index < framesSeen;index++) {
      _threeService.AddToScene(_dots[index].dot, Tags.StoryCircleFrameDot, 'Dot to show the frames in the story.', _storyId);
      if (_animation) {
        _dots[index].dot.material.opacity = 0;
        CustomAnimation().fadeIn(_dots[index].dot, 1, AnimationDefaults.values.fadeStep);
      }
      if (index == _progress && _storyService.storyIsActive(_storyId)) {
        _threeService.AddToScene(_dots[index].innerDot, Tags.StoryCircleFrameInnerDot, 'Innerdot to show the frames in the story.', _storyId);
        if (_animation) {
          _dots[index].innerDot.material.opacity = 0;
          CustomAnimation().fadeIn(_dots[index].innerDot, 1, AnimationDefaults.values.fadeStep);
        }
      }
      await Common().awaitTimeout(AnimationDefaults.timing.fadeIn);
    }
  };

  return {
    addStoryCircleToScene,
    addPauseScreenObjectsToScene,
    addFrameProgressDotsToScene,
  }

};

export default SceneHelper;