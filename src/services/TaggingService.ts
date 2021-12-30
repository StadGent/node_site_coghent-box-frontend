export type Tag = {
  tag: string,
  object: any,
  name?: string,
  context?: string,
}
export enum Tags {
  Highlight,
  Spotlight,
  Asset,
  GroupOfAssets,
  Video,
  Countdown,
  Text,
  StoryCircle,
  FrameTitle,
  XAxis,
  YAxis,
  Dot,
  Stories,
  HorizontalProgressBar,
  CircularProgressBar,
  EndOfSession,
  TitleCircle,
  Testing,
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

  clearTaggedObjects() {
    this.taggedObjects = [];
  }
}