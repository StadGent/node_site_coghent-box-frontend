import { Entity } from 'coghent-vue-3-component-library/lib/queries';
import { Vector3 } from 'three';
import Defaults from '@/Three/defaults.config';
import Common from '@/composables/common';
import { Asset, Story } from '@/models/GraphqlModel';

const useStory = (): {
  setActiveStory: (stories: Array<Story>, story: number) => Story;
  title: (activeStory: Story) => string;
  setFrameTitles: (activeStory: Story) => Array<string>;
  setFrameAssets: (activeStory: Story, frame: number) => Record<string, string>;
  GetStoryTitles: (stories: Array<Story>) => Array<string>;
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

    // return 'Story Title';
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
      centerWords[word] = Defaults().CenterWordPositions()[index];
    });
    return centerWords;
  };

  return {
    setActiveStory,
    title,
    setFrameTitles,
    setFrameAssets,
    Title,
    GetStoryTitles,
    RelationIds,
    CreateCenterWords,
  };
};

export default useStory;
