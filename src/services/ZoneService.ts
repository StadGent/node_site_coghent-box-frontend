import Defaults from '@/Three/defaults.config';
import Layers from '@/Three/defaults.layers';
import { Mesh, Vector3 } from 'three';

export type Zone = {
  start: Vector3;
  end: Vector3;
  center: Vector3;
  width: number;
  height: number;
};

export default class ZoneService {
  private screen: Vector3;

  public zonesInnerToOuter: Array<Vector3>;
  public zoneCenters: Array<Vector3>;
  public middleZoneCenter: Vector3;
  public zones: Array<Zone>;;
  public zoneDimensions = new Vector3(0, 0, 0);

  constructor(_screen: Vector3, _zones: number) {
    this.screen = _screen;
    this.zones = this.createZones(_zones);
    this.zoneCenters = this.middleOfZones();
    this.middleZoneCenter = this.zoneCenters[(this.zoneCenters.length - 1) / 2];
    this.zonesInnerToOuter = this.orderZoneCentersFromInnerToOuterPosition();
  }

  private middleOfZones() {
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
    return new Vector3(width, height, 0);
    // return new Vector3(width - Defaults().zonePadding(), height - Defaults().zonePadding(), 0);
  }

  private orderZoneCentersFromInnerToOuterPosition() {
    const zones: Array<Vector3> = [];
    let positionOfIndex = Math.floor(this.zoneCenters.length / 2);
    for (let index = 1;index < this.zoneCenters.length;index++) {
      if (index % 2 === 0) {
        positionOfIndex += index;
        zones.push(this.zoneCenters[positionOfIndex]);
      } else if (Math.abs(index % 2) == 1) {
        positionOfIndex -= index;
        zones.push(this.zoneCenters[positionOfIndex]);
      }
    }
    return zones;
  }

  createZones(_zones: number) {
    const zones: Array<Zone> = [];
    const screenStart = -(this.screen.x / 2);
    const screenEnd = this.screen.x / 2;
    const zoneWidth = this.screen.x / _zones;
    const zoneheight = this.screen.y / 1;
    const centerOfWidth = zoneWidth / 2;

    this.zoneDimensions = this.setZoneDimensions(zoneWidth, zoneheight);


    zones.push({ start: new Vector3(-centerOfWidth, 0, Layers.presentation), end: new Vector3(centerOfWidth, 0, Layers.presentation),center: new Vector3(0,0,0), width: this.zoneDimensions.x, height: this.zoneDimensions.y } as Zone)
    let pointerRight = centerOfWidth;
    let pointerLeft = -centerOfWidth;
    while (pointerLeft - zoneWidth >= screenStart) {
      zones.push({ start: new Vector3(pointerLeft, 0, Layers.presentation), end: new Vector3(pointerLeft - zoneWidth, 0, Layers.presentation), center: new Vector3(pointerLeft + (zoneWidth/2)), width: this.zoneDimensions.x, height: this.zoneDimensions.y } as Zone)
      pointerLeft -= zoneWidth;
    }
    while (pointerRight + zoneWidth <= screenEnd) {
      zones.push({ start: new Vector3(pointerRight, 0, Layers.presentation), end: new Vector3(pointerRight + zoneWidth, 0, Layers.presentation), center: new Vector3(pointerRight + (zoneWidth/2)), width: this.zoneDimensions.x, height: this.zoneDimensions.y } as Zone)
      pointerRight += zoneWidth;
    }
    return zones.sort((a, b) => a.start.x - b.start.x);
  }

  getMiddleOfZone(zone: Zone) {
    console.log('zonedimensions', this.zoneDimensions);
    console.log(zone);
    let middle = this.zoneDimensions.x/2;
    if(zone.end.x > 0){
      middle = -middle;
    }
    return new Vector3(zone.end.x + middle, 0, Layers.presentation);
  }

  objectIsInZone(object: Mesh) {
    let zone: Zone = { start: new Vector3(0, 0, 0), end: new Vector3(0, 0, 0),center: new Vector3(0, 0, 0),  width: 0, height: 0 };
    if (this.zones.length > 0) {
      this.zones.forEach(_zone => {
        if (object.position.x > 0 && object.position.x > _zone.start.x && object.position.x < _zone.end.x) {
          zone = _zone;
        } else if (object.position.x < 0 && object.position.x < _zone.start.x && object.position.x > _zone.end.x) {
          zone = _zone;
        }
      });
    }
    return zone;
  }

  sceneZone() {
    return {
      start: new Vector3(-this.screen.x / 2, 0, 0),
      end: new Vector3(this.screen.x / 2, 0, 0),
      width: this.screen.x,
      height: this.screen.y,
    } as Zone
  }
}