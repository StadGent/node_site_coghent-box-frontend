import CircleHelper from '@/Three/CircleHelper';
import Defaults from '@/Three/defaults.config';
import LineHelper from '@/Three/LineHelper';
import SchemaLine, { LineSchema } from '@/Three/LineSchema';
import { Group, Vector2 } from 'three';

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

  const Create = (words: Array<string>) => {
    let lines;
    if (words.length > 5)
      lines = SchemaLine().CreateLines(Lines(Defaults().LinePositions().length));
    else lines = SchemaLine().CreateLines(Lines(words.length));

    return lines;
  };

  return { Create };
};

export default StoryCircleItems;
