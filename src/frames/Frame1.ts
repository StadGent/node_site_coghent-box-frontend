import ChapeHelper from '@/Three/Chapehelper';
import { CircleSchema } from '@/Three/CircleSchema';
import CubeHelper from '@/Three/CubeHelper';
import SchemaCube from '@/Three/CubeSchema';
import Defaults from '@/Three/defaults.config';
import GroupHelper from '@/Three/GroupHelper';
import SchemaLine, { LineSchema } from '@/Three/LineSchema';
import TextHelper from '@/Three/TextHelper';
import { Group, Mesh, Vector3 } from 'three';
import StoryCircle from './StoryCircle';
import StoryCircleItems from './StoryCircleItems';

const Frame1 = (): {
  Lines: (schemas: Array<LineSchema>) => Array<Group>;
  ImageCubes: (lines: Array<Group>) => Array<Mesh>;
  Words: (words: Record<string, Vector3>) => Array<Mesh>;
  Create: (
    lineSchemas: Array<LineSchema>,
    middleCircleSchema: CircleSchema,
    words: Record<string, Vector3>,
    isTextVisible: boolean,
  ) => Array<Group>;
} => {
  const chapeHelper = ChapeHelper();
  const cubeHelper = CubeHelper();
  const groupHelper = GroupHelper();
  const textHelper = TextHelper();

  const line_schema = SchemaLine();
  const cube_schema = SchemaCube();

  const defaults = Defaults();

  const Lines = (schemas: Array<LineSchema>) => {
    return line_schema.CreateLines(schemas);
  };

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

  const Words = (words: Record<string, Vector3>) => {
    return textHelper.CreateTextFromRecord(words);
  };

  const Create = (
    lineSchemas: Array<LineSchema>,
    circleSchema: CircleSchema,
    words: Record<string, Vector3>,
    isTextVisible = true,
  ) => {
    const groups: Array<Group> = [];
    // if (isTextVisible) {
    //   groupHelper.AddObjectsTogroups(Words(words), groups);
    // } else groupHelper.AddObjectsTogroups(ImageCubes(Lines(lineSchemas)), groups);

    // groupHelper.AddObjectsTogroups(Lines(lineSchemas), groups);
    groupHelper.AddObjectsTogroups(
      [StoryCircle().Create('My story', circleSchema)],
      groups,
    );
    groupHelper.AddObjectsTogroups(StoryCircleItems().Create(Object.keys(words)), groups);
    return groups;
  };

  return { Lines, ImageCubes, Words, Create };
};
export default Frame1;
