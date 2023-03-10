import { Mesh, MeshBasicMaterial, BoxBufferGeometry, Vector3 } from 'three';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import ChapeHelper from './helper.chape';
import { CubeParams } from './schema.cube';
import DefaultColors from './defaults.color';
import Colors from './defaults.color';

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

let globalFont: Font;

const SchemaText = (): {
  LoadText: (schema: TextSchema, opacity: number) => Promise<Mesh>;
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

  const LoadText = async (schema: TextSchema, opacity: number) => {
    const txtBox = CreateTextBox(
      {
        height: schema.textBoxParams.height,
        width: schema.textBoxParams.width,
        color: schema.textBoxParams.color,
      },
      schema.position,
    );
    if (!globalFont) globalFont = await loader.loadAsync(schema.fontParams.path);

    const txtGeometry = CreateTextGeometry(
      schema.text,
      schema.fontParams.size,
      globalFont,
    );
    const txt_mat = new MeshBasicMaterial({
      color: schema.fontParams.color,
      transparent: true,
      opacity: opacity,
    });
    txt_mat.transparent = true;
    txt_mat.opacity = opacity;
    txt_mat.color.convertSRGBToLinear();
    txtBox.add(new Mesh(txtGeometry, txt_mat));
    return txtBox;
  };

  return { LoadText };
};

export default SchemaText;
