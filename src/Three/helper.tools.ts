import Common from '@/composables/common';
import ThreeService from '@/services/ThreeService';
import { Vector3, Group } from 'three';
import CircleHelper from './helper.circle';
import SchemaCircle from './schema.circle';
import Colors from './defaults.color';
import Layers from './defaults.layers';
import GroupHelper from './helper.group';
import SchemaLine, { LineSchema } from './schema.line';
import { Zone } from '@/services/ZoneService';
import { Boundary } from './helper.boundary';
import { Tags } from '@/services/TaggingService';

const Tools = (): {
  Grid: () => Group;
  yAxis: (position: Vector3, color?: number) => Group;
  xAxis: (position: Vector3) => Group;
  displayZones: (threeService: ThreeService, zones: Array<Zone>) => void;
  dotOnPosition: (threeService: ThreeService, position: Vector3, color?: number) => void;
  displayBoundaryAsDots: (threeService: ThreeService, boundary: Boundary) => void;
} => {
  const Grid = () => {
    const middleX = xAxis(new Vector3(0, 0, 0));
    const middleY = yAxis(new Vector3(0, 0, 0));
    return GroupHelper().CreateGroup([middleX, middleY]);
  };

  const yAxis = (position: Vector3, color?: number) => {
    return SchemaLine().CreateLine({
      positions: [new Vector3(position.x, 30, 0), new Vector3(position.x, -30, 0)],
      params: { color: color || Colors().green },
    } as LineSchema);
  };
  const xAxis = (position: Vector3) => {
    return SchemaLine().CreateLine({
      positions: [new Vector3(-100, position.y, 0), new Vector3(100, position.y, 0)],
      params: { color: 0x0f000 },
    } as LineSchema);
  };

  const displayZones = (threeService: ThreeService, zones: Array<Zone>) => {
    zones.forEach(zone => {
      threeService.AddToScene(Tools().yAxis(new Vector3(zone.start.x, zone.height, Layers.scene)), Tags.YAxis, 'Helper line for the start of the zone.');
      threeService.AddToScene(Tools().yAxis(new Vector3(zone.end.x, zone.height, Layers.scene)), Tags.YAxis, 'Helper line for the end of the zone.');
      threeService.AddToScene(Tools().yAxis(new Vector3(zone.center.x, zone.height, Layers.scene), Colors().white), Tags.YAxis, 'Helper line for the center of the zone.');
    })
  }

  const dotOnPosition = (threeService: ThreeService, position: Vector3, color?: number) => {
    const schema = CircleHelper().CreateSchema(
      new Vector3(
        position.x,
        position.y,
        position.z,
      ),
      0.2,
      color || Colors().lightBlue,
    );
    const circle = SchemaCircle().CreateCircle(schema);
    threeService.AddToScene(circle, Tags.Dot, 'Helper dot.');
  };

  const displayBoundaryAsDots = (threeService: ThreeService, boundary: Boundary) => {
    dotOnPosition(threeService, boundary.TopLeft);
    dotOnPosition(threeService, boundary.TopRight);
    dotOnPosition(threeService, boundary.BottomLeft);
    dotOnPosition(threeService, boundary.BottomRight);
    dotOnPosition(threeService, boundary.TopLeft);
    dotOnPosition(threeService, boundary.TopRight);
    dotOnPosition(threeService, boundary.BottomLeft);
    dotOnPosition(threeService, boundary.BottomRight);
  }

  return { Grid, xAxis, yAxis, displayZones, dotOnPosition, displayBoundaryAsDots };
};

export default Tools;
