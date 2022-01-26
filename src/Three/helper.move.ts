import Common from '@/composables/common';
import MoveObject from '@/composables/moveObject';
import TaggingService from '@/services/TaggingService';
import { Mesh, Vector3 } from 'three';
import TaggingHelper from './helper.tagging';
import Template from './template.shapes';

const MoveHelper = (_taggingService: TaggingService): {
  activeStoryCircle: (_position: Vector3) => Promise<void>;
} => {

  const activeStoryCircle = async (_position: Vector3) => {
    const templateLayers = Template().storyCircleLayers(_position);
    const objects = TaggingHelper(_taggingService).getActiveStoryCircle();
    const storyCirclePositions = Template().storyCirclePositions(_position, objects.progress.dots.length);
    console.log('position of framedot',storyCirclePositions.frameDots);

    console.log('ring items', objects.progress.ring[0].children);
    MoveObject().startMoving(objects.text, new Vector3(templateLayers.title.x - 1.5,templateLayers.title.y,templateLayers.title.z));
    MoveObject().startMoving(objects.basic, templateLayers.centerCircle);
    for(const _child of objects.progress.ring[0].children){
      const index = objects.progress.ring[0].children.indexOf(_child);
      if (index != objects.progress.ring[0].children.length - 1) {
        MoveObject().startMoving(_child, storyCirclePositions.frameDots[index]);
      }
    }
    MoveObject().startMoving(objects.progress.ring[0].children[objects.progress.ring[0].children.length - 1], templateLayers.progressCircle)
    MoveObject().startMoving(objects.shade, templateLayers.shadedCircle);
    //FIXME: The dots are a little off..
    objects.progress.dots.forEach((_dot, index) => {
      MoveObject().startMoving(_dot.dot, storyCirclePositions.frameDots[index]);
      if (_dot.innerDot) {
        MoveObject().startMoving(_dot.innerDot, storyCirclePositions.frameDots[index])
      }
    });
  };

  return { activeStoryCircle }
};

export default MoveHelper;