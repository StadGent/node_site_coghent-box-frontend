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
): {
  scanTicket: () => Promise<Array<Group>>;
  goToTouchtable: () => Promise<Array<Group>>;
  goOnline: () => Promise<Array<Group>>;
  create: () => Promise<Array<Group>>;
} => {
  const scanTicket = async () => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups(
      [Spot().create(zoneService.zoneCenters[0], Measurements().spotLight.radius)],
      groups,
    );
    GroupHelper().AddObjectsTogroups(
      await TextHelper().displayTextFromRecordWithIcon(
        HelperText().scanYourTicketAgain(
          new Vector3(
            zoneService.zoneCenters[0].x - 150,
            zoneService.zoneCenters[0].y + 50,
            zoneService.zoneCenters[0].z,
          ),
        ),
        Colors().white,
        Images.endOfSession['scanQrCode'],
        new Vector3(
          zoneService.zoneCenters[0].x - 1.5,
          zoneService.zoneCenters[0].y - 150,
          zoneService.zoneCenters[0].z,
        ),
        new Vector3(200, 300, 0),
      ),
      groups,
    );
    return groups;
  };
  const goToTouchtable = async () => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups(
      await TextHelper().displayTextFromRecordWithIcon(
        HelperText().WalkToTouchtable(new Vector3(-150, 50, 0)),
        Colors().white,
        Images.endOfSession['touchtable'],
        new Vector3(
          zoneService.middleZoneCenter.x - 100,
          zoneService.middleZoneCenter.y - 200,
          zoneService.middleZoneCenter.z,
        ),
        new Vector3(400, 300, 0),
      ),
      groups,
    );
    return groups;
  };
  const goOnline = async () => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups(
      [
        Spot().create(
          new Vector3(
            zoneService.zoneCenters[zoneService.zoneCenters.length - 1].x,
            zoneService.zoneCenters[zoneService.zoneCenters.length - 1].y,
            zoneService.zoneCenters[zoneService.zoneCenters.length - 1].z,
          ),
          Measurements().spotLight.radius,
        ),
      ],
      groups,
    );
    GroupHelper().AddObjectsTogroups(
      await TextHelper().displayTextFromRecordWithIcon(
        HelperText().goToWebPortal(
          new Vector3(
            zoneService.zoneCenters[zoneService.zoneCenters.length - 1].x - 200,
            zoneService.zoneCenters[zoneService.zoneCenters.length - 1].y ,
            zoneService.zoneCenters[zoneService.zoneCenters.length - 1].z,
          ),
        ),
        Colors().white,
        Images.endOfSession['webPortal'],
        new Vector3(
          zoneService.zoneCenters[zoneService.zoneCenters.length - 1].x - 100,
          zoneService.zoneCenters[zoneService.zoneCenters.length - 1].y - 200,
          zoneService.zoneCenters[zoneService.zoneCenters.length - 1].z,
        ),
        new Vector3(300, 300, 0),
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

  const create = async () => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups(await scanTicket(), groups);
    GroupHelper().AddObjectsTogroups(await goToTouchtable(), groups);
    GroupHelper().AddObjectsTogroups(await goOnline(), groups);
    const or1 = await orOption(
      new Vector3(
        zoneService.zoneCenters[1].x - 120,
        zoneService.zoneCenters[1].y - 50,
        zoneService.zoneCenters[1].z,
      ),
    );
    const or2 = await orOption(
      new Vector3(
        zoneService.zoneCenters[zoneService.zoneCenters.length - 2].x - 120,
        zoneService.zoneCenters[zoneService.zoneCenters.length - 2].y - 50,
        zoneService.zoneCenters[zoneService.zoneCenters.length - 2].z,
      ),
    );

    GroupHelper().AddObjectsTogroups([or1, or2], groups);
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
