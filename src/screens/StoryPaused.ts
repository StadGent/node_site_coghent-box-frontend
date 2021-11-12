import CircleHelper from '@/Three/CircleHelper';
import { CirclePoint } from '@/Three/CircleSchema';
import DefaultColors from '@/Three/defaults.color';
import Defaults from '@/Three/defaults.config';
import GroupHelper from '@/Three/GroupHelper';
import SchemaLine from '@/Three/LineSchema';
import { Group, Vector3 } from 'three';
import StoryCircle from '../Three/SectionStoryCircle';
import EndOfStoryText from '@/Three/EndOfStoryText';

const StoryPaused = (): {
  Create: (titles: Array<string>, color?: number) => Array<Group>;
} => {
  const Lollipop = (title: string, position: Vector3, color?: number) => {
    const schema = CircleHelper().CreateSchema(
      position,
      2,
      color || DefaultColors().green,
    );
    const startpositionForLine = CircleHelper().CalculatePointOfCircle(
      { angle: 180, radius: 2.3 } as CirclePoint,
      schema.position,
    );
    const circle = StoryCircle().Create(title, schema, 0.3);
    const line = SchemaLine().CreateLine({
      positions: [
        startpositionForLine,
        new Vector3(startpositionForLine.x, startpositionForLine.y - 20, 0),
      ],
      endObject: Defaults().EndCircle(),
      params: { color: color || DefaultColors().green },
    });
    return GroupHelper().CreateGroup([line, circle]);
  };

  const Create = (titles: Array<string>) => {
    const groups: Array<Group> = [];
    groups.push(EndOfStoryText().Create('endOfstorytext'));
    for (let i = 0; i < titles.length; i++) {
      GroupHelper().AddObjectsTogroups(
        [
          Lollipop(
            titles[i],
            Defaults().StoryPausePositions()[i],
            Defaults().StoryColors()[i],
          ),
        ],
        groups,
      );
    }
    return groups;
  };
  return { Create };
};

export default StoryPaused;