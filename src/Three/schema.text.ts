import { Mesh, MeshBasicMaterial, BoxBufferGeometry, Vector3 } from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import ChapeHelper from './helper.chape';
import { CubeParams } from './schema.cube';
import DefaultColors from './defaults.color';
import Layers from './defaults.layers';

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
  LoadText: (schema: TextSchema, opacity: number) => Mesh;
} => {
  const loader = new FontLoader();
  const CreateTextBox = (params: CubeParams, position: Vector3) => {
    const geometry = new BoxBufferGeometry(params.width, params.height, 0);
    const material = new MeshBasicMaterial({
      color: params.color || DefaultColors().black,
      opacity: 0,
      transparent: true,
    });
    material.color.convertSRGBToLinear();
    const textBox = new Mesh(geometry, material);
    ChapeHelper().SetPosition(position, textBox);
    return textBox;
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

  const LoadText = (schema: TextSchema, opacity: number) => {
    const txtBox = CreateTextBox(
      {
        height: schema.textBoxParams.height,
        width: schema.textBoxParams.width,
        color: schema.textBoxParams.color,
      },
      schema.position,
    );
    loader.load(schema.fontParams.path, function (font: any) {
      const txtGeometry = CreateTextGeometry(schema.text, schema.fontParams.size, font);
      const txt_mat = new MeshBasicMaterial({
        color: schema.fontParams.color,
        transparent: true,
        opacity: opacity,
      });
      txt_mat.transparent = true;
      txt_mat.opacity = opacity;
      txt_mat.color.convertSRGBToLinear();
      const txt_mesh = new Mesh(txtGeometry, txt_mat);
      txt_mesh.position.y = 0.5;
      txt_mesh.position.x = -1.5;
      txt_mesh.position.z = Layers.presentation;
      txtBox.add(txt_mesh);
      txtBox.position.z = Layers.scene;
    });
    return txtBox;
  };

  return { LoadText };
};

export default SchemaText;
