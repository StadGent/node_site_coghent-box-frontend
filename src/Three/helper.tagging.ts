import TaggingService, { Tags } from '@/services/TaggingService';
import { BufferGeometry, CircleGeometry, Group, Mesh, MeshBasicMaterial } from 'three';
import GroupHelper from './helper.group';
import { StoryCircleObjects } from './section.storyCircle';

const TaggingHelper = (_taggingService: TaggingService): {
  activeStoryCircle: () => StoryCircleObjects;
} => {

  const activeStoryCircle = () => {
    const basic = _taggingService.getByTag(Tags.ActiveStoryCircleBasic)[0].object as Mesh<CircleGeometry, MeshBasicMaterial>;
    const shade = _taggingService.getByTag(Tags.ActiveStoryCircleShade)[0].object as Mesh<CircleGeometry, MeshBasicMaterial>;
    const text = _taggingService.getByTag(Tags.ActiveStoryCircleText)[0].object as Group;
    const progress = _taggingService.getByTag(Tags.ActiveStoryCircleProgress)[0].object as Mesh<BufferGeometry, any>;
    const frameDots = _taggingService.getByTag(Tags.ActiveStoryCircleFrameDots)[0].object as Array<Group>;
    return {
      basic: basic,
      shade:shade,
      text: text,
      progress: progress,
      frameDots: frameDots,
    };
  };

  return {
    activeStoryCircle,
  }
}

export default TaggingHelper;