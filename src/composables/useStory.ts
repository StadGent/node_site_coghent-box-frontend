import { Entity } from 'coghent-vue-3-component-library/lib/queries';
import { Vector, Vector3 } from 'three';
import Common from '@/composables/common';
import { Asset, ComponentMetadata, Story } from '@/models/GraphqlModel';
import Positions from '@/Three/defaults.positions';
import StoryService, { StoryData } from '@/services/StoryService';

const useStory = (_storyService: StoryService): {
  setActiveStory: (stories: Array<Story>, story: number) => Story;
  title: (activeStory: Story) => string;
  setFrameTitles: (activeStory: Story) => Array<string>;
  setFrameAssets: (activeStory: Story, frame: number) => Record<string, string>;
  getStory: (storyId: string) => Story;
  getStoriesWithTheirProgress: (stories: Array<Story>, storyData: Array<StoryData>) => Record<string, StoryData>;
  GetStoryTitles: (stories: Array<Story>) => Array<string>;
  getRelationMetadataOfFrames: (activeStoryData: Story) => Array<ComponentMetadata>;
  /**
   * old functions
   */
  Title: (entity: any) => string;
  RelationIds: (story: Entity) => Array<string>;
  CreateCenterWords: (words: Array<string>) => Record<string, Vector3>;
} => {
  const setActiveStory = (stories: Array<any>, story: number) => {
    return stories[story];
  };

  const title = (activeStory: Story) => {
    return activeStory.title[0].value;
  };

  const setFrameTitles = (activeStory: Story) => {
    const titles: Array<string> = [];
    activeStory.frames.forEach((frame) => {
      titles.push(frame.title[0].value);
    });
    return titles;
  };

  const setFrameAssets = (activeStory: Story, frame: number) => {
    const frameAssets: Record<string, string> = {};
    activeStory.frames[frame].assets.forEach((asset: Asset) => {
      frameAssets[asset.title[0].value] = asset.mediafiles?.[0].original_file_location;
    });
    return frameAssets;
  };

  const getStory = (storyId: string) => {
    const stories = _storyService.stories.filter(_story => _story.id == storyId);
    let story: Story = {} as Story;
    if(stories.length > 0){
      story = stories[0];
    }
    return story;
  }

  const getStoriesWithTheirProgress = (stories: Array<Story>, storyData: Array<StoryData>) => {
    const storyWithProgress: Record<string, StoryData> = {};
    stories.forEach((story,) => {
      storyWithProgress[story.id] = storyData.filter(data => data.storyId === story.id)[0]
    });
    return storyWithProgress;
  }

  /*
    Old Calls to get the story data
  
  */
  const Title = (entity: any) => {
    return entity.title?.[0]?.value ? entity.title?.[0]?.value : 'no title';
  };

  const GetStoryTitles = (stories: Array<Story>) => {
    const titles: Array<string> = [];
    stories.map((story) => {
      titles.push(Title(story));
    });
    return titles;
  };
  const RelationIds = (story: Entity) => {
    const ids: Array<string> = [];
    story.relations?.forEach((str) => {
      ids.push(Common().FilterOutIdAfterSlash(str?.key as string));
    });
    return ids;
  };

  const CreateCenterWords = (words: Array<string>) => {
    const centerWords: Record<string, Vector3> = {};
    words.forEach((word, index) => {
      centerWords[word] = Positions().CenterWordPositions()[index];
    });
    return centerWords;
  };

  const getRelationMetadataOfFrames = (activeStoryData: Story) => {
    return activeStoryData.relationMetadata as Array<ComponentMetadata>;
  }

  return {
    setActiveStory,
    title,
    setFrameTitles,
    setFrameAssets,
    getStory,
    getStoriesWithTheirProgress,
    Title,
    GetStoryTitles,
    RelationIds,
    CreateCenterWords,
    getRelationMetadataOfFrames,
  };
};

export default useStory;
