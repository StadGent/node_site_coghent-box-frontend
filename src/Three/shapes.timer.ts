import Common from '@/composables/common';
import stateService, { FlowState } from '@/services/StateService';
import { Tags } from '@/services/TaggingService';
import ThreeService from '@/services/ThreeService';
import { BufferGeometry, Mesh, Vector3 } from 'three';
import Colors from './defaults.color';
import Measurements from './defaults.measurements';
import TextHelper from './helper.text';
import { CubeParams } from './schema.cube';
import { FontParams } from './schema.text';

type TimeObjects = {
  minutesOne: Promise<Mesh>,
  minutesTwo: Promise<Mesh>,
  secondsOne: Promise<Mesh>,
  secondsTwo: Promise<Mesh>,
  semiColon: Promise<Mesh>,
}

const TimerCountdown = (_threeService: ThreeService): {
  start: (_timeInMiliseconds: number, _position: Vector3, _stopState: FlowState) => Promise<void>;
  createNumber: (_time: string, _position: Vector3, _size: number) => Promise<Mesh<BufferGeometry, any>>
} => {

  const addZeroIfTimeIsUnderTen = (_time: number) => {
    let timeInString = _time.toString();
    if (_time < 10) {
      timeInString = '0' + _time.toString();
    }
    if (_time == 0) {
      timeInString = '00';
    }
    return timeInString
  };

  const devideStringInSingleParts = (_string: string) => {
    const letters = [];
    for (const letter of _string) {
      letters.push(letter);
    }
    return letters;
  }

  const createNumber = async (_time: string, _position: Vector3, _size: number) => {
    return await TextHelper().CreateText(
      _time,
      _position,
      { width: 1, height: 1, } as CubeParams,
      { size: _size, color: Colors().white } as FontParams,
    );
  }

  const getMinutes = (_time: number) => {
    const minutes = Math.floor((_time / (1000 * 60)) % 60);
    return devideStringInSingleParts(addZeroIfTimeIsUnderTen(minutes));
  }

  const getSeconds = (_time: number) => {
    const seconds = Math.floor((_time / 1000) % 60);
    return devideStringInSingleParts(addZeroIfTimeIsUnderTen(seconds));
  }

  const create = async (_position: Vector3, _currentTime: number) => {
    const minutesOne = await createNumber(getMinutes(_currentTime)[0], _position, Measurements().text.size.veryBig)
    const minutesTwo = await createNumber(getMinutes(_currentTime)[1], _position, Measurements().text.size.veryBig)

    minutesTwo.position.setX(_position.x - Measurements().text.size.veryBig);
    minutesOne.position.setX(minutesTwo.position.x - Measurements().text.size.veryBig + 0.2);
    const secondsOne = await createNumber(getSeconds(_currentTime)[0], _position, Measurements().text.size.veryBig)
    const secondsTwo = await createNumber(getSeconds(_currentTime)[1], _position, Measurements().text.size.veryBig)

      ; (await secondsOne).position.setX(_position.x + Measurements().text.size.veryBig / 2 - 0.2);
    (await secondsTwo).position.setX((await secondsOne).position.x + Measurements().text.size.veryBig - 0.2);

    const semiColon = await createNumber(':', _position, Measurements().text.size.veryBig);

    if ((Math.floor((_currentTime / 1000) % 60) + 1) % 10 == 0) {
      _threeService.AddToScene(secondsOne, Tags.Countdown, 'EndOfSession countdown timer');
    }
    _threeService.AddToScene(secondsTwo, Tags.Countdown, 'EndOfSession countdown timer');

    return {
      minutesOne: minutesOne,
      minutesTwo: minutesTwo,
      secondsOne: secondsOne,
      secondsTwo: secondsTwo,
      semiColon: semiColon,
    } as unknown as TimeObjects;
  };

  const updateTime = (_objects: TimeObjects, _currentTime: number, _initial: boolean) => {
    _threeService.AddToScene(_objects.minutesOne, Tags.Countdown, 'EndOfSession countdown timer');
    _threeService.AddToScene(_objects.minutesTwo, Tags.Countdown, 'EndOfSession countdown timer');
    _threeService.AddToScene(_objects.semiColon, Tags.Countdown, 'EndOfSession countdown timer');
    _threeService.AddToScene(_objects.secondsOne, Tags.Countdown, 'EndOfSession countdown timer');
    // }
    _threeService.AddToScene(_objects.secondsTwo, Tags.Countdown, 'EndOfSession countdown timer');
  };

  const start = async (_timeInMiliseconds: number, _position: Vector3, _stopState: FlowState) => {
    let stop = false
    let currentTime = _timeInMiliseconds;
    let initial = true;
    do {
      const times = await create(_position, currentTime);
      if (initial) {
        updateTime(times, currentTime, initial);
        initial = false;
      }
      updateTime(times, currentTime, initial);
      await Common().awaitTimeout(1000);
      // }
      if (currentTime != 0) {
        _threeService.RemoveFromScene(times.secondsOne);
        _threeService.RemoveFromScene(times.secondsTwo);
      }
      currentTime -= 1000;
      stateService.getCurrentState() === FlowState[_stopState] ? stop = true : stop = false
    } while (currentTime > -1 && stop === false)
  }

  return { start, createNumber };
};

export default TimerCountdown;