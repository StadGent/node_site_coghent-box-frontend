export type Tag = {
  tag: string,
  object: any,
  id?: string,
  context?: string,
}
export enum Tags {
  ActiveStoryCircleBasic,
  ActiveStoryCircleShade,
  ActiveStoryCircleText,
  ActiveStoryCircleFrameDot,
  ActiveStoryCircleFrameDotCheckmark,
  ActiveStoryCircleFrameInnerDot,
  ActiveStoryCircleFrameRing,
  StoryCircleBasic,
  StoryCircleShade,
  StoryCircleText,
  StoryCircleFrameDot,
  StoryCircleFrameDotCheckmark,
  StoryCircleFrameInnerDot,
  StoryCircleFrameRing,
  Spotlight,
  Asset,
  GroupOfAssets,
  Video,
  Countdown,
  menuVideo,
  PauseScreenStoryCircle,
  PauseScreenCenterText,
  PauseScreenBanner,
  FrameTitle,
  XAxis,
  YAxis,
  Dot,
  HorizontalProgressBar,
  EndOfSession,
  Testing,
  FrameProgressbar,
  startSessionVideo,
  startSessionText,
  StartOfSessionRing,
  StartOfSessionProgressRing,
  StartOfSessionCountdownNumber,
  SmallCountdownRing,
  SmallCountdownProgressRing,
  SmallCountdowndownNumber,
  HighlightedMetadata,
  Layer,
}

export default class TaggingService {
  public taggedObjects: Array<Tag>;

  constructor() {
    this.taggedObjects = [];
  }

  tag(tag: Tags, object: any, context?: string, id?: string) {
    this.taggedObjects.push({
      tag: Tags[tag],
      object: object,
      context: context || '',
      id: id || '',
    } as Tag);
  }

  removeTaggedObject(_object: any) {
    const tags = this.taggedObjects.filter(_taggedObject => _taggedObject.object == _object);
    const index = this.taggedObjects.indexOf(tags[0]);
    if (index > -1) {
      this.taggedObjects.splice(index, 1);
    }
  }

  removeAllTagsFrom(_tag: Tags) {
    for (let index = 0;index < this.taggedObjects.length;index++) {
      if (this.taggedObjects[index].tag == Object.values(Tags)[_tag]) {
        this.taggedObjects.splice(index, 1)
      }
    }
  }

  getByTag(tag: Tags) {
    return this.taggedObjects.filter(_object => _object.tag == Tags[tag]);
  }
  getByTagsId(id: string){
    return this.taggedObjects.filter(_tag => _tag.id == id);
  }

  tagAlreadyInList(_searchTag: Tags){
    return this.taggedObjects.filter(_tag => _tag.tag == Tags[_searchTag]).length > 0;
  }

  idAlreadyInList(_id: string){
    return this.taggedObjects.filter(_tag => _tag.id == _id).length > 0;
  }

  clearTaggedObjects() {
    this.taggedObjects = [];
  }

  retag(oldTag: Tags, tag: Tags){
    const oldItems = this.taggedObjects.filter(_objects => _objects.tag == Tags[oldTag]);
    oldItems.forEach(_item => {
      _item.tag = Tags[tag];
    })
  }
}