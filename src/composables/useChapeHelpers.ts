import { CircleParams, Position } from '@/models/ThreeServiceModel';
import {
  Mesh,
  CircleGeometry,
  MeshBasicMaterial,
  BufferGeometry,
  Line,
  LineBasicMaterial,
} from 'three';

const useChapeHelpers = (): {
  CalculatePointOfCircle: (angle: number, radius: number) => Position;
  GetCircleparams: (circle: Mesh<CircleGeometry, MeshBasicMaterial>) => CircleParams;
  GetLineParams: (line: Line<BufferGeometry, LineBasicMaterial>) => unknown;
  SetPosition: (
    position: Position,
    chape: Mesh<CircleGeometry, MeshBasicMaterial>,
  ) => void;
} => {
  const CalculatePointOfCircle = (angle: number, radius: number) => {
    const posX = radius * Math.cos(angle) + 0;
    const posY = radius * Math.sin(angle) + 0;
    return { x: posX, y: posY } as Position;
  };

  const GetCircleparams = (circle: Mesh<CircleGeometry, MeshBasicMaterial>) => {
    return circle.geometry.parameters as CircleParams;
  };

  const GetLineParams = (line: Line<BufferGeometry, LineBasicMaterial>) => {
    console.log(line.position.x);
    console.log(line.position.y);
    console.log(line.getWorldPosition);
  };

  const SetPosition = (
    position: Position,
    chape: Mesh<CircleGeometry, MeshBasicMaterial>,
  ) => {
    chape.position.x = position.x;
    chape.position.y = position.y;
  };

  return { CalculatePointOfCircle, GetCircleparams, GetLineParams, SetPosition };
};

export default useChapeHelpers;
