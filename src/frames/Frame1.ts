import { CircleSchema } from '@/Three/CircleSchema';
import GroupHelper from '@/Three/GroupHelper';
import { Group } from 'three';
import StoryCircle from './StoryCircle';
import StoryCircleItems from './StoryCircleItems';

const Frame1 = (): {
  Create: (
    title: string,
    storyitems: Record<string, string>,
    showWords: true | false,
    middleCircleSchema: CircleSchema,
  ) => Array<Group>;
} => {
  const groupHelper = GroupHelper();

  const Create = (
    title: string,
    storyitems: Record<string, string>,
    showWords: true | false,
    circleSchema: CircleSchema,
  ) => {
    const groups: Array<Group> = [];
    groupHelper.AddObjectsTogroups([StoryCircle().Create(title, circleSchema)], groups);
    groupHelper.AddObjectsTogroups(
      StoryCircleItems().Create(storyitems, showWords),
      groups,
    );
    return groups;
  };

  return { Create };
};
export default Frame1;
