import CircleHelper from '@/Three/CircleHelper';
import { CirclePoint } from '@/Three/CircleSchema';
import Defaults from '@/Three/defaults.config';
import GroupHelper from '@/Three/GroupHelper';
import SchemaLine from '@/Three/LineSchema';
import TextHelper from '@/Three/TextHelper';
import { FontParams } from '@/Three/Textschema';
import { Group, Vector3 } from 'three';
import StoryCircle from './StoryCircle';

const StoryPaused = (): {
  Create: (titles: Array<string>, color?: number) => Array<Group>;
} => {
  const Lollipop = (title: string, position: Vector3, color?: number) => {
    const schema = CircleHelper().CreateSchema(position, 2, color || 0x02a77f);
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
      params: { color: color || 0x02a77f },
    });
    return GroupHelper().CreateGroup([line, circle]);
  };

  const middleText = () => {
    const first = TextHelper().CreateText(
      'Je beluisterde het volledige',
      new Vector3(-3.4, 5, 0),
      {
        width: 10,
        height: 2,
      },
      { size: 0.5 } as FontParams,
    );
    const hoofdstuk = TextHelper().CreateText(
      'hoofdstuk',
      new Vector3(-1, 4, 0),
      {
        width: 10,
        height: 2,
      },
      { size: 0.5 } as FontParams,
    );
    const second = TextHelper().CreateText(
      'Kies een van de oplichtende',
      new Vector3(-3.4, 2.5, 0),
      {
        width: 10,
        height: 2,
      },
      { size: 0.5 } as FontParams,
    );
    const third = TextHelper().CreateText(
      'bollen om een nieuw hoofdstuk',
      new Vector3(-4, 1.5, 0),
      {
        width: 10,
        height: 2,
      },
      { size: 0.5 } as FontParams,
    );
    const fourth = TextHelper().CreateText(
      'te starten.',
      new Vector3(-1, 0.5, 0),
      {
        width: 10,
        height: 2,
      },
      { size: 0.5 } as FontParams,
    );
    return GroupHelper().CreateGroup([first, hoofdstuk, second, third, fourth]);
  };
  const bottomText = () => {
    const first = TextHelper().CreateText(
      'Je beluisterde net:',
      new Vector3(-1, -5, 0),
      {
        width: 10,
        height: 5,
      },
      { size: 0.3 } as FontParams,
    );
    const second = TextHelper().CreateText(
      'De komst van de turkse handelaar 1/3',
      new Vector3(-4, -6, 0),
      {
        width: 10,
        height: 5,
      },
      { size: 0.4 } as FontParams,
    );
    return GroupHelper().CreateGroup([first, second]);
  };

  const Create = (titles: Array<string>, color?: number) => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups([middleText(), bottomText()], groups);
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
