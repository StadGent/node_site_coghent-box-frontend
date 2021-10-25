import { Mesh, MeshBasicMaterial, BoxBufferGeometry, Group } from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import GroupHelper from './GroupHelper';
import Frame1 from '@/frames/Frame1';

const usePredefined = (): {
  BaseStoryCircle: () => Array<Group> | Mesh<BoxBufferGeometry, MeshBasicMaterial>[];
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

    loader.load('/Fonts/myFont.json', function (font: any) {
      const geometry = new TextGeometry('Relations', {
        font: font,
        size: 1,
        height: 0,
        curveSegments: 90,
        bevelEnabled: false,
        bevelThickness: 0,
        bevelSize: 0,
        bevelSegments: 0,
      });
      const txt_mat = new MeshBasicMaterial({ color: 0x0000000 });
      const txt_mesh = new Mesh(geometry, txt_mat);
      txt_mesh.position.y = 0;
      txt_mesh.position.x = -2;
      txt_mesh.position.z = 0;
      m.add(txt_mesh);
    });

    const frame1 = Frame1().Frame();

    return [m];
  };

  return { BaseStoryCircle };
};

export default usePredefined;
