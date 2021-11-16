import { Group, Vector3 } from 'three';
import Defaults from './defaults.config';
import StoryPaused from '@/screens/StoryPaused';
import GroupHelper from './GroupHelper';
import StoryOverview from '@/screens/StoryOverview';
import { Entity } from '@/models/GraphqlModel';
import { CubeSchema } from './CubeSchema';

export type StoryType = {
  title: string;
  frames: Array<Entity>;
  frameSchemas?: Array<CubeSchema>;
  framesRecord: Record<string, string>;
  centerWords: Record<string, Vector3>;
  frameImagePositions?: Array<Vector3>;
  HighlightAssetSchemas?: Array<CubeSchema>;
};

const usePredefined = (): {
  BaseStoryCircle: (
    story: StoryType,
    showWords: true | false,
  ) => { storyOverview: Array<Group>; schemas: Array<CubeSchema> };
  PausedStories: (currentStory: string, storyTitles: Array<string>) => Array<Group>;
} => {
  const BaseStoryCircle = (story: StoryType, showWords: true | false) => {
    const storyOverview = StoryOverview().Create(
      story.title,
      story.framesRecord,
      story.centerWords,
      showWords,
      Defaults().Circle(),
    );

    return {
      storyOverview: storyOverview.groups,
      schemas: storyOverview.schemas as Array<CubeSchema>,
    };
  };

  const PausedStories = (currentStory: string, storyTitles: Array<string>) => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups(
      StoryPaused().Create(currentStory, storyTitles),
      groups,
    );
    return groups;
  };

  return { BaseStoryCircle, PausedStories };
};

export default usePredefined;
