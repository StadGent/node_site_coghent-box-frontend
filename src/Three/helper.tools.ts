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
  yAxis: (position: Vector3) => Group;
  xAxis: (position: Vector3) => Group;
  displayZones: (threeService: ThreeService, zones: Array<Zone>) => void;
  dotOnPosition: (threeService: ThreeService, position: Vector3) => void;
  displayBoundaryAsDots: (threeService: ThreeService, boundary: Boundary) => void;
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

  const displayZones = (threeService: ThreeService, zones: Array<Zone>) => {
    zones.forEach(zone => {
      console.log('start', zone.start);
      console.log('end', zone.center);
      console.log('end', zone.end);
      console.log('width', zone.width);
      console.log('height', zone.height);
      console.log('height', );
      threeService.AddToScene(Tools().yAxis(new Vector3(zone.start.x, zone.end.y, Layers.presentation)), Tags.YAxis, 'Helper line for the start of the zone.');
      threeService.AddToScene(Tools().yAxis(new Vector3(zone.end.x, zone.end.y, Layers.presentation)), Tags.YAxis, 'Helper line for the end of the zone.');
      threeService.AddToScene(Tools().dotOnPosition(threeService, new Vector3(zone.center.x, zone.end.y, Layers.presentation)), Tags.YAxis, 'Helper line for the end of the zone.');
    })
  }

  const dotOnPosition = (threeService: ThreeService, position: Vector3) => {
    const schema = CircleHelper().CreateSchema(
      new Vector3(
        position.x,
        position.y,
        2,
      ),
      0.5,
      Colors().lightBlue,
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
