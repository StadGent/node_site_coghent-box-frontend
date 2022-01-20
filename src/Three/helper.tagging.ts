import TaggingService, { Tag, Tags } from '@/services/TaggingService';
import { BufferGeometry, CircleGeometry, Group, Mesh, MeshBasicMaterial } from 'three';
import { StoryCircleObjects } from './section.storyCircle';
import { PauseProgressbarObjects } from './shapes.pauseProgressbar';

const TaggingHelper = (_taggingService: TaggingService): {
  getActiveStoryCircle: () => {
      basic: Mesh<CircleGeometry, MeshBasicMaterial>;
      shade?: Mesh<CircleGeometry, MeshBasicMaterial> | undefined;
      progress: Array<Mesh>;
      text: Group;
  };
  tagActiveStorycircleAsStoryCircle: () => void;
  tagStorycircleAsActiveStoryCircle: (_storyId: string) => void;
} => {
  const getActiveStoryCircle = () => {
    const basic = _taggingService.getByTag(Tags.ActiveStoryCircleBasic)[0].object as Mesh<CircleGeometry, MeshBasicMaterial>;
    let shade;
    _taggingService.getByTag(Tags.ActiveStoryCircleShade).length > 0? shade = _taggingService.getByTag(Tags.ActiveStoryCircleShade)[0].object as Mesh<CircleGeometry, MeshBasicMaterial>: undefined;
    const text = _taggingService.getByTag(Tags.ActiveStoryCircleText)[0].object as Group;
    const frameDots = _taggingService.getByTag(Tags.ActiveStoryCircleFrameDot);
    const items = [];
    for (const _item of frameDots){
      items.push(_item.object);
    }
    console.log('frame dots when getting active', frameDots);
    return {
      basic: basic,
      shade: shade,
      text: text,
      progress: items,
    };
  };

  const tagActiveStorycircleAsStoryCircle = () => {
    _taggingService.retag(Tags.ActiveStoryCircleBasic, Tags.StoryCircleBasic);
    _taggingService.retag(Tags.ActiveStoryCircleFrameDot, Tags.StoryCircleFrameDot);
    _taggingService.retag(Tags.ActiveStoryCircleText, Tags.StoryCircleText);
    _taggingService.retag(Tags.ActiveStoryCircleShade, Tags.StoryCircleShade);
  };

  const tagStorycircleAsActiveStoryCircle = (_storyId: string) => {
    const objects = _taggingService.getByTagsId(_storyId);
    matchTags(objects);
  };

  enum inactive {
    StoryCircleBasic,
    StoryCircleShade,
    StoryCircleText,
    StoryCircleFrameDot,
  }

  const matchTags = (_tags: Array<Tag>) => {
    _tags.forEach(_tag => {
      switch (_tag.tag) {
        case inactive[0]:
          _taggingService.removeTaggedObject(_tag.object);
          _taggingService.tag(Tags.ActiveStoryCircleBasic, _tag.object, _tag.context, _tag.id);
          break
        case inactive[1]:
          _taggingService.removeTaggedObject(_tag.object);
          _taggingService.tag(Tags.ActiveStoryCircleShade, _tag.object, _tag.context, _tag.id);
          break
        case inactive[2]:
          _taggingService.removeTaggedObject(_tag.object);
          _taggingService.tag(Tags.ActiveStoryCircleText, _tag.object, _tag.context, _tag.id);
          break
        case inactive[3]:
          _taggingService.removeTaggedObject(_tag.object);
          _taggingService.tag(Tags.ActiveStoryCircleFrameDot, _tag.object, _tag.context, _tag.id);
          break
      }
    })
  }

  return {
    getActiveStoryCircle,
    tagActiveStorycircleAsStoryCircle,
    tagStorycircleAsActiveStoryCircle,
  }
}

export default TaggingHelper;