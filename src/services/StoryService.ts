import { Frame, Story } from '@/models/GraphqlModel';
import Colors from '@/Three/defaults.color';
import Defaults from '@/Three/defaults.config';

export type StoryData = {
  storyId: string;
  totalOfFrames: number;
  seenFrames: Array<Frame>;
  totalOfFramesSeen: number;
  storySeen: boolean;
  storyColor: number;
};

export default class StoryService {
  private storyData: Array<StoryData>;
  private stories: Array<Story>;
  private storyIds: Array<string>;
  private totalOfSeenFrames: number;

  constructor(_stories: Array<Story>) {
    this.stories = _stories;
    this.storyIds = [];
    this.storyData = [];
    this.totalOfSeenFrames = 0;
    this.fillUpDataSources();
    this.assignColorToStories();
  }

  getStoryData(){
    return this.storyData;
  }

  getTotalOfSeenFrames(){
    return this.totalOfSeenFrames;
  }

  getStoryDataOfStory(storyId: string){
    return this.storyData.filter(data => data.storyId == storyId)[0];
  }

  getStoryColor(storyId: string){
    return this.storyData.filter(data => data.storyId == storyId)[0].storyColor;
  }

  updateSeenFramesOfStory(currentStoryId: string, seenFrame: Frame) {
    if(this.storyData.length > 0 && seenFrame != undefined){
      const storyToUpdate = this.storyData.filter(story => story.storyId === currentStoryId)[0];
      if(!storyToUpdate.seenFrames.includes(seenFrame)){
        this.totalOfSeenFrames++;
        storyToUpdate['seenFrames'].push(seenFrame);
        storyToUpdate['totalOfFramesSeen'] = storyToUpdate.seenFrames.length;
      }      
      storyToUpdate['storySeen'] = this.IHaveSeenTheStory(currentStoryId);

    }
  }

  private assignColorToStories(){
    if(this.storyData.length >0){
      for (let index = 0; index < this.storyData.length; index++) {
        this.storyData[index]['storyColor'] = Defaults().StoryColors()[index] 
      }
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
      storyColor: Colors().white,
    } as StoryData
  }

  private addStoryIdToStoryIds(story: Story) {
    this.storyIds.push(story.id);
  }
}