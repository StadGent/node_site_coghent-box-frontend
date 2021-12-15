import { Frame, Story } from '@/models/GraphqlModel';

export type StoryData = {
  storyId: string;
  totalOfFrames: number;
  seenFrames: Array<Frame>;
  totalOfFramesSeen: number;
  storySeen: boolean;
};

export default class StoryService {
  private storyData: Array<StoryData>;
  private stories: Array<Story>;
  private storyIds: Array<string>;
  private totalOfSeenFrames;

  constructor(_stories: Array<Story>) {
    this.stories = _stories;
    this.storyIds = [];
    this.storyData = [];
    this.totalOfSeenFrames = 0;
    this.fillUpDataSources();
  }

  getStoryData(){
    return this.storyData;
  }

  getTotalOfSeenFrames(){
    return this.totalOfSeenFrames;
  }

  updateSeenFramesOfStory(currentStoryId: string, seenFrame: Frame, storySeen: boolean) {
    if(this.storyData.length > 0){
      const storyToUpdate = this.storyData.filter(story => story.storyId === currentStoryId)[0];
      if(!storyToUpdate.seenFrames.includes(seenFrame)){
        this.totalOfSeenFrames++;
        storyToUpdate['seenFrames'].push(seenFrame);
        storyToUpdate['totalOfFramesSeen'] = storyToUpdate.seenFrames.length;
      }      
      storyToUpdate['storySeen'] = this.IHaveSeenTheStory(currentStoryId);
    }
  }

  private IHaveSeenTheStory(storyId: string){
    const story =this.storyData.filter(story => story.storyId === storyId)?.[0]
    return story.totalOfFramesSeen === story.totalOfFrames;
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
      totalOfFrames: story.frames.length,
      seenFrames: [],
      totalOfFramesSeen: 0,
      storySeen: false,
    } as StoryData
  }

  private addStoryIdToStoryIds(story: Story) {
    this.storyIds.push(story.id);
  }
}