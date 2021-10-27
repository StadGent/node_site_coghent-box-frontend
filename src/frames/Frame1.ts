import ChapeHelper from '@/Three/Chapehelper';
import { CircleSchema } from '@/Three/CircleSchema';
import CubeHelper from '@/Three/CubeHelper';
import SchemaCube from '@/Three/CubeSchema';
import Defaults from '@/Three/defaults.config';
import GroupHelper from '@/Three/GroupHelper';
import { Group, Mesh, Vector3 } from 'three';
import StoryCircle from './StoryCircle';
import StoryCircleItems from './StoryCircleItems';

const Frame1 = (): {
  ImageCubes: (lines: Array<Group>) => Array<Mesh>;
  Create: (
    title: string,
    middleCircleSchema: CircleSchema,
    words: Array<string>,
  ) => Array<Group>;
} => {
  const chapeHelper = ChapeHelper();
  const cubeHelper = CubeHelper();
  const groupHelper = GroupHelper();

  const cube_schema = SchemaCube();

  const defaults = Defaults();

  const ImageCubes = (lines: Array<Group>) => {
    const cubes: Array<Mesh> = [];
    lines.forEach((line) => {
      const cube = cube_schema.CreateImageCube(defaults.ImageCube());
      chapeHelper.SetPosition(
        {
          x: line.children[1].position.x + cubeHelper.GetCubeParams(cube).width / 2 + 0.1,
          y: line.children[1].position.y,
          z: 0,
        } as Vector3,
        cube,
      );
      cubes.push(cube);
    });
    return cubes;
  };

  const Create = (title: string, circleSchema: CircleSchema, words: Array<string>) => {
    const groups: Array<Group> = [];
    groupHelper.AddObjectsTogroups([StoryCircle().Create(title, circleSchema)], groups);
    groupHelper.AddObjectsTogroups(StoryCircleItems().Create(words), groups);
    return groups;
  };

  return { ImageCubes, Create };
};
export default Frame1;
