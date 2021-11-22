import { MeshBasicMaterial, Mesh, RingGeometry, Vector3 } from 'three';
import ChapeHelper from './Chapehelper';
import Colors from './defaults.color';
import Layers from './defaults.layers';

const CircularProgressBar = (): {
  create: (position: Vector3, radius: number, segments: number,progress: number) => void;
} => {
  const create = (position: Vector3, radius: number, segments: number, progress: number) => {
    const geometry = new RingGeometry(
      radius,
      radius + 0.3,
      360/segments,
      45,
      0,
      (6.3 / 360 /segments) * progress * 360,
    );
    const material = new MeshBasicMaterial({
      color: Colors().white,
      opacity: 0.1,
    });
    const mesh = new Mesh(geometry, material);
    ChapeHelper().SetPosition(position, mesh);
    mesh.position.z = Layers.presentation;
    return mesh;
  };

  return { create };
};

export default CircularProgressBar;
