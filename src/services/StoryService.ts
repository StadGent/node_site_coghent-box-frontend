import { Frame, Story } from '@/models/GraphqlModel';

export type StoryData = {
  storyId: string;
  amountOfFrames: number;
  seenFrames: Array<Frame>;
  framesSeen: number;
  storySeen: boolean;
};
export default class StoryService {
  private stories: Array<Story> = [];
  private storyIds: Array<string> = [];
  storyData: Array<StoryData> = [];

  constructor(_stories: Array<Story>) {
    this.stories = _stories;
    this.fillUpDataSources();
  }

  private fillUpDataSources() {
    if (this.stories.length > 0) {
      this.stories.map((story) => {
        this.addStoryIdToStoryIds(story);
        this.storyData.push(this.createStoryDataObject(story));
      });
    }
  }

  private createStoryDataObject (story: Story) {
    return {
      storyId: story.id,
      amountOfFrames: story.frames.length,
      seenFrames: [],
      framesSeen: 0,
      storySeen: false,
    } as StoryData
  }

  private addStoryIdToStoryIds(story: Story) {
    this.storyIds.push(story.id);
  }

  updateSeenFramesOfStory(currentStoryId: string, seenFrame: Frame, storySeen: boolean) {
    if(this.storyData.length > 0){
      const storyToUpdate = this.storyData.filter(story => story.storyId === currentStoryId)[0];
      if(storyToUpdate.seenFrames.includes(seenFrame)){
        storyToUpdate['seenFrames'].push(seenFrame);
        storyToUpdate['framesSeen'] = storyToUpdate.seenFrames.length;
      }      
      storyToUpdate['storySeen'] = storySeen; 
    }
  }
}
