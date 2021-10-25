import {
  Mesh,
  MeshBasicMaterial,
  BoxBufferGeometry,
  Group,
} from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import GroupHelper from './GroupHelper';
import Frame1 from '@/frames/Frame1';

const usePredefined = (): {
  BaseStoryCircle: () => Array<Group>;
} => {
  const threeHelper = GroupHelper();

  const BaseStoryCircle = () => {
    // Creating text in the viewport
    const loader = new FontLoader();
    const geometry = new BoxBufferGeometry(10, 10, 0);
    const material = new MeshBasicMaterial({
      color: 0xffffff,
    });
    const m = new Mesh(geometry, material);

    loader.load(
      'three/examples/fonts/helvetiker_regular.typeface.json',
      function (font: any) {
        const geometry = new TextGeometry('Relations', {
          font: font,
          size: 1,
          height: 2,
          curveSegments: 12,
          bevelEnabled: false,
          bevelThickness: 1,
          bevelSize: 0.1,
          bevelSegments: 0.1,
        });
        const txt_mat = new MeshBasicMaterial({ color: 0x000000 });
        const txt_mesh = new Mesh(geometry, txt_mat);
        txt_mesh.position.y = 5;
        txt_mesh.position.z = 0.1;
        m.position.z = 0.1;
        m.add(txt_mesh);
      },
    );

    const groups: Array<Group> = [];
    Frame1().Lines().forEach((l: Group) => {
      groups.push(l);
    })
    threeHelper.AddObjectsTogroups(
      [
        Frame1().mainCircle(),
        Frame1().outerCircle(),
        Frame1().ImageCubes(Frame1().Lines()[0])
      ],
      groups,
    );
    
    return groups;
  };

  return {BaseStoryCircle}
};

export default usePredefined;
