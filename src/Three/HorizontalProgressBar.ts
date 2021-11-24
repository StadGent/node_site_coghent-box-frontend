import { Vector3, Group, Mesh } from 'three';
import CircleHelper from './CircleHelper';
import SchemaCircle from './CircleSchema';
import CubeHelper from './CubeHelper';
import SchemaCube from './CubeSchema';
import Colors from './defaults.color';
import Layers from './defaults.layers';
import GroupHelper from './GroupHelper';

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
      new Vector3(startPosition.x + length/2  ,startPosition.y, Layers.presentation),
      '',
      new Vector3(length, 0.16, Layers.presentation),
    );
    schema.params.color = Colors().white;
    const cube = SchemaCube().CreateCube(schema);
    return cube;
  }

  const createTimingDots = (timings: Array<number>, currentTime: number,startPosition: Vector3, dividing:number, radius: number, storyColor: number) => {
    const timingDots: Array<Mesh> = [];
    for (const timing of timings) {
      if (timing <= currentTime) {
        const timeDot = CircleHelper().CreateSchema(
          new Vector3(
            startPosition.x + timing / dividing - radius * 2,
            startPosition.y + 0.47 ,
            Layers.presentation,
          ),
          radius,
          storyColor,
        );

        const circle = SchemaCircle().CreateCircle(timeDot, Layers.presentation)
        timingDots.push(circle);
      } else {
        const timeDot = CircleHelper().CreateSchema(
          new Vector3(
            startPosition.x + timing / dividing - radius * 2,
            startPosition.y + 0.47,
            Layers.presentation,
          ),
          radius,
          Colors().white,
        );
        const circle = SchemaCircle().CreateCircle(timeDot, Layers.presentation)
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
    const dividing = endtime / 10;
    const startPos = new Vector3(position.x - length / 2 + radius, position.y, Layers.presentation);
    const schema = CubeHelper().CreateSchema(
      position,
      '',
      new Vector3(length, 0.25, Layers.presentation - 0.01),
      0.7,
      true,
    );
    const cube = SchemaCube().CreateCube(schema);
    const groups: Array<Group> = [];
    const timingDots = createTimingDots(timings,currentTime,startPos,dividing,radius,storyColor);
    const currenttimeBar = CurrentTimeProgress(new Vector3(startPos.x, startPos.y,Layers.presentation),currentTime/dividing - 0.16);
    GroupHelper().AddObjectsTogroups(timingDots, groups);
    GroupHelper().AddObjectsTogroups([cube, currenttimeBar], groups);
    return groups;
  };

  return { create };
};

export default HorizontalProgressBar;
