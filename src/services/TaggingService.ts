export type Tag = {
  tag: string,
  object: any,
  name?: string,
  context?: string,
}
export enum Tags {
  ActiveStoryCircleBasic,
  ActiveStoryCircleShade,
  ActiveStoryCircleText,
  ActiveStoryCircleProgress,
  ActiveStoryCircleFull,
  Highlight,
  Spotlight,
  Asset,
  GroupOfAssets,
  Video,
  Countdown,
  StoryCircle,
  FrameTitle,
  XAxis,
  YAxis,
  Dot,
  Stories,
  HorizontalProgressBar,
  CircularProgressBarDots,
  EndOfSession,
  TitleCircle,
  Testing,
  StoryEndText,
  FrameProgressbar,
  startSessionText,
  startOfSessionCountdown,
  HighlightedMetadata,
  ZoomSpotlight,
}

export default class TaggingService {
  public taggedObjects: Array<Tag>;

  constructor() {
    this.taggedObjects = [];
  }

  tag(tag: Tags, object: any, context?: string, name?: string) {
    this.taggedObjects.push({
      tag: Tags[tag],
      object: object,
      context: context || '',
      name: name || '',
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

  tagAlreadyInList(_searchTag: Tags){
    return this.taggedObjects.filter(_tag => _tag.tag == Tags[_searchTag]).length > 0;
  }

  clearTaggedObjects() {
    this.taggedObjects = [];
  }
}