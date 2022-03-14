import { Group, Vector3 } from 'three';
import TextHelper from '@/Three/helper.text';
import HelperText from '@/Three/defaults.helperText';
import Colors from '@/Three/defaults.color';
import SchemaCube, { CubeParams, CubeSchema } from '@/Three/schema.cube';
import GroupHelper from '@/Three/helper.group';
import Images from '@/Three/defaults.images';
const TWEEN = require('@tweenjs/tween.js');

const ScanQR = (
  position: Vector3,
): {
  create: () => Promise<Array<Group>>;
} => {
  const arrow = () => {
    const cube = SchemaCube().CreateImageCube({
      position: new Vector3(position.x + 2.5, position.y + 200, -1),
      params: {
        height: 100,
        width: 200,
        url: Images.startOfSession.arrow,
        color: Colors().pink,
      } as CubeParams,
    } as CubeSchema);
    const targetPosition = new Vector3(position.x - 5, position.y + 200, -1);

    new TWEEN.Tween(cube.position)
      .to(targetPosition)
      .repeat(Infinity)
      .yoyo(true)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();

    return cube;
  };

  const create = async () => {
    const groups: Array<Group> = [];
    const textWithIcon = await TextHelper().displayTextFromRecordWithIcon(
      HelperText().scanYourTicket(position),
      Colors().white,
      Images.startOfSession.scanQrCode,
      new Vector3(position.x, position.y - 180, -1),
      new Vector3(200, 300, 0),
    );
    const direction = arrow();
    GroupHelper().AddObjectsTogroups(textWithIcon, groups);
    GroupHelper().AddObjectsTogroups([direction], groups);
    return groups;
  };

  return {
    create,
  };
};

export default ScanQR;
