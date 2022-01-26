import EndOfSession from '@/screens/EndOfSession';
import ThreeService from '@/services/ThreeService';
import Timing from './defaults.timing';
import TextHelper from './helper.text';
import Positions from './defaults.positions';
import { CubeParams } from './schema.cube';
import { FontParams } from './schema.text';
import Colors from './defaults.color';
import Common from '@/composables/common';
import ZoneService from '@/services/ZoneService';
import { Tags } from '@/services/TaggingService';
import Measurements from './defaults.measurements';
import TimerCountdown from './shapes.timer';

const useEndOfSession = (
  threeService: ThreeService,
  zoneService: ZoneService,
): {
  create: (spotRadius: number) => Promise<boolean>;
} => {
  const create = async (spotRadius: number) => {
    threeService.AddGroupsToScene(EndOfSession(zoneService,spotRadius).create(), Tags.EndOfSession, 'The endOfSession screen.');
    await TimerCountdown(threeService).start(Timing.endOfSession.countdown,Positions().timerCountdown())
    alert()
    return true;
  };

  return { create };
};

export default useEndOfSession;
