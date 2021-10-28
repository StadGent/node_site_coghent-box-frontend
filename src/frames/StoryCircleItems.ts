import Correction from '@/Three/Correction';
import CubeHelper from '@/Three/CubeHelper';
import SchemaCube from '@/Three/CubeSchema';
import Defaults from '@/Three/defaults.config';
import GroupHelper from '@/Three/GroupHelper';
import LineHelper from '@/Three/LineHelper';
import SchemaLine, { LineSchema } from '@/Three/LineSchema';
import TextHelper from '@/Three/TextHelper';
import { Group, Mesh } from 'three';
import StoryCircleChild from './StoryCircleChild';

const StoryCircleItems = (): {
  Create: (storyItems: Record<string, string>, showWords: true | false) => Array<Group>;
} => {
  const Lines = (items: number) => {
    const schemas: Array<LineSchema> = [];
    for (let i = 0; i < items; i++) {
      schemas.push(LineHelper().CreateSchema(Defaults().LinePositions()[i]));
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
        );
        t.position.z = -1;
        allWords.push(t);
      } else {
        const t = TextHelper().CreateText(
          words[i],
          Correction().EndOfLineObjectPositionsRight(i),
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
      if (i < 3) {
        const schema = CubeHelper().CreateSchema(
          Correction().CorrectImageBoxPositionRight(i),
          links[i],
        );
        cubes.push(SchemaCube().CreateImageCube(schema));
      } else {
        const schema = CubeHelper().CreateSchema(
          Correction().CorrectImageBoxPositionLeft(i),
          links[i],
        );
        cubes.push(SchemaCube().CreateImageCube(schema));
      }
    }
    const lines = StoryCircleChild().ConnectPointsWithLine(
      CubeHelper().GetCubesPositions(cubes),
    );
    return { cubes: cubes, lines: lines };
  };

  const Create = (storyItems: Record<string, string>, showWords: true | false) => {
    const groups: Array<Group> = [];
    let lines;
    if (Object.keys(storyItems).length > 5)
      lines = SchemaLine().CreateLines(Lines(Defaults().LinePositions().length));
    else lines = SchemaLine().CreateLines(Lines(Object.keys(storyItems).length));
    GroupHelper().AddObjectsTogroups(lines, groups);
    if (showWords) {
      GroupHelper().AddObjectsTogroups(AddWordsToLine(Object.keys(storyItems)), groups);
    } else {
      GroupHelper().AddObjectsTogroups(
        AddImagesToLine(Object.values(storyItems)).cubes,
        groups,
      );
      GroupHelper().AddObjectsTogroups(
        AddImagesToLine(Object.values(storyItems)).lines,
        groups,
      );
    }
    return groups;
  };

  return { Create };
};

export default StoryCircleItems;
