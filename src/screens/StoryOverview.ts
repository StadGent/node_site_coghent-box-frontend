import { CircleSchema } from '@/Three/CircleSchema';
import GroupHelper from '@/Three/GroupHelper';
import { Group, Vector3 } from 'three';
import StoryCircle from '@/Three/SectionStoryCircle';
import StoryCircleItems from '@/Three/SectionStoryCircleItems';
import { CubeSchema } from '@/Three/CubeSchema';

const StoryOverview = (): {
  Create: (
    title: string,
    storyitems: Record<string, string>,
    centerWords: Record<string, Vector3>,
    showWords: true | false,
    middleCircleSchema: CircleSchema,
  ) => { groups: Array<Group>; schemas: Array<CubeSchema> };
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
      schemas: StoryCircleItems().Create(storyitems, showWords).schemas,
    };
  };

  return { Create };
};
export default StoryOverview;
