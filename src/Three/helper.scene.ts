import { PauseScreenObjects } from '@/screens/StoryPaused';
import { Tags } from '@/services/TaggingService';
import ThreeService from '@/services/ThreeService';
import { StoryCircleObjects } from './section.storyCircle';
import { DotWithinDotObjects } from './shapes.dotWithinDot';
import { PauseProgressbarObjects } from '@/Three/shapes.pauseProgressbar'

const SceneHelper = (_threeService: ThreeService): {
  addStoryCircleToScene: (storyId: string, storyCircle: StoryCircleObjects, _displayShadedCircle: boolean) => void;
  addPauseScreenObjectsToScene: (_objects: PauseScreenObjects) => void;
  addFrameProgressDotsToScene: (_frameProgressbar: PauseProgressbarObjects,  _storyId: string) => void;
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
    for (const _item in _objects.storyCircles){
      addStoryCircleToScene(_item, _objects.storyCircles[_item], false);
    }
  };

  const addFrameProgressDotsToScene = (_frameProgressbar: PauseProgressbarObjects, _storyId: string) => {
    for(const doubleDot of _frameProgressbar.dots){
      _threeService.AddToScene(doubleDot.dot, Tags.StoryCircleFrameDots,'Dot to show the frames in the story.',_storyId);
      _threeService.AddToScene(doubleDot.innerDot, Tags.StoryCircleFrameDots,'Dot to show the frames in the story.',_storyId);
    }
  }

  return { 
    addStoryCircleToScene,
    addPauseScreenObjectsToScene,
    addFrameProgressDotsToScene,
   }

};

export default SceneHelper;