import MoveObject from '@/composables/moveObject';
import TaggingService from '@/services/TaggingService';
import { Vector3 } from 'three';
import TaggingHelper from './helper.tagging';

const MoveHelper = (_taggingService: TaggingService): {
  activeStoryCircle: (_position: Vector3) => void;
} => {

  const activeStoryCircle = (_position: Vector3) => {
    const objects = TaggingHelper(_taggingService).activeStoryCircle();
    MoveObject().startMoving(objects.text, _position);
    MoveObject().startMoving(objects.basic, _position);
    MoveObject().startMoving(objects.progress, _position);
    MoveObject().startMoving(objects.shade, _position);
    MoveObject().moveGroups(objects.frameDots, _position);
  };

  return { activeStoryCircle }
};

export default MoveHelper;