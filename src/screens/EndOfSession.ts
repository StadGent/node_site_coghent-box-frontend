import { CubeParams } from '@/Three/schema.cube';
import Colors from '@/Three/defaults.color';
import HelperText from '@/Three/defaults.helperText';
import customText from '@/Three/defaults.text';
import GroupHelper from '@/Three/helper.group';
import Spot from '@/Three/shapes.spotlight';
import TextHelper from '@/Three/helper.text';
import { FontParams } from '@/Three/schema.text';
import { Group, Vector3 } from 'three';
import Images from '@/Three/defaults.images';

const EndOfSession = (
  position: Vector3,
  spotRadius?: number,
): {
  scanTicket: () => Array<Group>;
  goToTouchtable: () => Array<Group>;
  goOnline: () => Array<Group>;
  create: () => Array<Group>;
} => {
  const orTextPosition = () => {
    return position.x / 2;
  };

  const scanTicket = () => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups(
      [Spot().create(new Vector3(-position.x, position.y, position.z), spotRadius || 6)],
      groups,
    );
    GroupHelper().AddObjectsTogroups(
      TextHelper().displayTextFromRecordWithIcon(
        HelperText().scanYourTicketAgain(new Vector3(position.x, position.y, position.z)),
        Colors().white,
        Images.endOfSession['scanQrCode'],
        new Vector3(-position.x - 1, position.y - 1.5, position.z),
        new Vector3(2, 3, 0),
      ),
      groups,
    );
    return groups;
  };
  const goToTouchtable = () => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups(
      [Spot().create(new Vector3(0, position.y, position.z), spotRadius || 6)],
      groups,
    );
    GroupHelper().AddObjectsTogroups(
      TextHelper().displayTextFromRecordWithIcon(
        HelperText().WalkToTouchtable,
        Colors().white,
        Images.endOfSession['touchtable'],
        new Vector3(-1, position.y - 2.5, position.z),
        new Vector3(5, 4, 0),
      ),
      groups,
    );
    return groups;
  };
  const goOnline = () => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups(
      [Spot().create(new Vector3(position.x, position.y, position.z), spotRadius || 6)],
      groups,
    );
    GroupHelper().AddObjectsTogroups(
      TextHelper().displayTextFromRecordWithIcon(
        HelperText().goToWebPortal(new Vector3(position.x, position.y, position.z)),
        Colors().white,
        Images.endOfSession['webPortal'],
        new Vector3(position.x - 1, position.y - 2.5, position.z),
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
      { size: customText.size.veryBig, color: Colors().white } as FontParams,
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
        orOption(new Vector3(orTextPosition(), position.y - 1, position.z)),
        orOption(new Vector3(-orTextPosition() + 1, position.y - 1, position.z)),
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
