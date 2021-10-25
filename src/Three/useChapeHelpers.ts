import { BoxParams } from '@/models/ThreeServiceModel';
import {
  Mesh,
  CircleGeometry,
  MeshBasicMaterial,
  Vector2,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  BoxGeometry,
  Vector3,
} from 'three';
import { CircleParams } from './CircleSchema';

const useChapeHelpers = (): {
  GetCircleparams: (circle: Mesh<CircleGeometry, MeshBasicMaterial>) => CircleParams;
  GetBoxparams: (box: Mesh<BoxGeometry, MeshBasicMaterial>) => BoxParams;
  SetPosition: (
    position: Vector3,
    chape:
      | Mesh<CircleGeometry, MeshBasicMaterial>
      | Line<BufferGeometry, LineBasicMaterial>
      | Mesh<BoxGeometry, MeshBasicMaterial>,
  ) => void;
  GetEndOfLine: (line: Line<BufferGeometry, LineBasicMaterial>) => Vector3;
  SetImageAtEndOfLine: (
    line: Line<BufferGeometry, LineBasicMaterial>,
    boxImage: Mesh<BoxGeometry, MeshBasicMaterial>,
  ) => void;
  scaleBoxImage: (boxImage: Mesh<BoxGeometry, MeshBasicMaterial>, scale: Vector3) => void;
} => {

  const GetCircleparams = (circle: Mesh<CircleGeometry, MeshBasicMaterial>) => {
    return circle.geometry.parameters as CircleParams;
  };
  const GetBoxparams = (box: Mesh<BoxGeometry, MeshBasicMaterial>) => {
    return box.geometry.parameters as BoxParams;
  };

  const GetEndOfLine = (line: Line<BufferGeometry, LineBasicMaterial>) => {
    const position = {
      x: line.geometry.attributes.position.array[6],
      y: line.geometry.attributes.position.array[7],
    };
    return position as Vector3;
  };

  const scaleBoxImage = (
    boxImage: Mesh<BoxGeometry, MeshBasicMaterial>,
    scale: Vector3,
  ) => {
    boxImage.scale.set(scale.x, scale.y, scale.z);
  };

  const SetImageAtEndOfLine = (
    line: Line<BufferGeometry, LineBasicMaterial>,
    boxImage: Mesh<BoxGeometry, MeshBasicMaterial>,
  ) => {
    const pos = GetEndOfLine(line);
    if (pos.x > 0) {
      SetPosition(
        { x: pos.x + GetBoxparams(boxImage).width / 2 + 0.1, y: pos.y } as Vector3,
        boxImage,
      );
    } else {
      SetPosition(
        { x: pos.x - GetBoxparams(boxImage).width / 2 - 0.1, y: pos.y } as Vector3,
        boxImage,
      );
    }
  };

  const SetPosition = (
    position: Vector3,
    chape:
      | Mesh<CircleGeometry, MeshBasicMaterial>
      | Line<BufferGeometry, LineBasicMaterial>
      | Mesh<BoxGeometry, MeshBasicMaterial>,
  ) => {
    chape.position.x = position.x;
    chape.position.y = position.y;
  };

  return {
    GetCircleparams,
    GetBoxparams,
    SetPosition,
    GetEndOfLine,
    SetImageAtEndOfLine,
    scaleBoxImage,
  };
};

export default useChapeHelpers;
