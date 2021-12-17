import Common from '@/composables/common';
import { Mesh, Vector3 } from 'three';
import Layers from './defaults.layers';

export type Zone = {
  start: Vector3;
  end: Vector3;
};

const ZoneHelper = (
  screen: Vector3,
): {
  createZonesXAxis: (_zones: number) => Array<Zone>;
  objectIsInZone: (object: Mesh, zones: Array<Zone>) => Zone;
  getMiddleOfZone: (zone: Zone) => Vector3;
} => {
  const referencePosition = new Vector3(0, 0, 0);

  const createZonesXAxis = (_zones: number) => {
    const zones: Array<Zone> = [];
    const zoneWidthInPixels = screen.x / _zones;
    const zoneWidth = Common().pixelsToMeters(zoneWidthInPixels) * 10;
    const beginningOfScreen =
      referencePosition.x - Common().pixelsToMeters(screen.x / 2) * 10;
    let XstartZonePosition = beginningOfScreen;

    for (let index = 0; index < _zones; index++) {
      zones.push({
        start: new Vector3(XstartZonePosition, 0, 0),
        end: new Vector3(XstartZonePosition + zoneWidth, 0, 0),
      } as Zone);
      XstartZonePosition += zoneWidth;
    }
    return zones;
  };

  const objectIsInZone = (object: Mesh, zones: Array<Zone>) => {
    let zone: Zone = { start: new Vector3(0, 0, 0), end: new Vector3(0, 0, 0) };
    if (zones.length > 0) {
      zones.map((_zone) => {
        if (object.position.x > _zone.start.x && object.position.x < _zone.end.x) {
          zone = _zone;
        }
      });
    }
    return zone;
  };

  const getMiddleOfZone = (zone: Zone) => {
    const width = zone.end.x - zone.start.x;
    return new Vector3(zone.end.x - width/2,0,Layers.presentation)
  };

  return {
    createZonesXAxis,
    objectIsInZone,
    getMiddleOfZone,
  };
};

export default ZoneHelper;
