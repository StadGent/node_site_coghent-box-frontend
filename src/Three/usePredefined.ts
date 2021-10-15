import {
  Mesh,
  CircleGeometry,
  MeshBasicMaterial,
  Line,
  BufferGeometry,
  LineBasicMaterial,
  BoxGeometry,
  Vector2,
} from 'three';
import useBaseChapes from './useBaseChapes';
import useBaseLines from './useBaseLines';
import useChapeHelpers from './useChapeHelpers';

const usePredefined = (): {
  BaseStoryCircle: () => (
    | Mesh<CircleGeometry, MeshBasicMaterial>
    | Line<BufferGeometry, LineBasicMaterial>
    | Mesh<BoxGeometry, MeshBasicMaterial>
  )[];
} => {
  const baseChapeHelper = useBaseChapes();
  const baseLineHelper = useBaseLines();
  const chapeHelper = useChapeHelpers();

  const BaseStoryCircle = () => {
    const circle = baseChapeHelper.DrawCircle(2, 0x02a77f);
    const outerCircle = baseChapeHelper.DrawOuterCircle(2.5, 0x02a77f);
    const positions = chapeHelper.GetCirclePointsForCircle();
    const line1 = baseLineHelper.DrawLineR1(positions[0]);
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

    chapeHelper.SetImageAtEndOfLine(line1, imageCube);
    chapeHelper.SetImageAtEndOfLine(line2, imageCube1);
    chapeHelper.SetImageAtEndOfLine(line3, imageCube2);
    chapeHelper.SetImageAtEndOfLine(line4, imageCube3);
    chapeHelper.SetImageAtEndOfLine(line5, imageCube4);
    return [
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
      circle6,
      imageCube,
      imageCube1,
      imageCube2,
      imageCube3,
      imageCube4,
    ];
  };
  return { BaseStoryCircle };
};

export default usePredefined;
