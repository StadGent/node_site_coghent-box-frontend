import { Group, Vector3 } from 'three';
import GroupHelper from './GroupHelper';
import TextHelper from './TextHelper';
import { FontParams } from './Textschema';

const PauseState1 = (): {
  Create: (name: string) => Group;
} => {
  const middleText = () => {
    const positions: Array<Vector3> = [
      new Vector3(-3, 3, 0),
      new Vector3(0, 2, 0),
      new Vector3(-3, 0, 0),
      new Vector3(-3.5, -1, 0),
      new Vector3(0, -2, 0),
    ];
    const first = TextHelper().CreateText(
      'Je beluisterde het volledige',
      positions[0],
      {
        width: 10,
        height: 2,
      },
      { size: 0.5 } as FontParams,
    );
    const hoofdstuk = TextHelper().CreateText(
      'hoofdstuk',
      positions[1],
      {
        width: 10,
        height: 2,
      },
      { size: 0.5 } as FontParams,
    );
    const second = TextHelper().CreateText(
      'Kies een van de oplichtende',
      positions[2],
      {
        width: 10,
        height: 2,
      },
      { size: 0.5 } as FontParams,
    );
    const third = TextHelper().CreateText(
      'bollen om een nieuw hoofdstuk',
      positions[3],
      {
        width: 10,
        height: 2,
      },
      { size: 0.5 } as FontParams,
    );
    const fourth = TextHelper().CreateText(
      'te starten.',
      positions[4],
      {
        width: 10,
        height: 2,
      },
      { size: 0.5 } as FontParams,
    );
    return GroupHelper().CreateGroup([first, hoofdstuk, second, third, fourth]);
  };
  const bottomText = () => {
    const positions: Array<Vector3> = [new Vector3(0, -5, 0), new Vector3(-3.4, -6, 0)];
    const first = TextHelper().CreateText(
      'Je beluisterde net:',
      positions[0],
      {
        width: 10,
        height: 5,
      },
      { size: 0.3 } as FontParams,
    );
    const second = TextHelper().CreateText(
      'De komst van de turkse handelaar 1/3',
      positions[1],
      {
        width: 10,
        height: 5,
      },
      { size: 0.4 } as FontParams,
    );
    return GroupHelper().CreateGroup([first, second]);
  };

  const Create = (name: string) => {
    const group = GroupHelper().CreateGroup([middleText(), bottomText()]);
    group.name = name;
    return group;
  };
  return {
    Create,
  };
};

export default PauseState1;
