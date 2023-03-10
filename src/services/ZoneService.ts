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
  public zones: Array<Zone>;
  public zoneDimensions = new Vector3(0, 0, 0);
  public zoomPositionLeft = new Vector3(0,0,0)
  public zoomPositionRight = new Vector3(0,0,0)

  constructor(_screen: Vector3, _zones: number) {
    this.screen = _screen;
    this.zones = this.createZones(_zones);
    this.zoneCenters = this.centerOfZones();
    this.zoomPositionLeft = this.zoneCenters[1]
    this.zoomPositionRight = this.zoneCenters[4]
    this.middleZoneCenter = new Vector3(0, 0, Layers.scene);
    this.zonesInnerToOuter = this.orderZoneCentersFromInnerToOuterPosition();
  }

  private centerOfZones() {
    const centers: Array<Vector3> = [];
    this.zones.forEach((_zone) => {
      centers.push(_zone.center);
    });
    return centers;
  }

  private setZoneDimensions(width: number, height: number) {
    return new Vector3(
      width - Defaults().zonePadding(),
      height - Defaults().zonePadding(),
      0,
    );
  }

  private orderZoneCentersFromInnerToOuterPosition() {
    const zones: Array<Vector3> = [];
    let positionOfIndex = Math.floor(this.zoneCenters.length / 2);
    for (let index = 1;index < this.zoneCenters.length;index++) {
      if (index % 2 === 0) {
        positionOfIndex += index;
        zones.push(this.zones[positionOfIndex].start);
      } else if (Math.abs(index % 2) == 1) {
        positionOfIndex -= index;
        zones.push(this.zones[positionOfIndex].start);
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

    let pointer = screenStart;

    this.zoneDimensions = this.setZoneDimensions(zoneWidth, zoneheight);
    while (pointer + zoneWidth <= screenEnd) {
      zones.push({
        start: new Vector3(pointer, zoneheight, Layers.scene),
        end: new Vector3(pointer + zoneWidth, zoneheight, Layers.scene),
        center: new Vector3(pointer + zoneWidth / 2, 0, Layers.scene),
        width: zoneWidth,
        height: zoneheight,
      } as Zone);
      pointer += zoneWidth;
    }
    this.zones = zones.sort((a, b) => a.start.x - b.start.x);
    return this.zones;
  }

  objectIsInZone(object: Mesh) {
    let zone: Zone = {
      start: new Vector3(0, 0, 0),
      end: new Vector3(0, 0, 0),
      center: new Vector3(0, 0, 0),
      width: 0,
      height: 0,
    };
    let zoneIndex;
    if (this.zones.length > 0) {
      for (const [i, _zone] of this.zones.entries()) {
        if (
          object.position.x > 0 &&
          object.position.x > _zone.start.x &&
          object.position.x < _zone.end.x
        ) {
          // zone = _zone;
          zoneIndex = i;
        } else if (
          object.position.x < 0 &&
          object.position.x > _zone.start.x &&
          object.position.x < _zone.end.x
        ) {
          // zone = _zone;
          zoneIndex = i;
        }
      }
      if (zoneIndex == 2) {
        zone = this.zones[1];
      }

      if (zoneIndex == 3) {
        zone = this.zones[4];
      }

      if (zoneIndex != 2 && zoneIndex != 3) {
        zone = this.zones[zoneIndex ? zoneIndex : 1];
      }
    }
    return zone;
  }

  sceneZone() {
    return {
      start: new Vector3(-this.screen.x / 2, 0, 0),
      end: new Vector3(this.screen.x / 2, 0, 0),
      width: this.screen.x,
      height: this.screen.y,
    } as Zone;
  }

  isInOuterZone(_zone: Zone) {
    let inZone: null | number = null
    if (_zone.start.x === -(this.screen.x/2)) {
      inZone = 0
    }
    if (_zone.end.x === (this.screen.x/2)) {
      inZone = Defaults().screenZones()
    }
    return inZone
  }
}
