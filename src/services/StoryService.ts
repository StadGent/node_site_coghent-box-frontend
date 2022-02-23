import { apolloClient } from '@/main';
import { Frame, Story } from '@/models/GraphqlModel';
import Colors from '@/Three/defaults.color';
import Defaults from '@/Three/defaults.config';
import Positions from '@/Three/defaults.positions';
import { BoxVisiter, boxVisiter, useBoxVisiter } from 'coghent-vue-3-component-library';
import { Relation } from 'coghent-vue-3-component-library/lib/queries';
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
  private storyIds: Array<string>;
  private totalOfSeenFrames: number;

  stories: Array<Story>;
  visiterCode: string;
  activeStory!: Story;
  activeStoryData!: StoryData;


  constructor(_stories: Array<Story>, _visiterCode: string) {
    this.stories = _stories;
    this.visiterCode = _visiterCode;
    this.storyIds = [];
    this.storyData = [];
    this.totalOfSeenFrames = 0;
    useBoxVisiter(apolloClient).getByCode(this.visiterCode)
    this.fillUpDataSources();
    this.assignColorToStories();
  }

  getStoryData() {
    return this.storyData;
  }

  setActiveStory(_id: string) {
    this.activeStory = this.stories.filter(_story => _story.id == _id)[0];
    this.activeStoryData = this.storyData.filter(_data => _data.storyId == _id)[0];
  }

  getTotalOfSeenFrames() {
    return this.totalOfSeenFrames;
  }

  getStoryDataOfStory(storyId: string) {
    return this.storyData.filter((data) => data.storyId == storyId)[0];
  }

  getStoryColor(storyId: string) {
    return this.storyData.filter((data) => data.storyId == storyId)[0].storyColor;
  }

  async updateSeenFramesOfStory(currentStoryId: string, seenFrame: Frame) {
    await this.storyIsAddedToVisiter(currentStoryId)
    if (this.storyData.length > 0 && seenFrame != undefined) {
      const storyToUpdate = this.storyData.filter(
        (story) => story.storyId === currentStoryId,
      )[0];
      this.totalOfSeenFrames++;
      if (!this.itemIsInRecord(currentStoryId, seenFrame)) {
        this.addTimestampToSeenFrame(currentStoryId, seenFrame);
        storyToUpdate['totalOfFramesSeen'] = Object.keys(storyToUpdate.seenFrames).length;
      }
      await useBoxVisiter(apolloClient).addFrameToStory(this.visiterCode, {
        storyId: currentStoryId,
        frameId: seenFrame.id,
      } as any)
      storyToUpdate['storySeen'] = this.IHaveSeenTheStory(currentStoryId);
    }
    return this.storyData;
  }

  storyIsSeen(storyId: string) {
    return this.storyData.filter((data) => data.storyId == storyId)[0].storySeen;
  }

  isEndOfSession() {
    return this.totalOfSeenFrames == Defaults().maxFrames()
  }

  setStoryPausedPositions(positions: Array<Vector3>) {
    this.storyData.map((_data, index) => {
      _data['pausedPosition'] = positions[index];
    })
  }

  getDataOfInactiveStories() {
    return this.storyData.filter(_data => _data.storyId != this.activeStory.id);
  }

  setStoryColor() {
    if (this.activeStoryData.storySeen) {
      this.storyData.filter(_data => _data.storyId == this.activeStoryData.storyId)[0]['storyColor'] = Colors().grey;
    }
  }

  storyIsActive(_storyId: string) {
    return this.activeStoryData.storyId == _storyId;
  }

  private itemIsInRecord(storyId: string, frame: Frame) {
    const rec = this.getStoryDataOfStory(storyId).seenFrames;
    let exists = false;
    for (const key in rec) {
      if (frame == rec[key]) {
        exists = true;
      }
    }
    return exists;
  }

  private addTimestampToSeenFrame(storyId: string, frame: Frame) {
    const timestamp = new Date().toLocaleString();
    this.getStoryDataOfStory(storyId).seenFrames[timestamp] = frame;
  }

  private assignColorToStories() {
    if (this.storyData.length > 0) {
      for (let index = 0;index < this.storyData.length;index++) {
        this.storyData[index]['storyColor'] = Defaults().StoryColors()[index];
      }
    }
  }

  private IHaveSeenTheStory(storyId: string) {
    const story = this.storyData.filter((story) => story.storyId === storyId)?.[0];
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

  private createStoryDataObject(story: Story, index: number) {
    return {
      storyId: story.id,
      totalOfFrames: story.frames.length,
      seenFrames: {} as Record<string, Frame>,
      totalOfFramesSeen: 0,
      storySeen: false,
      storyColor: Colors().white,
      pausedPosition: Positions().StoryPausePositions()[index],
    } as StoryData;
  }

  private addStoryIdToStoryIds(story: Story) {
    this.storyIds.push(story.id);
  }

  private async storyIsAddedToVisiter(_storyId: string): Promise<boolean> {
    let isCreated = false
    if (boxVisiter.relations) {
      const matches = boxVisiter.relations.filter((_relation: Relation) => _relation.key.replace('entities/', '') == _storyId)
      if (matches.length == 0) {
        await useBoxVisiter(apolloClient).addStoryToVisiter(this.visiterCode, {
          key: _storyId,
          active: true,
          last_frame: ''
        } as any)
        isCreated = true
      }
    }
    return isCreated
  }
}
