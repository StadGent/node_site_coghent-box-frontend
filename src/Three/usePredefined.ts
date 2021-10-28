import { Group } from 'three';
import Frame1 from '@/frames/Frame1';
import Defaults from './defaults.config';
import StoryPaused from '@/frames/StoryPaused';
import GroupHelper from './GroupHelper';

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
    const titles = [
      'Het belang van\n godsdienst in\n het dagelijkse\n leven',
      'De komst van\n de Turkse\n handelaar',
      'Het Gravesteen\n doorheen de\n tijd',
      'Invloed van de\n Textielfabriek\n vroeger en nu',
    ];
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups(StoryPaused().Create(titles), groups);
    return groups;
  };

  return { BaseStoryCircle, PausedStories };
};

export default usePredefined;
