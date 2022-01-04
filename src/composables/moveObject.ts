import Timing from '@/Three/defaults.timing';
import { Group, Mesh, Vector3 } from 'three';
import Common from './common';

const MoveObject = (): {
  move: (object: Mesh, toPosition: Vector3) => void;
  startMoving: (object: any, toPosition: Vector3) => Promise<boolean>;
  moveGroups: (_groups: Array<Group>, toPosition: Vector3) => void;
} => {
  const setXPosition = (object: Mesh, toPosition: Vector3, stepX: number) => {
    if (object.position.x <= toPosition.x && object.position.x + stepX <= toPosition.x) {
      object.position.set(
        object.position.x + stepX,
        object.position.y,
        object.position.z,
      );
    } else if (
      object.position.x >= toPosition.x &&
      object.position.x - stepX >= toPosition.x
    ) {
      object.position.set(
        object.position.x - stepX,
        object.position.y,
        object.position.z,
      );
    }
  };
  const setYPosition = (object: Mesh, toPosition: Vector3, stepY: number) => {
    if (object.position.y <= toPosition.y && object.position.y + stepY <= toPosition.y) {
      object.position.set(
        object.position.x,
        object.position.y + stepY,
        object.position.z,
      );
    } else if (
      object.position.y >= toPosition.y &&
      object.position.y - stepY >= toPosition.y
    ) {
      object.position.set(
        object.position.x,
        object.position.y - stepY,
        object.position.z,
      );
    }
  };
  const move = (object: Mesh, toPosition: Vector3) => {
    const stepY = Math.abs(object.position.y - toPosition.y) / Timing.moveObject.steps;
    const stepX = Math.abs(object.position.x - toPosition.x) / Timing.moveObject.steps;

    if (
      object.position.x > toPosition.x - 0.01 &&
      object.position.x < toPosition.x + 0.01 &&
      object.position.x != toPosition.x &&
      object.position.y > toPosition.y - 0.01 &&
      object.position.y < toPosition.y + 0.01 &&
      object.position.y != toPosition.y
    ) {
      object.position.x = toPosition.x;
    }
    setXPosition(object, toPosition, stepX);
    setYPosition(object, toPosition, stepY);
  };

  const startMoving = async (object: Mesh, toPosition: Vector3) => {
    while (object.position.x != toPosition.x) {
      await sleep(object, toPosition);
    }
    return true;
  };

  const moveGroups = (_groups: Array<Group>, toPosition: Vector3) => {
    const _stepsX = toPosition.x;
    const _stepsY = toPosition.y;

    for (const item of _groups) {
      MoveObject().startMoving(item, new Vector3(item.position.x + _stepsX, item.position.y + _stepsY, item.position.z))
    }
  };

  const sleep = async (object: Mesh, toPosition: Vector3) => {
    await Common().awaitTimeout(Timing.moveObject.steps / Timing.moveObject.refreshStep);
    return move(object, toPosition);
  };

  return { move, startMoving, moveGroups };
};

export default MoveObject;
