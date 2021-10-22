import {
  Mesh,
  CircleGeometry,
  MeshBasicMaterial,
  Line,
  BufferGeometry,
  LineBasicMaterial,
  BoxGeometry,
  Vector2,
  BoxBufferGeometry,
  Group,
} from 'three';
import useBaseLines from './useBaseLines';
import useChapeHelpers from './useChapeHelpers';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import useThreeHelper from './useThreeHelper';
import LineHandler from './Line';
import BaseChapes from './BaseChapes';

const usePredefined = (): {
  BaseStoryCircle: () => (
    | Mesh<CircleGeometry, MeshBasicMaterial>
    | Line<BufferGeometry, LineBasicMaterial>
    | Mesh<BoxGeometry, MeshBasicMaterial>
    | Group
    | Array<Group>
  )[];
} => {
  const baseChapeHelper = BaseChapes();
  const baseLineHelper = useBaseLines();
  const chapeHelper = useChapeHelpers();
  const threeHelper = useThreeHelper();

  const BaseStoryCircle = () => {
    const circle = baseChapeHelper.DrawCircle(2, 0x02a77f);
    const outerCircle = baseChapeHelper.DrawOuterCircle(2.5, 0x02a77f);
    const positions = chapeHelper.GetCirclePointsForCircle();
    const line1 = baseLineHelper.DrawLineR1(positions[0]);
    const myLine = new LineHandler(
      [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
      ] as Vector2[],
      { color: 0x02a77f },
    );
    console.log(myLine.positions);
    console.log(myLine.beginLine);
    console.log(myLine.endLine);
    const line2 = baseLineHelper.DrawLineR2(positions[1]);
    const line3 = baseLineHelper.DrawLineR3(positions[2]);
    const line4 = baseLineHelper.DrawLineL1(positions[3]);
    const line5 = baseLineHelper.DrawLineL2(positions[4]);

    const circle2 = baseChapeHelper.DrawCircle(0.08, 0x02a77f);
    const circle3 = baseChapeHelper.DrawCircle(0.08, 0x02a77f);
    const circle4 = baseChapeHelper.DrawCircle(0.08, 0x02a77f);
    const circle5 = baseChapeHelper.DrawCircle(0.08, 0x02a77f);
    const circle6 = baseChapeHelper.DrawCircle(0.08, 0x02a77f);
    chapeHelper.SetPosition(chapeHelper.GetEndOfLine(line1), circle2);
    chapeHelper.SetPosition(chapeHelper.GetEndOfLine(line2), circle3);
    chapeHelper.SetPosition(chapeHelper.GetEndOfLine(line3), circle4);
    chapeHelper.SetPosition(chapeHelper.GetEndOfLine(line4), circle5);
    chapeHelper.SetPosition(chapeHelper.GetEndOfLine(line5), circle6);

    const imageCube = baseChapeHelper.DrawImageCube(
      'https://pixy.org/src/21/219269.jpg',
      new Vector2(2, 2),
    );
    const imageCube1 = baseChapeHelper.DrawImageCube(
      'https://pixy.org/src/21/219269.jpg',
      new Vector2(2, 2),
    );
    const imageCube2 = baseChapeHelper.DrawImageCube(
      'https://pixy.org/src/21/219269.jpg',
      new Vector2(2, 2),
    );
    const imageCube3 = baseChapeHelper.DrawImageCube(
      'https://pixy.org/src/21/219269.jpg',
      new Vector2(2, 2),
    );
    const imageCube4 = baseChapeHelper.DrawImageCube(
      'https://pixy.org/src/21/219269.jpg',
      new Vector2(2, 2),
    );
    const line6 = baseLineHelper.DrawLineL2({
      x: imageCube4.position.x,
      y: imageCube4.position.y,
    } as Vector2);

    chapeHelper.SetImageAtEndOfLine(line1, imageCube);
    chapeHelper.SetImageAtEndOfLine(line2, imageCube1);
    // console.log((imageCube as BufferGeometry).attribute.position);

    chapeHelper.SetImageAtEndOfLine(line4, imageCube3);
    chapeHelper.SetImageAtEndOfLine(line5, imageCube4);

    // chapeHelper.scaleBoxImage(imageCube2, new Vector3(1.5, 1.5, 1));
    chapeHelper.SetImageAtEndOfLine(line3, imageCube2);

    // Get the position of a box
    console.log(chapeHelper.GetBoxparams(imageCube));
    console.log(imageCube.position);

    // Creating text in the viewport
    const loader = new FontLoader();
    const geometry = new BoxBufferGeometry(10, 10, 0);
    const material = new MeshBasicMaterial({
      color: 0xffffff,
    });
    const m = new Mesh(geometry, material);

    loader.load(
      'three/examples/fonts/helvetiker_regular.typeface.json',
      function (font: any) {
        const geometry = new TextGeometry('Relations', {
          font: font,
          size: 1,
          height: 2,
          curveSegments: 12,
          bevelEnabled: false,
          bevelThickness: 1,
          bevelSize: 0.1,
          bevelSegments: 0.1,
        });
        const txt_mat = new MeshBasicMaterial({ color: 0x000000 });
        const txt_mesh = new Mesh(geometry, txt_mat);
        txt_mesh.position.y = 5;
        txt_mesh.position.z = 0.1;
        m.position.z = 0.1;
        m.add(txt_mesh);
      },
    );

    /**
     * Example for loading text
     */
    //     var loader = new THREE.FontLoader();
    // loader.load('js/examples/fonts/helvetiker_regular.typeface.json',function(font){
    // var geometry = new THREE.TextGeometry( 'Mon', {
    //         font: font,
    //         size: 1,
    //         height: 0.5,
    //         curveSegments: 12,
    //         bevelEnabled: false,
    //         bevelThickness: 0.1,
    //         bevelSize: 0.1,
    //         bevelSegments: 0.1
    //     } );
    //     var txt_mat = new THREE.MeshPhongMaterial({color:0xffffff});
    //     var txt_mesh = new THREE.Mesh(geometry, txt_mat);
    //     txt_mesh.position.z = 0.2;
    //     txt_mesh.position.y = 5;
    //     txt_mesh.rotation.y = -Math.PI/8;
    //     flag.add(txt_mesh);

    // creating a group of objects
    const groups: Array<Group> = [];
    threeHelper.CreateGroup(
      [
        outerCircle,
        circle,
        line1,
        line2,
        line3,
        line4,
        line5,
        circle2,
        circle3,
        circle4,
        circle5,
        imageCube,
        imageCube1,
        imageCube2,
        imageCube3,
        imageCube4,
      ],
      groups,
    );

    return groups;
  };
  return { BaseStoryCircle };
};

export default usePredefined;
