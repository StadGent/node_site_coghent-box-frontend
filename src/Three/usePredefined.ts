import { Mesh, MeshBasicMaterial, BoxBufferGeometry, Group, Vector3 } from 'three';
import GroupHelper from './GroupHelper';
import Frame1 from '@/frames/Frame1';
import TextHelper, { TextSchema } from './Textschema';
import Defaults from './defaults.config';

const usePredefined = (): {
  BaseStoryCircle: () => Array<Group> | Mesh<BoxBufferGeometry, MeshBasicMaterial>[] | any;
} => {
  const threeHelper = GroupHelper();
  const textHelper = TextHelper();

  const BaseStoryCircle = () => {
    // Creating text in the viewport
    const words: Record<string, Vector3> = {
      'Relations': { x:1, y:0, z:0} as Vector3,
      'Migration': { x: 3, y: 3, z: 0 } as Vector3,
      'Stories': { x: -3, y: -1, z: 0 } as Vector3,
      'More': { x: -5, y: -2, z: 0 } as Vector3,
      'Text': { x: 5, y: 2, z: 0 } as Vector3,
    };
    const txtMeshes = Defaults().TextSchemas(words);

    const frame1 = Frame1().Frame();

    return txtMeshes;
  };

  return { BaseStoryCircle };
};

export default usePredefined;
