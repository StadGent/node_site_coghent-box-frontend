import Common from '@/composables/common';
import { Mesh, Vector3 } from 'three';
import Defaults from './defaults.config';
import Layers from './defaults.layers';

export type Zone = {
  start: Vector3;
  end: Vector3;
  width: number;
  height: number;
};

const ZoneHelper = (
  screen: Vector3,
): {
  createZones: (_zones: number) => Array<Zone>;
  objectIsInZone: (object: Mesh, zones: Array<Zone>) => Zone;
  getMiddleOfZone: (zone: Zone) => Vector3;
  zoneDimensions: (_zones: number) => { width: number; height: number };
} => {

  const calculateZones = (times: number, width: number, height: number, startLeft: number, startRight: number) => {
    const zones: Array<Zone> = [];

    for (let _zone = 0;_zone < times;_zone++) {
      zones.push({
        width: width,
        height: height,
        start: new Vector3(startLeft, height, Layers.presentation),
        end: new Vector3(startLeft - width, height, Layers.presentation),
      } as Zone);
      startLeft = startLeft - width;
      zones.push({
        width: width,
        height: height,
        start: new Vector3(startRight, height, Layers.presentation),
        end: new Vector3(startRight + width, height, Layers.presentation),
      } as Zone);
      startRight = startRight + width;
    }
    return zones;
  }

  const createZones = (_zones: number) => {
    let zones: Array<Zone> = [];
    let startLeft = 0;
    let startRight = 0;
    let times = _zones;

    const widthOfOneZone = screen.x / _zones;
    const heightOfOneZone = screen.y / 1;

    if (_zones % 2 == 0) {
      startLeft = 0;
      startRight = 0;
      times = _zones / 2;
      zones = zones.concat(calculateZones(times, widthOfOneZone, heightOfOneZone, startLeft, startRight));
    } else {
      startLeft = -widthOfOneZone / 2;
      startRight = widthOfOneZone / 2;
      times = (_zones - 1) / 2;
      zones = zones.concat(calculateZones(times, widthOfOneZone, heightOfOneZone, startLeft, startRight));
      const centerZone = { width: widthOfOneZone, height: heightOfOneZone, start: new Vector3(startLeft), end: new Vector3(startRight), } as Zone;
      zones.push(centerZone);
    }
    return zones;
  };

  const objectIsInZone = (object: Mesh, zones: Array<Zone>) => {
    let zone: Zone = { start: new Vector3(0, 0, 0), end: new Vector3(0, 0, 0), width: 0, height: 0 };
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
    return new Vector3(zone.end.x - (width / 2), 0, Layers.presentation);
  };

  const zoneDimensions = (_zones: number) => {
    return {
      width: (screen.x - Defaults().zonePadding()),
      height: (screen.y - Defaults().zonePadding()),
    };
  };

  return {
    createZones,
    objectIsInZone,
    getMiddleOfZone,
    zoneDimensions,
  };
};

export default ZoneHelper;
