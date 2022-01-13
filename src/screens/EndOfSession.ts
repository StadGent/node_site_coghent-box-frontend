import { CubeParams } from '@/Three/schema.cube';
import Colors from '@/Three/defaults.color';
import HelperText from '@/Three/defaults.helperText';
import GroupHelper from '@/Three/helper.group';
import Spot from '@/Three/shapes.spotlight';
import TextHelper from '@/Three/helper.text';
import { FontParams } from '@/Three/schema.text';
import { Group, Vector3 } from 'three';
import Images from '@/Three/defaults.images';
import ZoneService from '@/services/ZoneService';
import Measurements from '@/Three/defaults.measurements';

const EndOfSession = (
  zoneService: ZoneService,
  spotRadius?: number,
): {
  scanTicket: () => Array<Group>;
  goToTouchtable: () => Array<Group>;
  goOnline: () => Array<Group>;
  create: () => Array<Group>;
} => {
  const scanTicket = () => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups(
      [Spot().create(zoneService.zoneCenters[0], spotRadius || 6)],
      groups,
    );
    GroupHelper().AddObjectsTogroups(
      TextHelper().displayTextFromRecordWithIcon(
        HelperText().scanYourTicketAgain(new Vector3(zoneService.zoneCenters[0].x - 1.5,zoneService.zoneCenters[0].y,zoneService.zoneCenters[0].z)),
        Colors().white,
        Images.endOfSession['scanQrCode'],
        new Vector3(zoneService.zoneCenters[0].x - 1.5 , zoneService.zoneCenters[0].y - 1.5, zoneService.zoneCenters[0].z),
        new Vector3(2, 3, 0),
      ),
      groups,
    );
    return groups;
  };
  const goToTouchtable = () => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups(
      [Spot().create(zoneService.middleZoneCenter, spotRadius || 6)],
      groups,
    );
    GroupHelper().AddObjectsTogroups(
      TextHelper().displayTextFromRecordWithIcon(
        HelperText().WalkToTouchtable(new Vector3(-1.5,0,0)),
        Colors().white,
        Images.endOfSession['touchtable'],
        new Vector3(zoneService.middleZoneCenter.x - 1, zoneService.middleZoneCenter.y - 2.5, zoneService.middleZoneCenter.z),
        new Vector3(5, 4, 0),
      ),
      groups,
    );
    return groups;
  };
  const goOnline = () => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups(
      [Spot().create(new Vector3(zoneService.zoneCenters[zoneService.zoneCenters.length - 1].x, zoneService.zoneCenters[zoneService.zoneCenters.length - 1].y, zoneService.zoneCenters[zoneService.zoneCenters.length - 1].z), spotRadius || 6)],
      groups,
    );
    GroupHelper().AddObjectsTogroups(
      TextHelper().displayTextFromRecordWithIcon(
        HelperText().goToWebPortal(new Vector3(zoneService.zoneCenters[zoneService.zoneCenters.length - 1].x - 2, zoneService.zoneCenters[zoneService.zoneCenters.length - 1].y, zoneService.zoneCenters[zoneService.zoneCenters.length - 1].z)),
        Colors().white,
        Images.endOfSession['webPortal'],
        new Vector3(zoneService.zoneCenters[zoneService.zoneCenters.length - 1].x - 1, zoneService.zoneCenters[zoneService.zoneCenters.length - 1].y - 2.5, zoneService.zoneCenters[zoneService.zoneCenters.length - 1].z),
        new Vector3(4, 4, 0),
      ),
      groups,
    );
    return groups;
  };

  const orOption = (position: Vector3) => {
    const text = TextHelper().CreateText(
      'OF',
      position,
      {} as CubeParams,
      { size: Measurements().text.size.veryBig, color: Colors().white } as FontParams,
      0.4,
    );
    return text;
  };

  const create = () => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups(scanTicket(), groups);
    GroupHelper().AddObjectsTogroups(goToTouchtable(), groups);
    GroupHelper().AddObjectsTogroups(goOnline(), groups);
    GroupHelper().AddObjectsTogroups(
      [
        orOption(new Vector3(zoneService.zoneCenters[1].x, zoneService.zoneCenters[1].y - 1, zoneService.zoneCenters[1].z)),
        orOption(new Vector3(zoneService.zoneCenters[zoneService.zoneCenters.length - 2].x + 1, zoneService.zoneCenters[zoneService.zoneCenters.length - 2].y - 1, zoneService.zoneCenters[zoneService.zoneCenters.length - 2].z)),
      ],
      groups,
    );
    return groups;
  };

  return {
    scanTicket,
    goToTouchtable,
    goOnline,
    create,
  };
};

export default EndOfSession;
