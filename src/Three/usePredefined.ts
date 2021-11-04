import { Group, Vector3 } from 'three';
import Frame1 from '@/frames/Frame1';
import Defaults from './defaults.config';
import StoryPaused from '@/frames/StoryPaused';
import GroupHelper from './GroupHelper';
import TestData from './TestData';
import ThreeService from '@/services/ThreeService';

const usePredefined = (): {
  BaseStoryCircle: (
    title: string,
    storyItems: Record<string, string>,
    centerWords: Record<string, Vector3>,
    showWords: true | false,
  ) => Array<Group>;
  PausedStories: (threeSvc: ThreeService) => Array<Group>;
} => {
  const BaseStoryCircle = (
    title: string,
    storyItems: Record<string, string>,
    centerWords: Record<string, Vector3>,
    showWords: true | false,
  ) => {
    const frame1 = Frame1().Create(
      title,
      storyItems,
      centerWords,
      showWords,
      Defaults().Circle(),
    );

    return frame1;
  };

  const PausedStories = (threeSvc: ThreeService) => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups(
      StoryPaused(threeSvc).Create(TestData().titles()),
      groups,
    );
    return groups;
  };

  return { BaseStoryCircle, PausedStories };
};

export default usePredefined;
