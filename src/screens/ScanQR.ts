import {
  Group,
  Vector3,
} from 'three';
import TextHelper from '@/Three/helper.text';
import HelperText from '@/Three/defaults.helperText';
import Colors from '@/Three/defaults.color';
import SchemaCube, { CubeParams, CubeSchema } from '@/Three/schema.cube';
import GroupHelper from '@/Three/helper.group';

const ScanQR = (position: Vector3): {
  create: () => Array<Group>;
} => {

  const arrow = () => {
    const cube = SchemaCube().CreateCube({position: new Vector3(position.x, position.y + 3, position.z),params: {height: 1, width: 2, color: Colors().pink} as CubeParams} as CubeSchema); 
    return cube;
  }
  
  const create = () => {
    const groups: Array<Group> = [];
    const textWithIcon = TextHelper().displayTextFromRecordWithIcon(HelperText().scanYourTicket(position),Colors().white,'',new Vector3(position.x,position.y - 1,position.z),new Vector3(2,2,0));
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
