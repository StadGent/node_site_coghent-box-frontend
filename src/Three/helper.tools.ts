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
  splitAreaInZones: (threeService: ThreeService,
    sceneWidth: number,
    zones: number,) => void;
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

  const splitAreaInZones = (
    threeService: ThreeService,
    sceneWidth: number,
    zones: number,
  ) => {
    const zoneWidthInPixels = sceneWidth / zones;
    const startPosition = 0 - Common().pixelsToMeters(sceneWidth / 2) * 10;
    let updatedPosition = startPosition;

    for (let i = 0;i < zones + 1;i++) {
      threeService.AddToScene(Tools().yAxis(new Vector3(updatedPosition, 0, 0)), Tags.XAxis, 'Helper line for the xAxis.');
      updatedPosition += Common().pixelsToMeters(zoneWidthInPixels) * 10;
    }
  };

  const displayZones = (threeService: ThreeService, zones: Array<Zone>) => {
    zones.forEach(zone => {
      threeService.AddToScene(Tools().yAxis(new Vector3(zone.start.x, zone.start.y, zone.start.z)), Tags.YAxis, 'Helper line for the yAxis.');
    })
  }

  const dotOnPosition = (threeService: ThreeService, position: Vector3) => {
    const schema = CircleHelper().CreateSchema(
      new Vector3(
        position.x - position.x * 0.03 * 2,
        position.y - position.y * 2 * 0.03,
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

  return { Grid, xAxis, yAxis, splitAreaInZones, displayZones, dotOnPosition, displayBoundaryAsDots };
};

export default Tools;
