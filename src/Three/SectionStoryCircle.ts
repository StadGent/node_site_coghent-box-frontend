import SchemaCircle, { CircleSchema } from '@/Three/CircleSchema';
import SchemaCube, { CubeParams } from '@/Three/CubeSchema';
import DefaultColors from '@/Three/defaults.color';
import GroupHelper from '@/Three/GroupHelper';
import TextHelper from '@/Three/TextHelper';
import { FontParams } from '@/Three/Textschema';
import { Group, Vector3 } from 'three';
import CubeHelper from './CubeHelper';
import customText from './defaults.text';
// import { CurveModifier } from 'three/examples/jsm/modifiers/CurveModifier.js';

const StoryCircle = (): {
  Create: (
    title: string,
    circleSchema: CircleSchema,
    progressState: [number, number],
    iconUrl: string,
  ) => Group;
} => {
  const main = (schema: CircleSchema) => {
    return SchemaCircle().CreateCircle(schema);
  };
  const outer = (schema: CircleSchema) => {
    return SchemaCircle().CreateOuterCircle(
      schema.params.radius + 1,
      schema.position,
      schema.params.color,
    );
  };

  const icon = (position: Vector3, url: string) => {
    const schema = CubeHelper().CreateSchema(position, url, new Vector3(1, 1, 0));
    return SchemaCube().CreateImageCube(schema);
  };

  const progress = (title: string, position: Vector3, color: number) => {
    const progress = TextHelper().CreateText(
      title,
      position,
      {
        color: color,
        width: 0,
      } as CubeParams,
      { size: customText.size.smaller } as FontParams,
    );
    return progress;
  };

  const title = (title: string, position: Vector3, color: number) => {
    const storyTitle = TextHelper().CreateText(
      title,
      position,
      {
        color: color,
        width: 0,
      } as CubeParams,
      { size: customText.size.small } as FontParams,
    );
    return storyTitle;
  };

  const Create = (
    storyTitle: string,
    circleSchema: CircleSchema,
    progressState: [number, number],
    iconUrl: string,
  ) => {
    const group: Group = GroupHelper().CreateGroup([
      main(circleSchema),
      title(
        storyTitle,
        new Vector3(circleSchema.position.x, circleSchema.position.y - 1, 0),
        circleSchema.params.color || DefaultColors().green,
      ),
      progress(
        `Deel ${progressState[0]} van ${progressState[1]}`,
        new Vector3(circleSchema.position.x, circleSchema.position.y - 0.5, 0),
        circleSchema.params.color || DefaultColors().green,
      ),
      icon(
        new Vector3(circleSchema.position.x, circleSchema.position.y + 1.2, 0),
        iconUrl,
      ),
    ]);
    return group;
  };

  return { Create };
};

export default StoryCircle;
