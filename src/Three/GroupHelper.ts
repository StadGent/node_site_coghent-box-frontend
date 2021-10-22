import { Group } from 'three';

const GroupHelper = (): {
  CreateGroup: (objects: Array<any>) => Group;
  AddObjectsTogroups: (objects: Array<any>, groups: Array<Group>) => void;
} => {
  const CreateGroup = (objects: Array<any>) => {
    const group = new Group();
    objects.map((obj) => {
      group.add(obj);
    });
    return group;
  };

  const AddObjectsTogroups = (objects: Array<any>, groups: Array<Group>) => {
    const group = new Group();
    objects.map((obj) => {
      group.add(obj);
    });
    groups.push(group);
  };

  return {
    CreateGroup,
    AddObjectsTogroups,
  };
};

export default GroupHelper;
