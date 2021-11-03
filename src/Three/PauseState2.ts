import { Group, Vector3 } from 'three';
import BaseChapes from './BaseChapes';
import CubeHelper from './CubeHelper';
import SchemaCube, { CubeParams } from './CubeSchema';
import GroupHelper from './GroupHelper';
import TextHelper from './TextHelper';
import { FontParams } from './Textschema';

const PauseState2 = (): {
  Create: (name: string) => Group;
} => {
  const topText = TextHelper().CreateText(
    'Het verhaal is gepauzeerd',
    new Vector3(-2.5, 5.5, 0),
    {
      width: 10,
      height: 2,
    },
    { size: 0.5 } as FontParams,
  );

  const middleText = () => {
    const positions: Array<Vector3> = [
      new Vector3(-3, -1.5, 0),
      new Vector3(-3, -2.5, 0),
      new Vector3(-3, -3.5, 0),
      new Vector3(-3, -4.5, 0),
    ];
    const first = TextHelper().CreateText(
      'Ga terug op de bol staan om',
      positions[0],
      {
        width: 10,
        height: 2,
      },
      { size: 0.5 } as FontParams,
    );
    const hoofdstuk = TextHelper().CreateText(
      'verder te luisteren of kies een',
      positions[1],
      {
        width: 10,
        height: 2,
      },
      { size: 0.5 } as FontParams,
    );
    const second = TextHelper().CreateText(
      'van de oplichtende bollen om',
      positions[2],
      {
        width: 10,
        height: 2,
      },
      { size: 0.5 } as FontParams,
    );
    const third = TextHelper().CreateText(
      'een nieuw verhaal te starten.',
      positions[3],
      {
        width: 10,
        height: 2,
      },
      { size: 0.5 } as FontParams,
    );
    return GroupHelper().CreateGroup([first, hoofdstuk, second, third]);
  };
  const bottomText = () => {
    const positions: Array<Vector3> = [new Vector3(0, -6, 0), new Vector3(-3.4, -7, 0)];
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

  const pauseIcon = () => {
    const left = SchemaCube().CreateCube({
      position: new Vector3(-0.8, 3, 0),
      params: { width: 0.8, height: 2.5 } as CubeParams,
    });
    const right = SchemaCube().CreateCube({
      position: new Vector3(0.8, 3, 0),
      params: { width: 0.8, height: 2.5 } as CubeParams,
    });
    return GroupHelper().CreateGroup([left, right]);
  };

  const Create = (name: string) => {
    const group = GroupHelper().CreateGroup([
      topText,
      bottomText(),
      middleText(),
      pauseIcon(),
    ]);
    const groups: Array<Group> = [];
    // GroupHelper().AddObjectsTogroups([middleText, group], groups);
    group.name = name;
    return group;
  };

  return { Create };
};

export default PauseState2;
