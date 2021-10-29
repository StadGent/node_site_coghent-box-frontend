import { Vector3, Group } from 'three';
import GroupHelper from './GroupHelper';
import SchemaLine, { LineSchema } from './LineSchema';

const Tools = (): {
  Grid: () => Group;
  yAxis: (position: Vector3) => Group;
  xAxis: (position: Vector3) => Group;
} => {
  const Grid = () => {
    const middleX = xAxis(new Vector3(0, 0, 0));
    const middleY = yAxis(new Vector3(0, 0, 0));
    return GroupHelper().CreateGroup([middleX, middleY]);
  };

  const yAxis = (position: Vector3) => {
    return SchemaLine().CreateLine({
      positions: [new Vector3(position.x, 30, 0), new Vector3(position.x, -30, 0)],
      params: { color: 0x0f000 },
    } as LineSchema);
  };
  const xAxis = (position: Vector3) => {
    return SchemaLine().CreateLine({
      positions: [new Vector3(-100, position.y, 0), new Vector3(100, position.y, 0)],
      params: { color: 0x0f000 },
    } as LineSchema);
  };
  return { Grid, xAxis, yAxis };
};

export default Tools;
