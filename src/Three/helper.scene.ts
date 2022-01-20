import { PauseScreenObjects } from '@/screens/StoryPaused';
import { Tags } from '@/services/TaggingService';
import ThreeService from '@/services/ThreeService';
import { StoryCircleObjects } from './section.storyCircle';
import { PauseProgressbarObjects } from '@/Three/shapes.pauseProgressbar'
import CustomAnimation from '@/composables/animation';
import AnimationDefaults from './defaults.animation';
import Common from '@/composables/common';

const SceneHelper = (_threeService: ThreeService): {
  addStoryCircleToScene: (storyId: string, storyCircle: StoryCircleObjects, _displayShadedCircle: boolean) => void;
  addPauseScreenObjectsToScene: (_objects: PauseScreenObjects) => void;
  addFrameProgressDotsToScene: (_frameProgressbar: PauseProgressbarObjects, _storyId: string, _progress: number, _animation: boolean) => void;
} => {

  const addStoryCircleToScene = (storyId: string, storyCircle: StoryCircleObjects, _displayShadedCircle: boolean) => {
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
      storyCircle.progress,
      Tags.StoryCircleProgress,
      'The progress of a storycircle.',
      storyId,
    );
    _threeService.AddToScene(
      storyCircle.basic,
      Tags.StoryCircleBasic,
      'The middle circle of the storycircle.',
      storyId,
    );
    _threeService.AddGroupsToScene(
      storyCircle.frameDots,
      Tags.StoryCircleFrameDots,
      'The progress of the frames dots of a storycircle.',
      storyId,
    );
  };

  const addPauseScreenObjectsToScene = (_objects: PauseScreenObjects) => {
    _threeService.AddToScene(_objects.banner, Tags.PauseScreenBanner);
    _threeService.AddGroupsToScene(_objects.text, Tags.PauseScreenCenterText);
    for (const _item in _objects.storyCircles) {
      addStoryCircleToScene(_item, _objects.storyCircles[_item], false);
    }
  };

  const addFrameProgressDotsToScene = async (_frameProgressbar: PauseProgressbarObjects, _storyId: string, _progress: number, _animation: boolean) => {
    const dots = _frameProgressbar.dots;
    for (let index = 0;index < _frameProgressbar.dots.length;index++) {
      _threeService.AddToScene(dots[index].dot, Tags.StoryCircleFrameDots, 'Dot to show the frames in the story.', _storyId);
      if (_animation) {
        dots[index].dot.material.opacity = 0;
        CustomAnimation().fadeIn(dots[index].dot, 1, AnimationDefaults.values.fadeStep);
      }
      if (index < _progress || _progress > _frameProgressbar.dots.length) {
        _threeService.AddToScene(dots[index].innerDot, Tags.StoryCircleFrameDots, 'Dot to show the frames in the story.', _storyId);
        if (_animation) {
          dots[index].innerDot.material.opacity = 0;
          CustomAnimation().fadeIn(dots[index].innerDot, 1, AnimationDefaults.values.fadeStep);
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