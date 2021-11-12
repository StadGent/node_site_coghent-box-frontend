import { CircleSchema } from '@/Three/CircleSchema';
import GroupHelper from '@/Three/GroupHelper';
import { Group, Vector3 } from 'three';
import StoryCircle from '@/Three/SectionStoryCircle';
import StoryCircleItems from '@/Three/SectionStoryCircleItems';

const StoryOverview = (): {
  Create: (
    title: string,
    storyitems: Record<string, string>,
    centerWords: Record<string, Vector3>,
    showWords: true | false,
    middleCircleSchema: CircleSchema,
  ) => { groups: Array<Group>; imagePositions: Array<Vector3> };
} => {
  const groupHelper = GroupHelper();

  const Create = (
    title: string,
    storyitems: Record<string, string>,
    centerWords: Record<string, Vector3>,
    showWords: true | false,
    circleSchema: CircleSchema,
  ) => {
    const groups: Array<Group> = [];
    groupHelper.AddObjectsTogroups(
      [StoryCircle().Create(title, circleSchema, 1, centerWords)],
      groups,
    );
    groupHelper.AddObjectsTogroups(
      StoryCircleItems().Create(storyitems, showWords).groups,
      groups,
    );
    return {
      groups: groups,
      imagePositions: StoryCircleItems().Create(storyitems, showWords).imagePositions,
    };
  };

  return { Create };
};
export default StoryOverview;
