import Common from '@/composables/common';
import { Mesh, Vector3 } from 'three';

type Zone = {
  start: Vector3;
  end: Vector3;
};

const ZoneHelper = (
  screen: Vector3,
): {
  createZonesXAxis: (_zones: number) => Array<Zone>;
  objectIsInZone: (object: Mesh) => Zone;
} => {
  const referencePosition = new Vector3(0, 0, 0);
  const zones: Array<Zone> = [];

  const createZonesXAxis = (_zones: number) => {
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

  const objectIsInZone = (object: Mesh) => {
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

  return {
    createZonesXAxis,
    objectIsInZone,
  };
};

export default ZoneHelper;
