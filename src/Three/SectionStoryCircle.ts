import SchemaCircle, { CircleSchema } from '@/Three/CircleSchema';
import SchemaCube, { CubeParams } from '@/Three/CubeSchema';
import DefaultColors from '@/Three/defaults.color';
import GroupHelper from '@/Three/GroupHelper';
import TextHelper from '@/Three/TextHelper';
import { FontParams } from '@/Three/Textschema';
import { Group, Mesh, Vector3 } from 'three';
import CubeHelper from './CubeHelper';
import Layers from './defaults.layers';
import customText from './defaults.text';
import CircularprogressBar from '@/Three/CircularProgressbar';
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
    return SchemaCircle().CreateCircle(schema, Layers.presentation);
  };
  const shadedCircle = (schema: CircleSchema) => {
    schema.params.radius = Measurements().storyCircle.outerCircle;
    schema.params.color = schema.params.color || Colors().green;
    schema.params.opacity = 0.4;
    return SchemaCircle().CreateCircle(schema, Layers.scene, true);
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
