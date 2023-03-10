import { Group, Vector3 } from 'three';
import SchemaCube, { CubeParams } from './schema.cube';
import GroupHelper from './helper.group';
import TextHelper from './helper.text';
import { FontParams } from './schema.text';

const DefaultsPauseState = (): {
  topTextState1: Record<string, Vector3>;
  topTextState2: Record<string, Vector3>;
  bottomText: (currentStory: string, progress: string) => Group;
  textBoxSize: () => CubeParams;
  textSize: () => FontParams;
  pauseIcon: () => Group;
} => {
  const topTextState1: Record<string, Vector3> = {
    'Je hebt het hele': new Vector3(0, 3, 0),
    'hoofdstuk gezien': new Vector3(-0.2, 2.5, 0),
    'Maak een nieuwe keuze': new Vector3(-0.8, 2, 0),
    'door op de lichtgevende': new Vector3(-0.9, 1.5, 0),
    'bol te gaan staan.': new Vector3(-0.1, 1, 0),
  };
  const topTextState2: Record<string, Vector3> = {
    'Ga terug op de bol staan om': new Vector3(-3, -1.5, 0),
    'verder te luisteren of kies een': new Vector3(-3, -2.5, 0),
    'van de oplichtende bollen om': new Vector3(-3, -3.5, 0),
    'een nieuw verhaal te starten.': new Vector3(-3, -4.5, 0),
  };
  const bottomText = (currentStory: string, progress: string) => {
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
      `${currentStory} ${progress}`,
      positions[1],
      {
        width: 10,
        height: 5,
      },
      { size: 0.4 } as FontParams,
    );
    return GroupHelper().CreateGroup([first, second]);
  };

  const textBoxSize = () => {
    return {
      width: 10,
      height: 2,
    } as CubeParams;
  };
  const textSize = () => {
    return { size: 0.5 } as FontParams;
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
  return {
    topTextState1,
    topTextState2,
    bottomText,
    textBoxSize,
    textSize,
    pauseIcon,
  };
};

export default DefaultsPauseState;
