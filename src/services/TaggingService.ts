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
  ActiveStoryCircleProgress,
  ActiveStoryCircleFrameDots,
  StoryCircleBasic,
  StoryCircleShade,
  StoryCircleText,
  StoryCircleProgress,
  StoryCircleFrameDots,
  Highlight,
  Spotlight,
  Asset,
  GroupOfAssets,
  Video,
  Countdown,
  PauseScreenStoryCircle,
  PauseScreenCenterText,
  FrameTitle,
  XAxis,
  YAxis,
  Dot,
  Stories,
  HorizontalProgressBar,
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
  getByTagId(id: string){
    return this.taggedObjects.filter(_tag => _tag.id == id);
  }

  tagAlreadyInList(_searchTag: Tags){
    return this.taggedObjects.filter(_tag => _tag.tag == Tags[_searchTag]).length > 0;
  }

  clearTaggedObjects() {
    this.taggedObjects = [];
  }

  retag(oldTag: Tags, tag: Tags){
    const objects = this.getByTag(oldTag);
    const oldItems = this.taggedObjects.filter(_objects => _objects.tag == Tags[oldTag]);
    oldItems.forEach(_item => {
      _item.tag = Tags[tag];
    })

    // this.tag(tag,objects[0].object, objects[0].context ,objects[0].id);
    console.log('retagged object',this.getByTag(tag));
    console.log('taggedObjects after retag', this.taggedObjects);
  }
}