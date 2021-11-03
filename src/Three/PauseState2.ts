import { Group, Vector3 } from 'three';
import DefaultsPauseState from './defaults.pauseState';
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
    const group = new Group();
    for (const key in DefaultsPauseState().topTextState2) {
      group.add(
        TextHelper().CreateText(
          key,
          DefaultsPauseState().topTextState2[key],
          DefaultsPauseState().textBoxSize(),
          DefaultsPauseState().textSize(),
        ),
      );
    }
    return group;
  };

  const Create = (name: string) => {
    const group = GroupHelper().CreateGroup([
      topText,
      DefaultsPauseState().bottomText('1/3'),
      middleText(),
      DefaultsPauseState().pauseIcon(),
    ]);
    group.name = name;
    return group;
  };

  return { Create };
};

export default PauseState2;
