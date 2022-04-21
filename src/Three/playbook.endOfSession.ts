import EndOfSession from '@/screens/EndOfSession';
import ThreeService from '@/services/ThreeService';
import Timing from './defaults.timing';
import Positions from './defaults.positions';
import ZoneService from '@/services/ZoneService';
import { Tags } from '@/services/TaggingService';
import TimerCountdown from './shapes.timer';
import stateService, { FlowState } from '@/services/StateService';
import scenery from '@/composables/useScenery';

const useEndOfSession = (
  threeService: ThreeService,
  zoneService: ZoneService,
): {
  create: () => Promise<void>;
} => {
  const create = async () => {
    threeService.AddGroupsToScene(await EndOfSession(zoneService).create(), Tags.EndOfSession, 'The endOfSession screen.');
    await TimerCountdown(threeService).start(Timing.endOfSession.countdown, Positions().timerCountdown(), FlowState.welcome)
    scenery.welcomeScene()
  };

  return { create };
};

export default useEndOfSession;
