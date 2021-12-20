import { Frame, Story } from '@/models/GraphqlModel';
import Colors from '@/Three/defaults.color';
import Defaults from '@/Three/defaults.config';
import Positions from '@/Three/defaults.positions';
import { Vector3 } from 'three';

export type StoryData = {
  storyId: string;
  totalOfFrames: number;
  seenFrames: Record<string, Frame>;
  totalOfFramesSeen: number;
  storySeen: boolean;
  storyColor: number;
  pausedPosition: Vector3;
};

export default class StoryService {
  private storyData: Array<StoryData>;
  private stories: Array<Story>;
  private storyIds: Array<string>;
  private totalOfSeenFrames: number;
  private date = new Date();

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
      if(!this.itemIsInRecord(currentStoryId, seenFrame)){
        this.totalOfSeenFrames++;
        this.addTimestampToSeenFrame(currentStoryId, seenFrame);
        storyToUpdate['totalOfFramesSeen'] = Object.keys(storyToUpdate.seenFrames).length;
      }      
      storyToUpdate['storySeen'] = this.IHaveSeenTheStory(currentStoryId);
      storyToUpdate['storyColor'] = this.setStoryColor(storyToUpdate);
    }
  }

  storyIsSeen(storyId: string){
    return this.storyData.filter(data => data.storyId == storyId)[0].storySeen;
  }

  private itemIsInRecord(storyId: string, frame:Frame){
    const rec = this.getStoryDataOfStory(storyId).seenFrames
    let exists = false;
    for(const key in rec){
      if(frame == rec[key]){
         exists = true;
      }
    }
    return exists;
  }

  private addTimestampToSeenFrame(storyId: string, frame: Frame) {
    const timestamp = this.date.toLocaleString();
    this.getStoryDataOfStory(storyId).seenFrames[timestamp] = frame;
  }

  private setStoryColor(storyData: StoryData){
    let color = storyData.storyColor;
    if(storyData.storySeen){
      color = Colors().grey;
    }
    return color;
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
      this.stories.map((story, index) => {
        this.addStoryIdToStoryIds(story);
        this.storyData.push(this.createStoryDataObject(story, index));
      });
    }
  }

  private createStoryDataObject (story: Story, index: number) {
    return {
      storyId: story.id,
      totalOfFrames: story.frames.length,
      seenFrames: {} as Record<string, Frame>,
      totalOfFramesSeen: 0,
      storySeen: false,
      storyColor: Colors().white,
      pausedPosition: Positions().StoryPausePositions()[index],
    } as StoryData
  }

  private addStoryIdToStoryIds(story: Story) {
    this.storyIds.push(story.id);
  }
}