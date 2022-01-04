import Timing from '@/Three/defaults.timing';
import { Group, Mesh, Vector3 } from 'three';
import Common from './common';

const MoveObject = (): {
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
  const move = (object: Mesh, toPosition: Vector3, stepX: number, stepY: number) => {
    let reached = false;
    if (
      object.position.x > toPosition.x - stepX &&
      object.position.x < toPosition.x + stepX &&
      object.position.x != toPosition.x &&
      object.position.y > toPosition.y - stepY &&
      object.position.y < toPosition.y + stepY &&
      object.position.y != toPosition.y
    ) {
      object.position.x = toPosition.x;
      object.position.set(toPosition.x, toPosition.y, toPosition.z);
      reached = true;
    } else {
      setXPosition(object, toPosition, stepX);
      setYPosition(object, toPosition, stepY);
    }
    return reached

  };

  const startMoving = async (object: Mesh, toPosition: Vector3) => {
    const stepY = Math.abs(object.position.y - toPosition.y) / Timing.moveObject.steps;
    const stepX = Math.abs(object.position.x - toPosition.x) / Timing.moveObject.steps;
    let reached = false;
    while (object.position.x != toPosition.x || reached) {
      reached = await sleep(object, toPosition, stepX, stepY);
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

  const sleep = async (object: Mesh, toPosition: Vector3, stepX: number, stepY: number) => {
    await Common().awaitTimeout(Timing.moveObject.steps / Timing.moveObject.refreshStep);
    return move(object, toPosition, stepX, stepY);
  };

  return { startMoving, moveGroups };
};

export default MoveObject;
