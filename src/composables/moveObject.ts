import { tweenPromise } from '@/Three/helper.tweenPromise';
import { Group, Mesh, Vector3 } from 'three';
import TWEEN from '@tweenjs/tween.js';

const MoveObject = (): {
  startMoving: (object: any, toPosition: Vector3) => Promise<unknown>;
  moveGroups: (_groups: Array<Group>, toPosition: Vector3) => Promise<void>;
} => {
  const startMoving = async (object: Mesh, toPosition: Vector3) => {
    const tween = new TWEEN.Tween(object.position)
      .to(toPosition, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();

    await tweenPromise(tween);
    return Promise.resolve();
  };

  const moveGroups = async (_groups: Array<Group>, toPosition: Vector3) => {
    for (const item of _groups) {
      await MoveObject().startMoving(item, toPosition);
    }
  };

  return { startMoving, moveGroups };
};

export default MoveObject;
