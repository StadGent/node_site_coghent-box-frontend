import SchemaCircle, { CircleParams, CircleSchema } from '@/Three/schema.circle';
import SchemaCube, { CubeParams } from '@/Three/schema.cube';
import DefaultColors from '@/Three/defaults.color';
import GroupHelper from '@/Three/helper.group';
import TextHelper from '@/Three/helper.text';
import { FontParams } from '@/Three/schema.text';
import { BufferGeometry, CircleGeometry, Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import CubeHelper from './helper.cube';
import Layers from './defaults.layers';
import CircularprogressBar from '@/Three/shapes.circularProgressbar';
import Colors from '@/Three/defaults.color';
import Measurements from './defaults.measurements';
import CircularProgressBar from '@/Three/shapes.circularProgressbar';
import StoryService from '@/services/StoryService';

export type StoryCircleParams = {
  radius: number;
  outerCircle: number;
};

export type StoryCircleObjects = {
  full?: Array<Group>;
  basic: Mesh<CircleGeometry, MeshBasicMaterial>,
  shade: Mesh<CircleGeometry, MeshBasicMaterial>,
  progress: Mesh<BufferGeometry, any>,
  frameDots: Array<Group>,
  text: Group,
};

const StoryCircle = (_storyService: StoryService): {
  Create: (
    title: string,
    circleSchema: CircleSchema,
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

  const progressDots = (_position: Vector3, _color: number, _segments: number, _currentFrame: number) => {
    return  CircularProgressBar().createActiveSegment(
      new Vector3(_position.x, _position.y, _position.z),
      Measurements().progressBar.radius,
      _segments,
      _currentFrame + 1,
      _color,
    ).object;
  };

  const Create = (
    storyTitle: string,
    circleSchema: CircleSchema,
    iconUrl: string,
  ) => {
    const dots = progressDots(
      circleSchema.position,
      circleSchema.params.color as number,
      _storyService.activeStory.frames.length,
      _storyService.activeStoryData.totalOfFramesSeen,
      );
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

    return {
      basic: basicCircle,
      shade: fadedCircle,
      progress: progressOfStory,
      frameDots: dots,
      text: storyText,
    };
  };

  return { Create };
};

export default StoryCircle;
