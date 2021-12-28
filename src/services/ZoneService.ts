import Defaults from '@/Three/defaults.config';
import Layers from '@/Three/defaults.layers';
import { Mesh, Vector3 } from 'three';

export type Zone = {
  start: Vector3;
  end: Vector3;
  width: number;
  height: number;
};

export default class ZoneService {
  private screen: Vector3;
  
  public zoneCenters: Array<Vector3>;
  public middleZoneCenter: Vector3;
  public zones: Array<Zone>;;
  public zoneDimensions = new Vector3(0, 0, 0);

  constructor(_screen: Vector3, _zones: number) {
    this.screen = _screen;
    this.zones = this.createZones(_zones);
    this.zoneCenters = this.middleOfZones();
    this.middleZoneCenter = this.zoneCenters[(this.zoneCenters.length-1)/2];
  }

  private middleOfZones(){
    const centers: Array<Vector3> = [];
    this.zones.forEach(_zone => {
      centers.push(this.getMiddleOfZone(_zone));
    })
    return centers;
  }

  private calculateZones(times: number, width: number, height: number, startLeft: number, startRight: number) {
    const zones: Array<Zone> = [];

    for (let _zone = 0;_zone < times;_zone++) {
      zones.push({
        width: width,
        height: height,
        start: new Vector3(startLeft, 0, Layers.presentation),
        end: new Vector3(startLeft - width, 0, Layers.presentation),
      } as Zone);
      startLeft = startLeft - width;
      zones.push({
        width: width,
        height: height,
        start: new Vector3(startRight, 0, Layers.presentation),
        end: new Vector3(startRight + width, 0, Layers.presentation),
      } as Zone);
      startRight = startRight + width;
    }
    return zones;
  }

  private setZoneDimensions(width: number, height: number) {
    return new Vector3(width - Defaults().zonePadding(), height - Defaults().zonePadding(), 0);
  }

  createZones(_zones: number) {
    let zones: Array<Zone> = [];
    let startLeft = 0;
    let startRight = 0;
    let times = _zones;

    const widthOfOneZone = this.screen.x / _zones;
    const heightOfOneZone = this.screen.y / 1;

    this.zoneDimensions = this.setZoneDimensions(widthOfOneZone, heightOfOneZone);

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
    return zones.sort((a,b) => a.start.x - b.start.x);
  }

  getMiddleOfZone(zone: Zone) {
    return new Vector3(zone.end.x - ((zone.end.x-zone.start.x) / 2), 0, Layers.presentation);
  }

  objectIsInZone(object: Mesh) {
    let zone: Zone = { start: new Vector3(0, 0, 0), end: new Vector3(0, 0, 0), width: 0, height: 0 };
    if (this.zones.length > 0) {
      this.zones.forEach(_zone => {
        if (object.position.x > _zone.start.x && object.position.x < _zone.end.x) {
          zone = _zone;
        }
      });
    }
    return zone;
  }

  sceneZone(){
    return {
      start: new Vector3(-this.screen.x/2, 0,0),
      end: new Vector3(this.screen.x/2,0,0),
      width: this.screen.x,
      height: this.screen.y,
    } as Zone
  }
}