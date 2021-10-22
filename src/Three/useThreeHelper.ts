import { Group } from 'three';


const useThreeHelper = (): {
  CreateGroup: (objects: Array<any>, groups: Array<Group>) => void;
  RemoveObjectFromGroup: (object: any, groups: Array<Group>) => void;
} => {
  const CreateGroup = (objects: Array<any>, groups: Array<Group>) =>  {
    const group = new Group()
    objects.map(obj => {
      group.add(obj);
    });
    groups.push(group);
  }

  const RemoveObjectFromGroup = (object: any, groups: Array<Group>) =>  {
    const index = groups.indexOf(object);
    groups.splice(index);
  }

  return {
    CreateGroup,
    RemoveObjectFromGroup,
  }
};

export default useThreeHelper;