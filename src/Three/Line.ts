import { BufferGeometry, Line, LineBasicMaterial, Vector2 } from 'three';
import useBaseLines from './useBaseLines';
import useChapeHelpers from './useChapeHelpers';

export default class LineHandler {
  baseLines = useBaseLines();
  chapeHelper = useChapeHelpers();
  postion: Vector2;
  line: Line<BufferGeometry, LineBasicMaterial>;

  constructor(_line: Line<BufferGeometry, LineBasicMaterial>, _position: Vector2) {
    this.line = _line;
    this.postion = _position;
  }

  DrawLine() {}
  DrawCircleAtEnd() {}
  DrawCircleAtBeginning() {}
  GetEndOfLine() {
    const position = {
      x: this.line.geometry.attributes.position.array[6],
      y: this.line.geometry.attributes.position.array[7],
    };
    return position as Vector2;
  }
  GetBeginningOfLine() {
    const position = {
      x: this.line.geometry.attributes.position.array[0],
      y: this.line.geometry.attributes.position.array[1],
    };
    return position as Vector2;
  }
}
