import {
  Group,
  Vector3,
} from 'three';
import TextHelper from '@/Three/helper.text';
import HelperText from '@/Three/defaults.helperText';
import Colors from '@/Three/defaults.color';
import SchemaCube, { CubeParams, CubeSchema } from '@/Three/schema.cube';
import GroupHelper from '@/Three/helper.group';
import Images from '@/Three/defaults.images';

const ScanQR = (position: Vector3): {
  create: () => Promise<Array<Group>>;
} => {

  const arrow = () => {
    const cube = SchemaCube().CreateImageCube({position: new Vector3(position.x + 2.5, position.y + 200, position.z),params: {height: 100, width: 200, url: Images.startOfSession.arrow, color: Colors().pink} as CubeParams} as CubeSchema); 
    return cube;
  }
  
  const create = async () => {
    const groups: Array<Group> = [];
    const textWithIcon = await TextHelper().displayTextFromRecordWithIcon(HelperText().scanYourTicket(position),Colors().white,Images.startOfSession.scanQrCode,new Vector3(position.x , position.y - 180, position.z),new Vector3(200,300,0));
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
