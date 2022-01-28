import Colors from '@/Three/defaults.color';
import Defaults from '@/Three/defaults.config';
import { CubeParams } from '@/Three/schema.cube';
import SchemaText, { FontParams, TextSchema } from '@/Three/schema.text';
import { Mesh, MeshBasicMaterial, MeshBasicMaterialParameters, Vector3 } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { Tags } from './TaggingService';
import ThreeService from './ThreeService';

class TextService{
  loader: FontLoader;
  threeService: ThreeService;

  constructor(_threeService: ThreeService){
    this.loader = new FontLoader();
    this.threeService = _threeService;
  }  

  calculateLength(_string: string) {
    // NOTE: this includes spaces
    return _string.length;
  }

  calculateWordCount(_string: string) {
    return _string.split(' ').length;
  }
  calculateTotalStringWidth(_string: string, _fontSize: number) {
    return this.calculateLength(_string) - (this.calculateWordCount(_string) - 1);
  }

  correctionToPlaceTextInCenter(_string: string, _position: Vector3, _fontSize: number) {
    const width = this.calculateTotalStringWidth(_string, _fontSize);
    _position.setX(_position.x - width / 2);
    this.correctheight(_position, _fontSize);
    return _position;
  }

  private correctheight(_position: Vector3, _fontSize: number) {
    _position.setY(_position.y - (_fontSize / 2))
    return _position;
  }

  createTextMesh(_string: string, _size: number, _color: number, _position: Vector3) {

    this.loader.load(Defaults().fontPath(), (_font: Font) => {
      const geometry = new TextGeometry(_string, {
        font: _font,
        height: 0,
        size: _size,
        curveSegments: 90,
      });

      const mesh = new Mesh(geometry, new MeshBasicMaterial({color: _color} as MeshBasicMaterialParameters));
      console.log({mesh});
          
      
      this.threeService.AddToScene(mesh, Tags.Testing);
    });
  }

  createLeftAlignedText(_position: Vector3, _text: string, _fontSize: number) {
    const textMesh = SchemaText().LoadText(
      {
        text: _text,
        position: this.correctheight(_position, _fontSize),
        fontParams: { size: _fontSize, color: Colors().white, path: Defaults().fontPath() } as FontParams,
        textBoxParams: { width: this.calculateTotalStringWidth(_text, _fontSize), height: _fontSize, color: Colors().pink, opacity: 1 } as CubeParams
      } as TextSchema, 1);
    return textMesh;
  }

  createCenteredText(_position: Vector3, _text: string, _fontSize: number) {
    console.log('Calculated string length', this.calculateLength(_text));
    console.log('Calculated word count', this.calculateWordCount(_text));
    console.log('Calculated string width ', this.calculateTotalStringWidth(_text, _fontSize));
    const textMesh = SchemaText().LoadText(
      {
        text: _text,
        position: this.correctionToPlaceTextInCenter(_text, _position, _fontSize),
        fontParams: { size: _fontSize, color: Colors().white, path: Defaults().fontPath() } as FontParams,
        textBoxParams: { width: this.calculateTotalStringWidth(_text, _fontSize), height: _fontSize, color: Colors().pink, opacity: 1 } as CubeParams
      } as TextSchema, 1);
    return textMesh;
  }
}

export default TextService;