import { Group } from 'three';
import Frame1 from '@/frames/Frame1';
import Defaults from './defaults.config';
import StoryPaused from '@/frames/StoryPaused';
import GroupHelper from './GroupHelper';
import TestData from './TestData';

const usePredefined = (): {
  BaseStoryCircle: (
    title: string,
    storyItems: Record<string, string>,
    showWords: true | false,
  ) => Array<Group>;
  PausedStories: () => Array<Group>;
} => {
  const BaseStoryCircle = (
    title: string,
    storyItems: Record<string, string>,
    showWords: true | false,
  ) => {
    const frame1 = Frame1().Create(title, storyItems, showWords, Defaults().Circle());

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
