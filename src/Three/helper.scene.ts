import { PauseScreenObjects } from '@/screens/StoryPaused';
import { Tags } from '@/services/TaggingService';
import ThreeService from '@/services/ThreeService';
import { StoryCircleObjects } from './section.storyCircle';

const SceneHelper = (_threeService: ThreeService): {
  addStoryCircleToScene: (storyId: string, storyCircle: StoryCircleObjects, _displayShadedCircle: boolean) => void;
  addPauseScreenObjectsToScene: (_objects: PauseScreenObjects) => void;
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

  return { 
    addStoryCircleToScene,
    addPauseScreenObjectsToScene,
   }

};

export default SceneHelper;