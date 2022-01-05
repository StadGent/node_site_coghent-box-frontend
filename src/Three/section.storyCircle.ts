import SchemaCircle, { CircleSchema } from '@/Three/schema.circle';
import SchemaCube, { CubeParams } from '@/Three/schema.cube';
import DefaultColors from '@/Three/defaults.color';
import GroupHelper from '@/Three/helper.group';
import TextHelper from '@/Three/helper.text';
import { FontParams } from '@/Three/schema.text';
import { Group, Mesh, Vector3 } from 'three';
import CubeHelper from './helper.cube';
import Layers from './defaults.layers';
import customText from './defaults.text';
import CircularprogressBar from '@/Three/shapes.circularProgressbar';
import Colors from '@/Three/defaults.color';
import Measurements from './defaults.measurements';

export type StoryCircleParams ={
  radius: number;
  outerCircle: number;
}

const StoryCircle = (): {
  progressText: (
    progressState: [number, number],
    position: Vector3,
    color: number,
  ) => Mesh;
  Create: (
    title: string,
    circleSchema: CircleSchema,
    progressState: [number, number],
    iconUrl: string,
    showProgress: true | false,
    showShadedCircle: true | false,
  ) => Array<Group>;
} => {
  const main = (schema: CircleSchema) => {
    return SchemaCircle().CreateCircle(schema);
  };
  const shadedCircle = (schema: CircleSchema) => {
    schema.params.radius = Measurements().storyCircle.outerCircle;
    schema.params.color = schema.params.color || Colors().green;
    schema.params.opacity = 0.4;
    schema.position.z = schema.position.z - Layers.fraction;
    return SchemaCircle().CreateCircle(schema, true);
  };

  const icon = (position: Vector3, url: string) => {
    const schema = CubeHelper().CreateSchema(position, url, new Vector3(1, 1, 0));
    return SchemaCube().CreateImageCube(schema);
  };

  const progressText = (
    progressState: [number, number],
    position: Vector3,
    color: number,
  ) => {
    const progress = TextHelper().CreateText(
      `Deel ${progressState[0]} van ${progressState[1]}`,
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
    showProgress: true | false,
    showShadedCircle: true | false,
  ) => {

    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups([main(circleSchema)], groups);
    GroupHelper().AddObjectsTogroups(
      [
        main(circleSchema),
        title(
          storyTitle,
          new Vector3(
            circleSchema.position.x,
            circleSchema.position.y - 1,
            Layers.presentation,
          ),
          circleSchema.params.color || DefaultColors().green,
        ),
        progressText(
          progressState,
          new Vector3(
            circleSchema.position.x,
            circleSchema.position.y - 0.5,
            Layers.presentation,
          ),
          circleSchema.params.color || DefaultColors().green,
        ),
        icon(
          new Vector3(
            circleSchema.position.x,
            circleSchema.position.y + 1.2,
            Layers.presentation - 0.1,
          ),
          iconUrl,
        ),
      ],
      groups,
    );
    if (showShadedCircle) {
      GroupHelper().AddObjectsTogroups([shadedCircle(circleSchema)], groups);
    }
    if (showProgress) {
      GroupHelper().AddObjectsTogroups(
        [CircularprogressBar().create(circleSchema.position, Measurements().progressBar.radius, 1, 1)],
        groups,
      );
    }
    return groups;
  };

  return { progressText, Create };
};

export default StoryCircle;
