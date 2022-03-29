import TaggingService, { Tag, Tags } from '@/services/TaggingService';
import { BufferGeometry, CircleGeometry, Group, Mesh, MeshBasicMaterial } from 'three';
import { DotWithinDotObjects } from './shapes.dotWithinDot';
import { PauseProgressbarObjects } from './shapes.pauseProgressbar';

const TaggingHelper = (
  _taggingService: TaggingService,
): {
  getActiveStoryCircle: () => {
    basic: Mesh<CircleGeometry, MeshBasicMaterial>;
    shade?: Mesh<CircleGeometry, MeshBasicMaterial> | undefined;
    progress: PauseProgressbarObjects;
    text: Group;
  };
  tagActiveStorycircleAsStoryCircle: () => void;
  tagStorycircleAsActiveStoryCircle: (_storyId: string) => void;
  getByTag: (_tag: Tags) => any | null
} => {
  const getActiveStoryCircle = () => {
    const basic = getByTag(Tags.ActiveStoryCircleBasic)

    let shade;
    _taggingService.getByTag(Tags.ActiveStoryCircleShade).length > 0
      ? (shade = _taggingService.getByTag(Tags.ActiveStoryCircleShade)[0].object as Mesh<
        CircleGeometry,
        MeshBasicMaterial
      >)
      : undefined;
    const text = getByTag(Tags.ActiveStoryCircleText)
    const frameDots = _taggingService.getByTag(Tags.ActiveStoryCircleFrameDot);
    const frameInnerDots = _taggingService.getByTag(Tags.ActiveStoryCircleFrameInnerDot);
    // const frameRing = _taggingService.getByTag(Tags.ActiveStoryCircleFrameRing)[0]
    //   .object as Array<Group>;
    const frameRing = getByTag(Tags.ActiveStoryCircleFrameRing)
    const dots: Array<DotWithinDotObjects> = [];
    for (let index = 0;index < frameDots.length;index++) {
      const _object = {
        dot: frameDots[index].object,
      } as DotWithinDotObjects;
      if (frameInnerDots[index]) {
        _object['innerDot'] = frameInnerDots[index].object;
      }
      dots.push(_object);
    }
    return {
      basic: basic,
      shade: shade,
      text: text,
      progress: {
        ring: frameRing,
        dots: dots,
      } as PauseProgressbarObjects,
    };
  };

  const getByTag = (_tag: Tags) => {
    let taggedObject: null | any = null
    const result = _taggingService.getByTag(_tag)
    if (result && result[0] && result[0].object) taggedObject = result[0].object
    return taggedObject
  }

  const tagActiveStorycircleAsStoryCircle = () => {
    _taggingService.retag(Tags.ActiveStoryCircleBasic, Tags.StoryCircleBasic);
    _taggingService.retag(Tags.ActiveStoryCircleFrameDot, Tags.StoryCircleFrameDot);
    _taggingService.retag(
      Tags.ActiveStoryCircleFrameInnerDot,
      Tags.StoryCircleFrameInnerDot,
    );
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
    _tags.forEach((_tag) => {
      switch (_tag.tag) {
        case inactive[0]:
          _taggingService.removeTaggedObject(_tag.object);
          _taggingService.tag(
            Tags.ActiveStoryCircleBasic,
            _tag.object,
            _tag.context,
            _tag.id,
          );
          break;
        case inactive[1]:
          _taggingService.removeTaggedObject(_tag.object);
          _taggingService.tag(
            Tags.ActiveStoryCircleShade,
            _tag.object,
            _tag.context,
            _tag.id,
          );
          break;
        case inactive[2]:
          _taggingService.removeTaggedObject(_tag.object);
          _taggingService.tag(
            Tags.ActiveStoryCircleText,
            _tag.object,
            _tag.context,
            _tag.id,
          );
          break;
        case inactive[3]:
          _taggingService.removeTaggedObject(_tag.object);
          _taggingService.tag(
            Tags.ActiveStoryCircleFrameDot,
            _tag.object,
            _tag.context,
            _tag.id,
          );
          break;
        case inactive[4]:
          _taggingService.removeTaggedObject(_tag.object[0]);
          _taggingService.tag(
            Tags.ActiveStoryCircleFrameInnerDot,
            _tag.object,
            _tag.context,
            _tag.id,
          );
          break;
        case inactive[5]:
          _taggingService.removeTaggedObject(_tag.object);
          _taggingService.tag(
            Tags.ActiveStoryCircleFrameRing,
            _tag.object,
            _tag.context,
            _tag.id,
          );
          break;
      }
    });
  };

  return {
    getActiveStoryCircle,
    tagActiveStorycircleAsStoryCircle,
    tagStorycircleAsActiveStoryCircle,
    getByTag,
  };
};

export default TaggingHelper;
