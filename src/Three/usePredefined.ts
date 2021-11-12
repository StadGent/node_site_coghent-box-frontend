import { Group, Vector3 } from 'three';
import Defaults from './defaults.config';
import StoryPaused from '@/screens/StoryPaused';
import GroupHelper from './GroupHelper';
import TestData from './TestData';
import ThreeService from '@/services/ThreeService';
import StoryOverview from '@/screens/StoryOverview';

const usePredefined = (): {
  BaseStoryCircle: (
    title: string,
    storyItems: Record<string, string>,
    centerWords: Record<string, Vector3>,
    showWords: true | false,
  ) => Array<Group>;
  PausedStories: () => Array<Group>;
} => {
  const BaseStoryCircle = (
    title: string,
    storyItems: Record<string, string>,
    centerWords: Record<string, Vector3>,
    showWords: true | false,
  ) => {
    const frame1 = StoryOverview().Create(
      title,
      storyItems,
      centerWords,
      showWords,
      Defaults().Circle(),
    );

    return frame1;
  };

  const PausedStories = () => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups(StoryPaused().Create(TestData().titles()), groups);
    return groups;
  };

  return { BaseStoryCircle, PausedStories };
};

export default usePredefined;
