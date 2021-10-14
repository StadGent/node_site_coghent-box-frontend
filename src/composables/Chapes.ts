import { CircleGeometry, MeshBasicMaterial, Mesh, BoxGeometry } from 'three';

const useThreeChapes = (): {
  Circle: (radius: number, color: any) => any;
  Cube: () => any;
} => {
  const Circle = (radius: number, color: any, segments = 50) => {
    const geometry = new CircleGeometry(radius, segments);
    const material = new MeshBasicMaterial({ color: color });
    return new Mesh(geometry, material);
  };

  const Cube = () => {
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    return new Mesh(geometry, material);
  };

  return {
    Circle,
    Cube,
  };
};

export default useThreeChapes;
