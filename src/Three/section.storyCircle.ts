import SchemaCircle, { CircleParams, CircleSchema } from '@/Three/schema.circle';
import SchemaCube, { CubeParams } from '@/Three/schema.cube';
import DefaultColors from '@/Three/defaults.color';
import TextHelper from '@/Three/helper.text';
import { FontParams } from '@/Three/schema.text';
import {
  BufferGeometry,
  CircleGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  Vector3,
  Box3,
} from 'three';
import CubeHelper from './helper.cube';
import Colors from '@/Three/defaults.color';
import Measurements from './defaults.measurements';
import StoryService, { StoryData } from '@/services/StoryService';
import PauseProgressbar, { PauseProgressbarObjects } from './shapes.pauseProgressbar';
import Template from './template.shapes';
import { centerStoryText, getSizeStoryText } from './helper.move';

export type StoryCircleParams = {
  radius: number;
  progressRadius: number;
  outerCircle: number;
  opacityShadedCircle: number;
  correctionText: number;
};

export type StoryCircleObjects = {
  full?: Array<Group>;
  basic: Mesh<CircleGeometry, MeshBasicMaterial>;
  shade?: Mesh<CircleGeometry, MeshBasicMaterial>;
  progress: PauseProgressbarObjects;
  text: Group;
};

export type LayersStoryCircle = {
  title: Vector3;
  centerCircle: Vector3;
  shadedCircle: Vector3;
  progressCircle: Vector3;
  progressDots: Vector3;
};

const StoryCircle = (
  _storyService: StoryService,
): {
  Create: (
    storyData: StoryData,
    title: string,
    circleSchema: CircleSchema,
    iconUrl: string,
  ) => Promise<StoryCircleObjects>;
  shadedCircle: (schema: CircleSchema) => Mesh<CircleGeometry, MeshBasicMaterial>;
  title: (title: string, position: Vector3, color: number) => Promise<Group>;
  progressOfFrames: (
    _position: Vector3,
    _color: number,
    _storyData: StoryData,
  ) => PauseProgressbarObjects;
} => {
  const main = (schema: CircleSchema) => {
    return SchemaCircle().CreateCircle(
      {
        position: Template().storyCircleLayers(schema.position).centerCircle,
        params: {
          color: schema.params.color,
          opacity: 1,
          radius: Measurements().storyCircle.radius,
        } as CircleParams,
      } as CircleSchema,
      false,
    );
  };
  const shadedCircle = (schema: CircleSchema) => {
    schema.params.radius = Measurements().storyCircle.outerCircle;
    schema.params.color = schema.params.color || Colors().green;
    schema.params.opacity = Measurements().storyCircle.opacityShadedCircle;
    schema.position = Template().storyCircleLayers(schema.position).shadedCircle;
    return SchemaCircle().CreateCircle(schema, true);
  };

  const icon = (position: Vector3, url: string) => {
    const schema = CubeHelper().CreateSchema(position, url, new Vector3(1, 1, 0));
    return SchemaCube().CreateImageCube(schema);
  };

  const title = async (title: string, position: Vector3, color: number) => {
    const titles = title.split('\n');
    const group = new Group();
    let prevSize: Vector3 = position;
    for (const title of titles.reverse()) {
      const storyTitle = await TextHelper().CreateText(
        title,
        new Vector3(
          position.x,
          position.y === prevSize.y ? position.y : position.y + Measurements().text.size.small + 10,
          position.z,
        ),
        {
          color: color,
          width: 0,
        } as CubeParams,
        { size: Measurements().text.size.small } as FontParams,
      );
      // centerStoryText(storyTitle, false);
      prevSize = getSizeStoryText(storyTitle);
      group.add(storyTitle);
    }
    centerStoryText(group);

    return group;
  };

  const progressOfFrames = (
    _position: Vector3,
    _color: number,
    _storyData: StoryData,
  ) => {
    return PauseProgressbar(_storyData).create({
      position: _position,
      params: {
        radius: Measurements().storyCircle.progressRadius,
        color: _color,
      } as CircleParams,
    } as CircleSchema);
  };

  const Create = async (
    storyData: StoryData,
    storyTitle: string,
    circleSchema: CircleSchema,
    iconUrl: string,
  ) => {
    const templateLayers = Template().storyCircleLayers(circleSchema.position);
    const fadedCircle = shadedCircle(circleSchema);
    const basicCircle = main(circleSchema);
    const progress = progressOfFrames(
      templateLayers.progressCircle,
      circleSchema.params.color || Colors().white,
      storyData,
    );
    const storyText = await title(
      storyTitle,
      new Vector3(templateLayers.title.x, templateLayers.title.y, templateLayers.title.z),
      circleSchema.params.color || DefaultColors().green,
    );

    return {
      basic: basicCircle,
      shade: fadedCircle,
      progress: progress,
      text: storyText,
    };
  };

  return { Create, shadedCircle, progressOfFrames, title };
};

export default StoryCircle;
