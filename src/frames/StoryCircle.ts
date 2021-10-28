import SchemaCircle, { CircleSchema } from '@/Three/CircleSchema';
import { CubeParams } from '@/Three/CubeSchema';
import Defaults from '@/Three/defaults.config';
import GroupHelper from '@/Three/GroupHelper';
import TextHelper from '@/Three/TextHelper';
import SchemaText, { TextSchema } from '@/Three/Textschema';
import { Group, Vector3 } from 'three';

const StoryCircle = (): {
  Create: (
    title: string,
    middleCircleSchema: CircleSchema,
    distanceFromCircle?: number,
  ) => Group;
} => {
  const circle_schema = SchemaCircle();
  const text_schema = SchemaText();

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
    storyTitle.position.x += 2;
    return storyTitle;
  };

  const Create = (
    storyTitle: string,
    circleSchema: CircleSchema,
    distanceFromCircle?: number,
  ) => {
    const group: Group = GroupHelper().CreateGroup([
      main(circleSchema),
      title(storyTitle, circleSchema.position, circleSchema.params.color || 0x02a77f),
      outer(circleSchema, distanceFromCircle),
    ]);
    return group;
  };

  return { Create };
};

export default StoryCircle;
