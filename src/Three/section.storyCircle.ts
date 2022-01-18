import SchemaCircle, { CircleParams, CircleSchema } from '@/Three/schema.circle';
import SchemaCube, { CubeParams } from '@/Three/schema.cube';
import DefaultColors from '@/Three/defaults.color';
import GroupHelper from '@/Three/helper.group';
import TextHelper from '@/Three/helper.text';
import { FontParams } from '@/Three/schema.text';
import { BufferGeometry, CircleGeometry, Group, Material, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import CubeHelper from './helper.cube';
import Layers from './defaults.layers';
import CircularprogressBar from '@/Three/shapes.circularProgressbar';
import Colors from '@/Three/defaults.color';
import Measurements from './defaults.measurements';

export type StoryCircleParams = {
  radius: number;
  outerCircle: number;
};

export type StoryCircleObjects = {
  full?: Array<Group>;
  basic: Mesh<CircleGeometry, MeshBasicMaterial>,
  shade: Mesh<CircleGeometry, MeshBasicMaterial>,
  progress: Mesh<BufferGeometry, any>,
  text: Group,
};

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
  ) => StoryCircleObjects;
} => {
  const main = (schema: CircleSchema) => {
    return SchemaCircle().CreateCircle(
      {
        position: schema.position,
        params: {
          color: schema.params.color,
          opacity: 1,
          radius: Measurements().storyCircle.radius
        } as CircleParams
      } as CircleSchema, false);
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
      new Vector3(position.x, position.y, position.z + Layers.fraction - 0.05),
      {
        color: color,
        width: 0,
      } as CubeParams,
      { size: Measurements().text.size.smaller } as FontParams,
    );
    return progress;
  };

  const title = (title: string, position: Vector3, color: number) => {
    const storyTitle = TextHelper().CreateText(
      title,
      new Vector3(position.x, position.y, position.z + Layers.fraction - 0.05),
      {
        color: color,
        width: 0,
      } as CubeParams,
      { size: Measurements().text.size.small } as FontParams,
    );
    return storyTitle;
  };

  const Create = (
    storyTitle: string,
    circleSchema: CircleSchema,
    progressState: [number, number],
    iconUrl: string,
  ) => {
    const fullObject: Array<Group> = [];
    const fadedCircle = shadedCircle(circleSchema);
    const progressOfStory = CircularprogressBar().create(
      circleSchema.position,
      Measurements().progressBar.radius,
      1,
      1
    );
    const basicCircle = main(circleSchema);
    const storyText = GroupHelper().CreateGroup(
      [
        title(
          storyTitle,
          new Vector3(
            circleSchema.position.x - 1.5,
            circleSchema.position.y,
            circleSchema.position.z,
          ),
          circleSchema.params.color || DefaultColors().green,
        ),
        progressText(
          progressState,
          new Vector3(
            circleSchema.position.x - 1.5,
            circleSchema.position.y + 0.5,
            circleSchema.position.z,
          ),
          circleSchema.params.color || DefaultColors().green,
        ),
        //DEMO: Removed for demo
        // icon(
        //   new Vector3(
        //     circleSchema.position.x,
        //     circleSchema.position.y + 1.2,
        //     circleSchema.position.z,
        //   ),
        //   iconUrl,
        // ),
      ]);
    GroupHelper().AddObjectsTogroups(
      [
        basicCircle.clone(),
        fadedCircle.clone(),
        progressOfStory.clone(),
      ], fullObject);


    return {
      full: fullObject,
      basic: basicCircle,
      shade: fadedCircle,
      progress: progressOfStory,
      text: storyText,
    };
  };

  return { progressText, Create };
};

export default StoryCircle;
