import Colors from '@/Three/defaults.color';
import HelperText from '@/Three/defaults.helperText';
import GroupHelper from '@/Three/GroupHelper';
import Spot from '@/Three/Spotlight';
import TextHelper from '@/Three/TextHelper';
import { Group, Vector3 } from 'three';

const EndOfSession = (): {
  scanTicket:() => Array<Group>;
  goToTouchtable:() => Array<Group>;
  goOnline:() => Array<Group>;
  create: () => Array<Group>;
} => {

  const scanTicket = () => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups([Spot().create(new Vector3(-13,1,0), 6)], groups);
    GroupHelper().AddObjectsTogroups(TextHelper().displayTextFromRecordWithIcon(HelperText().scanYourTicket,Colors().black,'https://cdn-icons-png.flaticon.com/512/844/844994.png', new Vector3(-13,0,0),  new Vector3(3,2,0)),groups);
    return groups;
  };
  const goToTouchtable = () => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups([Spot().create(new Vector3(0,1,0), 6)], groups);
    GroupHelper().AddObjectsTogroups(TextHelper().displayTextFromRecordWithIcon(HelperText().WalkToTouchtable,Colors().black,'https://cdn-icons-png.flaticon.com/512/844/844994.png', new Vector3(0,0,0),  new Vector3(3,2,0)), groups);
    return groups;
  };
  const goOnline = () => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups([Spot().create(new Vector3(13,1,0), 6)], groups);
    GroupHelper().AddObjectsTogroups(TextHelper().displayTextFromRecordWithIcon(HelperText().goToWebPortal,Colors().black,'https://cdn-icons-png.flaticon.com/512/844/844994.png', new Vector3(13,0,0),  new Vector3(3,2,0)), groups);
    return groups;
  };

  const create = () => {
    const groups: Array<Group> = [];
    GroupHelper().AddObjectsTogroups(scanTicket(), groups);
    GroupHelper().AddObjectsTogroups(goToTouchtable(), groups);
    GroupHelper().AddObjectsTogroups(goOnline(), groups);
    return groups;
  };

  return {
    scanTicket,
    goToTouchtable,
    goOnline,
    create,
  }
};

export default EndOfSession;