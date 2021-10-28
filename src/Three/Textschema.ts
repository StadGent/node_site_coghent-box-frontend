import { Mesh, MeshBasicMaterial, BoxBufferGeometry, Vector3 } from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import ChapeHelper from './Chapehelper';
import { CubeParams } from './CubeSchema';
import Defaults from './defaults.config';
import Correction from './Correction';

export type FontParams = {
  path: string;
  size: number;
  color: number;
};

export type TextSchema = {
  text: string;
  position: Vector3;
  fontParams: FontParams;
  textBoxParams: CubeParams;
};

const SchemaText = (): {
  LoadText: (schema: TextSchema) => Mesh;
} => {
  const loader = new FontLoader();
  const CreateTextBox = (params: CubeParams) => {
    const geometry = new BoxBufferGeometry(params.width, params.height, 0);
    const material = new MeshBasicMaterial({
      color: params.color || 0x0000000,
    });
    material.color.convertSRGBToLinear();
    return new Mesh(geometry, material);
  };

  const CreateTextGeometry = (text: string, size: number, font: any) => {
    const geometry = new TextGeometry(text, {
      font: font,
      size: size,
      height: 0,
      curveSegments: 90,
      bevelEnabled: false,
      bevelThickness: 0,
      bevelSize: 0,
      bevelSegments: 0,
    });
    return geometry;
  };

  const LoadText = (schema: TextSchema) => {
    const txtBox = CreateTextBox({
      height: schema.textBoxParams.height,
      width: schema.textBoxParams.width,
      color: schema.textBoxParams.color,
    });
    Correction().CorrectTextBoxPosition(schema.position, txtBox);
    loader.load(schema.fontParams.path, function (font: any) {
      const txtGeometry = CreateTextGeometry(schema.text, schema.fontParams.size, font);
      const txt_mat = new MeshBasicMaterial({
        color: schema.fontParams.color,
      });
      txt_mat.color.convertSRGBToLinear();
      const txt_mesh = new Mesh(txtGeometry, txt_mat);
      txt_mesh.position.y = 0;
      txt_mesh.position.x = -1;
      txt_mesh.position.z = 0;
      txtBox.add(txt_mesh);
    });
    return txtBox;
  };

  return { LoadText };
};

export default SchemaText;
