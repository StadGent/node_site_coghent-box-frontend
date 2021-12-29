export type Tag = {
  name: string,
  object: any,
  context?: string,
}

export default class TaggingService {
  public taggedObjects: Array<Tag>;

  constructor(){
    this.taggedObjects = [];
  }

  tag(name: string, object: any, context?: string){
    this.taggedObjects.push({
      name: name,
      object: object,
      context: context || '',
    } as Tag);
  }

  removeTag(name: string){
    const tags = this.taggedObjects.filter(_taggedObject => _taggedObject.name.includes(name));
    const index = this.taggedObjects.indexOf(tags[0]);
    if(index > -1){
      this.taggedObjects.splice(index, 1);
    }
  }
}