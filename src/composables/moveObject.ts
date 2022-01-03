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
    let reached = false;
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
      reached = true;
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
    let _stepsX = toPosition.x - _groups[0].position.x;
    let _stepsY = toPosition.y - _groups[0].position.y;
    if (_groups[0].position.x > toPosition.x) {
      _stepsX = -_stepsX;
    }
    if (_groups[0].position.y > toPosition.y) {
      _stepsY = -_stepsY;
    }
    _groups.map((_group: any) => {
      MoveObject().startMoving(_group, new Vector3(_group.position.x + _stepsX, _group.position.y + _stepsY, _group.position.z))
    });
  }

  const sleep = async (object: Mesh, toPosition: Vector3) => {
    await Common().awaitTimeout(Timing.moveObject.steps / Timing.moveObject.refreshStep);
    return move(object, toPosition);
  };

  return { move, startMoving, moveGroups };
};

export default MoveObject;
