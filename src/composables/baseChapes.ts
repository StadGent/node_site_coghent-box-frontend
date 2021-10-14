import { Coordinates, Position } from '@/models/ThreeServiceModel';
import {
  CircleGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector2,
  BufferGeometry,
  Line,
  LineBasicMaterial,
} from 'three';

const useBaseChapes = (): {
  Circle: (radius: number, color: any) => Mesh<CircleGeometry, MeshBasicMaterial>;
  StraightLine: (position: Coordinates) => Line<BufferGeometry, LineBasicMaterial>;
  AngledLineRight: (
    position: Position,
    up?: true | false,
  ) => Line<BufferGeometry, LineBasicMaterial>;
  AngledLineLeft: (
    position: Position,
    up?: true | false,
  ) => Line<BufferGeometry, LineBasicMaterial>;
} => {
  const meshMaterial = (color: any) => new MeshBasicMaterial({ color: color });
  const lineMaterial = (color: any) => new LineBasicMaterial({ color: color });

  const Circle = (radius: number, color: any, segments = 50) => {
    const geometry = new CircleGeometry(radius, segments);
    const material = meshMaterial(color);
    return new Mesh(geometry, material);
  };
  const StraightLine = (positon: Coordinates) => {
    const points = [];
    points.push(new Vector2(positon.start.x, positon.start.y));
    points.push(new Vector2(positon.end.x, positon.end.y));
    const geometry = new BufferGeometry().setFromPoints(points);
    const material = lineMaterial(0x02a77f);
    return new Line(geometry, material);
  };
  const AngledLineRight = (positon: Position, up = true) => {
    const points = [];
    points.push(new Vector2(positon.x, positon.y));
    points.push(new Vector2(positon.x + 2, positon.y));
    if (up) {
      points.push(new Vector2(positon.x + 3, positon.y + 1));
    } else points.push(new Vector2(positon.x + 3, positon.y - 1));
    const geometry = new BufferGeometry().setFromPoints(points);
    const material = lineMaterial(0x02a77f);
    return new Line(geometry, material);
  };
  const AngledLineLeft = (positon: Position, up = true) => {
    const points = [];
    points.push(new Vector2(positon.x, positon.y));
    points.push(new Vector2(positon.x - 2, positon.y));
    if (up) {
      points.push(new Vector2(positon.x - 3, positon.y + 1));
    } else points.push(new Vector2(positon.x - 3, positon.y - 1));
    const geometry = new BufferGeometry().setFromPoints(points);
    const material = lineMaterial(0x02a77f);
    return new Line(geometry, material);
  };

  return {
    Circle,
    StraightLine,
    AngledLineRight,
    AngledLineLeft,
  };
};

export default useBaseChapes;
