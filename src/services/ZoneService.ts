import Layers from '@/Three/defaults.layers';
import { Vector3 } from 'three';

export type Zone = {
  start: Vector3;
  end: Vector3;
  width: number;
  height: number;
};

export default class ZoneService {
  private screen: Vector3;
  
  zones: Array<Zone> = [];

  constructor(_screen: Vector3, _zones: number) {
    this.screen = _screen;
    this.zones = this.createZones(_zones);
  }

  private calculateZones(times: number, width: number, height: number, startLeft: number, startRight: number) {
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

  createZones(_zones: number) {
    let zones: Array<Zone> = [];
    let startLeft = 0;
    let startRight = 0;
    let times = _zones;

    const widthOfOneZone = this.screen.x / _zones;
    const heightOfOneZone = this.screen.y / 1;

    if (_zones % 2 == 0) {
      startLeft = 0;
      startRight = 0;
      times = _zones / 2;
      zones = zones.concat(this.calculateZones(times, widthOfOneZone, heightOfOneZone, startLeft, startRight));
    } else {
      startLeft = -widthOfOneZone / 2;
      startRight = widthOfOneZone / 2;
      times = (_zones - 1) / 2;
      zones = zones.concat(this.calculateZones(times, widthOfOneZone, heightOfOneZone, startLeft, startRight));
      const centerZone = { width: widthOfOneZone, height: heightOfOneZone, start: new Vector3(startLeft), end: new Vector3(startRight), } as Zone;
      zones.push(centerZone);
    }
    return zones;
  };
}