import { Relation, Entity } from 'coghent-vue-3-component-library/lib/queries';
import { Vector3 } from 'three';
import Common from '@/composables/common';
import { ComponentMetadata, Story } from '@/models/GraphqlModel';
import Positions from '@/Three/defaults.positions';
import StoryService, { StoryData } from '@/services/StoryService';

const useStory = (_storyService: StoryService): {
  createStoryDataOfVisiter: (_storyRelations: Array<Relation>) => Array<StoryData>
  setActiveStory: (stories: Array<Entity>, storyID: string) => Entity | null;
  title: (activeStory: Entity) => string;
  setFrameTitles: (activeStory: Entity) => Array<string>;
  setFrameAssets: (activeStory: Entity, frame: number) => Record<string, string>;
  getStory: (storyId: string) => Entity;
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

  const createStoryDataOfVisiter = (_storyRelations: Array<Relation>) => {
    console.log({_storyRelations});
    
    const theData: Array<StoryData> = []
    if (_storyRelations.length > 0) {
      for (const _relation of _storyRelations) {
        if (_relation.seen_frames && _relation.seen_frames.length > 0) {
          const frameRecord: Record<string, string> = {}
          for (const _frame of _relation.seen_frames) {
            if (_frame?.date) {
              frameRecord[_frame?.date] = _frame.id
            }
          }
          const data = {
            seenFrames: frameRecord,
            totalOfFramesSeen: Object.keys(frameRecord).length,
            storySeen: Object.keys(frameRecord).length == _relation.total_frames ? true : false
          } as StoryData
          theData.push(data)
        }
      }
    }
    console.log('storyData from visiter', theData)
    return theData
  }

  const setActiveStory = (stories: Array<Entity>, storyID: string) => {
    let story = null;
    if (stories.length > 0) {
      for (const _story of stories) {
        if (_story.id == storyID) {
          story = _story
        }
      }
    } else {
      story = null
      console.log(`Couldn't set active story => story does not exist..`)
    }
    return story;
  };

  const title = (activeStory: Entity) => {
    let title = ''
    if (activeStory.title && activeStory.title[0]) {
      title = activeStory.title[0].value as string
    }
    return title;
  };

  const setFrameTitles = (activeStory: Entity) => {
    const titles: Array<string> = [];
    activeStory.frames?.forEach((frame) => {
      if (frame?.title && frame?.title[0]) {
        titles.push(frame?.title[0].value as string);
      }
    });
    return titles;
  };

  const setFrameAssets = (activeStory: Entity, frame: number) => {
    const frameAssets: Record<string, string> = {};
    if (activeStory.frames) {
      activeStory.frames[frame]?.assets?.forEach((asset: any) => {
        frameAssets[asset.title[0].value] = asset.mediafiles?.[0].original_file_location;
      });
    }
    return frameAssets;
  };

  const getStory = (storyId: string) => {
    const stories = _storyService.stories.filter(_story => _story.id == storyId);
    let story: Entity = {} as Entity;
    if (stories.length > 0) {
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
    createStoryDataOfVisiter,
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
