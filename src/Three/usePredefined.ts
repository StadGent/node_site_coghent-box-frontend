import { Group, Vector3 } from 'three';
import Defaults from './defaults.config';
import StoryPaused from '@/screens/StoryPaused';
import GroupHelper from './GroupHelper';
import StoryOverview from '@/screens/StoryOverview';

export type StoryType = {
  title: string;
  frames: Record<string, string>;
  centerWords: Record<string, Vector3>;
  frameImagePositions?: Array<Vector3>;
};

const usePredefined = (): {
  BaseStoryCircle: (
    story: StoryType,
    showWords: true | false,
  ) => { storyOverview: Array<Group>; imagePositions: Array<Vector3> };
  PausedStories: (storyTitles: Array<string>) => Array<Group>;
} => {
  const BaseStoryCircle = (story: StoryType, showWords: true | false) => {
    const storyOverview = StoryOverview().Create(
      story.title,
      story.frames,
      story.centerWords,
      showWords,
      Defaults().Circle(),
    );

    return {
      storyOverview: storyOverview.groups,
      imagePositions: storyOverview.imagePositions,
    };
  };

  const PausedStories = (storyTitles: Array<string>) => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups(StoryPaused().Create(storyTitles), groups);
    return groups;
  };

  return { BaseStoryCircle, PausedStories };
};

export default usePredefined;
