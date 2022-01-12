import { Vector3, Group, Mesh } from 'three';
import CircleHelper from './helper.circle';
import SchemaCircle from './schema.circle';
import CubeHelper from './helper.cube';
import SchemaCube from './schema.cube';
import Colors from './defaults.color';
import Layers from './defaults.layers';
import GroupHelper from './helper.group';

const HorizontalProgressBar = (): {
  create: (
    position: Vector3,
    timings: Array<number>,
    endtime: number,
    currentTime: number,
    storyColor: number,
  ) => Array<Group>;
} => {
  const CurrentTimeProgress = (startPosition: Vector3, length: number) => {
    const schema = CubeHelper().CreateSchema(
      new Vector3(startPosition.x + length / 2, startPosition.y, startPosition.z),
      '',
      new Vector3(length, 0.16, startPosition.z)
    );
    schema.params.color = Colors().white;
    const cube = SchemaCube().CreateCube(schema);
    return cube;
  }

  const createTimingDots = (timings: Array<number>, currentTime: number, startPosition: Vector3, dividing: number, radius: number, storyColor: number) => {
    const timingDots: Array<Mesh> = [];
    for (const timing of timings) {
      if (timing <= currentTime) {
        const timeDot = CircleHelper().CreateSchema(
          new Vector3(
            startPosition.x + (timing / dividing) + (radius * 2),
            startPosition.y,
            startPosition.z,
          ),
          radius,
          storyColor,
        );
        const circle = SchemaCircle().CreateCircle(timeDot);
        timingDots.push(circle);
      } else {
        const timeDot = CircleHelper().CreateSchema(
          new Vector3(
            startPosition.x + (timing / dividing) + (radius * 3),
            startPosition.y,
            startPosition.z,
          ),
          radius,
          Colors().white,
        );
        const circle = SchemaCircle().CreateCircle(timeDot)
        timingDots.push(circle);
      }
    }
    return timingDots
  }

  const create = (
    position: Vector3,
    timings: Array<number>,
    endtime: number,
    currentTime: number,
    storyColor: number,
  ) => {
    // Time is in seconds
    const radius = 0.08;
    const length = 10;
    const dividing = endtime / length;
    const schema = CubeHelper().CreateSchema(
      position,
      '',
      new Vector3(length, 0.28, position.z),
      0.4,
      true,
    );
    const cube = SchemaCube().CreateCube(schema);
    const groups: Array<Group> = [];
    //FIXME: Timingdots should be drawn once instead of every refresh of the currentime
    const timingDots = createTimingDots(timings, currentTime, new Vector3(position.x - ((length) / 2), position.y + 0.05, position.z + Layers.fraction), endtime / (length - 1), radius, storyColor);
    const currenttimeBar = CurrentTimeProgress(new Vector3(position.x - (length / 2), position.y, position.z), currentTime / dividing);
    GroupHelper().AddObjectsTogroups([cube, currenttimeBar], groups);
    GroupHelper().AddObjectsTogroups(timingDots, groups);
    return groups;
  };

  return { create };
};

export default HorizontalProgressBar;
