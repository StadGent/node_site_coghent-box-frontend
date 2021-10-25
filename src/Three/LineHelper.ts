import { Vector3, Line, LineBasicMaterial, BufferGeometry } from 'three';

const LineHelper = (): {
  GetEndOfLine: (line: Line<BufferGeometry, LineBasicMaterial>) => Vector3
} => {
  const GetEndOfLine = (line: Line<BufferGeometry, LineBasicMaterial>) => {
    const position = {
      x: line.geometry.attributes.position.array[6],
      y: line.geometry.attributes.position.array[7],
    };
    return position as Vector3;
  };

  return {GetEndOfLine}
};

export default LineHelper;