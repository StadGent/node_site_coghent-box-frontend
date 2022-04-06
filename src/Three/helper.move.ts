import MoveObject from '@/composables/moveObject';
import { StoryData } from '@/services/StoryService';
import TaggingService from '@/services/TaggingService';
import { text } from 'd3';
import { Vector3, Box3, Mesh, Group } from 'three';
import TaggingHelper from './helper.tagging';
import Template from './template.shapes';

const MoveHelper = (
  _taggingService: TaggingService,
): {
  activeStoryCircle: (_position: Vector3, _storyData: StoryData) => Promise<void>;
} => {
  const activeStoryCircle = async (_position: Vector3, _storyData: StoryData) => {
    const templateLayers = Template().storyCircleLayers(_position);
    const objects = TaggingHelper(_taggingService).getActiveStoryCircle();
    const storyCirclePositions = Template().storyCirclePositions(
      _position,
      _storyData.totalOfFrames,
    );
    // const textSize = getSizeStoryText(objects.text);

    const xDelta = objects.basic.position.x - _position.x;
    const yDelta = objects.basic.position.y - _position.y;
    objects.text.children.forEach((text) => {
      MoveObject().startMoving(
        text,
        new Vector3(
          text.position.x - xDelta,
          text.position.y - yDelta,
          templateLayers.title.z,
        ),
      );
    });

    MoveObject().startMoving(objects.basic, templateLayers.centerCircle);
    for (const _child of objects.progress.ring[0].children) {
      const index = objects.progress.ring[0].children.indexOf(_child);
      if (index != objects.progress.ring[0].children.length - 1) {
        MoveObject().startMoving(
          _child,
          new Vector3(
            storyCirclePositions.frameDots[index].x,
            storyCirclePositions.frameDots[index].y,
            _position.z,
          ),
        );
      }
    }
    MoveObject().startMoving(
      objects.progress.ring[0].children[objects.progress.ring[0].children.length - 1],
      new Vector3(
        templateLayers.progressCircle.x,
        templateLayers.progressCircle.y,
        _position.z,
      ),
    );
    MoveObject().startMoving(objects.shade, templateLayers.shadedCircle);
    objects.progress.dots.forEach((_dot, index) => {
      MoveObject().startMoving(
        _dot.dot,
        new Vector3(
          storyCirclePositions.frameDots[index].x,
          storyCirclePositions.frameDots[index].y,
          _position.z,
        ),
      );
      if (_dot.innerDot) {
        MoveObject().startMoving(
          _dot.innerDot,
          new Vector3(
            storyCirclePositions.frameDots[index].x,
            storyCirclePositions.frameDots[index].y,
            _position.z,
          ),
        );
      }
    });
  };

  return { activeStoryCircle };
};

export const getSizeStoryText = (storyText: Mesh | Group) => {
  const box = new Box3().setFromObject(storyText);
  const textSize = box.getSize(new Vector3());

  return textSize;
};

export const centerStoryText = (storyText: Mesh | Group, onlyX: boolean = false) => {
  const textSize = getSizeStoryText(storyText);
  storyText.position.x = storyText.position.x - textSize.x / 2;
  if (!onlyX) storyText.position.y = storyText.position.y - textSize.y / 2;
};

export default MoveHelper;
