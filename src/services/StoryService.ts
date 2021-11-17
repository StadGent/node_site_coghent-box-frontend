import Story from '@/composables/story';
import { CubeSchema } from '@/Three/CubeSchema';
import { Entity } from 'coghent-vue-3-component-library/lib/queries';
import { Entity as _Entity } from '@/models/GraphqlModel';
import Frame from '@/composables/frame';
import { Vector3 } from 'three';

type FrameData = {
  frame: Entity;
  assets: [
    {
      asset: Entity;
      schema: CubeSchema;
    },
  ];
};
type StoryData = {
  title: string;
  frames: Array<FrameData>;
};

export default class StoryService {
  storyData: StoryData = {} as StoryData;
  stories: Array<Entity> = [];
  frames: Array<_Entity> = [];
  activeStory: Entity = {} as Entity;
  activeFrame: _Entity = {} as _Entity;
  activeAssets: Record<string, string> = {};
  activeFrameTitles: Array<string> = [];
  centerWords: Record<string, Vector3> = {};

  async addStories(stories: Array<Entity>) {
    this.stories = [...stories];
    this.activeStory = stories[0];
    console.log(`Added ${this.stories.length} stories to StoryData`);
    await this.setStoryData();
  }
  async setStoryData() {
    this.setActiveStory(this.stories[0]);
    await this.getFramesFromCurrentStory();
    await this.activeFrameAssets();
    this.setActiveFrameTitles();
    this.setCenterWords();
  }

  setActiveStory(activeStory: Entity) {
    this.activeStory = activeStory as Entity;
  }

  async getFramesFromCurrentStory() {
    const frameIds = Story().RelationIds(this.activeStory);
    let frames: Array<_Entity> = [];
    console.log('Frame IDS => ', frameIds);
    if (frameIds.length > 0) {
      frames = await Frame().GetFrames(frameIds);
      this.frames = frames;
      this.activeFrame = frames[0];
      console.log('Frames => ', frames);
    }
  }

  async activeFrameAssets() {
    this.activeAssets = await Frame().GetAssetsFromFrame(this.activeFrame.id);
    console.log('ActiveAssets => ', this.activeAssets);
  }

  setActiveFrameTitles() {
    this.activeFrameTitles = Frame().GetFrameTitles(this.frames);
    console.log('ActiveFrameTitles => ', this.activeFrameTitles);
  }

  setCenterWords() {
    this.centerWords = Story().CreateCenterWords(this.activeFrameTitles);
    console.log('center words => ', this.centerWords);
  }
}
