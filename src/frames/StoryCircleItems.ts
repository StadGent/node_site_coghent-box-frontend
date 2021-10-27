import Defaults from '@/Three/defaults.config';
import GroupHelper from '@/Three/GroupHelper';
import LineHelper from '@/Three/LineHelper';
import SchemaLine, { LineSchema } from '@/Three/LineSchema';
import TextHelper from '@/Three/TextHelper';
import { Group, Mesh, Vector3 } from 'three';

const StoryCircleItems = (): {
  Create: (words: Array<string>) => Array<Group>;
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
        allWords.push(
          TextHelper().CreateText(words[i], {
            x: Defaults().LinePositions()[i][2].x + 1.6,
            y: Defaults().LinePositions()[i][2].y,
            z: Defaults().LinePositions()[i][2].z,
          } as Vector3),
        );
      } else
        allWords.push(
          TextHelper().CreateText(words[i], {
            x: Defaults().LinePositions()[i][2].x - 1.6,
            y: Defaults().LinePositions()[i][2].y,
            z: Defaults().LinePositions()[i][2].z,
          } as Vector3),
        );
    }
    return allWords;
  };

  const Create = (words: Array<string>) => {
    const groups: Array<Group> = [];
    let lines;
    if (words.length > 5)
      lines = SchemaLine().CreateLines(Lines(Defaults().LinePositions().length));
    else lines = SchemaLine().CreateLines(Lines(words.length));
    GroupHelper().AddObjectsTogroups(lines, groups);
    GroupHelper().AddObjectsTogroups(AddWordsToLine(words), groups);
    return groups;
  };

  return { Create };
};

export default StoryCircleItems;
