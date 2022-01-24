import TaggingService, { Tag, Tags } from '@/services/TaggingService';
import { BufferGeometry, CircleGeometry, Group, Mesh, MeshBasicMaterial, RingGeometry } from 'three';
import { StoryCircleObjects } from './section.storyCircle';
import { DotWithinDotObjects } from './shapes.dotWithinDot';
import { PauseProgressbarObjects } from './shapes.pauseProgressbar';

const TaggingHelper = (_taggingService: TaggingService): {
  getActiveStoryCircle: () => {
      basic: Mesh<CircleGeometry, MeshBasicMaterial>;
      shade?: Mesh<CircleGeometry, MeshBasicMaterial> | undefined;
      progress: PauseProgressbarObjects;
      text: Mesh<BufferGeometry, any>;
  };
  tagActiveStorycircleAsStoryCircle: () => void;
  tagStorycircleAsActiveStoryCircle: (_storyId: string) => void;
} => {
  const getActiveStoryCircle = () => {
    const basic = _taggingService.getByTag(Tags.ActiveStoryCircleBasic)[0].object as Mesh<CircleGeometry, MeshBasicMaterial>;
    let shade;
    _taggingService.getByTag(Tags.ActiveStoryCircleShade).length > 0? shade = _taggingService.getByTag(Tags.ActiveStoryCircleShade)[0].object as Mesh<CircleGeometry, MeshBasicMaterial>: undefined;
    const text = _taggingService.getByTag(Tags.ActiveStoryCircleText)[0].object as Mesh<BufferGeometry, any>;
    const frameDots = _taggingService.getByTag(Tags.ActiveStoryCircleFrameDot);
    const frameInnerDots = _taggingService.getByTag(Tags.ActiveStoryCircleFrameInnerDot);
    const frameRing = _taggingService.getByTag(Tags.ActiveStoryCircleFrameRing)[0].object as Mesh<RingGeometry, MeshBasicMaterial>;
    const dots: Array<DotWithinDotObjects> = [];
    for (let index = 0; index < frameDots.length; index++) {
     const _object = {
       dot: frameDots[index].object,
     } as DotWithinDotObjects;
     if(frameInnerDots[index]){
       _object['innerDot'] = frameInnerDots[index].object
     }
     dots.push(_object);      
    }
    return {
      basic: basic,
      shade: shade,
      text: text,
      progress: {
        ring: frameRing,
        dots: dots
      } as PauseProgressbarObjects,
    };
  };

  const tagActiveStorycircleAsStoryCircle = () => {
    _taggingService.retag(Tags.ActiveStoryCircleBasic, Tags.StoryCircleBasic);
    _taggingService.retag(Tags.ActiveStoryCircleFrameDot, Tags.StoryCircleFrameDot);
    _taggingService.retag(Tags.ActiveStoryCircleFrameInnerDot, Tags.StoryCircleFrameInnerDot);
    _taggingService.retag(Tags.ActiveStoryCircleFrameRing, Tags.StoryCircleFrameRing);
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
    StoryCircleFrameInnerDot,
    StoryCircleFrameRing,
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
        case inactive[4]:
          _taggingService.removeTaggedObject(_tag.object);
          _taggingService.tag(Tags.ActiveStoryCircleFrameInnerDot, _tag.object, _tag.context, _tag.id);
          break
        case inactive[5]:
          _taggingService.removeTaggedObject(_tag.object);
          _taggingService.tag(Tags.ActiveStoryCircleFrameRing, _tag.object, _tag.context, _tag.id);
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