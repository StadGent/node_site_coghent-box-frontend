import EndOfSession from '@/screens/EndOfSession';
import ThreeService from '@/services/ThreeService';
import Timing from './defaults.timing';
import TextHelper from './helper.text';
import Positions from './defaults.positions';
import { CubeParams } from './schema.cube';
import { FontParams } from './schema.text';
import customText from './defaults.text';
import Colors from './defaults.color';
import Common from '@/composables/common';
import ZoneService from '@/services/ZoneService';
import { Tags } from '@/services/TaggingService';

const useEndOfSession = (
  threeService: ThreeService,
  zoneService: ZoneService,
): {
  create: (spotRadius: number) => Promise<boolean>;
} => {
  const timerCountdown = async (duration: number) => {
    let currentTime = duration;
    while (currentTime != 0) {
      const seconds = Math.floor((currentTime / 1000) % 60);
      const minutes = Math.floor((currentTime / (1000 * 60)) % 60);
      const text = TextHelper().CreateText(
        `0${minutes} :${seconds}`,
        Positions().timerCountdown(),
        {} as CubeParams,
        { size: customText.size.veryBig, color: Colors().white } as FontParams,
      );
      threeService.AddToScene(text, Tags.Countdown, 'EndOfSession countdown timer');
      await Common().awaitTimeout(1000);
      threeService.RemoveFromScene(text);
      currentTime -= 1000;
    }
  };

  const create = async (spotRadius: number) => {
    threeService.ClearScene();
    threeService.AddGroupsToScene(EndOfSession(zoneService,spotRadius).create(), Tags.EndOfSession, 'The endOfSession screen.');
    await timerCountdown(Timing.endOfSession.countdown);
    alert()
    return true;
  };

  return { create };
};

export default useEndOfSession;
