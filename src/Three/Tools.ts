import ThreeService from '@/services/ThreeService';
import { Vector3, Group } from 'three';
import CircleHelper from './CircleHelper';
import SchemaCircle from './CircleSchema';
import CubeHelper from './CubeHelper';
import Colors from './defaults.color';
import Layers from './defaults.layers';
import GroupHelper from './GroupHelper';
import LineHelper from './LineHelper';
import SchemaLine, { LineSchema } from './LineSchema';

const Tools = (): {
  Grid: () => Group;
  yAxis: (position: Vector3) => Group;
  xAxis: (position: Vector3) => Group;
  devideScreenInZones: (zones: number, objectWidth: number) => Array<Array<Vector3>>;
  ZoneLines: (zones: Array<Array<Vector3>>) => Array<Group>;
  dotOnPosition:(threeService: ThreeService, position: Vector3) => void;
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

  const devideScreenInZones = (zones: number, objectWidth: number) => {
    const zoneWidth = objectWidth / zones - 1;
    let startZone = 0 - objectWidth;
    const zoneAreas: Array<Array<Vector3>> = [];
    console.log('objectWidth => ', objectWidth);
    console.log('zonewidth => ', zoneWidth);
    console.log('start =>', startZone);
    console.log('end =>', objectWidth / 2);

    for (let i = 0; i < zones - 1; i++) {
      const start = new Vector3(startZone, -10, 0);
      const end = new Vector3(startZone + zoneWidth, 10, 0);
      console.log('startzone =>', start.x);
      console.log('endzone =>', end.x);
      zoneAreas.push([start, end]);
      startZone = startZone + zoneWidth;
    }
    return zoneAreas;
  };

  const ZoneLines = (zones: Array<Array<Vector3>>) => {
    const lineSchemas: Array<LineSchema> = [];
    zones.map((zone) => {
      lineSchemas.push(LineHelper().CreateSchema(zone));
    });
    console.log('lineSchema length => ', lineSchemas.length);
    return SchemaLine().CreateLines(lineSchemas);
  };

  const dotOnPosition = (threeService: ThreeService, position: Vector3) => {
    const schema = CircleHelper().CreateSchema(new Vector3(position.x -(position.x * 0.03 * 2), position.y - (position.y * 2* 0.03), position.z),0.1,Colors().pink);
    const circle = SchemaCircle().CreateCircle(schema, Layers.presentation);
    threeService.AddToScene(circle);
  }

  return { Grid, xAxis, yAxis, devideScreenInZones, ZoneLines, dotOnPosition };
};

export default Tools;
