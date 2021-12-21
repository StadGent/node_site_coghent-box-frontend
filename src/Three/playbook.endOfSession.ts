import EndOfSession from '@/screens/EndOfSession';
import ThreeService from '@/services/ThreeService';
import { Vector3 } from 'three';
import Timing from './defaults.timing';

const useEndOfSession = (threeService: ThreeService): {
  create: (position: Vector3, spotRadius: number) => void;
} => {

  const timerCountdown = (time: number) => {
   //TODO:
  }

  const create  = (position: Vector3, spotRadius: number) => {
    threeService.ClearScene();
    threeService.AddGroupsToScene(EndOfSession(position, spotRadius).create());
    timerCountdown(Timing.endOfSession.countdown);
  };

  return { create }
};

export default useEndOfSession;