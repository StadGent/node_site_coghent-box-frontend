import MoveObject from '@/composables/moveObject';
import TaggingService from '@/services/TaggingService';
import { Vector3 } from 'three';
import TaggingHelper from './helper.tagging';

const MoveHelper = (_taggingService: TaggingService): {
  activeStoryCircle: (_position: Vector3) => void;
  activeStoryCircleWithoutShade: (_position: Vector3) => void;
} => {

  const activeStoryCircle = (_position: Vector3) => {
    const objects = TaggingHelper(_taggingService).getActiveStoryCircle();
    MoveObject().startMoving(objects.text, _position);
    MoveObject().startMoving(objects.basic, _position);
    MoveObject().startMoving(objects.progress, _position);
    MoveObject().startMoving(objects.shade, _position);
    objects.frameDots.forEach(_group => MoveObject().moveGroups([_group], _position));
  };
  const activeStoryCircleWithoutShade = (_position: Vector3) => {
    const objects = TaggingHelper(_taggingService).getActiveStoryCircle();
    MoveObject().startMoving(objects.text, _position);
    MoveObject().startMoving(objects.basic, _position);
    MoveObject().startMoving(objects.progress, _position);
    MoveObject().startMoving(objects.shade, _position);
    objects.frameDots.forEach(_group => MoveObject().moveGroups([_group], _position));
  };

  return { activeStoryCircle, activeStoryCircleWithoutShade }
};

export default MoveHelper;