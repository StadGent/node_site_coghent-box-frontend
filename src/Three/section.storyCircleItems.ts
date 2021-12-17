import Correction from '@/Three/helper.correction';
import CubeHelper from '@/Three/helper.cube';
import SchemaCube, { CubeParams, CubeSchema } from '@/Three/schema.cube';
import Colors from '@/Three/defaults.color';
import DefaultColors from '@/Three/defaults.color';
import DefaultsHelper from '@/Three/helper.defaults';
import GroupHelper from '@/Three/helper.group';
import LineHelper from '@/Three/helper.line';
import SchemaLine, { LineSchema } from '@/Three/schema.line';
import TextHelper from '@/Three/helper.text';
import { FontParams } from '@/Three/schema.text';
import { Group, Mesh, Vector3 } from 'three';
import BaseChapes from './shapes.base';
import Layers from './defaults.layers';

const StoryCircleItems = (): {
  Create: (
    storyItems: Record<string, string>,
    progressState: [number, number],
    showWords: true | false,
  ) => { groups: Array<Group>; schemas: Array<CubeSchema> };
  CreateDashedLineWithWord:(positions: Array<Vector3>, word: string) => {object: Group, endOfLine: Vector3};
} => {
  const CreateDashedLineWithWord = (positions: Array<Vector3>, word: string) => {
    const line = BaseChapes().DrawDashedLine(positions, {
      color: Colors().white,
      linewidth: 3,
      scale: 2,
      dashSize: 0.1,
      gapSize: 1,
    });
    line.position.z = Layers.presentation;
    const enddOfLine = LineHelper().GetEndOfLine(line);
    enddOfLine.x.toFixed(2);
    enddOfLine.y.toFixed(2);
    const frameTitle  = TextHelper().CreateText(word, enddOfLine);

    return {object: GroupHelper().CreateGroup([line, frameTitle]), endOfLine: enddOfLine};
  };
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
    const schemas: Array<CubeSchema> = [];
    for (let i = 0; i < links.length; i++) {
      const position = Correction().CorrectImageBoxPositionRight(i);
      if (i < 3) {
        const schema = CubeHelper().CreateSchema(position, links[i]);
        schemas.push(schema);
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
    return { cubes: cubes, lines: undefined, schemas: schemas };
  };

  const Create = (storyItems: Record<string, string>, progressState: [number, number], showWords: true | false) => {
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
      schemas: AddImagesToLine(Object.values(storyItems)).schemas,
    };
  };

  return { Create, CreateDashedLineWithWord };
};

export default StoryCircleItems;
