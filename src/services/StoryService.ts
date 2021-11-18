import Story from '@/composables/story';
import { Entity } from 'coghent-vue-3-component-library/lib/queries';
import { Entity as _Entity } from '@/models/GraphqlModel';
import Frame from '@/composables/frame';
import Common from '@/composables/common';

type FrameItems = {
  entity: _Entity;
  title: string;
  image: string;
};

type FrameData = {
  frame: FrameItems;
  assets: Array<_Entity>;
};
type StoryData = {
  title: string;
  frames: Array<FrameData>;
};

export default class StoryService {
  stories: Entity[] = [];
  activeStory: Entity = {} as Entity;
  storyFrames: Array<_Entity> = [];

  async init(stories: Array<Entity>) {
    this.addStories(stories);
    this.activeStory = stories[0];
    this.storyFrames = await this.getFramesFromStory(this.activeStory);
    return this.createStoryData();
  }

  async addStories(stories: Array<Entity>) {
    this.stories = [...stories];
  }

  storyTitle(story: Entity) {
    return Story().Title(story);
  }

  async getFramesFromStory(story: Entity) {
    const frameIds = Story().RelationIds(story);
    return await Frame().GetFrames(frameIds);
  }

  async getAssetsFromFrame(frame: _Entity) {
    const components = await Common().GetRelationComponents(frame.id);
    const ids = Common().ComponentIds(components);
    const assets: Array<_Entity> = [];
    ids.forEach(async (id) => {
      const asset = await Common().GetEntityById(id);
      assets.push(asset.data.Entity);
    });
    return assets;
  }

  async createFrameDataForFrame(frame: _Entity) {
    return {
      frame: {
        entity: frame,
        title: Story().Title(frame),
        image: Frame().GetFrameMainImage(frame),
      },
      assets: await this.getAssetsFromFrame(frame),
    } as FrameData;
  }

  createFrameDataForFrames(frames: Array<_Entity>) {
    const frameDatas: Array<FrameData> = [];
    frames.forEach(async (frame) => {
      frameDatas.push(await this.createFrameDataForFrame(frame));
    });
    return frameDatas;
  }

  createStoryData() {
    return {
      title: this.storyTitle(this.activeStory),
      frames: this.createFrameDataForFrames(this.storyFrames),
    } as StoryData;
  }
}
