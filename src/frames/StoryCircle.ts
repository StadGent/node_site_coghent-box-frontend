import SchemaCircle, { CircleSchema } from '@/Three/CircleSchema';
import { CubeParams } from '@/Three/CubeSchema';
import DefaultColors from '@/Three/defaults.color';
import GroupHelper from '@/Three/GroupHelper';
import TextHelper from '@/Three/TextHelper';
import { Group, Vector3 } from 'three';

const StoryCircle = (): {
  Create: (
    title: string,
    middleCircleSchema: CircleSchema,
    distanceFromCircle?: number,
    centerWords?: Record<string, Vector3>,
  ) => Group;
} => {
  const circle_schema = SchemaCircle();

  const main = (schema: CircleSchema) => {
    return circle_schema.CreateCircle(schema);
  };
  const outer = (schema: CircleSchema, distanceFromCircle = 1) => {
    return circle_schema.CreateOuterCircle(
      schema.params.radius + distanceFromCircle,
      schema.position,
      schema.params.color,
    );
  };

  const title = (title: string, position: Vector3, color: number) => {
    const storyTitle = TextHelper().CreateText(title, position, {
      color: color,
      width: 0,
    } as CubeParams);
    return storyTitle;
  };

  const MiddleWords = (centerWords: Record<string, Vector3>) => {
    return GroupHelper().CreateGroup(
      TextHelper().CreateTextFromRecord(centerWords, DefaultColors().white),
    );
  };

  const Create = (
    storyTitle: string,
    circleSchema: CircleSchema,
    distanceFromCircle?: number,
    centerWords?: Record<string, Vector3>,
  ) => {
    const group: Group = GroupHelper().CreateGroup([
      MiddleWords(centerWords || {}),
      main(circleSchema),
      title(
        storyTitle,
        circleSchema.position,
        circleSchema.params.color || DefaultColors().green,
      ),
      outer(circleSchema, distanceFromCircle),
    ]);
    return group;
  };

  return { Create };
};

export default StoryCircle;
