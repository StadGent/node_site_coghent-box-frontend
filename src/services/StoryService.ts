import Story from '@/composables/story';
import { CubeSchema } from '@/Three/CubeSchema';
import { Entity } from 'coghent-vue-3-component-library/lib/queries';
import { Entity as _Entity } from '@/models/GraphqlModel';
import Frame from '@/composables/frame';
import { Vector3 } from 'three';
import Common from '@/composables/common';

type FrameData = {
  frame: _Entity;
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
  activeFrame: _Entity = {} as _Entity;
  frameAssets: Array<_Entity> = [];

  async init(stories: Array<Entity>) {
    this.addStories(stories);
    this.activeStory = stories[0];

    console.log('storyTitle()');
    this.storyFrames = await this.getFramesFromStory(this.activeStory);
    this.activeFrame = this.storyFrames[0];
    console.log('getFramesFromStory()', frames);
    console.log('GetFrameTitles()', Frame().GetFrameTitles(this.storyFrames));
    console.log('GetFrameMainImage()', Frame().GetFrameMainImage(this.activeFrame));
    console.log('getAssetsFromFrame()');
    this.frameAssets = await this.getAssetsFromFrame(this.activeFrame);
    console.log('createStoryData()', this.createStoryData());
  }

  async addStories(stories: Array<Entity>) {
    this.stories = [...stories];
    console.info('addStories()', this.stories);
  }

  storyTitle(story: Entity) {
    return Story().Title(story);
  }

  async getFramesFromStory(story: Entity) {
    const frameIds = Story().RelationIds(story);
    console.log('RelationIds()', frameIds);
    return await Frame().GetFrames(frameIds);
  }

  async getAssetsFromFrame(frame: _Entity) {
    const components = await Common().GetRelationComponents(frame.id);
    const ids = Common().ComponentIds(components);
    const assets: Array<_Entity> = [];
    console.log('components', ids);
    ids.forEach(async (id) => {
      const asset = await Common().GetEntityById(id);
      assets.push(asset.data.Entity);
    });
    return assets;
  }

  async createFrameDataForFrame(frame: _Entity) {
    return {
      frame: frame,
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
