import { Tags } from '@/services/TaggingService';
import ThreeService from '@/services/ThreeService';
import { StoryCircleObjects } from './section.storyCircle';

const SceneHelper = (_threeService: ThreeService): {
  addStoryCircleToScene: (storyId: string, storyCircle: StoryCircleObjects, _displayShadedCircle: boolean) => void;
} => {

  const addStoryCircleToScene = (storyId: string, storyCircle: StoryCircleObjects, _displayShadedCircle: boolean) => {
    if (_displayShadedCircle) {
      _threeService.AddToScene(
        storyCircle.shade,
        Tags.ActiveStoryCircleShade,
        'The shaded circle of a storycircle.',
        storyId,
      );
    }
    _threeService.AddToScene(
      storyCircle.text,
      Tags.ActiveStoryCircleText,
      'The text of a storycircle.',
      storyId,
    );
    _threeService.AddToScene(
      storyCircle.progress,
      Tags.ActiveStoryCircleProgress,
      'The progress of a storycircle.',
      storyId,
    );
    _threeService.AddToScene(
      storyCircle.basic,
      Tags.ActiveStoryCircleBasic,
      'The middle circle of the storycircle.',
      storyId,
    );
    _threeService.AddGroupsToScene(
      storyCircle.frameDots,
      Tags.ActiveStoryCircleFrameDots,
      'The progress of the frames dots of a storycircle.',
      storyId,
    );
  };

  return { addStoryCircleToScene }

};

export default SceneHelper;