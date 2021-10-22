import {
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Vector2,
  Vector3,
  LineBasicMaterialParameters,
  Mesh,
  CircleGeometry,
  MeshBasicMaterial,
} from 'three';
import BaseChapes from './BaseChapes';
import useChapeHelpers from './useChapeHelpers';

export default class LineHandler {
  chapeHelper = useChapeHelpers();
  baseChapeHelper = BaseChapes();
  positions: Array<Vector2>;
  line: Line<BufferGeometry, LineBasicMaterial> = new Line();
  material: LineBasicMaterialParameters;
  beginLine = new Vector3();
  endLine = new Vector3();

  constructor(
    _positions: Array<Vector2>,
    _material: LineBasicMaterialParameters,
    _line?: Line<BufferGeometry, LineBasicMaterial>,
  ) {
    this.positions = _positions;
    this.material = _material;
    this.CreateLine(this.positions, this.material);
  }

  /**
   * Update scene, worldMatrix, group, groups? Service?
   */
  Update() {
    console.log('Update Line');
    this.GetBeginningOfLine();
    this.GetEndOfLine();
  }
  SetPosition(positions: Array<Vector2>) {
    this.CreateLine(positions, this.material);
    this.Update();
  }
  CreateLine(positions: Array<Vector2>, materialParams: LineBasicMaterialParameters) {
    const material = new LineBasicMaterial(materialParams);
    this.line = this.baseChapeHelper.DrawLine(positions, materialParams);
    this.Update();
  }
  DrawCircleAtEnd(circle: Mesh<CircleGeometry, MeshBasicMaterial>) {
    this.chapeHelper.SetPosition(this.beginLine, circle);
    this.Update();
  }
  DrawCircleAtBeginning(circle: Mesh<CircleGeometry, MeshBasicMaterial>) {
    this.chapeHelper.SetPosition(this.endLine, circle);
    this.Update();
  }
  GetEndOfLine() {
    const position = {
      x: this.line.geometry.attributes.position.array[6],
      y: this.line.geometry.attributes.position.array[7],
    };
    this.endLine = position as Vector3;
  }
  GetBeginningOfLine() {
    const position = {
      x: this.line.geometry.attributes.position.array[0],
      y: this.line.geometry.attributes.position.array[1],
    };
    this.beginLine = position as Vector3;
  }
}
