import Correction from '@/Three/Correction';
import CubeHelper from '@/Three/CubeHelper';
import SchemaCube, { CubeParams } from '@/Three/CubeSchema';
import DefaultColors from '@/Three/defaults.color';
import DefaultsHelper from '@/Three/DefaultsHelper';
import GroupHelper from '@/Three/GroupHelper';
import LineHelper from '@/Three/LineHelper';
import SchemaLine, { LineSchema } from '@/Three/LineSchema';
import TextHelper from '@/Three/TextHelper';
import { FontParams } from '@/Three/Textschema';
import { Group, Mesh, Vector3 } from 'three';
import StoryCircleChild from './SectionStoryCircleChild';

const StoryCircleItems = (): {
  Create: (
    storyItems: Record<string, string>,
    showWords: true | false,
  ) => { groups: Array<Group>; imagePositions: Array<Vector3> };
} => {
  const Lines = (items: number) => {
    const schemas: Array<LineSchema> = [];
    for (let i = 0; i < items; i++) {
      schemas.push(
        LineHelper().CreateSchema(
          DefaultsHelper().CircleConnectPoints(new Vector3(0, 0, 0))[i],
        ),
      );
    }
    return schemas;
  };

  const AddWordsToLine = (words: Array<string>) => {
    const allWords: Array<Mesh> = [];
    for (let i = 0; i < words.length; i++) {
      if (i < 3) {
        const t = TextHelper().CreateText(
          words[i],
          Correction().EndOfLineObjectPositionsRight(i),
          { width: 2, height: 1 } as CubeParams,
          { color: DefaultColors().green } as FontParams,
        );
        t.position.z = -1;
        allWords.push(t);
      } else {
        const t = TextHelper().CreateText(
          words[i],
          Correction().EndOfLineObjectPositionsRight(i),
          { width: 2, height: 1 } as CubeParams,
          { color: DefaultColors().green } as FontParams,
        );
        t.position.z = -1;
        allWords.push(t);
      }
    }
    return allWords;
  };

  const AddImagesToLine = (links: Array<string>) => {
    const cubes: Array<Mesh> = [];
    for (let i = 0; i < links.length; i++) {
      const position = Correction().CorrectImageBoxPositionRight(i);
      if (i < 3) {
        const schema = CubeHelper().CreateSchema(position, links[i]);
        cubes.push(SchemaCube().CreateImageCube(schema));
      } else {
        const schema = CubeHelper().CreateSchema(position, links[i]);
        cubes.push(SchemaCube().CreateImageCube(schema));
      }
    }
    // const val = StoryCircleChild().ConnectPointsNextImage(
    //   CubeHelper().GetCubesPositions(cubes),
    // );
    // const alcubes = cubes.concat(val.cubes);
    return { cubes: cubes, lines: undefined };
  };

  const Create = (storyItems: Record<string, string>, showWords: true | false) => {
    const groups: Array<Group> = [];
    let lines;
    if (Object.keys(storyItems).length > 5)
      lines = SchemaLine().CreateLines(
        Lines(DefaultsHelper().CircleConnectPoints(new Vector3(0, 0, 0)).length),
      );
    else lines = SchemaLine().CreateLines(Lines(Object.keys(storyItems).length));
    GroupHelper().AddObjectsTogroups(lines, groups);
    if (showWords) {
      GroupHelper().AddObjectsTogroups(AddWordsToLine(Object.keys(storyItems)), groups);
    } else {
      GroupHelper().AddObjectsTogroups(
        AddImagesToLine(Object.values(storyItems)).cubes,
        groups,
      );
      // GroupHelper().AddObjectsTogroups(
      //   AddImagesToLine(Object.values(storyItems)).lines,
      //   groups,
      // );
    }
    return {
      groups: groups,
      imagePositions: CubeHelper().GetCubePositions(
        AddImagesToLine(Object.values(storyItems)).cubes,
      ),
    };
  };

  return { Create };
};

export default StoryCircleItems;
