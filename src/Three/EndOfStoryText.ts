import { Group } from 'three';
import DefaultsPauseState from './defaults.pauseState';
import GroupHelper from './GroupHelper';
import TextHelper from './TextHelper';

const EndOfStoryText = (): {
  Create: (name: string) => Group;
} => {
  const topText = () => {
    const group = new Group();
    for (const key in DefaultsPauseState().topTextState1) {
      group.add(
        TextHelper().CreateText(
          key,
          DefaultsPauseState().topTextState1[key],
          DefaultsPauseState().textBoxSize(),
          DefaultsPauseState().textSize(),
        ),
      );
    }
    return group;
  };

  const Create = (name: string) => {
    const group = GroupHelper().CreateGroup([
      topText(),
      DefaultsPauseState().bottomText('1/3'),
    ]);
    group.name = name;
    return group;
  };
  return {
    Create,
  };
};

export default EndOfStoryText;
